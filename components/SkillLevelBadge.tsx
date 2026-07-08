import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SKILL_FOR_EXERCISE } from '../services/progressService';

const SKILL_LABELS: Record<string, string> = {
  reading: 'Reading',
  writing: 'Writing',
  listening: 'Listening',
  speaking: 'Speaking',
};

type Props = {
  exerciseId: keyof typeof SKILL_FOR_EXERCISE;
  color?: string;
};

/**
 * Small pill showing the user's current CEFR level for the skill this
 * exercise feeds (reading/writing/listening/speaking) — separate from the
 * Placement Test score. Renders nothing until a level exists for that skill.
 */
export default function SkillLevelBadge({ exerciseId, color = '#00E5FF' }: Props) {
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

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Your ${SKILL_LABELS[skill]} level: ${level}`}
      style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: color + '20', borderWidth: 1, borderColor: color + '40',
        borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: '700', color }}>
        {SKILL_LABELS[skill]}: {level}
      </Text>
    </View>
  );
}
