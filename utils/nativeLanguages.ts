import { LANGUAGE_OPTIONS } from './languages';

export type NativeLanguageOption = {
  code: string;
  flag: string;
  nativeName: string;
  englishName: string;
  value: string;
  speechCode: string;
};

const SPEECH_CODES: Record<string, string> = {
  af: 'af-ZA',
  am: 'am-ET',
  ar: 'ar',
  bn: 'bn-BD',
  bg: 'bg-BG',
  cs: 'cs-CZ',
  da: 'da-DK',
  nl: 'nl-NL',
  fi: 'fi-FI',
  fr: 'fr-FR',
  de: 'de-DE',
  el: 'el-GR',
  gu: 'gu-IN',
  ha: 'ha',
  he: 'he-IL',
  hi: 'hi-IN',
  hu: 'hu-HU',
  ig: 'ig',
  id: 'id-ID',
  it: 'it-IT',
  ja: 'ja-JP',
  ko: 'ko-KR',
  ms: 'ms-MY',
  zh: 'zh-CN',
  mr: 'mr-IN',
  ne: 'ne-NP',
  no: 'nb-NO',
  fa: 'fa-IR',
  pl: 'pl-PL',
  pt: 'pt-PT',
  pa: 'pa-IN',
  ro: 'ro-RO',
  ru: 'ru-RU',
  si: 'si-LK',
  es: 'es-ES',
  sw: 'sw-KE',
  sv: 'sv-SE',
  ta: 'ta-IN',
  th: 'th-TH',
  tr: 'tr-TR',
  uk: 'uk-UA',
  ur: 'ur-PK',
  vi: 'vi-VN',
  yo: 'yo',
  zu: 'zu-ZA',
  fil: 'fil-PH',
  gn: 'gn',
  ht: 'ht',
  ps: 'ps-AF',
  qu: 'qu',
  sk: 'sk-SK',
  te: 'te-IN',
};

const nativeValueFor = (englishName: string) =>
  englishName === 'Chinese' ? 'Mandarin' : englishName;

export const NATIVE_LANGUAGE_OPTIONS: NativeLanguageOption[] =
  LANGUAGE_OPTIONS
    .filter(option => option.code !== 'en')
    .map(option => ({
      code: option.code,
      flag: option.flag,
      nativeName: option.nativeName,
      englishName: option.englishName === 'Chinese' ? 'Mandarin' : option.englishName,
      value: nativeValueFor(option.englishName),
      speechCode: SPEECH_CODES[option.code] || 'en',
    }));

export const nativeLanguageValues = new Set(
  NATIVE_LANGUAGE_OPTIONS.map(option => option.value)
);

export const normalizeNativeLanguage = (value?: string | null) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return 'Spanish';
  if (trimmed === 'Chinese') return 'Mandarin';
  return nativeLanguageValues.has(trimmed) ? trimmed : 'Spanish';
};
