/**
 * UpgradeToProModal.tsx
 * ========================================================
 * Lightweight "this module is Pro-only" prompt shown when a free user taps
 * a locked exercise on the Practice Hub (app/index.tsx, app/practice.tsx).
 *
 * This intentionally does NOT duplicate the real purchase flow (package
 * fetching, RevenueCat purchasePackage/restorePurchases, Paddle pricing
 * link) that already lives in app/settings.tsx - that flow is stateful
 * (paywallVisible/paywallPackages/purchasingId, etc.) and tightly coupled
 * to settings.tsx's own account-refresh logic. Re-implementing it here for
 * two more screens would be a bigger, riskier change for no real benefit.
 * Instead, this modal explains the lock and hands off to Settings, which
 * already has the correct upgrade entry point wired up for both platforms
 * (Play Billing paywall on Android, Paddle pricing link elsewhere).
 *
 * FILE: components/UpgradeToProModal.tsx
 */

import React from 'react';
import {
  Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Sparkles } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { scaledFont } from '../utils/accessibility';

interface Props {
  visible: boolean;
  moduleLabel?: string;
  onClose: () => void;
}

export default function UpgradeToProModal({ visible, moduleLabel, onClose }: Props) {
  const { colors: C } = useTheme();
  const router = useRouter();

  const cyan    = C.cyan    || '#00E5FF';
  const purple  = C.purple  || '#B06CFF';
  const card    = C.card    || '#121829';
  const text    = C.text    || '#F0F4FF';
  const muted   = C.textMuted || '#8B94A8';

  const goToUpgrade = () => {
    onClose();
    router.push('/settings');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'center', alignItems: 'center', padding: 20 }}
        activeOpacity={1}
        onPress={onClose}
        accessible={false}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              width: '100%', maxWidth: 420, backgroundColor: card,
              borderRadius: 20, borderWidth: 1, borderColor: purple + '30',
              padding: 24, alignItems: 'center',
            }}
            accessibilityViewIsModal
          >
            <View style={{
              width: 56, height: 56, borderRadius: 28,
              backgroundColor: purple + '18', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <Lock size={26} color={purple} />
            </View>

            <Text style={{ fontSize: scaledFont(18), fontWeight: '800', color: text, textAlign: 'center' }} accessibilityRole="header">
              {moduleLabel ? `${moduleLabel} is a Pro feature` : 'This is a Pro feature'}
            </Text>
            <Text style={{ fontSize: scaledFont(13), color: muted, textAlign: 'center', marginTop: 8, lineHeight: 19 }}>
              Upgrade to Poly-Puff Pro to unlock every exercise module, unlimited AI requests, and more.
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                backgroundColor: cyan, borderRadius: 14, paddingVertical: 14,
                width: '100%', marginTop: 20, minHeight: 48,
              }}
              onPress={goToUpgrade}
              accessibilityRole="button"
              accessibilityLabel="Upgrade to Pro"
            >
              <Sparkles size={16} color="#000" />
              <Text style={{ fontSize: scaledFont(15), fontWeight: '800', color: '#000' }}>
                Upgrade to Pro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingVertical: 12, marginTop: 4, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Not now"
            >
              <Text style={{ fontSize: scaledFont(14), color: muted, fontWeight: '600' }}>
                Not now
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}
