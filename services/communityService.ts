/**
 * communityService.ts — Community leaderboard client.
 *
 * Talks to GET /api/community/leaderboard, GET /api/me (for current settings),
 * and PUT /api/me/community-settings.
 *
 * isMinorAccount() reads the same 'userAgeGroup' AsyncStorage value the age
 * gate (screens/AgeGateScreen.tsx) already computes — sent along on every
 * settings update so the server enforces exclusion independent of whatever
 * opt-in value is requested. This file never touches the age thresholds
 * themselves, only consumes their already-computed output.
 *
 * syncExerciseAccuracy() (Stage 3) reads the per-exercise stats app/progress.tsx
 * already computes locally from AsyncStorage's progress_recent_<exerciseId>
 * entries, and pushes an avg/sessions snapshot to the server so it can factor
 * into the community score. Exercise ids here must stay in sync with
 * ALL_EXERCISES in app/progress.tsx and KNOWN_EXERCISE_IDS in server.js.
 *
 * FILE LOCATION: services/communityService.ts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl } from './api';

const EXERCISE_IDS = [
  'placement_test', 'translation_trainer', 'word_chunks', 'listening', 'writing',
  'grammar_quiz', 'grammar', 'vocabulary', 'vocab_vault', 'ielts', 'toefl',
  'cae', 'business_english', 'daily_challenge',
];

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  score: number;
  streakDays: number;
  isMe: boolean;
}

export interface LeaderboardResult {
  leaderboard: LeaderboardEntry[];
  total: number;
  myRank: number | null;
  myScore: number | null;
}

export interface CommunitySettings {
  isMinor: boolean;
  communityHandle: string | null;
  communityOptIn: boolean;
}

async function getCredentials(): Promise<{ token: string; base: string }> {
  const [token, base] = await Promise.all([
    AsyncStorage.getItem('pp_token'),
    getServerUrl(),
  ]);
  return { token: token || '', base };
}

export async function isMinorAccount(): Promise<boolean> {
  const ageGroup = await AsyncStorage.getItem('userAgeGroup');
  return ageGroup === 'child' || ageGroup === 'grey_zone';
}

export async function getCommunitySettings(): Promise<CommunitySettings | null> {
  try {
    const { token, base } = await getCredentials();
    if (!token) return null;
    const res = await fetch(`${base}/api/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;
    const body = await res.json();
    const profile = body?.profile || {};
    return {
      isMinor: profile.isMinor === true,
      communityHandle: profile.communityHandle || null,
      communityOptIn: profile.communityOptIn === true,
    };
  } catch {
    return null;
  }
}

export async function updateCommunitySettings(
  opts: { optIn?: boolean; handle?: string },
): Promise<{ success: boolean; error?: string } & Partial<CommunitySettings>> {
  try {
    const { token, base } = await getCredentials();
    if (!token) return { success: false, error: 'Not signed in.' };
    const isMinor = await isMinorAccount();

    const res = await fetch(`${base}/api/me/community-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...opts, isMinor }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, error: data.error || 'Could not save settings.' };
    return {
      success: true,
      isMinor: data.isMinor,
      communityHandle: data.communityHandle,
      communityOptIn: data.communityOptIn,
    };
  } catch {
    return { success: false, error: 'Could not connect to the server.' };
  }
}

export async function getLeaderboard(limit = 50, offset = 0): Promise<LeaderboardResult | null> {
  try {
    const { token, base } = await getCredentials();
    if (!token) return null;
    const res = await fetch(`${base}/api/community/leaderboard?limit=${limit}&offset=${offset}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Reads each exercise's locally-tracked scores (progress_recent_<id>, the
 * same AsyncStorage keys app/progress.tsx already aggregates for its own
 * stats screen) and pushes an avg/session-count snapshot to the server.
 * Best-effort and silent — call this opportunistically (e.g. when the
 * Community screen loads) rather than on a tight loop.
 */
export async function syncExerciseAccuracy(): Promise<void> {
  try {
    const { token, base } = await getCredentials();
    if (!token) return;

    const stats: Record<string, { avg: number; sessions: number }> = {};
    for (const id of EXERCISE_IDS) {
      const raw = await AsyncStorage.getItem(`progress_recent_${id}`);
      if (!raw) continue;
      let recent: Array<{ score?: number }> = [];
      try { recent = JSON.parse(raw); } catch { continue; }
      const scores = recent.filter(r => Number.isFinite(r?.score)).map(r => Number(r.score));
      if (!scores.length) continue;
      stats[id] = {
        avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        sessions: scores.length,
      };
    }
    if (!Object.keys(stats).length) return;

    await fetch(`${base}/api/me/exercise-accuracy`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ stats }),
    });
  } catch {}
}
