/**
 * Listening Comprehension Screen - Poly-Puff v7
 * ========================================================
 * 
 * Student hears an English sentence spoken by TTS,
 * then types what they heard. Scored on accuracy.
 * 
 * Modes:
 *   - Easy: sentence shown briefly, then hidden
 *   - Normal: audio only, no text shown
 *   - Hard: faster speed, longer sentences
 * 
 * FILE: app/listening.tsx
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import {
  Headphones, Play, Volume2, Send, RotateCcw, Star, Award,
  ChevronRight, ArrowRight, Settings2,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import SettingsButton from '../components/SettingsButton';
import { hapticSuccess, hapticError, hapticMedium, feedbackForScore } from '../services/sounds';

const DIFFICULTIES = [
  { key: 'easy', label: '🟢 Easy', desc: 'See text briefly', speed: 0.8, showText: true, showTime: 3000 },
  { key: 'normal', label: '🟡 Normal', desc: 'Audio only', speed: 0.9, showText: false, showTime: 0 },
  { key: 'hard', label: '🔴 Hard', desc: 'Faster, longer', speed: 1.0, showText: false, showTime: 0 },
];

// Built-in sentences by level
const SENTENCES = {
  A1: [
    "The cat is on the table.", "She likes to read books.", "I have a big dog.",
    "My name is Anna.", "He goes to school every day.", "We eat lunch at noon.",
    "The sun is very hot today.", "I drink water every morning.", "She has three brothers.",
    "The book is on the desk.", "They play in the park.", "I like ice cream.",
  ],
  A2: [
    "She was reading a book when I called her.", "The children are playing in the garden.",
    "I have been waiting for twenty minutes.", "He usually takes the bus to work.",
    "We went to the beach last weekend.", "The movie was better than I expected.",
    "Can you tell me where the station is?", "I need to buy some milk and bread.",
    "She doesn't like getting up early.", "They have lived here for five years.",
  ],
  B1: [
    "If I had more time, I would learn to play the guitar.",
    "The report should be finished by the end of the week.",
    "She told me that she had already spoken to the manager.",
    "Although it was raining heavily, they decided to go for a walk.",
    "The company has been growing steadily over the past three years.",
    "I wish I had studied harder when I was at university.",
    "The building which was built in the nineteenth century needs renovation.",
    "He suggested that we should meet at the restaurant at seven o'clock.",
  ],
  B2: [
    "Had she known about the delay, she would have taken an earlier flight.",
    "The research, which was conducted over a period of five years, revealed some surprising results.",
    "Not only did he finish the project on time, but he also exceeded all expectations.",
    "The government is expected to announce new measures to address the housing crisis.",
    "Despite having been warned several times, he continued to arrive late to meetings.",
    "It is widely believed that artificial intelligence will transform the job market significantly.",
  ],
  C1: [
    "Notwithstanding the considerable challenges they faced, the team managed to deliver an exceptional product.",
    "Were it not for the timely intervention of the emergency services, the consequences could have been catastrophic.",
    "The extent to which socioeconomic factors influence educational attainment remains a subject of ongoing debate.",
    "Having thoroughly reviewed all the available evidence, the committee reached the unanimous conclusion that further investigation was warranted.",
  ],
};

export default function ListeningScreen() {
  const { colors: C } = useTheme();
  const [difficulty, setDifficulty] = useState('normal');
  const [level, setLevel] = useState('A2');
  const [currentSentence, setCurrentSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [showSentence, setShowSentence] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [playCount, setPlayCount] = useState(0);

  const diff = DIFFICULTIES.find(d => d.key === difficulty);

  const getScoreColor = (s) => s >= 90 ? C.emerald : s >= 70 ? '#F59E0B' : s >= 50 ? '#F97316' : C.red;

  const generateSentence = useCallback(() => {
    const pool = SENTENCES[level] || SENTENCES['A2'];
    const sentence = pool[Math.floor(Math.random() * pool.length)];
    setCurrentSentence(sentence);
    setUserInput('');
    setResult(null);
    setPlayCount(0);

    // For easy mode, show text briefly
    if (diff.showText && diff.showTime > 0) {
      setShowSentence(true);
      setTimeout(() => setShowSentence(false), diff.showTime);
    }

    // Auto-play
    setTimeout(() => playSentence(sentence), 500);
  }, [level, difficulty]);

  const playSentence = (text) => {
    const sentence = text || currentSentence;
    if (!sentence) return;
    setIsPlaying(true);
    setPlayCount(prev => prev + 1);
    Speech.speak(sentence, {
      language: 'en-US',
      rate: diff.speed,
      onDone: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
    hapticMedium();
  };

  const checkAnswer = () => {
    if (!userInput.trim() || !currentSentence) return;

    // Score: word-by-word comparison
    const normalize = (s) => s.toLowerCase().replace(/[.,!?;:'"]/g, '').replace(/\s+/g, ' ').trim();
    const correctWords = normalize(currentSentence).split(' ');
    const userWords = normalize(userInput).split(' ');

    let matches = 0;
    const maxLen = Math.max(correctWords.length, userWords.length);

    for (let i = 0; i < correctWords.length; i++) {
      if (userWords[i] === correctWords[i]) matches++;
      else if (userWords.includes(correctWords[i])) matches += 0.5; // partial credit
    }

    const accuracy = Math.round((matches / maxLen) * 100);
    // Penalty for extra plays
    const playPenalty = Math.max(0, (playCount - 2) * 5);
    const finalScore = Math.max(0, Math.min(100, accuracy - playPenalty));

    setScore(finalScore);
    setResult({ accuracy: finalScore, correctWords, userWords });
    setSessionCount(prev => prev + 1);
    setSessionScore(prev => prev + finalScore);
    feedbackForScore(finalScore);

    // Save to history
    saveToHistory(finalScore);
  };

  const saveToHistory = async (sc) => {
    try {
      const saved = await AsyncStorage.getItem('listeningHistory');
      const history = saved ? JSON.parse(saved) : [];
      history.push({
        date: new Date().toISOString(),
        level, difficulty,
        score: sc,
        sentence: currentSentence,
        userAnswer: userInput,
      });
      // Keep last 200
      if (history.length > 200) history.splice(0, history.length - 200);
      await AsyncStorage.setItem('listeningHistory', JSON.stringify(history));
      // Award XP
      const xp = Math.round(sc / 5);
      const totalXP = parseInt(await AsyncStorage.getItem('totalXP') || '0', 10);
      await AsyncStorage.setItem('totalXP', String(totalXP + xp));
    } catch (e) {}
  };

  const s = useMemo(() => StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg },
    scroll: { flex: 1, padding: 16 },
    header: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 },
    headerSub: { fontSize: 13, color: C.textMuted, marginBottom: 16 },
    card: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
    label: { fontSize: 12, fontWeight: '700', color: C.textMuted, marginBottom: 8, letterSpacing: 1 },
    diffRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    diffBtn: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 12, borderWidth: 2, borderColor: C.border, alignItems: 'center' },
    diffActive: { borderColor: C.emerald, backgroundColor: C.emerald + '15' },
    diffLabel: { fontSize: 13, fontWeight: '700', color: C.text },
    diffDesc: { fontSize: 10, color: C.textMuted, marginTop: 2 },
    levelRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
    levelPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: C.cardAlt, borderWidth: 1, borderColor: C.border },
    levelActive: { backgroundColor: C.blue + '20', borderColor: C.blue },
    levelText: { fontSize: 13, fontWeight: '600', color: C.textMuted },
    levelTextActive: { color: C.blueLight },
    listenCard: { backgroundColor: C.card, borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: C.emerald + '30', alignItems: 'center' },
    playBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.emerald + '15', borderWidth: 3, borderColor: C.emerald, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    playLabel: { fontSize: 14, fontWeight: '600', color: C.emeraldLight, marginBottom: 4 },
    playCount: { fontSize: 11, color: C.textMuted },
    sentencePreview: { fontSize: 16, fontWeight: '500', color: C.text, textAlign: 'center', marginTop: 8, lineHeight: 24 },
    inputCard: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
    input: { backgroundColor: C.bg, borderRadius: 12, padding: 14, fontSize: 16, color: C.text, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: C.border },
    submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.emerald, borderRadius: 12, paddingVertical: 14, marginTop: 10 },
    submitText: { fontSize: 15, fontWeight: '700', color: '#fff' },
    resultCard: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
    scoreCircle: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 },
    scoreNum: { fontSize: 24, fontWeight: '800' },
    correctText: { fontSize: 14, color: C.emeraldLight, lineHeight: 22, marginBottom: 8 },
    yourText: { fontSize: 14, color: C.text, lineHeight: 22, marginBottom: 8 },
    wordMatch: { color: C.emeraldLight, fontWeight: '600' },
    wordMiss: { color: C.red, textDecorationLine: 'underline' },
    nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.blue, borderRadius: 12, paddingVertical: 14, marginTop: 10 },
    startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.emerald, borderRadius: 14, paddingVertical: 16, marginTop: 8 },
    sessionBar: { flexDirection: 'row', justifyContent: 'center', gap: 20, paddingVertical: 8, marginBottom: 8 },
    sessionStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    sessionText: { fontSize: 12, fontWeight: '600', color: C.textMuted },
  }), [C]);

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SettingsButton />
      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
        <Text style={s.header}>🎧 Listening</Text>
        <Text style={s.headerSub}>Listen to English and type what you hear</Text>

        {/* Session stats */}
        {sessionCount > 0 && (
          <View style={s.sessionBar}>
            <View style={s.sessionStat}><Headphones size={14} color={C.emerald} /><Text style={s.sessionText}>{sessionCount} done</Text></View>
            <View style={s.sessionStat}><Star size={14} color={C.amberLight} /><Text style={s.sessionText}>Avg: {Math.round(sessionScore / sessionCount)}%</Text></View>
          </View>
        )}

        {/* No current sentence — show setup */}
        {!currentSentence && (<>
          {/* Difficulty */}
          <Text style={s.label}>DIFFICULTY</Text>
          <View style={s.diffRow}>
            {DIFFICULTIES.map(d => (
              <TouchableOpacity key={d.key} style={[s.diffBtn, difficulty === d.key && s.diffActive]} onPress={() => setDifficulty(d.key)}>
                <Text style={s.diffLabel}>{d.label}</Text>
                <Text style={s.diffDesc}>{d.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Level */}
          <Text style={s.label}>LEVEL</Text>
          <View style={s.levelRow}>
            {['A1','A2','B1','B2','C1'].map(l => (
              <TouchableOpacity key={l} style={[s.levelPill, level === l && s.levelActive]} onPress={() => setLevel(l)}>
                <Text style={[s.levelText, level === l && s.levelTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={s.startBtn} onPress={generateSentence}>
            <Headphones size={20} color="#fff" />
            <Text style={s.submitText}>Start Listening</Text>
          </TouchableOpacity>
        </>)}

        {/* Active listening exercise */}
        {currentSentence && !result && (<>
          <View style={s.listenCard}>
            <TouchableOpacity style={s.playBtn} onPress={() => playSentence()} disabled={isPlaying}>
              {isPlaying ? <ActivityIndicator color={C.emerald} size="large" /> : <Volume2 size={36} color={C.emerald} />}
            </TouchableOpacity>
            <Text style={s.playLabel}>{isPlaying ? 'Playing...' : 'Tap to listen again'}</Text>
            <Text style={s.playCount}>Played {playCount} time{playCount !== 1 ? 's' : ''} • {diff.label}</Text>
            {showSentence && <Text style={s.sentencePreview}>{currentSentence}</Text>}
          </View>

          <View style={s.inputCard}>
            <Text style={s.label}>TYPE WHAT YOU HEARD</Text>
            <TextInput
              style={s.input}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Type the sentence here..."
              placeholderTextColor={C.textMuted}
              multiline
              autoCapitalize="sentences"
              autoCorrect={false}
            />
            <TouchableOpacity style={[s.submitBtn, !userInput.trim() && { opacity: 0.4 }]} onPress={checkAnswer} disabled={!userInput.trim()}>
              <Send size={16} color="#fff" />
              <Text style={s.submitText}>Check Answer</Text>
            </TouchableOpacity>
          </View>
        </>)}

        {/* Result */}
        {result && (<>
          <View style={s.resultCard}>
            <View style={[s.scoreCircle, { backgroundColor: getScoreColor(score) + '15', borderWidth: 3, borderColor: getScoreColor(score) }]}>
              <Text style={[s.scoreNum, { color: getScoreColor(score) }]}>{score}%</Text>
            </View>

            <Text style={s.label}>CORRECT SENTENCE</Text>
            <Text style={s.correctText}>✅ {currentSentence}</Text>

            <Text style={s.label}>YOUR ANSWER</Text>
            <Text style={s.yourText}>
              {result.userWords.map((w, i) => {
                const isCorrect = result.correctWords[i] === w;
                return <Text key={i} style={isCorrect ? s.wordMatch : s.wordMiss}>{w} </Text>;
              })}
            </Text>

            <TouchableOpacity style={s.nextBtn} onPress={generateSentence}>
              <ArrowRight size={16} color="#fff" />
              <Text style={s.submitText}>Next Sentence</Text>
            </TouchableOpacity>
          </View>
        </>)}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
