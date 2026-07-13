/**
 * useAuthFailureHandler
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared "session lapsed → back to login" safety net for AI-calling screens.
 *
 * A signed-in user always gets the server's 300/month quota, never the
 * anonymous 5-per-15-min IP limiter. So an auth/rate failure (401/403/429)
 * whose locally-saved JWT is missing or expired means the session has lapsed -
 * clear it and route the user back to login instead of showing a confusing
 * "rate limit" error. A genuine quota hit on a still-valid token falls through
 * so the caller can surface the real server message instead.
 *
 * Requires the thrown error to carry `.status` (the HTTP status). Errors from
 * services/api.js already do (errorFromResponse); screens with their own fetch
 * should throw via `errorFromResponse(res)` too.
 *
 * Usage:
 *   const handleAuthFailure = useAuthFailureHandler();
 *   ...
 *   } catch (e) {
 *     if (!(await handleAuthFailure(e))) {
 *       // normal error handling (show message) here
 *     }
 *   }
 *
 * FILE: hooks/useAuthFailureHandler.ts
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { isSavedTokenValid, clearAuthSession } from '../utils/authSession';
import { useAuth } from '../app/_layout';

export function useAuthFailureHandler(): (error: any) => Promise<boolean> {
  const { resetAuth } = useAuth();

  return useCallback(async (error: any): Promise<boolean> => {
    const status = error?.status;
    if (status !== 401 && status !== 403 && status !== 429) return false;
    // Genuine quota/rate hit on a still-valid session — let the caller show it.
    if (await isSavedTokenValid()) return false;
    await clearAuthSession();
    Alert.alert('Session expired', 'Your session has expired. Please sign in again to continue.');
    resetAuth();
    return true;
  }, [resetAuth]);
}
