/**
 * authSession.ts - Shared auth-session storage helper.
 *
 * Mirrors the website's storeAuthSession() + PolyPuffAuth.storeAccess() so that
 * after a mobile login, all the AsyncStorage keys that settings.tsx, feedback.tsx
 * and (later) the vault-sync layer expect are populated identically to web.
 *
 * Keys written:
 *   pp_token              JWT from /api/auth/login (used as Bearer for /api/auth/me)
 *   pp_email              normalised email
 *   pp_account            full account JSON (mirrors localStorage on web)
 *   pp_user_name          display name derived from email if no name
 *   pp_plan, pp_access_plan, pp_is_teacher, pp_classroom_access
 *   pp_auth_provider      'email' | 'google' | 'facebook' | 'apple'
 *   accountSummary        same JSON, cached so settings.tsx pre-populates
 *
 * Legacy keys kept in sync (older code reads them):
 *   loginComplete, loginDate, authMethod, authIdentifier, authPhotoURL
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { identifyUser, signOutUser } from '../services/revenueCatService';

const PRO_PLANS = ['pro', 'pro_monthly', 'pro_annual', 'classroom', 'teacher', 'voucher', 'admin'];
const TEACHER_PLANS = ['classroom', 'teacher', 'school', 'admin'];

const AUTH_KEYS = [
  'pp_token',
  'pp_email',
  'pp_account',
  'pp_user_name',
  'pp_plan',
  'pp_access_plan',
  'pp_is_teacher',
  'pp_classroom_access',
  'pp_auth_provider',
  'pp_photo_url',
  'accountSummary',
  'loginComplete',
  'loginDate',
  'authMethod',
  'authIdentifier',
  'authPhotoURL',
  // Classroom membership - must clear so a new account on the same device
  // doesn't inherit the previous user's teacher group and submit progress there.
  'classroomJoined',
  'classroomMode',
  'classroomRooms',
  // Optimistic-lock version - account-specific; a stale value from a previous
  // user causes immediate 409 conflicts on the new user's first sync push.
  'pp_sync_version',
  // Profile fetch cooldown - clear so the next account gets an immediate fetch
  // rather than waiting out the previous user's 5-minute cooldown window.
  'pp_profile_fetched_at',
];

export type AuthMethod = 'email' | 'google' | 'facebook' | 'apple';

export interface AuthLoginResponse {
  token?: string;
  email?: string;
  isAdmin?: boolean;
  isPro?: boolean;
  isTeacher?: boolean;
  isClassroom?: boolean;
  plan?: string;
  promptsUsed?: number;
  promptsLimit?: number | null;
  billing?: Record<string, unknown>;
  profile?: Record<string, unknown> | null;
  photoUrl?: string | null;
  [key: string]: unknown;
}

function titleCaseName(value: string) {
  return value.replace(/\b[a-z]/g, l => l.toUpperCase());
}

function deriveDisplayName(account: AuthLoginResponse, email: string): string {
  const profile = (account.profile as Record<string, unknown>) || {};
  const candidate =
    (profile.name as string) ||
    (profile.displayName as string) ||
    (profile.fullName as string) ||
    (profile.firstName as string) ||
    (account.name as string) ||
    email ||
    '';
  const clean = String(candidate || '').trim();
  if (!clean) return '';
  if (!clean.includes('@')) return clean;
  return titleCaseName(clean.split('@')[0].replace(/[._-]+/g, ' ').trim());
}

function planFor(account: AuthLoginResponse): string {
  const raw = String(account.plan || '').toLowerCase();
  if (account.isAdmin || account.isTeacher || account.isClassroom || TEACHER_PLANS.includes(raw)) {
    return 'classroom';
  }
  if (account.isPro || PRO_PLANS.includes(raw)) return 'pro';
  return '';
}

/**
 * Persist a successful login. Call after /api/auth/login returns 200.
 * `method` defaults to 'email'.
 */
export async function storeAuthSession(
  data: AuthLoginResponse,
  fallbackEmail: string,
  method: AuthMethod = 'email',
  photoUrl?: string | null,
): Promise<void> {
  const email = (data.email || fallbackEmail || '').toLowerCase();
  const account: AuthLoginResponse = { ...data, email };
  const accountJson = JSON.stringify(account);
  const name = deriveDisplayName(account, email);
  const plan = planFor(account);

  const writes: Array<[string, string]> = [
    ['pp_token', String(data.token || '')],
    ['pp_email', email],
    ['pp_account', accountJson],
    ['accountSummary', accountJson],
    ['pp_auth_provider', method],
    ['loginComplete', 'true'],
    ['loginDate', new Date().toISOString()],
    ['authMethod', method],
    ['authIdentifier', email],
  ];

  if (name) writes.push(['pp_user_name', name]);
  if (photoUrl) {
    writes.push(['pp_photo_url', photoUrl]);
    writes.push(['authPhotoURL', photoUrl]);
    writes.push(['profilePic', photoUrl]);
  }

  if (plan) {
    writes.push(['pp_plan', plan]);
    writes.push(['pp_access_plan', plan]);
  }
  const teacherFlag = plan === 'classroom';
  if (teacherFlag) {
    writes.push(['pp_is_teacher', 'true']);
    writes.push(['pp_classroom_access', 'true']);
  }

  await AsyncStorage.multiSet(writes);

  // Remove plan/teacher keys if they shouldn't be set (multiSet can't delete).
  if (!plan) await AsyncStorage.multiRemove(['pp_plan', 'pp_access_plan']);
  if (!teacherFlag) await AsyncStorage.multiRemove(['pp_is_teacher', 'pp_classroom_access']);

  // Ties the RevenueCat customer (Android Play Billing) to the same email
  // identity as everything else. No-op on iOS/web or if not configured.
  // Awaited (with the SDK call itself still swallowing its own errors) so
  // callers that navigate right after storeAuthSession() resolves - e.g. a
  // sign-in screen - can't race ahead of RevenueCat's identity switch.
  await identifyUser(email).catch(() => {});
}

/**
 * Wipe every auth key. Used by sign-out.
 */
export async function clearAuthSession(): Promise<void> {
  await AsyncStorage.multiRemove(AUTH_KEYS);
  // Awaited for the same reason as identifyUser() above - a caller that
  // signs back in right after clearAuthSession() resolves shouldn't race
  // RevenueCat's still-in-flight logout.
  await signOutUser().catch(() => {});
}

/**
 * Cached isPro/isAdmin flags for gating UI (e.g. locking Pro-only exercise
 * modules on the Practice Hub). Reads the same 'accountSummary' blob
 * settings.tsx keeps fresh via /api/auth/me, and that storeAuthSession()
 * seeds immediately after login/signup - so this is available without a
 * network round trip and stays in sync with whatever settings.tsx last saw.
 * Defaults to { isPro: false, isAdmin: false } for logged-out/local-only
 * users, which is the correct "free" gate state.
 */
export interface AccountFlags {
  isPro: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
}

export async function getAccountFlags(): Promise<AccountFlags> {
  try {
    const raw = await AsyncStorage.getItem('accountSummary');
    if (!raw) return { isPro: false, isAdmin: false, isTeacher: false };
    const account = JSON.parse(raw);
    return { isPro: !!account?.isPro, isAdmin: !!account?.isAdmin, isTeacher: !!account?.isTeacher };
  } catch {
    return { isPro: false, isAdmin: false, isTeacher: false };
  }
}

/**
 * Get the saved JWT (or empty string if not logged in).
 * Checks legacy keys too for safety.
 */
export async function getSavedToken(): Promise<string> {
  try {
    const entries = await AsyncStorage.multiGet([
      'pp_token',
      'webAuthToken',
      'authToken',
      'jwt',
      'polyPuffToken',
    ]);
    return entries.find(([, v]) => !!v)?.[1] || '';
  } catch {
    // A storage read failure here shouldn't break callers that used to work
    // fine with no token at all (e.g. anonymous API calls in services/api.js)
    // - degrade to "not signed in" instead of throwing.
    return '';
  }
}

/** Decode a base64url segment without relying on atob (Hermes-safe). */
function b64urlDecode(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  let buffer = 0;
  let bits = 0;
  for (const ch of b64) {
    if (ch === '=') break;
    const idx = chars.indexOf(ch);
    if (idx === -1) continue;
    buffer = (buffer << 6) | idx;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }
  return out;
}

/**
 * True if a saved JWT exists AND has not expired (reads the `exp` claim only -
 * does NOT verify the signature). Lets callers tell an expired/absent session
 * (route the user back to login) apart from a genuine quota / rate-limit
 * response on a still-valid session (just surface the message). Fails closed
 * (returns false) on any parse problem, and treats a token with no `exp` as
 * valid so a non-expiring token isn't wrongly logged out.
 */
export async function isSavedTokenValid(): Promise<boolean> {
  try {
    const token = await getSavedToken();
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(b64urlDecode(parts[1]));
    if (!payload || typeof payload.exp !== 'number') return true;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
