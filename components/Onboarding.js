/**
 * Onboarding Walkthrough - Poly-Puff v6.2
 * ===================================================
 * 
 * Shown only on first launch (checked via AsyncStorage).
 * 4 swipeable screens introducing the app's features.
 * After completing, user goes to the Profile tab.
 * 
 * FILE: components/Onboarding.js
 * GOES IN: translation-trainer-frontend/components/Onboarding.js
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  FlatList, Animated,
} from 'react-native';
import {
  BookOpen, Trophy, BarChart3, Globe, ArrowRight, Check,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    icon: (color) => <Globe size={64} color={color} />,
    title: 'Welcome to\nPoly-Puff',
    subtitle: 'Master English through translation practice',
    body: 'Translate sentences from your native language into English and get instant, detailed feedback on your grammar.',
    color: 'emerald',
  },
  {
    icon: (color) => <BookOpen size={64} color={color} />,
    title: 'Smart Grammar\nChecking',
    subtitle: '193 rules • 13 languages • CEFR A1-C2',
    body: 'Our database of grammar rules catches errors before AI does. Tap any highlighted word to see the exact rule and examples in your language.',
    color: 'blue',
  },
  {
    icon: (color) => <Trophy size={64} color={color} />,
    title: 'Level Up &\nEarn Badges',
    subtitle: 'XP, streaks, and daily goals',
    body: 'Earn XP for every exercise, unlock badges, and maintain your daily streak. Challenge yourself with timed modes and track your weak areas.',
    color: 'amber',
  },
  {
    icon: (color) => <BarChart3 size={64} color={color} />,
    title: 'Track Your\nProgress',
    subtitle: 'See how far you\'ve come',
    body: 'Detailed progress reports, drillable weak areas, grammar lessons with native language tips, and PDF reports you can share with teachers.',
    color: 'purple',
  },
];

export default function Onboarding({ onComplete }) {
  const { colors: C } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const colorMap = {
    emerald: C.emerald,
    blue: C.blue,
    amber: C.amber,
    purple: C.purple,
  };
  const colorMapLight = {
    emerald: C.emeraldLight,
    blue: C.blueLight,
    amber: C.amberLight,
    purple: C.purpleLight || '#C4B5FD',
  };

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const renderSlide = ({ item, index }) => {
    const accent = colorMap[item.color];
    const accentLight = colorMapLight[item.color];
    return (
      <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
        <View style={[styles.iconContainer, { backgroundColor: accent + '15', borderColor: accent + '30' }]}>
          {item.icon(accent)}
        </View>
        <Text style={[styles.title, { color: C.text }]}>{item.title}</Text>
        <Text style={[styles.subtitle, { color: accentLight }]}>{item.subtitle}</Text>
        <Text style={[styles.body, { color: C.textSec }]}>{item.body}</Text>
      </View>
    );
  };

  const isLast = currentIndex === SLIDES.length - 1;
  const accent = colorMap[SLIDES[currentIndex].color];

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((slide, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === currentIndex ? colorMap[slide.color] : C.textMuted + '40',
                width: i === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomRow}>
        {!isLast && (
          <TouchableOpacity onPress={onComplete} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: C.textMuted }]}>Skip</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: accent }, isLast && styles.nextBtnWide]}
          onPress={goNext}
        >
          {isLast ? (
            <>
              <Check size={20} color="#fff" />
              <Text style={styles.nextBtnText}>Get Started</Text>
            </>
          ) : (
            <>
              <Text style={styles.nextBtnText}>Next</Text>
              <ArrowRight size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 40, paddingBottom: 120,
  },
  iconContainer: {
    width: 120, height: 120, borderRadius: 30, alignItems: 'center',
    justifyContent: 'center', marginBottom: 32, borderWidth: 2,
  },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 10, lineHeight: 40 },
  subtitle: { fontSize: 15, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  body: { fontSize: 16, textAlign: 'center', lineHeight: 24 },

  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 24 },
  dot: { height: 8, borderRadius: 4 },

  bottomRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 50,
  },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 20 },
  skipText: { fontSize: 16, fontWeight: '500' },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14,
    marginLeft: 'auto',
  },
  nextBtnWide: { flex: 1, marginLeft: 0 },
  nextBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
