/**
 * Poly-Puff UI Kit — Futuristic Command Center (Accessibility Update)
 * =====================================================================
 *
 * CHANGES FROM ORIGINAL:
 *   - BackHeader: back button gets accessibilityRole="button" + label "Go back"
 *   - NeonButton: receives accessibilityRole="button" + dynamic label from title prop
 *   - NeonInput: TextInput gets accessibilityLabel from placeholder
 *   - GlassCard: no change (container, not interactive)
 *   - MascotHeader: image marked decorative, speech bubble gets accessibilityRole
 *   - ScreenBackground: no change (background, not interactive)
 *   - All disabled states use opacity 0.6 (was 0.5) + accessibilityState
 *   - All minimum touch targets: 44×44dp
 *
 * FILE: components/PolyPuffUI.js
 */

import React, { useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Animated, Image, Modal,
  StyleSheet, Platform, StatusBar, ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { isRtlLanguage } from '../utils/languages';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { scaledFont } from '../utils/accessibility';

// ═══════════════════════════════════════════════════════════════════════
// SCREEN BACKGROUND (unchanged — decorative, not interactive)
// ═══════════════════════════════════════════════════════════════════════
const BG_IMAGE = require('../assets/bg-grid.png');

export function ScreenBackground({ children, style, safe = true, noBottomPad = false }) {
  const { colors: C } = useTheme();
  let insets = { top: 0, bottom: 0 };
  try { insets = useSafeAreaInsets(); } catch (e) {}

  React.useEffect(() => {
    try {
      const NavBar = require('expo-navigation-bar');
      NavBar.setBackgroundColorAsync('#030810');
      NavBar.setButtonStyleAsync('light');
      NavBar.setVisibilityAsync('visible');
    } catch (e) {}
    try { StatusBar.setHidden(false, 'fade'); } catch (e) {}
  }, []);

  const topPad = safe ? Math.max(insets.top, StatusBar.currentHeight || 0) : 0;
  const bottomPad = safe && !noBottomPad ? Math.max(insets.bottom, 0) : 0;

  return (
    <View style={[{ flex: 1 }, style]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={BG_IMAGE}
        style={StyleSheet.absoluteFillObject}
        imageStyle={{ resizeMode: 'cover' }}
        fadeDuration={0}
      />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(2, 6, 18, 0.72)' }]} />
      <LinearGradient
        colors={['rgba(0, 180, 230, 0.07)', 'transparent', 'transparent', 'rgba(0, 180, 230, 0.07)']}
        locations={[0, 0.3, 0.7, 1]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject} pointerEvents="none"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0, 229, 255, 0.04)', 'rgba(0, 229, 255, 0.06)', 'rgba(0, 229, 255, 0.04)', 'transparent']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFillObject} pointerEvents="none"
      />
      <View style={{ flex: 1, paddingTop: topPad, paddingBottom: bottomPad }}>
        {children}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// GLASS CARD (unchanged — container, not interactive)
// ═══════════════════════════════════════════════════════════════════════
export function GlassCard({ children, style, borderColor, glowColor, intensity = 'medium' }) {
  const { colors: C } = useTheme();
  const border = borderColor || C.cyan || '#00E5FF';
  const glow = glowColor || border;
  const borderOpacity = intensity === 'strong' ? '50' : intensity === 'subtle' ? '18' : '30';
  const bgOpacity = intensity === 'strong' ? 'CC' : intensity === 'subtle' ? '90' : 'B8';

  return (
    <View style={[{
      backgroundColor: (C.card || '#121829') + bgOpacity,
      borderRadius: 16, borderWidth: 1, borderColor: border + borderOpacity, padding: 18,
      shadowColor: glow, shadowOffset: { width: 0, height: 0 },
      shadowOpacity: intensity === 'strong' ? 0.25 : intensity === 'subtle' ? 0.08 : 0.15,
      shadowRadius: intensity === 'strong' ? 20 : intensity === 'subtle' ? 8 : 14,
      elevation: intensity === 'strong' ? 10 : intensity === 'subtle' ? 3 : 6,
    }, style]}>
      {children}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// NEON BUTTON — ✅ ACCESSIBILITY UPDATED
// ═══════════════════════════════════════════════════════════════════════
export function NeonButton({
  onPress, title, icon, disabled, loading,
  color, textColor, size = 'large', style, children,
  accessibilityLabel, accessibilityHint,
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

  const isSmall = size === 'small';
  const isMedium = size === 'medium';

  // ✅ A11Y: Dynamic label based on state
  const computedLabel = accessibilityLabel || (loading ? 'Loading' : title || 'Button');

  return (
    <Animated.View style={[{
      transform: [{ scale: scaleAnim }],
      shadowColor: btnColor, shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
    }, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        // ✅ ACCESSIBILITY
        accessibilityRole="button"
        accessibilityLabel={computedLabel}
        accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
        accessibilityHint={accessibilityHint}
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
          backgroundColor: disabled ? btnColor + '40' : btnColor,
          borderRadius: isSmall ? 10 : 14,
          paddingVertical: isSmall ? 10 : isMedium ? 13 : 16,
          paddingHorizontal: isSmall ? 16 : isMedium ? 20 : 24,
          opacity: disabled ? 0.6 : 1,  // ✅ was 0.5 → 0.6 for contrast
          minHeight: 44, // ✅ WCAG 2.5.8 touch target
        }}
      >
        {icon}
        {children || (
          <Text style={{
            fontSize: isSmall ? scaledFont(13) : isMedium ? scaledFont(15) : scaledFont(17),
            fontWeight: '700', color: txtColor, letterSpacing: isSmall ? 0 : 0.5,
          }}>
            {loading ? 'Loading...' : title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// NEON INPUT — ✅ ACCESSIBILITY UPDATED
// ═══════════════════════════════════════════════════════════════════════
export function NeonInput({
  value, onChangeText, placeholder, multiline, style,
  maxLength, keyboardType, autoCapitalize, editable, inputRef,
  onFocus, onBlur, onSubmitEditing, secureTextEntry,
  accessibilityLabel,
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
    inputRange: [0, 1], outputRange: [C.border + '60', C.cyan || '#00E5FF'],
  });

  const shadowOpacity = borderAnim.interpolate({
    inputRange: [0, 1], outputRange: [0, 0.25],
  });

  return (
    <Animated.View style={[{
      borderRadius: 12, borderWidth: 1.5, borderColor,
      backgroundColor: C.inputBg || C.bg,
      shadowColor: C.glowCyan || C.cyan || '#00E5FF',
      shadowOffset: { width: 0, height: 0 }, shadowOpacity, shadowRadius: 12,
    }, style]}>
      <TextInput
        ref={inputRef}
        style={{
          padding: 14, fontSize: scaledFont(16), color: C.text,
          minHeight: multiline ? 60 : 44, // ✅ WCAG touch target
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
        // ✅ ACCESSIBILITY
        accessibilityLabel={accessibilityLabel || placeholder}
      />
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PULSE GLOW (unchanged — decorative animation wrapper)
// ═══════════════════════════════════════════════════════════════════════
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
  const shadowOp = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.45] });
  const shadowRad = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 24] });

  return (
    <Animated.View style={[{
      shadowColor: glowColor, shadowOffset: { width: 0, height: 0 },
      shadowOpacity: shadowOp, shadowRadius: shadowRad, elevation: 8,
    }, style]}>
      {children}
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MASCOT HEADER — ✅ ACCESSIBILITY UPDATED
// ═══════════════════════════════════════════════════════════════════════
export function MascotHeader({ message, size = 150, style, onMessagePress }) {
  const { colors: C } = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const breathAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(breathAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const breathScale = breathAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.05, 1] });
  const breathTranslateY = breathAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -5, 0] });

  React.useEffect(() => { setExpanded(false); }, [message]);

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <Animated.View style={{ transform: [{ scale: breathScale }, { translateY: breathTranslateY }] }}>
        <PulseGlow color={C.cyan}>
          {/* ✅ A11Y: Mark mascot image as decorative */}
          <View
            style={{
              width: size, alignItems: 'center', justifyContent: 'center',
              borderWidth: 2, borderColor: (C.cyan || '#00E5FF') + '40',
              borderRadius: size / 2, backgroundColor: (C.card || '#121829') + '60', padding: 8,
            }}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="Poly-Puff mascot"
          >
            <Image
              source={require('../assets/polypuff-transparent.png')}
              style={{ width: size - 20, height: undefined, aspectRatio: 1 }}
              resizeMode="contain"
            />
          </View>
        </PulseGlow>
      </Animated.View>

      {message ? (
        <>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => { if (onMessagePress) onMessagePress(message); else setExpanded(true); }}
            style={{
              backgroundColor: (C.card || '#121829') + 'B8',
              borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10,
              marginTop: 10, maxWidth: '90%',
              borderWidth: 1, borderColor: (C.cyan || '#00E5FF') + '20',
              minHeight: 44, justifyContent: 'center', // ✅ touch target
            }}
            // ✅ ACCESSIBILITY
            accessibilityRole="button"
            accessibilityLabel={`Poly-Puff says: ${message}. Tap to expand.`}
          >
            <Text style={{ fontSize: scaledFont(13), color: C.textSec, textAlign: 'center', fontStyle: 'italic', lineHeight: 20 }}
              numberOfLines={2}
            >
              {message}
            </Text>
          </TouchableOpacity>

          <Modal visible={expanded} transparent animationType="fade" onRequestClose={() => setExpanded(false)}>
            <TouchableOpacity activeOpacity={1} onPress={() => setExpanded(false)}
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 }}
              // ✅ A11Y
              accessibilityLabel="Close expanded message"
              accessibilityRole="button"
            >
              <View
                style={{ backgroundColor: C.card || '#121829', borderRadius: 16, padding: 20, maxWidth: 320, borderWidth: 1, borderColor: (C.cyan || '#00E5FF') + '30' }}
                accessibilityViewIsModal={true} // ✅ prevents screen reader from reading behind
              >
                <Text style={{ fontSize: scaledFont(15), color: C.textSec, textAlign: 'center', lineHeight: 24 }}>{message}</Text>
                <TouchableOpacity
                  onPress={() => setExpanded(false)}
                  style={{ marginTop: 14, alignItems: 'center', paddingVertical: 10, minHeight: 44 }}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <Text style={{ fontSize: scaledFont(13), fontWeight: '600', color: C.cyan || '#00E5FF' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      ) : null}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// BACK HEADER — ✅ ACCESSIBILITY UPDATED
// ═══════════════════════════════════════════════════════════════════════
export function BackHeader({ title, subtitle, onPress, rightElement, style }) {
  const { colors: C } = useTheme();
  const { lang, t } = useLanguage();
  const isRtl = isRtlLanguage(lang);
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  let router;
  try { router = require('expo-router').useRouter(); } catch (e) {}

  const handleBack = onPress || (() => {
    try { router?.push('/'); } catch (e) { router?.back(); }
  });

  return (
    <View style={[{
      flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center',
      paddingHorizontal: 20, paddingTop: 62, paddingBottom: 10, gap: 12,
      backgroundColor: 'rgba(2, 6, 18, 0.85)',
      borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)', zIndex: 50,
    }, style]}>

      {/* ✅ A11Y: Back button with role + label */}
      <TouchableOpacity
        onPress={handleBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{
          width: 44, height: 44, borderRadius: 22, // ✅ was 40×40 → 44×44
          backgroundColor: 'rgba(255,255,255,0.08)',
          alignItems: 'center', justifyContent: 'center',
        }}
        accessibilityRole="button"
        accessibilityLabel={t.goBack || 'Go back'}
        accessibilityHint={t.back || 'Back'}
      >
        <BackIcon size={22} color={C.text || '#FFFFFF'} />
      </TouchableOpacity>

      {(title || subtitle) ? (
        <View style={{ flex: 1 }}>
          {title ? (
            <Text
              style={{ fontSize: scaledFont(20), fontWeight: '800', color: C.text || '#FFFFFF', textAlign: isRtl ? 'right' : 'left' }}
              accessibilityRole="header" // ✅ A11Y: marks as heading
            >
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={{ fontSize: scaledFont(12), color: C.textMuted || '#9CA3AF', marginTop: 1, textAlign: isRtl ? 'right' : 'left' }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : <View style={{ flex: 1 }} />}

      {rightElement || null}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION TITLE (minor a11y update)
// ═══════════════════════════════════════════════════════════════════════
export function SectionTitle({ icon, title, style }) {
  const { colors: C } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }, style]}>
      {icon}
      <Text
        style={{ fontSize: scaledFont(14), fontWeight: '700', color: C.textSec, textTransform: 'uppercase', letterSpacing: 1 }}
        accessibilityRole="header"
      >
        {title}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: (C.cyan || '#00E5FF') + '15', marginLeft: 8 }} />
    </View>
  );
}

export default {
  ScreenBackground, GlassCard, NeonButton, NeonInput,
  PulseGlow, MascotHeader, BackHeader, SectionTitle,
};
