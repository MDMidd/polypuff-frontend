/**
 * Corporate / Business English Screen - Poly-Puff
 * =================================================
 * Practical business English skills across 8 workplace domains.
 * All exercises generated fresh by AI on demand.
 *
 * Domains:
 *   Emails & Written Communication
 *   Meetings & Discussions
 *   Presentations & Pitching
 *   Negotiations
 *   Reports & Proposals
 *   Telephone & Video Calls
 *   Small Talk & Networking
 *   Cross-Cultural Communication
 *
 * Each domain has: Learn (phrases + tips), Practice (AI exercise),
 * and a Vocabulary Bank.
 *
 * FILE: app/business.tsx
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView, TextInput,
  Alert, ActivityIndicator, Modal, Platform,
  KeyboardAvoidingView, Animated, Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Mail, Mic, BookOpen, PenTool, Phone, Users, Globe,
  Briefcase, ChevronDown, ChevronUp, ChevronRight,
  Star, Send, X, Zap, RefreshCw, CheckCircle,
  MessageSquare, TrendingUp, Award, Headphones,
  Coffee, Building, FileText, ArrowLeft,
  MapPin, Lightbulb, BookmarkPlus,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenBackground, BackHeader } from '../components/PolyPuffUI';
import { scaledFont } from '../utils/accessibility';
import { useFeedbackNudge } from '../hooks/useFeedbackNudge';
import FeedbackNudgeModal from '../components/FeedbackNudgeModal';
import AIDisclosureBanner from '../components/AIDisclosureBanner';
import SkillLevelBadge from '../components/SkillLevelBadge';
import { getServerUrl, errorFromResponse } from '../services/api';
import { useAuthFailureHandler } from '../hooks/useAuthFailureHandler';
import { hapticSuccess, hapticLight, feedbackForScore } from '../services/sounds';
import { recordExerciseTime } from '../services/timerService';
import { recordModuleProgress } from '../services/progressService';
import { recordXP } from '../services/progressSyncService';
import { pushVaults } from '../services/syncService';
import { getAuthHeaders } from '../utils/auth';

// ── Domain definitions ────────────────────────────────────────────────────────
const DOMAINS = [
  {
    id: 'emails',
    label: 'Emails & Writing',
    icon: Mail,
    colour: '#00E5FF',
    desc: 'Professional emails, memos, formal letters',
    skills: ['Email etiquette', 'Formal vs informal register', 'Subject lines', 'CC/BCC', 'Follow-ups'],
    phrases: [
      { cat: 'Opening', items: ['I am writing to enquire about...', 'Further to our conversation...', 'Thank you for your email of...', 'I hope this email finds you well.', 'With reference to...'] },
      { cat: 'Requesting', items: ['Could you please...', 'I would be grateful if you could...', 'Would it be possible to...', 'I would appreciate it if...', 'Could I ask you to...'] },
      { cat: 'Apologising', items: ['I apologise for any inconvenience caused.', 'I am sorry for the delay in responding.', 'Please accept my apologies for...', 'I regret to inform you that...'] },
      { cat: 'Closing', items: ['Please do not hesitate to contact me.', 'I look forward to hearing from you.', 'Thank you for your time and consideration.', 'Kind regards / Yours sincerely / Best regards'] },
    ],
    tips: [
      'Subject line: be specific - "Q3 Budget Review - Action Required" beats "Update"',
      'Match your tone to the relationship: formal for new contacts, warmer for established ones',
      'Keep emails under 150 words when possible - busy professionals skim',
      'One topic per email - multiple topics cause delays when only one part is answered',
      'Always end with a clear call to action: what do you need, by when?',
      'Avoid passive-aggressive phrases: "As per my last email..." - restate the point instead',
      '2026 tip: Avoid AI-sounding openers like "I hope this finds you well" - start with the point',
    ],
    exerciseTypes: ['email_formal', 'email_complaint', 'email_followup', 'email_decline', 'email_request'],
  },
  {
    id: 'meetings',
    label: 'Meetings',
    icon: Users,
    colour: '#00E5A0',
    desc: 'Chairing, participating, and following up on meetings',
    skills: ['Chairing meetings', 'Taking minutes', 'Interrupting politely', 'Making proposals', 'Agreeing/disagreeing'],
    phrases: [
      { cat: 'Opening', items: ["Let's get started.", "Shall we begin?", "The purpose of today's meeting is...", "We have about an hour, so let's keep things moving.", "Let me hand over to..."] },
      { cat: 'Interrupting Politely', items: ['Sorry to interrupt, but...', "If I could just add...", "Can I come in here?", "Before we move on, I'd like to...", "Could I make a point here?"] },
      { cat: 'Clarifying', items: ['Could you clarify what you mean by...?', "So what you're saying is...", "Let me make sure I understand...", "Could you elaborate on that?", "What do you mean exactly?"] },
      { cat: 'Agreeing / Disagreeing', items: ["I completely agree.", "That's a good point.", "I see your point, but...", "I'm not sure I agree with that.", "I'd like to push back on that a little.", "I take a different view."] },
      { cat: 'Closing', items: ["Let's wrap up.", "To summarise the key decisions...", "The action points are...", "Our next meeting will be...", "I'll send out the minutes by..."] },
    ],
    tips: [
      'Send an agenda at least 24 hours before - "Any Other Business" meetings waste time',
      'Assign a timekeeper and stick to it - go over on one item and others suffer',
      'Remote meetings: camera on, mute when not speaking, use hand-raise features',
      'Summarise action points aloud at the end: who does what, by when',
      "As chair: draw out quieter participants: \"We haven't heard from [name] yet...\"",
      "Disagreeing: cushion criticism - \"That's an interesting approach - have we considered...?\"",
    ],
    exerciseTypes: ['meeting_chair', 'meeting_participate', 'meeting_minutes', 'meeting_agenda', 'meeting_virtual'],
  },
  {
    id: 'presentations',
    label: 'Presentations',
    icon: TrendingUp,
    colour: '#FFBE0B',
    desc: 'Pitching ideas, delivering data, Q&A handling',
    skills: ['Structure', 'Signposting', 'Data language', 'Handling questions', 'Persuasion'],
    phrases: [
      { cat: 'Opening', items: ["Good morning, I'm here today to...", "My presentation will cover three key areas...", "By the end of this, you'll understand...", "I'd like to start by asking you a question..."] },
      { cat: 'Signposting', items: ["Moving on to...", "Let me now turn to...", "As you can see from this chart...", "I'd like to draw your attention to...", "This brings me to my next point..."] },
      { cat: 'Data Language', items: ["The figures show a significant increase of...", "Sales rose sharply by 23% in Q2.", "There was a slight decline in...", "The data suggests a clear trend towards...", "This represents a year-on-year improvement of..."] },
      { cat: 'Handling Questions', items: ["That's a great question.", "I'm glad you raised that.", "I'll come back to that - if that's OK?", "That's outside the scope of today, but I'm happy to discuss it afterwards.", "To be honest, I don't have that data to hand, but I'll find out."] },
      { cat: 'Closing', items: ["To summarise the three key takeaways...", "In conclusion...", "Thank you for your attention.", "I'd welcome any questions.", "I'll leave my contact details on the final slide."] },
    ],
    tips: [
      "Structure: Tell them what you\'ll say, say it, tell them what you said",
      'Open with a hook: a striking statistic, a question, or a short story',
      "Slides support your words - they\'re not a script. Max 6 words per bullet",
      'Pause after key points - silence gives your audience time to absorb ideas',
      "Practice the first 90 seconds until it\'s automatic - confidence starts there",
      "Handling tough questions: buy time - \"That\'s an important question. Let me think...\"",
      '2026: Virtual presentations - check your background, lighting, and mic quality first',
    ],
    exerciseTypes: ['presentation_intro', 'presentation_data', 'presentation_qa', 'presentation_pitch', 'presentation_close'],
  },
  {
    id: 'negotiations',
    label: 'Negotiations',
    icon: Briefcase,
    colour: '#B06CFF',
    desc: 'Contracts, pricing, deadlines, compromise',
    skills: ['Opening positions', 'Making concessions', 'BATNA', 'Anchoring', 'Closing deals'],
    phrases: [
      { cat: 'Opening', items: ["Our position is...", "We're looking for a mutually beneficial solution.", "Let me explain what we're hoping to achieve.", "We have some flexibility, but our main priority is...", "What are your key requirements?"] },
      { cat: 'Making Offers', items: ["We can offer you...", "How about we...", "What if we were to...", "We'd be willing to consider... if you could...", "Our best offer at this stage is..."] },
      { cat: 'Concessions', items: ["We could be flexible on... if you could move on...", "That's not something we can agree to, but we could...", "In the spirit of compromise...", "We're prepared to meet you halfway.", "We can accommodate that, provided that..."] },
      { cat: 'Stalling / Buying Time', items: ["I'll need to take that back to my team.", "That's something we'd need to consider carefully.", "Can we take a short break?", "I'm not in a position to agree to that right now."] },
      { cat: 'Closing', items: ["I think we have a deal.", "Shall we put that in writing?", "Let me just confirm what we've agreed...", "I'll have the contract drafted and sent to you by..."] },
    ],
    tips: [
      'Know your BATNA (Best Alternative To Negotiated Agreement) before you sit down',
      'Anchor high - your first offer shapes the entire negotiation range',
      "Never accept the first offer, even if it\'s good - it signals you\'re easy",
      'Silence is powerful - after making an offer, stop talking',
      "Trade, don\'t just concede: \"I can do X if you can do Y\"",
      'Separate the people from the problem - attack issues, not personalities',
      'Always summarise the deal aloud before leaving the room',
    ],
    exerciseTypes: ['negotiation_price', 'negotiation_deadline', 'negotiation_contract', 'negotiation_conflict', 'negotiation_close'],
  },
  {
    id: 'reports',
    label: 'Reports & Proposals',
    icon: FileText,
    colour: '#FF8A65',
    desc: 'Business reports, proposals, executive summaries',
    skills: ['Executive summaries', 'Report structure', 'Formal language', 'Recommendations', 'Data presentation'],
    phrases: [
      { cat: 'Introduction', items: ["This report aims to...", "The purpose of this report is to examine...", "The following report presents findings from...", "This document outlines our recommendations regarding..."] },
      { cat: 'Findings', items: ["The data indicates that...", "It was found that...", "Analysis reveals a clear pattern of...", "Notably, the results show...", "A significant factor is..."] },
      { cat: 'Recommendations', items: ["We recommend that...", "It is advisable to...", "The most effective course of action would be to...", "We strongly advise against...", "Going forward, the organisation should consider..."] },
      { cat: 'Formal Language', items: ["Furthermore / Moreover / In addition", "However / Nevertheless / On the other hand", "Consequently / As a result / Therefore", "With regard to / In relation to", "It should be noted that..."] },
    ],
    tips: [
      'Executive summary first - decision-makers read this, not the full report',
      'Use numbered sections and clear headings - reports are navigated, not read linearly',
      'Every recommendation must be supported by a finding in the report',
      'Passive voice is common in formal reports: "It was found that..." vs "We found that..."',
      'Be precise with data: "a 23% increase" beats "a significant rise"',
      'Proposals: always include a clear ROI (return on investment) argument',
    ],
    exerciseTypes: ['report_executive', 'report_findings', 'proposal_business', 'report_recommendation', 'proposal_project'],
  },
  {
    id: 'calls',
    label: 'Calls & Video',
    icon: Phone,
    colour: '#00E5FF',
    desc: 'Phone calls, conference calls, video meetings',
    skills: ['Opening calls', 'Taking messages', 'Clarifying on phone', 'Technical issues', 'Conference calls'],
    phrases: [
      { cat: 'Opening', items: ["[Name] speaking, how can I help?", "Good morning, is this a good time?", "I'm calling regarding...", "I wanted to follow up on...", "Is [name] available?"] },
      { cat: 'Clarifying', items: ["I'm sorry, could you repeat that?", "I didn't quite catch that - could you say it again?", "Could you spell that for me?", "Just to confirm, you said...", "I'm having trouble hearing you - could you speak up?"] },
      { cat: 'Technical Issues', items: ["Sorry, you broke up there.", "I think we lost someone - are you still there?", "Let me call you back - my connection is poor.", "Can everyone hear me clearly?", "I'll just share my screen - give me a moment."] },
      { cat: 'Closing', items: ["I'll send you a follow-up email.", "Thanks for your time - I'll be in touch.", "Let me know if you need anything else.", "We'll speak again on Thursday.", "I'll action that right away."] },
    ],
    tips: [
      'Answer professionally even if the number is unknown - it could be a client',
      'Conference calls: state your name before speaking if not everyone knows you',
      "Take notes during calls - don\'t rely on memory for action items",
      "Video calls: look at the camera, not your own image - it\'s better eye contact",
      'Use a wired connection for important calls - WiFi can drop at critical moments',
      'Always confirm action items verbally before hanging up',
    ],
    exerciseTypes: ['call_customer', 'call_complaint', 'call_conference', 'call_voicemail', 'call_appointment'],
  },
  {
    id: 'networking',
    label: 'Networking & Small Talk',
    icon: Coffee,
    colour: '#FB923C',
    desc: 'First impressions, elevator pitches, small talk',
    skills: ['Elevator pitch', 'Conversation starters', 'Following up', 'LinkedIn', 'Business events'],
    phrases: [
      { cat: 'Introductions', items: ["Hi, I'm [name] - I work in [role] at [company].", "Nice to meet you. What brings you to this event?", "I don't think we've met - I'm...", "Are you enjoying the conference?"] },
      { cat: 'Small Talk Starters', items: ["How has your day been?", "Did you catch [name]\'s keynote?", "What's keeping you busy at the moment?", "Have you been to this event before?", "How did you get into your field?"] },
      { cat: 'Your Elevator Pitch', items: ["I help [type of people] to [achieve result] by [how].", "We're a [type of company] that specialises in [area].", "My background is in [field], and I'm currently focused on [current role]."] },
      { cat: 'Following Up', items: ["It was great meeting you today.", "I'd love to continue our conversation.", "Would you be open to a coffee chat?", "I'll connect with you on LinkedIn.", "Let me know if there's anything I can help with."] },
    ],
    tips: [
      "Your elevator pitch should be 30–60 seconds - rehearse but don\'t recite",
      'Ask questions - people like people who show genuine interest in them',
      'The best small talk trick: remember one detail from the conversation and reference it next time',
      'Follow up within 24 hours while the connection is fresh',
      'LinkedIn message after meeting: personalise it - mention what you talked about',
      'Business cards: receive them with two hands (East Asian etiquette) and glance at them before putting away',
    ],
    exerciseTypes: ['network_intro', 'network_smalltalk', 'network_pitch', 'network_followup', 'network_event'],
  },
  {
    id: 'crosscultural',
    label: 'Cross-Cultural',
    icon: Globe,
    colour: '#00E5A0',
    desc: 'Working across cultures, global teams, sensitivities',
    skills: ['High/low context cultures', 'Directness scales', 'Meeting styles', 'Hierarchy', 'Relationship vs task focus'],
    phrases: [
      { cat: 'Diplomatic Disagreement', items: ["That's an interesting perspective.", "I see it a little differently...", "Could we explore an alternative approach?", "I appreciate your view - here's another angle...", "Perhaps we could find a middle ground?"] },
      { cat: 'Checking Understanding', items: ["I want to make sure we're on the same page.", "How does that land with your team?", "I appreciate there may be cultural context I'm not aware of.", "Please feel free to push back if this doesn't work locally.", "What would be the preferred approach in your context?"] },
      { cat: 'Time & Hierarchy', items: ["I'll check with my manager and come back to you.", "We tend to move quickly - let me know if you need more time.", "I understand this decision may need to go up the chain.", "We can be flexible on timeline if that helps.", "How are decisions typically made in your organisation?"] },
    ],
    tips: [
      'High-context cultures (Japan, China, Arab world): meaning is implied - read between the lines',
      'Low-context cultures (USA, Germany, Scandinavia): say exactly what you mean',
      "Direct cultures say \"no\" clearly; indirect cultures may say \"that\'s difficult\" meaning no",
      'Never assume punctuality norms - in some cultures 30 minutes late is perfectly acceptable',
      "Hierarchy: in some cultures only the senior person speaks in meetings - don\'t mistake silence for agreement",
      "When in doubt: ask. \"Is there a preferred way you\'d like me to approach this?\" shows respect",
      '2026: With global hybrid teams, overcommunicate and under-assume',
    ],
    exerciseTypes: ['culture_email', 'culture_meeting', 'culture_feedback', 'culture_negotiation', 'culture_conflict'],
  },
];

// ── Vocabulary bank ───────────────────────────────────────────────────────────
const VOCAB_BANK = [
  { word: 'Synergy',        def: 'Combined effort producing better results than working separately',    example: 'The merger created real synergy between the two R&D teams.' },
  { word: 'KPI',            def: 'Key Performance Indicator - measurable target for success',           example: 'Our main KPI this quarter is a 15% increase in conversion rate.' },
  { word: 'Stakeholder',    def: 'Anyone with an interest in or affected by a project/organisation',    example: 'We need to manage stakeholder expectations carefully.' },
  { word: 'Bandwidth',      def: 'Capacity to take on more work (informal)',                            example: "I don't have the bandwidth to take that on right now." },
  { word: 'Deliverable',    def: 'A specific output or result that must be completed',                  example: 'The main deliverable for this sprint is the prototype.' },
  { word: 'Pivot',          def: 'A significant change in strategy or direction',                       example: 'We may need to pivot our go-to-market strategy.' },
  { word: 'ROI',            def: 'Return on Investment - profit relative to cost',                      example: 'This campaign delivered a 300% ROI.' },
  { word: 'Scalable',       def: 'Able to grow efficiently without proportional cost increase',          example: 'We need a scalable solution that works for 10,000 users.' },
  { word: 'Onboarding',     def: 'The process of integrating a new employee or client',                 example: 'The client onboarding process takes about two weeks.' },
  { word: 'Pain point',     def: 'A specific problem or frustration a customer experiences',           example: 'Our product directly addresses the pain points of remote teams.' },
  { word: 'Due diligence',  def: 'Thorough investigation before a business decision',                   example: 'We completed full due diligence before the acquisition.' },
  { word: 'Benchmark',      def: 'A reference point to measure performance against',                    example: 'We use industry benchmarks to evaluate our progress.' },
  { word: 'Bottom line',    def: 'The most important factor; or profit/loss figure',                   example: 'The bottom line is we need to cut costs by 20%.' },
  { word: 'Proactive',      def: 'Acting in advance rather than reacting to problems',                  example: 'We need to be proactive about customer retention.' },
  { word: 'ESG',            def: 'Environmental, Social, and Governance - sustainability framework',   example: 'Our ESG report is published annually for shareholders.' },
  { word: 'Value proposition', def: 'The unique benefit your product/service offers customers',        example: 'Our core value proposition is 24/7 AI-assisted support.' },
  { word: 'Headcount',      def: 'The total number of employees in an organisation or team',           example: 'We plan to increase headcount by 12 in Q2.' },
  { word: 'Granular',       def: 'Detailed and specific (often about data or analysis)',               example: 'Can we get more granular data on the user drop-off points?' },
  { word: 'Leverage',       def: 'To use something to maximum advantage; to use borrowed funds',      example: 'We can leverage our existing client base to upsell the new product.' },
  { word: 'Cadence',        def: 'A regular rhythm or schedule for meetings or reviews',               example: 'Let\'s set a weekly cadence for these check-ins.' },
];

// ── Exercise type labels ──────────────────────────────────────────────────────
const EXERCISE_LABELS = {
  email_formal: 'Write a formal email',
  email_complaint: 'Handle a complaint by email',
  email_followup: 'Write a follow-up email',
  email_decline: 'Decline politely by email',
  email_request: 'Make a professional request',
  meeting_chair: 'Chair a meeting',
  meeting_participate: 'Participate in a discussion',
  meeting_minutes: 'Write meeting minutes',
  meeting_agenda: 'Set a meeting agenda',
  meeting_virtual: 'Manage a virtual meeting',
  presentation_intro: 'Open a presentation',
  presentation_data: 'Present data and charts',
  presentation_qa: 'Handle Q&A',
  presentation_pitch: 'Pitch an idea',
  presentation_close: 'Close a presentation',
  negotiation_price: 'Negotiate a price',
  negotiation_deadline: 'Negotiate a deadline',
  negotiation_contract: 'Discuss contract terms',
  negotiation_conflict: 'Resolve a conflict',
  negotiation_close: 'Close a deal',
  report_executive: 'Write an executive summary',
  report_findings: 'Report findings',
  proposal_business: 'Write a business proposal',
  report_recommendation: 'Make recommendations',
  proposal_project: 'Write a project proposal',
  call_customer: 'Handle a customer call',
  call_complaint: 'Handle a complaint call',
  call_conference: 'Run a conference call',
  call_voicemail: 'Leave a professional voicemail',
  call_appointment: 'Schedule an appointment',
  network_intro: 'Introduce yourself at an event',
  network_smalltalk: 'Make professional small talk',
  network_pitch: 'Deliver your elevator pitch',
  network_followup: 'Follow up after networking',
  network_event: 'Navigate a business event',
  culture_email: 'Write a cross-cultural email',
  culture_meeting: 'Navigate a cross-cultural meeting',
  culture_feedback: 'Give feedback across cultures',
  culture_negotiation: 'Cross-cultural negotiation',
  culture_conflict: 'Handle cross-cultural conflict',
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function BusinessScreen() {
  const { colors: C } = useTheme();
  const { t, wt } = useLanguage();
  const router = useRouter();
  const nudge = useFeedbackNudge('business');
  const handleAuthFailure = useAuthFailureHandler();

  const [activeTab,       setActiveTab]       = useState('home');
  const [activeDomain,    setActiveDomain]    = useState(null);
  const [domainSubTab,    setDomainSubTab]    = useState('learn'); // learn | practice | vocab
  const [expandedPhrase,  setExpandedPhrase]  = useState(null);

  // Practice state
  const [exercise,        setExercise]        = useState(null);
  const [exerciseLoading, setExerciseLoading] = useState(false);
  const [userResponse,    setUserResponse]    = useState('');
  const [feedback,        setFeedback]        = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [selectedExType,  setSelectedExType]  = useState(null);

  // Vocab quiz state
  const [vocabQuiz,       setVocabQuiz]       = useState(null);
  const [quizAnswer,      setQuizAnswer]      = useState('');
  const [quizResult,      setQuizResult]      = useState(null);

  // Session stats state (loaded from AsyncStorage)
  const [sessionStats,    setSessionStats]    = useState(null);

  // Daily phrase state
  const [dailyPhrase,     setDailyPhrase]     = useState(null);
  const [phraseLoading,   setPhraseLoading]   = useState(false);

  // ── Session timer ─────────────────────────────────────────────────────────
  const sessionStartRef = useRef(Date.now());
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(useCallback(() => {
    sessionStartRef.current = Date.now();
    generateDailyPhrase();
    return () => {
      // Record time spent when leaving the screen
      const elapsed = Math.round((Date.now() - sessionStartRef.current) / 1000);
      if (elapsed > 10) {
        recordExerciseTime('business_english', 'Business English', elapsed).catch(() => {});
      }
    };
  }, []));

  // ── Save a completed exercise session to progress ─────────────────────────
  const saveBusinessSession = async (score, domainLabel, exerciseType) => {
    try {
      await recordModuleProgress({
        exerciseId: 'business_english',
        score,
        detail: `${domainLabel} - ${exerciseType}`,
        recentLimit: 50,
        weakAreas: score < 75
          ? [{ category: domainLabel, description: `Practice ${exerciseType}` }]
          : [],
      });

      // Add XP: score-based (max 30 XP per session)
      const xpEarned = Math.round((score / 100) * 30);
      const currentXP = parseInt(await AsyncStorage.getItem('totalXP') || '0', 10);
      await AsyncStorage.setItem('totalXP', String(currentXP + xpEarned));
      await recordXP(xpEarned, 1);

      // Update streak
      const today = new Date().toDateString();
      const lastPractice = await AsyncStorage.getItem('lastPracticeDate');
      if (lastPractice !== today) {
        await AsyncStorage.setItem('lastPracticeDate', today);
        const streak = parseInt(await AsyncStorage.getItem('currentStreak') || '0', 10) + 1;
        const best   = parseInt(await AsyncStorage.getItem('bestStreak')    || '0', 10);
        await AsyncStorage.setItem('currentStreak', String(streak));
        await AsyncStorage.setItem('bestStreak',    String(Math.max(best, streak)));
      }
    } catch (e) {
      // Silent fail - don't disrupt user experience
    }
  };

  // ── Load session stats from AsyncStorage ─────────────────────────────────
  const loadSessionStats = async () => {
    try {
      const recentRaw = await AsyncStorage.getItem('progress_recent_business_english');
      const recent    = recentRaw ? JSON.parse(recentRaw) : [];
      const scores    = recent.map(r => r.score).filter(Boolean);
      const avg       = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
      const best      = scores.length > 0 ? Math.max(...scores) : null;
      const xp        = parseInt(await AsyncStorage.getItem('totalXP') || '0', 10);
      setSessionStats({ sessions: recent.length, avg, best, xp });
    } catch (e) {}
  };

  const generateDailyPhrase = async () => {
    setPhraseLoading(true);
    try {
      const serverUrl = await getServerUrl();
      const resp = await fetch(serverUrl + '/api/business/daily-phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
        body: JSON.stringify({ date: new Date().toDateString() }),
      });
      const data = await resp.json();
      setDailyPhrase(data);
    } catch (e) {
      setDailyPhrase({
        phrase: 'Let\'s align on the key deliverables before end of day.',
        context: 'Project Management - Teams meeting',
        breakdown: 'align on = agree about | deliverables = specific outputs that must be completed | end of day = by close of business',
        alternative: '"Let\'s agree on what needs to be done today." (more direct)',
      });
    }
    setPhraseLoading(false);
  };

  const generateExercise = async (domain, exType) => {
    setExercise(null);
    setUserResponse('');
    setFeedback(null);
    setExerciseLoading(true);
    setSelectedExType(exType);
    try {
      const serverUrl = await getServerUrl();
      const resp = await fetch(serverUrl + '/api/business/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
        body: JSON.stringify({ domain: domain.id, exerciseType: exType }),
      });
      if (!resp.ok) throw await errorFromResponse(resp);
      const data = await resp.json();
      setExercise(data);
    } catch (e) {
      if (!(await handleAuthFailure(e))) {
        Alert.alert('Error', (e as any)?.serverMessage || 'Could not generate exercise. Check your connection.');
      }
    }
    setExerciseLoading(false);
  };

  const submitResponse = async () => {
    if (!userResponse.trim() || userResponse.trim().length < 20) {
      Alert.alert('Too short', 'Please write a more complete response.');
      return;
    }
    setFeedbackLoading(true);
    try {
      const serverUrl = await getServerUrl();
      const resp = await fetch(serverUrl + '/api/business/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders() || {}) },
        body: JSON.stringify({
          domain: activeDomain?.id,
          exerciseType: selectedExType,
          scenario: exercise?.scenario,
          task: exercise?.task,
          response: userResponse.trim(),
        }),
      });
      if (!resp.ok) throw await errorFromResponse(resp);
      const data = await resp.json();
      setFeedback(data);
      nudge.recordInteraction();
      if (data.score !== undefined) feedbackForScore(data.score); else hapticSuccess();
      // ── Record to My Progress ──────────────────────────────────────────
      if (data.score !== undefined && activeDomain) {
        const dom = DOMAINS.find(d => d.id === activeDomain);
        await saveBusinessSession(
          data.score,
          dom?.label || 'Business English',
          EXERCISE_LABELS[selectedExType] || selectedExType || 'Exercise'
        );
        loadSessionStats(); // refresh the stats banner
      }
    } catch (e) {
      if (!(await handleAuthFailure(e))) {
        Alert.alert('Error', (e as any)?.serverMessage || 'Could not get feedback. Check your connection.');
      }
    }
    setFeedbackLoading(false);
  };

  const startVocabQuiz = () => {
    const word = VOCAB_BANK[Math.floor(Math.random() * VOCAB_BANK.length)];
    setVocabQuiz(word);
    setQuizAnswer('');
    setQuizResult(null);
  };

  const checkVocabAnswer = () => {
    if (!quizAnswer.trim()) return;
    const correct = quizAnswer.toLowerCase().includes(vocabQuiz.word.toLowerCase()) ||
      vocabQuiz.def.toLowerCase().split(' ').filter(w => w.length > 5).some(w =>
        quizAnswer.toLowerCase().includes(w.toLowerCase())
      );
    setQuizResult({ correct, word: vocabQuiz });
  };

  const S = {
    card: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border + '20' },
    label: { fontSize: scaledFont(10), fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
    bodyText: { fontSize: scaledFont(13), color: C.textSec, lineHeight: 20 },
    tipRow: { flexDirection: 'row', gap: 8, marginBottom: 7 },
  };

  const domain = activeDomain ? DOMAINS.find(d => d.id === activeDomain) : null;

  // ── HOME TAB ─────────────────────────────────────────────────────────────────
  const renderHome = () => (
    <View>
      {/* Hero */}
      <View style={{ backgroundColor: '#0d1a0d', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#00E5A040' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Building size={24} color="#00E5A0" />
          <Text style={{ fontSize: scaledFont(20), fontWeight: '900', color: '#fff' }}>{wt('business-english')}</Text>
        </View>
        <Text style={{ fontSize: scaledFont(13), color: '#00E5A0', fontWeight: '600', marginBottom: 10 }}>{wt('webapp-business-desc')}</Text>
        <Text style={[S.bodyText, { color: '#ccc' }]}>AI-generated exercises across 8 real workplace domains. Emails, meetings, negotiations, presentations and more - all tailored to your level and refreshed on demand.</Text>
      </View>

      {/* Daily Business Phrase */}
      <View style={[S.card, { borderColor: '#FFBE0B30', marginBottom: 16 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Star size={14} color="#FFBE0B" />
            <Text style={{ fontSize: scaledFont(12), fontWeight: '700', color: '#FFBE0B', letterSpacing: 1 }}>PHRASE OF THE DAY</Text>
          </View>
          <TouchableOpacity
            onPress={generateDailyPhrase}
            disabled={phraseLoading}
            accessibilityRole="button"
            accessibilityLabel="Generate new daily phrase"
            accessibilityHint="Loads a fresh AI-generated business phrase"
            accessibilityState={{ disabled: phraseLoading, busy: phraseLoading }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <RefreshCw size={16} color={phraseLoading ? C.textMuted : C.cyan} />
          </TouchableOpacity>
        </View>

        {phraseLoading ? (
          <ActivityIndicator color="#FFBE0B" style={{ marginVertical: 10 }} />
        ) : dailyPhrase ? (
          <View>
            <Text style={{ fontSize: scaledFont(16), fontWeight: '700', color: C.text, lineHeight: 24, fontStyle: 'italic', marginBottom: 8 }}>
              "{dailyPhrase.phrase}"
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <MapPin size={12} color="#FFBE0B" />
              <Text style={{ fontSize: scaledFont(11), color: '#FFBE0B', fontWeight: '600' }}>{dailyPhrase.context}</Text>
            </View>
            <View style={{ backgroundColor: C.bg, borderRadius: 10, padding: 10, marginBottom: 6 }}>
              <Text style={[S.label, { marginBottom: 4 }]}>Breakdown</Text>
              <Text style={S.bodyText}>{dailyPhrase.breakdown}</Text>
            </View>
            {dailyPhrase.alternative && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
                <Lightbulb size={12} color={C.textMuted} style={{ marginTop: 2 }} />
                <Text style={{ flex: 1, fontSize: scaledFont(12), color: C.textMuted, fontStyle: 'italic' }}>
                  Alternative: {dailyPhrase.alternative}
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </View>

      {/* Domain grid */}
      <Text style={[S.label, { marginBottom: 10 }]}>Choose a Workplace Domain</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {DOMAINS.map(d => {
          const Icon = d.icon;
          return (
            <TouchableOpacity
              key={d.id}
              style={{ width: '47%', backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: d.colour + '30' }}
              onPress={() => { setActiveDomain(d.id); setDomainSubTab('learn'); setActiveTab('domain'); setExercise(null); setFeedback(null); }}
              accessibilityRole="button"
              accessibilityLabel={`Open ${d.label}`}
              accessibilityHint={d.desc}
            >
              <Icon size={22} color={d.colour} style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: scaledFont(13), fontWeight: '800', color: C.text, marginBottom: 2 }}>{d.label}</Text>
              <Text style={{ fontSize: scaledFont(11), color: C.textMuted, lineHeight: 16 }}>{d.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Vocab bank teaser */}
      <TouchableOpacity
        style={[S.card, { borderColor: '#B06CFF30' }]}
        onPress={() => setActiveTab('vocab')}
        accessibilityRole="button"
        accessibilityLabel="Open business vocabulary"
        accessibilityHint={`Browse ${VOCAB_BANK.length} essential business terms`}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <BookOpen size={22} color="#B06CFF" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: scaledFont(14), fontWeight: '800', color: C.text }}>{wt('business-english')} {wt('vocabulary')}</Text>
            <Text style={{ fontSize: scaledFont(12), color: C.textMuted, marginTop: 2 }}>{VOCAB_BANK.length} essential business terms with examples</Text>
          </View>
          <ChevronRight size={18} color={C.textMuted} />
        </View>
      </TouchableOpacity>

      {/* Quick tips */}
      <View style={[S.card, { borderColor: '#00E5FF30' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Zap size={16} color={C.text} />
          <Text style={{ fontSize: scaledFont(14), fontWeight: '800', color: C.text }}>2026 Business English Quick Tips</Text>
        </View>
        {[
          'Cut the AI filler: start emails with the key point, not "I hope this finds you well"',
          "Replace \"circle back\" with a specific time: \"Let\'s decide by Friday\"",
          'Use active verbs: "We will evaluate" not "A formal evaluation will be performed"',
          'Authenticity beats perfection: contractions and human tone build trust faster',
          'For global teams: over-communicate and under-assume - clarity prevents costly misunderstandings',
        ].map((tip, i) => (
          <View key={i} style={[S.tipRow]}>
            <Text style={{ color: C.cyan, fontWeight: '800', fontSize: scaledFont(14) }}>→</Text>
            <Text style={[S.bodyText, { flex: 1 }]}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  // ── DOMAIN TAB ────────────────────────────────────────────────────────────────
  const renderDomain = () => {
    if (!domain) return null;
    const Icon = domain.icon;
    return (
      <View>
        {/* Back + header */}
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}
          onPress={() => { setActiveTab('home'); setActiveDomain(null); }}
          accessibilityRole="button"
          accessibilityLabel="Back to all domains"
          accessibilityHint="Returns to the home screen"
        >
          <ChevronRight size={16} color={C.textMuted} style={{ transform: [{ rotate: '180deg' }] }} />
          <Text style={{ fontSize: scaledFont(13), color: C.textMuted }}>{wt('lt-all').replace(/\s*\(.*\)$/, '')}</Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: domain.colour + '12', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: domain.colour + '30' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Icon size={26} color={domain.colour} />
            <Text style={{ fontSize: scaledFont(20), fontWeight: '900', color: domain.colour }}>{domain.label}</Text>
          </View>
          <Text style={[S.bodyText, { color: C.textSec, marginBottom: 10 }]}>{domain.desc}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {domain.skills.map((s, i) => (
              <View key={i} style={{ backgroundColor: domain.colour + '15', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                <Text style={{ fontSize: scaledFont(10), fontWeight: '700', color: domain.colour }}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sub-tabs */}
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 16 }}>
          {[
            { id: 'learn',    label: 'Learn', icon: BookOpen },
            { id: 'practice', label: 'Practice', icon: Zap },
          ].map(tab => {
            const TabIcon = tab.icon;
            return (
            <TouchableOpacity
              key={tab.id}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: domainSubTab === tab.id ? domain.colour + '20' : C.card, borderWidth: 1, borderColor: domainSubTab === tab.id ? domain.colour + '50' : C.border + '20' }}
              onPress={() => { setDomainSubTab(tab.id); if (tab.id === 'practice') loadSessionStats(); }}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: domainSubTab === tab.id }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <TabIcon size={13} color={domainSubTab === tab.id ? domain.colour : C.textMuted} />
                <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: domainSubTab === tab.id ? domain.colour : C.textMuted }}>{tab.label}</Text>
              </View>
            </TouchableOpacity>
            );
          })}
        </View>

        {/* LEARN sub-tab */}
        {domainSubTab === 'learn' && (
          <View>
            {/* Phrase banks */}
            <Text style={[S.label, { marginBottom: 8 }]}>Essential Phrases</Text>
            {domain.phrases.map((group, gi) => (
              <TouchableOpacity
                key={gi}
                style={S.card}
                onPress={() => setExpandedPhrase(expandedPhrase === gi ? null : gi)}
                accessibilityRole="button"
                accessibilityLabel={group.cat}
                accessibilityHint={expandedPhrase === gi ? 'Collapses phrase list' : 'Expands phrase list'}
                accessibilityState={{ expanded: expandedPhrase === gi }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: C.text }}>{group.cat}</Text>
                  {expandedPhrase === gi ? <ChevronUp size={16} color={C.textMuted} /> : <ChevronDown size={16} color={C.textMuted} />}
                </View>
                {expandedPhrase === gi && (
                  <View style={{ marginTop: 10 }}>
                    {group.items.map((phrase, pi) => (
                      <View key={pi} style={{ flexDirection: 'row', gap: 8, marginBottom: 8, backgroundColor: C.bg, borderRadius: 10, padding: 10 }}>
                        <Text style={{ color: domain.colour, fontWeight: '800', fontSize: 14, marginTop: 1 }}>→</Text>
                        <Text style={{ flex: 1, fontSize: scaledFont(13), color: C.text, lineHeight: 20, fontStyle: 'italic' }}>"{phrase}"</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Tips */}
            <Text style={[S.label, { marginBottom: 8 }]}>Expert Tips</Text>
            <View style={S.card}>
              {domain.tips.map((tip, i) => (
                <View key={i} style={[S.tipRow]}>
                  <Text style={{ color: domain.colour, fontWeight: '800', fontSize: scaledFont(14) }}>→</Text>
                  <Text style={[S.bodyText, { flex: 1 }]}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* PRACTICE sub-tab */}
        {domainSubTab === 'practice' && (
          <View>
            {/* ── Progress stats banner ── */}
            {sessionStats && sessionStats.sessions > 0 && (
              <View style={{ backgroundColor: '#00E5A015', borderRadius: 14, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#00E5A030', flexDirection: 'row', alignItems: 'center', gap: 0 }}>
                {[
                  { label: 'Sessions', value: String(sessionStats.sessions), colour: '#00E5A0' },
                  { label: 'Avg Score', value: sessionStats.avg !== null ? sessionStats.avg + '%' : '-', colour: sessionStats.avg >= 80 ? '#00E5A0' : sessionStats.avg >= 60 ? '#FFBE0B' : '#FF8A65' },
                  { label: 'Best', value: sessionStats.best !== null ? sessionStats.best + '%' : '-', colour: '#00E5FF' },
                  { label: 'Total XP', value: sessionStats.xp + ' XP', colour: '#B06CFF' },
                ].map((s, i) => (
                  <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: scaledFont(16), fontWeight: '900', color: s.colour }}>{s.value}</Text>
                    <Text style={{ fontSize: scaledFont(9), color: C.textMuted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => router.push('/progress')}
                  style={{ paddingLeft: 8 }}
                  accessibilityRole="link"
                  accessibilityLabel="Open progress"
                  accessibilityHint="Shows your full practice progress"
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <ChevronRight size={16} color={C.textMuted} />
                </TouchableOpacity>
              </View>
            )}
            {!exercise && !exerciseLoading && (
              <View>
                <Text style={[S.label, { marginBottom: 10 }]}>Choose an Exercise Type</Text>
                {domain.exerciseTypes.map((et, i) => (
                  <TouchableOpacity
                    key={i}
                    style={{ backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: domain.colour + '25', flexDirection: 'row', alignItems: 'center', gap: 10 }}
                    onPress={() => generateExercise(domain, et)}
                    accessibilityRole="button"
                    accessibilityLabel={`Start ${EXERCISE_LABELS[et] || et} exercise`}
                    accessibilityHint="Generates a unique AI scenario for this exercise type"
                  >
                    <View style={{ backgroundColor: domain.colour + '20', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 14 }}>✦</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: C.text }}>{EXERCISE_LABELS[et] || et}</Text>
                      <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginTop: 2 }}>AI generates a unique scenario</Text>
                    </View>
                    <ChevronRight size={16} color={C.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {exerciseLoading && (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <ActivityIndicator size="large" color={domain.colour} />
                <Text style={{ fontSize: scaledFont(13), color: C.textMuted, marginTop: 12 }}>Generating your exercise...</Text>
              </View>
            )}

            {exercise && !exerciseLoading && (
              <View>
                {/* Scenario card */}
                <View style={[S.card, { borderColor: domain.colour + '30' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                    <MapPin size={11} color={domain.colour} />
                    <Text style={[S.label, { color: domain.colour }]}>Scenario</Text>
                  </View>
                  <Text style={[S.bodyText, { lineHeight: 21, marginBottom: 10 }]}>{exercise.scenario}</Text>
                  <View style={{ backgroundColor: domain.colour + '10', borderRadius: 10, padding: 10 }}>
                    <Text style={[S.label, { color: domain.colour, marginBottom: 4 }]}>Your Task</Text>
                    <Text style={{ fontSize: scaledFont(14), fontWeight: '600', color: C.text, lineHeight: 21 }}>{exercise.task}</Text>
                  </View>
                  {exercise.context && (
                    <View style={{ marginTop: 10, backgroundColor: C.bg, borderRadius: 8, padding: 10 }}>
                      <Text style={[S.label, { marginBottom: 4 }]}>Context / Key Info</Text>
                      <Text style={S.bodyText}>{exercise.context}</Text>
                    </View>
                  )}
                </View>

                {/* Useful phrases hint */}
                {exercise.usefulPhrases && exercise.usefulPhrases.length > 0 && (
                  <View style={[S.card]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                      <Lightbulb size={11} color={C.textMuted} />
                      <Text style={S.label}>Useful phrases</Text>
                    </View>
                    {exercise.usefulPhrases.map((p, i) => (
                      <View key={i} style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
                        <Text style={{ color: domain.colour, fontWeight: '700' }}>→</Text>
                        <Text style={[S.bodyText, { fontStyle: 'italic', flex: 1 }]}>"{p}"</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Response input */}
                {!feedback && (
                  <>
                    <TextInput
                      style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, fontSize: scaledFont(14), color: C.text, borderWidth: 1, borderColor: C.border + '30', minHeight: 160, textAlignVertical: 'top', lineHeight: 22, marginBottom: 8 }}
                      placeholder="Write your professional response here..."
                      placeholderTextColor={C.textMuted}
                      value={userResponse}
                      onChangeText={setUserResponse}
                      onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
                      multiline
                      autoCapitalize="sentences"
                    />
                    <Text style={{ fontSize: scaledFont(11), color: C.textMuted, marginBottom: 12, textAlign: 'right' }}>
                      {userResponse.trim().split(/\s+/).filter(Boolean).length} words
                    </Text>
                    <TouchableOpacity
                      style={{ backgroundColor: domain.colour, borderRadius: 14, paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: feedbackLoading ? 0.7 : 1 }}
                      onPress={submitResponse} disabled={feedbackLoading}
                      accessibilityRole="button"
                      accessibilityLabel={feedbackLoading ? 'Analysing your response' : 'Submit for AI feedback'}
                      accessibilityHint="Sends your response for AI grading"
                      accessibilityState={{ disabled: feedbackLoading, busy: feedbackLoading }}
                    >
                      {feedbackLoading ? <ActivityIndicator color="#000" /> : <Send size={18} color="#000" />}
                      <Text style={{ fontSize: scaledFont(15), fontWeight: '800', color: '#000' }}>
                        {feedbackLoading ? t.loading : wt('get-ai-feedback')}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Feedback */}
                {feedback && (
                  <View>
                    {/* Score */}
                    <View style={{ backgroundColor: (feedback.score >= 80 ? '#00E5A0' : feedback.score >= 60 ? '#FFBE0B' : '#FF8A65') + '15', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 12, borderWidth: 1.5, borderColor: (feedback.score >= 80 ? '#00E5A0' : feedback.score >= 60 ? '#FFBE0B' : '#FF8A65') + '40' }}>
                      <Text style={{ fontSize: scaledFont(52), fontWeight: '900', color: feedback.score >= 80 ? '#00E5A0' : feedback.score >= 60 ? '#FFBE0B' : '#FF8A65' }}>{feedback.score}</Text>
                      <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: C.text }}>/100 {t.score}</Text>
                      {feedback.grade && <Text style={{ fontSize: scaledFont(12), color: C.textMuted, marginTop: 4 }}>{feedback.grade}</Text>}
                    </View>

                    {feedback.overallFeedback && (
                      <View style={S.card}>
                        <Text style={[S.label, { marginBottom: 6 }]}>{wt('feedback')}</Text>
                        <Text style={S.bodyText}>{feedback.overallFeedback}</Text>
                      </View>
                    )}

                    {feedback.strengths && feedback.strengths.length > 0 && (
                      <View style={[S.card, { borderColor: '#00E5A040' }]}>
                        <Text style={[S.label, { color: '#00E5A0', marginBottom: 8 }]}>✓ Strengths</Text>
                        {feedback.strengths.map((s, i) => (
                          <View key={i} style={[S.tipRow]}>
                            <Text style={{ color: '#00E5A0', fontWeight: '700' }}>•</Text>
                            <Text style={S.bodyText}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {feedback.improvements && feedback.improvements.length > 0 && (
                      <View style={[S.card, { borderColor: '#FFBE0B40' }]}>
                        <Text style={[S.label, { color: '#FFBE0B', marginBottom: 8 }]}>→ Improvements</Text>
                        {feedback.improvements.map((s, i) => (
                          <View key={i} style={[S.tipRow]}>
                            <Text style={{ color: '#FFBE0B', fontWeight: '700' }}>•</Text>
                            <Text style={S.bodyText}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {feedback.rewrite && (
                      <View style={[S.card, { borderColor: '#B06CFF40' }]}>
                        <Text style={[S.label, { color: '#B06CFF', marginBottom: 8 }]}>✦ Suggested Rewrite</Text>
                        <Text style={[S.bodyText, { fontStyle: 'italic', lineHeight: 21 }]}>{feedback.rewrite}</Text>
                      </View>
                    )}

                    {feedback.vocabulary && feedback.vocabulary.length > 0 && (
                      <View style={[S.card, { borderColor: domain.colour + '30' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                          <BookOpen size={11} color={domain.colour} />
                          <Text style={[S.label, { color: domain.colour }]}>Vocabulary to Learn</Text>
                        </View>
                        {feedback.vocabulary.map((v, i) => (
                          <View key={i} style={{ marginBottom: i < feedback.vocabulary.length - 1 ? 8 : 0 }}>
                            <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: C.text }}>{v.word}</Text>
                            <Text style={{ fontSize: scaledFont(12), color: C.textMuted }}>{v.definition}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Try again / new exercise */}
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                      <TouchableOpacity
                        style={{ flex: 1, backgroundColor: C.card, borderRadius: 14, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: C.border + '30' }}
                        onPress={() => { setFeedback(null); setUserResponse(''); }}
                        accessibilityRole="button"
                        accessibilityLabel={wt('try-again')}
                        accessibilityHint="Clears feedback and your response so you can redo the same scenario"
                      >
                        <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: C.text }}>{wt('try-again')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ flex: 1, backgroundColor: domain.colour + '20', borderRadius: 14, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: domain.colour + '40' }}
                        onPress={() => generateExercise(domain, selectedExType)}
                        accessibilityRole="button"
                        accessibilityLabel="New scenario"
                        accessibilityHint="Generates a new AI scenario for the same exercise type"
                      >
                        <Text style={{ fontSize: scaledFont(13), fontWeight: '700', color: domain.colour }}>New Scenario</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Back to exercise list */}
                {!feedback && (
                  <TouchableOpacity
                    style={{ paddingVertical: 12, alignItems: 'center', marginTop: 4 }}
                    onPress={() => { setExercise(null); setFeedback(null); setUserResponse(''); }}
                    accessibilityRole="button"
                    accessibilityLabel="Back to exercise list"
                    accessibilityHint="Discards this exercise and returns to the exercise type list"
                  >
                    <Text style={{ fontSize: scaledFont(13), color: C.textMuted }}>← Back to exercise list</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // ── VOCAB TAB ─────────────────────────────────────────────────────────────────
  const renderVocab = () => (
    <View>
      <View style={{ backgroundColor: '#1a0d2e', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#B06CFF40' }}>
        <Text style={{ fontSize: scaledFont(17), fontWeight: '800', color: '#B06CFF', marginBottom: 6 }}>{wt('business-english')} {wt('vocabulary')}</Text>
        <Text style={[S.bodyText, { color: '#aaa' }]}>{VOCAB_BANK.length} essential business terms. Tap any word to see the definition and example sentence.</Text>
      </View>

      {/* Quick vocab quiz */}
      <View style={[S.card, { borderColor: '#FFBE0B30', marginBottom: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Zap size={15} color={C.text} />
          <Text style={{ fontSize: scaledFont(14), fontWeight: '800', color: C.text }}>Quick Vocab Quiz</Text>
        </View>
        {!vocabQuiz ? (
          <TouchableOpacity
            style={{ backgroundColor: '#FFBE0B20', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FFBE0B40' }}
            onPress={startVocabQuiz}
            accessibilityRole="button"
            accessibilityLabel={wt('start-quiz')}
            accessibilityHint="Begins a quick business vocabulary quiz"
          >
            <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: '#FFBE0B' }}>{wt('start-quiz')}</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={[S.label, { marginBottom: 6 }]}>What does this word mean?</Text>
            <Text style={{ fontSize: scaledFont(22), fontWeight: '900', color: '#FFBE0B', marginBottom: 12 }}>{vocabQuiz.word}</Text>
            {!quizResult ? (
              <>
                <TextInput
                  style={{ backgroundColor: C.bg, borderRadius: 12, padding: 14, fontSize: scaledFont(14), color: C.text, borderWidth: 1, borderColor: C.border + '30', marginBottom: 8, minHeight: 44 }}
                  placeholder="Type what you think it means..."
                  placeholderTextColor={C.textMuted}
                  value={quizAnswer}
                  onChangeText={setQuizAnswer}
                  onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
                  returnKeyType="done"
                  onSubmitEditing={checkVocabAnswer}
                />
                <TouchableOpacity
                  style={{ backgroundColor: '#FFBE0B', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                  onPress={checkVocabAnswer}
                  accessibilityRole="button"
                  accessibilityLabel={wt('check-answer')}
                  accessibilityHint="Submits your definition for checking"
                >
                  <Text style={{ fontSize: scaledFont(14), fontWeight: '800', color: '#000' }}>{wt('check-answer')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View>
                <View style={{ backgroundColor: (quizResult.correct ? '#00E5A0' : '#FF8A65') + '15', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: (quizResult.correct ? '#00E5A0' : '#FF8A65') + '40' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    {quizResult.correct
                      ? <CheckCircle size={15} color="#00E5A0" />
                      : <X size={15} color="#FF8A65" />}
                    <Text style={{ fontSize: scaledFont(14), fontWeight: '800', color: quizResult.correct ? '#00E5A0' : '#FF8A65' }}>
                      {quizResult.correct ? 'Great work!' : 'Not quite - here\'s the answer:'}
                    </Text>
                  </View>
                  <Text style={S.bodyText}><Text style={{ fontWeight: '700', color: C.text }}>{vocabQuiz.word}:</Text> {vocabQuiz.def}</Text>
                  <Text style={[S.bodyText, { fontStyle: 'italic', marginTop: 4, color: C.textMuted }]}>"{vocabQuiz.example}"</Text>
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: '#B06CFF20', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#B06CFF40' }}
                  onPress={startVocabQuiz}
                  accessibilityRole="button"
                  accessibilityLabel={`${t.next} word`}
                  accessibilityHint="Loads the next quiz word"
                >
                  <Text style={{ fontSize: scaledFont(14), fontWeight: '700', color: '#B06CFF' }}>{t.next}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Full vocab list */}
      <Text style={[S.label, { marginBottom: 8 }]}>All Terms A–Z</Text>
      {VOCAB_BANK.sort((a, b) => a.word.localeCompare(b.word)).map((v, i) => (
        <View key={i} style={[S.card, { marginBottom: 8 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <View style={{ backgroundColor: '#B06CFF20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 2 }}>
              <Text style={{ fontSize: scaledFont(12), fontWeight: '800', color: '#B06CFF' }}>{v.word}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S.bodyText}>{v.def}</Text>
              <Text style={{ fontSize: scaledFont(12), color: C.textMuted, fontStyle: 'italic', marginTop: 4 }}>"{v.example}"</Text>
            </View>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const raw = await AsyncStorage.getItem('vocabVault');
                  const vault = raw ? JSON.parse(raw) : [];
                  if (vault.some(e => e.word === v.word)) {
                    Alert.alert('Already Saved', `"${v.word}" is already in your Vocabulary Vault.`);
                    return;
                  }
                  vault.push({ word: v.word, definition: v.def, example: v.example,
                    meanings: [{ definition: v.def, example: v.example }],
                    category: 'Business', source: 'business', addedAt: new Date().toISOString(), practiceCount: 0 });
                  await Promise.all([
                    AsyncStorage.setItem('vocabVault', JSON.stringify(vault)),
                    AsyncStorage.setItem('pp_vocabVault', JSON.stringify(vault)),
                  ]);
                  pushVaults();
                  Alert.alert('Saved!', `"${v.word}" added to Vocabulary Vault.`);
                } catch (_) {}
              }}
              style={{ padding: 6 }}
              accessibilityRole="button"
              accessibilityLabel={`${t.saveToVault}: ${v.word}`}
            >
              <BookmarkPlus size={18} color={C.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  // ── TAB BAR ───────────────────────────────────────────────────────────────────
  const TABS = [
    { id: 'home',   label: t.home,     icon: Building },
    { id: 'domain', label: domain?.label || t.practice, icon: Zap },
    { id: 'vocab',  label: wt('vocabulary'),    icon: BookOpen },
  ];

  return (
    <ScreenBackground style={null}>
            {/* ── HEADER ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center',
        paddingTop: 62, paddingBottom: 10,
        backgroundColor: 'rgba(2,6,18,0.85)', borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)', zIndex: 110 }}>
        <TouchableOpacity
          onPress={() => { router.push('/') }}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: 8, zIndex: 120 }}
          accessibilityRole="button"
          accessibilityLabel={t.back}
        >
          <ArrowLeft size={22} color={C.textMuted || '#6B7280'} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image
            source={{ uri: 'data:image/png;base64,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' }}
            style={{ height: 36, width: 180, resizeMode: 'contain', marginBottom: 2 }}
            accessibilityLabel="Poly-Puff"
          />
          <Text style={{ fontSize: scaledFont(11), fontWeight: '700', color: C.textMuted || '#6B7280', letterSpacing: 1 }}>{wt('business-english').toUpperCase()}</Text>
        </View>
        <View style={{ width: 52 }} />
      </View>
      <View style={{ alignItems: 'center', paddingTop: 8 }}>
        <SkillLevelBadge exerciseId="business_english" />
      </View>

      {/* Tab bar */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border + '20', backgroundColor: C.card }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const colour = '#00E5A0';
          return (
            <TouchableOpacity
              key={tab.id}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: isActive ? colour : 'transparent' }}
              onPress={() => setActiveTab(tab.id)}
              accessibilityRole="tab"
              accessibilityLabel={tab.id === 'domain' && domain ? domain.label : tab.label}
              accessibilityState={{ selected: isActive }}
            >
              <Icon size={14} color={isActive ? colour : C.textMuted} />
              <Text style={{ fontSize: scaledFont(12), fontWeight: isActive ? '800' : '500', color: isActive ? colour : C.textMuted }}>
                {tab.id === 'domain' && domain ? domain.label.split(' ')[0] : tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, paddingBottom: 80 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <AIDisclosureBanner compact />
        {activeTab === 'home'   && renderHome()}
        {activeTab === 'domain' && (domain ? renderDomain() : renderHome())}
        {activeTab === 'vocab'  && renderVocab()}
      </ScrollView>
      <FeedbackNudgeModal
        visible={nudge.showModal}
        exerciseName="business"
        onDismiss={nudge.onDismiss}
        onSent={nudge.onSent}
      />
    </ScreenBackground>
  );
}
