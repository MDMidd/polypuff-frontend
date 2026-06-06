/**
 * POLY-PUFF — UI Translations
 * FILE: contexts/translations.ts
 *
 * Key UI strings translated into all 53 supported app languages.
 * Used by LanguageContext to drive the entire app UI.
 */

export type LangCode =
  | 'en' | 'af' | 'am' | 'ar' | 'bn' | 'bg' | 'cs' | 'da' | 'nl'
  | 'fi' | 'fr' | 'de' | 'el' | 'gu' | 'ha' | 'he' | 'hi' | 'hu'
  | 'ig' | 'id' | 'it' | 'ja' | 'ko' | 'ms' | 'zh' | 'mr' | 'ne'
  | 'no' | 'fa' | 'pl' | 'pt' | 'pa' | 'ro' | 'ru' | 'si' | 'es'
  | 'sw' | 'sv' | 'ta' | 'th' | 'tr' | 'uk' | 'ur' | 'vi' | 'yo' | 'zu'
  | 'fil' | 'gn' | 'ht' | 'ps' | 'qu' | 'sk' | 'te';

export interface Translations {
  // Navigation
  home: string;
  practice: string;
  progress: string;
  settings: string;
  profile: string;
  // Common actions
  start: string;
  submit: string;
  next: string;
  back: string;
  save: string;
  cancel: string;
  retry: string;
  loading: string;
  // Modules
  translationTrainer: string;
  wordChunks: string;
  listening: string;
  writing: string;
  grammarPractice: string;
  grammarQuiz: string;
  vocabularyFlashcards: string;
  dailyChallenges: string;
  placementTest: string;
  classroom: string;
  vocabularyVault: string;
  businessEnglish: string;
  // Progress
  accuracy: string;
  streak: string;
  timeSpent: string;
  score: string;
  // Profile
  nativeLanguage: string;
  appLanguage: string;
  level: string;
  // Feedback
  correct: string;
  incorrect: string;
  wellDone: string;
  tryAgain: string;
  // Vault
  definition: string;
  example: string;
  saveToVault: string;
  // Practice hub greeting (optional — falls back to English if missing)
  welcome?: string;
  hi?: string;
  takePlacementTest?: string;
  chooseModule?: string;
  findYourCefrLevel?: string;
  customisePracticeList?: string;
  sentenceLength?: string;
  customRequestPlaceholder?: string;
  customTopicRequest?: string;
  retrySentence?: string;
  voiceInputUnavailable?: string;
  tap?: string;
  saveToVaultPrompt?: string;
  fullPhrase?: string;
  aiIntroMessage?: string;
  reportAiResponse?: string;
  polyPuffTyping?: string;
  askAboutGrammarPlaceholder?: string;
  askGrammarQuestion?: string;
  sendMessage?: string;
  closeSettings?: string;
  opensSettingsHint?: string;
  newSentenceHint?: string;
  startSessionHint?: string;
  typeTranslationHint?: string;
  revealClueHint?: string;
  revealAnswerHint?: string;
  submitTranslationHint?: string;
  sending?: string;
  opening?: string;
  emailLearningReminders?: string;
  refreshAccountDetails?: string;
  sendPasswordReset?: string;
  signOutDevice?: string;
  openBillingPortal?: string;
  moneyBackGuarantee?: string;
  customBackendServerUrl?: string;
  saveTestBackendUrl?: string;
  saveAndTest?: string;
  useLocalBackend?: string;
  useEmulatorBackend?: string;
  useProductionBackend?: string;
  testBackendConnection?: string;
  showMascot?: string;
  soundEffects?: string;
  hapticFeedback?: string;
  dailyStreakReminder?: string;
  clearOfflineCache?: string;
  resetDefaults?: string;
  resetOnboarding?: string;
  clearProfileInfo?: string;
  clearAllProgressPermanently?: string;
  viewTermsExternal?: string;
  deleteAllDataPermanently?: string;
  cefrLevels?: string;
  chooseReminderTime?: string;
  backend?: string;
  currentServer?: string;
  mascot?: string;
  streakReminders?: string;
  dailyReminder?: string;
  reminderTime?: string;
  appVersion?: string;
  backendVersion?: string;
  totalCards?: string;
  selectCefrLevel?: string;
  selectChunkCategory?: string;
  translatePhraseToEnglish?: string;
  englishTranslationPlaceholder?: string;
  englishChunkTranslation?: string;
  getHint?: string;
  showCorrectAnswer?: string;
  hearCorrectAnswer?: string;
  saveToVocabularyVault?: string;
  nextChunk?: string;
  wordChunksStartHint?: string;
  generatingChunk?: string;
  hearInLanguage?: string;
  scoreExcellent?: string;
  scoreGood?: string;
  scoreOk?: string;
  chunksDone?: string;
  averageAbbrev?: string;
  nextExercise?: string;
  doneLabel?: string;
  averageLabel?: string;
  chooseMode?: string;
  grammarIntro?: string;
  errorCorrection?: string;
  errorCorrectionDesc?: string;
  sentenceBuilder?: string;
  sentenceBuilderDesc?: string;
  fillInTheBlank?: string;
  fillInTheBlankDesc?: string;
  findFixGrammarMistakes?: string;
  correctedSentenceLabel?: string;
  correctedSentencePlaceholder?: string;
  buildSentenceInstruction?: string;
  dropZonePlaceholder?: string;
  resetSentence?: string;
  wordBankTapToAdd?: string;
  fillMissingWordPhrase?: string;
  missingWordPlaceholder?: string;
  typeMissingWordPhrase?: string;
  skipExerciseNewOne?: string;
  skipThisOne?: string;
  resultLabel?: string;
  generatingExercise?: string;
  aboutMe?: string;
  hobbiesInterests?: string;
  editProfile?: string;
  setUpYourProfile?: string;
  personalInfo?: string;
  profileDetailsNote?: string;
  namePlaceholder?: string;
  professionPlaceholder?: string;
  qualificationsPlaceholder?: string;
  agePlaceholder?: string;
  hobbiesPlaceholder?: string;
  optionalLabel?: string;
  bioHelpText?: string;
  bioPlaceholder?: string;
  nativeLanguageHelp?: string;
  appLanguageHelp?: string;
  appLanguageNote?: string;
  englishLevelCefr?: string;
  levelDifficultyHelp?: string;
  savedBang?: string;
  saveProfile?: string;
  teacher?: string;
  student?: string;
  teacherMode?: string;
  studentMode?: string;
  switchMode?: string;
  createNewClass?: string;
  createClass?: string;
  noClassesYet?: string;
  noClassesHelp?: string;
  myClasses?: string;
  joinAClass?: string;
  joinClass?: string;
  notInClassYet?: string;
  notInClassHelp?: string;
  viewDashboard?: string;
  leaveClass?: string;
  leave?: string;
  yourNameLabel?: string;
  classNameLabel?: string;
  teacherNamePlaceholder?: string;
  classNamePlaceholder?: string;
  classCodeLabel?: string;
  fullNamePlaceholder?: string;
  classCodePlaceholder?: string;
  classCodeA11y?: string;
  classroomStudentTip?: string;
  teacherModeDesc?: string;
  studentModeDesc?: string;
}

const t: Record<LangCode, Translations> = {
  en: {
    home: 'Home', practice: 'Practice', progress: 'Progress',
    settings: 'Settings', profile: 'Profile',
    start: 'Start', submit: 'Submit', next: 'Next', back: 'Back',
    save: 'Save', cancel: 'Cancel', retry: 'Retry', loading: 'Loading...',
    translationTrainer: 'Translation Trainer', wordChunks: 'Word Chunks',
    listening: 'Listening', writing: 'Writing', grammarPractice: 'Grammar Practice',
    grammarQuiz: 'Grammar Quiz', vocabularyFlashcards: 'Vocabulary Flashcards',
    dailyChallenges: 'Daily Challenges', placementTest: 'Placement Test',
    classroom: 'Classroom', vocabularyVault: 'Vocabulary Vault',
    businessEnglish: 'Business English',
    accuracy: 'Accuracy', streak: 'Streak', timeSpent: 'Time Spent', score: 'Score',
    nativeLanguage: 'Native Language', appLanguage: 'App Language', level: 'Level',
    correct: 'Correct', incorrect: 'Incorrect', wellDone: 'Well done!', tryAgain: 'Try again',
    definition: 'Definition', example: 'Example', saveToVault: 'Save to Vault',
    welcome: 'Welcome!', hi: 'Hi',
    takePlacementTest: '⭐ Take the Placement Test to find your level!',
    chooseModule: '📚 Choose a module to practise!',
    findYourCefrLevel: 'Find your CEFR level',
    customisePracticeList: 'Customise Practice List',
    selectCefrLevel: 'Select CEFR level',
    selectChunkCategory: 'Select chunk category',
    translatePhraseToEnglish: 'Translate this phrase into English',
    englishTranslationPlaceholder: 'Type your English translation...',
    englishChunkTranslation: 'Your English translation of the chunk',
    getHint: 'Get a hint',
    showCorrectAnswer: 'Show the correct answer',
    hearCorrectAnswer: 'Hear correct answer',
    saveToVocabularyVault: 'Save to Vocabulary Vault',
    nextChunk: 'Next chunk',
    wordChunksStartHint: 'Translate short phrases and expressions from your language into English. Select a category, then tap Start.',
    generatingChunk: 'Generating chunk',
    hearInLanguage: 'Hear in',
    scoreExcellent: 'Excellent',
    scoreGood: 'Good',
    scoreOk: 'OK',
    chunksDone: 'done',
    averageAbbrev: 'avg',
    nextExercise: 'Next Exercise',
    doneLabel: 'Done',
    averageLabel: 'Avg',
    chooseMode: 'Choose a mode',
    grammarIntro: "Let's sharpen your grammar! Pick a mode to practice.",
    errorCorrection: 'Error Correction',
    errorCorrectionDesc: 'Find and fix the grammar mistakes',
    sentenceBuilder: 'Sentence Builder',
    sentenceBuilderDesc: 'Tap words to build the correct sentence',
    fillInTheBlank: 'Fill in the Blank',
    fillInTheBlankDesc: 'Type the missing word or phrase',
    findFixGrammarMistakes: 'Find and fix the grammar mistake(s):',
    correctedSentenceLabel: 'Your corrected sentence:',
    correctedSentencePlaceholder: 'Type the corrected sentence...',
    buildSentenceInstruction: 'Tap words in the correct order to build the sentence:',
    dropZonePlaceholder: 'Tap words below to place them here...',
    resetSentence: 'Reset',
    wordBankTapToAdd: 'Word bank - tap to add:',
    fillMissingWordPhrase: 'Fill in the missing word or phrase:',
    missingWordPlaceholder: 'Type the missing word(s)...',
    typeMissingWordPhrase: 'Type the missing word or phrase',
    skipExerciseNewOne: 'Skip this exercise and get a new one',
    skipThisOne: 'Skip this one',
    resultLabel: 'Result',
    generatingExercise: 'Generating exercise...',
    aboutMe: 'About Me',
    hobbiesInterests: 'Hobbies & Interests',
    editProfile: 'Edit Profile',
    setUpYourProfile: 'Set Up Your Profile',
    personalInfo: 'Personal Info',
    profileDetailsNote: "Your profile details are for your benefit. We don't use this information for anything else; it simply helps the AI create exercises that match your needs, goals, interests, and English level.",
    namePlaceholder: 'Your name *',
    professionPlaceholder: 'Profession (e.g., Teacher, Engineer, Student)',
    qualificationsPlaceholder: 'Qualifications (optional)',
    agePlaceholder: 'Age (optional)',
    hobbiesPlaceholder: 'Hobbies & interests (e.g., cooking, football, travel)',
    optionalLabel: 'Optional',
    bioHelpText: 'Describe your work duties, daily tasks, or anything about yourself. This helps us create more relevant exercises.',
    bioPlaceholder: 'e.g., I work as a project manager at a construction company. My daily tasks include writing reports, attending meetings, and communicating with international clients.\n\nI also enjoy cooking Italian food and playing chess on weekends.',
    nativeLanguageHelp: 'Grammar tips and translations shown in this language',
    appLanguageHelp: 'Change the interface language',
    appLanguageNote: 'Note: Full interface translations coming soon. Grammar tips already use your native language.',
    englishLevelCefr: 'English Level (CEFR)',
    levelDifficultyHelp: 'Exercises will match this difficulty',
    savedBang: 'Saved!',
    saveProfile: 'Save Profile',
    teacher: 'Teacher',
    student: 'Student',
    teacherMode: 'Teacher Mode',
    studentMode: 'Student Mode',
    switchMode: 'Switch',
    createNewClass: 'Create New Class',
    createClass: 'Create Class',
    noClassesYet: 'No classes yet',
    noClassesHelp: 'Create your first class and share the code with your students.',
    myClasses: 'My Classes',
    joinAClass: 'Join a Class',
    joinClass: 'Join Class',
    notInClassYet: 'Not in a class yet',
    notInClassHelp: 'Ask your teacher for the 6-character class code, then tap "Join a Class" above.',
    viewDashboard: 'View Dashboard',
    leaveClass: 'Leave class',
    leave: 'Leave',
    yourNameLabel: 'Your Name',
    classNameLabel: 'Class Name',
    teacherNamePlaceholder: 'e.g. Mrs Smith',
    classNamePlaceholder: 'e.g. Grade 9 English',
    classCodeLabel: 'Class Code',
    fullNamePlaceholder: 'Your full name',
    classCodePlaceholder: 'ABC123',
    classCodeA11y: '6-character class code',
    classroomStudentTip: 'Your scores are automatically submitted to this class when you complete exercises. Keep practising to climb the leaderboard!',
    teacherModeDesc: 'Create a class, manage students, view analytics',
    studentModeDesc: "Join a class with your teacher's code",
  },
  af: {
    home: 'Tuis', practice: 'Oefen', progress: 'Vordering',
    settings: 'Instellings', profile: 'Profiel',
    start: 'Begin', submit: 'Indien', next: 'Volgende', back: 'Terug',
    save: 'Stoor', cancel: 'Kanselleer', retry: 'Probeer weer', loading: 'Laai tans...',
    translationTrainer: 'Vertaaloefenaar', wordChunks: 'Woordgroepe',
    listening: 'Luister', writing: 'Skryf', grammarPractice: 'Grammatika-oefening',
    grammarQuiz: 'Grammatika-vasvra', vocabularyFlashcards: 'Woordeskat-kaarte',
    dailyChallenges: 'Daaglikse Uitdagings', placementTest: 'Vlaktoets',
    classroom: 'Klaskamer', vocabularyVault: 'Woordeskatkluis', businessEnglish: 'Sake-Engels',
    accuracy: 'Akkuraatheid', streak: 'Reeks', timeSpent: 'Tyd Bestee', score: 'Telling',
    nativeLanguage: 'Moedertaal', appLanguage: 'App-taal', level: 'Vlak',
    correct: 'Korrek', incorrect: 'Verkeerd', wellDone: 'Goed gedoen!', tryAgain: 'Probeer weer',
    definition: 'Definisie', example: 'Voorbeeld', saveToVault: 'Stoor in Kluis',
    welcome: 'Welkom!', hi: 'Hallo',
    takePlacementTest: '⭐ Doen die Plasingstoets om jou vlak te vind!',
    chooseModule: '📚 Kies \'n module om te oefen!',
    findYourCefrLevel: 'Vind jou CEFR-vlak',
    customisePracticeList: 'Pasmaak Oefenlys',
  },
  am: {
    home: 'መነሻ', practice: 'ልምምድ', progress: 'እድገት',
    settings: 'ቅንብሮች', profile: 'መገለጫ',
    start: 'ጀምር', submit: 'አስገባ', next: 'ቀጣይ', back: 'ተመለስ',
    save: 'አስቀምጥ', cancel: 'ሰርዝ', retry: 'እንደገና ሞክር', loading: 'በመጫን ላይ...',
    translationTrainer: 'የትርጉም አሰልጣኝ', wordChunks: 'የቃላት ቡድኖች',
    listening: 'ማዳመጥ', writing: 'ጽሑፍ', grammarPractice: 'ሰዋሰው ልምምድ',
    grammarQuiz: 'የሰዋሰው ፈተና', vocabularyFlashcards: 'የቃላት ካርዶች',
    dailyChallenges: 'ዕለታዊ ፈተናዎች', placementTest: 'የደረጃ ፈተና',
    classroom: 'ክፍል ውስጥ', vocabularyVault: 'የቃላት ክምችት', businessEnglish: 'የንግድ እንግሊዝኛ',
    accuracy: 'ትክክለኛነት', streak: 'ተከታታይ', timeSpent: 'የተፈጀ ጊዜ', score: 'ነጥብ',
    nativeLanguage: 'የአፍ መፍቻ ቋንቋ', appLanguage: 'የመተግበሪያ ቋንቋ', level: 'ደረጃ',
    correct: 'ትክክል', incorrect: 'ስህተት', wellDone: 'በጣም ጥሩ!', tryAgain: 'እንደገና ሞክር',
    definition: 'ትርጉም', example: 'ምሳሌ', saveToVault: 'ወደ ክምችት አስቀምጥ',
    welcome: 'እንኳን ደህና መጡ!', hi: 'ሰላም',
    takePlacementTest: '⭐ ደረጃዎን ለማወቅ የደረጃ ፈተናውን ይውሰዱ!',
    chooseModule: '📚 ለመለማመድ ሞጁል ይምረጡ!',
    findYourCefrLevel: 'የእርስዎን CEFR ደረጃ ያግኙ',
    customisePracticeList: 'የልምምድ ዝርዝር ያብጁ',
  },
  ar: {
    home: 'الرئيسية', practice: 'تدريب', progress: 'التقدم',
    settings: 'الإعدادات', profile: 'الملف الشخصي',
    start: 'ابدأ', submit: 'إرسال', next: 'التالي', back: 'رجوع',
    save: 'حفظ', cancel: 'إلغاء', retry: 'أعد المحاولة', loading: 'جارٍ التحميل...',
    translationTrainer: 'مدرب الترجمة', wordChunks: 'مجموعات الكلمات',
    listening: 'الاستماع', writing: 'الكتابة', grammarPractice: 'تدريب القواعد',
    grammarQuiz: 'اختبار القواعد', vocabularyFlashcards: 'بطاقات المفردات',
    dailyChallenges: 'التحديات اليومية', placementTest: 'اختبار المستوى',
    classroom: 'الفصل الدراسي', vocabularyVault: 'خزينة المفردات', businessEnglish: 'إنجليزية الأعمال',
    accuracy: 'الدقة', streak: 'التسلسل', timeSpent: 'الوقت المستغرق', score: 'النتيجة',
    nativeLanguage: 'اللغة الأم', appLanguage: 'لغة التطبيق', level: 'المستوى',
    correct: 'صحيح', incorrect: 'خطأ', wellDone: 'أحسنت!', tryAgain: 'أعد المحاولة',
    definition: 'التعريف', example: 'مثال', saveToVault: 'حفظ في الخزينة',
    welcome: 'أهلاً وسهلاً!', hi: 'مرحبا',
    takePlacementTest: '⭐ خذ اختبار التحديد لمعرفة مستواك!',
    chooseModule: '📚 اختر وحدة للتدرب!',
    findYourCefrLevel: 'اعرف مستواك في CEFR',
    customisePracticeList: 'تخصيص قائمة التدريب',
  },
  bn: {
    home: 'হোম', practice: 'অনুশীলন', progress: 'অগ্রগতি',
    settings: 'সেটিংস', profile: 'প্রোফাইল',
    start: 'শুরু করুন', submit: 'জমা দিন', next: 'পরবর্তী', back: 'পিছনে',
    save: 'সংরক্ষণ', cancel: 'বাতিল', retry: 'আবার চেষ্টা করুন', loading: 'লোড হচ্ছে...',
    translationTrainer: 'অনুবাদ প্রশিক্ষক', wordChunks: 'শব্দ গুচ্ছ',
    listening: 'শ্রবণ', writing: 'লেখা', grammarPractice: 'ব্যাকরণ অনুশীলন',
    grammarQuiz: 'ব্যাকরণ কুইজ', vocabularyFlashcards: 'শব্দভাণ্ডার কার্ড',
    dailyChallenges: 'দৈনিক চ্যালেঞ্জ', placementTest: 'স্থান নির্ধারণ পরীক্ষা',
    classroom: 'ক্লাসরুম', vocabularyVault: 'শব্দভাণ্ডার ভল্ট', businessEnglish: 'ব্যবসায়িক ইংরেজি',
    accuracy: 'নির্ভুলতা', streak: 'ধারাবাহিকতা', timeSpent: 'সময় ব্যয়', score: 'স্কোর',
    nativeLanguage: 'মাতৃভাষা', appLanguage: 'অ্যাপের ভাষা', level: 'স্তর',
    correct: 'সঠিক', incorrect: 'ভুল', wellDone: 'শাবাশ!', tryAgain: 'আবার চেষ্টা করুন',
    definition: 'সংজ্ঞা', example: 'উদাহরণ', saveToVault: 'ভল্টে সংরক্ষণ করুন',
    welcome: 'স্বাগতম!', hi: 'হাই',
    takePlacementTest: '⭐ আপনার স্তর জানতে প্লেসমেন্ট টেস্ট দিন!',
    chooseModule: '📚 অনুশীলনের জন্য একটি মডিউল বেছে নিন!',
    findYourCefrLevel: 'আপনার CEFR স্তর খুঁজুন',
    customisePracticeList: 'অনুশীলন তালিকা কাস্টমাইজ করুন',
  },
  bg: {
    home: 'Начало', practice: 'Практика', progress: 'Напредък',
    settings: 'Настройки', profile: 'Профил',
    start: 'Старт', submit: 'Изпрати', next: 'Напред', back: 'Назад',
    save: 'Запази', cancel: 'Отказ', retry: 'Опитай пак', loading: 'Зареждане...',
    translationTrainer: 'Треньор по превод', wordChunks: 'Словосъчетания',
    listening: 'Слушане', writing: 'Писане', grammarPractice: 'Граматически упражнения',
    grammarQuiz: 'Граматически тест', vocabularyFlashcards: 'Речникови карти',
    dailyChallenges: 'Ежедневни предизвикателства', placementTest: 'Тест за ниво',
    classroom: 'Клас', vocabularyVault: 'Речников трезор', businessEnglish: 'Бизнес английски',
    accuracy: 'Точност', streak: 'Серия', timeSpent: 'Изразходвано време', score: 'Резултат',
    nativeLanguage: 'Роден език', appLanguage: 'Език на приложението', level: 'Ниво',
    correct: 'Правилно', incorrect: 'Грешно', wellDone: 'Браво!', tryAgain: 'Опитай пак',
    definition: 'Дефиниция', example: 'Пример', saveToVault: 'Запази в трезора',
    welcome: 'Добре дошли!', hi: 'Здравей',
    takePlacementTest: '⭐ Направете теста за ниво, за да откриете нивото си!',
    chooseModule: '📚 Изберете модул за упражнения!',
    findYourCefrLevel: 'Открийте своето ниво по CEFR',
    customisePracticeList: 'Персонализирай списъка с упражнения',
  },
  cs: {
    home: 'Domů', practice: 'Cvičení', progress: 'Pokrok',
    settings: 'Nastavení', profile: 'Profil',
    start: 'Začít', submit: 'Odeslat', next: 'Další', back: 'Zpět',
    save: 'Uložit', cancel: 'Zrušit', retry: 'Zkusit znovu', loading: 'Načítání...',
    translationTrainer: 'Trenér překladu', wordChunks: 'Slovní skupiny',
    listening: 'Poslech', writing: 'Psaní', grammarPractice: 'Procvičování gramatiky',
    grammarQuiz: 'Gramatický kvíz', vocabularyFlashcards: 'Slovíčkové kartičky',
    dailyChallenges: 'Denní výzvy', placementTest: 'Vstupní test',
    classroom: 'Třída', vocabularyVault: 'Slovní trezor', businessEnglish: 'Obchodní angličtina',
    accuracy: 'Přesnost', streak: 'Série', timeSpent: 'Strávený čas', score: 'Skóre',
    nativeLanguage: 'Rodný jazyk', appLanguage: 'Jazyk aplikace', level: 'Úroveň',
    correct: 'Správně', incorrect: 'Špatně', wellDone: 'Výborně!', tryAgain: 'Zkusit znovu',
    definition: 'Definice', example: 'Příklad', saveToVault: 'Uložit do trezoru',
    welcome: 'Vítejte!', hi: 'Ahoj',
    takePlacementTest: '⭐ Udělejte si Test úrovně, abyste zjistili svou úroveň!',
    chooseModule: '📚 Vyberte si modul k procvičování!',
    findYourCefrLevel: 'Zjistěte svou úroveň CEFR',
    customisePracticeList: 'Přizpůsobit seznam cvičení',
  },
  da: {
    home: 'Hjem', practice: 'Øvelse', progress: 'Fremgang',
    settings: 'Indstillinger', profile: 'Profil',
    start: 'Start', submit: 'Send', next: 'Næste', back: 'Tilbage',
    save: 'Gem', cancel: 'Annuller', retry: 'Prøv igen', loading: 'Indlæser...',
    translationTrainer: 'Oversættelsestrænер', wordChunks: 'Ordgrupper',
    listening: 'Lytning', writing: 'Skrivning', grammarPractice: 'Grammatikøvelse',
    grammarQuiz: 'Grammatikquiz', vocabularyFlashcards: 'Ordforrådskort',
    dailyChallenges: 'Daglige udfordringer', placementTest: 'Niveautest',
    classroom: 'Klasseværelse', vocabularyVault: 'Ordforrådsbank', businessEnglish: 'Erhvervsengelsk',
    accuracy: 'Nøjagtighed', streak: 'Serie', timeSpent: 'Tid brugt', score: 'Point',
    nativeLanguage: 'Modersmål', appLanguage: 'App-sprog', level: 'Niveau',
    correct: 'Korrekt', incorrect: 'Forkert', wellDone: 'Godt klaret!', tryAgain: 'Prøv igen',
    definition: 'Definition', example: 'Eksempel', saveToVault: 'Gem i bank',
    welcome: 'Velkommen!', hi: 'Hej',
    takePlacementTest: '⭐ Tag niveautesten for at finde dit niveau!',
    chooseModule: '📚 Vælg et modul at øve på!',
    findYourCefrLevel: 'Find dit CEFR-niveau',
    customisePracticeList: 'Tilpas øvelseslisten',
  },
  nl: {
    home: 'Thuis', practice: 'Oefenen', progress: 'Voortgang',
    settings: 'Instellingen', profile: 'Profiel',
    start: 'Begin', submit: 'Verzenden', next: 'Volgende', back: 'Terug',
    save: 'Opslaan', cancel: 'Annuleren', retry: 'Opnieuw', loading: 'Laden...',
    translationTrainer: 'Vertaaltrainer', wordChunks: 'Woordgroepen',
    listening: 'Luisteren', writing: 'Schrijven', grammarPractice: 'Grammaticaoefening',
    grammarQuiz: 'Grammaticaquiz', vocabularyFlashcards: 'Woordenschatkaarten',
    dailyChallenges: 'Dagelijkse uitdagingen', placementTest: 'Niveautest',
    classroom: 'Klas', vocabularyVault: 'Woordenschatkluis', businessEnglish: 'Zakelijk Engels',
    accuracy: 'Nauwkeurigheid', streak: 'Reeks', timeSpent: 'Bestede tijd', score: 'Score',
    nativeLanguage: 'Moedertaal', appLanguage: 'App-taal', level: 'Niveau',
    correct: 'Correct', incorrect: 'Onjuist', wellDone: 'Goed gedaan!', tryAgain: 'Opnieuw',
    definition: 'Definitie', example: 'Voorbeeld', saveToVault: 'Opslaan in kluis',
    welcome: 'Welkom!', hi: 'Hallo',
    takePlacementTest: '⭐ Doe de Niveautoets om je niveau te vinden!',
    chooseModule: '📚 Kies een module om te oefenen!',
    findYourCefrLevel: 'Vind je ERK-niveau',
    customisePracticeList: 'Oefenlijst aanpassen',
  },
  fi: {
    home: 'Koti', practice: 'Harjoittelu', progress: 'Edistyminen',
    settings: 'Asetukset', profile: 'Profiili',
    start: 'Aloita', submit: 'Lähetä', next: 'Seuraava', back: 'Takaisin',
    save: 'Tallenna', cancel: 'Peruuta', retry: 'Yritä uudelleen', loading: 'Ladataan...',
    translationTrainer: 'Käännösvalmentaja', wordChunks: 'Sanaryhmät',
    listening: 'Kuuntelu', writing: 'Kirjoittaminen', grammarPractice: 'Kielioppiharjoitus',
    grammarQuiz: 'Kielioppitesti', vocabularyFlashcards: 'Sanastokortit',
    dailyChallenges: 'Päivittäiset haasteet', placementTest: 'Tasotesti',
    classroom: 'Luokkahuone', vocabularyVault: 'Sanastovarasto', businessEnglish: 'Liike-englanti',
    accuracy: 'Tarkkuus', streak: 'Putki', timeSpent: 'Käytetty aika', score: 'Pisteet',
    nativeLanguage: 'Äidinkieli', appLanguage: 'Sovelluksen kieli', level: 'Taso',
    correct: 'Oikein', incorrect: 'Väärin', wellDone: 'Hienoa!', tryAgain: 'Yritä uudelleen',
    definition: 'Määritelmä', example: 'Esimerkki', saveToVault: 'Tallenna varastoon',
    welcome: 'Tervetuloa!', hi: 'Hei',
    takePlacementTest: '⭐ Tee tasotesti löytääksesi tasosi!',
    chooseModule: '📚 Valitse moduuli harjoiteltavaksi!',
    findYourCefrLevel: 'Löydä CEFR-tasosi',
    customisePracticeList: 'Mukauta harjoituslistaa',
  },
  fr: {
    home: 'Accueil', practice: 'Entraînement', progress: 'Progrès',
    settings: 'Paramètres', profile: 'Profil',
    start: 'Commencer', submit: 'Soumettre', next: 'Suivant', back: 'Retour',
    save: 'Enregistrer', cancel: 'Annuler', retry: 'Réessayer', loading: 'Chargement...',
    translationTrainer: 'Entraîneur de traduction', wordChunks: 'Groupes de mots',
    listening: 'Écoute', writing: 'Écriture', grammarPractice: 'Exercices de grammaire',
    grammarQuiz: 'Quiz de grammaire', vocabularyFlashcards: 'Fiches de vocabulaire',
    dailyChallenges: 'Défis quotidiens', placementTest: 'Test de niveau',
    classroom: 'Salle de classe', vocabularyVault: 'Coffre de vocabulaire', businessEnglish: 'Anglais des affaires',
    accuracy: 'Précision', streak: 'Série', timeSpent: 'Temps passé', score: 'Score',
    nativeLanguage: 'Langue maternelle', appLanguage: "Langue de l'app", level: 'Niveau',
    correct: 'Correct', incorrect: 'Incorrect', wellDone: 'Bien joué !', tryAgain: 'Réessayer',
    definition: 'Définition', example: 'Exemple', saveToVault: 'Sauvegarder',
    welcome: 'Bienvenue !', hi: 'Salut',
    takePlacementTest: '⭐ Passe le Test de Niveau pour trouver ton niveau !',
    chooseModule: '📚 Choisis un module pour t\'entraîner !',
    findYourCefrLevel: 'Trouve ton niveau CECR',
    customisePracticeList: 'Personnaliser la Liste de Pratique',
  },
  de: {
    home: 'Startseite', practice: 'Übung', progress: 'Fortschritt',
    settings: 'Einstellungen', profile: 'Profil',
    start: 'Start', submit: 'Senden', next: 'Weiter', back: 'Zurück',
    save: 'Speichern', cancel: 'Abbrechen', retry: 'Nochmal', loading: 'Laden...',
    translationTrainer: 'Übersetzungstrainer', wordChunks: 'Wortgruppen',
    listening: 'Hören', writing: 'Schreiben', grammarPractice: 'Grammatikübung',
    grammarQuiz: 'Grammatikquiz', vocabularyFlashcards: 'Vokabelkarten',
    dailyChallenges: 'Tägliche Aufgaben', placementTest: 'Einstufungstest',
    classroom: 'Klassenzimmer', vocabularyVault: 'Vokabeltresor', businessEnglish: 'Geschäftsenglisch',
    accuracy: 'Genauigkeit', streak: 'Serie', timeSpent: 'Zeitaufwand', score: 'Punktzahl',
    nativeLanguage: 'Muttersprache', appLanguage: 'App-Sprache', level: 'Niveau',
    correct: 'Richtig', incorrect: 'Falsch', wellDone: 'Gut gemacht!', tryAgain: 'Nochmal',
    definition: 'Definition', example: 'Beispiel', saveToVault: 'Im Tresor speichern',
    welcome: 'Willkommen!', hi: 'Hallo',
    takePlacementTest: '⭐ Mache den Einstufungstest, um dein Niveau zu finden!',
    chooseModule: '📚 Wähle ein Modul zum Üben!',
    findYourCefrLevel: 'Finde dein GER-Niveau',
    customisePracticeList: 'Übungsliste anpassen',
  },
  el: {
    home: 'Αρχική', practice: 'Εξάσκηση', progress: 'Πρόοδος',
    settings: 'Ρυθμίσεις', profile: 'Προφίλ',
    start: 'Έναρξη', submit: 'Υποβολή', next: 'Επόμενο', back: 'Πίσω',
    save: 'Αποθήκευση', cancel: 'Ακύρωση', retry: 'Δοκιμή ξανά', loading: 'Φόρτωση...',
    translationTrainer: 'Εκπαιδευτής μετάφρασης', wordChunks: 'Ομάδες λέξεων',
    listening: 'Ακρόαση', writing: 'Γραφή', grammarPractice: 'Γραμματική άσκηση',
    grammarQuiz: 'Κουίζ γραμματικής', vocabularyFlashcards: 'Κάρτες λεξιλογίου',
    dailyChallenges: 'Καθημερινές προκλήσεις', placementTest: 'Τεστ επιπέδου',
    classroom: 'Τάξη', vocabularyVault: 'Θησαυρός λεξιλογίου', businessEnglish: 'Επαγγελματικά Αγγλικά',
    accuracy: 'Ακρίβεια', streak: 'Σερί', timeSpent: 'Χρόνος', score: 'Βαθμός',
    nativeLanguage: 'Μητρική γλώσσα', appLanguage: 'Γλώσσα εφαρμογής', level: 'Επίπεδο',
    correct: 'Σωστό', incorrect: 'Λάθος', wellDone: 'Μπράβο!', tryAgain: 'Δοκιμή ξανά',
    definition: 'Ορισμός', example: 'Παράδειγμα', saveToVault: 'Αποθήκευση',
    welcome: 'Καλώς ορίσατε!', hi: 'Γεια',
    takePlacementTest: '⭐ Κάντε το Τεστ Κατάταξης για να βρείτε το επίπεδό σας!',
    chooseModule: '📚 Επιλέξτε ένα module για εξάσκηση!',
    findYourCefrLevel: 'Βρείτε το επίπεδό σας στο CEFR',
    customisePracticeList: 'Προσαρμογή Λίστας Εξάσκησης',
  },
  gu: {
    home: 'હોમ', practice: 'અભ્યાસ', progress: 'પ્રગતિ',
    settings: 'સેટિંગ્સ', profile: 'પ્રોફાઈલ',
    start: 'શરૂ કરો', submit: 'સબમિટ', next: 'આગળ', back: 'પાછળ',
    save: 'સાચવો', cancel: 'રદ કરો', retry: 'ફરી પ્રયાસ', loading: 'લોડ થઈ રહ્યું છે...',
    translationTrainer: 'ભાષાંતર તાલીમ', wordChunks: 'શબ્દ જૂથો',
    listening: 'સાંભળવું', writing: 'લેખન', grammarPractice: 'વ્યાકરણ અભ્યાસ',
    grammarQuiz: 'વ્યાકરણ ક્વિઝ', vocabularyFlashcards: 'શબ્દભંડોળ કાર્ડ',
    dailyChallenges: 'દૈનિક પડકારો', placementTest: 'સ્તર પ્રવેશ',
    classroom: 'વર્ગખંડ', vocabularyVault: 'શબ્દભંડોળ ભંડાર', businessEnglish: 'બિઝનેસ અંગ્રેજી',
    accuracy: 'ચોકસાઈ', streak: 'ક્રમ', timeSpent: 'ગાળેલ સમય', score: 'સ્કોર',
    nativeLanguage: 'માતૃભાષા', appLanguage: 'એપ ભાષા', level: 'સ્તર',
    correct: 'સાચું', incorrect: 'ખોટું', wellDone: 'શાબ્બાશ!', tryAgain: 'ફરી પ્રયાસ',
    definition: 'વ્યાખ્યા', example: 'ઉદાહરણ', saveToVault: 'ભંડારમાં સાચવો',
    welcome: 'સ્વાગત છે!', hi: 'નમસ્તે',
    takePlacementTest: '⭐ તમારું સ્તર જાણવા માટે પ્લેસમેન્ટ ટેસ્ટ આપો!',
    chooseModule: '📚 અભ્યાસ માટે મોડ્યુલ પસંદ કરો!',
    findYourCefrLevel: 'તમારું CEFR સ્તર શોધો',
    customisePracticeList: 'અભ્યાસ સૂચિ કસ્ટમાઇઝ કરો',
  },
  ha: {
    home: 'Gida', practice: 'Aiki', progress: 'Ci Gaba',
    settings: 'Saituna', profile: 'Bayanin kai',
    start: 'Fara', submit: 'Aika', next: 'Na gaba', back: 'Koma',
    save: 'Ajiye', cancel: 'Soke', retry: 'Sake gwadawa', loading: 'Ana lodawa...',
    translationTrainer: 'Mai koyar da fassara', wordChunks: 'Ƙungiyoyin kalmomi',
    listening: 'Sauraro', writing: 'Rubutu', grammarPractice: 'Aikin nahawu',
    grammarQuiz: 'Gwajin nahawu', vocabularyFlashcards: 'Katin kalmomi',
    dailyChallenges: 'Ƙalubalen yau da kullun', placementTest: 'Gwajin matakin',
    classroom: 'Aji', vocabularyVault: 'Ajiyar kalmomi', businessEnglish: 'Turanci na kasuwanci',
    accuracy: 'Daidaito', streak: 'Jerin', timeSpent: 'Lokaci da aka kashe', score: 'Maki',
    nativeLanguage: 'Harshen uwa', appLanguage: 'Harshen app', level: 'Mataki',
    correct: 'Daidai', incorrect: 'Kuskure', wellDone: 'Kyau!', tryAgain: 'Sake gwadawa',
    definition: 'Ma\'ana', example: 'Misali', saveToVault: 'Ajiye a ajiya',
    welcome: 'Barka da zuwa!', hi: 'Sannu',
    takePlacementTest: '⭐ Yi Jarrabawar Sanya Mataki don gano matakinka!',
    chooseModule: '📚 Zaɓi tsari don yin atisaye!',
    findYourCefrLevel: 'Nemo matakinka na CEFR',
    customisePracticeList: 'Daidaita Jerin Atisaye',
  },
  he: {
    home: 'בית', practice: 'תרגול', progress: 'התקדמות',
    settings: 'הגדרות', profile: 'פרופיל',
    start: 'התחל', submit: 'שלח', next: 'הבא', back: 'חזור',
    save: 'שמור', cancel: 'ביטול', retry: 'נסה שוב', loading: 'טוען...',
    translationTrainer: 'מאמן תרגום', wordChunks: 'קבוצות מילים',
    listening: 'האזנה', writing: 'כתיבה', grammarPractice: 'תרגול דקדוק',
    grammarQuiz: 'חידון דקדוק', vocabularyFlashcards: 'כרטיסי אוצר מילים',
    dailyChallenges: 'אתגרים יומיים', placementTest: 'מבחן רמה',
    classroom: 'כיתה', vocabularyVault: 'כספת מילים', businessEnglish: 'אנגלית עסקית',
    accuracy: 'דיוק', streak: 'רצף', timeSpent: 'זמן שהוקדש', score: 'ניקוד',
    nativeLanguage: 'שפת אם', appLanguage: 'שפת האפליקציה', level: 'רמה',
    correct: 'נכון', incorrect: 'שגוי', wellDone: 'כל הכבוד!', tryAgain: 'נסה שוב',
    definition: 'הגדרה', example: 'דוגמה', saveToVault: 'שמור בכספת',
    welcome: 'ברוכים הבאים!', hi: 'שלום',
    takePlacementTest: '⭐ עברו את מבחן הרמה כדי למצוא את הרמה שלכם!',
    chooseModule: '📚 בחרו מודול לתרגול!',
    findYourCefrLevel: 'מצאו את רמת ה-CEFR שלכם',
    customisePracticeList: 'התאם אישית רשימת תרגול',
  },
  hi: {
    home: 'होम', practice: 'अभ्यास', progress: 'प्रगति',
    settings: 'सेटिंग्स', profile: 'प्रोफ़ाइल',
    start: 'शुरू करें', submit: 'जमा करें', next: 'अगला', back: 'वापस',
    save: 'सहेजें', cancel: 'रद्द करें', retry: 'पुनः प्रयास', loading: 'लोड हो रहा है...',
    translationTrainer: 'अनुवाद प्रशिक्षक', wordChunks: 'शब्द समूह',
    listening: 'सुनना', writing: 'लिखना', grammarPractice: 'व्याकरण अभ्यास',
    grammarQuiz: 'व्याकरण प्रश्नोत्तरी', vocabularyFlashcards: 'शब्दावली कार्ड',
    dailyChallenges: 'दैनिक चुनौतियाँ', placementTest: 'स्तर परीक्षण',
    classroom: 'कक्षा', vocabularyVault: 'शब्दावली तिजोरी', businessEnglish: 'व्यावसायिक अंग्रेज़ी',
    accuracy: 'सटीकता', streak: 'क्रम', timeSpent: 'बिताया समय', score: 'स्कोर',
    nativeLanguage: 'मातृभाषा', appLanguage: 'ऐप भाषा', level: 'स्तर',
    correct: 'सही', incorrect: 'गलत', wellDone: 'शाबाश!', tryAgain: 'पुनः प्रयास',
    definition: 'परिभाषा', example: 'उदाहरण', saveToVault: 'तिजोरी में सहेजें',
    welcome: 'स्वागत है!', hi: 'नमस्ते',
    takePlacementTest: '⭐ अपना स्तर जानने के लिए प्लेसमेंट टेस्ट लें!',
    chooseModule: '📚 अभ्यास के लिए मॉड्यूल चुनें!',
    findYourCefrLevel: 'अपना CEFR स्तर जानें',
    customisePracticeList: 'अभ्यास सूची अनुकूलित करें',
  },
  hu: {
    home: 'Főoldal', practice: 'Gyakorlás', progress: 'Előrehaladás',
    settings: 'Beállítások', profile: 'Profil',
    start: 'Kezdés', submit: 'Küldés', next: 'Következő', back: 'Vissza',
    save: 'Mentés', cancel: 'Mégse', retry: 'Újra', loading: 'Betöltés...',
    translationTrainer: 'Fordítási edző', wordChunks: 'Szócsoportok',
    listening: 'Hallgatás', writing: 'Írás', grammarPractice: 'Grammatikai gyakorlat',
    grammarQuiz: 'Grammatikai kvíz', vocabularyFlashcards: 'Szókártyák',
    dailyChallenges: 'Napi kihívások', placementTest: 'Szintfelmérő',
    classroom: 'Osztályterem', vocabularyVault: 'Szókészlet-tár', businessEnglish: 'Üzleti angol',
    accuracy: 'Pontosság', streak: 'Sorozat', timeSpent: 'Töltött idő', score: 'Pontszám',
    nativeLanguage: 'Anyanyelv', appLanguage: 'Alkalmazás nyelve', level: 'Szint',
    correct: 'Helyes', incorrect: 'Helytelen', wellDone: 'Szép munka!', tryAgain: 'Újra',
    definition: 'Definíció', example: 'Példa', saveToVault: 'Mentés a tárba',
    welcome: 'Üdvözöljük!', hi: 'Szia',
    takePlacementTest: '⭐ Tedd meg a Szintfelmérő tesztet, hogy megtaláld a szintedet!',
    chooseModule: '📚 Válassz egy modult a gyakorláshoz!',
    findYourCefrLevel: 'Találd meg a KER-szinted',
    customisePracticeList: 'Gyakorlólista testreszabása',
  },
  ig: {
    home: 'Ụlọ', practice: 'Ịmụ', progress: 'Ọganihu',
    settings: 'Ntọala', profile: 'Profaịl',
    start: 'Malite', submit: 'Nyefee', next: 'Ọzọ', back: 'Laghachi',
    save: 'Chekwaa', cancel: 'Kagbuo', retry: 'Nwalee ọzọ', loading: 'Na-ebu...',
    translationTrainer: 'Onye nkuzi ntụgharị', wordChunks: 'Otu okwu',
    listening: 'Ige ntị', writing: 'Ide', grammarPractice: 'Ọmụmụ ụtọasụsụ',
    grammarQuiz: 'Nnwale ụtọasụsụ', vocabularyFlashcards: 'Kaadị okwu',
    dailyChallenges: 'Ihe ịgba ọsọ kwa ụbọchị', placementTest: 'Nnwale ọkwa',
    classroom: 'Ụlọ akwụkwọ', vocabularyVault: 'Ebe ihe nchekwa okwu', businessEnglish: 'Bekee azụmahịa',
    accuracy: 'Izi ezi', streak: 'Usoro', timeSpent: 'Oge eji', score: 'Oke',
    nativeLanguage: 'Asụsụ obodo', appLanguage: 'Asụsụ ngwa', level: 'Ọkwa',
    correct: 'Ọ dị mma', incorrect: 'Ezighi ezi', wellDone: 'Ọ dị mma!', tryAgain: 'Nwalee ọzọ',
    definition: 'Nkọwa', example: 'Ihe atụ', saveToVault: 'Chekwaa n\'ebe nchekwa',
    welcome: 'Nnọọ!', hi: 'Ndewo',
    takePlacementTest: '⭐ Mee ule itinye n\'ọkwa iji chọta ọkwa gị!',
    chooseModule: '📚 Họrọ modul maka ime ihe omume!',
    findYourCefrLevel: 'Chọta ọkwa CEFR gị',
    customisePracticeList: 'Hazie ndepụta omume',
  },
  id: {
    home: 'Beranda', practice: 'Latihan', progress: 'Kemajuan',
    settings: 'Pengaturan', profile: 'Profil',
    start: 'Mulai', submit: 'Kirim', next: 'Berikutnya', back: 'Kembali',
    save: 'Simpan', cancel: 'Batal', retry: 'Coba lagi', loading: 'Memuat...',
    translationTrainer: 'Pelatih terjemahan', wordChunks: 'Kelompok kata',
    listening: 'Mendengarkan', writing: 'Menulis', grammarPractice: 'Latihan tata bahasa',
    grammarQuiz: 'Kuis tata bahasa', vocabularyFlashcards: 'Kartu kosakata',
    dailyChallenges: 'Tantangan harian', placementTest: 'Tes penempatan',
    classroom: 'Kelas', vocabularyVault: 'Brankas kosakata', businessEnglish: 'Bahasa Inggris bisnis',
    accuracy: 'Akurasi', streak: 'Rentetan', timeSpent: 'Waktu yang dihabiskan', score: 'Skor',
    nativeLanguage: 'Bahasa asli', appLanguage: 'Bahasa aplikasi', level: 'Tingkat',
    correct: 'Benar', incorrect: 'Salah', wellDone: 'Bagus sekali!', tryAgain: 'Coba lagi',
    definition: 'Definisi', example: 'Contoh', saveToVault: 'Simpan ke brankas',
    welcome: 'Selamat datang!', hi: 'Halo',
    takePlacementTest: '⭐ Ikuti Tes Penempatan untuk menemukan level Anda!',
    chooseModule: '📚 Pilih modul untuk berlatih!',
    findYourCefrLevel: 'Temukan level CEFR Anda',
    customisePracticeList: 'Sesuaikan Daftar Latihan',
  },
  it: {
    home: 'Home', practice: 'Pratica', progress: 'Progressi',
    settings: 'Impostazioni', profile: 'Profilo',
    start: 'Inizia', submit: 'Invia', next: 'Avanti', back: 'Indietro',
    save: 'Salva', cancel: 'Annulla', retry: 'Riprova', loading: 'Caricamento...',
    translationTrainer: 'Allenatore di traduzione', wordChunks: 'Gruppi di parole',
    listening: 'Ascolto', writing: 'Scrittura', grammarPractice: 'Esercizi di grammatica',
    grammarQuiz: 'Quiz di grammatica', vocabularyFlashcards: 'Schede di vocabolario',
    dailyChallenges: 'Sfide quotidiane', placementTest: 'Test di livello',
    classroom: 'Classe', vocabularyVault: 'Archivio vocaboli', businessEnglish: 'Inglese commerciale',
    accuracy: 'Precisione', streak: 'Serie', timeSpent: 'Tempo trascorso', score: 'Punteggio',
    nativeLanguage: 'Lingua madre', appLanguage: "Lingua dell'app", level: 'Livello',
    correct: 'Corretto', incorrect: 'Sbagliato', wellDone: 'Ben fatto!', tryAgain: 'Riprova',
    definition: 'Definizione', example: 'Esempio', saveToVault: 'Salva nell\'archivio',
    welcome: 'Benvenuto!', hi: 'Ciao',
    takePlacementTest: '⭐ Fai il Test di Livello per scoprire il tuo livello!',
    chooseModule: '📚 Scegli un modulo per esercitarti!',
    findYourCefrLevel: 'Trova il tuo livello QCER',
    customisePracticeList: 'Personalizza Lista Esercizi',
  },
  ja: {
    home: 'ホーム', practice: '練習', progress: '進捗',
    settings: '設定', profile: 'プロフィール',
    start: '開始', submit: '提出', next: '次へ', back: '戻る',
    save: '保存', cancel: 'キャンセル', retry: 'やり直し', loading: '読み込み中...',
    translationTrainer: '翻訳トレーナー', wordChunks: '語句グループ',
    listening: 'リスニング', writing: 'ライティング', grammarPractice: '文法練習',
    grammarQuiz: '文法クイズ', vocabularyFlashcards: '単語カード',
    dailyChallenges: 'デイリーチャレンジ', placementTest: 'レベルテスト',
    classroom: 'クラスルーム', vocabularyVault: '語彙ボールト', businessEnglish: 'ビジネス英語',
    accuracy: '正確さ', streak: '連続記録', timeSpent: '学習時間', score: 'スコア',
    nativeLanguage: '母国語', appLanguage: 'アプリの言語', level: 'レベル',
    correct: '正解', incorrect: '不正解', wellDone: 'よくできました！', tryAgain: 'やり直し',
    definition: '定義', example: '例文', saveToVault: 'ボールトに保存',
    welcome: 'ようこそ！', hi: 'こんにちは',
    takePlacementTest: '⭐ レベル判定テストを受けて、あなたのレベルを見つけよう！',
    chooseModule: '📚 練習するモジュールを選んでください！',
    findYourCefrLevel: 'CEFRレベルを見つけよう',
    customisePracticeList: '練習リストをカスタマイズ',
  },
  ko: {
    home: '홈', practice: '연습', progress: '진도',
    settings: '설정', profile: '프로필',
    start: '시작', submit: '제출', next: '다음', back: '뒤로',
    save: '저장', cancel: '취소', retry: '다시 시도', loading: '불러오는 중...',
    translationTrainer: '번역 트레이너', wordChunks: '단어 그룹',
    listening: '듣기', writing: '쓰기', grammarPractice: '문법 연습',
    grammarQuiz: '문법 퀴즈', vocabularyFlashcards: '단어 카드',
    dailyChallenges: '일일 도전', placementTest: '레벨 테스트',
    classroom: '교실', vocabularyVault: '단어 금고', businessEnglish: '비즈니스 영어',
    accuracy: '정확도', streak: '연속', timeSpent: '소요 시간', score: '점수',
    nativeLanguage: '모국어', appLanguage: '앱 언어', level: '레벨',
    correct: '정답', incorrect: '오답', wellDone: '잘했어요!', tryAgain: '다시 시도',
    definition: '정의', example: '예시', saveToVault: '금고에 저장',
    welcome: '환영합니다!', hi: '안녕하세요',
    takePlacementTest: '⭐ 레벨 테스트를 받고 당신의 레벨을 찾아보세요!',
    chooseModule: '📚 연습할 모듈을 선택하세요!',
    findYourCefrLevel: '당신의 CEFR 레벨을 찾아보세요',
    customisePracticeList: '연습 목록 사용자화',
  },
  ms: {
    home: 'Laman Utama', practice: 'Latihan', progress: 'Kemajuan',
    settings: 'Tetapan', profile: 'Profil',
    start: 'Mula', submit: 'Hantar', next: 'Seterusnya', back: 'Kembali',
    save: 'Simpan', cancel: 'Batal', retry: 'Cuba lagi', loading: 'Memuatkan...',
    translationTrainer: 'Jurulatih terjemahan', wordChunks: 'Kumpulan perkataan',
    listening: 'Mendengar', writing: 'Menulis', grammarPractice: 'Latihan tatabahasa',
    grammarQuiz: 'Kuiz tatabahasa', vocabularyFlashcards: 'Kad perbendaharaan kata',
    dailyChallenges: 'Cabaran harian', placementTest: 'Ujian penempatan',
    classroom: 'Bilik darjah', vocabularyVault: 'Peti perbendaharaan', businessEnglish: 'Bahasa Inggeris perniagaan',
    accuracy: 'Ketepatan', streak: 'Jujukan', timeSpent: 'Masa yang dihabiskan', score: 'Skor',
    nativeLanguage: 'Bahasa ibunda', appLanguage: 'Bahasa aplikasi', level: 'Tahap',
    correct: 'Betul', incorrect: 'Salah', wellDone: 'Bagus!', tryAgain: 'Cuba lagi',
    definition: 'Definisi', example: 'Contoh', saveToVault: 'Simpan ke peti',
    welcome: 'Selamat datang!', hi: 'Hai',
    takePlacementTest: '⭐ Ambil Ujian Penempatan untuk mencari tahap anda!',
    chooseModule: '📚 Pilih modul untuk berlatih!',
    findYourCefrLevel: 'Cari tahap CEFR anda',
    customisePracticeList: 'Sesuaikan Senarai Latihan',
  },
  zh: {
    home: '主页', practice: '练习', progress: '进度',
    settings: '设置', profile: '个人资料',
    start: '开始', submit: '提交', next: '下一步', back: '返回',
    save: '保存', cancel: '取消', retry: '重试', loading: '加载中...',
    translationTrainer: '翻译训练器', wordChunks: '词块练习',
    listening: '听力', writing: '写作', grammarPractice: '语法练习',
    grammarQuiz: '语法测验', vocabularyFlashcards: '词汇卡片',
    dailyChallenges: '每日挑战', placementTest: '分级测试',
    classroom: '课堂', vocabularyVault: '词汇库', businessEnglish: '商务英语',
    accuracy: '准确率', streak: '连续', timeSpent: '学习时间', score: '分数',
    nativeLanguage: '母语', appLanguage: '应用语言', level: '级别',
    correct: '正确', incorrect: '错误', wellDone: '做得好！', tryAgain: '重试',
    definition: '定义', example: '例句', saveToVault: '保存到词库',
    welcome: '欢迎！', hi: '你好',
    takePlacementTest: '⭐ 参加分级测试，找到您的级别！',
    chooseModule: '📚 选择一个模块开始练习！',
    findYourCefrLevel: '查找您的CEFR级别',
    customisePracticeList: '自定义练习列表',
  },
  mr: {
    home: 'मुख्यपृष्ठ', practice: 'सराव', progress: 'प्रगती',
    settings: 'सेटिंग्ज', profile: 'प्रोफाईल',
    start: 'सुरू करा', submit: 'सबमिट करा', next: 'पुढे', back: 'मागे',
    save: 'जतन करा', cancel: 'रद्द करा', retry: 'पुन्हा प्रयत्न', loading: 'लोड होत आहे...',
    translationTrainer: 'भाषांतर प्रशिक्षक', wordChunks: 'शब्द गट',
    listening: 'श्रवण', writing: 'लेखन', grammarPractice: 'व्याकरण सराव',
    grammarQuiz: 'व्याकरण प्रश्नमंजुषा', vocabularyFlashcards: 'शब्दसंग्रह कार्डे',
    dailyChallenges: 'दैनंदिन आव्हाने', placementTest: 'स्तर चाचणी',
    classroom: 'वर्गखोली', vocabularyVault: 'शब्दसंग्रह तिजोरी', businessEnglish: 'व्यावसायिक इंग्रजी',
    accuracy: 'अचूकता', streak: 'क्रम', timeSpent: 'घालवलेला वेळ', score: 'गुण',
    nativeLanguage: 'मातृभाषा', appLanguage: 'अॅप भाषा', level: 'स्तर',
    correct: 'बरोबर', incorrect: 'चुकीचे', wellDone: 'शाब्बास!', tryAgain: 'पुन्हा प्रयत्न',
    definition: 'व्याख्या', example: 'उदाहरण', saveToVault: 'तिजोरीत जतन करा',
    welcome: 'स्वागत आहे!', hi: 'नमस्कार',
    takePlacementTest: '⭐ तुमची पातळी जाणून घेण्यासाठी प्लेसमेंट टेस्ट द्या!',
    chooseModule: '📚 सरावासाठी मॉड्यूल निवडा!',
    findYourCefrLevel: 'तुमची CEFR पातळी शोधा',
    customisePracticeList: 'सराव यादी सानुकूल करा',
  },
  ne: {
    home: 'होम', practice: 'अभ्यास', progress: 'प्रगति',
    settings: 'सेटिङ्स', profile: 'प्रोफाइल',
    start: 'सुरु गर्नुहोस्', submit: 'पेश गर्नुहोस्', next: 'अर्को', back: 'पछाडि',
    save: 'सुरक्षित गर्नुहोस्', cancel: 'रद्द गर्नुहोस्', retry: 'फेरि प्रयास', loading: 'लोड हुँदैछ...',
    translationTrainer: 'अनुवाद प्रशिक्षक', wordChunks: 'शब्द समूह',
    listening: 'सुन्ने', writing: 'लेख्ने', grammarPractice: 'व्याकरण अभ्यास',
    grammarQuiz: 'व्याकरण प्रश्नोत्तर', vocabularyFlashcards: 'शब्दावली कार्डहरू',
    dailyChallenges: 'दैनिक चुनौतीहरू', placementTest: 'स्तर परीक्षण',
    classroom: 'कक्षाकोठा', vocabularyVault: 'शब्दावली भण्डार', businessEnglish: 'व्यापारिक अंग्रेजी',
    accuracy: 'सटीकता', streak: 'क्रम', timeSpent: 'बिताएको समय', score: 'स्कोर',
    nativeLanguage: 'मातृभाषा', appLanguage: 'एप भाषा', level: 'स्तर',
    correct: 'सही', incorrect: 'गलत', wellDone: 'सावाश!', tryAgain: 'फेरि प्रयास',
    definition: 'परिभाषा', example: 'उदाहरण', saveToVault: 'भण्डारमा सुरक्षित गर्नुहोस्',
    welcome: 'स्वागत छ!', hi: 'नमस्ते',
    takePlacementTest: '⭐ आफ्नो स्तर पत्ता लगाउन प्लेसमेन्ट टेस्ट दिनुहोस्!',
    chooseModule: '📚 अभ्यासका लागि मोड्युल छान्नुहोस्!',
    findYourCefrLevel: 'आफ्नो CEFR स्तर पत्ता लगाउनुहोस्',
    customisePracticeList: 'अभ्यास सूची अनुकूलन गर्नुहोस्',
  },
  no: {
    home: 'Hjem', practice: 'Øvelse', progress: 'Fremgang',
    settings: 'Innstillinger', profile: 'Profil',
    start: 'Start', submit: 'Send inn', next: 'Neste', back: 'Tilbake',
    save: 'Lagre', cancel: 'Avbryt', retry: 'Prøv igjen', loading: 'Laster...',
    translationTrainer: 'Oversettelsestrenер', wordChunks: 'Ordgrupper',
    listening: 'Lytting', writing: 'Skriving', grammarPractice: 'Grammatikkøvelse',
    grammarQuiz: 'Grammatikkquiz', vocabularyFlashcards: 'Ordforråd-kort',
    dailyChallenges: 'Daglige utfordringer', placementTest: 'Nivåtest',
    classroom: 'Klasserom', vocabularyVault: 'Ordforrådsbank', businessEnglish: 'Forretningsengelsk',
    accuracy: 'Nøyaktighet', streak: 'Serie', timeSpent: 'Tid brukt', score: 'Poeng',
    nativeLanguage: 'Morsmål', appLanguage: 'App-språk', level: 'Nivå',
    correct: 'Riktig', incorrect: 'Feil', wellDone: 'Bra jobbet!', tryAgain: 'Prøv igjen',
    definition: 'Definisjon', example: 'Eksempel', saveToVault: 'Lagre i bank',
    welcome: 'Velkommen!', hi: 'Hei',
    takePlacementTest: '⭐ Ta nivåtesten for å finne nivået ditt!',
    chooseModule: '📚 Velg en modul å øve på!',
    findYourCefrLevel: 'Finn ditt CEFR-nivå',
    customisePracticeList: 'Tilpass øvelseslisten',
  },
  fa: {
    home: 'خانه', practice: 'تمرین', progress: 'پیشرفت',
    settings: 'تنظیمات', profile: 'پروفایل',
    start: 'شروع', submit: 'ارسال', next: 'بعدی', back: 'برگشت',
    save: 'ذخیره', cancel: 'لغو', retry: 'تلاش مجدد', loading: 'در حال بارگذاری...',
    translationTrainer: 'مربی ترجمه', wordChunks: 'گروه‌های کلمات',
    listening: 'گوش دادن', writing: 'نوشتن', grammarPractice: 'تمرین دستور زبان',
    grammarQuiz: 'آزمون دستور زبان', vocabularyFlashcards: 'کارت‌های واژگان',
    dailyChallenges: 'چالش‌های روزانه', placementTest: 'آزمون سطح‌بندی',
    classroom: 'کلاس درس', vocabularyVault: 'خزانه واژگان', businessEnglish: 'انگلیسی تجاری',
    accuracy: 'دقت', streak: 'رشته', timeSpent: 'زمان صرف شده', score: 'امتیاز',
    nativeLanguage: 'زبان مادری', appLanguage: 'زبان برنامه', level: 'سطح',
    correct: 'درست', incorrect: 'غلط', wellDone: 'آفرین!', tryAgain: 'تلاش مجدد',
    definition: 'تعریف', example: 'مثال', saveToVault: 'ذخیره در خزانه',
    welcome: 'خوش آمدید!', hi: 'سلام',
    takePlacementTest: '⭐ آزمون تعیین سطح را بدهید تا سطح خود را پیدا کنید!',
    chooseModule: '📚 یک ماژول برای تمرین انتخاب کنید!',
    findYourCefrLevel: 'سطح CEFR خود را پیدا کنید',
    customisePracticeList: 'سفارشی‌سازی فهرست تمرین',
  },
  pl: {
    home: 'Strona główna', practice: 'Ćwiczenia', progress: 'Postępy',
    settings: 'Ustawienia', profile: 'Profil',
    start: 'Rozpocznij', submit: 'Wyślij', next: 'Dalej', back: 'Wstecz',
    save: 'Zapisz', cancel: 'Anuluj', retry: 'Spróbuj ponownie', loading: 'Ładowanie...',
    translationTrainer: 'Trener tłumaczenia', wordChunks: 'Grupy słów',
    listening: 'Słuchanie', writing: 'Pisanie', grammarPractice: 'Ćwiczenia gramatyczne',
    grammarQuiz: 'Quiz gramatyczny', vocabularyFlashcards: 'Fiszki ze słownictwem',
    dailyChallenges: 'Codzienne wyzwania', placementTest: 'Test poziomujący',
    classroom: 'Klasa', vocabularyVault: 'Skarbiec słownictwa', businessEnglish: 'Angielski biznesowy',
    accuracy: 'Dokładność', streak: 'Seria', timeSpent: 'Czas nauki', score: 'Wynik',
    nativeLanguage: 'Język ojczysty', appLanguage: 'Język aplikacji', level: 'Poziom',
    correct: 'Poprawnie', incorrect: 'Niepoprawnie', wellDone: 'Świetnie!', tryAgain: 'Spróbuj ponownie',
    definition: 'Definicja', example: 'Przykład', saveToVault: 'Zapisz do skarbca',
    welcome: 'Witamy!', hi: 'Cześć',
    takePlacementTest: '⭐ Zrób Test Poziomujący, aby poznać swój poziom!',
    chooseModule: '📚 Wybierz moduł do ćwiczeń!',
    findYourCefrLevel: 'Sprawdź swój poziom CEFR',
    customisePracticeList: 'Dostosuj Listę Ćwiczeń',
  },
  pt: {
    home: 'Início', practice: 'Praticar', progress: 'Progresso',
    settings: 'Configurações', profile: 'Perfil',
    start: 'Começar', submit: 'Enviar', next: 'Próximo', back: 'Voltar',
    save: 'Salvar', cancel: 'Cancelar', retry: 'Tentar novamente', loading: 'Carregando...',
    translationTrainer: 'Treinador de tradução', wordChunks: 'Grupos de palavras',
    listening: 'Escuta', writing: 'Escrita', grammarPractice: 'Prática de gramática',
    grammarQuiz: 'Quiz de gramática', vocabularyFlashcards: 'Cartões de vocabulário',
    dailyChallenges: 'Desafios diários', placementTest: 'Teste de nivelamento',
    classroom: 'Sala de aula', vocabularyVault: 'Cofre de vocabulário', businessEnglish: 'Inglês para negócios',
    accuracy: 'Precisão', streak: 'Sequência', timeSpent: 'Tempo gasto', score: 'Pontuação',
    nativeLanguage: 'Língua nativa', appLanguage: 'Idioma do app', level: 'Nível',
    correct: 'Correto', incorrect: 'Incorreto', wellDone: 'Muito bem!', tryAgain: 'Tentar novamente',
    definition: 'Definição', example: 'Exemplo', saveToVault: 'Salvar no cofre',
    welcome: 'Bem-vindo!', hi: 'Olá',
    takePlacementTest: '⭐ Faça o Teste de Nivelamento para encontrar seu nível!',
    chooseModule: '📚 Escolha um módulo para praticar!',
    findYourCefrLevel: 'Encontre seu nível CEFR',
    customisePracticeList: 'Personalizar Lista de Prática',
  },
  pa: {
    home: 'ਹੋਮ', practice: 'ਅਭਿਆਸ', progress: 'ਤਰੱਕੀ',
    settings: 'ਸੈਟਿੰਗਾਂ', profile: 'ਪ੍ਰੋਫਾਈਲ',
    start: 'ਸ਼ੁਰੂ ਕਰੋ', submit: 'ਜਮ੍ਹਾਂ ਕਰੋ', next: 'ਅਗਲਾ', back: 'ਵਾਪਸ',
    save: 'ਸੇਵ ਕਰੋ', cancel: 'ਰੱਦ ਕਰੋ', retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼', loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    translationTrainer: 'ਅਨੁਵਾਦ ਟ੍ਰੇਨਰ', wordChunks: 'ਸ਼ਬਦ ਸਮੂਹ',
    listening: 'ਸੁਣਨਾ', writing: 'ਲਿਖਣਾ', grammarPractice: 'ਵਿਆਕਰਣ ਅਭਿਆਸ',
    grammarQuiz: 'ਵਿਆਕਰਣ ਕੁਇਜ਼', vocabularyFlashcards: 'ਸ਼ਬਦਾਵਲੀ ਕਾਰਡ',
    dailyChallenges: 'ਰੋਜ਼ਾਨਾ ਚੁਣੌਤੀਆਂ', placementTest: 'ਪੱਧਰ ਟੈਸਟ',
    classroom: 'ਕਲਾਸਰੂਮ', vocabularyVault: 'ਸ਼ਬਦਾਵਲੀ ਖਜ਼ਾਨਾ', businessEnglish: 'ਵਪਾਰਕ ਅੰਗਰੇਜ਼ੀ',
    accuracy: 'ਸ਼ੁੱਧਤਾ', streak: 'ਲੜੀ', timeSpent: 'ਬਿਤਾਇਆ ਸਮਾਂ', score: 'ਸਕੋਰ',
    nativeLanguage: 'ਮਾਤ ਭਾਸ਼ਾ', appLanguage: 'ਐਪ ਭਾਸ਼ਾ', level: 'ਪੱਧਰ',
    correct: 'ਸਹੀ', incorrect: 'ਗਲਤ', wellDone: 'ਸ਼ਾਬਾਸ਼!', tryAgain: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼',
    definition: 'ਪਰਿਭਾਸ਼ਾ', example: 'ਉਦਾਹਰਣ', saveToVault: 'ਖਜ਼ਾਨੇ ਵਿੱਚ ਸੇਵ ਕਰੋ',
    welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ!', hi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
    takePlacementTest: '⭐ ਆਪਣਾ ਪੱਧਰ ਜਾਣਨ ਲਈ ਪਲੇਸਮੈਂਟ ਟੈਸਟ ਦਿਓ!',
    chooseModule: '📚 ਅਭਿਆਸ ਲਈ ਮਾਡਿਊਲ ਚੁਣੋ!',
    findYourCefrLevel: 'ਆਪਣਾ CEFR ਪੱਧਰ ਲੱਭੋ',
    customisePracticeList: 'ਅਭਿਆਸ ਸੂਚੀ ਅਨੁਕੂਲਿਤ ਕਰੋ',
  },
  ro: {
    home: 'Acasă', practice: 'Practică', progress: 'Progres',
    settings: 'Setări', profile: 'Profil',
    start: 'Start', submit: 'Trimite', next: 'Următor', back: 'Înapoi',
    save: 'Salvează', cancel: 'Anulează', retry: 'Încearcă din nou', loading: 'Se încarcă...',
    translationTrainer: 'Antrenor de traducere', wordChunks: 'Grupuri de cuvinte',
    listening: 'Ascultare', writing: 'Scriere', grammarPractice: 'Exerciții de gramatică',
    grammarQuiz: 'Test de gramatică', vocabularyFlashcards: 'Fișe de vocabular',
    dailyChallenges: 'Provocări zilnice', placementTest: 'Test de nivel',
    classroom: 'Clasă', vocabularyVault: 'Tezaurul de vocabular', businessEnglish: 'Engleză de afaceri',
    accuracy: 'Precizie', streak: 'Serie', timeSpent: 'Timp petrecut', score: 'Scor',
    nativeLanguage: 'Limbă maternă', appLanguage: 'Limba aplicației', level: 'Nivel',
    correct: 'Corect', incorrect: 'Incorect', wellDone: 'Bine făcut!', tryAgain: 'Încearcă din nou',
    definition: 'Definiție', example: 'Exemplu', saveToVault: 'Salvează în tezaur',
    welcome: 'Bun venit!', hi: 'Salut',
    takePlacementTest: '⭐ Susține Testul de Plasare pentru a-ți afla nivelul!',
    chooseModule: '📚 Alege un modul pentru a exersa!',
    findYourCefrLevel: 'Află nivelul tău CEFR',
    customisePracticeList: 'Personalizează Lista de Exerciții',
  },
  ru: {
    home: 'Главная', practice: 'Практика', progress: 'Прогресс',
    settings: 'Настройки', profile: 'Профиль',
    start: 'Начать', submit: 'Отправить', next: 'Далее', back: 'Назад',
    save: 'Сохранить', cancel: 'Отмена', retry: 'Повторить', loading: 'Загрузка...',
    translationTrainer: 'Тренажёр перевода', wordChunks: 'Словосочетания',
    listening: 'Аудирование', writing: 'Письмо', grammarPractice: 'Грамматические упражнения',
    grammarQuiz: 'Тест по грамматике', vocabularyFlashcards: 'Карточки слов',
    dailyChallenges: 'Ежедневные задания', placementTest: 'Тест на уровень',
    classroom: 'Класс', vocabularyVault: 'Хранилище слов', businessEnglish: 'Деловой английский',
    accuracy: 'Точность', streak: 'Серия', timeSpent: 'Затраченное время', score: 'Счёт',
    nativeLanguage: 'Родной язык', appLanguage: 'Язык приложения', level: 'Уровень',
    correct: 'Верно', incorrect: 'Неверно', wellDone: 'Отлично!', tryAgain: 'Повторить',
    definition: 'Определение', example: 'Пример', saveToVault: 'Сохранить в хранилище',
    welcome: 'Добро пожаловать!', hi: 'Привет',
    takePlacementTest: '⭐ Пройдите тест уровня, чтобы узнать свой уровень!',
    chooseModule: '📚 Выберите модуль для практики!',
    findYourCefrLevel: 'Узнайте свой уровень CEFR',
    customisePracticeList: 'Настроить список практики',
  },
  si: {
    home: 'මුල් පිටුව', practice: 'පුහුණුව', progress: 'ප්‍රගතිය',
    settings: 'සැකසුම්', profile: 'පැතිකඩ',
    start: 'ආරම්භ කරන්න', submit: 'ඉදිරිපත් කරන්න', next: 'ඊළඟ', back: 'ආපසු',
    save: 'සුරකින්න', cancel: 'අවලංගු කරන්න', retry: 'නැවත උත්සාහ', loading: 'පූරණය වෙමින්...',
    translationTrainer: 'පරිවර්තන පුහුණුකරු', wordChunks: 'වචන කණ්ඩායම්',
    listening: 'සවන්දීම', writing: 'ලිවීම', grammarPractice: 'ව්‍යාකරණ පුහුණුව',
    grammarQuiz: 'ව්‍යාකරණ ප්‍රශ්නාවලිය', vocabularyFlashcards: 'වචන කාඩ්',
    dailyChallenges: 'දෛනික අභියෝග', placementTest: 'මට්ටම් පරීක්ෂාව',
    classroom: 'පන්ති කාමරය', vocabularyVault: 'වචන භාණ්ඩාගාරය', businessEnglish: 'ව්‍යාපාරික ඉංග්‍රීසි',
    accuracy: 'නිරවද්‍යතාව', streak: 'දාමය', timeSpent: 'ගත කළ කාලය', score: 'ලකුණු',
    nativeLanguage: 'මව් භාෂාව', appLanguage: 'යෙදුමේ භාෂාව', level: 'මට්ටම',
    correct: 'නිවැරදි', incorrect: 'වැරදි', wellDone: 'සාධු!', tryAgain: 'නැවත උත්සාහ',
    definition: 'නිර්වචනය', example: 'උදාහරණය', saveToVault: 'භාණ්ඩාගාරයේ සුරකින්න',
    welcome: 'සාදරයෙන් පිළිගනිමු!', hi: 'ආයුබෝවන්',
    takePlacementTest: '⭐ ඔබේ මට්ටම සොයා ගැනීමට මට්ටම් පරීක්ෂණය කරන්න!',
    chooseModule: '📚 අභ්‍යාසය සඳහා මොඩියුලයක් තෝරන්න!',
    findYourCefrLevel: 'ඔබේ CEFR මට්ටම සොයන්න',
    customisePracticeList: 'අභ්‍යාස ලැයිස්තුව අභිරුචිකරණය කරන්න',
  },
  es: {
    home: 'Inicio', practice: 'Practicar', progress: 'Progreso',
    settings: 'Ajustes', profile: 'Perfil',
    start: 'Empezar', submit: 'Enviar', next: 'Siguiente', back: 'Volver',
    save: 'Guardar', cancel: 'Cancelar', retry: 'Reintentar', loading: 'Cargando...',
    translationTrainer: 'Entrenador de traducción', wordChunks: 'Grupos de palabras',
    listening: 'Escucha', writing: 'Escritura', grammarPractice: 'Práctica de gramática',
    grammarQuiz: 'Quiz de gramática', vocabularyFlashcards: 'Tarjetas de vocabulario',
    dailyChallenges: 'Retos diarios', placementTest: 'Prueba de nivel',
    classroom: 'Aula', vocabularyVault: 'Bóveda de vocabulario', businessEnglish: 'Inglés de negocios',
    accuracy: 'Precisión', streak: 'Racha', timeSpent: 'Tiempo dedicado', score: 'Puntuación',
    nativeLanguage: 'Lengua nativa', appLanguage: 'Idioma de la app', level: 'Nivel',
    correct: 'Correcto', incorrect: 'Incorrecto', wellDone: '¡Bien hecho!', tryAgain: 'Reintentar',
    definition: 'Definición', example: 'Ejemplo', saveToVault: 'Guardar en bóveda',
    welcome: '¡Bienvenido!', hi: 'Hola',
    takePlacementTest: '⭐ ¡Haz la Prueba de Nivel para descubrir tu nivel!',
    chooseModule: '📚 ¡Elige un módulo para practicar!',
    findYourCefrLevel: 'Encuentra tu nivel CEFR',
    customisePracticeList: 'Personalizar Lista de Práctica',
  },
  sw: {
    home: 'Nyumbani', practice: 'Mazoezi', progress: 'Maendeleo',
    settings: 'Mipangilio', profile: 'Wasifu',
    start: 'Anza', submit: 'Wasilisha', next: 'Inayofuata', back: 'Rudi',
    save: 'Hifadhi', cancel: 'Ghairi', retry: 'Jaribu tena', loading: 'Inapakia...',
    translationTrainer: 'Mkufunzi wa tafsiri', wordChunks: 'Makundi ya maneno',
    listening: 'Kusikiliza', writing: 'Kuandika', grammarPractice: 'Mazoezi ya sarufi',
    grammarQuiz: 'Jaribio la sarufi', vocabularyFlashcards: 'Kadi za msamiati',
    dailyChallenges: 'Changamoto za kila siku', placementTest: 'Mtihani wa kiwango',
    classroom: 'Darasa', vocabularyVault: 'Hazina ya msamiati', businessEnglish: 'Kiingereza cha biashara',
    accuracy: 'Usahihi', streak: 'Mfululizo', timeSpent: 'Muda uliotumika', score: 'Alama',
    nativeLanguage: 'Lugha ya mama', appLanguage: 'Lugha ya programu', level: 'Kiwango',
    correct: 'Sahihi', incorrect: 'Kosa', wellDone: 'Hongera!', tryAgain: 'Jaribu tena',
    definition: 'Maana', example: 'Mfano', saveToVault: 'Hifadhi kwenye hazina',
    welcome: 'Karibu!', hi: 'Hujambo',
    takePlacementTest: '⭐ Fanya Mtihani wa Kupanga ili kupata kiwango chako!',
    chooseModule: '📚 Chagua moduli kwa ajili ya mazoezi!',
    findYourCefrLevel: 'Pata kiwango chako cha CEFR',
    customisePracticeList: 'Sanidi Orodha ya Mazoezi',
  },
  sv: {
    home: 'Hem', practice: 'Övning', progress: 'Framsteg',
    settings: 'Inställningar', profile: 'Profil',
    start: 'Starta', submit: 'Skicka', next: 'Nästa', back: 'Tillbaka',
    save: 'Spara', cancel: 'Avbryt', retry: 'Försök igen', loading: 'Laddar...',
    translationTrainer: 'Översättningsövning', wordChunks: 'Ordgrupper',
    listening: 'Lyssning', writing: 'Skrivning', grammarPractice: 'Grammatikövning',
    grammarQuiz: 'Grammatikquiz', vocabularyFlashcards: 'Ordkort',
    dailyChallenges: 'Dagliga utmaningar', placementTest: 'Nivåtest',
    classroom: 'Klassrum', vocabularyVault: 'Ordförrådsvalv', businessEnglish: 'Affärsengelska',
    accuracy: 'Noggrannhet', streak: 'Serie', timeSpent: 'Tid spenderad', score: 'Poäng',
    nativeLanguage: 'Modersmål', appLanguage: 'Appspråk', level: 'Nivå',
    correct: 'Rätt', incorrect: 'Fel', wellDone: 'Bra jobbat!', tryAgain: 'Försök igen',
    definition: 'Definition', example: 'Exempel', saveToVault: 'Spara i valvet',
    welcome: 'Välkommen!', hi: 'Hej',
    takePlacementTest: '⭐ Gör Nivåtestet för att hitta din nivå!',
    chooseModule: '📚 Välj en modul att öva på!',
    findYourCefrLevel: 'Hitta din CEFR-nivå',
    customisePracticeList: 'Anpassa Övningslistan',
  },
  ta: {
    home: 'முகப்பு', practice: 'பயிற்சி', progress: 'முன்னேற்றம்',
    settings: 'அமைப்புகள்', profile: 'சுயவிவரம்',
    start: 'தொடங்கு', submit: 'சமர்ப்பி', next: 'அடுத்து', back: 'பின்னால்',
    save: 'சேமி', cancel: 'ரத்து', retry: 'மீண்டும் முயற்சி', loading: 'ஏற்றுகிறது...',
    translationTrainer: 'மொழிபெயர்ப்பு பயிற்சியாளர்', wordChunks: 'சொல் குழுக்கள்',
    listening: 'கேட்டல்', writing: 'எழுதல்', grammarPractice: 'இலக்கண பயிற்சி',
    grammarQuiz: 'இலக்கண வினாடி வினா', vocabularyFlashcards: 'சொல்வளம் அட்டைகள்',
    dailyChallenges: 'தினசரி சவால்கள்', placementTest: 'நிலை சோதனை',
    classroom: 'வகுப்பறை', vocabularyVault: 'சொல்வளம் கிடங்கு', businessEnglish: 'வணிக ஆங்கிலம்',
    accuracy: 'துல்லியம்', streak: 'தொடர்', timeSpent: 'செலவிட்ட நேரம்', score: 'மதிப்பெண்',
    nativeLanguage: 'தாய்மொழி', appLanguage: 'பயன்பாட்டு மொழி', level: 'நிலை',
    correct: 'சரி', incorrect: 'தவறு', wellDone: 'சாபாஷ்!', tryAgain: 'மீண்டும் முயற்சி',
    definition: 'வரையறை', example: 'எடுத்துக்காட்டு', saveToVault: 'கிடங்கில் சேமி',
    welcome: 'வரவேற்கிறோம்!', hi: 'வணக்கம்',
    takePlacementTest: '⭐ உங்கள் நிலையை அறிய வகுப்பு நிலை தேர்வை எடுக்கவும்!',
    chooseModule: '📚 பயிற்சிக்கு ஒரு தொகுதியைத் தேர்ந்தெடுக்கவும்!',
    findYourCefrLevel: 'உங்கள் CEFR நிலையைக் கண்டறியவும்',
    customisePracticeList: 'பயிற்சி பட்டியலைத் தனிப்பயனாக்கவும்',
  },
  th: {
    home: 'หน้าหลัก', practice: 'ฝึกหัด', progress: 'ความคืบหน้า',
    settings: 'การตั้งค่า', profile: 'โปรไฟล์',
    start: 'เริ่มต้น', submit: 'ส่ง', next: 'ถัดไป', back: 'ย้อนกลับ',
    save: 'บันทึก', cancel: 'ยกเลิก', retry: 'ลองอีกครั้ง', loading: 'กำลังโหลด...',
    translationTrainer: 'โปรแกรมฝึกแปล', wordChunks: 'กลุ่มคำ',
    listening: 'การฟัง', writing: 'การเขียน', grammarPractice: 'ฝึกไวยากรณ์',
    grammarQuiz: 'ทดสอบไวยากรณ์', vocabularyFlashcards: 'บัตรคำศัพท์',
    dailyChallenges: 'ความท้าทายรายวัน', placementTest: 'ทดสอบระดับ',
    classroom: 'ห้องเรียน', vocabularyVault: 'คลังคำศัพท์', businessEnglish: 'ภาษาอังกฤษธุรกิจ',
    accuracy: 'ความแม่นยำ', streak: 'ต่อเนื่อง', timeSpent: 'เวลาที่ใช้', score: 'คะแนน',
    nativeLanguage: 'ภาษาแม่', appLanguage: 'ภาษาของแอป', level: 'ระดับ',
    correct: 'ถูกต้อง', incorrect: 'ผิด', wellDone: 'เก่งมาก!', tryAgain: 'ลองอีกครั้ง',
    definition: 'คำนิยาม', example: 'ตัวอย่าง', saveToVault: 'บันทึกลงคลัง',
    welcome: 'ยินดีต้อนรับ!', hi: 'สวัสดี',
    takePlacementTest: '⭐ ทำแบบทดสอบวัดระดับเพื่อค้นหาระดับของคุณ!',
    chooseModule: '📚 เลือกโมดูลเพื่อฝึกฝน!',
    findYourCefrLevel: 'ค้นหาระดับ CEFR ของคุณ',
    customisePracticeList: 'ปรับแต่งรายการฝึก',
  },
  tr: {
    home: 'Ana Sayfa', practice: 'Alıştırma', progress: 'İlerleme',
    settings: 'Ayarlar', profile: 'Profil',
    start: 'Başla', submit: 'Gönder', next: 'İleri', back: 'Geri',
    save: 'Kaydet', cancel: 'İptal', retry: 'Tekrar dene', loading: 'Yükleniyor...',
    translationTrainer: 'Çeviri antrenörü', wordChunks: 'Kelime grupları',
    listening: 'Dinleme', writing: 'Yazma', grammarPractice: 'Dilbilgisi alıştırması',
    grammarQuiz: 'Dilbilgisi sınavı', vocabularyFlashcards: 'Kelime kartları',
    dailyChallenges: 'Günlük görevler', placementTest: 'Seviye testi',
    classroom: 'Sınıf', vocabularyVault: 'Kelime kasası', businessEnglish: 'İş İngilizcesi',
    accuracy: 'Doğruluk', streak: 'Seri', timeSpent: 'Harcanan süre', score: 'Puan',
    nativeLanguage: 'Anadil', appLanguage: 'Uygulama dili', level: 'Seviye',
    correct: 'Doğru', incorrect: 'Yanlış', wellDone: 'Aferin!', tryAgain: 'Tekrar dene',
    definition: 'Tanım', example: 'Örnek', saveToVault: 'Kasaya kaydet',
    welcome: 'Hoş geldiniz!', hi: 'Merhaba',
    takePlacementTest: '⭐ Seviyenizi öğrenmek için Seviye Tespit Sınavına girin!',
    chooseModule: '📚 Alıştırma yapmak için bir modül seçin!',
    findYourCefrLevel: 'CEFR seviyenizi öğrenin',
    customisePracticeList: 'Alıştırma Listesini Özelleştir',
  },
  uk: {
    home: 'Головна', practice: 'Практика', progress: 'Прогрес',
    settings: 'Налаштування', profile: 'Профіль',
    start: 'Почати', submit: 'Надіслати', next: 'Далі', back: 'Назад',
    save: 'Зберегти', cancel: 'Скасувати', retry: 'Повторити', loading: 'Завантаження...',
    translationTrainer: 'Тренажер перекладу', wordChunks: 'Словосполучення',
    listening: 'Аудіювання', writing: 'Письмо', grammarPractice: 'Граматичні вправи',
    grammarQuiz: 'Тест з граматики', vocabularyFlashcards: 'Картки слів',
    dailyChallenges: 'Щоденні завдання', placementTest: 'Тест на рівень',
    classroom: 'Клас', vocabularyVault: 'Сховище слів', businessEnglish: 'Ділова англійська',
    accuracy: 'Точність', streak: 'Серія', timeSpent: 'Витрачений час', score: 'Рахунок',
    nativeLanguage: 'Рідна мова', appLanguage: 'Мова програми', level: 'Рівень',
    correct: 'Правильно', incorrect: 'Неправильно', wellDone: 'Чудово!', tryAgain: 'Повторити',
    definition: 'Визначення', example: 'Приклад', saveToVault: 'Зберегти у сховище',
    welcome: 'Ласкаво просимо!', hi: 'Привіт',
    takePlacementTest: '⭐ Пройдіть тест рівня, щоб визначити свій рівень!',
    chooseModule: '📚 Виберіть модуль для практики!',
    findYourCefrLevel: 'Дізнайтеся свій рівень CEFR',
    customisePracticeList: 'Налаштувати список практики',
  },
  ur: {
    home: 'ہوم', practice: 'مشق', progress: 'پیشرفت',
    settings: 'ترتیبات', profile: 'پروفائل',
    start: 'شروع کریں', submit: 'جمع کریں', next: 'اگلا', back: 'واپس',
    save: 'محفوظ کریں', cancel: 'منسوخ', retry: 'دوبارہ کوشش', loading: 'لوڈ ہو رہا ہے...',
    translationTrainer: 'ترجمہ ٹرینر', wordChunks: 'لفظی گروپس',
    listening: 'سننا', writing: 'لکھنا', grammarPractice: 'گرامر مشق',
    grammarQuiz: 'گرامر کوئز', vocabularyFlashcards: 'ذخیرہ الفاظ کارڈ',
    dailyChallenges: 'روزانہ چیلنجز', placementTest: 'سطح امتحان',
    classroom: 'کلاس روم', vocabularyVault: 'ذخیرہ الفاظ والٹ', businessEnglish: 'کاروباری انگریزی',
    accuracy: 'درستگی', streak: 'سلسلہ', timeSpent: 'گزارا وقت', score: 'سکور',
    nativeLanguage: 'مادری زبان', appLanguage: 'ایپ زبان', level: 'سطح',
    correct: 'درست', incorrect: 'غلط', wellDone: 'شاباش!', tryAgain: 'دوبارہ کوشش',
    definition: 'تعریف', example: 'مثال', saveToVault: 'والٹ میں محفوظ کریں',
    welcome: 'خوش آمدید!', hi: 'سلام',
    takePlacementTest: '⭐ اپنی سطح جاننے کے لیے پلیسمنٹ ٹیسٹ لیں!',
    chooseModule: '📚 مشق کے لیے ماڈیول منتخب کریں!',
    findYourCefrLevel: 'اپنی CEFR سطح تلاش کریں',
    customisePracticeList: 'مشق کی فہرست کو ذاتی بنائیں',
  },
  vi: {
    home: 'Trang chủ', practice: 'Luyện tập', progress: 'Tiến độ',
    settings: 'Cài đặt', profile: 'Hồ sơ',
    start: 'Bắt đầu', submit: 'Gửi', next: 'Tiếp theo', back: 'Quay lại',
    save: 'Lưu', cancel: 'Hủy', retry: 'Thử lại', loading: 'Đang tải...',
    translationTrainer: 'Trình luyện dịch', wordChunks: 'Nhóm từ',
    listening: 'Nghe', writing: 'Viết', grammarPractice: 'Luyện ngữ pháp',
    grammarQuiz: 'Kiểm tra ngữ pháp', vocabularyFlashcards: 'Thẻ từ vựng',
    dailyChallenges: 'Thách thức hằng ngày', placementTest: 'Kiểm tra trình độ',
    classroom: 'Lớp học', vocabularyVault: 'Kho từ vựng', businessEnglish: 'Tiếng Anh thương mại',
    accuracy: 'Độ chính xác', streak: 'Chuỗi', timeSpent: 'Thời gian học', score: 'Điểm số',
    nativeLanguage: 'Ngôn ngữ mẹ đẻ', appLanguage: 'Ngôn ngữ ứng dụng', level: 'Cấp độ',
    correct: 'Đúng', incorrect: 'Sai', wellDone: 'Làm tốt lắm!', tryAgain: 'Thử lại',
    definition: 'Định nghĩa', example: 'Ví dụ', saveToVault: 'Lưu vào kho',
    welcome: 'Chào mừng!', hi: 'Xin chào',
    takePlacementTest: '⭐ Làm Bài kiểm tra trình độ để tìm cấp độ của bạn!',
    chooseModule: '📚 Chọn một mô-đun để luyện tập!',
    findYourCefrLevel: 'Tìm cấp độ CEFR của bạn',
    customisePracticeList: 'Tùy chỉnh Danh sách luyện tập',
  },
  yo: {
    home: 'Ile', practice: 'Adaṣe', progress: 'Ilọsiwaju',
    settings: 'Eto', profile: 'Profaili',
    start: 'Bẹrẹ', submit: 'Fi ranṣẹ', next: 'Tẹle', back: 'Pada',
    save: 'Fipamọ', cancel: 'Fagilee', retry: 'Gbiyanju lẹẹkan si', loading: 'N gba...',
    translationTrainer: 'Olukọni itumọ', wordChunks: 'Ẹgbẹ ọrọ',
    listening: 'Gbigbọ', writing: 'Kikọ', grammarPractice: 'Adaṣe gírámà',
    grammarQuiz: 'Idanwò gírámà', vocabularyFlashcards: 'Kaadi ọrọ-ọrọ',
    dailyChallenges: 'Awọn italaya ojoojumọ', placementTest: 'Idanwò ipele',
    classroom: 'Yara ikawe', vocabularyVault: 'Ile-iṣura ọrọ', businessEnglish: 'Gẹ̀ẹ́sì iṣowo',
    accuracy: 'Ìdánilójú', streak: 'Àtẹlé', timeSpent: 'Àkókò tí a lò', score: 'Àmì',
    nativeLanguage: 'Èdè ìbí', appLanguage: 'Èdè app', level: 'Ìpele',
    correct: 'Tọ', incorrect: 'Àṣìṣe', wellDone: 'Ó dára!', tryAgain: 'Gbiyanju lẹẹkan si',
    definition: 'Ìtumọ̀', example: 'Àpẹẹrẹ', saveToVault: 'Fi pamọ si ile-iṣura',
    welcome: 'Káàbọ̀!', hi: 'Báwo',
    takePlacementTest: '⭐ Ṣe Ìdánwò Ìpele láti rí ìpele rẹ!',
    chooseModule: '📚 Yan modul kan láti ṣe àdánwò!',
    findYourCefrLevel: 'Rí ìpele CEFR rẹ',
    customisePracticeList: 'Ṣàtúnṣe Àtòkọ Àdánwò',
  },
  zu: {
    home: 'Ikhaya', practice: 'Ukuphendula', progress: 'Inqubekela phambili',
    settings: 'Izilungiselelo', profile: 'Iphrofayela',
    start: 'Qala', submit: 'Thumela', next: 'Okulandelayo', back: 'Emuva',
    save: 'Gcina', cancel: 'Khansela', retry: 'Zama futhi', loading: 'Iyalayisha...',
    translationTrainer: 'Umqeqeshi wokuhumusha', wordChunks: 'Amaqoqo amagama',
    listening: 'Ukulalela', writing: 'Ukubhala', grammarPractice: 'Ukuzilolonga ngomeluleko',
    grammarQuiz: 'Ikhwizi yomeluleko', vocabularyFlashcards: 'Amakhadi amagama',
    dailyChallenges: 'Izinselele zansuku zonke', placementTest: 'Uhlelo lokubeka',
    classroom: 'Iklasi', vocabularyVault: 'Indawo yokugcina amagama', businessEnglish: 'IsiNgisi soshosholoza',
    accuracy: 'Ukulungelelana', streak: 'Ukuqhubeka', timeSpent: 'Isikhathi esichithiwe', score: 'Amanqamu',
    nativeLanguage: 'Ulimi lwasekhaya', appLanguage: 'Ulimi lohlelo lokusebenza', level: 'Izinga',
    correct: 'Kulungile', incorrect: 'Akukho lungile', wellDone: 'Wenze kahle!', tryAgain: 'Zama futhi',
    definition: 'Incazelo', example: 'Isibonelo', saveToVault: 'Gcina endaweni yokugcina',
    welcome: 'Sawubona!', hi: 'Sawubona',
    takePlacementTest: '⭐ Yenza uhlelo lokuhlola izinga ukuze uthole izinga lakho!',
    chooseModule: '📚 Khetha imodyuli yokuzilolonga!',
    findYourCefrLevel: 'Thola izinga lakho le-CEFR',
    customisePracticeList: 'Thuthukisa uhlu lokuzilolonga',
  },
  ps: {
    home: 'کور', practice: 'تمرین', progress: 'پرمختګ',
    settings: 'امستنې', profile: 'پروفایل',
    start: 'پيل', submit: 'واستوئ', next: 'بل', back: 'شاته',
    save: 'وساتئ', cancel: 'لغوه', retry: 'بیا هڅه', loading: 'بار کېږي...',
    translationTrainer: 'د ژباړې روزونکی', wordChunks: 'د کلمو ډلې',
    listening: 'اوریدل', writing: 'لیکل', grammarPractice: 'د ګرامر تمرین',
    grammarQuiz: 'د ګرامر ازموینه', vocabularyFlashcards: 'د لغتونو فلش کارتونه',
    dailyChallenges: 'ورځني ننګونې', placementTest: 'د کچې ازموینه',
    classroom: 'ټولګی', vocabularyVault: 'د لغتونو ساتنځای', businessEnglish: 'سوداګریز انګلیسي',
    accuracy: 'دقت', streak: 'لړۍ', timeSpent: 'مصرف شوی وخت', score: 'نمره',
    nativeLanguage: 'مورنۍ ژبه', appLanguage: 'د اپ ژبه', level: 'کچه',
    correct: 'سم', incorrect: 'ناسم', wellDone: 'ډېر ښه!', tryAgain: 'بیا هڅه وکړئ',
    definition: 'تعریف', example: 'بیلګه', saveToVault: 'په Vault کې وساتئ',
    welcome: 'ښه راغلاست!', hi: 'سلام',
    takePlacementTest: '⭐ د خپلې کچې موندلو لپاره د کچې ازموینه واخلئ!',
    chooseModule: '📚 د تمرین لپاره ماډل وټاکئ!',
    findYourCefrLevel: 'خپله د CEFR کچه ومومئ',
    customisePracticeList: 'د تمرین لیست شخصي کړئ',
  },
  te: {
    home: 'హోమ్', practice: 'అభ్యాసం', progress: 'పురోగతి',
    settings: 'సెట్టింగులు', profile: 'ప్రొఫైల్',
    start: 'ప్రారంభించు', submit: 'పంపు', next: 'తరువాత', back: 'వెనుకకు',
    save: 'సేవ్ చేయి', cancel: 'రద్దు', retry: 'మళ్లీ ప్రయత్నించు', loading: 'లోడ్ అవుతోంది...',
    translationTrainer: 'అనువాద శిక్షణ', wordChunks: 'పద సముదాయాలు',
    listening: 'వినడం', writing: 'రాయడం', grammarPractice: 'వ్యాకరణ అభ్యాసం',
    grammarQuiz: 'వ్యాకరణ క్విజ్', vocabularyFlashcards: 'పదజాల ఫ్లాష్‌కార్డులు',
    dailyChallenges: 'రోజువారీ సవాళ్లు', placementTest: 'ప్లేస్‌మెంట్ టెస్ట్',
    classroom: 'తరగతి గది', vocabularyVault: 'పదజాల వాల్ట్', businessEnglish: 'వ్యాపార ఆంగ్లం',
    accuracy: 'ఖచ్చితత్వం', streak: 'వరుస', timeSpent: 'గడిపిన సమయం', score: 'స్కోర్',
    nativeLanguage: 'మాతృభాష', appLanguage: 'యాప్ భాష', level: 'స్థాయి',
    correct: 'సరైనది', incorrect: 'తప్పు', wellDone: 'బాగా చేశారు!', tryAgain: 'మళ్లీ ప్రయత్నించు',
    definition: 'నిర్వచనం', example: 'ఉదాహరణ', saveToVault: 'వాల్ట్‌లో సేవ్ చేయి',
    welcome: 'స్వాగతం!', hi: 'హాయ్',
    takePlacementTest: '⭐ మీ స్థాయిని తెలుసుకోవడానికి ప్లేస్‌మెంట్ టెస్ట్ తీసుకోండి!',
    chooseModule: '📚 అభ్యాసం కోసం మాడ్యూల్‌ని ఎంచుకోండి!',
    findYourCefrLevel: 'మీ CEFR స్థాయిని కనుగొనండి',
    customisePracticeList: 'అభ్యాస జాబితాను అనుకూలీకరించండి',
  },
  qu: {
    home: 'Qallariy', practice: 'Yachay', progress: 'Puriy',
    settings: 'Churaykuna', profile: 'Perfil',
    start: 'Qallarisun', submit: 'Apachiy', next: 'Qatiq', back: 'Kutiy',
    save: 'Waqaychay', cancel: 'Saqiy', retry: 'Watiqmanta ruway', loading: 'Chaskichkan...',
    translationTrainer: 'Tikray Yachachiq', wordChunks: 'Simi Huñuy',
    listening: 'Uyariy', writing: 'Qillqay', grammarPractice: 'Gramática Yachay',
    grammarQuiz: 'Gramática Tapuy', vocabularyFlashcards: 'Simikuna Karta',
    dailyChallenges: 'Sapa Punchaw Pukllay', placementTest: 'Patarayki Tapuy',
    classroom: 'Yachay Wasi', vocabularyVault: 'Simikuna Vault', businessEnglish: 'Negocio Inglés',
    accuracy: 'Chiqaq', streak: 'Saruy', timeSpent: 'Pacha Ruwasqa', score: 'Chanin',
    nativeLanguage: 'Mama Simi', appLanguage: 'App Simi', level: 'Nivel',
    correct: 'Allin', incorrect: 'Mana allin', wellDone: 'Allin ruwasqa!', tryAgain: 'Watiqmanta ruway',
    definition: 'Sutichaq', example: 'Rikuchiq', saveToVault: 'Vault-pi waqaychay',
    welcome: 'Allin hamuy!', hi: 'Rimaykullayki',
    takePlacementTest: '⭐ Patarayki Tapuyta ruway nivelniykita yachayaspa!',
    chooseModule: '📚 Yachay módulota akllay!',
    findYourCefrLevel: 'CEFR niveliykita yachay',
    customisePracticeList: 'Yachay Listata Churay',
  },
  gn: {
    home: 'Óga', practice: 'Ñembo\'erã', progress: 'Aguahẽ',
    settings: 'Ñembosako\'i', profile: 'Perfil',
    start: 'Eñepyrũ', submit: 'Emondo', next: 'Upéicharõ', back: 'Jevy',
    save: 'Eñongatu', cancel: 'Embogue', retry: 'Eha\'arõ jey', loading: 'Oñemyatyrõ...',
    translationTrainer: 'Ñe\'ẽmbohasa Ñembo\'eha', wordChunks: 'Ñe\'ẽ Atýra',
    listening: 'Ñehendu', writing: 'Jehai', grammarPractice: 'Gramática Ñembo\'e',
    grammarQuiz: 'Gramática Porandu', vocabularyFlashcards: 'Ñe\'ẽndy Karta',
    dailyChallenges: 'Ára Ára Pukara', placementTest: 'Plasamiento Ha\'ã',
    classroom: 'Mbo\'ehao', vocabularyVault: 'Ñe\'ẽndy Vault', businessEnglish: 'Negocio Inglés',
    accuracy: 'Añetegua', streak: 'Ohóva', timeSpent: 'Ára ojeporúva', score: 'Puntuación',
    nativeLanguage: 'Ñe\'ẽ Ypy', appLanguage: 'App Ñe\'ẽ', level: 'Nivel',
    correct: 'Heẽ', incorrect: 'Nahániri', wellDone: 'Iporã!', tryAgain: 'Eha\'arõ jey',
    definition: 'Definición', example: 'Techapyrã', saveToVault: 'Eñongatu Vault-pe',
    welcome: 'Eg̃uahẽporãite!', hi: 'Mba\'éichapa',
    takePlacementTest: '⭐ Ejapo Plasamiento Ha\'ã eikuaa hag̃ua nde nivel!',
    chooseModule: '📚 Eiporavo módulo eñembo\'e hag̃ua!',
    findYourCefrLevel: 'Eikuaa nde CEFR nivel',
    customisePracticeList: 'Embosako\'i Ñembo\'e Listape',
  },
  ht: {
    home: 'Akèy', practice: 'Egzèsis', progress: 'Pwogrè',
    settings: 'Paramèt', profile: 'Pwofil',
    start: 'Kòmanse', submit: 'Voye', next: 'Pwochen', back: 'Retounen',
    save: 'Sove', cancel: 'Anile', retry: 'Eseye ankò', loading: 'Chaje...',
    translationTrainer: 'Antrene Tradiksyon', wordChunks: 'Gwoup Mo',
    listening: 'Koute', writing: 'Ekri', grammarPractice: 'Egzèsis Gramè',
    grammarQuiz: 'Quiz Gramè', vocabularyFlashcards: 'Flashcard Vokabilè',
    dailyChallenges: 'Defi Chak Jou', placementTest: 'Tès Plasman',
    classroom: 'Klas', vocabularyVault: 'Vault Vokabilè', businessEnglish: 'Angle Biznis',
    accuracy: 'Presizyon', streak: 'Seri', timeSpent: 'Tan Pase', score: 'Eskò',
    nativeLanguage: 'Lang Natif', appLanguage: 'Lang App', level: 'Nivo',
    correct: 'Kòrèk', incorrect: 'Pa kòrèk', wellDone: 'Byen fèt!', tryAgain: 'Eseye ankò',
    definition: 'Definisyon', example: 'Egzanp', saveToVault: 'Sove nan Vault',
    welcome: 'Byenvini!', hi: 'Bonjou',
    takePlacementTest: '⭐ Pran Tès Plasman an pou jwenn nivo ou!',
    chooseModule: '📚 Chwazi yon modil pou egzèsis!',
    findYourCefrLevel: 'Jwenn nivo CEFR ou',
    customisePracticeList: 'Personalize Lis Egzèsis',
  },
  fil: {
    home: 'Home', practice: 'Pagsasanay', progress: 'Pag-unlad',
    settings: 'Mga Setting', profile: 'Profile',
    start: 'Simulan', submit: 'Isumite', next: 'Susunod', back: 'Bumalik',
    save: 'I-save', cancel: 'Kanselahin', retry: 'Subukan muli', loading: 'Naglo-load...',
    translationTrainer: 'Tagasanay sa Pagsasalin', wordChunks: 'Mga Word Chunks',
    listening: 'Pakikinig', writing: 'Pagsulat', grammarPractice: 'Pagsasanay sa Gramatika',
    grammarQuiz: 'Quiz sa Gramatika', vocabularyFlashcards: 'Mga Flashcard ng Bokabularyo',
    dailyChallenges: 'Pang-araw-araw na Hamon', placementTest: 'Placement Test',
    classroom: 'Silid-aralan', vocabularyVault: 'Vault ng Bokabularyo', businessEnglish: 'Pang-negosyong Ingles',
    accuracy: 'Katumpakan', streak: 'Streak', timeSpent: 'Oras na Ginugol', score: 'Iskor',
    nativeLanguage: 'Katutubong Wika', appLanguage: 'Wika ng App', level: 'Antas',
    correct: 'Tama', incorrect: 'Mali', wellDone: 'Magaling!', tryAgain: 'Subukan muli',
    definition: 'Kahulugan', example: 'Halimbawa', saveToVault: 'I-save sa Vault',
    welcome: 'Maligayang pagdating!', hi: 'Kumusta',
    takePlacementTest: '⭐ Gawin ang Placement Test para malaman ang iyong antas!',
    chooseModule: '📚 Pumili ng modyul para magsanay!',
    findYourCefrLevel: 'Alamin ang iyong antas ng CEFR',
    customisePracticeList: 'I-customize ang Practice List',
  },
  sk: {
    home: 'Domov', practice: 'Cvičenie', progress: 'Pokrok',
    settings: 'Nastavenia', profile: 'Profil',
    start: 'Začať', submit: 'Odoslať', next: 'Ďalej', back: 'Späť',
    save: 'Uložiť', cancel: 'Zrušiť', retry: 'Skúsiť znova', loading: 'Načítava...',
    translationTrainer: 'Tréner prekladu', wordChunks: 'Slovné spojenia',
    listening: 'Počúvanie', writing: 'Písanie', grammarPractice: 'Cvičenie gramatiky',
    grammarQuiz: 'Kvíz z gramatiky', vocabularyFlashcards: 'Slovné kartičky',
    dailyChallenges: 'Denné výzvy', placementTest: 'Test úrovne',
    classroom: 'Trieda', vocabularyVault: 'Slovník', businessEnglish: 'Obchodná angličtina',
    accuracy: 'Presnosť', streak: 'Séria', timeSpent: 'Strávený čas', score: 'Skóre',
    nativeLanguage: 'Materinský jazyk', appLanguage: 'Jazyk aplikácie', level: 'Úroveň',
    correct: 'Správne', incorrect: 'Nesprávne', wellDone: 'Výborne!', tryAgain: 'Skúsiť znova',
    definition: 'Definícia', example: 'Príklad', saveToVault: 'Uložiť do slovníka',
    welcome: 'Vitajte!', hi: 'Ahoj',
    takePlacementTest: '⭐ Urobte si Test úrovne, aby ste zistili svoju úroveň!',
    chooseModule: '📚 Vyberte si modul na cvičenie!',
    findYourCefrLevel: 'Zistite svoju úroveň CEFR',
    customisePracticeList: 'Prispôsobiť zoznam cvičení',
  },
};

export default t;
