import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { MessageSquare, Bug, Lightbulb, X, Send, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getServerUrl } from '../services/api';
import { scaledFont } from '../utils/accessibility';


const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

interface Props {
  visible: boolean;
  exerciseName: string;
  onDismiss: (dontShowAgain: boolean) => void;
  onSent: (dontShowAgain: boolean) => void;
}

export default function FeedbackNudgeModal({ visible, exerciseName, onDismiss, onSent }: Props) {
  const { colors: C } = useTheme();
  const { wt } = useLanguage();

  const categories = [
    { id: 'feedback' as const, label: wt('nudge-category-feedback'), Icon: MessageSquare },
    { id: 'bug'      as const, label: wt('nudge-category-bug'),      Icon: Bug           },
    { id: 'idea'     as const, label: wt('nudge-category-idea'),     Icon: Lightbulb     },
  ];

  const [category, setCategory] = useState<'feedback' | 'bug' | 'idea'>('feedback');
  const [message, setMessage]   = useState('');
  const [email, setEmail]       = useState('');
  const [userName, setUserName] = useState('');
  const [dontShow, setDontShow] = useState(false);
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');

  // Prefill email/name when the modal opens
  useEffect(() => {
    if (!visible) return;
    Promise.all([
      AsyncStorage.getItem('userProfile'),
      AsyncStorage.getItem('authIdentifier'),
      AsyncStorage.getItem('digestEmail'),
    ]).then(([profileRaw, authIdentifier, digestEmail]) => {
      if (profileRaw) {
        const p = JSON.parse(profileRaw);
        setUserName(p.name || '');
        const pEmail = p.email || p.userEmail || p.authIdentifier || '';
        if (pEmail) setEmail(pEmail);
      }
      const fallback = [authIdentifier, digestEmail].find(v => v && v.includes('@'));
      if (fallback) setEmail(cur => cur || fallback);
    }).catch(() => {});
  }, [visible]);

  const resetForm = () => {
    setCategory('feedback');
    setMessage('');
    setDontShow(false);
    setSent(false);
    setError('');
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss(dontShow);
  };

  const handleSend = async () => {
    const trimmed = message.trim();
    if (trimmed.length < MESSAGE_MIN) {
      setError(`Please write at least ${MESSAGE_MIN} characters.`);
      return;
    }
    setError('');
    setSending(true);
    try {
      const BASE = await getServerUrl();
      const res = await fetch(`${BASE}/api/feedback`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message:    trimmed,
          email:      email.trim() || null,
          userName:   userName || 'Anonymous',
          source:     `mobile-nudge-${exerciseName}`,
          platform:   Platform.OS,
          appVersion: Constants.expoConfig?.version || 'unknown',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
      } else {
        setError(data.error || 'Could not send. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    }
    setSending(false);
  };

  const handleAfterSent = () => {
    resetForm();
    onSent(dontShow);
  };

  const canSend = message.trim().length >= MESSAGE_MIN && !sending;

  const cyan      = C.cyan      || '#00E5FF';
  const card      = C.card      || '#121829';
  const bg        = C.bg        || '#0A0E1A';
  const textColor = C.text      || '#F0F4FF';
  const muted     = C.textMuted || '#888';
  const border    = C.border    || '#333';
  const emerald   = C.emerald   || '#00E5A0';
  const red       = C.red       || '#FF4D6A';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleDismiss}
      accessibilityViewIsModal
    >
      {/* Backdrop — tap outside closes */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'center', alignItems: 'center', padding: 20 }}
        activeOpacity={1}
        onPress={handleDismiss}
        accessible={false}
      >
        {/* Dialog — stops tap propagation to backdrop */}
        <TouchableWithoutFeedback>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : undefined}
            style={{
              width: '100%',
              maxWidth: 440,
              backgroundColor: card,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: cyan + '30',
              overflow: 'hidden',
            }}
          >
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

              {/* ── Header ─────────────────────────────────────────────── */}
              <View style={{ padding: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: scaledFont(18), fontWeight: '800', color: textColor }}>
                    {wt('nudge-title')}
                  </Text>
                  <Text style={{ fontSize: scaledFont(13), color: muted, marginTop: 4, lineHeight: 18 }}>
                    {wt('nudge-subtitle')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleDismiss}
                  style={{ marginLeft: 8, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                  accessibilityRole="button"
                  accessibilityLabel="Close feedback dialog"
                >
                  <X size={20} color={muted} />
                </TouchableOpacity>
              </View>

              {sent ? (
                /* ── Success state ─────────────────────────────────────── */
                <View style={{ alignItems: 'center', paddingHorizontal: 20, paddingBottom: 28 }}>
                  <CheckCircle size={48} color={emerald} style={{ marginBottom: 12 }} />
                  <Text style={{ fontSize: scaledFont(18), fontWeight: '800', color: textColor, marginBottom: 6 }}>
                    {wt('nudge-thank-you')}
                  </Text>
                  <Text style={{ fontSize: scaledFont(14), color: muted, textAlign: 'center', lineHeight: 20, marginBottom: 20 }}>
                    {wt('nudge-thank-you-sub')}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: cyan, borderRadius: 14,
                      paddingVertical: 12, paddingHorizontal: 28, minHeight: 44,
                    }}
                    onPress={handleAfterSent}
                    accessibilityRole="button"
                    accessibilityLabel={wt('nudge-continue')}
                  >
                    <Text style={{ fontSize: scaledFont(15), fontWeight: '700', color: '#000' }}>
                      {wt('nudge-continue')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* ── Form ──────────────────────────────────────────────── */
                <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>

                  {/* Category tabs */}
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                    {categories.map(({ id, label, Icon }) => {
                      const active = category === id;
                      return (
                        <TouchableOpacity
                          key={id}
                          style={{
                            flex: 1, alignItems: 'center', justifyContent: 'center',
                            paddingVertical: 10, borderRadius: 12, minHeight: 52,
                            backgroundColor: active ? cyan + '18' : bg,
                            borderWidth: 1.5,
                            borderColor: active ? cyan + '60' : border + '50',
                          }}
                          onPress={() => setCategory(id)}
                          accessibilityRole="tab"
                          accessibilityLabel={label}
                          accessibilityState={{ selected: active }}
                        >
                          <Icon size={16} color={active ? cyan : muted} />
                          <Text style={{
                            fontSize: scaledFont(11), fontWeight: '700',
                            color: active ? cyan : muted, marginTop: 4,
                          }}>
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Message */}
                  <TextInput
                    style={{
                      backgroundColor: bg, borderRadius: 12, padding: 12,
                      fontSize: scaledFont(15), color: textColor, borderWidth: 1,
                      borderColor: border + '50', minHeight: 100, textAlignVertical: 'top',
                      marginBottom: 4,
                    }}
                    placeholder={wt('nudge-placeholder')}
                    placeholderTextColor={muted}
                    value={message}
                    onChangeText={t => { setMessage(t); if (error) setError(''); }}
                    multiline
                    maxLength={MESSAGE_MAX}
                    autoCapitalize="sentences"
                    accessibilityLabel="Your feedback message"
                    accessibilityHint="Minimum 10 characters"
                  />
                  {error ? (
                    <Text style={{ fontSize: scaledFont(11), color: red, marginBottom: 8, paddingHorizontal: 2 }}>
                      {error}
                    </Text>
                  ) : (
                    <Text style={{ fontSize: scaledFont(11), color: muted, textAlign: 'right', marginBottom: 8 }}>
                      {message.length}/{MESSAGE_MAX}
                    </Text>
                  )}

                  {/* Email */}
                  <TextInput
                    style={{
                      backgroundColor: bg, borderRadius: 12, padding: 12,
                      fontSize: scaledFont(15), color: textColor, borderWidth: 1,
                      borderColor: border + '50', minHeight: 44, marginBottom: 14,
                    }}
                    placeholder={wt('nudge-email-placeholder')}
                    placeholderTextColor={muted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Your email address, optional"
                  />

                  {/* Don't show again */}
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16, minHeight: 44 }}
                    onPress={() => setDontShow(v => !v)}
                    accessibilityRole="checkbox"
                    accessibilityLabel="Don't show again"
                    accessibilityState={{ checked: dontShow }}
                  >
                    <View style={{
                      width: 20, height: 20, borderRadius: 4, borderWidth: 2,
                      borderColor: dontShow ? cyan : muted,
                      backgroundColor: dontShow ? cyan + '20' : 'transparent',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      {dontShow && (
                        <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: cyan }} />
                      )}
                    </View>
                    <Text style={{ fontSize: scaledFont(13), color: muted }}>
                      {wt('nudge-dont-show')}
                    </Text>
                  </TouchableOpacity>

                  {/* Action buttons */}
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1, alignItems: 'center', justifyContent: 'center',
                        paddingVertical: 12, borderRadius: 12, minHeight: 44,
                        backgroundColor: border + '20',
                        borderWidth: 1, borderColor: border + '40',
                      }}
                      onPress={handleDismiss}
                      accessibilityRole="button"
                      accessibilityLabel="Not now"
                    >
                      <Text style={{ fontSize: scaledFont(14), fontWeight: '600', color: muted }}>
                        {wt('nudge-not-now')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 2, flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'center', gap: 6, paddingVertical: 12,
                        borderRadius: 12, minHeight: 44,
                        backgroundColor: cyan, opacity: canSend ? 1 : 0.6,
                      }}
                      onPress={handleSend}
                      disabled={!canSend}
                      accessibilityRole="button"
                      accessibilityLabel={wt('nudge-send')}
                      accessibilityState={{ disabled: !canSend, busy: sending }}
                    >
                      {sending ? (
                        <ActivityIndicator color="#000" size="small" />
                      ) : (
                        <>
                          <Send size={14} color="#000" />
                          <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: '#000' }}>
                            {wt('nudge-send')}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                </View>
              )}

            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}
