/**
 * POLY-PUFF - Language Context
 * FILE: contexts/LanguageContext.tsx
 *
 * Provides the current app language and translation function to the entire app.
 * Wrap the root layout with <LanguageProvider> and call useLanguage() in any screen.
 *
 * Usage in any screen:
 *   const { t, lang } = useLanguage();
 *   <Text>{t.home}</Text>        // "Accueil" in French, "主页" in Chinese, etc.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations, { LangCode, Translations } from './translations';
import websiteTranslations from './websiteTranslations';

type TranslationParams = Record<string, string | number>;

const interpolate = (value: string, params?: TranslationParams) => {
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
};

interface LanguageContextValue {
  lang: LangCode;
  t: Translations;
  wt: (key: string, params?: TranslationParams) => string;
  setLang: (code: LangCode) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  t: translations['en'] as Translations,
  wt: (key) => key,
  setLang: async () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LangCode>('en');

  // Load saved language on mount
  useEffect(() => {
    AsyncStorage.getItem('userProfile')
      .then(raw => {
        if (!raw) return;
        const profile = JSON.parse(raw);
        const code = profile?.appLanguage as LangCode;
        if (code && translations[code]) setLangState(code);
      })
      .catch(() => {});
  }, []);

  const setLang = useCallback(async (code: LangCode) => {
    if (!translations[code]) return;
    setLangState(code);
    // Persist to userProfile so it survives app restarts
    try {
      const raw = await AsyncStorage.getItem('userProfile');
      const profile = raw ? JSON.parse(raw) : {};
      await AsyncStorage.setItem('userProfile', JSON.stringify({ ...profile, appLanguage: code }));
    } catch (_) {}
  }, []);

  const wt = useCallback((key: string, params?: TranslationParams) => {
    const pack = (websiteTranslations[lang] ?? websiteTranslations.en) as Record<string, string>;
    const englishPack = websiteTranslations.en as Record<string, string>;
    return interpolate(pack[key] || englishPack[key] || key, params);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t: (translations[lang] ?? translations['en']) as Translations, wt, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
