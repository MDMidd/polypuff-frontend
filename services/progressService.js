import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl } from './api';

const RECENT_LIMIT = 30;
const FEEDBACK_LIMIT = 50;
const WEAK_LIMIT = 20;

// Maps mobile exerciseId values to the topic labels the backend/classroom UI expects.
// Mirrors the PROGRESS_SOURCES topic list in classroom-progress-bridge.js (web).
const TOPIC_LABELS = {
  daily_challenge:  'Daily Challenge',
  grammar:          'Grammar Practice',
  listening:        'Listening',
  writing:          'Writing',
  grammar_quiz:     'Grammar Quiz',
  word_chunks:      'Word Chunks',
  vocabulary:       'Vocabulary',
  placement_test:   'Placement Test',
  business_english: 'Business English',
  cae:              'CAE Exam Prep',
  ielts:            'IELTS Exam Prep',
  toefl:            'TOEFL Exam Prep',
};

async function submitToClassroom(exerciseId, score, weakAreas) {
  try {
    const raw = await AsyncStorage.getItem('classroomJoined');
    if (!raw) return;
    const joined = JSON.parse(raw);
    if (!joined?.code || !joined?.studentName) return;

    const BASE = await getServerUrl();
    const topic = TOPIC_LABELS[exerciseId] || exerciseId;
    const mistakes = Array.isArray(weakAreas)
      ? weakAreas.map(a => String(a?.category || a || '')).filter(Boolean)
      : [];

    await fetch(`${BASE}/api/classroom/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code:        joined.code,
        studentName: joined.studentName,
        score:       Number(score || 0),
        xp:          0,
        topic,
        mistakes,
      }),
    });
  } catch {}
}

export const recordModuleProgress = async ({
  exerciseId,
  score,
  detail = '',
  feedback = '',
  weakAreas = [],
  recentLimit = RECENT_LIMIT,
  feedbackLimit = FEEDBACK_LIMIT,
  weakLimit = WEAK_LIMIT,
}) => {
  if (!exerciseId) return;

  try {
    const now = new Date().toISOString();

    const recentKey = `progress_recent_${exerciseId}`;
    const recentRaw = await AsyncStorage.getItem(recentKey);
    const recent = recentRaw ? JSON.parse(recentRaw) : [];
    recent.unshift({ date: now, score, detail });
    await AsyncStorage.setItem(recentKey, JSON.stringify(recent.slice(0, recentLimit)));

    if (feedback) {
      const feedbackKey = `progress_feedback_${exerciseId}`;
      const feedbackRaw = await AsyncStorage.getItem(feedbackKey);
      const feedbackList = feedbackRaw ? JSON.parse(feedbackRaw) : [];
      feedbackList.unshift({ date: now, feedback: String(feedback).substring(0, 200) });
      await AsyncStorage.setItem(feedbackKey, JSON.stringify(feedbackList.slice(0, feedbackLimit)));
    }

    if (weakAreas.length > 0) {
      const weakKey = `progress_weak_${exerciseId}`;
      const weakRaw = await AsyncStorage.getItem(weakKey);
      const weak = weakRaw ? JSON.parse(weakRaw) : [];

      for (const area of weakAreas) {
        const category = area?.category || 'Practice';
        const existing = weak.find(item => item.category === category);
        if (existing) {
          existing.frequency = (existing.frequency || 1) + (area?.frequency || 1);
          if (area?.description) existing.description = area.description;
        } else {
          weak.push({
            category,
            description: area?.description || '',
            frequency: area?.frequency || 1,
          });
        }
      }

      weak.sort((a, b) => (b.frequency || 0) - (a.frequency || 0));
      await AsyncStorage.setItem(weakKey, JSON.stringify(weak.slice(0, weakLimit)));
    }

    // Push to classroom if this student has joined a teacher group.
    submitToClassroom(exerciseId, score, weakAreas);
  } catch (e) {}
};
