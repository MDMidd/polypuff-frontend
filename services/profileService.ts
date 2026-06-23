/**
 * profileService.ts — Cross-device profile sync for Poly-Puff mobile.
 *
 * Mirrors the web's profile.js GET/PUT calls to /api/user/{email}.
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

async function getCredentials(): Promise<{ email: string; token: string; base: string }> {
  const [email, token, base] = await Promise.all([
    AsyncStorage.getItem('pp_email'),
    AsyncStorage.getItem('pp_token'),
    getServerUrl(),
  ]);
  return { email: email || '', token: token || '', base };
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

    const { email, token, base } = await getCredentials();
    if (!email || !token) return;

    const res = await fetch(`${base}/api/user/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;

    const remote: ProfileData = await res.json();
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
    const { email, token, base } = await getCredentials();
    if (!email || !token) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { photo, ...payload } = profile;

    await fetch(`${base}/api/user/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {}
}
