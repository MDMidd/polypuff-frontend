/**
 * auth.ts — Frontend Auth Helper
 * ──────────────────────────────────────────────────────────────────
 * Returns the Bearer header backed by the server-issued JWT that
 * /api/auth/login stores in AsyncStorage as `pp_token`.
 *
 * The legacy HMAC-from-APP_SECRET scheme was removed before the
 * Play Store launch: shipping the secret inside the APK meant
 * anyone who decompiled the bundle could mint a valid token for
 * any userId. The JWT path was already wired by LoginScreen and
 * used by sync/profile/settings — this just unifies on it.
 *
 * USAGE:
 *   import { getAuthHeaders } from '../utils/auth';
 *   const headers = await getAuthHeaders();
 *   if (!headers) return; // user not signed in
 *   fetch(url, { headers: { ...headers, 'Content-Type': 'application/json' } });
 * ──────────────────────────────────────────────────────────────────
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSavedToken } from './authSession';

/**
 * Get the saved JWT (or null if not logged in).
 */
export async function generateAuthToken(): Promise<string | null> {
  const token = await getSavedToken();
  return token || null;
}

/**
 * Get Authorization headers for authenticated API calls.
 * Returns null when the user has no valid session.
 */
export async function getAuthHeaders(): Promise<Record<string, string> | null> {
  const token = await generateAuthToken();
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

/**
 * Local device user id (UUID generated on first launch).
 * Not a backend identity — for backend identity use the JWT's email claim.
 */
export async function getCurrentUserId(): Promise<string | null> {
  return AsyncStorage.getItem('userId');
}
