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
 * FILE LOCATION: services/communityService.ts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl } from './api';

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
