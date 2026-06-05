import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_LIMIT = 30;
const FEEDBACK_LIMIT = 50;
const WEAK_LIMIT = 20;

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
  } catch (e) {}
};
