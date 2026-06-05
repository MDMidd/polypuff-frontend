/**
 * LoginScreen.tsx
 * ==========================================
 * Registration / Login — shown AFTER Terms acceptance
 * 
 * Options:
 *  - Continue with Google
 *  - Continue with Facebook
 *  - Continue with Apple
 *  - Email + Password registration
 * 
 * Includes age representation clause at the bottom.
 * 
 * For 13-17 "grey zone" users: auto-disables data sharing/public profiles
 * (already set in AgeGateScreen, reinforced here in the UI).
 * 
 * NOTE: Social auth buttons are UI-ready placeholders.
 * You'll need to wire up the actual auth providers:
 *   - Google: expo-auth-session or @react-native-google-signin
 *   - Facebook: expo-auth-session or react-native-fbsdk-next
 *   - Apple: expo-apple-authentication
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
  // Social brand colors
  google:     '#4285F4',
  facebook:   '#1877F2',
  apple:      '#FFFFFF',
};

export default function LoginScreen({ ageGroup, onComplete }) {
  const [mode, setMode] = useState('options'); // 'options' | 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  const isGreyZone = ageGroup === 'grey_zone';
  const isMinor = ageGroup === 'child' || ageGroup === 'grey_zone';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // ─── Social auth handlers (placeholders — wire up actual providers) ───
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // TODO before launch: wire up real Google Sign-In and pass user.photoURL:
      // const { user } = await Google.signInAsync(...);
      // await saveLogin('google', user.email, user.photoURL);
      await saveLogin('google', 'Google User', null);
    } catch (e) {
      setError('Could not sign in. Please use email registration.');
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setLoading(true);
    try {
      // TODO before launch: wire up real Facebook Login and pass photo URL:
      // await saveLogin('facebook', user.email, user.picture?.data?.url);
      await saveLogin('facebook', 'Facebook User', null);
    } catch (e) {
      setError('Could not sign in. Please use email registration.');
      setLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setLoading(true);
    try {
      // TODO before launch: wire up real Apple Sign-In (Apple doesn't provide photo):
      // await saveLogin('apple', credential.email, null);
      await saveLogin('apple', 'Apple User', null);
    } catch (e) {
      setError('Could not sign in. Please use email registration.');
      setLoading(false);
    }
  };

  // ─── Email registration ───
  const handleEmailRegister = async () => {
    setError('');

    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter a password.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    try {
      await saveLogin('email', email.trim());
    } catch (e) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  // ─── Save login and proceed ───
  const saveLogin = async (method, identifier, photoURL = null) => {
    try {
      await AsyncStorage.setItem('authMethod', method);
      await AsyncStorage.setItem('authIdentifier', identifier);
      await AsyncStorage.setItem('loginComplete', 'true');
      await AsyncStorage.setItem('loginDate', new Date().toISOString());

      // Save social profile photo if provided (Google/Apple/Facebook)
      if (photoURL) {
        await AsyncStorage.setItem('authPhotoURL', photoURL);
        // Also set as profilePic so it shows immediately
        await AsyncStorage.setItem('profilePic', photoURL);
      }

      // Grey zone: reinforce restricted defaults
      if (isGreyZone) {
        await AsyncStorage.setItem('dataSharingEnabled', 'false');
        await AsyncStorage.setItem('publicProfileEnabled', 'false');
      }

      onComplete('done', ageGroup);
    } catch (e) {
      console.error('Login save error:', e);
      setError('Could not save login. Please try again.');
      setLoading(false);
    }
  };

  // ─── Get regional info for the clause ───
  const getRegionClause = () => {
    // This will be read from AsyncStorage if needed, but for display we use a generic version
    return 'e.g., 16 in the EU, 18 in South Africa/KSA';
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={s.scrollContent}
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

          <Text style={s.title}>
            {mode === 'options' ? 'Create Your Account' : 'Sign Up with Email'}
          </Text>
          <Text style={s.subtitle}>
            {mode === 'options'
              ? 'Choose how you\'d like to sign in to Poly-Puff'
              : 'Enter your email and create a password'
            }
          </Text>

          {/* ── Grey zone notice ── */}
          {isGreyZone && (
            <View style={s.greyZoneCard}>
              <Text style={s.greyZoneIcon}>🔒</Text>
              <Text style={s.greyZoneText}>
                Because you're under 18, data sharing and public profiles are disabled by default for your privacy. You can ask a parent to enable them in Settings.
              </Text>
            </View>
          )}

          {/* ═══ SOCIAL AUTH OPTIONS ═══ */}
          {mode === 'options' && (
            <>
              {/* Google */}
              <TouchableOpacity
                style={[s.socialBtn, { borderColor: C.google + '40' }]}
                onPress={handleGoogleAuth}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={s.socialIcon}>G</Text>
                <Text style={s.socialText}>Continue with Google</Text>
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity
                style={[s.socialBtn, { borderColor: C.facebook + '40' }]}
                onPress={handleFacebookAuth}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={[s.socialIcon, { color: C.facebook }]}>f</Text>
                <Text style={s.socialText}>Continue with Facebook</Text>
              </TouchableOpacity>

              {/* Apple */}
              <TouchableOpacity
                style={[s.socialBtn, { borderColor: C.apple + '20' }]}
                onPress={handleAppleAuth}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={[s.socialIcon, { color: C.apple, fontSize: 20 }]}></Text>
                <Text style={s.socialText}>Continue with Apple</Text>
              </TouchableOpacity>

              {/* ── Divider ── */}
              <View style={s.dividerRow}>
                <View style={s.dividerLine} />
                <Text style={s.dividerText}>or</Text>
                <View style={s.dividerLine} />
              </View>

              {/* Email option */}
              <TouchableOpacity
                style={s.emailBtn}
                onPress={() => { setMode('email'); setError(''); }}
                activeOpacity={0.8}
              >
                <Text style={s.emailBtnText}>Sign Up with Email</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ═══ EMAIL REGISTRATION FORM ═══ */}
          {mode === 'email' && (
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

              {error ? <Text style={s.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.registerBtn, loading && s.registerBtnDisabled]}
                onPress={handleEmailRegister}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={s.registerBtnText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setMode('options'); setError(''); }} style={s.backLink}>
                <Text style={s.backLinkText}>← Back to sign-in options</Text>
              </TouchableOpacity>
            </>
          )}

          {error && mode === 'options' ? <Text style={s.errorText}>{error}</Text> : null}

          {/* ═══ AGE REPRESENTATION CLAUSE ═══ */}
          <View style={s.clauseCard}>
            <Text style={s.clauseText}>
              By registering for Poly-Puff, you represent that you are at least 13 years of age. If you are between the ages of 13 and the age of digital majority in your country ({getRegionClause()}), you represent that you have reviewed these Terms with your parent or guardian and that they consent to your use of the AI Tutor.
            </Text>
          </View>

          {/* ── Already have account ── */}
          <TouchableOpacity style={s.loginLink}>
            <Text style={s.loginLinkText}>
              Already have an account? <Text style={{ color: C.cyan, fontWeight: '700' }}>Log In</Text>
            </Text>
          </TouchableOpacity>
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
  // ── Mascot ──
  mascotWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 16, paddingVertical: 8 },
  // ── Text ──
  title: { fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: C.textSec, textAlign: 'center', lineHeight: 21, marginBottom: 20 },
  // ── Grey zone card ──
  greyZoneCard: { flexDirection: 'row', backgroundColor: C.amber + '10', borderRadius: 12, borderWidth: 1, borderColor: C.amber + '25', padding: 12, marginBottom: 20, alignItems: 'flex-start' },
  greyZoneIcon: { fontSize: 16, marginRight: 10, marginTop: 1 },
  greyZoneText: { flex: 1, fontSize: 12, color: C.amber, lineHeight: 18, opacity: 0.9 },
  // ── Social buttons ──
  socialBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 14, borderWidth: 1.5, paddingVertical: 14, paddingHorizontal: 18, marginBottom: 10, gap: 14 },
  socialIcon: { fontSize: 18, fontWeight: '800', color: C.google, width: 24, textAlign: 'center' },
  socialText: { fontSize: 15, fontWeight: '600', color: C.text },
  // ── Divider ──
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: C.textMuted, fontWeight: '500' },
  // ── Email button ──
  emailBtn: { width: '100%', backgroundColor: C.cyan + '15', borderRadius: 14, borderWidth: 1, borderColor: C.cyan + '30', paddingVertical: 14, alignItems: 'center' },
  emailBtnText: { fontSize: 15, fontWeight: '600', color: C.cyan },
  // ── Email form ──
  input: { width: '100%', backgroundColor: C.bg, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, paddingVertical: 14, paddingHorizontal: 18, fontSize: 15, color: C.text, marginBottom: 12 },
  errorText: { fontSize: 13, color: C.red, textAlign: 'center', marginBottom: 8 },
  registerBtn: { width: '100%', backgroundColor: C.cyan, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8, shadowColor: C.cyan, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  registerBtnDisabled: { opacity: 0.6 },
  registerBtnText: { fontSize: 16, fontWeight: '700', color: C.bg },
  backLink: { marginTop: 14 },
  backLinkText: { fontSize: 14, color: C.cyan, fontWeight: '500' },
  // ── Age clause ──
  clauseCard: { width: '100%', backgroundColor: C.cardAlt, borderRadius: 12, padding: 14, marginTop: 20 },
  clauseText: { fontSize: 12, color: C.textMuted, lineHeight: 18, textAlign: 'center' },
  // ── Login link ──
  loginLink: { marginTop: 16, marginBottom: 4 },
  loginLinkText: { fontSize: 14, color: C.textSec, textAlign: 'center' },
});
