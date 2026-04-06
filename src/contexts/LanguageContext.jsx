import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { en } from '../locales/en';

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ht', label: 'Kreyòl', short: 'HT' },
  { code: 'zh', label: '中文', short: 'ZH' },
];

const LanguageContext = createContext();

async function loadDictionary(code) {
  switch (code) {
    case 'es':
      return (await import('../locales/es')).es;
    case 'fr':
      return (await import('../locales/fr')).fr;
    case 'ht':
      return (await import('../locales/ht')).ht;
    case 'zh':
      return (await import('../locales/zh')).zh;
    case 'en':
    default:
      return en;
  }
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('digital_bloom_lang') || 'en';
  });
  const [dictionary, setDictionary] = useState(en);

  useEffect(() => {
    localStorage.setItem('digital_bloom_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    let cancelled = false;

    loadDictionary(lang)
      .then((loadedDictionary) => {
        if (!cancelled) {
          setDictionary(loadedDictionary || en);
        }
      })
      .catch((error) => {
        console.error(`[Digital Bloom] Failed to load locale "${lang}"`, error);
        if (!cancelled) {
          setDictionary(en);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    // Keep sequential toggle for simple clicks
    const idx = AVAILABLE_LANGUAGES.findIndex(l => l.code === lang);
    const nextIdx = (idx + 1) % AVAILABLE_LANGUAGES.length;
    setLang(AVAILABLE_LANGUAGES[nextIdx].code);
  }, [lang]);

  const changeLanguage = useCallback((code) => {
    setLang(code);
  }, []);

  const t = useCallback((key) => {
    return dictionary[key] || en[key] || key;
  }, [dictionary]);

  const value = useMemo(() => ({
    lang,
    toggleLanguage,
    changeLanguage,
    t,
  }), [lang, toggleLanguage, changeLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
