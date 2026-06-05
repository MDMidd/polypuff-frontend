/**
 * FeedbackDashboard Component - v6.2 (Theme-aware)
 * ==================================================
 * Now uses useTheme() for dark/light mode support.
 * All other functionality identical to v6.
 * 
 * FILE: components/FeedbackDashboard.js
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  ScrollView, Animated, Dimensions,
} from 'react-native';
import {
  Volume2, VolumeX, CheckCircle, AlertTriangle, Info,
  Star, X, BookOpen, Award, ChevronRight, Headphones, User,
} from 'lucide-react-native';
import { speakCorrectVersion, speakStudentVersion, stopSpeaking } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function getScoreTheme(score, C) {
  if (score >= 90) return { primary: C.emerald, light: C.emeraldLight, dark: C.emeraldDark, label: 'Excellent' };
  if (score >= 70) return { primary: C.blue, light: C.blueLight, dark: C.blueDark || '#1E40AF', label: 'Good' };
  if (score >= 50) return { primary: C.amber, light: C.amberLight, dark: C.amberDark || '#92400E', label: 'OK' };
  return { primary: C.red, light: C.redLight || '#FCA5A5', dark: C.redDark || '#991B1B', label: 'Needs Work' };
}

// ── SCORE RING ──
const ScoreRing = ({ score, size = 120, C }) => {
  const [animValue] = useState(new Animated.Value(0));
  const theme = getScoreTheme(score, C);
  useEffect(() => { Animated.timing(animValue, { toValue: score, duration: 1200, useNativeDriver: false }).start(); }, [score]);
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size, marginBottom: 12 }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 4, borderColor: theme.dark + '40', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: size - 8, height: size - 8, borderRadius: (size - 8) / 2, borderWidth: 4, position: 'absolute', borderColor: theme.primary, borderTopColor: score >= 25 ? theme.primary : 'transparent', borderRightColor: score >= 50 ? theme.primary : 'transparent', borderBottomColor: score >= 75 ? theme.primary : 'transparent', borderLeftColor: score >= 100 ? theme.primary : 'transparent' }} />
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: size * 0.35, fontWeight: '800', color: theme.primary }}>{score}</Text>
          <Text style={{ fontSize: size * 0.1, fontWeight: '600', color: theme.light, textTransform: 'uppercase', letterSpacing: 1 }}>{theme.label}</Text>
        </View>
      </View>
    </View>
  );
};

// ── AUDIO BUTTONS ──
const AudioButtons = ({ correctText, studentText, C }) => {
  const [playingCorrect, setPlayingCorrect] = useState(false);
  const [playingStudent, setPlayingStudent] = useState(false);
  const handlePlayCorrect = async () => { await stopSpeaking(); setPlayingStudent(false); setPlayingCorrect(true); await speakCorrectVersion(correctText, { onDone: () => setPlayingCorrect(false), onError: () => setPlayingCorrect(false) }); };
  const handlePlayStudent = async () => { await stopSpeaking(); setPlayingCorrect(false); setPlayingStudent(true); await speakStudentVersion(studentText, { onDone: () => setPlayingStudent(false), onError: () => setPlayingStudent(false) }); };
  const handleStop = async () => { await stopSpeaking(); setPlayingCorrect(false); setPlayingStudent(false); };
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: playingCorrect ? C.emerald : C.border + '40' }} onPress={playingCorrect ? handleStop : handlePlayCorrect}>
        {playingCorrect ? <VolumeX size={20} color={C.emerald} /> : <Headphones size={20} color={C.emerald} />}
        <View style={{ flex: 1 }}><Text style={{ fontSize: 13, fontWeight: '600', color: C.emeraldLight }}>{playingCorrect ? 'Stop' : 'Listen to Native'}</Text><Text style={{ fontSize: 11, color: C.textMuted }}>Correct version</Text></View>
      </TouchableOpacity>
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: playingStudent ? C.purple : C.border + '40' }} onPress={playingStudent ? handleStop : handlePlayStudent}>
        {playingStudent ? <VolumeX size={20} color={C.purple} /> : <User size={20} color={C.purple} />}
        <View style={{ flex: 1 }}><Text style={{ fontSize: 13, fontWeight: '600', color: C.purpleLight || '#C4B5FD' }}>{playingStudent ? 'Stop' : 'Listen to Yourself'}</Text><Text style={{ fontSize: 11, color: C.textMuted }}>Your version</Text></View>
      </TouchableOpacity>
    </View>
  );
};

// ── INTERACTIVE SENTENCE ──
const InteractiveSentence = ({ wordAnalysis, ruleDetails, nativeLanguage, onWordPress, C }) => {
  if (!wordAnalysis || wordAnalysis.length === 0) return null;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
      {wordAnalysis.map((item, index) => {
        const isError = item.status === 'error';
        const isMissing = item.status === 'missing';
        const isExtra = item.status === 'extra';
        const isAlt = item.status === 'alternative';
        let color = C.text; let bg = 'transparent'; let decoration = 'none';
        if (isError) { color = C.amberLight; bg = (C.amberDark || '#92400E') + '30'; decoration = 'underline'; }
        if (isMissing) { color = C.textMuted; decoration = 'line-through'; }
        if (isExtra) { color = C.redLight || '#FCA5A5'; bg = (C.redDark || '#991B1B') + '20'; }
        if (isAlt) { color = C.blueLight; bg = (C.blueDark || '#1E40AF') + '20'; }
        return (
          <TouchableOpacity key={index} disabled={!isError && !isAlt} onPress={() => (isError || isAlt) && onWordPress(item)}>
            <Text style={{ fontSize: 17, paddingHorizontal: 3, paddingVertical: 2, borderRadius: 4, color, backgroundColor: bg, textDecorationLine: decoration, textDecorationColor: C.amber }}>{item.word}</Text>
          </TouchableOpacity>
        );
      })}
      <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 8, fontStyle: 'italic', width: '100%' }}>Tap highlighted words for details</Text>
    </View>
  );
};

// ── RULE POPOVER ──
const RulePopover = ({ rule, visible, onClose, nativeLanguage, C }) => {
  if (!rule) return null;
  const translation = rule.translations?.[nativeLanguage];
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 }} activeOpacity={1} onPress={onClose}>
        <View style={{ backgroundColor: C.card, borderRadius: 20, width: '100%', maxWidth: 400, maxHeight: '80%', borderWidth: 1, borderColor: C.amber + '40' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: C.border + '30' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}><BookOpen size={18} color={C.amber} /><Text style={{ fontSize: 17, fontWeight: '700', color: C.text, flex: 1 }}>{rule.sub_topic || rule.topic}</Text></View>
            <TouchableOpacity onPress={onClose}><X size={20} color={C.textMuted} /></TouchableOpacity>
          </View>
          <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.amber, backgroundColor: (C.amberDark || '#92400E') + '30', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>{rule.rule_id}</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>{rule.topic}</Text>
            </View>
            {rule.explanation && <View style={{ marginBottom: 16 }}><Text style={{ fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 6 }}>📖 Explanation</Text><Text style={{ fontSize: 15, color: C.text, lineHeight: 22 }}>{rule.explanation}</Text></View>}
            {rule.correct_example && <View style={{ marginBottom: 16 }}><Text style={{ fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 6 }}>✅ Correct</Text><View style={{ backgroundColor: C.cardAlt, borderRadius: 8, padding: 12, borderLeftWidth: 3, borderLeftColor: C.emerald }}><Text style={{ fontSize: 14, color: C.emeraldLight, fontStyle: 'italic' }}>{rule.correct_example}</Text></View></View>}
            {rule.incorrect_example && <View style={{ marginBottom: 16 }}><Text style={{ fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 6 }}>❌ Incorrect</Text><View style={{ backgroundColor: C.cardAlt, borderRadius: 8, padding: 12, borderLeftWidth: 3, borderLeftColor: C.red }}><Text style={{ fontSize: 14, color: C.redLight || '#FCA5A5', fontStyle: 'italic', textDecorationLine: 'line-through' }}>{rule.incorrect_example}</Text></View></View>}
            {translation && <View style={{ marginBottom: 16 }}><Text style={{ fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 6 }}>🌍 In {nativeLanguage}</Text><Text style={{ fontSize: 14, color: C.blueLight, lineHeight: 20 }}>{translation}</Text></View>}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// ============================================================================
// MAIN FEEDBACK DASHBOARD
// ============================================================================
const FeedbackDashboard = ({
  result, studentTranslation, correctTranslation, originalSentence,
  nativeLanguage, onNextPress, onChatPress,
}) => {
  const { colors: C } = useTheme();
  const [selectedRule, setSelectedRule] = useState(null);
  const [showPopover, setShowPopover] = useState(false);

  if (!result) return null;

  const { score = 0, feedback = '', mistakes = [], wordAnalysis = [], encouragement = '', ruleViolations = [], ruleDetails = {}, vocabBonus = null } = result;
  const theme = getScoreTheme(score, C);

  const handleWordPress = (wordItem) => {
    const ruleId = wordItem.rule_id || mistakes.find(m => m.found === wordItem.word || m.found === wordItem.correction)?.rule_id;
    if (ruleId && ruleDetails[ruleId]) { setSelectedRule(ruleDetails[ruleId]); setShowPopover(true); }
    else { setSelectedRule({ rule_id: 'AI', topic: 'Grammar', sub_topic: 'AI-Detected Error', explanation: wordItem.message || `"${wordItem.word}" should be "${wordItem.correction || '(check above)'}"`, correct_example: wordItem.correction || correctTranslation, incorrect_example: wordItem.word, translations: {} }); setShowPopover(true); }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg, padding: 16 }} showsVerticalScrollIndicator={false}>
      {/* SCORE */}
      <View style={{ alignItems: 'center', paddingVertical: 20, marginBottom: 16, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: theme.primary + '30' }}>
        {vocabBonus && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: (C.amberDark || '#92400E') + '30', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 8 }}><Star size={12} color={C.amberLight} /><Text style={{ fontSize: 12, color: C.amberLight, fontWeight: '600' }}>+{vocabBonus.points} Vocabulary Bonus!</Text></View>}
        <ScoreRing score={score} C={C} />
        <Text style={{ fontSize: 15, textAlign: 'center', marginHorizontal: 20, lineHeight: 22, color: C.textSec }}>{feedback}</Text>
        {encouragement ? <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>{encouragement}</Text> : null}
      </View>

      {/* TTS */}
      <AudioButtons correctText={correctTranslation} studentText={studentTranslation} C={C} />

      {/* INTERACTIVE SENTENCE */}
      {wordAnalysis.length > 0 && (
        <View style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border + '40' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Your Translation</Text>
          <InteractiveSentence wordAnalysis={wordAnalysis} ruleDetails={ruleDetails} nativeLanguage={nativeLanguage} onWordPress={handleWordPress} C={C} />
        </View>
      )}

      {/* CORRECT ANSWER */}
      <View style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border + '40' }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Correct Answer</Text>
        <Text style={{ fontSize: 17, color: C.emeraldLight, fontWeight: '500', lineHeight: 24 }}>{correctTranslation}</Text>
      </View>

      {/* MISTAKES */}
      {mistakes.length > 0 && (
        <View style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border + '40' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Mistakes ({mistakes.length})</Text>
          {mistakes.map((m, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border + '20' }} onPress={() => {
              if (m.rule_id && ruleDetails[m.rule_id]) { setSelectedRule(ruleDetails[m.rule_id]); setShowPopover(true); }
              else if (m.explanation) { setSelectedRule({ rule_id: 'AI', topic: m.type || 'Grammar', sub_topic: 'AI Feedback', explanation: m.explanation, correct_example: m.expected || '', incorrect_example: m.found || '', translations: {} }); setShowPopover(true); }
            }}>
              <View style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 4, backgroundColor: theme.dark + '30' }}><Text style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', color: theme.light }}>{m.type}</Text></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Text style={{ fontSize: 14, color: C.redLight || '#FCA5A5', textDecorationLine: 'line-through' }}>{m.found}</Text>
                  <Text style={{ fontSize: 14, color: C.textMuted }}> → </Text>
                  <Text style={{ fontSize: 14, color: C.emeraldLight, fontWeight: '600' }}>{m.expected}</Text>
                </View>
                {m.explanation && <Text style={{ fontSize: 13, color: C.textSec, marginTop: 4, lineHeight: 19 }}>{m.explanation}</Text>}
              </View>
              <ChevronRight size={16} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* DATABASE RULE VIOLATIONS */}
      {ruleViolations.length > 0 && (
        <View style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border + '40' }}>
          <View style={{ marginBottom: 8 }}><View style={{ backgroundColor: (C.amberDark || '#92400E') + '30', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' }}><Text style={{ fontSize: 12, color: C.amberLight, fontWeight: '600' }}>📚 Database Rules</Text></View></View>
          {ruleViolations.map((v, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border + '15' }} onPress={() => { if (ruleDetails[v.rule_id]) { setSelectedRule(ruleDetails[v.rule_id]); setShowPopover(true); } }}>
              <AlertTriangle size={14} color={C.amber} />
              <View style={{ flex: 1 }}><Text style={{ fontSize: 11, color: C.amber, fontWeight: '700' }}>{v.rule_id}</Text><Text style={{ fontSize: 13, color: C.textSec }}>{v.message}</Text></View>
              <ChevronRight size={14} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ACTION BUTTONS */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
        {onChatPress && (
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1, backgroundColor: (C.blueDark || '#1E40AF') + '30', borderColor: C.blue + '40' }} onPress={onChatPress}>
            <Info size={18} color={C.blue} /><Text style={{ fontSize: 15, fontWeight: '600', color: C.blueLight }}>Ask Poly-Puff</Text>
          </TouchableOpacity>
        )}
        {onNextPress && (
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1, backgroundColor: C.emeraldDark + '30', borderColor: C.emerald + '40' }} onPress={onNextPress}>
            <Award size={18} color={C.emerald} /><Text style={{ fontSize: 15, fontWeight: '600', color: C.emeraldLight }}>Next Sentence</Text>
          </TouchableOpacity>
        )}
      </View>

      <RulePopover rule={selectedRule} visible={showPopover} nativeLanguage={nativeLanguage} onClose={() => { setShowPopover(false); setSelectedRule(null); }} C={C} />
    </ScrollView>
  );
};

export default FeedbackDashboard;
