/**
 * ThemeContext - Poly-Puff v1.0
 * ==============================
 * 
 * "Neon Pulse" / Glassmorphism aesthetic
 * Colors extracted from the Poly-Puff mascot:
 *   - Deep Midnight Blue: backgrounds
 *   - Cyan/Electric Blue: primary actions, borders, glows
 *   - Soft Purple/Pink: accents, highlights, mascot tones
 *   - Warm Gold/Amber: rewards, XP, achievements
 * 
 * FILE: contexts/ThemeContext.js
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ═══ POLY-PUFF DARK — Primary brand theme ═══
const DARK = {
  // Backgrounds (Deep Midnight Blue from image)
  bg: '#0A0E1A',
  card: '#121829',
  cardAlt: '#1A2137',
  cardGlass: 'rgba(18, 24, 41, 0.75)',    // Glassmorphism semi-transparent

  // Text
  text: '#F0F4FF',
  textSec: '#8B95B0',
  textMuted: '#5A6380',
  border: '#2A3352',

  // Cyan/Electric Blue — Primary (from the glowing ring)
  cyan: '#00E5FF',
  cyanLight: '#67EFFF',
  cyanDark: '#003D47',
  cyanGlow: 'rgba(0, 229, 255, 0.15)',     // Neon glow effect

  // Purple/Pink — Accent (from the mascot body)
  purple: '#B06CFF',
  purpleLight: '#D4A5FF',
  purpleDark: '#2D1854',
  purpleGlow: 'rgba(176, 108, 255, 0.15)',
  pink: '#FF6EB4',
  pinkLight: '#FF9FD2',

  // Success/Correct (Emerald — keep for score semantics)
  emerald: '#00E5A0',
  emeraldLight: '#5EFFCA',
  emeraldDark: '#003D2E',

  // Warning/Amber (from the warm glow of the mascot)
  amber: '#FFBE0B',
  amberLight: '#FFD761',
  amberDark: '#3D2E00',

  // Error/Red
  red: '#FF4D6A',
  redLight: '#FF8FA4',
  redDark: '#3D0015',

  // Legacy aliases (so existing screens don't break)
  blue: '#00E5FF',
  blueLight: '#67EFFF',
  blueDark: '#003D47',
  gold: '#FFBE0B',

  // UI elements
  inputBg: '#0D1220',
  inputBorder: '#2A3352',
  inputFocus: '#00E5FF',     // Glowing cyan border on focus
  tabBar: '#0D1220',
  tabBorder: '#1A2137',
  
  // Neon glow values for shadows/borders
  glowCyan: '#00E5FF',
  glowPurple: '#B06CFF',
  glowPink: '#FF6EB4',
};

// ═══ POLY-PUFF LIGHT — Secondary theme ═══
const LIGHT = {
  bg: '#F0F2FA',
  card: '#FFFFFF',
  cardAlt: '#E8ECF8',
  cardGlass: 'rgba(255, 255, 255, 0.8)',

  text: '#0A0E1A',
  textSec: '#4A5068',
  textMuted: '#8B95B0',
  border: '#D0D5E8',

  cyan: '#0097A7',
  cyanLight: '#00BCD4',
  cyanDark: '#E0F7FA',
  cyanGlow: 'rgba(0, 151, 167, 0.1)',

  purple: '#7C3AED',
  purpleLight: '#9F67FF',
  purpleDark: '#EDE7FF',
  purpleGlow: 'rgba(124, 58, 237, 0.1)',
  pink: '#E91E8C',
  pinkLight: '#FF6EB4',

  emerald: '#059669',
  emeraldLight: '#10B981',
  emeraldDark: '#D1FAE5',

  amber: '#D97706',
  amberLight: '#F59E0B',
  amberDark: '#FEF3C7',

  red: '#DC2626',
  redLight: '#EF4444',
  redDark: '#FEE2E2',

  blue: '#0097A7',
  blueLight: '#00BCD4',
  blueDark: '#E0F7FA',
  gold: '#D97706',

  inputBg: '#F0F2FA',
  inputBorder: '#D0D5E8',
  inputFocus: '#0097A7',
  tabBar: '#FFFFFF',
  tabBorder: '#E8ECF8',

  glowCyan: '#0097A7',
  glowPurple: '#7C3AED',
  glowPink: '#E91E8C',
};

const ThemeContext = createContext({
  colors: DARK,
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then(val => {
      if (val === 'light') setIsDark(false);
    }).catch(() => {});
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try { await AsyncStorage.setItem('themeMode', next ? 'dark' : 'light'); } catch (e) {}
  };

  return (
    <ThemeContext.Provider value={{ colors: isDark ? DARK : LIGHT, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export { DARK, LIGHT };
