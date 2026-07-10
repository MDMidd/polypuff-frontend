/**
 * digestService.ts
 *
 * WHERE THIS FILE GOES:
 *   D:\Project\MyProject\translation-trainer-frontend\services\digestService.ts
 *
 * WHAT IT DOES:
 *   Manages the weekly email digest feature.
 *   - Checks on every app focus whether 7 days have passed since the last digest
 *   - Reads all progress data from AsyncStorage
 *   - Posts it to /api/digest on the Railway backend
 *   - Saves the send timestamp so it doesn't send again for 7 days
 *
 * HOW TO USE:
 *   In your root _layout.tsx or app entry point, call:
 *     import { checkAndSendWeeklyDigest } from '../services/digestService';
 *     // Inside a useFocusEffect or useEffect on app load:
 *     checkAndSendWeeklyDigest();
 *
 * SETTINGS:
 *   The user can enable/disable the digest and set their email in Settings.
 *   Keys used:
 *     'digestEnabled'       - 'true' | 'false' (default: 'false' until user opts in)
 *     'digestEmail'         - string (user's email for digest)
 *     'digestLastSent'      - ISO date string of last successful send
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl } from './api';

const DIGEST_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// ── Exercise IDs matching the progress screen ────────────────────────────────
const EXERCISE_IDS = [
  { id: 'translation_trainer', label: 'Translation Trainer' },
  { id: 'listening',           label: 'Listening'           },
  { id: 'grammar',             label: 'Grammar Practice'    },
  { id: 'grammar_quiz',        label: 'Grammar Quiz'        },
  { id: 'writing',             label: 'Writing'             },
  { id: 'vocabulary',          label: 'Vocabulary'          },
  { id: 'word_chunks',         label: 'Word Chunks'         },
  { id: 'daily_challenge',     label: 'Daily Challenge'     },
  { id: 'placement_test',      label: 'Placement Test'      },
];

// ── Read all progress data from AsyncStorage ─────────────────────────────────
async function gatherProgressData() {
  // User profile
  const profileRaw = await AsyncStorage.getItem('userProfile');
  const profile    = profileRaw ? JSON.parse(profileRaw) : {};

  const xp      = parseInt(await AsyncStorage.getItem('totalXP')       || '0', 10);
  const streak  = parseInt(await AsyncStorage.getItem('currentStreak') || '0', 10);

  const levelsRaw = await AsyncStorage.getItem('skillLevels');
  const levels    = levelsRaw ? JSON.parse(levelsRaw) : {};
  const cefrLevel = levels.overall || profile.level || 'A1';

  // Per-exercise data
  const exercises = [];
  let   totalSessions = 0;
  const mistakeMap: Record<string, number> = {};

  for (const ex of EXERCISE_IDS) {
    const [rRaw, wRaw] = await Promise.all([
      AsyncStorage.getItem(`progress_recent_${ex.id}`),
      AsyncStorage.getItem(`progress_weak_${ex.id}`),
    ]);

    const recent  = rRaw ? JSON.parse(rRaw) : [];
    const weak    = wRaw ? JSON.parse(wRaw) : [];
    const scores  = recent.filter((r: any) => r.score !== undefined).map((r: any) => r.score);
    const avg     = scores.length > 0
      ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
      : null;
    const best    = scores.length > 0 ? Math.max(...scores) : null;
    const lastDate = recent.length > 0 ? recent[0].date : null;

    if (recent.length > 0) {
      exercises.push({
        id:       ex.id,
        label:    ex.label,
        avg,
        best,
        sessions: recent.length,
        lastDate,
      });
      totalSessions += recent.length;
    }

    // Aggregate mistake categories
    for (const w of weak) {
      const cat = w.category || 'General';
      mistakeMap[cat] = (mistakeMap[cat] || 0) + (w.frequency || 1);
    }
  }

  // Overall average
  const allAvgs   = exercises.filter(e => e.avg !== null).map(e => e.avg as number);
  const overallAvg = allAvgs.length > 0
    ? Math.round(allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length)
    : 0;

  // Top mistakes sorted by frequency
  const topMistakes = Object.entries(mistakeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, frequency]) => ({ category, frequency }));

  // Week start date (last Monday)
  const now       = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday    = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return {
    studentName:   profile.name   || 'Student',
    email:         '',             // filled in by caller from digestEmail setting
    cefrLevel,
    xp,
    streak,
    overallAvg,
    totalSessions,
    exercises,
    topMistakes,
    weekStartDate: monday.toISOString(),
  };
}

// ── Main exported function ────────────────────────────────────────────────────
/**
 * Call this on app focus. It will silently no-op if:
 * - The user hasn't opted in to digests
 * - No email is configured
 * - The digest was sent less than 7 days ago
 */
export async function checkAndSendWeeklyDigest(): Promise<void> {
  try {
    // 1. Check opt-in
    const enabled = await AsyncStorage.getItem('digestEnabled');
    if (enabled !== 'true') return;

    // 2. Check email
    const digestEmail = await AsyncStorage.getItem('digestEmail');
    if (!digestEmail || !digestEmail.includes('@')) return;

    // 3. Check interval
    const lastSentRaw = await AsyncStorage.getItem('digestLastSent');
    if (lastSentRaw) {
      const lastSent = new Date(lastSentRaw).getTime();
      if (Date.now() - lastSent < DIGEST_INTERVAL_MS) return;
    }

    // 4. Gather data
    const data = await gatherProgressData();
    data.email = digestEmail;

    // 5. Post to backend
    const BASE = await getServerUrl();
    const res  = await fetch(`${BASE}/api/digest`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });

    if (res.ok) {
      // 6. Record send time so we don't send again for 7 days
      await AsyncStorage.setItem('digestLastSent', new Date().toISOString());
      console.log('📧 Weekly digest sent successfully');
    }
  } catch (e) {
    // Silent fail - digest is a background feature, never crash the app
    console.log('📧 Weekly digest skipped (offline or error)');
  }
}

// ── Manual trigger (for the "Send Now" button in Settings) ───────────────────
/**
 * Force-sends the digest immediately, ignoring the 7-day interval check.
 * Returns { success, error? }
 */
export async function sendDigestNow(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const data  = await gatherProgressData();
    data.email  = email;

    const BASE = await getServerUrl();
    const res  = await fetch(`${BASE}/api/digest`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });

    if (res.ok) {
      await AsyncStorage.setItem('digestLastSent', new Date().toISOString());
      await AsyncStorage.setItem('digestEmail',   email);
      return { success: true };
    } else {
      const body = await res.json();
      return { success: false, error: body.error || 'Server error. Please try again.' };
    }
  } catch (e: any) {
    return { success: false, error: 'Could not connect to the server. Check your internet connection.' };
  }
}
