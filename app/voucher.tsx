/**
 * voucher.tsx - Poly-Puff Voucher Redemption Screen
 * ===================================================
 * Students enter a voucher code here to unlock free premium access.
 * Accessible from the Menu.
 *
 * FILE LOCATION: app/voucher.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Tag, Lock, Unlock, ArrowLeft, Gift, Smartphone, Key } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { redeemVoucher, isPremiumUnlocked, getRedeemedCode } from '../services/voucherService';
import { scaledFont } from '../utils/accessibility';

interface VoucherScreenProps {
  onBack?: () => void;
}

export default function VoucherScreen({ onBack }: VoucherScreenProps = {}) {
  const { colors: C } = useTheme();
  const router = useRouter();
  const goBack = onBack || (() => router.back());

  const [code,        setCode]        = useState('');
  const [loading,     setLoading]     = useState(false);
  const [status,      setStatus]      = useState<'idle' | 'success' | 'error'>('idle');
  const [message,     setMessage]     = useState('');
  const [alreadyHas,  setAlreadyHas]  = useState(false);
  const [savedCode,   setSavedCode]   = useState<string | null>(null);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Check if already unlocked on mount
  useEffect(() => {
    (async () => {
      const unlocked = await isPremiumUnlocked();
      const existing = await getRedeemedCode();
      if (unlocked) {
        setAlreadyHas(true);
        setSavedCode(existing);
      }
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    })();
  }, []);

  // Auto-format code as user types: insert hyphens in POLY-XXXX-XXXX pattern
  const handleCodeChange = (text: string) => {
    // Strip everything except alphanumeric and hyphens, uppercase
    let cleaned = text.toUpperCase().replace(/[^A-Z0-9-]/g, '');

    // If user types without hyphens, auto-insert them
    if (!cleaned.includes('-')) {
      const raw = cleaned.replace(/-/g, '');
      if (raw.length > 4 && !raw.startsWith('POLY')) {
        // Just let them type freely
      } else if (raw.startsWith('POLY')) {
        // POLY + up to 4 + up to 4
        const rest = raw.slice(4);
        if (rest.length <= 4) {
          cleaned = `POLY-${rest}`;
        } else {
          cleaned = `POLY-${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
        }
      }
    }

    setCode(cleaned);
    if (status !== 'idle') {
      setStatus('idle');
      setMessage('');
    }
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleRedeem = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setLoading(true);
    setStatus('idle');
    setMessage('');

    const result = await redeemVoucher(trimmed);
    setLoading(false);

    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      setAlreadyHas(true);
      setSavedCode(trimmed.toUpperCase());
    } else {
      setStatus('error');
      setMessage(result.message);
      shake();
    }
  };

  const inputBorderColor =
    status === 'success' ? C.emerald || '#00E5A0' :
    status === 'error'   ? C.red     || '#FF4D6A' :
                           (C.border + '60');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg || '#0A0E1A' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>

        {/* ── Header ── */}
        <View style={[s.header, { borderBottomColor: C.border, backgroundColor: C.card || '#121829' }]}>
          <TouchableOpacity
            onPress={goBack}
            style={s.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color={C.text || '#F0F4FF'} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: C.cyan || '#00E5FF' }]}>Voucher Code</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* ── Icon + Title ── */}
          <View style={s.heroRow}>
            <View style={[s.iconCircle, { backgroundColor: (C.cyan || '#00E5FF') + '18', borderColor: (C.cyan || '#00E5FF') + '40' }]}>
              <Tag size={32} color={C.cyan || '#00E5FF'} />
            </View>
            <Text style={[s.heroTitle, { color: C.text || '#F0F4FF' }]}>Redeem Your Code</Text>
            <Text style={[s.heroSub, { color: C.textSec || '#8B95B0' }]}>
              Enter your voucher code to unlock free access to Poly-Puff.
            </Text>
          </View>

          {/* ── Already unlocked banner ── */}
          {alreadyHas && (
            <View style={[s.unlockedBanner, { backgroundColor: (C.emerald || '#00E5A0') + '15', borderColor: (C.emerald || '#00E5A0') + '40' }]}>
              <Unlock size={18} color={C.emerald || '#00E5A0'} />
              <View style={{ flex: 1 }}>
                <Text style={[s.unlockedTitle, { color: C.emerald || '#00E5A0' }]}>
                  Access Already Unlocked ✓
                </Text>
                {savedCode ? (
                  <Text style={[s.unlockedCode, { color: C.textSec || '#8B95B0' }]}>
                    Code: {savedCode}
                  </Text>
                ) : null}
              </View>
            </View>
          )}

          {/* ── Input ── */}
          <View style={s.inputSection}>
            <Text style={[s.inputLabel, { color: C.textSec || '#8B95B0' }]}>
              Enter your code
            </Text>
            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
              <TextInput
                style={[
                  s.input,
                  {
                    backgroundColor: C.card || '#121829',
                    color: C.text || '#F0F4FF',
                    borderColor: inputBorderColor,
                  },
                ]}
                value={code}
                onChangeText={handleCodeChange}
                placeholder="POLY-XXXX-XXXX"
                placeholderTextColor={C.textMuted || '#5A6380'}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={14}
                returnKeyType="done"
                onSubmitEditing={handleRedeem}
                editable={!loading}
                accessibilityLabel="Voucher code"
                accessibilityHint="Enter the voucher code you received from your teacher, format POLY-XXXX-XXXX"
              />
            </Animated.View>

            {/* Status message */}
            {message ? (
              <View style={[
                s.messageRow,
                { backgroundColor: status === 'success'
                    ? (C.emerald || '#00E5A0') + '15'
                    : (C.red || '#FF4D6A') + '15',
                  borderColor: status === 'success'
                    ? (C.emerald || '#00E5A0') + '40'
                    : (C.red || '#FF4D6A') + '40',
                }
              ]}>
                {status === 'success'
                  ? <CheckCircle size={16} color={C.emerald || '#00E5A0'} />
                  : <Lock size={16} color={C.red || '#FF4D6A'} />
                }
                <Text style={[
                  s.messageText,
                  { color: status === 'success' ? C.emerald || '#00E5A0' : C.red || '#FF4D6A' }
                ]}>
                  {message}
                </Text>
              </View>
            ) : null}

            {/* Submit button */}
            <TouchableOpacity
              style={[
                s.redeemBtn,
                {
                  backgroundColor: code.length >= 13
                    ? (C.cyan || '#00E5FF')
                    : (C.border || '#2A3352'),
                  opacity: loading ? 0.7 : 1,
                },
              ]}
              onPress={handleRedeem}
              disabled={loading || code.length < 5}
              accessibilityRole="button"
              accessibilityLabel="Redeem voucher code"
              accessibilityState={{ disabled: loading || code.length < 5 }}
            >
              {loading ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <Text style={[
                  s.redeemBtnText,
                  { color: code.length >= 13 ? '#000' : C.textMuted || '#5A6380' }
                ]}>
                  Redeem Code
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Info box ── */}
          <View style={[s.infoBox, { backgroundColor: C.card || '#121829', borderColor: C.border || '#2A3352' }]}>
            <Text style={[s.infoTitle, { color: C.textSec || '#8B95B0' }]}>How it works</Text>
            <View style={s.infoLineRow}>
              <Gift size={15} color={C.textMuted || '#5A6380'} />
              <Text style={[s.infoLine, { color: C.textMuted || '#5A6380' }]}>
                Each code unlocks full access to Poly-Puff.
              </Text>
            </View>
            <View style={s.infoLineRow}>
              <Smartphone size={15} color={C.textMuted || '#5A6380'} />
              <Text style={[s.infoLine, { color: C.textMuted || '#5A6380' }]}>
                Codes are tied to one device - share wisely!
              </Text>
            </View>
            <View style={s.infoLineRow}>
              <Key size={15} color={C.textMuted || '#5A6380'} />
              <Text style={[s.infoLine, { color: C.textMuted || '#5A6380' }]}>
                Got a code from your teacher? Enter it above.
              </Text>
            </View>
          </View>

        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44, height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: scaledFont(18),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scroll: {
    padding: 24,
    paddingBottom: 60,
  },
  heroRow: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: scaledFont(22),
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: scaledFont(14),
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  unlockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
  },
  unlockedTitle: {
    fontSize: scaledFont(14),
    fontWeight: '700',
  },
  unlockedCode: {
    fontSize: scaledFont(12),
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  inputSection: {
    marginBottom: 24,
    gap: 10,
  },
  inputLabel: {
    fontSize: scaledFont(13),
    fontWeight: '600',
    marginBottom: 2,
  },
  input: {
    borderRadius: 14,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: scaledFont(20),
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  messageText: {
    flex: 1,
    fontSize: scaledFont(13),
    lineHeight: 18,
  },
  redeemBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  redeemBtnText: {
    fontSize: scaledFont(16),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  infoBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  infoTitle: {
    fontSize: scaledFont(12),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoLineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoLine: {
    flex: 1,
    fontSize: scaledFont(13),
    lineHeight: 19,
  },
});
