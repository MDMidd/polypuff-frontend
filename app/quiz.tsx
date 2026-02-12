/**
 * Grammar Quiz Screen - Poly-Puff v7
 * ==============================================
 * 
 * Multiple choice quiz testing grammar knowledge.
 * Questions generated from rules database.
 * 
 * FILE: app/quiz.tsx
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw,
  Award, Star, Zap, Target,
} from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import SettingsButton from '../components/SettingsButton';
import { hapticSuccess, hapticError, feedbackForScore } from '../services/sounds';

const QUIZ_LENGTH = 10;

// ═══ BUILT-IN QUIZ QUESTIONS ═══
// Each has: question, options (4), correct index, topic, rule_id, explanation
const QUESTION_BANK = [
  // ARTICLES
  { q: "Choose the correct sentence:", opts: ["She is an honest person.", "She is a honest person.", "She is the honest person.", "She is honest person."], correct: 0, topic: "Articles", rule: "ART_001", explain: "'Honest' starts with a silent H, so we use 'an' (vowel sound)." },
  { q: "Fill in: I need ___ hour to finish.", opts: ["a", "an", "the", "—"], correct: 1, topic: "Articles", rule: "ART_001", explain: "'Hour' starts with a vowel sound (silent H), so 'an' is correct." },
  { q: "Which is correct?", opts: ["He goes to the university.", "He goes to a university.", "He goes to an university.", "He goes to university."], correct: 1, topic: "Articles", rule: "ART_001", explain: "'University' starts with a /j/ consonant sound, so use 'a' not 'an'." },
  { q: "Choose: ___ sun rises in ___ east.", opts: ["The, the", "A, the", "The, a", "—, —"], correct: 0, topic: "Articles", rule: "ART_005", explain: "Use 'the' with unique things (the sun) and compass directions (the east)." },

  // TENSES
  { q: "She ___ here since 2020.", opts: ["has lived", "lived", "is living", "lives"], correct: 0, topic: "Tenses", rule: "TENS_008", explain: "Present perfect ('has lived') with 'since' for actions starting in the past and continuing." },
  { q: "I ___ dinner when she called.", opts: ["was cooking", "cooked", "am cooking", "have cooked"], correct: 0, topic: "Tenses", rule: "TENS_003", explain: "Past continuous for an action in progress when another action happened." },
  { q: "By the time he arrived, she ___.", opts: ["had already left", "already left", "has already left", "was already leaving"], correct: 0, topic: "Tenses", rule: "TENS_012", explain: "Past perfect for an action completed before another past action." },
  { q: "He ___ to the gym every morning.", opts: ["goes", "is going", "go", "going"], correct: 0, topic: "Tenses", rule: "TENS_001", explain: "Simple present for habits and routines. Third person adds -s: he goes." },

  // COMPARATIVES
  { q: "She is ___ than her sister.", opts: ["taller", "more tall", "tallest", "most tall"], correct: 0, topic: "Comparatives & Superlatives", rule: "COMP_001", explain: "Short adjectives (1-2 syllables) use -er for comparatives: tall → taller." },
  { q: "This is the ___ book I have ever read.", opts: ["most interesting", "more interesting", "interestingest", "most interestingest"], correct: 0, topic: "Comparatives & Superlatives", rule: "COMP_002", explain: "Long adjectives use 'most' for superlatives: the most interesting." },
  { q: "Today is ___ than yesterday.", opts: ["worse", "more bad", "badder", "worst"], correct: 0, topic: "Comparatives & Superlatives", rule: "COMP_003", explain: "Irregular: bad → worse → worst." },
  { q: "She is as ___ as her mother.", opts: ["intelligent", "more intelligent", "most intelligent", "intelligenter"], correct: 0, topic: "Comparatives & Superlatives", rule: "COMP_005", explain: "As + base adjective + as for equal comparisons." },

  // COUNTABLE/UNCOUNTABLE
  { q: "Which sentence is correct?", opts: ["I need some information.", "I need an information.", "I need informations.", "I need many information."], correct: 0, topic: "Countable & Uncountable Nouns", rule: "COUNT_001", explain: "'Information' is uncountable: no 'a/an', no plural -s." },
  { q: "I don't have ___ time, but I have ___ books.", opts: ["much, many", "many, much", "a lot, a lot", "few, little"], correct: 0, topic: "Countable & Uncountable Nouns", rule: "COUNT_002", explain: "Much + uncountable (time), many + countable plural (books)." },
  { q: "There are ___ people here today.", opts: ["fewer", "less", "lesser", "littler"], correct: 0, topic: "Countable & Uncountable Nouns", rule: "COUNT_003", explain: "Fewer + countable (people). Less + uncountable." },

  // PRONOUNS
  { q: "They invited ___ to the party.", opts: ["us", "we", "our", "ours"], correct: 0, topic: "Pronouns", rule: "PRO_001", explain: "Object pronoun after verb: invited us (not we)." },
  { q: "This book is ___.", opts: ["mine", "my", "me", "I"], correct: 0, topic: "Pronouns", rule: "PRO_002", explain: "Possessive pronoun standing alone: mine (not my)." },
  { q: "She taught ___ to play guitar.", opts: ["herself", "her", "hers", "she"], correct: 0, topic: "Pronouns", rule: "PRO_003", explain: "Reflexive pronoun when subject and object are the same: she taught herself." },
  { q: "___ going to ___ house over ___.", opts: ["They're, their, there", "Their, there, they're", "There, they're, their", "They're, there, their"], correct: 0, topic: "Pronouns", rule: "PRO_007", explain: "They're = they are. Their = possessive. There = place." },

  // ADJECTIVES & ADVERBS
  { q: "She speaks English ___.", opts: ["well", "good", "goodly", "nice"], correct: 0, topic: "Adjectives & Adverbs", rule: "ADJ_001", explain: "Adverb after verb: speaks well. Good is an adjective." },
  { q: "The movie is ___. I am ___.", opts: ["boring, bored", "bored, boring", "boring, boring", "bored, bored"], correct: 0, topic: "Adjectives & Adverbs", rule: "ADJ_004", explain: "-ing describes the cause (boring movie), -ed describes the feeling (I am bored)." },
  { q: "It's ___ hot to drink.", opts: ["too", "very", "enough", "so"], correct: 0, topic: "Adjectives & Adverbs", rule: "ADJ_005", explain: "'Too' implies a negative excess/problem: too hot = can't drink it." },

  // COLLOCATIONS
  { q: "I ___ a mistake on the exam.", opts: ["made", "did", "had", "took"], correct: 0, topic: "Collocations", rule: "COLL_001", explain: "Collocation: make a mistake (not do a mistake)." },
  { q: "She ___ me the truth.", opts: ["told", "said", "spoke", "talked"], correct: 0, topic: "Collocations", rule: "COLL_002", explain: "Tell + person: told me. Say + words: said that." },
  { q: "Let's ___ a break.", opts: ["take", "make", "do", "have"], correct: 0, topic: "Collocations", rule: "COLL_004", explain: "Collocation: take a break." },

  // PREPOSITIONS
  { q: "I was born ___ March.", opts: ["in", "on", "at", "by"], correct: 0, topic: "Prepositions", rule: "PREP_001", explain: "In + months: in March, in January." },
  { q: "The meeting is ___ Monday ___ 3 o'clock.", opts: ["on, at", "in, at", "at, on", "on, in"], correct: 0, topic: "Prepositions", rule: "PREP_001", explain: "On + days: on Monday. At + times: at 3 o'clock." },

  // QUESTIONS
  { q: "Can you tell me where ___?", opts: ["the bank is", "is the bank", "the bank", "bank is the"], correct: 0, topic: "Questions", rule: "QUES_004", explain: "Indirect questions use statement word order: where the bank is." },
  { q: "___ she like coffee?", opts: ["Does", "Do", "Is", "Has"], correct: 0, topic: "Questions", rule: "QUES_003", explain: "Does for third person questions: Does she like?" },

  // WORD ORDER
  { q: "I ___ eat breakfast at eight.", opts: ["always", "eat always", "always am", "do always"], correct: 0, topic: "Word Order", rule: "WO_004", explain: "Frequency adverbs before main verb: I always eat." },

  // CONDITIONALS
  { q: "If I ___ rich, I would travel.", opts: ["were", "am", "was being", "will be"], correct: 0, topic: "Conditionals", rule: "COND_002", explain: "Second conditional: If + past simple (were), would + base verb." },

  // MODALS
  { q: "You ___ study more for the exam.", opts: ["should", "should to", "must to", "ought"], correct: 0, topic: "Modals", rule: "MOD_001", explain: "Should + base verb (no 'to'): should study." },

  // PASSIVE VOICE
  { q: "The letter ___ by my grandfather.", opts: ["was written", "was wrote", "written", "is write"], correct: 0, topic: "Passive Voice", rule: "PASS_001", explain: "Passive: was/were + past participle: was written." },

  // PHRASAL VERBS
  { q: "She ___ her grandmother every weekend.", opts: ["looks after", "looks for", "looks up", "looks at"], correct: 0, topic: "Phrasal Verbs", rule: "PV_006", explain: "Look after = take care of." },
  { q: "Please ___ the light.", opts: ["turn on", "open", "switch", "light up"], correct: 0, topic: "Phrasal Verbs", rule: "PV_008", explain: "Turn on = start a device/light." },

  // SPELLING
  { q: "Which spelling is correct?", opts: ["believe", "beleive", "belive", "beleave"], correct: 0, topic: "Spelling Patterns", rule: "SPELL_001", explain: "I before E except after C: believe." },
  { q: "She is ___ dinner right now.", opts: ["making", "makeing", "makking", "makeng"], correct: 0, topic: "Spelling Patterns", rule: "SPELL_003", explain: "Drop silent E before -ing: make → making." },

  // FALSE FRIENDS
  { q: "'Actually' in English means:", opts: ["In fact / really", "Currently / now", "Right now", "At this moment"], correct: 0, topic: "Common False Friends", rule: "FF_001", explain: "Actually = in fact. Currently = now." },

  // NEGATIVES
  { q: "Which is correct?", opts: ["I don't have anything.", "I don't have nothing.", "I haven't nothing.", "I no have anything."], correct: 0, topic: "Negatives", rule: "NEG_003", explain: "No double negatives in English: don't + anything (not nothing)." },

  // PUNCTUATION
  { q: "Which shows correct possession?", opts: ["The dog's bone.", "The dogs bone.", "The dogs' bone. (one dog)", "The dog bone."], correct: 0, topic: "Punctuation", rule: "PUNC_004", explain: "Singular possession: 's → the dog's bone." },

  // DETERMINERS
  { q: "___ of the two answers is correct.", opts: ["Neither", "None", "All", "Any"], correct: 0, topic: "Determiners", rule: "DET_003", explain: "Neither for 2 items. None for 3+." },

  // REPORTED SPEECH
  { q: "She said that she ___ tired.", opts: ["was", "is", "will be", "has been"], correct: 0, topic: "Reported Speech", rule: "REP_001", explain: "Reported speech: shift tense back (is → was)." },

  // GERUNDS
  { q: "I enjoy ___.", opts: ["swimming", "to swim", "swim", "to swimming"], correct: 0, topic: "Gerunds & Infinitives", rule: "GER_001", explain: "Enjoy + gerund (-ing): enjoy swimming." },
];

export default function QuizScreen() {
  const { colors: C } = useTheme();
  const [mode, setMode] = useState('menu'); // menu, quiz, results
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [level, setLevel] = useState('all');

  const startQuiz = () => {
    let pool = [...QUESTION_BANK];
    // Shuffle
    pool = pool.sort(() => Math.random() - 0.5);
    // Shuffle options for each question (keeping track of correct answer)
    const prepared = pool.slice(0, QUIZ_LENGTH).map(q => {
      const indices = [0, 1, 2, 3];
      // Shuffle indices
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const newCorrect = indices.indexOf(q.correct);
      return {
        ...q,
        opts: indices.map(i => q.opts[i]),
        correct: newCorrect,
      };
    });

    setQuestions(prepared);
    setCurrentQ(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setAnswers([]);
    setMode('quiz');
  };

  const selectAnswer = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);

    const isCorrect = idx === questions[currentQ].correct;
    if (isCorrect) {
      hapticSuccess();
      setScore(prev => prev + 1);
    } else {
      hapticError();
    }
    setAnswers(prev => [...prev, { question: questions[currentQ], selected: idx, correct: isCorrect }]);
  };

  const nextQuestion = async () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setMode('results');
      // Save & award XP
      const pct = Math.round((score / questions.length) * 100);
      const xp = Math.round(pct / 4);
      try {
        const totalXP = parseInt(await AsyncStorage.getItem('totalXP') || '0', 10);
        await AsyncStorage.setItem('totalXP', String(totalXP + xp));
        const saved = await AsyncStorage.getItem('quizHistory');
        const history = saved ? JSON.parse(saved) : [];
        history.push({ date: new Date().toISOString(), score: pct, correct: score, total: questions.length });
        if (history.length > 100) history.splice(0, history.length - 100);
        await AsyncStorage.setItem('quizHistory', JSON.stringify(history));
      } catch (e) {}
      feedbackForScore(pct);
    }
  };

  const getScoreColor = (s) => s >= 80 ? C.emerald : s >= 60 ? '#F59E0B' : C.red;

  const s = useMemo(() => StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg, padding: 16 },
    header: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 },
    headerSub: { fontSize: 13, color: C.textMuted, marginBottom: 16 },
    card: { backgroundColor: C.card, borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: C.border },
    startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.emerald, borderRadius: 14, paddingVertical: 16, marginTop: 12 },
    startText: { fontSize: 16, fontWeight: '700', color: '#fff' },
    progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    progressText: { fontSize: 13, fontWeight: '600', color: C.textMuted },
    progressBar: { flex: 1, height: 6, backgroundColor: C.border, borderRadius: 3, marginLeft: 12 },
    progressFill: { height: 6, borderRadius: 3, backgroundColor: C.emerald },
    questionText: { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 4 },
    topicBadge: { fontSize: 11, fontWeight: '600', color: C.textMuted, backgroundColor: C.cardAlt, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 12 },
    optionBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, borderWidth: 2, borderColor: C.border, marginBottom: 8 },
    optionLetter: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center' },
    optionLetterText: { fontSize: 13, fontWeight: '700', color: C.textMuted },
    optionText: { fontSize: 15, color: C.text, flex: 1 },
    correctOpt: { borderColor: C.emerald, backgroundColor: C.emerald + '10' },
    wrongOpt: { borderColor: C.red, backgroundColor: C.red + '10' },
    explainCard: { backgroundColor: C.cardAlt, borderRadius: 12, padding: 14, marginTop: 8, borderLeftWidth: 3, borderLeftColor: C.blue },
    explainText: { fontSize: 13, color: C.textSec, lineHeight: 20 },
    nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.blue, borderRadius: 12, paddingVertical: 14, marginTop: 12 },
    nextText: { fontSize: 15, fontWeight: '700', color: '#fff' },
    resultCard: { backgroundColor: C.card, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: C.border },
    resultScore: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    resultNum: { fontSize: 32, fontWeight: '800' },
    resultPct: { fontSize: 14, fontWeight: '600' },
    resultTitle: { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 },
    resultSub: { fontSize: 14, color: C.textMuted, marginBottom: 20 },
    resultRow: { flexDirection: 'row', gap: 20, marginBottom: 20 },
    resultStat: { alignItems: 'center' },
    resultStatNum: { fontSize: 24, fontWeight: '800' },
    resultStatLabel: { fontSize: 11, color: C.textMuted, marginTop: 2 },
    reviewItem: { flexDirection: 'row', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: C.border + '20' },
  }), [C]);

  const LETTERS = ['A', 'B', 'C', 'D'];

  // ═══ MENU ═══
  if (mode === 'menu') {
    return (
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 100 }}>
        <SettingsButton />
        <Text style={s.header}>🧠 Grammar Quiz</Text>
        <Text style={s.headerSub}>Test your grammar with multiple choice questions</Text>

        <View style={s.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Brain size={24} color={C.emerald} />
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>{QUIZ_LENGTH} Questions</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>Covering {new Set(QUESTION_BANK.map(q => q.topic)).size} grammar topics</Text>
            </View>
          </View>
          <Text style={{ fontSize: 13, color: C.textSec, lineHeight: 20, marginBottom: 12 }}>
            Each quiz picks {QUIZ_LENGTH} random questions from a bank of {QUESTION_BANK.length} covering articles, tenses, prepositions, comparatives, pronouns, and more. Options are shuffled each time.
          </Text>
          <TouchableOpacity style={s.startBtn} onPress={startQuiz}>
            <Zap size={20} color="#fff" />
            <Text style={s.startText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ═══ QUIZ ═══
  if (mode === 'quiz' && questions[currentQ]) {
    const q = questions[currentQ];
    return (
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Progress */}
        <View style={s.progressRow}>
          <Text style={s.progressText}>{currentQ + 1} / {questions.length}</Text>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${((currentQ + 1) / questions.length) * 100}%` }]} />
          </View>
          <Text style={[s.progressText, { marginLeft: 12 }]}>{score} ✓</Text>
        </View>

        {/* Question card */}
        <View style={s.card}>
          <Text style={s.topicBadge}>{q.topic}</Text>
          <Text style={s.questionText}>{q.q}</Text>
        </View>

        {/* Options */}
        {q.opts.map((opt, i) => {
          let style = {};
          if (showAnswer) {
            if (i === q.correct) style = s.correctOpt;
            else if (i === selected && i !== q.correct) style = s.wrongOpt;
          } else if (i === selected) {
            style = { borderColor: C.blue, backgroundColor: C.blue + '10' };
          }

          return (
            <TouchableOpacity key={i} style={[s.optionBtn, style]} onPress={() => selectAnswer(i)} disabled={showAnswer} activeOpacity={0.7}>
              <View style={[s.optionLetter, showAnswer && i === q.correct && { backgroundColor: C.emerald + '20' }, showAnswer && i === selected && i !== q.correct && { backgroundColor: C.red + '20' }]}>
                <Text style={[s.optionLetterText, showAnswer && i === q.correct && { color: C.emerald }, showAnswer && i === selected && i !== q.correct && { color: C.red }]}>{LETTERS[i]}</Text>
              </View>
              <Text style={[s.optionText, showAnswer && i === q.correct && { color: C.emeraldLight, fontWeight: '600' }, showAnswer && i === selected && i !== q.correct && { color: C.red }]}>{opt}</Text>
              {showAnswer && i === q.correct && <CheckCircle2 size={18} color={C.emerald} />}
              {showAnswer && i === selected && i !== q.correct && <XCircle size={18} color={C.red} />}
            </TouchableOpacity>
          );
        })}

        {/* Explanation */}
        {showAnswer && (
          <>
            <View style={s.explainCard}>
              <Text style={s.explainText}>💡 {q.explain}</Text>
            </View>
            <TouchableOpacity style={s.nextBtn} onPress={nextQuestion}>
              <ArrowRight size={16} color="#fff" />
              <Text style={s.nextText}>{currentQ + 1 < questions.length ? 'Next Question' : 'See Results'}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    );
  }

  // ═══ RESULTS ═══
  if (mode === 'results') {
    const pct = Math.round((score / questions.length) * 100);
    const color = getScoreColor(pct);

    return (
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={s.resultCard}>
          <View style={[s.resultScore, { backgroundColor: color + '15', borderWidth: 4, borderColor: color }]}>
            <Text style={[s.resultNum, { color }]}>{score}</Text>
            <Text style={[s.resultPct, { color }]}>/ {questions.length}</Text>
          </View>
          <Text style={s.resultTitle}>{pct >= 90 ? '🏆 Excellent!' : pct >= 70 ? '⭐ Great Job!' : pct >= 50 ? '👍 Good Effort!' : '📚 Keep Learning!'}</Text>
          <Text style={s.resultSub}>{pct}% correct</Text>

          <TouchableOpacity style={[s.startBtn, { width: '100%' }]} onPress={startQuiz}>
            <RotateCcw size={18} color="#fff" />
            <Text style={s.startText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 10, paddingVertical: 10 }} onPress={() => setMode('menu')}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMuted, textAlign: 'center' }}>← Back to Menu</Text>
          </TouchableOpacity>
        </View>

        {/* Review wrong answers */}
        {answers.filter(a => !a.correct).length > 0 && (
          <View style={[s.card, { marginTop: 12 }]}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 10 }}>📝 Review Mistakes</Text>
            {answers.filter(a => !a.correct).map((a, i) => (
              <View key={i} style={s.reviewItem}>
                <XCircle size={16} color={C.red} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>{a.question.q}</Text>
                  <Text style={{ fontSize: 12, color: C.red, marginTop: 2 }}>Your answer: {a.question.opts[a.selected]}</Text>
                  <Text style={{ fontSize: 12, color: C.emeraldLight, marginTop: 1 }}>Correct: {a.question.opts[a.question.correct]}</Text>
                  <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{a.question.explain}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  }

  return null;
}
