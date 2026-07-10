/**
 * POLY-PUFF - Translation Trainer Screen Translations
 * FILE: contexts/translationTrainerTranslations.ts
 *
 * UI strings for the Translation Trainer page (app/translation.tsx).
 * Add languages incrementally - any missing language falls back to English
 * via getTrainerT().
 *
 * Layout mirroring for RTL languages (ar, fa, he, ps, ur) is handled in
 * translation.tsx via isRtlLanguage() from utils/languages.ts.
 */

import type { LangCode } from './translations';

export interface TrainerStrings {
  // Header
  toEnglish: string;                    // "→ English" (the target language label after the native one)

  // Sentence-length selector
  sentenceLengthHeader: string;
  lengthShort: string;
  lengthMedium: string;
  lengthLong: string;
  lengthShortDesc: string;
  lengthMediumDesc: string;
  lengthLongDesc: string;

  // Custom request input
  customRequestPlaceholder: string;
  customTopicRequest: string;           // a11y label
  customRequestHint: string;            // a11y hint

  // Generate / Start button hints
  newSentenceHint: string;
  startSessionHint: string;

  // Header chrome
  opensSettingsHint: string;

  // Sentence card
  retryBadge: string;                   // "🔁 RETRY"
  retrySentenceA11y: string;
  bankBadge: string;                    // "📚 Bank"
  topicLabel: string;                   // "Topic: {topic}"
  topicLabelBank: string;               // "Topic: {topic}, from exercise bank"
  translateThis: string;                // "Translate this sentence to English: {sentence}"
  typeTranslationHint: string;
  voiceInputUnavailable: string;        // a11y label on the disabled mic icon
  voiceNotice: string;                  // long notice: "Voice input is not available for {language} speakers…"

  // Hint / Show-answer row
  hintScorePenalty: string;             // "(-20)"
  hintStartsWith: string;               // 'Starts with: "{word}…"'
  hintUnavailable: string;
  hintPenaltySuffix: string;            // " (-20 hint penalty)"
  revealNoScore: string;                // "Answer was revealed - no score awarded."
  revealClueHint: string;
  revealAnswerHint: string;
  submitTranslationHint: string;

  // Result / XP
  earnedXp: string;                     // "Earned {xp} experience points"
  tapHint: string;                      // "Tap"
  saveToVaultPrompt: string;
  fullPhrase: string;

  // Chat modal
  aiIntroMessage: string;
  polyPuffTyping: string;               // a11y for the loading bubble
  askAboutGrammarPlaceholder: string;
  askGrammarQuestion: string;
  sendMessage: string;
  reportAiResponseA11y: string;
  youSaidA11y: string;                  // "You said: {text}"
  aiResponseA11y: string;               // "{brand}, AI response: {text}"
  chatError: string;                    // "Sorry, I had trouble responding. Try again!"

  // Settings modal
  closeSettings: string;

  // A11y for level pills / list
  selectCefrLevelA11y: string;          // "Select CEFR Level"
  cefrLevelOptionA11y: string;          // "Level {l}"
  lengthOptionA11y: string;             // "{label} sentences, {desc}"

  // announce() messages (screen-reader)
  announceLevelSelected: string;        // "CEFR level {level} selected."
  announceLengthSelected: string;       // "{length} sentence length selected."
  announceRetryReady: string;
  announceNewSentence: string;
  announceAnswerRevealed: string;       // "Answer revealed: {answer}"

  // Alerts: welcome back
  welcomeBackTitle: string;
  welcomeBackMessage: string;
  startNew: string;                     // alert button: "Start new"

  // Alerts: end session
  endSessionTitle: string;
  endSessionMessage: string;            // "{exercises} exercises, {xp} XP, {time}…"
  endSessionConfirm: string;

  // Alerts: errors
  errorTitle: string;
  errorGenerate: string;
  errorCheck: string;
  errorSaveVault: string;

  // Alerts: vault
  alreadyInVault: string;
  addedTitle: string;                   // "Added! 🎉"
  addedMessage: string;                 // '"{phrase}" saved to your Vocabulary Vault.'

  // Alerts: answer unavailable
  answerUnavailableTitle: string;
  answerUnavailableMissing: string;
  answerUnavailableTryAgain: string;

  // Alerts: report AI
  reportAiTitle: string;
  reportAiPrompt: string;
  reportAiInaccurate: string;
  reportAiOffensive: string;
  reportedTitle: string;
  reportedThanksReview: string;
  reportedThanksSerious: string;
}

const en: TrainerStrings = {
  toEnglish: '→ English',

  sentenceLengthHeader: 'Sentence Length',
  lengthShort: 'Short',
  lengthMedium: 'Medium',
  lengthLong: 'Long',
  lengthShortDesc: '3-6 words',
  lengthMediumDesc: '7-12 words',
  lengthLongDesc: '13-20 words',

  customRequestPlaceholder: "Custom request... (e.g., 'Past tense about food')",
  customTopicRequest: 'Custom topic request',
  customRequestHint: 'Type a specific topic or grammar focus for the next sentence',

  newSentenceHint: 'Generates a new sentence to translate',
  startSessionHint: 'Starts a new translation practice session',

  opensSettingsHint: 'Opens language and level settings',

  retryBadge: '🔁 RETRY',
  retrySentenceA11y: 'Retry sentence. You struggled with this one before.',
  bankBadge: '📚 Bank',
  topicLabel: 'Topic: {topic}',
  topicLabelBank: 'Topic: {topic}, from exercise bank',
  translateThis: 'Translate this sentence to English: {sentence}',
  typeTranslationHint: 'Type your translation of the sentence above',
  voiceInputUnavailable: 'Voice input not available for your language',
  voiceNotice: 'Voice input is not available for {language} speakers in the Translation Trainer. You can still use it in the Placement Test.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Starts with: "{word}…"',
  hintUnavailable: 'Hint unavailable - try your best!',
  hintPenaltySuffix: ' (-20 hint penalty)',
  revealNoScore: 'Answer was revealed - no score awarded.',
  revealClueHint: 'Reveals a clue. Caps your score at 80.',
  revealAnswerHint: 'Reveals the answer without scoring',
  submitTranslationHint: 'Submits your translation for scoring',

  earnedXp: 'Earned {xp} experience points',
  tapHint: 'Tap',
  saveToVaultPrompt: 'Tap to save to your Vocabulary Vault:',
  fullPhrase: 'FULL PHRASE',

  aiIntroMessage: 'Hi! I can help explain grammar rules. What would you like to know?',
  polyPuffTyping: 'Poly-Puff is typing',
  askAboutGrammarPlaceholder: 'Ask about grammar...',
  askGrammarQuestion: 'Ask Poly-Puff a grammar question',
  sendMessage: 'Send message',
  reportAiResponseA11y: 'Report this AI response',
  youSaidA11y: 'You said: {text}',
  aiResponseA11y: '{brand}, AI response: {text}',
  chatError: 'Sorry, I had trouble responding. Try again!',

  closeSettings: 'Close settings',

  selectCefrLevelA11y: 'Select CEFR level',
  cefrLevelOptionA11y: 'Level {l}',
  lengthOptionA11y: '{label} sentences, {desc}',

  announceLevelSelected: 'CEFR level {level} selected.',
  announceLengthSelected: '{length} sentence length selected.',
  announceRetryReady: 'Retry sentence. You struggled with this one before. Try again!',
  announceNewSentence: 'New sentence ready. Type your English translation.',
  announceAnswerRevealed: 'Answer revealed: {answer}',

  welcomeBackTitle: '⏸️ Welcome Back',
  welcomeBackMessage: 'You have an exercise in progress. Would you like to continue?',
  startNew: 'Start new',

  endSessionTitle: 'End Session',
  endSessionMessage: 'You completed {exercises} exercises and earned {xp} XP in {time}. End session?',
  endSessionConfirm: 'End Session',

  errorTitle: 'Error',
  errorGenerate: 'Failed to generate sentence. Is your server running?',
  errorCheck: 'Failed to check translation.',
  errorSaveVault: 'Could not save to vault.',

  alreadyInVault: 'Already in Vault',
  addedTitle: 'Added! 🎉',
  addedMessage: '"{phrase}" saved to your Vocabulary Vault.',

  answerUnavailableTitle: 'Answer unavailable',
  answerUnavailableMissing: 'This sentence is missing its answer key. Please tap Next Sentence to get a fresh one.',
  answerUnavailableTryAgain: 'I could not reveal this answer. Please try again or tap Next Sentence.',

  reportAiTitle: 'Report AI Response',
  reportAiPrompt: 'What issue did you find?',
  reportAiInaccurate: 'Inaccurate',
  reportAiOffensive: 'Culturally Insensitive',
  reportedTitle: 'Reported',
  reportedThanksReview: "Thank you. We'll review this.",
  reportedThanksSerious: 'Thank you. We take this seriously.',
};

const af: TrainerStrings = {
  toEnglish: '→ Engels',

  sentenceLengthHeader: 'Sinslengte',
  lengthShort: 'Kort',
  lengthMedium: 'Medium',
  lengthLong: 'Lank',
  lengthShortDesc: '3-6 woorde',
  lengthMediumDesc: '7-12 woorde',
  lengthLongDesc: '13-20 woorde',

  customRequestPlaceholder: "Pasgemaakte versoek… (bv. 'Verlede tyd oor kos')",
  customTopicRequest: 'Pasgemaakte onderwerpversoek',
  customRequestHint: 'Tik \'n spesifieke onderwerp of grammatika-fokus vir die volgende sin',

  newSentenceHint: 'Genereer \'n nuwe sin om te vertaal',
  startSessionHint: 'Begin \'n nuwe vertaaloefen-sessie',

  opensSettingsHint: 'Maak taal- en vlakinstellings oop',

  retryBadge: '🔁 HERHAAL',
  retrySentenceA11y: 'Herhaal sin. Jy het met hierdie een gesukkel.',
  bankBadge: '📚 Bank',
  topicLabel: 'Onderwerp: {topic}',
  topicLabelBank: 'Onderwerp: {topic}, uit oefenbank',
  translateThis: 'Vertaal hierdie sin na Engels: {sentence}',
  typeTranslationHint: 'Tik jou vertaling van die sin hierbo',
  voiceInputUnavailable: 'Steminvoer nie beskikbaar vir jou taal nie',
  voiceNotice: 'Steminvoer is nie beskikbaar vir {language}-sprekers in die Vertalingsafrigter nie. Jy kan dit steeds in die Plasingstoets gebruik.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Begin met: "{word}…"',
  hintUnavailable: 'Wenk nie beskikbaar nie - doen jou bes!',
  hintPenaltySuffix: ' (-20 wenkstrafpunt)',
  revealNoScore: 'Antwoord is bekend gemaak - geen punte toegeken nie.',
  revealClueHint: 'Wys \'n leidraad. Jou telling word op 80 beperk.',
  revealAnswerHint: 'Wys die antwoord sonder om punte toe te ken',
  submitTranslationHint: 'Stuur jou vertaling vir puntetelling',

  earnedXp: '{xp} ervaringspunte verdien',
  tapHint: 'Tik',
  saveToVaultPrompt: 'Tik om in jou Woordeskatkluis te stoor:',
  fullPhrase: 'VOLLEDIGE FRASE',

  aiIntroMessage: 'Hallo! Ek kan help om grammatikareëls te verduidelik. Wat wil jy weet?',
  polyPuffTyping: 'Poly-Puff tik',
  askAboutGrammarPlaceholder: 'Vra oor grammatika…',
  askGrammarQuestion: 'Vra Poly-Puff \'n grammatikavraag',
  sendMessage: 'Stuur boodskap',
  reportAiResponseA11y: 'Rapporteer hierdie KI-antwoord',
  youSaidA11y: 'Jy het gesê: {text}',
  aiResponseA11y: '{brand}, KI-antwoord: {text}',
  chatError: 'Jammer, ek het probleme om te antwoord. Probeer weer!',

  closeSettings: 'Sluit instellings',

  selectCefrLevelA11y: 'Kies CEFR-vlak',
  cefrLevelOptionA11y: 'Vlak {l}',
  lengthOptionA11y: '{label} sinne, {desc}',

  announceLevelSelected: 'CEFR-vlak {level} gekies.',
  announceLengthSelected: '{length} sinslengte gekies.',
  announceRetryReady: 'Herhaal sin. Jy het met hierdie een gesukkel. Probeer weer!',
  announceNewSentence: 'Nuwe sin gereed. Tik jou Engelse vertaling.',
  announceAnswerRevealed: 'Antwoord bekend gemaak: {answer}',

  welcomeBackTitle: '⏸️ Welkom Terug',
  welcomeBackMessage: 'Jy het \'n oefening aan die gang. Wil jy voortgaan?',
  startNew: 'Begin van voor',

  endSessionTitle: 'Eindig Sessie',
  endSessionMessage: 'Jy het {exercises} oefeninge voltooi en {xp} XP verdien in {time}. Sessie eindig?',
  endSessionConfirm: 'Eindig Sessie',

  errorTitle: 'Fout',
  errorGenerate: 'Kon nie sin genereer nie. Loop jou bediener?',
  errorCheck: 'Kon nie vertaling nagaan nie.',
  errorSaveVault: 'Kon nie in kluis stoor nie.',

  alreadyInVault: 'Reeds in Kluis',
  addedTitle: 'Bygevoeg! 🎉',
  addedMessage: '"{phrase}" in jou Woordeskatkluis gestoor.',

  answerUnavailableTitle: 'Antwoord nie beskikbaar nie',
  answerUnavailableMissing: 'Hierdie sin ontbreek sy antwoordsleutel. Tik asseblief Volgende Sin om \'n vars een te kry.',
  answerUnavailableTryAgain: 'Ek kon nie hierdie antwoord wys nie. Probeer asseblief weer of tik Volgende Sin.',

  reportAiTitle: 'Rapporteer KI-antwoord',
  reportAiPrompt: 'Watter probleem het jy gevind?',
  reportAiInaccurate: 'Onakkuraat',
  reportAiOffensive: 'Kultureel Onsensitief',
  reportedTitle: 'Gerapporteer',
  reportedThanksReview: 'Dankie. Ons sal dit hersien.',
  reportedThanksSerious: 'Dankie. Ons neem dit ernstig op.',
};

const am: TrainerStrings = {
  toEnglish: '→ እንግሊዝኛ',

  sentenceLengthHeader: 'የዓረፍተ ነገር ርዝመት',
  lengthShort: 'አጭር',
  lengthMedium: 'መካከለኛ',
  lengthLong: 'ረጅም',
  lengthShortDesc: '3-6 ቃላት',
  lengthMediumDesc: '7-12 ቃላት',
  lengthLongDesc: '13-20 ቃላት',

  customRequestPlaceholder: 'የራስዎ ጥያቄ… (ለምሳሌ \'ስለ ምግብ ያለፈ ጊዜ\')',
  customTopicRequest: 'የራስዎ የርዕሰ ጉዳይ ጥያቄ',
  customRequestHint: 'ለቀጣዩ ዓረፍተ ነገር ልዩ ርዕስ ወይም ሰዋስዋዊ ትኩረት ይተይቡ',

  newSentenceHint: 'ለመተርጎም አዲስ ዓረፍተ ነገር ይፈጥራል',
  startSessionHint: 'አዲስ የትርጉም ልምምድ ክፍለ-ጊዜ ይጀምራል',

  opensSettingsHint: 'የቋንቋ እና ደረጃ ቅንብሮችን ይከፍታል',

  retryBadge: '🔁 ይድገሙ',
  retrySentenceA11y: 'የሚደገም ዓረፍተ ነገር። በፊት ተቸግረዋል።',
  bankBadge: '📚 ባንክ',
  topicLabel: 'ርዕስ: {topic}',
  topicLabelBank: 'ርዕስ: {topic}, ከመለማመጃ ባንክ',
  translateThis: 'ይህን ዓረፍተ ነገር ወደ እንግሊዝኛ ይተርጉሙ: {sentence}',
  typeTranslationHint: 'ከላይ ያለውን ዓረፍተ ነገር ትርጉም ይተይቡ',
  voiceInputUnavailable: 'ለቋንቋዎ የድምፅ ግቤት አይገኝም',
  voiceNotice: 'ለ{language} ተናጋሪዎች በትርጉም አሰልጣኝ ውስጥ የድምፅ ግቤት አይገኝም። በደረጃ ምደባ ፈተና ውስጥ ግን ሊጠቀሙበት ይችላሉ።',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'በ"{word}…" ይጀምራል',
  hintUnavailable: 'ፍንጭ አይገኝም - ምርጥዎን ይሞክሩ!',
  hintPenaltySuffix: ' (-20 የፍንጭ ቅጣት)',
  revealNoScore: 'መልሱ ተገልጧል - ነጥብ አልተሰጠም።',
  revealClueHint: 'ፍንጭ ያሳያል። ነጥብዎን በ80 ይገድባል።',
  revealAnswerHint: 'ምንም ነጥብ ሳይሰጥ መልሱን ያሳያል',
  submitTranslationHint: 'ትርጉምዎን ለነጥብ ይሰጣል',

  earnedXp: '{xp} የተሞክሮ ነጥቦች ተገኝተዋል',
  tapHint: 'ይንኩ',
  saveToVaultPrompt: 'ወደ የቃላት ካዝና ለማስቀመጥ ይንኩ:',
  fullPhrase: 'ሙሉ ሐረግ',

  aiIntroMessage: 'ሰላም! የሰዋስው ህጎችን ለማብራራት ልረዳዎ እችላለሁ። ምን ለመጠየቅ ይፈልጋሉ?',
  polyPuffTyping: 'Poly-Puff እየተየበ ነው',
  askAboutGrammarPlaceholder: 'ስለ ሰዋስው ይጠይቁ…',
  askGrammarQuestion: 'Poly-Puffን የሰዋስው ጥያቄ ይጠይቁ',
  sendMessage: 'መልዕክት ላክ',
  reportAiResponseA11y: 'ይህን የAI ምላሽ ሪፖርት ያድርጉ',
  youSaidA11y: 'እርስዎ አሉ: {text}',
  aiResponseA11y: '{brand}, የAI ምላሽ: {text}',
  chatError: 'ይቅርታ፣ ለመመለስ ችግር ነበረኝ። እንደገና ይሞክሩ!',

  closeSettings: 'ቅንብሮችን ዝጋ',

  selectCefrLevelA11y: 'CEFR ደረጃ ይምረጡ',
  cefrLevelOptionA11y: 'ደረጃ {l}',
  lengthOptionA11y: '{label} ዓረፍተ ነገሮች, {desc}',

  announceLevelSelected: 'CEFR ደረጃ {level} ተመርጧል።',
  announceLengthSelected: '{length} የዓረፍተ ነገር ርዝመት ተመርጧል።',
  announceRetryReady: 'የሚደገም ዓረፍተ ነገር። በፊት ተቸግረዋል። እንደገና ይሞክሩ!',
  announceNewSentence: 'አዲስ ዓረፍተ ነገር ዝግጁ ነው። የእንግሊዝኛ ትርጉምዎን ይተይቡ።',
  announceAnswerRevealed: 'መልስ ተገልጧል: {answer}',

  welcomeBackTitle: '⏸️ እንኳን ደህና መጡ',
  welcomeBackMessage: 'ልምምድ በሂደት ላይ አለ። መቀጠል ይፈልጋሉ?',
  startNew: 'አዲስ ጀምር',

  endSessionTitle: 'ክፍለ-ጊዜ ጨርስ',
  endSessionMessage: '{exercises} ልምምዶችን አጠናቅቀዋል እና በ{time} {xp} XP አግኝተዋል። ክፍለ-ጊዜ ጨርስ?',
  endSessionConfirm: 'ክፍለ-ጊዜ ጨርስ',

  errorTitle: 'ስህተት',
  errorGenerate: 'ዓረፍተ ነገር መፍጠር አልተቻለም። ሰርቨርዎ እየሰራ ነው?',
  errorCheck: 'ትርጉሙን ማረጋገጥ አልተቻለም።',
  errorSaveVault: 'በካዝና ውስጥ ማስቀመጥ አልተቻለም።',

  alreadyInVault: 'አስቀድሞ በካዝና ውስጥ',
  addedTitle: 'ታክሏል! 🎉',
  addedMessage: '"{phrase}" በቃላት ካዝናዎ ውስጥ ተቀምጧል።',

  answerUnavailableTitle: 'መልስ አይገኝም',
  answerUnavailableMissing: 'ይህ ዓረፍተ ነገር መልስ የለውም። እባክዎ ቀጣይ ዓረፍተ ነገርን ይንኩ።',
  answerUnavailableTryAgain: 'ይህን መልስ ማሳየት አልቻልኩም። እባክዎ እንደገና ይሞክሩ ወይም ቀጣይ ዓረፍተ ነገርን ይንኩ።',

  reportAiTitle: 'የAI ምላሽ ሪፖርት ያድርጉ',
  reportAiPrompt: 'ምን ችግር አገኙ?',
  reportAiInaccurate: 'ትክክል ያልሆነ',
  reportAiOffensive: 'ባህላዊ ጨዋነት የጎደለው',
  reportedTitle: 'ሪፖርት ተደርጓል',
  reportedThanksReview: 'አመሰግናለሁ። ይህንን እንመረምራለን።',
  reportedThanksSerious: 'አመሰግናለሁ። ይህንን በቁም ነገር እንመለከታለን።',
};

// RTL
const ar: TrainerStrings = {
  toEnglish: '← الإنجليزية',

  sentenceLengthHeader: 'طول الجملة',
  lengthShort: 'قصيرة',
  lengthMedium: 'متوسطة',
  lengthLong: 'طويلة',
  lengthShortDesc: '3-6 كلمات',
  lengthMediumDesc: '7-12 كلمة',
  lengthLongDesc: '13-20 كلمة',

  customRequestPlaceholder: 'طلب مخصص… (مثال: «الزمن الماضي عن الطعام»)',
  customTopicRequest: 'طلب موضوع مخصص',
  customRequestHint: 'اكتب موضوعًا محددًا أو تركيزًا نحويًا للجملة التالية',

  newSentenceHint: 'يولّد جملة جديدة لترجمتها',
  startSessionHint: 'يبدأ جلسة تدريب جديدة على الترجمة',

  opensSettingsHint: 'يفتح إعدادات اللغة والمستوى',

  retryBadge: '🔁 إعادة',
  retrySentenceA11y: 'جملة إعادة. لقد واجهت صعوبة في هذه من قبل.',
  bankBadge: '📚 بنك',
  topicLabel: 'الموضوع: {topic}',
  topicLabelBank: 'الموضوع: {topic}، من بنك التمارين',
  translateThis: 'ترجم هذه الجملة إلى الإنجليزية: {sentence}',
  typeTranslationHint: 'اكتب ترجمتك للجملة أعلاه',
  voiceInputUnavailable: 'الإدخال الصوتي غير متاح للغتك',
  voiceNotice: 'الإدخال الصوتي غير متاح للمتحدثين بـ{language} في مدرّب الترجمة. لا يزال بإمكانك استخدامه في اختبار تحديد المستوى.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'يبدأ بـ: «{word}…»',
  hintUnavailable: 'التلميح غير متاح - حاول قدر استطاعتك!',
  hintPenaltySuffix: ' (خصم تلميح 20-)',
  revealNoScore: 'تم الكشف عن الإجابة - لم تُمنح أي نقاط.',
  revealClueHint: 'يكشف عن تلميح. يحد من نتيجتك عند 80.',
  revealAnswerHint: 'يكشف الإجابة دون منح نقاط',
  submitTranslationHint: 'يرسل ترجمتك للتقييم',

  earnedXp: 'تم كسب {xp} نقطة خبرة',
  tapHint: 'اضغط',
  saveToVaultPrompt: 'اضغط للحفظ في خزينة المفردات:',
  fullPhrase: 'العبارة الكاملة',

  aiIntroMessage: 'مرحبًا! يمكنني المساعدة في شرح قواعد النحو. ماذا تريد أن تعرف؟',
  polyPuffTyping: 'Poly-Puff يكتب',
  askAboutGrammarPlaceholder: 'اسأل عن القواعد…',
  askGrammarQuestion: 'اسأل Poly-Puff سؤالًا عن القواعد',
  sendMessage: 'إرسال رسالة',
  reportAiResponseA11y: 'الإبلاغ عن استجابة الذكاء الاصطناعي',
  youSaidA11y: 'قلت: {text}',
  aiResponseA11y: '{brand}، استجابة الذكاء الاصطناعي: {text}',
  chatError: 'عذرًا، واجهت مشكلة في الرد. حاول مرة أخرى!',

  closeSettings: 'إغلاق الإعدادات',

  selectCefrLevelA11y: 'اختر مستوى CEFR',
  cefrLevelOptionA11y: 'المستوى {l}',
  lengthOptionA11y: 'جمل {label}، {desc}',

  announceLevelSelected: 'تم اختيار مستوى CEFR {level}.',
  announceLengthSelected: 'تم اختيار طول الجملة {length}.',
  announceRetryReady: 'جملة إعادة. لقد واجهت صعوبة في هذه من قبل. حاول مرة أخرى!',
  announceNewSentence: 'جملة جديدة جاهزة. اكتب ترجمتك الإنجليزية.',
  announceAnswerRevealed: 'تم كشف الإجابة: {answer}',

  welcomeBackTitle: '⏸️ مرحبًا بعودتك',
  welcomeBackMessage: 'لديك تمرين قيد التقدم. هل تريد المتابعة؟',
  startNew: 'ابدأ من جديد',

  endSessionTitle: 'إنهاء الجلسة',
  endSessionMessage: 'لقد أكملت {exercises} تمرينًا وحصلت على {xp} XP في {time}. هل تنهي الجلسة؟',
  endSessionConfirm: 'إنهاء الجلسة',

  errorTitle: 'خطأ',
  errorGenerate: 'فشل توليد الجملة. هل خادمك يعمل؟',
  errorCheck: 'فشل التحقق من الترجمة.',
  errorSaveVault: 'تعذر الحفظ في الخزينة.',

  alreadyInVault: 'موجود بالفعل في الخزينة',
  addedTitle: 'تمت الإضافة! 🎉',
  addedMessage: 'تم حفظ «{phrase}» في خزينة المفردات.',

  answerUnavailableTitle: 'الإجابة غير متاحة',
  answerUnavailableMissing: 'هذه الجملة تفتقد إجابتها. يرجى الضغط على الجملة التالية للحصول على واحدة جديدة.',
  answerUnavailableTryAgain: 'لم أتمكن من كشف هذه الإجابة. حاول مرة أخرى أو اضغط على الجملة التالية.',

  reportAiTitle: 'الإبلاغ عن استجابة الذكاء الاصطناعي',
  reportAiPrompt: 'ما المشكلة التي وجدتها؟',
  reportAiInaccurate: 'غير دقيق',
  reportAiOffensive: 'غير حساس ثقافيًا',
  reportedTitle: 'تم الإبلاغ',
  reportedThanksReview: 'شكرًا لك. سنقوم بمراجعة هذا.',
  reportedThanksSerious: 'شكرًا لك. نتعامل مع هذا بجدية.',
};

const bn: TrainerStrings = {
  toEnglish: '→ ইংরেজি',

  sentenceLengthHeader: 'বাক্যের দৈর্ঘ্য',
  lengthShort: 'ছোট',
  lengthMedium: 'মাঝারি',
  lengthLong: 'লম্বা',
  lengthShortDesc: '৩-৬ শব্দ',
  lengthMediumDesc: '৭-১২ শব্দ',
  lengthLongDesc: '১৩-২০ শব্দ',

  customRequestPlaceholder: 'কাস্টম অনুরোধ… (যেমন \'খাবার সম্পর্কে অতীত কাল\')',
  customTopicRequest: 'কাস্টম বিষয় অনুরোধ',
  customRequestHint: 'পরবর্তী বাক্যের জন্য একটি নির্দিষ্ট বিষয় বা ব্যাকরণ ফোকাস টাইপ করুন',

  newSentenceHint: 'অনুবাদের জন্য একটি নতুন বাক্য তৈরি করে',
  startSessionHint: 'নতুন অনুবাদ অনুশীলন সেশন শুরু করে',

  opensSettingsHint: 'ভাষা এবং স্তর সেটিংস খোলে',

  retryBadge: '🔁 পুনরায়',
  retrySentenceA11y: 'পুনরাবৃত্তি বাক্য। আপনি আগে এটিতে অসুবিধা পেয়েছিলেন।',
  bankBadge: '📚 ব্যাঙ্ক',
  topicLabel: 'বিষয়: {topic}',
  topicLabelBank: 'বিষয়: {topic}, অনুশীলন ব্যাঙ্ক থেকে',
  translateThis: 'এই বাক্যটি ইংরেজিতে অনুবাদ করুন: {sentence}',
  typeTranslationHint: 'উপরের বাক্যের আপনার অনুবাদ টাইপ করুন',
  voiceInputUnavailable: 'আপনার ভাষার জন্য ভয়েস ইনপুট উপলব্ধ নয়',
  voiceNotice: 'অনুবাদ প্রশিক্ষকে {language} ভাষাভাষীদের জন্য ভয়েস ইনপুট উপলব্ধ নয়। আপনি এটি স্থাপন পরীক্ষায় ব্যবহার করতে পারেন।',

  hintScorePenalty: '(-২০)',
  hintStartsWith: 'শুরু হয়: "{word}…"',
  hintUnavailable: 'ইঙ্গিত উপলব্ধ নয় - সেরাটা চেষ্টা করুন!',
  hintPenaltySuffix: ' (-২০ ইঙ্গিত জরিমানা)',
  revealNoScore: 'উত্তর প্রকাশ করা হয়েছে - কোন স্কোর দেওয়া হয়নি।',
  revealClueHint: 'একটি ইঙ্গিত প্রকাশ করে। আপনার স্কোর ৮০-তে সীমাবদ্ধ করে।',
  revealAnswerHint: 'স্কোর ছাড়া উত্তর প্রকাশ করে',
  submitTranslationHint: 'স্কোরিংয়ের জন্য আপনার অনুবাদ জমা দেয়',

  earnedXp: '{xp} অভিজ্ঞতা পয়েন্ট অর্জিত',
  tapHint: 'আলতো চাপুন',
  saveToVaultPrompt: 'আপনার শব্দভাণ্ডার ভল্টে সংরক্ষণ করতে আলতো চাপুন:',
  fullPhrase: 'সম্পূর্ণ বাক্যাংশ',

  aiIntroMessage: 'হাই! আমি ব্যাকরণ নিয়ম ব্যাখ্যা করতে সাহায্য করতে পারি। আপনি কী জানতে চান?',
  polyPuffTyping: 'Poly-Puff টাইপ করছে',
  askAboutGrammarPlaceholder: 'ব্যাকরণ সম্পর্কে জিজ্ঞাসা করুন…',
  askGrammarQuestion: 'Poly-Puffকে একটি ব্যাকরণ প্রশ্ন জিজ্ঞাসা করুন',
  sendMessage: 'বার্তা পাঠান',
  reportAiResponseA11y: 'এই AI প্রতিক্রিয়া রিপোর্ট করুন',
  youSaidA11y: 'আপনি বললেন: {text}',
  aiResponseA11y: '{brand}, AI প্রতিক্রিয়া: {text}',
  chatError: 'দুঃখিত, আমার উত্তর দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন!',

  closeSettings: 'সেটিংস বন্ধ করুন',

  selectCefrLevelA11y: 'CEFR স্তর নির্বাচন করুন',
  cefrLevelOptionA11y: 'স্তর {l}',
  lengthOptionA11y: '{label} বাক্য, {desc}',

  announceLevelSelected: 'CEFR স্তর {level} নির্বাচিত।',
  announceLengthSelected: '{length} বাক্যের দৈর্ঘ্য নির্বাচিত।',
  announceRetryReady: 'পুনরাবৃত্তি বাক্য। আপনি আগে এটিতে অসুবিধা পেয়েছিলেন। আবার চেষ্টা করুন!',
  announceNewSentence: 'নতুন বাক্য প্রস্তুত। আপনার ইংরেজি অনুবাদ টাইপ করুন।',
  announceAnswerRevealed: 'উত্তর প্রকাশিত: {answer}',

  welcomeBackTitle: '⏸️ স্বাগতম ফিরে',
  welcomeBackMessage: 'আপনার একটি অনুশীলন চলছে। আপনি কি চালিয়ে যেতে চান?',
  startNew: 'নতুন করে শুরু',

  endSessionTitle: 'সেশন শেষ করুন',
  endSessionMessage: 'আপনি {exercises}টি অনুশীলন সম্পন্ন করেছেন এবং {time}-এ {xp} XP অর্জন করেছেন। সেশন শেষ?',
  endSessionConfirm: 'সেশন শেষ করুন',

  errorTitle: 'ত্রুটি',
  errorGenerate: 'বাক্য তৈরি করতে ব্যর্থ। আপনার সার্ভার কি চলছে?',
  errorCheck: 'অনুবাদ যাচাই করতে ব্যর্থ।',
  errorSaveVault: 'ভল্টে সংরক্ষণ করা যায়নি।',

  alreadyInVault: 'ইতিমধ্যে ভল্টে রয়েছে',
  addedTitle: 'যোগ করা হয়েছে! 🎉',
  addedMessage: '"{phrase}" আপনার শব্দভাণ্ডার ভল্টে সংরক্ষিত।',

  answerUnavailableTitle: 'উত্তর উপলব্ধ নয়',
  answerUnavailableMissing: 'এই বাক্যের উত্তর কী নেই। অনুগ্রহ করে একটি নতুন পেতে পরবর্তী বাক্যে আলতো চাপুন।',
  answerUnavailableTryAgain: 'আমি এই উত্তর প্রকাশ করতে পারিনি। আবার চেষ্টা করুন বা পরবর্তী বাক্যে আলতো চাপুন।',

  reportAiTitle: 'AI প্রতিক্রিয়া রিপোর্ট করুন',
  reportAiPrompt: 'আপনি কী সমস্যা পেয়েছেন?',
  reportAiInaccurate: 'ভুল',
  reportAiOffensive: 'সাংস্কৃতিকভাবে সংবেদনশীল নয়',
  reportedTitle: 'রিপোর্ট করা হয়েছে',
  reportedThanksReview: 'ধন্যবাদ। আমরা এটি পর্যালোচনা করব।',
  reportedThanksSerious: 'ধন্যবাদ। আমরা এটি গুরুত্ব সহকারে নিচ্ছি।',
};

const bg: TrainerStrings = {
  toEnglish: '→ Английски',

  sentenceLengthHeader: 'Дължина на изречението',
  lengthShort: 'Кратко',
  lengthMedium: 'Средно',
  lengthLong: 'Дълго',
  lengthShortDesc: '3-6 думи',
  lengthMediumDesc: '7-12 думи',
  lengthLongDesc: '13-20 думи',

  customRequestPlaceholder: 'Персонализирана заявка… (напр. „Минало време за храна“)',
  customTopicRequest: 'Заявка за персонализирана тема',
  customRequestHint: 'Въведете конкретна тема или граматичен фокус за следващото изречение',

  newSentenceHint: 'Генерира ново изречение за превод',
  startSessionHint: 'Започва нова сесия за упражняване на превод',

  opensSettingsHint: 'Отваря настройките за език и ниво',

  retryBadge: '🔁 ПОВТОРНО',
  retrySentenceA11y: 'Повторно изречение. Затрудни ви се преди.',
  bankBadge: '📚 Банка',
  topicLabel: 'Тема: {topic}',
  topicLabelBank: 'Тема: {topic}, от банка с упражнения',
  translateThis: 'Преведете това изречение на английски: {sentence}',
  typeTranslationHint: 'Въведете превода на изречението по-горе',
  voiceInputUnavailable: 'Гласовият вход не е наличен за вашия език',
  voiceNotice: 'Гласовият вход не е наличен за {language} говорители в Треньора по превод. Все още можете да го използвате в теста за разпределение.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Започва с: „{word}…“',
  hintUnavailable: 'Подсказка не е налична - опитайте най-доброто!',
  hintPenaltySuffix: ' (-20 наказание за подсказка)',
  revealNoScore: 'Отговорът е разкрит - не са дадени точки.',
  revealClueHint: 'Разкрива улика. Ограничава резултата ви на 80.',
  revealAnswerHint: 'Разкрива отговора без точки',
  submitTranslationHint: 'Изпраща превода ви за оценка',

  earnedXp: 'Спечелени {xp} точки опит',
  tapHint: 'Докоснете',
  saveToVaultPrompt: 'Докоснете, за да запазите в хранилището за думи:',
  fullPhrase: 'ЦЯЛА ФРАЗА',

  aiIntroMessage: 'Здравей! Мога да помогна с обяснение на граматическите правила. Какво искаш да научиш?',
  polyPuffTyping: 'Poly-Puff пише',
  askAboutGrammarPlaceholder: 'Попитайте за граматиката…',
  askGrammarQuestion: 'Задайте на Poly-Puff граматичен въпрос',
  sendMessage: 'Изпрати съобщение',
  reportAiResponseA11y: 'Докладвай този ИИ отговор',
  youSaidA11y: 'Вие казахте: {text}',
  aiResponseA11y: '{brand}, ИИ отговор: {text}',
  chatError: 'Извинете, имах проблем с отговора. Опитайте отново!',

  closeSettings: 'Затвори настройките',

  selectCefrLevelA11y: 'Изберете ниво по CEFR',
  cefrLevelOptionA11y: 'Ниво {l}',
  lengthOptionA11y: '{label} изречения, {desc}',

  announceLevelSelected: 'CEFR ниво {level} избрано.',
  announceLengthSelected: 'Дължина {length} избрана.',
  announceRetryReady: 'Повторно изречение. Затрудни ви се преди. Опитайте отново!',
  announceNewSentence: 'Ново изречение готово. Въведете превода си на английски.',
  announceAnswerRevealed: 'Отговор разкрит: {answer}',

  welcomeBackTitle: '⏸️ Добре дошли отново',
  welcomeBackMessage: 'Имате упражнение в ход. Искате ли да продължите?',
  startNew: 'Започни ново',

  endSessionTitle: 'Край на сесията',
  endSessionMessage: 'Завършихте {exercises} упражнения и спечелихте {xp} XP за {time}. Край на сесията?',
  endSessionConfirm: 'Край на сесията',

  errorTitle: 'Грешка',
  errorGenerate: 'Неуспешно генериране на изречение. Работи ли сървърът ви?',
  errorCheck: 'Неуспешна проверка на превода.',
  errorSaveVault: 'Не може да се запази в хранилището.',

  alreadyInVault: 'Вече в хранилището',
  addedTitle: 'Добавено! 🎉',
  addedMessage: '„{phrase}“ запазено в хранилището за думи.',

  answerUnavailableTitle: 'Отговорът не е наличен',
  answerUnavailableMissing: 'Това изречение няма отговор. Моля, докоснете Следващо изречение, за да получите ново.',
  answerUnavailableTryAgain: 'Не успях да разкрия този отговор. Опитайте отново или докоснете Следващо изречение.',

  reportAiTitle: 'Докладвай ИИ отговор',
  reportAiPrompt: 'Какъв проблем намерихте?',
  reportAiInaccurate: 'Неточно',
  reportAiOffensive: 'Културно нечувствително',
  reportedTitle: 'Докладвано',
  reportedThanksReview: 'Благодарим ви. Ще прегледаме това.',
  reportedThanksSerious: 'Благодарим ви. Приемаме това сериозно.',
};

const cs: TrainerStrings = {
  toEnglish: '→ Angličtina',

  sentenceLengthHeader: 'Délka věty',
  lengthShort: 'Krátká',
  lengthMedium: 'Střední',
  lengthLong: 'Dlouhá',
  lengthShortDesc: '3-6 slov',
  lengthMediumDesc: '7-12 slov',
  lengthLongDesc: '13-20 slov',

  customRequestPlaceholder: 'Vlastní požadavek… (např. „Minulý čas o jídle“)',
  customTopicRequest: 'Vlastní téma',
  customRequestHint: 'Zadejte konkrétní téma nebo gramatický cíl pro další větu',

  newSentenceHint: 'Vygeneruje novou větu k překladu',
  startSessionHint: 'Spustí novou relaci procvičování překladu',

  opensSettingsHint: 'Otevře nastavení jazyka a úrovně',

  retryBadge: '🔁 OPAKOVAT',
  retrySentenceA11y: 'Opakovaná věta. S touto jste měli dříve problém.',
  bankBadge: '📚 Banka',
  topicLabel: 'Téma: {topic}',
  topicLabelBank: 'Téma: {topic}, z banky cvičení',
  translateThis: 'Přeložte tuto větu do angličtiny: {sentence}',
  typeTranslationHint: 'Napište svůj překlad věty výše',
  voiceInputUnavailable: 'Hlasový vstup není pro váš jazyk k dispozici',
  voiceNotice: 'Hlasový vstup není k dispozici pro mluvčí jazyka {language} v Trenéru překladu. Stále jej můžete použít ve Vstupním testu.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Začíná na: „{word}…“',
  hintUnavailable: 'Nápověda není k dispozici - zkuste to co nejlépe!',
  hintPenaltySuffix: ' (-20 penalizace za nápovědu)',
  revealNoScore: 'Odpověď byla odhalena - žádné body nepřiděleny.',
  revealClueHint: 'Odhalí nápovědu. Omezuje vaše skóre na 80.',
  revealAnswerHint: 'Odhalí odpověď bez bodování',
  submitTranslationHint: 'Odešle váš překlad k hodnocení',

  earnedXp: 'Získáno {xp} bodů zkušeností',
  tapHint: 'Klepněte',
  saveToVaultPrompt: 'Klepnutím uložíte do Trezoru slovní zásoby:',
  fullPhrase: 'CELÁ FRÁZE',

  aiIntroMessage: 'Ahoj! Mohu pomoci vysvětlit gramatická pravidla. Co chceš vědět?',
  polyPuffTyping: 'Poly-Puff píše',
  askAboutGrammarPlaceholder: 'Zeptejte se na gramatiku…',
  askGrammarQuestion: 'Zeptejte se Poly-Puffa na gramatiku',
  sendMessage: 'Odeslat zprávu',
  reportAiResponseA11y: 'Nahlásit tuto odpověď AI',
  youSaidA11y: 'Řekli jste: {text}',
  aiResponseA11y: '{brand}, odpověď AI: {text}',
  chatError: 'Promiňte, měl jsem potíže s odpovědí. Zkuste to znovu!',

  closeSettings: 'Zavřít nastavení',

  selectCefrLevelA11y: 'Vyberte úroveň CEFR',
  cefrLevelOptionA11y: 'Úroveň {l}',
  lengthOptionA11y: 'Věty: {label}, {desc}',

  announceLevelSelected: 'Úroveň CEFR {level} vybrána.',
  announceLengthSelected: 'Vybraná délka věty: {length}.',
  announceRetryReady: 'Opakovaná věta. S touto jste měli dříve problém. Zkuste to znovu!',
  announceNewSentence: 'Nová věta připravena. Napište svůj anglický překlad.',
  announceAnswerRevealed: 'Odpověď odhalena: {answer}',

  welcomeBackTitle: '⏸️ Vítejte zpět',
  welcomeBackMessage: 'Máte rozpracované cvičení. Chcete pokračovat?',
  startNew: 'Začít znovu',

  endSessionTitle: 'Ukončit relaci',
  endSessionMessage: 'Dokončili jste {exercises} cvičení a získali {xp} XP za {time}. Ukončit relaci?',
  endSessionConfirm: 'Ukončit relaci',

  errorTitle: 'Chyba',
  errorGenerate: 'Nepodařilo se vygenerovat větu. Běží váš server?',
  errorCheck: 'Nepodařilo se zkontrolovat překlad.',
  errorSaveVault: 'Nepodařilo se uložit do trezoru.',

  alreadyInVault: 'Již v trezoru',
  addedTitle: 'Přidáno! 🎉',
  addedMessage: '„{phrase}“ uloženo do vašeho Trezoru slovní zásoby.',

  answerUnavailableTitle: 'Odpověď není k dispozici',
  answerUnavailableMissing: 'Této větě chybí klíč s odpovědí. Klepněte prosím na Další větu a získejte novou.',
  answerUnavailableTryAgain: 'Nemohl jsem odhalit tuto odpověď. Zkuste to prosím znovu nebo klepněte na Další větu.',

  reportAiTitle: 'Nahlásit odpověď AI',
  reportAiPrompt: 'Jaký problém jste našli?',
  reportAiInaccurate: 'Nepřesné',
  reportAiOffensive: 'Kulturně necitlivé',
  reportedTitle: 'Nahlášeno',
  reportedThanksReview: 'Děkujeme. Prověříme to.',
  reportedThanksSerious: 'Děkujeme. Bereme to vážně.',
};

const da: TrainerStrings = {
  toEnglish: '→ Engelsk',

  sentenceLengthHeader: 'Sætningslængde',
  lengthShort: 'Kort',
  lengthMedium: 'Mellem',
  lengthLong: 'Lang',
  lengthShortDesc: '3-6 ord',
  lengthMediumDesc: '7-12 ord',
  lengthLongDesc: '13-20 ord',

  customRequestPlaceholder: 'Tilpasset anmodning… (f.eks. »Datid om mad«)',
  customTopicRequest: 'Tilpasset emneanmodning',
  customRequestHint: 'Indtast et specifikt emne eller grammatisk fokus for næste sætning',

  newSentenceHint: 'Genererer en ny sætning at oversætte',
  startSessionHint: 'Starter en ny oversættelsestræningssession',

  opensSettingsHint: 'Åbner indstillinger for sprog og niveau',

  retryBadge: '🔁 GENTAG',
  retrySentenceA11y: 'Gentagelsessætning. Du havde tidligere besvær med denne.',
  bankBadge: '📚 Bank',
  topicLabel: 'Emne: {topic}',
  topicLabelBank: 'Emne: {topic}, fra øvelsesbank',
  translateThis: 'Oversæt denne sætning til engelsk: {sentence}',
  typeTranslationHint: 'Skriv din oversættelse af sætningen ovenfor',
  voiceInputUnavailable: 'Stemmeinput er ikke tilgængelig for dit sprog',
  voiceNotice: 'Stemmeinput er ikke tilgængelig for {language}-talere i Oversættelsestræneren. Du kan stadig bruge det i Placeringstesten.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Starter med: »{word}…«',
  hintUnavailable: 'Tip ikke tilgængeligt - gør dit bedste!',
  hintPenaltySuffix: ' (-20 tipstraf)',
  revealNoScore: 'Svaret blev afsløret - ingen point givet.',
  revealClueHint: 'Afslører en ledetråd. Begrænser din score til 80.',
  revealAnswerHint: 'Afslører svaret uden at give point',
  submitTranslationHint: 'Indsender din oversættelse til bedømmelse',

  earnedXp: '{xp} erfaringspoint optjent',
  tapHint: 'Tryk',
  saveToVaultPrompt: 'Tryk for at gemme i din Ordforrådshvælving:',
  fullPhrase: 'HELE FRASEN',

  aiIntroMessage: 'Hej! Jeg kan hjælpe med at forklare grammatikregler. Hvad vil du gerne vide?',
  polyPuffTyping: 'Poly-Puff skriver',
  askAboutGrammarPlaceholder: 'Spørg om grammatik…',
  askGrammarQuestion: 'Spørg Poly-Puff et grammatikspørgsmål',
  sendMessage: 'Send besked',
  reportAiResponseA11y: 'Rapporter dette AI-svar',
  youSaidA11y: 'Du sagde: {text}',
  aiResponseA11y: '{brand}, AI-svar: {text}',
  chatError: 'Beklager, jeg havde problemer med at svare. Prøv igen!',

  closeSettings: 'Luk indstillinger',

  selectCefrLevelA11y: 'Vælg CEFR-niveau',
  cefrLevelOptionA11y: 'Niveau {l}',
  lengthOptionA11y: '{label} sætninger, {desc}',

  announceLevelSelected: 'CEFR-niveau {level} valgt.',
  announceLengthSelected: '{length} sætningslængde valgt.',
  announceRetryReady: 'Gentagelsessætning. Du havde tidligere besvær med denne. Prøv igen!',
  announceNewSentence: 'Ny sætning klar. Skriv din engelske oversættelse.',
  announceAnswerRevealed: 'Svar afsløret: {answer}',

  welcomeBackTitle: '⏸️ Velkommen tilbage',
  welcomeBackMessage: 'Du har en øvelse i gang. Vil du fortsætte?',
  startNew: 'Start ny',

  endSessionTitle: 'Afslut session',
  endSessionMessage: 'Du gennemførte {exercises} øvelser og optjente {xp} XP på {time}. Afslut session?',
  endSessionConfirm: 'Afslut session',

  errorTitle: 'Fejl',
  errorGenerate: 'Kunne ikke generere sætning. Kører din server?',
  errorCheck: 'Kunne ikke kontrollere oversættelsen.',
  errorSaveVault: 'Kunne ikke gemme i hvælvingen.',

  alreadyInVault: 'Allerede i hvælvingen',
  addedTitle: 'Tilføjet! 🎉',
  addedMessage: '»{phrase}« gemt i din Ordforrådshvælving.',

  answerUnavailableTitle: 'Svar ikke tilgængeligt',
  answerUnavailableMissing: 'Denne sætning mangler sin svarnøgle. Tryk venligst på Næste sætning for at få en ny.',
  answerUnavailableTryAgain: 'Jeg kunne ikke afsløre dette svar. Prøv venligst igen eller tryk på Næste sætning.',

  reportAiTitle: 'Rapporter AI-svar',
  reportAiPrompt: 'Hvilket problem fandt du?',
  reportAiInaccurate: 'Unøjagtigt',
  reportAiOffensive: 'Kulturelt ufølsomt',
  reportedTitle: 'Rapporteret',
  reportedThanksReview: 'Tak. Vi gennemgår dette.',
  reportedThanksSerious: 'Tak. Vi tager dette alvorligt.',
};

const nl: TrainerStrings = {
  toEnglish: '→ Engels',

  sentenceLengthHeader: 'Zinslengte',
  lengthShort: 'Kort',
  lengthMedium: 'Middel',
  lengthLong: 'Lang',
  lengthShortDesc: '3-6 woorden',
  lengthMediumDesc: '7-12 woorden',
  lengthLongDesc: '13-20 woorden',

  customRequestPlaceholder: "Aangepast verzoek… (bijv. 'Verleden tijd over eten')",
  customTopicRequest: 'Aangepast onderwerpverzoek',
  customRequestHint: 'Typ een specifiek onderwerp of grammaticafocus voor de volgende zin',

  newSentenceHint: 'Genereert een nieuwe zin om te vertalen',
  startSessionHint: 'Start een nieuwe vertaaloefen-sessie',

  opensSettingsHint: 'Opent taal- en niveau-instellingen',

  retryBadge: '🔁 HERHAAL',
  retrySentenceA11y: 'Herhaalzin. Je had eerder moeite met deze.',
  bankBadge: '📚 Bank',
  topicLabel: 'Onderwerp: {topic}',
  topicLabelBank: 'Onderwerp: {topic}, uit oefenbank',
  translateThis: 'Vertaal deze zin naar het Engels: {sentence}',
  typeTranslationHint: 'Typ je vertaling van de zin hierboven',
  voiceInputUnavailable: 'Spraakinvoer niet beschikbaar voor jouw taal',
  voiceNotice: 'Spraakinvoer is niet beschikbaar voor sprekers van {language} in de Vertaaltrainer. Je kunt het nog wel gebruiken in de Plaatsingstoets.',

  hintScorePenalty: '(-20)',
  hintStartsWith: "Begint met: \"{word}…\"",
  hintUnavailable: 'Hint niet beschikbaar - doe je best!',
  hintPenaltySuffix: ' (-20 hint-straf)',
  revealNoScore: 'Antwoord is onthuld - geen punten toegekend.',
  revealClueHint: 'Onthult een aanwijzing. Beperkt je score tot 80.',
  revealAnswerHint: 'Onthult het antwoord zonder punten toe te kennen',
  submitTranslationHint: 'Verzendt je vertaling voor beoordeling',

  earnedXp: '{xp} ervaringspunten verdiend',
  tapHint: 'Tik',
  saveToVaultPrompt: 'Tik om op te slaan in je Woordenschatkluis:',
  fullPhrase: 'VOLLEDIGE FRASE',

  aiIntroMessage: 'Hoi! Ik kan helpen grammaticaregels uit te leggen. Wat wil je weten?',
  polyPuffTyping: 'Poly-Puff is aan het typen',
  askAboutGrammarPlaceholder: 'Vraag over grammatica…',
  askGrammarQuestion: 'Stel Poly-Puff een grammaticavraag',
  sendMessage: 'Bericht verzenden',
  reportAiResponseA11y: 'Rapporteer dit AI-antwoord',
  youSaidA11y: 'Jij zei: {text}',
  aiResponseA11y: '{brand}, AI-antwoord: {text}',
  chatError: 'Sorry, ik had moeite met antwoorden. Probeer opnieuw!',

  closeSettings: 'Instellingen sluiten',

  selectCefrLevelA11y: 'Selecteer CEFR-niveau',
  cefrLevelOptionA11y: 'Niveau {l}',
  lengthOptionA11y: '{label} zinnen, {desc}',

  announceLevelSelected: 'CEFR-niveau {level} geselecteerd.',
  announceLengthSelected: '{length} zinslengte geselecteerd.',
  announceRetryReady: 'Herhaalzin. Je had eerder moeite met deze. Probeer opnieuw!',
  announceNewSentence: 'Nieuwe zin klaar. Typ je Engelse vertaling.',
  announceAnswerRevealed: 'Antwoord onthuld: {answer}',

  welcomeBackTitle: '⏸️ Welkom Terug',
  welcomeBackMessage: 'Je hebt een oefening lopen. Wil je doorgaan?',
  startNew: 'Opnieuw beginnen',

  endSessionTitle: 'Sessie beëindigen',
  endSessionMessage: 'Je hebt {exercises} oefeningen voltooid en {xp} XP verdiend in {time}. Sessie beëindigen?',
  endSessionConfirm: 'Sessie beëindigen',

  errorTitle: 'Fout',
  errorGenerate: 'Kon zin niet genereren. Draait je server?',
  errorCheck: 'Kon vertaling niet controleren.',
  errorSaveVault: 'Kon niet opslaan in kluis.',

  alreadyInVault: 'Al in kluis',
  addedTitle: 'Toegevoegd! 🎉',
  addedMessage: '"{phrase}" opgeslagen in je Woordenschatkluis.',

  answerUnavailableTitle: 'Antwoord niet beschikbaar',
  answerUnavailableMissing: 'Bij deze zin ontbreekt het antwoord. Tik op Volgende Zin om een nieuwe te krijgen.',
  answerUnavailableTryAgain: 'Ik kon dit antwoord niet onthullen. Probeer opnieuw of tik op Volgende Zin.',

  reportAiTitle: 'AI-antwoord rapporteren',
  reportAiPrompt: 'Welk probleem heb je gevonden?',
  reportAiInaccurate: 'Onnauwkeurig',
  reportAiOffensive: 'Cultureel ongevoelig',
  reportedTitle: 'Gerapporteerd',
  reportedThanksReview: 'Bedankt. We bekijken dit.',
  reportedThanksSerious: 'Bedankt. We nemen dit serieus.',
};

const fi: TrainerStrings = {
  toEnglish: '→ Englanti',

  sentenceLengthHeader: 'Lauseen pituus',
  lengthShort: 'Lyhyt',
  lengthMedium: 'Keskipitkä',
  lengthLong: 'Pitkä',
  lengthShortDesc: '3-6 sanaa',
  lengthMediumDesc: '7-12 sanaa',
  lengthLongDesc: '13-20 sanaa',

  customRequestPlaceholder: 'Mukautettu pyyntö… (esim. ”Mennyt aikamuoto ruoasta”)',
  customTopicRequest: 'Mukautettu aihepyyntö',
  customRequestHint: 'Kirjoita tietty aihe tai kielioppikohde seuraavalle lauseelle',

  newSentenceHint: 'Luo uuden lauseen käännettäväksi',
  startSessionHint: 'Aloittaa uuden käännösharjoitusistunnon',

  opensSettingsHint: 'Avaa kieli- ja tasoasetukset',

  retryBadge: '🔁 UUDELLEEN',
  retrySentenceA11y: 'Uudelleenyrityslause. Sinulla oli tämän kanssa aiemmin vaikeuksia.',
  bankBadge: '📚 Pankki',
  topicLabel: 'Aihe: {topic}',
  topicLabelBank: 'Aihe: {topic}, harjoituspankista',
  translateThis: 'Käännä tämä lause englanniksi: {sentence}',
  typeTranslationHint: 'Kirjoita käännöksesi yllä olevasta lauseesta',
  voiceInputUnavailable: 'Äänisyöte ei ole saatavilla kielellesi',
  voiceNotice: 'Äänisyöte ei ole saatavilla {language}-puhujille Käännösvalmentajassa. Voit silti käyttää sitä Tasokokeessa.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Alkaa: ”{word}…”',
  hintUnavailable: 'Vihjettä ei saatavilla - yritä parhaasi!',
  hintPenaltySuffix: ' (-20 vihjesakko)',
  revealNoScore: 'Vastaus paljastettu - pisteitä ei myönnetty.',
  revealClueHint: 'Paljastaa vihjeen. Rajoittaa pisteesi 80:een.',
  revealAnswerHint: 'Paljastaa vastauksen ilman pisteitä',
  submitTranslationHint: 'Lähettää käännöksesi arvioitavaksi',

  earnedXp: 'Ansaittu {xp} kokemuspistettä',
  tapHint: 'Napauta',
  saveToVaultPrompt: 'Napauta tallentaaksesi Sanastoholviin:',
  fullPhrase: 'KOKO LAUSE',

  aiIntroMessage: 'Hei! Voin auttaa selittämään kielioppisääntöjä. Mitä haluat tietää?',
  polyPuffTyping: 'Poly-Puff kirjoittaa',
  askAboutGrammarPlaceholder: 'Kysy kieliopista…',
  askGrammarQuestion: 'Kysy Poly-Puffilta kielioppikysymys',
  sendMessage: 'Lähetä viesti',
  reportAiResponseA11y: 'Ilmoita tämä tekoälyn vastaus',
  youSaidA11y: 'Sanoit: {text}',
  aiResponseA11y: '{brand}, tekoälyn vastaus: {text}',
  chatError: 'Anteeksi, minulla oli vaikeuksia vastata. Yritä uudelleen!',

  closeSettings: 'Sulje asetukset',

  selectCefrLevelA11y: 'Valitse CEFR-taso',
  cefrLevelOptionA11y: 'Taso {l}',
  lengthOptionA11y: 'Lauseet: {label}, {desc}',

  announceLevelSelected: 'CEFR-taso {level} valittu.',
  announceLengthSelected: 'Lauseen pituus {length} valittu.',
  announceRetryReady: 'Uudelleenyrityslause. Sinulla oli tämän kanssa aiemmin vaikeuksia. Yritä uudelleen!',
  announceNewSentence: 'Uusi lause valmis. Kirjoita englanninkielinen käännöksesi.',
  announceAnswerRevealed: 'Vastaus paljastettu: {answer}',

  welcomeBackTitle: '⏸️ Tervetuloa takaisin',
  welcomeBackMessage: 'Sinulla on harjoitus käynnissä. Haluatko jatkaa?',
  startNew: 'Aloita uusi',

  endSessionTitle: 'Lopeta istunto',
  endSessionMessage: 'Suoritit {exercises} harjoitusta ja ansaitsit {xp} XP ajassa {time}. Lopeta istunto?',
  endSessionConfirm: 'Lopeta istunto',

  errorTitle: 'Virhe',
  errorGenerate: 'Lauseen luonti epäonnistui. Onko palvelimesi käynnissä?',
  errorCheck: 'Käännöksen tarkistus epäonnistui.',
  errorSaveVault: 'Holviin tallennus epäonnistui.',

  alreadyInVault: 'Jo holvissa',
  addedTitle: 'Lisätty! 🎉',
  addedMessage: '”{phrase}” tallennettu Sanastoholviisi.',

  answerUnavailableTitle: 'Vastaus ei saatavilla',
  answerUnavailableMissing: 'Tästä lauseesta puuttuu vastaus. Napauta Seuraava lause saadaksesi uuden.',
  answerUnavailableTryAgain: 'En voinut paljastaa tätä vastausta. Yritä uudelleen tai napauta Seuraava lause.',

  reportAiTitle: 'Ilmoita tekoälyn vastaus',
  reportAiPrompt: 'Mitä ongelmaa havaitsit?',
  reportAiInaccurate: 'Epätarkka',
  reportAiOffensive: 'Kulttuurisesti epäherkkä',
  reportedTitle: 'Ilmoitettu',
  reportedThanksReview: 'Kiitos. Tutkimme tätä.',
  reportedThanksSerious: 'Kiitos. Otamme tämän vakavasti.',
};

const fr: TrainerStrings = {
  toEnglish: '→ Anglais',

  sentenceLengthHeader: 'Longueur de la phrase',
  lengthShort: 'Courte',
  lengthMedium: 'Moyenne',
  lengthLong: 'Longue',
  lengthShortDesc: '3-6 mots',
  lengthMediumDesc: '7-12 mots',
  lengthLongDesc: '13-20 mots',

  customRequestPlaceholder: "Demande personnalisée… (par ex. « Passé sur la nourriture »)",
  customTopicRequest: 'Demande de sujet personnalisé',
  customRequestHint: 'Saisissez un sujet ou un point de grammaire spécifique pour la phrase suivante',

  newSentenceHint: 'Génère une nouvelle phrase à traduire',
  startSessionHint: 'Démarre une nouvelle session d’entraînement à la traduction',

  opensSettingsHint: 'Ouvre les paramètres de langue et de niveau',

  retryBadge: '🔁 RÉESSAYER',
  retrySentenceA11y: 'Phrase à refaire. Vous avez eu des difficultés avec celle-ci.',
  bankBadge: '📚 Banque',
  topicLabel: 'Sujet : {topic}',
  topicLabelBank: 'Sujet : {topic}, depuis la banque d’exercices',
  translateThis: 'Traduisez cette phrase en anglais : {sentence}',
  typeTranslationHint: 'Saisissez votre traduction de la phrase ci-dessus',
  voiceInputUnavailable: 'Saisie vocale non disponible pour votre langue',
  voiceNotice: 'La saisie vocale n’est pas disponible pour les locuteurs de {language} dans l’Entraîneur de traduction. Vous pouvez toujours l’utiliser dans le Test de niveau.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Commence par : « {word}… »',
  hintUnavailable: 'Indice non disponible - faites de votre mieux !',
  hintPenaltySuffix: ' (pénalité d’indice -20)',
  revealNoScore: 'Réponse révélée - aucun point attribué.',
  revealClueHint: 'Révèle un indice. Plafonne votre score à 80.',
  revealAnswerHint: 'Révèle la réponse sans attribuer de points',
  submitTranslationHint: 'Soumet votre traduction pour évaluation',

  earnedXp: '{xp} points d’expérience gagnés',
  tapHint: 'Appuyer',
  saveToVaultPrompt: 'Appuyez pour enregistrer dans votre Coffre de vocabulaire :',
  fullPhrase: 'PHRASE COMPLÈTE',

  aiIntroMessage: 'Salut ! Je peux aider à expliquer les règles de grammaire. Que veux-tu savoir ?',
  polyPuffTyping: 'Poly-Puff écrit',
  askAboutGrammarPlaceholder: 'Pose une question sur la grammaire…',
  askGrammarQuestion: 'Pose une question de grammaire à Poly-Puff',
  sendMessage: 'Envoyer un message',
  reportAiResponseA11y: 'Signaler cette réponse de l’IA',
  youSaidA11y: 'Vous avez dit : {text}',
  aiResponseA11y: '{brand}, réponse de l’IA : {text}',
  chatError: 'Désolé, j’ai eu du mal à répondre. Réessaie !',

  closeSettings: 'Fermer les paramètres',

  selectCefrLevelA11y: 'Sélectionner le niveau CEFR',
  cefrLevelOptionA11y: 'Niveau {l}',
  lengthOptionA11y: 'Phrases {label}, {desc}',

  announceLevelSelected: 'Niveau CEFR {level} sélectionné.',
  announceLengthSelected: 'Longueur de phrase {length} sélectionnée.',
  announceRetryReady: 'Phrase à refaire. Vous avez eu des difficultés avec celle-ci. Réessayez !',
  announceNewSentence: 'Nouvelle phrase prête. Saisissez votre traduction en anglais.',
  announceAnswerRevealed: 'Réponse révélée : {answer}',

  welcomeBackTitle: '⏸️ Bon retour',
  welcomeBackMessage: 'Vous avez un exercice en cours. Voulez-vous continuer ?',
  startNew: 'Recommencer',

  endSessionTitle: 'Terminer la session',
  endSessionMessage: 'Vous avez terminé {exercises} exercices et gagné {xp} XP en {time}. Terminer la session ?',
  endSessionConfirm: 'Terminer la session',

  errorTitle: 'Erreur',
  errorGenerate: 'Échec de la génération de la phrase. Votre serveur fonctionne-t-il ?',
  errorCheck: 'Échec de la vérification de la traduction.',
  errorSaveVault: 'Impossible d’enregistrer dans le coffre.',

  alreadyInVault: 'Déjà dans le coffre',
  addedTitle: 'Ajouté ! 🎉',
  addedMessage: '« {phrase} » enregistré dans votre Coffre de vocabulaire.',

  answerUnavailableTitle: 'Réponse indisponible',
  answerUnavailableMissing: 'Cette phrase n’a pas de réponse. Veuillez appuyer sur Phrase suivante pour en obtenir une nouvelle.',
  answerUnavailableTryAgain: 'Je n’ai pas pu révéler cette réponse. Réessayez ou appuyez sur Phrase suivante.',

  reportAiTitle: 'Signaler la réponse de l’IA',
  reportAiPrompt: 'Quel problème avez-vous trouvé ?',
  reportAiInaccurate: 'Inexact',
  reportAiOffensive: 'Culturellement insensible',
  reportedTitle: 'Signalé',
  reportedThanksReview: 'Merci. Nous allons examiner cela.',
  reportedThanksSerious: 'Merci. Nous prenons cela au sérieux.',
};

const de: TrainerStrings = {
  toEnglish: '→ Englisch',

  sentenceLengthHeader: 'Satzlänge',
  lengthShort: 'Kurz',
  lengthMedium: 'Mittel',
  lengthLong: 'Lang',
  lengthShortDesc: '3-6 Wörter',
  lengthMediumDesc: '7-12 Wörter',
  lengthLongDesc: '13-20 Wörter',

  customRequestPlaceholder: 'Eigene Anfrage… (z. B. „Vergangenheit zum Thema Essen")',
  customTopicRequest: 'Eigene Themenanfrage',
  customRequestHint: 'Gib ein bestimmtes Thema oder Grammatikziel für den nächsten Satz ein',

  newSentenceHint: 'Erstellt einen neuen Satz zum Übersetzen',
  startSessionHint: 'Startet eine neue Übersetzungstrainingseinheit',

  opensSettingsHint: 'Öffnet Sprach- und Stufeneinstellungen',

  retryBadge: '🔁 WIEDERHOLEN',
  retrySentenceA11y: 'Wiederholungssatz. Du hattest zuvor Schwierigkeiten damit.',
  bankBadge: '📚 Bank',
  topicLabel: 'Thema: {topic}',
  topicLabelBank: 'Thema: {topic}, aus Übungsbank',
  translateThis: 'Übersetze diesen Satz ins Englische: {sentence}',
  typeTranslationHint: 'Tippe deine Übersetzung des obigen Satzes ein',
  voiceInputUnavailable: 'Spracheingabe für deine Sprache nicht verfügbar',
  voiceNotice: 'Spracheingabe ist im Übersetzungstrainer für {language}-Sprecher nicht verfügbar. Im Einstufungstest kannst du sie weiterhin verwenden.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Beginnt mit: „{word}…"',
  hintUnavailable: 'Hinweis nicht verfügbar - gib dein Bestes!',
  hintPenaltySuffix: ' (-20 Hinweisstrafe)',
  revealNoScore: 'Antwort wurde aufgedeckt - keine Punkte vergeben.',
  revealClueHint: 'Zeigt einen Hinweis. Begrenzt deine Punktzahl auf 80.',
  revealAnswerHint: 'Zeigt die Antwort ohne Punktevergabe',
  submitTranslationHint: 'Reicht deine Übersetzung zur Bewertung ein',

  earnedXp: '{xp} Erfahrungspunkte erhalten',
  tapHint: 'Tippen',
  saveToVaultPrompt: 'Tippe, um im Wortschatztresor zu speichern:',
  fullPhrase: 'GANZE PHRASE',

  aiIntroMessage: 'Hallo! Ich kann Grammatikregeln erklären. Was möchtest du wissen?',
  polyPuffTyping: 'Poly-Puff tippt',
  askAboutGrammarPlaceholder: 'Frag zur Grammatik…',
  askGrammarQuestion: 'Stell Poly-Puff eine Grammatikfrage',
  sendMessage: 'Nachricht senden',
  reportAiResponseA11y: 'Diese KI-Antwort melden',
  youSaidA11y: 'Du hast gesagt: {text}',
  aiResponseA11y: '{brand}, KI-Antwort: {text}',
  chatError: 'Entschuldigung, ich hatte Probleme beim Antworten. Versuch es erneut!',

  closeSettings: 'Einstellungen schließen',

  selectCefrLevelA11y: 'CEFR-Stufe wählen',
  cefrLevelOptionA11y: 'Stufe {l}',
  lengthOptionA11y: '{label} Sätze, {desc}',

  announceLevelSelected: 'CEFR-Stufe {level} ausgewählt.',
  announceLengthSelected: 'Satzlänge {length} ausgewählt.',
  announceRetryReady: 'Wiederholungssatz. Du hattest zuvor Schwierigkeiten damit. Versuch es erneut!',
  announceNewSentence: 'Neuer Satz bereit. Tippe deine englische Übersetzung ein.',
  announceAnswerRevealed: 'Antwort aufgedeckt: {answer}',

  welcomeBackTitle: '⏸️ Willkommen zurück',
  welcomeBackMessage: 'Du hast eine laufende Übung. Möchtest du fortfahren?',
  startNew: 'Neu starten',

  endSessionTitle: 'Sitzung beenden',
  endSessionMessage: 'Du hast {exercises} Übungen abgeschlossen und {xp} XP in {time} verdient. Sitzung beenden?',
  endSessionConfirm: 'Sitzung beenden',

  errorTitle: 'Fehler',
  errorGenerate: 'Satz konnte nicht erstellt werden. Läuft dein Server?',
  errorCheck: 'Übersetzung konnte nicht überprüft werden.',
  errorSaveVault: 'Konnte nicht im Tresor gespeichert werden.',

  alreadyInVault: 'Bereits im Tresor',
  addedTitle: 'Hinzugefügt! 🎉',
  addedMessage: '„{phrase}" in deinem Wortschatztresor gespeichert.',

  answerUnavailableTitle: 'Antwort nicht verfügbar',
  answerUnavailableMissing: 'Diesem Satz fehlt der Antwortschlüssel. Tippe auf Nächster Satz, um einen neuen zu erhalten.',
  answerUnavailableTryAgain: 'Ich konnte diese Antwort nicht zeigen. Versuch es erneut oder tippe auf Nächster Satz.',

  reportAiTitle: 'KI-Antwort melden',
  reportAiPrompt: 'Welches Problem hast du gefunden?',
  reportAiInaccurate: 'Ungenau',
  reportAiOffensive: 'Kulturell unsensibel',
  reportedTitle: 'Gemeldet',
  reportedThanksReview: 'Danke. Wir werden das prüfen.',
  reportedThanksSerious: 'Danke. Wir nehmen das ernst.',
};

const el: TrainerStrings = {
  toEnglish: '→ Αγγλικά',

  sentenceLengthHeader: 'Μήκος πρότασης',
  lengthShort: 'Σύντομη',
  lengthMedium: 'Μέτρια',
  lengthLong: 'Μακρά',
  lengthShortDesc: '3-6 λέξεις',
  lengthMediumDesc: '7-12 λέξεις',
  lengthLongDesc: '13-20 λέξεις',

  customRequestPlaceholder: 'Προσαρμοσμένο αίτημα… (π.χ. «Παρελθόντας χρόνος για φαγητό»)',
  customTopicRequest: 'Προσαρμοσμένο αίτημα θέματος',
  customRequestHint: 'Πληκτρολογήστε συγκεκριμένο θέμα ή γραμματικό στόχο για την επόμενη πρόταση',

  newSentenceHint: 'Δημιουργεί νέα πρόταση προς μετάφραση',
  startSessionHint: 'Ξεκινά νέα συνεδρία εξάσκησης μετάφρασης',

  opensSettingsHint: 'Ανοίγει τις ρυθμίσεις γλώσσας και επιπέδου',

  retryBadge: '🔁 ΕΠΑΝΑΛΗΨΗ',
  retrySentenceA11y: 'Πρόταση επανάληψης. Είχατε δυσκολευτεί ξανά με αυτή.',
  bankBadge: '📚 Τράπεζα',
  topicLabel: 'Θέμα: {topic}',
  topicLabelBank: 'Θέμα: {topic}, από την τράπεζα ασκήσεων',
  translateThis: 'Μεταφράστε αυτήν την πρόταση στα Αγγλικά: {sentence}',
  typeTranslationHint: 'Πληκτρολογήστε τη μετάφρασή σας για την παραπάνω πρόταση',
  voiceInputUnavailable: 'Η φωνητική εισαγωγή δεν είναι διαθέσιμη για τη γλώσσα σας',
  voiceNotice: 'Η φωνητική εισαγωγή δεν είναι διαθέσιμη για ομιλητές της {language} στον Προπονητή Μετάφρασης. Μπορείτε ωστόσο να τη χρησιμοποιήσετε στο Τεστ κατάταξης.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Αρχίζει με: «{word}…»',
  hintUnavailable: 'Η υπόδειξη δεν είναι διαθέσιμη - δώστε τον καλύτερό σας εαυτό!',
  hintPenaltySuffix: ' (-20 ποινή υπόδειξης)',
  revealNoScore: 'Η απάντηση αποκαλύφθηκε - δεν δόθηκαν βαθμοί.',
  revealClueHint: 'Αποκαλύπτει μια υπόδειξη. Περιορίζει τη βαθμολογία σας στο 80.',
  revealAnswerHint: 'Αποκαλύπτει την απάντηση χωρίς βαθμολογία',
  submitTranslationHint: 'Υποβάλλει τη μετάφρασή σας για βαθμολόγηση',

  earnedXp: 'Κερδίσατε {xp} πόντους εμπειρίας',
  tapHint: 'Πατήστε',
  saveToVaultPrompt: 'Πατήστε για αποθήκευση στο Θησαυρό Λεξιλογίου:',
  fullPhrase: 'ΠΛΗΡΗΣ ΦΡΑΣΗ',

  aiIntroMessage: 'Γεια! Μπορώ να σε βοηθήσω να εξηγήσω γραμματικούς κανόνες. Τι θα ήθελες να μάθεις;',
  polyPuffTyping: 'Ο Poly-Puff πληκτρολογεί',
  askAboutGrammarPlaceholder: 'Ρωτήστε για τη γραμματική…',
  askGrammarQuestion: 'Κάντε στον Poly-Puff μια ερώτηση γραμματικής',
  sendMessage: 'Αποστολή μηνύματος',
  reportAiResponseA11y: 'Αναφορά αυτής της απάντησης τεχνητής νοημοσύνης',
  youSaidA11y: 'Είπατε: {text}',
  aiResponseA11y: '{brand}, απάντηση AI: {text}',
  chatError: 'Συγγνώμη, είχα πρόβλημα στην απάντηση. Δοκίμασε ξανά!',

  closeSettings: 'Κλείσιμο ρυθμίσεων',

  selectCefrLevelA11y: 'Επιλέξτε επίπεδο CEFR',
  cefrLevelOptionA11y: 'Επίπεδο {l}',
  lengthOptionA11y: '{label} προτάσεις, {desc}',

  announceLevelSelected: 'Επιλέχθηκε επίπεδο CEFR {level}.',
  announceLengthSelected: 'Επιλέχθηκε μήκος πρότασης {length}.',
  announceRetryReady: 'Πρόταση επανάληψης. Είχατε δυσκολευτεί ξανά με αυτή. Δοκιμάστε ξανά!',
  announceNewSentence: 'Νέα πρόταση έτοιμη. Πληκτρολογήστε την αγγλική σας μετάφραση.',
  announceAnswerRevealed: 'Απάντηση αποκαλύφθηκε: {answer}',

  welcomeBackTitle: '⏸️ Καλώς ορίσατε ξανά',
  welcomeBackMessage: 'Έχετε άσκηση σε εξέλιξη. Θέλετε να συνεχίσετε;',
  startNew: 'Νέα έναρξη',

  endSessionTitle: 'Λήξη συνεδρίας',
  endSessionMessage: 'Ολοκληρώσατε {exercises} ασκήσεις και κερδίσατε {xp} XP σε {time}. Λήξη συνεδρίας;',
  endSessionConfirm: 'Λήξη συνεδρίας',

  errorTitle: 'Σφάλμα',
  errorGenerate: 'Αποτυχία δημιουργίας πρότασης. Λειτουργεί ο διακομιστής σας;',
  errorCheck: 'Αποτυχία ελέγχου μετάφρασης.',
  errorSaveVault: 'Δεν ήταν δυνατή η αποθήκευση στον θησαυρό.',

  alreadyInVault: 'Ήδη στον θησαυρό',
  addedTitle: 'Προστέθηκε! 🎉',
  addedMessage: '«{phrase}» αποθηκεύτηκε στον Θησαυρό Λεξιλογίου σας.',

  answerUnavailableTitle: 'Η απάντηση δεν είναι διαθέσιμη',
  answerUnavailableMissing: 'Αυτή η πρόταση δεν έχει απάντηση. Πατήστε Επόμενη πρόταση για να λάβετε μια νέα.',
  answerUnavailableTryAgain: 'Δεν μπόρεσα να αποκαλύψω αυτή την απάντηση. Δοκιμάστε ξανά ή πατήστε Επόμενη πρόταση.',

  reportAiTitle: 'Αναφορά απάντησης AI',
  reportAiPrompt: 'Τι πρόβλημα βρήκατε;',
  reportAiInaccurate: 'Ανακριβές',
  reportAiOffensive: 'Πολιτισμικά αναίσθητο',
  reportedTitle: 'Αναφέρθηκε',
  reportedThanksReview: 'Ευχαριστούμε. Θα το εξετάσουμε.',
  reportedThanksSerious: 'Ευχαριστούμε. Το παίρνουμε σοβαρά.',
};

const gu: TrainerStrings = {
  toEnglish: '→ અંગ્રેજી',

  sentenceLengthHeader: 'વાક્ય લંબાઈ',
  lengthShort: 'ટૂંકું',
  lengthMedium: 'મધ્યમ',
  lengthLong: 'લાંબું',
  lengthShortDesc: '3-6 શબ્દો',
  lengthMediumDesc: '7-12 શબ્દો',
  lengthLongDesc: '13-20 શબ્દો',

  customRequestPlaceholder: 'કસ્ટમ વિનંતી… (દા.ત. \'ખોરાક વિશે ભૂતકાળ\')',
  customTopicRequest: 'કસ્ટમ વિષય વિનંતી',
  customRequestHint: 'આગલા વાક્ય માટે ચોક્કસ વિષય અથવા વ્યાકરણ ફોકસ ટાઈપ કરો',

  newSentenceHint: 'અનુવાદ કરવા માટે નવું વાક્ય બનાવે છે',
  startSessionHint: 'નવું અનુવાદ અભ્યાસ સત્ર શરૂ કરે છે',

  opensSettingsHint: 'ભાષા અને સ્તર સેટિંગ્સ ખોલે છે',

  retryBadge: '🔁 પુનઃપ્રયાસ',
  retrySentenceA11y: 'પુનઃપ્રયાસ વાક્ય. તમે પહેલા આની સાથે સંઘર્ષ કર્યો હતો.',
  bankBadge: '📚 બેંક',
  topicLabel: 'વિષય: {topic}',
  topicLabelBank: 'વિષય: {topic}, અભ્યાસ બેંકમાંથી',
  translateThis: 'આ વાક્યનું અંગ્રેજીમાં ભાષાંતર કરો: {sentence}',
  typeTranslationHint: 'ઉપરના વાક્યનું તમારું ભાષાંતર ટાઈપ કરો',
  voiceInputUnavailable: 'તમારી ભાષા માટે વૉઇસ ઇનપુટ ઉપલબ્ધ નથી',
  voiceNotice: 'અનુવાદ તાલીમકારમાં {language} બોલનારાઓ માટે વૉઇસ ઇનપુટ ઉપલબ્ધ નથી. તમે હજુ પણ સ્થાનનિર્ધારણ કસોટીમાં તેનો ઉપયોગ કરી શકો છો.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'આનાથી શરૂ થાય છે: "{word}…"',
  hintUnavailable: 'સંકેત ઉપલબ્ધ નથી - શ્રેષ્ઠ પ્રયાસ કરો!',
  hintPenaltySuffix: ' (-20 સંકેત દંડ)',
  revealNoScore: 'જવાબ જાહેર થયો - કોઈ સ્કોર આપવામાં આવ્યો નથી.',
  revealClueHint: 'એક સંકેત જાહેર કરે છે. તમારો સ્કોર 80 પર મર્યાદિત કરે છે.',
  revealAnswerHint: 'સ્કોર વગર જવાબ જાહેર કરે છે',
  submitTranslationHint: 'ગ્રેડિંગ માટે તમારું ભાષાંતર સબમિટ કરે છે',

  earnedXp: '{xp} અનુભવ પોઈન્ટ્સ મેળવ્યા',
  tapHint: 'ટેપ કરો',
  saveToVaultPrompt: 'તમારી શબ્દભંડોળ તિજોરીમાં સાચવવા માટે ટેપ કરો:',
  fullPhrase: 'સંપૂર્ણ વાક્યાંશ',

  aiIntroMessage: 'નમસ્તે! હું વ્યાકરણના નિયમો સમજાવવામાં મદદ કરી શકું છું. તમે શું જાણવા માંગો છો?',
  polyPuffTyping: 'Poly-Puff ટાઈપ કરી રહ્યું છે',
  askAboutGrammarPlaceholder: 'વ્યાકરણ વિશે પૂછો…',
  askGrammarQuestion: 'Poly-Puffને વ્યાકરણ પ્રશ્ન પૂછો',
  sendMessage: 'સંદેશ મોકલો',
  reportAiResponseA11y: 'આ AI પ્રતિસાદની જાણ કરો',
  youSaidA11y: 'તમે કહ્યું: {text}',
  aiResponseA11y: '{brand}, AI પ્રતિસાદ: {text}',
  chatError: 'માફ કરશો, જવાબ આપવામાં મુશ્કેલી પડી. ફરી પ્રયત્ન કરો!',

  closeSettings: 'સેટિંગ્સ બંધ કરો',

  selectCefrLevelA11y: 'CEFR સ્તર પસંદ કરો',
  cefrLevelOptionA11y: 'સ્તર {l}',
  lengthOptionA11y: '{label} વાક્યો, {desc}',

  announceLevelSelected: 'CEFR સ્તર {level} પસંદ કર્યું.',
  announceLengthSelected: '{length} વાક્ય લંબાઈ પસંદ કરી.',
  announceRetryReady: 'પુનઃપ્રયાસ વાક્ય. તમે પહેલા આની સાથે સંઘર્ષ કર્યો હતો. ફરી પ્રયત્ન કરો!',
  announceNewSentence: 'નવું વાક્ય તૈયાર. તમારું અંગ્રેજી ભાષાંતર ટાઈપ કરો.',
  announceAnswerRevealed: 'જવાબ જાહેર: {answer}',

  welcomeBackTitle: '⏸️ સ્વાગત છે',
  welcomeBackMessage: 'તમારી પાસે એક અભ્યાસ ચાલુ છે. શું તમે ચાલુ રાખવા માંગો છો?',
  startNew: 'નવેસરથી શરૂ કરો',

  endSessionTitle: 'સત્ર સમાપ્ત કરો',
  endSessionMessage: 'તમે {exercises} અભ્યાસો પૂર્ણ કર્યા અને {time}માં {xp} XP મેળવ્યા. સત્ર સમાપ્ત કરો?',
  endSessionConfirm: 'સત્ર સમાપ્ત કરો',

  errorTitle: 'ભૂલ',
  errorGenerate: 'વાક્ય બનાવવામાં નિષ્ફળ. શું તમારું સર્વર ચાલી રહ્યું છે?',
  errorCheck: 'ભાષાંતર તપાસવામાં નિષ્ફળ.',
  errorSaveVault: 'તિજોરીમાં સાચવી શકાયું નહીં.',

  alreadyInVault: 'પહેલેથી તિજોરીમાં',
  addedTitle: 'ઉમેર્યું! 🎉',
  addedMessage: '"{phrase}" તમારી શબ્દભંડોળ તિજોરીમાં સાચવ્યું.',

  answerUnavailableTitle: 'જવાબ ઉપલબ્ધ નથી',
  answerUnavailableMissing: 'આ વાક્યનો જવાબ ખૂટે છે. નવું મેળવવા માટે કૃપા કરીને આગલું વાક્ય ટેપ કરો.',
  answerUnavailableTryAgain: 'હું આ જવાબ જાહેર કરી શક્યો નથી. કૃપા કરીને ફરી પ્રયત્ન કરો અથવા આગલું વાક્ય ટેપ કરો.',

  reportAiTitle: 'AI પ્રતિસાદની જાણ કરો',
  reportAiPrompt: 'તમને કયો પ્રશ્ન મળ્યો?',
  reportAiInaccurate: 'અયોગ્ય',
  reportAiOffensive: 'સાંસ્કૃતિક રીતે અસંવેદનશીલ',
  reportedTitle: 'જાણ કરી',
  reportedThanksReview: 'આભાર. અમે આની સમીક્ષા કરીશું.',
  reportedThanksSerious: 'આભાર. અમે આને ગંભીરતાથી લઈએ છીએ.',
};

const ha: TrainerStrings = {
  toEnglish: '→ Turanci',

  sentenceLengthHeader: 'Tsawon jumla',
  lengthShort: 'Gajere',
  lengthMedium: 'Matsakaici',
  lengthLong: 'Dogo',
  lengthShortDesc: 'Kalmomi 3-6',
  lengthMediumDesc: 'Kalmomi 7-12',
  lengthLongDesc: 'Kalmomi 13-20',

  customRequestPlaceholder: "Buƙatar musamman… (misali 'Lokacin da ya wuce game da abinci')",
  customTopicRequest: 'Buƙatar batun musamman',
  customRequestHint: 'Rubuta takamaiman batu ko mayar da hankali kan nahawu don jumlar gaba',

  newSentenceHint: 'Yana ƙirƙirar sabuwar jumla don a fassara',
  startSessionHint: 'Yana fara sabon zaman aikin fassara',

  opensSettingsHint: 'Yana buɗe saitin harshe da matakai',

  retryBadge: '🔁 SAKE',
  retrySentenceA11y: 'Jumla ta sake gwadawa. Ka taɓa fama da wannan.',
  bankBadge: '📚 Banki',
  topicLabel: 'Batun: {topic}',
  topicLabelBank: 'Batun: {topic}, daga bankin koyon aiki',
  translateThis: 'Fassara wannan jumla zuwa Turanci: {sentence}',
  typeTranslationHint: 'Rubuta fassarar ku ta jumlar da ke sama',
  voiceInputUnavailable: 'Shigarwar murya ba ta samuwa don harshen ku ba',
  voiceNotice: 'Shigarwar murya ba ta samuwa ga masu magana da {language} a cikin Mai Horarwa kan Fassara. Har yanzu zaku iya amfani da shi a cikin Gwajin Tantancewa.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Yana farawa da: "{word}…"',
  hintUnavailable: 'Shawara ba ta samuwa - gwada mafi kyau!',
  hintPenaltySuffix: ' (-20 ladar shawara)',
  revealNoScore: 'An bayyana amsar - ba a ba da makin ba.',
  revealClueHint: 'Yana bayyana alama. Yana iyakance makin ku zuwa 80.',
  revealAnswerHint: 'Yana bayyana amsar ba tare da makin ba',
  submitTranslationHint: 'Yana mika fassararku don tantancewa',

  earnedXp: 'An sami maki na gwaninta {xp}',
  tapHint: 'Danna',
  saveToVaultPrompt: 'Danna don adanawa cikin Ɗakin ajiyar ƙamus:',
  fullPhrase: 'CIKAKKEN JUMLA',

  aiIntroMessage: 'Sannu! Zan iya taimakawa wajen bayyana ƙa\'idodin nahawu. Me kake son sani?',
  polyPuffTyping: 'Poly-Puff yana rubutawa',
  askAboutGrammarPlaceholder: 'Tambaya game da nahawu…',
  askGrammarQuestion: 'Tambayi Poly-Puff tambayar nahawu',
  sendMessage: 'Aika saƙo',
  reportAiResponseA11y: 'Bayar da rahoton wannan amsar AI',
  youSaidA11y: 'Ka ce: {text}',
  aiResponseA11y: '{brand}, amsar AI: {text}',
  chatError: 'Yi haƙuri, na sami matsala wajen amsa. Sake gwadawa!',

  closeSettings: 'Rufe saitunan',

  selectCefrLevelA11y: 'Zaɓi matakin CEFR',
  cefrLevelOptionA11y: 'Mataki {l}',
  lengthOptionA11y: 'Jumloli {label}, {desc}',

  announceLevelSelected: 'An zaɓi matakin CEFR {level}.',
  announceLengthSelected: 'An zaɓi tsawon jumla {length}.',
  announceRetryReady: 'Jumla ta sake gwadawa. Ka taɓa fama da wannan. Sake gwadawa!',
  announceNewSentence: 'Sabuwar jumla a shirye. Rubuta fassarar ku ta Turanci.',
  announceAnswerRevealed: 'An bayyana amsa: {answer}',

  welcomeBackTitle: '⏸️ Barka da dawowa',
  welcomeBackMessage: 'Kana da aiki ya tafi. Kuna so ku ci gaba?',
  startNew: 'Fara sabo',

  endSessionTitle: 'Ƙare zama',
  endSessionMessage: 'Kun gama aikace-aikace {exercises} kuma kun sami {xp} XP a cikin {time}. Ƙare zama?',
  endSessionConfirm: 'Ƙare zama',

  errorTitle: 'Kuskure',
  errorGenerate: 'Ƙirƙirar jumla ta kasa. Shin uwar garken ku tana aiki?',
  errorCheck: 'Bincike fassarar ta kasa.',
  errorSaveVault: 'Ba a iya ajiye a ɗaki ba.',

  alreadyInVault: 'Tuni a cikin ɗaki',
  addedTitle: 'An ƙara! 🎉',
  addedMessage: '"{phrase}" an ajiye a cikin Ɗakin ajiyar ƙamus.',

  answerUnavailableTitle: 'Amsa ba ta samuwa',
  answerUnavailableMissing: 'Wannan jumla ta rasa amsarta. Da fatan za a danna Jumla mai zuwa don samun sabuwar.',
  answerUnavailableTryAgain: 'Ban iya bayyana wannan amsar ba. Da fatan za a sake gwadawa ko danna Jumla mai zuwa.',

  reportAiTitle: 'Bayar da rahoton amsar AI',
  reportAiPrompt: 'Wace matsala ka samu?',
  reportAiInaccurate: 'Ba daidai ba',
  reportAiOffensive: 'Mai cin zarafin al\'adu',
  reportedTitle: 'An ba da rahoto',
  reportedThanksReview: 'Na gode. Za mu duba wannan.',
  reportedThanksSerious: 'Na gode. Mun ɗauki wannan da muhimmanci.',
};

// RTL
const he: TrainerStrings = {
  toEnglish: '← אנגלית',

  sentenceLengthHeader: 'אורך משפט',
  lengthShort: 'קצר',
  lengthMedium: 'בינוני',
  lengthLong: 'ארוך',
  lengthShortDesc: '3-6 מילים',
  lengthMediumDesc: '7-12 מילים',
  lengthLongDesc: '13-20 מילים',

  customRequestPlaceholder: 'בקשה מותאמת… (למשל "זמן עבר על אוכל")',
  customTopicRequest: 'בקשת נושא מותאמת',
  customRequestHint: 'הקלד נושא או מיקוד דקדוק ספציפי למשפט הבא',

  newSentenceHint: 'יוצר משפט חדש לתרגם',
  startSessionHint: 'מתחיל מפגש תרגול תרגום חדש',

  opensSettingsHint: 'פותח הגדרות שפה ורמה',

  retryBadge: '🔁 שוב',
  retrySentenceA11y: 'משפט חוזר. התקשית בו קודם.',
  bankBadge: '📚 בנק',
  topicLabel: 'נושא: {topic}',
  topicLabelBank: 'נושא: {topic}, מבנק התרגילים',
  translateThis: 'תרגם את המשפט הזה לאנגלית: {sentence}',
  typeTranslationHint: 'הקלד את התרגום שלך למשפט שלמעלה',
  voiceInputUnavailable: 'קלט קולי אינו זמין לשפה שלך',
  voiceNotice: 'קלט קולי אינו זמין לדוברי {language} במאמן התרגום. עדיין תוכל להשתמש בו במבחן הרמה.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'מתחיל ב: "{word}…"',
  hintUnavailable: 'רמז לא זמין - עשה כמיטב יכולתך!',
  hintPenaltySuffix: ' (קנס רמז 20-)',
  revealNoScore: 'התשובה נחשפה - לא הוענקו נקודות.',
  revealClueHint: 'חושף רמז. מגביל את הציון שלך ל-80.',
  revealAnswerHint: 'חושף את התשובה ללא ניקוד',
  submitTranslationHint: 'שולח את התרגום שלך להערכה',

  earnedXp: 'הרווחת {xp} נקודות ניסיון',
  tapHint: 'הקש',
  saveToVaultPrompt: 'הקש כדי לשמור בכספת אוצר המילים שלך:',
  fullPhrase: 'ביטוי מלא',

  aiIntroMessage: 'שלום! אני יכול לעזור להסביר כללי דקדוק. מה תרצה לדעת?',
  polyPuffTyping: 'Poly-Puff מקליד',
  askAboutGrammarPlaceholder: 'שאל על דקדוק…',
  askGrammarQuestion: 'שאל את Poly-Puff שאלת דקדוק',
  sendMessage: 'שלח הודעה',
  reportAiResponseA11y: 'דווח על תגובת בינה מלאכותית זו',
  youSaidA11y: 'אמרת: {text}',
  aiResponseA11y: '{brand}, תגובת בינה מלאכותית: {text}',
  chatError: 'מצטער, היו לי בעיות לענות. נסה שוב!',

  closeSettings: 'סגור הגדרות',

  selectCefrLevelA11y: 'בחר רמת CEFR',
  cefrLevelOptionA11y: 'רמה {l}',
  lengthOptionA11y: 'משפטים {label}, {desc}',

  announceLevelSelected: 'נבחרה רמת CEFR {level}.',
  announceLengthSelected: 'נבחר אורך משפט {length}.',
  announceRetryReady: 'משפט חוזר. התקשית בו קודם. נסה שוב!',
  announceNewSentence: 'משפט חדש מוכן. הקלד את התרגום באנגלית.',
  announceAnswerRevealed: 'התשובה נחשפה: {answer}',

  welcomeBackTitle: '⏸️ ברוך שובך',
  welcomeBackMessage: 'יש לך תרגיל בעיצומו. האם תרצה להמשיך?',
  startNew: 'התחל מחדש',

  endSessionTitle: 'סיים מפגש',
  endSessionMessage: 'השלמת {exercises} תרגילים והרווחת {xp} XP ב-{time}. לסיים את המפגש?',
  endSessionConfirm: 'סיים מפגש',

  errorTitle: 'שגיאה',
  errorGenerate: 'יצירת המשפט נכשלה. האם השרת שלך פועל?',
  errorCheck: 'בדיקת התרגום נכשלה.',
  errorSaveVault: 'לא ניתן היה לשמור בכספת.',

  alreadyInVault: 'כבר בכספת',
  addedTitle: 'נוסף! 🎉',
  addedMessage: '"{phrase}" נשמר בכספת אוצר המילים שלך.',

  answerUnavailableTitle: 'התשובה אינה זמינה',
  answerUnavailableMissing: 'למשפט זה חסרה תשובה. אנא הקש על משפט הבא כדי לקבל אחד חדש.',
  answerUnavailableTryAgain: 'לא הצלחתי לחשוף תשובה זו. אנא נסה שוב או הקש על משפט הבא.',

  reportAiTitle: 'דווח על תגובת בינה מלאכותית',
  reportAiPrompt: 'איזו בעיה מצאת?',
  reportAiInaccurate: 'לא מדויק',
  reportAiOffensive: 'לא רגיש תרבותית',
  reportedTitle: 'דווח',
  reportedThanksReview: 'תודה. נבדוק את זה.',
  reportedThanksSerious: 'תודה. אנחנו לוקחים את זה ברצינות.',
};

const hi: TrainerStrings = {
  toEnglish: '→ अंग्रेज़ी',

  sentenceLengthHeader: 'वाक्य की लंबाई',
  lengthShort: 'छोटा',
  lengthMedium: 'मध्यम',
  lengthLong: 'लंबा',
  lengthShortDesc: '3-6 शब्द',
  lengthMediumDesc: '7-12 शब्द',
  lengthLongDesc: '13-20 शब्द',

  customRequestPlaceholder: 'कस्टम अनुरोध… (जैसे "खाने के बारे में भूतकाल")',
  customTopicRequest: 'कस्टम विषय अनुरोध',
  customRequestHint: 'अगले वाक्य के लिए विशिष्ट विषय या व्याकरण फ़ोकस टाइप करें',

  newSentenceHint: 'अनुवाद करने के लिए नया वाक्य बनाता है',
  startSessionHint: 'नया अनुवाद अभ्यास सत्र शुरू करता है',

  opensSettingsHint: 'भाषा और स्तर सेटिंग्स खोलता है',

  retryBadge: '🔁 पुनः',
  retrySentenceA11y: 'पुनः वाक्य। आपने पहले इसमें संघर्ष किया था।',
  bankBadge: '📚 बैंक',
  topicLabel: 'विषय: {topic}',
  topicLabelBank: 'विषय: {topic}, अभ्यास बैंक से',
  translateThis: 'इस वाक्य का अंग्रेज़ी में अनुवाद करें: {sentence}',
  typeTranslationHint: 'ऊपर के वाक्य का अपना अनुवाद टाइप करें',
  voiceInputUnavailable: 'आपकी भाषा के लिए वॉइस इनपुट उपलब्ध नहीं है',
  voiceNotice: 'अनुवाद प्रशिक्षक में {language} बोलने वालों के लिए वॉइस इनपुट उपलब्ध नहीं है। आप अभी भी स्तर निर्धारण परीक्षा में इसका उपयोग कर सकते हैं।',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'इससे शुरू: "{word}…"',
  hintUnavailable: 'संकेत उपलब्ध नहीं है - अपनी पूरी कोशिश करें!',
  hintPenaltySuffix: ' (-20 संकेत दंड)',
  revealNoScore: 'उत्तर प्रकट हुआ - कोई अंक नहीं दिए गए।',
  revealClueHint: 'एक सुराग प्रकट करता है। आपका स्कोर 80 पर सीमित करता है।',
  revealAnswerHint: 'बिना स्कोरिंग के उत्तर प्रकट करता है',
  submitTranslationHint: 'मूल्यांकन के लिए आपका अनुवाद जमा करता है',

  earnedXp: '{xp} अनुभव अंक अर्जित',
  tapHint: 'टैप',
  saveToVaultPrompt: 'अपनी शब्दावली तिजोरी में सहेजने के लिए टैप करें:',
  fullPhrase: 'पूर्ण वाक्यांश',

  aiIntroMessage: 'नमस्ते! मैं व्याकरण के नियम समझाने में मदद कर सकता हूँ। आप क्या जानना चाहेंगे?',
  polyPuffTyping: 'Poly-Puff टाइप कर रहा है',
  askAboutGrammarPlaceholder: 'व्याकरण के बारे में पूछें…',
  askGrammarQuestion: 'Poly-Puff से व्याकरण प्रश्न पूछें',
  sendMessage: 'संदेश भेजें',
  reportAiResponseA11y: 'इस AI प्रतिक्रिया की रिपोर्ट करें',
  youSaidA11y: 'आपने कहा: {text}',
  aiResponseA11y: '{brand}, AI प्रतिक्रिया: {text}',
  chatError: 'क्षमा करें, उत्तर देने में मुझे परेशानी हुई। फिर से प्रयास करें!',

  closeSettings: 'सेटिंग्स बंद करें',

  selectCefrLevelA11y: 'CEFR स्तर चुनें',
  cefrLevelOptionA11y: 'स्तर {l}',
  lengthOptionA11y: '{label} वाक्य, {desc}',

  announceLevelSelected: 'CEFR स्तर {level} चयनित।',
  announceLengthSelected: '{length} वाक्य की लंबाई चयनित।',
  announceRetryReady: 'पुनः वाक्य। आपने पहले इसमें संघर्ष किया था। फिर से प्रयास करें!',
  announceNewSentence: 'नया वाक्य तैयार है। अपना अंग्रेज़ी अनुवाद टाइप करें।',
  announceAnswerRevealed: 'उत्तर प्रकट: {answer}',

  welcomeBackTitle: '⏸️ वापसी पर स्वागत है',
  welcomeBackMessage: 'आपका एक अभ्यास चल रहा है। क्या आप जारी रखना चाहेंगे?',
  startNew: 'नया शुरू करें',

  endSessionTitle: 'सत्र समाप्त करें',
  endSessionMessage: 'आपने {exercises} अभ्यास पूरे किए और {time} में {xp} XP अर्जित किए। सत्र समाप्त करें?',
  endSessionConfirm: 'सत्र समाप्त करें',

  errorTitle: 'त्रुटि',
  errorGenerate: 'वाक्य बनाने में विफल। क्या आपका सर्वर चल रहा है?',
  errorCheck: 'अनुवाद जाँचने में विफल।',
  errorSaveVault: 'तिजोरी में सहेजा नहीं जा सका।',

  alreadyInVault: 'पहले से ही तिजोरी में',
  addedTitle: 'जोड़ा गया! 🎉',
  addedMessage: '"{phrase}" आपकी शब्दावली तिजोरी में सहेजा गया।',

  answerUnavailableTitle: 'उत्तर उपलब्ध नहीं है',
  answerUnavailableMissing: 'इस वाक्य का उत्तर गायब है। कृपया नया प्राप्त करने के लिए अगला वाक्य टैप करें।',
  answerUnavailableTryAgain: 'मैं यह उत्तर प्रकट नहीं कर सका। कृपया पुनः प्रयास करें या अगला वाक्य टैप करें।',

  reportAiTitle: 'AI प्रतिक्रिया की रिपोर्ट करें',
  reportAiPrompt: 'आपको क्या समस्या मिली?',
  reportAiInaccurate: 'गलत',
  reportAiOffensive: 'सांस्कृतिक रूप से असंवेदनशील',
  reportedTitle: 'रिपोर्ट किया गया',
  reportedThanksReview: 'धन्यवाद। हम इसकी समीक्षा करेंगे।',
  reportedThanksSerious: 'धन्यवाद। हम इसे गंभीरता से लेते हैं।',
};

const hu: TrainerStrings = {
  toEnglish: '→ Angol',

  sentenceLengthHeader: 'Mondat hossza',
  lengthShort: 'Rövid',
  lengthMedium: 'Közepes',
  lengthLong: 'Hosszú',
  lengthShortDesc: '3-6 szó',
  lengthMediumDesc: '7-12 szó',
  lengthLongDesc: '13-20 szó',

  customRequestPlaceholder: 'Egyéni kérés… (pl. „Múlt idő ételekről")',
  customTopicRequest: 'Egyéni témakérés',
  customRequestHint: 'Adj meg egy konkrét témát vagy nyelvtani fókuszt a következő mondathoz',

  newSentenceHint: 'Új mondatot készít fordításra',
  startSessionHint: 'Új fordítási gyakorló munkamenetet indít',

  opensSettingsHint: 'Megnyitja a nyelvi és szint beállításokat',

  retryBadge: '🔁 ÚJRA',
  retrySentenceA11y: 'Újrapróbálkozási mondat. Korábban nehézséged volt vele.',
  bankBadge: '📚 Bank',
  topicLabel: 'Téma: {topic}',
  topicLabelBank: 'Téma: {topic}, a gyakorlóbankból',
  translateThis: 'Fordítsd le ezt a mondatot angolra: {sentence}',
  typeTranslationHint: 'Írd be a fenti mondat fordítását',
  voiceInputUnavailable: 'A hangbevitel nem érhető el a nyelvedhez',
  voiceNotice: 'A hangbevitel nem érhető el {language} beszélők számára a Fordítóedzőben. A Szintfelmérőben még használhatod.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Így kezdődik: „{word}…"',
  hintUnavailable: 'Tipp nem érhető el - adj bele mindent!',
  hintPenaltySuffix: ' (-20 tippbüntetés)',
  revealNoScore: 'A válasz felfedve - nem jár pont.',
  revealClueHint: 'Tippet ad. Pontszámodat 80-ra korlátozza.',
  revealAnswerHint: 'Felfedi a választ pontozás nélkül',
  submitTranslationHint: 'Beküldi a fordítást értékelésre',

  earnedXp: '{xp} tapasztalati pont szerezve',
  tapHint: 'Koppintás',
  saveToVaultPrompt: 'Koppints a Szókincstárba mentéshez:',
  fullPhrase: 'TELJES KIFEJEZÉS',

  aiIntroMessage: 'Szia! Segíthetek a nyelvtani szabályok elmagyarázásában. Mit szeretnél megtudni?',
  polyPuffTyping: 'Poly-Puff gépel',
  askAboutGrammarPlaceholder: 'Kérdezz a nyelvtanról…',
  askGrammarQuestion: 'Tegyél fel Poly-Puffnak egy nyelvtani kérdést',
  sendMessage: 'Üzenet küldése',
  reportAiResponseA11y: 'Jelentsd ezt az MI-választ',
  youSaidA11y: 'Azt mondtad: {text}',
  aiResponseA11y: '{brand}, MI válasz: {text}',
  chatError: 'Sajnálom, gondom volt a válasszal. Próbáld újra!',

  closeSettings: 'Beállítások bezárása',

  selectCefrLevelA11y: 'Válassz CEFR szintet',
  cefrLevelOptionA11y: 'Szint {l}',
  lengthOptionA11y: '{label} mondatok, {desc}',

  announceLevelSelected: 'CEFR szint {level} kiválasztva.',
  announceLengthSelected: '{length} mondathossz kiválasztva.',
  announceRetryReady: 'Újrapróbálkozási mondat. Korábban nehézséged volt vele. Próbáld újra!',
  announceNewSentence: 'Új mondat kész. Írd be az angol fordítást.',
  announceAnswerRevealed: 'Válasz felfedve: {answer}',

  welcomeBackTitle: '⏸️ Üdvözöllek újra',
  welcomeBackMessage: 'Folyamatban van egy gyakorlatod. Szeretnéd folytatni?',
  startNew: 'Új kezdése',

  endSessionTitle: 'Munkamenet befejezése',
  endSessionMessage: '{exercises} gyakorlatot teljesítettél, és {xp} XP-t szereztél {time} alatt. Munkamenet befejezése?',
  endSessionConfirm: 'Munkamenet befejezése',

  errorTitle: 'Hiba',
  errorGenerate: 'A mondat létrehozása sikertelen. Fut a szervered?',
  errorCheck: 'A fordítás ellenőrzése sikertelen.',
  errorSaveVault: 'Nem sikerült elmenteni a kincstárba.',

  alreadyInVault: 'Már a kincstárban',
  addedTitle: 'Hozzáadva! 🎉',
  addedMessage: '„{phrase}" elmentve a Szókincstáradba.',

  answerUnavailableTitle: 'Válasz nem elérhető',
  answerUnavailableMissing: 'Ennek a mondatnak hiányzik a válaszkulcsa. Kérlek, koppints a Következő mondatra, hogy újat kapj.',
  answerUnavailableTryAgain: 'Nem tudtam felfedni ezt a választ. Próbáld újra, vagy koppints a Következő mondatra.',

  reportAiTitle: 'MI válasz jelentése',
  reportAiPrompt: 'Milyen problémát találtál?',
  reportAiInaccurate: 'Pontatlan',
  reportAiOffensive: 'Kulturálisan érzéketlen',
  reportedTitle: 'Jelentve',
  reportedThanksReview: 'Köszönjük. Megvizsgáljuk.',
  reportedThanksSerious: 'Köszönjük. Komolyan vesszük.',
};

const ig: TrainerStrings = {
  toEnglish: '→ Bekee',

  sentenceLengthHeader: 'Ogologo ahịrịokwu',
  lengthShort: 'Mkpụmkpụ',
  lengthMedium: 'Etiti',
  lengthLong: 'Ogologo',
  lengthShortDesc: 'Okwu 3-6',
  lengthMediumDesc: 'Okwu 7-12',
  lengthLongDesc: 'Okwu 13-20',

  customRequestPlaceholder: "Arịrịọ ahaziri… (dịka 'Oge gara aga banyere nri')",
  customTopicRequest: 'Arịrịọ isiokwu ahaziri',
  customRequestHint: 'Pịnye isiokwu kpọmkwem ma ọ bụ lekwasị anya na ụtọasụsụ maka ahịrịokwu na-esote',

  newSentenceHint: 'Mepụta ahịrịokwu ọhụrụ ka ịsụgharị',
  startSessionHint: 'Bido oge mmega mmega ntụgharị asụsụ ọhụrụ',

  opensSettingsHint: 'Na-emepe ntọala asụsụ na ọkwa',

  retryBadge: '🔁 NWAA ỌZỌ',
  retrySentenceA11y: 'Ahịrịokwu mwepu. Ị gbalịrị nke a na mbụ.',
  bankBadge: '📚 Ụlọakụ',
  topicLabel: 'Isiokwu: {topic}',
  topicLabelBank: 'Isiokwu: {topic}, site na ụlọakụ mmega',
  translateThis: 'Tụgharịa ahịrịokwu a gaa Bekee: {sentence}',
  typeTranslationHint: 'Pịnye ntụgharị asụsụ gị nke ahịrịokwu dị elu',
  voiceInputUnavailable: 'Ntinye olu adịghị maka asụsụ gị',
  voiceNotice: 'Ntinye olu adịghị maka ndị na-asụ {language} na Onye nkuzi ntụgharị asụsụ. Ị ka nwere ike iji ya na nnwale ntinye.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Na-amalite na: "{word}…"',
  hintUnavailable: 'Aro adịghị - gbalịsie ike!',
  hintPenaltySuffix: ' (-20 ntaramahụhụ aro)',
  revealNoScore: 'E kpughere azịza ahụ - enyeghị akara.',
  revealClueHint: 'Na-ekpughe ọkọlọtọ. Na-amachi akara gị na 80.',
  revealAnswerHint: 'Na-ekpughe azịza n\'enweghị akara',
  submitTranslationHint: 'Na-edobe ntụgharị asụsụ gị maka nyocha',

  earnedXp: 'Enwetara isi ahụmahụ {xp}',
  tapHint: 'Pịa',
  saveToVaultPrompt: 'Pịa iji chekwaa na Ụlọ akụ okwu gị:',
  fullPhrase: 'AHỊRỊOKWU ZUO OKE',

  aiIntroMessage: 'Ndewo! Enwere m ike inyere aka ịkọwa iwu ụtọasụsụ. Kedu ihe ị chọrọ ịmara?',
  polyPuffTyping: 'Poly-Puff na-ede',
  askAboutGrammarPlaceholder: 'Jụọ banyere ụtọasụsụ…',
  askGrammarQuestion: 'Jụọ Poly-Puff ajụjụ ụtọasụsụ',
  sendMessage: 'Zipu ozi',
  reportAiResponseA11y: 'Kọọ azịza AI a',
  youSaidA11y: 'Ị kwuru: {text}',
  aiResponseA11y: '{brand}, azịza AI: {text}',
  chatError: 'Ndo, enwere m nsogbu ịza. Nwaa ọzọ!',

  closeSettings: 'Mechie ntọala',

  selectCefrLevelA11y: 'Họrọ ọkwa CEFR',
  cefrLevelOptionA11y: 'Ọkwa {l}',
  lengthOptionA11y: 'Ahịrịokwu {label}, {desc}',

  announceLevelSelected: 'Ahọrọ ọkwa CEFR {level}.',
  announceLengthSelected: 'Ahọrọ ogologo ahịrịokwu {length}.',
  announceRetryReady: 'Ahịrịokwu mwepu. Ị gbalịrị nke a na mbụ. Nwaa ọzọ!',
  announceNewSentence: 'Ahịrịokwu ọhụrụ dị njikere. Pịnye ntụgharị asụsụ Bekee gị.',
  announceAnswerRevealed: 'Ekpughere azịza: {answer}',

  welcomeBackTitle: '⏸️ Nnọọ ọzọ',
  welcomeBackMessage: 'Ị nwere mmega na-aga. Ị chọrọ ịga n\'ihu?',
  startNew: 'Bido ọhụrụ',

  endSessionTitle: 'Kwụsị nnọkọ',
  endSessionMessage: 'Imechara mmega {exercises} ma nweta {xp} XP n\'ime {time}. Kwụsị nnọkọ?',
  endSessionConfirm: 'Kwụsị nnọkọ',

  errorTitle: 'Njehie',
  errorGenerate: 'Imepụta ahịrịokwu adaghị. Ihe nkesa gị ọ na-arụ ọrụ?',
  errorCheck: 'Nlele ntụgharị asụsụ daghị.',
  errorSaveVault: 'Enweghị ike ịchekwa n\'ụlọ akụ.',

  alreadyInVault: 'Dị n\'ụlọ akụ ugbua',
  addedTitle: 'Agbakwunyere! 🎉',
  addedMessage: 'Echekwala "{phrase}" n\'ụlọ akụ okwu gị.',

  answerUnavailableTitle: 'Azịza adịghị',
  answerUnavailableMissing: 'Ahịrịokwu a ahapụla azịza ya. Biko pịa Ahịrịokwu na-esote iji nweta nke ọhụrụ.',
  answerUnavailableTryAgain: 'Enweghị m ike ikpughe azịza a. Biko nwaa ọzọ ma ọ bụ pịa Ahịrịokwu na-esote.',

  reportAiTitle: 'Kọọ azịza AI',
  reportAiPrompt: 'Kedu nsogbu ị chọtara?',
  reportAiInaccurate: 'Adighi mma',
  reportAiOffensive: 'Anaghi enwe mmụọ omenala',
  reportedTitle: 'Akọrọla',
  reportedThanksReview: 'Daalụ. Anyị ga-enyocha nke a.',
  reportedThanksSerious: 'Daalụ. Anyị na-eburu nke a kpọmkwem.',
};

const id: TrainerStrings = {
  toEnglish: '→ Bahasa Inggris',

  sentenceLengthHeader: 'Panjang Kalimat',
  lengthShort: 'Pendek',
  lengthMedium: 'Sedang',
  lengthLong: 'Panjang',
  lengthShortDesc: '3-6 kata',
  lengthMediumDesc: '7-12 kata',
  lengthLongDesc: '13-20 kata',

  customRequestPlaceholder: 'Permintaan khusus… (mis. \'Kalimat lampau tentang makanan\')',
  customTopicRequest: 'Permintaan topik khusus',
  customRequestHint: 'Ketik topik atau fokus tata bahasa tertentu untuk kalimat berikutnya',

  newSentenceHint: 'Membuat kalimat baru untuk diterjemahkan',
  startSessionHint: 'Memulai sesi latihan terjemahan baru',

  opensSettingsHint: 'Membuka pengaturan bahasa dan level',

  retryBadge: '🔁 ULANGI',
  retrySentenceA11y: 'Kalimat ulang. Anda kesulitan dengan ini sebelumnya.',
  bankBadge: '📚 Bank',
  topicLabel: 'Topik: {topic}',
  topicLabelBank: 'Topik: {topic}, dari bank latihan',
  translateThis: 'Terjemahkan kalimat ini ke bahasa Inggris: {sentence}',
  typeTranslationHint: 'Ketik terjemahan Anda dari kalimat di atas',
  voiceInputUnavailable: 'Input suara tidak tersedia untuk bahasa Anda',
  voiceNotice: 'Input suara tidak tersedia untuk penutur {language} di Pelatih Terjemahan. Anda masih dapat menggunakannya di Tes Penempatan.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Dimulai dengan: "{word}…"',
  hintUnavailable: 'Petunjuk tidak tersedia - coba semampu Anda!',
  hintPenaltySuffix: ' (penalti petunjuk -20)',
  revealNoScore: 'Jawaban terungkap - tidak ada skor diberikan.',
  revealClueHint: 'Menunjukkan petunjuk. Membatasi skor Anda di 80.',
  revealAnswerHint: 'Menunjukkan jawaban tanpa penilaian',
  submitTranslationHint: 'Mengirim terjemahan Anda untuk dinilai',

  earnedXp: 'Memperoleh {xp} poin pengalaman',
  tapHint: 'Ketuk',
  saveToVaultPrompt: 'Ketuk untuk menyimpan ke Brankas Kosakata Anda:',
  fullPhrase: 'FRASA LENGKAP',

  aiIntroMessage: 'Hai! Saya dapat membantu menjelaskan aturan tata bahasa. Apa yang ingin Anda ketahui?',
  polyPuffTyping: 'Poly-Puff sedang mengetik',
  askAboutGrammarPlaceholder: 'Tanya tentang tata bahasa…',
  askGrammarQuestion: 'Tanya Poly-Puff pertanyaan tata bahasa',
  sendMessage: 'Kirim pesan',
  reportAiResponseA11y: 'Laporkan respons AI ini',
  youSaidA11y: 'Anda berkata: {text}',
  aiResponseA11y: '{brand}, respons AI: {text}',
  chatError: 'Maaf, saya kesulitan merespons. Coba lagi!',

  closeSettings: 'Tutup pengaturan',

  selectCefrLevelA11y: 'Pilih level CEFR',
  cefrLevelOptionA11y: 'Level {l}',
  lengthOptionA11y: 'Kalimat {label}, {desc}',

  announceLevelSelected: 'Level CEFR {level} dipilih.',
  announceLengthSelected: 'Panjang kalimat {length} dipilih.',
  announceRetryReady: 'Kalimat ulang. Anda kesulitan dengan ini sebelumnya. Coba lagi!',
  announceNewSentence: 'Kalimat baru siap. Ketik terjemahan bahasa Inggris Anda.',
  announceAnswerRevealed: 'Jawaban terungkap: {answer}',

  welcomeBackTitle: '⏸️ Selamat datang kembali',
  welcomeBackMessage: 'Anda memiliki latihan yang sedang berlangsung. Apakah Anda ingin melanjutkan?',
  startNew: 'Mulai baru',

  endSessionTitle: 'Akhiri Sesi',
  endSessionMessage: 'Anda menyelesaikan {exercises} latihan dan memperoleh {xp} XP dalam {time}. Akhiri sesi?',
  endSessionConfirm: 'Akhiri Sesi',

  errorTitle: 'Kesalahan',
  errorGenerate: 'Gagal membuat kalimat. Apakah server Anda berjalan?',
  errorCheck: 'Gagal memeriksa terjemahan.',
  errorSaveVault: 'Tidak dapat menyimpan ke brankas.',

  alreadyInVault: 'Sudah di Brankas',
  addedTitle: 'Ditambahkan! 🎉',
  addedMessage: '"{phrase}" disimpan ke Brankas Kosakata Anda.',

  answerUnavailableTitle: 'Jawaban tidak tersedia',
  answerUnavailableMissing: 'Kalimat ini kehilangan jawabannya. Silakan ketuk Kalimat Berikutnya untuk mendapatkan yang baru.',
  answerUnavailableTryAgain: 'Saya tidak dapat menunjukkan jawaban ini. Coba lagi atau ketuk Kalimat Berikutnya.',

  reportAiTitle: 'Laporkan Respons AI',
  reportAiPrompt: 'Masalah apa yang Anda temukan?',
  reportAiInaccurate: 'Tidak akurat',
  reportAiOffensive: 'Tidak sensitif secara budaya',
  reportedTitle: 'Dilaporkan',
  reportedThanksReview: 'Terima kasih. Kami akan meninjaunya.',
  reportedThanksSerious: 'Terima kasih. Kami menanggapinya dengan serius.',
};

const it: TrainerStrings = {
  toEnglish: '→ Inglese',

  sentenceLengthHeader: 'Lunghezza della frase',
  lengthShort: 'Breve',
  lengthMedium: 'Media',
  lengthLong: 'Lunga',
  lengthShortDesc: '3-6 parole',
  lengthMediumDesc: '7-12 parole',
  lengthLongDesc: '13-20 parole',

  customRequestPlaceholder: "Richiesta personalizzata… (es. 'Passato sul cibo')",
  customTopicRequest: 'Richiesta argomento personalizzata',
  customRequestHint: 'Digita un argomento specifico o un focus grammaticale per la prossima frase',

  newSentenceHint: 'Genera una nuova frase da tradurre',
  startSessionHint: 'Avvia una nuova sessione di pratica della traduzione',

  opensSettingsHint: 'Apre le impostazioni di lingua e livello',

  retryBadge: '🔁 RIPROVA',
  retrySentenceA11y: 'Frase di ripetizione. Hai avuto difficoltà con questa prima.',
  bankBadge: '📚 Banca',
  topicLabel: 'Argomento: {topic}',
  topicLabelBank: 'Argomento: {topic}, dalla banca di esercizi',
  translateThis: 'Traduci questa frase in inglese: {sentence}',
  typeTranslationHint: 'Digita la tua traduzione della frase sopra',
  voiceInputUnavailable: 'Input vocale non disponibile per la tua lingua',
  voiceNotice: 'L\'input vocale non è disponibile per chi parla {language} nell\'Allenatore di traduzione. Puoi ancora usarlo nel Test di livello.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Inizia con: "{word}…"',
  hintUnavailable: 'Suggerimento non disponibile - fai del tuo meglio!',
  hintPenaltySuffix: ' (penalità suggerimento -20)',
  revealNoScore: 'Risposta rivelata - nessun punto assegnato.',
  revealClueHint: 'Rivela un indizio. Limita il tuo punteggio a 80.',
  revealAnswerHint: 'Rivela la risposta senza punteggio',
  submitTranslationHint: 'Invia la tua traduzione per la valutazione',

  earnedXp: 'Guadagnati {xp} punti esperienza',
  tapHint: 'Tocca',
  saveToVaultPrompt: 'Tocca per salvare nel tuo Caveau del Vocabolario:',
  fullPhrase: 'FRASE COMPLETA',

  aiIntroMessage: 'Ciao! Posso aiutare a spiegare le regole grammaticali. Cosa vorresti sapere?',
  polyPuffTyping: 'Poly-Puff sta scrivendo',
  askAboutGrammarPlaceholder: 'Chiedi della grammatica…',
  askGrammarQuestion: 'Fai a Poly-Puff una domanda di grammatica',
  sendMessage: 'Invia messaggio',
  reportAiResponseA11y: 'Segnala questa risposta IA',
  youSaidA11y: 'Hai detto: {text}',
  aiResponseA11y: '{brand}, risposta IA: {text}',
  chatError: 'Scusa, ho avuto problemi a rispondere. Riprova!',

  closeSettings: 'Chiudi impostazioni',

  selectCefrLevelA11y: 'Seleziona livello CEFR',
  cefrLevelOptionA11y: 'Livello {l}',
  lengthOptionA11y: 'Frasi {label}, {desc}',

  announceLevelSelected: 'Livello CEFR {level} selezionato.',
  announceLengthSelected: 'Lunghezza frase {length} selezionata.',
  announceRetryReady: 'Frase di ripetizione. Hai avuto difficoltà con questa prima. Riprova!',
  announceNewSentence: 'Nuova frase pronta. Digita la tua traduzione in inglese.',
  announceAnswerRevealed: 'Risposta rivelata: {answer}',

  welcomeBackTitle: '⏸️ Bentornato',
  welcomeBackMessage: 'Hai un esercizio in corso. Vuoi continuare?',
  startNew: 'Inizia nuovo',

  endSessionTitle: 'Termina sessione',
  endSessionMessage: 'Hai completato {exercises} esercizi e guadagnato {xp} XP in {time}. Termina sessione?',
  endSessionConfirm: 'Termina sessione',

  errorTitle: 'Errore',
  errorGenerate: 'Generazione della frase fallita. Il tuo server è in funzione?',
  errorCheck: 'Controllo della traduzione fallito.',
  errorSaveVault: 'Impossibile salvare nel caveau.',

  alreadyInVault: 'Già nel caveau',
  addedTitle: 'Aggiunto! 🎉',
  addedMessage: '"{phrase}" salvato nel tuo Caveau del Vocabolario.',

  answerUnavailableTitle: 'Risposta non disponibile',
  answerUnavailableMissing: 'A questa frase manca la sua chiave di risposta. Tocca Frase successiva per ottenerne una nuova.',
  answerUnavailableTryAgain: 'Non sono riuscito a rivelare questa risposta. Riprova o tocca Frase successiva.',

  reportAiTitle: 'Segnala risposta IA',
  reportAiPrompt: 'Quale problema hai trovato?',
  reportAiInaccurate: 'Inesatto',
  reportAiOffensive: 'Culturalmente insensibile',
  reportedTitle: 'Segnalato',
  reportedThanksReview: 'Grazie. Esamineremo questo.',
  reportedThanksSerious: 'Grazie. Prendiamo la cosa seriamente.',
};

const ja: TrainerStrings = {
  toEnglish: '→ 英語',

  sentenceLengthHeader: '文の長さ',
  lengthShort: '短い',
  lengthMedium: '中程度',
  lengthLong: '長い',
  lengthShortDesc: '3〜6語',
  lengthMediumDesc: '7〜12語',
  lengthLongDesc: '13〜20語',

  customRequestPlaceholder: 'カスタムリクエスト…（例：「食べ物についての過去形」）',
  customTopicRequest: 'カスタムトピックリクエスト',
  customRequestHint: '次の文の特定のトピックまたは文法の焦点を入力してください',

  newSentenceHint: '翻訳する新しい文を生成します',
  startSessionHint: '新しい翻訳練習セッションを開始します',

  opensSettingsHint: '言語とレベルの設定を開きます',

  retryBadge: '🔁 やり直し',
  retrySentenceA11y: 'やり直しの文です。以前に苦戦したことがあります。',
  bankBadge: '📚 バンク',
  topicLabel: 'トピック：{topic}',
  topicLabelBank: 'トピック：{topic}、練習バンクから',
  translateThis: 'この文を英語に翻訳してください：{sentence}',
  typeTranslationHint: '上の文の翻訳を入力してください',
  voiceInputUnavailable: 'お使いの言語では音声入力を利用できません',
  voiceNotice: '翻訳トレーナーでは{language}話者向けの音声入力は利用できません。レベル判定テストではまだ使用できます。',

  hintScorePenalty: '(-20)',
  hintStartsWith: '〜で始まる：「{word}…」',
  hintUnavailable: 'ヒントは利用できません - 最善を尽くしてください！',
  hintPenaltySuffix: '（ヒントペナルティ -20）',
  revealNoScore: '答えが表示されました - 得点はありません。',
  revealClueHint: '手がかりを表示します。スコアは80点に制限されます。',
  revealAnswerHint: '採点なしで答えを表示します',
  submitTranslationHint: '翻訳を採点のために送信します',

  earnedXp: '{xp} 経験値を獲得',
  tapHint: 'タップ',
  saveToVaultPrompt: '語彙ボールトに保存するにはタップしてください：',
  fullPhrase: 'フレーズ全体',

  aiIntroMessage: 'こんにちは！文法ルールを説明するお手伝いができます。何を知りたいですか？',
  polyPuffTyping: 'Poly-Puff が入力中',
  askAboutGrammarPlaceholder: '文法について質問する…',
  askGrammarQuestion: 'Poly-Puff に文法の質問をする',
  sendMessage: 'メッセージを送信',
  reportAiResponseA11y: 'この AI 応答を報告する',
  youSaidA11y: 'あなた：{text}',
  aiResponseA11y: '{brand}、AI 応答：{text}',
  chatError: 'すみません、応答に問題がありました。もう一度お試しください！',

  closeSettings: '設定を閉じる',

  selectCefrLevelA11y: 'CEFR レベルを選択',
  cefrLevelOptionA11y: 'レベル {l}',
  lengthOptionA11y: '{label} 文、{desc}',

  announceLevelSelected: 'CEFR レベル {level} を選択しました。',
  announceLengthSelected: '{length} の文の長さを選択しました。',
  announceRetryReady: 'やり直しの文です。以前に苦戦したことがあります。もう一度試してください！',
  announceNewSentence: '新しい文の準備ができました。英訳を入力してください。',
  announceAnswerRevealed: '答えが表示されました：{answer}',

  welcomeBackTitle: '⏸️ おかえりなさい',
  welcomeBackMessage: '進行中の練習があります。続けますか？',
  startNew: '新しく始める',

  endSessionTitle: 'セッション終了',
  endSessionMessage: '{exercises} 個の練習を完了し、{time} で {xp} XP を獲得しました。セッションを終了しますか？',
  endSessionConfirm: 'セッション終了',

  errorTitle: 'エラー',
  errorGenerate: '文の生成に失敗しました。サーバーは動作していますか？',
  errorCheck: '翻訳の確認に失敗しました。',
  errorSaveVault: 'ボールトに保存できませんでした。',

  alreadyInVault: 'すでにボールトにあります',
  addedTitle: '追加されました！🎉',
  addedMessage: '「{phrase}」を語彙ボールトに保存しました。',

  answerUnavailableTitle: '答えがありません',
  answerUnavailableMissing: 'この文には答えがありません。新しい文を取得するには「次の文」をタップしてください。',
  answerUnavailableTryAgain: 'この答えを表示できませんでした。もう一度試すか「次の文」をタップしてください。',

  reportAiTitle: 'AI 応答を報告',
  reportAiPrompt: 'どのような問題がありましたか？',
  reportAiInaccurate: '不正確',
  reportAiOffensive: '文化的に配慮がない',
  reportedTitle: '報告済み',
  reportedThanksReview: 'ありがとうございます。確認します。',
  reportedThanksSerious: 'ありがとうございます。真剣に受け止めます。',
};

const ko: TrainerStrings = {
  toEnglish: '→ 영어',

  sentenceLengthHeader: '문장 길이',
  lengthShort: '짧음',
  lengthMedium: '중간',
  lengthLong: '긺',
  lengthShortDesc: '3-6 단어',
  lengthMediumDesc: '7-12 단어',
  lengthLongDesc: '13-20 단어',

  customRequestPlaceholder: '맞춤 요청… (예: \'음식에 관한 과거 시제\')',
  customTopicRequest: '맞춤 주제 요청',
  customRequestHint: '다음 문장의 특정 주제 또는 문법 초점을 입력하세요',

  newSentenceHint: '번역할 새 문장을 생성합니다',
  startSessionHint: '새 번역 연습 세션을 시작합니다',

  opensSettingsHint: '언어 및 레벨 설정을 엽니다',

  retryBadge: '🔁 다시',
  retrySentenceA11y: '다시 시도 문장. 이전에 어려움을 겪었습니다.',
  bankBadge: '📚 뱅크',
  topicLabel: '주제: {topic}',
  topicLabelBank: '주제: {topic}, 연습 뱅크에서',
  translateThis: '이 문장을 영어로 번역하세요: {sentence}',
  typeTranslationHint: '위 문장의 번역을 입력하세요',
  voiceInputUnavailable: '귀하의 언어에는 음성 입력을 사용할 수 없습니다',
  voiceNotice: '번역 트레이너에서 {language} 사용자에게는 음성 입력을 사용할 수 없습니다. 레벨 테스트에서는 여전히 사용할 수 있습니다.',

  hintScorePenalty: '(-20)',
  hintStartsWith: '시작 단어: "{word}…"',
  hintUnavailable: '힌트를 사용할 수 없습니다 - 최선을 다해보세요!',
  hintPenaltySuffix: ' (힌트 패널티 -20)',
  revealNoScore: '답이 공개되었습니다 - 점수가 부여되지 않습니다.',
  revealClueHint: '단서를 표시합니다. 점수가 80점으로 제한됩니다.',
  revealAnswerHint: '점수 없이 답을 공개합니다',
  submitTranslationHint: '채점을 위해 번역을 제출합니다',

  earnedXp: '경험치 {xp} 획득',
  tapHint: '탭',
  saveToVaultPrompt: '어휘 금고에 저장하려면 탭하세요:',
  fullPhrase: '전체 구문',

  aiIntroMessage: '안녕하세요! 문법 규칙을 설명하는 데 도움을 드릴 수 있습니다. 무엇을 알고 싶으신가요?',
  polyPuffTyping: 'Poly-Puff 입력 중',
  askAboutGrammarPlaceholder: '문법에 대해 질문하세요…',
  askGrammarQuestion: 'Poly-Puff에게 문법 질문하기',
  sendMessage: '메시지 보내기',
  reportAiResponseA11y: '이 AI 응답 신고',
  youSaidA11y: '당신: {text}',
  aiResponseA11y: '{brand}, AI 응답: {text}',
  chatError: '죄송합니다, 응답하는 데 문제가 있었습니다. 다시 시도하세요!',

  closeSettings: '설정 닫기',

  selectCefrLevelA11y: 'CEFR 레벨 선택',
  cefrLevelOptionA11y: '레벨 {l}',
  lengthOptionA11y: '{label} 문장, {desc}',

  announceLevelSelected: 'CEFR 레벨 {level} 선택됨.',
  announceLengthSelected: '{length} 문장 길이 선택됨.',
  announceRetryReady: '다시 시도 문장. 이전에 어려움을 겪었습니다. 다시 시도하세요!',
  announceNewSentence: '새 문장이 준비되었습니다. 영어 번역을 입력하세요.',
  announceAnswerRevealed: '답 공개됨: {answer}',

  welcomeBackTitle: '⏸️ 다시 오신 것을 환영합니다',
  welcomeBackMessage: '진행 중인 연습이 있습니다. 계속하시겠습니까?',
  startNew: '새로 시작',

  endSessionTitle: '세션 종료',
  endSessionMessage: '{exercises}개의 연습을 완료하고 {time}에 {xp} XP를 얻었습니다. 세션을 종료하시겠습니까?',
  endSessionConfirm: '세션 종료',

  errorTitle: '오류',
  errorGenerate: '문장 생성에 실패했습니다. 서버가 실행 중입니까?',
  errorCheck: '번역 확인에 실패했습니다.',
  errorSaveVault: '금고에 저장할 수 없습니다.',

  alreadyInVault: '이미 금고에 있음',
  addedTitle: '추가됨! 🎉',
  addedMessage: '"{phrase}"이(가) 어휘 금고에 저장되었습니다.',

  answerUnavailableTitle: '답을 사용할 수 없음',
  answerUnavailableMissing: '이 문장에는 답이 없습니다. 새 문장을 받으려면 다음 문장을 탭하세요.',
  answerUnavailableTryAgain: '이 답을 공개할 수 없었습니다. 다시 시도하거나 다음 문장을 탭하세요.',

  reportAiTitle: 'AI 응답 신고',
  reportAiPrompt: '어떤 문제를 발견하셨나요?',
  reportAiInaccurate: '부정확',
  reportAiOffensive: '문화적으로 무신경',
  reportedTitle: '신고됨',
  reportedThanksReview: '감사합니다. 검토하겠습니다.',
  reportedThanksSerious: '감사합니다. 진지하게 받아들이겠습니다.',
};

const ms: TrainerStrings = {
  toEnglish: '→ Bahasa Inggeris',

  sentenceLengthHeader: 'Panjang Ayat',
  lengthShort: 'Pendek',
  lengthMedium: 'Sederhana',
  lengthLong: 'Panjang',
  lengthShortDesc: '3-6 patah perkataan',
  lengthMediumDesc: '7-12 patah perkataan',
  lengthLongDesc: '13-20 patah perkataan',

  customRequestPlaceholder: 'Permintaan tersuai… (cth. \'Kala lampau tentang makanan\')',
  customTopicRequest: 'Permintaan topik tersuai',
  customRequestHint: 'Taipkan topik atau fokus tatabahasa tertentu untuk ayat seterusnya',

  newSentenceHint: 'Menjana ayat baru untuk diterjemahkan',
  startSessionHint: 'Memulakan sesi latihan terjemahan baru',

  opensSettingsHint: 'Membuka tetapan bahasa dan tahap',

  retryBadge: '🔁 CUBA SEMULA',
  retrySentenceA11y: 'Ayat cuba semula. Anda menghadapi kesukaran sebelum ini.',
  bankBadge: '📚 Bank',
  topicLabel: 'Topik: {topic}',
  topicLabelBank: 'Topik: {topic}, dari bank latihan',
  translateThis: 'Terjemahkan ayat ini ke bahasa Inggeris: {sentence}',
  typeTranslationHint: 'Taipkan terjemahan anda bagi ayat di atas',
  voiceInputUnavailable: 'Input suara tidak tersedia untuk bahasa anda',
  voiceNotice: 'Input suara tidak tersedia untuk penutur {language} dalam Jurulatih Terjemahan. Anda masih boleh menggunakannya dalam Ujian Penempatan.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Bermula dengan: "{word}…"',
  hintUnavailable: 'Petunjuk tidak tersedia - buat yang terbaik!',
  hintPenaltySuffix: ' (-20 penalti petunjuk)',
  revealNoScore: 'Jawapan didedahkan - tiada markah diberikan.',
  revealClueHint: 'Mendedahkan petunjuk. Mengehadkan skor anda kepada 80.',
  revealAnswerHint: 'Mendedahkan jawapan tanpa pemarkahan',
  submitTranslationHint: 'Menghantar terjemahan anda untuk dinilai',

  earnedXp: '{xp} mata pengalaman diperoleh',
  tapHint: 'Ketuk',
  saveToVaultPrompt: 'Ketuk untuk simpan dalam Bilik Kebal Perbendaharaan Kata anda:',
  fullPhrase: 'FRASA PENUH',

  aiIntroMessage: 'Hai! Saya boleh membantu menerangkan peraturan tatabahasa. Apa yang anda ingin tahu?',
  polyPuffTyping: 'Poly-Puff sedang menaip',
  askAboutGrammarPlaceholder: 'Tanya tentang tatabahasa…',
  askGrammarQuestion: 'Tanya Poly-Puff soalan tatabahasa',
  sendMessage: 'Hantar mesej',
  reportAiResponseA11y: 'Laporkan respons AI ini',
  youSaidA11y: 'Anda berkata: {text}',
  aiResponseA11y: '{brand}, respons AI: {text}',
  chatError: 'Maaf, saya menghadapi masalah untuk menjawab. Cuba lagi!',

  closeSettings: 'Tutup tetapan',

  selectCefrLevelA11y: 'Pilih tahap CEFR',
  cefrLevelOptionA11y: 'Tahap {l}',
  lengthOptionA11y: 'Ayat {label}, {desc}',

  announceLevelSelected: 'Tahap CEFR {level} dipilih.',
  announceLengthSelected: 'Panjang ayat {length} dipilih.',
  announceRetryReady: 'Ayat cuba semula. Anda menghadapi kesukaran sebelum ini. Cuba lagi!',
  announceNewSentence: 'Ayat baru sedia. Taipkan terjemahan bahasa Inggeris anda.',
  announceAnswerRevealed: 'Jawapan didedahkan: {answer}',

  welcomeBackTitle: '⏸️ Selamat Kembali',
  welcomeBackMessage: 'Anda mempunyai latihan yang sedang berjalan. Adakah anda mahu meneruskan?',
  startNew: 'Mulakan baru',

  endSessionTitle: 'Tamatkan Sesi',
  endSessionMessage: 'Anda telah menyelesaikan {exercises} latihan dan memperoleh {xp} XP dalam {time}. Tamatkan sesi?',
  endSessionConfirm: 'Tamatkan Sesi',

  errorTitle: 'Ralat',
  errorGenerate: 'Gagal menjana ayat. Adakah pelayan anda berjalan?',
  errorCheck: 'Gagal menyemak terjemahan.',
  errorSaveVault: 'Tidak dapat menyimpan ke bilik kebal.',

  alreadyInVault: 'Sudah ada dalam Bilik Kebal',
  addedTitle: 'Ditambah! 🎉',
  addedMessage: '"{phrase}" disimpan ke Bilik Kebal Perbendaharaan Kata anda.',

  answerUnavailableTitle: 'Jawapan tidak tersedia',
  answerUnavailableMissing: 'Ayat ini tiada kunci jawapannya. Sila ketuk Ayat Seterusnya untuk dapatkan yang baru.',
  answerUnavailableTryAgain: 'Saya tidak dapat mendedahkan jawapan ini. Sila cuba lagi atau ketuk Ayat Seterusnya.',

  reportAiTitle: 'Laporkan Respons AI',
  reportAiPrompt: 'Apakah masalah yang anda temui?',
  reportAiInaccurate: 'Tidak tepat',
  reportAiOffensive: 'Tidak sensitif budaya',
  reportedTitle: 'Dilaporkan',
  reportedThanksReview: 'Terima kasih. Kami akan menyemak perkara ini.',
  reportedThanksSerious: 'Terima kasih. Kami menanggapi perkara ini dengan serius.',
};

const zh: TrainerStrings = {
  toEnglish: '→ 英语',

  sentenceLengthHeader: '句子长度',
  lengthShort: '短',
  lengthMedium: '中',
  lengthLong: '长',
  lengthShortDesc: '3-6 个词',
  lengthMediumDesc: '7-12 个词',
  lengthLongDesc: '13-20 个词',

  customRequestPlaceholder: '自定义请求…（例如"关于食物的过去时"）',
  customTopicRequest: '自定义主题请求',
  customRequestHint: '为下一个句子输入特定主题或语法重点',

  newSentenceHint: '生成一个新句子供翻译',
  startSessionHint: '开始新的翻译练习课程',

  opensSettingsHint: '打开语言和等级设置',

  retryBadge: '🔁 重试',
  retrySentenceA11y: '重试句子。您之前在这个句子上有困难。',
  bankBadge: '📚 题库',
  topicLabel: '主题：{topic}',
  topicLabelBank: '主题：{topic}，来自练习题库',
  translateThis: '请将这句话翻译成英文：{sentence}',
  typeTranslationHint: '输入您对上述句子的翻译',
  voiceInputUnavailable: '您的语言不支持语音输入',
  voiceNotice: '翻译训练中{language}使用者无法使用语音输入。您仍可在分级测试中使用。',

  hintScorePenalty: '(-20)',
  hintStartsWith: '以…开头："{word}…"',
  hintUnavailable: '提示不可用 - 尽力而为！',
  hintPenaltySuffix: '（提示扣分 -20）',
  revealNoScore: '答案已揭示 - 未授予分数。',
  revealClueHint: '揭示线索。您的分数将限制在 80 分。',
  revealAnswerHint: '揭示答案但不计分',
  submitTranslationHint: '提交您的翻译以进行评分',

  earnedXp: '获得 {xp} 经验值',
  tapHint: '点击',
  saveToVaultPrompt: '点击保存到您的词汇库：',
  fullPhrase: '完整短语',

  aiIntroMessage: '你好！我可以帮助解释语法规则。你想了解什么？',
  polyPuffTyping: 'Poly-Puff 正在输入',
  askAboutGrammarPlaceholder: '询问语法…',
  askGrammarQuestion: '向 Poly-Puff 提问语法问题',
  sendMessage: '发送消息',
  reportAiResponseA11y: '举报此 AI 回复',
  youSaidA11y: '您说：{text}',
  aiResponseA11y: '{brand}，AI 回复：{text}',
  chatError: '抱歉，回复时遇到问题。请重试！',

  closeSettings: '关闭设置',

  selectCefrLevelA11y: '选择 CEFR 等级',
  cefrLevelOptionA11y: '等级 {l}',
  lengthOptionA11y: '{label} 句子，{desc}',

  announceLevelSelected: 'CEFR 等级 {level} 已选择。',
  announceLengthSelected: '已选择 {length} 句子长度。',
  announceRetryReady: '重试句子。您之前在这个句子上有困难。请再试一次！',
  announceNewSentence: '新句子已准备好。请输入您的英文翻译。',
  announceAnswerRevealed: '答案已揭示：{answer}',

  welcomeBackTitle: '⏸️ 欢迎回来',
  welcomeBackMessage: '您有一个正在进行的练习。要继续吗？',
  startNew: '重新开始',

  endSessionTitle: '结束课程',
  endSessionMessage: '您完成了 {exercises} 个练习，在 {time} 内获得 {xp} XP。结束课程？',
  endSessionConfirm: '结束课程',

  errorTitle: '错误',
  errorGenerate: '生成句子失败。您的服务器在运行吗？',
  errorCheck: '检查翻译失败。',
  errorSaveVault: '无法保存到词汇库。',

  alreadyInVault: '已在词汇库中',
  addedTitle: '已添加！🎉',
  addedMessage: '"{phrase}"已保存到您的词汇库。',

  answerUnavailableTitle: '答案不可用',
  answerUnavailableMissing: '此句子缺少答案。请点击下一句获取新句子。',
  answerUnavailableTryAgain: '我无法揭示这个答案。请重试或点击下一句。',

  reportAiTitle: '举报 AI 回复',
  reportAiPrompt: '您发现了什么问题？',
  reportAiInaccurate: '不准确',
  reportAiOffensive: '文化上不敏感',
  reportedTitle: '已举报',
  reportedThanksReview: '谢谢。我们会审查此问题。',
  reportedThanksSerious: '谢谢。我们会严肃对待此问题。',
};

const mr: TrainerStrings = {
  toEnglish: '→ इंग्रजी',

  sentenceLengthHeader: 'वाक्याची लांबी',
  lengthShort: 'लहान',
  lengthMedium: 'मध्यम',
  lengthLong: 'लांब',
  lengthShortDesc: '3-6 शब्द',
  lengthMediumDesc: '7-12 शब्द',
  lengthLongDesc: '13-20 शब्द',

  customRequestPlaceholder: 'सानुकूल विनंती… (उदा. \'अन्नाबद्दल भूतकाळ\')',
  customTopicRequest: 'सानुकूल विषय विनंती',
  customRequestHint: 'पुढच्या वाक्यासाठी विशिष्ट विषय किंवा व्याकरण लक्ष टाइप करा',

  newSentenceHint: 'अनुवाद करण्यासाठी नवीन वाक्य तयार करते',
  startSessionHint: 'नवीन अनुवाद सराव सत्र सुरू करते',

  opensSettingsHint: 'भाषा आणि स्तर सेटिंग्ज उघडते',

  retryBadge: '🔁 पुन्हा',
  retrySentenceA11y: 'पुन्हा प्रयत्न वाक्य. आधी तुम्हाला हे कठीण गेले होते.',
  bankBadge: '📚 बँक',
  topicLabel: 'विषय: {topic}',
  topicLabelBank: 'विषय: {topic}, सराव बँकेकडून',
  translateThis: 'हे वाक्य इंग्रजीत भाषांतर करा: {sentence}',
  typeTranslationHint: 'वरील वाक्याचा तुमचा भाषांतर टाइप करा',
  voiceInputUnavailable: 'तुमच्या भाषेसाठी आवाज इनपुट उपलब्ध नाही',
  voiceNotice: 'भाषांतर प्रशिक्षकात {language} बोलणाऱ्यांसाठी आवाज इनपुट उपलब्ध नाही. तुम्ही अद्याप स्तर निश्चिती चाचणीत त्याचा वापर करू शकता.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'याने सुरू होते: "{word}…"',
  hintUnavailable: 'इशारा उपलब्ध नाही - सर्वोत्तम प्रयत्न करा!',
  hintPenaltySuffix: ' (-20 इशारा दंड)',
  revealNoScore: 'उत्तर उघड झाले - कोणतेही गुण देण्यात आले नाहीत.',
  revealClueHint: 'सूचना दाखवते. तुमचा स्कोअर 80 पर्यंत मर्यादित करते.',
  revealAnswerHint: 'गुण न देता उत्तर उघड करते',
  submitTranslationHint: 'मूल्यांकनासाठी तुमचा भाषांतर सादर करते',

  earnedXp: '{xp} अनुभव गुण मिळाले',
  tapHint: 'टॅप',
  saveToVaultPrompt: 'तुमच्या शब्दसंग्रह तिजोरीत जतन करण्यासाठी टॅप करा:',
  fullPhrase: 'पूर्ण वाक्यांश',

  aiIntroMessage: 'नमस्कार! मी व्याकरण नियम स्पष्ट करण्यात मदत करू शकतो. तुम्हाला काय जाणून घ्यायचे आहे?',
  polyPuffTyping: 'Poly-Puff टाइप करत आहे',
  askAboutGrammarPlaceholder: 'व्याकरणाबद्दल विचारा…',
  askGrammarQuestion: 'Poly-Puff ला व्याकरण प्रश्न विचारा',
  sendMessage: 'संदेश पाठवा',
  reportAiResponseA11y: 'या AI प्रतिसादाची तक्रार करा',
  youSaidA11y: 'तुम्ही म्हणालात: {text}',
  aiResponseA11y: '{brand}, AI प्रतिसाद: {text}',
  chatError: 'क्षमस्व, उत्तर देताना समस्या आली. पुन्हा प्रयत्न करा!',

  closeSettings: 'सेटिंग्ज बंद करा',

  selectCefrLevelA11y: 'CEFR स्तर निवडा',
  cefrLevelOptionA11y: 'स्तर {l}',
  lengthOptionA11y: '{label} वाक्ये, {desc}',

  announceLevelSelected: 'CEFR स्तर {level} निवडले.',
  announceLengthSelected: '{length} वाक्याची लांबी निवडली.',
  announceRetryReady: 'पुन्हा प्रयत्न वाक्य. आधी तुम्हाला हे कठीण गेले होते. पुन्हा प्रयत्न करा!',
  announceNewSentence: 'नवीन वाक्य तयार. तुमचा इंग्रजी भाषांतर टाइप करा.',
  announceAnswerRevealed: 'उत्तर उघड: {answer}',

  welcomeBackTitle: '⏸️ पुन्हा स्वागत',
  welcomeBackMessage: 'तुमचा एक सराव सुरू आहे. तुम्ही पुढे चालू ठेवू इच्छिता?',
  startNew: 'नवीन सुरू करा',

  endSessionTitle: 'सत्र समाप्त करा',
  endSessionMessage: 'तुम्ही {exercises} सराव पूर्ण केले आणि {time} मध्ये {xp} XP मिळवले. सत्र समाप्त?',
  endSessionConfirm: 'सत्र समाप्त करा',

  errorTitle: 'त्रुटी',
  errorGenerate: 'वाक्य तयार करण्यात अयशस्वी. तुमचा सर्व्हर चालू आहे?',
  errorCheck: 'भाषांतर तपासण्यात अयशस्वी.',
  errorSaveVault: 'तिजोरीत जतन करता आले नाही.',

  alreadyInVault: 'आधीच तिजोरीत आहे',
  addedTitle: 'जोडले! 🎉',
  addedMessage: '"{phrase}" तुमच्या शब्दसंग्रह तिजोरीत जतन केले.',

  answerUnavailableTitle: 'उत्तर उपलब्ध नाही',
  answerUnavailableMissing: 'या वाक्याचे उत्तर गहाळ आहे. कृपया नवीन मिळवण्यासाठी पुढील वाक्य टॅप करा.',
  answerUnavailableTryAgain: 'मी हे उत्तर उघड करू शकलो नाही. कृपया पुन्हा प्रयत्न करा किंवा पुढील वाक्य टॅप करा.',

  reportAiTitle: 'AI प्रतिसादाची तक्रार करा',
  reportAiPrompt: 'तुम्हाला कोणती समस्या आढळली?',
  reportAiInaccurate: 'चुकीचे',
  reportAiOffensive: 'सांस्कृतिकदृष्ट्या असंवेदनशील',
  reportedTitle: 'तक्रार केली',
  reportedThanksReview: 'धन्यवाद. आम्ही याचा आढावा घेऊ.',
  reportedThanksSerious: 'धन्यवाद. आम्ही याला गांभीर्याने घेतो.',
};

const ne: TrainerStrings = {
  toEnglish: '→ अंग्रेजी',

  sentenceLengthHeader: 'वाक्यको लम्बाइ',
  lengthShort: 'छोटो',
  lengthMedium: 'मध्यम',
  lengthLong: 'लामो',
  lengthShortDesc: '3-6 शब्द',
  lengthMediumDesc: '7-12 शब्द',
  lengthLongDesc: '13-20 शब्द',

  customRequestPlaceholder: 'अनुकूलित अनुरोध… (जस्तै, \'खानेकुराबारे विगतकाल\')',
  customTopicRequest: 'अनुकूलित विषय अनुरोध',
  customRequestHint: 'अर्को वाक्यका लागि विशेष विषय वा व्याकरण फोकस टाइप गर्नुहोस्',

  newSentenceHint: 'अनुवादका लागि नयाँ वाक्य उत्पन्न गर्छ',
  startSessionHint: 'नयाँ अनुवाद अभ्यास सत्र सुरु गर्छ',

  opensSettingsHint: 'भाषा र स्तर सेटिङ्ग खोल्छ',

  retryBadge: '🔁 पुन: प्रयास',
  retrySentenceA11y: 'पुन: प्रयास वाक्य। तपाईंलाई पहिले यो कठिन भएको थियो।',
  bankBadge: '📚 बैंक',
  topicLabel: 'विषय: {topic}',
  topicLabelBank: 'विषय: {topic}, अभ्यास बैंकबाट',
  translateThis: 'यो वाक्यलाई अंग्रेजीमा अनुवाद गर्नुहोस्: {sentence}',
  typeTranslationHint: 'माथिको वाक्यको आफ्नो अनुवाद टाइप गर्नुहोस्',
  voiceInputUnavailable: 'तपाईंको भाषाका लागि भ्वाइस इनपुट उपलब्ध छैन',
  voiceNotice: 'अनुवाद प्रशिक्षकमा {language} वक्ताहरूका लागि भ्वाइस इनपुट उपलब्ध छैन। तपाईंले अझै पनि स्तर निर्धारण परीक्षामा यसको प्रयोग गर्न सक्नुहुन्छ।',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'यसबाट सुरु: "{word}…"',
  hintUnavailable: 'सङ्केत उपलब्ध छैन - आफ्नो उत्कृष्ट प्रयास गर्नुहोस्!',
  hintPenaltySuffix: ' (-20 सङ्केत दण्ड)',
  revealNoScore: 'जवाफ खुलाइयो - कुनै अंक दिइएन।',
  revealClueHint: 'सुराग देखाउँछ। तपाईंको स्कोरलाई 80 मा सीमित गर्छ।',
  revealAnswerHint: 'स्कोरिङ बिना जवाफ खुलाउँछ',
  submitTranslationHint: 'मूल्याङ्कनका लागि तपाईंको अनुवाद पेस गर्छ',

  earnedXp: '{xp} अनुभव अंक प्राप्त',
  tapHint: 'ट्याप',
  saveToVaultPrompt: 'आफ्नो शब्दभण्डार तिजोरीमा सुरक्षित गर्न ट्याप गर्नुहोस्:',
  fullPhrase: 'पूर्ण वाक्यांश',

  aiIntroMessage: 'नमस्ते! म व्याकरण नियमहरू व्याख्या गर्न मद्दत गर्न सक्छु। तपाईंले के थाहा पाउन चाहनुहुन्छ?',
  polyPuffTyping: 'Poly-Puff टाइप गर्दैछ',
  askAboutGrammarPlaceholder: 'व्याकरणबारे सोध्नुहोस्…',
  askGrammarQuestion: 'Poly-Puff लाई व्याकरण प्रश्न सोध्नुहोस्',
  sendMessage: 'सन्देश पठाउनुहोस्',
  reportAiResponseA11y: 'यो AI प्रतिक्रिया प्रतिवेदन गर्नुहोस्',
  youSaidA11y: 'तपाईंले भन्नुभयो: {text}',
  aiResponseA11y: '{brand}, AI प्रतिक्रिया: {text}',
  chatError: 'माफ गर्नुहोस्, मलाई जवाफ दिन समस्या भयो। पुन: प्रयास गर्नुहोस्!',

  closeSettings: 'सेटिङ्ग बन्द गर्नुहोस्',

  selectCefrLevelA11y: 'CEFR स्तर छान्नुहोस्',
  cefrLevelOptionA11y: 'स्तर {l}',
  lengthOptionA11y: '{label} वाक्यहरू, {desc}',

  announceLevelSelected: 'CEFR स्तर {level} छानियो।',
  announceLengthSelected: '{length} वाक्य लम्बाइ छानियो।',
  announceRetryReady: 'पुन: प्रयास वाक्य। तपाईंलाई पहिले यो कठिन भएको थियो। पुन: प्रयास गर्नुहोस्!',
  announceNewSentence: 'नयाँ वाक्य तयार। आफ्नो अंग्रेजी अनुवाद टाइप गर्नुहोस्।',
  announceAnswerRevealed: 'जवाफ खुलाइयो: {answer}',

  welcomeBackTitle: '⏸️ फिर्ता स्वागत छ',
  welcomeBackMessage: 'तपाईंको एउटा अभ्यास चलिरहेको छ। के तपाईं जारी राख्न चाहनुहुन्छ?',
  startNew: 'नयाँ सुरु गर्नुहोस्',

  endSessionTitle: 'सत्र समाप्त गर्नुहोस्',
  endSessionMessage: 'तपाईंले {exercises} अभ्यास पूरा गर्नुभयो र {time} मा {xp} XP कमाउनुभयो। सत्र समाप्त?',
  endSessionConfirm: 'सत्र समाप्त गर्नुहोस्',

  errorTitle: 'त्रुटि',
  errorGenerate: 'वाक्य उत्पन्न गर्न असफल। तपाईंको सर्भर चलिरहेको छ?',
  errorCheck: 'अनुवाद जाँच गर्न असफल।',
  errorSaveVault: 'तिजोरीमा सुरक्षित गर्न सकेन।',

  alreadyInVault: 'पहिले नै तिजोरीमा',
  addedTitle: 'थपियो! 🎉',
  addedMessage: '"{phrase}" तपाईंको शब्दभण्डार तिजोरीमा सुरक्षित गरियो।',

  answerUnavailableTitle: 'जवाफ उपलब्ध छैन',
  answerUnavailableMissing: 'यो वाक्यको जवाफ छैन। नयाँ पाउन कृपया अर्को वाक्य ट्याप गर्नुहोस्।',
  answerUnavailableTryAgain: 'मैले यो जवाफ खुलाउन सकिनँ। कृपया पुन: प्रयास गर्नुहोस् वा अर्को वाक्य ट्याप गर्नुहोस्।',

  reportAiTitle: 'AI प्रतिक्रिया प्रतिवेदन गर्नुहोस्',
  reportAiPrompt: 'तपाईंले कस्तो समस्या भेट्नुभयो?',
  reportAiInaccurate: 'गलत',
  reportAiOffensive: 'सांस्कृतिक रूपमा असंवेदनशील',
  reportedTitle: 'प्रतिवेदन गरियो',
  reportedThanksReview: 'धन्यवाद। हामी यसको समीक्षा गर्नेछौं।',
  reportedThanksSerious: 'धन्यवाद। हामी यसलाई गम्भीरतापूर्वक लिन्छौं।',
};

const no: TrainerStrings = {
  toEnglish: '→ Engelsk',

  sentenceLengthHeader: 'Setningslengde',
  lengthShort: 'Kort',
  lengthMedium: 'Middels',
  lengthLong: 'Lang',
  lengthShortDesc: '3-6 ord',
  lengthMediumDesc: '7-12 ord',
  lengthLongDesc: '13-20 ord',

  customRequestPlaceholder: "Tilpasset forespørsel… (f.eks. «Fortid om mat»)",
  customTopicRequest: 'Tilpasset emneforespørsel',
  customRequestHint: 'Skriv et bestemt emne eller grammatisk fokus for neste setning',

  newSentenceHint: 'Genererer en ny setning å oversette',
  startSessionHint: 'Starter en ny oversettelsesøkt',

  opensSettingsHint: 'Åpner språk- og nivåinnstillinger',

  retryBadge: '🔁 PRØV IGJEN',
  retrySentenceA11y: 'Gjentakelsessetning. Du slet med denne tidligere.',
  bankBadge: '📚 Bank',
  topicLabel: 'Emne: {topic}',
  topicLabelBank: 'Emne: {topic}, fra øvelsesbanken',
  translateThis: 'Oversett denne setningen til engelsk: {sentence}',
  typeTranslationHint: 'Skriv din oversettelse av setningen over',
  voiceInputUnavailable: 'Taleinngang er ikke tilgjengelig for ditt språk',
  voiceNotice: 'Taleinngang er ikke tilgjengelig for {language}-talere i Oversettelsestreneren. Du kan fortsatt bruke det i Plasseringstesten.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Begynner med: «{word}…»',
  hintUnavailable: 'Hint ikke tilgjengelig - gjør ditt beste!',
  hintPenaltySuffix: ' (-20 hintstraff)',
  revealNoScore: 'Svaret ble avslørt - ingen poeng tildelt.',
  revealClueHint: 'Avslører et hint. Begrenser poengsummen din til 80.',
  revealAnswerHint: 'Avslører svaret uten poeng',
  submitTranslationHint: 'Sender inn oversettelsen din for vurdering',

  earnedXp: 'Tjent {xp} erfaringspoeng',
  tapHint: 'Trykk',
  saveToVaultPrompt: 'Trykk for å lagre i Ordforrådhvelvet:',
  fullPhrase: 'HELE FRASEN',

  aiIntroMessage: 'Hei! Jeg kan hjelpe med å forklare grammatikkregler. Hva vil du vite?',
  polyPuffTyping: 'Poly-Puff skriver',
  askAboutGrammarPlaceholder: 'Spør om grammatikk…',
  askGrammarQuestion: 'Still Poly-Puff et grammatikkspørsmål',
  sendMessage: 'Send melding',
  reportAiResponseA11y: 'Rapporter dette AI-svaret',
  youSaidA11y: 'Du sa: {text}',
  aiResponseA11y: '{brand}, AI-svar: {text}',
  chatError: 'Beklager, jeg hadde problemer med å svare. Prøv igjen!',

  closeSettings: 'Lukk innstillinger',

  selectCefrLevelA11y: 'Velg CEFR-nivå',
  cefrLevelOptionA11y: 'Nivå {l}',
  lengthOptionA11y: '{label} setninger, {desc}',

  announceLevelSelected: 'CEFR-nivå {level} valgt.',
  announceLengthSelected: '{length} setningslengde valgt.',
  announceRetryReady: 'Gjentakelsessetning. Du slet med denne tidligere. Prøv igjen!',
  announceNewSentence: 'Ny setning klar. Skriv din engelske oversettelse.',
  announceAnswerRevealed: 'Svar avslørt: {answer}',

  welcomeBackTitle: '⏸️ Velkommen tilbake',
  welcomeBackMessage: 'Du har en øvelse på gang. Vil du fortsette?',
  startNew: 'Start ny',

  endSessionTitle: 'Avslutt økt',
  endSessionMessage: 'Du fullførte {exercises} øvelser og tjente {xp} XP på {time}. Avslutt økt?',
  endSessionConfirm: 'Avslutt økt',

  errorTitle: 'Feil',
  errorGenerate: 'Klarte ikke å generere setning. Kjører serveren din?',
  errorCheck: 'Klarte ikke å sjekke oversettelsen.',
  errorSaveVault: 'Kunne ikke lagre i hvelvet.',

  alreadyInVault: 'Allerede i hvelvet',
  addedTitle: 'Lagt til! 🎉',
  addedMessage: '«{phrase}» lagret i Ordforrådhvelvet ditt.',

  answerUnavailableTitle: 'Svar ikke tilgjengelig',
  answerUnavailableMissing: 'Denne setningen mangler svaret sitt. Trykk på Neste setning for å få en ny.',
  answerUnavailableTryAgain: 'Jeg kunne ikke avsløre dette svaret. Prøv igjen eller trykk på Neste setning.',

  reportAiTitle: 'Rapporter AI-svar',
  reportAiPrompt: 'Hvilket problem fant du?',
  reportAiInaccurate: 'Unøyaktig',
  reportAiOffensive: 'Kulturelt ufølsomt',
  reportedTitle: 'Rapportert',
  reportedThanksReview: 'Takk. Vi vil vurdere dette.',
  reportedThanksSerious: 'Takk. Vi tar dette alvorlig.',
};

// RTL
const fa: TrainerStrings = {
  toEnglish: '← انگلیسی',

  sentenceLengthHeader: 'طول جمله',
  lengthShort: 'کوتاه',
  lengthMedium: 'متوسط',
  lengthLong: 'بلند',
  lengthShortDesc: '۳-۶ کلمه',
  lengthMediumDesc: '۷-۱۲ کلمه',
  lengthLongDesc: '۱۳-۲۰ کلمه',

  customRequestPlaceholder: 'درخواست سفارشی… (مثال: «زمان گذشته دربارهٔ غذا»)',
  customTopicRequest: 'درخواست موضوع سفارشی',
  customRequestHint: 'یک موضوع خاص یا تمرکز دستوری برای جملهٔ بعدی تایپ کنید',

  newSentenceHint: 'یک جملهٔ جدید برای ترجمه تولید می‌کند',
  startSessionHint: 'یک جلسهٔ تمرین ترجمهٔ جدید را شروع می‌کند',

  opensSettingsHint: 'تنظیمات زبان و سطح را باز می‌کند',

  retryBadge: '🔁 تلاش مجدد',
  retrySentenceA11y: 'جملهٔ تکراری. قبلاً با این جمله مشکل داشتید.',
  bankBadge: '📚 بانک',
  topicLabel: 'موضوع: {topic}',
  topicLabelBank: 'موضوع: {topic}، از بانک تمرین',
  translateThis: 'این جمله را به انگلیسی ترجمه کنید: {sentence}',
  typeTranslationHint: 'ترجمهٔ خود از جملهٔ بالا را تایپ کنید',
  voiceInputUnavailable: 'ورود صوتی برای زبان شما در دسترس نیست',
  voiceNotice: 'ورود صوتی برای گویشوران {language} در مربی ترجمه در دسترس نیست. هنوز می‌توانید از آن در آزمون تعیین سطح استفاده کنید.',

  hintScorePenalty: '(-۲۰)',
  hintStartsWith: 'شروع با: «{word}…»',
  hintUnavailable: 'راهنما در دسترس نیست - بهترین تلاش خود را بکنید!',
  hintPenaltySuffix: ' (جریمهٔ راهنما ۲۰-)',
  revealNoScore: 'پاسخ آشکار شد - هیچ امتیازی داده نشد.',
  revealClueHint: 'یک سرنخ را آشکار می‌کند. امتیاز شما را در ۸۰ محدود می‌کند.',
  revealAnswerHint: 'پاسخ را بدون امتیازدهی آشکار می‌کند',
  submitTranslationHint: 'ترجمهٔ شما را برای امتیازدهی ارسال می‌کند',

  earnedXp: '{xp} امتیاز تجربه کسب شد',
  tapHint: 'ضربه بزنید',
  saveToVaultPrompt: 'برای ذخیره در گنجینهٔ واژگان خود ضربه بزنید:',
  fullPhrase: 'عبارت کامل',

  aiIntroMessage: 'سلام! می‌توانم به توضیح قوانین گرامری کمک کنم. چه می‌خواهی بدانی؟',
  polyPuffTyping: 'Poly-Puff در حال تایپ است',
  askAboutGrammarPlaceholder: 'دربارهٔ گرامر بپرسید…',
  askGrammarQuestion: 'از Poly-Puff یک سؤال گرامری بپرسید',
  sendMessage: 'ارسال پیام',
  reportAiResponseA11y: 'گزارش این پاسخ هوش مصنوعی',
  youSaidA11y: 'شما گفتید: {text}',
  aiResponseA11y: '{brand}، پاسخ هوش مصنوعی: {text}',
  chatError: 'متأسفم، در پاسخ دادن مشکل داشتم. دوباره تلاش کنید!',

  closeSettings: 'بستن تنظیمات',

  selectCefrLevelA11y: 'سطح CEFR را انتخاب کنید',
  cefrLevelOptionA11y: 'سطح {l}',
  lengthOptionA11y: 'جملات {label}، {desc}',

  announceLevelSelected: 'سطح CEFR {level} انتخاب شد.',
  announceLengthSelected: 'طول جملهٔ {length} انتخاب شد.',
  announceRetryReady: 'جملهٔ تکراری. قبلاً با این جمله مشکل داشتید. دوباره تلاش کنید!',
  announceNewSentence: 'جملهٔ جدید آماده است. ترجمهٔ انگلیسی خود را تایپ کنید.',
  announceAnswerRevealed: 'پاسخ آشکار شد: {answer}',

  welcomeBackTitle: '⏸️ خوش آمدید',
  welcomeBackMessage: 'یک تمرین در حال انجام دارید. آیا می‌خواهید ادامه دهید؟',
  startNew: 'شروع جدید',

  endSessionTitle: 'پایان جلسه',
  endSessionMessage: 'شما {exercises} تمرین را تکمیل کردید و در {time} مقدار {xp} XP کسب کردید. پایان جلسه؟',
  endSessionConfirm: 'پایان جلسه',

  errorTitle: 'خطا',
  errorGenerate: 'تولید جمله ناموفق بود. آیا سرور شما در حال اجراست؟',
  errorCheck: 'بررسی ترجمه ناموفق بود.',
  errorSaveVault: 'ذخیره در گنجینه ممکن نبود.',

  alreadyInVault: 'قبلاً در گنجینه',
  addedTitle: 'اضافه شد! 🎉',
  addedMessage: '«{phrase}» در گنجینهٔ واژگان شما ذخیره شد.',

  answerUnavailableTitle: 'پاسخ در دسترس نیست',
  answerUnavailableMissing: 'این جمله پاسخ کلیدی ندارد. لطفاً برای دریافت یک جملهٔ تازه روی «جملهٔ بعدی» ضربه بزنید.',
  answerUnavailableTryAgain: 'نتوانستم این پاسخ را آشکار کنم. لطفاً دوباره تلاش کنید یا روی «جملهٔ بعدی» ضربه بزنید.',

  reportAiTitle: 'گزارش پاسخ هوش مصنوعی',
  reportAiPrompt: 'چه مشکلی پیدا کردید؟',
  reportAiInaccurate: 'نادرست',
  reportAiOffensive: 'بی‌توجه به فرهنگ',
  reportedTitle: 'گزارش شد',
  reportedThanksReview: 'متشکریم. این را بررسی خواهیم کرد.',
  reportedThanksSerious: 'متشکریم. این موضوع را جدی می‌گیریم.',
};

const pl: TrainerStrings = {
  toEnglish: '→ Angielski',

  sentenceLengthHeader: 'Długość zdania',
  lengthShort: 'Krótkie',
  lengthMedium: 'Średnie',
  lengthLong: 'Długie',
  lengthShortDesc: '3-6 słów',
  lengthMediumDesc: '7-12 słów',
  lengthLongDesc: '13-20 słów',

  customRequestPlaceholder: 'Niestandardowe żądanie… (np. „Czas przeszły o jedzeniu")',
  customTopicRequest: 'Niestandardowe żądanie tematu',
  customRequestHint: 'Wpisz konkretny temat lub cel gramatyczny dla następnego zdania',

  newSentenceHint: 'Generuje nowe zdanie do przetłumaczenia',
  startSessionHint: 'Rozpoczyna nową sesję ćwiczeń tłumaczenia',

  opensSettingsHint: 'Otwiera ustawienia języka i poziomu',

  retryBadge: '🔁 PONÓW',
  retrySentenceA11y: 'Zdanie do powtórzenia. Wcześniej miałeś z tym trudność.',
  bankBadge: '📚 Bank',
  topicLabel: 'Temat: {topic}',
  topicLabelBank: 'Temat: {topic}, z banku ćwiczeń',
  translateThis: 'Przetłumacz to zdanie na angielski: {sentence}',
  typeTranslationHint: 'Wpisz swoje tłumaczenie powyższego zdania',
  voiceInputUnavailable: 'Wprowadzanie głosowe niedostępne dla twojego języka',
  voiceNotice: 'Wprowadzanie głosowe nie jest dostępne dla mówiących {language} w Trenerze tłumaczeń. Nadal możesz go używać w Teście poziomującym.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Zaczyna się od: „{word}…"',
  hintUnavailable: 'Podpowiedź niedostępna - daj z siebie wszystko!',
  hintPenaltySuffix: ' (-20 kary za podpowiedź)',
  revealNoScore: 'Odpowiedź ujawniona - bez przyznania punktów.',
  revealClueHint: 'Ujawnia wskazówkę. Ogranicza twój wynik do 80.',
  revealAnswerHint: 'Ujawnia odpowiedź bez punktacji',
  submitTranslationHint: 'Wysyła twoje tłumaczenie do oceny',

  earnedXp: 'Zdobyto {xp} punktów doświadczenia',
  tapHint: 'Stuknij',
  saveToVaultPrompt: 'Stuknij, aby zapisać w Skarbcu słownictwa:',
  fullPhrase: 'CAŁA FRAZA',

  aiIntroMessage: 'Cześć! Mogę pomóc wyjaśnić zasady gramatyczne. Co chciałbyś wiedzieć?',
  polyPuffTyping: 'Poly-Puff pisze',
  askAboutGrammarPlaceholder: 'Zapytaj o gramatykę…',
  askGrammarQuestion: 'Zadaj Poly-Puff pytanie gramatyczne',
  sendMessage: 'Wyślij wiadomość',
  reportAiResponseA11y: 'Zgłoś tę odpowiedź AI',
  youSaidA11y: 'Powiedziałeś: {text}',
  aiResponseA11y: '{brand}, odpowiedź AI: {text}',
  chatError: 'Przepraszam, miałem problem z odpowiedzią. Spróbuj ponownie!',

  closeSettings: 'Zamknij ustawienia',

  selectCefrLevelA11y: 'Wybierz poziom CEFR',
  cefrLevelOptionA11y: 'Poziom {l}',
  lengthOptionA11y: 'Zdania {label}, {desc}',

  announceLevelSelected: 'Wybrano poziom CEFR {level}.',
  announceLengthSelected: 'Wybrano długość zdania {length}.',
  announceRetryReady: 'Zdanie do powtórzenia. Wcześniej miałeś z tym trudność. Spróbuj ponownie!',
  announceNewSentence: 'Nowe zdanie gotowe. Wpisz angielskie tłumaczenie.',
  announceAnswerRevealed: 'Odpowiedź ujawniona: {answer}',

  welcomeBackTitle: '⏸️ Witaj z powrotem',
  welcomeBackMessage: 'Masz ćwiczenie w toku. Czy chcesz kontynuować?',
  startNew: 'Zacznij od nowa',

  endSessionTitle: 'Zakończ sesję',
  endSessionMessage: 'Ukończyłeś {exercises} ćwiczeń i zdobyłeś {xp} XP w {time}. Zakończyć sesję?',
  endSessionConfirm: 'Zakończ sesję',

  errorTitle: 'Błąd',
  errorGenerate: 'Nie udało się wygenerować zdania. Czy twój serwer działa?',
  errorCheck: 'Nie udało się sprawdzić tłumaczenia.',
  errorSaveVault: 'Nie można zapisać w skarbcu.',

  alreadyInVault: 'Już w skarbcu',
  addedTitle: 'Dodano! 🎉',
  addedMessage: '„{phrase}" zapisano w twoim Skarbcu słownictwa.',

  answerUnavailableTitle: 'Odpowiedź niedostępna',
  answerUnavailableMissing: 'Temu zdaniu brakuje klucza odpowiedzi. Stuknij Następne zdanie, aby otrzymać nowe.',
  answerUnavailableTryAgain: 'Nie mogłem ujawnić tej odpowiedzi. Spróbuj ponownie lub stuknij Następne zdanie.',

  reportAiTitle: 'Zgłoś odpowiedź AI',
  reportAiPrompt: 'Jaki problem znalazłeś?',
  reportAiInaccurate: 'Niedokładne',
  reportAiOffensive: 'Kulturowo niewrażliwe',
  reportedTitle: 'Zgłoszono',
  reportedThanksReview: 'Dziękujemy. Sprawdzimy to.',
  reportedThanksSerious: 'Dziękujemy. Traktujemy to poważnie.',
};

const pt: TrainerStrings = {
  toEnglish: '→ Inglês',

  sentenceLengthHeader: 'Comprimento da frase',
  lengthShort: 'Curta',
  lengthMedium: 'Média',
  lengthLong: 'Longa',
  lengthShortDesc: '3-6 palavras',
  lengthMediumDesc: '7-12 palavras',
  lengthLongDesc: '13-20 palavras',

  customRequestPlaceholder: "Pedido personalizado… (ex.: «Pretérito sobre comida»)",
  customTopicRequest: 'Pedido de tema personalizado',
  customRequestHint: 'Escreva um tema específico ou foco gramatical para a próxima frase',

  newSentenceHint: 'Gera uma nova frase para traduzir',
  startSessionHint: 'Inicia uma nova sessão de prática de tradução',

  opensSettingsHint: 'Abre as definições de idioma e nível',

  retryBadge: '🔁 REPETIR',
  retrySentenceA11y: 'Frase de repetição. Já tinhas tido dificuldades com esta.',
  bankBadge: '📚 Banco',
  topicLabel: 'Tema: {topic}',
  topicLabelBank: 'Tema: {topic}, do banco de exercícios',
  translateThis: 'Traduz esta frase para inglês: {sentence}',
  typeTranslationHint: 'Escreve a tua tradução da frase acima',
  voiceInputUnavailable: 'Entrada por voz não disponível para o teu idioma',
  voiceNotice: 'A entrada por voz não está disponível para falantes de {language} no Treinador de Tradução. Ainda podes usá-la no Teste de Nivelamento.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Começa por: «{word}…»',
  hintUnavailable: 'Dica indisponível - dá o teu melhor!',
  hintPenaltySuffix: ' (penalidade de dica -20)',
  revealNoScore: 'Resposta revelada - não foram atribuídos pontos.',
  revealClueHint: 'Revela uma pista. Limita a tua pontuação a 80.',
  revealAnswerHint: 'Revela a resposta sem atribuir pontos',
  submitTranslationHint: 'Envia a tua tradução para avaliação',

  earnedXp: '{xp} pontos de experiência ganhos',
  tapHint: 'Tocar',
  saveToVaultPrompt: 'Toca para guardar no teu Cofre de Vocabulário:',
  fullPhrase: 'FRASE COMPLETA',

  aiIntroMessage: 'Olá! Posso ajudar a explicar regras gramaticais. O que gostarias de saber?',
  polyPuffTyping: 'Poly-Puff está a escrever',
  askAboutGrammarPlaceholder: 'Pergunta sobre gramática…',
  askGrammarQuestion: 'Faz uma pergunta de gramática ao Poly-Puff',
  sendMessage: 'Enviar mensagem',
  reportAiResponseA11y: 'Reportar esta resposta da IA',
  youSaidA11y: 'Disseste: {text}',
  aiResponseA11y: '{brand}, resposta da IA: {text}',
  chatError: 'Desculpa, tive problemas a responder. Tenta de novo!',

  closeSettings: 'Fechar definições',

  selectCefrLevelA11y: 'Seleciona o nível CEFR',
  cefrLevelOptionA11y: 'Nível {l}',
  lengthOptionA11y: 'Frases {label}, {desc}',

  announceLevelSelected: 'Nível CEFR {level} selecionado.',
  announceLengthSelected: 'Comprimento de frase {length} selecionado.',
  announceRetryReady: 'Frase de repetição. Já tinhas tido dificuldades com esta. Tenta de novo!',
  announceNewSentence: 'Nova frase pronta. Escreve a tua tradução em inglês.',
  announceAnswerRevealed: 'Resposta revelada: {answer}',

  welcomeBackTitle: '⏸️ Bem-vindo de volta',
  welcomeBackMessage: 'Tens um exercício em curso. Queres continuar?',
  startNew: 'Começar de novo',

  endSessionTitle: 'Terminar sessão',
  endSessionMessage: 'Completaste {exercises} exercícios e ganhaste {xp} XP em {time}. Terminar sessão?',
  endSessionConfirm: 'Terminar sessão',

  errorTitle: 'Erro',
  errorGenerate: 'Falha ao gerar a frase. O teu servidor está a funcionar?',
  errorCheck: 'Falha ao verificar a tradução.',
  errorSaveVault: 'Não foi possível guardar no cofre.',

  alreadyInVault: 'Já no cofre',
  addedTitle: 'Adicionado! 🎉',
  addedMessage: '«{phrase}» guardado no teu Cofre de Vocabulário.',

  answerUnavailableTitle: 'Resposta indisponível',
  answerUnavailableMissing: 'Falta a chave de resposta a esta frase. Por favor, toca em Próxima frase para obter uma nova.',
  answerUnavailableTryAgain: 'Não consegui revelar esta resposta. Tenta de novo ou toca em Próxima frase.',

  reportAiTitle: 'Reportar resposta da IA',
  reportAiPrompt: 'Que problema encontraste?',
  reportAiInaccurate: 'Impreciso',
  reportAiOffensive: 'Culturalmente insensível',
  reportedTitle: 'Reportado',
  reportedThanksReview: 'Obrigado. Vamos analisar isto.',
  reportedThanksSerious: 'Obrigado. Levamos isto a sério.',
};

const pa: TrainerStrings = {
  toEnglish: '→ ਅੰਗਰੇਜ਼ੀ',

  sentenceLengthHeader: 'ਵਾਕ ਦੀ ਲੰਬਾਈ',
  lengthShort: 'ਛੋਟਾ',
  lengthMedium: 'ਦਰਮਿਆਨਾ',
  lengthLong: 'ਲੰਬਾ',
  lengthShortDesc: '3-6 ਸ਼ਬਦ',
  lengthMediumDesc: '7-12 ਸ਼ਬਦ',
  lengthLongDesc: '13-20 ਸ਼ਬਦ',

  customRequestPlaceholder: 'ਕਸਟਮ ਬੇਨਤੀ… (ਉਦਾਹਰਨ \'ਖਾਣੇ ਬਾਰੇ ਬੀਤੇ ਕਾਲ\')',
  customTopicRequest: 'ਕਸਟਮ ਵਿਸ਼ਾ ਬੇਨਤੀ',
  customRequestHint: 'ਅਗਲੇ ਵਾਕ ਲਈ ਖਾਸ ਵਿਸ਼ਾ ਜਾਂ ਵਿਆਕਰਨ ਫੋਕਸ ਟਾਈਪ ਕਰੋ',

  newSentenceHint: 'ਅਨੁਵਾਦ ਲਈ ਨਵਾਂ ਵਾਕ ਬਣਾਉਂਦਾ ਹੈ',
  startSessionHint: 'ਨਵਾਂ ਅਨੁਵਾਦ ਅਭਿਆਸ ਸੈਸ਼ਨ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ',

  opensSettingsHint: 'ਭਾਸ਼ਾ ਅਤੇ ਪੱਧਰ ਸੈਟਿੰਗਾਂ ਖੋਲ੍ਹਦਾ ਹੈ',

  retryBadge: '🔁 ਮੁੜ ਕੋਸ਼ਿਸ਼',
  retrySentenceA11y: 'ਮੁੜ ਕੋਸ਼ਿਸ਼ ਵਾਕ। ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਇਸ ਨਾਲ ਮੁਸ਼ਕਲ ਆਈ ਸੀ।',
  bankBadge: '📚 ਬੈਂਕ',
  topicLabel: 'ਵਿਸ਼ਾ: {topic}',
  topicLabelBank: 'ਵਿਸ਼ਾ: {topic}, ਅਭਿਆਸ ਬੈਂਕ ਤੋਂ',
  translateThis: 'ਇਸ ਵਾਕ ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਅਨੁਵਾਦ ਕਰੋ: {sentence}',
  typeTranslationHint: 'ਉੱਪਰਲੇ ਵਾਕ ਦਾ ਆਪਣਾ ਅਨੁਵਾਦ ਟਾਈਪ ਕਰੋ',
  voiceInputUnavailable: 'ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਲਈ ਆਵਾਜ਼ ਇਨਪੁੱਟ ਉਪਲਬਧ ਨਹੀਂ',
  voiceNotice: 'ਅਨੁਵਾਦ ਟ੍ਰੇਨਰ ਵਿੱਚ {language} ਬੋਲਣ ਵਾਲਿਆਂ ਲਈ ਆਵਾਜ਼ ਇਨਪੁੱਟ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਤੁਸੀਂ ਅਜੇ ਵੀ ਪੱਧਰ ਨਿਰਧਾਰਨ ਟੈਸਟ ਵਿੱਚ ਇਸਦੀ ਵਰਤੋਂ ਕਰ ਸਕਦੇ ਹੋ।',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'ਇਸ ਨਾਲ ਸ਼ੁਰੂ: "{word}…"',
  hintUnavailable: 'ਸੁਰਾਗ ਉਪਲਬਧ ਨਹੀਂ - ਆਪਣੀ ਪੂਰੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ!',
  hintPenaltySuffix: ' (-20 ਸੁਰਾਗ ਜੁਰਮਾਨਾ)',
  revealNoScore: 'ਜਵਾਬ ਪ੍ਰਗਟ ਹੋਇਆ - ਕੋਈ ਅੰਕ ਨਹੀਂ ਦਿੱਤੇ ਗਏ।',
  revealClueHint: 'ਇੱਕ ਸੁਰਾਗ ਦਿਖਾਉਂਦਾ ਹੈ। ਤੁਹਾਡਾ ਸਕੋਰ 80 ਤੱਕ ਸੀਮਤ ਕਰਦਾ ਹੈ।',
  revealAnswerHint: 'ਸਕੋਰਿੰਗ ਤੋਂ ਬਿਨਾਂ ਜਵਾਬ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ',
  submitTranslationHint: 'ਮੁਲਾਂਕਣ ਲਈ ਤੁਹਾਡਾ ਅਨੁਵਾਦ ਜਮ੍ਹਾਂ ਕਰਦਾ ਹੈ',

  earnedXp: '{xp} ਅਨੁਭਵ ਅੰਕ ਮਿਲੇ',
  tapHint: 'ਟੈਪ',
  saveToVaultPrompt: 'ਆਪਣੀ ਸ਼ਬਦਾਵਲੀ ਤਿਜੋਰੀ ਵਿੱਚ ਸੰਭਾਲਣ ਲਈ ਟੈਪ ਕਰੋ:',
  fullPhrase: 'ਪੂਰਾ ਵਾਕਾਂਸ਼',

  aiIntroMessage: 'ਹੈਲੋ! ਮੈਂ ਵਿਆਕਰਨ ਨਿਯਮ ਸਮਝਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੋਗੇ?',
  polyPuffTyping: 'Poly-Puff ਟਾਈਪ ਕਰ ਰਿਹਾ ਹੈ',
  askAboutGrammarPlaceholder: 'ਵਿਆਕਰਨ ਬਾਰੇ ਪੁੱਛੋ…',
  askGrammarQuestion: 'Poly-Puff ਨੂੰ ਵਿਆਕਰਨ ਸਵਾਲ ਪੁੱਛੋ',
  sendMessage: 'ਸੁਨੇਹਾ ਭੇਜੋ',
  reportAiResponseA11y: 'ਇਸ AI ਜਵਾਬ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
  youSaidA11y: 'ਤੁਸੀਂ ਕਿਹਾ: {text}',
  aiResponseA11y: '{brand}, AI ਜਵਾਬ: {text}',
  chatError: 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਜਵਾਬ ਦੇਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਆਈ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ!',

  closeSettings: 'ਸੈਟਿੰਗਾਂ ਬੰਦ ਕਰੋ',

  selectCefrLevelA11y: 'CEFR ਪੱਧਰ ਚੁਣੋ',
  cefrLevelOptionA11y: 'ਪੱਧਰ {l}',
  lengthOptionA11y: '{label} ਵਾਕ, {desc}',

  announceLevelSelected: 'CEFR ਪੱਧਰ {level} ਚੁਣਿਆ ਗਿਆ।',
  announceLengthSelected: '{length} ਵਾਕ ਦੀ ਲੰਬਾਈ ਚੁਣੀ ਗਈ।',
  announceRetryReady: 'ਮੁੜ ਕੋਸ਼ਿਸ਼ ਵਾਕ। ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਇਸ ਨਾਲ ਮੁਸ਼ਕਲ ਆਈ ਸੀ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ!',
  announceNewSentence: 'ਨਵਾਂ ਵਾਕ ਤਿਆਰ ਹੈ। ਆਪਣਾ ਅੰਗਰੇਜ਼ੀ ਅਨੁਵਾਦ ਟਾਈਪ ਕਰੋ।',
  announceAnswerRevealed: 'ਜਵਾਬ ਪ੍ਰਗਟ: {answer}',

  welcomeBackTitle: '⏸️ ਮੁੜ ਜੀ ਆਇਆਂ',
  welcomeBackMessage: 'ਤੁਹਾਡਾ ਇੱਕ ਅਭਿਆਸ ਚੱਲ ਰਿਹਾ ਹੈ। ਕੀ ਤੁਸੀਂ ਜਾਰੀ ਰੱਖਣਾ ਚਾਹੁੰਦੇ ਹੋ?',
  startNew: 'ਨਵਾਂ ਸ਼ੁਰੂ ਕਰੋ',

  endSessionTitle: 'ਸੈਸ਼ਨ ਖ਼ਤਮ ਕਰੋ',
  endSessionMessage: 'ਤੁਸੀਂ {exercises} ਅਭਿਆਸ ਪੂਰੇ ਕੀਤੇ ਅਤੇ {time} ਵਿੱਚ {xp} XP ਕਮਾਏ। ਸੈਸ਼ਨ ਖ਼ਤਮ?',
  endSessionConfirm: 'ਸੈਸ਼ਨ ਖ਼ਤਮ ਕਰੋ',

  errorTitle: 'ਗਲਤੀ',
  errorGenerate: 'ਵਾਕ ਬਣਾਉਣ ਵਿੱਚ ਅਸਫਲ। ਕੀ ਤੁਹਾਡਾ ਸਰਵਰ ਚੱਲ ਰਿਹਾ ਹੈ?',
  errorCheck: 'ਅਨੁਵਾਦ ਜਾਂਚਣ ਵਿੱਚ ਅਸਫਲ।',
  errorSaveVault: 'ਤਿਜੋਰੀ ਵਿੱਚ ਸੰਭਾਲਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ।',

  alreadyInVault: 'ਪਹਿਲਾਂ ਹੀ ਤਿਜੋਰੀ ਵਿੱਚ',
  addedTitle: 'ਜੋੜਿਆ! 🎉',
  addedMessage: '"{phrase}" ਤੁਹਾਡੀ ਸ਼ਬਦਾਵਲੀ ਤਿਜੋਰੀ ਵਿੱਚ ਸੰਭਾਲਿਆ।',

  answerUnavailableTitle: 'ਜਵਾਬ ਉਪਲਬਧ ਨਹੀਂ',
  answerUnavailableMissing: 'ਇਸ ਵਾਕ ਦਾ ਜਵਾਬ ਮੌਜੂਦ ਨਹੀਂ। ਕਿਰਪਾ ਕਰਕੇ ਨਵਾਂ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਅਗਲੇ ਵਾਕ \'ਤੇ ਟੈਪ ਕਰੋ।',
  answerUnavailableTryAgain: 'ਮੈਂ ਇਹ ਜਵਾਬ ਪ੍ਰਗਟ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਅਗਲੇ ਵਾਕ \'ਤੇ ਟੈਪ ਕਰੋ।',

  reportAiTitle: 'AI ਜਵਾਬ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
  reportAiPrompt: 'ਤੁਹਾਨੂੰ ਕੀ ਸਮੱਸਿਆ ਮਿਲੀ?',
  reportAiInaccurate: 'ਗਲਤ',
  reportAiOffensive: 'ਸੱਭਿਆਚਾਰਕ ਤੌਰ \'ਤੇ ਅਸੰਵੇਦਨਸ਼ੀਲ',
  reportedTitle: 'ਰਿਪੋਰਟ ਕੀਤਾ ਗਿਆ',
  reportedThanksReview: 'ਧੰਨਵਾਦ। ਅਸੀਂ ਇਸ ਦੀ ਸਮੀਖਿਆ ਕਰਾਂਗੇ।',
  reportedThanksSerious: 'ਧੰਨਵਾਦ। ਅਸੀਂ ਇਸ ਨੂੰ ਗੰਭੀਰਤਾ ਨਾਲ ਲੈਂਦੇ ਹਾਂ।',
};

const ro: TrainerStrings = {
  toEnglish: '→ Engleză',

  sentenceLengthHeader: 'Lungimea propoziției',
  lengthShort: 'Scurtă',
  lengthMedium: 'Medie',
  lengthLong: 'Lungă',
  lengthShortDesc: '3-6 cuvinte',
  lengthMediumDesc: '7-12 cuvinte',
  lengthLongDesc: '13-20 cuvinte',

  customRequestPlaceholder: 'Cerere personalizată… (ex. „Timpul trecut despre mâncare")',
  customTopicRequest: 'Cerere de subiect personalizat',
  customRequestHint: 'Tastați un subiect specific sau focus gramatical pentru propoziția următoare',

  newSentenceHint: 'Generează o nouă propoziție de tradus',
  startSessionHint: 'Începe o nouă sesiune de practică de traducere',

  opensSettingsHint: 'Deschide setările de limbă și nivel',

  retryBadge: '🔁 REÎNCERCAȚI',
  retrySentenceA11y: 'Propoziție de reluat. Ați avut dificultăți cu aceasta înainte.',
  bankBadge: '📚 Bancă',
  topicLabel: 'Subiect: {topic}',
  topicLabelBank: 'Subiect: {topic}, din banca de exerciții',
  translateThis: 'Traduceți această propoziție în engleză: {sentence}',
  typeTranslationHint: 'Tastați traducerea propoziției de mai sus',
  voiceInputUnavailable: 'Intrarea vocală nu este disponibilă pentru limba ta',
  voiceNotice: 'Intrarea vocală nu este disponibilă pentru vorbitorii de {language} în Antrenorul de traducere. Încă o puteți folosi în Testul de nivel.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Începe cu: „{word}…"',
  hintUnavailable: 'Indiciu indisponibil - faceți tot ce puteți!',
  hintPenaltySuffix: ' (-20 penalizare indiciu)',
  revealNoScore: 'Răspuns dezvăluit - nu s-au acordat puncte.',
  revealClueHint: 'Dezvăluie un indiciu. Vă limitează scorul la 80.',
  revealAnswerHint: 'Dezvăluie răspunsul fără punctare',
  submitTranslationHint: 'Trimite traducerea pentru notare',

  earnedXp: 'Câștigat {xp} puncte de experiență',
  tapHint: 'Apăsare',
  saveToVaultPrompt: 'Apăsați pentru a salva în Seiful de vocabular:',
  fullPhrase: 'FRAZA COMPLETĂ',

  aiIntroMessage: 'Bună! Pot ajuta la explicarea regulilor gramaticale. Ce ai vrea să știi?',
  polyPuffTyping: 'Poly-Puff scrie',
  askAboutGrammarPlaceholder: 'Întreabă despre gramatică…',
  askGrammarQuestion: 'Pune o întrebare gramaticală lui Poly-Puff',
  sendMessage: 'Trimite mesaj',
  reportAiResponseA11y: 'Raportează acest răspuns AI',
  youSaidA11y: 'Ai spus: {text}',
  aiResponseA11y: '{brand}, răspuns AI: {text}',
  chatError: 'Îmi pare rău, am avut probleme la răspuns. Încearcă din nou!',

  closeSettings: 'Închide setările',

  selectCefrLevelA11y: 'Selectează nivelul CEFR',
  cefrLevelOptionA11y: 'Nivel {l}',
  lengthOptionA11y: 'Propoziții {label}, {desc}',

  announceLevelSelected: 'Nivel CEFR {level} selectat.',
  announceLengthSelected: 'Lungime de propoziție {length} selectată.',
  announceRetryReady: 'Propoziție de reluat. Ați avut dificultăți cu aceasta înainte. Încercați din nou!',
  announceNewSentence: 'Propoziție nouă gata. Tastați traducerea în engleză.',
  announceAnswerRevealed: 'Răspuns dezvăluit: {answer}',

  welcomeBackTitle: '⏸️ Bun venit înapoi',
  welcomeBackMessage: 'Aveți un exercițiu în desfășurare. Doriți să continuați?',
  startNew: 'Începe din nou',

  endSessionTitle: 'Încheie sesiunea',
  endSessionMessage: 'Ai completat {exercises} exerciții și ai câștigat {xp} XP în {time}. Încheie sesiunea?',
  endSessionConfirm: 'Încheie sesiunea',

  errorTitle: 'Eroare',
  errorGenerate: 'Eroare la generarea propoziției. Serverul tău funcționează?',
  errorCheck: 'Eroare la verificarea traducerii.',
  errorSaveVault: 'Nu s-a putut salva în seif.',

  alreadyInVault: 'Deja în seif',
  addedTitle: 'Adăugat! 🎉',
  addedMessage: '„{phrase}" salvat în Seiful tău de vocabular.',

  answerUnavailableTitle: 'Răspuns indisponibil',
  answerUnavailableMissing: 'Acestei propoziții îi lipsește cheia de răspuns. Apăsați Următoarea propoziție pentru a obține una nouă.',
  answerUnavailableTryAgain: 'Nu am putut dezvălui acest răspuns. Încercați din nou sau apăsați Următoarea propoziție.',

  reportAiTitle: 'Raportează răspunsul AI',
  reportAiPrompt: 'Ce problemă ai găsit?',
  reportAiInaccurate: 'Inexact',
  reportAiOffensive: 'Insensibil cultural',
  reportedTitle: 'Raportat',
  reportedThanksReview: 'Mulțumim. Vom analiza acest lucru.',
  reportedThanksSerious: 'Mulțumim. Luăm acest lucru în serios.',
};

const ru: TrainerStrings = {
  toEnglish: '→ Английский',

  sentenceLengthHeader: 'Длина предложения',
  lengthShort: 'Короткое',
  lengthMedium: 'Среднее',
  lengthLong: 'Длинное',
  lengthShortDesc: '3-6 слов',
  lengthMediumDesc: '7-12 слов',
  lengthLongDesc: '13-20 слов',

  customRequestPlaceholder: 'Свой запрос… (например, «Прошедшее время о еде»)',
  customTopicRequest: 'Свой запрос темы',
  customRequestHint: 'Введите конкретную тему или грамматический фокус для следующего предложения',

  newSentenceHint: 'Создаёт новое предложение для перевода',
  startSessionHint: 'Начинает новый сеанс практики перевода',

  opensSettingsHint: 'Открывает настройки языка и уровня',

  retryBadge: '🔁 ПОВТОР',
  retrySentenceA11y: 'Повторное предложение. Раньше вы испытывали с ним трудности.',
  bankBadge: '📚 Банк',
  topicLabel: 'Тема: {topic}',
  topicLabelBank: 'Тема: {topic}, из банка упражнений',
  translateThis: 'Переведите это предложение на английский: {sentence}',
  typeTranslationHint: 'Введите ваш перевод предложения выше',
  voiceInputUnavailable: 'Голосовой ввод недоступен для вашего языка',
  voiceNotice: 'Голосовой ввод недоступен для носителей {language} в Тренажёре перевода. Вы всё ещё можете использовать его в Тесте на уровень.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Начинается с: «{word}…»',
  hintUnavailable: 'Подсказка недоступна - постарайтесь!',
  hintPenaltySuffix: ' (штраф за подсказку -20)',
  revealNoScore: 'Ответ раскрыт - баллы не начислены.',
  revealClueHint: 'Раскрывает подсказку. Ограничивает ваш балл до 80.',
  revealAnswerHint: 'Раскрывает ответ без оценки',
  submitTranslationHint: 'Отправляет ваш перевод на оценку',

  earnedXp: 'Получено {xp} очков опыта',
  tapHint: 'Нажать',
  saveToVaultPrompt: 'Нажмите, чтобы сохранить в Хранилище слов:',
  fullPhrase: 'ПОЛНАЯ ФРАЗА',

  aiIntroMessage: 'Привет! Я могу помочь объяснить правила грамматики. Что бы ты хотел узнать?',
  polyPuffTyping: 'Poly-Puff печатает',
  askAboutGrammarPlaceholder: 'Спросите о грамматике…',
  askGrammarQuestion: 'Задайте Poly-Puff вопрос по грамматике',
  sendMessage: 'Отправить сообщение',
  reportAiResponseA11y: 'Пожаловаться на этот ответ ИИ',
  youSaidA11y: 'Вы сказали: {text}',
  aiResponseA11y: '{brand}, ответ ИИ: {text}',
  chatError: 'Извините, у меня были проблемы с ответом. Попробуйте ещё раз!',

  closeSettings: 'Закрыть настройки',

  selectCefrLevelA11y: 'Выберите уровень CEFR',
  cefrLevelOptionA11y: 'Уровень {l}',
  lengthOptionA11y: 'Предложения {label}, {desc}',

  announceLevelSelected: 'Выбран уровень CEFR {level}.',
  announceLengthSelected: 'Выбрана длина предложения {length}.',
  announceRetryReady: 'Повторное предложение. Раньше вы испытывали с ним трудности. Попробуйте ещё раз!',
  announceNewSentence: 'Новое предложение готово. Введите ваш перевод на английский.',
  announceAnswerRevealed: 'Ответ раскрыт: {answer}',

  welcomeBackTitle: '⏸️ Добро пожаловать обратно',
  welcomeBackMessage: 'У вас есть упражнение в процессе. Хотите продолжить?',
  startNew: 'Начать заново',

  endSessionTitle: 'Завершить сеанс',
  endSessionMessage: 'Вы выполнили {exercises} упражнений и получили {xp} XP за {time}. Завершить сеанс?',
  endSessionConfirm: 'Завершить сеанс',

  errorTitle: 'Ошибка',
  errorGenerate: 'Не удалось создать предложение. Работает ли ваш сервер?',
  errorCheck: 'Не удалось проверить перевод.',
  errorSaveVault: 'Не удалось сохранить в хранилище.',

  alreadyInVault: 'Уже в хранилище',
  addedTitle: 'Добавлено! 🎉',
  addedMessage: '«{phrase}» сохранено в вашем Хранилище слов.',

  answerUnavailableTitle: 'Ответ недоступен',
  answerUnavailableMissing: 'В этом предложении отсутствует ключ ответа. Пожалуйста, нажмите Следующее предложение, чтобы получить новое.',
  answerUnavailableTryAgain: 'Я не смог раскрыть этот ответ. Пожалуйста, попробуйте снова или нажмите Следующее предложение.',

  reportAiTitle: 'Пожаловаться на ответ ИИ',
  reportAiPrompt: 'Какую проблему вы обнаружили?',
  reportAiInaccurate: 'Неточно',
  reportAiOffensive: 'Культурно нечувствительно',
  reportedTitle: 'Отправлено',
  reportedThanksReview: 'Спасибо. Мы это рассмотрим.',
  reportedThanksSerious: 'Спасибо. Мы относимся к этому серьёзно.',
};

const si: TrainerStrings = {
  toEnglish: '→ ඉංග්‍රීසි',

  sentenceLengthHeader: 'වාක්‍ය දිග',
  lengthShort: 'කෙටි',
  lengthMedium: 'මධ්‍යම',
  lengthLong: 'දිගු',
  lengthShortDesc: 'වචන 3-6',
  lengthMediumDesc: 'වචන 7-12',
  lengthLongDesc: 'වචන 13-20',

  customRequestPlaceholder: 'අභිරුචි ඉල්ලීම… (උදා. \'ආහාර පිළිබඳ අතීත කාලය\')',
  customTopicRequest: 'අභිරුචි මාතෘකා ඉල්ලීම',
  customRequestHint: 'ඊළඟ වාක්‍යය සඳහා නිශ්චිත මාතෘකාවක් හෝ ව්‍යාකරණ අවධානයක් ටයිප් කරන්න',

  newSentenceHint: 'පරිවර්තනය කිරීමට නව වාක්‍යයක් ජනනය කරයි',
  startSessionHint: 'නව පරිවර්තන පුහුණු සැසියක් ආරම්භ කරයි',

  opensSettingsHint: 'භාෂාව සහ මට්ටම් සැකසුම් විවෘත කරයි',

  retryBadge: '🔁 නැවත',
  retrySentenceA11y: 'නැවත උත්සාහ කිරීමේ වාක්‍යය. ඔබට මෙය පෙර දුෂ්කරයි.',
  bankBadge: '📚 බැංකුව',
  topicLabel: 'මාතෘකාව: {topic}',
  topicLabelBank: 'මාතෘකාව: {topic}, අභ්‍යාස බැංකුවෙන්',
  translateThis: 'මෙම වාක්‍යය ඉංග්‍රීසියට පරිවර්තනය කරන්න: {sentence}',
  typeTranslationHint: 'ඉහත වාක්‍යයේ ඔබේ පරිවර්තනය ටයිප් කරන්න',
  voiceInputUnavailable: 'ඔබේ භාෂාව සඳහා හඬ ආදානය නොමැත',
  voiceNotice: 'පරිවර්තන පුහුණුකරුවේ {language} කථා කරන්නන් සඳහා හඬ ආදානය නොමැත. ඔබට තවමත් එය මට්ටම් පරීක්ෂණයේ භාවිතා කළ හැකිය.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'ආරම්භ වන්නේ: "{word}…"',
  hintUnavailable: 'ඉඟිය නොමැත - හොඳම උත්සාහය දරන්න!',
  hintPenaltySuffix: ' (-20 ඉඟි දඬුවම්)',
  revealNoScore: 'පිළිතුර හෙළිදරව් විය - ලකුණු ලබා දී නැත.',
  revealClueHint: 'ඉඟියක් හෙළිදරව් කරයි. ඔබේ ලකුණු 80 දක්වා සීමා කරයි.',
  revealAnswerHint: 'ලකුණු දීමකින් තොරව පිළිතුර හෙළිදරව් කරයි',
  submitTranslationHint: 'ලකුණු දීම සඳහා ඔබේ පරිවර්තනය ඉදිරිපත් කරයි',

  earnedXp: 'අත්දැකීම් ලකුණු {xp} උපයාගත්තේය',
  tapHint: 'තට්ටු කරන්න',
  saveToVaultPrompt: 'ඔබේ වචන මාලා ගබඩාවේ සුරැකීමට තට්ටු කරන්න:',
  fullPhrase: 'සම්පූර්ණ වාක්‍ය ඛණ්ඩය',

  aiIntroMessage: 'ආයුබෝවන්! මට ව්‍යාකරණ රීති පැහැදිලි කිරීමට උදව් කළ හැකිය. ඔබට දැන ගැනීමට අවශ්‍ය කුමක්ද?',
  polyPuffTyping: 'Poly-Puff ටයිප් කරමින් සිටී',
  askAboutGrammarPlaceholder: 'ව්‍යාකරණ ගැන අසන්න…',
  askGrammarQuestion: 'Poly-Puff ගෙන් ව්‍යාකරණ ප්‍රශ්නයක් අසන්න',
  sendMessage: 'පණිවිඩය යවන්න',
  reportAiResponseA11y: 'මෙම AI ප්‍රතිචාරය වාර්තා කරන්න',
  youSaidA11y: 'ඔබ පැවසුවේ: {text}',
  aiResponseA11y: '{brand}, AI ප්‍රතිචාරය: {text}',
  chatError: 'සමාවන්න, මට පිළිතුරු දීමට අපහසු විය. නැවත උත්සාහ කරන්න!',

  closeSettings: 'සැකසුම් වසන්න',

  selectCefrLevelA11y: 'CEFR මට්ටම තෝරන්න',
  cefrLevelOptionA11y: 'මට්ටම {l}',
  lengthOptionA11y: '{label} වාක්‍ය, {desc}',

  announceLevelSelected: 'CEFR මට්ටම {level} තෝරාගන්නා ලදී.',
  announceLengthSelected: 'වාක්‍ය දිග {length} තෝරාගන්නා ලදී.',
  announceRetryReady: 'නැවත උත්සාහ කිරීමේ වාක්‍යය. ඔබට මෙය පෙර දුෂ්කරයි. නැවත උත්සාහ කරන්න!',
  announceNewSentence: 'නව වාක්‍යය සූදානම්. ඔබේ ඉංග්‍රීසි පරිවර්තනය ටයිප් කරන්න.',
  announceAnswerRevealed: 'පිළිතුර හෙළිදරව් විය: {answer}',

  welcomeBackTitle: '⏸️ නැවත සාදරයෙන් පිළිගනිමු',
  welcomeBackMessage: 'ඔබට අභ්‍යාසයක් ක්‍රියාත්මක වේ. ඔබට ඉදිරියට යාමට අවශ්‍යද?',
  startNew: 'අලුතින් ආරම්භ කරන්න',

  endSessionTitle: 'සැසිය අවසන් කරන්න',
  endSessionMessage: 'ඔබ අභ්‍යාස {exercises}ක් සම්පූර්ණ කර {time} තුළ {xp} XP උපයාගත්තේය. සැසිය අවසන් කරන්නද?',
  endSessionConfirm: 'සැසිය අවසන් කරන්න',

  errorTitle: 'දෝෂයක්',
  errorGenerate: 'වාක්‍යය ජනනය කිරීමට අසමත් විය. ඔබේ සේවාදායකය ක්‍රියාත්මකද?',
  errorCheck: 'පරිවර්තනය පරීක්ෂා කිරීමට අසමත් විය.',
  errorSaveVault: 'ගබඩාවට සුරැකීමට නොහැකි විය.',

  alreadyInVault: 'දැනටමත් ගබඩාවේ',
  addedTitle: 'එකතු කරන ලදී! 🎉',
  addedMessage: '"{phrase}" ඔබේ වචන මාලා ගබඩාවේ සුරැකින ලදී.',

  answerUnavailableTitle: 'පිළිතුර නොමැත',
  answerUnavailableMissing: 'මෙම වාක්‍යයට පිළිතුරු යතුර නැත. නවයක් ලබා ගැනීමට කරුණාකර ඊළඟ වාක්‍යය තට්ටු කරන්න.',
  answerUnavailableTryAgain: 'මට මෙම පිළිතුර හෙළිදරව් කළ නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න හෝ ඊළඟ වාක්‍යය තට්ටු කරන්න.',

  reportAiTitle: 'AI ප්‍රතිචාරය වාර්තා කරන්න',
  reportAiPrompt: 'ඔබට හමු වූ ගැටළුව කුමක්ද?',
  reportAiInaccurate: 'සාවද්‍ය',
  reportAiOffensive: 'සංස්කෘතික වශයෙන් අසංවේදී',
  reportedTitle: 'වාර්තා කරන ලදී',
  reportedThanksReview: 'ස්තූතියි. අපි මෙය සමාලෝචනය කරන්නෙමු.',
  reportedThanksSerious: 'ස්තූතියි. අපි මෙය බැරෑරුම් ලෙස සලකන්නෙමු.',
};

const es: TrainerStrings = {
  toEnglish: '→ Inglés',

  sentenceLengthHeader: 'Longitud de la frase',
  lengthShort: 'Corta',
  lengthMedium: 'Media',
  lengthLong: 'Larga',
  lengthShortDesc: '3-6 palabras',
  lengthMediumDesc: '7-12 palabras',
  lengthLongDesc: '13-20 palabras',

  customRequestPlaceholder: "Solicitud personalizada… (p. ej., «Pasado sobre comida»)",
  customTopicRequest: 'Solicitud de tema personalizado',
  customRequestHint: 'Escribe un tema específico o un enfoque gramatical para la siguiente frase',

  newSentenceHint: 'Genera una nueva frase para traducir',
  startSessionHint: 'Inicia una nueva sesión de práctica de traducción',

  opensSettingsHint: 'Abre los ajustes de idioma y nivel',

  retryBadge: '🔁 REINTENTAR',
  retrySentenceA11y: 'Frase de repetición. Tuviste dificultades con esta antes.',
  bankBadge: '📚 Banco',
  topicLabel: 'Tema: {topic}',
  topicLabelBank: 'Tema: {topic}, del banco de ejercicios',
  translateThis: 'Traduce esta frase al inglés: {sentence}',
  typeTranslationHint: 'Escribe tu traducción de la frase de arriba',
  voiceInputUnavailable: 'Entrada de voz no disponible para tu idioma',
  voiceNotice: 'La entrada de voz no está disponible para hablantes de {language} en el Entrenador de Traducción. Aún puedes usarla en la Prueba de nivel.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Empieza por: «{word}…»',
  hintUnavailable: 'Pista no disponible - ¡da lo mejor de ti!',
  hintPenaltySuffix: ' (penalización de pista -20)',
  revealNoScore: 'Respuesta revelada - no se otorgaron puntos.',
  revealClueHint: 'Revela una pista. Limita tu puntuación a 80.',
  revealAnswerHint: 'Revela la respuesta sin puntuación',
  submitTranslationHint: 'Envía tu traducción para puntuación',

  earnedXp: '{xp} puntos de experiencia ganados',
  tapHint: 'Toca',
  saveToVaultPrompt: 'Toca para guardar en tu Bóveda de Vocabulario:',
  fullPhrase: 'FRASE COMPLETA',

  aiIntroMessage: '¡Hola! Puedo ayudar a explicar reglas gramaticales. ¿Qué te gustaría saber?',
  polyPuffTyping: 'Poly-Puff está escribiendo',
  askAboutGrammarPlaceholder: 'Pregunta sobre gramática…',
  askGrammarQuestion: 'Hazle a Poly-Puff una pregunta de gramática',
  sendMessage: 'Enviar mensaje',
  reportAiResponseA11y: 'Reportar esta respuesta de IA',
  youSaidA11y: 'Dijiste: {text}',
  aiResponseA11y: '{brand}, respuesta de IA: {text}',
  chatError: 'Lo siento, tuve problemas para responder. ¡Inténtalo de nuevo!',

  closeSettings: 'Cerrar ajustes',

  selectCefrLevelA11y: 'Selecciona nivel CEFR',
  cefrLevelOptionA11y: 'Nivel {l}',
  lengthOptionA11y: 'Frases {label}, {desc}',

  announceLevelSelected: 'Nivel CEFR {level} seleccionado.',
  announceLengthSelected: 'Longitud de frase {length} seleccionada.',
  announceRetryReady: 'Frase de repetición. Tuviste dificultades con esta antes. ¡Inténtalo de nuevo!',
  announceNewSentence: 'Nueva frase lista. Escribe tu traducción al inglés.',
  announceAnswerRevealed: 'Respuesta revelada: {answer}',

  welcomeBackTitle: '⏸️ Bienvenido de nuevo',
  welcomeBackMessage: 'Tienes un ejercicio en curso. ¿Quieres continuar?',
  startNew: 'Empezar de nuevo',

  endSessionTitle: 'Terminar sesión',
  endSessionMessage: 'Has completado {exercises} ejercicios y ganado {xp} XP en {time}. ¿Terminar sesión?',
  endSessionConfirm: 'Terminar sesión',

  errorTitle: 'Error',
  errorGenerate: 'Error al generar la frase. ¿Está funcionando tu servidor?',
  errorCheck: 'Error al comprobar la traducción.',
  errorSaveVault: 'No se pudo guardar en la bóveda.',

  alreadyInVault: 'Ya en la bóveda',
  addedTitle: '¡Añadido! 🎉',
  addedMessage: '«{phrase}» guardado en tu Bóveda de Vocabulario.',

  answerUnavailableTitle: 'Respuesta no disponible',
  answerUnavailableMissing: 'Esta frase no tiene clave de respuesta. Toca Siguiente frase para obtener una nueva.',
  answerUnavailableTryAgain: 'No pude revelar esta respuesta. Inténtalo de nuevo o toca Siguiente frase.',

  reportAiTitle: 'Reportar respuesta de IA',
  reportAiPrompt: '¿Qué problema encontraste?',
  reportAiInaccurate: 'Inexacto',
  reportAiOffensive: 'Culturalmente insensible',
  reportedTitle: 'Reportado',
  reportedThanksReview: 'Gracias. Lo revisaremos.',
  reportedThanksSerious: 'Gracias. Nos lo tomamos en serio.',
};

const sw: TrainerStrings = {
  toEnglish: '→ Kiingereza',

  sentenceLengthHeader: 'Urefu wa sentensi',
  lengthShort: 'Fupi',
  lengthMedium: 'Wastani',
  lengthLong: 'Ndefu',
  lengthShortDesc: 'Maneno 3-6',
  lengthMediumDesc: 'Maneno 7-12',
  lengthLongDesc: 'Maneno 13-20',

  customRequestPlaceholder: "Ombi maalumu… (mfano 'Wakati uliopita kuhusu chakula')",
  customTopicRequest: 'Ombi la mada maalumu',
  customRequestHint: 'Andika mada maalumu au lengo la sarufi kwa sentensi ifuatayo',

  newSentenceHint: 'Inazalisha sentensi mpya ya kutafsiri',
  startSessionHint: 'Inaanza kipindi kipya cha mazoezi ya tafsiri',

  opensSettingsHint: 'Inafungua mipangilio ya lugha na kiwango',

  retryBadge: '🔁 JARIBU TENA',
  retrySentenceA11y: 'Sentensi ya kurudia. Ulipata shida na hii hapo awali.',
  bankBadge: '📚 Benki',
  topicLabel: 'Mada: {topic}',
  topicLabelBank: 'Mada: {topic}, kutoka benki ya mazoezi',
  translateThis: 'Tafsiri sentensi hii kwa Kiingereza: {sentence}',
  typeTranslationHint: 'Andika tafsiri yako ya sentensi hapo juu',
  voiceInputUnavailable: 'Uingizaji wa sauti haupatikani kwa lugha yako',
  voiceNotice: 'Uingizaji wa sauti haupatikani kwa wazungumzaji wa {language} katika Mkufunzi wa Tafsiri. Bado unaweza kuutumia katika Jaribio la kuweka kiwango.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Inaanza na: "{word}…"',
  hintUnavailable: 'Kidokezo hakipatikani - jaribu vyema!',
  hintPenaltySuffix: ' (adhabu ya kidokezo -20)',
  revealNoScore: 'Jibu limefichuliwa - hakuna alama zilizotolewa.',
  revealClueHint: 'Inafichua kidokezo. Inazuia alama yako kwa 80.',
  revealAnswerHint: 'Inafichua jibu bila kupata alama',
  submitTranslationHint: 'Inawasilisha tafsiri yako kwa ukadiriaji',

  earnedXp: 'Umepata pointi {xp} za uzoefu',
  tapHint: 'Gusa',
  saveToVaultPrompt: 'Gusa ili kuhifadhi katika Kasha lako la Msamiati:',
  fullPhrase: 'KIFUNGU KAMILI',

  aiIntroMessage: 'Habari! Naweza kusaidia kueleza kanuni za sarufi. Ungependa kujua nini?',
  polyPuffTyping: 'Poly-Puff anaandika',
  askAboutGrammarPlaceholder: 'Uliza kuhusu sarufi…',
  askGrammarQuestion: 'Muulize Poly-Puff swali la sarufi',
  sendMessage: 'Tuma ujumbe',
  reportAiResponseA11y: 'Ripoti jibu hili la AI',
  youSaidA11y: 'Ulisema: {text}',
  aiResponseA11y: '{brand}, jibu la AI: {text}',
  chatError: 'Samahani, nilipata shida ya kujibu. Jaribu tena!',

  closeSettings: 'Funga mipangilio',

  selectCefrLevelA11y: 'Chagua kiwango cha CEFR',
  cefrLevelOptionA11y: 'Kiwango {l}',
  lengthOptionA11y: 'Sentensi za {label}, {desc}',

  announceLevelSelected: 'Kiwango cha CEFR {level} kimechaguliwa.',
  announceLengthSelected: 'Urefu wa sentensi {length} umechaguliwa.',
  announceRetryReady: 'Sentensi ya kurudia. Ulipata shida na hii hapo awali. Jaribu tena!',
  announceNewSentence: 'Sentensi mpya iko tayari. Andika tafsiri yako ya Kiingereza.',
  announceAnswerRevealed: 'Jibu limefichuliwa: {answer}',

  welcomeBackTitle: '⏸️ Karibu tena',
  welcomeBackMessage: 'Una zoezi linaloendelea. Ungependa kuendelea?',
  startNew: 'Anza mpya',

  endSessionTitle: 'Maliza kipindi',
  endSessionMessage: 'Umemaliza mazoezi {exercises} na kupata {xp} XP katika {time}. Maliza kipindi?',
  endSessionConfirm: 'Maliza kipindi',

  errorTitle: 'Hitilafu',
  errorGenerate: 'Imeshindwa kuzalisha sentensi. Je, seva yako inaendesha?',
  errorCheck: 'Imeshindwa kuangalia tafsiri.',
  errorSaveVault: 'Haikuweza kuhifadhi katika kasha.',

  alreadyInVault: 'Tayari kwenye kasha',
  addedTitle: 'Imeongezwa! 🎉',
  addedMessage: '"{phrase}" imehifadhiwa katika Kasha lako la Msamiati.',

  answerUnavailableTitle: 'Jibu halipatikani',
  answerUnavailableMissing: 'Sentensi hii haina ufunguo wa jibu. Tafadhali gusa Sentensi inayofuata ili kupata mpya.',
  answerUnavailableTryAgain: 'Sikuweza kufichua jibu hili. Tafadhali jaribu tena au gusa Sentensi inayofuata.',

  reportAiTitle: 'Ripoti jibu la AI',
  reportAiPrompt: 'Tatizo gani ulipata?',
  reportAiInaccurate: 'Sio sahihi',
  reportAiOffensive: 'Si nyeti kiutamaduni',
  reportedTitle: 'Imeripotiwa',
  reportedThanksReview: 'Asante. Tutalichunguza hili.',
  reportedThanksSerious: 'Asante. Tunalichukulia hili kwa uzito.',
};

const sv: TrainerStrings = {
  toEnglish: '→ Engelska',

  sentenceLengthHeader: 'Meningslängd',
  lengthShort: 'Kort',
  lengthMedium: 'Medel',
  lengthLong: 'Lång',
  lengthShortDesc: '3-6 ord',
  lengthMediumDesc: '7-12 ord',
  lengthLongDesc: '13-20 ord',

  customRequestPlaceholder: "Anpassad förfrågan… (t.ex. »Preteritum om mat»)",
  customTopicRequest: 'Anpassad ämnesförfrågan',
  customRequestHint: 'Skriv ett specifikt ämne eller grammatiskt fokus för nästa mening',

  newSentenceHint: 'Genererar en ny mening att översätta',
  startSessionHint: 'Startar en ny översättningsövningssession',

  opensSettingsHint: 'Öppnar språk- och nivåinställningar',

  retryBadge: '🔁 FÖRSÖK IGEN',
  retrySentenceA11y: 'Upprepningsmening. Du kämpade med denna tidigare.',
  bankBadge: '📚 Bank',
  topicLabel: 'Ämne: {topic}',
  topicLabelBank: 'Ämne: {topic}, från övningsbanken',
  translateThis: 'Översätt denna mening till engelska: {sentence}',
  typeTranslationHint: 'Skriv din översättning av meningen ovan',
  voiceInputUnavailable: 'Röstinmatning är inte tillgänglig för ditt språk',
  voiceNotice: 'Röstinmatning är inte tillgänglig för {language}-talare i Översättningstränaren. Du kan fortfarande använda den i Nivåtestet.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Börjar med: »{word}…»',
  hintUnavailable: 'Tips ej tillgängligt - gör ditt bästa!',
  hintPenaltySuffix: ' (tipsstraff -20)',
  revealNoScore: 'Svaret avslöjades - inga poäng tilldelades.',
  revealClueHint: 'Avslöjar en ledtråd. Begränsar din poäng till 80.',
  revealAnswerHint: 'Avslöjar svaret utan poängsättning',
  submitTranslationHint: 'Skickar in din översättning för bedömning',

  earnedXp: '{xp} erfarenhetspoäng intjänade',
  tapHint: 'Tryck',
  saveToVaultPrompt: 'Tryck för att spara i ditt Ordvalv:',
  fullPhrase: 'HELA FRASEN',

  aiIntroMessage: 'Hej! Jag kan hjälpa till att förklara grammatikregler. Vad vill du veta?',
  polyPuffTyping: 'Poly-Puff skriver',
  askAboutGrammarPlaceholder: 'Fråga om grammatik…',
  askGrammarQuestion: 'Ställ en grammatikfråga till Poly-Puff',
  sendMessage: 'Skicka meddelande',
  reportAiResponseA11y: 'Rapportera detta AI-svar',
  youSaidA11y: 'Du sa: {text}',
  aiResponseA11y: '{brand}, AI-svar: {text}',
  chatError: 'Tyvärr, jag hade problem att svara. Försök igen!',

  closeSettings: 'Stäng inställningar',

  selectCefrLevelA11y: 'Välj CEFR-nivå',
  cefrLevelOptionA11y: 'Nivå {l}',
  lengthOptionA11y: '{label} meningar, {desc}',

  announceLevelSelected: 'CEFR-nivå {level} vald.',
  announceLengthSelected: '{length} meningslängd vald.',
  announceRetryReady: 'Upprepningsmening. Du kämpade med denna tidigare. Försök igen!',
  announceNewSentence: 'Ny mening klar. Skriv din engelska översättning.',
  announceAnswerRevealed: 'Svar avslöjat: {answer}',

  welcomeBackTitle: '⏸️ Välkommen tillbaka',
  welcomeBackMessage: 'Du har en pågående övning. Vill du fortsätta?',
  startNew: 'Börja på nytt',

  endSessionTitle: 'Avsluta session',
  endSessionMessage: 'Du slutförde {exercises} övningar och tjänade {xp} XP på {time}. Avsluta session?',
  endSessionConfirm: 'Avsluta session',

  errorTitle: 'Fel',
  errorGenerate: 'Det gick inte att generera meningen. Kör din server?',
  errorCheck: 'Det gick inte att kontrollera översättningen.',
  errorSaveVault: 'Kunde inte spara i valvet.',

  alreadyInVault: 'Redan i valvet',
  addedTitle: 'Tillagd! 🎉',
  addedMessage: '»{phrase}» sparad i ditt Ordvalv.',

  answerUnavailableTitle: 'Svar ej tillgängligt',
  answerUnavailableMissing: 'Denna mening saknar svar. Tryck på Nästa mening för att få en ny.',
  answerUnavailableTryAgain: 'Jag kunde inte avslöja detta svar. Försök igen eller tryck på Nästa mening.',

  reportAiTitle: 'Rapportera AI-svar',
  reportAiPrompt: 'Vilket problem hittade du?',
  reportAiInaccurate: 'Oexakt',
  reportAiOffensive: 'Kulturellt okänsligt',
  reportedTitle: 'Rapporterat',
  reportedThanksReview: 'Tack. Vi kommer att granska detta.',
  reportedThanksSerious: 'Tack. Vi tar detta på allvar.',
};

const ta: TrainerStrings = {
  toEnglish: '→ ஆங்கிலம்',

  sentenceLengthHeader: 'வாக்கிய நீளம்',
  lengthShort: 'குறுகிய',
  lengthMedium: 'நடுத்தர',
  lengthLong: 'நீண்ட',
  lengthShortDesc: '3-6 வார்த்தைகள்',
  lengthMediumDesc: '7-12 வார்த்தைகள்',
  lengthLongDesc: '13-20 வார்த்தைகள்',

  customRequestPlaceholder: 'தனிப்பயன் கோரிக்கை… (எ.கா. \'உணவு பற்றிய இறந்த காலம்\')',
  customTopicRequest: 'தனிப்பயன் தலைப்பு கோரிக்கை',
  customRequestHint: 'அடுத்த வாக்கியத்திற்கு குறிப்பிட்ட தலைப்பு அல்லது இலக்கண கவனத்தை உள்ளிடவும்',

  newSentenceHint: 'மொழிபெயர்க்க புதிய வாக்கியத்தை உருவாக்குகிறது',
  startSessionHint: 'புதிய மொழிபெயர்ப்பு பயிற்சி அமர்வைத் தொடங்குகிறது',

  opensSettingsHint: 'மொழி மற்றும் நிலை அமைப்புகளைத் திறக்கிறது',

  retryBadge: '🔁 மீண்டும்',
  retrySentenceA11y: 'மீண்டும் முயற்சி வாக்கியம். முன்பு உங்களுக்கு இதில் சிரமம் இருந்தது.',
  bankBadge: '📚 வங்கி',
  topicLabel: 'தலைப்பு: {topic}',
  topicLabelBank: 'தலைப்பு: {topic}, பயிற்சி வங்கியிலிருந்து',
  translateThis: 'இந்த வாக்கியத்தை ஆங்கிலத்தில் மொழிபெயர்க்கவும்: {sentence}',
  typeTranslationHint: 'மேலே உள்ள வாக்கியத்தின் உங்கள் மொழிபெயர்ப்பைத் தட்டச்சு செய்யவும்',
  voiceInputUnavailable: 'உங்கள் மொழிக்கு குரல் உள்ளீடு கிடைக்கவில்லை',
  voiceNotice: 'மொழிபெயர்ப்பு பயிற்சியாளரில் {language} பேசுபவர்களுக்கு குரல் உள்ளீடு கிடைக்கவில்லை. நிலை நிர்ணய சோதனையில் நீங்கள் இன்னும் அதைப் பயன்படுத்தலாம்.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'இதிலிருந்து தொடங்குகிறது: "{word}…"',
  hintUnavailable: 'குறிப்பு கிடைக்கவில்லை - உங்கள் சிறந்ததைச் செய்யுங்கள்!',
  hintPenaltySuffix: ' (-20 குறிப்பு அபராதம்)',
  revealNoScore: 'பதில் வெளிப்படுத்தப்பட்டது - மதிப்பெண் வழங்கப்படவில்லை.',
  revealClueHint: 'ஒரு குறிப்பை வெளிப்படுத்துகிறது. உங்கள் மதிப்பெண்ணை 80 ஆக வரம்பிடுகிறது.',
  revealAnswerHint: 'மதிப்பெண் இல்லாமல் பதிலை வெளிப்படுத்துகிறது',
  submitTranslationHint: 'மதிப்பீட்டிற்கு உங்கள் மொழிபெயர்ப்பை சமர்ப்பிக்கிறது',

  earnedXp: '{xp} அனுபவ புள்ளிகள் சம்பாதித்தனர்',
  tapHint: 'தட்டவும்',
  saveToVaultPrompt: 'உங்கள் சொற்களஞ்சியத்தில் சேமிக்க தட்டவும்:',
  fullPhrase: 'முழு சொற்றொடர்',

  aiIntroMessage: 'வணக்கம்! இலக்கண விதிகளை விளக்க உதவ முடியும். நீங்கள் என்ன அறிய விரும்புகிறீர்கள்?',
  polyPuffTyping: 'Poly-Puff தட்டச்சு செய்கிறது',
  askAboutGrammarPlaceholder: 'இலக்கணம் பற்றி கேளுங்கள்…',
  askGrammarQuestion: 'Poly-Puff இடம் இலக்கண கேள்வி கேளுங்கள்',
  sendMessage: 'செய்தி அனுப்பு',
  reportAiResponseA11y: 'இந்த AI பதிலைப் புகாரளி',
  youSaidA11y: 'நீங்கள் சொன்னீர்கள்: {text}',
  aiResponseA11y: '{brand}, AI பதில்: {text}',
  chatError: 'மன்னிக்கவும், பதிலளிப்பதில் எனக்கு சிக்கல் இருந்தது. மீண்டும் முயற்சிக்கவும்!',

  closeSettings: 'அமைப்புகளை மூடு',

  selectCefrLevelA11y: 'CEFR நிலையைத் தேர்ந்தெடுக்கவும்',
  cefrLevelOptionA11y: 'நிலை {l}',
  lengthOptionA11y: '{label} வாக்கியங்கள், {desc}',

  announceLevelSelected: 'CEFR நிலை {level} தேர்ந்தெடுக்கப்பட்டது.',
  announceLengthSelected: '{length} வாக்கிய நீளம் தேர்ந்தெடுக்கப்பட்டது.',
  announceRetryReady: 'மீண்டும் முயற்சி வாக்கியம். முன்பு உங்களுக்கு இதில் சிரமம் இருந்தது. மீண்டும் முயற்சிக்கவும்!',
  announceNewSentence: 'புதிய வாக்கியம் தயார். உங்கள் ஆங்கில மொழிபெயர்ப்பைத் தட்டச்சு செய்யவும்.',
  announceAnswerRevealed: 'பதில் வெளிப்படுத்தப்பட்டது: {answer}',

  welcomeBackTitle: '⏸️ மீண்டும் வரவேற்கிறோம்',
  welcomeBackMessage: 'நீங்கள் ஒரு பயிற்சியில் உள்ளீர்கள். தொடர விரும்புகிறீர்களா?',
  startNew: 'புதிதாகத் தொடங்கு',

  endSessionTitle: 'அமர்வை முடிக்கவும்',
  endSessionMessage: 'நீங்கள் {exercises} பயிற்சிகளை முடித்து {time} இல் {xp} XP சம்பாதித்தீர்கள். அமர்வை முடிக்கவா?',
  endSessionConfirm: 'அமர்வை முடிக்கவும்',

  errorTitle: 'பிழை',
  errorGenerate: 'வாக்கியத்தை உருவாக்க முடியவில்லை. உங்கள் சர்வர் இயங்குகிறதா?',
  errorCheck: 'மொழிபெயர்ப்பைச் சரிபார்க்க முடியவில்லை.',
  errorSaveVault: 'களஞ்சியத்தில் சேமிக்க முடியவில்லை.',

  alreadyInVault: 'ஏற்கனவே களஞ்சியத்தில் உள்ளது',
  addedTitle: 'சேர்க்கப்பட்டது! 🎉',
  addedMessage: '"{phrase}" உங்கள் சொற்களஞ்சியத்தில் சேமிக்கப்பட்டது.',

  answerUnavailableTitle: 'பதில் கிடைக்கவில்லை',
  answerUnavailableMissing: 'இந்த வாக்கியத்திற்கு பதில் இல்லை. தயவுசெய்து புதியதைப் பெற அடுத்த வாக்கியத்தைத் தட்டவும்.',
  answerUnavailableTryAgain: 'இந்த பதிலை வெளிப்படுத்த முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது அடுத்த வாக்கியத்தைத் தட்டவும்.',

  reportAiTitle: 'AI பதிலைப் புகாரளி',
  reportAiPrompt: 'நீங்கள் என்ன பிரச்சினையைக் கண்டறிந்தீர்கள்?',
  reportAiInaccurate: 'துல்லியமற்றது',
  reportAiOffensive: 'கலாச்சார ரீதியாக உணர்வற்றது',
  reportedTitle: 'புகாரளிக்கப்பட்டது',
  reportedThanksReview: 'நன்றி. நாங்கள் இதை மறுபரிசீலனை செய்வோம்.',
  reportedThanksSerious: 'நன்றி. இதை நாங்கள் தீவிரமாக எடுத்துக்கொள்கிறோம்.',
};

const th: TrainerStrings = {
  toEnglish: '→ ภาษาอังกฤษ',

  sentenceLengthHeader: 'ความยาวประโยค',
  lengthShort: 'สั้น',
  lengthMedium: 'กลาง',
  lengthLong: 'ยาว',
  lengthShortDesc: '3-6 คำ',
  lengthMediumDesc: '7-12 คำ',
  lengthLongDesc: '13-20 คำ',

  customRequestPlaceholder: 'คำขอแบบกำหนดเอง… (เช่น "อดีตกาลเกี่ยวกับอาหาร")',
  customTopicRequest: 'คำขอหัวข้อแบบกำหนดเอง',
  customRequestHint: 'พิมพ์หัวข้อเฉพาะหรือจุดเน้นไวยากรณ์สำหรับประโยคถัดไป',

  newSentenceHint: 'สร้างประโยคใหม่เพื่อแปล',
  startSessionHint: 'เริ่มเซสชันฝึกการแปลใหม่',

  opensSettingsHint: 'เปิดการตั้งค่าภาษาและระดับ',

  retryBadge: '🔁 ลองอีกครั้ง',
  retrySentenceA11y: 'ประโยคลองอีกครั้ง คุณเคยมีปัญหากับประโยคนี้ก่อนหน้านี้',
  bankBadge: '📚 ธนาคาร',
  topicLabel: 'หัวข้อ: {topic}',
  topicLabelBank: 'หัวข้อ: {topic} จากธนาคารแบบฝึกหัด',
  translateThis: 'แปลประโยคนี้เป็นภาษาอังกฤษ: {sentence}',
  typeTranslationHint: 'พิมพ์คำแปลของคุณจากประโยคด้านบน',
  voiceInputUnavailable: 'ไม่มีอินพุตเสียงสำหรับภาษาของคุณ',
  voiceNotice: 'อินพุตเสียงไม่พร้อมใช้งานสำหรับผู้พูดภาษา{language}ในผู้ฝึกการแปล คุณยังคงสามารถใช้ในแบบทดสอบจัดระดับได้',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'ขึ้นต้นด้วย: "{word}…"',
  hintUnavailable: 'คำแนะนำไม่พร้อมใช้งาน - พยายามอย่างเต็มที่!',
  hintPenaltySuffix: ' (ค่าปรับคำแนะนำ -20)',
  revealNoScore: 'เปิดเผยคำตอบแล้ว - ไม่ได้รับคะแนน',
  revealClueHint: 'เปิดเผยคำใบ้ จำกัดคะแนนของคุณไว้ที่ 80',
  revealAnswerHint: 'เปิดเผยคำตอบโดยไม่มีคะแนน',
  submitTranslationHint: 'ส่งคำแปลของคุณเพื่อให้คะแนน',

  earnedXp: 'ได้รับ {xp} คะแนนประสบการณ์',
  tapHint: 'แตะ',
  saveToVaultPrompt: 'แตะเพื่อบันทึกในคลังคำศัพท์ของคุณ:',
  fullPhrase: 'วลีเต็ม',

  aiIntroMessage: 'สวัสดี! ฉันสามารถช่วยอธิบายกฎไวยากรณ์ได้ คุณอยากรู้อะไร?',
  polyPuffTyping: 'Poly-Puff กำลังพิมพ์',
  askAboutGrammarPlaceholder: 'ถามเกี่ยวกับไวยากรณ์…',
  askGrammarQuestion: 'ถาม Poly-Puff คำถามไวยากรณ์',
  sendMessage: 'ส่งข้อความ',
  reportAiResponseA11y: 'รายงานการตอบกลับ AI นี้',
  youSaidA11y: 'คุณพูด: {text}',
  aiResponseA11y: '{brand}, การตอบกลับ AI: {text}',
  chatError: 'ขออภัย ฉันมีปัญหาในการตอบกลับ ลองอีกครั้ง!',

  closeSettings: 'ปิดการตั้งค่า',

  selectCefrLevelA11y: 'เลือกระดับ CEFR',
  cefrLevelOptionA11y: 'ระดับ {l}',
  lengthOptionA11y: 'ประโยค{label} {desc}',

  announceLevelSelected: 'เลือกระดับ CEFR {level} แล้ว',
  announceLengthSelected: 'เลือกความยาวประโยค{length}แล้ว',
  announceRetryReady: 'ประโยคลองอีกครั้ง คุณเคยมีปัญหากับประโยคนี้ก่อนหน้านี้ ลองอีกครั้ง!',
  announceNewSentence: 'ประโยคใหม่พร้อมแล้ว พิมพ์คำแปลภาษาอังกฤษของคุณ',
  announceAnswerRevealed: 'เปิดเผยคำตอบ: {answer}',

  welcomeBackTitle: '⏸️ ยินดีต้อนรับกลับ',
  welcomeBackMessage: 'คุณมีแบบฝึกหัดที่กำลังดำเนินอยู่ ต้องการดำเนินการต่อหรือไม่?',
  startNew: 'เริ่มใหม่',

  endSessionTitle: 'จบเซสชัน',
  endSessionMessage: 'คุณทำแบบฝึกหัดเสร็จ {exercises} ชุด และได้ {xp} XP ในเวลา {time} จบเซสชันหรือไม่?',
  endSessionConfirm: 'จบเซสชัน',

  errorTitle: 'ข้อผิดพลาด',
  errorGenerate: 'ไม่สามารถสร้างประโยคได้ เซิร์ฟเวอร์ของคุณทำงานอยู่หรือไม่?',
  errorCheck: 'ไม่สามารถตรวจสอบคำแปลได้',
  errorSaveVault: 'ไม่สามารถบันทึกในคลังได้',

  alreadyInVault: 'อยู่ในคลังแล้ว',
  addedTitle: 'เพิ่มแล้ว! 🎉',
  addedMessage: '"{phrase}" บันทึกในคลังคำศัพท์ของคุณแล้ว',

  answerUnavailableTitle: 'ไม่มีคำตอบ',
  answerUnavailableMissing: 'ประโยคนี้ขาดคำตอบ โปรดแตะประโยคถัดไปเพื่อรับประโยคใหม่',
  answerUnavailableTryAgain: 'ฉันไม่สามารถเปิดเผยคำตอบนี้ได้ โปรดลองอีกครั้งหรือแตะประโยคถัดไป',

  reportAiTitle: 'รายงานการตอบกลับ AI',
  reportAiPrompt: 'คุณพบปัญหาอะไร?',
  reportAiInaccurate: 'ไม่ถูกต้อง',
  reportAiOffensive: 'ไม่ละเอียดอ่อนทางวัฒนธรรม',
  reportedTitle: 'รายงานแล้ว',
  reportedThanksReview: 'ขอบคุณ เราจะตรวจสอบเรื่องนี้',
  reportedThanksSerious: 'ขอบคุณ เราจะรับเรื่องนี้อย่างจริงจัง',
};

const tr: TrainerStrings = {
  toEnglish: '→ İngilizce',

  sentenceLengthHeader: 'Cümle uzunluğu',
  lengthShort: 'Kısa',
  lengthMedium: 'Orta',
  lengthLong: 'Uzun',
  lengthShortDesc: '3-6 kelime',
  lengthMediumDesc: '7-12 kelime',
  lengthLongDesc: '13-20 kelime',

  customRequestPlaceholder: "Özel istek… (örn. 'Yiyecek hakkında geçmiş zaman')",
  customTopicRequest: 'Özel konu isteği',
  customRequestHint: 'Sonraki cümle için belirli bir konu veya dilbilgisi odağı yazın',

  newSentenceHint: 'Çevrilecek yeni bir cümle oluşturur',
  startSessionHint: 'Yeni bir çeviri pratiği oturumu başlatır',

  opensSettingsHint: 'Dil ve seviye ayarlarını açar',

  retryBadge: '🔁 TEKRAR DENE',
  retrySentenceA11y: 'Tekrar deneme cümlesi. Daha önce bu cümleyle zorlandınız.',
  bankBadge: '📚 Banka',
  topicLabel: 'Konu: {topic}',
  topicLabelBank: 'Konu: {topic}, alıştırma bankasından',
  translateThis: 'Bu cümleyi İngilizceye çevirin: {sentence}',
  typeTranslationHint: 'Yukarıdaki cümlenin çevirisini yazın',
  voiceInputUnavailable: 'Diliniz için ses girişi mevcut değil',
  voiceNotice: 'Çeviri Eğitmeni\'nde {language} konuşmacıları için ses girişi mevcut değil. Yine de Seviye Belirleme Sınavı\'nda kullanabilirsiniz.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Şununla başlar: "{word}…"',
  hintUnavailable: 'İpucu mevcut değil - elinizden geleni yapın!',
  hintPenaltySuffix: ' (-20 ipucu cezası)',
  revealNoScore: 'Cevap açıklandı - puan verilmedi.',
  revealClueHint: 'Bir ipucu gösterir. Puanınızı 80 ile sınırlar.',
  revealAnswerHint: 'Puansız cevabı gösterir',
  submitTranslationHint: 'Çevirinizi puanlama için gönderir',

  earnedXp: '{xp} deneyim puanı kazanıldı',
  tapHint: 'Dokun',
  saveToVaultPrompt: 'Kelime Kasası\'na kaydetmek için dokunun:',
  fullPhrase: 'TAM CÜMLE',

  aiIntroMessage: 'Merhaba! Dilbilgisi kurallarını açıklamana yardım edebilirim. Ne öğrenmek istersin?',
  polyPuffTyping: 'Poly-Puff yazıyor',
  askAboutGrammarPlaceholder: 'Dilbilgisi hakkında sor…',
  askGrammarQuestion: 'Poly-Puff\'a bir dilbilgisi sorusu sor',
  sendMessage: 'Mesaj gönder',
  reportAiResponseA11y: 'Bu YZ yanıtını bildir',
  youSaidA11y: 'Sen dedin: {text}',
  aiResponseA11y: '{brand}, YZ yanıtı: {text}',
  chatError: 'Üzgünüm, yanıt vermekte zorluk çektim. Tekrar dene!',

  closeSettings: 'Ayarları kapat',

  selectCefrLevelA11y: 'CEFR seviyesini seçin',
  cefrLevelOptionA11y: 'Seviye {l}',
  lengthOptionA11y: '{label} cümleler, {desc}',

  announceLevelSelected: 'CEFR seviyesi {level} seçildi.',
  announceLengthSelected: '{length} cümle uzunluğu seçildi.',
  announceRetryReady: 'Tekrar deneme cümlesi. Daha önce bu cümleyle zorlandınız. Tekrar deneyin!',
  announceNewSentence: 'Yeni cümle hazır. İngilizce çevirinizi yazın.',
  announceAnswerRevealed: 'Cevap açıklandı: {answer}',

  welcomeBackTitle: '⏸️ Tekrar hoş geldiniz',
  welcomeBackMessage: 'Devam eden bir alıştırmanız var. Devam etmek istiyor musunuz?',
  startNew: 'Yeni başla',

  endSessionTitle: 'Oturumu sonlandır',
  endSessionMessage: '{exercises} alıştırma tamamladınız ve {time} içinde {xp} XP kazandınız. Oturum sonlandırılsın mı?',
  endSessionConfirm: 'Oturumu sonlandır',

  errorTitle: 'Hata',
  errorGenerate: 'Cümle oluşturulamadı. Sunucunuz çalışıyor mu?',
  errorCheck: 'Çeviri kontrol edilemedi.',
  errorSaveVault: 'Kasaya kaydedilemedi.',

  alreadyInVault: 'Zaten kasada',
  addedTitle: 'Eklendi! 🎉',
  addedMessage: '"{phrase}" Kelime Kasanıza kaydedildi.',

  answerUnavailableTitle: 'Cevap mevcut değil',
  answerUnavailableMissing: 'Bu cümlenin cevabı eksik. Lütfen yenisini almak için Sonraki cümleye dokunun.',
  answerUnavailableTryAgain: 'Bu cevabı açıklayamadım. Lütfen tekrar deneyin veya Sonraki cümleye dokunun.',

  reportAiTitle: 'YZ yanıtını bildir',
  reportAiPrompt: 'Hangi sorunu buldunuz?',
  reportAiInaccurate: 'Yanlış',
  reportAiOffensive: 'Kültürel olarak duyarsız',
  reportedTitle: 'Bildirildi',
  reportedThanksReview: 'Teşekkürler. Bunu inceleyeceğiz.',
  reportedThanksSerious: 'Teşekkürler. Bunu ciddiye alıyoruz.',
};

const uk: TrainerStrings = {
  toEnglish: '→ Англійська',

  sentenceLengthHeader: 'Довжина речення',
  lengthShort: 'Коротке',
  lengthMedium: 'Середнє',
  lengthLong: 'Довге',
  lengthShortDesc: '3-6 слів',
  lengthMediumDesc: '7-12 слів',
  lengthLongDesc: '13-20 слів',

  customRequestPlaceholder: 'Власний запит… (наприклад, «Минулий час про їжу»)',
  customTopicRequest: 'Запит власної теми',
  customRequestHint: 'Введіть конкретну тему або граматичний фокус для наступного речення',

  newSentenceHint: 'Створює нове речення для перекладу',
  startSessionHint: 'Розпочинає нову сесію практики перекладу',

  opensSettingsHint: 'Відкриває налаштування мови та рівня',

  retryBadge: '🔁 ПОВТОР',
  retrySentenceA11y: 'Повторне речення. Раніше у вас були труднощі з цим.',
  bankBadge: '📚 Банк',
  topicLabel: 'Тема: {topic}',
  topicLabelBank: 'Тема: {topic}, з банку вправ',
  translateThis: 'Перекладіть це речення англійською: {sentence}',
  typeTranslationHint: 'Введіть свій переклад речення вище',
  voiceInputUnavailable: 'Голосовий ввід недоступний для вашої мови',
  voiceNotice: 'Голосовий ввід недоступний для носіїв мови {language} у Тренажері перекладу. Ви все ще можете використовувати його в Тесті визначення рівня.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Починається з: «{word}…»',
  hintUnavailable: 'Підказка недоступна - постарайтеся!',
  hintPenaltySuffix: ' (штраф за підказку -20)',
  revealNoScore: 'Відповідь розкрито - балів не нараховано.',
  revealClueHint: 'Показує підказку. Обмежує ваш бал до 80.',
  revealAnswerHint: 'Показує відповідь без нарахування балів',
  submitTranslationHint: 'Надсилає ваш переклад на оцінку',

  earnedXp: 'Отримано {xp} очок досвіду',
  tapHint: 'Натисніть',
  saveToVaultPrompt: 'Натисніть, щоб зберегти в Сховище слів:',
  fullPhrase: 'ПОВНА ФРАЗА',

  aiIntroMessage: 'Привіт! Я можу допомогти пояснити правила граматики. Що ти хочеш дізнатися?',
  polyPuffTyping: 'Poly-Puff друкує',
  askAboutGrammarPlaceholder: 'Запитайте про граматику…',
  askGrammarQuestion: 'Запитайте у Poly-Puff про граматику',
  sendMessage: 'Надіслати повідомлення',
  reportAiResponseA11y: 'Поскаржитися на цю відповідь ШІ',
  youSaidA11y: 'Ви сказали: {text}',
  aiResponseA11y: '{brand}, відповідь ШІ: {text}',
  chatError: 'Вибачте, у мене виникли проблеми з відповіддю. Спробуйте ще раз!',

  closeSettings: 'Закрити налаштування',

  selectCefrLevelA11y: 'Виберіть рівень CEFR',
  cefrLevelOptionA11y: 'Рівень {l}',
  lengthOptionA11y: 'Речення {label}, {desc}',

  announceLevelSelected: 'Вибрано рівень CEFR {level}.',
  announceLengthSelected: 'Вибрано довжину речення {length}.',
  announceRetryReady: 'Повторне речення. Раніше у вас були труднощі з цим. Спробуйте ще раз!',
  announceNewSentence: 'Нове речення готове. Введіть свій англійський переклад.',
  announceAnswerRevealed: 'Відповідь розкрито: {answer}',

  welcomeBackTitle: '⏸️ Ласкаво просимо назад',
  welcomeBackMessage: 'У вас є вправа в процесі. Хочете продовжити?',
  startNew: 'Почати нову',

  endSessionTitle: 'Завершити сесію',
  endSessionMessage: 'Ви виконали {exercises} вправ і отримали {xp} XP за {time}. Завершити сесію?',
  endSessionConfirm: 'Завершити сесію',

  errorTitle: 'Помилка',
  errorGenerate: 'Не вдалося згенерувати речення. Чи працює ваш сервер?',
  errorCheck: 'Не вдалося перевірити переклад.',
  errorSaveVault: 'Не вдалося зберегти у сховище.',

  alreadyInVault: 'Вже у сховищі',
  addedTitle: 'Додано! 🎉',
  addedMessage: '«{phrase}» збережено у вашому Сховищі слів.',

  answerUnavailableTitle: 'Відповідь недоступна',
  answerUnavailableMissing: 'У цього речення відсутня відповідь. Натисніть Наступне речення, щоб отримати нове.',
  answerUnavailableTryAgain: 'Я не зміг розкрити цю відповідь. Спробуйте ще раз або натисніть Наступне речення.',

  reportAiTitle: 'Поскаржитися на відповідь ШІ',
  reportAiPrompt: 'Яку проблему ви знайшли?',
  reportAiInaccurate: 'Неточно',
  reportAiOffensive: 'Культурно нечутливо',
  reportedTitle: 'Поскаржилися',
  reportedThanksReview: 'Дякуємо. Ми це перевіримо.',
  reportedThanksSerious: 'Дякуємо. Ми ставимося до цього серйозно.',
};

// RTL
const ur: TrainerStrings = {
  toEnglish: '← انگریزی',

  sentenceLengthHeader: 'جملے کی لمبائی',
  lengthShort: 'مختصر',
  lengthMedium: 'درمیانہ',
  lengthLong: 'لمبا',
  lengthShortDesc: '3-6 الفاظ',
  lengthMediumDesc: '7-12 الفاظ',
  lengthLongDesc: '13-20 الفاظ',

  customRequestPlaceholder: 'حسب ضرورت درخواست… (مثلاً «کھانے کے بارے میں ماضی»)',
  customTopicRequest: 'حسب ضرورت موضوع کی درخواست',
  customRequestHint: 'اگلے جملے کے لیے مخصوص موضوع یا گرامر فوکس ٹائپ کریں',

  newSentenceHint: 'ترجمہ کرنے کے لیے نیا جملہ بناتا ہے',
  startSessionHint: 'نیا ترجمے کا مشق سیشن شروع کرتا ہے',

  opensSettingsHint: 'زبان اور سطح کی ترتیبات کھولتا ہے',

  retryBadge: '🔁 دوبارہ',
  retrySentenceA11y: 'دوبارہ کوشش کا جملہ۔ پہلے آپ کو اس میں دشواری ہوئی تھی۔',
  bankBadge: '📚 بینک',
  topicLabel: 'موضوع: {topic}',
  topicLabelBank: 'موضوع: {topic}، مشق بینک سے',
  translateThis: 'اس جملے کا انگریزی میں ترجمہ کریں: {sentence}',
  typeTranslationHint: 'اوپر کے جملے کا اپنا ترجمہ ٹائپ کریں',
  voiceInputUnavailable: 'آپ کی زبان کے لیے صوتی ان پٹ دستیاب نہیں',
  voiceNotice: 'ترجمہ کوچ میں {language} بولنے والوں کے لیے صوتی ان پٹ دستیاب نہیں ہے۔ آپ اسے تعیینِ سطح کے امتحان میں اب بھی استعمال کر سکتے ہیں۔',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'اس سے شروع: «{word}…»',
  hintUnavailable: 'اشارہ دستیاب نہیں - اپنی بہترین کوشش کریں!',
  hintPenaltySuffix: ' (اشارے کا جرمانہ 20-)',
  revealNoScore: 'جواب ظاہر ہو گیا - کوئی نمبر نہیں دیے گئے۔',
  revealClueHint: 'ایک اشارہ ظاہر کرتا ہے۔ آپ کا اسکور 80 تک محدود کرتا ہے۔',
  revealAnswerHint: 'بغیر اسکور کے جواب ظاہر کرتا ہے',
  submitTranslationHint: 'آپ کا ترجمہ نمبر دینے کے لیے جمع کرتا ہے',

  earnedXp: '{xp} تجربے کے پوائنٹس حاصل کیے',
  tapHint: 'ٹیپ کریں',
  saveToVaultPrompt: 'اپنے الفاظ کے خزانے میں محفوظ کرنے کے لیے ٹیپ کریں:',
  fullPhrase: 'مکمل جملہ',

  aiIntroMessage: 'ہیلو! میں گرامر کے قواعد کی وضاحت میں مدد کر سکتا ہوں۔ آپ کیا جاننا چاہیں گے؟',
  polyPuffTyping: 'Poly-Puff ٹائپ کر رہا ہے',
  askAboutGrammarPlaceholder: 'گرامر کے بارے میں پوچھیں…',
  askGrammarQuestion: 'Poly-Puff سے گرامر کا سوال پوچھیں',
  sendMessage: 'پیغام بھیجیں',
  reportAiResponseA11y: 'اس AI جواب کی رپورٹ کریں',
  youSaidA11y: 'آپ نے کہا: {text}',
  aiResponseA11y: '{brand}، AI جواب: {text}',
  chatError: 'معذرت، مجھے جواب دینے میں مسئلہ ہوا۔ دوبارہ کوشش کریں!',

  closeSettings: 'ترتیبات بند کریں',

  selectCefrLevelA11y: 'CEFR سطح منتخب کریں',
  cefrLevelOptionA11y: 'سطح {l}',
  lengthOptionA11y: '{label} جملے، {desc}',

  announceLevelSelected: 'CEFR سطح {level} منتخب۔',
  announceLengthSelected: '{length} جملے کی لمبائی منتخب۔',
  announceRetryReady: 'دوبارہ کوشش کا جملہ۔ پہلے آپ کو اس میں دشواری ہوئی تھی۔ دوبارہ کوشش کریں!',
  announceNewSentence: 'نیا جملہ تیار ہے۔ اپنا انگریزی ترجمہ ٹائپ کریں۔',
  announceAnswerRevealed: 'جواب ظاہر ہو گیا: {answer}',

  welcomeBackTitle: '⏸️ خوش آمدید واپس',
  welcomeBackMessage: 'آپ کی ایک مشق جاری ہے۔ کیا آپ جاری رکھنا چاہتے ہیں؟',
  startNew: 'نیا شروع کریں',

  endSessionTitle: 'سیشن ختم کریں',
  endSessionMessage: 'آپ نے {exercises} مشقیں مکمل کیں اور {time} میں {xp} XP کمائے۔ سیشن ختم کریں؟',
  endSessionConfirm: 'سیشن ختم کریں',

  errorTitle: 'خرابی',
  errorGenerate: 'جملہ بنانے میں ناکام۔ کیا آپ کا سرور چل رہا ہے؟',
  errorCheck: 'ترجمہ چیک کرنے میں ناکام۔',
  errorSaveVault: 'خزانے میں محفوظ نہیں ہو سکا۔',

  alreadyInVault: 'پہلے ہی خزانے میں',
  addedTitle: 'شامل کیا گیا! 🎉',
  addedMessage: '«{phrase}» آپ کے الفاظ کے خزانے میں محفوظ ہو گیا۔',

  answerUnavailableTitle: 'جواب دستیاب نہیں',
  answerUnavailableMissing: 'اس جملے کا جواب موجود نہیں۔ نیا حاصل کرنے کے لیے براہ کرم اگلا جملہ ٹیپ کریں۔',
  answerUnavailableTryAgain: 'میں یہ جواب ظاہر نہیں کر سکا۔ براہ کرم دوبارہ کوشش کریں یا اگلا جملہ ٹیپ کریں۔',

  reportAiTitle: 'AI جواب کی رپورٹ کریں',
  reportAiPrompt: 'آپ کو کون سا مسئلہ ملا؟',
  reportAiInaccurate: 'غلط',
  reportAiOffensive: 'ثقافتی طور پر بے حس',
  reportedTitle: 'رپورٹ کیا گیا',
  reportedThanksReview: 'شکریہ۔ ہم اس کا جائزہ لیں گے۔',
  reportedThanksSerious: 'شکریہ۔ ہم اسے سنجیدگی سے لیتے ہیں۔',
};

const vi: TrainerStrings = {
  toEnglish: '→ Tiếng Anh',

  sentenceLengthHeader: 'Độ dài câu',
  lengthShort: 'Ngắn',
  lengthMedium: 'Trung bình',
  lengthLong: 'Dài',
  lengthShortDesc: '3-6 từ',
  lengthMediumDesc: '7-12 từ',
  lengthLongDesc: '13-20 từ',

  customRequestPlaceholder: 'Yêu cầu tùy chỉnh… (ví dụ: \'Thì quá khứ về thức ăn\')',
  customTopicRequest: 'Yêu cầu chủ đề tùy chỉnh',
  customRequestHint: 'Nhập một chủ đề cụ thể hoặc trọng tâm ngữ pháp cho câu tiếp theo',

  newSentenceHint: 'Tạo một câu mới để dịch',
  startSessionHint: 'Bắt đầu một phiên luyện dịch mới',

  opensSettingsHint: 'Mở cài đặt ngôn ngữ và cấp độ',

  retryBadge: '🔁 THỬ LẠI',
  retrySentenceA11y: 'Câu thử lại. Bạn đã gặp khó khăn với câu này trước đó.',
  bankBadge: '📚 Ngân hàng',
  topicLabel: 'Chủ đề: {topic}',
  topicLabelBank: 'Chủ đề: {topic}, từ ngân hàng bài tập',
  translateThis: 'Dịch câu này sang tiếng Anh: {sentence}',
  typeTranslationHint: 'Nhập bản dịch của bạn cho câu ở trên',
  voiceInputUnavailable: 'Nhập bằng giọng nói không khả dụng cho ngôn ngữ của bạn',
  voiceNotice: 'Nhập bằng giọng nói không khả dụng cho người nói {language} trong Huấn luyện viên Dịch. Bạn vẫn có thể sử dụng nó trong Bài kiểm tra xếp lớp.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Bắt đầu bằng: "{word}…"',
  hintUnavailable: 'Gợi ý không khả dụng - hãy cố gắng hết sức!',
  hintPenaltySuffix: ' (phạt gợi ý -20)',
  revealNoScore: 'Đáp án đã được tiết lộ - không có điểm.',
  revealClueHint: 'Tiết lộ một gợi ý. Giới hạn điểm của bạn ở mức 80.',
  revealAnswerHint: 'Tiết lộ đáp án mà không tính điểm',
  submitTranslationHint: 'Gửi bản dịch của bạn để chấm điểm',

  earnedXp: 'Đạt được {xp} điểm kinh nghiệm',
  tapHint: 'Chạm',
  saveToVaultPrompt: 'Chạm để lưu vào Kho từ vựng của bạn:',
  fullPhrase: 'CỤM TỪ ĐẦY ĐỦ',

  aiIntroMessage: 'Xin chào! Tôi có thể giúp giải thích các quy tắc ngữ pháp. Bạn muốn biết gì?',
  polyPuffTyping: 'Poly-Puff đang gõ',
  askAboutGrammarPlaceholder: 'Hỏi về ngữ pháp…',
  askGrammarQuestion: 'Hỏi Poly-Puff một câu hỏi ngữ pháp',
  sendMessage: 'Gửi tin nhắn',
  reportAiResponseA11y: 'Báo cáo phản hồi AI này',
  youSaidA11y: 'Bạn đã nói: {text}',
  aiResponseA11y: '{brand}, phản hồi AI: {text}',
  chatError: 'Xin lỗi, tôi gặp khó khăn khi trả lời. Hãy thử lại!',

  closeSettings: 'Đóng cài đặt',

  selectCefrLevelA11y: 'Chọn cấp độ CEFR',
  cefrLevelOptionA11y: 'Cấp {l}',
  lengthOptionA11y: 'Câu {label}, {desc}',

  announceLevelSelected: 'Đã chọn cấp CEFR {level}.',
  announceLengthSelected: 'Đã chọn độ dài câu {length}.',
  announceRetryReady: 'Câu thử lại. Bạn đã gặp khó khăn với câu này trước đó. Thử lại!',
  announceNewSentence: 'Câu mới đã sẵn sàng. Nhập bản dịch tiếng Anh của bạn.',
  announceAnswerRevealed: 'Đáp án đã tiết lộ: {answer}',

  welcomeBackTitle: '⏸️ Chào mừng trở lại',
  welcomeBackMessage: 'Bạn có một bài tập đang dở. Bạn có muốn tiếp tục không?',
  startNew: 'Bắt đầu mới',

  endSessionTitle: 'Kết thúc phiên',
  endSessionMessage: 'Bạn đã hoàn thành {exercises} bài tập và đạt {xp} XP trong {time}. Kết thúc phiên?',
  endSessionConfirm: 'Kết thúc phiên',

  errorTitle: 'Lỗi',
  errorGenerate: 'Không tạo được câu. Máy chủ của bạn có đang chạy không?',
  errorCheck: 'Không kiểm tra được bản dịch.',
  errorSaveVault: 'Không thể lưu vào kho.',

  alreadyInVault: 'Đã có trong kho',
  addedTitle: 'Đã thêm! 🎉',
  addedMessage: '"{phrase}" đã được lưu vào Kho từ vựng của bạn.',

  answerUnavailableTitle: 'Đáp án không khả dụng',
  answerUnavailableMissing: 'Câu này thiếu đáp án. Vui lòng chạm Câu tiếp theo để nhận câu mới.',
  answerUnavailableTryAgain: 'Tôi không thể tiết lộ đáp án này. Vui lòng thử lại hoặc chạm Câu tiếp theo.',

  reportAiTitle: 'Báo cáo phản hồi AI',
  reportAiPrompt: 'Bạn đã tìm thấy vấn đề gì?',
  reportAiInaccurate: 'Không chính xác',
  reportAiOffensive: 'Thiếu nhạy cảm văn hóa',
  reportedTitle: 'Đã báo cáo',
  reportedThanksReview: 'Cảm ơn. Chúng tôi sẽ xem xét điều này.',
  reportedThanksSerious: 'Cảm ơn. Chúng tôi xem xét điều này nghiêm túc.',
};

const yo: TrainerStrings = {
  toEnglish: '→ Èdè Gẹ̀ẹ́sì',

  sentenceLengthHeader: 'Gígùn gbólóhùn',
  lengthShort: 'Kúkúrú',
  lengthMedium: 'Àárín',
  lengthLong: 'Gígùn',
  lengthShortDesc: 'Ọ̀rọ̀ 3-6',
  lengthMediumDesc: 'Ọ̀rọ̀ 7-12',
  lengthLongDesc: 'Ọ̀rọ̀ 13-20',

  customRequestPlaceholder: "Ìbéèrè àkànṣe… (fún àpẹẹrẹ 'Ìgbà àtijọ́ nípa oúnjẹ')",
  customTopicRequest: 'Ìbéèrè kókó àkànṣe',
  customRequestHint: 'Tẹ̀ kókó àkànṣe tàbí ìfojúsùn gírámà fún gbólóhùn tó tẹ̀le',

  newSentenceHint: 'Ó ń ṣẹ̀dá gbólóhùn tuntun láti túmọ̀',
  startSessionHint: 'Ó ń bẹ̀rẹ̀ ìpàdé ìṣe ìtumọ̀ tuntun',

  opensSettingsHint: 'Ó ń ṣí àwọn ìṣètò èdè àti ipele',

  retryBadge: '🔁 GBÌYÀNJÚ',
  retrySentenceA11y: 'Gbólóhùn ìgbìyànjú padà. O ní àpọ̀nlé pẹ̀lú èyí ṣáájú.',
  bankBadge: '📚 Báńkì',
  topicLabel: 'Kókó: {topic}',
  topicLabelBank: 'Kókó: {topic}, láti inú báńkì ìdárayá',
  translateThis: 'Túmọ̀ gbólóhùn yìí sí èdè Gẹ̀ẹ́sì: {sentence}',
  typeTranslationHint: 'Tẹ̀ ìtumọ̀ rẹ ti gbólóhùn tó wà lókè',
  voiceInputUnavailable: 'Ìtẹ̀wọ̀lé ohùn kò sí fún èdè rẹ',
  voiceNotice: 'Ìtẹ̀wọ̀lé ohùn kò sí fún àwọn agbohùn {language} nínú Olùkọ́ Ìtumọ̀. O lè ṣì lò ó nínú Ìdánwò Ìpinnu Ipele.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Bẹ̀rẹ̀ pẹ̀lú: "{word}…"',
  hintUnavailable: 'Ìmọ̀ràn kò sí - gbìyànjú dáadáa!',
  hintPenaltySuffix: ' (ìjìyà ìmọ̀ràn -20)',
  revealNoScore: 'A fi ìdáhùn hàn - kò sí àwọn àmì.',
  revealClueHint: 'Ó ń fi ọ̀nà hàn. Ó dá àmì rẹ dúró ní 80.',
  revealAnswerHint: 'Ó ń fi ìdáhùn hàn láìsí ìfọ́',
  submitTranslationHint: 'Ó ń fi ìtumọ̀ rẹ ránṣẹ́ fún ìfọ́',

  earnedXp: 'Gba àmì ìrírí {xp}',
  tapHint: 'Tẹ̀',
  saveToVaultPrompt: 'Tẹ̀ láti tọ́jú nínú Ilé-ìpamọ́ Ọ̀rọ̀ rẹ:',
  fullPhrase: 'GBÓLÓHÙN PÍPÉ',

  aiIntroMessage: 'Báwo! Mo lè ràn ọ́ lọ́wọ́ láti ṣàlàyé àwọn ofin gírámà. Kí ni o fẹ́ mọ̀?',
  polyPuffTyping: 'Poly-Puff ń tẹ̀',
  askAboutGrammarPlaceholder: 'Béèrè nípa gírámà…',
  askGrammarQuestion: 'Béèrè Poly-Puff ìbéèrè gírámà',
  sendMessage: 'Fi ìfiránṣẹ́ ránṣẹ́',
  reportAiResponseA11y: 'Ṣàlàyé ìdáhùn AI yìí',
  youSaidA11y: 'O sọ pé: {text}',
  aiResponseA11y: '{brand}, ìdáhùn AI: {text}',
  chatError: 'Bínú, mo ní àìṣedéédéé nínú dídáhùn. Gbìyànjú lẹ́ẹ̀kan sí i!',

  closeSettings: 'Tì ìṣètò',

  selectCefrLevelA11y: 'Yan ipele CEFR',
  cefrLevelOptionA11y: 'Ipele {l}',
  lengthOptionA11y: 'Gbólóhùn {label}, {desc}',

  announceLevelSelected: 'Ipele CEFR {level} ti yan.',
  announceLengthSelected: 'Gígùn gbólóhùn {length} ti yan.',
  announceRetryReady: 'Gbólóhùn ìgbìyànjú padà. O ní àpọ̀nlé pẹ̀lú èyí ṣáájú. Gbìyànjú lẹ́ẹ̀kan sí i!',
  announceNewSentence: 'Gbólóhùn tuntun ṣetán. Tẹ̀ ìtumọ̀ Gẹ̀ẹ́sì rẹ.',
  announceAnswerRevealed: 'Ìdáhùn ti hàn: {answer}',

  welcomeBackTitle: '⏸️ Káàbọ̀ padà',
  welcomeBackMessage: 'O ní ìdárayá kan tó ń lọ. Ṣé o fẹ́ tẹ̀síwájú?',
  startNew: 'Bẹ̀rẹ̀ tuntun',

  endSessionTitle: 'Parí ìpàdé',
  endSessionMessage: 'O ti parí àwọn ìdárayá {exercises} àti gba {xp} XP nínú {time}. Parí ìpàdé?',
  endSessionConfirm: 'Parí ìpàdé',

  errorTitle: 'Àṣìṣe',
  errorGenerate: 'Kò lè ṣẹ̀dá gbólóhùn. Ṣé olùpèsè rẹ ń ṣiṣẹ́?',
  errorCheck: 'Kò lè ṣàyẹ̀wò ìtumọ̀.',
  errorSaveVault: 'Kò lè tọ́jú nínú ilé-ìpamọ́.',

  alreadyInVault: 'Tẹ́lẹ̀ nínú ilé-ìpamọ́',
  addedTitle: 'Fi kún! 🎉',
  addedMessage: '"{phrase}" ti tọ́jú nínú Ilé-ìpamọ́ Ọ̀rọ̀ rẹ.',

  answerUnavailableTitle: 'Ìdáhùn kò sí',
  answerUnavailableMissing: 'Gbólóhùn yìí kò ní ìdáhùn. Jọ̀wọ́ tẹ̀ Gbólóhùn Tó Tẹ̀le láti gba tuntun.',
  answerUnavailableTryAgain: 'Mi ò lè fi ìdáhùn yìí hàn. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i tàbí tẹ̀ Gbólóhùn Tó Tẹ̀le.',

  reportAiTitle: 'Ṣàlàyé ìdáhùn AI',
  reportAiPrompt: 'Kí ni àṣìṣe tó o rí?',
  reportAiInaccurate: 'Aláìpé',
  reportAiOffensive: 'Aláìní àkíyèsí àṣà',
  reportedTitle: 'Ti ṣàlàyé',
  reportedThanksReview: 'O ṣé. A ó ṣàyẹ̀wò èyí.',
  reportedThanksSerious: 'O ṣé. A gba èyí ní pàtàkì.',
};

const zu: TrainerStrings = {
  toEnglish: '→ IsiNgisi',

  sentenceLengthHeader: 'Ubude bomusho',
  lengthShort: 'Mfushane',
  lengthMedium: 'Maphakathi',
  lengthLong: 'Bude',
  lengthShortDesc: 'Amagama 3-6',
  lengthMediumDesc: 'Amagama 7-12',
  lengthLongDesc: 'Amagama 13-20',

  customRequestPlaceholder: 'Isicelo esiyimfanelo… (isb. \'Isikhathi esidlule mayelana nokudla\')',
  customTopicRequest: 'Isicelo sesihloko esiyimfanelo',
  customRequestHint: 'Thayipha isihloko esithile noma ukugxila kuhlelo lolimi kumusho olandelayo',

  newSentenceHint: 'Yenza umusho omusha okumele uhumushwe',
  startSessionHint: 'Iqala isikhathi esisha sokuzijwayeza ukuhumusha',

  opensSettingsHint: 'Ivula amasethingi olimi nezinga',

  retryBadge: '🔁 PHINDA',
  retrySentenceA11y: 'Umusho wokuphinda. Wawunenkinga ngalo ngaphambili.',
  bankBadge: '📚 Ibhange',
  topicLabel: 'Isihloko: {topic}',
  topicLabelBank: 'Isihloko: {topic}, esivela ebhange lokuzivocavoca',
  translateThis: 'Humusha lo musho ube yisiNgisi: {sentence}',
  typeTranslationHint: 'Thayipha ukuhumusha kwakho komusho ongenhla',
  voiceInputUnavailable: 'Ukufaka kwezwi akutholakali ngolimi lwakho',
  voiceNotice: 'Ukufaka ngezwi akutholakali kubantu abakhuluma {language} kuMqeqeshi Wokuhumusha. Usengaqhubeka uyisebenzise kuHlolo Lokufakwa.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Iqala nge: "{word}…"',
  hintUnavailable: 'Isiphakamiso asitholakali - yenza okuhle kakhulu!',
  hintPenaltySuffix: ' (inhlawulo yesiphakamiso -20)',
  revealNoScore: 'Impendulo idalulwe - awunikezwanga amaphuzu.',
  revealClueHint: 'Idalula uphakamiso. Inciphisa iphuzu lakho ku-80.',
  revealAnswerHint: 'Idalula impendulo ngaphandle kokunika amaphuzu',
  submitTranslationHint: 'Ithumela ukuhumusha kwakho ukuze kulinganiswe',

  earnedXp: 'Uthole {xp} amaphuzu okuhlangenwe nakho',
  tapHint: 'Thepha',
  saveToVaultPrompt: 'Thepha ukuze ulondoloze eNqolobaneni Yamagama yakho:',
  fullPhrase: 'INKULUMO EGCWELE',

  aiIntroMessage: 'Sawubona! Ngingakusiza ukuchaza imithetho yohlelo lolimi. Ufuna ukwazi yini?',
  polyPuffTyping: 'I-Poly-Puff iyathayipha',
  askAboutGrammarPlaceholder: 'Buza ngohlelo lolimi…',
  askGrammarQuestion: 'Buza i-Poly-Puff umbuzo wohlelo lolimi',
  sendMessage: 'Thumela umlayezo',
  reportAiResponseA11y: 'Bika le mpendulo ye-AI',
  youSaidA11y: 'Wathi: {text}',
  aiResponseA11y: '{brand}, impendulo ye-AI: {text}',
  chatError: 'Uxolo, ngibe nenkinga yokuphendula. Zama futhi!',

  closeSettings: 'Vala amasethingi',

  selectCefrLevelA11y: 'Khetha izinga le-CEFR',
  cefrLevelOptionA11y: 'Izinga {l}',
  lengthOptionA11y: 'Imisho {label}, {desc}',

  announceLevelSelected: 'Izinga le-CEFR {level} likhethiwe.',
  announceLengthSelected: 'Ubude bomusho {length} bukhethiwe.',
  announceRetryReady: 'Umusho wokuphinda. Wawunenkinga ngalo ngaphambili. Zama futhi!',
  announceNewSentence: 'Umusho omusha usulungele. Thayipha ukuhumusha kwakho kwesiNgisi.',
  announceAnswerRevealed: 'Impendulo idalulwe: {answer}',

  welcomeBackTitle: '⏸️ Siyakwamukela emuva',
  welcomeBackMessage: 'Unesiqephu esiqhubekayo. Ufuna ukuqhubeka?',
  startNew: 'Qala okusha',

  endSessionTitle: 'Phetha isikhathi',
  endSessionMessage: 'Uqedele iziqephu eziyi-{exercises} futhi uthole i-{xp} XP ngo-{time}. Phetha isikhathi?',
  endSessionConfirm: 'Phetha isikhathi',

  errorTitle: 'Iphutha',
  errorGenerate: 'Kuhlulekile ukwakha umusho. Ingabe iseva yakho iyasebenza?',
  errorCheck: 'Kuhlulekile ukuhlola ukuhumusha.',
  errorSaveVault: 'Akukwazi ukulondoloza enqolobaneni.',

  alreadyInVault: 'Sekuvele kunqolobaneni',
  addedTitle: 'Kungeziwe! 🎉',
  addedMessage: '"{phrase}" kulondolozwe eNqolobaneni Yamagama yakho.',

  answerUnavailableTitle: 'Impendulo ayitholakali',
  answerUnavailableMissing: 'Lo musho awunayo impendulo. Sicela uthephe Umusho Olandelayo ukuze uthole omusha.',
  answerUnavailableTryAgain: 'Angikwazanga ukudalula le mpendulo. Sicela uzame futhi noma uthephe Umusho Olandelayo.',

  reportAiTitle: 'Bika impendulo ye-AI',
  reportAiPrompt: 'Yiluphi udaba olutholile?',
  reportAiInaccurate: 'Akunembile',
  reportAiOffensive: 'Akuzwele ngokwesiko',
  reportedTitle: 'Kubikiwe',
  reportedThanksReview: 'Ngiyabonga. Sizobuyekeza lokhu.',
  reportedThanksSerious: 'Ngiyabonga. Sikuthatha ngokungathí sina.',
};

const fil: TrainerStrings = {
  toEnglish: '→ Ingles',

  sentenceLengthHeader: 'Haba ng pangungusap',
  lengthShort: 'Maikli',
  lengthMedium: 'Katamtaman',
  lengthLong: 'Mahaba',
  lengthShortDesc: '3-6 na salita',
  lengthMediumDesc: '7-12 salita',
  lengthLongDesc: '13-20 salita',

  customRequestPlaceholder: "Pasadyang kahilingan… (hal. 'Nakaraang panahunan tungkol sa pagkain')",
  customTopicRequest: 'Pasadyang kahilingan ng paksa',
  customRequestHint: 'I-type ang isang partikular na paksa o pokus ng gramatika para sa susunod na pangungusap',

  newSentenceHint: 'Gumagawa ng bagong pangungusap upang isalin',
  startSessionHint: 'Nagsisimula ng bagong sesyon ng pagsasanay sa pagsasalin',

  opensSettingsHint: 'Binubuksan ang mga setting ng wika at antas',

  retryBadge: '🔁 ULITIN',
  retrySentenceA11y: 'Pangungusap ng pag-uulit. Nahirapan ka rito noon.',
  bankBadge: '📚 Bangko',
  topicLabel: 'Paksa: {topic}',
  topicLabelBank: 'Paksa: {topic}, mula sa bangko ng pagsasanay',
  translateThis: 'Isalin ang pangungusap na ito sa Ingles: {sentence}',
  typeTranslationHint: 'I-type ang iyong salin sa pangungusap sa itaas',
  voiceInputUnavailable: 'Hindi available ang voice input para sa iyong wika',
  voiceNotice: 'Hindi available ang voice input para sa mga nagsasalita ng {language} sa Translation Trainer. Magagamit mo pa rin ito sa Placement Test.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Nagsisimula sa: "{word}…"',
  hintUnavailable: 'Hindi available ang pahiwatig - gawin ang iyong makakaya!',
  hintPenaltySuffix: ' (-20 parusa sa pahiwatig)',
  revealNoScore: 'Inihayag ang sagot - walang ibinigay na iskor.',
  revealClueHint: 'Naghahayag ng pahiwatig. Nililimita ang iyong iskor sa 80.',
  revealAnswerHint: 'Inihahayag ang sagot nang walang iskor',
  submitTranslationHint: 'Isinusumite ang iyong salin para sa pagmamarka',

  earnedXp: 'Nakakuha ng {xp} experience points',
  tapHint: 'I-tap',
  saveToVaultPrompt: 'I-tap upang i-save sa iyong Imbakan ng Talasalitaan:',
  fullPhrase: 'BUONG PARIRALA',

  aiIntroMessage: 'Kumusta! Kaya kong magpaliwanag ng mga panuntunan sa gramatika. Ano ang gusto mong malaman?',
  polyPuffTyping: 'Nagta-type ang Poly-Puff',
  askAboutGrammarPlaceholder: 'Magtanong tungkol sa gramatika…',
  askGrammarQuestion: 'Magtanong sa Poly-Puff tungkol sa gramatika',
  sendMessage: 'Magpadala ng mensahe',
  reportAiResponseA11y: 'Iulat ang sagot na ito ng AI',
  youSaidA11y: 'Sabi mo: {text}',
  aiResponseA11y: '{brand}, sagot ng AI: {text}',
  chatError: 'Paumanhin, nahirapan akong sumagot. Subukan muli!',

  closeSettings: 'Isara ang mga setting',

  selectCefrLevelA11y: 'Pumili ng antas ng CEFR',
  cefrLevelOptionA11y: 'Antas {l}',
  lengthOptionA11y: '{label} na mga pangungusap, {desc}',

  announceLevelSelected: 'Antas ng CEFR na {level} ang pinili.',
  announceLengthSelected: 'Pinili ang haba ng pangungusap na {length}.',
  announceRetryReady: 'Pangungusap ng pag-uulit. Nahirapan ka rito noon. Subukan muli!',
  announceNewSentence: 'Handa na ang bagong pangungusap. I-type ang iyong salin sa Ingles.',
  announceAnswerRevealed: 'Inihayag ang sagot: {answer}',

  welcomeBackTitle: '⏸️ Maligayang pagbabalik',
  welcomeBackMessage: 'May ginagawa kang ehersisyo. Gusto mo bang ipagpatuloy?',
  startNew: 'Magsimula ng bago',

  endSessionTitle: 'Tapusin ang sesyon',
  endSessionMessage: 'Tinapos mo ang {exercises} mga ehersisyo at nakakuha ng {xp} XP sa {time}. Tapusin ang sesyon?',
  endSessionConfirm: 'Tapusin ang sesyon',

  errorTitle: 'Error',
  errorGenerate: 'Hindi nagawa ang pangungusap. Tumatakbo ba ang iyong server?',
  errorCheck: 'Hindi nasuri ang salin.',
  errorSaveVault: 'Hindi ma-save sa imbakan.',

  alreadyInVault: 'Nasa Imbakan na',
  addedTitle: 'Naidagdag! 🎉',
  addedMessage: '"{phrase}" na-save sa iyong Imbakan ng Talasalitaan.',

  answerUnavailableTitle: 'Hindi available ang sagot',
  answerUnavailableMissing: 'Walang sagot ang pangungusap na ito. Pakitap ang Susunod na Pangungusap para makakuha ng bago.',
  answerUnavailableTryAgain: 'Hindi ko naihayag ang sagot na ito. Subukan muli o i-tap ang Susunod na Pangungusap.',

  reportAiTitle: 'Iulat ang Sagot ng AI',
  reportAiPrompt: 'Anong problema ang nakita mo?',
  reportAiInaccurate: 'Hindi tumpak',
  reportAiOffensive: 'Hindi sensitibo sa kultura',
  reportedTitle: 'Naiulat',
  reportedThanksReview: 'Salamat. Susuriin namin ito.',
  reportedThanksSerious: 'Salamat. Sineseryoso namin ito.',
};

const gn: TrainerStrings = {
  toEnglish: '→ Inglés ñe\'ẽ',

  sentenceLengthHeader: 'Ñe\'ẽjoaju puku',
  lengthShort: 'Mbyky',
  lengthMedium: 'Mbytépe',
  lengthLong: 'Puku',
  lengthShortDesc: '3-6 ñe\'ẽ',
  lengthMediumDesc: '7-12 ñe\'ẽ',
  lengthLongDesc: '13-20 ñe\'ẽ',

  customRequestPlaceholder: 'Jerure tee… (techapyrã \'Ymave guare tembi\'u rehegua\')',
  customTopicRequest: 'Mba\'ekuaarã tee jerure',
  customRequestHint: 'Embohai peteĩ mba\'ekuaarã térã ñe\'ẽtekuaa rehegua oĩva ñe\'ẽjoaju oúvape',

  newSentenceHint: 'Ojapo peteĩ ñe\'ẽjoaju pyahu oñembohasa hag̃ua',
  startSessionHint: 'Oñepyrũ peteĩ ñembokatupyry ñembohasa pyahu',

  opensSettingsHint: 'Oipe\'a ñe\'ẽ ha pataka mbohendapy',

  retryBadge: '🔁 EÑEMOÑEVE',
  retrySentenceA11y: 'Ñe\'ẽjoaju ñemoñeve. Reñehekomby ko\'ã ndive yma.',
  bankBadge: '📚 Banco',
  topicLabel: 'Mba\'ekuaarã: {topic}',
  topicLabelBank: 'Mba\'ekuaarã: {topic}, ñembokatupyry banco-pe guive',
  translateThis: 'Embohasa ko ñe\'ẽjoaju Inglés ñe\'ẽme: {sentence}',
  typeTranslationHint: 'Embohai nde mbohasa ñe\'ẽjoaju yvategua rehegua',
  voiceInputUnavailable: 'Ñe\'ẽ jeike ndaipóri nde ñe\'ẽme g̃uarã',
  voiceNotice: '{language} ñe\'ẽhára ndoguerekói ñe\'ẽ jeike Mbohasa Mbo\'ehára-pe. Eipuru porãve Tembihechakuaa moñembokuaa-pe.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Oñepyrũ ko\'ãvape: "{word}…"',
  hintUnavailable: 'Pytyvõmbyky ndaipóri - ejapo nde rembiporãva!',
  hintPenaltySuffix: ' (pytyvõmbyky jejahéi -20)',
  revealNoScore: 'Mbohovái ojejehecha - ndorekói tapykuere.',
  revealClueHint: 'Ohechauka pytyvõmbyky. Oguenohẽ nde tapykuere 80-pe.',
  revealAnswerHint: 'Ohechauka mbohovái tapykuere\'ỹre',
  submitTranslationHint: 'Omondo nde mbohasa hechapyrã',

  earnedXp: '{xp} jehekomby tapykuere oñembyaty',
  tapHint: 'Eipoko',
  saveToVaultPrompt: 'Eipoko eñongatu hag̃ua nde Ñe\'ẽ ryru ñongatuha-pe:',
  fullPhrase: 'ÑE\'Ẽ\'AYU AVE',

  aiIntroMessage: 'Mba\'éichapa! Ikatu apytyvõ nemyesakã ñe\'ẽtekuaa léi. Mba\'épa reikuaase?',
  polyPuffTyping: 'Poly-Puff oñe\'ẽhai',
  askAboutGrammarPlaceholder: 'Eporandu ñe\'ẽtekuaa rehegua…',
  askGrammarQuestion: 'Eporandu Poly-Puff-pe ñe\'ẽtekuaa porandu',
  sendMessage: 'Mondo marandu',
  reportAiResponseA11y: 'Emomarandu ko AI mbohovái',
  youSaidA11y: 'Ere: {text}',
  aiResponseA11y: '{brand}, AI mbohovái: {text}',
  chatError: 'Ñembyasy, asarambi che mbohovái. Eha\'ã jey!',

  closeSettings: 'Mboty mbohendapy',

  selectCefrLevelA11y: 'Eiporavo CEFR pataka',
  cefrLevelOptionA11y: 'Pataka {l}',
  lengthOptionA11y: 'Ñe\'ẽjoaju {label}, {desc}',

  announceLevelSelected: 'CEFR pataka {level} oñemboheko.',
  announceLengthSelected: '{length} ñe\'ẽjoaju puku oñemboheko.',
  announceRetryReady: 'Ñe\'ẽjoaju ñemoñeve. Reñehekomby ko\'ã ndive yma. Eha\'ã jey!',
  announceNewSentence: 'Ñe\'ẽjoaju pyahu oĩma. Embohai nde Inglés mbohasa.',
  announceAnswerRevealed: 'Mbohovái ojejehecha: {answer}',

  welcomeBackTitle: '⏸️ Tereg̃uahẽ porã jey',
  welcomeBackMessage: 'Rerereko peteĩ ñembokatupyry oĩva. Reipotápa rejey?',
  startNew: 'Eñepyrũ pyahu',

  endSessionTitle: 'Mbopaha ñembokatupyry',
  endSessionMessage: 'Embopaha {exercises} ñembokatupyry ha rejehu {xp} XP {time}-pe. Mbopaha ñembokatupyry?',
  endSessionConfirm: 'Mbopaha ñembokatupyry',

  errorTitle: 'Jejavy',
  errorGenerate: 'Ndaikatúi ojejapo ñe\'ẽjoaju. Nde mohendapyrã oikópiko?',
  errorCheck: 'Ndaikatúi oñembohovái mbohasa.',
  errorSaveVault: 'Ndaikatúi oñeñongatu ñongatuha-pe.',

  alreadyInVault: 'Oĩma ñongatuha-pe',
  addedTitle: '¡Oñembojoaju! 🎉',
  addedMessage: '"{phrase}" oñeñongatu nde Ñe\'ẽ ryru ñongatuha-pe.',

  answerUnavailableTitle: 'Mbohovái ndaipóri',
  answerUnavailableMissing: 'Ko ñe\'ẽjoaju ndorekói mbohovái. Eipoko Ñe\'ẽjoaju Oúva-pe rehupyty hag̃ua peteĩ pyahu.',
  answerUnavailableTryAgain: 'Ndaikatúi ahechauka ko mbohovái. Eha\'ã jey térã eipoko Ñe\'ẽjoaju Oúva.',

  reportAiTitle: 'Emomarandu AI mbohovái',
  reportAiPrompt: 'Mba\'e jejavy rejuhu?',
  reportAiInaccurate: 'Ndaha\'éiete',
  reportAiOffensive: 'Ndorekói tekoatypy ñehesape',
  reportedTitle: 'Oñemomarandu',
  reportedThanksReview: 'Aguyje. Roma\'ẽta ko\'ãvare.',
  reportedThanksSerious: 'Aguyje. Roñembyaty mbarete ko\'ãva.',
};

const ht: TrainerStrings = {
  toEnglish: '→ Anglè',

  sentenceLengthHeader: 'Longè fraz la',
  lengthShort: 'Kout',
  lengthMedium: 'Mwayen',
  lengthLong: 'Long',
  lengthShortDesc: '3-6 mo',
  lengthMediumDesc: '7-12 mo',
  lengthLongDesc: '13-20 mo',

  customRequestPlaceholder: "Demand pèsonalize… (egzanp 'Tan pase sou manje')",
  customTopicRequest: 'Demand sijè pèsonalize',
  customRequestHint: 'Tape yon sijè espesifik oswa konsantrasyon gramè pou pwochen fraz la',

  newSentenceHint: 'Jenere yon nouvo fraz pou tradwi',
  startSessionHint: 'Kòmanse yon nouvo sesyon pratik tradiksyon',

  opensSettingsHint: 'Louvri paramèt lang ak nivo',

  retryBadge: '🔁 ESEYE',
  retrySentenceA11y: 'Fraz reesey. Ou te gen difikilte avèk sa anvan.',
  bankBadge: '📚 Bank',
  topicLabel: 'Sijè: {topic}',
  topicLabelBank: 'Sijè: {topic}, nan bank egzèsis',
  translateThis: 'Tradwi fraz sa a an Anglè: {sentence}',
  typeTranslationHint: 'Tape tradiksyon ou nan fraz ki anwo a',
  voiceInputUnavailable: 'Antre vokal pa disponib pou lang ou',
  voiceNotice: 'Antre vokal pa disponib pou moun ki pale {language} nan Antrenè Tradiksyon an. Ou ka toujou itilize l nan Tès klasman an.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Kòmanse ak: "{word}…"',
  hintUnavailable: 'Endis pa disponib - fè pi byen ou kapab!',
  hintPenaltySuffix: ' (penalite endis -20)',
  revealNoScore: 'Repons revele - okenn pwen pa bay.',
  revealClueHint: 'Revele yon endis. Limite nòt ou nan 80.',
  revealAnswerHint: 'Revele repons lan san pwen',
  submitTranslationHint: 'Voye tradiksyon ou pou evalyasyon',

  earnedXp: 'Genyen {xp} pwen eksperyans',
  tapHint: 'Touche',
  saveToVaultPrompt: 'Touche pou sove nan Kofrefò Vokabilè ou:',
  fullPhrase: 'FRAZ KONPLÈ',

  aiIntroMessage: 'Bonjou! Mwen kapab ede eksplike règ gramè. Kisa ou ta renmen konnen?',
  polyPuffTyping: 'Poly-Puff ap ekri',
  askAboutGrammarPlaceholder: 'Mande sou gramè…',
  askGrammarQuestion: 'Mande Poly-Puff yon kesyon gramè',
  sendMessage: 'Voye mesaj',
  reportAiResponseA11y: 'Rapòte repons IA sa a',
  youSaidA11y: 'Ou te di: {text}',
  aiResponseA11y: '{brand}, repons IA: {text}',
  chatError: 'Padon, mwen te gen pwoblèm reponn. Eseye ankò!',

  closeSettings: 'Fèmen paramèt',

  selectCefrLevelA11y: 'Chwazi nivo CEFR',
  cefrLevelOptionA11y: 'Nivo {l}',
  lengthOptionA11y: 'Fraz {label}, {desc}',

  announceLevelSelected: 'Nivo CEFR {level} chwazi.',
  announceLengthSelected: 'Longè fraz {length} chwazi.',
  announceRetryReady: 'Fraz reesey. Ou te gen difikilte avèk sa anvan. Eseye ankò!',
  announceNewSentence: 'Nouvo fraz pare. Tape tradiksyon Anglè ou.',
  announceAnswerRevealed: 'Repons revele: {answer}',

  welcomeBackTitle: '⏸️ Byenveni retounen',
  welcomeBackMessage: 'Ou gen yon egzèsis ki ap mache. Eske ou vle kontinye?',
  startNew: 'Kòmanse nouvo',

  endSessionTitle: 'Fini sesyon',
  endSessionMessage: 'Ou te konplete {exercises} egzèsis epi ou te genyen {xp} XP nan {time}. Fini sesyon?',
  endSessionConfirm: 'Fini sesyon',

  errorTitle: 'Erè',
  errorGenerate: 'Pa kapab jenere fraz. Eske sèvè ou ap mache?',
  errorCheck: 'Pa kapab tcheke tradiksyon.',
  errorSaveVault: 'Pa kapab sove nan kofrefò.',

  alreadyInVault: 'Deja nan Kofrefò',
  addedTitle: 'Ajoute! 🎉',
  addedMessage: '"{phrase}" sove nan Kofrefò Vokabilè ou.',

  answerUnavailableTitle: 'Repons pa disponib',
  answerUnavailableMissing: 'Fraz sa a manke repons li. Silvouplè touche Pwochen Fraz pou jwenn yon nouvo.',
  answerUnavailableTryAgain: 'Mwen pa kapab revele repons sa a. Silvouplè eseye ankò oswa touche Pwochen Fraz.',

  reportAiTitle: 'Rapòte Repons IA',
  reportAiPrompt: 'Ki pwoblèm ou te jwenn?',
  reportAiInaccurate: 'Pa egzak',
  reportAiOffensive: 'Pa sansib kiltirèlman',
  reportedTitle: 'Rapòte',
  reportedThanksReview: 'Mèsi. N ap revize sa.',
  reportedThanksSerious: 'Mèsi. Nou pran sa oserye.',
};

// RTL
const ps: TrainerStrings = {
  toEnglish: '← انګلیسي',

  sentenceLengthHeader: 'د جملې اوږدوالی',
  lengthShort: 'لنډ',
  lengthMedium: 'منځنی',
  lengthLong: 'اوږد',
  lengthShortDesc: '۳-۶ کلمې',
  lengthMediumDesc: '۷-۱۲ کلمې',
  lengthLongDesc: '۱۳-۲۰ کلمې',

  customRequestPlaceholder: 'دودیزه غوښتنه… (مثلاً «د خواړو په اړه تېر زمان»)',
  customTopicRequest: 'دودیزه موضوع غوښتنه',
  customRequestHint: 'د راتلونکې جملې لپاره ځانګړې موضوع یا ګرامري تمرکز ولیکئ',

  newSentenceHint: 'د ژباړې لپاره نوې جمله جوړوي',
  startSessionHint: 'د ژباړې تمرین نوې غونډه پیلوي',

  opensSettingsHint: 'د ژبې او کچې تنظیمات پرانیزي',

  retryBadge: '🔁 بیا',
  retrySentenceA11y: 'د بیا هڅې جمله. تاسو پخوا د دې سره ستونزه درلوده.',
  bankBadge: '📚 بانک',
  topicLabel: 'موضوع: {topic}',
  topicLabelBank: 'موضوع: {topic}، د تمرین بانک څخه',
  translateThis: 'دا جمله انګلیسي ته وژباړئ: {sentence}',
  typeTranslationHint: 'د پورته جملې خپله ژباړه ولیکئ',
  voiceInputUnavailable: 'ستاسو د ژبې لپاره غږیز ننوت شتون نلري',
  voiceNotice: 'د ژباړې روزونکي کې د {language} ویونکو لپاره غږیز ننوت شتون نلري. تاسو اوس هم په کچې ټاکنې ازموینې کې کارولی شئ.',

  hintScorePenalty: '(-۲۰)',
  hintStartsWith: 'پیلیږي په: «{word}…»',
  hintUnavailable: 'لارښوونه شتون نلري - خپله ښه هڅه وکړئ!',
  hintPenaltySuffix: ' (د لارښوونې جریمه -۲۰)',
  revealNoScore: 'ځواب څرګند شو - هیڅ نمرې ندي ورکړل شوي.',
  revealClueHint: 'یوه نښه څرګندوي. ستاسو نمره په ۸۰ کې محدودوي.',
  revealAnswerHint: 'پرته له نمرې ځواب څرګندوي',
  submitTranslationHint: 'ستاسو ژباړه د ارزونې لپاره وړاندې کوي',

  earnedXp: '{xp} د تجربې ټکي ترلاسه شول',
  tapHint: 'ټک ووهئ',
  saveToVaultPrompt: 'ستاسو د لغاتو خزانه کې د خوندي کولو لپاره ټک ووهئ:',
  fullPhrase: 'بشپړ عبارت',

  aiIntroMessage: 'سلام! زه کولی شم د ګرامر قواعد تشریح کولو کې مرسته وکړم. تاسو څه پوهیدل غواړئ؟',
  polyPuffTyping: 'Poly-Puff ټایپ کوي',
  askAboutGrammarPlaceholder: 'د ګرامر په اړه وپوښتئ…',
  askGrammarQuestion: 'Poly-Puff څخه د ګرامر پوښتنه وپوښتئ',
  sendMessage: 'پیغام واستوئ',
  reportAiResponseA11y: 'د دې AI ځواب راپور ورکړئ',
  youSaidA11y: 'تاسو وویل: {text}',
  aiResponseA11y: '{brand}، د AI ځواب: {text}',
  chatError: 'بخښنه غواړم، زما د ځواب ورکولو ستونزه وه. بیا هڅه وکړئ!',

  closeSettings: 'تنظیمات وتړئ',

  selectCefrLevelA11y: 'د CEFR کچه وټاکئ',
  cefrLevelOptionA11y: 'کچه {l}',
  lengthOptionA11y: '{label} جملې، {desc}',

  announceLevelSelected: 'د CEFR کچه {level} وټاکل شوه.',
  announceLengthSelected: 'د جملې اوږدوالی {length} وټاکل شو.',
  announceRetryReady: 'د بیا هڅې جمله. تاسو پخوا د دې سره ستونزه درلوده. بیا هڅه وکړئ!',
  announceNewSentence: 'نوې جمله چمتو ده. خپله انګلیسي ژباړه ولیکئ.',
  announceAnswerRevealed: 'ځواب څرګند شو: {answer}',

  welcomeBackTitle: '⏸️ بیرته ښه راغلاست',
  welcomeBackMessage: 'تاسو یو تمرین په جریان کې لرئ. آیا غواړئ دوام ورکړئ؟',
  startNew: 'نوی پیل وکړئ',

  endSessionTitle: 'غونډه پای ته ورسوئ',
  endSessionMessage: 'تاسو {exercises} تمرینونه بشپړ کړل او په {time} کې {xp} XP ترلاسه کړل. غونډه پای ته ورسوئ؟',
  endSessionConfirm: 'غونډه پای ته ورسوئ',

  errorTitle: 'تېروتنه',
  errorGenerate: 'د جملې جوړول ناکام شو. آیا ستاسو سرور روان دی؟',
  errorCheck: 'د ژباړې چک کول ناکام شو.',
  errorSaveVault: 'په خزانه کې خوندي نشو.',

  alreadyInVault: 'دمخه په خزانه کې',
  addedTitle: 'اضافه شو! 🎉',
  addedMessage: '«{phrase}» ستاسو د لغاتو خزانه کې خوندي شو.',

  answerUnavailableTitle: 'ځواب شتون نلري',
  answerUnavailableMissing: 'دا جمله ځواب نلري. مهرباني وکړئ د نوي ترلاسه کولو لپاره راتلونکې جمله ټک ووهئ.',
  answerUnavailableTryAgain: 'زه نشم کولی دا ځواب څرګند کړم. مهرباني وکړئ بیا هڅه وکړئ یا راتلونکې جمله ټک ووهئ.',

  reportAiTitle: 'د AI ځواب راپور',
  reportAiPrompt: 'کومه ستونزه مو وموندله؟',
  reportAiInaccurate: 'نادقیق',
  reportAiOffensive: 'کلتوري لحاظه بې حسه',
  reportedTitle: 'راپور ورکړل شو',
  reportedThanksReview: 'مننه. موږ به دا وڅیړو.',
  reportedThanksSerious: 'مننه. موږ دا په جدي توګه نیسو.',
};

const qu: TrainerStrings = {
  toEnglish: '→ Inglés simi',

  sentenceLengthHeader: 'Rimay suni',
  lengthShort: 'Pisi',
  lengthMedium: 'Chawpi',
  lengthLong: 'Suni',
  lengthShortDesc: '3-6 simikuna',
  lengthMediumDesc: '7-12 simikuna',
  lengthLongDesc: '13-20 simikuna',

  customRequestPlaceholder: 'Sapaq mañakuy… (kayhinakuna \'Mikhuymanta qhipa pacha\')',
  customTopicRequest: 'Sapaq tema mañakuy',
  customRequestHint: 'Qatiq rimay paq sapaq tema utaq simi kamachiq ñiqi qillqay',

  newSentenceHint: 'Musuq rimayta paqarichin tikrasqa kanankama',
  startSessionHint: 'Musuq tikrayta yachaqay tinkuyta qallarin',

  opensSettingsHint: 'Simi pata pataq imayanan kichan',

  retryBadge: '🔁 WATIQMANTA',
  retrySentenceA11y: 'Watiqmanta rimay. Ñawpaqta sasachakurqankim kayman.',
  bankBadge: '📚 Banku',
  topicLabel: 'Tema: {topic}',
  topicLabelBank: 'Tema: {topic}, yachaqay bankumanta',
  translateThis: 'Kay rimayta inglés simiman tikray: {sentence}',
  typeTranslationHint: 'Hanaq rimaymanta tikrayniykita qillqay',
  voiceInputUnavailable: 'Kunkawanmanta yaykuyqa simiykipaq mana kanchu',
  voiceNotice: 'Tikray yachachiqpi {language} rimaqkunapaq kunkawanmanta yaykuyqa mana kanchu. Pata tarinapaq pruybapi munaspaqa ruwankiman.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Kayhina qallarin: "{word}…"',
  hintUnavailable: 'Yuyariq mana kanchu - aswan allinta ruway!',
  hintPenaltySuffix: ' (yuyariq mancha -20)',
  revealNoScore: 'Kutichiy rikuchikun - ima chaninchaypas mana qusqachu.',
  revealClueHint: 'Yuyariqta rikuchin. Chaninchayniykita 80-pi sayachin.',
  revealAnswerHint: 'Chaninchaynin mana qaspa kutichiyta rikuchin',
  submitTranslationHint: 'Tikrayniykita chaninchanapaq kachan',

  earnedXp: '{xp} riqsiy chaninchayta tariy',
  tapHint: 'Ñitiy',
  saveToVaultPrompt: 'Simi qullqayki ukhupi waqaychanapaq ñitiy:',
  fullPhrase: 'TUKUY RIMAY',

  aiIntroMessage: 'Napaykuyki! Simi kamachiq ñiqikunata sut\'inchanaypaq atishani. Imatataq yachayta munanki?',
  polyPuffTyping: 'Poly-Puff qillqashanmi',
  askAboutGrammarPlaceholder: 'Simi kamachiqmanta tapuy…',
  askGrammarQuestion: 'Poly-Puff-ta simi kamachiq tapuyta tapuy',
  sendMessage: 'Willakuyta kachay',
  reportAiResponseA11y: 'Kay AI kutichiyta willariy',
  youSaidA11y: 'Qam ninki: {text}',
  aiResponseA11y: '{brand}, AI kutichiy: {text}',
  chatError: 'Pampachay, kutichinaypaq sasachakurqani. Watiqmanta ruway!',

  closeSettings: 'Imayanan wisq\'ay',

  selectCefrLevelA11y: 'CEFR pata akllay',
  cefrLevelOptionA11y: 'Pata {l}',
  lengthOptionA11y: '{label} rimaykuna, {desc}',

  announceLevelSelected: 'CEFR pata {level} akllasqa.',
  announceLengthSelected: '{length} rimay suni akllasqa.',
  announceRetryReady: 'Watiqmanta rimay. Ñawpaqta sasachakurqankim kayman. Watiqmanta ruway!',
  announceNewSentence: 'Musuq rimay wakichisqa. Inglés tikrayniykita qillqay.',
  announceAnswerRevealed: 'Kutichiy rikuchikun: {answer}',

  welcomeBackTitle: '⏸️ Allin kutimuyniyki',
  welcomeBackMessage: 'Yachaqay ruwasqayki kashan. Munankichu llaqtayta?',
  startNew: 'Musuq qallariy',

  endSessionTitle: 'Tinkuy tukuy',
  endSessionMessage: '{exercises} yachaqaykunata tukunki hinaspa {time} ukhupi {xp} XP-ta tarinki. Tinkuy tukunichu?',
  endSessionConfirm: 'Tinkuy tukuy',

  errorTitle: 'Pantay',
  errorGenerate: 'Rimay paqarichiyqa mana atikurqachu. Servidorniyki llamk\'ashanchu?',
  errorCheck: 'Tikray qhawayqa mana atikurqachu.',
  errorSaveVault: 'Qullqaman waqaychayta mana atikurqachu.',

  alreadyInVault: 'Ñam qullqapi kashan',
  addedTitle: 'Yapasqa! 🎉',
  addedMessage: '"{phrase}" Simi qullqaykiman waqaychasqa.',

  answerUnavailableTitle: 'Kutichiy mana kanchu',
  answerUnavailableMissing: 'Kay rimaypa kutichiyta mana kanchu. Allinta, musuqta tarinapaq Qatiq Rimayta ñitiy.',
  answerUnavailableTryAgain: 'Kay kutichiyta mana rikuchichikuyta atinichu. Allinta, watiqmanta ruway utaq Qatiq Rimayta ñitiy.',

  reportAiTitle: 'AI kutichiyta willariy',
  reportAiPrompt: 'Ima sasachakuyta tarinki?',
  reportAiInaccurate: 'Mana cheqaq',
  reportAiOffensive: 'Yachaykunaman mana hap\'iq',
  reportedTitle: 'Willarisqa',
  reportedThanksReview: 'Pachis. Kayta qhawasaqku.',
  reportedThanksSerious: 'Pachis. Allinta hap\'iyku.',
};

const sk: TrainerStrings = {
  toEnglish: '→ Angličtina',

  sentenceLengthHeader: 'Dĺžka vety',
  lengthShort: 'Krátka',
  lengthMedium: 'Stredná',
  lengthLong: 'Dlhá',
  lengthShortDesc: '3-6 slov',
  lengthMediumDesc: '7-12 slov',
  lengthLongDesc: '13-20 slov',

  customRequestPlaceholder: 'Vlastná požiadavka… (napr. „Minulý čas o jedle")',
  customTopicRequest: 'Vlastná téma',
  customRequestHint: 'Zadajte konkrétnu tému alebo gramatický cieľ pre nasledujúcu vetu',

  newSentenceHint: 'Vygeneruje novú vetu na preklad',
  startSessionHint: 'Spustí novú reláciu precvičovania prekladu',

  opensSettingsHint: 'Otvorí nastavenia jazyka a úrovne',

  retryBadge: '🔁 ZNOVA',
  retrySentenceA11y: 'Veta na opakovanie. Predtým ste s ňou mali problém.',
  bankBadge: '📚 Banka',
  topicLabel: 'Téma: {topic}',
  topicLabelBank: 'Téma: {topic}, z banky cvičení',
  translateThis: 'Preložte túto vetu do angličtiny: {sentence}',
  typeTranslationHint: 'Napíšte svoj preklad vety vyššie',
  voiceInputUnavailable: 'Hlasový vstup nie je k dispozícii pre váš jazyk',
  voiceNotice: 'Hlasový vstup nie je k dispozícii pre používateľov jazyka {language} v Trénerovi prekladu. Stále ho môžete použiť vo Vstupnom teste.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'Začína na: „{word}…"',
  hintUnavailable: 'Nápoveda nie je k dispozícii - skúste to čo najlepšie!',
  hintPenaltySuffix: ' (-20 pokuta za nápovedu)',
  revealNoScore: 'Odpoveď bola odhalená - žiadne body neudelené.',
  revealClueHint: 'Odhalí indíciu. Obmedzuje vaše skóre na 80.',
  revealAnswerHint: 'Odhalí odpoveď bez bodovania',
  submitTranslationHint: 'Odošle váš preklad na hodnotenie',

  earnedXp: 'Získané {xp} bodov skúseností',
  tapHint: 'Klepnúť',
  saveToVaultPrompt: 'Klepnutím uložíte do Trezoru slovnej zásoby:',
  fullPhrase: 'CELÁ FRÁZA',

  aiIntroMessage: 'Ahoj! Môžem pomôcť vysvetliť gramatické pravidlá. Čo by si chcel vedieť?',
  polyPuffTyping: 'Poly-Puff píše',
  askAboutGrammarPlaceholder: 'Spýtaj sa na gramatiku…',
  askGrammarQuestion: 'Spýtajte sa Poly-Puffa na gramatiku',
  sendMessage: 'Odoslať správu',
  reportAiResponseA11y: 'Nahlásiť túto odpoveď AI',
  youSaidA11y: 'Povedali ste: {text}',
  aiResponseA11y: '{brand}, odpoveď AI: {text}',
  chatError: 'Prepáčte, mal som problém s odpoveďou. Skúste to znova!',

  closeSettings: 'Zatvoriť nastavenia',

  selectCefrLevelA11y: 'Vyberte úroveň CEFR',
  cefrLevelOptionA11y: 'Úroveň {l}',
  lengthOptionA11y: 'Vety: {label}, {desc}',

  announceLevelSelected: 'Úroveň CEFR {level} vybraná.',
  announceLengthSelected: 'Vybraná dĺžka vety: {length}.',
  announceRetryReady: 'Veta na opakovanie. Predtým ste s ňou mali problém. Skúste to znova!',
  announceNewSentence: 'Nová veta pripravená. Napíšte svoj anglický preklad.',
  announceAnswerRevealed: 'Odpoveď odhalená: {answer}',

  welcomeBackTitle: '⏸️ Vitajte späť',
  welcomeBackMessage: 'Máte rozpracované cvičenie. Chcete pokračovať?',
  startNew: 'Začať znova',

  endSessionTitle: 'Ukončiť reláciu',
  endSessionMessage: 'Dokončili ste {exercises} cvičení a získali {xp} XP za {time}. Ukončiť reláciu?',
  endSessionConfirm: 'Ukončiť reláciu',

  errorTitle: 'Chyba',
  errorGenerate: 'Nepodarilo sa vygenerovať vetu. Beží váš server?',
  errorCheck: 'Nepodarilo sa skontrolovať preklad.',
  errorSaveVault: 'Nepodarilo sa uložiť do trezoru.',

  alreadyInVault: 'Už v trezore',
  addedTitle: 'Pridané! 🎉',
  addedMessage: '„{phrase}" uložené do vášho Trezoru slovnej zásoby.',

  answerUnavailableTitle: 'Odpoveď nie je k dispozícii',
  answerUnavailableMissing: 'Tejto vete chýba kľúč s odpoveďou. Klepnite na Ďalšiu vetu a získajte novú.',
  answerUnavailableTryAgain: 'Nemohol som odhaliť túto odpoveď. Skúste to znova alebo klepnite na Ďalšiu vetu.',

  reportAiTitle: 'Nahlásiť odpoveď AI',
  reportAiPrompt: 'Aký problém ste našli?',
  reportAiInaccurate: 'Nepresné',
  reportAiOffensive: 'Kultúrne necitlivé',
  reportedTitle: 'Nahlásené',
  reportedThanksReview: 'Ďakujeme. Preskúmame to.',
  reportedThanksSerious: 'Ďakujeme. Berieme to vážne.',
};

const te: TrainerStrings = {
  toEnglish: '→ ఆంగ్లం',

  sentenceLengthHeader: 'వాక్యం పొడవు',
  lengthShort: 'చిన్నది',
  lengthMedium: 'మధ్యస్థం',
  lengthLong: 'పొడవైనది',
  lengthShortDesc: '3-6 పదాలు',
  lengthMediumDesc: '7-12 పదాలు',
  lengthLongDesc: '13-20 పదాలు',

  customRequestPlaceholder: 'అనుకూల అభ్యర్థన… (ఉదా. \'ఆహారం గురించి భూత కాలం\')',
  customTopicRequest: 'అనుకూల అంశం అభ్యర్థన',
  customRequestHint: 'తదుపరి వాక్యానికి నిర్దిష్ట అంశం లేదా వ్యాకరణ దృష్టి టైప్ చేయండి',

  newSentenceHint: 'అనువదించడానికి కొత్త వాక్యాన్ని సృష్టిస్తుంది',
  startSessionHint: 'కొత్త అనువాద సాధన సెషన్‌ను ప్రారంభిస్తుంది',

  opensSettingsHint: 'భాష మరియు స్థాయి సెట్టింగ్‌లను తెరుస్తుంది',

  retryBadge: '🔁 మళ్లీ',
  retrySentenceA11y: 'తిరిగి ప్రయత్నించాల్సిన వాక్యం. మీరు దీనితో గతంలో కష్టపడ్డారు.',
  bankBadge: '📚 బ్యాంక్',
  topicLabel: 'అంశం: {topic}',
  topicLabelBank: 'అంశం: {topic}, వ్యాయామ బ్యాంక్ నుండి',
  translateThis: 'ఈ వాక్యాన్ని ఆంగ్లంలోకి అనువదించండి: {sentence}',
  typeTranslationHint: 'పైన ఉన్న వాక్యం యొక్క మీ అనువాదాన్ని టైప్ చేయండి',
  voiceInputUnavailable: 'మీ భాషకు వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు',
  voiceNotice: 'అనువాద శిక్షకులో {language} మాట్లాడేవారికి వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. మీరు ఇప్పటికీ స్థాయి నిర్ధారణ పరీక్షలో దీన్ని ఉపయోగించవచ్చు.',

  hintScorePenalty: '(-20)',
  hintStartsWith: 'దీనితో మొదలవుతుంది: "{word}…"',
  hintUnavailable: 'సూచన అందుబాటులో లేదు - మీ ఉత్తమంగా ప్రయత్నించండి!',
  hintPenaltySuffix: ' (-20 సూచన జరిమానా)',
  revealNoScore: 'సమాధానం వెల్లడైంది - ఎటువంటి స్కోరు ఇవ్వబడలేదు.',
  revealClueHint: 'ఒక సూచనను వెల్లడిస్తుంది. మీ స్కోర్‌ను 80కి పరిమితం చేస్తుంది.',
  revealAnswerHint: 'స్కోరింగ్ లేకుండా సమాధానం వెల్లడిస్తుంది',
  submitTranslationHint: 'గ్రేడింగ్ కోసం మీ అనువాదాన్ని సమర్పిస్తుంది',

  earnedXp: '{xp} అనుభవ పాయింట్లు సంపాదించబడ్డాయి',
  tapHint: 'నొక్కండి',
  saveToVaultPrompt: 'మీ పదజాలం నిధికి సేవ్ చేయడానికి నొక్కండి:',
  fullPhrase: 'పూర్తి పదబంధం',

  aiIntroMessage: 'హాయ్! నేను వ్యాకరణ నియమాలను వివరించడంలో సహాయపడగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?',
  polyPuffTyping: 'Poly-Puff టైప్ చేస్తోంది',
  askAboutGrammarPlaceholder: 'వ్యాకరణం గురించి అడగండి…',
  askGrammarQuestion: 'Poly-Puffని వ్యాకరణ ప్రశ్న అడగండి',
  sendMessage: 'సందేశం పంపండి',
  reportAiResponseA11y: 'ఈ AI ప్రతిస్పందనను నివేదించండి',
  youSaidA11y: 'మీరు చెప్పారు: {text}',
  aiResponseA11y: '{brand}, AI ప్రతిస్పందన: {text}',
  chatError: 'క్షమించండి, స్పందించడంలో నాకు సమస్య వచ్చింది. మళ్లీ ప్రయత్నించండి!',

  closeSettings: 'సెట్టింగ్‌లు మూసివేయండి',

  selectCefrLevelA11y: 'CEFR స్థాయిని ఎంచుకోండి',
  cefrLevelOptionA11y: 'స్థాయి {l}',
  lengthOptionA11y: '{label} వాక్యాలు, {desc}',

  announceLevelSelected: 'CEFR స్థాయి {level} ఎంచుకోబడింది.',
  announceLengthSelected: '{length} వాక్య పొడవు ఎంచుకోబడింది.',
  announceRetryReady: 'తిరిగి ప్రయత్నించాల్సిన వాక్యం. మీరు దీనితో గతంలో కష్టపడ్డారు. మళ్లీ ప్రయత్నించండి!',
  announceNewSentence: 'కొత్త వాక్యం సిద్ధంగా ఉంది. మీ ఆంగ్ల అనువాదాన్ని టైప్ చేయండి.',
  announceAnswerRevealed: 'సమాధానం వెల్లడైంది: {answer}',

  welcomeBackTitle: '⏸️ తిరిగి స్వాగతం',
  welcomeBackMessage: 'మీకు ఒక వ్యాయామం పురోగతిలో ఉంది. మీరు కొనసాగించాలనుకుంటున్నారా?',
  startNew: 'కొత్తగా ప్రారంభించండి',

  endSessionTitle: 'సెషన్ ముగించండి',
  endSessionMessage: 'మీరు {exercises} వ్యాయామాలను పూర్తి చేశారు మరియు {time}లో {xp} XPని సంపాదించారు. సెషన్ ముగించాలా?',
  endSessionConfirm: 'సెషన్ ముగించండి',

  errorTitle: 'లోపం',
  errorGenerate: 'వాక్యం సృష్టించడంలో విఫలమైంది. మీ సర్వర్ నడుస్తోందా?',
  errorCheck: 'అనువాదాన్ని తనిఖీ చేయడంలో విఫలమైంది.',
  errorSaveVault: 'నిధికి సేవ్ చేయలేకపోయింది.',

  alreadyInVault: 'ఇప్పటికే నిధిలో ఉంది',
  addedTitle: 'జోడించబడింది! 🎉',
  addedMessage: '"{phrase}" మీ పదజాలం నిధిలో సేవ్ చేయబడింది.',

  answerUnavailableTitle: 'సమాధానం అందుబాటులో లేదు',
  answerUnavailableMissing: 'ఈ వాక్యానికి సమాధాన కీ లేదు. దయచేసి కొత్తదాని కోసం తదుపరి వాక్యం నొక్కండి.',
  answerUnavailableTryAgain: 'నేను ఈ సమాధానాన్ని వెల్లడించలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి లేదా తదుపరి వాక్యం నొక్కండి.',

  reportAiTitle: 'AI ప్రతిస్పందనను నివేదించండి',
  reportAiPrompt: 'మీరు ఏ సమస్యను కనుగొన్నారు?',
  reportAiInaccurate: 'తప్పు',
  reportAiOffensive: 'సాంస్కృతికంగా అసంవేదన',
  reportedTitle: 'నివేదించబడింది',
  reportedThanksReview: 'ధన్యవాదాలు. మేము దీన్ని సమీక్షిస్తాము.',
  reportedThanksSerious: 'ధన్యవాదాలు. మేము దీన్ని గంభీరంగా తీసుకుంటాము.',
};

const TRAINER_STRINGS: Partial<Record<LangCode, TrainerStrings>> = {
  en,
  af,
  am,
  ar,
  bn,
  bg,
  cs,
  da,
  nl,
  fi,
  fr,
  de,
  el,
  gu,
  ha,
  he,
  hi,
  hu,
  ig,
  id,
  it,
  ja,
  ko,
  ms,
  zh,
  mr,
  ne,
  no,
  fa,
  pl,
  pt,
  pa,
  ro,
  ru,
  si,
  es,
  sw,
  sv,
  ta,
  th,
  tr,
  uk,
  ur,
  vi,
  yo,
  zu,
  fil,
  gn,
  ht,
  ps,
  qu,
  sk,
  te,
};

export function getTrainerT(lang: LangCode): TrainerStrings {
  return TRAINER_STRINGS[lang] ?? en;
}

export function tInterp(value: string, params?: Record<string, string | number>): string {
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
}
