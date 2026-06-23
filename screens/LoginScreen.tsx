/**
 * LoginScreen.tsx
 * ==========================================
 * Registration / Login — shown AFTER Terms acceptance
 *
 * Modes:
 *  - 'options'       Social buttons + "Sign Up with Email" + "Log In"
 *  - 'signup'        Email + password form (POST /api/auth/signup)
 *  - 'login'         Email + password form (POST /api/auth/login)
 *  - 'forgot'        Email-only form (POST /api/auth/forgot-password)
 *  - 'check_email'   Post-signup state: "verify your email" + resend
 *  - 'reset_sent'    Post-forgot state: "check your email for reset link"
 *
 * After a successful login (`/api/auth/login` returns 200), AsyncStorage is
 * populated via storeAuthSession() with the same keys the website writes
 * (pp_token, pp_email, pp_account, accountSummary, pp_plan, etc.), so the
 * mobile app sees the same backend account as the web app.
 *
 * Social sign-in (Google/Facebook/Apple) is not yet wired to the backend on
 * mobile — those buttons show a "coming soon" notice instead of fake-logging in.
 *
 * Includes age representation clause at the bottom.
 *
 * For 13-17 "grey zone" users: auto-disables data sharing/public profiles
 * (already set in AgeGateScreen, reinforced here in the UI).
 *
 * FILE LOCATION: screens/LoginScreen.tsx
 */

import React, { useState, useRef, useEffect } from 'react';
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
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Lazy-load the Google Sign-In native module. Importing it directly at the top
// of the file makes the entire screen unable to load in Expo Go (no native
// module). Wrapping in try/require means: works in EAS builds, no-op in Expo Go.
let GoogleSignin: any = null;
let statusCodes: any = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const gsi = require('@react-native-google-signin/google-signin');
  GoogleSignin = gsi.GoogleSignin;
  statusCodes = gsi.statusCodes || {};
} catch (e) {
  // Running in Expo Go — Google Sign-In is unavailable. The handler shows
  // a friendly message instead of crashing.
}
import { getServerUrl } from '../services/api';
import { storeAuthSession } from '../utils/authSession';
import { pullAndMerge } from '../services/syncService';
import { redeemVoucher } from '../services/voucherService';

const { width: SW } = Dimensions.get('window');

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
  google:     '#4285F4',
  facebook:   '#1877F2',
  apple:      '#FFFFFF',
};

type Mode = 'options' | 'signup' | 'login' | 'forgot' | 'check_email' | 'reset_sent';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginScreenProps {
  ageGroup: 'child' | 'grey_zone' | 'adult';
  onComplete: (nextScreen: string, ageGroup?: string) => void;
}

export default function LoginScreen({ ageGroup, onComplete }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [voucher, setVoucher] = useState('');

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  const isGreyZone = ageGroup === 'grey_zone';
  const isMinor = ageGroup === 'child' || ageGroup === 'grey_zone';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    // Configure Google Sign-In once on mount. webClientId is the same
    // Web OAuth client ID used by the existing website Google flow — the
    // mobile native client requests its ID token with this as the audience,
    // and the backend verifies it against this client ID.
    // GoogleSignin is null in Expo Go (no native module) — skip silently.
    if (GoogleSignin) {
      try {
        const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
        if (clientId && !clientId.startsWith('REPLACE_WITH_')) {
          GoogleSignin.configure({
            webClientId: clientId,
            offlineAccess: false,
          });
        }
      } catch (e) {
        // Configure failed for some other reason — Google button will surface it.
      }
    }
  }, []);

  const resetForm = (next: Mode) => {
    setMode(next);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setVoucher('');
  };

  // Match website voucher.html: auto-format POLY-XXXX-XXXX, allow blank.
  const formatVoucher = (raw: string): string => {
    let cleaned = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.startsWith('POLY')) cleaned = cleaned.slice(4);
    cleaned = cleaned.slice(0, 8);
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 4) return `POLY-${cleaned}`;
    return `POLY-${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  };

  // ─── Google sign-in handler ──────────────────────────────
  // Native Android flow:
  //   1. Get an ID token from Google Play Services (via GoogleSignin)
  //   2. POST it to /api/auth/google-mobile on the backend
  //   3. Backend verifies the token, upserts the user, returns a JWT
  //   4. We store the JWT in AsyncStorage via storeAuthSession
  //   5. Pull profile from backend and complete the flow
  const handleGoogleSignIn = async () => {
    setError('');

    // Expo Go fallback: GoogleSignin native module isn't bundled.
    if (!GoogleSignin) {
      setError('Google sign-in only works in production builds. Please use email to sign in for now.');
      return;
    }

    // Upfront config check — fail fast with a clear message instead of a
    // cryptic native error if the env var isn't set or still has its
    // placeholder value. This catches the most common misconfiguration.
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!clientId || clientId.startsWith('REPLACE_WITH_')) {
      setError('Google sign-in isn\'t configured for this build. Please use email instead, or contact support.');
      return;
    }

    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Force fresh sign-in: clear any cached Credential Manager session.
      // Without this, an expired-but-cached token can get silently returned
      // and rejected by the backend as "Invalid Google token".
      try { await GoogleSignin.signOut(); } catch { /* no cached session — fine */ }
      const result: any = await GoogleSignin.signIn();
      // Library returns different shapes depending on version. Cover both.
      const idToken: string | null = result?.idToken || result?.data?.idToken || null;
      if (!idToken) {
        throw new Error('No ID token returned from Google.');
      }

      const base = await getServerUrl();
      const res = await fetch(`${base}/api/auth/google-mobile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      // Safer parse — non-JSON 500 responses would otherwise throw here.
      const data: any = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Server error ${res.status}.`);
      }
      if (!data?.token) {
        throw new Error('Server did not return an auth token.');
      }

      await storeAuthSession(data, data.email || '', 'google', data.photoUrl || null);
      await pullAndMerge().catch(() => {});

      // Grey zone: reinforce restricted defaults (same as email login path).
      if (isGreyZone) {
        await AsyncStorage.multiSet([
          ['dataSharingEnabled', 'false'],
          ['publicProfileEnabled', 'false'],
        ]);
      }

      onComplete('done', ageGroup);
    } catch (e: any) {
      if (e?.code === statusCodes.SIGN_IN_CANCELLED) {
        // User dismissed the picker — no error message needed.
      } else if (e?.code === statusCodes.IN_PROGRESS) {
        setError('Sign-in already in progress.');
      } else if (e?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Google Play Services not available on this device.');
      } else if (e?.code === 'DEVELOPER_ERROR' || /developer_error/i.test(String(e?.message))) {
        // The single most common cause of failure on first build attempt.
        setError('Google sign-in setup mismatch (DEVELOPER_ERROR). The Android OAuth client\'s SHA-1 likely doesn\'t match the EAS keystore.');
      } else if (/network/i.test(String(e?.message))) {
        setError('Cannot reach the server. Check your internet connection and try again.');
      } else {
        setError(e?.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── Social auth handlers — Facebook + Apple not yet wired on mobile ──
  const socialNotYet = (provider: string) => {
    Alert.alert(
      `${provider} sign-in coming soon`,
      `Mobile ${provider} sign-in isn't wired up yet. Please sign up or log in with your email — it uses the same account as the Poly-Puff website, so your progress will sync across devices.`,
      [{ text: 'Use email instead', onPress: () => resetForm('signup') }, { text: 'OK' }],
    );
  };

  // ─── POST /api/auth/signup ───
  const handleSignup = async () => {
    setError('');
    const trimmed = email.trim();
    const voucherCode = voucher.trim();
    if (!trimmed || !EMAIL_RE.test(trimmed)) { setError('Please enter a valid email address.'); return; }
    if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const BASE = await getServerUrl();
      const res = await fetch(`${BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not create account. Please try again.');
        return;
      }

      // Optional voucher redemption — runs after signup, doesn't block it.
      // The voucher binds to the device (same /api/vouchers/redeem endpoint
      // the website uses), so the same code works on web and mobile.
      let voucherMessage = '';
      if (voucherCode) {
        const result = await redeemVoucher(voucherCode);
        voucherMessage = result.success
          ? `\n\n✅ Voucher redeemed: ${result.message}`
          : `\n\n⚠️ Voucher couldn't be redeemed (${result.message}). Your account was still created — you can try the code again later in Settings → Voucher.`;
      }

      // Remember the email so the verification screen can show it & resend.
      setEmail(trimmed);
      setMode('check_email');

      if (voucherMessage) {
        Alert.alert('Account Created', `Check your email to verify your account.${voucherMessage}`);
      }
    } catch (e) {
      setError('Cannot reach the server. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── POST /api/auth/login ───
  const handleLogin = async () => {
    setError('');
    const trimmed = email.trim();
    if (!trimmed || !EMAIL_RE.test(trimmed)) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setLoading(true);
    try {
      const BASE = await getServerUrl();
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 403) {
          // Not verified — offer to resend.
          setError(data.error || 'Please verify your email before logging in.');
          setEmail(trimmed);
          setMode('check_email');
          return;
        }
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      await storeAuthSession(data, trimmed, 'email');
      pullAndMerge(); // fire-and-forget: pull vault data in background

      // Grey zone: reinforce restricted defaults.
      if (isGreyZone) {
        await AsyncStorage.multiSet([
          ['dataSharingEnabled', 'false'],
          ['publicProfileEnabled', 'false'],
        ]);
      }

      onComplete('done', ageGroup);
    } catch (e) {
      setError('Cannot reach the server. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── POST /api/auth/forgot-password ───
  const handleForgot = async () => {
    setError('');
    const trimmed = email.trim();
    if (!trimmed || !EMAIL_RE.test(trimmed)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    try {
      const BASE = await getServerUrl();
      await fetch(`${BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      setEmail(trimmed);
      setMode('reset_sent');
    } catch (e) {
      setError('Cannot reach the server. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── POST /api/auth/resend-verification ───
  const handleResendVerification = async () => {
    if (!email) return;
    setResending(true);
    try {
      const BASE = await getServerUrl();
      await fetch(`${BASE}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      Alert.alert('Verification Email Sent', `A fresh verification link was sent to ${email}.`);
    } catch (e) {
      Alert.alert('Could Not Send', 'Please try again in a moment.');
    } finally {
      setResending(false);
    }
  };

  // ═══ RENDER HELPERS ═══════════════════════════════════
  const getRegionClause = () => 'e.g., 16 in the EU, 18 in South Africa/KSA';

  const renderTitle = () => {
    switch (mode) {
      case 'signup':       return 'Sign Up with Email';
      case 'login':        return 'Log In';
      case 'forgot':       return 'Reset Password';
      case 'check_email':  return 'Check Your Email';
      case 'reset_sent':   return 'Check Your Email';
      default:             return 'Create Your Account';
    }
  };

  const renderSubtitle = () => {
    switch (mode) {
      case 'signup':       return 'Enter your email and create a password';
      case 'login':        return 'Sign in to sync with your Poly-Puff web account';
      case 'forgot':       return "We'll email you a link to reset your password";
      case 'check_email':  return `We've sent a verification link to ${email}. Click it to activate your account, then come back here to log in.`;
      case 'reset_sent':   return `If an account exists for ${email}, a password reset link is on its way.`;
      default:             return "Choose how you'd like to sign in to Poly-Puff";
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[s.content, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}
        >
          {/* ── Logo ── */}
          <View style={s.mascotWrap}>
            <Image
              source={require('../assets/images/logo-transparent.png')}
              style={{ width: 180, height: 40, resizeMode: 'contain' }}
              accessibilityLabel="Poly-Puff"
            />
          </View>

          <Text style={s.title}>{renderTitle()}</Text>
          <Text style={s.subtitle}>{renderSubtitle()}</Text>

          {/* ── Grey zone notice ── */}
          {isGreyZone && mode === 'options' && (
            <View style={s.greyZoneCard}>
              <Text style={s.greyZoneIcon}>🔒</Text>
              <Text style={s.greyZoneText}>
                Because you're under 18, data sharing and public profiles are disabled by default for your privacy. You can ask a parent to enable them in Settings.
              </Text>
            </View>
          )}

          {/* ═══ OPTIONS ═══ */}
          {mode === 'options' && (
            <>
              <TouchableOpacity
                style={[s.socialBtn, { borderColor: C.google + '40' }]}
                onPress={handleGoogleSignIn}
                activeOpacity={0.8}
                disabled={googleLoading}
              >
                <Text style={s.socialIcon}>G</Text>
                <Text style={s.socialText}>
                  {googleLoading ? 'Signing in…' : 'Continue with Google'}
                </Text>
              </TouchableOpacity>

              {/*
                Facebook + Apple sign-in hidden for v1 launch — not yet wired
                to the backend. To re-enable later, restore their blocks here
                and set the {false && ...} wrapper to {true && ...}.
              */}
              {false && (
                <>
                  <TouchableOpacity
                    style={[s.socialBtn, { borderColor: C.facebook + '40' }]}
                    onPress={() => socialNotYet('Facebook')}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.socialIcon, { color: C.facebook }]}>f</Text>
                    <Text style={s.socialText}>Continue with Facebook</Text>
                    <Text style={s.comingSoon}>soon</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[s.socialBtn, { borderColor: C.apple + '20' }]}
                    onPress={() => socialNotYet('Apple')}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.socialIcon, { color: C.apple, fontSize: 20 }]}></Text>
                    <Text style={s.socialText}>Continue with Apple</Text>
                    <Text style={s.comingSoon}>soon</Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={s.dividerRow}>
                <View style={s.dividerLine} />
                <Text style={s.dividerText}>or</Text>
                <View style={s.dividerLine} />
              </View>

              <TouchableOpacity
                style={s.emailBtn}
                onPress={() => resetForm('signup')}
                activeOpacity={0.8}
              >
                <Text style={s.emailBtnText}>Sign Up with Email</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.loginLink} onPress={() => resetForm('login')}>
                <Text style={s.loginLinkText}>
                  Already have an account? <Text style={{ color: C.cyan, fontWeight: '700' }}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* ═══ SIGNUP ═══ */}
          {mode === 'signup' && (
            <>
              <TextInput
                style={s.input}
                placeholder="Email address"
                placeholderTextColor={C.textMuted}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <TextInput
                style={s.input}
                placeholder="Password (min. 8 characters)"
                placeholderTextColor={C.textMuted}
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
                secureTextEntry
                autoComplete="new-password"
              />
              <TextInput
                style={s.input}
                placeholder="Confirm password"
                placeholderTextColor={C.textMuted}
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                secureTextEntry
                autoComplete="new-password"
              />

              {/* Optional voucher — same backend endpoint as the website, so a
                  code redeemed in either place works in both. */}
              <TextInput
                style={[s.input, { letterSpacing: 1 }]}
                placeholder="Voucher code (optional) — POLY-XXXX-XXXX"
                placeholderTextColor={C.textMuted}
                value={voucher}
                onChangeText={(t) => { setVoucher(formatVoucher(t)); setError(''); }}
                autoCapitalize="characters"
                autoComplete="off"
                autoCorrect={false}
                maxLength={14}
              />

              {error ? <Text style={s.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.primaryBtn, loading && s.primaryBtnDisabled]}
                onPress={handleSignup}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={s.primaryBtnText}>
                  {loading ? 'Creating Account…' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => resetForm('login')} style={s.backLink}>
                <Text style={s.backLinkText}>Already have an account? Log in</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => resetForm('options')} style={s.backLink}>
                <Text style={s.backLinkText}>← Back to sign-in options</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ═══ LOGIN ═══ */}
          {mode === 'login' && (
            <>
              {/* Google sign-in is also shown here so returning users who
                  originally signed up with Google on the website have a
                  one-tap path on mobile too. */}
              <TouchableOpacity
                style={[s.socialBtn, { borderColor: C.google + '40' }]}
                onPress={handleGoogleSignIn}
                activeOpacity={0.8}
                disabled={googleLoading}
              >
                <Text style={s.socialIcon}>G</Text>
                <Text style={s.socialText}>
                  {googleLoading ? 'Signing in…' : 'Continue with Google'}
                </Text>
              </TouchableOpacity>

              <View style={s.dividerRow}>
                <View style={s.dividerLine} />
                <Text style={s.dividerText}>or</Text>
                <View style={s.dividerLine} />
              </View>

              <TextInput
                style={s.input}
                placeholder="Email address"
                placeholderTextColor={C.textMuted}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <TextInput
                style={s.input}
                placeholder="Password"
                placeholderTextColor={C.textMuted}
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
                secureTextEntry
                autoComplete="password"
              />

              {error ? <Text style={s.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.primaryBtn, loading && s.primaryBtnDisabled]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={s.primaryBtnText}>
                  {loading ? 'Logging In…' : 'Log In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => resetForm('forgot')} style={s.backLink}>
                <Text style={s.backLinkText}>Forgot your password?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => resetForm('signup')} style={s.backLink}>
                <Text style={s.backLinkText}>New here? Create an account</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => resetForm('options')} style={s.backLink}>
                <Text style={s.backLinkText}>← Back to sign-in options</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ═══ FORGOT ═══ */}
          {mode === 'forgot' && (
            <>
              <TextInput
                style={s.input}
                placeholder="Email address"
                placeholderTextColor={C.textMuted}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              {error ? <Text style={s.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.primaryBtn, loading && s.primaryBtnDisabled]}
                onPress={handleForgot}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={s.primaryBtnText}>
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => resetForm('login')} style={s.backLink}>
                <Text style={s.backLinkText}>← Back to log in</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ═══ CHECK EMAIL (post-signup / unverified login) ═══ */}
          {mode === 'check_email' && (
            <>
              <View style={s.infoCard}>
                <Text style={s.infoIcon}>📧</Text>
                <Text style={s.infoText}>
                  Open the email from Poly-Puff and tap the verification link, then come back here to log in.
                </Text>
              </View>

              <TouchableOpacity
                style={[s.primaryBtn, loading && s.primaryBtnDisabled]}
                onPress={() => resetForm('login')}
                activeOpacity={0.8}
              >
                <Text style={s.primaryBtnText}>I've Verified — Log In</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleResendVerification} style={s.backLink} disabled={resending}>
                <Text style={s.backLinkText}>
                  {resending ? 'Sending…' : 'Resend verification email'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => resetForm('options')} style={s.backLink}>
                <Text style={s.backLinkText}>← Back to sign-in options</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ═══ RESET SENT ═══ */}
          {mode === 'reset_sent' && (
            <>
              <View style={s.infoCard}>
                <Text style={s.infoIcon}>🔑</Text>
                <Text style={s.infoText}>
                  Open the reset link from your email to choose a new password, then come back here to log in.
                </Text>
              </View>

              <TouchableOpacity
                style={s.primaryBtn}
                onPress={() => resetForm('login')}
                activeOpacity={0.8}
              >
                <Text style={s.primaryBtnText}>Back to Log In</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ═══ AGE REPRESENTATION CLAUSE ═══ */}
          {(mode === 'options' || mode === 'signup') && (
            <View style={s.clauseCard}>
              <Text style={s.clauseText}>
                By registering for Poly-Puff, you represent that you are at least 13 years of age. If you are between the ages of 13 and the age of digital majority in your country ({getRegionClause()}), you represent that you have reviewed these Terms with your parent or guardian and that they consent to your use of the AI Tutor.
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ═══════════════════════════════════════════
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, paddingBottom: 40 },
  content: { width: '100%', maxWidth: 420, backgroundColor: C.card + 'DD', borderRadius: 24, borderWidth: 1, borderColor: C.border, padding: 24, alignItems: 'center', shadowColor: C.purple, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.08, shadowRadius: 30, elevation: 8 },
  mascotWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 16, paddingVertical: 8 },
  title: { fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: C.textSec, textAlign: 'center', lineHeight: 21, marginBottom: 20 },
  greyZoneCard: { flexDirection: 'row', backgroundColor: C.amber + '10', borderRadius: 12, borderWidth: 1, borderColor: C.amber + '25', padding: 12, marginBottom: 20, alignItems: 'flex-start' },
  greyZoneIcon: { fontSize: 16, marginRight: 10, marginTop: 1 },
  greyZoneText: { flex: 1, fontSize: 12, color: C.amber, lineHeight: 18, opacity: 0.9 },
  socialBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 14, borderWidth: 1.5, paddingVertical: 14, paddingHorizontal: 18, marginBottom: 10, gap: 14 },
  socialIcon: { fontSize: 18, fontWeight: '800', color: C.google, width: 24, textAlign: 'center' },
  socialText: { flex: 1, fontSize: 15, fontWeight: '600', color: C.text },
  comingSoon: { fontSize: 11, fontWeight: '700', color: C.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: C.textMuted, fontWeight: '500' },
  emailBtn: { width: '100%', backgroundColor: C.cyan + '15', borderRadius: 14, borderWidth: 1, borderColor: C.cyan + '30', paddingVertical: 14, alignItems: 'center' },
  emailBtnText: { fontSize: 15, fontWeight: '600', color: C.cyan },
  input: { width: '100%', backgroundColor: C.bg, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, paddingVertical: 14, paddingHorizontal: 18, fontSize: 15, color: C.text, marginBottom: 12 },
  errorText: { fontSize: 13, color: C.red, textAlign: 'center', marginBottom: 8 },
  primaryBtn: { width: '100%', backgroundColor: C.cyan, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8, shadowColor: C.cyan, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: C.bg },
  backLink: { marginTop: 14 },
  backLinkText: { fontSize: 14, color: C.cyan, fontWeight: '500', textAlign: 'center' },
  infoCard: { width: '100%', flexDirection: 'row', backgroundColor: C.cardAlt, borderRadius: 12, padding: 14, marginBottom: 16, alignItems: 'flex-start' },
  infoIcon: { fontSize: 20, marginRight: 10 },
  infoText: { flex: 1, fontSize: 13, color: C.textSec, lineHeight: 19 },
  clauseCard: { width: '100%', backgroundColor: C.cardAlt, borderRadius: 12, padding: 14, marginTop: 20 },
  clauseText: { fontSize: 12, color: C.textMuted, lineHeight: 18, textAlign: 'center' },
  loginLink: { marginTop: 16, marginBottom: 4 },
  loginLinkText: { fontSize: 14, color: C.textSec, textAlign: 'center' },
});
