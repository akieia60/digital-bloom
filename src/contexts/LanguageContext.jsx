import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { es } from '../locales/es';
import { fr } from '../locales/fr';
import { ht } from '../locales/ht';
import { zh } from '../locales/zh';

const dictionaries = { en, es, fr, ht, zh };

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ht', label: 'Kreyòl', short: 'HT' },
  { code: 'zh', label: '中文', short: 'ZH' },
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('digital_bloom_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('digital_bloom_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    // Keep sequential toggle for simple clicks
    const idx = AVAILABLE_LANGUAGES.findIndex(l => l.code === lang);
    const nextIdx = (idx + 1) % AVAILABLE_LANGUAGES.length;
    setLang(AVAILABLE_LANGUAGES[nextIdx].code);
  };

  const changeLanguage = (code) => {
    setLang(code);
  };

  const t = (key) => {
    return dictionaries[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
