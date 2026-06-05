/**
 * Classroom Screen - Poly-Puff Teacher Dashboard v1.0
 * =====================================================
 *
 * Two modes in one file:
 *   TEACHER MODE — Create a class, view all classes, enter a class dashboard
 *   STUDENT MODE — Join a class with a 6-character code, see their class
 *
 * FILE: app/classroom.tsx
 * LOCATION: D:\Project\MyProject\translation-trainer-frontend\app\classroom.tsx
 *
 * Backend endpoints used (all live on Railway):
 *   POST /api/classroom/create     — teacher creates class
 *   POST /api/classroom/join       — student joins class
 *   GET  /api/classrooms           — list all classes (teacher view)
 *   GET  /api/classroom/:code      — full class data (tap to open detail)
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Alert, Modal, KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Users, Plus, LogIn, ChevronRight, BookOpen,
  Star, Clock, Award, X, RefreshCw,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenBackground, BackHeader } from '../components/PolyPuffUI';
import { scaledFont } from '../utils/accessibility';
import { getServerUrl } from '../services/api';
import { getAuthHeaders } from '../utils/auth';
import { ensureUserId } from '../utils/userId';

// ── Score colour helper ───────────────────────────────────────────────────────
function scoreColor(score, C) {
  if (!score && score !== 0) return C.textMuted;
  if (score >= 90) return C.emerald || '#34D399';
  if (score >= 75) return '#60A5FA';
  if (score >= 60) return '#FBBF24';
  return C.red || '#F87171';
}

// ── Mode selector card ────────────────────────────────────────────────────────
function ModeCard({ icon, title, desc, color, onPress }) {
  const { colors: C } = useTheme();
  return (
    <TouchableOpacity
      style={{
        flex: 1, backgroundColor: C.card || '#111827',
        borderRadius: 16, padding: 20, borderWidth: 1,
        borderColor: color + '30', alignItems: 'center', gap: 10,
        minHeight: 140,
      }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: color + '18', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </View>
      <Text style={{ fontSize: scaledFont(15), fontWeight: '700', color, textAlign: 'center' }}>{title}</Text>
      <Text style={{ fontSize: scaledFont(11), color: C.textMuted, textAlign: 'center', lineHeight: 16 }}>{desc}</Text>
    </TouchableOpacity>
  );
}

// ── Class summary card ────────────────────────────────────────────────────────
function ClassCard({ room, onPress, C }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: C.card || '#111827', borderRadius: 14,
        padding: 14, marginBottom: 10, borderWidth: 1,
        borderColor: (C.cyan || '#00D9FF') + '25', flexDirection: 'row',
        alignItems: 'center', gap: 12, minHeight: 72,
      }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open class ${room.className}`}
    >
      <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: (C.cyan || '#00D9FF') + '15', alignItems: 'center', justifyContent: 'center' }}>
        <BookOpen size={22} color={C.cyan || '#00D9FF'} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: scaledFont(15), fontWeight: '700', color: C.cyan || '#00D9FF' }}>{room.className}</Text>
        <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginTop: 2 }}>
          {room.teacherName} · {room.studentCount} student{room.studentCount !== 1 ? 's' : ''}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <View style={{ backgroundColor: (C.cyan || '#00D9FF') + '15', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.cyan || '#00D9FF', letterSpacing: 1 }}>{room.code}</Text>
          </View>
        </View>
      </View>
      <ChevronRight size={16} color={C.textMuted} />
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ClassroomScreen() {
  const { colors: C } = useTheme();
  const { t, wt } = useLanguage();
  const router = useRouter();

  const [mode,         setMode]         = useState(null); // null | 'teacher' | 'student'
  const [loading,      setLoading]      = useState(false);
  const [rooms,        setRooms]        = useState([]);
  const [joinedRoom,   setJoinedRoom]   = useState(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [showJoin,     setShowJoin]     = useState(false);

  // Create form state
  const [teacherName,  setTeacherName]  = useState('');
  const [className,    setClassName]    = useState('');

  // Join form state
  const [joinCode,     setJoinCode]     = useState('');
  const [studentName,  setStudentName]  = useState('');

  useFocusEffect(useCallback(() => {
    loadSavedMode();
  }, []));

  const loadSavedMode = async () => {
    try {
      const savedMode  = await AsyncStorage.getItem('classroomMode');
      const savedRooms = await AsyncStorage.getItem('classroomRooms');
      const savedJoined = await AsyncStorage.getItem('classroomJoined');

      // Pre-fill teacher name from profile
      const profileRaw = await AsyncStorage.getItem('userProfile');
      if (profileRaw) {
        const p = JSON.parse(profileRaw);
        if (p.name) setTeacherName(p.name);
        if (p.name) setStudentName(p.name);
      }

      if (savedMode) setMode(savedMode);
      if (savedRooms) setRooms(JSON.parse(savedRooms));
      if (savedJoined) setJoinedRoom(JSON.parse(savedJoined));

      if (savedMode === 'teacher') refreshRooms(true);
    } catch (e) {}
  };

  const selectMode = async (m) => {
    setMode(m);
    await AsyncStorage.setItem('classroomMode', m);
    if (m === 'teacher') refreshRooms(true);
  };

  // ── CREATE CLASS ─────────────────────────────────────────────────────────
  const createClass = async () => {
    if (!teacherName.trim() || !className.trim()) {
      Alert.alert('Missing Info', 'Please enter both your name and the class name.');
      return;
    }
    setLoading(true);
    try {
      const serverUrl = await getServerUrl();
      const userId = await ensureUserId();
      const authHeaders = await getAuthHeaders();
      if (!authHeaders || !userId) {
        setLoading(false);
        Alert.alert('Sign in required', 'You need to be signed in to create a class.');
        return;
      }
      const res = await fetch(`${serverUrl}/api/classroom/create`, {
        method: 'POST',
        headers: { ...authHeaders, 'X-App-User-Id': userId, 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherName: teacherName.trim(), className: className.trim() }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.code) {
        const newRoom = { code: data.code, className: data.className, teacherName: data.teacherName, studentCount: 0 };
        const updated = [...rooms, newRoom];
        setRooms(updated);
        await AsyncStorage.setItem('classroomRooms', JSON.stringify(updated));
        setShowCreate(false);
        setClassName('');
        Alert.alert('Class Created! 🎉', `Share this code with your students:\n\n${data.code}`, [{ text: 'Got it' }]);
      } else {
        Alert.alert('Error', data.error || 'Failed to create class.');
      }
    } catch (e) {
      Alert.alert('Connection Error', 'Could not reach the server. Check your internet connection.');
    }
    setLoading(false);
  };

  // ── JOIN CLASS ───────────────────────────────────────────────────────────
  const joinClass = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code || code.length !== 6) {
      Alert.alert('Invalid Code', 'Class codes are exactly 6 characters.');
      return;
    }
    if (!studentName.trim()) {
      Alert.alert('Missing Name', 'Please enter your name.');
      return;
    }
    setLoading(true);
    try {
      const profileRaw = await AsyncStorage.getItem('userProfile');
      const profile    = profileRaw ? JSON.parse(profileRaw) : {};

      const serverUrl = await getServerUrl();
      const res = await fetch(`${serverUrl}/api/classroom/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          studentName: studentName.trim(),
          nativeLanguage: profile.nativeLanguage || 'English',
          level: profile.level || 'B1',
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.classroom) {
        const joined = { ...data.classroom, studentName: studentName.trim() };
        setJoinedRoom(joined);
        await AsyncStorage.setItem('classroomJoined', JSON.stringify(joined));
        setShowJoin(false);
        setJoinCode('');
        Alert.alert('Joined! 🎉', `You've joined "${data.classroom.className}" taught by ${data.classroom.teacherName}.`);
      } else {
        Alert.alert('Error', data.error || 'Failed to join class. Check the code and try again.');
      }
    } catch (e) {
      Alert.alert('Connection Error', 'Could not reach the server.');
    }
    setLoading(false);
  };

  // ── REFRESH ROOMS LIST ───────────────────────────────────────────────────
  // Fetches the authoritative list of this teacher's classes from the server,
  // so a fresh install or new device sees existing classes.
  const refreshRooms = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const serverUrl = await getServerUrl();
      const userId = await ensureUserId();
      const authHeaders = await getAuthHeaders();
      if (!authHeaders || !userId) {
        if (!silent) setLoading(false);
        return;
      }
      const res = await fetch(`${serverUrl}/api/classrooms`, {
        headers: { ...authHeaders, 'X-App-User-Id': userId },
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      const serverRooms = (data.classrooms || []).map(r => ({
        code: r.code,
        className: r.className,
        teacherName: r.teacherName,
        studentCount: r.studentCount || 0,
      }));
      setRooms(serverRooms);
      await AsyncStorage.setItem('classroomRooms', JSON.stringify(serverRooms));
    } catch (e) {}
    if (!silent) setLoading(false);
  };

  const leaveClass = async () => {
    Alert.alert('Leave Class', 'Are you sure you want to leave this class?', [
      { text: t.cancel, style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: async () => {
        setJoinedRoom(null);
        await AsyncStorage.removeItem('classroomJoined');
      }},
    ]);
  };

  const resetMode = async () => {
    Alert.alert('Switch Mode', 'This will clear your current classroom data. Continue?', [
      { text: t.cancel, style: 'cancel' },
      { text: wt('continue'), style: 'destructive', onPress: async () => {
        setMode(null);
        setRooms([]);
        setJoinedRoom(null);
        await AsyncStorage.multiRemove(['classroomMode', 'classroomRooms', 'classroomJoined']);
      }},
    ]);
  };

  // ── RENDER ───────────────────────────────────────────────────────────────

  return (
    <ScreenBackground style={null}>
      <BackHeader
        title={wt('classroom')}
        subtitle={wt('webapp-classroom-desc')}
        onPress={() => router.back()}
        rightElement={null}
        style={null}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        <Text style={{ fontSize: scaledFont(26), fontWeight: '800', color: C.text, marginTop: 10, marginBottom: 4 }}>
          {wt('classroom')}
        </Text>
        <Text style={{ fontSize: scaledFont(13), color: C.textMuted, marginBottom: 20 }}>
          {wt('webapp-classroom-desc')}
        </Text>

        {/* ── MODE SELECTOR ──────────────────────────────────────────── */}
        {!mode && (
          <>
            <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: C.textMuted, letterSpacing: 1, marginBottom: 12 }}>
              {wt('tour-cls-s3-title').toUpperCase()}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
              <ModeCard
                icon={<Award size={24} color="#A78BFA" />}
                title="Teacher"
                desc="Create a class, manage students, view analytics"
                color="#A78BFA"
                onPress={() => selectMode('teacher')}
              />
              <ModeCard
                icon={<BookOpen size={24} color="#34D399" />}
                title="Student"
                desc="Join a class with your teacher's code"
                color="#34D399"
                onPress={() => selectMode('student')}
              />
            </View>
          </>
        )}

        {/* ── TEACHER MODE ─────────────────────────────────────────── */}
        {mode === 'teacher' && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Award size={16} color="#A78BFA" />
              <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: '#A78BFA', letterSpacing: 0.5 }}>
                TEACHER MODE
              </Text>
              <TouchableOpacity onPress={resetMode} style={{ marginLeft: 'auto', minWidth: 44, minHeight: 32, alignItems: 'center', justifyContent: 'center' }}
                accessibilityRole="button" accessibilityLabel={wt('continue')}>
                <Text style={{ fontSize: scaledFont(11), color: C.textMuted }}>Switch</Text>
              </TouchableOpacity>
            </View>

            {/* Create class button */}
            <TouchableOpacity
              style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: 8, backgroundColor: '#A78BFA18', borderRadius: 14,
                paddingVertical: 14, marginBottom: 16, borderWidth: 1,
                borderColor: '#A78BFA40', minHeight: 52,
              }}
              onPress={() => setShowCreate(true)}
              accessibilityRole="button" accessibilityLabel="Create new class"
            >
              <Plus size={18} color="#A78BFA" />
              <Text style={{ fontSize: scaledFont(15), fontWeight: '700', color: '#A78BFA' }}>Create New Class</Text>
            </TouchableOpacity>

            {/* Class list */}
            {rooms.length > 0 && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ flex: 1, fontSize: scaledFont(13), fontWeight: '700', color: C.textMuted, letterSpacing: 0.5 }}>
                    MY CLASSES ({rooms.length})
                  </Text>
                  <TouchableOpacity onPress={() => refreshRooms(false)} style={{ minWidth: 44, minHeight: 32, alignItems: 'center', justifyContent: 'center' }}
                    accessibilityRole="button" accessibilityLabel={t.retry}>
                    {loading ? <ActivityIndicator size="small" color={C.textMuted} /> : <RefreshCw size={14} color={C.textMuted} />}
                  </TouchableOpacity>
                </View>
                {rooms.map(room => (
                  <ClassCard
                    key={room.code}
                    room={room}
                    C={C}
                    onPress={() => router.push({
                      pathname: '/classroom-detail',
                      params: { code: room.code, className: room.className, teacherName: room.teacherName },
                    })}
                  />
                ))}
              </>
            )}

            {rooms.length === 0 && (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🏫</Text>
                <Text style={{ fontSize: scaledFont(15), fontWeight: '700', color: C.text, marginBottom: 6 }}>No classes yet</Text>
                <Text style={{ fontSize: scaledFont(13), color: C.textMuted, textAlign: 'center' }}>
                  Create your first class and share the code with your students.
                </Text>
              </View>
            )}
          </>
        )}

        {/* ── STUDENT MODE ─────────────────────────────────────────── */}
        {mode === 'student' && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <BookOpen size={16} color="#34D399" />
              <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: '#34D399', letterSpacing: 0.5 }}>
                STUDENT MODE
              </Text>
              <TouchableOpacity onPress={resetMode} style={{ marginLeft: 'auto', minWidth: 44, minHeight: 32, alignItems: 'center', justifyContent: 'center' }}
                accessibilityRole="button" accessibilityLabel={wt('continue')}>
                <Text style={{ fontSize: scaledFont(11), color: C.textMuted }}>Switch</Text>
              </TouchableOpacity>
            </View>

            {!joinedRoom ? (
              <>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: 8, backgroundColor: '#34D39918', borderRadius: 14,
                    paddingVertical: 14, marginBottom: 24, borderWidth: 1,
                    borderColor: '#34D39940', minHeight: 52,
                  }}
                  onPress={() => setShowJoin(true)}
                  accessibilityRole="button" accessibilityLabel="Join a class"
                >
                  <LogIn size={18} color="#34D399" />
                  <Text style={{ fontSize: scaledFont(15), fontWeight: '700', color: '#34D399' }}>Join a Class</Text>
                </TouchableOpacity>

                <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                  <Text style={{ fontSize: 40, marginBottom: 12 }}>🎓</Text>
                  <Text style={{ fontSize: scaledFont(15), fontWeight: '700', color: C.text, marginBottom: 6 }}>Not in a class yet</Text>
                  <Text style={{ fontSize: scaledFont(13), color: C.textMuted, textAlign: 'center' }}>
                    Ask your teacher for the 6-character class code, then tap "Join a Class" above.
                  </Text>
                </View>
              </>
            ) : (
              <>
                {/* Joined class card */}
                <View style={{
                  backgroundColor: C.card || '#111827', borderRadius: 16, padding: 16,
                  marginBottom: 16, borderWidth: 1, borderColor: '#34D39930',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#34D39918', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={24} color="#34D399" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: scaledFont(17), fontWeight: '800', color: '#34D399' }}>{joinedRoom.className}</Text>
                      <Text style={{ fontSize: scaledFont(12), color: C.textMuted, marginTop: 2 }}>
                        Teacher: {joinedRoom.teacherName}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1, backgroundColor: '#34D39918', borderRadius: 10, paddingVertical: 10,
                        alignItems: 'center', borderWidth: 1, borderColor: '#34D39940', minHeight: 44,
                      }}
                      onPress={() => router.push({
                        pathname: '/classroom-detail',
                        params: { code: joinedRoom.code, className: joinedRoom.className, teacherName: joinedRoom.teacherName, studentMode: 'true' },
                      })}
                      accessibilityRole="button" accessibilityLabel={wt('classroom-details')}
                    >
                      <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: '#34D399' }}>View Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: (C.red || '#EF4444') + '15', borderRadius: 10, paddingVertical: 10,
                        paddingHorizontal: 16, alignItems: 'center', borderWidth: 1,
                        borderColor: (C.red || '#EF4444') + '30', minHeight: 44, justifyContent: 'center',
                      }}
                      onPress={leaveClass}
                      accessibilityRole="button" accessibilityLabel="Leave class"
                    >
                      <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: C.red || '#EF4444' }}>Leave</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{
                  backgroundColor: C.card || '#111827', borderRadius: 12, padding: 14,
                  borderWidth: 1, borderColor: (C.border || '#374151') + '20',
                }}>
                  <Text style={{ fontSize: scaledFont(12), color: C.textMuted, lineHeight: 18 }}>
                    💡 Your scores are automatically submitted to this class when you complete exercises. Keep practising to climb the leaderboard!
                  </Text>
                </View>
              </>
            )}
          </>
        )}

      </ScrollView>

      {/* ── CREATE CLASS MODAL ──────────────────────────────────────────── */}
      <Modal visible={showCreate} transparent animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} activeOpacity={1} onPress={() => setShowCreate(false)} />
          <View style={{
            backgroundColor: C.card || '#111827', borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#A78BFA30',
          }} accessibilityViewIsModal={true}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ flex: 1, fontSize: scaledFont(18), fontWeight: '800', color: C.text }} accessibilityRole="header">Create New Class</Text>
              <TouchableOpacity onPress={() => setShowCreate(false)} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                accessibilityRole="button" accessibilityLabel={t.cancel}>
                <X size={22} color={C.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: scaledFont(11), fontWeight: '700', color: C.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>YOUR NAME</Text>
            <TextInput
              style={{ backgroundColor: C.bg || '#0A0E1A', borderRadius: 10, padding: 14, fontSize: scaledFont(15), color: C.text, borderWidth: 1, borderColor: (C.border || '#374151') + '30', marginBottom: 14 }}
              placeholder="e.g. Mrs Smith"
              placeholderTextColor={C.textMuted}
              value={teacherName}
              onChangeText={setTeacherName}
              autoCapitalize="words"
              accessibilityLabel={t.profile}
            />

            <Text style={{ fontSize: scaledFont(11), fontWeight: '700', color: C.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>CLASS NAME</Text>
            <TextInput
              style={{ backgroundColor: C.bg || '#0A0E1A', borderRadius: 10, padding: 14, fontSize: scaledFont(15), color: C.text, borderWidth: 1, borderColor: (C.border || '#374151') + '30', marginBottom: 20 }}
              placeholder="e.g. Grade 9 English"
              placeholderTextColor={C.textMuted}
              value={className}
              onChangeText={setClassName}
              autoCapitalize="words"
              accessibilityLabel={wt('classroom')}
            />

            <TouchableOpacity
              style={{
                backgroundColor: '#A78BFA18', borderRadius: 12, paddingVertical: 14,
                alignItems: 'center', borderWidth: 1, borderColor: '#A78BFA40', minHeight: 52,
                opacity: loading ? 0.7 : 1,
              }}
              onPress={createClass}
              disabled={loading}
              accessibilityRole="button" accessibilityLabel="Create class"
            >
              {loading
                ? <ActivityIndicator size="small" color="#A78BFA" />
                : <Text style={{ fontSize: scaledFont(16), fontWeight: '700', color: '#A78BFA' }}>Create Class</Text>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── JOIN CLASS MODAL ─────────────────────────────────────────────── */}
      <Modal visible={showJoin} transparent animationType="slide" onRequestClose={() => setShowJoin(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} activeOpacity={1} onPress={() => setShowJoin(false)} />
          <View style={{
            backgroundColor: C.card || '#111827', borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#34D39930',
          }} accessibilityViewIsModal={true}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ flex: 1, fontSize: scaledFont(18), fontWeight: '800', color: C.text }} accessibilityRole="header">Join a Class</Text>
              <TouchableOpacity onPress={() => setShowJoin(false)} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                accessibilityRole="button" accessibilityLabel={t.cancel}>
                <X size={22} color={C.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: scaledFont(11), fontWeight: '700', color: C.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>YOUR NAME</Text>
            <TextInput
              style={{ backgroundColor: C.bg || '#0A0E1A', borderRadius: 10, padding: 14, fontSize: scaledFont(15), color: C.text, borderWidth: 1, borderColor: (C.border || '#374151') + '30', marginBottom: 14 }}
              placeholder="Your full name"
              placeholderTextColor={C.textMuted}
              value={studentName}
              onChangeText={setStudentName}
              autoCapitalize="words"
              accessibilityLabel={t.profile}
            />

            <Text style={{ fontSize: scaledFont(11), fontWeight: '700', color: C.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>CLASS CODE</Text>
            <TextInput
              style={{
                backgroundColor: C.bg || '#0A0E1A', borderRadius: 10, padding: 14,
                fontSize: scaledFont(22), fontWeight: '800', color: '#34D399',
                borderWidth: 1, borderColor: '#34D39930', marginBottom: 20,
                letterSpacing: 4, textAlign: 'center',
              }}
              placeholder="ABC123"
              placeholderTextColor={C.textMuted}
              value={joinCode}
              onChangeText={t => setJoinCode(t.toUpperCase())}
              autoCapitalize="characters"
              maxLength={6}
              accessibilityLabel="6-character class code"
            />

            <TouchableOpacity
              style={{
                backgroundColor: '#34D39918', borderRadius: 12, paddingVertical: 14,
                alignItems: 'center', borderWidth: 1, borderColor: '#34D39940', minHeight: 52,
                opacity: loading ? 0.7 : 1,
              }}
              onPress={joinClass}
              disabled={loading}
              accessibilityRole="button" accessibilityLabel="Join class"
            >
              {loading
                ? <ActivityIndicator size="small" color="#34D399" />
                : <Text style={{ fontSize: scaledFont(16), fontWeight: '700', color: '#34D399' }}>Join Class</Text>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </ScreenBackground>
  );
}
