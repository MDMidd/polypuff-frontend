/**
 * useVoiceRecorder Hook - Poly-Puff
 * ====================================
 * Drop-in hook for any exercise screen that wants to record the user's voice.
 * Handles: permission check → recording → saving → metadata storage
 *
 * Usage:
 *   const recorder = useVoiceRecorder({ exercise: 'placement', label: 'Speaking Q1' });
 *   <recorder.RecordButton />   — shows a mic button + timer
 *   recorder.lastRecording     — the saved VoiceRecording object after stopping
 *
 * FILE: hooks/useVoiceRecorder.ts
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import {
  ensureRecordingsDir,
  isRecordingEnabled,
  requestMicPermission,
  saveRecordingMeta,
  generateFilename,
  formatDuration,
  VoiceRecording,
} from '../services/recordingService';

interface UseVoiceRecorderOptions {
  exercise: string;   // e.g. 'placement', 'translation', 'speaking'
  label:    string;   // human-readable label for the recording
  onSaved?: (rec: VoiceRecording) => void;
}

export interface VoiceRecorderState {
  isRecording:    boolean;
  isEnabled:      boolean;
  hasPermission:  boolean;
  duration:       number;       // seconds elapsed while recording
  lastRecording:  VoiceRecording | null;
  startRecording: () => Promise<void>;
  stopRecording:  () => Promise<VoiceRecording | null>;
  formatDuration: (s: number) => string;
}

export function useVoiceRecorder({
  exercise,
  label,
  onSaved,
}: UseVoiceRecorderOptions): VoiceRecorderState {
  const recordingRef    = useRef<Audio.Recording | null>(null);
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isRecording,   setIsRecording]   = useState(false);
  const [isEnabled,     setIsEnabled]     = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [duration,      setDuration]      = useState(0);
  const [lastRecording, setLastRecording] = useState<VoiceRecording | null>(null);

  // Check settings + permission on mount
  useEffect(() => {
    (async () => {
      const enabled = await isRecordingEnabled();
      setIsEnabled(enabled);
      if (enabled) {
        const granted = await requestMicPermission();
        setHasPermission(granted);
      }
    })();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    if (!isEnabled || !hasPermission) return;
    try {
      await ensureRecordingsDir();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setDuration(0);
      // Start duration counter
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    } catch (e) {
      console.warn('Voice recorder: could not start recording', e);
    }
  }, [isEnabled, hasPermission]);

  const stopRecording = useCallback(async (): Promise<VoiceRecording | null> => {
    if (!recordingRef.current) return null;
    try {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const tempUri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      if (!tempUri) return null;

      // Move from temp cache to persistent directory
      const filename = generateFilename(exercise, label);
      const persistentUri = FileSystem.documentDirectory + 'polypuff-recordings/' + filename;
      await FileSystem.moveAsync({ from: tempUri, to: persistentUri });

      // Get file size
      const fileInfo = await FileSystem.getInfoAsync(persistentUri);
      const size = (fileInfo as any).size || 0;

      const rec: VoiceRecording = {
        id:       Date.now().toString(),
        uri:      persistentUri,
        label,
        exercise,
        duration: Math.floor(duration),
        date:     new Date().toISOString(),
        size,
      };

      await saveRecordingMeta(rec);
      setLastRecording(rec);
      setDuration(0);
      if (onSaved) onSaved(rec);
      return rec;
    } catch (e) {
      console.warn('Voice recorder: could not stop recording', e);
      setIsRecording(false);
      return null;
    }
  }, [exercise, label, duration, onSaved]);

  return {
    isRecording,
    isEnabled,
    hasPermission,
    duration,
    lastRecording,
    startRecording,
    stopRecording,
    formatDuration,
  };
}
