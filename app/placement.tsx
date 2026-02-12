/**
 * Placement Test - Poly-Puff v2.0
 * =================================
 * 
 * Adaptive placement test: 20 questions across 4 skills.
 * Determines CEFR levels for Reading, Writing, Listening, Speaking.
 * Must be first icon in Practice section.
 * 
 * FILE: app/placement.tsx
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput, Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  BookOpen, PenTool, Headphones, Mic, CheckCircle, ArrowRight,
  Award, BarChart3,
} from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useTheme } from '../contexts/ThemeContext';
import { ScreenBackground, GlassCard, NeonButton, MascotHeader } from '../components/PolyPuffUI';
import { hapticSuccess, hapticError, feedbackForScore } from '../services/sounds';

// ═══ TEST BANK — 5 questions per skill, A1→C1 difficulty ═══
const TEST_BANK = {
  reading: [
    { level: 'A1', q: 'Choose the correct word: "She ___ a teacher."', opts: ['is','are','am','be'], answer: 0 },
    { level: 'A2', q: 'Choose the correct sentence:', opts: ['He goed to school','He went to school','He go to school','He going to school'], answer: 1 },
    { level: 'B1', q: '"Despite the rain, they decided to go hiking." What does "despite" mean?', opts: ['Because of','Even though','After','Before'], answer: 1 },
    { level: 'B2', q: '"The committee unanimously endorsed the proposal." "Unanimously" means:', opts: ['Partially','Reluctantly','With full agreement','Secretly'], answer: 2 },
    { level: 'C1', q: '"Her sardonic remark belied her apparent indifference." "Belied" means:', opts: ['Confirmed','Disguised/contradicted','Emphasized','Revealed'], answer: 1 },
  ],
  writing: [
    { level: 'A1', prompt: 'Write a sentence about your family.', minWords: 3 },
    { level: 'A2', prompt: 'Describe what you did yesterday in 2 sentences.', minWords: 8 },
    { level: 'B1', prompt: 'Write a short paragraph about your favorite hobby and why you enjoy it.', minWords: 20 },
    { level: 'B2', prompt: 'In 2-3 sentences, explain why learning a second language is important in today\'s world.', minWords: 25 },
    { level: 'C1', prompt: 'Write a brief argument for or against remote work, using at least one concession ("although", "however").', minWords: 30 },
  ],
  listening: [
    { level: 'A1', text: 'The cat is on the table.', q: 'Where is the cat?', opts: ['Under the chair','On the table','In the box','By the door'], answer: 1 },
    { level: 'A2', text: 'I usually wake up at seven and have breakfast with my family.', q: 'When does the speaker wake up?', opts: ['At six','At seven','At eight','At nine'], answer: 1 },
    { level: 'B1', text: 'Although the weather forecast predicted sunshine, we decided to bring umbrellas just in case.', q: 'Why did they bring umbrellas?', opts: ['It was raining','To be prepared','They forgot sunscreen','Someone told them to'], answer: 1 },
    { level: 'B2', text: 'The research indicates that bilingual individuals tend to outperform monolingual peers in tasks requiring cognitive flexibility.', q: 'What advantage do bilingual people have?', opts: ['Better memory','More creativity','Greater cognitive flexibility','Higher IQ'], answer: 2 },
    { level: 'C1', text: 'Notwithstanding the considerable investment, the returns have been negligible, prompting stakeholders to reconsider the initiative.', q: 'What are stakeholders doing?', opts: ['Celebrating success','Reconsidering the project','Investing more','Ignoring the results'], answer: 1 },
  ],
  speaking: [
    { level: 'A1', prompt: 'Say this sentence out loud: "My name is ___ and I am learning English."' },
    { level: 'A2', prompt: 'Describe your daily routine in 2-3 sentences.' },
    { level: 'B1', prompt: 'Talk about a place you visited recently and what you liked about it.' },
    { level: 'B2', prompt: 'Explain a current event or news story you know about.' },
    { level: 'C1', prompt: 'Argue for or against this statement: "AI will replace teachers in the future."' },
  ],
};

const SKILLS = ['reading', 'writing', 'listening', 'speaking'];
const SKILL_ICONS = { reading: BookOpen, writing: PenTool, listening: Headphones, speaking: Mic };
const LEVELS_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function determineLevelFromScore(correctCount, total) {
  const ratio = correctCount / total;
  if (ratio >= 0.9) return 'C1';
  if (ratio >= 0.7) return 'B2';
  if (ratio >= 0.5) return 'B1';
  if (ratio >= 0.3) return 'A2';
  return 'A1';
}

export default function PlacementScreen() {
  const { colors: C } = useTheme();
  const router = useRouter();

  const [phase, setPhase] = useState('intro'); // intro, testing, results
  const [currentSkill, setCurrentSkill] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [writingInput, setWritingInput] = useState('');
  const [scores, setScores] = useState({ reading: 0, writing: 0, listening: 0, speaking: 0 });
  const [totals, setTotals] = useState({ reading: 0, writing: 0, listening: 0, speaking: 0 });
  const [loading, setLoading] = useState(false);

  const skill = SKILLS[currentSkill];
  const questions = TEST_BANK[skill] || [];
  const question = questions[currentQ];

  const playListening = useCallback(() => {
    if (skill === 'listening' && question?.text) {
      Speech.speak(question.text, { language: 'en-US', rate: 0.85 });
    }
  }, [skill, currentQ]);

  const handleMCAnswer = (idx) => {
    setSelectedAnswer(idx);
    const correct = idx === question.answer;
    if (correct) { hapticSuccess(); } else { hapticError(); }

    setTimeout(() => {
      setScores(prev => ({ ...prev, [skill]: prev[skill] + (correct ? 1 : 0) }));
      setTotals(prev => ({ ...prev, [skill]: prev[skill] + 1 }));
      advance();
    }, 600);
  };

  const handleWritingSubmit = () => {
    const words = writingInput.trim().split(/\s+/).length;
    const meetsMin = words >= (question.minWords || 3);
    const hasGrammar = writingInput.includes('.') || writingInput.includes('!');
    const score = meetsMin ? (hasGrammar ? 1 : 0.5) : 0;

    setScores(prev => ({ ...prev, [skill]: prev[skill] + score }));
    setTotals(prev => ({ ...prev, [skill]: prev[skill] + 1 }));
    setWritingInput('');
    if (score > 0) hapticSuccess(); else hapticError();
    advance();
  };

  const handleSpeakingDone = (selfRating) => {
    // Self-assessment for speaking (until we have speech recognition)
    setScores(prev => ({ ...prev, [skill]: prev[skill] + selfRating }));
    setTotals(prev => ({ ...prev, [skill]: prev[skill] + 1 }));
    advance();
  };

  const advance = () => {
    setSelectedAnswer(null);
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else if (currentSkill + 1 < SKILLS.length) {
      setCurrentSkill(currentSkill + 1);
      setCurrentQ(0);
    } else {
      setPhase('results');
      feedbackForScore(90);
    }
  };

  const saveResults = async () => {
    const levels = {};
    for (const s of SKILLS) {
      levels[s] = determineLevelFromScore(scores[s], totals[s] || 1);
    }
    // Overall = average
    const avgIdx = Math.round(SKILLS.reduce((sum, s) => sum + LEVELS_ORDER.indexOf(levels[s]), 0) / SKILLS.length);
    levels.overall = LEVELS_ORDER[Math.min(avgIdx, LEVELS_ORDER.length - 1)];

    await AsyncStorage.setItem('skillLevels', JSON.stringify(levels));
    await AsyncStorage.setItem('placementComplete', 'true');

    // Also update main profile level
    const profile = JSON.parse(await AsyncStorage.getItem('userProfile') || '{}');
    profile.level = levels.overall;
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));

    router.back();
  };

  const SkillIcon = SKILL_ICONS[skill] || BookOpen;

  // ═══ INTRO ═══
  if (phase === 'intro') {
    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60, alignItems: 'center' }}>
          <MascotHeader message="I'll test your English level across 4 skills. It takes about 5 minutes!" />

          <GlassCard style={{ marginTop: 24, width: '100%' }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, textAlign: 'center', marginBottom: 12 }}>Placement Test</Text>
            <Text style={{ fontSize: 14, color: C.textSec, textAlign: 'center', lineHeight: 22, marginBottom: 20 }}>
              This test will assess your Reading, Writing, Listening, and Speaking skills to place you at the right CEFR level.
            </Text>

            {SKILLS.map((s, i) => {
              const Icon = SKILL_ICONS[s];
              return (
                <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: C.border + '20' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: (C.cyan || '#00E5FF') + '15', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={C.cyan || '#00E5FF'} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: C.text, textTransform: 'capitalize' }}>{s}</Text>
                    <Text style={{ fontSize: 12, color: C.textMuted }}>5 questions</Text>
                  </View>
                </View>
              );
            })}
          </GlassCard>

          <NeonButton title="Start Test" onPress={() => setPhase('testing')} style={{ marginTop: 24, width: '100%' }}
            icon={<ArrowRight size={18} color="#000" />} />
        </ScrollView>
      </ScreenBackground>
    );
  }

  // ═══ RESULTS ═══
  if (phase === 'results') {
    const levels = {};
    for (const s of SKILLS) {
      levels[s] = determineLevelFromScore(scores[s], totals[s] || 1);
    }
    const avgIdx = Math.round(SKILLS.reduce((sum, s) => sum + LEVELS_ORDER.indexOf(levels[s]), 0) / SKILLS.length);
    levels.overall = LEVELS_ORDER[Math.min(avgIdx, LEVELS_ORDER.length - 1)];

    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60, alignItems: 'center' }}>
          <MascotHeader message="Great job! Here are your results! 🎉" />

          <GlassCard style={{ marginTop: 24, width: '100%', alignItems: 'center' }}>
            <Award size={48} color={C.cyan || '#00E5FF'} style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 }}>Your Level</Text>
            <View style={{ backgroundColor: (C.cyan || '#00E5FF') + '20', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: (C.cyan || '#00E5FF') + '40', marginBottom: 20 }}>
              <Text style={{ fontSize: 32, fontWeight: '900', color: C.cyan || '#00E5FF' }}>{levels.overall}</Text>
            </View>

            {SKILLS.map((s) => {
              const Icon = SKILL_ICONS[s];
              const pct = totals[s] > 0 ? Math.round((scores[s] / totals[s]) * 100) : 0;
              return (
                <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.border + '20', width: '100%' }}>
                  <Icon size={20} color={C.purple || '#B06CFF'} />
                  <Text style={{ fontSize: 15, fontWeight: '600', color: C.text, flex: 1, textTransform: 'capitalize' }}>{s}</Text>
                  <View style={{ backgroundColor: (C.emerald || '#00E5A0') + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.emerald || '#00E5A0' }}>{levels[s]}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: C.textMuted, width: 40, textAlign: 'right' }}>{pct}%</Text>
                </View>
              );
            })}
          </GlassCard>

          <NeonButton title="Save & Continue" onPress={saveResults} style={{ marginTop: 24, width: '100%' }}
            icon={<CheckCircle size={18} color="#000" />} />
        </ScrollView>
      </ScreenBackground>
    );
  }

  // ═══ TESTING ═══
  const progress = ((currentSkill * 5 + currentQ) / 20) * 100;

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        {/* Progress */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <SkillIcon size={16} color={C.cyan || '#00E5FF'} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, textTransform: 'capitalize' }}>{skill}</Text>
            </View>
            <Text style={{ fontSize: 12, color: C.textMuted }}>Q{currentQ + 1}/5 • {Math.round(progress)}%</Text>
          </View>
          <View style={{ height: 4, backgroundColor: C.border + '30', borderRadius: 2 }}>
            <View style={{ height: 4, backgroundColor: C.cyan || '#00E5FF', borderRadius: 2, width: `${progress}%` }} />
          </View>
        </View>

        {/* READING / LISTENING (Multiple Choice) */}
        {(skill === 'reading' || skill === 'listening') && question && (
          <GlassCard>
            {skill === 'listening' && (
              <NeonButton title="🔊 Listen" onPress={playListening} size="small"
                style={{ marginBottom: 16, alignSelf: 'center' }} />
            )}
            <Text style={{ fontSize: 16, fontWeight: '600', color: C.text, lineHeight: 24, marginBottom: 16 }}>{question.q}</Text>
            {question.opts.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = selectedAnswer !== null && i === question.answer;
              const isWrong = isSelected && i !== question.answer;
              return (
                <TouchableOpacity key={i} disabled={selectedAnswer !== null}
                  style={{
                    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8,
                    backgroundColor: isCorrect ? (C.emerald || '#00E5A0') + '20' : isWrong ? (C.red || '#FF4D6A') + '20' : C.inputBg || C.bg,
                    borderWidth: 1, borderColor: isCorrect ? C.emerald || '#00E5A0' : isWrong ? C.red || '#FF4D6A' : C.border + '40',
                  }}
                  onPress={() => handleMCAnswer(i)}>
                  <Text style={{ fontSize: 15, color: isCorrect ? C.emerald : isWrong ? C.red : C.text }}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </GlassCard>
        )}

        {/* WRITING */}
        {skill === 'writing' && question && (
          <GlassCard>
            <Text style={{ fontSize: 16, fontWeight: '600', color: C.text, lineHeight: 24, marginBottom: 4 }}>{question.prompt}</Text>
            <Text style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Min {question.minWords} words</Text>
            <TextInput
              style={{ backgroundColor: C.inputBg || C.bg, borderRadius: 12, padding: 14, fontSize: 16, color: C.text, borderWidth: 1, borderColor: C.border + '40', minHeight: 100, textAlignVertical: 'top', marginBottom: 12 }}
              placeholder="Write here..." placeholderTextColor={C.textMuted}
              value={writingInput} onChangeText={setWritingInput} multiline autoCapitalize="sentences"
            />
            <Text style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{writingInput.trim().split(/\s+/).filter(Boolean).length} words</Text>
            <NeonButton title="Submit" onPress={handleWritingSubmit}
              disabled={writingInput.trim().split(/\s+/).filter(Boolean).length < 2}
              icon={<ArrowRight size={16} color="#000" />} size="medium" />
          </GlassCard>
        )}

        {/* SPEAKING (self-assessment until dev build with speech recognition) */}
        {skill === 'speaking' && question && (
          <GlassCard>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Mic size={18} color={C.purple || '#B06CFF'} />
              <Text style={{ fontSize: 12, color: C.textMuted }}>Read aloud or respond verbally</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: C.text, lineHeight: 24, marginBottom: 20 }}>{question.prompt}</Text>
            <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginBottom: 16 }}>How well could you express this?</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => handleSpeakingDone(0.2)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: (C.red || '#FF4D6A') + '15', borderWidth: 1, borderColor: (C.red || '#FF4D6A') + '30', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.red || '#FF4D6A' }}>Struggled</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSpeakingDone(0.6)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: (C.amber || '#FFBE0B') + '15', borderWidth: 1, borderColor: (C.amber || '#FFBE0B') + '30', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.amber || '#FFBE0B' }}>Okay</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSpeakingDone(1)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: (C.emerald || '#00E5A0') + '15', borderWidth: 1, borderColor: (C.emerald || '#00E5A0') + '30', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.emerald || '#00E5A0' }}>Confident</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}
