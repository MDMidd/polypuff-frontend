import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SKILL_FOR_EXERCISE } from '../services/progressService';
import { useLanguage } from '../contexts/LanguageContext';

const SKILL_LABEL_KEYS: Record<string, { key: 'skillReading' | 'skillWriting' | 'skillListening' | 'skillSpeaking'; fallback: string }> = {
  reading: { key: 'skillReading', fallback: 'Reading' },
  writing: { key: 'skillWriting', fallback: 'Writing' },
  listening: { key: 'skillListening', fallback: 'Listening' },
  speaking: { key: 'skillSpeaking', fallback: 'Speaking' },
};

type Props = {
  exerciseId: keyof typeof SKILL_FOR_EXERCISE;
  color?: string;
};

/**
 * Small pill showing the user's current CEFR level for the skill this
 * exercise feeds (reading/writing/listening/speaking) - separate from the
 * Placement Test score. Renders nothing until a level exists for that skill.
 */
export default function SkillLevelBadge({ exerciseId, color = '#00E5FF' }: Props) {
  const { t } = useLanguage();
  const [level, setLevel] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const skill = SKILL_FOR_EXERCISE[exerciseId];
    if (!skill) return;
    AsyncStorage.getItem('skillLevels').then((raw) => {
      if (!mounted || !raw) return;
      try {
        const levels = JSON.parse(raw);
        setLevel(levels?.[skill] || null);
      } catch {}
    });
    return () => { mounted = false; };
  }, [exerciseId]);

  const skill = SKILL_FOR_EXERCISE[exerciseId];
  if (!skill || !level) return null;

  const labelInfo = SKILL_LABEL_KEYS[skill];
  const label = (t[labelInfo.key] as string | undefined) ?? labelInfo.fallback;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Your ongoing ${label} skill level: ${level}. Based on exercise performance, separate from your Placement Test score.`}
      style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: color + '20', borderWidth: 1, borderColor: color + '40',
        borderRadius: 10, paddingHorizontal: 11, paddingVertical: 5,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: '600', color }}>
        {label}: {level}
      </Text>
    </View>
  );
}
