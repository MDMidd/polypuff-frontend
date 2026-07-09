/**
 * AgeGateScreen.tsx — v2.0 (Conditional Age Gate)
 * ==========================================
 * FIRST LAUNCH ONLY — Neutral Age Verification with Regional Thresholds
 * 
 * Compliance: COPPA, GDPR Art.8, POPIA, Egypt PDPL, Saudi PDPL, Brazil LGPD
 * Google Play 2026 Families Policy: neutral age screen
 * 
 * CONDITIONAL AGE GATE LOGIC:
 *  1. Ask Birth Year first (neutral — no "I am over 13" shortcuts)
 *  2. Ask Region (to apply correct threshold)
 *  3. Under hard-stop threshold → Parental Consent required
 *  4. 13-18 "Grey Zone" → Register but auto-disable data sharing/public profiles
 *  5. Over threshold → Standard registration
 * 
 * REGIONAL THRESHOLDS (from project documents):
 *  - USA/Global default: 13 (COPPA)
 *  - Egypt (PDPL): Under 15 = guardian consent required; 15-18 = child or guardian
 *  - EU/EEA (GDPR Art.8): 16 (strictest interpretation)
 *  - Vietnam (PDPD): 16
 *  - South Africa (POPIA): 18 (child = under 18)
 *  - Saudi Arabia (SDAIA/PDPL): 18
 *  - Brazil (LGPD Art.14): Children need parental consent (under 12 = child; 12-18 = adolescent)
 *  - India (DPDP Act 2023): 18
 * 
 * Stored: AsyncStorage 'ageVerified', 'userAgeGroup', 'userBirthYear', 'userRegion'
 * 
 * FILE LOCATION: screens/AgeGateScreen.tsx
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, Baby, User, CheckCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { getAgeGateCopy, ageGateText } from '../utils/ageGateTranslations';
import { isRtlLanguage } from '../utils/languages';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── Poly-Puff Dark Theme ───
const C = {
  bg:         '#0A0E1A',
  card:       '#121829',
  cardAlt:    '#1A2137',
  text:       '#F0F4FF',
  textSec:    '#8B95B0',
  textMuted:  '#5A6380',
  border:     '#2A3352',
  cyan:       '#00E5FF',
  cyanDark:   '#003D47',
  purple:     '#B06CFF',
  purpleDark: '#2D1854',
  emerald:    '#00E5A0',
  amber:      '#FFBE0B',
  red:        '#FF4D6A',
  pink:       '#FF6EB4',
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [];
for (let y = CURRENT_YEAR; y >= 1930; y--) YEARS.push(y);

// ─── Regional thresholds ───
// hardStop = must have parental consent below this age
// greyZone = 13 to hardStop-1 (auto-disable data sharing, allow registration)
const REGIONS = [
  { id: 'global',  label: 'Other / Global',      flag: '🌍', hardStop: 13 },
  { id: 'usa',     label: 'United States',        flag: '🇺🇸', hardStop: 13 },
  { id: 'eu',      label: 'European Union / EEA', flag: '🇪🇺', hardStop: 16 },
  { id: 'uk',      label: 'United Kingdom',       flag: '🇬🇧', hardStop: 13 },
  { id: 'egypt',   label: 'Egypt',                flag: '🇪🇬', hardStop: 15 },
  { id: 'sa',      label: 'South Africa',         flag: '🇿🇦', hardStop: 18 },
  { id: 'saudi',   label: 'Saudi Arabia',         flag: '🇸🇦', hardStop: 18 },
  { id: 'uae',     label: 'United Arab Emirates', flag: '🇦🇪', hardStop: 18 },
  { id: 'brazil',  label: 'Brazil',               flag: '🇧🇷', hardStop: 12 },
  { id: 'india',   label: 'India',                flag: '🇮🇳', hardStop: 18 },
  { id: 'china',   label: 'China',                flag: '🇨🇳', hardStop: 14 },
  { id: 'vietnam', label: 'Vietnam',              flag: '🇻🇳', hardStop: 16 },
  { id: 'canada',  label: 'Canada',               flag: '🇨🇦', hardStop: 13 },
  { id: 'korea',   label: 'South Korea',          flag: '🇰🇷', hardStop: 14 },
  { id: 'japan',   label: 'Japan',                flag: '🇯🇵', hardStop: 16 },
  { id: 'turkey',  label: 'Turkey',               flag: '🇹🇷', hardStop: 18 },
  { id: 'russia',  label: 'Russia',               flag: '🇷🇺', hardStop: 14 },
  { id: 'thailand',label: 'Thailand',             flag: '🇹🇭', hardStop: 10 },
  { id: 'indonesia',label: 'Indonesia',           flag: '🇮🇩', hardStop: 17 },
];

export default function AgeGateScreen({ onComplete }) {
  const insets = useSafeAreaInsets();
  const { lang } = useLanguage();
  const copy = getAgeGateCopy(lang);
  const isRTL = isRtlLanguage(lang);
  const [step, setStep] = useState(1); // 1 = region, 2 = year
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [error, setError] = useState('');

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // ─── Determine age group based on region ───
  const getAgeGroup = (year, region) => {
    const age = CURRENT_YEAR - year;
    const threshold = region?.hardStop || 13;

    if (age < threshold) return 'child';         // Hard stop — parental consent required
    if (age < 18) return 'grey_zone';            // 13-17 — register but restrict data sharing
    return 'adult';                               // 18+ — full access
  };

  // ─── Handle region selection ───
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setError('');
  };

  const handleRegionContinue = () => {
    if (!selectedRegion) {
      setError(copy.selectRegionError);
      return;
    }
    setStep(2);
    setError('');
  };

  // ─── Returning user shortcut ───
  // Region/birth year are only ever stored locally (never sent to the
  // backend), so a device that already holds an account has no way to know
  // its real age group here. Default to 'adult' — the actual minor-safety
  // enforcement (is_minor) lives server-side regardless of this guess.
  // Terms is intentionally NOT skipped: it's the only place that records
  // consent for this install, and the backend keeps no record of its own.
  const handleLoginInstead = async () => {
    try {
      await AsyncStorage.setItem('ageVerified', 'true');
      await AsyncStorage.setItem('userAgeGroup', 'adult');
    } catch (e) {
      console.error('AgeGate storage error:', e);
    }
    onComplete('terms', 'adult');
  };

  // ─── Handle final submit ───
  const handleSubmit = async () => {
    if (!selectedYear) {
      setError(copy.selectYearError);
      return;
    }

    const ageGroup = getAgeGroup(selectedYear, selectedRegion);

    try {
      await AsyncStorage.setItem('ageVerified', 'true');
      await AsyncStorage.setItem('userAgeGroup', ageGroup);
      await AsyncStorage.setItem('userBirthYear', String(selectedYear));
      await AsyncStorage.setItem('userRegion', selectedRegion.id);
      await AsyncStorage.setItem('userRegionHardStop', String(selectedRegion.hardStop));

      // Grey zone: auto-disable data sharing
      if (ageGroup === 'grey_zone') {
        await AsyncStorage.setItem('dataSharingEnabled', 'false');
        await AsyncStorage.setItem('publicProfileEnabled', 'false');
      }

      if (ageGroup === 'child') {
        onComplete('parental_consent', ageGroup);
      } else {
        // grey_zone and adult → straight to terms
        onComplete('terms', ageGroup);
      }
    } catch (e) {
      console.error('AgeGate storage error:', e);
    }
  };

  const regionLabel = (region) => region ? (copy.regions[region.id] || region.label) : '';
  const selectedRegionLabel = regionLabel(selectedRegion);
  const selectedAge = selectedYear ? CURRENT_YEAR - selectedYear : '';
  const textDirectionStyle = isRTL ? { textAlign: 'right', writingDirection: 'rtl' } : null;
  const rowDirectionStyle = isRTL ? { flexDirection: 'row-reverse' } : null;
  const edgeAlignStyle = isRTL ? { alignSelf: 'flex-end' } : null;

  return (
    <View style={s.container}>
      <View style={s.bgGlow} />

      <ScrollView
        contentContainerStyle={[s.scrollContent, { paddingTop: 20 + insets.top }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[s.content, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}
        >
          <View style={s.languageRow}>
            <LanguageSelector style={s.languageSelector} />
          </View>

          {/* ── Mascot ── */}
          <View style={s.mascotWrap}>
            <Image
              source={require('../assets/polypuff-transparent.png')}
              style={s.mascotImage}
              accessibilityIgnoresInvertColors
            />
          </View>

          <Text style={[s.title, textDirectionStyle]}>{copy.title}</Text>
          <Text style={[s.subtitle, textDirectionStyle]}>
            {step === 1
              ? copy.regionSubtitle
              : `${copy.birthYearSubtitle}${selectedRegion?.hardStop > 13 ? `\n${ageGateText(copy.consentNote, { region: selectedRegionLabel, age: selectedRegion.hardStop })}` : ''}`
            }
          </Text>

          {/* ── Privacy badge ── */}
          <View style={[s.infoBadge, rowDirectionStyle]}>
            <View style={[s.infoBadgeIcon, isRTL && s.infoBadgeIconRtl]}>
              <Lock size={16} color={C.cyan} />
            </View>
            <Text style={[s.infoBadgeText, textDirectionStyle]}>
              {copy.privacyNotice}
            </Text>
          </View>

          {/* ═══ STEP 1: REGION ═══ */}
          {step === 1 && (
            <>
              <Text style={[s.label, textDirectionStyle, edgeAlignStyle]}>{copy.regionLabel}</Text>
              <View style={s.regionGrid}>
                {REGIONS.map((region) => (
                  <TouchableOpacity
                    key={region.id}
                    style={[
                      s.regionItem,
                      selectedRegion?.id === region.id && s.regionItemSelected,
                      rowDirectionStyle,
                    ]}
                    onPress={() => handleRegionSelect(region)}
                    activeOpacity={0.7}
                    accessible
                    accessibilityRole="radio"
                    accessibilityLabel={`Select country or region: ${regionLabel(region)}`}
                    accessibilityState={{ selected: selectedRegion?.id === region.id }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={s.regionFlag}>{region.flag}</Text>
                    <Text
                      style={[
                        s.regionLabel,
                        selectedRegion?.id === region.id && s.regionLabelSelected,
                        textDirectionStyle,
                      ]}
                      numberOfLines={1}
                    >
                      {regionLabel(region)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {error ? <Text style={s.errorText} accessibilityLiveRegion="polite" accessibilityRole="alert">{error}</Text> : null}

              <TouchableOpacity
                style={[s.continueBtn, !selectedRegion && s.continueBtnDisabled]}
                onPress={handleRegionContinue}
                activeOpacity={0.8}
                disabled={!selectedRegion}
                accessible
                accessibilityRole="button"
                accessibilityLabel={copy.continue}
                accessibilityHint="Continues to the birth year step"
                accessibilityState={{ disabled: !selectedRegion }}
              >
                <Text style={[s.continueBtnText, !selectedRegion && s.continueBtnTextDisabled]}>
                  {copy.continue}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.loginLink}
                onPress={handleLoginInstead}
                accessible
                accessibilityRole="button"
                accessibilityLabel={copy.loginInstead}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[s.loginLinkText, textDirectionStyle]}>{copy.loginInstead}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ═══ STEP 2: YEAR OF BIRTH ═══ */}
          {step === 2 && (
            <>
              {/* Region badge */}
              <TouchableOpacity
                style={[s.regionBadge, rowDirectionStyle, edgeAlignStyle]}
                onPress={() => { setStep(1); setError(''); }}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Selected region: ${selectedRegionLabel}. ${copy.change}`}
                accessibilityHint="Returns to the region selection step"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[s.regionBadgeText, textDirectionStyle]}>
                  {selectedRegion.flag} {selectedRegionLabel}
                </Text>
                <Text style={[s.regionBadgeChange, textDirectionStyle]}>{copy.change}</Text>
              </TouchableOpacity>

              <Text style={[s.label, textDirectionStyle, edgeAlignStyle]}>{copy.yearLabel}</Text>

              <TouchableOpacity
                style={[s.pickerButton, selectedYear && s.pickerButtonSelected, rowDirectionStyle]}
                onPress={() => { setShowYearPicker(!showYearPicker); setError(''); }}
                activeOpacity={0.7}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Year of birth: ${selectedYear ? String(selectedYear) : copy.yearPlaceholder}`}
                accessibilityHint={showYearPicker ? 'Collapses the year of birth picker' : 'Opens a list of years to choose your year of birth'}
                accessibilityState={{ expanded: showYearPicker }}
              >
                <Text style={[s.pickerButtonText, textDirectionStyle, selectedYear && s.pickerButtonTextSelected]}>
                  {selectedYear ? String(selectedYear) : copy.yearPlaceholder}
                </Text>
                <Text style={s.pickerArrow}>{showYearPicker ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {showYearPicker && (
                <View
                  style={s.yearListWrap}
                  accessibilityRole="radiogroup"
                  accessibilityLabel="Year of birth"
                >
                  <ScrollView
                    style={s.yearList}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={true}
                    indicatorStyle="white"
                  >
                    {YEARS.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[s.yearItem, selectedYear === year && s.yearItemSelected]}
                        onPress={() => { setSelectedYear(year); setShowYearPicker(false); setError(''); }}
                        accessible
                        accessibilityRole="radio"
                        accessibilityLabel={`Year ${year}`}
                        accessibilityState={{ selected: selectedYear === year }}
                      >
                        <Text style={[s.yearItemText, selectedYear === year && s.yearItemTextSelected]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Age indicator */}
              {selectedYear && (
                <View style={[
                  s.ageIndicator,
                  {
                    borderColor: getAgeGroup(selectedYear, selectedRegion) === 'child' ? C.red + '40'
                      : getAgeGroup(selectedYear, selectedRegion) === 'grey_zone' ? C.amber + '40'
                      : C.emerald + '40',
                    backgroundColor: getAgeGroup(selectedYear, selectedRegion) === 'child' ? C.red + '10'
                      : getAgeGroup(selectedYear, selectedRegion) === 'grey_zone' ? C.amber + '10'
                      : C.emerald + '10',
                  }
                ]}>
                  <View style={[s.ageIndicatorRow, rowDirectionStyle]}>
                    {getAgeGroup(selectedYear, selectedRegion) === 'child' ? (
                      <Baby size={16} color={C.red} />
                    ) : getAgeGroup(selectedYear, selectedRegion) === 'grey_zone' ? (
                      <User size={16} color={C.amber} />
                    ) : (
                      <CheckCircle size={16} color={C.emerald} />
                    )}
                    <Text style={[s.ageIndicatorText, {
                      color: getAgeGroup(selectedYear, selectedRegion) === 'child' ? C.red
                        : getAgeGroup(selectedYear, selectedRegion) === 'grey_zone' ? C.amber
                        : C.emerald,
                    }, textDirectionStyle]}>
                      {getAgeGroup(selectedYear, selectedRegion) === 'child'
                        ? ageGateText(copy.childIndicator, { age: selectedAge, region: selectedRegionLabel })
                        : getAgeGroup(selectedYear, selectedRegion) === 'grey_zone'
                          ? ageGateText(copy.greyIndicator, { age: selectedAge, region: selectedRegionLabel })
                          : ageGateText(copy.adultIndicator, { age: selectedAge, region: selectedRegionLabel })
                      }
                    </Text>
                  </View>
                </View>
              )}

              {error ? <Text style={s.errorText} accessibilityLiveRegion="polite" accessibilityRole="alert">{error}</Text> : null}

              <TouchableOpacity
                style={[s.continueBtn, !selectedYear && s.continueBtnDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={!selectedYear}
                accessible
                accessibilityRole="button"
                accessibilityLabel={copy.continue}
                accessibilityHint="Confirms your year of birth and continues"
                accessibilityState={{ disabled: !selectedYear }}
              >
                <Text style={[s.continueBtnText, !selectedYear && s.continueBtnTextDisabled]}>
                  {copy.continue}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── Footer ── */}
          <Text style={[s.footerText, textDirectionStyle]}>
            {copy.footer}
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  bgGlow: { position: 'absolute', top: -SH * 0.2, left: -SW * 0.3, width: SW * 1.6, height: SH * 0.6, borderRadius: SW, backgroundColor: C.cyanDark, opacity: 0.15 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, paddingBottom: 40 },
  content: { width: '100%', maxWidth: 440, backgroundColor: C.card + 'DD', borderRadius: 24, borderWidth: 1, borderColor: C.border, padding: 24, alignItems: 'center', shadowColor: C.cyan, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.08, shadowRadius: 30, elevation: 8 },
  languageRow: { width: '100%', alignItems: 'flex-end', marginBottom: 6 },
  languageSelector: { minWidth: 82, height: 38, borderRadius: 12 },
  mascotWrap: { marginBottom: 12, alignItems: 'center' },
  mascotImage: { width: 96, height: 96, resizeMode: 'contain' },
  title: { fontSize: 24, fontWeight: '700', color: C.text, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: C.textSec, textAlign: 'center', lineHeight: 21, marginBottom: 16, paddingHorizontal: 4 },
  infoBadge: { flexDirection: 'row', backgroundColor: C.cyanDark + '30', borderRadius: 12, borderWidth: 1, borderColor: C.cyan + '20', padding: 12, marginBottom: 20, alignItems: 'flex-start' },
  infoBadgeIcon: { marginRight: 10, marginTop: 1 },
  infoBadgeIconRtl: { marginRight: 0, marginLeft: 10 },
  infoBadgeText: { flex: 1, fontSize: 12, color: C.cyan, lineHeight: 18, opacity: 0.85 },
  label: { fontSize: 12, fontWeight: '700', color: C.textMuted, alignSelf: 'flex-start', marginBottom: 10, letterSpacing: 1 },
  // ── Region grid ──
  regionGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  regionItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg, minWidth: '47%', flex: 1 },
  regionItemSelected: { borderColor: C.cyan + '60', backgroundColor: C.cyanDark + '20' },
  regionFlag: { fontSize: 18 },
  regionLabel: { fontSize: 12, color: C.textSec, fontWeight: '500', flex: 1 },
  regionLabelSelected: { color: C.text, fontWeight: '600' },
  // ── Region badge (step 2) ──
  regionBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.cyanDark + '20', borderRadius: 10, borderWidth: 1, borderColor: C.cyan + '20', paddingVertical: 8, paddingHorizontal: 14, marginBottom: 16, alignSelf: 'flex-start', gap: 8 },
  regionBadgeText: { fontSize: 13, color: C.text, fontWeight: '500' },
  regionBadgeChange: { fontSize: 11, color: C.cyan, fontWeight: '600' },
  // ── Year picker ──
  pickerButton: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.bg, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, paddingVertical: 16, paddingHorizontal: 18, marginBottom: 4 },
  pickerButtonSelected: { borderColor: C.cyan + '60', backgroundColor: C.cyanDark + '15' },
  pickerButtonText: { flex: 1, fontSize: 16, color: C.textMuted },
  pickerButtonTextSelected: { color: C.text, fontWeight: '600' },
  pickerArrow: { fontSize: 12, color: C.textMuted },
  yearListWrap: { width: '100%', maxHeight: 180, backgroundColor: C.bg, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginTop: 4, marginBottom: 8, overflow: 'hidden' },
  yearList: { paddingVertical: 4 },
  yearItem: { paddingVertical: 11, paddingHorizontal: 18, borderBottomWidth: 0.5, borderBottomColor: C.border + '40' },
  yearItemSelected: { backgroundColor: C.cyan + '15' },
  yearItemText: { fontSize: 16, color: C.textSec, textAlign: 'center' },
  yearItemTextSelected: { color: C.cyan, fontWeight: '700' },
  // ── Age indicator ──
  ageIndicator: { width: '100%', borderRadius: 12, borderWidth: 1, padding: 12, marginTop: 8, marginBottom: 4 },
  ageIndicatorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  ageIndicatorText: { flexShrink: 1, fontSize: 13, fontWeight: '600', textAlign: 'center', lineHeight: 19 },
  // ── Error ──
  errorText: { fontSize: 13, color: C.red, marginTop: 8, marginBottom: 4, textAlign: 'center' },
  // ── Continue ──
  continueBtn: { width: '100%', backgroundColor: C.cyan, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 20, shadowColor: C.cyan, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  continueBtnDisabled: { backgroundColor: C.border, shadowOpacity: 0, elevation: 0 },
  continueBtnText: { fontSize: 17, fontWeight: '700', color: C.bg, letterSpacing: 0.5 },
  continueBtnTextDisabled: { color: C.textMuted },
  loginLink: { marginTop: 14 },
  loginLinkText: { fontSize: 13, color: C.textSec, textAlign: 'center' },
  footerText: { fontSize: 11, color: C.textMuted, textAlign: 'center', marginTop: 20, lineHeight: 16, paddingHorizontal: 4 },
});
