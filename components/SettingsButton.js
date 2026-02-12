/**
 * SettingsButton - Gear icon for top-right corner of every screen
 * 
 * Usage: import SettingsButton from '../components/SettingsButton';
 *        Then place <SettingsButton /> after your screen header.
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
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: C.cardGlass || C.card, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.cyan ? C.cyan + '20' : C.border + '30',
      }, style]}
      onPress={() => router.push('/settings')}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Settings size={18} color={C.textMuted} />
    </TouchableOpacity>
  );
}
