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

// Dynamic import — won't crash if expo-haptics isn't installed
let Haptics = null;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  console.log('expo-haptics not available — haptic feedback disabled');
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

export const feedbackCorrect = () => hapticSuccess();
export const feedbackIncorrect = () => hapticError();
export const feedbackFair = () => hapticWarning();

export const feedbackPerfect = () => {
  hapticHeavy();
  setTimeout(() => hapticSuccess(), 200);
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
// If expo-av is available, play actual sound files
// Falls back to haptic-only if not installed

let Audio = null;
try { Audio = require('expo-av').Audio; } catch (e) {}

const playSound = async (type) => {
  if (!soundEnabled || !Audio) return;
  try {
    // Use system sounds via expo-av
    // For now, use haptic patterns as audio placeholders
    if (type === 'victory') {
      hapticSuccess();
      setTimeout(() => hapticLight(), 100);
      setTimeout(() => hapticSuccess(), 200);
    } else if (type === 'wrong') {
      hapticError();
      setTimeout(() => hapticError(), 150);
    } else if (type === 'happy') {
      hapticSuccess();
      setTimeout(() => hapticLight(), 100);
      setTimeout(() => hapticLight(), 200);
      setTimeout(() => hapticSuccess(), 300);
    }
  } catch (e) {}
};

export const playVictorySound = () => playSound('victory');
export const playWrongSound = () => playSound('wrong');
export const playHappySound = () => playSound('happy');
