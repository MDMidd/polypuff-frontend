/**
 * syncService.ts — Poly-Puff mobile vault sync
 *
 * Mobile counterpart to sync-client.js (website).
 * Pulls vault data from /api/sync, merges with AsyncStorage, writes back
 * locally, then pushes the merged result to the server.
 *
 * Vault key mapping (AsyncStorage → sync blob slot):
 *   vocabVault           → vocab
 *   pp_word_chunks_vault → wordchunks
 *   pp_grammar_vault     → grammar
 *
 * On pull, also writes the web canonical key (pp_vocabVault) so a user
 * who shares a device with the web app sees consistent data.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl } from './api';
import { pullProfile } from './profileService';

// ─── Vault key config ──────────────────────────────────────────────────────
// keys[0] is the primary read/write key; rest are written-but-secondary aliases.
const VAULT_KEYS: Record<string, string[]> = {
  vocab:      ['vocabVault', 'pp_vocabVault'],
  wordchunks: ['pp_word_chunks_vault', 'pp_wordchunks_vault'],
  grammar:    ['pp_grammar_vault', 'pp_grammar_practice_vault'],
};
const VAULT_TYPES = ['vocab', 'wordchunks', 'grammar'] as const;
type VaultType = typeof VAULT_TYPES[number];

const VERSION_KEY = 'pp_sync_version';
const CAP = 500;

// ─── Shared in-flight guard ────────────────────────────────────────────────
let inFlight = false;

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
type SyncBlob = { vault: Record<string, VaultItem[]>; daily?: DailyStats | null };
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

function itemDate(item: VaultItem): number {
  return new Date(String(item.date || item.addedAt || 0)).getTime() || 0;
}

function mergeOne(type: string, localArr: VaultItem[], serverArr: VaultItem[]): VaultItem[] {
  const map = new Map<string, VaultItem>();
  // Server first so local fields overlay server fields when keys collide.
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
  return out;
}

// ─── Local read/write ──────────────────────────────────────────────────────
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
  return { vault, daily };
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
}

// ─── Core: syncNow ────────────────────────────────────────────────────────
async function syncNow(): Promise<{ ok: boolean; version?: number; error?: string }> {
  const token = await getToken();
  if (!token || inFlight) return { ok: false };
  inFlight = true;
  try {
    const server = await pullFromServer();
    const merged = mergeAll(await readLocal(), server.data || {});

    // Write merged data locally first so the UI is up-to-date immediately.
    await writeLocal(merged);

    const resp = await pushToServer(merged, server.version || 0);
    if (resp.status === 200) {
      await setKnownVersion(resp.body.version || 0);
      return { ok: true, version: resp.body.version };
    }
    if (resp.status === 409) {
      // Race with another writer — merge with the server's latest, retry once.
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
 * Pull from server, merge with local vault, write merged data back to
 * AsyncStorage, then push to server.
 * Call after login and on app focus (via useFocusEffect).
 */
export async function pullAndMerge(): Promise<void> {
  try { await syncNow(); } catch {}
  // Sync profile data separately — fire-and-forget alongside vault sync.
  pullProfile().catch(() => {});
}

/**
 * Push the current local vault to the server.
 * Call after any vault write (save word, save phrase, save grammar rule,
 * delete item) so changes propagate to other devices promptly.
 */
export async function pushVaults(): Promise<void> {
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
      // Server has newer data — do a full sync to reconcile.
      await syncNow();
    }
  } catch {}
}
