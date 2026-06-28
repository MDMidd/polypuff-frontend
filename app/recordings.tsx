/**
 * My Recordings Screen - Poly-Puff
 * ==================================
 * Browse, play back, and manage all voice recordings saved on the device.
 * Grouped by exercise type. Playback uses expo-av.
 *
 * FILE: app/recordings.tsx
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Alert,
  ActivityIndicator, Platform,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import {
  Mic, Play, Pause, Trash2, Share2, ChevronDown, ChevronUp,
  Volume2, Clock, Calendar, HardDrive, Settings, AlertCircle,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenBackground, BackHeader } from '../components/PolyPuffUI';
import { scaledFont } from '../utils/accessibility';
import {
  loadRecordings, deleteRecording, deleteAllRecordings,
  getTotalStorageBytes, isRecordingEnabled, setRecordingEnabled,
  formatDuration, formatFileSize, VoiceRecording,
} from '../services/recordingService';

// ── Exercise display names & colours ─────────────────────────────────────────
const EXERCISE_INFO: Record<string, { label: string; colour: string; icon: string }> = {
  placement:    { label: 'Placement Test — Speaking',    colour: '#C084FC', icon: '📋' },
  translation:  { label: 'Translation Trainer',          colour: '#00D9FF', icon: '🎯' },
  listening:    { label: 'Listening',                    colour: '#A78BFA', icon: '🎧' },
  speaking:     { label: 'Speaking Practice',            colour: '#B06CFF', icon: '🎙️' },
  grammar:      { label: 'Grammar Practice',             colour: '#34D399', icon: '📚' },
  writing:      { label: 'Writing',                      colour: '#F472B6', icon: '✏️' },
  word_chunks:  { label: 'Word Chunks',                  colour: '#60A5FA', icon: '🧩' },
  business:     { label: 'Business English',             colour: '#00E5A0', icon: '💼' },
  ielts:        { label: 'IELTS Practice',               colour: '#B06CFF', icon: '🎓' },
  toefl:        { label: 'TOEFL Practice',               colour: '#7B7FD4', icon: '🏫' },
  cae:          { label: 'CAE Practice',                 colour: '#7BB7E4', icon: '🎓' },
  general:      { label: 'General Practice',             colour: '#FFBE0B', icon: '🗣️' },
};

function getExerciseInfo(id: string) {
  return EXERCISE_INFO[id] || { label: id, colour: '#6b7280', icon: '🎙️' };
}

// ── Playback bar component ─────────────────────────────────────────────────────
function PlaybackBar({ rec, C }: { rec: VoiceRecording; C: any }) {
  const soundRef    = useRef<Audio.Sound | null>(null);
  const [playing,   setPlaying]   = useState(false);
  const [position,  setPosition]  = useState(0); // seconds
  const [loading,   setLoading]   = useState(false);
  const info = getExerciseInfo(rec.exercise);

  const togglePlay = async () => {
    if (loading) return;
    if (playing) {
      await soundRef.current?.pauseAsync();
      setPlaying(false);
    } else {
      setLoading(true);
      try {
        if (!soundRef.current) {
          const { sound } = await Audio.Sound.createAsync(
            { uri: rec.uri },
            { shouldPlay: true },
            (status) => {
              if (!status.isLoaded) return;
              setPosition(Math.floor((status.positionMillis || 0) / 1000));
              if (status.didJustFinish) {
                setPlaying(false);
                setPosition(0);
                soundRef.current?.unloadAsync();
                soundRef.current = null;
              }
            }
          );
          soundRef.current = sound;
        } else {
          await soundRef.current.playAsync();
        }
        setPlaying(true);
      } catch (e) {
        Alert.alert('Playback Error', 'Could not play this recording. The file may be missing.');
      }
      setLoading(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const progress = rec.duration > 0 ? position / rec.duration : 0;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {/* Play/pause button */}
      <TouchableOpacity
        onPress={togglePlay}
        style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: info.colour + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: info.colour + '50' }}
        accessibilityRole="button"
        accessibilityLabel={playing ? `Pause recording: ${rec.label}` : `Play recording: ${rec.label}`}
        accessibilityState={{ busy: loading, selected: playing }}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        {loading
          ? <ActivityIndicator size="small" color={info.colour} />
          : playing
          ? <Pause size={16} color={info.colour} />
          : <Play  size={16} color={info.colour} />
        }
      </TouchableOpacity>

      {/* Progress bar */}
      <View style={{ flex: 1 }}>
        <View style={{ height: 4, backgroundColor: C.border + '30', borderRadius: 2, marginBottom: 4 }}>
          <View style={{ height: 4, borderRadius: 2, backgroundColor: info.colour, width: (Math.min(1, progress) * 100) + '%' }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: scaledFont(10), color: C.textMuted }}>
            {playing || position > 0 ? formatDuration(position) : '0:00'}
          </Text>
          <Text style={{ fontSize: scaledFont(10), color: C.textMuted }}>
            {formatDuration(rec.duration)}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function RecordingsScreen() {
  const { colors: C } = useTheme();
  const { wt } = useLanguage();
  const router        = useRouter();

  const [recordings,  setRecordings]  = useState<VoiceRecording[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [enabled,     setEnabled]     = useState(true);
  const [totalSize,   setTotalSize]   = useState(0);
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [filter,      setFilter]      = useState<string>('all');

  useFocusEffect(useCallback(() => {
    loadAll();
  }, []));

  const loadAll = async () => {
    setLoading(true);
    const [recs, en, size] = await Promise.all([
      loadRecordings(),
      isRecordingEnabled(),
      getTotalStorageBytes(),
    ]);
    setRecordings(recs);
    setEnabled(en);
    setTotalSize(size);
    setLoading(false);
  };

  const toggleEnabled = async () => {
    const next = !enabled;
    await setRecordingEnabled(next);
    setEnabled(next);
  };

  const handleDelete = (rec: VoiceRecording) => {
    Alert.alert(
      'Delete Recording',
      `Delete "${rec.label}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteRecording(rec.id);
          loadAll();
        }},
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All Recordings',
      `This will permanently delete all ${recordings.length} recording${recordings.length !== 1 ? 's' : ''} from your device. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete All', style: 'destructive', onPress: async () => {
          await deleteAllRecordings();
          loadAll();
        }},
      ]
    );
  };

  const handleShare = async (rec: VoiceRecording) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(rec.uri, {
          mimeType: 'audio/m4a',
          dialogTitle: rec.label,
          UTI: 'public.audio',
        });
      } else {
        Alert.alert('Sharing not available', 'Your device does not support file sharing.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not share this recording.');
    }
  };

  // Group recordings by exercise
  const grouped = recordings.reduce((acc: Record<string, VoiceRecording[]>, r) => {
    if (!acc[r.exercise]) acc[r.exercise] = [];
    acc[r.exercise].push(r);
    return acc;
  }, {});

  const exercises    = Object.keys(grouped).sort();
  const filteredRecs = filter === 'all' ? recordings : recordings.filter(r => r.exercise === filter);

  const S = {
    card: { backgroundColor: C.card, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border + '20' },
    label: { fontSize: scaledFont(10), fontWeight: '700' as const, color: C.textMuted, textTransform: 'uppercase' as const, letterSpacing: 1 },
    body: { fontSize: scaledFont(13), color: C.textSec, lineHeight: 20 },
  };

  return (
    <ScreenBackground>
      <BackHeader title={wt('recordings')} onPress={() => router.push('/progress')} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>

        {/* Recording toggle + stats */}
        <View style={[S.card, { borderColor: enabled ? '#00E5A030' : '#FF4D6A30' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: enabled ? 12 : 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Mic size={20} color={enabled ? '#00E5A0' : '#FF4D6A'} />
              <View>
                <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: C.text }}>Voice Recording</Text>
                <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginTop: 1 }}>
                  {enabled ? 'Active — recordings saved to this device' : 'Disabled — no recordings being made'}
                </Text>
              </View>
            </View>
            {/* Toggle switch */}
            <TouchableOpacity
              onPress={toggleEnabled}
              style={{ width: 50, height: 28, borderRadius: 14, backgroundColor: enabled ? '#00E5A0' : C.border + '60', justifyContent: 'center', paddingHorizontal: 3 }}
              accessibilityRole="switch"
              accessibilityLabel="Voice recording"
              accessibilityState={{ checked: enabled }}
              accessibilityHint={enabled ? 'Disables saving voice recordings from exercises' : 'Enables saving voice recordings from exercises'}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignSelf: enabled ? 'flex-end' : 'flex-start', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 }} />
            </TouchableOpacity>
          </View>

          {enabled && (
            <View style={{ flexDirection: 'row', gap: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border + '20' }}>
              {[
                { icon: Volume2,   label: 'Recordings', value: String(recordings.length) },
                { icon: HardDrive, label: 'Storage used', value: formatFileSize(totalSize) },
              ].map(({ icon: Icon, label, value }, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon size={14} color={C.textMuted} />
                  <Text style={{ fontSize: scaledFont(12), color: C.textMuted }}>{label}: </Text>
                  <Text style={{ fontSize: scaledFont(12), fontWeight: '700', color: C.text }}>{value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* iOS/Android note */}
        <View style={{ backgroundColor: C.card, borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: C.border + '20', flexDirection: 'row', gap: 8 }}>
          <AlertCircle size={14} color={C.amber} style={{ marginTop: 1 }} />
          <Text style={{ flex: 1, fontSize: scaledFont(11), color: C.textMuted, lineHeight: 17 }}>
            Recordings are saved privately on your device only — never uploaded to any server.
            {Platform.OS === 'ios'
              ? ' On iOS, files are stored in the app\'s private Documents folder.'
              : ' On Android, files are stored in the app\'s private internal storage.'}
            {' '}They are removed when you uninstall the app.
          </Text>
        </View>

        {recordings.length === 0 && !loading ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Mic size={52} color={C.textMuted + '40'} />
            <Text style={{ fontSize: scaledFont(16), fontWeight: '600', color: C.textMuted, marginTop: 14 }}>
              No recordings yet
            </Text>
            <Text style={{ fontSize: scaledFont(13), color: C.textMuted, marginTop: 6, textAlign: 'center', paddingHorizontal: 32 }}>
              {enabled
                ? 'Your voice recordings from exercises will appear here. Start a Placement Test or Speaking exercise to make your first recording.'
                : 'Enable voice recording above to start saving your speaking practice.'}
            </Text>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" color={C.cyan} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Filter chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingBottom: 12 }}>
              <TouchableOpacity
                style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: filter === 'all' ? '#00E5A020' : C.card, borderWidth: 1, borderColor: filter === 'all' ? '#00E5A050' : C.border + '30' }}
                onPress={() => setFilter('all')}
                accessibilityRole="button"
                accessibilityLabel={`Show all recordings, ${recordings.length} total`}
                accessibilityState={{ selected: filter === 'all' }}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                <Text style={{ fontSize: scaledFont(12), fontWeight: '700', color: filter === 'all' ? '#00E5A0' : C.textMuted }}>All ({recordings.length})</Text>
              </TouchableOpacity>
              {exercises.map(ex => {
                const info = getExerciseInfo(ex);
                return (
                  <TouchableOpacity
                    key={ex}
                    style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: filter === ex ? info.colour + '20' : C.card, borderWidth: 1, borderColor: filter === ex ? info.colour + '50' : C.border + '30' }}
                    onPress={() => setFilter(ex)}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter by ${info.label}, ${grouped[ex]?.length || 0} recording${(grouped[ex]?.length || 0) !== 1 ? 's' : ''}`}
                    accessibilityState={{ selected: filter === ex }}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  >
                    <Text style={{ fontSize: scaledFont(12), fontWeight: '700', color: filter === ex ? info.colour : C.textMuted }}>
                      {info.icon} {info.label.split(' ')[0]} ({grouped[ex]?.length || 0})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Recording list */}
            {(filter === 'all' ? filteredRecs : filteredRecs).map((rec) => {
              const info = getExerciseInfo(rec.exercise);
              const isOpen = expanded === rec.id;
              return (
                <TouchableOpacity
                  key={rec.id}
                  style={[S.card, { borderColor: info.colour + '25' }]}
                  onPress={() => setExpanded(isOpen ? null : rec.id)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`${info.label} recording: ${rec.label}, ${formatDuration(rec.duration)}`}
                  accessibilityHint={isOpen ? 'Collapses playback controls' : 'Expands to play, share, or delete this recording'}
                  accessibilityState={{ expanded: isOpen }}
                >
                  {/* Header row */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                    <View style={{ backgroundColor: info.colour + '20', width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                      <Text style={{ fontSize: 18 }}>{info.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: C.text, lineHeight: 18 }} numberOfLines={2}>
                        {rec.label}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                          <Clock size={10} color={C.textMuted} />
                          <Text style={{ fontSize: scaledFont(10), color: C.textMuted }}>{formatDuration(rec.duration)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                          <Calendar size={10} color={C.textMuted} />
                          <Text style={{ fontSize: scaledFont(10), color: C.textMuted }}>
                            {new Date(rec.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </Text>
                        </View>
                        <Text style={{ fontSize: scaledFont(10), color: C.textMuted }}>{formatFileSize(rec.size)}</Text>
                      </View>
                    </View>
                    {isOpen ? <ChevronUp size={16} color={C.textMuted} /> : <ChevronDown size={16} color={C.textMuted} />}
                  </View>

                  {/* Expanded: playback + actions */}
                  {isOpen && (
                    <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: C.border + '20', paddingTop: 12 }}>
                      {/* Playback bar */}
                      <PlaybackBar rec={rec} C={C} />

                      {/* Transcript if available */}
                      {rec.transcript && (
                        <View style={{ backgroundColor: C.bg, borderRadius: 10, padding: 10, marginTop: 10 }}>
                          <Text style={{ fontSize: scaledFont(10), fontWeight: '700', color: C.textMuted, letterSpacing: 1, marginBottom: 4 }}>TRANSCRIPT</Text>
                          <Text style={{ fontSize: scaledFont(12), color: C.textSec, fontStyle: 'italic', lineHeight: 18 }}>"{rec.transcript}"</Text>
                        </View>
                      )}

                      {/* Action buttons */}
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                        <TouchableOpacity
                          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#00E5FF15', borderRadius: 10, paddingVertical: 10, borderWidth: 1, borderColor: '#00E5FF30' }}
                          onPress={() => handleShare(rec)}
                          accessibilityRole="button"
                          accessibilityLabel={`Share recording: ${rec.label}`}
                          accessibilityHint="Opens the system share sheet for this audio file"
                        >
                          <Share2 size={14} color="#00E5FF" />
                          <Text style={{ fontSize: scaledFont(12), fontWeight: '700', color: '#00E5FF' }}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FF4D6A15', borderRadius: 10, paddingVertical: 10, borderWidth: 1, borderColor: '#FF4D6A30' }}
                          onPress={() => handleDelete(rec)}
                          accessibilityRole="button"
                          accessibilityLabel={`Delete recording: ${rec.label}`}
                          accessibilityHint="Prompts for confirmation, then permanently removes this recording"
                        >
                          <Trash2 size={14} color="#FF4D6A" />
                          <Text style={{ fontSize: scaledFont(12), fontWeight: '700', color: '#FF4D6A' }}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Delete all button */}
            {recordings.length > 0 && (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, marginTop: 8, borderRadius: 14, backgroundColor: '#FF4D6A15', borderWidth: 1, borderColor: '#FF4D6A30' }}
                onPress={handleDeleteAll}
                accessibilityRole="button"
                accessibilityLabel={`Delete all ${recordings.length} recording${recordings.length !== 1 ? 's' : ''}`}
                accessibilityHint="Prompts for confirmation, then permanently removes every recording on this device"
              >
                <Trash2 size={16} color="#FF4D6A" />
                <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: '#FF4D6A' }}>Delete All Recordings</Text>
              </TouchableOpacity>
            )}
          </>
        )}

      </ScrollView>
    </ScreenBackground>
  );
}
