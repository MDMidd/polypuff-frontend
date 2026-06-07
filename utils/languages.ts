import type { LangCode } from '../contexts/translations';

export type LanguageOption = {
  code: LangCode;
  englishName: string;
  nativeName: string;
};

export const RTL_LANGUAGES = new Set<LangCode>(['ar', 'fa', 'he', 'ps', 'ur']);

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'af', nativeName: 'Afrikaans', englishName: 'Afrikaans' },
  { code: 'am', nativeName: 'አማርኛ', englishName: 'Amharic' },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
  { code: 'bg', nativeName: 'Български', englishName: 'Bulgarian' },
  { code: 'cs', nativeName: 'Čeština', englishName: 'Czech' },
  { code: 'da', nativeName: 'Dansk', englishName: 'Danish' },
  { code: 'nl', nativeName: 'Nederlands', englishName: 'Dutch' },
  { code: 'fi', nativeName: 'Suomi', englishName: 'Finnish' },
  { code: 'fr', nativeName: 'Français', englishName: 'French' },
  { code: 'de', nativeName: 'Deutsch', englishName: 'German' },
  { code: 'el', nativeName: 'Ελληνικά', englishName: 'Greek' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  { code: 'ha', nativeName: 'Hausa', englishName: 'Hausa' },
  { code: 'he', nativeName: 'עברית', englishName: 'Hebrew' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
  { code: 'hu', nativeName: 'Magyar', englishName: 'Hungarian' },
  { code: 'ig', nativeName: 'Igbo', englishName: 'Igbo' },
  { code: 'id', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian' },
  { code: 'it', nativeName: 'Italiano', englishName: 'Italian' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese' },
  { code: 'ko', nativeName: '한국어', englishName: 'Korean' },
  { code: 'ms', nativeName: 'Bahasa Melayu', englishName: 'Malay' },
  { code: 'zh', nativeName: '中文', englishName: 'Chinese' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
  { code: 'ne', nativeName: 'नेपाली', englishName: 'Nepali' },
  { code: 'no', nativeName: 'Norsk', englishName: 'Norwegian' },
  { code: 'fa', nativeName: 'فارسی', englishName: 'Persian' },
  { code: 'pl', nativeName: 'Polski', englishName: 'Polish' },
  { code: 'pt', nativeName: 'Português', englishName: 'Portuguese' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
  { code: 'ro', nativeName: 'Română', englishName: 'Romanian' },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian' },
  { code: 'si', nativeName: 'සිංහල', englishName: 'Sinhala' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish' },
  { code: 'sw', nativeName: 'Kiswahili', englishName: 'Swahili' },
  { code: 'sv', nativeName: 'Svenska', englishName: 'Swedish' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
  { code: 'th', nativeName: 'ไทย', englishName: 'Thai' },
  { code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish' },
  { code: 'uk', nativeName: 'Українська', englishName: 'Ukrainian' },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu' },
  { code: 'vi', nativeName: 'Tiếng Việt', englishName: 'Vietnamese' },
  { code: 'yo', nativeName: 'Yorùbá', englishName: 'Yoruba' },
  { code: 'zu', nativeName: 'isiZulu', englishName: 'Zulu' },
  { code: 'fil', nativeName: 'Filipino', englishName: 'Filipino' },
  { code: 'gn', nativeName: 'Avañe’ẽ', englishName: 'Guarani' },
  { code: 'ht', nativeName: 'Kreyòl Ayisyen', englishName: 'Haitian Creole' },
  { code: 'ps', nativeName: 'پښتو', englishName: 'Pashto' },
  { code: 'qu', nativeName: 'Runasimi', englishName: 'Quechua' },
  { code: 'sk', nativeName: 'Slovenčina', englishName: 'Slovak' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu' },
];

export const isRtlLanguage = (code: LangCode) => RTL_LANGUAGES.has(code);

export const formatLanguageName = ({ nativeName, englishName }: LanguageOption) =>
  `${nativeName} (${englishName})`;
