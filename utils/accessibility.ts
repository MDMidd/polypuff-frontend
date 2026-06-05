/**
 * Accessibility Utilities — Poly-Puff
 * =====================================
 * WCAG 2.2 Level AA compliance utilities.
 *
 * FILE: utils/accessibility.ts
 * LOCATION: translation-trainer-frontend/utils/accessibility.ts
 */

import { useState, useEffect } from 'react';
import { PixelRatio, AccessibilityInfo } from 'react-native';

/**
 * Returns a font size scaled by the user's system font preference.
 * Capped at 1.5× to prevent layout breakage.
 *
 * Use on ALL student-facing text: sentences, questions, feedback, inputs, scores.
 * Skip for tiny badge/icon text that must stay fixed.
 */
export function scaledFont(baseSize: number): number {
  const scale = Math.min(PixelRatio.getFontScale(), 1.5);
  return Math.round(baseSize * scale);
}

/**
 * Hook: returns true when TalkBack (Android) or VoiceOver (iOS) is active.
 *
 * Use to show persistent text on Listening screen, skip decorative animations,
 * or provide richer labels.
 */
export function useScreenReader(): boolean {
  const [active, setActive] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setActive);
    const sub = AccessibilityInfo.addEventListener('screenReaderChanged', setActive);
    return () => sub.remove();
  }, []);
  return active;
}

/**
 * Send an announcement to TalkBack/VoiceOver.
 * Call after async results: score calculation, card flips, exercise generation.
 */
export function announce(message: string): void {
  if (message) AccessibilityInfo.announceForAccessibility(message);
}

/**
 * Convert a numeric score to a spoken announcement string.
 */
export function scoreAnnouncement(score: number, outOf: number = 100): string {
  const label =
    score >= 90 ? 'Excellent' :
    score >= 70 ? 'Good' :
    score >= 50 ? 'Needs improvement' : 'Keep practicing';
  return `Score: ${score} out of ${outOf}. ${label}.`;
}

/**
 * Pre-built accessibility prop sets for common elements.
 *
 * Usage:
 *   <TouchableOpacity {...a11yButton('Play audio', 'Double tap to hear the sentence')} />
 *   <View {...a11yImage('Poly-Puff mascot')} />
 */
export function a11yButton(label: string, hint?: string) {
  return {
    accessible: true,
    accessibilityRole: 'button' as const,
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

export function a11yImage(label: string) {
  return {
    accessible: true,
    accessibilityRole: 'image' as const,
    accessibilityLabel: label,
  };
}

export function a11yTab(label: string, selected: boolean) {
  return {
    accessible: true,
    accessibilityRole: 'tab' as const,
    accessibilityLabel: label,
    accessibilityState: { selected },
  };
}

export function a11ySwitch(label: string, checked: boolean) {
  return {
    accessibilityRole: 'switch' as const,
    accessibilityLabel: label,
    accessibilityState: { checked },
  };
}

export function a11yLiveRegion(label?: string) {
  return {
    accessibilityLiveRegion: 'polite' as const,
    ...(label ? { accessibilityLabel: label } : {}),
  };
}
