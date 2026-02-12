/**
 * Progress Screen - Poly-Puff v6.1
 * ============================================
 * 
 * Gamification: XP, Level, Badges, Streak, Daily Goal
 * Drillable Weak Areas: tap a category to see past mistakes with explanations
 * PDF Progress Report: generated on backend, downloaded via Linking
 * 
 * FILE: app/progress.tsx
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, RefreshControl, Alert, Modal, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BarChart3, TrendingUp, Target, AlertTriangle,
  Award, Trash2, BookOpen, Star, Flame, Shield,
  ChevronRight, X, Download, ChevronDown, Zap, Trophy,
} from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { getServerUrl } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import SettingsButton from '../components/SettingsButton';

const C = {
  bg: '#0F172A', card: '#1E293B', cardAlt: '#334155',
  text: '#F8FAFC', textSec: '#94A3B8', textMuted: '#64748B', border: '#475569',
  emerald: '#10B981', emeraldLight: '#34D399', emeraldDark: '#065F46',
  blue: '#3B82F6', blueLight: '#93C5FD', blueDark: '#1E40AF',
  amber: '#F59E0B', amberLight: '#FCD34D', amberDark: '#92400E',
  red: '#EF4444', redLight: '#FCA5A5',
  purple: '#8B5CF6', purpleLight: '#C4B5FD',
  gold: '#FFD700',
};

function getScoreColor(s) { return s >= 90 ? C.emerald : s >= 75 ? C.blue : s >= 60 ? C.amber : C.red; }

// XP thresholds for levels
const XP_LEVELS = [
  { level: 1, title: 'Beginner', xp: 0, icon: '🌱' },
  { level: 2, title: 'Learner', xp: 50, icon: '📖' },
  { level: 3, title: 'Student', xp: 150, icon: '✏️' },
  { level: 4, title: 'Scholar', xp: 350, icon: '📚' },
  { level: 5, title: 'Writer', xp: 600, icon: '🖊️' },
  { level: 6, title: 'Linguist', xp: 1000, icon: '🎓' },
  { level: 7, title: 'Expert', xp: 1500, icon: '🏆' },
  { level: 8, title: 'Master', xp: 2500, icon: '👑' },
  { level: 9, title: 'Polyglot', xp: 4000, icon: '🌍' },
  { level: 10, title: 'Legend', xp: 6000, icon: '⭐' },
];

function getPlayerLevel(totalXP) {
  let current = XP_LEVELS[0];
  let next = XP_LEVELS[1];
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i].xp) {
      current = XP_LEVELS[i];
      next = XP_LEVELS[i + 1] || null;
      break;
    }
  }
  return { current, next, progress: next ? (totalXP - current.xp) / (next.xp - current.xp) : 1 };
}

// Badge definitions
const BADGE_DEFS = [
  { id: 'first', title: 'First Steps', desc: 'Complete 1 exercise', icon: '👣', check: (h) => h.length >= 1 },
  { id: 'ten', title: 'Getting Started', desc: 'Complete 10 exercises', icon: '🔟', check: (h) => h.length >= 10 },
  { id: 'fifty', title: 'Dedicated', desc: 'Complete 50 exercises', icon: '💪', check: (h) => h.length >= 50 },
  { id: 'hundred', title: 'Centurion', desc: 'Complete 100 exercises', icon: '💯', check: (h) => h.length >= 100 },
  { id: 'perfect', title: 'Perfectionist', desc: 'Score 100 on any exercise', icon: '⭐', check: (h) => h.some(e => e.score === 100) },
  { id: 'streak5', title: 'On Fire', desc: '5 exercises in a row ≥80', icon: '🔥', check: (h) => { let s = 0; for (let i = h.length - 1; i >= 0; i--) { if (h[i].score >= 80) s++; else break; } return s >= 5; } },
  { id: 'streak10', title: 'Unstoppable', desc: '10 exercises in a row ≥80', icon: '⚡', check: (h) => { let s = 0; for (let i = h.length - 1; i >= 0; i--) { if (h[i].score >= 80) s++; else break; } return s >= 10; } },
  { id: 'polyglot', title: 'Rising Star', desc: 'Average score ≥85', icon: '🌟', check: (h) => { const scores = h.map(e => e.score).filter(s => s > 0); return scores.length >= 5 && scores.reduce((a, b) => a + b, 0) / scores.length >= 85; } },
];

export default function ProgressScreen() {
  const { colors: C } = useTheme();
  const [history, setHistory] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDrilldown, setShowDrilldown] = useState(false);
  const [expandedMistake, setExpandedMistake] = useState(null);
  const [historyFilter, setHistoryFilter] = useState(null);
  const [expandedHistoryItem, setExpandedHistoryItem] = useState(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem('mistakeHistory');
      if (saved) setHistory(JSON.parse(saved));
      const xp = await AsyncStorage.getItem('totalXP');
      setTotalXP(parseInt(xp || '0', 10));
    } catch (e) {}
  };

  const handleRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  const handleClear = () => {
    Alert.alert('Clear All Data', 'This will delete all progress, XP, and badges. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        await AsyncStorage.multiRemove(['mistakeHistory', 'totalXP', 'sessionHistory']);
        setHistory([]); setTotalXP(0);
      }},
    ]);
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`${getServerUrl()}/api/progress-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, totalXP }),
      });
      if (response.ok) {
        const blob = await response.blob();
        // For React Native, we use Linking to open the URL
        const url = `${getServerUrl()}/api/progress-report?download=true`;
        Alert.alert('Download Report', 'Open the progress report in your browser?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open', onPress: () => Linking.openURL(url) },
        ]);
      } else {
        Alert.alert('Error', 'Could not generate report. Make sure server is running.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server for PDF report.');
    }
  };

  // ── STATS ──
  const total = history.length;
  const scores = history.map(h => h.score || 0).filter(s => s > 0);
  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const best = scores.length > 0 ? Math.max(...scores) : 0;

  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) { if ((history[i].score || 0) >= 70) streak++; else break; }

  // Daily streak — count consecutive days with at least 1 exercise
  const today = new Date().toDateString();
  const todayExercises = history.filter(h => new Date(h.date).toDateString() === today);
  const DAILY_GOAL = 5;
  const dailyProgress = Math.min(todayExercises.length / DAILY_GOAL, 1);

  // Count unique days practiced
  const uniqueDays = [...new Set(history.map(h => new Date(h.date).toDateString()))].sort().reverse();
  let dailyStreak = 0;
  const oneDay = 24 * 60 * 60 * 1000;
  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = new Date(Date.now() - i * oneDay).toDateString();
    if (uniqueDays[i] === expected) dailyStreak++;
    else break;
  }

  // Categories
  const categories = {};
  for (const entry of history) {
    for (const m of (entry.mistakes || [])) {
      const type = m.type || 'Unknown';
      if (!categories[type]) categories[type] = { count: 0, mistakes: [] };
      categories[type].count++;
      categories[type].mistakes.push({
        ...m, date: entry.date, score: entry.score,
        originalSentence: entry.originalSentence, studentAnswer: entry.studentAnswer,
        correctAnswer: entry.correctAnswer, level: entry.level,
      });
    }
  }
  const sortedCats = Object.entries(categories).sort((a, b) => b[1].count - a[1].count);
  const maxMistakes = sortedCats.length > 0 ? sortedCats[0][1].count : 0;

  // Player level
  const playerLevel = getPlayerLevel(totalXP);

  // Filtered history for feedback tab
  const filteredHistory = [...history].reverse().filter(entry => {
    if (!historyFilter) return true;
    const d = new Date(entry.date);
    const today = new Date();
    if (historyFilter === 'today') return d.toDateString() === today.toDateString();
    if (historyFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }
    if (historyFilter === 'mistakes') return (entry.mistakes?.length || 0) > 0;
    if (historyFilter === 'perfect') return (entry.score || 0) === 100;
    return true;
  });

  // Badges
  const earnedBadges = BADGE_DEFS.filter(b => b.check(history));
  const lockedBadges = BADGE_DEFS.filter(b => !b.check(history));

  // Category colors
  const catColors = [C.red, C.amber, C.purple, C.blue, C.emerald, C.amberLight, C.blueLight, C.redLight];

  // Drilldown data
  const drilldownMistakes = selectedCategory ? (categories[selectedCategory]?.mistakes || []).slice().reverse() : [];

  return (
    <SafeAreaView style={styles.screen}>
        <SettingsButton />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={C.blue} />}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Progress</Text>
            <Text style={styles.headerSub}>{total} exercises • {totalXP} XP total</Text>
          </View>
          <View style={styles.headerActions}>
            {total > 0 && (
              <TouchableOpacity style={styles.pdfBtn} onPress={handleDownloadPDF}>
                <Download size={16} color={C.blue} />
              </TouchableOpacity>
            )}
            {total > 0 && (
              <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                <Trash2 size={16} color={C.red} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* EMPTY STATE */}
        {total === 0 ? (
          <View style={styles.emptyCard}>
            <BookOpen size={40} color={C.textMuted} />
            <Text style={styles.emptyTitle}>No exercises yet</Text>
            <Text style={styles.emptyDesc}>Complete translations in Practice to see your progress here.</Text>
          </View>
        ) : (<>

          {/* ── PLAYER LEVEL CARD ── */}
          <View style={styles.levelCard}>
            <View style={styles.levelTop}>
              <Text style={styles.levelIcon}>{playerLevel.current.icon}</Text>
              <View style={styles.levelInfo}>
                <Text style={styles.levelTitle}>Level {playerLevel.current.level} — {playerLevel.current.title}</Text>
                <Text style={styles.levelXP}>{totalXP} XP</Text>
              </View>
              <View style={styles.levelBadge}>
                <Trophy size={20} color={C.gold} />
              </View>
            </View>
            {playerLevel.next && (
              <View style={styles.xpBarWrap}>
                <View style={styles.xpBarBg}>
                  <View style={[styles.xpBarFill, { width: `${Math.min(playerLevel.progress * 100, 100)}%` }]} />
                </View>
                <Text style={styles.xpBarLabel}>
                  {playerLevel.next.xp - totalXP} XP to Level {playerLevel.next.level}
                </Text>
              </View>
            )}
          </View>

          {/* ── DAILY GOAL & STREAK ── */}
          <View style={[styles.sectionCard, { borderColor: C.amber + '30' }]}>
            <View style={styles.sectionHeader}>
              <Flame size={18} color={C.amber} />
              <Text style={styles.sectionTitle}>Daily Goal</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Flame size={14} color={dailyStreak > 0 ? C.amber : C.textMuted} />
                <Text style={{ fontSize: 14, fontWeight: '800', color: dailyStreak > 0 ? C.amber : C.textMuted }}>{dailyStreak} day{dailyStreak !== 1 ? 's' : ''}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 10, marginLeft: 26 }}>
              Complete {DAILY_GOAL} exercises today to keep your streak!
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <View style={{ flex: 1, height: 12, backgroundColor: C.cardAlt, borderRadius: 6, overflow: 'hidden' }}>
                <View style={{ width: `${dailyProgress * 100}%`, height: '100%', backgroundColor: dailyProgress >= 1 ? C.emerald : C.amber, borderRadius: 6 }} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: dailyProgress >= 1 ? C.emerald : C.amber, width: 50, textAlign: 'right' }}>
                {todayExercises.length}/{DAILY_GOAL}
              </Text>
            </View>
            {dailyProgress >= 1 && (
              <Text style={{ fontSize: 13, color: C.emerald, fontWeight: '600', marginTop: 4, textAlign: 'center' }}>
                🎉 Daily goal complete! Keep going for bonus XP!
              </Text>
            )}
          </View>

          {/* ── STAT CARDS ── */}
          <View style={styles.statRow}>
            <View style={[styles.statCard, { borderTopColor: getScoreColor(avg) }]}>
              <Target size={18} color={getScoreColor(avg)} />
              <Text style={[styles.statVal, { color: getScoreColor(avg) }]}>{avg}</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={[styles.statCard, { borderTopColor: C.emerald }]}>
              <Award size={18} color={C.emerald} />
              <Text style={[styles.statVal, { color: C.emerald }]}>{best}</Text>
              <Text style={styles.statLabel}>Best</Text>
            </View>
            <View style={[styles.statCard, { borderTopColor: C.purple }]}>
              <Flame size={18} color={C.purple} />
              <Text style={[styles.statVal, { color: C.purple }]}>{streak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={[styles.statCard, { borderTopColor: C.amber }]}>
              <Zap size={18} color={C.amber} />
              <Text style={[styles.statVal, { color: C.amber }]}>{totalXP}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
          </View>

          {/* ── BADGES ── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Shield size={18} color={C.gold} />
              <Text style={styles.sectionTitle}>Badges</Text>
              <Text style={styles.badgeCount}>{earnedBadges.length}/{BADGE_DEFS.length}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
              {earnedBadges.map(b => (
                <View key={b.id} style={styles.badge}>
                  <Text style={styles.badgeIcon}>{b.icon}</Text>
                  <Text style={styles.badgeName}>{b.title}</Text>
                </View>
              ))}
              {lockedBadges.map(b => (
                <View key={b.id} style={[styles.badge, styles.badgeLocked]}>
                  <Text style={[styles.badgeIcon, { opacity: 0.3 }]}>🔒</Text>
                  <Text style={[styles.badgeName, { color: C.textMuted }]}>{b.desc}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* ── WEAK AREAS (tappable) ── */}
          {sortedCats.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <AlertTriangle size={18} color={C.amber} />
                <Text style={styles.sectionTitle}>Weak Areas</Text>
              </View>
              <Text style={styles.sectionDesc}>Tap a category to review your past mistakes</Text>
              {sortedCats.slice(0, 10).map(([cat, data], i) => (
                <TouchableOpacity
                  key={cat}
                  style={styles.catRow}
                  onPress={() => { setSelectedCategory(cat); setShowDrilldown(true); setExpandedMistake(null); }}
                >
                  <View style={styles.catLeft}>
                    <Text style={styles.catName}>{cat}</Text>
                    <View style={styles.catBarTrack}>
                      <View style={[styles.catBarFill, {
                        width: `${Math.max((data.count / maxMistakes) * 100, 5)}%`,
                        backgroundColor: catColors[i % catColors.length],
                      }]} />
                    </View>
                  </View>
                  <Text style={[styles.catCount, { color: catColors[i % catColors.length] }]}>{data.count}</Text>
                  <ChevronRight size={16} color={C.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── PAST FEEDBACK HISTORY ── */}
          {history.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <BookOpen size={18} color={C.purple} />
                <Text style={styles.sectionTitle}>Feedback History</Text>
              </View>
              <Text style={styles.sectionDesc}>Review past grammar feedback and practice again</Text>

              {/* Filter pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                <TouchableOpacity
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: 6, backgroundColor: !historyFilter ? C.emerald + '20' : C.cardAlt, borderWidth: 1, borderColor: !historyFilter ? C.emerald : C.border + '20' }}
                  onPress={() => setHistoryFilter(null)}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: !historyFilter ? C.emeraldLight : C.textMuted }}>All ({history.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: 6, backgroundColor: historyFilter === 'today' ? C.blue + '20' : C.cardAlt, borderWidth: 1, borderColor: historyFilter === 'today' ? C.blue : C.border + '20' }}
                  onPress={() => setHistoryFilter('today')}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: historyFilter === 'today' ? C.blueLight : C.textMuted }}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: 6, backgroundColor: historyFilter === 'week' ? C.blue + '20' : C.cardAlt, borderWidth: 1, borderColor: historyFilter === 'week' ? C.blue : C.border + '20' }}
                  onPress={() => setHistoryFilter('week')}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: historyFilter === 'week' ? C.blueLight : C.textMuted }}>This Week</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: 6, backgroundColor: historyFilter === 'mistakes' ? C.red + '20' : C.cardAlt, borderWidth: 1, borderColor: historyFilter === 'mistakes' ? C.red : C.border + '20' }}
                  onPress={() => setHistoryFilter('mistakes')}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: historyFilter === 'mistakes' ? C.redLight || '#FCA5A5' : C.textMuted }}>Had Mistakes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: historyFilter === 'perfect' ? C.emerald + '20' : C.cardAlt, borderWidth: 1, borderColor: historyFilter === 'perfect' ? C.emerald : C.border + '20' }}
                  onPress={() => setHistoryFilter('perfect')}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: historyFilter === 'perfect' ? C.emeraldLight : C.textMuted }}>Perfect Scores</Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Filtered list */}
              {filteredHistory.slice(0, showAllHistory ? 50 : 10).map((entry, i) => {
                const d = new Date(entry.date);
                const sc = entry.score || 0;
                const isExpanded = expandedHistoryItem === i;
                const mistakeCount = entry.mistakes?.length || 0;
                return (
                  <TouchableOpacity
                    key={i}
                    style={{ borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border + '10', paddingVertical: 10 }}
                    onPress={() => setExpandedHistoryItem(isExpanded ? null : i)}
                    activeOpacity={0.7}
                  >
                    {/* Summary row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: getScoreColor(sc) + '15', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: getScoreColor(sc) }}>{sc}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }} numberOfLines={1}>{entry.originalSentence || entry.topic || 'Exercise'}</Text>
                        <Text style={{ fontSize: 11, color: C.textMuted }}>
                          {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} • {entry.level} • {mistakeCount === 0 ? '✅ Perfect' : `${mistakeCount} mistake${mistakeCount > 1 ? 's' : ''}`}
                        </Text>
                      </View>
                      {isExpanded ? <ChevronDown size={16} color={C.textMuted} /> : <ChevronRight size={16} color={C.textMuted} />}
                    </View>

                    {/* Expanded details */}
                    {isExpanded && (
                      <View style={{ marginTop: 10, marginLeft: 46, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border + '10' }}>
                        {/* Original sentence */}
                        {entry.originalSentence && (
                          <View style={{ marginBottom: 8 }}>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: C.textMuted }}>ORIGINAL</Text>
                            <Text style={{ fontSize: 14, color: C.text, marginTop: 2 }}>{entry.originalSentence}</Text>
                          </View>
                        )}
                        {/* Student answer */}
                        {entry.studentAnswer && (
                          <View style={{ marginBottom: 8 }}>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: C.textMuted }}>YOUR ANSWER</Text>
                            <Text style={{ fontSize: 14, color: sc >= 80 ? C.emeraldLight : C.amberLight, marginTop: 2 }}>{entry.studentAnswer}</Text>
                          </View>
                        )}
                        {/* Correct answer */}
                        {entry.correctAnswer && (
                          <View style={{ marginBottom: 8 }}>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: C.textMuted }}>CORRECT ANSWER</Text>
                            <Text style={{ fontSize: 14, color: C.emeraldLight, marginTop: 2 }}>{entry.correctAnswer}</Text>
                          </View>
                        )}
                        {/* Mistakes with explanations */}
                        {entry.mistakes?.length > 0 && (
                          <View style={{ marginBottom: 8 }}>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: C.textMuted, marginBottom: 4 }}>GRAMMAR FEEDBACK</Text>
                            {entry.mistakes.map((m, mi) => (
                              <View key={mi} style={{ backgroundColor: C.cardAlt, borderRadius: 8, padding: 10, marginBottom: 4, borderLeftWidth: 3, borderLeftColor: C.amber }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                  <View style={{ backgroundColor: C.amber + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                    <Text style={{ fontSize: 10, fontWeight: '700', color: C.amber }}>{m.type || 'Grammar'}</Text>
                                  </View>
                                  {m.rule_id && <Text style={{ fontSize: 10, color: C.textMuted }}>{m.rule_id}</Text>}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
                                  <Text style={{ fontSize: 13, color: C.redLight || '#FCA5A5', textDecorationLine: 'line-through' }}>{m.found}</Text>
                                  <Text style={{ fontSize: 13, color: C.textMuted }}> → </Text>
                                  <Text style={{ fontSize: 13, color: C.emeraldLight, fontWeight: '600' }}>{m.expected}</Text>
                                </View>
                                {m.explanation && <Text style={{ fontSize: 12, color: C.textSec, marginTop: 3 }}>{m.explanation}</Text>}
                              </View>
                            ))}
                          </View>
                        )}
                        {/* Practice Again button */}
                        <TouchableOpacity
                          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.blue + '15', borderRadius: 10, paddingVertical: 10, marginTop: 4, borderWidth: 1, borderColor: C.blue + '30' }}
                          onPress={() => {
                            // Save the mistake types to practice
                            const types = entry.mistakes?.map(m => m.type).filter(Boolean).join(', ') || 'grammar';
                            Alert.alert('Practice This Rule', `Go to the Practice tab and use the custom request:\n\n"${types}"`, [{ text: 'OK' }]);
                          }}
                        >
                          <Zap size={14} color={C.blue} />
                          <Text style={{ fontSize: 13, fontWeight: '600', color: C.blueLight }}>Practice This Rule</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Show more / less */}
              {filteredHistory.length > 10 && (
                <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 10, marginTop: 4 }} onPress={() => setShowAllHistory(!showAllHistory)}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: C.blue }}>{showAllHistory ? 'Show Less ↑' : `Show All ${filteredHistory.length} Exercises ↓`}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ── RECENT SESSIONS ── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Star size={18} color={C.blue} />
              <Text style={styles.sectionTitle}>Recent Exercises</Text>
            </View>
            {history.slice(-10).reverse().map((session, i) => {
              const d = new Date(session.date);
              const score = session.score || 0;
              return (
                <View key={i} style={styles.sessionRow}>
                  <View style={[styles.scoreDot, { backgroundColor: getScoreColor(score) }]}>
                    <Text style={styles.scoreDotText}>{score}</Text>
                  </View>
                  <View style={styles.sessionTextWrap}>
                    <Text style={styles.sessionLevel}>{session.level} • {session.topic || 'General'}</Text>
                    <Text style={styles.sessionMistakes} numberOfLines={1}>
                      {(session.mistakes?.length || 0) === 0 ? 'Perfect!' : `${session.mistakes.length} mistake${session.mistakes.length > 1 ? 's' : ''}`}
                      {session.xp ? ` • +${session.xp} XP` : ''}
                    </Text>
                  </View>
                  <Text style={styles.sessionDate}>
                    {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              );
            })}
          </View>

        </>)}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── DRILLDOWN MODAL ── */}
      <Modal visible={showDrilldown} animationType="slide" onRequestClose={() => setShowDrilldown(false)}>
        <SafeAreaView style={styles.drillScreen}>
          <View style={styles.drillHeader}>
            <View>
              <Text style={styles.drillTitle}>{selectedCategory}</Text>
              <Text style={styles.drillSub}>{drilldownMistakes.length} mistakes found</Text>
            </View>
            <TouchableOpacity onPress={() => setShowDrilldown(false)}>
              <X size={24} color={C.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {drilldownMistakes.map((m, i) => {
              const isExpanded = expandedMistake === i;
              const d = new Date(m.date);
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.drillCard, isExpanded && styles.drillCardExpanded]}
                  onPress={() => setExpandedMistake(isExpanded ? null : i)}
                  activeOpacity={0.7}
                >
                  {/* Summary line */}
                  <View style={styles.drillSummary}>
                    <View style={[styles.drillScoreDot, { backgroundColor: getScoreColor(m.score || 0) }]}>
                      <Text style={styles.drillScoreText}>{m.score || '?'}</Text>
                    </View>
                    <View style={styles.drillSummaryText}>
                      <View style={styles.drillErrorLine}>
                        <Text style={styles.drillFound}>"{m.found}"</Text>
                        <Text style={styles.drillArrow}> → </Text>
                        <Text style={styles.drillExpected}>"{m.expected}"</Text>
                      </View>
                      <Text style={styles.drillDate}>
                        {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {m.level || '?'}
                        {m.rule_id ? ` • ${m.rule_id}` : ''}
                      </Text>
                    </View>
                    <ChevronDown size={16} color={C.textMuted} style={isExpanded && { transform: [{ rotate: '180deg' }] }} />
                  </View>

                  {/* Expanded details */}
                  {isExpanded && (
                    <View style={styles.drillDetails}>
                      {/* Explanation */}
                      {m.explanation ? (
                        <View style={styles.drillSection}>
                          <Text style={styles.drillSectionLabel}>📖 Explanation</Text>
                          <Text style={styles.drillExplanation}>{m.explanation}</Text>
                        </View>
                      ) : null}

                      {/* Original sentence */}
                      {m.originalSentence ? (
                        <View style={styles.drillSection}>
                          <Text style={styles.drillSectionLabel}>🌍 Original</Text>
                          <Text style={styles.drillSentence}>{m.originalSentence}</Text>
                        </View>
                      ) : null}

                      {/* Student answer */}
                      {m.studentAnswer ? (
                        <View style={styles.drillSection}>
                          <Text style={styles.drillSectionLabel}>✏️ Your Answer</Text>
                          <Text style={[styles.drillSentence, { color: C.amberLight }]}>{m.studentAnswer}</Text>
                        </View>
                      ) : null}

                      {/* Correct answer */}
                      {m.correctAnswer ? (
                        <View style={styles.drillSection}>
                          <Text style={styles.drillSectionLabel}>✅ Correct</Text>
                          <Text style={[styles.drillSentence, { color: C.emeraldLight }]}>{m.correctAnswer}</Text>
                        </View>
                      ) : null}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            {drilldownMistakes.length === 0 && (
              <Text style={{ color: C.textMuted, textAlign: 'center', padding: 40 }}>No mistakes recorded yet for this category.</Text>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg }, content: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 10 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: C.text }, headerSub: { fontSize: 13, color: C.textSec, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  pdfBtn: { padding: 10, backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.blue + '30' },
  clearBtn: { padding: 10, backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.red + '30' },

  emptyCard: { alignItems: 'center', padding: 40, backgroundColor: C.card, borderRadius: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.textSec, marginTop: 16 },
  emptyDesc: { fontSize: 14, color: C.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 20 },

  // Level card
  levelCard: { backgroundColor: C.card, borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: C.gold + '30' },
  levelTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelIcon: { fontSize: 36 },
  levelInfo: { flex: 1 },
  levelTitle: { fontSize: 17, fontWeight: '700', color: C.text },
  levelXP: { fontSize: 13, color: C.amberLight, fontWeight: '600', marginTop: 2 },
  levelBadge: { padding: 8 },
  xpBarWrap: { marginTop: 12 },
  xpBarBg: { height: 8, backgroundColor: C.cardAlt, borderRadius: 4, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: C.gold, borderRadius: 4 },
  xpBarLabel: { fontSize: 11, color: C.textMuted, marginTop: 4, textAlign: 'center' },

  // Stats
  statRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: C.card, borderRadius: 12, padding: 12, alignItems: 'center', borderTopWidth: 3 },
  statVal: { fontSize: 22, fontWeight: '800', marginTop: 6 },
  statLabel: { fontSize: 11, color: C.textMuted, fontWeight: '600', marginTop: 2 },

  // Sections
  sectionCard: { backgroundColor: C.card, borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: C.border + '20' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: C.text, flex: 1 },
  sectionDesc: { fontSize: 12, color: C.textMuted, marginBottom: 12, marginLeft: 26 },
  badgeCount: { fontSize: 13, color: C.textMuted, fontWeight: '600' },

  // Badges
  badgeScroll: { marginTop: 4 },
  badge: { alignItems: 'center', marginRight: 16, width: 72 },
  badgeLocked: { opacity: 0.5 },
  badgeIcon: { fontSize: 32, marginBottom: 4 },
  badgeName: { fontSize: 10, color: C.textSec, textAlign: 'center', fontWeight: '600' },

  // Categories
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border + '15', gap: 8 },
  catLeft: { flex: 1 },
  catName: { fontSize: 14, fontWeight: '600', color: C.textSec, marginBottom: 4 },
  catBarTrack: { height: 6, backgroundColor: C.cardAlt, borderRadius: 3, overflow: 'hidden' },
  catBarFill: { height: '100%', borderRadius: 3 },
  catCount: { fontSize: 16, fontWeight: '800', width: 32, textAlign: 'right' },

  // Sessions
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border + '15' },
  scoreDot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  scoreDotText: { fontSize: 13, fontWeight: '800', color: C.text },
  sessionTextWrap: { flex: 1 },
  sessionLevel: { fontSize: 14, fontWeight: '600', color: C.text },
  sessionMistakes: { fontSize: 12, color: C.textMuted },
  sessionDate: { fontSize: 11, color: C.textMuted },

  // Drilldown modal
  drillScreen: { flex: 1, backgroundColor: C.bg },
  drillHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: C.border + '30' },
  drillTitle: { fontSize: 20, fontWeight: '800', color: C.text },
  drillSub: { fontSize: 13, color: C.textMuted, marginTop: 2 },

  drillCard: { backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: C.border + '20' },
  drillCardExpanded: { borderColor: C.amber + '40' },
  drillSummary: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  drillScoreDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  drillScoreText: { fontSize: 11, fontWeight: '800', color: C.text },
  drillSummaryText: { flex: 1 },
  drillErrorLine: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  drillFound: { fontSize: 14, color: C.redLight, textDecorationLine: 'line-through' },
  drillArrow: { fontSize: 14, color: C.textMuted },
  drillExpected: { fontSize: 14, color: C.emeraldLight, fontWeight: '600' },
  drillDate: { fontSize: 11, color: C.textMuted, marginTop: 2 },

  drillDetails: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border + '20' },
  drillSection: { marginBottom: 10 },
  drillSectionLabel: { fontSize: 12, fontWeight: '600', color: C.textMuted, marginBottom: 4 },
  drillExplanation: { fontSize: 14, color: C.text, lineHeight: 20 },
  drillSentence: { fontSize: 14, color: C.textSec, lineHeight: 20, fontStyle: 'italic' },
});
