// frontend/services/timerService.ts
// Tracks time spent on each exercise across the app

import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMER_KEY = 'poly_puff_exercise_times';

export interface ExerciseTimeRecord {
  exerciseId: string;
  exerciseName: string;
  totalSeconds: number;
  lastSession: string; // ISO date string
  sessionCount: number;
}

// Load all records from storage
export async function getAllTimeRecords(): Promise<ExerciseTimeRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(TIMER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Save a completed session's time for one exercise
export async function recordExerciseTime(
  exerciseId: string,
  exerciseName: string,
  secondsElapsed: number
): Promise<void> {
  try {
    const records = await getAllTimeRecords();
    const existing = records.find(r => r.exerciseId === exerciseId);

    if (existing) {
      existing.totalSeconds += secondsElapsed;
      existing.lastSession = new Date().toISOString();
      existing.sessionCount += 1;
    } else {
      records.push({
        exerciseId,
        exerciseName,
        totalSeconds: secondsElapsed,
        lastSession: new Date().toISOString(),
        sessionCount: 1,
      });
    }

    await AsyncStorage.setItem(TIMER_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Timer record error:', e);
  }
}

// Get total time across ALL exercises (in seconds)
export async function getTotalTimeSeconds(): Promise<number> {
  const records = await getAllTimeRecords();
  return records.reduce((sum, r) => sum + r.totalSeconds, 0);
}

// Format seconds into "2h 14m" or "45m 30s"
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
