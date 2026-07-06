/**
 * community.tsx — Poly-Puff Community Leaderboard Screen (Stage 2).
 *
 * Read-only ranked list of opted-in users, ordered by community_score
 * (see computeCommunityScore() in server.js — progress/XP dominant, streak
 * and per-skill grade improvement as smaller bonuses). Nobody appears
 * unless they've explicitly opted in with a chosen handle; minors are
 * blocked from opting in entirely (enforced server-side too — see
 * PUT /api/me/community-settings).
 *
 * FILE LOCATION: app/community.tsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Switch,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, ArrowLeft, Flame, Users, Crown } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { scaledFont } from '../utils/accessibility';
import {
  getCommunitySettings,
  updateCommunitySettings,
  getLeaderboard,
  isMinorAccount,
  syncExerciseAccuracy,
  type LeaderboardEntry,
  type CommunityPeriod,
  type CommunitySort,
} from '../services/communityService';

const HANDLE_RE = /^[A-Za-z0-9 _-]{3,24}$/;

const PERIOD_OPTIONS: { value: CommunityPeriod; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'month', label: 'This Month' },
  { value: 'week', label: 'This Week' },
];
const SORT_OPTIONS: { value: CommunitySort; label: string }[] = [
  { value: 'score', label: 'Top' },
  { value: 'improved', label: 'Most Improved' },
];

// 100+ day streaks get a crown instead of a flame; otherwise the flame's
// color tiers up with the streak length so long streaks stand out at a glance.
function streakBadgeColor(days: number, C: Record<string, string>): string {
  if (days >= 100) return C.gold || '#FFD700';
  if (days >= 30) return C.red || '#FF4D6A';
  if (days >= 7) return C.amber || '#F5A623';
  return C.textMuted || '#5A6380';
}

export default function CommunityScreen() {
  const { colors: C } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [optIn, setOptIn] = useState(false);
  const [handle, setHandle] = useState('');
  const [handleInput, setHandleInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myScore, setMyScore] = useState<number | null>(null);
  const [period, setPeriod] = useState<CommunityPeriod>('all');
  const [sortMode, setSortMode] = useState<CommunitySort>('score');

  const loadBoard = useCallback(async (p: CommunityPeriod, s: CommunitySort) => {
    const board = await getLeaderboard(50, 0, p, s);
    if (board) {
      setEntries(board.leaderboard);
      setMyRank(board.myRank);
      setMyScore(board.myScore);
    } else {
      setError('Could not load the leaderboard. Please try again.');
    }
  }, []);

  const loadAll = useCallback(async () => {
    setError('');
    const [minor, settings] = await Promise.all([isMinorAccount(), getCommunitySettings()]);
    setIsMinor(minor || settings?.isMinor === true);
    if (settings) {
      setOptIn(settings.communityOptIn);
      setHandle(settings.communityHandle || '');
      setHandleInput(settings.communityHandle || '');
    }
    if (settings?.communityOptIn) {
      await syncExerciseAccuracy();
      await loadBoard(period, sortMode);
    }
  }, [loadBoard, period, sortMode]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadAll();
      setLoading(false);
    })();
    // Only re-run the full load (settings + accuracy sync + board) on mount;
    // period/sort changes below use loadBoard() directly to avoid re-syncing
    // on every tab switch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!optIn) return;
    loadBoard(period, sortMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, sortMode]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const handleJoin = async () => {
    const cleaned = handleInput.trim();
    if (!HANDLE_RE.test(cleaned)) {
      setError('Handle must be 3-24 characters (letters, numbers, spaces, - or _).');
      return;
    }
    setError('');
    setSaving(true);
    const result = await updateCommunitySettings({ optIn: true, handle: cleaned });
    setSaving(false);
    if (!result.success) {
      setError(result.error || 'Could not join the community.');
      return;
    }
    setOptIn(!!result.communityOptIn);
    setHandle(result.communityHandle || cleaned);
    if (result.communityOptIn) {
      await syncExerciseAccuracy();
      await loadBoard(period, sortMode);
    }
  };

  const handleLeave = async () => {
    setSaving(true);
    const result = await updateCommunitySettings({ optIn: false });
    setSaving(false);
    if (result.success) {
      setOptIn(false);
      setEntries([]);
      setMyRank(null);
      setMyScore(null);
    } else {
      setError(result.error || 'Could not update your settings.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg || '#0A0E1A' }}>
      <View style={[s.header, { borderBottomColor: C.border, backgroundColor: C.card || '#121829' }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={C.text || '#F0F4FF'} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: C.cyan || '#00E5FF' }]}>Community</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={s.centerFill}>
          <ActivityIndicator size="large" color={C.cyan || '#00E5FF'} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.cyan} />}
        >
          {isMinor ? (
            <View style={[s.infoBox, { backgroundColor: C.card || '#121829', borderColor: C.border || '#2A3352' }]}>
              <Users size={28} color={C.textMuted || '#5A6380'} style={{ marginBottom: 10 }} />
              <Text style={[s.heroTitle, { color: C.text || '#F0F4FF' }]}>Community isn't available yet</Text>
              <Text style={[s.heroSub, { color: C.textSec || '#8B95B0' }]}>
                The Community leaderboard is only available for accounts 18 and older.
              </Text>
            </View>
          ) : !optIn ? (
            <>
              <View style={s.heroRow}>
                <View style={[s.iconCircle, { backgroundColor: (C.cyan || '#00E5FF') + '18', borderColor: (C.cyan || '#00E5FF') + '40' }]}>
                  <Trophy size={32} color={C.cyan || '#00E5FF'} />
                </View>
                <Text style={[s.heroTitle, { color: C.text || '#F0F4FF' }]}>Join the Community</Text>
                <Text style={[s.heroSub, { color: C.textSec || '#8B95B0' }]}>
                  See how you rank against other learners, based on your progress, streak, and improvement. Pick a
                  display name — your real name and email are never shown.
                </Text>
              </View>

              <View style={s.inputSection}>
                <Text style={[s.inputLabel, { color: C.textSec || '#8B95B0' }]}>Choose a display name</Text>
                <TextInput
                  style={[s.input, { backgroundColor: C.card || '#121829', color: C.text || '#F0F4FF', borderColor: C.border + '60' }]}
                  value={handleInput}
                  onChangeText={setHandleInput}
                  placeholder="e.g. PuffMaster"
                  placeholderTextColor={C.textMuted || '#5A6380'}
                  maxLength={24}
                  autoCorrect={false}
                  editable={!saving}
                  accessibilityLabel="Display name"
                />
                {error ? (
                  <Text style={[s.errorText, { color: C.red || '#FF4D6A' }]}>{error}</Text>
                ) : null}
                <TouchableOpacity
                  style={[s.joinBtn, { backgroundColor: C.cyan || '#00E5FF', opacity: saving ? 0.7 : 1 }]}
                  onPress={handleJoin}
                  disabled={saving}
                  accessibilityRole="button"
                  accessibilityLabel="Join the community leaderboard"
                >
                  {saving ? <ActivityIndicator color="#000" size="small" /> : (
                    <Text style={s.joinBtnText}>Join the Community</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={[s.meRow, { backgroundColor: C.card || '#121829', borderColor: C.border || '#2A3352' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.meHandle, { color: C.text || '#F0F4FF' }]}>{handle}</Text>
                  <Text style={[s.meSub, { color: C.textSec || '#8B95B0' }]}>
                    {myRank ? `Your rank: #${myRank} · ${myScore} pts` : 'Not ranked yet'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: scaledFont(12), color: C.textMuted }}>Visible</Text>
                  <Switch
                    value={optIn}
                    onValueChange={(v) => { if (!v) handleLeave(); }}
                    disabled={saving}
                    trackColor={{ false: '#D1D5DB', true: (C.cyan || '#00E5FF') + '50' }}
                    thumbColor={C.cyan || '#00E5FF'}
                    accessibilityRole="switch"
                    accessibilityLabel="Visible on community leaderboard"
                    accessibilityState={{ checked: optIn, disabled: saving }}
                  />
                </View>
              </View>

              {error ? <Text style={[s.errorText, { color: C.red || '#FF4D6A' }]}>{error}</Text> : null}

              <View style={s.tabRow}>
                {PERIOD_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      s.tabPill,
                      { borderColor: period === opt.value ? (C.cyan || '#00E5FF') : (C.border || '#2A3352') },
                      period === opt.value ? { backgroundColor: (C.cyan || '#00E5FF') + '18' } : null,
                    ]}
                    onPress={() => setPeriod(opt.value)}
                    accessibilityRole="button"
                    accessibilityLabel={opt.label}
                    accessibilityState={{ selected: period === opt.value }}
                  >
                    <Text style={[s.tabPillText, { color: period === opt.value ? (C.cyan || '#00E5FF') : C.textMuted }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[s.tabRow, { marginBottom: 16 }]}>
                {SORT_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      s.tabPill,
                      { borderColor: sortMode === opt.value ? (C.emerald || '#00E5A0') : (C.border || '#2A3352') },
                      sortMode === opt.value ? { backgroundColor: (C.emerald || '#00E5A0') + '18' } : null,
                    ]}
                    onPress={() => setSortMode(opt.value)}
                    accessibilityRole="button"
                    accessibilityLabel={opt.label}
                    accessibilityState={{ selected: sortMode === opt.value }}
                  >
                    <Text style={[s.tabPillText, { color: sortMode === opt.value ? (C.emerald || '#00E5A0') : C.textMuted }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {entries.length === 0 ? (
                <View style={[s.infoBox, { backgroundColor: C.card || '#121829', borderColor: C.border || '#2A3352' }]}>
                  <Text style={[s.heroSub, { color: C.textSec || '#8B95B0' }]}>
                    No one has joined the community yet — check back soon!
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 8 }}>
                  {entries.map((entry) => (
                    <View
                      key={entry.rank}
                      style={[
                        s.rankRow,
                        {
                          backgroundColor: entry.isMe ? (C.cyan || '#00E5FF') + '12' : C.card || '#121829',
                          borderColor: entry.isMe ? (C.cyan || '#00E5FF') + '50' : C.border || '#2A3352',
                        },
                      ]}
                    >
                      <Text style={[s.rankNum, { color: C.textSec || '#8B95B0' }]}>#{entry.rank}</Text>
                      <Text
                        style={[s.rankHandle, { color: C.text || '#F0F4FF' }]}
                        numberOfLines={1}
                      >
                        {entry.handle}{entry.isMe ? ' (you)' : ''}
                      </Text>
                      {entry.streakDays > 0 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginRight: 10 }}>
                          {entry.streakDays >= 100
                            ? <Crown size={13} color={streakBadgeColor(entry.streakDays, C)} />
                            : <Flame size={13} color={streakBadgeColor(entry.streakDays, C)} />}
                          <Text style={[s.rankStreak, { color: streakBadgeColor(entry.streakDays, C) }]}>{entry.streakDays}</Text>
                        </View>
                      ) : null}
                      <Text style={[s.rankScore, { color: C.cyan || '#00E5FF' }]}>{entry.score}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: scaledFont(18), fontWeight: '700', letterSpacing: 0.3 },
  scroll: { padding: 24, paddingBottom: 60 },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroRow: { alignItems: 'center', marginBottom: 24 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  heroTitle: { fontSize: scaledFont(20), fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  heroSub: { fontSize: scaledFont(14), textAlign: 'center', lineHeight: 20 },
  infoBox: { borderRadius: 14, borderWidth: 1, padding: 20, alignItems: 'center' },
  inputSection: { gap: 10 },
  inputLabel: { fontSize: scaledFont(13), fontWeight: '600' },
  input: {
    borderRadius: 14, borderWidth: 2, paddingHorizontal: 18, paddingVertical: 14,
    fontSize: scaledFont(16), fontWeight: '600',
  },
  errorText: { fontSize: scaledFont(13), marginTop: 2 },
  joinBtn: {
    borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', minHeight: 52, marginTop: 4,
  },
  joinBtnText: { fontSize: scaledFont(16), fontWeight: '700', color: '#000' },
  meRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1,
    padding: 16, marginBottom: 16, gap: 12,
  },
  meHandle: { fontSize: scaledFont(16), fontWeight: '700' },
  meSub: { fontSize: scaledFont(12), marginTop: 2 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  tabPill: {
    flex: 1, borderRadius: 999, borderWidth: 1.5, paddingVertical: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  tabPillText: { fontSize: scaledFont(12), fontWeight: '700' },
  rankRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1,
    paddingVertical: 12, paddingHorizontal: 14, gap: 10,
  },
  rankNum: { fontSize: scaledFont(13), fontWeight: '700', width: 34 },
  rankHandle: { fontSize: scaledFont(14), fontWeight: '600', flex: 1 },
  rankStreak: { fontSize: scaledFont(12), fontWeight: '600' },
  rankScore: { fontSize: scaledFont(14), fontWeight: '700' },
});
