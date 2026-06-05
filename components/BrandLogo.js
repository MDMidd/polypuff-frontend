/**
 * BrandLogo — Poly-Puff Brand Assets
 * ====================================
 *
 * Reusable components for the Poly-Puff logo throughout the app.
 *
 * Usage:
 *   import { BrandLogo, BrandText, LogoHeader } from '../components/BrandLogo';
 *
 *   <BrandLogo height={40} />               — 3D logo image
 *   <BrandText size={20} />                 — Styled "Poly-Puff" text
 *   <LogoHeader />                          — Full header with logo
 *
 * BRAND COLOR: #ADD8E6 (baby blue from the claymorphic letters)
 *
 * FILE: components/BrandLogo.js
 * LOCATION: D:\Project\MyProject\translation-trainer-frontend\components\BrandLogo.js
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { scaledFont } from '../utils/accessibility';

// ── Brand constants ──
export const BRAND_BLUE = '#ADD8E6';
export const BRAND_BLUE_DARK = '#8BB8C9';  // for dark backgrounds
export const BRAND_BLUE_LIGHT = '#C5E4F0'; // lighter variant

// ── BrandLogo: The 3D claymorphic logo image ──
export function BrandLogo({ height = 40, style }) {
  // Aspect ratio of the logo: 1647 x 374 ≈ 4.4:1
  const width = Math.round(height * 4.4);

  return (
    <Image
      source={require('../assets/images/logo-header.png')}
      style={[{ width, height, resizeMode: 'contain' }, style]}
      accessibilityRole="image"
      accessibilityLabel="Poly-Puff logo"
    />
  );
}

// ── BrandText: Styled "Poly-Puff" text that matches the logo color ──
export function BrandText({ size = 20, style, color }) {
  return (
    <Text
      style={[
        {
          fontSize: scaledFont(size),
          fontWeight: '800',
          color: color || BRAND_BLUE,
          letterSpacing: 0.5,
        },
        style,
      ]}
      accessibilityLabel="Poly-Puff"
    >
      Poly-Puff
    </Text>
  );
}

// ── LogoHeader: Full header bar with logo, for use at the top of key screens ──
export function LogoHeader({ subtitle, style }) {
  return (
    <View style={[styles.headerContainer, style]}>
      <BrandLogo height={36} />
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  subtitle: {
    fontSize: scaledFont(12),
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BrandLogo;
