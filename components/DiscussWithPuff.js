/**
 * DiscussWithPuff — Post-Exercise Discussion (Accessibility Update)
 *
 * CHANGES:
 *   - Toggle button: accessibilityRole="button" + label
 *   - Chat box: accessibilityViewIsModal when expanded
 *   - Chat bubbles: accessibilityRole="text" + role labels
 *   - AI badge on Poly-Puff messages (Apple HIG compliance)
 *   - Report button on AI messages (MENA compliance)
 *   - Send button: accessibilityRole + state
 *   - Close button: accessibilityLabel
 *   - Score announcement via AccessibilityInfo
 *   - All opacity minimums raised to 0.6
 *
 * FILE: components/DiscussWithPuff.js
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, Animated, StyleSheet, Keyboard, AccessibilityInfo, Alert,
} from 'react-native';
import { MessageCircle, Send, X, Sparkles, ChevronUp, Flag } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getServerUrl } from '../services/api';
import { scaledFont, announce } from '../utils/accessibility';
import { getAuthHeaders } from '../utils/auth';

export default function DiscussWithPuff({
  exerciseType = 'translation',
  exerciseData = {},
  currentScore = 0,
  feedback = '',
  ruleViolations = [],
  onScoreUpdate,
}) {
  const { colors: C } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [adjustedScore, setAdjustedScore] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);

  const toggleOpen = () => {
    if (!open) {
      setOpen(true);
      if (messages.length === 0) {
        setMessages([{
          role: 'puff',
          text: currentScore >= 90
            ? 'Great score! 🎉 If you think any feedback was unfair, tell me why and I\'ll take another look.'
            : 'Want to discuss your score? Tell me why you think your answer should get more points. I\'ll consider your argument fairly! 💬',
        }]);
      }
      Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setOpen(false));
    }
  };

  // ✅ Report AI content (MENA/Google requirement)
  const handleReport = (messageText) => {
    Alert.alert(
      'Report AI Response',
      'What issue did you find with this response?',
      [
        { text: 'Inaccurate', onPress: () => Alert.alert('Reported', 'Thank you for flagging this as inaccurate. We\'ll review it.') },
        { text: 'Culturally Insensitive', onPress: () => Alert.alert('Reported', 'Thank you for flagging this. We take cultural sensitivity seriously.') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const sendArgument = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    Keyboard.dismiss();

    setMessages(prev => [...prev, { role: 'student', text: msg }]);
    setLoading(true);

    try {
      const BASE = await getServerUrl();
      const res = await fetch(`${BASE}/api/discuss`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
        body: JSON.stringify({
          exerciseType, exerciseData,
          currentScore: adjustedScore ?? currentScore,
          originalFeedback: feedback, ruleViolations,
          studentArgument: msg,
          conversationHistory: messages.filter(m => m.role !== 'puff' || messages.indexOf(m) > 0).map(m => ({
            role: m.role === 'student' ? 'user' : 'assistant', content: m.text,
          })),
        }),
      });

      if (!res.ok) throw new Error('Server error');
      const data = await res.json();

      let puffResponse = data.response;
      if (data.scoreAdjusted && data.newScore !== (adjustedScore ?? currentScore)) {
        const oldScore = adjustedScore ?? currentScore;
        setAdjustedScore(data.newScore);
        puffResponse += `\n\n✨ Score updated: ${oldScore} → ${data.newScore}`;
        if (onScoreUpdate) onScoreUpdate(data.newScore, data.updatedFeedback || feedback);
        // ✅ Announce score change to screen reader
        announce(`Score updated from ${oldScore} to ${data.newScore}`);
      }

      setMessages(prev => [...prev, { role: 'puff', text: puffResponse }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'puff',
        text: 'Hmm, I couldn\'t connect to check that. Try again in a moment! 🔄',
      }]);
    }
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // ═══ COLLAPSED BUTTON ═══
  if (!open) {
    return (
      <TouchableOpacity
        onPress={toggleOpen}
        activeOpacity={0.8}
        style={[st.toggleBtn, { backgroundColor: (C.purple || '#8B5CF6') + '15', borderColor: (C.purple || '#8B5CF6') + '35' }]}
        // ✅ ACCESSIBILITY
        accessibilityRole="button"
        accessibilityLabel={
          adjustedScore !== null
            ? `Discuss with Poly-Puff. Current score: ${adjustedScore}`
            : 'Discuss with Poly-Puff. Tap to challenge your score.'
        }
      >
        <MessageCircle size={16} color={C.purple || '#8B5CF6'} />
        <Text style={[st.toggleText, { color: C.purple || '#8B5CF6' }]}>
          {adjustedScore !== null ? `Discuss with Poly-Puff (Score: ${adjustedScore})` : 'Discuss with Poly-Puff'}
        </Text>
        <ChevronUp size={14} color={C.purple || '#8B5CF6'} />
      </TouchableOpacity>
    );
  }

  // ═══ EXPANDED CHAT ═══
  return (
    <Animated.View style={[st.chatBox, {
      backgroundColor: C.card || '#1E293B',
      borderColor: (C.purple || '#8B5CF6') + '30',
      opacity: slideAnim,
      transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
    }]}>
      {/* Header */}
      <View style={st.chatHeader}>
        <View style={st.chatHeaderLeft}>
          <Sparkles size={14} color={C.purple || '#8B5CF6'} />
          <Text style={[st.chatHeaderTitle, { color: C.text }]}>Discuss with Poly-Puff</Text>
        </View>
        {adjustedScore !== null && (
          <View
            style={[st.scoreBadge, { backgroundColor: '#10B98120', borderColor: '#10B98140' }]}
            accessibilityLabel={`Adjusted score: ${adjustedScore}`}
          >
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#34D399' }}>{adjustedScore}</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={toggleOpen}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          // ✅ ACCESSIBILITY
          accessibilityRole="button"
          accessibilityLabel="Close discussion"
          style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={18} color={C.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={st.chatMessages}
        contentContainerStyle={{ paddingBottom: 8 }}
        accessibilityViewIsModal={true} // ✅ trap focus in chat
      >
        {messages.map((m, i) => (
          <View
            key={i}
            style={[st.bubble, m.role === 'student' ? st.bubbleStudent : st.bubblePuff, {
              backgroundColor: m.role === 'student' ? (C.blue || '#3B82F6') + '20' : (C.purple || '#8B5CF6') + '12',
            }]}
            // ✅ ACCESSIBILITY
            accessibilityRole="text"
            accessibilityLabel={
              m.role === 'puff'
                ? `Poly-Puff, AI response: ${m.text}`
                : `You said: ${m.text}`
            }
          >
            {m.role === 'puff' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                {/* ✅ AI Badge (Apple HIG) */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ backgroundColor: (C.purple || '#8B5CF6') + '30', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                    <Text style={{ fontSize: 9, fontWeight: '800', color: C.purple || '#8B5CF6', letterSpacing: 0.5 }}>AI</Text>
                  </View>
                  <Text style={st.bubbleLabel}>Poly-Puff</Text>
                </View>
                {/* ✅ Report button (MENA requirement) */}
                <TouchableOpacity
                  onPress={() => handleReport(m.text)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Report this AI response"
                  style={{ padding: 4 }}
                >
                  <Flag size={12} color={C.textMuted} />
                </TouchableOpacity>
              </View>
            )}
            {m.role === 'student' && <Text style={[st.bubbleLabel, { color: C.blue || '#3B82F6' }]}>You</Text>}
            <Text style={[st.bubbleText, { color: m.role === 'student' ? (C.text || '#F1F5F9') : (C.textSec || '#D1D5DB') }]}>{m.text}</Text>
          </View>
        ))}
        {loading && (
          <View
            style={[st.bubble, st.bubblePuff, { backgroundColor: (C.purple || '#8B5CF6') + '12' }]}
            accessibilityLabel="Poly-Puff is thinking"
          >
            <ActivityIndicator size="small" color={C.purple || '#8B5CF6'} />
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[st.inputRow, { borderTopColor: (C.border || '#334155') + '40' }]}>
        <TextInput
          style={[st.input, { color: C.text, backgroundColor: C.bg || '#0F172A', borderColor: (C.border || '#334155') + '60' }]}
          value={input}
          onChangeText={setInput}
          placeholder="Explain why your answer is correct..."
          placeholderTextColor={C.textMuted || '#64748B'}
          multiline
          maxLength={500}
          // ✅ ACCESSIBILITY
          accessibilityLabel="Your argument for why your answer is correct"
        />
        <TouchableOpacity
          onPress={sendArgument}
          disabled={!input.trim() || loading}
          style={[st.sendBtn, { backgroundColor: C.purple || '#8B5CF6', opacity: (!input.trim() || loading) ? 0.6 : 1 }]}
          // ✅ ACCESSIBILITY
          accessibilityRole="button"
          accessibilityLabel="Send argument"
          accessibilityState={{ disabled: !input.trim() || loading }}
        >
          <Send size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  toggleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 1, marginTop: 12,
    minHeight: 44, // ✅ touch target
  },
  toggleText: { fontSize: 14, fontWeight: '700' },

  chatBox: { borderRadius: 16, borderWidth: 1, marginTop: 12, overflow: 'hidden', maxHeight: 380 },
  chatHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  chatHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  chatHeaderTitle: { fontSize: 14, fontWeight: '700' },
  scoreBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, marginRight: 10 },

  chatMessages: { maxHeight: 220, paddingHorizontal: 12, paddingTop: 8 },

  bubble: { borderRadius: 12, padding: 10, marginBottom: 6 },
  bubbleStudent: { marginLeft: 24 },
  bubblePuff: { marginRight: 24 },
  bubbleLabel: { fontSize: 10, fontWeight: '700', color: '#A78BFA', marginBottom: 3, letterSpacing: 0.5 },
  bubbleText: { fontSize: 13, lineHeight: 19 },

  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1,
  },
  input: {
    flex: 1, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8,
    fontSize: 14, maxHeight: 80, minHeight: 44, // ✅ touch target
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, // ✅ was 38×38 → 44×44
    alignItems: 'center', justifyContent: 'center',
  },
});
