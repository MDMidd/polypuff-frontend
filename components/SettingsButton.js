/**
 * SettingsButton - Gear icon (Accessibility Update)
 *
 * CHANGES: Added accessibilityRole, accessibilityLabel, minimum touch target 44×44
 *
 * FILE: components/SettingsButton.js
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsButton({ style }) {
  const { colors: C } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[{
        position: 'absolute', top: 12, right: 16, zIndex: 10,
        width: 44, height: 44, borderRadius: 12,  // ✅ was 36×36 → 44×44
        backgroundColor: C.cardGlass || C.card, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.cyan ? C.cyan + '20' : C.border + '30',
      }, style]}
      onPress={() => router.push('/settings')}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      // ✅ ACCESSIBILITY
      accessibilityRole="button"
      accessibilityLabel="Settings"
      accessibilityHint="Opens app settings"
    >
      <Settings size={18} color={C.textMuted} />
    </TouchableOpacity>
  );
}
