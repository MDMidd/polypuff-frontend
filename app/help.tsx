/**
 * Help & Tutorial Screen — Poly-Puff
 * =====================================
 *
 * Sections:
 *   1. Getting Started — intro for new students
 *   2. Practice Hub & Navigation — where things live
 *   3. Exercises Guide — how each exercise works
 *   4. CEFR Levels — what A0-C2 mean
 *   5. Scoring & XP — how scores work + Discuss with Poly-Puff
 *   6. Progress, Data & Support — reports, settings, and feedback
 *   7. Tips & Tricks — study advice
 *   8. FAQ — common questions
 *
 * FILE: app/help.tsx
 */

import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Animated, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import {
  BookOpen, Headphones, PenTool, Brain, Layers, Puzzle,
  Pencil, ClipboardCheck, ChevronDown, ChevronRight,
  HelpCircle, Lightbulb, Award, Target, MessageCircle,
  Star, Zap, TrendingUp, Info, Archive, GraduationCap,
  Briefcase, Settings, BarChart3,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenBackground, BackHeader } from '../components/PolyPuffUI';
import PolyPuffScene from '../components/PolyPuffScene';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Accordion Section ──────────────────────────────────────────────────────
function Section({ title, icon: Icon, iconColor, children, C }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View style={[st.section, { borderColor: (iconColor || C.border) + '25' }]}>
      <TouchableOpacity onPress={toggle} style={st.sectionHeader} activeOpacity={0.7}>
        <View style={[st.sectionIconBg, { backgroundColor: (iconColor || C.cyan) + '15' }]}>
          {Icon && <Icon size={18} color={iconColor || C.cyan} />}
        </View>
        <Text style={[st.sectionTitle, { color: C.text }]}>{title}</Text>
        {open
          ? <ChevronDown size={18} color={C.textMuted} />
          : <ChevronRight size={18} color={C.textMuted} />}
      </TouchableOpacity>
      {open && (
        <View style={[st.sectionBody, { borderTopColor: (C.border || '#334155') + '20' }]}>
          {children}
        </View>
      )}
    </View>
  );
}

// ─── Exercise Card ──────────────────────────────────────────────────────────
function ExerciseGuide({ icon: Icon, name, color, steps, tip, C }) {
  return (
    <View style={[st.exGuide, { borderLeftColor: color }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon size={16} color={color} />
        <Text style={[st.exName, { color }]}>{name}</Text>
      </View>
      {steps.map((step, i) => (
        <View key={i} style={st.stepRow}>
          <View style={[st.stepNum, { backgroundColor: color + '20' }]}>
            <Text style={[st.stepNumText, { color }]}>{i + 1}</Text>
          </View>
          <Text style={[st.stepText, { color: C.textSec }]}>{step}</Text>
        </View>
      ))}
      {tip && (
        <View style={[st.tipRow, { backgroundColor: '#FBBF2410', borderColor: '#FBBF2425' }]}>
          <Lightbulb size={12} color="#FBBF24" />
          <Text style={st.tipText}>{tip}</Text>
        </View>
      )}
    </View>
  );
}

// ─── CEFR Level Card ────────────────────────────────────────────────────────
function LevelCard({ code, name, desc, examples, color, C }) {
  return (
    <View style={[st.levelCard, { borderLeftColor: color }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <View style={[st.levelBadge, { backgroundColor: color + '20' }]}>
          <Text style={[st.levelCode, { color }]}>{code}</Text>
        </View>
        <Text style={[st.levelName, { color: C.text }]}>{name}</Text>
      </View>
      <Text style={[st.levelDesc, { color: C.textSec }]}>{desc}</Text>
      {examples && <Text style={[st.levelEx, { color: C.textMuted }]}>Example: "{examples}"</Text>}
    </View>
  );
}

// ─── Feature Summary Card ───────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, text, color, C }) {
  return (
    <View style={[st.featureCard, { borderColor: color + '25', backgroundColor: color + '08' }]}>
      <View style={[st.featureIcon, { backgroundColor: color + '18' }]}>
        {Icon && <Icon size={16} color={color} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[st.featureTitle, { color: C.text }]}>{title}</Text>
        <Text style={[st.featureText, { color: C.textSec }]}>{text}</Text>
      </View>
    </View>
  );
}

// ─── FAQ Item ───────────────────────────────────────────────────────────────
function FAQ({ q, a, C }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setOpen(!open); }} style={st.faqItem} activeOpacity={0.7}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <HelpCircle size={14} color={C.cyan || '#00E5FF'} />
        <Text style={[st.faqQ, { color: C.text }]}>{q}</Text>
      </View>
      {open && <Text style={[st.faqA, { color: C.textSec }]}>{a}</Text>}
    </TouchableOpacity>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export default function HelpScreen() {
  const { colors: C } = useTheme();
  const { wt } = useLanguage();
  const router = useRouter();

  return (
    <ScreenBackground>
      <BackHeader title={wt('help')} />
      <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>

        {/* Mascot */}
        <View style={st.mascotRow}>
          <PolyPuffScene size={600} />
          <View style={[st.welcomeBubble, { backgroundColor: (C.card || '#1E293B') + 'EE', borderColor: (C.cyan || '#00E5FF') + '25' }]}>
            <Text style={[st.welcomeText, { color: C.text }]}>
              Hi there! I'm Poly-Puff, your language learning buddy. Let me show you around! 🐡
            </Text>
          </View>
        </View>

        {/* ── 1. GETTING STARTED ─────────────────────────────────────────── */}
        <Section title="Getting Started" icon={Star} iconColor="#FBBF24" C={C}>
          <Text style={[st.body, { color: C.textSec }]}>
            Welcome to Poly-Puff! Here's how to get the most out of your learning:
          </Text>
          <View style={st.startSteps}>
            {[
              { emoji: '👤', text: 'Set up your profile — choose your native language and English level' },
              { emoji: '🎯', text: 'Take the Placement Test to find your CEFR level (or choose it manually)' },
              { emoji: '📚', text: 'Pick any exercise from the Practice hub, including exam prep and Business English' },
              { emoji: '⚙️', text: 'Use Customise Practice List to show, hide, or reorder your modules' },
              { emoji: '📊', text: 'Track your progress on the Progress tab' },
              { emoji: '💬', text: 'After each exercise, discuss your score with me if you disagree!' },
            ].map((s, i) => (
              <View key={i} style={st.startStep}>
                <Text style={st.startEmoji}>{s.emoji}</Text>
                <Text style={[st.startText, { color: C.textSec }]}>{s.text}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* ── 2. PRACTICE HUB & NAVIGATION ───────────────────────────────── */}
        <Section title="Practice Hub & Navigation" icon={Info} iconColor="#00E5FF" C={C}>
          <Text style={[st.body, { color: C.textSec }]}>
            The app has two main tabs and a drawer menu. The Practice tab is where you start learning; the Progress tab is where you review results.
          </Text>
          <FeatureCard C={C} icon={BookOpen} color="#60A5FA" title="Practice tab"
            text="Start Placement, Translation, Word Chunks, Listening, Writing, Grammar, Vocabulary, exam prep, Business English, and Daily Challenge modules." />
          <FeatureCard C={C} icon={BarChart3} color="#34D399" title="Progress tab"
            text="Review XP, streaks, accuracy, exercise history, weak areas, detailed module results, and downloadable progress reports." />
          <FeatureCard C={C} icon={Settings} color="#FBBF24" title="Profile menu"
            text="Tap your profile photo in the top-left to edit your profile, open Help, send Feedback, or change Settings." />
          <FeatureCard C={C} icon={Settings} color="#B06CFF" title="Customise Practice List"
            text="Choose which modules appear on the Practice tab, reorder them, or apply bundles like Exam Preparation, Business, Grammar Intensive, or Everything." />
        </Section>

        {/* ── 3. EXERCISES GUIDE ─────────────────────────────────────────── */}
        <Section title="Exercise Guides" icon={BookOpen} iconColor="#60A5FA" C={C}>

          <ExerciseGuide C={C} icon={ClipboardCheck} name="Placement Test" color="#00E5FF" steps={[
            'Answer a series of grammar and vocabulary questions',
            'The test adapts to your level as you go',
            'Get placed into the right CEFR level (A0-C2)',
            'You can retake it anytime to track your improvement',
          ]} tip="Take this first! It helps all exercises match your level." />

          <ExerciseGuide C={C} icon={BookOpen} name="Translation Trainer" color="#B06CFF" steps={[
            'A sentence appears in your native language',
            'Type the English translation in the text box',
            'Tap "Check" to get your score and detailed feedback',
            'Tap underlined errors to see the specific grammar rule',
            'Use "Listen to Native" to hear the correct pronunciation',
          ]} tip="Don't worry about perfect word-for-word translations — natural English phrasing scores well!" />

          <ExerciseGuide C={C} icon={Puzzle} name="Word Chunks" color="#34D399" steps={[
            'A short phrase appears in your native language (2-5 words)',
            'Type the natural English equivalent',
            'These are fixed expressions — learn them as complete units',
            'Choose a category (Idioms, Phrasal Verbs, etc.) or let it be random',
          ]} tip="Chunks are how native speakers actually talk. Learning them makes you sound more natural!" />

          <ExerciseGuide C={C} icon={Headphones} name="Listening" color="#00E5FF" steps={[
            'Choose your difficulty (Easy/Medium/Hard)',
            'Listen to the English audio carefully',
            'Type exactly what you heard',
            'Your words are compared one-by-one — matching words show green, errors show red',
          ]} tip="Start on Easy (slower speed + you can see the text). Work up to Hard for real challenge!" />

          <ExerciseGuide C={C} icon={PenTool} name="Writing" color="#34D399" steps={[
            'Choose a writing prompt or write freely',
            'Type your text in English',
            'Get scored on grammar (40%), vocabulary (20%), coherence (20%), and task completion (20%)',
            'Read the "Improved Version" to see how a native speaker would write it',
          ]} tip="Write at least 3-4 sentences. Short one-line answers get lower scores." />

          <ExerciseGuide C={C} icon={Brain} name="Grammar Quiz" color="#F59E0B" steps={[
            'Multiple choice questions from a bank of grammar topics',
            'Select the correct answer from 4 options',
            'After the quiz, review your mistakes with explanations',
          ]} tip="Read all options carefully before choosing — tricky questions test common ESL mistakes!" />

          <ExerciseGuide C={C} icon={Pencil} name="Grammar Practice" color="#F472B6" steps={[
            'Choose from 3 modes: Error Correction, Sentence Builder, or Fill in the Blank',
            'Error Correction: Find and fix grammar mistakes in a sentence',
            'Sentence Builder: Tap words in the correct order',
            'Fill in the Blank: Type the missing word or phrase',
            'Each exercise gives detailed feedback with grammar rules',
          ]} tip="Try all three modes — they train different skills. Sentence Builder is great for word order!" />

          <ExerciseGuide C={C} icon={Layers} name="Vocabulary" color="#B06CFF" steps={[
            'Flashcards test you on word definitions',
            'See the word, try to remember the meaning, then reveal it',
            'Mark each card as "Got it" or "Missed it"',
            'Missed words come back more often (spaced repetition)',
          ]} tip="Review vocabulary daily, even for just 5 minutes. Consistency beats long sessions!" />

          <ExerciseGuide C={C} icon={Archive} name="Vocabulary Vault" color="#FBBF24" steps={[
            'Collect useful words from practice or add your own manually',
            'Search for definitions and example sentences',
            'Study saved words as focused flashcards',
            'Export your vocabulary as Word, CSV, or PDF files',
          ]} tip="Save words you actually want to use. A smaller, personal list is more useful than a huge random one." />

          <ExerciseGuide C={C} icon={GraduationCap} name="IELTS Preparation" color="#00E5FF" steps={[
            'Review the IELTS overview, scoring, and section guides',
            'Practise Writing, Speaking, Reading, and Listening-style tasks',
            'Use AI feedback to estimate band performance and improve responses',
            'Compare your work against higher-band examples and tips',
          ]} tip="Use IELTS when your goal is university, immigration, or work programs that request IELTS bands." />

          <ExerciseGuide C={C} icon={GraduationCap} name="TOEFL iBT Prep" color="#B06CFF" steps={[
            'Learn the TOEFL iBT structure, sections, and score conversion',
            'Practise Reading, Listening, Writing, and Speaking tasks',
            'Try updated task formats and get instant AI feedback',
            'Use the Scores section to understand band-style and legacy score ranges',
          ]} tip="TOEFL is especially useful for academic English and campus-style communication tasks." />

          <ExerciseGuide C={C} icon={GraduationCap} name="CAE — C1 Advanced" color="#34D399" steps={[
            'Study Cambridge C1 Advanced exam sections and task types',
            'Practise exam-style Reading, Use of English, Writing, Listening, and Speaking prompts',
            'Review model answers, strategies, and high-level language patterns',
            'Use AI practice for targeted C1 feedback',
          ]} tip="CAE is best when you are already upper-intermediate or advanced and want formal C1 certification." />

          <ExerciseGuide C={C} icon={Briefcase} name="Business English" color="#00E5A0" steps={[
            'Choose a domain such as email, meetings, presentations, networking, or negotiations',
            'Learn essential phrases and practical communication tips',
            'Generate professional scenarios and write your response',
            'Get a professional score, strengths, improvements, and a polished rewrite',
          ]} tip="Practise real situations from your work life so the feedback transfers directly into meetings and messages." />

          <ExerciseGuide C={C} icon={Award} name="Daily Challenge" color="#F59E0B" steps={[
            'Open Daily Challenge from the Practice tab',
            'Complete the daily task for bonus XP',
            'Keep your streak alive by practising regularly',
            'Review your streak and challenge progress on the Progress tab',
          ]} tip="Daily Challenge is the quickest way to keep momentum when you only have a few minutes." />
        </Section>

        {/* ── 4. CEFR LEVELS ─────────────────────────────────────────────── */}
        <Section title="CEFR Levels Explained" icon={TrendingUp} iconColor="#34D399" C={C}>
          <Text style={[st.body, { color: C.textSec, marginBottom: 12 }]}>
            The Common European Framework of Reference (CEFR) is the international standard for measuring language ability. Here's what each level means:
          </Text>
          <LevelCard C={C} code="A0" name="Beginner" color="#94A3B8"
            desc="No prior English knowledge. Starting from zero."
            examples="Hello. Yes. No. One, two, three." />
          <LevelCard C={C} code="A1" name="Elementary" color="#F472B6"
            desc="Can understand and use basic everyday phrases. Can introduce themselves."
            examples="My name is Ana. I am from Brazil." />
          <LevelCard C={C} code="A2" name="Pre-Intermediate" color="#FB923C"
            desc="Can handle simple conversations about familiar topics. Basic past tense."
            examples="Yesterday I went to the shop and bought some food." />
          <LevelCard C={C} code="B1" name="Intermediate" color="#FBBF24"
            desc="Can discuss familiar topics, express opinions, and understand main points."
            examples="I think learning English is important because it helps with my career." />
          <LevelCard C={C} code="B2" name="Upper-Intermediate" color="#34D399"
            desc="Can interact fluently with native speakers. Complex sentences and idioms."
            examples="Had it not been for the traffic, I would have arrived on time." />
          <LevelCard C={C} code="C1" name="Advanced" color="#60A5FA"
            desc="Can express complex ideas fluently. Sophisticated grammar and vocabulary."
            examples="The implications of this policy are far-reaching and warrant careful consideration." />
          <LevelCard C={C} code="C2" name="Proficient" color="#A78BFA"
            desc="Near-native level. Understands virtually everything with nuance and precision."
            examples="She couldn't help but wonder whether the ostensibly altruistic gesture belied a more self-serving agenda." />
        </Section>

        {/* ── 5. SCORING & DISCUSS ───────────────────────────────────────── */}
        <Section title="Scoring & Discussing" icon={Target} iconColor="#F59E0B" C={C}>
          <Text style={[st.body, { color: C.textSec }]}>
            Every exercise gives you a score from 0-100. Here's what the ranges mean:
          </Text>
          <View style={st.scoreGrid}>
            {[
              { range: '90-100', label: 'Excellent', color: '#34D399', desc: 'Perfect or near-perfect answer' },
              { range: '70-89', label: 'Good', color: '#00D9FF', desc: 'Minor errors, solid understanding' },
              { range: '50-69', label: 'OK', color: '#FFB347', desc: 'Some errors but core meaning is there' },
              { range: '0-49', label: 'Needs Work', color: '#F87171', desc: 'Significant errors — keep practising!' },
            ].map((s, i) => (
              <View key={i} style={[st.scoreRow, { borderLeftColor: s.color }]}>
                <Text style={[st.scoreRange, { color: s.color }]}>{s.range}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[st.scoreLabel, { color: C.text }]}>{s.label}</Text>
                  <Text style={[st.scoreDesc, { color: C.textMuted }]}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[st.discussBox, { backgroundColor: '#8B5CF615', borderColor: '#8B5CF630' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <MessageCircle size={16} color="#A78BFA" />
              <Text style={[st.discussTitle, { color: '#A78BFA' }]}>Discuss with Poly-Puff</Text>
            </View>
            <Text style={[st.body, { color: C.textSec, marginBottom: 0 }]}>
              After every exercise, you can tap "Discuss with Poly-Puff" to argue your score. If you used a valid synonym, correct alternative phrasing, or think the grading was too harsh — tell me! I'll consider your argument and may adjust your score. However, verified grammar rules from our database cannot be overridden.
            </Text>
          </View>
        </Section>

        {/* ── 6. PROGRESS, DATA & SUPPORT ────────────────────────────────── */}
        <Section title="Progress, Data & Support" icon={BarChart3} iconColor="#34D399" C={C}>
          <FeatureCard C={C} icon={BarChart3} color="#34D399" title="Progress reports"
            text="Track XP level, streaks, average accuracy, total time, exercise history, weak areas, and downloadable PDF reports." />
          <FeatureCard C={C} icon={Headphones} color="#00E5FF" title="My Recordings"
            text="Voice recordings from speaking-enabled exercises are grouped by exercise, with duration, date, storage use, playback, and delete controls." />
          <FeatureCard C={C} icon={Settings} color="#FBBF24" title="Settings"
            text="Manage your practice list, backend URL, mascot, sound, haptics, streak reminders, weekly digest, offline cache, account data, and app info." />
          <FeatureCard C={C} icon={MessageCircle} color="#B06CFF" title="Feedback"
            text={wt('help-feedback-feature-text')} />
          <FeatureCard C={C} icon={Award} color="#F472B6" title="Vouchers and access"
            text="If you receive a voucher code, redeem it on the Voucher Code screen to unlock the access tied to that code." />
        </Section>

        {/* ── 7. TIPS & TRICKS ───────────────────────────────────────────── */}
        <Section title="Tips & Tricks" icon={Lightbulb} iconColor="#FBBF24" C={C}>
          {[
            { emoji: '🔁', title: 'Practice daily', text: 'Even 10 minutes a day is better than 2 hours once a week. Consistency is key!' },
            { emoji: '🎧', title: 'Use the audio', text: 'Always listen to the native pronunciation. It trains your ear and helps with speaking too.' },
            { emoji: '📖', title: 'Learn word chunks', text: 'Native speakers use fixed phrases (like "by the way", "as soon as possible"). Learning these makes you sound natural.' },
            { emoji: '❌', title: 'Embrace mistakes', text: 'Errors are how you learn! Review your mistakes on the Progress screen and focus on weak areas.' },
            { emoji: '⬆️', title: 'Level up gradually', text: 'Start at your CEFR level. When you consistently score 85+, move up one level.' },
            { emoji: '💬', title: 'Challenge your scores', text: 'If you think your answer was correct, discuss it with Poly-Puff! Sometimes there are multiple valid answers.' },
            { emoji: '🧭', title: 'Make the hub yours', text: 'Hide modules you do not need and apply a bundle that matches your goal, such as exams, business, or vocabulary.' },
            { emoji: '✍️', title: 'Write more than minimum', text: 'In Writing exercises, longer answers with varied vocabulary score higher than short ones.' },
            { emoji: '🧩', title: 'Try every exercise type', text: 'Translation trains accuracy. Listening trains comprehension. Grammar trains rules. Use them all!' },
            { emoji: '💡', title: wt('help-tip-nudge-title'), text: wt('help-tip-nudge-body') },
          ].map((t, i) => (
            <View key={i} style={st.tipCard}>
              <Text style={st.tipEmoji}>{t.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[st.tipTitle, { color: C.text }]}>{t.title}</Text>
                <Text style={[st.tipBody, { color: C.textSec }]}>{t.text}</Text>
              </View>
            </View>
          ))}
        </Section>

        {/* ── 8. FAQ ─────────────────────────────────────────────────────── */}
        <Section title="Frequently Asked Questions" icon={HelpCircle} iconColor="#60A5FA" C={C}>
          <FAQ C={C}
            q="Do I need an internet connection?"
            a="Most exercises need a connection to our server for AI-powered feedback. Some features like vocabulary flashcards have offline fallbacks, but for the best experience, stay connected." />
          <FAQ C={C}
            q="Why did I get a low score when my answer was correct?"
            a="There might be multiple valid translations! Tap 'Discuss with Poly-Puff' after any exercise to argue your case. If you used a valid synonym or alternative phrasing, your score may be adjusted." />
          <FAQ C={C}
            q="What does the Placement Test actually test?"
            a="It tests grammar, vocabulary, and sentence structure across all CEFR levels. The test adapts as you answer — harder questions appear when you answer correctly. It takes about 5-10 minutes." />
          <FAQ C={C}
            q="How do I change my native language?"
            a="Open Settings and use the 'My Native Language' selector under Language & Level. Changes take effect on your next exercise." />
          <FAQ C={C}
            q="What are 'Word Chunks'?"
            a="Word chunks are short fixed phrases that native speakers use as single units — like 'by the way', 'make a decision', or 'looking forward to'. Learning them makes your English sound more natural than translating word-by-word." />
          <FAQ C={C}
            q="How is my writing scored?"
            a="Writing is scored on four criteria: Grammar accuracy (40%), Vocabulary range (20%), Coherence and organization (20%), and Task completion (20%). You'll also see an improved version of your text." />
          <FAQ C={C}
            q="Can I use British English?"
            a="Yes! Both British and American English spellings are accepted (colour/color, organise/organize, etc.). Contractions are also treated as equal to full forms (don't = do not)." />
          <FAQ C={C}
            q="When should I move to the next level?"
            a="When you consistently score 85% or higher across different exercise types, you're ready to move up one CEFR level. You can also retake the Placement Test to confirm." />
          <FAQ C={C}
            q="Why did a module disappear from my Practice tab?"
            a="It may be hidden by your practice list settings. Open Settings, then Customise Practice List, and turn the module back on or apply the Everything bundle." />
          <FAQ C={C}
            q="Where can I see detailed progress?"
            a="Open the Progress tab to see XP, streaks, accuracy, history, and weak areas. Tap an exercise summary for deeper details, or download a PDF progress report." />
          <FAQ C={C}
            q="Where are my voice recordings?"
            a="Open My Recordings from Progress-related screens. Recordings are saved locally by exercise type, and you can play or delete them there." />
          <FAQ C={C}
            q="How do I export my saved vocabulary?"
            a="Open Vocabulary Vault, tap export, and choose Word, CSV, or PDF. The export uses your saved words, definitions, examples, and practice data." />
          <FAQ C={C}
            q="How do I report a problem or suggest a feature?"
            a={wt('help-faq-report-a')} />
          <FAQ C={C}
            q={wt('help-faq-nudge-q')}
            a={wt('help-faq-nudge-a')} />
        </Section>

        <View
          style={{
            alignItems: 'center',
            marginTop: 18,
            padding: 20,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: C.border + '40',
            backgroundColor: C.card,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '800', color: C.text, marginBottom: 6 }}>
            Still need help?
          </Text>
          <Text style={{ fontSize: 13, color: C.textSec, textAlign: 'center', lineHeight: 19, marginBottom: 14 }}>
            Our support team is happy to help with any questions.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/feedback')}
            style={{
              minHeight: 44,
              paddingHorizontal: 22,
              borderRadius: 999,
              backgroundColor: C.cyan || '#00E5FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel="Send a message"
          >
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#06111F' }}>Send a Message</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },

  mascotRow: { alignItems: 'center', marginBottom: 20 },
  welcomeBubble: {
    borderRadius: 16, paddingHorizontal: 18, paddingVertical: 12,
    borderWidth: 1, maxWidth: '90%', marginTop: 8,
  },
  welcomeText: { fontSize: 14, fontWeight: '500', textAlign: 'center', lineHeight: 21 },

  section: {
    borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  sectionIconBg: {
    width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { flex: 1, fontSize: 16, fontWeight: '700' },
  sectionBody: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1 },

  body: { fontSize: 13, lineHeight: 20, marginBottom: 12, marginTop: 8 },

  // Getting started
  startSteps: { gap: 10, marginTop: 4 },
  startStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  startEmoji: { fontSize: 18, marginTop: 1 },
  startText: { flex: 1, fontSize: 13, lineHeight: 19 },

  // Exercise guides
  exGuide: {
    borderLeftWidth: 3, paddingLeft: 12, marginTop: 14, marginBottom: 6,
  },
  exName: { fontSize: 14, fontWeight: '700' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  stepNum: {
    width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  stepNumText: { fontSize: 11, fontWeight: '800' },
  stepText: { flex: 1, fontSize: 12, lineHeight: 18 },
  tipRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, borderWidth: 1, marginTop: 6,
  },
  tipText: { fontSize: 11, color: '#FDE68A', lineHeight: 16, flex: 1 },

  // CEFR levels
  levelCard: {
    borderLeftWidth: 3, paddingLeft: 12, marginBottom: 12,
  },
  levelBadge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8,
  },
  levelCode: { fontSize: 13, fontWeight: '800' },
  levelName: { fontSize: 14, fontWeight: '700' },
  levelDesc: { fontSize: 12, lineHeight: 17, marginTop: 2 },
  levelEx: { fontSize: 11, fontStyle: 'italic', marginTop: 3, lineHeight: 16 },

  // Feature summaries
  featureCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 10,
  },
  featureIcon: {
    width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
  },
  featureTitle: { fontSize: 13, fontWeight: '700', marginBottom: 3 },
  featureText: { fontSize: 12, lineHeight: 17 },

  // Scoring
  scoreGrid: { gap: 8, marginTop: 8, marginBottom: 14 },
  scoreRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderLeftWidth: 3, paddingLeft: 10, paddingVertical: 4,
  },
  scoreRange: { fontSize: 13, fontWeight: '800', width: 52 },
  scoreLabel: { fontSize: 13, fontWeight: '700' },
  scoreDesc: { fontSize: 11, lineHeight: 15 },
  discussBox: {
    borderRadius: 12, borderWidth: 1, padding: 14,
  },
  discussTitle: { fontSize: 14, fontWeight: '700' },

  // Tips
  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 10,
  },
  tipEmoji: { fontSize: 20, marginTop: 1 },
  tipTitle: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  tipBody: { fontSize: 12, lineHeight: 17 },

  // FAQ
  faqItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  faqQ: { fontSize: 13, fontWeight: '700', flex: 1 },
  faqA: { fontSize: 12, lineHeight: 18, marginTop: 6, paddingLeft: 22 },
});
