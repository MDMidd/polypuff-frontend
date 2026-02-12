/**
 * Classroom Screen - Poly-Puff v6.2
 * ==============================================
 * 
 * Two modes:
 *   Teacher: Create class → share code → view dashboard (leaderboard, weak areas, submissions)
 *   Student: Enter code → join class → see class info
 * 
 * FILE: app/classroom.tsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  TextInput, ActivityIndicator, Alert, Share, RefreshControl, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Users, UserPlus, Trophy, BookOpen, Share2, Copy,
  Crown, Target, ChevronRight, Plus, LogIn, BarChart3,
  Brain, Headphones, Layers, ClipboardList, X as XIcon, Check,
} from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { getServerUrl } from '../services/api';
import { hapticSelection, hapticSuccess } from '../services/sounds';

export default function ClassroomScreen() {
  const { colors: C } = useTheme();

  const [mode, setMode] = useState(null); // null (pick), 'teacher', 'student'
  const [name, setName] = useState('');

  // Teacher state
  const [className, setClassName] = useState('');
  const [createdCode, setCreatedCode] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Student state
  const [joinCode, setJoinCode] = useState('');
  const [joinedClass, setJoinedClass] = useState(null);
  const [joining, setJoining] = useState(false);

  const [savedClasses, setSavedClasses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { loadSaved(); }, []));

  const loadSaved = async () => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      if (profile) { const p = JSON.parse(profile); if (p.name) setName(p.name); }
      const classes = await AsyncStorage.getItem('myClassrooms');
      if (classes) {
        const list = JSON.parse(classes);
        setSavedClasses(list);
        // Auto-load if there's a saved class
        if (list.length > 0 && list[0].role === 'teacher') {
          setMode('teacher');
          setCreatedCode(list[0].code);
          loadDashboard(list[0].code);
          loadAssignments(list[0].code);
        } else if (list.length > 0 && list[0].role === 'student') {
          setMode('student');
          setJoinedClass(list[0]);
        }
      }
    } catch (e) {}
  };

  const saveClass = async (classInfo) => {
    try {
      const existing = await AsyncStorage.getItem('myClassrooms');
      const list = existing ? JSON.parse(existing) : [];
      // Avoid duplicates
      if (!list.find(c => c.code === classInfo.code)) {
        list.unshift(classInfo);
        await AsyncStorage.setItem('myClassrooms', JSON.stringify(list));
        setSavedClasses(list);
      }
    } catch (e) {}
  };

  const loadDashboard = async (code) => {
    setDashboardLoading(true);
    try {
      const resp = await fetch(`${getServerUrl()}/api/classroom/${code}`);
      if (!resp.ok) throw new Error('Not found');
      setDashboardData(await resp.json());
    } catch (e) {
      console.error('Dashboard load failed:', e);
    }
    setDashboardLoading(false);
  };

  const handleCreate = async () => {
    if (!name.trim() || !className.trim()) {
      Alert.alert('Missing Info', 'Please enter your name and a class name.');
      return;
    }
    try {
      const resp = await fetch(`${getServerUrl()}/api/classroom/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherName: name.trim(), className: className.trim() }),
      });
      const data = await resp.json();
      if (data.code) {
        hapticSuccess();
        setCreatedCode(data.code);
        saveClass({ code: data.code, className: className.trim(), role: 'teacher' });
        loadDashboard(data.code);
        loadAssignments(data.code);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not create class. Is the server running?');
    }
  };

  const handleJoin = async () => {
    if (!name.trim() || !joinCode.trim()) {
      Alert.alert('Missing Info', 'Please enter your name and the class code.');
      return;
    }
    setJoining(true);
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      const p = profile ? JSON.parse(profile) : {};
      const resp = await fetch(`${getServerUrl()}/api/classroom/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: joinCode.trim().toUpperCase(),
          studentName: name.trim(),
          nativeLanguage: p.nativeLanguage || 'Unknown',
          level: p.level || 'B1',
        }),
      });
      const data = await resp.json();
      if (data.error) { Alert.alert('Error', data.error); }
      else {
        hapticSuccess();
        const info = { code: joinCode.trim().toUpperCase(), className: data.classroom.className, teacherName: data.classroom.teacherName, role: 'student' };
        setJoinedClass(info);
        saveClass(info);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not join class. Check the code and server connection.');
    }
    setJoining(false);
  };

  const handleShare = async (code) => {
    try {
      await Share.share({ message: `Join my Poly-Puff class! Use code: ${code}` });
    } catch (e) {}
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (createdCode) await loadDashboard(createdCode);
    setRefreshing(false);
  };

  const getScoreColor = (s) => s >= 80 ? C.emerald : s >= 60 ? C.amber : C.red;
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignType, setAssignType] = useState('quiz');
  const [activeTab, setActiveTab] = useState('dashboard');

  const loadAssignments = async (code) => {
    try {
      const resp = await fetch(`${getServerUrl()}/api/classroom/${code}/assignments`);
      if (resp.ok) { const data = await resp.json(); setAssignments(data.assignments || []); }
    } catch (e) {}
  };

  const handleCreateAssignment = async () => {
    if (!assignTitle.trim()) { Alert.alert('Missing', 'Enter a title.'); return; }
    try {
      const resp = await fetch(`${getServerUrl()}/api/classroom/assign`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: createdCode, type: assignType, title: assignTitle.trim(), config: {} }),
      });
      const data = await resp.json();
      if (data.assignment) { hapticSuccess(); setShowAssignModal(false); setAssignTitle(''); loadAssignments(createdCode); }
    } catch (e) { Alert.alert('Error', 'Could not create assignment.'); }
  };

  const ASSIGN_TYPES = [
    { key: 'quiz', label: 'Grammar Quiz', color: '#8B5CF6' },
    { key: 'listening', label: 'Listening', color: '#3B82F6' },
    { key: 'vocab', label: 'Vocabulary', color: '#F59E0B' },
    { key: 'translation', label: 'Translation', color: '#10B981' },
  ];

  // ── MODE PICKER ──
  if (!mode) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={{ fontSize: 26, fontWeight: '800', color: C.text, marginTop: 10 }}>Classroom</Text>
          <Text style={{ fontSize: 13, color: C.textSec, marginTop: 2, marginBottom: 24 }}>Learn together with your class</Text>

          {/* Saved classes */}
          {savedClasses.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.textSec, marginBottom: 8 }}>Your Classes</Text>
              {savedClasses.map((c, i) => (
                <TouchableOpacity
                  key={i}
                  style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border + '20' }}
                  onPress={() => {
                    if (c.role === 'teacher') { setMode('teacher'); setCreatedCode(c.code); loadDashboard(c.code); }
                    else { setMode('student'); setJoinedClass(c); }
                  }}
                >
                  {c.role === 'teacher' ? <Crown size={20} color={C.amber} /> : <Users size={20} color={C.blue} />}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>{c.className}</Text>
                    <Text style={{ fontSize: 12, color: C.textMuted }}>Code: {c.code} • {c.role === 'teacher' ? 'Teacher' : `Teacher: ${c.teacherName}`}</Text>
                  </View>
                  <ChevronRight size={18} color={C.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Mode selection cards */}
          <TouchableOpacity
            style={{ backgroundColor: C.card, borderRadius: 16, padding: 24, marginBottom: 12, borderWidth: 1, borderColor: C.amber + '30', borderLeftWidth: 4, borderLeftColor: C.amber }}
            onPress={() => { hapticSelection(); setMode('teacher'); }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Crown size={28} color={C.amber} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>I'm a Teacher</Text>
                <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Create a class and share the code with your students. View their progress, scores, and weak areas.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: C.card, borderRadius: 16, padding: 24, marginBottom: 12, borderWidth: 1, borderColor: C.blue + '30', borderLeftWidth: 4, borderLeftColor: C.blue }}
            onPress={() => { hapticSelection(); setMode('student'); }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <UserPlus size={28} color={C.blue} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>I'm a Student</Text>
                <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Enter your teacher's class code to join. Your scores will appear on the class leaderboard.</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── TEACHER: CREATE & DASHBOARD ──
  if (mode === 'teacher') {
    if (!createdCode) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <TouchableOpacity onPress={() => setMode(null)}><Text style={{ fontSize: 14, color: C.blue, marginTop: 10 }}>← Back</Text></TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: '800', color: C.text, marginTop: 12 }}>Create a Class</Text>
            <Text style={{ fontSize: 13, color: C.textSec, marginTop: 2, marginBottom: 24 }}>Students will join using a 6-character code</Text>

            <Text style={{ fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 6 }}>Your Name</Text>
            <TextInput style={{ backgroundColor: C.card, borderRadius: 12, padding: 14, fontSize: 16, color: C.text, borderWidth: 1, borderColor: C.border + '30', marginBottom: 16 }} value={name} onChangeText={setName} placeholder="Teacher name" placeholderTextColor={C.textMuted} />

            <Text style={{ fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 6 }}>Class Name</Text>
            <TextInput style={{ backgroundColor: C.card, borderRadius: 12, padding: 14, fontSize: 16, color: C.text, borderWidth: 1, borderColor: C.border + '30', marginBottom: 24 }} value={className} onChangeText={setClassName} placeholder="e.g., English B1 - Monday" placeholderTextColor={C.textMuted} />

            <TouchableOpacity style={{ backgroundColor: C.amber, borderRadius: 14, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }} onPress={handleCreate}>
              <Plus size={20} color="#fff" /><Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>Create Class</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      );
    }

    // Dashboard
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={C.emerald} />}>
          <TouchableOpacity onPress={() => { setMode(null); setCreatedCode(null); setDashboardData(null); }}><Text style={{ fontSize: 14, color: C.blue, marginTop: 10 }}>← Back</Text></TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '800', color: C.text }}>{dashboardData?.className || 'Class'}</Text>
              <Text style={{ fontSize: 13, color: C.textSec }}>{dashboardData?.studentCount || 0} students • {dashboardData?.totalSubmissions || 0} submissions</Text>
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.amber + '15', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: C.amber + '30' }} onPress={() => handleShare(createdCode)}>
              <Share2 size={16} color={C.amber} />
              <Text style={{ fontSize: 15, fontWeight: '800', color: C.amber, letterSpacing: 1 }}>{createdCode}</Text>
            </TouchableOpacity>
          </View>

          {/* Tab toggle */}
          <View style={{ flexDirection: 'row', backgroundColor: C.cardAlt, borderRadius: 12, padding: 3, marginBottom: 16 }}>
            {['dashboard','assignments'].map(tab => (
              <TouchableOpacity key={tab} style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: activeTab === tab ? C.card : 'transparent', alignItems: 'center' }}
                onPress={() => setActiveTab(tab)}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: activeTab === tab ? C.text : C.textMuted }}>{tab === 'dashboard' ? 'Dashboard' : 'Assignments'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {dashboardLoading ? (
            <ActivityIndicator size="large" color={C.blue} style={{ marginTop: 40 }} />
          ) : dashboardData ? (<>
            {activeTab === 'dashboard' && (<>
            {/* Leaderboard */}
            <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border + '20' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Trophy size={18} color={C.amber} />
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>Leaderboard</Text>
              </View>
              {dashboardData.leaderboard?.length === 0 && <Text style={{ fontSize: 14, color: C.textMuted }}>No students yet. Share the code!</Text>}
              {dashboardData.leaderboard?.map((s, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border + '15', gap: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: i === 0 ? C.amber : i === 1 ? C.textSec : C.textMuted, width: 24 }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>{s.name}</Text>
                    <Text style={{ fontSize: 12, color: C.textMuted }}>{s.nativeLanguage} • {s.level} • {s.exercisesCompleted} exercises</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.amber }}>{s.totalXP} XP</Text>
                    <Text style={{ fontSize: 11, color: getScoreColor(s.averageScore) }}>Avg: {s.averageScore}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Class weak areas */}
            {dashboardData.weakAreas?.length > 0 && (
              <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border + '20' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Target size={18} color={C.red} />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>Class Weak Areas</Text>
                </View>
                {dashboardData.weakAreas.map((w, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, color: C.text, flex: 1 }}>{w.topic}</Text>
                    <View style={{ flex: 1, height: 6, backgroundColor: C.cardAlt, borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${Math.min((w.count / (dashboardData.weakAreas[0]?.count || 1)) * 100, 100)}%`, backgroundColor: C.red, borderRadius: 3 }} />
                    </View>
                    <Text style={{ fontSize: 12, color: C.textMuted, width: 30, textAlign: 'right' }}>{w.count}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recent submissions */}
            {dashboardData.recentSubmissions?.length > 0 && (
              <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border + '20' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <BarChart3 size={18} color={C.blue} />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>Recent Activity</Text>
                </View>
                {dashboardData.recentSubmissions.slice(0, 10).map((sub, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border + '10' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>{sub.studentName}</Text>
                      <Text style={{ fontSize: 11, color: C.textMuted }}>{sub.topic || 'Exercise'}</Text>
                    </View>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: getScoreColor(sub.score) + '15', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: getScoreColor(sub.score) }}>{sub.score}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            </>)}

            {/* ═══ ASSIGNMENTS TAB ═══ */}
            {activeTab === 'assignments' && (<>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.emerald, borderRadius: 14, paddingVertical: 14, marginBottom: 16 }}
                onPress={() => setShowAssignModal(true)}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>+ Create Assignment</Text>
              </TouchableOpacity>
              {assignments.length === 0 && (
                <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: C.border + '20' }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: C.text, marginTop: 8 }}>No Assignments Yet</Text>
                  <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginTop: 4 }}>Create quizzes, listening, or vocab reviews for your students.</Text>
                </View>
              )}
              {assignments.map((a, i) => (
                <View key={i} style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: C.border + '20', borderLeftWidth: 4, borderLeftColor: (ASSIGN_TYPES.find(t=>t.key===a.type)||{}).color || C.blue }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{a.title}</Text>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>{a.type} • {a.submissionCount} submitted{a.averageScore !== null ? ` • Avg: ${a.averageScore}%` : ''}</Text>
                  {a.submissions?.slice(-3).reverse().map((sub, j) => (
                    <View key={j} style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 6 }}>
                      <Text style={{ flex: 1, fontSize: 13, color: C.text }}>{sub.studentName}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: getScoreColor(sub.score) }}>{sub.score}%</Text>
                    </View>
                  ))}
                </View>
              ))}
            </>)}

          </>) : null}

          {/* Assignment creation modal */}
          <Modal visible={showAssignModal} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
              <View style={{ backgroundColor: C.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: C.text }}>New Assignment</Text>
                  <TouchableOpacity onPress={() => setShowAssignModal(false)}>
                    <XIcon size={24} color={C.textMuted} />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.textMuted, marginBottom: 8, letterSpacing: 1 }}>TYPE</Text>
                {ASSIGN_TYPES.map(t => (
                  <TouchableOpacity key={t.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, marginBottom: 6, borderWidth: 2, borderColor: assignType === t.key ? t.color : C.border, backgroundColor: assignType === t.key ? t.color + '10' : C.card }}
                    onPress={() => setAssignType(t.key)}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: t.color }} />
                    <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.text }}>{t.label}</Text>
                    {assignType === t.key && <Check size={16} color={t.color} />}
                  </TouchableOpacity>
                ))}
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.textMuted, marginBottom: 8, marginTop: 16, letterSpacing: 1 }}>TITLE</Text>
                <TextInput style={{ backgroundColor: C.card, borderRadius: 12, padding: 14, fontSize: 16, color: C.text, borderWidth: 1, borderColor: C.border + '30', marginBottom: 20 }}
                  value={assignTitle} onChangeText={setAssignTitle} placeholder="e.g., Week 3 Grammar Quiz" placeholderTextColor={C.textMuted} />
                <TouchableOpacity style={{ backgroundColor: C.emerald, borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}
                  onPress={handleCreateAssignment}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Create & Assign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── STUDENT: JOIN ──
  if (mode === 'student') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <TouchableOpacity onPress={() => { setMode(null); setJoinedClass(null); }}><Text style={{ fontSize: 14, color: C.blue, marginTop: 10 }}>← Back</Text></TouchableOpacity>

          {joinedClass ? (
            <View style={{ marginTop: 12 }}>
              <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: C.emerald + '30' }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🎓</Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: C.text }}>{joinedClass.className}</Text>
                <Text style={{ fontSize: 14, color: C.textSec, marginTop: 4 }}>Teacher: {joinedClass.teacherName}</Text>
                <View style={{ backgroundColor: C.emerald + '15', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, marginTop: 12, borderWidth: 1, borderColor: C.emerald + '30' }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: C.emerald }}>✓ You're in this class</Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, color: C.textMuted, textAlign: 'center', marginTop: 16, lineHeight: 20 }}>
                Your practice scores will automatically appear on your teacher's dashboard. Keep practicing!
              </Text>
            </View>
          ) : (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: C.text }}>Join a Class</Text>
              <Text style={{ fontSize: 13, color: C.textSec, marginTop: 2, marginBottom: 24 }}>Enter the code your teacher gave you</Text>

              <Text style={{ fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 6 }}>Your Name</Text>
              <TextInput style={{ backgroundColor: C.card, borderRadius: 12, padding: 14, fontSize: 16, color: C.text, borderWidth: 1, borderColor: C.border + '30', marginBottom: 16 }} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={C.textMuted} />

              <Text style={{ fontSize: 13, fontWeight: '600', color: C.textSec, marginBottom: 6 }}>Class Code</Text>
              <TextInput
                style={{ backgroundColor: C.card, borderRadius: 12, padding: 14, fontSize: 24, fontWeight: '800', color: C.text, borderWidth: 1, borderColor: C.border + '30', marginBottom: 24, textAlign: 'center', letterSpacing: 4 }}
                value={joinCode}
                onChangeText={(t) => setJoinCode(t.toUpperCase())}
                placeholder="ABC123"
                placeholderTextColor={C.textMuted}
                autoCapitalize="characters"
                maxLength={6}
              />

              <TouchableOpacity
                style={{ backgroundColor: C.blue, borderRadius: 14, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: joining ? 0.5 : 1 }}
                onPress={handleJoin}
                disabled={joining}
              >
                {joining ? <ActivityIndicator color="#fff" /> : (<><LogIn size={20} color="#fff" /><Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>Join Class</Text></>)}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
