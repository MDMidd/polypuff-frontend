/**
 * profileService.ts — Cross-device profile sync for Poly-Puff mobile.
 *
 * Talks to the email-keyed /api/me endpoints so the website and the app
 * share the same app_users row — the user_id is derived server-side from
 * the JWT, not from a client-supplied path param.
 *
 * pullProfile() — fetch remote profile and merge into local 'userProfile' key.
 *   Called from syncService.pullAndMerge() on login and app focus.
 *   Rate-limited to once per PROFILE_COOLDOWN_MS to avoid hammering the API
 *   on every app focus. The cooldown key is cleared on sign-out (AUTH_KEYS)
 *   so a new account always gets a fresh fetch on first login.
 *
 * pushProfile() — push local profile to the server.
 *   Called from profile.tsx and settings.tsx after any profile write.
 *
 * Photo (Base64) is kept local-only — never uploaded to or downloaded from
 * the profile endpoint since the payload would be enormous.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl } from './api';

type ProfileData = Record<string, unknown>;

const PROFILE_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes between remote fetches
const FETCHED_AT_KEY = 'pp_profile_fetched_at';

const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Highest of the two CEFR levels — never lets a merge downgrade a skill.
function higherLevel(a: unknown, b: unknown): string | undefined {
  const as = typeof a === 'string' ? a.toUpperCase() : '';
  const bs = typeof b === 'string' ? b.toUpperCase() : '';
  const ai = CEFR_ORDER.indexOf(as);
  const bi = CEFR_ORDER.indexOf(bs);
  if (ai < 0) return bs || undefined;
  if (bi < 0) return as;
  return bi > ai ? bs : as;
}

function mergeSkillLevels(
  local: Record<string, unknown> | null | undefined,
  remote: Record<string, unknown> | null | undefined,
): Record<string, string> | null {
  if (!local && !remote) return null;
  const keys = new Set([...Object.keys(local || {}), ...Object.keys(remote || {})]);
  const out: Record<string, string> = {};
  keys.forEach((key) => {
    const level = higherLevel((local || {})[key], (remote || {})[key]);
    if (level) out[key] = level;
  });
  return out;
}

async function getCredentials(): Promise<{ token: string; base: string }> {
  const [token, base] = await Promise.all([
    AsyncStorage.getItem('pp_token'),
    getServerUrl(),
  ]);
  return { token: token || '', base };
}

/**
 * Fetch the user's profile from the server and merge it into the local
 * 'userProfile' AsyncStorage key. Remote values win for text fields;
 * local photo (Base64) is always preserved.
 *
 * Skips the network call if a successful fetch happened within the last
 * 5 minutes, so repeated app-focus events don't hammer the API.
 */
export async function pullProfile(): Promise<void> {
  try {
    // Rate limiting: skip if we fetched successfully within the cooldown window.
    const lastFetched = await AsyncStorage.getItem(FETCHED_AT_KEY);
    if (lastFetched && Date.now() - Number(lastFetched) < PROFILE_COOLDOWN_MS) return;

    const { token, base } = await getCredentials();
    if (!token) return;

    const res = await fetch(`${base}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;

    const body = await res.json();
    const remote: ProfileData | null = body && typeof body === 'object' ? (body.profile as ProfileData) : null;
    if (!remote || typeof remote !== 'object') return;

    const raw = await AsyncStorage.getItem('userProfile');
    const local: ProfileData = raw ? JSON.parse(raw) : {};

    const merged: ProfileData = {
      ...local,
      // Remote wins for every text field that has a non-empty value.
      ...(remote.name           ? { name:            remote.name }           : {}),
      ...(remote.profession     ? { profession:      remote.profession }     : {}),
      ...(remote.qualifications ? { qualifications:  remote.qualifications } : {}),
      ...(remote.age            ? { age:             remote.age }            : {}),
      ...(remote.hobbies        ? { hobbies:         remote.hobbies }        : {}),
      ...(remote.bio            ? { bio:             remote.bio }            : {}),
      nativeLanguage: (remote.nativeLanguage as string) || (remote.native_language as string) || (local.nativeLanguage as string) || 'English',
      appLanguage:    (remote.appLanguage    as string) || (remote.app_language    as string) || (local.appLanguage    as string) || 'en',
      level:          (remote.level          as string) || (remote.cefrLevel       as string) || (remote.englishLevel  as string) || (local.level as string) || 'B1',
      // photo stays local — Base64 is too large for the profile endpoint.
      photo: local.photo || null,
    };

    await AsyncStorage.setItem('userProfile', JSON.stringify(merged));

    // Aggregate stats (totalXP / streak / skill levels) — separate flat
    // AsyncStorage keys, read directly by progress.tsx, index.tsx, and the
    // exercise screens. progressSyncService.recordXP() only ever pushes these
    // up; this is the only place that pulls them back down, so a fresh
    // install logging into an existing account restores them instead of
    // starting every stat at zero. Max-merged so a device with unsynced
    // local progress never gets rolled backward.
    const remoteProgress = remote.progress && typeof remote.progress === 'object'
      ? remote.progress as Record<string, unknown> : null;
    if (remoteProgress) {
      const [localXPRaw, localStreakRaw, localBestRaw] = await Promise.all([
        AsyncStorage.getItem('totalXP'),
        AsyncStorage.getItem('currentStreak'),
        AsyncStorage.getItem('bestStreak'),
      ]);
      const remoteXP     = Number(remoteProgress.totalXP)   || 0;
      const remoteStreak = Number(remoteProgress.streakDays) || 0;
      const nextXP     = Math.max(parseInt(localXPRaw     || '0', 10) || 0, remoteXP);
      const nextStreak = Math.max(parseInt(localStreakRaw || '0', 10) || 0, remoteStreak);
      const nextBest   = Math.max(parseInt(localBestRaw   || '0', 10) || 0, remoteStreak);
      await AsyncStorage.multiSet([
        ['totalXP', String(nextXP)],
        ['currentStreak', String(nextStreak)],
        ['bestStreak', String(nextBest)],
      ]);
    }

    const remoteSkillLevels = remote.skillLevels && typeof remote.skillLevels === 'object'
      ? remote.skillLevels as Record<string, unknown> : null;
    if (remoteSkillLevels) {
      const rawLocalLevels = await AsyncStorage.getItem('skillLevels');
      const localLevels = rawLocalLevels ? JSON.parse(rawLocalLevels) : null;
      const mergedLevels = mergeSkillLevels(localLevels, remoteSkillLevels);
      if (mergedLevels) await AsyncStorage.setItem('skillLevels', JSON.stringify(mergedLevels));
    }

    // Record successful fetch time so the next focus event can skip the call.
    await AsyncStorage.setItem(FETCHED_AT_KEY, String(Date.now()));
  } catch {}
}

/**
 * Push the given profile object to the server. The 'photo' field is stripped
 * (it's a large Base64 data URI that the endpoint doesn't expect).
 */
export async function pushProfile(profile: ProfileData): Promise<void> {
  try {
    const { token, base } = await getCredentials();
    if (!token) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { photo, ...payload } = profile;

    await fetch(`${base}/api/me/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {}
}

/**
 * Push the placement test's freshly-computed skillLevels to the server.
 * Without this, the server's skill_levels stays empty until the first
 * /api/me/grade call, which would then start the ratchet-up logic from
 * 'A1' instead of the placement test's real starting point.
 */
export async function pushSkillLevels(skillLevels: Record<string, string>): Promise<void> {
  try {
    const { token, base } = await getCredentials();
    if (!token) return;

    await fetch(`${base}/api/me/skill-levels`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ skillLevels }),
    });
  } catch {}
}
