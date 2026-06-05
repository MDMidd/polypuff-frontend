/**
 * Notification Service — Poly-Puff
 * ==================================
 *
 * Handles daily streak reminder push notifications and in-app banners.
 *
 * Push notifications fire at the student's chosen time if they
 * haven't practiced that day. In-app banners show when they return.
 *
 * SETUP:
 *   npx expo install expo-notifications
 *   Add "expo-notifications" to plugins in app.json
 *
 * Usage:
 *   import { initNotifications, scheduleStreakReminder, getStreakMessage } from '../services/notifications';
 *
 * FILE: services/notifications.ts
 * LOCATION: D:\Project\MyProject\translation-trainer-frontend\services\notifications.ts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Try to load expo-notifications — may not be available in Expo Go
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  // Not available
}

// ── Storage keys ──
const REMINDER_ENABLED_KEY = 'streakReminderEnabled';
const REMINDER_HOUR_KEY = 'streakReminderHour';
const REMINDER_MINUTE_KEY = 'streakReminderMinute';
const LAST_PRACTICE_KEY = 'lastPracticeDate';
const STREAK_COUNT_KEY = 'streakDays';

// ── Motivational messages (rotated daily) ──
const MOTIVATIONAL_MESSAGES = [
  "Don't break the chain! 🔥",
  "Champions practice every day! 💪",
  "Your future self will thank you! 🌟",
  "Just 5 minutes keeps the streak alive! ⚡",
  "You've got this — keep going! 🎯",
  "One more day closer to fluency! 📚",
  "Small steps, big progress! 🚀",
  "Your streak is calling! 🔔",
  "English mastery is a daily habit! 🧠",
  "Time to shine — let's practice! ✨",
  "Consistency beats intensity! 🏆",
  "Every session counts! Keep it up! 💎",
];

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Initialize notifications — request permissions and set up channel.
 * Call once at app startup (in _layout.tsx).
 */
export async function initNotifications(): Promise<boolean> {
  if (!Notifications) return false;

  try {
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return false;

    // Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('streak-reminder', {
        name: 'Streak Reminders',
        importance: Notifications.AndroidImportance?.HIGH || 4,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#ADD8E6',
      });
    }

    return true;
  } catch (e) {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// STREAK TRACKING
// ═══════════════════════════════════════════════════════════════════════

/** Record that the student practiced today */
export async function recordPracticeToday(): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const lastDate = await AsyncStorage.getItem(LAST_PRACTICE_KEY);

  if (lastDate === today) return; // Already recorded today

  // Calculate streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let streak = parseInt(await AsyncStorage.getItem(STREAK_COUNT_KEY) || '0', 10);

  if (lastDate === yesterdayStr) {
    streak += 1; // Consecutive day
  } else if (lastDate !== today) {
    streak = 1; // Streak broken, start fresh
  }

  await AsyncStorage.setItem(LAST_PRACTICE_KEY, today);
  await AsyncStorage.setItem(STREAK_COUNT_KEY, String(streak));
}

/** Get current streak info */
export async function getStreakInfo(): Promise<{ streak: number; practicedToday: boolean; lastDate: string | null }> {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = await AsyncStorage.getItem(LAST_PRACTICE_KEY);
  const streak = parseInt(await AsyncStorage.getItem(STREAK_COUNT_KEY) || '0', 10);

  return {
    streak,
    practicedToday: lastDate === today,
    lastDate,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// MESSAGE GENERATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generate a personalized streak notification message.
 */
export async function getStreakMessage(): Promise<{ title: string; body: string }> {
  const userName = await getUserName();
  const { streak, practicedToday } = await getStreakInfo();
  const totalXP = parseInt(await AsyncStorage.getItem('totalXP') || '0', 10);
  const name = userName || 'there';

  // Pick a random motivational message
  const dayIndex = new Date().getDate() % MOTIVATIONAL_MESSAGES.length;
  const motivation = MOTIVATIONAL_MESSAGES[dayIndex];

  // Build title
  let title: string;
  if (streak >= 7) {
    title = `🔥 ${streak}-day streak, ${name}!`;
  } else if (streak > 0) {
    title = `Hey ${name}! ${streak}-day streak 🔥`;
  } else {
    title = `Hey ${name}! Start a new streak today`;
  }

  // Build body with XP progress
  const nextMilestone = Math.ceil(totalXP / 100) * 100;
  const xpToGo = nextMilestone - totalXP;

  let body = motivation;
  if (xpToGo > 0 && xpToGo <= 50) {
    body += ` You're only ${xpToGo} XP from ${nextMilestone}!`;
  } else if (streak > 0 && !practicedToday) {
    body += ` Keep your ${streak}-day streak alive!`;
  }

  return { title, body };
}

/** Get in-app banner message (richer than push) */
export async function getInAppBanner(): Promise<{
  title: string;
  subtitle: string;
  streak: number;
  practicedToday: boolean;
  xpToMilestone: number;
} | null> {
  const { streak, practicedToday, lastDate } = await getStreakInfo();
  const userName = await getUserName();
  const totalXP = parseInt(await AsyncStorage.getItem('totalXP') || '0', 10);
  const name = userName || 'there';

  const nextMilestone = Math.ceil((totalXP + 1) / 100) * 100;
  const xpToGo = nextMilestone - totalXP;

  if (practicedToday) {
    return {
      title: `Great job, ${name}! ✅`,
      subtitle: streak > 1 ? `${streak}-day streak! Keep it going tomorrow.` : `You practiced today. Come back tomorrow to start a streak!`,
      streak,
      practicedToday: true,
      xpToMilestone: xpToGo,
    };
  }

  // Hasn't practiced today
  const dayIndex = new Date().getDate() % MOTIVATIONAL_MESSAGES.length;

  if (streak > 0) {
    // At risk of losing streak
    return {
      title: `⚠️ ${name}, your ${streak}-day streak is at risk!`,
      subtitle: MOTIVATIONAL_MESSAGES[dayIndex] + (xpToGo <= 30 ? ` Only ${xpToGo} XP to ${nextMilestone}!` : ''),
      streak,
      practicedToday: false,
      xpToMilestone: xpToGo,
    };
  }

  return {
    title: `Welcome back, ${name}! 👋`,
    subtitle: `Start a new streak today. ${MOTIVATIONAL_MESSAGES[dayIndex]}`,
    streak: 0,
    practicedToday: false,
    xpToMilestone: xpToGo,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// SCHEDULING
// ═══════════════════════════════════════════════════════════════════════

/** Get saved reminder settings */
export async function getReminderSettings(): Promise<{ enabled: boolean; hour: number; minute: number }> {
  const enabled = (await AsyncStorage.getItem(REMINDER_ENABLED_KEY)) === 'true';
  const hour = parseInt(await AsyncStorage.getItem(REMINDER_HOUR_KEY) || '18', 10);
  const minute = parseInt(await AsyncStorage.getItem(REMINDER_MINUTE_KEY) || '0', 10);
  return { enabled, hour, minute };
}

/** Save reminder settings and reschedule */
export async function setReminderSettings(enabled: boolean, hour: number, minute: number): Promise<void> {
  await AsyncStorage.setItem(REMINDER_ENABLED_KEY, String(enabled));
  await AsyncStorage.setItem(REMINDER_HOUR_KEY, String(hour));
  await AsyncStorage.setItem(REMINDER_MINUTE_KEY, String(minute));

  if (enabled) {
    await scheduleStreakReminder(hour, minute);
  } else {
    await cancelAllReminders();
  }
}

/** Schedule the daily streak reminder notification */
export async function scheduleStreakReminder(hour: number = 18, minute: number = 0): Promise<void> {
  if (!Notifications) return;

  try {
    // Cancel existing reminders first
    await cancelAllReminders();

    const { title, body } = await getStreakMessage();

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority?.HIGH || 'high',
        ...(Platform.OS === 'android' ? { channelId: 'streak-reminder' } : {}),
      },
      trigger: {
        type: 'daily',
        hour,
        minute,
        repeats: true,
      },
    });
  } catch (e) {
    // Silently fail — notifications not available
  }
}

/** Cancel all scheduled reminders */
export async function cancelAllReminders(): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

async function getUserName(): Promise<string> {
  try {
    const raw = await AsyncStorage.getItem('userProfile');
    if (raw) {
      const p = JSON.parse(raw);
      return p.name || '';
    }
  } catch (e) {}
  return '';
}

/** Format hour/minute as readable time string */
export function formatReminderTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = String(minute).padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}
