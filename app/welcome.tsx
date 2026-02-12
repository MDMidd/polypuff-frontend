/**
 * Entry Screen - Poly-Puff v2.0
 * ==============================
 * 
 * Large glowing circular Poly-Puff button.
 * Speech bubble: "Let's start learning English!"
 * On press: happy sound + vibration → navigate to Profile tab.
 * 
 * FILE: app/welcome.tsx
 */

import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Image, Animated, StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { hapticSuccess, hapticHeavy } from '../services/sounds';

export default function WelcomeScreen() {
  const { colors: C } = useTheme();
  const router = useRouter();

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start(() => {
      // Then show speech bubble
      Animated.spring(bubbleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
    });

    // Continuous pulse on the mascot ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Continuous glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    hapticHeavy();
    setTimeout(() => hapticSuccess(), 150);
    router.replace('/(tabs)');
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <LinearGradient
      colors={[C.bg, '#0D1926', '#0F1F2E', '#0D1926', C.bg]}
      locations={[0, 0.2, 0.5, 0.8, 1]}
      style={styles.container}
    >
      {/* Title */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center', marginBottom: 40 }}>
        <Text style={[styles.title, { color: C.cyan || '#00E5FF' }]}>POLY-PUFF</Text>
        <Text style={[styles.subtitle, { color: C.textSec }]}>The AI Translation Trainer</Text>
      </Animated.View>

      {/* Glowing Mascot Button */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
          <Animated.View style={[styles.mascotRing, {
            borderColor: (C.cyan || '#00E5FF') + '60',
            backgroundColor: (C.card || '#121829') + '80',
            shadowColor: C.cyan || '#00E5FF',
            shadowOpacity: glowOpacity,
            shadowRadius: 30,
            elevation: 15,
          }]}>
            <Image
              source={require('../assets/polypuff-transparent.png')}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Speech Bubble */}
      <Animated.View style={[styles.speechBubble, {
        backgroundColor: (C.card || '#121829') + 'CC',
        borderColor: (C.cyan || '#00E5FF') + '30',
        opacity: bubbleAnim,
        transform: [{ scale: bubbleAnim }],
      }]}>
        <Text style={[styles.speechText, { color: C.text }]}>
          Let's start learning English! 🌍
        </Text>
        {/* Bubble arrow */}
        <View style={[styles.bubbleArrow, { borderBottomColor: (C.card || '#121829') + 'CC' }]} />
      </Animated.View>

      {/* Tap hint */}
      <Animated.View style={{ opacity: fadeAnim, marginTop: 40, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Sparkles size={16} color={C.cyan || '#00E5FF'} />
        <Text style={{ fontSize: 14, color: C.textMuted, letterSpacing: 0.5 }}>Tap Poly-Puff to begin</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 42, fontWeight: '900', letterSpacing: 4, marginBottom: 4 },
  subtitle: { fontSize: 16, fontWeight: '500', letterSpacing: 1 },
  mascotRing: {
    width: 200, height: 200, borderRadius: 100,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
  },
  mascotImage: { width: 160, height: 160 },
  speechBubble: {
    marginTop: 24, paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 20, borderWidth: 1, maxWidth: '80%',
  },
  bubbleArrow: {
    position: 'absolute', top: -10, alignSelf: 'center',
    width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10,
    borderBottomWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },
  speechText: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
