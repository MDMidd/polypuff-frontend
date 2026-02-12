/**
 * API Service Layer - Translation Trainer v6
 * ===========================================
 * 
 * Connects frontend to backend server v6.
 * Includes: exercise generation, grading, exercise bank, TTS, chat, rules.
 * 
 * FILE: services/api.js
 * GOES IN: translation-trainer-frontend/services/api.js
 */

import * as Speech from 'expo-speech';

// ============================================================================
// CONFIGURATION - Can be updated from Settings screen
// ============================================================================
let API_BASE_URL = 'http://192.168.10.163:3000';

// Load saved server URL on startup
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getItem('serverUrl').then(url => { if (url) API_BASE_URL = url; }).catch(() => {});

/**
 * Update the server URL (called from Settings screen)
 */
export const setServerUrl = async (url) => {
  API_BASE_URL = url;
  await AsyncStorage.setItem('serverUrl', url);
};

export const getServerUrl = () => API_BASE_URL;

// ============================================================================
// CORE API CALLS
// ============================================================================

/**
 * Check server health
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', message: error.message };
  }
};

/**
 * Generate a new translation exercise (AI-generated)
 */
export const generateExercise = async ({
  nativeLanguage = 'Spanish',
  level = 'B1',
  sentenceLength = 'medium',
  customRequest = '',
  previousSentences = [],
  profile = null,
  weakAreas = [],
} = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nativeLanguage, level, sentenceLength, customRequest, previousSentences, profile, weakAreas }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Generate failed:', error);
    throw error;
  }
};

/**
 * Check/grade a student's translation (Database-First + AI)
 */
export const checkTranslation = async ({
  studentAnswer,
  correctAnswer,
  originalSentence,
  nativeLanguage = 'Spanish',
  level = 'B1',
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentAnswer, correctAnswer, originalSentence, nativeLanguage, level }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Check failed:', error);
    throw error;
  }
};

// ============================================================================
// EXERCISE BANK
// ============================================================================

/**
 * Get next pre-built exercise (no repeats)
 * Falls back to cached exercises when offline.
 */
export const getNextExercise = async ({
  studentId = 'default',
  nativeLanguage = 'Spanish',
  level = 'B1',
} = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/exercises/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, nativeLanguage, level }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    // Cache exercise for offline use
    try {
      const cached = await AsyncStorage.getItem('exerciseCache');
      const list = cached ? JSON.parse(cached) : [];
      list.push(data);
      // Keep last 50 exercises cached
      if (list.length > 50) list.shift();
      await AsyncStorage.setItem('exerciseCache', JSON.stringify(list));
    } catch (e) {}
    return data;
  } catch (error) {
    console.error('Exercise bank failed, trying offline cache:', error);
    // Try serving a random cached exercise
    try {
      const cached = await AsyncStorage.getItem('exerciseCache');
      if (cached) {
        const list = JSON.parse(cached);
        const matching = list.filter(e => e.level === level || e.difficulty === level);
        if (matching.length > 0) {
          const pick = matching[Math.floor(Math.random() * matching.length)];
          pick._offline = true;
          return pick;
        }
      }
    } catch (e) {}
    return null; // Caller should fall back to generateExercise
  }
};

/**
 * Check answer against pre-built exercise
 */
export const checkExercise = async ({ exerciseId, studentAnswer, nativeLanguage = 'Spanish' }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/exercises/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, studentAnswer, nativeLanguage }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Exercise check failed:', error);
    throw error;
  }
};

/**
 * Get exercise bank stats
 */
export const getExerciseStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/exercises/stats`);
    return await response.json();
  } catch (error) {
    console.error('Stats failed:', error);
    return null;
  }
};

// ============================================================================
// AI CHAT
// ============================================================================

/**
 * Chat with AI tutor
 */
export const chatWithTutor = async ({ message, nativeLanguage = 'Spanish', context = {} }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, nativeLanguage, context }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Chat failed:', error);
    throw error;
  }
};

// ============================================================================
// RULES
// ============================================================================

/**
 * Get grammar rules (with optional filters)
 */
export const getRules = async ({ topic, priority } = {}) => {
  const cacheKey = `rulesCache_${topic || 'all'}_${priority || 'all'}`;
  try {
    const params = new URLSearchParams();
    if (topic) params.append('topic', topic);
    if (priority) params.append('priority', priority);
    const response = await fetch(`${API_BASE_URL}/api/rules?${params}`);
    const data = await response.json();
    // Cache for offline use
    try { await AsyncStorage.setItem(cacheKey, JSON.stringify(data)); } catch (e) {}
    return data;
  } catch (error) {
    console.error('Rules fetch failed, trying cache:', error);
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return { count: 0, rules: [] };
  }
};

/**
 * Get a specific rule by ID
 */
export const getRule = async (ruleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rules/${ruleId}`);
    return await response.json();
  } catch (error) {
    console.error('Rule fetch failed:', error);
    return null;
  }
};

/**
 * Get database stats
 */
export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    return await response.json();
  } catch (error) {
    console.error('Stats failed:', error);
    return null;
  }
};

/**
 * Test a sentence against rule scanner (debugging)
 */
export const testRules = async (sentence, correctSentence = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test-rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence, correctSentence }),
    });
    return await response.json();
  } catch (error) {
    console.error('Test rules failed:', error);
    throw error;
  }
};

// ============================================================================
// TEXT-TO-SPEECH (TTS) - expo-speech
// ============================================================================

/**
 * Speak the CORRECT version — slow, clear native pronunciation
 */
export const speakCorrectVersion = async (text, options = {}) => {
  try {
    await Speech.stop();
    await Speech.speak(text, {
      language: 'en-US',
      rate: 0.85,
      pitch: 1.0,
      onDone: options.onDone,
      onError: options.onError,
      ...options,
    });
  } catch (error) {
    console.error('TTS correct error:', error);
  }
};

/**
 * Speak the STUDENT'S version — normal speed to hear flow issues
 */
export const speakStudentVersion = async (text, options = {}) => {
  try {
    await Speech.stop();
    await Speech.speak(text, {
      language: 'en-US',
      rate: 0.95,
      pitch: 1.0,
      onDone: options.onDone,
      onError: options.onError,
      ...options,
    });
  } catch (error) {
    console.error('TTS student error:', error);
  }
};

/**
 * Generic TTS
 */
export const speakText = async (text, settings = {}) => {
  try {
    await Speech.stop();
    await Speech.speak(text, {
      language: settings.language || 'en-US',
      rate: settings.rate || 0.9,
      pitch: settings.pitch || 1.0,
      ...settings,
    });
  } catch (error) {
    console.error('TTS error:', error);
  }
};

/**
 * Stop speech
 */
export const stopSpeaking = async () => {
  try { await Speech.stop(); } catch (e) { /* ignore */ }
};

/**
 * Check if speaking
 */
export const isSpeaking = async () => {
  try { return await Speech.isSpeakingAsync(); } catch (e) { return false; }
};

/**
 * Get available English voices
 */
export const getAvailableVoices = async () => {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.filter(v => v.language?.startsWith('en'));
  } catch (error) {
    return [];
  }
};

export default {
  getServerUrl,
  setServerUrl,
  checkHealth,
  generateExercise,
  checkTranslation,
  getNextExercise,
  checkExercise,
  getExerciseStats,
  chatWithTutor,
  getRules,
  getRule,
  getStats,
  testRules,
  speakCorrectVersion,
  speakStudentVersion,
  speakText,
  stopSpeaking,
  isSpeaking,
  getAvailableVoices,
};
