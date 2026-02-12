/**
 * Offline Cache Service - Translation Trainer v7
 * ================================================
 * 
 * Caches exercises, rules, and user data for offline use.
 * Auto-syncs when connection restored.
 * 
 * FILE: services/offlineCache.js
 * GOES IN: translation-trainer-frontend/services/offlineCache.js
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { getServerUrl } from './api';

const CACHE_KEYS = {
  RULES: 'cache_rules',
  EXERCISES: 'cache_exercises',
  PENDING_SUBMISSIONS: 'cache_pending_submissions',
  LAST_SYNC: 'cache_last_sync',
  OFFLINE_PROGRESS: 'cache_offline_progress',
};

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ═══ CONNECTION CHECK ═══
export const isOnline = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable !== false;
  } catch {
    return true; // assume online if can't check
  }
};

// ═══ CACHE RULES ═══
export const cacheRules = async () => {
  try {
    const online = await isOnline();
    if (!online) return getCachedRules();

    const resp = await fetch(`${getServerUrl()}/api/rules`);
    if (resp.ok) {
      const data = await resp.json();
      await AsyncStorage.setItem(CACHE_KEYS.RULES, JSON.stringify({
        data: data.rules || data,
        cachedAt: Date.now(),
      }));
      console.log(`📦 Cached ${(data.rules || data).length} rules`);
      return data.rules || data;
    }
  } catch (e) {
    console.log('⚡ Offline - using cached rules');
  }
  return getCachedRules();
};

export const getCachedRules = async () => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.RULES);
    if (cached) {
      const { data, cachedAt } = JSON.parse(cached);
      return data;
    }
  } catch (e) {}
  return [];
};

// ═══ CACHE EXERCISES ═══
export const cacheExercises = async (level = 'B1', language = 'Spanish') => {
  try {
    const online = await isOnline();
    if (!online) return getCachedExercises();

    const resp = await fetch(`${getServerUrl()}/api/exercise?level=${level}&nativeLanguage=${language}`);
    if (resp.ok) {
      const data = await resp.json();
      // Append to cached exercises
      const existing = await getCachedExercises();
      const ids = new Set(existing.map(e => e.id));
      if (data.id && !ids.has(data.id)) {
        existing.push(data);
      }
      // Pre-fetch a batch of exercises
      const exercises = existing.slice(-50); // keep last 50
      await AsyncStorage.setItem(CACHE_KEYS.EXERCISES, JSON.stringify({
        data: exercises,
        cachedAt: Date.now(),
      }));
      return data;
    }
  } catch (e) {}
  return getCachedExercises().then(exs => exs[Math.floor(Math.random() * exs.length)] || null);
};

export const getCachedExercises = async () => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.EXERCISES);
    if (cached) {
      const { data } = JSON.parse(cached);
      return data || [];
    }
  } catch (e) {}
  return [];
};

// ═══ OFFLINE SUBMISSION QUEUE ═══
export const queueSubmission = async (submission) => {
  try {
    const pending = await getPendingSubmissions();
    pending.push({
      ...submission,
      queuedAt: Date.now(),
    });
    await AsyncStorage.setItem(CACHE_KEYS.PENDING_SUBMISSIONS, JSON.stringify(pending));
    console.log(`📥 Queued offline submission (${pending.length} pending)`);
  } catch (e) {}
};

export const getPendingSubmissions = async () => {
  try {
    const data = await AsyncStorage.getItem(CACHE_KEYS.PENDING_SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const syncPendingSubmissions = async () => {
  const online = await isOnline();
  if (!online) return { synced: 0, remaining: 0 };

  const pending = await getPendingSubmissions();
  if (pending.length === 0) return { synced: 0, remaining: 0 };

  let synced = 0;
  const failed = [];

  for (const sub of pending) {
    try {
      const resp = await fetch(`${getServerUrl()}${sub.endpoint || '/api/classroom/submit'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.data),
      });
      if (resp.ok) synced++;
      else failed.push(sub);
    } catch (e) {
      failed.push(sub);
    }
  }

  await AsyncStorage.setItem(CACHE_KEYS.PENDING_SUBMISSIONS, JSON.stringify(failed));
  console.log(`🔄 Synced ${synced}/${pending.length} submissions`);
  return { synced, remaining: failed.length };
};

// ═══ SAVE OFFLINE PROGRESS ═══
export const saveOfflineProgress = async (progress) => {
  try {
    const existing = await getOfflineProgress();
    existing.push({ ...progress, savedAt: Date.now() });
    // Keep last 500
    if (existing.length > 500) existing.splice(0, existing.length - 500);
    await AsyncStorage.setItem(CACHE_KEYS.OFFLINE_PROGRESS, JSON.stringify(existing));
  } catch (e) {}
};

export const getOfflineProgress = async () => {
  try {
    const data = await AsyncStorage.getItem(CACHE_KEYS.OFFLINE_PROGRESS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// ═══ PRE-FETCH BATCH (call on app startup when online) ═══
export const prefetchForOffline = async (level = 'B1', language = 'Spanish') => {
  const online = await isOnline();
  if (!online) return;

  console.log('📦 Pre-fetching for offline use...');
  
  // Cache rules
  await cacheRules();

  // Cache multiple exercises
  for (let i = 0; i < 10; i++) {
    try {
      await cacheExercises(level, language);
    } catch (e) { break; }
  }

  // Sync any pending submissions
  await syncPendingSubmissions();

  await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
  console.log('✅ Offline cache ready');
};

// ═══ GET CACHE STATUS ═══
export const getCacheStatus = async () => {
  const rules = await getCachedRules();
  const exercises = await getCachedExercises();
  const pending = await getPendingSubmissions();
  const lastSync = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);
  const online = await isOnline();

  return {
    online,
    rulesCount: rules.length,
    exercisesCount: exercises.length,
    pendingSubmissions: pending.length,
    lastSync: lastSync ? new Date(parseInt(lastSync)).toLocaleString() : 'Never',
  };
};

export default {
  isOnline, cacheRules, getCachedRules, cacheExercises, getCachedExercises,
  queueSubmission, getPendingSubmissions, syncPendingSubmissions,
  saveOfflineProgress, getOfflineProgress, prefetchForOffline, getCacheStatus,
};
