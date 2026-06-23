/**
 * SmartAgeGateScreen.tsx
 * ──────────────────────────────────────────────────────────────────
 * Poly-Puff — Global Smart Age Gate
 *
 * Implements region-aware age thresholds derived from:
 *   • COPPA (USA): 13+
 *   • GDPR Art. 8 (EU): 16+  (Member States may lower to 13, but 16 is default)
 *   • Egypt PDPL Regulations (Decree 816/2025): 15+ (guardian consent <15)
 *   • POPIA (South Africa): 18 ("child" = under 18)
 *   • SDAIA (Saudi Arabia): 18
 *   • India DPDP Act 2023: 18
 *   • Brazil LGPD Art.14: parental consent for children (under 12 = child; 12-17 = adolescent)
 *   • Vietnam Decree 13/2023: 16+ (derived from PDPD)
 *   • UAE AI Act 2026: 18
 *   • UK Children's Code / OSA: 13+
 *   • Canada Bill C-27 (pending): 13+
 *
 * Uses a neutral Birth Year picker (no "I am 18" shortcut) per
 * Google Families Policy for neutral age screens.
 *
 * WHERE TO PUT THIS FILE:
 *   translation-trainer-frontend/app/screens/SmartAgeGateScreen.tsx
 *   (and wire into _layout.tsx BEFORE the existing LegalGateController)
 * ──────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// ─── Region → Age Threshold Map ────────────────────────────────
// Source of truth for each jurisdiction's digital consent age

interface RegionRule {
  label: string;
  minAge: number;       // Minimum age for independent consent
  parentalGateBelow: number; // Below this → parental math challenge
  regulation: string;   // Citation for transparency
}

const REGION_RULES: Record<string, RegionRule> = {
  // 13+ Regions
  US:  { label: 'United States',   minAge: 13, parentalGateBelow: 13, regulation: 'COPPA (15 USC §6501)' },
  UK:  { label: 'United Kingdom',  minAge: 13, parentalGateBelow: 13, regulation: 'UK Children\'s Code / Age-Appropriate Design Code' },
  CA:  { label: 'Canada',          minAge: 13, parentalGateBelow: 13, regulation: 'PIPEDA / Bill C-27' },
  AU:  { label: 'Australia',       minAge: 13, parentalGateBelow: 13, regulation: 'Privacy Act 1988 (Cth)' },
  JP:  { label: 'Japan',           minAge: 13, parentalGateBelow: 13, regulation: 'APPI' },

  // 15+ Regions
  EG:  { label: 'Egypt',           minAge: 15, parentalGateBelow: 15, regulation: 'PDPL No.151/2020 + Decree 816/2025 Regulations' },

  // 16+ Regions  (GDPR default — individual EU countries may vary but 16 is safest)
  EU:  { label: 'European Union',  minAge: 16, parentalGateBelow: 16, regulation: 'GDPR Art.8(1)' },
  DE:  { label: 'Germany',         minAge: 16, parentalGateBelow: 16, regulation: 'GDPR Art.8 / BDSG' },
  FR:  { label: 'France',          minAge: 15, parentalGateBelow: 15, regulation: 'GDPR Art.8 / Loi Informatique' },
  NL:  { label: 'Netherlands',     minAge: 16, parentalGateBelow: 16, regulation: 'GDPR Art.8 / UAVG' },
  VN:  { label: 'Vietnam',         minAge: 16, parentalGateBelow: 16, regulation: 'Decree 13/2023/ND-CP (PDPD)' },

  // 18+ Regions
  ZA:  { label: 'South Africa',    minAge: 18, parentalGateBelow: 18, regulation: 'POPIA §1 "child" definition' },
  SA:  { label: 'Saudi Arabia',    minAge: 18, parentalGateBelow: 18, regulation: 'SDAIA Personal Data Protection Law' },
  AE:  { label: 'UAE',             minAge: 18, parentalGateBelow: 18, regulation: 'Dubai AI Act 2026 / Federal PDPL' },
  IN:  { label: 'India',           minAge: 18, parentalGateBelow: 18, regulation: 'DPDP Act 2023 §9' },

  // 12+ with parental consent for children (Brazil)
  BR:  { label: 'Brazil',          minAge: 12, parentalGateBelow: 12, regulation: 'LGPD Art.14 §1' },

  // Fallback
  OTHER: { label: 'Other',         minAge: 16, parentalGateBelow: 16, regulation: 'Global default (GDPR baseline)' },
};

// ─── Math Challenge Generator ──────────────────────────────────
// Per Google Families Policy: a "knowledge-based" parental gate
// that a young child cannot easily solve but a parent can.
function generateMathChallenge(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 30) + 10; // 10–39
  const b = Math.floor(Math.random() * 20) + 5;  // 5–24
  const ops = ['+', '×'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  if (op === '+') return { question: `${a} + ${b}`, answer: a + b };
  return { question: `${a} × ${b}`, answer: a * b };
}

// ─── Constants ─────────────────────────────────────────────────
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
const STORAGE_KEY_AGE_VERIFIED = 'ageGateVerified';
const STORAGE_KEY_AGE_REGION = 'ageGateRegion';
const STORAGE_KEY_IS_MINOR = 'userIsMinor';
const STORAGE_KEY_PARENTAL_CONSENT = 'parentalConsentGiven';

// ─── Component ─────────────────────────────────────────────────
export default function SmartAgeGateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Step tracking
  const [step, setStep] = useState<'region' | 'birth_year' | 'parental_gate' | 'blocked'>('region');
  const [selectedRegion, setSelectedRegion] = useState<string>('OTHER');
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR - 20);
  const [challenge, setChallenge] = useState(generateMathChallenge);
  const [challengeAnswer, setChallengeAnswer] = useState('');

  // [M2 FIX] Brute-force protection: 3 attempts then 30s cooldown
  const [attempts, setAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const MAX_ATTEMPTS = 3;
  const COOLDOWN_MS = 30 * 1000; // 30 seconds

  const regionRule = useMemo(() => REGION_RULES[selectedRegion] || REGION_RULES.OTHER, [selectedRegion]);

  const userAge = useMemo(() => CURRENT_YEAR - selectedYear, [selectedYear]);

  // ── Region Selection ───────────────────────────────
  const handleRegionConfirm = useCallback(() => {
    setStep('birth_year');
  }, []);

  // ── Birth Year Confirmation ────────────────────────
  const handleBirthYearConfirm = useCallback(async () => {
    const age = CURRENT_YEAR - selectedYear;

    if (age < regionRule.parentalGateBelow) {
      // Below threshold → trigger parental math challenge
      setChallenge(generateMathChallenge());
      setChallengeAnswer('');
      setStep('parental_gate');
      return;
    }

    // Old enough for independent consent
    await AsyncStorage.multiSet([
      [STORAGE_KEY_AGE_VERIFIED, 'true'],
      [STORAGE_KEY_AGE_REGION, selectedRegion],
      [STORAGE_KEY_IS_MINOR, age < 18 ? 'true' : 'false'],
    ]);

    // Grey zone (13–17 globally): auto-disable data sharing & public profile
    if (age >= regionRule.minAge && age < 18) {
      await AsyncStorage.setItem('dataShareDisabled', 'true');
      await AsyncStorage.setItem('publicProfileDisabled', 'true');
    }

    router.replace('/terms'); // Proceed to Terms & Conditions
  }, [selectedYear, selectedRegion, regionRule, router]);

  // ── Parental Gate: Math Challenge ──────────────────
  const handleParentalAnswer = useCallback(async () => {
    // [M2 FIX] Check cooldown
    const now = Date.now();
    if (now < cooldownUntil) {
      const secondsLeft = Math.ceil((cooldownUntil - now) / 1000);
      Alert.alert(
        'Too Many Attempts',
        `Please wait ${secondsLeft} seconds before trying again.`,
      );
      return;
    }

    const numericAnswer = parseInt(challengeAnswer, 10);
    if (numericAnswer !== challenge.answer) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        // [M2 FIX] Lock out for 30 seconds after 3 wrong answers
        setCooldownUntil(Date.now() + COOLDOWN_MS);
        setAttempts(0);
        Alert.alert(
          'Too Many Attempts',
          'Please wait 30 seconds, then ask a parent or guardian to help.',
          [{ text: 'OK', onPress: () => {
            setChallenge(generateMathChallenge());
            setChallengeAnswer('');
          }}]
        );
      } else {
        Alert.alert(
          'Incorrect',
          `Please ask a parent or guardian to help. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`,
          [{ text: 'Try Again', onPress: () => {
            setChallenge(generateMathChallenge());
            setChallengeAnswer('');
          }}]
        );
      }
      return;
    }

    // Parent solved → record parental consent given
    setAttempts(0);
    await AsyncStorage.multiSet([
      [STORAGE_KEY_AGE_VERIFIED, 'true'],
      [STORAGE_KEY_AGE_REGION, selectedRegion],
      [STORAGE_KEY_IS_MINOR, 'true'],
      [STORAGE_KEY_PARENTAL_CONSENT, 'true'],
      ['dataShareDisabled', 'true'],
      ['publicProfileDisabled', 'true'],
    ]);

    router.replace('/terms');
  }, [challengeAnswer, challenge, selectedRegion, router, attempts, cooldownUntil]);

  // ─── Render ─────────────────────────────────────────

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      accessibilityRole="main"
      accessibilityLabel="Age verification screen"
    >
      {/* App branding */}
      <View style={styles.brandRow} accessibilityRole="header">
        <Image
          source={require('../assets/polypuff-transparent.png')}
          style={styles.brandMascot}
          accessibilityIgnoresInvertColors
        />
        <Text style={styles.logo}>Poly-Puff</Text>
      </View>

      {/* ── STEP 1: Region Selection ──────────────── */}
      {step === 'region' && (
        <View accessibilityLabel="Select your region">
          <Text style={styles.title}>Where are you located?</Text>
          <Text style={styles.subtitle}>
            This helps us apply the correct privacy protections for your region.
          </Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedRegion}
              onValueChange={setSelectedRegion}
              style={styles.picker}
              dropdownIconColor="#7DD3FC"
              accessibilityLabel="Region picker"
            >
              {Object.entries(REGION_RULES)
                .sort((a, b) => a[1].label.localeCompare(b[1].label))
                .map(([code, rule]) => (
                  <Picker.Item key={code} label={rule.label} value={code} color="#E2E8F0" />
                ))}
            </Picker>
          </View>

          <Text style={styles.regulationNote}>
            Governed by: {regionRule.regulation}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegionConfirm}
            accessibilityRole="button"
            accessibilityLabel="Continue to birth year selection"
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── STEP 2: Birth Year (Neutral) ─────────── */}
      {step === 'birth_year' && (
        <View accessibilityLabel="Select your birth year">
          <Text style={styles.title}>What year were you born?</Text>
          <Text style={styles.subtitle}>
            We use this to personalize your experience and ensure your safety.
          </Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(v) => setSelectedYear(Number(v))}
              style={styles.picker}
              dropdownIconColor="#7DD3FC"
              accessibilityLabel="Birth year picker"
            >
              {YEARS.map((year) => (
                <Picker.Item key={year} label={String(year)} value={year} color="#E2E8F0" />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleBirthYearConfirm}
            accessibilityRole="button"
            accessibilityLabel={`Confirm birth year ${selectedYear}`}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setStep('region')}
            accessibilityRole="button"
            accessibilityLabel="Go back to region selection"
          >
            <Text style={styles.secondaryText}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── STEP 3: Parental Math Gate ───────────── */}
      {step === 'parental_gate' && (
        <View accessibilityLabel="Parental verification challenge">
          <Text style={styles.title}>🧮 Parent Check</Text>
          <Text style={styles.subtitle}>
            Because you are under {regionRule.parentalGateBelow} in {regionRule.label},{'\n'}
            a parent or guardian must verify your access.
          </Text>
          <Text style={styles.subtitle}>
            Please ask a parent to solve:
          </Text>

          <View style={styles.challengeCard}>
            <Text style={styles.challengeText}>{challenge.question} = ?</Text>
          </View>

          {/* 
            Using a simple text input for the math answer.
            We use a basic TextInput here; import from react-native.
          */}
          <TextInputField
            value={challengeAnswer}
            onChangeText={setChallengeAnswer}
            placeholder="Enter the answer"
            keyboardType="number-pad"
            accessibilityLabel="Math challenge answer"
          />

          <TouchableOpacity
            style={[styles.primaryButton, !challengeAnswer && styles.disabledButton]}
            onPress={handleParentalAnswer}
            disabled={!challengeAnswer}
            accessibilityRole="button"
            accessibilityLabel="Submit parental verification answer"
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setStep('birth_year')}
            accessibilityRole="button"
            accessibilityLabel="Go back to birth year"
          >
            <Text style={styles.secondaryText}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Simple TextInput Wrapper ──────────────────────────────────
// (Kept inline to reduce file count; move to components/ if preferred)
import { TextInput } from 'react-native';

function TextInputField({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  accessibilityLabel,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: 'number-pad' | 'default';
  accessibilityLabel: string;
}) {
  return (
    <TextInput
      style={styles.textInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#64748B"
      keyboardType={keyboardType || 'default'}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

// ─── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark mode
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  brandMascot: { width: 56, height: 56, resizeMode: 'contain' },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#7DD3FC',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F1F5F9',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  pickerContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    color: '#E2E8F0',
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  regulationNote: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  primaryButton: {
    backgroundColor: '#7DD3FC',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 16,
    padding: 12,
  },
  secondaryText: {
    color: '#7DD3FC',
    fontSize: 14,
  },
  challengeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#7DD3FC',
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F1F5F9',
    fontVariant: ['tabular-nums'],
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F1F5F9',
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
    textAlign: 'center',
    marginBottom: 8,
  },
});
