/**
 * Settings Screen - Poly-Puff v6.2
 * ============================================
 * 
 * Centralizes all app preferences:
 *   - Server URL configuration
 *   - Sound & haptic toggles
 *   - Theme (linked to ThemeContext)
 *   - Cache management
 *   - Data management (clear progress, reset onboarding)
 *   - App info & version
 * 
 * FILE: app/settings.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, Switch, Alert, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Server, Volume2, VolumeX, Vibrate, Sun, Moon, Palette,
  Trash2, RefreshCw, Info, ExternalLink, ChevronRight,
  Wifi, WifiOff, BookOpen, Download, Shield, RotateCcw,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useMascot } from './_layout';
import { getServerUrl, setServerUrl, checkHealth } from '../services/api';
import {
  isSoundEnabled, setSoundEnabled,
  isHapticEnabled, setHapticEnabled,
} from '../services/sounds';

export default function SettingsScreen() {
  const { colors: C, isDark, toggleTheme } = useTheme();
  const mascotCtx = (() => { try { return useMascot(); } catch { return { mascotEnabled: true, setMascotEnabled: () => {} }; } })();

  // Server
  const [serverUrl, setServerUrlLocal] = useState(getServerUrl());
  const [serverStatus, setServerStatus] = useState(null); // null | 'ok' | 'error'
  const [testing, setTesting] = useState(false);

  // Sound & Haptics
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [hapticOn, setHapticOn] = useState(isHapticEnabled());

  // Cache info
  const [cacheSize, setCacheSize] = useState('...');

  useEffect(() => {
    testServer();
    estimateCache();
  }, []);

  const testServer = async () => {
    setTesting(true);
    try {
      const result = await checkHealth();
      setServerStatus(result.status === 'ok' ? 'ok' : 'error');
    } catch (e) {
      setServerStatus('error');
    }
    setTesting(false);
  };

  const saveServerUrl = async () => {
    const trimmed = serverUrl.trim();
    if (!trimmed.startsWith('http')) {
      Alert.alert('Invalid URL', 'Server URL must start with http:// or https://');
      return;
    }
    await setServerUrl(trimmed);
    setServerUrlLocal(trimmed);
    testServer();
  };

  const handleSoundToggle = async (val) => {
    setSoundOn(val);
    await setSoundEnabled(val);
  };

  const handleHapticToggle = async (val) => {
    setHapticOn(val);
    await setHapticEnabled(val);
  };

  const estimateCache = async () => {
    try {
      const keys = ['rulesCache_all_all', 'exerciseCache'];
      let total = 0;
      for (const key of keys) {
        const val = await AsyncStorage.getItem(key);
        if (val) total += val.length;
      }
      if (total > 1000000) setCacheSize(`${(total / 1048576).toFixed(1)} MB`);
      else if (total > 1000) setCacheSize(`${(total / 1024).toFixed(0)} KB`);
      else setCacheSize(`${total} bytes`);
    } catch (e) {
      setCacheSize('Unknown');
    }
  };

  const clearCache = () => {
    Alert.alert('Clear Cache', 'This removes cached rules and exercises. They will re-download next time you open the app.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        await AsyncStorage.multiRemove(['rulesCache_all_all', 'exerciseCache']);
        setCacheSize('0 bytes');
      }},
    ]);
  };

  const clearAllProgress = () => {
    Alert.alert('Clear All Progress', 'This will permanently delete ALL your exercise history, XP, badges, and streak data. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete Everything', style: 'destructive', onPress: async () => {
        await AsyncStorage.multiRemove([
          'mistakeHistory', 'totalXP', 'sessionHistory', 'completedChallenges',
        ]);
        Alert.alert('Done', 'All progress has been cleared.');
      }},
    ]);
  };

  const resetOnboarding = async () => {
    await AsyncStorage.removeItem('onboardingComplete');
    Alert.alert('Onboarding Reset', 'The welcome walkthrough will show next time you restart the app.');
  };

  const clearProfile = () => {
    Alert.alert('Clear Profile', 'This will remove your name, profession, hobbies, and profile picture. Language and level will be kept.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear Profile', style: 'destructive', onPress: async () => {
        const saved = await AsyncStorage.getItem('userProfile');
        if (saved) {
          const p = JSON.parse(saved);
          // Keep only language and level
          await AsyncStorage.setItem('userProfile', JSON.stringify({
            nativeLanguage: p.nativeLanguage, level: p.level,
          }));
        }
        await AsyncStorage.removeItem('profilePic');
        Alert.alert('Done', 'Profile info has been cleared.');
      }},
    ]);
  };

  // ── Section component ──
  const Section = ({ title, icon, children }) => (
    <View style={{ backgroundColor: C.card, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border + '15', overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, paddingBottom: 8 }}>
        {icon}
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const Row = ({ label, desc, right, onPress, danger }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: C.border + '10' }}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ fontSize: 15, color: danger ? C.red : C.text }}>{label}</Text>
        {desc && <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{desc}</Text>}
      </View>
      {right}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: C.text, marginTop: 10 }}>Settings</Text>
        <Text style={{ fontSize: 13, color: C.textSec, marginTop: 2, marginBottom: 20 }}>
          App preferences and data management
        </Text>

        {/* ── SERVER ── */}
        <Section title="Server Connection" icon={<Server size={18} color={C.blue} />}>
          <View style={{ paddingHorizontal: 16, paddingBottom: 12, borderTopWidth: 1, borderTopColor: C.border + '10' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 8 }}>
              {serverStatus === 'ok' ? <Wifi size={16} color={C.emerald} /> : serverStatus === 'error' ? <WifiOff size={16} color={C.red} /> : <Wifi size={16} color={C.textMuted} />}
              <Text style={{ fontSize: 13, fontWeight: '600', color: serverStatus === 'ok' ? C.emerald : serverStatus === 'error' ? C.red : C.textMuted }}>
                {testing ? 'Testing...' : serverStatus === 'ok' ? 'Connected' : serverStatus === 'error' ? 'Not reachable' : 'Unknown'}
              </Text>
            </View>
            <TextInput
              style={{
                backgroundColor: C.inputBg || C.bg, borderRadius: 10, padding: 12, fontSize: 14,
                color: C.text, borderWidth: 1, borderColor: C.border + '40', marginBottom: 8,
              }}
              value={serverUrl}
              onChangeText={setServerUrlLocal}
              placeholder="http://192.168.10.163:3000"
              placeholderTextColor={C.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: C.blue, borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
                onPress={saveServerUrl}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Save & Test</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: C.cardAlt, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' }}
                onPress={testServer}
              >
                <RefreshCw size={16} color={C.textSec} />
              </TouchableOpacity>
            </View>
          </View>
        </Section>

        {/* ── APPEARANCE ── */}
        <Section title="Appearance" icon={<Palette size={18} color={C.purple} />}>
          <Row
            label={isDark ? 'Dark Mode' : 'Light Mode'}
            desc="Toggle between dark and light theme"
            right={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Sun size={14} color={isDark ? C.textMuted : C.amber} />
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#D1D5DB', true: C.emerald + '50' }}
                  thumbColor={isDark ? C.emerald : '#FBBF24'}
                />
                <Moon size={14} color={isDark ? C.blue : C.textMuted} />
              </View>
            }
          />
        </Section>

        {/* ── POLY-PUFF MASCOT ── */}
        <Section title="Poly-Puff Mascot" icon={<Text style={{ fontSize: 18 }}>🐙</Text>}>
          <Row
            label="Show Mascot"
            desc="Poly-Puff appears on screens with tips and encouragement"
            right={
              <Switch
                value={mascotCtx.mascotEnabled}
                onValueChange={mascotCtx.setMascotEnabled}
                trackColor={{ false: '#D1D5DB', true: (C.cyan || C.emerald) + '50' }}
                thumbColor={mascotCtx.mascotEnabled ? C.cyan || C.emerald : C.textMuted}
              />
            }
          />
        </Section>

        {/* ── SOUND & HAPTICS ── */}
        <Section title="Sound & Haptics" icon={<Volume2 size={18} color={C.emerald} />}>
          <Row
            label="Sound Effects"
            desc="Audio cues for scores and events"
            right={
              <Switch
                value={soundOn}
                onValueChange={handleSoundToggle}
                trackColor={{ false: '#D1D5DB', true: C.emerald + '50' }}
                thumbColor={soundOn ? C.emerald : C.textMuted}
              />
            }
          />
          <Row
            label="Haptic Feedback"
            desc="Vibration on correct/incorrect answers"
            right={
              <Switch
                value={hapticOn}
                onValueChange={handleHapticToggle}
                trackColor={{ false: '#D1D5DB', true: C.emerald + '50' }}
                thumbColor={hapticOn ? C.emerald : C.textMuted}
              />
            }
          />
        </Section>

        {/* ── CACHE ── */}
        <Section title="Offline Cache" icon={<Download size={18} color={C.amber} />}>
          <Row
            label="Cached Data"
            desc={`Rules and exercises cached for offline use (${cacheSize})`}
            right={<Text style={{ fontSize: 13, color: C.textMuted }}>{cacheSize}</Text>}
          />
          <Row
            label="Clear Cache"
            desc="Re-download rules and exercises next time"
            onPress={clearCache}
            right={<Trash2 size={16} color={C.textMuted} />}
          />
        </Section>

        {/* ── DATA MANAGEMENT ── */}
        <Section title="Data Management" icon={<Shield size={18} color={C.red} />}>
          <Row
            label="Reset Onboarding"
            desc="Show the welcome walkthrough again"
            onPress={resetOnboarding}
            right={<RotateCcw size={16} color={C.textMuted} />}
          />
          <Row
            label="Clear Profile Info"
            desc="Remove name, profession, hobbies, photo"
            onPress={clearProfile}
            right={<ChevronRight size={16} color={C.textMuted} />}
          />
          <Row
            label="Clear All Progress"
            desc="Delete exercise history, XP, badges, and streaks"
            onPress={clearAllProgress}
            right={<Trash2 size={16} color={C.red} />}
            danger
          />
        </Section>

        {/* ── APP INFO ── */}
        <Section title="About" icon={<Info size={18} color={C.textSec} />}>
          <Row label="Version" right={<Text style={{ fontSize: 14, color: C.textMuted }}>6.2.0</Text>} />
          <Row label="Grammar Rules" right={<Text style={{ fontSize: 14, color: C.textMuted }}>193 rules • 28 categories</Text>} />
          <Row label="Languages" right={<Text style={{ fontSize: 14, color: C.textMuted }}>13 supported</Text>} />
          <Row label="CEFR Levels" right={<Text style={{ fontSize: 14, color: C.textMuted }}>A1 – C2</Text>} />
        </Section>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
