/**
 * ParentalConsentScreen.tsx
 * ==========================================
 * PARENTAL GATE — Math Problem Verification
 * 
 * Compliance: COPPA (under 13), GDPR Art. 8 (under 16 in EU)
 * Google Play 2026 Families Policy: neutral age gate + parental verification
 * 
 * Logic:
 *  - Shows a message explaining that a parent/guardian must approve
 *  - Generates a random math problem (e.g., "What is 14 + 8?")
 *  - Parent must solve it correctly to proceed
 *  - After solving → routes to TermsScreen with parental consent flag
 *  - Wrong answer → new problem generated, max 3 attempts then cooldown
 * 
 * Stored: AsyncStorage 'parentalConsent' = 'true'
 * 
 * FILE LOCATION: app/screens/ParentalConsentScreen.tsx
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, Users, Lock, Clipboard, PartyPopper } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../contexts/LanguageContext';
import { isRtlLanguage } from '../utils/languages';
import { getParentalConsentCopy, parentalConsentText } from '../utils/parentalConsentTranslations';
import LanguageSelector from '../components/LanguageSelector';

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

// ─── Generate a random math problem ───
function generateMathProblem() {
  const operations = [
    { symbol: '+', fn: (a, b) => a + b },
    { symbol: '−', fn: (a, b) => a - b },
    { symbol: '×', fn: (a, b) => a * b },
  ];

  const op = operations[Math.floor(Math.random() * operations.length)];

  let a, b, answer;
  if (op.symbol === '×') {
    a = Math.floor(Math.random() * 9) + 2;   // 2-10
    b = Math.floor(Math.random() * 9) + 2;   // 2-10
  } else if (op.symbol === '−') {
    a = Math.floor(Math.random() * 40) + 15;  // 15-54
    b = Math.floor(Math.random() * (a - 1)) + 1; // ensure positive result
  } else {
    a = Math.floor(Math.random() * 30) + 5;   // 5-34
    b = Math.floor(Math.random() * 30) + 5;   // 5-34
  }

  answer = op.fn(a, b);
  return {
    a,
    b,
    op: op.symbol,
    answer: answer,
  };
}

export default function ParentalConsentScreen({ ageGroup, onComplete }) {
  const insets = useSafeAreaInsets();
  const { lang } = useLanguage();
  const copy = getParentalConsentCopy(lang);
  const isRTL = isRtlLanguage(lang);
  const [problem, setProblem] = useState(generateMathProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);
  const [verified, setVerified] = useState(false);

  // Animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (!cooldown) return;
    setCooldownSec(30);
    const interval = setInterval(() => {
      setCooldownSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCooldown(false);
          setAttempts(0);
          setProblem(generateMathProblem());
          setError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // ─── Shake animation for wrong answer ───
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  // ─── Success animation ───
  const triggerSuccess = () => {
    Animated.spring(successScale, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  // ─── Handle answer submission ───
  const handleSubmit = async () => {
    const parsed = parseInt(userAnswer.trim(), 10);

    if (isNaN(parsed)) {
      setError(copy.numberError);
      triggerShake();
      return;
    }

    if (parsed === problem.answer) {
      // ✅ Correct
      setVerified(true);
      triggerSuccess();
      try {
        await AsyncStorage.setItem('parentalConsent', 'true');
        await AsyncStorage.setItem('parentalConsentDate', new Date().toISOString());
      } catch (e) {
        console.error('ParentalConsent storage error:', e);
      }

      // Brief delay to show success, then proceed
      setTimeout(() => {
        onComplete('terms', ageGroup);
      }, 1500);
    } else {
      // ❌ Wrong
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setUserAnswer('');

      if (newAttempts >= 3) {
        setCooldown(true);
        setError(copy.cooldownError);
      } else {
        setError(parentalConsentText(copy.incorrectError, { attempts: 3 - newAttempts }));
        setProblem(generateMathProblem());
      }
      triggerShake();
    }
  };

  const isChild = ageGroup === 'child';
  const textDirectionStyle = isRTL ? { textAlign: 'right', writingDirection: 'rtl' } : null;
  const centerTextDirectionStyle = isRTL ? { writingDirection: 'rtl' } : null;
  const rowDirectionStyle = isRTL ? { flexDirection: 'row-reverse' } : null;

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ── Background glow ── */}
      <View style={s.bgGlow} />

      <ScrollView
        contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            s.content,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }, { translateX: shakeAnim }],
            },
          ]}
        >
          {/* ── Language ── */}
          <View style={s.languageRow}>
            <LanguageSelector style={s.languageSelector} />
          </View>

          {/* ── Header icon ── */}
          <View style={s.iconWrap}>
            {verified ? (
              <CheckCircle size={34} color={C.emerald} />
            ) : (
              <Users size={34} color={C.purple} />
            )}
          </View>

          {/* ── Title ── */}
          <Text style={[s.title, centerTextDirectionStyle]}>
            {verified ? copy.verifiedTitle : copy.requiredTitle}
          </Text>

          {!verified ? (
            <>
              {/* ── Explanation ── */}
              <View style={s.messageCard}>
                <View style={[s.messageTitleRow, rowDirectionStyle]}>
                  <Lock size={15} color={C.amber} />
                  <Text style={[s.messageTitle, textDirectionStyle]}>
                    {isChild ? copy.under13Title : copy.under16Title}
                  </Text>
                </View>
                <Text style={[s.messageText, textDirectionStyle]}>
                  {isChild
                    ? copy.coppaMessage
                    : copy.gdprMessage
                  }
                </Text>
              </View>

              {/* ── Parent instruction ── */}
              <View style={s.parentSection}>
                <View style={[s.parentTitleRow, rowDirectionStyle]}>
                  <Clipboard size={15} color={C.text} />
                  <Text style={[s.parentTitle, textDirectionStyle]}>
                    {copy.parentTitle}
                  </Text>
                </View>
                <Text style={[s.parentText, textDirectionStyle]}>
                  {copy.parentIntro}
                </Text>
                <View style={s.bulletList}>
                  {[copy.bulletGuardian, copy.bulletConsent, copy.bulletTerms, copy.bulletLearningData].map((item) => (
                    <View key={item} style={[s.bulletRow, rowDirectionStyle]}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={[s.bulletItem, textDirectionStyle]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* ── Math Problem ── */}
              <View style={s.mathCard}>
                <Text style={[s.mathLabel, centerTextDirectionStyle]}>{copy.mathLabel}</Text>
                <Text style={[s.mathProblem, centerTextDirectionStyle]}>
                  {parentalConsentText(copy.mathQuestion, { a: problem.a, op: problem.op, b: problem.b })}
                </Text>

                <TextInput
                  style={[s.input, cooldown && s.inputDisabled]}
                  placeholder={copy.answerPlaceholder}
                  placeholderTextColor={C.textMuted}
                  keyboardType="number-pad"
                  value={userAnswer}
                  onChangeText={(t) => {
                    setUserAnswer(t);
                    setError('');
                  }}
                  editable={!cooldown}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  accessibilityLabel={`Answer to the math problem: ${problem.a} ${problem.op} ${problem.b}`}
                  accessibilityHint="Enter the numeric answer to verify you are an adult"
                />

                {/* ── Error / Cooldown ── */}
                {error ? (
                  <Text
                    style={[s.errorText, centerTextDirectionStyle]}
                    accessibilityLiveRegion="polite"
                    accessibilityRole="alert"
                  >
                    {error}
                  </Text>
                ) : null}

                {cooldown ? (
                  <View style={s.cooldownBadge} accessibilityLiveRegion="polite">
                    <Text style={[s.cooldownText, centerTextDirectionStyle]}>
                      ⏳ {parentalConsentText(copy.cooldownBadge, { seconds: cooldownSec })}
                    </Text>
                  </View>
                ) : null}

                {/* ── Submit Button ── */}
                <TouchableOpacity
                  style={[
                    s.submitBtn,
                    (cooldown || !userAnswer.trim()) && s.submitBtnDisabled,
                  ]}
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                  disabled={cooldown || !userAnswer.trim()}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={copy.verify}
                  accessibilityHint="Submits the parent verification answer"
                  accessibilityState={{ disabled: cooldown || !userAnswer.trim() }}
                >
                  <Text
                    style={[
                      s.submitBtnText,
                      (cooldown || !userAnswer.trim()) && s.submitBtnTextDisabled,
                    ]}
                  >
                    {copy.verify}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* ── Success state ── */
            <Animated.View
              style={[
                s.successCard,
                { transform: [{ scale: successScale }] },
              ]}
            >
              <View style={s.successEmoji}>
                <PartyPopper size={52} color={C.emerald} />
              </View>
              <Text style={[s.successTitle, centerTextDirectionStyle]}>{copy.successTitle}</Text>
              <Text style={[s.successText, centerTextDirectionStyle]}>
                {copy.successText}
              </Text>
            </Animated.View>
          )}

          {/* ── Legal footer ── */}
          <Text style={[s.footerText, centerTextDirectionStyle]}>
            {copy.footer}
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ═══════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  bgGlow: {
    position: 'absolute',
    top: -SH * 0.15,
    right: -SW * 0.3,
    width: SW * 1.2,
    height: SH * 0.5,
    borderRadius: SW,
    backgroundColor: C.purpleDark,
    opacity: 0.12,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: C.card + 'DD',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
    alignItems: 'center',
    shadowColor: C.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 8,
  },
  languageRow: { width: '100%', alignItems: 'flex-end', marginBottom: 6 },
  languageSelector: { minWidth: 82, height: 38, borderRadius: 12 },
  // ── Icon ──
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.purpleDark + '60',
    borderWidth: 2,
    borderColor: C.purple + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 34,
  },
  // ── Title ──
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: C.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  // ── Message card ──
  messageCard: {
    width: '100%',
    backgroundColor: C.amber + '10',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.amber + '25',
    padding: 16,
    marginBottom: 20,
  },
  messageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  messageTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.amber,
  },
  messageText: {
    fontSize: 14,
    color: C.textSec,
    lineHeight: 21,
  },
  // ── Parent section ──
  parentSection: {
    width: '100%',
    marginBottom: 20,
  },
  parentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  parentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
  },
  parentText: {
    fontSize: 14,
    color: C.textSec,
    marginBottom: 10,
  },
  bulletList: {
    paddingLeft: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 2,
  },
  bulletDot: {
    fontSize: 13,
    color: C.textSec,
    lineHeight: 22,
  },
  bulletItem: {
    flex: 1,
    fontSize: 13,
    color: C.textSec,
    lineHeight: 22,
  },
  // ── Math card ──
  mathCard: {
    width: '100%',
    backgroundColor: C.cyanDark + '20',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.cyan + '25',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  mathLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.cyan,
    letterSpacing: 1.5,
    marginBottom: 12,
    opacity: 0.8,
  },
  mathProblem: {
    fontSize: 32,
    fontWeight: '800',
    color: C.text,
    marginBottom: 20,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    backgroundColor: C.bg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 20,
    fontWeight: '600',
    color: C.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  inputDisabled: {
    opacity: 0.4,
  },
  // ── Error ──
  errorText: {
    fontSize: 13,
    color: C.red,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  // ── Cooldown ──
  cooldownBadge: {
    backgroundColor: C.red + '15',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  cooldownText: {
    fontSize: 14,
    color: C.red,
    fontWeight: '600',
    textAlign: 'center',
  },
  // ── Submit ──
  submitBtn: {
    width: '100%',
    backgroundColor: C.cyan,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: C.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnDisabled: {
    backgroundColor: C.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: C.bg,
  },
  submitBtnTextDisabled: {
    color: C.textMuted,
  },
  // ── Success ──
  successCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  successEmoji: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: C.emerald,
    marginBottom: 8,
  },
  successText: {
    fontSize: 15,
    color: C.textSec,
    textAlign: 'center',
  },
  // ── Footer ──
  footerText: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
});
