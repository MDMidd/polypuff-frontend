/**
 * Customise Practice Screen - Poly-Puff
 * =======================================
 * Lets users choose which modules appear in their Practice list,
 * reorder them by drag-and-drop, and apply preset bundles.
 *
 * Data stored in AsyncStorage key: 'practiceModuleConfig'
 * Structure: { active: string[], order: string[] }
 *
 * FILE: app/customise.tsx
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Alert, Switch, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  BookOpen, PenTool, Headphones, Brain, Layers, Pencil,
  Puzzle, Landmark, ClipboardCheck, GraduationCap, Briefcase,
  CheckCircle, ChevronRight, ChevronUp, ChevronDown,
  Star, Users, Globe, Award, X, Info,
  Sprout, MessageCircle, ClipboardList, Library, BookMarked, Rocket, ListChecks,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenBackground, BackHeader } from '../components/PolyPuffUI';
import { scaledFont } from '../utils/accessibility';

// ── All available modules (master list) ──────────────────────────────────────
export const ALL_MODULES = [
  {
    id: 'placement',   label: 'Placement Test',       desc: 'Find your CEFR level',
    icon: ClipboardCheck, color: 'cyan',    route: '/placement',
    tags: ['beginner', 'assessment'],
  },
  {
    id: 'translation', label: 'Translation Trainer',  desc: 'Translate sentences into English',
    icon: BookOpen,       color: 'purple',  route: '/translation',
    tags: ['core', 'grammar', 'intermediate', 'advanced'],
  },
  {
    id: 'wordchunks',  label: 'Word Chunks',           desc: 'Practise phrases & expressions',
    icon: Puzzle,         color: 'emerald', route: '/wordchunks',
    tags: ['core', 'vocabulary', 'beginner', 'intermediate'],
  },
  {
    id: 'listening',   label: 'Listening',             desc: 'Listen and type what you hear',
    icon: Headphones,     color: 'cyan',    route: '/listening',
    tags: ['core', 'exam', 'intermediate', 'advanced'],
  },
  {
    id: 'writing',     label: 'Writing',               desc: 'Free-form writing practice',
    icon: PenTool,        color: 'emerald', route: '/writing',
    tags: ['core', 'exam', 'intermediate', 'advanced'],
  },
  {
    id: 'quiz',        label: 'Grammar Quiz',          desc: 'Test your grammar knowledge',
    icon: Brain,          color: 'amber',   route: '/quiz',
    tags: ['core', 'grammar', 'beginner', 'intermediate'],
  },
  {
    id: 'grammar',     label: 'Grammar Practice',      desc: 'Error correction & sentence building',
    icon: Pencil,         color: 'pink',    route: '/grammar',
    tags: ['core', 'grammar', 'intermediate', 'advanced'],
  },
  {
    id: 'vocab',       label: 'Vocabulary',            desc: 'Flashcard review with repetition',
    icon: Layers,         color: 'purple',  route: '/vocab',
    tags: ['core', 'vocabulary', 'beginner', 'intermediate'],
  },
  {
    id: 'vault',       label: 'Vocabulary Vault',      desc: 'Collect words & practice sentences',
    icon: Landmark,       color: 'amber',   route: '/vault',
    tags: ['vocabulary', 'intermediate', 'advanced'],
  },
  {
    id: 'ielts',       label: 'IELTS Preparation',     desc: 'Full guide + AI practice',
    icon: Globe,          color: 'cyan',    route: '/ielts',
    tags: ['exam', 'advanced', 'academic'],
  },
  {
    id: 'toefl',       label: 'TOEFL iBT Preparation', desc: 'Full guide + AI practice',
    icon: GraduationCap,  color: 'purple',  route: '/toefl',
    tags: ['exam', 'advanced', 'academic'],
  },
  {
    id: 'cae',         label: 'CAE - C1 Advanced',     desc: 'Cambridge exam guide + AI practice',
    icon: Award,          color: 'emerald', route: '/cae',
    tags: ['exam', 'advanced', 'academic'],
  },
  {
    id: 'business',    label: 'Business English',       desc: 'Emails, meetings, negotiations',
    icon: Briefcase,      color: 'emerald', route: '/business',
    tags: ['professional', 'intermediate', 'advanced'],
  },
];

// ── Preset bundles ────────────────────────────────────────────────────────────
const PRESETS = [
  {
    id: 'beginner',
    label: 'Complete Beginner',
    icon: Sprout,
    colour: '#00E5A0',
    desc: 'Start from scratch. Build vocabulary and basic grammar before anything else.',
    modules: ['placement', 'wordchunks', 'vocab', 'quiz'],
    forWho: 'A1–A2 learners with little previous English study',
  },
  {
    id: 'everyday',
    label: 'Everyday English',
    icon: MessageCircle,
    colour: '#00E5FF',
    desc: 'Essential skills for daily communication - conversations, emails, and understanding spoken English.',
    modules: ['placement', 'translation', 'listening', 'vocab', 'wordchunks', 'quiz'],
    forWho: 'B1–B2 learners who want practical, real-world English',
  },
  {
    id: 'exam_general',
    label: 'Exam Preparation',
    icon: ClipboardList,
    colour: '#FFBE0B',
    desc: 'Focused on the four skills tested in major English exams - IELTS, TOEFL, and Cambridge.',
    modules: ['placement', 'translation', 'listening', 'writing', 'grammar', 'ielts', 'toefl', 'cae'],
    forWho: 'B2–C1 learners preparing for an international exam',
  },
  {
    id: 'academic',
    label: 'Academic English',
    icon: Library,
    colour: '#B06CFF',
    desc: 'University-level reading, writing, and critical thinking skills. Includes exam prep.',
    modules: ['translation', 'writing', 'grammar', 'listening', 'ielts', 'cae', 'vault'],
    forWho: 'Students applying to English-medium universities',
  },
  {
    id: 'professional',
    label: 'Professional / Business',
    icon: Briefcase,
    colour: '#FB923C',
    desc: 'Corporate communication, professional writing, and workplace English.',
    modules: ['business', 'writing', 'vocab', 'vault', 'grammar'],
    forWho: 'Working professionals who use English in their job',
  },
  {
    id: 'grammar_focus',
    label: 'Grammar Intensive',
    icon: BookMarked,
    colour: '#F472B6',
    desc: 'Deep focus on grammar rules, error correction, and sentence transformation.',
    modules: ['placement', 'grammar', 'quiz', 'translation', 'writing'],
    forWho: 'Learners whose main weakness is grammar accuracy',
  },
  {
    id: 'vocab_focus',
    label: 'Vocabulary Builder',
    icon: Layers,
    colour: '#FFBE0B',
    desc: 'Comprehensive vocabulary development through flashcards, chunks, and contextual learning.',
    modules: ['vocab', 'vault', 'wordchunks', 'translation', 'quiz'],
    forWho: 'Learners who need to expand their word knowledge',
  },
  {
    id: 'all',
    label: 'Everything',
    icon: Rocket,
    colour: '#00E5A0',
    desc: 'Access every feature Poly-Puff has to offer. Best for dedicated learners with clear goals.',
    modules: ALL_MODULES.map(m => m.id),
    forWho: 'Motivated learners who want the full experience',
  },
];

// Entry points to this screen (settings.tsx, index.tsx) are hidden while the
// Practice-list sync issue is investigated. Flip to true to bring the
// "Customise Practice List" button back once it's fixed.
//
// NOTE: while this is false the screen is unreachable, so it was left out of
// the Pro-lock work done in app/index.tsx and app/practice.tsx (only
// Translation Trainer + Placement Test are free there; everything else is
// gated behind Pro, matching the website's site-demo-guard.js). If this flag
// is ever flipped back to true, ALL_MODULES here will need the same lock
// treatment - non-Pro/non-admin users shouldn't be able to toggle Pro-only
// modules into their active practice list from this screen either.
export const CUSTOMISE_PRACTICE_LIST_VISIBLE = false;

// ── AsyncStorage key ──────────────────────────────────────────────────────────
export const PRACTICE_CONFIG_KEY = 'practiceModuleConfig';

// ── Default config (first launch) ────────────────────────────────────────────
export const DEFAULT_ACTIVE = [
  'placement', 'translation', 'wordchunks', 'listening',
  'writing', 'quiz', 'grammar', 'vocab', 'vault',
  'ielts', 'toefl', 'cae', 'business',
];

export async function loadPracticeConfig(): Promise<{ active: string[]; order: string[] }> {
  try {
    const raw = await AsyncStorage.getItem(PRACTICE_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { active: DEFAULT_ACTIVE, order: DEFAULT_ACTIVE };
}

export async function savePracticeConfig(active: string[], order: string[]): Promise<void> {
  await AsyncStorage.setItem(PRACTICE_CONFIG_KEY, JSON.stringify({ active, order }));
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CustomisePracticeScreen() {
  const { colors: C } = useTheme();
  const { wt } = useLanguage();
  const router = useRouter();

  const [active,        setActive]        = useState<string[]>(DEFAULT_ACTIVE);
  const [order,         setOrder]         = useState<string[]>(DEFAULT_ACTIVE);
  const [saved,         setSaved]         = useState(false);
  const [showPresets,   setShowPresets]   = useState(false);
  const [previewPreset, setPreviewPreset] = useState<typeof PRESETS[0] | null>(null);
  const [showPresetModal, setShowPresetModal] = useState(false);

  useFocusEffect(useCallback(() => {
    loadPracticeConfig().then(cfg => {
      setActive(cfg.active);
      // Ensure all active modules are in the order array
      const fullOrder = [
        ...cfg.order.filter(id => ALL_MODULES.some(m => m.id === id)),
        ...ALL_MODULES.map(m => m.id).filter(id => !cfg.order.includes(id)),
      ];
      setOrder(fullOrder);
      setSaved(false);
    });
  }, []));

  const toggleModule = (id: string) => {
    const isOn = active.includes(id);
    if (isOn && active.length <= 1) {
      Alert.alert('Keep at least one', 'You need at least one exercise in your Practice list.');
      return;
    }
    const newActive = isOn ? active.filter(a => a !== id) : [...active, id];
    setActive(newActive);
    setSaved(false);
  };

  // Swaps happen within the active-only sequence, then that sequence is
  // written back followed by the inactive ids. Swapping adjacent entries in
  // the raw `order` array (as before) could silently swap an active id with
  // an *inactive* neighbor - a no-op from the user's point of view, since
  // orderedModules only ever shows active-first - making the up/down
  // buttons appear to do nothing whenever at least one module was toggled off.
  const moveUp = (id: string) => {
    const activeIds = order.filter(i => active.includes(i));
    const idx = activeIds.indexOf(id);
    if (idx <= 0) return;
    [activeIds[idx - 1], activeIds[idx]] = [activeIds[idx], activeIds[idx - 1]];
    setOrder([...activeIds, ...order.filter(i => !active.includes(i))]);
    setSaved(false);
  };

  const moveDown = (id: string) => {
    const activeIds = order.filter(i => active.includes(i));
    const idx = activeIds.indexOf(id);
    if (idx === -1 || idx >= activeIds.length - 1) return;
    [activeIds[idx], activeIds[idx + 1]] = [activeIds[idx + 1], activeIds[idx]];
    setOrder([...activeIds, ...order.filter(i => !active.includes(i))]);
    setSaved(false);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setActive(preset.modules);
    setOrder([
      ...preset.modules,
      ...ALL_MODULES.map(m => m.id).filter(id => !preset.modules.includes(id)),
    ]);
    setShowPresetModal(false);
    setSaved(false);
  };

  const handleSave = async () => {
    await savePracticeConfig(active, order);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    Alert.alert(
      'Practice list updated! ✅',
      `${active.length} exercise${active.length !== 1 ? 's' : ''} will appear in your Practice section.`,
      [{ text: 'OK' }]
    );
  };

  const getColor = (colorName: string) => {
    const map: Record<string, string> = {
      cyan:    C.cyan    || '#00E5FF',
      purple:  C.purple  || '#B06CFF',
      emerald: C.emerald || '#00E5A0',
      amber:   C.amber   || '#FFBE0B',
      pink:    '#F472B6',
    };
    return map[colorName] || '#00E5FF';
  };

  // Show active modules in their chosen order, then inactive ones after
  const orderedModules = [
    ...order.filter(id => active.includes(id)).map(id => ALL_MODULES.find(m => m.id === id)!).filter(Boolean),
    ...order.filter(id => !active.includes(id)).map(id => ALL_MODULES.find(m => m.id === id)!).filter(Boolean),
  ];

  return (
    <ScreenBackground>
      <BackHeader title={wt('customise-practice')} onPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Intro */}
        <View style={{ backgroundColor: '#0d1a0d', borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#00E5A040' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <ListChecks size={16} color="#00E5A0" />
            <Text style={{ fontSize: scaledFont(16), fontWeight: '800', color: '#00E5A0' }}>
              Your Practice List
            </Text>
          </View>
          <Text style={{ fontSize: scaledFont(13), color: '#ccc', lineHeight: 20 }}>
            Choose which exercises appear in your Practice section and arrange them in the order that suits you. Changes update both Practice and My Progress.
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, backgroundColor: '#ffffff10', borderRadius: 10, padding: 8 }}>
            <Info size={14} color='#00E5A0' />
            <Text style={{ flex: 1, fontSize: scaledFont(11), color: '#00E5A0', fontWeight: '600' }}>
              {active.length} of {ALL_MODULES.length} exercises active · Use ↑↓ to reorder
            </Text>
          </View>
        </View>

        {/* Presets button */}
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1.5, borderColor: (C.amber || '#FFBE0B') + '50' }}
          onPress={() => setShowPresetModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Suggested bundles"
          accessibilityHint="Opens a list of curated exercise bundles for different goals and levels"
        >
          <Star size={20} color={C.amber || '#FFBE0B'} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: scaledFont(14), fontWeight: '800', color: C.amber || '#FFBE0B' }}>
              Suggested Bundles
            </Text>
            <Text style={{ fontSize: scaledFont(12), color: C.textMuted, marginTop: 1 }}>
              8 curated combinations for different goals & levels
            </Text>
          </View>
          <ChevronRight size={16} color={C.amber || '#FFBE0B'} />
        </TouchableOpacity>

        {/* Module list */}
        <Text style={{ fontSize: scaledFont(10), fontWeight: '700', color: C.textMuted, letterSpacing: 1, marginBottom: 10 }}>
          YOUR EXERCISES - ACTIVE FIRST
        </Text>

        {orderedModules.map((mod, i) => {
          const isActive   = active.includes(mod.id);
          const colour     = getColor(mod.color);
          const activeIdx  = order.filter(id => active.includes(id)).indexOf(mod.id);
          const activeCount = active.length;

          return (
            <View
              key={mod.id}
              style={{
                backgroundColor: isActive ? C.card : C.card + 'CC',
                borderRadius: 16, padding: 14, marginBottom: 8,
                borderWidth: 1.5,
                borderColor: isActive ? colour + '40' : C.border + '15',
                opacity: isActive ? 1 : 0.55,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {/* Toggle */}
                <Switch
                  value={isActive}
                  onValueChange={() => toggleModule(mod.id)}
                  trackColor={{ false: C.border + '60', true: colour + '60' }}
                  thumbColor={isActive ? colour : C.textMuted}
                  style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                  accessibilityLabel={`${mod.label} in practice list`}
                  accessibilityHint={isActive ? 'Removes this exercise from your practice list' : 'Adds this exercise to your practice list'}
                />

                {/* Icon */}
                <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colour + '20', alignItems: 'center', justifyContent: 'center' }}>
                  <mod.icon size={18} color={colour} />
                </View>

                {/* Label */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: isActive ? C.text : C.textMuted }}>
                      {mod.label}
                    </Text>
                  </View>
                  <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginTop: 1 }}>
                    {mod.desc}
                  </Text>
                </View>

                {/* Up/Down controls (only for active modules) */}
                {isActive && (
                  <View style={{ gap: 2 }}>
                    <TouchableOpacity
                      onPress={() => moveUp(mod.id)}
                      style={{ padding: 4, opacity: activeIdx === 0 ? 0.25 : 1 }}
                      disabled={activeIdx === 0}
                      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                      accessibilityRole="button"
                      accessibilityLabel={`Move ${mod.label} up`}
                      accessibilityState={{ disabled: activeIdx === 0 }}
                    >
                      <ChevronUp size={16} color={colour} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => moveDown(mod.id)}
                      style={{ padding: 4, opacity: activeIdx === activeCount - 1 ? 0.25 : 1 }}
                      disabled={activeIdx === activeCount - 1}
                      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                      accessibilityRole="button"
                      accessibilityLabel={`Move ${mod.label} down`}
                      accessibilityState={{ disabled: activeIdx === activeCount - 1 }}
                    >
                      <ChevronDown size={16} color={colour} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {/* Save button */}
        <TouchableOpacity
          style={{ backgroundColor: saved ? '#00E5A0' : (C.emerald || '#00E5A0'), borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8, flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Practice list saved' : `Save practice list with ${active.length} active exercise${active.length !== 1 ? 's' : ''}`}
        >
          {saved ? <CheckCircle size={18} color="#000" /> : <CheckCircle size={18} color="#000" />}
          <Text style={{ fontSize: scaledFont(15), fontWeight: '800', color: '#000' }}>
            {saved ? 'Saved! ✅' : `Save Practice List (${active.length} active)`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ paddingVertical: 12, alignItems: 'center', marginTop: 6 }}
          onPress={async () => {
            await savePracticeConfig(DEFAULT_ACTIVE, DEFAULT_ACTIVE);
            setActive(DEFAULT_ACTIVE);
            setOrder([...DEFAULT_ACTIVE, ...ALL_MODULES.map(m => m.id).filter(id => !DEFAULT_ACTIVE.includes(id))]);
            Alert.alert('Reset', 'Your practice list has been reset to the default.');
          }}
          accessibilityRole="button"
          accessibilityLabel="Reset to default"
          accessibilityHint="Restores the original set of practice exercises and order"
        >
          <Text style={{ fontSize: scaledFont(13), color: C.textMuted }}>Reset to default</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ── PRESETS MODAL ─────────────────────────────────────────────────── */}
      <Modal visible={showPresetModal} animationType="slide" onRequestClose={() => setShowPresetModal(false)}>
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.border + '20' }}>
            <Text style={{ fontSize: scaledFont(18), fontWeight: '800', color: C.text }}>Suggested Bundles</Text>
            <TouchableOpacity
              onPress={() => setShowPresetModal(false)}
              accessibilityRole="button"
              accessibilityLabel="Close suggested bundles"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={24} color={C.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
            <Text style={{ fontSize: scaledFont(13), color: C.textMuted, marginBottom: 16, lineHeight: 19 }}>
              These curated combinations are based on common learning goals. Tap any bundle to preview it, then apply it to your Practice list.
            </Text>

            {PRESETS.map((preset) => {
              const isPreview = previewPreset?.id === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  style={{ backgroundColor: C.card, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: isPreview ? preset.colour + '60' : C.border + '20' }}
                  onPress={() => setPreviewPreset(isPreview ? null : preset)}
                  accessibilityRole="button"
                  accessibilityLabel={`${preset.label} bundle, ${preset.modules.length} exercises`}
                  accessibilityHint={isPreview ? 'Collapses bundle details' : 'Expands to show included exercises and apply option'}
                  accessibilityState={{ expanded: isPreview }}
                >
                  {/* Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <preset.icon size={26} color={preset.colour} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: scaledFont(15), fontWeight: '800', color: preset.colour }}>
                        {preset.label}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 }}>
                        <Users size={11} color={C.textMuted} />
                        <Text style={{ fontSize: scaledFont(11), color: C.textMuted }}>
                          {preset.forWho}
                        </Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: preset.colour + '15', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                      <Text style={{ fontSize: scaledFont(10), fontWeight: '800', color: preset.colour }}>
                        {preset.modules.length} exercises
                      </Text>
                    </View>
                  </View>

                  <Text style={{ fontSize: scaledFont(13), color: C.textSec, lineHeight: 19, marginBottom: isPreview ? 12 : 0 }}>
                    {preset.desc}
                  </Text>

                  {/* Expanded module list */}
                  {isPreview && (
                    <View>
                      <View style={{ height: 1, backgroundColor: C.border + '20', marginBottom: 10 }} />
                      <Text style={{ fontSize: scaledFont(10), fontWeight: '700', color: C.textMuted, letterSpacing: 1, marginBottom: 8 }}>
                        INCLUDES
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {preset.modules.map(id => {
                          const m = ALL_MODULES.find(x => x.id === id);
                          if (!m) return null;
                          const col = { cyan: C.cyan || '#00E5FF', purple: C.purple || '#B06CFF', emerald: C.emerald || '#00E5A0', amber: C.amber || '#FFBE0B', pink: '#F472B6' }[m.color] || '#00E5FF';
                          return (
                            <View key={id} style={{ backgroundColor: col + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: col + '30' }}>
                              <Text style={{ fontSize: scaledFont(11), fontWeight: '700', color: col }}>{m.label}</Text>
                            </View>
                          );
                        })}
                      </View>
                      <TouchableOpacity
                        style={{ backgroundColor: preset.colour, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                        onPress={() => applyPreset(preset)}
                        accessibilityRole="button"
                        accessibilityLabel={`Apply ${preset.label} bundle`}
                        accessibilityHint="Replaces your practice list with the exercises in this bundle"
                      >
                        <Text style={{ fontSize: scaledFont(14), fontWeight: '800', color: '#000' }}>
                          Apply "{preset.label}" Bundle →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </ScreenBackground>
  );
}
