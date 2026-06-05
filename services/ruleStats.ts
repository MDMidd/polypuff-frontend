/**
 * Rule Stats Service — Poly-Puff
 * ================================
 * 
 * Fetches grammar database statistics from /api/stats once,
 * caches them in AsyncStorage, and provides them to any screen.
 * 
 * Falls back to hardcoded defaults if the server is unreachable.
 * 
 * Usage:
 *   import { getRuleStats } from '../services/ruleStats';
 *   const stats = await getRuleStats();
 *   // stats = { totalRules: 340, categoryCount: 35, languageCount: 14, languages: [...] }
 * 
 * FILE: services/ruleStats.ts
 * LOCATION: translation-trainer-frontend/services/ruleStats.ts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl } from './api';

const CACHE_KEY = 'ruleStatsCache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // refresh once per day

// Hardcoded fallback — update these when you know the DB has changed
const DEFAULTS = {
  totalRules: 340,
  categoryCount: 35,
  languageCount: 14,
  languages: [
    'Spanish', 'Mandarin', 'Arabic', 'French', 'Portuguese',
    'Russian', 'Japanese', 'German', 'Polish', 'Hindi',
    'Italian', 'Czech', 'Afrikaans', 'Bulgarian',
  ],
};

export interface RuleStats {
  totalRules: number;
  categoryCount: number;
  languageCount: number;
  languages: string[];
}

let memoryCache: RuleStats | null = null;

/**
 * Returns database stats. Tries in order:
 *   1. In-memory cache (instant)
 *   2. AsyncStorage cache (if < 24h old)
 *   3. Live fetch from /api/stats
 *   4. Hardcoded defaults
 */
export async function getRuleStats(): Promise<RuleStats> {
  // 1. Memory cache
  if (memoryCache) return memoryCache;

  // 2. AsyncStorage cache
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached.fetchedAt && Date.now() - cached.fetchedAt < CACHE_TTL) {
        memoryCache = cached.stats;
        return cached.stats;
      }
    }
  } catch (e) {}

  // 3. Live fetch
  try {
    const BASE = await getServerUrl();
    const res = await fetch(`${BASE}/api/stats`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      const stats: RuleStats = {
        totalRules: data.totalRules || DEFAULTS.totalRules,
        categoryCount: data.categories ? Object.keys(data.categories).length : DEFAULTS.categoryCount,
        languageCount: data.languages ? data.languages.length : DEFAULTS.languageCount,
        languages: data.languages || DEFAULTS.languages,
      };
      // Cache it
      memoryCache = stats;
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ stats, fetchedAt: Date.now() }));
      return stats;
    }
  } catch (e) {
    // Server unreachable — fall through to defaults
  }

  // 4. Defaults
  memoryCache = DEFAULTS;
  return DEFAULTS;
}

/**
 * Force refresh from server (e.g. after a database update).
 */
export async function refreshRuleStats(): Promise<RuleStats> {
  memoryCache = null;
  await AsyncStorage.removeItem(CACHE_KEY);
  return getRuleStats();
}
