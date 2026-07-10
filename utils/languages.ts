import type { LangCode } from '../contexts/translations';

export type LanguageOption = {
  code: LangCode;
  englishName: string;
  nativeName: string;
  flag: string; // Unicode flag emoji of the country most associated with this language
};

export const RTL_LANGUAGES = new Set<LangCode>(['ar', 'fa', 'he', 'ps', 'ur']);

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en',  flag: '🇬🇧', nativeName: 'English',          englishName: 'English' },
  { code: 'af',  flag: '🇿🇦', nativeName: 'Afrikaans',        englishName: 'Afrikaans' },
  { code: 'am',  flag: '🇪🇹', nativeName: 'አማርኛ',             englishName: 'Amharic' },
  { code: 'ar',  flag: '🇸🇦', nativeName: 'العربية',          englishName: 'Arabic' },
  { code: 'bn',  flag: '🇧🇩', nativeName: 'বাংলা',             englishName: 'Bengali' },
  { code: 'bg',  flag: '🇧🇬', nativeName: 'Български',        englishName: 'Bulgarian' },
  { code: 'cs',  flag: '🇨🇿', nativeName: 'Čeština',          englishName: 'Czech' },
  { code: 'da',  flag: '🇩🇰', nativeName: 'Dansk',            englishName: 'Danish' },
  { code: 'nl',  flag: '🇳🇱', nativeName: 'Nederlands',       englishName: 'Dutch' },
  { code: 'fi',  flag: '🇫🇮', nativeName: 'Suomi',            englishName: 'Finnish' },
  { code: 'fr',  flag: '🇫🇷', nativeName: 'Français',         englishName: 'French' },
  { code: 'de',  flag: '🇩🇪', nativeName: 'Deutsch',          englishName: 'German' },
  { code: 'el',  flag: '🇬🇷', nativeName: 'Ελληνικά',         englishName: 'Greek' },
  { code: 'gu',  flag: '🇮🇳', nativeName: 'ગુજરાતી',          englishName: 'Gujarati' },
  { code: 'ha',  flag: '🇳🇬', nativeName: 'Hausa',            englishName: 'Hausa' },
  { code: 'he',  flag: '🇮🇱', nativeName: 'עברית',            englishName: 'Hebrew' },
  { code: 'hi',  flag: '🇮🇳', nativeName: 'हिन्दी',            englishName: 'Hindi' },
  { code: 'hu',  flag: '🇭🇺', nativeName: 'Magyar',           englishName: 'Hungarian' },
  { code: 'ig',  flag: '🇳🇬', nativeName: 'Igbo',             englishName: 'Igbo' },
  { code: 'id',  flag: '🇮🇩', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian' },
  { code: 'it',  flag: '🇮🇹', nativeName: 'Italiano',         englishName: 'Italian' },
  { code: 'ja',  flag: '🇯🇵', nativeName: '日本語',             englishName: 'Japanese' },
  { code: 'ko',  flag: '🇰🇷', nativeName: '한국어',             englishName: 'Korean' },
  { code: 'ms',  flag: '🇲🇾', nativeName: 'Bahasa Melayu',    englishName: 'Malay' },
  { code: 'zh',  flag: '🇨🇳', nativeName: '中文',              englishName: 'Chinese' },
  { code: 'mr',  flag: '🇮🇳', nativeName: 'मराठी',             englishName: 'Marathi' },
  { code: 'ne',  flag: '🇳🇵', nativeName: 'नेपाली',            englishName: 'Nepali' },
  { code: 'no',  flag: '🇳🇴', nativeName: 'Norsk',            englishName: 'Norwegian' },
  { code: 'fa',  flag: '🇮🇷', nativeName: 'فارسی',            englishName: 'Persian' },
  { code: 'pl',  flag: '🇵🇱', nativeName: 'Polski',           englishName: 'Polish' },
  { code: 'pt',  flag: '🇵🇹', nativeName: 'Português',        englishName: 'Portuguese' },
  { code: 'pa',  flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ',           englishName: 'Punjabi' },
  { code: 'ro',  flag: '🇷🇴', nativeName: 'Română',           englishName: 'Romanian' },
  { code: 'ru',  flag: '🇷🇺', nativeName: 'Русский',          englishName: 'Russian' },
  { code: 'si',  flag: '🇱🇰', nativeName: 'සිංහල',            englishName: 'Sinhala' },
  { code: 'es',  flag: '🇪🇸', nativeName: 'Español',          englishName: 'Spanish' },
  { code: 'sw',  flag: '🇰🇪', nativeName: 'Kiswahili',        englishName: 'Swahili' },
  { code: 'sv',  flag: '🇸🇪', nativeName: 'Svenska',          englishName: 'Swedish' },
  { code: 'ta',  flag: '🇮🇳', nativeName: 'தமிழ்',           englishName: 'Tamil' },
  { code: 'th',  flag: '🇹🇭', nativeName: 'ไทย',              englishName: 'Thai' },
  { code: 'tr',  flag: '🇹🇷', nativeName: 'Türkçe',           englishName: 'Turkish' },
  { code: 'uk',  flag: '🇺🇦', nativeName: 'Українська',       englishName: 'Ukrainian' },
  { code: 'ur',  flag: '🇵🇰', nativeName: 'اردو',             englishName: 'Urdu' },
  { code: 'vi',  flag: '🇻🇳', nativeName: 'Tiếng Việt',       englishName: 'Vietnamese' },
  { code: 'yo',  flag: '🇳🇬', nativeName: 'Yorùbá',           englishName: 'Yoruba' },
  { code: 'zu',  flag: '🇿🇦', nativeName: 'isiZulu',          englishName: 'Zulu' },
  { code: 'fil', flag: '🇵🇭', nativeName: 'Filipino',         englishName: 'Filipino' },
  { code: 'gn',  flag: '🇵🇾', nativeName: 'Avañe’ẽ',          englishName: 'Guarani' },
  { code: 'ht',  flag: '🇭🇹', nativeName: 'Kreyòl Ayisyen',   englishName: 'Haitian Creole' },
  { code: 'ps',  flag: '🇦🇫', nativeName: 'پښتو',             englishName: 'Pashto' },
  { code: 'qu',  flag: '🇵🇪', nativeName: 'Runasimi',         englishName: 'Quechua' },
  { code: 'sk',  flag: '🇸🇰', nativeName: 'Slovenčina',       englishName: 'Slovak' },
  { code: 'te',  flag: '🇮🇳', nativeName: 'తెలుగు',          englishName: 'Telugu' },
];

export const isRtlLanguage = (code: LangCode) => RTL_LANGUAGES.has(code);

export const formatLanguageName = ({ nativeName, englishName }: LanguageOption) =>
  `${nativeName} (${englishName})`;

// Lookup helpers - handy when you only have a code or an English name.
export const flagForLangCode = (code: LangCode): string =>
  LANGUAGE_OPTIONS.find(l => l.code === code)?.flag ?? '';

export const flagForEnglishName = (name: string): string =>
  LANGUAGE_OPTIONS.find(l => l.englishName === name)?.flag ?? '';
