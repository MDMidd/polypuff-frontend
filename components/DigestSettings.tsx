/**
 * DigestSettings.tsx
 *
 * WHERE THIS FILE GOES:
 *   D:\Project\MyProject\translation-trainer-frontend\components\DigestSettings.tsx
 *
 * WHAT IT DOES:
 *   A self-contained settings card for the weekly email digest.
 *   Drop it into your Settings screen like this:
 *
 *     import DigestSettings from '../components/DigestSettings';
 *     <DigestSettings />
 *
 * FEATURES:
 *   - Toggle to enable / disable the weekly digest
 *   - Email input that saves to AsyncStorage
 *   - "Send Now" button for immediate test send
 *   - Shows last sent date
 *   - Fully dark-mode aware via ThemeContext
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Send, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { sendDigestNow } from '../services/digestService';
import { scaledFont } from '../utils/accessibility';

export default function DigestSettings() {
  const { colors: C } = useTheme();

  const [enabled,     setEnabled]     = useState(false);
  const [email,       setEmail]       = useState('');
  const [lastSent,    setLastSent]    = useState<string | null>(null);
  const [sending,     setSending]     = useState(false);
  const [justSent,    setJustSent]    = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const [en, em, ls] = await Promise.all([
      AsyncStorage.getItem('digestEnabled'),
      AsyncStorage.getItem('digestEmail'),
      AsyncStorage.getItem('digestLastSent'),
    ]);
    setEnabled(en === 'true');
    setEmail(em || '');
    setLastSent(ls || null);
  };

  const toggleEnabled = async (val: boolean) => {
    setEnabled(val);
    await AsyncStorage.setItem('digestEnabled', val ? 'true' : 'false');
  };

  const saveEmail = async () => {
    await AsyncStorage.setItem('digestEmail', email.trim());
  };

  const handleSendNow = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address before sending.');
      return;
    }
    setSending(true);
    const result = await sendDigestNow(trimmed);
    setSending(false);
    if (result.success) {
      setJustSent(true);
      setLastSent(new Date().toISOString());
      setTimeout(() => setJustSent(false), 4000);
    } else {
      Alert.alert('Send Failed', result.error || 'Could not send the digest. Please try again.');
    }
  };

  const lastSentLabel = lastSent
    ? new Date(lastSent).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : 'Never sent';

  return (
    <View style={{
      backgroundColor: C.card || '#111827',
      borderRadius: 14, padding: 16, marginBottom: 12,
      borderWidth: 1,
      borderColor: enabled ? (C.cyan || '#00D9FF') + '30' : (C.border || '#374151') + '20',
    }}>
      {/* Header row with toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Mail size={18} color={C.cyan || '#00D9FF'} style={{ marginRight: 8 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: scaledFont(15), fontWeight: '700', color: C.text }}>
            Weekly Email Digest
          </Text>
          <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginTop: 1 }}>
            Your progress summary, every Monday
          </Text>
        </View>

        {/* Toggle switch */}
        <TouchableOpacity
          style={{
            width: 48, height: 26, borderRadius: 13,
            backgroundColor: enabled ? (C.cyan || '#00D9FF') : (C.border || '#374151'),
            justifyContent: 'center',
            paddingHorizontal: 2,
          }}
          onPress={() => toggleEnabled(!enabled)}
          accessibilityRole="switch"
          accessibilityLabel={`Weekly digest ${enabled ? 'enabled' : 'disabled'}`}
          accessibilityState={{ checked: enabled }}
        >
          <View style={{
            width: 22, height: 22, borderRadius: 11,
            backgroundColor: '#fff',
            alignSelf: enabled ? 'flex-end' : 'flex-start',
          }} />
        </TouchableOpacity>
      </View>

      {/* Email input — always shown, not just when enabled */}
      <Text style={{ fontSize: scaledFont(11), fontWeight: '600', color: C.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>
        EMAIL ADDRESS
      </Text>
      <TextInput
        style={{
          backgroundColor: C.bg || '#0A0E1A',
          borderRadius: 10, padding: 12,
          fontSize: scaledFont(14), color: C.text,
          borderWidth: 1, borderColor: (C.border || '#374151') + '40',
          marginBottom: 10,
        }}
        placeholder="your@email.com"
        placeholderTextColor={C.textMuted}
        value={email}
        onChangeText={setEmail}
        onBlur={saveEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Email address for weekly digest"
      />

      {/* Last sent + send now row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ flex: 1, fontSize: scaledFont(11), color: C.textMuted }}>
          Last sent: {lastSentLabel}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: justSent
              ? (C.emerald || '#10B981') + '15'
              : (C.cyan || '#00D9FF') + '15',
            borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14,
            borderWidth: 1,
            borderColor: justSent
              ? (C.emerald || '#10B981') + '40'
              : (C.cyan || '#00D9FF') + '40',
            minHeight: 36,
            opacity: sending ? 0.7 : 1,
          }}
          onPress={handleSendNow}
          disabled={sending}
          accessibilityRole="button"
          accessibilityLabel={sending ? 'Sending digest' : 'Send weekly digest now'}
          accessibilityState={{ busy: sending }}
        >
          {sending ? (
            <ActivityIndicator size="small" color={C.cyan || '#00D9FF'} />
          ) : justSent ? (
            <CheckCircle size={14} color={C.emerald || '#10B981'} />
          ) : (
            <Send size={14} color={C.cyan || '#00D9FF'} />
          )}
          <Text style={{
            fontSize: scaledFont(13), fontWeight: '700',
            color: justSent ? (C.emerald || '#10B981') : (C.cyan || '#00D9FF'),
          }}>
            {sending ? 'Sending…' : justSent ? 'Sent!' : 'Send Now'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info blurb when enabled */}
      {enabled && (
        <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginTop: 10, lineHeight: 16 }}>
          You'll receive a summary every Monday with your scores, streak, XP, and top areas to improve.
          To unsubscribe, toggle this off.
        </Text>
      )}
    </View>
  );
}
