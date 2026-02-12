/**
 * Vocabulary Flashcards - Poly-Puff v7
 * ================================================
 * 
 * Spaced repetition flashcard system using Leitner boxes.
 * Cards move up when correct, down when wrong.
 * Box 1: every session, Box 2: every 2 sessions, Box 3: every 4, etc.
 * 
 * FILE: app/vocab.tsx
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Alert, Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RotateCcw, Check, X, BookOpen, Star, Award,
  ChevronRight, Layers, Brain, ArrowRight,
} from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import SettingsButton from '../components/SettingsButton';
import { hapticSuccess, hapticError, hapticLight, hapticMedium } from '../services/sounds';

const { width: SCREEN_W } = Dimensions.get('window');

// Built-in vocabulary by level
const VOCAB_BANK = {
  A1: [
    { en: "apple", category: "Food", example: "I eat an apple every day." },
    { en: "beautiful", category: "Adjective", example: "The sunset is beautiful." },
    { en: "always", category: "Adverb", example: "She always arrives on time." },
    { en: "kitchen", category: "Home", example: "I cook in the kitchen." },
    { en: "weather", category: "Nature", example: "The weather is nice today." },
    { en: "friend", category: "People", example: "She is my best friend." },
    { en: "morning", category: "Time", example: "I wake up early in the morning." },
    { en: "happy", category: "Emotion", example: "The children are very happy." },
    { en: "family", category: "People", example: "My family is very large." },
    { en: "water", category: "Food", example: "Please give me a glass of water." },
    { en: "school", category: "Education", example: "The children go to school." },
    { en: "money", category: "Finance", example: "I need some money for lunch." },
  ],
  A2: [
    { en: "appointment", category: "Daily Life", example: "I have a doctor's appointment at three." },
    { en: "experience", category: "Abstract", example: "She has a lot of work experience." },
    { en: "comfortable", category: "Adjective", example: "This chair is very comfortable." },
    { en: "opportunity", category: "Abstract", example: "This is a great opportunity for you." },
    { en: "environment", category: "Nature", example: "We must protect the environment." },
    { en: "immediately", category: "Adverb", example: "Please come here immediately." },
    { en: "responsible", category: "Adjective", example: "She is responsible for the project." },
    { en: "unfortunately", category: "Adverb", example: "Unfortunately, the shop was closed." },
    { en: "temperature", category: "Science", example: "The temperature is very high today." },
    { en: "celebration", category: "Events", example: "The celebration lasted all night." },
    { en: "available", category: "Adjective", example: "Is this seat available?" },
    { en: "recommend", category: "Verb", example: "I recommend this restaurant." },
  ],
  B1: [
    { en: "consequence", category: "Abstract", example: "Every action has a consequence." },
    { en: "approximately", category: "Adverb", example: "It takes approximately two hours." },
    { en: "significant", category: "Adjective", example: "There has been a significant improvement." },
    { en: "throughout", category: "Preposition", example: "It rained throughout the day." },
    { en: "nevertheless", category: "Connector", example: "It was cold; nevertheless, they went out." },
    { en: "achievement", category: "Abstract", example: "Graduating was her greatest achievement." },
    { en: "acknowledge", category: "Verb", example: "He refused to acknowledge his mistake." },
    { en: "circumstance", category: "Abstract", example: "Under the circumstances, we had no choice." },
    { en: "distinguish", category: "Verb", example: "Can you distinguish between the two colors?" },
    { en: "enthusiasm", category: "Emotion", example: "She showed great enthusiasm for the project." },
  ],
  B2: [
    { en: "ambiguous", category: "Adjective", example: "The instructions were ambiguous." },
    { en: "comprehensive", category: "Adjective", example: "This is a comprehensive guide to grammar." },
    { en: "deteriorate", category: "Verb", example: "His health continued to deteriorate." },
    { en: "inevitable", category: "Adjective", example: "Change is inevitable in any organization." },
    { en: "reluctantly", category: "Adverb", example: "She reluctantly agreed to the proposal." },
    { en: "simultaneously", category: "Adverb", example: "Both events happened simultaneously." },
    { en: "vulnerability", category: "Abstract", example: "Showing vulnerability takes courage." },
    { en: "unprecedented", category: "Adjective", example: "This is an unprecedented situation." },
  ],
};

const STORAGE_KEY = 'vocabCards';
const SESSION_KEY = 'vocabSessionCount';

export default function VocabScreen() {
  const { colors: C } = useTheme();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCards, setSessionCards] = useState([]);
  const [sessionResults, setSessionResults] = useState({ correct: 0, wrong: 0 });
  const [mode, setMode] = useState('menu'); // menu, study, results
  const [level, setLevel] = useState('A2');
  const flipAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(useCallback(() => { loadCards(); }, []));

  const loadCards = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setCards(JSON.parse(saved));
    } catch (e) {}
  };

  const saveCards = async (updated) => {
    setCards(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const initializeCards = async () => {
    const vocab = VOCAB_BANK[level] || VOCAB_BANK['A2'];
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    let existing = saved ? JSON.parse(saved) : [];

    // Add new vocab that isn't already saved
    const existingWords = new Set(existing.map(c => c.en));
    const newCards = vocab.filter(v => !existingWords.has(v.en)).map(v => ({
      ...v,
      box: 1, // Leitner box 1-5
      lastReviewed: null,
      correctCount: 0,
      wrongCount: 0,
    }));

    const all = [...existing, ...newCards];
    await saveCards(all);
    return all;
  };

  const startSession = async () => {
    const allCards = await initializeCards();
    const sessionNum = parseInt(await AsyncStorage.getItem(SESSION_KEY) || '0', 10) + 1;
    await AsyncStorage.setItem(SESSION_KEY, String(sessionNum));

    // Leitner selection: Box 1 every time, Box 2 every 2, Box 3 every 4, etc.
    const due = allCards.filter(c => {
      if (c.box === 1) return true;
      if (c.box === 2) return sessionNum % 2 === 0;
      if (c.box === 3) return sessionNum % 4 === 0;
      if (c.box === 4) return sessionNum % 8 === 0;
      if (c.box === 5) return sessionNum % 16 === 0;
      return false;
    });

    // Shuffle and limit to 10
    const shuffled = due.sort(() => Math.random() - 0.5).slice(0, 10);

    if (shuffled.length === 0) {
      Alert.alert('All Caught Up!', 'No cards due for review. Try adding a new level or come back later.');
      return;
    }

    setSessionCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionResults({ correct: 0, wrong: 0 });
    setMode('study');
    flipAnim.setValue(0);
  };

  const flipCard = () => {
    setIsFlipped(true);
    hapticLight();
    Animated.spring(flipAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const answerCard = async (correct) => {
    const card = sessionCards[currentIndex];
    if (!card) return;

    if (correct) {
      hapticSuccess();
      card.box = Math.min(5, card.box + 1);
      card.correctCount = (card.correctCount || 0) + 1;
      setSessionResults(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      hapticError();
      card.box = 1; // Back to box 1
      card.wrongCount = (card.wrongCount || 0) + 1;
      setSessionResults(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }
    card.lastReviewed = new Date().toISOString();

    // Update in main cards array
    const updated = cards.map(c => c.en === card.en ? card : c);
    await saveCards(updated);

    // Next card or finish
    if (currentIndex + 1 < sessionCards.length) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      flipAnim.setValue(0);
    } else {
      setMode('results');
      // Award XP
      const xp = sessionResults.correct * 3 + (correct ? 3 : 0);
      const totalXP = parseInt(await AsyncStorage.getItem('totalXP') || '0', 10);
      await AsyncStorage.setItem('totalXP', String(totalXP + xp));
    }
  };

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  const currentCard = sessionCards[currentIndex];
  const boxColors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6'];

  const s = useMemo(() => StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg, padding: 16 },
    header: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 },
    headerSub: { fontSize: 13, color: C.textMuted, marginBottom: 16 },
    menuCard: { backgroundColor: C.card, borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: C.border },
    levelRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
    levelPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: C.cardAlt, borderWidth: 1, borderColor: C.border },
    levelActive: { backgroundColor: C.blue + '20', borderColor: C.blue },
    levelText: { fontSize: 14, fontWeight: '600', color: C.textMuted },
    levelTextActive: { color: C.blueLight },
    startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.emerald, borderRadius: 14, paddingVertical: 16 },
    startText: { fontSize: 16, fontWeight: '700', color: '#fff' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
    statItem: { alignItems: 'center' },
    statNum: { fontSize: 24, fontWeight: '800', color: C.text },
    statLabel: { fontSize: 11, color: C.textMuted, marginTop: 2 },
    // Study mode
    progressBar: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 16 },
    progressDot: { width: 8, height: 8, borderRadius: 4 },
    cardContainer: { alignItems: 'center', marginBottom: 20 },
    card: { width: SCREEN_W - 48, minHeight: 220, borderRadius: 20, padding: 24, justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden' },
    cardFront: { backgroundColor: C.card, borderWidth: 2, borderColor: C.border },
    cardBack: { backgroundColor: C.card, borderWidth: 2, borderColor: C.emerald + '40', position: 'absolute' },
    cardWord: { fontSize: 28, fontWeight: '800', color: C.text, textAlign: 'center', marginBottom: 8 },
    cardCategory: { fontSize: 12, fontWeight: '600', color: C.textMuted, backgroundColor: C.cardAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
    cardExample: { fontSize: 15, color: C.textSec, textAlign: 'center', lineHeight: 22, fontStyle: 'italic' },
    boxBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
    boxText: { fontSize: 11, fontWeight: '600' },
    tapHint: { fontSize: 14, color: C.textMuted, textAlign: 'center', marginBottom: 16 },
    answerRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
    wrongBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.red + '15', borderRadius: 14, paddingVertical: 16, borderWidth: 2, borderColor: C.red + '30' },
    correctBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.emerald + '15', borderRadius: 14, paddingVertical: 16, borderWidth: 2, borderColor: C.emerald + '30' },
    answerText: { fontSize: 15, fontWeight: '700' },
    // Results
    resultCard: { backgroundColor: C.card, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: C.border },
    resultIcon: { marginBottom: 12 },
    resultTitle: { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 8 },
    resultSub: { fontSize: 14, color: C.textMuted, marginBottom: 20 },
    resultStats: { flexDirection: 'row', gap: 24, marginBottom: 20 },
    resultStat: { alignItems: 'center' },
    resultNum: { fontSize: 28, fontWeight: '800' },
    resultLabel: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  }), [C]);

  // ═══ MENU MODE ═══
  if (mode === 'menu') {
    const totalCards = cards.length;
    const mastered = cards.filter(c => c.box >= 4).length;
    const learning = cards.filter(c => c.box > 1 && c.box < 4).length;
    const newCards = cards.filter(c => c.box === 1).length;

    return (
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 100 }}>
        <SettingsButton />
        <Text style={s.header}>📚 Vocabulary</Text>
        <Text style={s.headerSub}>Flashcards with spaced repetition</Text>

        <View style={s.menuCard}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: C.textMuted, marginBottom: 10, letterSpacing: 1 }}>SELECT LEVEL</Text>
          <View style={s.levelRow}>
            {['A1','A2','B1','B2'].map(l => (
              <TouchableOpacity key={l} style={[s.levelPill, level === l && s.levelActive]} onPress={() => setLevel(l)}>
                <Text style={[s.levelText, level === l && s.levelTextActive]}>{l} ({(VOCAB_BANK[l] || []).length} words)</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={s.startBtn} onPress={startSession}>
            <Brain size={20} color="#fff" />
            <Text style={s.startText}>Start Review</Text>
          </TouchableOpacity>
        </View>

        {totalCards > 0 && (
          <View style={s.menuCard}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: C.textMuted, marginBottom: 10, letterSpacing: 1 }}>YOUR PROGRESS</Text>
            <View style={s.statsRow}>
              <View style={s.statItem}><Text style={s.statNum}>{totalCards}</Text><Text style={s.statLabel}>Total Cards</Text></View>
              <View style={s.statItem}><Text style={[s.statNum, { color: C.emerald }]}>{mastered}</Text><Text style={s.statLabel}>Mastered</Text></View>
              <View style={s.statItem}><Text style={[s.statNum, { color: '#F59E0B' }]}>{learning}</Text><Text style={s.statLabel}>Learning</Text></View>
              <View style={s.statItem}><Text style={[s.statNum, { color: C.red }]}>{newCards}</Text><Text style={s.statLabel}>New</Text></View>
            </View>
            {/* Box distribution */}
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 16, height: 6 }}>
              {[1,2,3,4,5].map(box => {
                const count = cards.filter(c => c.box === box).length;
                const pct = totalCards > 0 ? (count / totalCards) * 100 : 0;
                return <View key={box} style={{ flex: pct || 0.5, height: 6, borderRadius: 3, backgroundColor: boxColors[box-1] }} />;
              })}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              {['Box 1','Box 2','Box 3','Box 4','Box 5'].map((b,i) => (
                <Text key={b} style={{ fontSize: 9, color: boxColors[i] }}>{b}</Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  // ═══ STUDY MODE ═══
  if (mode === 'study' && currentCard) {
    return (
      <View style={s.screen}>
        <Text style={s.header}>📚 Vocabulary</Text>

        {/* Progress dots */}
        <View style={s.progressBar}>
          {sessionCards.map((_, i) => (
            <View key={i} style={[s.progressDot, {
              backgroundColor: i < currentIndex ? C.emerald : i === currentIndex ? C.blue : C.border
            }]} />
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={!isFlipped ? flipCard : undefined} style={s.cardContainer}>
          {/* Front */}
          <Animated.View style={[s.card, s.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}>
            <Text style={s.cardCategory}>{currentCard.category}</Text>
            <Text style={s.cardWord}>{currentCard.en}</Text>
            <View style={s.boxBadge}>
              <Layers size={12} color={boxColors[currentCard.box - 1]} />
              <Text style={[s.boxText, { color: boxColors[currentCard.box - 1] }]}>Box {currentCard.box}</Text>
            </View>
            <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 16 }}>👆 Tap card to reveal</Text>
          </Animated.View>

          {/* Back */}
          {isFlipped && (
            <Animated.View style={[s.card, s.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
              <Text style={s.cardCategory}>{currentCard.category}</Text>
              <Text style={s.cardWord}>{currentCard.en}</Text>
              <Text style={s.cardExample}>{currentCard.example}</Text>
              <View style={s.boxBadge}>
                <Layers size={12} color={boxColors[currentCard.box - 1]} />
                <Text style={[s.boxText, { color: boxColors[currentCard.box - 1] }]}>Box {currentCard.box}</Text>
              </View>
            </Animated.View>
          )}
        </TouchableOpacity>

        {!isFlipped ? (
          <View />
        ) : (
          <>
            {/* Ask Tutor button */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.blue + '15', borderRadius: 12, paddingVertical: 10, marginHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: C.blue + '30' }}
              onPress={() => {
                Alert.alert(
                  `"${currentCard.en}"`,
                  `Category: ${currentCard.category}\n\nExample: ${currentCard.example}\n\nTip: Try using "${currentCard.en}" in your own sentence to remember it better!`,
                  [{ text: 'Got it!' }]
                );
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.blueLight }}>💬 Ask Tutor</Text>
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', fontSize: 13, color: C.textMuted, marginBottom: 12 }}>Did you know this word?</Text>
            <View style={s.answerRow}>
              <TouchableOpacity style={s.wrongBtn} onPress={() => answerCard(false)}>
                <X size={18} color={C.red} />
                <Text style={[s.answerText, { color: C.red }]}>Still Learning</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.correctBtn} onPress={() => answerCard(true)}>
                <Check size={18} color={C.emerald} />
                <Text style={[s.answerText, { color: C.emerald }]}>I Know It!</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  }

  // ═══ RESULTS MODE ═══
  if (mode === 'results') {
    const total = sessionResults.correct + sessionResults.wrong;
    const pct = total > 0 ? Math.round((sessionResults.correct / total) * 100) : 0;
    return (
      <View style={[s.screen, { justifyContent: 'center' }]}>
        <View style={s.resultCard}>
          <Award size={48} color={pct >= 80 ? C.emerald : '#F59E0B'} style={s.resultIcon} />
          <Text style={s.resultTitle}>{pct >= 80 ? 'Great Job!' : pct >= 50 ? 'Good Effort!' : 'Keep Practicing!'}</Text>
          <Text style={s.resultSub}>Session complete • {total} cards reviewed</Text>

          <View style={s.resultStats}>
            <View style={s.resultStat}><Text style={[s.resultNum, { color: C.emerald }]}>{sessionResults.correct}</Text><Text style={s.resultLabel}>Correct</Text></View>
            <View style={s.resultStat}><Text style={[s.resultNum, { color: C.red }]}>{sessionResults.wrong}</Text><Text style={s.resultLabel}>Wrong</Text></View>
            <View style={s.resultStat}><Text style={[s.resultNum, { color: C.blue }]}>{pct}%</Text><Text style={s.resultLabel}>Accuracy</Text></View>
          </View>

          <TouchableOpacity style={[s.startBtn, { width: '100%' }]} onPress={startSession}>
            <RotateCcw size={18} color="#fff" />
            <Text style={s.startText}>Review Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 12, paddingVertical: 10 }} onPress={() => setMode('menu')}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMuted, textAlign: 'center' }}>← Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <View style={s.screen}><Text style={{ color: C.text }}>Loading...</Text></View>;
}
