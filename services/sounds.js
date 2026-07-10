/**
 * Sound & Haptic Effects - Translation Trainer v6.2
 * ===================================================
 * 
 * Haptic feedback for key events. Works in Expo Go.
 * Sound effects are haptic-only (no audio files needed).
 * 
 * FILE: services/sounds.js
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Dynamic import - won't crash if expo-haptics isn't installed
let Haptics = null;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  console.log('expo-haptics not available - haptic feedback disabled');
}

let soundEnabled = true;
let hapticEnabled = true;

// Load saved preferences
(async () => {
  try {
    const s = await AsyncStorage.getItem('soundEnabled');
    if (s === 'false') soundEnabled = false;
    const h = await AsyncStorage.getItem('hapticEnabled');
    if (h === 'false') hapticEnabled = false;
  } catch (e) {}
})();

export const setSoundEnabled = async (val) => {
  soundEnabled = val;
  await AsyncStorage.setItem('soundEnabled', String(val));
};

export const setHapticEnabled = async (val) => {
  hapticEnabled = val;
  await AsyncStorage.setItem('hapticEnabled', String(val));
};

export const isSoundEnabled = () => soundEnabled;
export const isHapticEnabled = () => hapticEnabled;

// ── SAFE HAPTIC CALLS ──

const safeHaptic = (fn) => {
  if (!hapticEnabled || !Haptics || Platform.OS === 'web') return;
  try { fn(); } catch (e) {}
};

export const hapticLight = () => safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
export const hapticMedium = () => safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
export const hapticHeavy = () => safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
export const hapticSuccess = () => safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const hapticError = () => safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
export const hapticWarning = () => safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
export const hapticSelection = () => safeHaptic(() => Haptics.selectionAsync());

// ── COMPOSITE FEEDBACK ──

// Delegate entirely to playSound() - it plays the real sound file when
// available and falls back to the matching haptic (see playHapticFallback)
// when sound is off/unavailable, so there's exactly one feedback signal per
// call instead of a haptic firing here AND another one from the fallback.
export const feedbackCorrect = () => playSound('correct');
export const feedbackIncorrect = () => playSound('wrong');
export const feedbackFair = () => playSound('partial');

export const feedbackPerfect = () => {
  hapticHeavy();
  setTimeout(() => hapticSuccess(), 200);
  playSound('correct');
};

export const feedbackLevelUp = () => {
  hapticHeavy();
  setTimeout(() => hapticSuccess(), 150);
  setTimeout(() => hapticSuccess(), 300);
};

export const feedbackBadge = () => {
  hapticSuccess();
  setTimeout(() => hapticLight(), 200);
};

export const feedbackDailyGoal = () => {
  hapticHeavy();
  setTimeout(() => hapticSuccess(), 200);
  setTimeout(() => hapticSuccess(), 400);
};

export const feedbackTap = () => hapticSelection();

export const feedbackForScore = (score) => {
  if (score === 100) feedbackPerfect();
  else if (score >= 80) feedbackCorrect();
  else if (score >= 60) feedbackFair();
  else feedbackIncorrect();
};

// ── AUDIO FEEDBACK (expo-av) ──
// Real sound files, bundled as static assets. Falls back to haptic-only
// patterns for any effect that doesn't have a sound file yet.

let Audio = null;
try { Audio = require('expo-av').Audio; } catch (e) {}

// Add an entry here as each new sound file arrives - the key is the `type`
// passed to playSound(). Loaded lazily and cached so repeat plays (e.g. every
// correct quiz answer) don't re-read the asset from disk each time.
const SOUND_FILES = {
  correct: require('../assets/sounds/correct.mp3'),
  partial: require('../assets/sounds/partial.mp3'),
  wrong:   require('../assets/sounds/wrong.mp3'),
};

const soundCache = {};

const getSound = async (type) => {
  if (soundCache[type]) return soundCache[type];
  const source = SOUND_FILES[type];
  if (!source) return null;
  const { sound } = await Audio.Sound.createAsync(source);
  soundCache[type] = sound;
  return sound;
};

const playSound = async (type) => {
  if (!soundEnabled || !Audio) return playHapticFallback(type);
  try {
    const sound = await getSound(type);
    if (!sound) return playHapticFallback(type);
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch (e) {
    playHapticFallback(type);
  }
};

// Used when a type has no sound file yet, or playback fails for any reason -
// keeps the pre-existing haptic-only behavior as a safety net.
const playHapticFallback = (type) => {
  if (type === 'victory') {
    hapticSuccess();
    setTimeout(() => hapticLight(), 100);
    setTimeout(() => hapticSuccess(), 200);
  } else if (type === 'wrong') {
    hapticError();
  } else if (type === 'partial') {
    hapticWarning();
  } else if (type === 'happy' || type === 'correct') {
    hapticLight();
  }
};

export const playVictorySound = () => playSound('victory');
export const playWrongSound = () => playSound('wrong');
export const playHappySound = () => playSound('happy');
export const playCorrectSound = () => playSound('correct');
export const playPartialSound = () => playSound('partial');
