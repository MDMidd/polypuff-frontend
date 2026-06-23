/**
 * Classroom Detail Screen - Poly-Puff Teacher Dashboard v1.0
 * =============================================================
 *
 * Full class analytics for teachers. Shows:
 *   - Stats row: students, submissions, avg score
 *   - Leaderboard: students ranked by XP with scores and session counts
 *   - Weak area heatmap: error categories ranked by frequency across class
 *   - Assignment manager: create and view assignments
 *   - Recent submissions: live activity feed
 *
 * Also works in student mode (studentMode param = 'true'):
 *   - Shows leaderboard (student can see their rank)
 *   - Shows class weak areas
 *   - Hides assignment creation
 *
 * FILE: app/classroom-detail.tsx
 * LOCATION: D:\Project\MyProject\translation-trainer-frontend\app\classroom-detail.tsx
 *
 * Backend endpoints used:
 *   GET  /api/classroom/:code              — full class data
 *   GET  /api/classroom/:code/assignments  — assignment list
 *   POST /api/classroom/assign             — create assignment
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Alert, Modal, RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import {
  Users, TrendingUp, Award, Zap, Plus, X,
  BookOpen, Target, MessageSquare, ClipboardList,
  CheckCircle, Clock,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenBackground, BackHeader } from '../components/PolyPuffUI';
import { scaledFont } from '../utils/accessibility';
import { getServerUrl } from '../services/api';
import { getAuthHeaders } from '../utils/auth';
import { ensureUserId } from '../utils/userId';

// Medal colours for top 3
const MEDALS = ['🥇', '🥈', '🥉'];
const RANK_COLORS = ['#FBBF24', '#9CA3AF', '#B45309'];

// Score colour helper
function scoreColor(score, C) {
  if (!score && score !== 0) return C.textMuted;
  if (score >= 90) return C.emerald || '#34D399';
  if (score >= 75) return '#60A5FA';
  if (score >= 60) return '#FBBF24';
  return C.red || '#F87171';
}

// Weak area colours
const HEATMAP_COLORS = ['#EF4444','#FB923C','#FBBF24','#34D399','#60A5FA','#A78BFA','#F472B6','#00D9FF'];

// Assignment type config
const ASSIGNMENT_TYPES = [
  { id: 'translation', label: 'Translation',  icon: '🎯', color: '#00D9FF' },
  { id: 'quiz',        label: 'Grammar Quiz', icon: '🧠', color: '#34D399' },
  { id: 'listening',   label: 'Listening',    icon: '🎧', color: '#A78BFA' },
  { id: 'writing',     label: 'Writing',      icon: '✏️',  color: '#F472B6' },
  { id: 'vocab',       label: 'Vocabulary',   icon: '📖', color: '#FBBF24' },
];

// ── Leaderboard row ───────────────────────────────────────────────────────────
function LeaderRow({ student, rank, C, isCurrentUser }) {
  const medal = rank <= 3 ? MEDALS[rank - 1] : null;
  const rankColor = rank <= 3 ? RANK_COLORS[rank - 1] : C.textMuted;

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14,
      borderBottomWidth: 1, borderBottomColor: (C.border || '#374151') + '15',
      backgroundColor: isCurrentUser ? (C.cyan || '#00D9FF') + '08' : 'transparent',
    }}>
      {/* Rank */}
      <View style={{ width: 32, alignItems: 'center' }}>
        {medal
          ? <Text style={{ fontSize: 18 }}>{medal}</Text>
          : <Text style={{ fontSize: scaledFont(14), fontWeight: '800', color: rankColor }}>#{rank}</Text>
        }
      </View>

      {/* Name + stats */}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: isCurrentUser ? C.cyan || '#00D9FF' : C.text }}>
            {student.name}
          </Text>
          {isCurrentUser && (
            <View style={{ backgroundColor: (C.cyan || '#00D9FF') + '20', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
              <Text style={{ fontSize: 9, fontWeight: '700', color: C.cyan || '#00D9FF' }}>YOU</Text>{/* mobile-only badge — no website key */}
            </View>
          )}
        </View>
        <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginTop: 1 }}>
          {student.exercisesCompleted || 0} session{(student.exercisesCompleted || 0) !== 1 ? 's' : ''}
          {student.nativeLanguage && student.nativeLanguage !== 'Unknown' ? ` · ${student.nativeLanguage}` : ''}
          {student.level ? ` · ${student.level}` : ''}
        </Text>
      </View>

      {/* XP + avg score */}
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <Text style={{ fontSize: scaledFont(16), fontWeight: '800', color: '#FBBF24' }}>
          {(student.totalXP || 0).toLocaleString()} XP
        </Text>
        {student.averageScore > 0 && (
          <Text style={{ fontSize: scaledFont(11), color: scoreColor(student.averageScore, C), fontWeight: '700' }}>
            {student.averageScore}% avg
          </Text>
        )}
      </View>
    </View>
  );
}

// ── Weak area heatmap row ─────────────────────────────────────────────────────
function WeakAreaRow({ area, rank, maxCount, C }) {
  const color = HEATMAP_COLORS[rank] || C.textMuted;
  const barPct = Math.min(100, (area.count / Math.max(maxCount, 1)) * 100);

  return (
    <View style={{ paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: (C.border || '#374151') + '15' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: color + '20', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '800', color }}># {rank + 1}</Text>
        </View>
        <Text style={{ flex: 1, fontSize: scaledFont(13), fontWeight: '600', color: C.text }}>{area.topic}</Text>
        <View style={{ backgroundColor: color + '15', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: color + '30' }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color }}>{area.count}×</Text>
        </View>
      </View>
      <View style={{ height: 4, backgroundColor: (C.border || '#374151') + '20', borderRadius: 2, marginLeft: 30 }}>
        <View style={{ height: 4, backgroundColor: color, borderRadius: 2, width: `${barPct}%` }} />
      </View>
    </View>
  );
}

// ── Assignment card ───────────────────────────────────────────────────────────
function AssignmentCard({ assignment, C }) {
  const typeConfig = ASSIGNMENT_TYPES.find(t => t.id === assignment.type) || ASSIGNMENT_TYPES[0];
  const submissionRate = assignment.submissionCount > 0 ? assignment.submissionCount : 0;

  return (
    <View style={{
      backgroundColor: C.bg || '#0A0E1A', borderRadius: 12, padding: 12,
      marginBottom: 8, borderWidth: 1, borderColor: typeConfig.color + '25',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: typeConfig.color + '18', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16 }}>{typeConfig.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: typeConfig.color }}>{assignment.title}</Text>
          <Text style={{ fontSize: scaledFont(11), color: C.textMuted }}>
            {typeConfig.label} · {new Date(assignment.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {assignment.averageScore !== null && (
          <Text style={{ fontSize: scaledFont(16), fontWeight: '800', color: scoreColor(assignment.averageScore, C) }}>
            {assignment.averageScore}%
          </Text>
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <CheckCircle size={12} color={C.emerald || '#34D399'} />
          <Text style={{ fontSize: scaledFont(11), color: C.textMuted }}>{submissionRate} submission{submissionRate !== 1 ? 's' : ''}</Text>
        </View>
        {assignment.averageScore !== null && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Target size={12} color={C.cyan || '#00D9FF'} />
            <Text style={{ fontSize: scaledFont(11), color: C.textMuted }}>Avg {assignment.averageScore}%</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ClassroomDetailScreen() {
  const { colors: C } = useTheme();
  const { wt } = useLanguage();
  const params = useLocalSearchParams();

  const code         = params.code as string || '';
  const className    = params.className as string || 'Teacher Group';
  const teacherName  = params.teacherName as string || '';
  const isStudent    = params.studentMode === 'true';

  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [classData,    setClassData]    = useState(null);
  const [assignments,  setAssignments]  = useState([]);
  const [activeTab,    setActiveTab]    = useState('leaderboard'); // leaderboard | weakareas | assignments | activity

  // Assignment creation state
  const [showAssign,   setShowAssign]   = useState(false);
  const [assignTitle,  setAssignTitle]  = useState('');
  const [assignType,   setAssignType]   = useState('translation');
  const [assignLoading,setAssignLoading]= useState(false);

  useFocusEffect(useCallback(() => { fetchData(); }, [code]));

  const fetchData = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const serverUrl = await getServerUrl();
      const [classRes, assignRes] = await Promise.all([
        fetch(`${serverUrl}/api/classroom/${code}`),
        fetch(`${serverUrl}/api/classroom/${code}/assignments`),
      ]);
      if (!classRes.ok) throw new Error(`Server error ${classRes.status}`);
      const classJson  = await classRes.json();
      const assignJson = assignRes.ok ? await assignRes.json() : { assignments: [] };
      setClassData(classJson);
      setAssignments(assignJson.assignments || []);
    } catch (e) {
      Alert.alert('Error', 'Could not load teacher group data. Check your connection.');
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => { setRefreshing(true); fetchData(true); };

  const createAssignment = async () => {
    if (!assignTitle.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for the assignment.');
      return;
    }
    setAssignLoading(true);
    try {
      const serverUrl = await getServerUrl();
      const userId = await ensureUserId();
      const authHeaders = await getAuthHeaders();
      if (!authHeaders || !userId) {
        setAssignLoading(false);
        Alert.alert('Sign in required', 'You need to be signed in to create assignments.');
        return;
      }
      const res = await fetch(`${serverUrl}/api/classroom/assign`, {
        method: 'POST',
        headers: { ...authHeaders, 'X-App-User-Id': userId, 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, type: assignType, title: assignTitle.trim(), config: {} }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.assignment) {
        setShowAssign(false);
        setAssignTitle('');
        await fetchData(true);
        Alert.alert('Assignment Created!', `"${assignTitle}" has been assigned to the teacher group.`);
      } else {
        Alert.alert('Error', data.error || 'Failed to create assignment.');
      }
    } catch (e) {
      Alert.alert('Connection Error', 'Could not reach the server.');
    }
    setAssignLoading(false);
  };

  if (loading) {
    return (
      <ScreenBackground>
        <BackHeader title={className} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={C.cyan || '#00D9FF'} />
        </View>
      </ScreenBackground>
    );
  }

  const leaderboard   = classData?.leaderboard || [];
  const weakAreas     = classData?.weakAreas || [];
  const recentSubs    = classData?.recentSubmissions || [];
  const studentCount  = classData?.studentCount || 0;
  const totalSubs     = classData?.totalSubmissions || 0;

  // Compute class average from leaderboard
  const studentsWithScores = leaderboard.filter(s => s.averageScore > 0);
  const classAvg = studentsWithScores.length > 0
    ? Math.round(studentsWithScores.reduce((sum, s) => sum + s.averageScore, 0) / studentsWithScores.length)
    : null;

  const maxWeakCount = weakAreas[0]?.count || 1;

  return (
    <ScreenBackground>
      <BackHeader title={className} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.cyan || '#00D9FF'} />}
      >

        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: scaledFont(22), fontWeight: '800', color: C.text }}>{className}</Text>
            <Text style={{ fontSize: scaledFont(13), color: C.textMuted, marginTop: 2 }}>
              {isStudent ? `Taught by ${teacherName}` : `Your group · ${teacherName}`}
            </Text>
          </View>
          <View style={{ backgroundColor: (C.cyan || '#00D9FF') + '18', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: (C.cyan || '#00D9FF') + '30' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.textMuted, letterSpacing: 1 }}>{wt('code').toUpperCase()}</Text>
            <Text style={{ fontSize: scaledFont(18), fontWeight: '900', color: C.cyan || '#00D9FF', letterSpacing: 2 }}>{code}</Text>
          </View>
        </View>

        {/* ── Stats row ──────────────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Students',    value: String(studentCount),                     color: C.cyan || '#00D9FF',  icon: Users    },
            { label: 'Submissions', value: String(totalSubs),                         color: '#A78BFA',            icon: ClipboardList },
            { label: 'Average score', value: classAvg !== null ? `${classAvg}%` : '—', color: classAvg !== null ? scoreColor(classAvg, C) : C.textMuted, icon: Target },
            { label: 'Assignments', value: String(assignments.length),                color: '#FBBF24',            icon: BookOpen },
          ].map((stat, i) => (
            <View key={i} style={{
              flex: 1, backgroundColor: C.card || '#111827', borderRadius: 12,
              padding: 10, alignItems: 'center', borderWidth: 1, borderColor: stat.color + '25',
            }}>
              <stat.icon size={14} color={stat.color} style={{ marginBottom: 4 }} />
              <Text style={{ fontSize: scaledFont(17), fontWeight: '800', color: stat.color }}>{stat.value}</Text>
              <Text style={{ fontSize: 9, color: C.textMuted, marginTop: 1, textAlign: 'center' }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Tab selector ───────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { id: 'leaderboard',  label: '🏆 Leaderboard',  count: leaderboard.length },
              { id: 'weakareas',    label: '🎯 Weak Areas',    count: weakAreas.length   },
              { id: 'assignments',  label: '📋 Assignments',   count: assignments.length },
              { id: 'activity',     label: '⚡ Activity',      count: recentSubs.length  },
            ].map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={{
                  paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10,
                  backgroundColor: activeTab === tab.id ? (C.cyan || '#00D9FF') + '18' : C.card || '#111827',
                  borderWidth: 1,
                  borderColor: activeTab === tab.id ? (C.cyan || '#00D9FF') + '40' : (C.border || '#374151') + '20',
                  minHeight: 36,
                }}
                onPress={() => setActiveTab(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === tab.id }}
              >
                <Text style={{ fontSize: scaledFont(12), fontWeight: '700', color: activeTab === tab.id ? C.cyan || '#00D9FF' : C.textMuted }}>
                  {tab.label}{tab.count > 0 ? ` (${tab.count})` : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* ── LEADERBOARD TAB ────────────────────────────────────────── */}
        {activeTab === 'leaderboard' && (
          <View style={{ backgroundColor: C.card || '#111827', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#FBBF2430' }}>
            {leaderboard.length === 0 ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>🏆</Text>
                <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: C.text, marginBottom: 4 }}>{wt('no-students')}</Text>
                <Text style={{ fontSize: scaledFont(12), color: C.textMuted, textAlign: 'center' }}>
                  {wt('share-code-desc', { code })}
                </Text>
              </View>
            ) : (
              leaderboard.map((student, i) => (
                <LeaderRow
                  key={student.name}
                  student={student}
                  rank={i + 1}
                  C={C}
                  isCurrentUser={false}
                />
              ))
            )}
          </View>
        )}

        {/* ── WEAK AREAS TAB ─────────────────────────────────────────── */}
        {activeTab === 'weakareas' && (
          <>
            {weakAreas.length === 0 ? (
              <View style={{ backgroundColor: C.card || '#111827', borderRadius: 14, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: (C.border || '#374151') + '20' }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>📊</Text>
                <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: C.text, marginBottom: 4 }}>{wt('no-data')}</Text>
                <Text style={{ fontSize: scaledFont(12), color: C.textMuted, textAlign: 'center' }}>
                  {wt('weak-desc')}
                </Text>
              </View>
            ) : (
              <View style={{ backgroundColor: C.card || '#111827', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#EF444430' }}>
                <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: (C.border || '#374151') + '20' }}>
                  <Text style={{ fontSize: scaledFont(12), color: C.textMuted, lineHeight: 17 }}>
                    {wt('weak-help')}
                  </Text>
                </View>
                {weakAreas.map((area, i) => (
                  <WeakAreaRow
                    key={area.topic}
                    area={area}
                    rank={i}
                    maxCount={maxWeakCount}
                    C={C}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {/* ── ASSIGNMENTS TAB ────────────────────────────────────────── */}
        {activeTab === 'assignments' && (
          <>
            {/* Create assignment button — teachers only */}
            {!isStudent && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 8, backgroundColor: '#FBBF2418', borderRadius: 12,
                  paddingVertical: 12, marginBottom: 12, borderWidth: 1,
                  borderColor: '#FBBF2440', minHeight: 48,
                }}
                onPress={() => setShowAssign(true)}
                accessibilityRole="button" accessibilityLabel="Create new assignment"
              >
                <Plus size={16} color="#FBBF24" />
                <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: '#FBBF24' }}>{wt('create-assignment')}</Text>
              </TouchableOpacity>
            )}

            {assignments.length === 0 ? (
              <View style={{ backgroundColor: C.card || '#111827', borderRadius: 14, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: (C.border || '#374151') + '20' }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>📋</Text>
                <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: C.text, marginBottom: 4 }}>{wt('no-assignments')}</Text>
                <Text style={{ fontSize: scaledFont(12), color: C.textMuted, textAlign: 'center' }}>
                  {isStudent ? wt('no-assignments-student') : wt('no-assignments-teacher')}
                </Text>
              </View>
            ) : (
              <View>
                {assignments.map(a => (
                  <AssignmentCard key={a.id} assignment={a} C={C} />
                ))}
              </View>
            )}
          </>
        )}

        {/* ── ACTIVITY TAB ───────────────────────────────────────────── */}
        {activeTab === 'activity' && (
          <View style={{ backgroundColor: C.card || '#111827', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: (C.cyan || '#00D9FF') + '20' }}>
            {recentSubs.length === 0 ? (
              <View style={{ padding: 28, alignItems: 'center' }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>⚡</Text>
                <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: C.text, marginBottom: 4 }}>{wt('no-activity')}</Text>
                <Text style={{ fontSize: scaledFont(12), color: C.textMuted, textAlign: 'center' }}>
                  {wt('no-activity-desc')}
                </Text>
              </View>
            ) : (
              recentSubs.map((sub, i) => (
                <View key={i} style={{
                  flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10,
                  borderBottomWidth: i < recentSubs.length - 1 ? 1 : 0,
                  borderBottomColor: (C.border || '#374151') + '15',
                }}>
                  {/* Timeline dot */}
                  <View style={{ alignItems: 'center', width: 20 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: scoreColor(sub.score, C) }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: scaledFont(13), fontWeight: '600', color: C.text }}>{sub.studentName}</Text>
                    <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginTop: 1 }}>
                      {sub.topic || 'Exercise'} · {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' '}· {new Date(sub.submittedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 1 }}>
                    {sub.score > 0 && (
                      <Text style={{ fontSize: scaledFont(16), fontWeight: '800', color: scoreColor(sub.score, C) }}>{sub.score}%</Text>
                    )}
                    {sub.xp > 0 && (
                      <Text style={{ fontSize: 9, color: '#FBBF24', fontWeight: '700' }}>+{sub.xp} XP</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

      </ScrollView>

      {/* ── CREATE ASSIGNMENT MODAL ────────────────────────────────────── */}
      <Modal visible={showAssign} transparent animationType="slide" onRequestClose={() => setShowAssign(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} activeOpacity={1} onPress={() => setShowAssign(false)} />
        <View style={{
          backgroundColor: C.card || '#111827', borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#FBBF2430',
        }} accessibilityViewIsModal={true}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ flex: 1, fontSize: scaledFont(18), fontWeight: '800', color: C.text }} accessibilityRole="header">{wt('new-assignment')}</Text>
            <TouchableOpacity onPress={() => setShowAssign(false)} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
              accessibilityRole="button" accessibilityLabel="Close">
              <X size={22} color={C.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Type picker */}
          <Text style={{ fontSize: scaledFont(11), fontWeight: '700', color: C.textMuted, letterSpacing: 0.5, marginBottom: 8 }}>{wt('exercise-type').toUpperCase()}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {ASSIGNMENT_TYPES.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={{
                    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10,
                    backgroundColor: assignType === type.id ? type.color + '20' : C.bg || '#0A0E1A',
                    borderWidth: 1,
                    borderColor: assignType === type.id ? type.color + '50' : (C.border || '#374151') + '20',
                    alignItems: 'center', minWidth: 80, minHeight: 44,
                  }}
                  onPress={() => setAssignType(type.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: assignType === type.id }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 2 }}>{type.icon}</Text>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: assignType === type.id ? type.color : C.textMuted }}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Title input */}
          <Text style={{ fontSize: scaledFont(11), fontWeight: '700', color: C.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>{wt('assignment-title').toUpperCase()}</Text>
          <TextInput
            style={{
              backgroundColor: C.bg || '#0A0E1A', borderRadius: 10, padding: 14,
              fontSize: scaledFont(15), color: C.text, borderWidth: 1,
              borderColor: (C.border || '#374151') + '30', marginBottom: 20,
            }}
            placeholder={wt('assignment-placeholder')}
            placeholderTextColor={C.textMuted}
            value={assignTitle}
            onChangeText={setAssignTitle}
            autoCapitalize="sentences"
            accessibilityLabel="Assignment title"
          />

          <TouchableOpacity
            style={{
              backgroundColor: '#FBBF2418', borderRadius: 12, paddingVertical: 14,
              alignItems: 'center', borderWidth: 1, borderColor: '#FBBF2440', minHeight: 52,
              opacity: assignLoading ? 0.7 : 1,
            }}
            onPress={createAssignment}
            disabled={assignLoading}
            accessibilityRole="button" accessibilityLabel="Create assignment"
          >
            {assignLoading
              ? <ActivityIndicator size="small" color="#FBBF24" />
              : <Text style={{ fontSize: scaledFont(16), fontWeight: '700', color: '#FBBF24' }}>Create Assignment</Text>
            }
          </TouchableOpacity>
        </View>
      </Modal>

    </ScreenBackground>
  );
}
