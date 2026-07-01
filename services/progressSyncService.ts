/**
 * progressSyncService.ts — pushes earned XP / exercise counts to the server.
 *
 * Mirrors the web's progress-sync.js. Exercise screens already track XP
 * locally (AsyncStorage 'totalXP') but never sent it to the server, so the
 * weekly/monthly email digests always showed zero and XP didn't carry over
 * across devices. Call recordXP() right after an exercise is scored, right
 * alongside the existing local AsyncStorage.setItem('totalXP', ...) write.
 *
 * Best-effort and silent: no-ops if signed out, never throws.
 *
 * Backend contract: POST /api/me/progress { xp, exercisesDone } (Bearer JWT).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl } from './api';

export async function recordXP(xp: number, exercisesDone = 1): Promise<void> {
  try {
    const [token, base] = await Promise.all([
      AsyncStorage.getItem('pp_token'),
      getServerUrl(),
    ]);
    if (!token) return;

    const body: { xp?: number; exercisesDone?: number } = {};
    if (Number.isFinite(xp) && xp > 0) body.xp = xp;
    if (Number.isFinite(exercisesDone) && exercisesDone > 0) body.exercisesDone = exercisesDone;
    else body.exercisesDone = 1;

    await fetch(`${base}/api/me/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
  } catch {}
}
