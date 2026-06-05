/**
 * PolyPuffScene.js (Word Burst Update)
 *
 * CHANGES:
 *   - Tap mascot → 3-5 level-appropriate English words burst out and fade away
 *   - Words are chosen based on the student's CEFR level (read from AsyncStorage)
 *   - Each word flies in a random direction with random rotation and fades out
 *   - All existing interactions preserved: drag, wobble, squish, spin, eye tracking
 *
 * FILE: components/PolyPuffScene.js
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, Image, StyleSheet, Animated, PanResponder,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MASCOT_SIZE = 180;

// ── Word banks by CEFR level ──────────────────────────────────────────────────
// Each level contains words the student is working on or should know.
const WORD_BANKS = {
  A0: ['cat', 'dog', 'yes', 'no', 'hi', 'bye', 'sun', 'run', 'hot', 'big', 'red', 'cup', 'one', 'two', 'up', 'go', 'me', 'you'],
  A1: ['hello', 'water', 'happy', 'house', 'apple', 'school', 'family', 'friend', 'today', 'morning', 'simple', 'always', 'never', 'often', 'colour', 'music', 'bread', 'sleep'],
  A2: ['journey', 'market', 'weather', 'holiday', 'describe', 'remember', 'problem', 'answer', 'message', 'airport', 'compare', 'culture', 'language', 'opinion', 'suggest', 'achieve', 'village', 'popular'],
  B1: ['curious', 'although', 'however', 'opinion', 'regarding', 'therefore', 'various', 'improve', 'consider', 'decision', 'encourage', 'moreover', 'contrast', 'meanwhile', 'community', 'negotiate', 'essential', 'strategy'],
  B2: ['substantial', 'perceive', 'subsequent', 'contribute', 'maintain', 'implement', 'evaluate', 'perspective', 'acknowledge', 'comprehensive', 'emphasise', 'facilitate', 'nevertheless', 'furthermore', 'consequently', 'demonstrate', 'collaborate', 'innovation'],
  C1: ['ambiguous', 'eloquent', 'meticulous', 'resilience', 'nuance', 'profound', 'rhetoric', 'scrutiny', 'paradox', 'alleviate', 'corroborate', 'hitherto', 'juxtapose', 'ubiquitous', 'pragmatic', 'inevitable', 'permeate', 'articulate'],
  C2: ['ephemeral', 'sycophantic', 'obfuscate', 'sardonic', 'perspicacious', 'melancholy', 'soliloquy', 'magnanimous', 'equivocate', 'vicissitude', 'circumlocution', 'ineffable', 'propitious', 'recalcitrant', 'verisimilitude', 'loquacious', 'perfidious', 'inscrutable'],
};

// Colour per level — matches your app's accuracy heatmap palette
const LEVEL_COLOURS = {
  A0: '#94a3b8',
  A1: '#94a3b8',
  A2: '#FFBE0B',
  B1: '#FFBE0B',
  B2: '#00E5FF',
  C1: '#00E5A0',
  C2: '#B06CFF',
};

// Pick N random unique words from a bank
function pickWords(bank, count) {
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ── Single floating word component ───────────────────────────────────────────
function FloatingWord({ word, colour, onDone }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(1)).current;
  const scale      = useRef(new Animated.Value(0.4)).current;
  const rotate     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Random direction: angle between 0 and 360 degrees
    const angle  = Math.random() * Math.PI * 2;
    const dist   = 80 + Math.random() * 60;   // how far it travels
    const tx     = Math.cos(angle) * dist;
    const ty     = Math.sin(angle) * dist - 30; // bias upward slightly
    const rot    = (Math.random() - 0.5) * 40; // ±20 degrees rotation
    const dur    = 1700 + Math.random() * 300;   // 1700–2000ms

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
      ]),
      Animated.timing(translateX, { toValue: tx,  duration: dur, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: ty,  duration: dur, useNativeDriver: true }),
      Animated.timing(rotate,     { toValue: rot, duration: dur, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(dur * 0.4),
        Animated.timing(opacity, { toValue: 0, duration: dur * 0.6, useNativeDriver: true }),
      ]),
    ]).start(() => onDone());
  }, []);

  const rotateDeg = rotate.interpolate({
    inputRange: [-40, 40],
    outputRange: ['-40deg', '40deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        alignSelf: 'center',
        top: '40%',
        transform: [
          { translateX },
          { translateY },
          { scale },
          { rotate: rotateDeg },
        ],
        opacity,
      }}
      pointerEvents="none"
    >
      <Text style={{
        fontSize: 15,
        fontWeight: '800',
        color: colour,
        textShadowColor: colour + '60',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
        letterSpacing: 0.5,
      }}>
        {word}
      </Text>
    </Animated.View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PolyPuffScene({ size: _ignored }) {
  const size = MASCOT_SIZE;

  // ── Word burst state ──────────────────────────────────────────────────────
  const [activeWords, setActiveWords] = useState([]); // [{id, word, colour}]
  const [studentLevel, setStudentLevel] = useState('B1');
  const wordIdRef = useRef(0);

  // Load student level once on mount
  useEffect(() => {
    AsyncStorage.getItem('userProfile')
      .then(data => {
        if (data) {
          const p = JSON.parse(data);
          if (p.level) setStudentLevel(p.level);
        }
      })
      .catch(() => {});
  }, []);

  const burstWords = useCallback(() => {
    const bank   = WORD_BANKS[studentLevel] || WORD_BANKS['B1'];
    const colour = LEVEL_COLOURS[studentLevel] || '#00E5FF';
    const count  = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5 words
    const words  = pickWords(bank, count);

    const newWords = words.map(word => ({
      id: ++wordIdRef.current,
      word,
      colour,
    }));

    setActiveWords(prev => [...prev, ...newWords]);
  }, [studentLevel]);

  const removeWord = useCallback((id) => {
    setActiveWords(prev => prev.filter(w => w.id !== id));
  }, []);

  // ── Existing animation refs ───────────────────────────────────────────────
  const floatAnim  = useRef(new Animated.Value(0)).current;
  const posX       = useRef(new Animated.Value(0)).current;
  const posY       = useRef(new Animated.Value(0)).current;
  const scaleX     = useRef(new Animated.Value(1)).current;
  const scaleY     = useRef(new Animated.Value(1)).current;
  const rotate     = useRef(new Animated.Value(0)).current;
  const wobble     = useRef(new Animated.Value(0)).current;
  const glowAnim   = useRef(new Animated.Value(0.6)).current;
  const glowScaleX = useRef(new Animated.Value(0.85)).current;

  const leftPupilX  = useRef(new Animated.Value(0)).current;
  const leftPupilY  = useRef(new Animated.Value(0)).current;
  const rightPupilX = useRef(new Animated.Value(0)).current;
  const rightPupilY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: -14, duration: 2000, useNativeDriver: false }),
      Animated.timing(floatAnim, { toValue: 0,   duration: 2000, useNativeDriver: false }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim,   { toValue: 1,    duration: 2000, useNativeDriver: false }),
      Animated.timing(glowAnim,   { toValue: 0.5,  duration: 2000, useNativeDriver: false }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowScaleX, { toValue: 0.95, duration: 2000, useNativeDriver: false }),
      Animated.timing(glowScaleX, { toValue: 0.75, duration: 2000, useNativeDriver: false }),
    ])).start();
  }, []);

  const moveEyes = (touchX, touchY) => {
    const nx = (touchX / size) * 2 - 1;
    const ny = (touchY / size) * 2 - 1;
    const MAX = 4;
    Animated.parallel([
      Animated.spring(leftPupilX,  { toValue: nx * MAX, useNativeDriver: false, speed: 30, bounciness: 2 }),
      Animated.spring(leftPupilY,  { toValue: ny * MAX, useNativeDriver: false, speed: 30, bounciness: 2 }),
      Animated.spring(rightPupilX, { toValue: nx * MAX, useNativeDriver: false, speed: 30, bounciness: 2 }),
      Animated.spring(rightPupilY, { toValue: ny * MAX, useNativeDriver: false, speed: 30, bounciness: 2 }),
    ]).start();
  };

  const resetEyes = () => {
    Animated.parallel([
      Animated.spring(leftPupilX,  { toValue: 0, useNativeDriver: false, speed: 10, bounciness: 6 }),
      Animated.spring(leftPupilY,  { toValue: 0, useNativeDriver: false, speed: 10, bounciness: 6 }),
      Animated.spring(rightPupilX, { toValue: 0, useNativeDriver: false, speed: 10, bounciness: 6 }),
      Animated.spring(rightPupilY, { toValue: 0, useNativeDriver: false, speed: 10, bounciness: 6 }),
    ]).start();
  };

  const triggerWobble = () => {
    wobble.setValue(0);
    Animated.sequence([
      Animated.timing(wobble, { toValue:  18, duration: 80,  useNativeDriver: false }),
      Animated.timing(wobble, { toValue: -18, duration: 80,  useNativeDriver: false }),
      Animated.timing(wobble, { toValue:  12, duration: 70,  useNativeDriver: false }),
      Animated.timing(wobble, { toValue: -12, duration: 70,  useNativeDriver: false }),
      Animated.timing(wobble, { toValue:   6, duration: 60,  useNativeDriver: false }),
      Animated.timing(wobble, { toValue:   0, duration: 60,  useNativeDriver: false }),
    ]).start();
  };

  const triggerSquish = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleX, { toValue: 1.35, duration: 100, useNativeDriver: false }),
        Animated.timing(scaleY, { toValue: 0.65, duration: 100, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.timing(scaleX, { toValue: 0.85, duration: 120, useNativeDriver: false }),
        Animated.timing(scaleY, { toValue: 1.25, duration: 120, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.spring(scaleX, { toValue: 1, useNativeDriver: false, speed: 18, bounciness: 10 }),
        Animated.spring(scaleY, { toValue: 1, useNativeDriver: false, speed: 18, bounciness: 10 }),
      ]),
    ]).start();
  };

  const triggerSpin = () => {
    rotate.setValue(0);
    Animated.sequence([
      Animated.timing(rotate, { toValue: 360, duration: 450, useNativeDriver: false }),
      Animated.timing(rotate, { toValue: 0,   duration: 0,   useNativeDriver: false }),
    ]).start();
  };

  const returnToCenter = () => {
    Animated.parallel([
      Animated.spring(posX, { toValue: 0, useNativeDriver: false, speed: 8, bounciness: 12 }),
      Animated.spring(posY, { toValue: 0, useNativeDriver: false, speed: 8, bounciness: 12 }),
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: (e) => {
        triggerSquish();
        moveEyes(e.nativeEvent.locationX, e.nativeEvent.locationY);
      },
      onPanResponderMove: (e, gs) => {
        posX.setValue(Math.max(-80, Math.min(80, gs.dx)));
        posY.setValue(Math.max(-80, Math.min(80, gs.dy)));
        moveEyes(e.nativeEvent.locationX, e.nativeEvent.locationY);
      },
      onPanResponderRelease: (e, gs) => {
        const speed   = Math.sqrt(gs.vx ** 2 + gs.vy ** 2);
        const distMov = Math.sqrt(gs.dx ** 2 + gs.dy ** 2);

        if (speed > 1.5)   triggerSpin();
        if (distMov < 12)  {
          // It was a tap (not a drag) — trigger wobble AND word burst
          triggerWobble();
          // Use a ref-forwarded version via a module-level getter
          _burstRef.current?.();
        }
        returnToCenter();
        resetEyes();
      },
    })
  ).current;

  // Store burstWords in a ref so panResponder (created once) can call it
  const _burstRef = useRef(null);
  useEffect(() => {
    _burstRef.current = burstWords;
  }, [burstWords]);

  const rotateDeg = rotate.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
  const wobbleDeg = wobble.interpolate({ inputRange: [-18, 18], outputRange: ['-18deg', '18deg'] });

  const eyeSize    = size * 0.13;
  const pupilSize  = eyeSize * 0.55;
  const eyeTop     = size * 0.27;
  const eyeSpacing = size * 0.17;

  return (
    <View
      style={[styles.container, { width: size + 160, height: size + 80 }]}
      {...panResponder.panHandlers}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel="Poly-Puff mascot. Tap to see English words at your level!"
    >
      {/* ── Floating words layer ── */}
      {activeWords.map(({ id, word, colour }) => (
        <FloatingWord
          key={id}
          word={word}
          colour={colour}
          onDone={() => removeWord(id)}
        />
      ))}

      {/* ── Mascot body ── */}
      <Animated.View
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden={true}
        style={{
          transform: [
            { translateX: posX },
            { translateY: Animated.add(floatAnim, posY) },
            { rotate: rotateDeg },
            { rotate: wobbleDeg },
            { scaleX: scaleX },
            { scaleY: scaleY },
          ],
        }}
      >
        <View style={{ width: size, height: size }}>
          <Image
            source={require('../assets/polypuff.png')}
            style={{ width: size, height: size, position: 'absolute' }}
            resizeMode="contain"
          />
          <Animated.View style={[styles.pupil, {
            width: pupilSize, height: pupilSize, borderRadius: pupilSize / 2,
            top: eyeTop + (eyeSize - pupilSize) / 2,
            left: size / 2 - eyeSpacing - eyeSize / 2 + (eyeSize - pupilSize) / 2,
            transform: [{ translateX: leftPupilX }, { translateY: leftPupilY }],
          }]} />
          <Animated.View style={[styles.pupil, {
            width: pupilSize, height: pupilSize, borderRadius: pupilSize / 2,
            top: eyeTop + (eyeSize - pupilSize) / 2,
            left: size / 2 + eyeSpacing - eyeSize / 2 + (eyeSize - pupilSize) / 2,
            transform: [{ translateX: rightPupilX }, { translateY: rightPupilY }],
          }]} />
        </View>
      </Animated.View>

      {/* ── Glow shadow ── */}
      <Animated.View
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden={true}
        style={[styles.glow, {
          width: size * 0.55, opacity: glowAnim,
          transform: [{ scaleX: glowScaleX }],
        }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'center', alignItems: 'center', justifyContent: 'flex-end' },
  pupil: { position: 'absolute', backgroundColor: 'rgba(0, 20, 60, 0.45)' },
  glow: {
    height: 18, borderRadius: 999, backgroundColor: '#00d4ff',
    shadowColor: '#00d4ff', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9, shadowRadius: 14, elevation: 10, marginBottom: 4,
  },
});
