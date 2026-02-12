/**
 * Writing Mode Screen - Poly-Puff v6.2
 * =================================================
 * 
 * Free-form English writing practice with AI grading.
 * Students write essays/paragraphs on prompted or free topics
 * and receive detailed grammar, vocabulary, and structure feedback.
 * 
 * FILE: app/writing.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PenTool, Send, Zap, BookOpen, RotateCcw,
  CheckCircle, AlertTriangle, Star, ChevronDown, ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import SettingsButton from '../components/SettingsButton';
import { getServerUrl } from '../services/api';
import { feedbackForScore } from '../services/sounds';

const PROMPTS = [
  { id: 'free', label: '✍️ Free Writing', desc: 'Write about anything you want' },
  { id: 'daily', label: '📅 My Day', desc: 'Describe what you did today' },
  { id: 'opinion', label: '💭 Opinion', desc: 'Share your opinion on a topic' },
  { id: 'story', label: '📖 Short Story', desc: 'Write a short fictional story' },
  { id: 'email', label: '📧 Email', desc: 'Write a formal or informal email' },
  { id: 'describe', label: '🏞️ Description', desc: 'Describe a place, person, or thing' },
  { id: 'compare', label: '⚖️ Compare', desc: 'Compare two things (past vs. present, etc.)' },
  { id: 'future', label: '🔮 Future Plans', desc: 'Write about your plans or goals' },
];

const WORD_TARGETS = [
  { min: 30, max: 50, label: 'Short (30-50 words)' },
  { min: 50, max: 100, label: 'Medium (50-100 words)' },
  { min: 100, max: 200, label: 'Long (100-200 words)' },
];

export default function WritingScreen() {
  const { colors: C } = useTheme();

  const [level, setLevel] = useState('B1');
  const [selectedPrompt, setSelectedPrompt] = useState('free');
  const [selectedLength, setSelectedLength] = useState(1); // index into WORD_TARGETS
  const [essay, setEssay] = useState('');
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) { const p = JSON.parse(saved); if (p.level) setLevel(p.level); }
    } catch (e) {}
  };

  const wordCount = essay.trim().split(/\s+/).filter(w => w.length > 0).length;
  const target = WORD_TARGETS[selectedLength];
  const prompt = PROMPTS.find(p => p.id === selectedPrompt);

  const handleGrade = async () => {
    if (wordCount < 10) {
      Alert.alert('Too Short', 'Please write at least 10 words before submitting.');
      return;
    }
    setGrading(true);
    try {
      const response = await fetch(`${getServerUrl()}/api/grade-writing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essay: essay.trim(),
          level,
          promptType: selectedPrompt,
          targetWords: target,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setResult(data);
      feedbackForScore(data.overallScore || 0);
      // Save to history
      await saveWritingHistory(data);
    } catch (error) {
      Alert.alert('Error', 'Could not grade your writing. Make sure the server is running.');
    }
    setGrading(false);
  };

  const saveWritingHistory = async (data) => {
    try {
      const saved = await AsyncStorage.getItem('writingHistory');
      const history = saved ? JSON.parse(saved) : [];
      history.push({
        date: new Date().toISOString(),
        level,
        promptType: selectedPrompt,
        wordCount,
        score: data.overallScore || 0,
        essay: essay.trim().substring(0, 200), // Save first 200 chars
      });
      if (history.length > 100) history.shift();
      await AsyncStorage.setItem('writingHistory', JSON.stringify(history));
      // Add XP
      const xp = Math.round((data.overallScore || 0) / 100 * 30);
      const currentXP = parseInt(await AsyncStorage.getItem('totalXP') || '0', 10);
      await AsyncStorage.setItem('totalXP', String(currentXP + xp));
    } catch (e) {}
  };

  const handleReset = () => {
    setEssay('');
    setResult(null);
    setExpandedSection(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return C.emerald;
    if (score >= 60) return C.amber;
    return C.red;
  };

  // ── RESULT VIEW ──
  if (result) {
    const sections = [
      { key: 'grammar', title: '📝 Grammar', score: result.grammarScore, feedback: result.grammarFeedback, corrections: result.grammarCorrections },
      { key: 'vocabulary', title: '📚 Vocabulary', score: result.vocabularyScore, feedback: result.vocabularyFeedback },
      { key: 'structure', title: '🏗️ Structure', score: result.structureScore, feedback: result.structureFeedback },
      { key: 'coherence', title: '🔗 Coherence', score: result.coherenceScore, feedback: result.coherenceFeedback },
    ];

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <SettingsButton />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginTop: 10 }}>Writing Results</Text>
          <Text style={{ fontSize: 13, color: C.textSec, marginTop: 2, marginBottom: 16 }}>{wordCount} words • {level} level</Text>

          {/* Overall score */}
          <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: getScoreColor(result.overallScore) + '30' }}>
            <Text style={{ fontSize: 48, fontWeight: '800', color: getScoreColor(result.overallScore) }}>{result.overallScore}</Text>
            <Text style={{ fontSize: 14, color: C.textSec, marginTop: 4 }}>Overall Score</Text>
            {result.overallFeedback && <Text style={{ fontSize: 15, color: C.text, textAlign: 'center', marginTop: 12, lineHeight: 22 }}>{result.overallFeedback}</Text>}
          </View>

          {/* Category scores */}
          {sections.map(section => (
            <TouchableOpacity
              key={section.key}
              style={{ backgroundColor: C.card, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: C.border + '20', overflow: 'hidden' }}
              onPress={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
                <Text style={{ fontSize: 16 }}>{section.title.split(' ')[0]}</Text>
                <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: C.text }}>{section.title.split(' ').slice(1).join(' ')}</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', color: getScoreColor(section.score), marginRight: 8 }}>{section.score}</Text>
                {expandedSection === section.key ? <ChevronDown size={16} color={C.textMuted} /> : <ChevronRight size={16} color={C.textMuted} />}
              </View>
              {expandedSection === section.key && (
                <View style={{ paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: C.border + '15' }}>
                  {section.feedback && <Text style={{ fontSize: 14, color: C.textSec, lineHeight: 21, marginTop: 12 }}>{section.feedback}</Text>}
                  {section.corrections?.length > 0 && (
                    <View style={{ marginTop: 12 }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: C.textMuted, marginBottom: 8 }}>Corrections:</Text>
                      {section.corrections.map((c, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8, backgroundColor: C.cardAlt, borderRadius: 8, padding: 10 }}>
                          <AlertTriangle size={14} color={C.amber} style={{ marginTop: 2 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 13, color: C.redLight || '#FCA5A5', textDecorationLine: 'line-through' }}>{c.original}</Text>
                            <Text style={{ fontSize: 13, color: C.emeraldLight, fontWeight: '600', marginTop: 2 }}>{c.corrected}</Text>
                            {c.explanation && <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{c.explanation}</Text>}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Corrected version */}
          {result.correctedEssay && (
            <View style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: C.emerald + '20' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.textSec, marginBottom: 8 }}>✅ Corrected Version</Text>
              <Text style={{ fontSize: 15, color: C.emeraldLight, lineHeight: 23 }}>{result.correctedEssay}</Text>
            </View>
          )}

          {/* Actions */}
          <TouchableOpacity style={{ backgroundColor: C.emerald, borderRadius: 14, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }} onPress={handleReset}>
            <RotateCcw size={18} color="#fff" />
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>Write Again</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── WRITING VIEW ──
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <Text style={{ fontSize: 26, fontWeight: '800', color: C.text, marginTop: 10 }}>Writing Mode</Text>
          <Text style={{ fontSize: 13, color: C.textSec, marginTop: 2, marginBottom: 16 }}>Practice free-form English writing</Text>

          {/* Prompt selection */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 8 }}>Choose a topic</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {PROMPTS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={{
                  paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginRight: 8,
                  backgroundColor: selectedPrompt === p.id ? C.blue + '20' : C.card,
                  borderWidth: 1, borderColor: selectedPrompt === p.id ? C.blue : C.border + '30',
                }}
                onPress={() => setSelectedPrompt(p.id)}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: selectedPrompt === p.id ? C.blueLight : C.text }}>{p.label}</Text>
                <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{p.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Length selection */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 8 }}>Target length</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {WORD_TARGETS.map((t, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  flex: 1, paddingVertical: 12, paddingHorizontal: 6, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: selectedLength === i ? C.emerald + '20' : C.card,
                  borderWidth: 1, borderColor: selectedLength === i ? C.emerald : C.border + '30',
                }}
                onPress={() => setSelectedLength(i)}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: selectedLength === i ? C.emeraldLight : C.textMuted, textAlign: 'center' }}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Writing area */}
          <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border + '20' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 13, color: C.textMuted }}>{prompt?.desc}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: wordCount >= target.min ? C.emerald : C.textMuted }}>
                {wordCount}/{target.min}-{target.max}
              </Text>
            </View>

            {/* Word count progress bar */}
            <View style={{ height: 4, backgroundColor: C.cardAlt, borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
              <View style={{
                height: '100%', borderRadius: 2,
                width: `${Math.min((wordCount / target.max) * 100, 100)}%`,
                backgroundColor: wordCount >= target.min ? C.emerald : wordCount >= target.min * 0.5 ? C.amber : C.blue,
              }} />
            </View>

            <TextInput
              style={{
                backgroundColor: C.inputBg || C.bg, borderRadius: 12, padding: 14,
                fontSize: 16, color: C.text, borderWidth: 1, borderColor: C.border + '30',
                minHeight: 200, textAlignVertical: 'top', lineHeight: 24,
              }}
              placeholder={`Start writing here...\n\n${selectedPrompt === 'daily' ? 'Example: Today I woke up early and...' : selectedPrompt === 'opinion' ? 'Example: I believe that technology...' : selectedPrompt === 'email' ? 'Example: Dear Mr. Smith, I am writing to...' : 'Write anything in English...'}`}
              placeholderTextColor={C.textMuted}
              value={essay}
              onChangeText={setEssay}
              multiline
              autoCapitalize="sentences"
              autoCorrect={false}
            />
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
              backgroundColor: C.blue, borderRadius: 14, paddingVertical: 16, marginTop: 16,
              opacity: (wordCount < 10 || grading) ? 0.5 : 1,
            }}
            onPress={handleGrade}
            disabled={wordCount < 10 || grading}
          >
            {grading ? <ActivityIndicator color="#fff" /> : (<><Send size={18} color="#fff" /><Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>Grade My Writing</Text></>)}
          </TouchableOpacity>

          {wordCount > 0 && wordCount < 10 && (
            <Text style={{ fontSize: 12, color: C.amber, textAlign: 'center', marginTop: 8 }}>Write at least 10 words to submit</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
