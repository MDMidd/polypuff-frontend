import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MIN_USES = 3;
const SNOOZE_USES = 4;
const SNOOZE_MS = 36 * 60 * 60 * 1000;

export const GLOBAL_HIDE_KEY = 'pp_feedback_nudge_dont_show';
const SNOOZE_KEY = 'pp_feedback_nudge_snooze_until';

interface NudgeStats {
  views: number;
  lastPromptUsage: number;
}

export function useFeedbackNudge(exerciseName: string) {
  const [showModal, setShowModal] = useState(false);
  const statsKey = `pp_feedback_nudge_stats_${exerciseName}`;

  const recordInteraction = useCallback(async () => {
    try {
      const [globalHide, snoozeRaw, statsRaw] = await Promise.all([
        AsyncStorage.getItem(GLOBAL_HIDE_KEY),
        AsyncStorage.getItem(SNOOZE_KEY),
        AsyncStorage.getItem(statsKey),
      ]);

      if (globalHide === 'true') return;

      const now = Date.now();
      const snoozeUntil = snoozeRaw ? parseInt(snoozeRaw, 10) : 0;
      if (now < snoozeUntil) return;

      const current: NudgeStats = statsRaw
        ? JSON.parse(statsRaw)
        : { views: 0, lastPromptUsage: 0 };

      const newViews = current.views + 1;
      await AsyncStorage.setItem(
        statsKey,
        JSON.stringify({ views: newViews, lastPromptUsage: current.lastPromptUsage }),
      );

      const usesSincePrompt = newViews - current.lastPromptUsage;
      if (
        newViews >= MIN_USES &&
        (current.lastPromptUsage === 0 || usesSincePrompt >= SNOOZE_USES)
      ) {
        setShowModal(true);
      }
    } catch {}
  }, [statsKey]);

  const onDismiss = useCallback(
    async (dontShowAgain: boolean) => {
      setShowModal(false);
      try {
        if (dontShowAgain) {
          await AsyncStorage.setItem(GLOBAL_HIDE_KEY, 'true');
          return;
        }
        const snoozeUntil = Date.now() + SNOOZE_MS;
        const raw = await AsyncStorage.getItem(statsKey);
        const current: NudgeStats = raw
          ? JSON.parse(raw)
          : { views: 0, lastPromptUsage: 0 };
        await Promise.all([
          AsyncStorage.setItem(SNOOZE_KEY, String(snoozeUntil)),
          AsyncStorage.setItem(
            statsKey,
            JSON.stringify({ views: current.views, lastPromptUsage: current.views }),
          ),
        ]);
      } catch {}
    },
    [statsKey],
  );

  // Called after a successful send - snooze twice as long
  const onSent = useCallback(
    async (dontShowAgain: boolean) => {
      setShowModal(false);
      try {
        if (dontShowAgain) {
          await AsyncStorage.setItem(GLOBAL_HIDE_KEY, 'true');
          return;
        }
        const snoozeUntil = Date.now() + SNOOZE_MS * 2;
        const raw = await AsyncStorage.getItem(statsKey);
        const current: NudgeStats = raw
          ? JSON.parse(raw)
          : { views: 0, lastPromptUsage: 0 };
        await Promise.all([
          AsyncStorage.setItem(SNOOZE_KEY, String(snoozeUntil)),
          AsyncStorage.setItem(
            statsKey,
            JSON.stringify({ views: current.views, lastPromptUsage: current.views }),
          ),
        ]);
      } catch {}
    },
    [statsKey],
  );

  return { showModal, recordInteraction, onDismiss, onSent };
}
