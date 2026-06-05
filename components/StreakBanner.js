/**
 * StreakBanner — In-App Streak Notification
 * ===========================================
 *
 * Shows a contextual banner when the student returns to the app.
 * - If they haven't practiced today: warning with streak-at-risk message
 * - If they have: celebration with streak count
 * - Dismissible with X button
 *
 * Usage (in _layout.tsx or index.tsx):
 *   import StreakBanner from '../components/StreakBanner';
 *   <StreakBanner />
 *
 * FILE: components/StreakBanner.js
 * LOCATION: D:\Project\MyProject\translation-trainer-frontend\components\StreakBanner.js
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { X, Flame, Trophy, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getInAppBanner, recordPracticeToday } from '../services/notifications';
import { scaledFont } from '../utils/accessibility';

export default function StreakBanner() {
  const { colors: C } = useTheme();
  const [banner, setBanner] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const slideAnim = useState(() => new Animated.Value(-100))[0];

  useFocusEffect(useCallback(() => {
    setDismissed(false);
    loadBanner();
  }, []));

  const loadBanner = async () => {
    try {
      const data = await getInAppBanner();
      if (data) {
        setBanner(data);
        slideAnim.setValue(-100);
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, friction: 8 }).start();
      }
    } catch (e) {}
  };

  const dismiss = () => {
    Animated.timing(slideAnim, { toValue: -100, duration: 200, useNativeDriver: true }).start(() => {
      setDismissed(true);
    });
  };

  if (!banner || dismissed) return null;

  const isAtRisk = !banner.practicedToday && banner.streak > 0;
  const isDone = banner.practicedToday;

  const bgColor = isAtRisk
    ? (C.amber || '#FFBE0B') + '18'
    : isDone
    ? (C.emerald || '#00E5A0') + '15'
    : (C.cyan || '#00E5FF') + '12';

  const borderColor = isAtRisk
    ? (C.amber || '#FFBE0B') + '40'
    : isDone
    ? (C.emerald || '#00E5A0') + '30'
    : (C.cyan || '#00E5FF') + '25';

  const iconColor = isAtRisk
    ? C.amber || '#FFBE0B'
    : isDone
    ? C.emerald || '#00E5A0'
    : C.cyan || '#00E5FF';

  return (
    <Animated.View
      style={{
        marginHorizontal: 16, marginBottom: 12,
        backgroundColor: bgColor,
        borderRadius: 14, borderWidth: 1, borderColor,
        padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
        transform: [{ translateY: slideAnim }],
      }}
      accessibilityRole="alert"
      accessibilityLabel={`${banner.title} ${banner.subtitle}`}
    >
      {/* Icon */}
      <View style={{
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: iconColor + '20',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {isAtRisk ? <AlertTriangle size={20} color={iconColor} /> :
         isDone ? <Trophy size={20} color={iconColor} /> :
         <Flame size={20} color={iconColor} />}
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: C.text }}>
          {banner.title}
        </Text>
        <Text style={{ fontSize: scaledFont(12), color: C.textMuted, marginTop: 2, lineHeight: 17 }}>
          {banner.subtitle}
        </Text>
        {banner.xpToMilestone <= 30 && banner.xpToMilestone > 0 && (
          <Text style={{ fontSize: scaledFont(11), color: C.purple || '#B06CFF', fontWeight: '600', marginTop: 3 }}>
            🎯 {banner.xpToMilestone} XP to next milestone!
          </Text>
        )}
      </View>

      {/* Streak badge */}
      {banner.streak > 0 && (
        <View style={{
          backgroundColor: iconColor + '20', paddingHorizontal: 10, paddingVertical: 4,
          borderRadius: 12, alignItems: 'center',
        }}>
          <Text style={{ fontSize: scaledFont(16), fontWeight: '900', color: iconColor }}>
            {banner.streak}
          </Text>
          <Text style={{ fontSize: 8, fontWeight: '700', color: iconColor, letterSpacing: 0.5 }}>
            🔥 DAYS
          </Text>
        </View>
      )}

      {/* Dismiss */}
      <TouchableOpacity
        onPress={dismiss}
        style={{ minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }}
        accessibilityRole="button"
        accessibilityLabel="Dismiss streak banner"
      >
        <X size={16} color={C.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
}
