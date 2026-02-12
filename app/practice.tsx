/**
 * Practice Hub - Poly-Puff v2.0
 * ===============================
 * 
 * Module grid with Poly-Puff mascot.
 * Placement Test is FIRST icon.
 * Navigates to sub-screens.
 * 
 * FILE: app/practice.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  ClipboardCheck, BookOpen, Mic, Headphones, PenTool,
  Brain, Layers, Users, Zap, ChevronRight, Award,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ScreenBackground, GlassCard, MascotHeader, NeonButton } from '../components/PolyPuffUI';
import SettingsButton from '../components/SettingsButton';
import { useMascot } from './_layout';

const MODULES = [
  { id: 'placement', label: 'Placement Test', desc: 'Find your level', icon: ClipboardCheck, color: 'cyan', route: '/placement', badge: '⭐' },
  { id: 'translation', label: 'Sentence Trainer', desc: 'Translate sentences', icon: BookOpen, color: 'purple', route: '/translation' },
  { id: 'speaking', label: 'Speak', desc: 'Practice pronunciation', icon: Mic, color: 'pink', route: '/listening' },
  { id: 'listening', label: 'Listen', desc: 'Listening exercises', icon: Headphones, color: 'cyan', route: '/listening' },
  { id: 'writing', label: 'Write', desc: 'Free-form writing', icon: PenTool, color: 'emerald', route: '/writing' },
  { id: 'quiz', label: 'Quiz', desc: 'Grammar questions', icon: Brain, color: 'amber', route: '/quiz' },
  { id: 'vocab', label: 'Vocabulary', desc: 'Flashcards', icon: Layers, color: 'purple', route: '/vocab' },
  { id: 'classroom', label: 'Classroom', desc: 'Join a class', icon: Users, color: 'cyan', route: '/classroom' },
];

export default function PracticeHub() {
  const { colors: C } = useTheme();
  const router = useRouter();
  const { mascotEnabled } = useMascot();

  const [skillLevels, setSkillLevels] = useState(null);
  const [placementDone, setPlacementDone] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('placementComplete').then(v => setPlacementDone(v === 'true')).catch(() => {});
    AsyncStorage.getItem('skillLevels').then(v => { if (v) setSkillLevels(JSON.parse(v)); }).catch(() => {});
  }, []);

  const getColor = (colorName) => {
    const map = { cyan: C.cyan || '#00E5FF', purple: C.purple || '#B06CFF', pink: C.pink || '#FF6EB4',
      emerald: C.emerald || '#00E5A0', amber: C.amber || '#FFBE0B' };
    return map[colorName] || C.cyan;
  };

  return (
    <ScreenBackground>
      <SettingsButton />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 50, paddingBottom: 100 }}>

        {/* Mascot */}
        {mascotEnabled && (
          <MascotHeader
            message={!placementDone ? "Take the Placement Test first to find your level!" : "Choose a module to practice! 📚"}
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Skill levels bar (if placement done) */}
        {skillLevels && (
          <GlassCard intensity="subtle" style={{ marginBottom: 16, paddingVertical: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.textMuted, letterSpacing: 1, marginBottom: 8, textAlign: 'center' }}>YOUR LEVELS</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {[
                { key: 'reading', icon: BookOpen, label: 'Read' },
                { key: 'writing', icon: PenTool, label: 'Write' },
                { key: 'listening', icon: Headphones, label: 'Listen' },
                { key: 'speaking', icon: Mic, label: 'Speak' },
              ].map(({ key, icon: Icon, label }) => (
                <View key={key} style={{ alignItems: 'center' }}>
                  <Icon size={16} color={C.cyan || '#00E5FF'} />
                  <Text style={{ fontSize: 16, fontWeight: '800', color: C.text, marginTop: 4 }}>{skillLevels[key] || '?'}</Text>
                  <Text style={{ fontSize: 10, color: C.textMuted }}>{label}</Text>
                </View>
              ))}
              <View style={{ alignItems: 'center' }}>
                <Award size={16} color={C.amber || '#FFBE0B'} />
                <Text style={{ fontSize: 16, fontWeight: '800', color: C.amber || '#FFBE0B', marginTop: 4 }}>{skillLevels.overall || '?'}</Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>Overall</Text>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Module Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const color = getColor(mod.color);
            const isPlacement = mod.id === 'placement';

            return (
              <TouchableOpacity
                key={mod.id}
                style={{
                  width: '47%', borderRadius: 16, padding: 16,
                  backgroundColor: (C.card || '#121829') + 'B8',
                  borderWidth: 1, borderColor: color + (isPlacement && !placementDone ? '60' : '25'),
                  shadowColor: isPlacement && !placementDone ? color : 'transparent',
                  shadowOpacity: isPlacement && !placementDone ? 0.3 : 0,
                  shadowRadius: 12, elevation: isPlacement && !placementDone ? 6 : 0,
                }}
                activeOpacity={0.7}
                onPress={() => router.push(mod.route)}
              >
                {mod.badge && !placementDone && (
                  <Text style={{ position: 'absolute', top: 8, right: 8, fontSize: 16 }}>{mod.badge}</Text>
                )}
                <View style={{
                  width: 44, height: 44, borderRadius: 12,
                  backgroundColor: color + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                }}>
                  <Icon size={24} color={color} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 2 }}>{mod.label}</Text>
                <Text style={{ fontSize: 11, color: C.textMuted }}>{mod.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}
