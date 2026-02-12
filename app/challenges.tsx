/**
 * Challenge Mode Screen - Poly-Puff v6.2
 * ==================================================
 * 
 * Timed and streak-based challenges for bonus XP.
 * 
 * Challenge types:
 *   1. Speed Round — Complete 5 sentences in 5 minutes
 *   2. Accuracy Streak — Score 80+ on 5 sentences in a row
 *   3. Grammar Focus — 5 sentences targeting a specific weak area
 *   4. Perfect Run — Score 100 on 3 sentences in a row
 * 
 * FILE: app/challenges.tsx
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  TextInput, ActivityIndicator, Alert, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Zap, Clock, Target, Award, Star, Trophy, ArrowRight,
  Send, Flame, X, Lock, CheckCircle,
} from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { generateExercise, checkTranslation } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import SettingsButton from '../components/SettingsButton';
import { feedbackForScore, feedbackPerfect, feedbackLevelUp, hapticSelection } from '../services/sounds';

const CHALLENGES = [
  {
    id: 'speed',
    title: 'Speed Round',
    desc: 'Complete 5 sentences in 5 minutes',
    icon: '⚡',
    iconComponent: (c) => <Clock size={24} color={c} />,
    color: 'amber',
    target: 5,
    timeLimit: 300,
    minScore: 60,
    xpBonus: 50,
  },
  {
    id: 'accuracy',
    title: 'Accuracy Streak',
    desc: 'Score 80+ on 5 sentences in a row',
    icon: '🎯',
    iconComponent: (c) => <Target size={24} color={c} />,
    color: 'blue',
    target: 5,
    timeLimit: null,
    minScore: 80,
    xpBonus: 75,
  },
  {
    id: 'perfect',
    title: 'Perfect Run',
    desc: 'Score 100 on 3 sentences in a row',
    icon: '💎',
    iconComponent: (c) => <Star size={24} color={c} />,
    color: 'purple',
    target: 3,
    timeLimit: null,
    minScore: 100,
    xpBonus: 100,
  },
  {
    id: 'marathon',
    title: 'Marathon',
    desc: 'Complete 10 sentences, any score',
    icon: '🏃',
    iconComponent: (c) => <Flame size={24} color={c} />,
    color: 'emerald',
    target: 10,
    timeLimit: null,
    minScore: 0,
    xpBonus: 60,
  },
];

export default function ChallengesScreen() {
  const { colors: C } = useTheme();
  const [nativeLanguage, setNativeLanguage] = useState('Spanish');
  const [level, setLevel] = useState('B1');
  const [profile, setProfile] = useState(null);

  // Active challenge state
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [challengeFailed, setChallengeFailed] = useState(false);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Exercise state
  const [originalSentence, setOriginalSentence] = useState('');
  const [correctTranslation, setCorrectTranslation] = useState('');
  const [studentInput, setStudentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lastScore, setLastScore] = useState(null);
  const [previousSentences, setPreviousSentences] = useState([]);

  // Completed challenges history
  const [completedChallenges, setCompletedChallenges] = useState({});

  useFocusEffect(useCallback(() => { loadProfile(); loadCompleted(); }, []));

  useEffect(() => {
    if (activeChallenge?.timeLimit && timeLeft > 0 && !challengeComplete && !challengeFailed) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); setChallengeFailed(true); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeChallenge, timeLeft, challengeComplete, challengeFailed]);

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

  const loadCompleted = async () => {
    try {
      const saved = await AsyncStorage.getItem('completedChallenges');
      if (saved) setCompletedChallenges(JSON.parse(saved));
    } catch (e) {}
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const colorMap = { emerald: C.emerald, blue: C.blue, amber: C.amber, purple: C.purple };
  const colorMapLight = { emerald: C.emeraldLight, blue: C.blueLight, amber: C.amberLight, purple: C.purpleLight || '#C4B5FD' };

  const startChallenge = (challenge) => {
    hapticSelection();
    setActiveChallenge(challenge);
    setChallengeProgress(0);
    setChallengeFailed(false);
    setChallengeComplete(false);
    setLastScore(null);
    setPreviousSentences([]);
    if (challenge.timeLimit) setTimeLeft(challenge.timeLimit);
    generateNext([]);
  };

  const generateNext = async (prevSentences) => {
    setLoading(true);
    setStudentInput('');
    setLastScore(null);
    try {
      const data = await generateExercise({
        nativeLanguage, level, sentenceLength: 'medium',
        previousSentences: prevSentences, profile,
      });
      setOriginalSentence(data.original || data.originalSentence || '');
      setCorrectTranslation(data.translation || data.correctTranslation || '');
    } catch (e) {
      Alert.alert('Error', 'Could not generate sentence.');
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!studentInput.trim() || checking) return;
    setChecking(true);
    try {
      const result = await checkTranslation({
        studentAnswer: studentInput.trim(),
        correctAnswer: correctTranslation,
        originalSentence, nativeLanguage, level,
      });
      const score = result.score || 0;
      setLastScore(score);
      feedbackForScore(score);

      const newProgress = challengeProgress + 1;
      const newPrev = [...previousSentences, originalSentence];
      setPreviousSentences(newPrev);

      // Check if challenge fails (accuracy/perfect challenges)
      if (activeChallenge.minScore > 0 && score < activeChallenge.minScore) {
        setChallengeFailed(true);
        setChecking(false);
        return;
      }

      // Check if challenge complete
      if (newProgress >= activeChallenge.target) {
        setChallengeProgress(newProgress);
        setChallengeComplete(true);
        feedbackLevelUp();
        // Save completion
        const updated = { ...completedChallenges };
        const key = activeChallenge.id;
        updated[key] = (updated[key] || 0) + 1;
        setCompletedChallenges(updated);
        await AsyncStorage.setItem('completedChallenges', JSON.stringify(updated));
        // Award bonus XP
        const currentXP = parseInt(await AsyncStorage.getItem('totalXP') || '0', 10);
        await AsyncStorage.setItem('totalXP', String(currentXP + activeChallenge.xpBonus));
      } else {
        setChallengeProgress(newProgress);
        // Auto-generate next
        setTimeout(() => generateNext(newPrev), 800);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not check translation.');
    }
    setChecking(false);
  };

  const exitChallenge = () => {
    clearInterval(timerRef.current);
    setActiveChallenge(null);
    setChallengeProgress(0);
    setOriginalSentence('');
  };

  // ── ACTIVE CHALLENGE VIEW ──
  if (activeChallenge) {
    const accent = colorMap[activeChallenge.color];
    const accentLight = colorMapLight[activeChallenge.color];

    if (challengeComplete) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>🏆</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: C.text, textAlign: 'center' }}>Challenge Complete!</Text>
            <Text style={{ fontSize: 16, color: C.textSec, textAlign: 'center', marginTop: 8 }}>{activeChallenge.title}</Text>
            <View style={{ backgroundColor: accent + '20', borderRadius: 16, padding: 20, marginTop: 24, alignItems: 'center', borderWidth: 1, borderColor: accent + '40' }}>
              <Text style={{ fontSize: 14, color: C.textMuted }}>Bonus XP Earned</Text>
              <Text style={{ fontSize: 36, fontWeight: '800', color: accent }}>+{activeChallenge.xpBonus}</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, marginTop: 32 }} onPress={exitChallenge}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>Back to Challenges</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    if (challengeFailed) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>😔</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: C.text, textAlign: 'center' }}>Challenge Failed</Text>
            <Text style={{ fontSize: 16, color: C.textSec, textAlign: 'center', marginTop: 8 }}>
              {activeChallenge.timeLimit && timeLeft <= 0 ? 'Time ran out!' : `You needed ${activeChallenge.minScore}+ but scored ${lastScore}`}
            </Text>
            <Text style={{ fontSize: 14, color: C.textMuted, textAlign: 'center', marginTop: 8 }}>
              Completed {challengeProgress}/{activeChallenge.target} before failing
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
              <TouchableOpacity style={{ backgroundColor: C.card, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 28, borderWidth: 1, borderColor: C.border + '40' }} onPress={exitChallenge}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: C.textSec }}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 28 }} onPress={() => startChallenge(activeChallenge)}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Challenge header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: C.text }}>{activeChallenge.title}</Text>
              <Text style={{ fontSize: 13, color: C.textSec }}>{challengeProgress}/{activeChallenge.target} completed</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {activeChallenge.timeLimit && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: timeLeft < 60 ? C.red + '20' : C.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: timeLeft < 60 ? C.red + '40' : C.border + '30' }}>
                  <Clock size={14} color={timeLeft < 60 ? C.red : C.amber} />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: timeLeft < 60 ? C.red : C.amberLight, fontVariant: ['tabular-nums'] }}>{formatTime(timeLeft)}</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => Alert.alert('Quit Challenge?', 'You\'ll lose your progress.', [{ text: 'Cancel' }, { text: 'Quit', style: 'destructive', onPress: exitChallenge }])}>
                <X size={24} color={C.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress bar */}
          <View style={{ height: 8, backgroundColor: C.cardAlt, borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${(challengeProgress / activeChallenge.target) * 100}%`, backgroundColor: accent, borderRadius: 4 }} />
          </View>

          {/* Score flash */}
          {lastScore !== null && (
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View style={{ backgroundColor: (lastScore >= 80 ? C.emerald : lastScore >= 60 ? C.amber : C.red) + '20', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: lastScore >= 80 ? C.emeraldLight : lastScore >= 60 ? C.amberLight : C.redLight || '#FCA5A5' }}>Score: {lastScore}</Text>
              </View>
            </View>
          )}

          {/* Sentence */}
          {loading ? (
            <View style={{ alignItems: 'center', padding: 40 }}><ActivityIndicator size="large" color={accent} /></View>
          ) : originalSentence ? (
            <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: accent + '30' }}>
              <Text style={{ fontSize: 12, color: C.textMuted, textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5 }}>Translate to English:</Text>
              <Text style={{ fontSize: 20, fontWeight: '600', color: C.text, lineHeight: 28, marginTop: 6, marginBottom: 16 }}>{originalSentence}</Text>
              <TextInput
                style={{ backgroundColor: C.inputBg || C.bg, borderRadius: 12, padding: 14, fontSize: 16, color: C.text, borderWidth: 1, borderColor: C.border + '60', minHeight: 60, textAlignVertical: 'top', marginBottom: 12 }}
                placeholder="Type your English translation..."
                placeholderTextColor={C.textMuted}
                value={studentInput}
                onChangeText={setStudentInput}
                multiline
                autoCapitalize="sentences"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: accent, borderRadius: 12, paddingVertical: 14, opacity: (!studentInput.trim() || checking) ? 0.5 : 1 }}
                onPress={handleSubmit}
                disabled={!studentInput.trim() || checking}
              >
                {checking ? <ActivityIndicator color="#fff" /> : (<><Send size={18} color="#fff" /><Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Submit</Text></>)}
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── CHALLENGE SELECTION VIEW ──
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <SettingsButton />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: C.text, marginTop: 10 }}>Challenges</Text>
        <Text style={{ fontSize: 13, color: C.textSec, marginTop: 2, marginBottom: 20 }}>
          Push yourself with special challenges for bonus XP
        </Text>

        {CHALLENGES.map(challenge => {
          const accent = colorMap[challenge.color];
          const accentLight = colorMapLight[challenge.color];
          const timesCompleted = completedChallenges[challenge.id] || 0;
          return (
            <TouchableOpacity
              key={challenge.id}
              style={{
                backgroundColor: C.card, borderRadius: 16, padding: 20, marginBottom: 12,
                borderWidth: 1, borderColor: accent + '25', borderLeftWidth: 4, borderLeftColor: accent,
              }}
              onPress={() => startChallenge(challenge)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: accent + '15', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 24 }}>{challenge.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 17, fontWeight: '700', color: C.text }}>{challenge.title}</Text>
                  <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{challenge.desc}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Star size={12} color={accent} />
                      <Text style={{ fontSize: 12, fontWeight: '600', color: accent }}>+{challenge.xpBonus} XP</Text>
                    </View>
                    {challenge.timeLimit && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} color={C.textMuted} />
                        <Text style={{ fontSize: 12, color: C.textMuted }}>{Math.floor(challenge.timeLimit / 60)} min</Text>
                      </View>
                    )}
                    {timesCompleted > 0 && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={12} color={C.emerald} />
                        <Text style={{ fontSize: 12, color: C.emerald }}>×{timesCompleted}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <ArrowRight size={20} color={C.textMuted} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
