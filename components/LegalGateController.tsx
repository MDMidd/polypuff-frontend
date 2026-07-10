/**
 * LegalGateController.tsx - v2.1
 * ==========================================
 * ORCHESTRATOR - Controls the full legal + auth flow:
 * 
 *   1. Check AsyncStorage for existing state
 *   2. AgeGateScreen (region + birth year - conditional thresholds)
 *   3. ParentalConsentScreen (if under regional threshold)
 *   4. TermsScreen (scroll-to-bottom acceptance)
 *   5. LoginScreen (Google/Facebook/Apple/Email)
 *   6. → App loads (FirstTimeCheck sends to profile setup)
 * 
 * ASYNCSTORAGE KEYS:
 *   - 'ageVerified'           → 'true'
 *   - 'userAgeGroup'          → 'child' | 'grey_zone' | 'adult'
 *   - 'userBirthYear'         → e.g. '2015'
 *   - 'userRegion'            → e.g. 'eu'
 *   - 'userRegionHardStop'    → e.g. '16'
 *   - 'parentalConsent'       → 'true'
 *   - 'parentalConsentDate'   → ISO date
 *   - 'termsAccepted'         → 'true'
 *   - 'termsVersion'          → e.g. '3.0'
 *   - 'termsAcceptedDate'     → ISO date
 *   - 'loginComplete'         → 'true'
 *   - 'authMethod'            → 'google' | 'facebook' | 'apple' | 'email'
 *   - 'authIdentifier'        → email or display name
 *   - 'dataSharingEnabled'    → 'false' (auto-set for grey zone users)
 *   - 'publicProfileEnabled'  → 'false' (auto-set for grey zone users)
 * 
 * FILE LOCATION: components/LegalGateController.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AgeGateScreen from '../screens/AgeGateScreen';
import ParentalConsentScreen from '../screens/ParentalConsentScreen';
import TermsScreen from '../screens/TermsScreen';
import LoginScreen from '../screens/LoginScreen';
import VoucherScreen from '../app/voucher';

const C = {
  bg: '#0A0E1A',
  cyan: '#00E5FF',
  textMuted: '#5A6380',
};

// Bump this to force re-acceptance of updated terms
const REQUIRED_TERMS_VERSION = '3.0';

export default function LegalGateController({ onComplete }) {
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [ageGroup, setAgeGroup] = useState('adult');

  useEffect(() => {
    checkExistingState();
  }, []);

  const checkExistingState = async () => {
    try {
      const [ageVerified, storedAgeGroup, parentalConsent, termsAccepted, termsVersion, loginComplete] =
        await Promise.all([
          AsyncStorage.getItem('ageVerified'),
          AsyncStorage.getItem('userAgeGroup'),
          AsyncStorage.getItem('parentalConsent'),
          AsyncStorage.getItem('termsAccepted'),
          AsyncStorage.getItem('termsVersion'),
          AsyncStorage.getItem('loginComplete'),
        ]);

      // 1. Age not verified → age gate
      if (ageVerified !== 'true') {
        setCurrentScreen('age_gate');
        setLoading(false);
        return;
      }

      const group = storedAgeGroup || 'adult';
      setAgeGroup(group);

      // 2. Child without parental consent → parental gate
      if (group === 'child' && parentalConsent !== 'true') {
        setCurrentScreen('parental_consent');
        setLoading(false);
        return;
      }

      // 3. Terms not accepted or version mismatch → terms
      if (termsAccepted !== 'true' || termsVersion !== REQUIRED_TERMS_VERSION) {
        setCurrentScreen('terms');
        setLoading(false);
        return;
      }

      // 4. Not logged in → login
      if (loginComplete !== 'true') {
        setCurrentScreen('login');
        setLoading(false);
        return;
      }

      // 5. All clear → app
      setCurrentScreen('done');
      setLoading(false);
      onComplete();
    } catch (e) {
      console.error('LegalGate check error:', e);
      setCurrentScreen('age_gate');
      setLoading(false);
    }
  };

  const handleScreenComplete = (nextScreen, group) => {
    if (group) setAgeGroup(group);

    if (nextScreen === 'done') {
      onComplete();
    } else {
      setCurrentScreen(nextScreen);
    }
  };

  if (loading || currentScreen === 'loading') {
    return (
      <View
        style={s.loadingContainer}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Loading Poly-Puff"
        accessibilityLiveRegion="polite"
      >
        <ActivityIndicator size="large" color={C.cyan} />
        <Text style={s.loadingText}>Loading...</Text>
      </View>
    );
  }

  switch (currentScreen) {
    case 'age_gate':
      return <AgeGateScreen onComplete={handleScreenComplete} />;

    case 'parental_consent':
      return <ParentalConsentScreen ageGroup={ageGroup} onComplete={handleScreenComplete} />;

    case 'terms':
      // After terms, route to login instead of done
      return (
        <TermsScreen
          ageGroup={ageGroup}
          onComplete={(_, group) => handleScreenComplete('login', group)}
        />
      );

    case 'login':
      return (
        <LoginScreen
          ageGroup={ageGroup}
          onComplete={handleScreenComplete}
          onShowVoucher={() => setCurrentScreen('voucher')}
        />
      );

    case 'voucher':
      return <VoucherScreen onBack={() => setCurrentScreen('login')} />;

    default:
      return null;
  }
}

const s = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 14, color: C.textMuted },
});
