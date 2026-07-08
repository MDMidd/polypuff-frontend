/**
 * Daily Challenge Screen — Poly-Puff
 * =====================================
 * Mirrors daily.html on the website: three tasks per day
 * (Translation Sprint → Grammar Fix → Tiny Writing), streak tracking,
 * and a completion card with average score.
 *
 * Storage keys (same as web so vault sync carries them over):
 *   pp_daily_challenge   — { streak, best, completed, lastDate, lastStreak }
 *
 * FILE: app/daily.tsx
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Star, ChevronLeft, ChevronRight, ChevronDown, SkipForward, RotateCcw, TrendingUp, Zap, PenTool, BookOpen, Brain,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenBackground } from '../components/PolyPuffUI';
import { scaledFont, announce } from '../utils/accessibility';
import { getServerUrl } from '../services/api';
import { recordModuleProgress } from '../services/progressService';
import { pushVaults } from '../services/syncService';
import { hapticSuccess, hapticError, hapticLight } from '../services/sounds';
import { useFeedbackNudge } from '../hooks/useFeedbackNudge';
import FeedbackNudgeModal from '../components/FeedbackNudgeModal';
import AIDisclosureBanner from '../components/AIDisclosureBanner';
import SkillLevelBadge from '../components/SkillLevelBadge';
import { getAuthHeaders } from '../utils/auth';
import { isRtlLanguage } from '../utils/languages';
import { getDailyTranslations } from '../utils/dailyTranslations';

// ─── Types ────────────────────────────────────────────────────────────────
type TaskType = 'translation' | 'grammar' | 'writing';
type ScreenState = 'idle' | 'loading' | 'running' | 'complete';

interface TranslationTask {
  type: 'translation';
  id: string | null;
  original: string;
  correctAnswer: string;
  topic: string;
}
interface GrammarTask {
  type: 'grammar';
  mode: string;
  sentence_with_blank: string;
  correct_answer: string;
  full_sentence: string;
  topic: string;
  hint?: string;
}
interface WritingTask {
  type: 'writing';
  promptText: string;
}
type Task = TranslationTask | GrammarTask | WritingTask;

interface DailyStats {
  streak: number;
  best: number;
  completed: number;
  lastDate: string;
}

const STORE_KEY = 'pp_daily_challenge';
const TASK_ORDER: TaskType[] = ['translation', 'grammar', 'writing'];

const FALLBACK_TRANSLATION: TranslationTask = {
  type: 'translation',
  id: null,
  original: 'Ella ha vivido en Londres durante cinco años.',
  correctAnswer: 'She has lived in London for five years.',
  topic: 'Present perfect with for',
};
const FALLBACK_GRAMMAR: GrammarTask = {
  type: 'grammar',
  mode: 'fill_blank',
  sentence_with_blank: 'I have lived here ___ 2020.',
  correct_answer: 'since',
  full_sentence: 'I have lived here since 2020.',
  topic: 'Since vs for',
  hint: 'Use this for a point in time.',
};
const WRITING_TASK: WritingTask = {
  type: 'writing',
  promptText: 'Write 40–70 words about one small habit that helps you learn English.',
};

// ─── Helpers ──────────────────────────────────────────────────────────────
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
function localScore(answer: string, correct: string): number {
  const a = answer.trim().toLowerCase();
  const c = correct.trim().toLowerCase();
  if (a === c) return 100;
  const words = a.split(/\s+/).filter(Boolean).length;
  return Math.max(30, Math.min(80, words * 5));
}

// ─── Main component ───────────────────────────────────────────────────────
export default function DailyChallenge() {
  const { colors: C } = useTheme();
  const { lang } = useLanguage();
  const router = useRouter();
  const nudge = useFeedbackNudge('daily');
  const dailyT = getDailyTranslations(lang);
  const isRTL = isRtlLanguage(lang);
  const rowDirection = isRTL ? 'row-reverse' : 'row';
  const textAlign = isRTL ? 'right' : 'left';
  const DirectionChevron = isRTL ? ChevronLeft : ChevronRight;
  const closedChevronStyle = { transform: [{ rotate: isRTL ? '90deg' : '-90deg' }] };

  const [screen, setScreen] = useState<ScreenState>('idle');
  const [stats, setStats] = useState<DailyStats>({ streak: 0, best: 0, completed: 0, lastDate: '' });
  const [taskIndex, setTaskIndex] = useState(0);
  const [task, setTask] = useState<Task | null>(null);
  const [answer, setAnswer] = useState('');
  const [scores, setScoresArr] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const [scoreShown, setScoreShown] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [avgScore, setAvgScore] = useState(0);
  const [showSave, setShowSave] = useState(false);
  const [saveWord, setSaveWord] = useState('');

  const saveWordToVault = async (word: string) => {
    const clean = word.trim();
    if (!clean) return;
    try {
      const raw = await AsyncStorage.getItem('vocabVault');
      const items = raw ? JSON.parse(raw) : [];
      const exists = items.some((i: { word?: string }) => String(i.word || '').trim().toLowerCase() === clean.toLowerCase());
      if (exists) { Alert.alert(dailyT.alertAlreadySaved, dailyT.alertAlreadyInVault.replace('{word}', clean)); return; }
      const item = { word: clean, date: new Date().toISOString(), source: 'daily_challenge' };
      const updated = [item, ...items].slice(0, 500);
      await Promise.all([
        AsyncStorage.setItem('vocabVault',    JSON.stringify(updated)),
        AsyncStorage.setItem('pp_vocabVault', JSON.stringify(updated)),
      ]);
      pushVaults();
      setSaveWord('');
      Alert.alert(dailyT.alertSavedExclaim, dailyT.alertAddedToVault.replace('{word}', clean));
    } catch { Alert.alert(dailyT.alertError, dailyT.alertCouldNotSaveWord); }
  };
  const scoresRef = useRef<number[]>([]);

  useFocusEffect(useCallback(() => {
    loadStats();
  }, []));

  async function loadStats() {
    try {
      const raw = await AsyncStorage.getItem(STORE_KEY);
      const s: DailyStats = raw ? JSON.parse(raw) : { streak: 0, best: 0, completed: 0, lastDate: '' };
      setStats(s);
    } catch {}
  }

  async function saveStats(s: DailyStats) {
    try { await AsyncStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {}
  }

  // ── Fetch task from backend ──────────────────────────────────────────────
  async function fetchTask(type: TaskType): Promise<Task> {
    const BASE = await getServerUrl();
    const profile = await AsyncStorage.getItem('userProfile').then(r => r ? JSON.parse(r) : {}).catch(() => ({}));
    const level = (profile.level || 'B1').replace('A', 'A').replace('B', 'B').replace('C', 'C');
    const nativeLang = profile.nativeLanguage || 'Spanish';

    if (type === 'translation') {
      try {
        const res = await fetch(`${BASE}/api/exercises/next`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
          body: JSON.stringify({ level, nativeLanguage: nativeLang, studentId: 'mobile-daily' }),
        });
        if (res.ok) {
          const d = await res.json();
          return { type: 'translation', id: d.id, original: d.original, correctAnswer: d.correctAnswer, topic: d.topic || '' };
        }
      } catch {}
      return FALLBACK_TRANSLATION;
    }

    if (type === 'grammar') {
      try {
        const res = await fetch(`${BASE}/api/grammar/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
          body: JSON.stringify({ mode: 'fill_blank', level, nativeLanguage: nativeLang }),
        });
        if (res.ok) {
          const d = await res.json();
          return { type: 'grammar', mode: 'fill_blank', sentence_with_blank: d.sentence_with_blank, correct_answer: d.correct_answer, full_sentence: d.full_sentence, topic: d.topic || '', hint: d.hint };
        }
      } catch {}
      return FALLBACK_GRAMMAR;
    }

    return { ...WRITING_TASK, promptText: dailyT.fallbackWritingPrompt };
  }

  // ── Check answer via backend ──────────────────────────────────────────────
  async function checkAnswer(): Promise<{ score: number; feedback: string }> {
    const BASE = await getServerUrl();
    const profile = await AsyncStorage.getItem('userProfile').then(r => r ? JSON.parse(r) : {}).catch(() => ({}));
    const level = profile.level || 'B1';
    const nativeLang = profile.nativeLanguage || 'Spanish';
    const ans = answer.trim();

    if (!task) return { score: 0, feedback: dailyT.noTaskLoaded };

    try {
      if (task.type === 'translation') {
        if (task.id) {
          const res = await fetch(`${BASE}/api/exercises/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
            body: JSON.stringify({ exerciseId: task.id, studentAnswer: ans, nativeLanguage: nativeLang }),
          });
          if (res.ok) {
            const d = await res.json();
            return { score: Math.round(d.score || 0), feedback: d.feedback || '' };
          }
        }
        return { score: localScore(ans, task.correctAnswer), feedback: `${dailyT.suggestedPrefix}: ${task.correctAnswer}` };
      }

      if (task.type === 'grammar') {
        const res = await fetch(`${BASE}/api/grammar/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
          body: JSON.stringify({ mode: task.mode, exercise: task, studentAnswer: ans, nativeLanguage: nativeLang, level }),
        });
        if (res.ok) {
          const d = await res.json();
          return { score: Math.round(d.score || 0), feedback: d.feedback || `${dailyT.answerPrefix}: ${task.correct_answer}. ${task.full_sentence}` };
        }
        return { score: localScore(ans, task.correct_answer), feedback: `${dailyT.answerPrefix}: ${task.correct_answer}. ${task.full_sentence}` };
      }

      if (task.type === 'writing') {
        const words = ans.split(/\s+/).filter(Boolean).length;
        const res = await fetch(`${BASE}/api/writing/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
          body: JSON.stringify({ text: ans, prompt: 'daily_reflection', promptDesc: task.promptText, targetWords: { min: 40, max: 70 }, level, nativeLanguage: nativeLang }),
        });
        if (res.ok) {
          const d = await res.json();
          return { score: Math.round(d.score || 0), feedback: d.feedback || '' };
        }
        return { score: Math.min(90, Math.max(45, words * 4)), feedback: dailyT.savedLocalAttempt };
      }
    } catch {}
    return { score: 50, feedback: dailyT.serverUnreachable };
  }

  // ── Start / Next / Skip / Complete ────────────────────────────────────────
  async function handleStart() {
    scoresRef.current = [];
    setScoresArr([]);
    setTaskIndex(0);
    setAnswer('');
    setFeedback('');
    setScoreShown(null);
    setChecked(false);
    setScreen('loading');
    const t = await fetchTask(TASK_ORDER[0]);
    setTask(t);
    setScreen('running');
  }

  async function handleCheck() {
    if (!answer.trim()) {
      Alert.alert(dailyT.alertAddAnswerFirst); return;
    }
    setScreen('loading');
    const result = await checkAnswer();
    const sc = result.score;
    scoresRef.current = [...scoresRef.current, sc];
    setScoresArr([...scoresRef.current]);
    setScoreShown(sc);
    setFeedback(result.feedback);
    setChecked(true);
    nudge.recordInteraction();
    setScreen('running');
    if (sc >= 70) hapticSuccess(); else hapticError();
    announce(dailyT.scoreAnnounce.replace('{score}', String(sc)).replace('{feedback}', result.feedback));
  }

  async function handleNext() {
    const nextIndex = taskIndex + 1;
    if (nextIndex >= TASK_ORDER.length) {
      handleComplete(); return;
    }
    setTaskIndex(nextIndex);
    setAnswer('');
    setFeedback('');
    setScoreShown(null);
    setChecked(false);
    setScreen('loading');
    const t = await fetchTask(TASK_ORDER[nextIndex]);
    setTask(t);
    setScreen('running');
  }

  function handleSkip() {
    hapticLight();
    scoresRef.current = [...scoresRef.current, 0];
    setScoresArr([...scoresRef.current]);
    const nextIndex = taskIndex + 1;
    if (nextIndex >= TASK_ORDER.length) {
      handleComplete(); return;
    }
    setTaskIndex(nextIndex);
    setAnswer('');
    setFeedback('');
    setScoreShown(null);
    setChecked(false);
    setScreen('loading');
    fetchTask(TASK_ORDER[nextIndex]).then(t => { setTask(t); setScreen('running'); });
  }

  async function handleComplete() {
    const allScores = scoresRef.current;
    const avg = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
    setAvgScore(avg);

    const today = todayISO();
    const yesterday = yesterdayISO();
    const prev = stats;
    const newStreak = prev.lastDate === today
      ? prev.streak || 1
      : prev.lastDate === yesterday
        ? (prev.streak || 0) + 1
        : 1;
    const newBest = Math.max(prev.best || 0, avg);
    const newCompleted = (prev.completed || 0) + 1;
    const newStats: DailyStats = { streak: newStreak, best: newBest, completed: newCompleted, lastDate: today };
    setStats(newStats);
    await saveStats(newStats);
    pushVaults(); // push updated pp_daily_challenge to sync server

    // Save to mobile progress store (progress_recent_daily_challenge → progress screen).
    await recordModuleProgress({ exerciseId: 'daily_challenge', score: avg, detail: 'Daily Challenge' });

    hapticSuccess();
    announce(dailyT.completeAnnounce.replace('{score}', String(avg)));
    setScreen('complete');
  }

  // ── Task titles / icons ───────────────────────────────────────────────────
  const TASK_META: Record<TaskType, { title: string; subtitle: string; Icon: any; color: string }> = {
    translation: { title: dailyT.tasks.translation.title, subtitle: dailyT.tasks.translation.subtitle, Icon: BookOpen, color: C.cyan || '#00E5FF' },
    grammar:     { title: dailyT.tasks.grammar.title,     subtitle: dailyT.tasks.grammar.subtitle,     Icon: Brain,    color: C.purple || '#B06CFF' },
    writing:     { title: dailyT.tasks.writing.title,     subtitle: dailyT.tasks.writing.subtitle,     Icon: PenTool,  color: C.emerald || '#00E5A0' },
  };

  const currentMeta = task ? TASK_META[task.type] : null;
  const progress = taskIndex / TASK_ORDER.length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <ScreenBackground style={{}}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* ── Header ── */}
          <View style={[s.header, { flexDirection: rowDirection }]}>
            <TouchableOpacity onPress={() => router.back()} style={[s.backBtn, isRTL ? s.backBtnRtl : null]} accessibilityRole="button" accessibilityLabel={dailyT.backArrow}>
              <Text style={[s.backText, { color: C.cyan || '#00E5FF', textAlign }]}>{dailyT.backArrow}</Text>
            </TouchableOpacity>
            <View style={[s.headerMid, { flexDirection: rowDirection }]}>
              <Star size={18} color={C.amber || '#FFBE0B'} />
              <Text style={[s.headerTitle, { color: C.text, textAlign }]}>{dailyT.dailyChallenge}</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <SkillLevelBadge exerciseId="daily_challenge" />
          </View>

          <AIDisclosureBanner compact />

          {/* ── Stats bar ── */}
          <View style={[s.statsRow, { borderColor: (C.border || '#2A3352'), flexDirection: rowDirection }]}>
            {[
              { label: dailyT.dayStreak, value: stats.streak, color: C.amber || '#FFBE0B' },
              { label: dailyT.bestScore, value: stats.best,   color: C.cyan || '#00E5FF' },
              { label: dailyT.completedLabel,  value: stats.completed, color: C.emerald || '#00E5A0' },
            ].map(({ label, value, color }) => (
              <View key={label} style={s.statItem}>
                <Text style={[s.statValue, { color }]} accessibilityLabel={`${value} ${label}`}>{value}</Text>
                <Text style={[s.statLabel, { color: C.textSec || '#8B95B0' }]}>{label}</Text>
              </View>
            ))}
          </View>

          {/* ══ IDLE ══ */}
          {screen === 'idle' && (
            <View style={s.idleWrap}>
              <Text style={[s.idleTitle, { color: C.text, textAlign }]}>{dailyT.threeQuickWinsTitle}</Text>
              <Text style={[s.idleSub, { color: C.textSec || '#8B95B0', textAlign }]}>
                {dailyT.dailyChallengeDesc}
              </Text>
              <TouchableOpacity
                style={[s.startBtn, { backgroundColor: C.cyan || '#00E5FF' }]}
                onPress={handleStart}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={dailyT.startTodaysChallenge}
                accessibilityHint={dailyT.startTodaysChallengeHint}
              >
                <Text style={[s.startBtnText, { color: C.bg || '#0A0E1A', textAlign: 'center' }]}>{dailyT.startTodaysChallenge}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ══ LOADING ══ */}
          {screen === 'loading' && (
            <View style={s.loadingWrap}>
              <ActivityIndicator size="large" color={C.cyan || '#00E5FF'} />
              <Text style={[s.loadingText, { color: C.textSec || '#8B95B0', textAlign }]}>{dailyT.loading}</Text>
            </View>
          )}

          {/* ══ RUNNING ══ */}
          {screen === 'running' && task && currentMeta && (
            <View>
              {/* Progress bar */}
              <View style={[s.progressTrack, { backgroundColor: (C.card || '#121829') }]}>
                <View style={[s.progressFill, { width: `${Math.max(progress * 100, 4)}%` as any, backgroundColor: C.cyan || '#00E5FF' }]} />
              </View>

              {/* Step pill */}
              <Text style={[s.stepPill, { color: C.cyan || '#00E5FF', borderColor: (C.cyan || '#00E5FF') + '30', backgroundColor: (C.cyan || '#00E5FF') + '10', alignSelf: isRTL ? 'flex-end' : 'flex-start', textAlign }]}>
                {dailyT.stepOf.replace('{n}', String(taskIndex + 1)).replace('{total}', String(TASK_ORDER.length))}
              </Text>

              {/* Task card */}
              <View style={[s.taskCard, { backgroundColor: C.card || '#121829', borderColor: C.border || '#2A3352' }]}>
                <View style={[s.taskTitleRow, { flexDirection: rowDirection }]}>
                  <View style={[s.taskIconWrap, { backgroundColor: currentMeta.color + '18' }]}>
                    <currentMeta.Icon size={18} color={currentMeta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.taskTitle, { color: C.text, textAlign }]}>{currentMeta.title}</Text>
                    <Text style={[s.taskSubtitle, { color: C.textSec || '#8B95B0', textAlign }]}>{currentMeta.subtitle}</Text>
                  </View>
                </View>

                {/* Task content */}
                <View style={[s.taskContent, { backgroundColor: (C.bg || '#0A0E1A'), borderColor: C.border || '#2A3352' }]}>
                  {task.type === 'translation' && (
                    <Text style={[s.taskText, { color: C.text, textAlign }]} accessibilityRole="text" accessibilityLabel={`${dailyT.translateAria}: ${task.original}`}>
                      {task.original}
                    </Text>
                  )}
                  {task.type === 'grammar' && (
                    <>
                      <Text style={[s.taskText, { color: C.text, textAlign }]} accessibilityRole="text" accessibilityLabel={`${dailyT.fillBlankAria}: ${task.sentence_with_blank}`}>
                        {task.sentence_with_blank}
                      </Text>
                      {task.hint ? (
                        <Text style={[s.taskHint, { color: C.textSec || '#8B95B0', textAlign }]}>{dailyT.hintLabel}: {task.hint}</Text>
                      ) : null}
                    </>
                  )}
                  {task.type === 'writing' && (
                    <Text style={[s.taskText, { color: C.text, textAlign }]} accessibilityRole="text">
                      {task.promptText}
                    </Text>
                  )}
                </View>

                {/* Answer input */}
                {!checked && (
                  <TextInput
                    style={[s.answerInput, { backgroundColor: C.bg || '#0A0E1A', borderColor: C.border || '#2A3352', color: C.text, textAlign }]}
                    placeholder={task.type === 'grammar' ? dailyT.typeMissingWord : dailyT.typeYourAnswerHere}
                    placeholderTextColor={C.textMuted || '#5A6380'}
                    value={answer}
                    onChangeText={setAnswer}
                    multiline={task.type !== 'grammar'}
                    numberOfLines={task.type === 'grammar' ? 1 : 4}
                    autoCapitalize="none"
                    accessibilityLabel={task.type === 'grammar' ? dailyT.fillInTheBlankAria : task.type === 'writing' ? dailyT.writeYourResponse : dailyT.yourTranslation}
                  />
                )}

                {/* Result */}
                {checked && scoreShown !== null && (
                  <View style={[s.resultBox, { backgroundColor: (C.cyan || '#00E5FF') + '08', borderColor: (C.cyan || '#00E5FF') + '20' }]}>
                    <Text style={[s.resultScore, { color: scoreShown >= 70 ? (C.emerald || '#00E5A0') : (C.amber || '#FFBE0B') }]}
                      accessibilityLabel={`${dailyT.averageScoreLabel}: ${scoreShown}`}>{scoreShown}</Text>
                    <Text style={[s.resultFeedback, { color: C.textSec || '#8B95B0', textAlign }]}>{feedback}</Text>
                  </View>
                )}

                {/* Buttons */}
                <View style={[s.btnRow, { flexDirection: rowDirection }]}>
                  {!checked ? (
                    <>
                      <TouchableOpacity
                        style={[s.checkBtn, { backgroundColor: C.cyan || '#00E5FF' }]}
                        onPress={handleCheck}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={dailyT.checkAnswer}
                      >
                        <Text style={[s.checkBtnText, { color: C.bg || '#0A0E1A', textAlign: 'center' }]}>{dailyT.checkAnswer}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.skipBtn, { borderColor: (C.border || '#2A3352') }]}
                        onPress={handleSkip}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={dailyT.skipThisTask}
                      >
                        <SkipForward size={14} color={C.textSec || '#8B95B0'} />
                        <Text style={[s.skipBtnText, { color: C.textSec || '#8B95B0' }]}>{dailyT.skipLabel}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={[s.checkBtn, { backgroundColor: C.cyan || '#00E5FF' }]}
                      onPress={handleNext}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={taskIndex === TASK_ORDER.length - 1 ? dailyT.finishChallenge : dailyT.nextStep}
                    >
                      <Text style={[s.checkBtnText, { color: C.bg || '#0A0E1A' }]}>
                        {taskIndex === TASK_ORDER.length - 1 ? dailyT.finishChallenge : dailyT.nextStep}
                      </Text>
                      <DirectionChevron size={16} color={C.bg || '#0A0E1A'} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* ══ COMPLETE ══ */}
          {screen === 'complete' && (
            <View style={[s.completeCard, { backgroundColor: C.card || '#121829', borderColor: C.border || '#2A3352' }]}>
              <View style={[s.completeIconWrap, { backgroundColor: (C.emerald || '#00E5A0') + '15' }]}>
                <Zap size={28} color={C.emerald || '#00E5A0'} />
              </View>
              <Text style={[s.completeTitle, { color: C.text, textAlign }]}>{dailyT.dailyChallengeComplete}</Text>
              <Text style={[s.completeSub, { color: C.textSec || '#8B95B0', textAlign }]}>
                {dailyT.averageScoreLabel}: {avgScore}.{' '}
                {avgScore >= 70 ? dailyT.streakUpdatedTo.replace('{n}', String(stats.streak)) : dailyT.completedTryAgainLater}
              </Text>

              <View style={[s.completeStat, { borderColor: (C.emerald || '#00E5A0') + '30', backgroundColor: (C.emerald || '#00E5A0') + '08', flexDirection: rowDirection }]}>
                <TrendingUp size={16} color={C.emerald || '#00E5A0'} />
                <Text style={[s.completeStatText, { color: C.emerald || '#00E5A0' }]}>
                  {dailyT.dayStreakDot.replace('{n}', String(stats.streak)).replace('{m}', String(stats.completed))}
                </Text>
              </View>

              {/* Vocab save panel */}
              <TouchableOpacity
                style={[s.vocabToggle, { borderColor: (C.blue || '#60A5FA') + '44', backgroundColor: (C.blue || '#60A5FA') + '10', marginTop: 14, flexDirection: rowDirection }]}
                onPress={() => setShowSave(v => !v)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={dailyT.saveAWordToVault}
              >
                <BookOpen size={15} color={C.blue || '#60A5FA'} />
                <Text style={[s.vocabToggleText, { color: C.blue || '#60A5FA', textAlign }]}>{dailyT.saveAWord}</Text>
                {showSave
                  ? <ChevronDown size={14} color={C.blue || '#60A5FA'} />
                  : <ChevronDown size={14} color={C.blue || '#60A5FA'} style={closedChevronStyle} />}
              </TouchableOpacity>
              {showSave && (
                <View style={[s.vocabRow, { borderColor: (C.blue || '#60A5FA') + '25', backgroundColor: (C.blue || '#60A5FA') + '08', flexDirection: rowDirection }]}>
                  <TextInput
                    style={[s.vocabInput, { backgroundColor: C.bg || '#0A0E1A', borderColor: C.border || '#2A3352', color: C.text, textAlign }]}
                    placeholder={dailyT.wordOrPhrase}
                    placeholderTextColor={C.textMuted || '#5A6380'}
                    value={saveWord}
                    onChangeText={setSaveWord}
                    returnKeyType="done"
                    onSubmitEditing={() => saveWordToVault(saveWord)}
                    accessibilityLabel={dailyT.wordToSaveVocabAria}
                  />
                  <TouchableOpacity
                    style={[s.vocabBtn, { backgroundColor: C.blue || '#60A5FA' }]}
                    onPress={() => saveWordToVault(saveWord)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={dailyT.saveWordToVaultAria}
                  >
                    <Text style={s.vocabBtnText}>{dailyT.arrowVocab}</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={[s.skipBtn, {
                  backgroundColor: (C.cyan || '#00E5FF') + '12',
                  borderColor: (C.cyan || '#00E5FF') + '50',
                  marginTop: 12,
                  justifyContent: 'center',
                }]}
                onPress={() => router.push('/progress')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={dailyT.viewProgress}
              >
                <TrendingUp size={16} color={C.cyan || '#00E5FF'} />
                <Text style={[s.skipBtnText, { color: C.cyan || '#00E5FF' }]}>{dailyT.viewProgress}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.skipBtn, { borderColor: C.border || '#2A3352', marginTop: 10, alignSelf: 'center' }]}
                onPress={() => { setScreen('idle'); scoresRef.current = []; setScoresArr([]); setTaskIndex(0); setTask(null); setAnswer(''); setFeedback(''); setScoreShown(null); setChecked(false); setShowSave(false); setSaveWord(''); }}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={dailyT.tryAgain}
              >
                <RotateCcw size={14} color={C.textSec || '#8B95B0'} />
                <Text style={[s.skipBtnText, { color: C.textSec || '#8B95B0' }]}>{dailyT.tryAgain}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <FeedbackNudgeModal
        visible={nudge.showModal}
        exerciseName="daily"
        onDismiss={nudge.onDismiss}
        onSent={nudge.onSent}
      />
    </ScreenBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 16, paddingTop: 8 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingTop: 62 },
  backBtn: { paddingVertical: 8, paddingRight: 12, minHeight: 44, justifyContent: 'center' },
  backBtnRtl: { paddingRight: 0, paddingLeft: 12 },
  backText: { fontSize: scaledFont(14), fontWeight: '600' },
  headerMid: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: scaledFont(16), fontWeight: '800' },
  statsRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, marginBottom: 20, overflow: 'hidden' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statValue: { fontSize: scaledFont(22), fontWeight: '800', lineHeight: 26 },
  statLabel: { fontSize: scaledFont(11), fontWeight: '500', marginTop: 2 },
  idleWrap: { paddingTop: 12 },
  idleTitle: { fontSize: scaledFont(26), fontWeight: '800', lineHeight: 34, marginBottom: 10 },
  idleSub: { fontSize: scaledFont(14), lineHeight: 21, marginBottom: 24 },
  startBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  startBtnText: { fontSize: scaledFont(15), fontWeight: '700' },
  loadingWrap: { alignItems: 'center', paddingTop: 48, gap: 12 },
  loadingText: { fontSize: scaledFont(14) },
  progressTrack: { height: 6, borderRadius: 3, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  stepPill: { alignSelf: 'flex-start', fontSize: scaledFont(12), fontWeight: '700', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10 },
  taskCard: { borderWidth: 1, borderRadius: 16, padding: 16 },
  taskTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  taskIconWrap: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  taskTitle: { fontSize: scaledFont(17), fontWeight: '800', marginBottom: 2 },
  taskSubtitle: { fontSize: scaledFont(12), lineHeight: 17 },
  taskContent: { borderRadius: 10, borderWidth: 1, padding: 14, marginBottom: 14 },
  taskText: { fontSize: scaledFont(16), lineHeight: 24, fontWeight: '500' },
  taskHint: { fontSize: scaledFont(12), marginTop: 8, fontStyle: 'italic' },
  answerInput: { borderWidth: 1.5, borderRadius: 10, padding: 12, fontSize: scaledFont(14), marginBottom: 14, minHeight: 48, textAlignVertical: 'top' },
  resultBox: { borderRadius: 10, borderWidth: 1, padding: 14, marginBottom: 14 },
  resultScore: { fontSize: scaledFont(32), fontWeight: '800', lineHeight: 36, marginBottom: 6 },
  resultFeedback: { fontSize: scaledFont(13), lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: 10 },
  checkBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 14, minHeight: 44 },
  checkBtnText: { fontSize: scaledFont(14), fontWeight: '700' },
  skipBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, minHeight: 44 },
  skipBtnText: { fontSize: scaledFont(13), fontWeight: '600' },
  completeCard: { borderRadius: 16, borderWidth: 1, padding: 20, alignItems: 'center' },
  completeIconWrap: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  completeTitle: { fontSize: scaledFont(20), fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  completeSub: { fontSize: scaledFont(13), lineHeight: 20, textAlign: 'center', marginBottom: 16 },
  completeStat: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  completeStatText: { fontSize: scaledFont(13), fontWeight: '700' },
  vocabToggle: { width: '100%', minHeight: 44, borderRadius: 12, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  vocabToggleText: { flex: 1, fontSize: scaledFont(13), fontWeight: '600' },
  vocabRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, borderWidth: 1, padding: 8, marginTop: 4, width: '100%' },
  vocabInput: { flex: 1, fontSize: scaledFont(13), borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, minHeight: 40 },
  vocabBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, minHeight: 40, justifyContent: 'center' },
  vocabBtnText: { fontSize: scaledFont(13), fontWeight: '700', color: '#fff' },
});
