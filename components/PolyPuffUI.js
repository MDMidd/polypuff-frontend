/**
 * Poly-Puff UI Kit — Futuristic Command Center
 * ==============================================
 * 
 * Reusable components with Neon Pulse / Glassmorphism:
 *   - ScreenBackground: Radial gradient (dark edges, deep teal center)
 *   - GlassCard: Semi-transparent dark bg, thin cyan border
 *   - NeonButton: Cyan glow, pulse animation on press
 *   - PulseGlow: Animated glow wrapper for any element
 *   - NeonInput: Input field with glowing focus state
 *   - MascotHeader: Poly-Puff mascot with speech bubble
 * 
 * FILE: components/PolyPuffUI.js
 */

import React, { useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Animated, Image,
  StyleSheet, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

// ═══════════════════════════════════════════
// SCREEN BACKGROUND — Radial gradient effect
// ═══════════════════════════════════════════
export function ScreenBackground({ children, style }) {
  const { colors: C } = useTheme();

  // Simulate radial gradient with layered linear gradients
  return (
    <View style={[{ flex: 1, backgroundColor: C.bg }, style]}>
      {/* Vertical gradient: dark edges, lighter center */}
      <LinearGradient
        colors={[
          C.bg,                    // Dark top edge
          '#0D1926',               // Slightly lighter
          '#0F1F2E',               // Deep teal center
          '#0D1926',               // Slightly lighter
          C.bg,                    // Dark bottom edge
        ]}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Horizontal teal glow in center */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(0, 229, 255, 0.03)',  // Subtle cyan tint
          'rgba(0, 229, 255, 0.05)',  // Peak glow
          'rgba(0, 229, 255, 0.03)',
          'transparent',
        ]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </View>
  );
}

// ═══════════════════════════════════════════
// GLASS CARD — Semi-transparent, cyan border
// ═══════════════════════════════════════════
export function GlassCard({ children, style, borderColor, glowColor, intensity = 'medium' }) {
  const { colors: C } = useTheme();

  const border = borderColor || C.cyan || '#00E5FF';
  const glow = glowColor || border;

  const borderOpacity = intensity === 'strong' ? '50' : intensity === 'subtle' ? '18' : '30';
  const bgOpacity = intensity === 'strong' ? 'CC' : intensity === 'subtle' ? '90' : 'B8';

  return (
    <View style={[{
      backgroundColor: (C.card || '#121829') + bgOpacity,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: border + borderOpacity,
      padding: 18,
      // Glow shadow
      shadowColor: glow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: intensity === 'strong' ? 0.25 : intensity === 'subtle' ? 0.08 : 0.15,
      shadowRadius: intensity === 'strong' ? 20 : intensity === 'subtle' ? 8 : 14,
      elevation: intensity === 'strong' ? 10 : intensity === 'subtle' ? 3 : 6,
    }, style]}>
      {children}
    </View>
  );
}

// ═══════════════════════════════════════════
// NEON BUTTON — Cyan glow, pulse on press
// ═══════════════════════════════════════════
export function NeonButton({
  onPress, title, icon, disabled, loading,
  color, textColor, size = 'large', style, children,
}) {
  const { colors: C } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const btnColor = color || C.cyan || '#00E5FF';
  const txtColor = textColor || '#000';

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 50 }),
      Animated.timing(glowAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
    ]).start();
  }, []);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 3, tension: 100 }),
      Animated.timing(glowAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  }, []);

  const glowShadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 28],
  });

  const glowShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const isSmall = size === 'small';
  const isMedium = size === 'medium';

  return (
    <Animated.View style={[{
      transform: [{ scale: scaleAnim }],
      shadowColor: btnColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    }, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: disabled ? btnColor + '40' : btnColor,
          borderRadius: isSmall ? 10 : 14,
          paddingVertical: isSmall ? 10 : isMedium ? 13 : 16,
          paddingHorizontal: isSmall ? 16 : isMedium ? 20 : 24,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {icon}
        {children || (
          <Text style={{
            fontSize: isSmall ? 13 : isMedium ? 15 : 17,
            fontWeight: '700',
            color: txtColor,
            letterSpacing: isSmall ? 0 : 0.5,
          }}>
            {loading ? 'Loading...' : title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ═══════════════════════════════════════════
// NEON INPUT — Glowing focus border
// ═══════════════════════════════════════════
export function NeonInput({
  value, onChangeText, placeholder, multiline, style,
  maxLength, keyboardType, autoCapitalize, editable, inputRef,
  onFocus, onBlur, onSubmitEditing, secureTextEntry,
}) {
  const { colors: C } = useTheme();
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback((e) => {
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e) => {
    Animated.timing(borderAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
    onBlur?.(e);
  }, [onBlur]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.border + '60', C.cyan || '#00E5FF'],
  });

  const shadowOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.25],
  });

  return (
    <Animated.View style={[{
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor,
      backgroundColor: C.inputBg || C.bg,
      shadowColor: C.glowCyan || C.cyan || '#00E5FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity,
      shadowRadius: 12,
    }, style]}>
      <TextInput
        ref={inputRef}
        style={{
          padding: 14,
          fontSize: 16,
          color: C.text,
          minHeight: multiline ? 60 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={secureTextEntry}
      />
    </Animated.View>
  );
}

// ═══════════════════════════════════════════
// PULSE GLOW — Animated wrapper for any element
// ═══════════════════════════════════════════
export function PulseGlow({ children, color, active = true, style }) {
  const { colors: C } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!active) { pulseAnim.setValue(0); return; }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [active]);

  const glowColor = color || C.cyan || '#00E5FF';

  const shadowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.45],
  });

  const shadowRadius = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 24],
  });

  return (
    <Animated.View style={[{
      shadowColor: glowColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity,
      shadowRadius,
      elevation: 8,
    }, style]}>
      {children}
    </Animated.View>
  );
}

// ═══════════════════════════════════════════
// MASCOT HEADER — Poly-Puff with speech bubble
// ═══════════════════════════════════════════
export function MascotHeader({ message, size = 72, style }) {
  const { colors: C } = useTheme();

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <PulseGlow color={C.cyan}>
        <View style={{
          width: size, height: size, borderRadius: size / 2,
          borderWidth: 2, borderColor: (C.cyan || '#00E5FF') + '60',
          overflow: 'hidden', backgroundColor: C.card,
        }}>
          <Image
            source={require('../assets/polypuff-mascot.png')}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            resizeMode="cover"
          />
        </View>
      </PulseGlow>

      {message ? (
        <View style={{
          backgroundColor: (C.card || '#121829') + 'B8',
          borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8,
          marginTop: 10, maxWidth: '85%',
          borderWidth: 1, borderColor: (C.cyan || '#00E5FF') + '20',
        }}>
          <Text style={{ fontSize: 13, color: C.textSec, textAlign: 'center', fontStyle: 'italic' }}>
            {message}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// ═══════════════════════════════════════════
// SECTION TITLE — Subtle divider with glow
// ═══════════════════════════════════════════
export function SectionTitle({ icon, title, style }) {
  const { colors: C } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }, style]}>
      {icon}
      <Text style={{ fontSize: 14, fontWeight: '700', color: C.textSec, textTransform: 'uppercase', letterSpacing: 1 }}>
        {title}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: (C.cyan || '#00E5FF') + '15', marginLeft: 8 }} />
    </View>
  );
}

export default {
  ScreenBackground,
  GlassCard,
  NeonButton,
  NeonInput,
  PulseGlow,
  MascotHeader,
  SectionTitle,
};
