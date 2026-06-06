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
 * FILE: app/profile.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Image, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Localization from 'expo-localization';
import {
  Globe, GraduationCap, CheckCircle, BookOpen, UserCircle,
  Briefcase, Calendar, Heart, Save, Camera, Edit3,
  FileText, Languages, ArrowLeft,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import SettingsButton from '../components/SettingsButton';
import { ScreenBackground, GlassCard, NeonButton, BackHeader } from '../components/PolyPuffUI';
import PolyPuffScene from '../components/PolyPuffScene';

const LANGUAGES = [
  { name: 'Afrikaans',    flag: '🇿🇦' },
  { name: 'Amharic',      flag: '🇪🇹' },
  { name: 'Arabic',       flag: '🇸🇦' },
  { name: 'Bengali',      flag: '🇧🇩' },
  { name: 'Bulgarian',    flag: '🇧🇬' },
  { name: 'Czech',        flag: '🇨🇿' },
  { name: 'Danish',       flag: '🇩🇰' },
  { name: 'Dutch',        flag: '🇳🇱' },
  { name: 'Filipino',     flag: '🇵🇭' },
  { name: 'Finnish',      flag: '🇫🇮' },
  { name: 'French',       flag: '🇫🇷' },
  { name: 'German',       flag: '🇩🇪' },
  { name: 'Greek',        flag: '🇬🇷' },
  { name: 'Guarani',      flag: '🇵🇾' },
  { name: 'Gujarati',     flag: '🇮🇳' },
  { name: 'Haitian Creole', flag: '🇭🇹' },
  { name: 'Hausa',        flag: '🇳🇬' },
  { name: 'Hebrew',       flag: '🇮🇱' },
  { name: 'Hindi',        flag: '🇮🇳' },
  { name: 'Hungarian',    flag: '🇭🇺' },
  { name: 'Igbo',         flag: '🇳🇬' },
  { name: 'Indonesian',   flag: '🇮🇩' },
  { name: 'Italian',      flag: '🇮🇹' },
  { name: 'Japanese',     flag: '🇯🇵' },
  { name: 'Korean',       flag: '🇰🇷' },
  { name: 'Malay',        flag: '🇲🇾' },
  { name: 'Mandarin',     flag: '🇨🇳' },
  { name: 'Marathi',      flag: '🇮🇳' },
  { name: 'Nepali',       flag: '🇳🇵' },
  { name: 'Norwegian',    flag: '🇳🇴' },
  { name: 'Pashto',       flag: '🇦🇫' },
  { name: 'Persian',      flag: '🇮🇷' },
  { name: 'Polish',       flag: '🇵🇱' },
  { name: 'Portuguese',   flag: '🇧🇷' },
  { name: 'Punjabi',      flag: '🇮🇳' },
  { name: 'Quechua',      flag: '🇵🇪' },
  { name: 'Romanian',     flag: '🇷🇴' },
  { name: 'Russian',      flag: '🇷🇺' },
  { name: 'Sinhala',      flag: '🇱🇰' },
  { name: 'Slovak',       flag: '🇸🇰' },
  { name: 'Spanish',      flag: '🇪🇸' },
  { name: 'Swahili',      flag: '🇰🇪' },
  { name: 'Swedish',      flag: '🇸🇪' },
  { name: 'Tamil',        flag: '🇮🇳' },
  { name: 'Telugu',       flag: '🇮🇳' },
  { name: 'Thai',         flag: '🇹🇭' },
  { name: 'Turkish',      flag: '🇹🇷' },
  { name: 'Ukrainian',    flag: '🇺🇦' },
  { name: 'Urdu',         flag: '🇵🇰' },
  { name: 'Vietnamese',   flag: '🇻🇳' },
  { name: 'Yoruba',       flag: '🇳🇬' },
  { name: 'Zulu',         flag: '🇿🇦' },
];

const APP_LANGUAGES = [
  { code: 'en', label: 'English',          flag: '🇬🇧' },
  { code: 'af', label: 'Afrikaans',         flag: '🇿🇦' },
  { code: 'am', label: 'አማርኛ',              flag: '🇪🇹' },
  { code: 'ar', label: 'العربية',           flag: '🇸🇦' },
  { code: 'bn', label: 'বাংলা',             flag: '🇧🇩' },
  { code: 'bg', label: 'Български',         flag: '🇧🇬' },
  { code: 'cs', label: 'Čeština',           flag: '🇨🇿' },
  { code: 'da', label: 'Dansk',             flag: '🇩🇰' },
  { code: 'nl', label: 'Nederlands',        flag: '🇳🇱' },
  { code: 'fil', label: 'Filipino',          flag: '🇵🇭' },
  { code: 'fi', label: 'Suomi',             flag: '🇫🇮' },
  { code: 'fr', label: 'Français',          flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch',           flag: '🇩🇪' },
  { code: 'el', label: 'Ελληνικά',          flag: '🇬🇷' },
  { code: 'gn', label: "Avañe'ẽ",            flag: '🇵🇾' },
  { code: 'gu', label: 'ગુજરાતી',           flag: '🇮🇳' },
  { code: 'ht', label: 'Kreyòl Ayisyen',     flag: '🇭🇹' },
  { code: 'ha', label: 'Hausa',             flag: '🇳🇬' },
  { code: 'he', label: 'עברית',             flag: '🇮🇱' },
  { code: 'hi', label: 'हिन्दी',            flag: '🇮🇳' },
  { code: 'hu', label: 'Magyar',            flag: '🇭🇺' },
  { code: 'ig', label: 'Igbo',              flag: '🇳🇬' },
  { code: 'id', label: 'Bahasa Indonesia',  flag: '🇮🇩' },
  { code: 'it', label: 'Italiano',          flag: '🇮🇹' },
  { code: 'ja', label: '日本語',             flag: '🇯🇵' },
  { code: 'ko', label: '한국어',             flag: '🇰🇷' },
  { code: 'ms', label: 'Bahasa Melayu',     flag: '🇲🇾' },
  { code: 'zh', label: '中文',              flag: '🇨🇳' },
  { code: 'mr', label: 'मराठी',             flag: '🇮🇳' },
  { code: 'ne', label: 'नेपाली',            flag: '🇳🇵' },
  { code: 'no', label: 'Norsk',             flag: '🇳🇴' },
  { code: 'ps', label: 'پښتو',              flag: '🇦🇫' },
  { code: 'fa', label: 'فارسی',             flag: '🇮🇷' },
  { code: 'pl', label: 'Polski',            flag: '🇵🇱' },
  { code: 'pt', label: 'Português',         flag: '🇧🇷' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ',            flag: '🇮🇳' },
  { code: 'qu', label: 'Runa Simi',          flag: '🇵🇪' },
  { code: 'ro', label: 'Română',            flag: '🇷🇴' },
  { code: 'ru', label: 'Русский',           flag: '🇷🇺' },
  { code: 'si', label: 'සිංහල',             flag: '🇱🇰' },
  { code: 'sk', label: 'Slovenčina',         flag: '🇸🇰' },
  { code: 'es', label: 'Español',           flag: '🇪🇸' },
  { code: 'sw', label: 'Kiswahili',         flag: '🇰🇪' },
  { code: 'sv', label: 'Svenska',           flag: '🇸🇪' },
  { code: 'ta', label: 'தமிழ்',             flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు',             flag: '🇮🇳' },
  { code: 'th', label: 'ภาษาไทย',           flag: '🇹🇭' },
  { code: 'tr', label: 'Türkçe',            flag: '🇹🇷' },
  { code: 'uk', label: 'Українська',        flag: '🇺🇦' },
  { code: 'ur', label: 'اردو',              flag: '🇵🇰' },
  { code: 'vi', label: 'Tiếng Việt',        flag: '🇻🇳' },
  { code: 'yo', label: 'Yorùbá',            flag: '🇳🇬' },
  { code: 'zu', label: 'isiZulu',           flag: '🇿🇦' },
];

const LEVELS = [
  { code: 'A0', label: 'Beginner', desc: 'No prior knowledge, basic words' },
  { code: 'A1', label: 'Elementary', desc: 'Basic words and phrases' },
  { code: 'A2', label: 'Pre-Intermediate', desc: 'Simple sentences, past tense' },
  { code: 'B1', label: 'Intermediate', desc: 'Various tenses, opinions' },
  { code: 'B2', label: 'Upper-Intermediate', desc: 'Complex sentences, idioms' },
  { code: 'C1', label: 'Advanced', desc: 'Nuanced, sophisticated' },
  { code: 'C2', label: 'Proficient', desc: 'Near-native precision' },
];

// Languages where Google SpeechRecognizer (used by expo-speech-recognition)
// has no or very limited support. Voice input is hidden in the Translation
// Trainer for these users — we show a notice when they select one of these.
const SPEECH_UNSUPPORTED_LANGUAGES = [
  'Igbo', 'Hausa', 'Zulu', 'Yoruba', 'Amharic', 'Swahili',
  'Urdu', 'Punjabi', 'Gujarati', 'Marathi', 'Tamil', 'Nepali',
  'Sinhala', 'Persian',
];

// ── Initials avatar colour palette ───────────────────────────────────────────
// Seeded by the first letter so the colour is always the same for the same name
const AVATAR_COLOURS = [
  '#E57373', '#F06292', '#BA68C8', '#7986CB',
  '#4FC3F7', '#4DB6AC', '#81C784', '#FFD54F',
  '#FF8A65', '#A1887F', '#90A4AE', '#00B0FF',
  '#00E676', '#FFEA00', '#FF6D00', '#D500F9',
];

function getAvatarColour(name: string): string {
  if (!name) return AVATAR_COLOURS[0];
  const idx = name.charCodeAt(0) % AVATAR_COLOURS.length;
  return AVATAR_COLOURS[idx];
}

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name[0].toUpperCase();
}

export default function ProfileScreen() {
  const { colors: C } = useTheme();
  const { t, setLang, wt } = useLanguage();
  const ui = (key: keyof typeof t, fallback: string) => (t[key] as string | undefined) ?? fallback;

  const [mode, setMode] = useState('view');
  const [hasProfile, setHasProfile] = useState(false);

  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [age, setAge] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [nativeLanguage, setNativeLanguage] = useState('English');
  const [appLanguage, setAppLanguage] = useState('en');
  const [level, setLevel] = useState('B1');
  const [saved, setSaved] = useState(false);

  // Snapshot of profile when edit mode is entered — used to detect changes
  const [snapshot, setSnapshot] = useState(null);

  // Detect if anything changed since entering edit mode
  const hasChanges = () => {
    if (!snapshot) return false;
    return (
      name !== snapshot.name ||
      profession !== snapshot.profession ||
      qualifications !== snapshot.qualifications ||
      age !== snapshot.age ||
      hobbies !== snapshot.hobbies ||
      bio !== snapshot.bio ||
      nativeLanguage !== snapshot.nativeLanguage ||
      appLanguage !== snapshot.appLanguage ||
      level !== snapshot.level
    );
  };

  // Enter edit mode and take a snapshot of current values
  const enterEditMode = () => {
    setSnapshot({ name, profession, qualifications, age, hobbies, bio, nativeLanguage, appLanguage, level });
    setMode('edit');
  };

  // Back arrow handler: ask to save if there are unsaved changes
  const handleBack = () => {
    if (hasChanges()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. What would you like to do?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => { setMode('view'); } },
          { text: 'Save', style: 'default', onPress: () => saveProfile() },
          { text: 'Keep Editing', style: 'cancel' },
        ]
      );
    } else {
      setMode('view');
    }
  };

  useEffect(() => { loadProfile(); }, []);

  // ── Maps a phone locale code to one of the 20 auto-detect-supported languages ──────────
  const detectLanguageFromLocale = () => {
    try {
      // expo-localization gives us e.g. "es-MX", "fr-FR", "zh-Hans-CN"
      const locale = (Localization.getLocales?.()[0]?.languageTag || Localization.locale || 'en').toLowerCase();
      const lang = locale.split('-')[0]; // get just "es", "fr", "zh", etc.

      const map = {
        es:  { native: 'Spanish',          app: 'es' },
        fr:  { native: 'French',           app: 'fr' },
        de:  { native: 'German',           app: 'de' },
        pt:  { native: 'Portuguese',       app: 'pt' },
        ru:  { native: 'Russian',          app: 'ru' },
        zh:  { native: 'Mandarin Chinese', app: 'zh' },
        ja:  { native: 'Japanese',         app: 'ja' },
        ar:  { native: 'Arabic',           app: 'ar' },
        hi:  { native: 'Hindi',            app: 'hi' },
        pl:  { native: 'Polish',           app: 'pl' },
        it:  { native: 'Italian',          app: 'it' },
        cs:  { native: 'Czech',            app: 'cs' },
        af:  { native: 'Afrikaans',        app: 'af' },
        // Stage-3 additions: 7 new website-parity languages
        fil: { native: 'Filipino',         app: 'fil' },
        sk:  { native: 'Slovak',           app: 'sk' },
        te:  { native: 'Telugu',           app: 'te' },
        ps:  { native: 'Pashto',           app: 'ps' },
        ht:  { native: 'Haitian Creole',   app: 'ht' },
        gn:  { native: 'Guarani',          app: 'gn' },
        qu:  { native: 'Quechua',          app: 'qu' },
      };
      return map[lang] || null; // null = not supported, fall back to defaults
    } catch (e) {
      return null;
    }
  };
  // ────────────────────────────────────────────────────────────────────────────

  const loadProfile = async () => {
    try {
      const data = await AsyncStorage.getItem('userProfile');
      if (data) {
        // Returning user — use their saved settings
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
      } else {
        // First launch — auto-detect phone language and pre-fill
        const detected = detectLanguageFromLocale();
        if (detected) {
          setNativeLanguage(detected.native);
          setAppLanguage(detected.app);
        }
        // If no match (unsupported language), defaults to English / 'en'
      }
      const pic = await AsyncStorage.getItem('profilePic');
      if (pic) {
        // Accept both Base64 data URIs (new format) and file URIs (legacy).
        // File URIs starting with 'file://' may be stale after reinstall — keep
        // them for now so existing users don't lose their photo mid-session,
        // but they'll be replaced next time the user picks a new photo.
        setProfilePic(pic);
      } else {
        // Check for social auth photo (set by Google/Apple/Facebook login)
        const socialPhoto = await AsyncStorage.getItem('authPhotoURL');
        if (socialPhoto) setProfilePic(socialPhoto);
      }
    } catch (e) {}
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow access to your photo library.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,   // ← request Base64 data alongside the URI
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      // Build a data URI from the Base64 string — this is self-contained
      // and survives app updates, reinstalls and backups unlike a file URI.
      const base64Uri = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri; // fallback to URI if base64 unavailable (shouldn't happen)
      setProfilePic(base64Uri);
      try { await AsyncStorage.setItem('profilePic', base64Uri); } catch (e) {}
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) { Alert.alert('Name Required', 'Please enter your name.'); return; }
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        name, profession, qualifications, age, hobbies, bio,
        nativeLanguage, appLanguage, level,
        photo: profilePic || null,  // include photo so ProfileMenuButton finds it
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
      <ScreenBackground style={null}>
        <BackHeader title={wt('profile')} />
        <ScrollView contentContainerStyle={sty.content}>

          {/* ── 3D POLY-PUFF MASCOT ── */}
          <PolyPuffScene size={600} />

          {/* Profile card */}
          <View style={[ds.sectionCard, { alignItems: 'center', paddingVertical: 28 }]}>
            <View style={[sty.avatarRing, { backgroundColor: profilePic ? 'transparent' : getAvatarColour(name), borderColor: C.emerald + '40' }]}>
              {profilePic
                ? <Image source={{ uri: profilePic }} style={sty.avatarImage} />
                : <Text style={{ fontSize: 32, fontWeight: '800', color: '#fff' }}>{getInitials(name)}</Text>
              }
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
                <Text style={[sty.sectionTitle, { color: C.text }]}>{ui('aboutMe', 'About Me')}</Text>
              </View>
              <Text style={{ fontSize: 14, color: C.textSec, lineHeight: 22, marginTop: 8 }}>{bio}</Text>
            </View>
          ) : null}

          {/* Hobbies */}
          {hobbies ? (
            <View style={ds.sectionCard}>
              <View style={sty.sectionHeader}>
                <Heart size={18} color={C.red} />
                <Text style={[sty.sectionTitle, { color: C.text }]}>{ui('hobbiesInterests', 'Hobbies & Interests')}</Text>
              </View>
              <Text style={{ fontSize: 14, color: C.textSec, lineHeight: 22, marginTop: 8 }}>{hobbies}</Text>
            </View>
          ) : null}

          {/* Edit button */}
          <NeonButton title={ui('editProfile', 'Edit Profile')} onPress={() => enterEditMode()} icon={<Edit3 size={18} color="#000" />} style={{ marginBottom: 12 }} />

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenBackground>
    );
  }

  // ═══ EDIT MODE ═══
  return (
    <ScreenBackground style={null}>
        <BackHeader title={wt('profile')} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView contentContainerStyle={sty.content} keyboardShouldPersistTaps="handled">

        <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
          {/* ── BACK ARROW ── */}
          {hasProfile && (
            <TouchableOpacity
              onPress={handleBack}
              style={sty.backBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={22} color={C.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
            <View style={[sty.avatarRing, { backgroundColor: profilePic ? 'transparent' : getAvatarColour(name), borderColor: C.emerald + '40' }]}>
              {profilePic
                ? <Image source={{ uri: profilePic }} style={sty.avatarImage} />
                : <Text style={{ fontSize: 32, fontWeight: '800', color: '#fff' }}>{getInitials(name)}</Text>
              }
              <View style={[sty.cameraIcon, { backgroundColor: C.blue }]}><Camera size={12} color="#fff" /></View>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginTop: 8 }}>
            {hasProfile ? ui('editProfile', 'Edit Profile') : ui('setUpYourProfile', 'Set Up Your Profile')}
          </Text>
        </View>

        {/* ── PERSONAL INFO ── */}
        <View style={ds.sectionCard}>
          <View style={sty.sectionHeader}>
            <UserCircle size={18} color={C.blue} />
            <Text style={[sty.sectionTitle, { color: C.text }]}>{ui('personalInfo', 'Personal Info')}</Text>
          </View>
          <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, marginLeft: 26, lineHeight: 18 }}>{ui('profileDetailsNote', "Your profile details are for your benefit. We don't use this information for anything else; it simply helps the AI create exercises that match your needs, goals, interests, and English level.")}</Text>

          <View style={sty.fieldRow}>
            <UserCircle size={16} color={C.textMuted} />
            <TextInput style={[ds.input, sty.fieldInput]} placeholder={ui('namePlaceholder', 'Your name *')} placeholderTextColor={C.textMuted} value={name} onChangeText={setName} autoCapitalize="words" />
          </View>
          <View style={sty.fieldRow}>
            <Briefcase size={16} color={C.textMuted} />
            <TextInput style={[ds.input, sty.fieldInput]} placeholder={ui('professionPlaceholder', 'Profession (e.g., Teacher, Engineer, Student)')} placeholderTextColor={C.textMuted} value={profession} onChangeText={setProfession} autoCapitalize="words" />
          </View>
          <View style={sty.fieldRow}>
            <GraduationCap size={16} color={C.textMuted} />
            <TextInput style={[ds.input, sty.fieldInput]} placeholder={ui('qualificationsPlaceholder', 'Qualifications (optional)')} placeholderTextColor={C.textMuted} value={qualifications} onChangeText={setQualifications} autoCapitalize="words" />
          </View>
          <View style={sty.fieldRow}>
            <Calendar size={16} color={C.textMuted} />
            <TextInput style={[ds.input, sty.fieldInput]} placeholder={ui('agePlaceholder', 'Age (optional)')} placeholderTextColor={C.textMuted} value={age} onChangeText={setAge} keyboardType="number-pad" maxLength={3} />
          </View>
          <View style={sty.fieldRow}>
            <Heart size={16} color={C.textMuted} />
            <TextInput style={[ds.input, sty.fieldInput, { minHeight: 60, textAlignVertical: 'top' }]} placeholder={ui('hobbiesPlaceholder', 'Hobbies & interests (e.g., cooking, football, travel)')} placeholderTextColor={C.textMuted} value={hobbies} onChangeText={setHobbies} multiline autoCapitalize="sentences" />
          </View>
        </View>

        {/* ── BIO ── */}
        <View style={ds.sectionCard}>
          <View style={sty.sectionHeader}>
            <FileText size={18} color={C.purple} />
            <Text style={[sty.sectionTitle, { color: C.text }]}>{ui('aboutMe', 'About Me')}</Text>
            <View style={{ marginLeft: 'auto', backgroundColor: C.cardAlt, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: '600' }}>{ui('optionalLabel', 'Optional').toUpperCase()}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 12, marginLeft: 26 }}>
            {ui('bioHelpText', 'Describe your work duties, daily tasks, or anything about yourself. This helps us create more relevant exercises.')}
          </Text>
          <TextInput
            style={[ds.input, { minHeight: 120, textAlignVertical: 'top', lineHeight: 22 }]}
            placeholder={ui('bioPlaceholder', "e.g., I work as a project manager at a construction company. My daily tasks include writing reports, attending meetings, and communicating with international clients.\n\nI also enjoy cooking Italian food and playing chess on weekends.")}
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
            <Text style={[sty.sectionTitle, { color: C.text }]}>{t.nativeLanguage}</Text>
          </View>
          <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, marginLeft: 26 }}>{ui('nativeLanguageHelp', 'Grammar tips and translations shown in this language')}</Text>
          {/* Scrollable list — shows 5 rows at a time */}
          <View style={{ height: 260, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border + '30' }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang.name}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 12,
                    paddingHorizontal: 16, paddingVertical: 13,
                    backgroundColor: nativeLanguage === lang.name ? C.emeraldDark : 'transparent',
                    borderLeftWidth: nativeLanguage === lang.name ? 3 : 0,
                    borderLeftColor: C.emerald,
                  }}
                  onPress={() => setNativeLanguage(lang.name)}
                >
                  <Text style={{ fontSize: 22 }}>{lang.flag}</Text>
                  <Text style={{ flex: 1, fontSize: 15, fontWeight: nativeLanguage === lang.name ? '700' : '400', color: nativeLanguage === lang.name ? C.emeraldLight : C.text }}>
                    {lang.name}
                  </Text>
                  {nativeLanguage === lang.name && <CheckCircle size={16} color={C.emerald} />}
                  {/* Mic-off badge for unsupported languages */}
                  {SPEECH_UNSUPPORTED_LANGUAGES.includes(lang.name) && (
                    <Text style={{ fontSize: 13 }}>🎤🚫</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Speech recognition notice — shown when selected language is unsupported */}
          {SPEECH_UNSUPPORTED_LANGUAGES.includes(nativeLanguage) && (
            <View style={{
              flexDirection: 'row', alignItems: 'flex-start', gap: 10,
              backgroundColor: (C.amber || '#FFBE0B') + '12',
              borderRadius: 12, padding: 12, marginTop: 10,
              borderWidth: 1, borderColor: (C.amber || '#FFBE0B') + '30',
            }}>
              <Text style={{ fontSize: 20, marginTop: 1 }}>🎤</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.amber || '#FFBE0B', marginBottom: 3 }}>
                  Voice input limited for {nativeLanguage} speakers
                </Text>
                <Text style={{ fontSize: 12, color: C.textSec, lineHeight: 17 }}>
                  Google's speech recognition doesn't fully support {nativeLanguage}. Voice input will be hidden in the Translation Trainer, but you can still use it in the Placement Test. This doesn't affect any other features.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── APP LANGUAGE ── */}
        <View style={ds.sectionCard}>
          <View style={sty.sectionHeader}>
            <Languages size={18} color={C.amber} />
            <Text style={[sty.sectionTitle, { color: C.text }]}>{t.appLanguage}</Text>
          </View>
          <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, marginLeft: 26 }}>{ui('appLanguageHelp', 'Change the interface language')}</Text>
          {/* Scrollable list — matches Native Language style */}
          <View style={{ height: 260, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border + '30' }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              {APP_LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 12,
                    paddingHorizontal: 16, paddingVertical: 13,
                    backgroundColor: appLanguage === lang.code ? (C.amberDark || '#92400E') : 'transparent',
                    borderLeftWidth: appLanguage === lang.code ? 3 : 0,
                    borderLeftColor: C.amber,
                  }}
                  onPress={() => { setAppLanguage(lang.code); setLang(lang.code as any); }}
                >
                  <Text style={{ fontSize: 22 }}>{lang.flag}</Text>
                  <Text style={{ flex: 1, fontSize: 15, fontWeight: appLanguage === lang.code ? '700' : '400', color: appLanguage === lang.code ? (C.amberLight || '#FCD34D') : C.text }}>
                    {lang.label}
                  </Text>
                  {appLanguage === lang.code && <CheckCircle size={16} color={C.amber} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 8, fontStyle: 'italic' }}>
            {ui('appLanguageNote', 'Note: Full interface translations coming soon. Grammar tips already use your native language.')}
          </Text>
        </View>

        {/* ── CEFR LEVEL ── */}
        <View style={ds.sectionCard}>
          <View style={sty.sectionHeader}>
            <BookOpen size={18} color={C.purple} />
            <Text style={[sty.sectionTitle, { color: C.text }]}>{ui('englishLevelCefr', 'English Level (CEFR)')}</Text>
          </View>
          <Text style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, marginLeft: 26 }}>{ui('levelDifficultyHelp', 'Exercises will match this difficulty')}</Text>
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
            <><CheckCircle size={20} color="#fff" /><Text style={sty.saveBtnText}>{ui('savedBang', 'Saved!')}</Text></>
          ) : (
            <><Save size={20} color="#fff" /><Text style={sty.saveBtnText}>{ui('saveProfile', 'Save Profile')}</Text></>
          )}
        </TouchableOpacity>

        {hasProfile && (
          <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 12 }} onPress={() => setMode('view')}>
            <Text style={{ fontSize: 14, color: C.textMuted }}>{t.cancel}</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
      </KeyboardAvoidingView>
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
  backBtn: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)', zIndex: 10 },
});
