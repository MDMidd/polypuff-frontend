# Poly-Puff Accessibility Audit & Implementation Guide
## Making Poly-Puff Usable for Students with Visual Impairments

**Version:** 1.0  
**Date:** March 2026  
**Standard:** WCAG 2.2 Level AA  
**Scope:** All 16 uploaded source files across 9 practice screens, settings, layout, placement, and server

---

## Executive Summary

After auditing all 16 files (≈21,000 lines), I found **6 critical** and **14 major** accessibility gaps that would prevent students with visual impairments from using Poly-Puff effectively. The good news: the app's architecture is clean and modular, so fixes can be applied systematically. Below is every issue, organized by priority, with exact code changes per file.

---

## CRITICAL Issues (Must Fix Before Launch)

### 1. Zero `accessibilityLabel` Props Across the Entire App

**Impact:** Screen readers (TalkBack on Android, VoiceOver on iOS) cannot announce what any button, card, or interactive element does. A blind student tapping the play button on the Listening screen hears nothing — or just "button."

**Affected files:** All 9 practice screens, `_layout.tsx`, `settings.tsx`

**Fix pattern — apply to every `TouchableOpacity` and interactive element:**

```tsx
// BEFORE (listening.tsx, line ~319)
<TouchableOpacity style={s.playBtn} onPress={() => playSentence()} disabled={isPlaying}>
  {isPlaying ? <ActivityIndicator ... /> : <Volume2 size={36} color={C.emerald} />}
</TouchableOpacity>

// AFTER
<TouchableOpacity
  style={s.playBtn}
  onPress={() => playSentence()}
  disabled={isPlaying}
  accessibilityRole="button"
  accessibilityLabel={isPlaying ? "Playing audio" : "Play sentence audio"}
  accessibilityState={{ disabled: isPlaying }}
  accessibilityHint="Double tap to hear the sentence spoken aloud"
>
```

### 2. Score Indicators Rely Solely on Color

**Impact:** The score rings, heatmaps, and word-match highlights in `translation.tsx`, `wordchunks.tsx`, `writing.tsx`, `listening.tsx`, `quiz.tsx`, and `grammar.tsx` use color alone (red/amber/emerald) to convey pass/fail. Students with color blindness or low vision cannot distinguish scores.

**Affected components:** `scoreColor()` in 4 files, `getScoreColor()` in 2 files, word-match highlighting in `listening.tsx`

**Fix — add text labels and patterns alongside color:**

```tsx
// BEFORE (wordchunks.tsx result card)
<View style={[ds.scoreRing, { borderColor: scoreColor(result.score, C) }]}>
  <Text style={[ds.scoreNumber, { color: scoreColor(result.score, C) }]}>{result.score}</Text>
  <Text style={[ds.scoreLabel, { color: C.textMuted }]}>/ 100</Text>
</View>

// AFTER — adds text grade + accessibilityLabel
<View
  style={[ds.scoreRing, { borderColor: scoreColor(result.score, C) }]}
  accessibilityRole="text"
  accessibilityLabel={`Score: ${result.score} out of 100. ${
    result.score >= 90 ? 'Excellent' :
    result.score >= 70 ? 'Good' :
    result.score >= 50 ? 'Needs improvement' : 'Keep practicing'
  }`}
>
  <Text style={[ds.scoreNumber, { color: scoreColor(result.score, C) }]}>{result.score}</Text>
  <Text style={[ds.scoreLabel, { color: C.textMuted }]}>/ 100</Text>
  <Text style={{ fontSize: 10, fontWeight: '700', color: scoreColor(result.score, C), marginTop: 2 }}>
    {result.score >= 90 ? '★ Excellent' : result.score >= 70 ? 'Good' : result.score >= 50 ? 'Fair' : 'Practice'}
  </Text>
</View>
```

### 3. No `accessibilityRole` on Any Interactive Element

**Impact:** Screen readers cannot distinguish buttons from text from inputs. A blind student navigating by swipe hears "Poly-Puff" (text), then "Start Session" (text) — with no indication that the second is tappable.

**Fix — add roles to all interactive elements across all files:**

| Element Type | Required `accessibilityRole` |
|---|---|
| `TouchableOpacity` (buttons) | `"button"` |
| `TextInput` | `"none"` (already native) but add `accessibilityLabel` |
| `Switch` (settings.tsx) | `"switch"` |
| Level/difficulty pills | `"button"` + `accessibilityState={{ selected: isActive }}` |
| Score displays | `"text"` |
| Modal overlays | `"none"` on backdrop, content gets `accessibilityViewIsModal={true}` |
| ScrollView (horizontal pills) | `accessibilityRole="tablist"` |
| Individual pills | `accessibilityRole="tab"` |

### 4. Listening Screen Has No Non-Audio Fallback

**Impact:** The Listening screen (`listening.tsx`) is entirely audio-based. A deaf-blind student or a student using a braille display has no way to access the exercise content, and the "Easy" mode shows text only temporarily (5 seconds, line 38).

**Fix:**

```tsx
// Add a persistent "Show Transcript" toggle for accessibility
const [alwaysShowText, setAlwaysShowText] = useState(false);

// Check system accessibility settings on mount
useEffect(() => {
  const checkAccessibility = async () => {
    // React Native exposes AccessibilityInfo
    const { AccessibilityInfo } = require('react-native');
    const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
    if (isScreenReaderEnabled) setAlwaysShowText(true);
  };
  checkAccessibility();
}, []);

// In the listen card, always show text when screen reader is active:
{(showSentence || alwaysShowText) && (
  <Text style={s.sentencePreview} accessibilityRole="text">
    {currentSentence}
  </Text>
)}

// Add toggle button:
<TouchableOpacity
  onPress={() => setAlwaysShowText(!alwaysShowText)}
  accessibilityRole="switch"
  accessibilityLabel="Always show sentence text"
  accessibilityState={{ checked: alwaysShowText }}
  style={{ /* styling */ }}
>
  <Text>Show Text: {alwaysShowText ? 'On' : 'Off'}</Text>
</TouchableOpacity>
```

### 5. Vocabulary Flashcard Flip Is Inaccessible

**Impact:** In `vocab.tsx`, the card flip animation (fade/scale, lines 122-125) provides no screen reader announcement that content has changed. A blind student taps the card and hears nothing new.

**Fix:**

```tsx
// Add accessibilityLiveRegion to the card container
<View
  style={s.cardShell}
  accessibilityLiveRegion="polite"
  accessibilityLabel={
    isFlipped
      ? `Back of card. Word: ${currentCard.en}. ${wData?.ipa ? `Pronunciation: ${wData.ipa}.` : ''} ${wData?.meanings?.[0]?.definition || currentCard.example}`
      : `Front of card. Tap to reveal the English word. Category: ${currentCard.category}`
  }
>

// Make the flip tap target explicit
<TouchableOpacity
  onPress={flipCard}
  accessibilityRole="button"
  accessibilityLabel={isFlipped ? "Card is revealed. Showing definition." : "Tap to flip card and reveal the word"}
  accessibilityHint="Double tap to flip the flashcard"
>
```

### 6. Quiz Answer Options Have No Accessible State Feedback

**Impact:** In `quiz.tsx`, when a student selects an answer, the only feedback is a border color change (line 353). Screen readers don't announce whether the selection was correct or incorrect.

**Fix:**

```tsx
// BEFORE
<TouchableOpacity key={i} style={[s.optionBtn, style]} onPress={() => selectAnswer(i)} disabled={showAnswer}>

// AFTER
<TouchableOpacity
  key={i}
  style={[s.optionBtn, style]}
  onPress={() => selectAnswer(i)}
  disabled={showAnswer}
  accessibilityRole="radio"
  accessibilityState={{
    selected: i === selected,
    disabled: showAnswer,
    checked: showAnswer ? i === q.correct : undefined,
  }}
  accessibilityLabel={`Option ${LETTERS[i]}: ${opt}${
    showAnswer && i === q.correct ? '. Correct answer.' :
    showAnswer && i === selected && i !== q.correct ? '. Incorrect. You selected this.' : ''
  }`}
>
```

---

## MAJOR Issues

### 7. Text Sizes Are Hardcoded — Won't Scale with System Settings

**Impact:** Students with low vision who set their phone to "Largest" text size see no change in Poly-Puff. Every font size across all files is hardcoded (e.g., `fontSize: 26`, `fontSize: 13`).

**Fix — use `PixelRatio.getFontScale()` to respect system settings:**

Create a new utility file:

```tsx
// utils/accessibility.ts
import { PixelRatio, AccessibilityInfo } from 'react-native';

// Returns a scaled font size that respects system accessibility settings
// but caps at 1.5x to prevent layout breakage
export function scaledFont(baseSize: number): number {
  const scale = Math.min(PixelRatio.getFontScale(), 1.5);
  return Math.round(baseSize * scale);
}

// Hook to detect screen reader
export function useScreenReader() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setActive);
    const sub = AccessibilityInfo.addEventListener('screenReaderChanged', setActive);
    return () => sub.remove();
  }, []);
  return active;
}
```

Then in each screen, replace hardcoded sizes on critical text:

```tsx
import { scaledFont } from '../utils/accessibility';

// Headers
<Text style={{ fontSize: scaledFont(26), ... }}>Translation Trainer</Text>

// Body text (sentences to translate, quiz questions, feedback)
<Text style={{ fontSize: scaledFont(20), ... }}>{originalSentence}</Text>

// Input fields
<TextInput style={{ fontSize: scaledFont(16), ... }} />
```

**Priority targets** (text the student MUST read to complete exercises):
- Sentences to translate (`translation.tsx` line 362: `fontSize: 20`)
- Quiz questions (`quiz.tsx`: `fontSize: 16`)
- Listening instructions (`listening.tsx`: `fontSize: 16`)
- Writing prompts (`writing.tsx`: various)
- Grammar exercise text (`grammar.tsx`: various)
- Vocabulary words (`vocab.tsx` line ~473: `fontSize: 24`)
- Feedback/correction text in all result cards

### 8. Contrast Ratios Below WCAG AA (4.5:1)

**Impact:** Many text colors against the dark background fail WCAG AA contrast. Students with low vision cannot read muted labels.

**Failing combinations found across all files:**

| Color Use | Text Color | Background | Ratio | Required |
|---|---|---|---|---|
| `C.textMuted` labels | ~`#6B7280` | `#0A1628` | ~3.2:1 | 4.5:1 |
| Hint/placeholder text | `C.textMuted` | `C.card` (~`#121829`) | ~3.0:1 | 4.5:1 |
| `C.textSec` body text | ~`#94A3B8` | `#0A1628` | ~5.1:1 | ✅ Passes |
| Score amber text | `C.amber` (~`#FFBE0B`) | `C.card` | ~7.2:1 | ✅ Passes |
| Disabled button text | Various + `opacity: 0.4-0.5` | Various | Often <2:1 | 4.5:1 |

**Fix — update `ThemeContext` colors:**

```tsx
// In contexts/ThemeContext.tsx, update these values:
textMuted: '#9CA3AF',    // was ~#6B7280, now passes 4.5:1 against #0A1628
// For disabled states, use opacity: 0.6 minimum instead of 0.4-0.5
```

**Disabled buttons** across all files use `opacity: 0.4` or `0.5`:
- `translation.tsx` line 356: `btnDisabled: { opacity: 0.5 }`
- `wordchunks.tsx` line 340-341: `opacity: input.trim() ? 1 : 0.4`
- `writing.tsx` line 327: `opacity: wordCount >= 5 && !loading ? 1 : 0.4`
- `listening.tsx` line 359: `!userInput.trim() && { opacity: 0.4 }`

Change all to `opacity: 0.6` minimum and add `accessibilityState={{ disabled: true }}`.

### 9. No Focus Management After Async Actions

**Impact:** After generating a sentence, checking an answer, or flipping a card, focus stays where it was. A screen reader user must manually search for the new content.

**Fix — announce results with `AccessibilityInfo.announceForAccessibility()`:**

```tsx
import { AccessibilityInfo } from 'react-native';

// In translation.tsx handleCheck():
const handleCheck = async () => {
  // ... existing code ...
  setResult(data);
  // ADD: Announce result to screen reader
  AccessibilityInfo.announceForAccessibility(
    `Score: ${data.score} out of 100. ${data.feedback || ''}`
  );
};

// In listening.tsx checkAnswer():
const checkAnswer = () => {
  // ... existing scoring code ...
  AccessibilityInfo.announceForAccessibility(
    `Score: ${finalScore} percent. ${finalScore >= 80 ? 'Great job!' : 'Keep practicing.'}`
  );
};

// In quiz.tsx selectAnswer() — after showing the answer:
AccessibilityInfo.announceForAccessibility(
  isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${q.opts[q.correct]}`
);

// In vocab.tsx flipCard():
AccessibilityInfo.announceForAccessibility(
  `The word is: ${currentCard.en}. ${currentCard.example}`
);
```

### 10. Sentence Builder (Grammar Screen) Word Tiles Are Inaccessible

**Impact:** In `grammar.tsx`, the Sentence Builder mode uses draggable/tappable word tiles that have no accessible labels or ordering information.

**Fix:**

```tsx
// WordTile component (grammar.tsx line ~80)
function WordTile({ word, onPress, active, color, index, totalTiles }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Word: ${word}. ${active ? 'Selected, in sentence.' : 'Not selected.'} ${index + 1} of ${totalTiles}.`}
      accessibilityHint="Double tap to add or remove this word from the sentence"
      accessibilityState={{ selected: active }}
      style={/* existing styles */}
    >
      <Text>{word}</Text>
    </TouchableOpacity>
  );
}
```

### 11. Modals Trap Focus Incorrectly

**Impact:** The chat modal (`translation.tsx` line 494), settings modal (line 510), and drawer menu (`_layout.tsx`) don't set `accessibilityViewIsModal`. Screen readers can "see through" the modal to elements behind it.

**Fix for all modals:**

```tsx
// translation.tsx chat modal
<Modal visible={showChat} animationType="slide" onRequestClose={() => setShowChat(false)}>
  <View style={s.chatScreen} accessibilityViewIsModal={true}>
    {/* Existing content */}
  </View>
</Modal>

// _layout.tsx DrawerMenu
<View style={{ ... }} accessibilityViewIsModal={true}>
  {/* Drawer content */}
</View>
```

### 12. Profile Photo Button Has No Label

**Impact:** The `ProfileMenuButton` in `_layout.tsx` (line ~37) shows either a photo or User icon but has no `accessibilityLabel`. Screen readers say "button" with no context.

**Fix:**

```tsx
<TouchableOpacity
  style={/* existing */}
  onPress={onPress}
  accessibilityRole="button"
  accessibilityLabel="Open menu"
  accessibilityHint="Double tap to open the navigation drawer"
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
>
```

### 13. Settings Screen Switches Missing Labels

**Impact:** In `settings.tsx`, the Sound, Haptic, and Mascot `Switch` components are inside `Row` components but not linked to their labels.

**Fix — add accessibility props to each Switch:**

```tsx
<Switch
  value={soundOn}
  onValueChange={handleSoundToggle}
  accessibilityRole="switch"
  accessibilityLabel="Sound effects"
  accessibilityState={{ checked: soundOn }}
  // ... existing trackColor/thumbColor
/>
```

### 14. PolyPuffScene (3D Mascot) Is a Black Box to Screen Readers

**Impact:** The `PolyPuffScene` component is rendered on every screen but provides zero accessible information.

**Fix — wrap it with an accessible description:**

```tsx
// In each screen where PolyPuffScene is used:
<View
  accessible={true}
  accessibilityRole="image"
  accessibilityLabel="Poly-Puff mascot"
>
  <PolyPuffScene size={600} />
</View>
```

### 15. Horizontal ScrollView Level Pickers Not Navigable

**Impact:** The CEFR level pills (A0-C2) in `translation.tsx`, `listening.tsx`, `wordchunks.tsx`, `writing.tsx`, and `grammar.tsx` are inside horizontal `ScrollView`s. Screen reader users have difficulty discovering all options.

**Fix:**

```tsx
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  accessibilityRole="tablist"
  accessibilityLabel="Select CEFR level"
>
  {LEVELS.map(l => (
    <TouchableOpacity
      key={l}
      style={[s.levelPill, level === l && s.levelPillActive]}
      onPress={() => setLevel(l)}
      accessibilityRole="tab"
      accessibilityLabel={`Level ${l}`}
      accessibilityState={{ selected: level === l }}
    >
      <Text style={[s.levelPillText, level === l && s.levelPillTextActive]}>{l}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>
```

### 16. Challenge Timer Has No Accessible Updates

**Impact:** In `challenges.tsx`, the countdown timer is visual only. A screen reader user cannot know how much time remains during a Speed Round challenge.

**Fix:**

```tsx
<Text
  style={s.timerText}
  accessibilityRole="timer"
  accessibilityLabel={`${formatTime(timeLeft)} remaining`}
  accessibilityLiveRegion="polite"
>
  {formatTime(timeLeft)}
</Text>
```

### 17. Voice Input Button Needs Clear Labeling

**Impact:** The `VoiceInput` component in `translation.tsx` (line 452) likely has no accessible description of its recording state.

**Fix (apply inside VoiceInput component, or wrap externally):**

```tsx
<View style={{ paddingTop: 6 }}>
  <View
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={isRecording ? "Stop voice recording" : "Start voice input"}
    accessibilityHint="Double tap to speak your translation instead of typing"
    accessibilityState={{ busy: isRecording }}
  >
    <VoiceInput
      onTranscript={(text) => setStudentInput(prev => prev ? prev + ' ' + text : text)}
      disabled={!!result}
      language="en-US"
    />
  </View>
</View>
```

### 18. AIDisclosureBanner Needs Screen Reader Support

**Impact:** The `AIDisclosureBanner` used in `listening.tsx`, `writing.tsx`, `grammar.tsx`, and `quiz.tsx` likely has AI disclosure info that should be announced.

**Fix (inside AIDisclosureBanner component):**

```tsx
<View
  accessibilityRole="alert"
  accessibilityLabel="AI disclosure: This exercise uses artificial intelligence to generate content and provide feedback"
>
  {/* Existing banner content */}
</View>
```

### 19. Error Correction Mode Underlines Are Color-Only

**Impact:** In `grammar.tsx` Error Correction mode, errors are shown with colored underlines. Students who can't perceive color miss the errors entirely.

**Fix — add icons or text markers alongside color:**

```tsx
// Before each error word, add a small icon or prefix
<Text>
  <Text accessibilityLabel={`Error: ${word}. `} style={{ color: C.red, textDecorationLine: 'underline' }}>
    ⚠ {word}
  </Text>
</Text>
```

### 20. Back Navigation Inconsistency

**Impact:** `BackHeader` is used across screens but the back arrow icon has no consistent accessible label. Some screens use `BackHeader`, others use custom back buttons (`wordchunks.tsx` line 419, `writing.tsx` line 416-417).

**Fix (inside PolyPuffUI BackHeader component):**

```tsx
<TouchableOpacity
  onPress={() => router.back()}
  accessibilityRole="button"
  accessibilityLabel="Go back"
  accessibilityHint="Returns to the previous screen"
  style={s.backBtn}
>
  <ArrowLeft size={22} color={C.text} />
</TouchableOpacity>
```

---

## Additional Files You Should Share

To complete the accessibility implementation, I'll also need these component files that are imported but weren't uploaded:

| File | Why Needed |
|---|---|
| `components/PolyPuffUI.tsx` | Contains `ScreenBackground`, `BackHeader`, `GlassCard`, `NeonButton`, `NeonInput`, `SectionTitle` — all need accessibility props |
| `components/FeedbackDashboard.tsx` | The results card with error underlines and interactive corrections — critical for accessibility |
| `components/DiscussWithPuff.tsx` | AI chat component used in every screen — needs AI badge, report button, accessible chat bubbles |
| `components/VoiceInput.tsx` | Voice recording component — needs recording state announcements |
| `components/AIDisclosureBanner.tsx` | AI transparency banner — needs screen reader support |
| `components/PolyPuffScene.tsx` | The 3D mascot — needs to be wrapped or marked decorative |
| `components/SettingsButton.tsx` | Appears on multiple screens — needs label |
| `components/Onboarding.tsx` | First-time experience — must be accessible from the start |
| `components/LegalGateController.tsx` | Age gate + terms — legally critical to be accessible |
| `contexts/ThemeContext.tsx` | Color definitions — need contrast ratio fixes |
| `services/api.ts` | Needed for understanding server communication patterns |
| `services/sounds.ts` | Haptic/sound service — needs accessibility alternatives |
| `services/timerService.ts` | Timer — needs accessible time announcements |

---

## Implementation Priority Order

**Phase 1 — Ship Blockers (Week 1)**
1. Add `accessibilityLabel` and `accessibilityRole` to all buttons and inputs (all files)
2. Fix contrast ratios in ThemeContext
3. Add `accessibilityViewIsModal` to all modals
4. Add `AccessibilityInfo.announceForAccessibility()` after all async results

**Phase 2 — Meaningful Use (Week 2)**
5. Create `utils/accessibility.ts` with `scaledFont()` and `useScreenReader()`
6. Apply `scaledFont()` to all student-facing text
7. Add text labels alongside color-only score indicators
8. Fix Listening screen with persistent transcript toggle
9. Fix Vocabulary flashcard flip announcements

**Phase 3 — Polish (Week 3)**
10. Add accessible states to all level/difficulty pill selectors
11. Fix Sentence Builder word tile navigation
12. Add timer announcements to Challenges
13. Comprehensive screen reader testing on both iOS and Android

---

## Testing Checklist

- [ ] Enable TalkBack (Android) and navigate every screen by swipe
- [ ] Enable VoiceOver (iOS) and navigate every screen by swipe
- [ ] Set system font to maximum size and verify no text is clipped
- [ ] Enable "Color Correction" (Android) or "Color Filters" (iOS) and verify all scores are readable
- [ ] Complete one full exercise on each screen using only a screen reader
- [ ] Verify all modals can be dismissed with accessibility gestures
- [ ] Test with Android "Accessibility Scanner" app for automated checks
