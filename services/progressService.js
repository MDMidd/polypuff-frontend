import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl } from './api';
import { pushVaults } from './syncService';

const RECENT_LIMIT = 30;
const FEEDBACK_LIMIT = 50;
const WEAK_LIMIT = 20;

function mintProgressId() {
  return 'pg-m-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

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

// Maps each exercise to the one of the 4 CEFR skills (reading/writing/
// listening/speaking) its score counts toward - mirrors the mapping used in
// sync-client.js on the web so the two platforms feed the same skill.
// placement_test is deliberately excluded: it *seeds* skillLevels once at
// completion (see placement.tsx), it doesn't grade into them on a rolling
// basis. Nothing here currently produces a standalone speaking score.
export const SKILL_FOR_EXERCISE = {
  grammar:             'reading',
  grammar_quiz:        'reading',
  vocabulary:          'reading',
  word_chunks:         'reading',
  translation_trainer: 'reading',
  cae:                 'reading',
  ielts:               'reading',
  toefl:               'reading',
  writing:             'writing',
  business_english:    'writing',
  listening:           'listening',
  daily_challenge:     'listening',
};

// Reports a score toward the mapped CEFR skill so ongoing exercise
// performance - not just the one-time placement test - can level a skill up.
// Fire-and-forget: a failed grade call shouldn't block the exercise's own
// local progress recording above.
async function gradeSkill(exerciseId, score) {
  try {
    const skill = SKILL_FOR_EXERCISE[exerciseId];
    if (!skill || !Number.isFinite(score)) return;

    const [token, base] = await Promise.all([AsyncStorage.getItem('pp_token'), getServerUrl()]);
    if (!token) return;

    const res = await fetch(`${base}/api/me/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ skill, score }),
    });
    if (!res.ok) return;

    const data = await res.json().catch(() => null);
    if (data?.skillLevels) {
      await AsyncStorage.setItem('skillLevels', JSON.stringify(data.skillLevels));
    }
  } catch {}
}

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
    const id = mintProgressId();

    const recentKey = `progress_recent_${exerciseId}`;
    const recentRaw = await AsyncStorage.getItem(recentKey);
    const recent = recentRaw ? JSON.parse(recentRaw) : [];
    recent.unshift({ id, date: now, score, detail });
    await AsyncStorage.setItem(recentKey, JSON.stringify(recent.slice(0, recentLimit)));

    if (feedback) {
      const feedbackKey = `progress_feedback_${exerciseId}`;
      const feedbackRaw = await AsyncStorage.getItem(feedbackKey);
      const feedbackList = feedbackRaw ? JSON.parse(feedbackRaw) : [];
      feedbackList.unshift({ id, date: now, feedback: String(feedback).substring(0, 200) });
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
          if (area?.ruleId || area?.rule_id) existing.ruleId = area.ruleId || area.rule_id;
          if (area?.found) existing.found = area.found;
          if (area?.expected) existing.expected = area.expected;
        } else {
          weak.push({
            category,
            description: area?.description || '',
            frequency: area?.frequency || 1,
            ruleId: area?.ruleId || area?.rule_id || null,
            found: area?.found || '',
            expected: area?.expected || '',
          });
        }
      }

      weak.sort((a, b) => (b.frequency || 0) - (a.frequency || 0));
      await AsyncStorage.setItem(weakKey, JSON.stringify(weak.slice(0, weakLimit)));
    }

    // Push to classroom if this student has joined a teacher group.
    submitToClassroom(exerciseId, score, weakAreas);
    // Report toward the mapped CEFR skill's ongoing level-up tracking.
    gradeSkill(exerciseId, score);
    // Push to cross-device sync (debounced inside syncService).
    pushVaults();
  } catch (e) {}
};
