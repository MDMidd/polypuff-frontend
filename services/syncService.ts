/**
 * syncService.ts — Poly-Puff mobile vault + progress sync
 *
 * Mobile counterpart to sync-client.js (website).
 * Pulls vault + progress data from /api/sync, merges with AsyncStorage,
 * writes back locally, then pushes the merged result to the server.
 *
 * Vault key mapping (AsyncStorage → sync blob slot):
 *   vocabVault           → vocab
 *   pp_word_chunks_vault → wordchunks
 *   pp_grammar_vault     → grammar
 *
 * Progress key mapping (one per canonical exercise id):
 *   progress_recent_<id>   → progress[id].recent
 *   progress_feedback_<id> → progress[id].feedback
 *
 * Canonical exercise IDs are defined here and must match
 * sync-client.js (web) — the web side translates its short-form keys
 * (daily, quiz, vocab) to canonical (daily_challenge, grammar_quiz,
 * vocabulary). Mobile uses canonical natively.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { getServerUrl } from './api';
import { pullProfile } from './profileService';

// ─── Vault key config ──────────────────────────────────────────────────────
const VAULT_KEYS: Record<string, string[]> = {
  vocab:      ['vocabVault', 'pp_vocabVault'],
  wordchunks: ['pp_word_chunks_vault', 'pp_wordchunks_vault'],
  grammar:    ['pp_grammar_vault', 'pp_grammar_practice_vault'],
};
const VAULT_TYPES = ['vocab', 'wordchunks', 'grammar'] as const;
type VaultType = typeof VAULT_TYPES[number];

// ─── Progress key config ───────────────────────────────────────────────────
// Canonical IDs match sync-client.js PROGRESS_EXERCISES on the web side.
export const PROGRESS_EXERCISE_IDS = [
  'translation_trainer',
  'grammar',
  'writing',
  'listening',
  'word_chunks',
  'daily_challenge',
  'grammar_quiz',
  'vocabulary',
  'business_english',
  'cae',
  'ielts',
  'toefl',
  'placement_test',
] as const;
type ExerciseId = typeof PROGRESS_EXERCISE_IDS[number];

const PROGRESS_CAPS = { recent: 100, feedback: 100 };

const VERSION_KEY = 'pp_sync_version';
const CAP = 500;
const PUSH_DEBOUNCE_MS = 3000;

// ─── Shared in-flight guard + push debounce ────────────────────────────────
let inFlight = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

// ─── Auth helpers ──────────────────────────────────────────────────────────
async function getToken(): Promise<string> {
  try {
    const val = await AsyncStorage.getItem('pp_token');
    return val || '';
  } catch {
    return '';
  }
}

async function getKnownVersion(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(VERSION_KEY);
    const n = Number(raw || 0);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

async function setKnownVersion(v: number): Promise<void> {
  try {
    await AsyncStorage.setItem(VERSION_KEY, String(Number(v) || 0));
  } catch {}
}

// ─── HTTP helpers ──────────────────────────────────────────────────────────
async function pullFromServer(): Promise<{ data: SyncBlob; version: number }> {
  const [token, BASE] = await Promise.all([getToken(), getServerUrl()]);
  if (!token) throw new Error('not authed');
  const res = await fetch(`${BASE}/api/sync`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`sync pull failed: ${res.status}`);
  return res.json();
}

async function pushToServer(
  data: SyncBlob,
  baseVersion: number,
): Promise<{ status: number; body: PushResponse }> {
  const [token, BASE] = await Promise.all([getToken(), getServerUrl()]);
  if (!token) throw new Error('not authed');
  const res = await fetch(`${BASE}/api/sync`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data, baseVersion: Number(baseVersion) || 0 }),
  });
  const body: PushResponse = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

// ─── Types ─────────────────────────────────────────────────────────────────
type VaultItem = Record<string, unknown>;
type DailyStats = { streak?: number; bestStreak?: number; totalCompleted?: number; bestScore?: number; lastCompleted?: string; [key: string]: unknown };
type ProgressRow = { id?: string; date?: string; score?: number; detail?: string; feedback?: string; [key: string]: unknown };
type ProgressSection = { recent?: ProgressRow[]; feedback?: ProgressRow[] };
type ProgressMap = Partial<Record<ExerciseId, ProgressSection>>;
type SyncBlob = {
  vault: Record<string, VaultItem[]>;
  daily?: DailyStats | null;
  progress?: ProgressMap;
};
type PushResponse = { version?: number; data?: SyncBlob; [key: string]: unknown };

// ─── Merge logic (mirrors sync-client.js) ─────────────────────────────────
function dedupeKey(type: string, item: VaultItem): string | null {
  if (!item || typeof item !== 'object') return null;
  if (type === 'vocab') {
    const w = String(item.word || '').trim().toLowerCase();
    return w || null;
  }
  if (item.id) return `id:${item.id}`;
  const text = String(item.text || item.rule || item.phrase || '')
    .trim()
    .toLowerCase();
  return text ? `tx:${text}` : null;
}

function itemDate(item: VaultItem | ProgressRow): number {
  return new Date(String(item.date || item.addedAt || 0)).getTime() || 0;
}

function mergeOne(type: string, localArr: VaultItem[], serverArr: VaultItem[]): VaultItem[] {
  const map = new Map<string, VaultItem>();
  [serverArr, localArr].forEach((arr) => {
    (Array.isArray(arr) ? arr : []).forEach((item) => {
      const k = dedupeKey(type, item);
      if (!k) return;
      const prev = map.get(k);
      if (!prev) { map.set(k, item); return; }
      const winner = itemDate(item) >= itemDate(prev) ? item : prev;
      const loser  = winner === item ? prev : item;
      const merged: VaultItem = { ...loser, ...winner };
      Object.keys(loser).forEach((key) => {
        if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
          merged[key] = loser[key];
        }
      });
      map.set(k, merged);
    });
  });
  return Array.from(map.values()).sort((a, b) => itemDate(b) - itemDate(a));
}

function mergeDaily(local: DailyStats | null, server: DailyStats | null): DailyStats | null {
  if (!local && !server) return null;
  if (!local) return server;
  if (!server) return local;
  const localMs  = new Date(String(local.lastCompleted  || '1970-01-01')).getTime() || 0;
  const serverMs = new Date(String(server.lastCompleted || '1970-01-01')).getTime() || 0;
  const base = localMs >= serverMs ? local : server;
  return {
    ...base,
    bestStreak:     Math.max(Number(local.bestStreak     || 0), Number(server.bestStreak     || 0)),
    totalCompleted: Math.max(Number(local.totalCompleted || 0), Number(server.totalCompleted || 0)),
    bestScore:      Math.max(Number(local.bestScore      || 0), Number(server.bestScore      || 0)),
  };
}

// Deterministic id for legacy progress rows missing an `id` field.
// Mirrors the algorithm in sync-client.js (web).
function progressIdFor(item: ProgressRow): string {
  const basis =
    (item.date || '') + '|' +
    (item.score == null ? '' : item.score) + '|' +
    String(item.detail || item.feedback || '').slice(0, 80);
  let h = 0;
  for (let i = 0; i < basis.length; i++) {
    h = ((h << 5) - h + basis.charCodeAt(i)) | 0;
  }
  return 'pg-legacy-' + (h >>> 0).toString(36);
}

function mergeProgressList(
  localArr: ProgressRow[],
  serverArr: ProgressRow[],
  cap: number,
): ProgressRow[] {
  const map = new Map<string, ProgressRow>();
  [serverArr, localArr].forEach((arr) => {
    (Array.isArray(arr) ? arr : []).forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const id = String(item.id || progressIdFor(item));
      const key = 'id:' + id;
      const prev = map.get(key);
      if (!prev) {
        map.set(key, item.id ? item : { ...item, id });
        return;
      }
      const winner = itemDate(item) >= itemDate(prev) ? item : prev;
      const loser  = winner === item ? prev : item;
      const merged: ProgressRow = { ...loser, ...winner };
      Object.keys(loser).forEach((key2) => {
        if (merged[key2] === undefined || merged[key2] === null || merged[key2] === '') {
          merged[key2] = loser[key2];
        }
      });
      if (!merged.id) merged.id = id;
      map.set(key, merged);
    });
  });
  return Array.from(map.values())
    .sort((a, b) => itemDate(b) - itemDate(a))
    .slice(0, cap);
}

function mergeProgress(local: ProgressMap | undefined, server: ProgressMap | undefined): ProgressMap {
  const out: ProgressMap = {};
  const l = local || {};
  const s = server || {};
  PROGRESS_EXERCISE_IDS.forEach((id) => {
    const ls = l[id] || {};
    const ss = s[id] || {};
    const rec = mergeProgressList(ls.recent || [], ss.recent || [], PROGRESS_CAPS.recent);
    const fb  = mergeProgressList(ls.feedback || [], ss.feedback || [], PROGRESS_CAPS.feedback);
    if (rec.length || fb.length) {
      out[id] = { recent: rec, feedback: fb };
    }
  });
  return out;
}

function mergeAll(localData: SyncBlob, serverData: Partial<SyncBlob>): SyncBlob {
  const localVault = (localData && localData.vault) || {};
  const serverVault = (serverData && serverData.vault) || {};
  const out: SyncBlob = { vault: {} };
  VAULT_TYPES.forEach((type) => {
    out.vault[type] = mergeOne(
      type,
      (localVault[type] as VaultItem[]) || [],
      (serverVault[type] as VaultItem[]) || [],
    );
  });
  out.daily = mergeDaily(localData?.daily || null, serverData?.daily || null);
  out.progress = mergeProgress(localData?.progress, serverData?.progress);
  return out;
}

// ─── Local read/write ──────────────────────────────────────────────────────
async function readLocalProgress(): Promise<ProgressMap> {
  const out: ProgressMap = {};
  await Promise.all(
    PROGRESS_EXERCISE_IDS.map(async (id) => {
      try {
        const [rawRecent, rawFeedback] = await Promise.all([
          AsyncStorage.getItem(`progress_recent_${id}`),
          AsyncStorage.getItem(`progress_feedback_${id}`),
        ]);
        const recent = rawRecent ? JSON.parse(rawRecent) : [];
        const feedback = rawFeedback ? JSON.parse(rawFeedback) : [];
        const rec = Array.isArray(recent) ? recent : [];
        const fb = Array.isArray(feedback) ? feedback : [];
        if (rec.length || fb.length) {
          out[id] = { recent: rec, feedback: fb };
        }
      } catch {}
    }),
  );
  return out;
}

async function readLocal(): Promise<SyncBlob> {
  const vault: Record<string, VaultItem[]> = {};
  await Promise.all(
    VAULT_TYPES.map(async (type) => {
      const primaryKey = VAULT_KEYS[type][0];
      try {
        const raw = await AsyncStorage.getItem(primaryKey);
        const arr = JSON.parse(raw || '[]');
        vault[type] = Array.isArray(arr) ? arr : [];
      } catch {
        vault[type] = [];
      }
    }),
  );
  let daily: DailyStats | null = null;
  try {
    const rawDaily = await AsyncStorage.getItem('pp_daily_challenge');
    if (rawDaily) daily = JSON.parse(rawDaily);
  } catch {}
  const progress = await readLocalProgress();
  return { vault, daily, progress };
}

async function writeLocalProgress(progress: ProgressMap | undefined): Promise<void> {
  if (!progress) return;
  const pairs: Array<[string, string]> = [];
  PROGRESS_EXERCISE_IDS.forEach((id) => {
    const section = progress[id];
    if (!section) return;
    if (Array.isArray(section.recent)) {
      pairs.push([`progress_recent_${id}`, JSON.stringify(section.recent)]);
    }
    if (Array.isArray(section.feedback)) {
      pairs.push([`progress_feedback_${id}`, JSON.stringify(section.feedback)]);
    }
  });
  if (pairs.length) await AsyncStorage.multiSet(pairs);
}

async function writeLocal(data: SyncBlob): Promise<void> {
  if (!data || !data.vault) return;
  const pairs: Array<[string, string]> = [];
  VAULT_TYPES.forEach((type) => {
    const items = data.vault[type];
    if (!Array.isArray(items)) return;
    const capped = JSON.stringify(items.slice(0, CAP));
    VAULT_KEYS[type].forEach((key) => {
      pairs.push([key, capped]);
    });
  });
  if (data.daily) pairs.push(['pp_daily_challenge', JSON.stringify(data.daily)]);
  if (pairs.length) await AsyncStorage.multiSet(pairs);
  await writeLocalProgress(data.progress);
}

// ─── Core: syncNow ────────────────────────────────────────────────────────
async function syncNow(): Promise<{ ok: boolean; version?: number; error?: string }> {
  const token = await getToken();
  if (!token || inFlight) return { ok: false };
  inFlight = true;
  try {
    const server = await pullFromServer();
    const merged = mergeAll(await readLocal(), server.data || {});

    await writeLocal(merged);

    const resp = await pushToServer(merged, server.version || 0);
    if (resp.status === 200) {
      await setKnownVersion(resp.body.version || 0);
      return { ok: true, version: resp.body.version };
    }
    if (resp.status === 409) {
      const serverCurrent = (resp.body as { data?: SyncBlob; version?: number });
      const remerged = mergeAll(merged, serverCurrent.data || {});
      await writeLocal(remerged);
      const retry = await pushToServer(remerged, serverCurrent.version || 0);
      if (retry.status === 200) {
        await setKnownVersion(retry.body.version || 0);
        return { ok: true, version: retry.body.version };
      }
      return { ok: false };
    }
    return { ok: false };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  } finally {
    inFlight = false;
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Pull from server, merge with local vault + progress, write merged back to
 * AsyncStorage, then push to server. Call after login and on app focus
 * (via useFocusEffect).
 */
export async function pullAndMerge(): Promise<void> {
  try { await syncNow(); } catch {}
  pullProfile().catch(() => {});
}

/**
 * Push the current local vault + progress to the server. Debounced ~3s so a
 * long quiz session (one push per question) only fires one network request.
 * Call after any vault or progress write.
 */
export function pushVaults(): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void pushNow();
  }, PUSH_DEBOUNCE_MS);
}

async function pushNow(): Promise<void> {
  try {
    if (inFlight) return;
    const token = await getToken();
    if (!token) return;
    const local = await readLocal();
    const version = await getKnownVersion();
    const resp = await pushToServer(local, version);
    if (resp.status === 200) {
      await setKnownVersion(resp.body.version || 0);
    } else if (resp.status === 409) {
      await syncNow();
    }
  } catch {}
}

// A finished exercise calls pushVaults(), which waits PUSH_DEBOUNCE_MS before
// actually sending anything. If the app backgrounds inside that window (very
// common — finishing an exercise and immediately switching away is the
// normal flow), the timer never fires and that progress is silently lost.
// Flush immediately the moment the app stops being active.
AppState.addEventListener('change', (state) => {
  if (state !== 'active' && pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
    void pushNow();
  }
});
