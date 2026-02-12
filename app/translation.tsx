/**
 * Practice Screen - Poly-Puff v1.0
 * ==================================
 * 
 * Features Poly-Puff mascot in the header with speech bubble feedback.
 * Neon Pulse / Glassmorphism aesthetic.
 * 
 * FILE: app/practice.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Modal, KeyboardAvoidingView,
  Platform, Alert, Keyboard, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Send, BookOpen, MessageCircle,
  Zap, X, ArrowRight, Settings2, Pause, Play, LogOut,
  Clock, Star,
} from 'lucide-react-native';
import {
  generateExercise, checkTranslation, getNextExercise,
  checkExercise, chatWithTutor, stopSpeaking,
} from '../services/api';
import FeedbackDashboard from '../components/FeedbackDashboard';
import VoiceInput from '../components/VoiceInput';
import { useTheme } from '../contexts/ThemeContext';
import SettingsButton from '../components/SettingsButton';
import {
  ScreenBackground, GlassCard, NeonButton, NeonInput,
  MascotHeader, SectionTitle,
} from '../components/PolyPuffUI';
import { feedbackForScore, feedbackTap, hapticSelection } from '../services/sounds';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LENGTHS = [
  { key: 'short', label: 'Short', desc: '3-6 words', icon: '📝' },
  { key: 'medium', label: 'Medium', desc: '7-12 words', icon: '📄' },
  { key: 'long', label: 'Long', desc: '13-20 words', icon: '📜' },
];

function calculateXP(score, level) {
  const mult = { A1: 1, A2: 1.2, B1: 1.5, B2: 2, C1: 2.5, C2: 3 }[level] || 1;
  const base = Math.round((score / 100) * 20 * mult);
  if (score === 100) return base + 10;
  if (score >= 90) return base + 5;
  return base;
}

function formatTime(s) {
  return `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;
}

export default function PracticeScreen() {
  const { colors: C } = useTheme();
  const [nativeLanguage, setNativeLanguage] = useState('Spanish');
  const [level, setLevel] = useState('B1');
  const [sentenceLength, setSentenceLength] = useState('medium');
  const [originalSentence, setOriginalSentence] = useState('');
  const [correctTranslation, setCorrectTranslation] = useState('');
  const [exerciseId, setExerciseId] = useState(null);
  const [exerciseTopic, setExerciseTopic] = useState('');
  const [studentInput, setStudentInput] = useState('');
  const [customRequest, setCustomRequest] = useState('');
  const [result, setResult] = useState(null);
  const [previousSentences, setPreviousSentences] = useState([]);

  // Session
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionExercises, setSessionExercises] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const timerRef = useRef(null);

  // UI
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [weakAreas, setWeakAreas] = useState([]);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => { loadProfile(); loadWeakAreas(); return () => clearInterval(timerRef.current); }, []);

  useEffect(() => {
    if (sessionActive && !sessionPaused) {
      timerRef.current = setInterval(() => setSessionTime(t => t + 1), 1000);
    } else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [sessionActive, sessionPaused]);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.nativeLanguage) setNativeLanguage(p.nativeLanguage);
        if (p.level) setLevel(p.level);
        setProfile(p);
      }
    } catch (e) {}
  };

  const loadWeakAreas = async () => {
    try {
      const saved = await AsyncStorage.getItem('mistakeHistory');
      if (saved) {
        const history = JSON.parse(saved);
        // Count mistakes by category from last 50 exercises
        const recent = history.slice(-50);
        const cats = {};
        for (const entry of recent) {
          for (const m of (entry.mistakes || [])) {
            const type = m.type || 'Unknown';
            cats[type] = (cats[type] || 0) + 1;
          }
        }
        // Sort by frequency, top weaknesses first
        const sorted = Object.entries(cats)
          .sort((a, b) => b[1] - a[1])
          .map(([category, count]) => ({ category, count }));
        setWeakAreas(sorted);
      }
    } catch (e) {}
  };

  const startSession = () => {
    setSessionActive(true); setSessionPaused(false);
    setSessionTime(0); setSessionExercises(0); setSessionXP(0);
    handleGenerate();
  };

  const pauseSession = () => setSessionPaused(!sessionPaused);

  const exitSession = () => {
    Alert.alert('End Session',
      `You completed ${sessionExercises} exercises and earned ${sessionXP} XP in ${formatTime(sessionTime)}. End session?`,
      [
        { text: 'Continue', style: 'cancel' },
        { text: 'End Session', onPress: async () => {
          try {
            const saved = await AsyncStorage.getItem('sessionHistory');
            const sessions = saved ? JSON.parse(saved) : [];
            sessions.push({ date: new Date().toISOString(), duration: sessionTime, exercises: sessionExercises, xp: sessionXP, level });
            await AsyncStorage.setItem('sessionHistory', JSON.stringify(sessions.slice(-100)));
          } catch (e) {}
          setSessionActive(false); setSessionPaused(false); setSessionTime(0);
          setOriginalSentence(''); setResult(null); setStudentInput('');
          await stopSpeaking();
        }},
      ]
    );
  };

  const handleGenerate = async () => {
    setLoading(true); setResult(null); setStudentInput('');
    setExerciseId(null); setExerciseTopic('');
    await stopSpeaking();
    if (!sessionActive) { setSessionActive(true); setSessionPaused(false); setSessionTime(0); setSessionExercises(0); setSessionXP(0); }
    try {
      const bank = await getNextExercise({ nativeLanguage, level });
      if (bank && !bank.exhausted && bank.original) {
        setOriginalSentence(bank.original); setCorrectTranslation('');
        setExerciseId(bank.id); setExerciseTopic(bank.topic || '');
      } else {
        const data = await generateExercise({ nativeLanguage, level, sentenceLength, customRequest, previousSentences, profile, weakAreas });
        setOriginalSentence(data.original); setCorrectTranslation(data.translation);
        setExerciseTopic(data.topic || '');
        setPreviousSentences(prev => [...prev.slice(-9), data.original]);
      }
      setTimeout(() => inputRef.current?.focus(), 300);
    } catch (error) { Alert.alert('Error', 'Failed to generate sentence. Is your server running?'); }
    setLoading(false);
  };

  const handleCheck = async () => {
    if (!studentInput.trim()) return;
    Keyboard.dismiss(); setChecking(true);
    try {
      let data;
      if (exerciseId) {
        data = await checkExercise({ exerciseId, studentAnswer: studentInput.trim(), nativeLanguage });
        if (data.correctAnswer) setCorrectTranslation(data.correctAnswer);
      } else {
        data = await checkTranslation({ studentAnswer: studentInput.trim(), correctAnswer: correctTranslation, originalSentence, nativeLanguage, level });
      }
      setResult(data);
      feedbackForScore(data.score || 0);
      const xp = calculateXP(data.score || 0, level);
      setSessionExercises(p => p + 1); setSessionXP(p => p + xp);
      await saveRichMistakeData(data, xp);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    } catch (error) { Alert.alert('Error', 'Failed to check translation.'); }
    setChecking(false);
  };

  const saveRichMistakeData = async (data, xpEarned) => {
    try {
      const saved = await AsyncStorage.getItem('mistakeHistory');
      const history = saved ? JSON.parse(saved) : [];
      history.push({
        date: new Date().toISOString(), level, score: data.score || 0, xp: xpEarned,
        originalSentence, studentAnswer: studentInput.trim(),
        correctAnswer: correctTranslation || data.correctAnswer || '',
        topic: exerciseTopic || data.topic || '',
        mistakes: (data.mistakes || []).map(m => ({
          type: m.type || 'Grammar', found: m.found || '', expected: m.expected || '',
          explanation: m.explanation || '', rule_id: m.rule_id || null,
        })),
        ruleViolations: (data.ruleViolations || []).map(v => ({
          rule_id: v.rule_id, message: v.message, found: v.found, expected: v.expected,
        })),
      });
      await AsyncStorage.setItem('mistakeHistory', JSON.stringify(history.slice(-500)));
      const totalXP = parseInt(await AsyncStorage.getItem('totalXP') || '0', 10) + xpEarned;
      await AsyncStorage.setItem('totalXP', String(totalXP));
    } catch (e) {}
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim(); setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatLoading(true);
    try {
      const data = await chatWithTutor({ message: msg, nativeLanguage, context: { originalSentence, correctTranslation, studentTranslation: studentInput, score: result?.score } });
      setChatMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I had trouble responding. Try again!' }]);
    }
    setChatLoading(false);
  };

  const s = React.useMemo(() => StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg }, scrollView: { flex: 1 }, scrollContent: { padding: 16, paddingBottom: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    headerTitle: { fontSize: 26, fontWeight: '800', color: C.text }, headerSub: { fontSize: 13, color: C.textSec, marginTop: 2 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    settingsBtn: { padding: 8, backgroundColor: C.card, borderRadius: 10 },
    timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.card, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.emerald + '30' },
    timerText: { fontSize: 14, fontWeight: '700', color: C.emeraldLight, fontVariant: ['tabular-nums'] },
    sessionBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.card, borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: C.border + '30' },
    sessionStats: { flexDirection: 'row', gap: 14 }, sessionStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    sessionStatText: { fontSize: 13, fontWeight: '600', color: C.textSec },
    sessionActions: { flexDirection: 'row', gap: 8 },
    sessionActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: C.border + '40' },
    sessionActionText: { fontSize: 12, fontWeight: '600' },
    pausedCard: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: C.card, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: C.amber + '30' },
    pausedTitle: { fontSize: 20, fontWeight: '700', color: C.amber, marginTop: 12 }, pausedSub: { fontSize: 14, color: C.textMuted, marginTop: 4 },
    levelRow: { flexDirection: 'row', marginBottom: 12 },
    levelPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.card, marginRight: 8, borderWidth: 1, borderColor: C.border + '40' },
    levelPillActive: { backgroundColor: C.emerald + '20', borderColor: C.emerald },
    levelPillText: { fontSize: 13, fontWeight: '600', color: C.textMuted }, levelPillTextActive: { color: C.emeraldLight },
    lengthRow: { marginBottom: 12 }, lengthLabel: { fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 8 },
    lengthOptions: { flexDirection: 'row', gap: 8 },
    lengthCard: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.border + '30' },
    lengthCardActive: { borderColor: C.blue, backgroundColor: C.blue + '15' },
    lengthIcon: { fontSize: 20, marginBottom: 4 }, lengthName: { fontSize: 13, fontWeight: '600', color: C.textMuted }, lengthNameActive: { color: C.blueLight },
    lengthDesc: { fontSize: 10, color: C.textMuted, marginTop: 2 },
    customInput: { backgroundColor: C.card, borderRadius: 10, padding: 12, fontSize: 14, color: C.text, borderWidth: 1, borderColor: C.border + '40', marginBottom: 12 },
    generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.cyan || C.emerald, borderRadius: 12, paddingVertical: 14, marginBottom: 16, shadowColor: C.glowCyan || C.cyan, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
    generateBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' }, btnDisabled: { opacity: 0.5 },
    xpBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.amber + '15', borderRadius: 10, paddingVertical: 8, marginBottom: 8, borderWidth: 1, borderColor: C.amber + '30' },
    xpBadgeText: { fontSize: 14, fontWeight: '700', color: C.amberLight },
    sentenceCard: { backgroundColor: C.cardGlass || C.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.cyan + '20', marginBottom: 16 },
    topicBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }, topicText: { fontSize: 12, color: C.amber, fontWeight: '600' }, bankBadge: { fontSize: 10, color: C.textMuted, marginLeft: 4 },
    sentenceLabel: { fontSize: 12, color: C.textMuted, textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5 },
    sentenceText: { fontSize: 20, fontWeight: '600', color: C.text, lineHeight: 28, marginTop: 6, marginBottom: 16 },
    translationInput: { backgroundColor: C.inputBg || C.bg, borderRadius: 12, padding: 14, fontSize: 16, color: C.text, borderWidth: 1.5, borderColor: C.cyan + '40', minHeight: 60, textAlignVertical: 'top', marginBottom: 12 },
    submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.purple || C.blue, borderRadius: 12, paddingVertical: 14, shadowColor: C.glowPurple || C.purple, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
    submitBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
    chatScreen: { flex: 1, backgroundColor: C.bg },
    chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: C.border + '30' },
    chatHeaderTitle: { fontSize: 18, fontWeight: '700', color: C.text }, chatMessages: { flex: 1 },
    chatBubbleU: { alignSelf: 'flex-end', backgroundColor: C.blue, borderRadius: 16, borderBottomRightRadius: 4, padding: 12, maxWidth: '80%' },
    chatBubbleA: { alignSelf: 'flex-start', backgroundColor: C.card, borderRadius: 16, borderBottomLeftRadius: 4, padding: 12, maxWidth: '80%' },
    chatBubbleText: { fontSize: 15, color: C.textSec, lineHeight: 22 },
    chatInputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: C.border + '30', paddingBottom: 30 },
    chatInputField: { flex: 1, backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: C.text },
    chatSendBtn: { backgroundColor: C.blue, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    settingsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    settingsCard: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    settingsTitle: { fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 16 },
    settingsLabel: { fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 8 },
    langPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: C.bg, marginRight: 8, borderWidth: 1, borderColor: C.border + '40' },
    langPillActive: { backgroundColor: C.emerald + '20', borderColor: C.emerald }, langPillText: { fontSize: 13, color: C.textMuted },
    settingsDoneBtn: { backgroundColor: C.emerald, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
    settingsDoneText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  }), [C]);

  return (
    <ScreenBackground>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <SettingsButton />
      <ScrollView ref={scrollRef} style={s.scrollView} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">

        {/* ═══ POLY-PUFF HEADER ═══ */}
        <MascotHeader
          message={result ? (result.score >= 90 ? "✨ Amazing work! You're a natural!" : result.score >= 70 ? "👏 Good job! Keep improving!" : "💪 Don't give up, try again!")
            : originalSentence ? "🤔 Translate the sentence below..."
            : "👋 Hey! Tap Next Sentence to start!"}
        />

        {/* HEADER ROW */}
        <View style={s.headerRow}>
          <View>
            <Text style={s.headerTitle}>Poly-Puff</Text>
            <Text style={s.headerSub}>{nativeLanguage} → English • {level}</Text>
          </View>
          <View style={s.headerRight}>
            {sessionActive && (
              <View style={s.timerBadge}>
                <Clock size={14} color={sessionPaused ? C.amber : C.emerald} />
                <Text style={[s.timerText, sessionPaused && { color: C.amber }]}>{formatTime(sessionTime)}</Text>
              </View>
            )}
            <TouchableOpacity style={s.settingsBtn} onPress={() => setShowSettings(true)}>
              <Settings2 size={20} color={C.textSec} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SESSION BAR */}
        {sessionActive && (
          <View style={s.sessionBar}>
            <View style={s.sessionStats}>
              <View style={s.sessionStatItem}><Star size={12} color={C.amberLight} /><Text style={s.sessionStatText}>{sessionXP} XP</Text></View>
              <View style={s.sessionStatItem}><BookOpen size={12} color={C.blueLight} /><Text style={s.sessionStatText}>{sessionExercises} done</Text></View>
            </View>
            <View style={s.sessionActions}>
              <TouchableOpacity style={s.sessionActionBtn} onPress={pauseSession}>
                {sessionPaused ? <Play size={16} color={C.emerald} /> : <Pause size={16} color={C.amber} />}
                <Text style={[s.sessionActionText, { color: sessionPaused ? C.emerald : C.amber }]}>{sessionPaused ? 'Resume' : 'Pause'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.sessionActionBtn, { borderColor: C.red + '40' }]} onPress={exitSession}>
                <LogOut size={16} color={C.red} /><Text style={[s.sessionActionText, { color: C.red }]}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* PAUSED OVERLAY */}
        {sessionPaused && (
          <View style={s.pausedCard}>
            <Pause size={28} color={C.amber} />
            <Text style={s.pausedTitle}>Session Paused</Text>
            <Text style={s.pausedSub}>Tap Resume to continue</Text>
          </View>
        )}

        {!sessionPaused && (<>
          {/* LEVEL PILLS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.levelRow}>
            {LEVELS.map(l => (
              <TouchableOpacity key={l} style={[s.levelPill, level === l && s.levelPillActive]} onPress={() => setLevel(l)}>
                <Text style={[s.levelPillText, level === l && s.levelPillTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* SENTENCE LENGTH */}
          <View style={s.lengthRow}>
            <Text style={s.lengthLabel}>Sentence Length</Text>
            <View style={s.lengthOptions}>
              {LENGTHS.map(len => (
                <TouchableOpacity key={len.key} style={[s.lengthCard, sentenceLength === len.key && s.lengthCardActive]} onPress={() => setSentenceLength(len.key)}>
                  <Text style={s.lengthIcon}>{len.icon}</Text>
                  <Text style={[s.lengthName, sentenceLength === len.key && s.lengthNameActive]}>{len.label}</Text>
                  <Text style={s.lengthDesc}>{len.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* CUSTOM REQUEST */}
          <TextInput style={s.customInput} placeholder="Custom request... (e.g., 'Past tense about food')" placeholderTextColor={C.textMuted} value={customRequest} onChangeText={setCustomRequest} />

          {/* GENERATE */}
          <NeonButton
            onPress={sessionActive ? handleGenerate : startSession}
            disabled={loading}
            loading={loading}
            title={sessionActive ? 'Next Sentence' : 'Start Session'}
            icon={!loading ? <Zap size={18} color="#000" /> : null}
            style={{ marginBottom: 16 }}
          />

          {/* SENTENCE CARD */}
          {originalSentence ? (
            <GlassCard intensity="medium" style={{ marginBottom: 16 }}>
              {exerciseTopic ? (<View style={s.topicBadge}><BookOpen size={12} color={C.amber} /><Text style={s.topicText}>{exerciseTopic}</Text>{exerciseId && <Text style={s.bankBadge}>📚 Bank</Text>}</View>) : null}
              <Text style={s.sentenceLabel}>Translate to English:</Text>
              <Text style={s.sentenceText}>{originalSentence}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <TextInput ref={inputRef} style={[s.translationInput, { flex: 1, marginBottom: 0 }]} placeholder="Type or speak your translation..." placeholderTextColor={C.textMuted} value={studentInput} onChangeText={setStudentInput} multiline autoCapitalize="sentences" autoCorrect={false} editable={!result} onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)} />
                {!result && (
                  <View style={{ paddingTop: 6 }}>
                    <VoiceInput
                      onTranscript={(text) => setStudentInput(prev => prev ? prev + ' ' + text : text)}
                      disabled={!!result}
                      language="en-US"
                    />
                  </View>
                )}
              </View>
              <View style={{ height: 12 }} />
              {!result && (
                <NeonButton
                  onPress={handleCheck}
                  disabled={!studentInput.trim() || checking}
                  loading={checking}
                  title="Check Translation"
                  icon={!checking ? <Send size={18} color="#fff" /> : null}
                  color={C.purple || '#B06CFF'}
                  textColor="#fff"
                />
              )}
            </GlassCard>
          ) : null}

          {/* FEEDBACK */}
          {result && (
            <View>
              <View style={s.xpBadge}><Star size={16} color={C.amberLight} /><Text style={s.xpBadgeText}>+{calculateXP(result.score || 0, level)} XP</Text></View>
              <FeedbackDashboard result={result} studentTranslation={studentInput} correctTranslation={correctTranslation || result.correctAnswer || ''} originalSentence={originalSentence} nativeLanguage={nativeLanguage} onNextPress={handleGenerate} onChatPress={() => { setChatMessages([]); setShowChat(true); }} />
            </View>
          )}
        </>)}
      </ScrollView>

      {/* CHAT MODAL */}
      <Modal visible={showChat} animationType="slide" onRequestClose={() => setShowChat(false)}>
        <View style={s.chatScreen}>
          <View style={s.chatHeader}><Text style={s.chatHeaderTitle}>AI Tutor</Text><TouchableOpacity onPress={() => setShowChat(false)}><X size={24} color={C.text} /></TouchableOpacity></View>
          <ScrollView style={s.chatMessages} contentContainerStyle={{ padding: 16, gap: 12 }}>
            <View style={s.chatBubbleA}><Text style={s.chatBubbleText}>Hi! I can help explain grammar rules. What would you like to know?</Text></View>
            {chatMessages.map((msg, i) => (<View key={i} style={msg.role === 'user' ? s.chatBubbleU : s.chatBubbleA}><Text style={[s.chatBubbleText, msg.role === 'user' && { color: '#fff' }]}>{msg.text}</Text></View>))}
            {chatLoading && <View style={s.chatBubbleA}><ActivityIndicator size="small" color={C.blue} /></View>}
          </ScrollView>
          <View style={s.chatInputRow}>
            <TextInput style={s.chatInputField} placeholder="Ask about grammar..." placeholderTextColor={C.textMuted} value={chatInput} onChangeText={setChatInput} onSubmitEditing={handleSendChat} />
            <TouchableOpacity style={s.chatSendBtn} onPress={handleSendChat}><ArrowRight size={20} color="#fff" /></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SETTINGS MODAL */}
      <Modal visible={showSettings} transparent animationType="fade" onRequestClose={() => setShowSettings(false)}>
        <TouchableOpacity style={s.settingsOverlay} activeOpacity={1} onPress={() => setShowSettings(false)}>
          <View style={s.settingsCard}>
            <Text style={s.settingsTitle}>Quick Settings</Text>
            <Text style={s.settingsLabel}>Native Language</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {['Spanish','Mandarin','French','German','Portuguese','Russian','Japanese','Arabic','Hindi','Polish','Italian','Czech','Afrikaans'].map(lang => (
                <TouchableOpacity key={lang} style={[s.langPill, nativeLanguage === lang && s.langPillActive]} onPress={() => setNativeLanguage(lang)}>
                  <Text style={[s.langPillText, nativeLanguage === lang && { color: C.text }]}>{lang}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={s.settingsDoneBtn} onPress={() => setShowSettings(false)}><Text style={s.settingsDoneText}>Done</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
