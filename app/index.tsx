/**
 * Profile Screen - Poly-Puff v7
 * ========================================
 * 
 * Two modes:
 *   VIEW: Displays profile info nicely with "Edit Profile" button
 *   EDIT: Form fields to update info
 * 
 * Includes: Name, Profession, Qualifications, Age, Bio (work + hobbies),
 *           Native Language, App Language, CEFR Level, Profile Picture
 * 
 * FILE: app/index.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Image, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {
  Globe, GraduationCap, CheckCircle, BookOpen, UserCircle,
  Briefcase, Calendar, Heart, Save, Camera, Edit3,
  FileText, Languages,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import SettingsButton from '../components/SettingsButton';
import { ScreenBackground, GlassCard, NeonButton } from '../components/PolyPuffUI';

const LANGUAGES = [
  { name: 'Spanish', flag: '🇪🇸' }, { name: 'Mandarin', flag: '🇨🇳' },
  { name: 'French', flag: '🇫🇷' }, { name: 'German', flag: '🇩🇪' },
  { name: 'Portuguese', flag: '🇧🇷' }, { name: 'Russian', flag: '🇷🇺' },
  { name: 'Japanese', flag: '🇯🇵' }, { name: 'Arabic', flag: '🇸🇦' },
  { name: 'Hindi', flag: '🇮🇳' }, { name: 'Polish', flag: '🇵🇱' },
  { name: 'Italian', flag: '🇮🇹' }, { name: 'Czech', flag: '🇨🇿' },
  { name: 'Afrikaans', flag: '🇿🇦' },
];

const APP_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
  { code: 'af', label: 'Afrikaans', flag: '🇿🇦' },
];

const LEVELS = [
  { code: 'A1', label: 'Beginner', desc: 'Basic words and phrases' },
  { code: 'A2', label: 'Elementary', desc: 'Simple sentences, past tense' },
  { code: 'B1', label: 'Intermediate', desc: 'Various tenses, opinions' },
  { code: 'B2', label: 'Upper-Int', desc: 'Complex sentences, idioms' },
  { code: 'C1', label: 'Advanced', desc: 'Nuanced, sophisticated' },
  { code: 'C2', label: 'Proficient', desc: 'Near-native precision' },
];

export default function ProfileScreen() {
  const { colors: C } = useTheme();

  const [mode, setMode] = useState('view');
  const [hasProfile, setHasProfile] = useState(false);

  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [age, setAge] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [nativeLanguage, setNativeLanguage] = useState('Spanish');
  const [appLanguage, setAppLanguage] = useState('en');
  const [level, setLevel] = useState('B1');
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const data = await AsyncStorage.getItem('userProfile');
      if (data) {
        const p = JSON.parse(data);
        if (p.name) { setName(p.name); setHasProfile(true); }
        if (p.profession) setProfession(p.profession);
        if (p.qualifications) setQualifications(p.qualifications);
        if (p.age) setAge(p.age);
        if (p.hobbies) setHobbies(p.hobbies);
        if (p.bio) setBio(p.bio);
        if (p.nativeLanguage) setNativeLanguage(p.nativeLanguage);
        if (p.appLanguage) setAppLanguage(p.appLanguage);
        if (p.level) setLevel(p.level);
      }
      const pic = await AsyncStorage.getItem('profilePic');
      if (pic) setProfilePic(pic);
    } catch (e) {}
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow access to your photo library.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfilePic(result.assets[0].uri);
      try { await AsyncStorage.setItem('profilePic', result.assets[0].uri); } catch (e) {}
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) { Alert.alert('Name Required', 'Please enter your name.'); return; }
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        name, profession, qualifications, age, hobbies, bio, nativeLanguage, appLanguage, level,
      }));
      setSaved(true); setHasProfile(true); setMode('view');
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {}
  };

  const getFlag = (langName) => LANGUAGES.find(l => l.name === langName)?.flag || '🌐';
  const getLevelInfo = (code) => LEVELS.find(l => l.code === code) || LEVELS[2];
  const getAppLang = (code) => APP_LANGUAGES.find(l => l.code === code) || APP_LANGUAGES[0];

  const ds = dynamicStyles(C);

  // ═══ VIEW MODE ═══
  if (mode === 'view' && hasProfile) {
    const lv = getLevelInfo(level);
    const al = getAppLang(appLanguage);
    return (
      <ScreenBackground>
      <SafeAreaView style={sty.screen}>
        <SettingsButton />
        <ScrollView contentContainerStyle={sty.content}>

          {/* Profile card */}
          <View style={[ds.sectionCard, { alignItems: 'center', paddingVertical: 28 }]}>
            <View style={[sty.avatarRing, { backgroundColor: C.emeraldDark, borderColor: C.emerald + '40' }]}>
              {profilePic ? <Image source={{ uri: profilePic }} style={sty.avatarImage} /> : <GraduationCap size={32} color={C.emerald} />}
            </View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: C.text, marginTop: 12 }}>{name}</Text>
            {profession ? <Text style={{ fontSize: 15, color: C.textSec, marginTop: 2 }}>{profession}</Text> : null}
            {qualifications ? <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{qualifications}</Text> : null}
            {age ? <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Age: {age}</Text> : null}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              <View style={{ backgroundColor: C.emerald + '20', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: C.emerald + '40' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.emerald }}>{level} — {lv.label}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.blue + '15', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: C.blue + '30' }}>
                <Text style={{ fontSize: 14 }}>{getFlag(nativeLanguage)}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.blueLight || C.blue }}>{nativeLanguage}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: (C.amberDark || '#92400E') + '30', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: C.amber + '30' }}>
                <Text style={{ fontSize: 14 }}>{al.flag}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.amberLight || C.amber }}>{al.label}</Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          {bio ? (
            <View style={ds.sectionCard}>
              <View style={sty.sectionHeader}>
                <FileText size={18} color={C.blue} />
                <Text style={[sty.sectionTitle, { color: C.text }]}>About Me</Text>
              </View>
              <Text style={{ fontSize: 14, color: C.textSec, lineHeight: 22, marginTop: 8 }}>{bio}</Text>
            </View>
          ) : null}

          {/* Hobbies */}
          {hobbies ? (
            <View style={ds.sectionCard}>
              <View style={sty.sectionHeader}>
                <Heart size={18} color={C.red} />
                <Text style={[sty.sectionTitle, { color: C.text }]}>Hobbies & Interests</Text>
              </View>
              <Text style={{ fontSize: 14, color: C.textSec, lineHeight: 22, marginTop: 8 }}>{hobbies}</Text>
            </View>
          ) : null}

          {/* Edit button */}
          <NeonButton title="Edit Profile" onPress={() => setMode('edit')} icon={<Edit3 size={18} color="#000" />} style={{ marginBottom: 12 }} />

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
    );
  }

  // ═══ EDIT MODE ═══
  return (
    <ScreenBackground>
      <SafeAreaView style={sty.screen}>
        <SettingsButton />
      <ScrollView contentContainerStyle={sty.content} keyboardShouldPersistTaps="handled">

        <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
            <View style={[sty.avatarRing, { backgroundColor: C.emeraldDark, borderColor: C.emerald + '40' }]}>
              {profilePic ? <Image source={{ uri: profilePic }} style={sty.avatarImage} /> : <GraduationCap size={32} color={C.emerald} />}
              <View style={[sty.cameraIcon, { backgroundColor: C.blue }]}><Camera size={12} color="#fff" /></View>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginTop: 8 }}>
            {hasProfile ? 'Edit Profile' : 'Set Up Your Profile'}
          </Text>
          {hasProfile && (
            <TouchableOpacity onPress={() => setMode('view')} style={{ marginTop: 6 }}>
              <Text style={{ fontSize: 14, color: C.blue }}>← Back to profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── PERSONAL INFO ── */}
        <View style={ds.sectionCard}>
          <View style={sty.sectionHeader}>
            <UserCircle size={18} color={C.blue} />
            <Text style={[sty.sectionTitle, { color: C.text }]}>Personal Info</Text>
          </View>
          <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, marginLeft: 26 }}>Helps personalize your exercises</Text>

          <View style={sty.fieldRow}>
            <UserCircle size={16} color={C.textMuted} />
            <TextInput style={[ds.input, sty.fieldInput]} placeholder="Your name *" placeholderTextColor={C.textMuted} value={name} onChangeText={setName} autoCapitalize="words" />
          </View>
          <View style={sty.fieldRow}>
            <Briefcase size={16} color={C.textMuted} />
            <TextInput style={[ds.input, sty.fieldInput]} placeholder="Profession (e.g., Teacher, Engineer)" placeholderTextColor={C.textMuted} value={profession} onChangeText={setProfession} autoCapitalize="words" />
          </View>
          <View style={sty.fieldRow}>
            <GraduationCap size={16} color={C.textMuted} />
            <TextInput style={[ds.input, sty.fieldInput]} placeholder="Qualifications (optional)" placeholderTextColor={C.textMuted} value={qualifications} onChangeText={setQualifications} autoCapitalize="words" />
          </View>
          <View style={sty.fieldRow}>
            <Calendar size={16} color={C.textMuted} />
            <TextInput style={[ds.input, sty.fieldInput]} placeholder="Age (optional)" placeholderTextColor={C.textMuted} value={age} onChangeText={setAge} keyboardType="number-pad" maxLength={3} />
          </View>
          <View style={sty.fieldRow}>
            <Heart size={16} color={C.textMuted} />
            <TextInput style={[ds.input, sty.fieldInput, { minHeight: 60, textAlignVertical: 'top' }]} placeholder="Hobbies & interests (e.g., cooking, football, travel)" placeholderTextColor={C.textMuted} value={hobbies} onChangeText={setHobbies} multiline autoCapitalize="sentences" />
          </View>
        </View>

        {/* ── BIO ── */}
        <View style={ds.sectionCard}>
          <View style={sty.sectionHeader}>
            <FileText size={18} color={C.purple} />
            <Text style={[sty.sectionTitle, { color: C.text }]}>About Me</Text>
            <View style={{ marginLeft: 'auto', backgroundColor: C.cardAlt, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: '600' }}>OPTIONAL</Text>
            </View>
          </View>
          <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 12, marginLeft: 26 }}>
            Describe your work duties, daily tasks, or anything about yourself. This helps us create more relevant exercises.
          </Text>
          <TextInput
            style={[ds.input, { minHeight: 120, textAlignVertical: 'top', lineHeight: 22 }]}
            placeholder={"e.g., I work as a project manager at a construction company. My daily tasks include writing reports, attending meetings, and communicating with international clients.\n\nI also enjoy cooking Italian food and playing chess on weekends."}
            placeholderTextColor={C.textMuted}
            value={bio} onChangeText={setBio}
            multiline autoCapitalize="sentences" maxLength={500}
          />
          <Text style={{ fontSize: 11, color: C.textMuted, textAlign: 'right', marginTop: 4 }}>{bio.length}/500</Text>
        </View>

        {/* ── NATIVE LANGUAGE ── */}
        <View style={ds.sectionCard}>
          <View style={sty.sectionHeader}>
            <Globe size={18} color={C.blue} />
            <Text style={[sty.sectionTitle, { color: C.text }]}>Native Language</Text>
          </View>
          <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, marginLeft: 26 }}>Grammar tips and translations shown in this language</Text>
          <View style={sty.langGrid}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity key={lang.name} style={[ds.langCard, nativeLanguage === lang.name && ds.langCardActive]} onPress={() => setNativeLanguage(lang.name)}>
                <Text style={sty.langFlag}>{lang.flag}</Text>
                <Text style={[sty.langName, { color: nativeLanguage === lang.name ? C.emeraldLight : C.textMuted }]}>{lang.name}</Text>
                {nativeLanguage === lang.name && <CheckCircle size={14} color={C.emerald} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── APP LANGUAGE ── */}
        <View style={ds.sectionCard}>
          <View style={sty.sectionHeader}>
            <Languages size={18} color={C.amber} />
            <Text style={[sty.sectionTitle, { color: C.text }]}>App Language</Text>
          </View>
          <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, marginLeft: 26 }}>Change the interface language</Text>
          <View style={sty.langGrid}>
            {APP_LANGUAGES.map(lang => (
              <TouchableOpacity key={lang.code}
                style={[ds.langCard, appLanguage === lang.code && { borderColor: C.amber, backgroundColor: (C.amberDark || '#92400E') }]}
                onPress={() => setAppLanguage(lang.code)}>
                <Text style={sty.langFlag}>{lang.flag}</Text>
                <Text style={[sty.langName, { color: appLanguage === lang.code ? (C.amberLight || '#FCD34D') : C.textMuted }]}>{lang.label}</Text>
                {appLanguage === lang.code && <CheckCircle size={14} color={C.amber} />}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 8, fontStyle: 'italic' }}>
            Note: Full interface translations coming soon. Grammar tips already use your native language.
          </Text>
        </View>

        {/* ── CEFR LEVEL ── */}
        <View style={ds.sectionCard}>
          <View style={sty.sectionHeader}>
            <BookOpen size={18} color={C.purple} />
            <Text style={[sty.sectionTitle, { color: C.text }]}>English Level (CEFR)</Text>
          </View>
          <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, marginLeft: 26 }}>Exercises will match this difficulty</Text>
          {LEVELS.map(l => (
            <TouchableOpacity key={l.code} style={[sty.levelRow, level === l.code && { backgroundColor: C.emeraldDark }]} onPress={() => setLevel(l.code)}>
              <View style={[sty.levelBadge, { backgroundColor: level === l.code ? C.emerald + '30' : C.cardAlt }]}>
                <Text style={[sty.levelCode, { color: level === l.code ? C.emeraldLight : C.textMuted }]}>{l.code}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: level === l.code ? C.text : C.textSec }}>{l.label}</Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>{l.desc}</Text>
              </View>
              {level === l.code && <CheckCircle size={18} color={C.emerald} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── SAVE ── */}
        <TouchableOpacity style={[sty.saveBtn, { backgroundColor: C.emerald }]} onPress={saveProfile}>
          {saved ? (
            <><CheckCircle size={20} color="#fff" /><Text style={sty.saveBtnText}>Saved!</Text></>
          ) : (
            <><Save size={20} color="#fff" /><Text style={sty.saveBtnText}>Save Profile</Text></>
          )}
        </TouchableOpacity>

        {hasProfile && (
          <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 12 }} onPress={() => setMode('view')}>
            <Text style={{ fontSize: 14, color: C.textMuted }}>Cancel</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
    </ScreenBackground>
  );
}

function dynamicStyles(C) {
  return {
    sectionCard: { backgroundColor: C.card, borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: C.border + '20' },
    input: { backgroundColor: C.inputBg, borderRadius: 10, padding: 12, fontSize: 15, color: C.text, borderWidth: 1, borderColor: C.border + '40' },
    langCard: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.inputBg, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: C.border + '30' },
    langCardActive: { borderColor: C.emerald, backgroundColor: C.emeraldDark },
  };
}

const sty = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20 },
  avatarRing: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  avatarImage: { width: 76, height: 76, borderRadius: 38 },
  cameraIcon: { position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  fieldRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  fieldInput: { flex: 1 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langFlag: { fontSize: 18 },
  langName: { fontSize: 13, fontWeight: '500' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 10, marginBottom: 4 },
  levelBadge: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  levelCode: { fontSize: 14, fontWeight: '800' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16, marginBottom: 8 },
  saveBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
