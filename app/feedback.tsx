/**
 * Feedback Screen - Poly-Puff
 * =============================
 *
 * FIX: Send button is now pinned OUTSIDE the ScrollView so it always stays
 * visible above the keyboard. Previously the button was inside the ScrollView
 * which meant it could scroll off-screen when the keyboard opened.
 *
 * Layout structure (fixed):
 *   <ScreenBackground>
 *     <BackHeader />
 *     <KeyboardAvoidingView flex:1>        ← pushes content up
 *       <ScrollView flex:1>               ← scrollable form fields
 *         ... category picker ...
 *         ... message input ...
 *         ... email input ...
 *                                          ← NO send button here anymore
 *       </ScrollView>
 *       <View (pinned footer)>            ← always visible above keyboard
 *         <Send Feedback button>
 *       </View>
 *     </KeyboardAvoidingView>
 *   </ScreenBackground>
 *
 * FILE: app/feedback.tsx
 * LOCATION: D:\Project\MyProject\translation-trainer-frontend\app\feedback.tsx
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import Constants from 'expo-constants';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {
  MessageSquare, Bug, Lightbulb, Send, CheckCircle, Paperclip, X,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenBackground, BackHeader } from '../components/PolyPuffUI';
import { getServerUrl } from '../services/api';
import { scaledFont } from '../utils/accessibility';

const CATEGORIES = [
  { id: 'general',  label: 'General Feedback', desc: 'Suggestions or comments',  icon: MessageSquare, color: 'cyan'  },
  { id: 'bug',      label: 'Bug Report',        desc: "Something isn't working",  icon: Bug,           color: 'red'   },
  { id: 'feature',  label: 'Feature Request',   desc: 'Ideas for new features',   icon: Lightbulb,     color: 'amber' },
];

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;
const MAX_SCREENSHOTS = 3;
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

type Screenshot = { uri: string; name: string; type: string };

export default function FeedbackScreen() {
  const { colors: C } = useTheme();
  const { wt } = useLanguage();

  const [category, setCategory] = useState('general');
  const [message,  setMessage]  = useState('');
  const [email,    setEmail]    = useState('');
  const [userName, setUserName] = useState('');
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);

  useFocusEffect(useCallback(() => {
    Promise.all([
      AsyncStorage.getItem('userProfile'),
      AsyncStorage.getItem('authIdentifier'),
      AsyncStorage.getItem('digestEmail'),
    ]).then(([profileRaw, authIdentifier, digestEmail]) => {
      if (profileRaw) {
        const p = JSON.parse(profileRaw);
        setUserName(p.name || '');
        const profileEmail = p.email || p.userEmail || p.authIdentifier || '';
        if (profileEmail) setEmail(profileEmail);
      }

      const fallbackEmail = [authIdentifier, digestEmail].find(v => v && v.includes('@'));
      if (fallbackEmail) setEmail(current => current || fallbackEmail);
    }).catch(() => {});
  }, []));

  const pickScreenshots = async () => {
    const remaining = MAX_SCREENSHOTS - screenshots.length;
    if (remaining <= 0) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to attach a screenshot.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: remaining > 1,
      selectionLimit: remaining,
      quality: 0.7,
    });
    if (result.canceled || !result.assets?.length) return;

    const accepted: Screenshot[] = [];
    let tooLarge = false;
    for (const asset of result.assets) {
      if (screenshots.length + accepted.length >= MAX_SCREENSHOTS) break;
      if (asset.fileSize && asset.fileSize > MAX_SCREENSHOT_BYTES) { tooLarge = true; continue; }
      accepted.push({
        uri: asset.uri,
        name: asset.fileName || `screenshot-${Date.now()}-${accepted.length}.jpg`,
        type: asset.mimeType || 'image/jpeg',
      });
    }
    if (tooLarge) Alert.alert('Screenshot too large', 'Each screenshot must be under 5MB.');
    if (accepted.length) setScreenshots(prev => [...prev, ...accepted].slice(0, MAX_SCREENSHOTS));
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    const trimmedEmail = email.trim();

    if (!trimmedMessage) {
      Alert.alert('Empty Message', 'Please write your feedback before sending.');
      return;
    }
    if (trimmedMessage.length < MESSAGE_MIN) {
      Alert.alert('Too Short', 'Please provide a bit more detail so we can help.');
      return;
    }

    setSending(true);
    try {
      const BASE = await getServerUrl();
      const formData = new FormData();
      formData.append('category', category);
      formData.append('message', trimmedMessage);
      if (trimmedEmail) formData.append('email', trimmedEmail);
      formData.append('userName', userName || 'Anonymous');
      formData.append('source', 'mobile-app');
      formData.append('platform', Platform.OS);
      formData.append('appVersion', Constants.expoConfig?.version || 'unknown');
      screenshots.forEach((s, i) => {
        // React Native's FormData expects a {uri, name, type} descriptor
        // rather than an actual File/Blob.
        formData.append('screenshots', { uri: s.uri, name: s.name, type: s.type } as any);
      });

      const res = await fetch(`${BASE}/api/feedback`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSent(true);
      } else {
        Alert.alert('Error', data.error || 'Could not send feedback. Please try again.');
      }
    } catch (e) {
      Alert.alert(
        'Connection Error',
        'Could not reach the server. Please check your internet connection and try again.'
      );
    }
    setSending(false);
  };

  const handleReset = () => {
    setCategory('general');
    setMessage('');
    setScreenshots([]);
    setSent(false);
  };

  const getColor = (colorName) => {
    const map = {
      cyan:  C.cyan  || '#00E5FF',
      red:   C.red   || '#FF4D6A',
      amber: C.amber || '#FFBE0B',
    };
    return map[colorName] || C.cyan;
  };

  const messageLength = message.length;
  const messageTooShort = messageLength > 0 && message.trim().length < MESSAGE_MIN;
  const messageNearLimit = messageLength > MESSAGE_MAX * 0.9;
  const canSend = message.trim().length >= MESSAGE_MIN && !sending;

  // ══════════════════════════════════════════════════════
  // SUCCESS SCREEN
  // ══════════════════════════════════════════════════════
  if (sent) {
    return (
      <ScreenBackground>
        <BackHeader title={wt('feedback')} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <CheckCircle size={64} color={C.emerald || '#00E5A0'} style={{ marginBottom: 20 }} />
          <Text style={{ fontSize: scaledFont(24), fontWeight: '800', color: C.text, textAlign: 'center', marginBottom: 8 }}>
            Thank You!
          </Text>
          <Text style={{ fontSize: scaledFont(15), color: C.textSec, textAlign: 'center', lineHeight: 22, marginBottom: 8 }}>
            Your feedback has been sent successfully.
          </Text>
          {email.trim() ? (
            <Text style={{ fontSize: scaledFont(13), color: C.textMuted, textAlign: 'center', lineHeight: 20 }}>
              We'll respond to {email.trim()} if needed.
            </Text>
          ) : (
            <Text style={{ fontSize: scaledFont(13), color: C.textMuted, textAlign: 'center', lineHeight: 20 }}>
              Since you didn't provide an email, we won't be able to respond directly.
            </Text>
          )}
          <TouchableOpacity
            style={{ backgroundColor: C.cyan || '#00E5FF', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, marginTop: 32, minHeight: 44 }}
            onPress={handleReset}
            accessibilityRole="button"
            accessibilityLabel="Send more feedback"
          >
            <Text style={{ fontSize: scaledFont(16), fontWeight: '700', color: '#000' }}>Send More Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  // ══════════════════════════════════════════════════════
  // FEEDBACK FORM
  // ══════════════════════════════════════════════════════
  return (
    <ScreenBackground>
      <BackHeader title={wt('feedback')} />

      {/*
        KeyboardAvoidingView wraps both the ScrollView AND the pinned footer.
        On iOS: behavior="padding" adds padding equal to keyboard height.
        On Android: behavior="height" shrinks the view height.
        keyboardVerticalOffset accounts for the BackHeader height (~56dp).
      */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 56 : 0}
      >

        {/* Scrollable form fields */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontSize: scaledFont(22), fontWeight: '800', color: C.text, marginBottom: 4 }}>
            Send Feedback
          </Text>
          <Text style={{ fontSize: scaledFont(13), color: C.textMuted, marginBottom: 20 }}>
            Help us improve Poly-Puff! Your feedback goes directly to the developer.
          </Text>

          {/* ── Category selector ─────────────────────────────────────── */}
          <Text
            style={{ fontSize: scaledFont(12), fontWeight: '700', color: C.textMuted, letterSpacing: 1, marginBottom: 10 }}
            accessibilityRole="header"
          >
            CATEGORY
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            {CATEGORIES.map(cat => {
              const active = category === cat.id;
              const color  = getColor(cat.color);
              const Icon   = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={{
                    flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14,
                    backgroundColor: active ? color + '18' : C.card,
                    borderWidth: 1.5,
                    borderColor: active ? color + '60' : C.border + '30',
                    minHeight: 44,
                  }}
                  onPress={() => setCategory(cat.id)}
                  accessibilityRole="tab"
                  accessibilityLabel={`${cat.label}: ${cat.desc}`}
                  accessibilityState={{ selected: active }}
                >
                  <Icon size={20} color={active ? color : C.textMuted} />
                  <Text style={{
                    fontSize: scaledFont(11), fontWeight: '700',
                    color: active ? color : C.textMuted,
                    marginTop: 6, textAlign: 'center',
                  }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Message input ─────────────────────────────────────────── */}
          <Text
            style={{ fontSize: scaledFont(12), fontWeight: '700', color: C.textMuted, letterSpacing: 1, marginBottom: 8 }}
            accessibilityRole="header"
          >
            YOUR MESSAGE
          </Text>
          <TextInput
            style={{
              backgroundColor: C.card, borderRadius: 14, padding: 16,
              fontSize: scaledFont(16), color: C.text, borderWidth: 1,
              borderColor: C.border + '40', minHeight: 140, textAlignVertical: 'top',
              marginBottom: 16,
            }}
            placeholder={
              category === 'bug'
                ? 'Describe what happened, what you expected, and any steps to reproduce the issue...'
                : category === 'feature'
                ? "Describe the feature you'd like and how it would help your learning..."
                : "Share your thoughts, suggestions, or anything you'd like us to know..."
            }
            placeholderTextColor={C.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={MESSAGE_MAX}
            autoCapitalize="sentences"
            accessibilityLabel={`Your ${CATEGORIES.find(c => c.id === category)?.label || 'feedback'} message`}
            accessibilityHint="Describe your feedback in detail"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -8, marginBottom: 16, paddingHorizontal: 4 }}>
            <Text style={{ fontSize: scaledFont(11), color: messageTooShort ? (C.red || '#FF4D6A') : C.textMuted }}>
              {messageTooShort ? `Please write at least ${MESSAGE_MIN} characters.` : ' '}
            </Text>
            <Text style={{ fontSize: scaledFont(11), color: messageNearLimit ? (C.amber || '#FFBE0B') : C.textMuted }}>
              {messageLength} / {MESSAGE_MAX}
            </Text>
          </View>

          {/* ── Email input ───────────────────────────────────────────── */}
          <Text
            style={{ fontSize: scaledFont(12), fontWeight: '700', color: C.textMuted, letterSpacing: 1, marginBottom: 8 }}
            accessibilityRole="header"
          >
            YOUR EMAIL (OPTIONAL)
          </Text>
          <TextInput
            style={{
              backgroundColor: C.card, borderRadius: 14, padding: 16,
              fontSize: scaledFont(16), color: C.text, borderWidth: 1,
              borderColor: C.border + '40', minHeight: 44, marginBottom: 8,
            }}
            placeholder="email@example.com"
            placeholderTextColor={C.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Your email address, optional"
            accessibilityHint="Provide your email if you'd like the developer to respond"
          />
          <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginBottom: 16, paddingHorizontal: 4 }}>
            Include your email if you'd like us to respond. We'll never share it or use it for marketing.
          </Text>

          {/* ── Screenshots ───────────────────────────────────────────── */}
          <Text
            style={{ fontSize: scaledFont(12), fontWeight: '700', color: C.textMuted, letterSpacing: 1, marginBottom: 8 }}
            accessibilityRole="header"
          >
            ATTACH SCREENSHOTS (OPTIONAL)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {screenshots.map((s, i) => (
              <View key={s.uri} style={{ width: 72, height: 72, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: C.border + '40' }}>
                <Image source={{ uri: s.uri }} style={{ width: '100%', height: '100%' }} />
                <TouchableOpacity
                  onPress={() => removeScreenshot(i)}
                  style={{
                    position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11,
                    backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center',
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove screenshot ${i + 1}`}
                >
                  <X size={13} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {screenshots.length < MAX_SCREENSHOTS && (
              <TouchableOpacity
                onPress={pickScreenshots}
                style={{
                  width: 72, height: 72, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: C.card, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border + '60',
                  minHeight: 44,
                }}
                accessibilityRole="button"
                accessibilityLabel="Add screenshot"
              >
                <Paperclip size={20} color={C.textMuted} />
                <Text style={{ fontSize: scaledFont(10), fontWeight: '600', color: C.textMuted, marginTop: 4 }}>
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginBottom: 16, paddingHorizontal: 4 }}>
            JPG, PNG, or WebP. Up to 3 images, 5MB each.
          </Text>

        </ScrollView>
        {/* End ScrollView */}

        {/*
          Pinned footer — lives OUTSIDE ScrollView but INSIDE KeyboardAvoidingView.
          This means it always floats just above the keyboard, no matter how far
          the user has scrolled or how tall the keyboard is.
        */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: Platform.OS === 'ios' ? 24 : 16,
            borderTopWidth: 1,
            borderTopColor: C.border + '30',
            backgroundColor: C.bg,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              gap: 8, backgroundColor: C.cyan || '#00E5FF', borderRadius: 14,
              paddingVertical: 16, minHeight: 54,
              opacity: !canSend ? 0.6 : 1,
            }}
            onPress={handleSend}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel={sending ? 'Sending feedback' : 'Send feedback'}
            accessibilityState={{ disabled: !canSend, busy: sending }}
          >
            {sending ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Send size={18} color="#000" />
                <Text style={{ fontSize: scaledFont(16), fontWeight: '700', color: '#000' }}>
                  Send Feedback
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
