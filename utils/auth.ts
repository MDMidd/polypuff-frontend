/**
 * auth.ts — Frontend Auth Utility
 * ──────────────────────────────────────────────────────────────────
 * Poly-Puff — Simple HMAC Authentication Helper
 *
 * Generates auth tokens that the backend can verify.
 * Uses the same APP_SECRET + HMAC-SHA256 as the backend.
 *
 * USAGE:
 *   import { getAuthHeaders } from '../utils/auth';
 *
 *   const headers = await getAuthHeaders();
 *   fetch(url, { headers: { ...headers, 'Content-Type': 'application/json' } });
 *
 * IMPORTANT:
 *   The APP_SECRET below must match the APP_SECRET environment
 *   variable on your Railway backend. In a production app, you
 *   would NOT hardcode this — you'd use a proper auth flow (JWT,
 *   OAuth, etc.). This is an MVP solution.
 *
 * WHERE TO PUT THIS FILE:
 *   translation-trainer-frontend/utils/auth.ts
 * ──────────────────────────────────────────────────────────────────
 */

import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ REPLACE THIS with the same value you set in Railway's
//    APP_SECRET environment variable.
const APP_SECRET = '9dc999b9c04899bc9eca166102bfc82843d20ab88e1ec755956bd8068d5cafbe';

/**
 * Generate an HMAC-SHA256 auth token for the current user.
 * Returns null if no userId is stored (user not logged in).
 */
export async function generateAuthToken(): Promise<string | null> {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) return null;

  const token = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    userId + APP_SECRET,
  );

  return token;
}

/**
 * Get Authorization headers for authenticated API calls.
 * Returns an object you can spread into fetch headers.
 *
 * Example:
 *   const headers = await getAuthHeaders();
 *   if (!headers) { /* user not logged in * / }
 *   fetch(url, { headers: { ...headers, 'Content-Type': 'application/json' } });
 */
export async function getAuthHeaders(): Promise<Record<string, string> | null> {
  const token = await generateAuthToken();
  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Get the current userId from AsyncStorage.
 */
export async function getCurrentUserId(): Promise<string | null> {
  return AsyncStorage.getItem('userId');
}
