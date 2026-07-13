/**
 * API Service - Poly-Puff
 * ========================
 *
 * Central server URL config + shared API helpers.
 * All exercises import getServerUrl() from here.
 *
 * FILE: services/api.js
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { getAuthHeaders } from '../utils/auth';

// ═══ PRODUCTION SERVER URL ═══
export const DEFAULT_SERVER = 'https://polypuff-backend-production-bec9.up.railway.app';
export const LOCAL_SERVER = 'http://127.0.0.1:3000';
export const ANDROID_EMULATOR_SERVER = 'http://10.0.2.2:3000';

// Cached URL for synchronous access (used by Settings screen)
let _cachedUrl = DEFAULT_SERVER;

/**
 * Get the server URL (async).
 * Checks AsyncStorage first (for dev overrides), then falls back to DEFAULT_SERVER.
 */
export const getServerUrl = async () => {
  try {
    const url = await AsyncStorage.getItem('serverUrl');
    _cachedUrl = url || DEFAULT_SERVER;
    return _cachedUrl;
  } catch {
    return DEFAULT_SERVER;
  }
};

// Synchronous getter - settings.tsx calls getServerUrl() without await
// This makes it work both ways
getServerUrl.sync = () => _cachedUrl;

/**
 * Save a new server URL to AsyncStorage.
 * Used by Settings screen "Save & Test" button.
 */
export const setServerUrl = async (url) => {
  try {
    const normalized = (url || DEFAULT_SERVER).trim().replace(/\/+$/, '');
    await AsyncStorage.setItem('serverUrl', normalized);
    _cachedUrl = normalized;
  } catch (e) {}
};

/**
 * Ensure the cached URL is loaded from storage.
 * Call on mount in Settings screen before reading synchronously.
 */
export const ensureUrlLoaded = async () => {
  try {
    const url = await AsyncStorage.getItem('serverUrl');
    _cachedUrl = url || DEFAULT_SERVER;
  } catch {
    _cachedUrl = DEFAULT_SERVER;
  }
  return _cachedUrl;
};

/**
 * Check server health.
 * Used by Settings screen to show Connected/Not reachable status.
 */
export const checkHealth = async () => {
  const BASE = _cachedUrl || DEFAULT_SERVER;
  const res = await fetch(`${BASE}/api/health`, { method: 'GET' });
  if (!res.ok) throw new Error('Server not reachable');
  return res.json();
};

// ═══ SHARED ═══

/**
 * Build an Error from a failed fetch Response, preserving the server's own
 * error message and HTTP status. Without this, callers throw a generic
 * "Server error" and the UI shows a fixed message - so a 429 rate-limit /
 * monthly-quota message or a 401 auth failure never reaches the user.
 */
export const errorFromResponse = async (res) => {
  let message = '';
  try {
    const data = await res.json();
    message = data?.error || data?.message || '';
  } catch {}
  const err = new Error(message || `Server error (${res.status})`);
  err.status = res.status;
  err.serverMessage = message;
  return err;
};

// ═══ TRANSLATION ═══

/**
 * Generate a translation exercise.
 */
export const generateExercise = async ({ level, nativeLanguage, sentenceLength, customRequest, previousSentences, masteredSentences, profile, weakAreas }) => {
  const BASE = await getServerUrl();
  const res = await fetch(`${BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
    body: JSON.stringify({ level, nativeLanguage, sentenceLength, customRequest, previousSentences, masteredSentences, profile, weakAreas }),
  });
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
};

/**
 * Check a translation answer.
 * Note: server expects 'originalSentence' (not 'original')
 */
export const checkTranslation = async ({ originalSentence, studentAnswer, correctAnswer, level, nativeLanguage }) => {
  const BASE = await getServerUrl();
  const res = await fetch(`${BASE}/api/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
    body: JSON.stringify({ originalSentence, studentAnswer, correctAnswer, level, nativeLanguage }),
  });
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
};

/**
 * Resolve the correct English answer for an existing prompt.
 * Used by "Show answer" when the screen does not already have an answer key.
 */
export const revealTranslationAnswer = async ({ originalSentence, correctAnswer = '', level, nativeLanguage }) => {
  const BASE = await getServerUrl();
  const res = await fetch(`${BASE}/api/translate-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
    body: JSON.stringify({
      originalSentence,
      correctAnswer,
      fromNativeLanguage: nativeLanguage,
      nativeLanguage,
      level,
    }),
  });
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
};

// ═══ EXERCISE BANK ═══

/**
 * Get next exercise from the pre-built bank (avoids repeats).
 * Server endpoint: /api/exercises/next (with 's')
 */
export const getNextExercise = async ({ level, nativeLanguage, sentenceLength, previousIds = [] }) => {
  const BASE = await getServerUrl();
  const res = await fetch(`${BASE}/api/exercises/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
    body: JSON.stringify({ level, nativeLanguage, sentenceLength, previousIds }),
  });
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
};

/**
 * Check an exercise bank answer against gold-standard.
 * Server endpoint: /api/exercises/check (with 's')
 */
export const checkExercise = async ({ exerciseId, studentAnswer, level, nativeLanguage }) => {
  const BASE = await getServerUrl();
  const res = await fetch(`${BASE}/api/exercises/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
    body: JSON.stringify({ exerciseId, studentAnswer, level, nativeLanguage }),
  });
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
};

// ═══ AI CHAT ═══

/**
 * Chat with the AI tutor (follow-up questions about grammar, etc.)
 */
export const chatWithTutor = async ({ message, context, history = [] }) => {
  const BASE = await getServerUrl();
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
    body: JSON.stringify({ message, context, history }),
  });
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
};

// ═══ GRAMMAR RULES ═══

/**
 * Get all grammar rules (or filtered by category).
 */
export const getRules = async (category) => {
  const BASE = await getServerUrl();
  const url = category ? `${BASE}/api/rules?category=${category}` : `${BASE}/api/rules`;
  const res = await fetch(url);
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
};

/**
 * Get a single grammar rule by ID.
 */
export const getRule = async (ruleId) => {
  const BASE = await getServerUrl();
  const res = await fetch(`${BASE}/api/rules/${ruleId}`);
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
};

/**
 * Get student stats/progress.
 */
export const getStats = async () => {
  const BASE = await getServerUrl();
  const res = await fetch(`${BASE}/api/stats`);
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
};

// ═══ TEXT-TO-SPEECH ═══

/**
 * Speak the correct English version (native speaker playback).
 * Rate 0.9 for clarity.
 */
export const speakCorrectVersion = (text) => {
  Speech.stop();
  Speech.speak(text, {
    language: 'en-US',
    rate: 0.9,
    pitch: 1.0,
  });
};

/**
 * Speak the student's version back to them.
 * Rate 0.85 so they can hear their own phrasing clearly.
 */
export const speakStudentVersion = (text) => {
  Speech.stop();
  Speech.speak(text, {
    language: 'en-US',
    rate: 0.85,
    pitch: 1.0,
  });
};

/**
 * Stop any current speech playback.
 */
export const stopSpeaking = async () => {
  try {
    await Speech.stop();
  } catch (e) {}
};
