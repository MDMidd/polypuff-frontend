/**
 * Voice Recording Service - Poly-Puff
 * =====================================
 * Handles all audio recording, storage, and playback across the app.
 *
 * Storage: FileSystem.documentDirectory + 'polypuff-recordings/'
 * Format:  M4A/AAC — works on both iOS and Android natively
 * Index:   AsyncStorage key 'voiceRecordings' stores metadata array
 *
 * FILE: services/recordingService.ts
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface VoiceRecording {
  id:          string;    // unique ID
  uri:         string;    // local file:// path on device
  label:       string;    // human-readable label e.g. "Placement Test — Speaking Q1"
  exercise:    string;    // exercise id e.g. 'placement', 'translation', 'speaking'
  duration:    number;    // seconds
  date:        string;    // ISO date string
  size:        number;    // bytes
  transcript?: string;    // optional speech-to-text transcript
}

// ── Constants ─────────────────────────────────────────────────────────────────
const RECORDINGS_DIR  = FileSystem.documentDirectory + 'polypuff-recordings/';
const RECORDINGS_KEY  = 'voiceRecordings';
const RECORDING_ENABLED_KEY = 'voiceRecordingEnabled';
const MAX_RECORDINGS  = 200;

// ── Ensure directory exists ───────────────────────────────────────────────────
export async function ensureRecordingsDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(RECORDINGS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(RECORDINGS_DIR, { intermediates: true });
  }
}

// ── Settings helpers ──────────────────────────────────────────────────────────
export async function isRecordingEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(RECORDING_ENABLED_KEY);
  // Default: enabled (null = first launch = enabled)
  return val !== 'false';
}

export async function setRecordingEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(RECORDING_ENABLED_KEY, enabled ? 'true' : 'false');
}

// ── Request microphone permission ─────────────────────────────────────────────
export async function requestMicPermission(): Promise<boolean> {
  const { status } = await Audio.requestPermissionsAsync();
  return status === 'granted';
}

// ── Load all recordings metadata ──────────────────────────────────────────────
export async function loadRecordings(): Promise<VoiceRecording[]> {
  const raw = await AsyncStorage.getItem(RECORDINGS_KEY);
  if (!raw) return [];
  const recordings: VoiceRecording[] = JSON.parse(raw);
  // Verify files still exist (user may have cleared storage)
  const verified: VoiceRecording[] = [];
  for (const r of recordings) {
    try {
      const info = await FileSystem.getInfoAsync(r.uri);
      if (info.exists) verified.push(r);
    } catch {
      // skip missing files
    }
  }
  if (verified.length !== recordings.length) {
    await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(verified));
  }
  return verified;
}

// ── Save recording metadata ───────────────────────────────────────────────────
export async function saveRecordingMeta(rec: VoiceRecording): Promise<void> {
  const existing = await loadRecordings();
  const updated = [rec, ...existing].slice(0, MAX_RECORDINGS);
  await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(updated));
}

// ── Delete a recording ────────────────────────────────────────────────────────
export async function deleteRecording(id: string): Promise<void> {
  const recordings = await loadRecordings();
  const target = recordings.find(r => r.id === id);
  if (target) {
    try { await FileSystem.deleteAsync(target.uri, { idempotent: true }); } catch {}
  }
  const updated = recordings.filter(r => r.id !== id);
  await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(updated));
}

// ── Delete all recordings ─────────────────────────────────────────────────────
export async function deleteAllRecordings(): Promise<void> {
  const recordings = await loadRecordings();
  for (const r of recordings) {
    try { await FileSystem.deleteAsync(r.uri, { idempotent: true }); } catch {}
  }
  await AsyncStorage.removeItem(RECORDINGS_KEY);
}

// ── Get total storage used ────────────────────────────────────────────────────
export async function getTotalStorageBytes(): Promise<number> {
  const recordings = await loadRecordings();
  return recordings.reduce((sum, r) => sum + (r.size || 0), 0);
}

// ── Generate a filename from exercise label ───────────────────────────────────
export function generateFilename(exercise: string, label: string): string {
  const date    = new Date().toISOString().split('T')[0];           // 2026-04-03
  const time    = new Date().toTimeString().split(' ')[0].replace(/:/g, '-'); // 14-30-22
  const safe    = label.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').slice(0, 30);
  return `${exercise}_${safe}_${date}_${time}.m4a`;
}

// ── Format duration ───────────────────────────────────────────────────────────
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Format file size ──────────────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
