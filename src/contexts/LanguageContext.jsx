import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { es } from '../locales/es';

const dictionaries = { en, es };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    // Default to Spanish per Gamble's feedback if no preference is stored
    return localStorage.getItem('digital_bloom_lang') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('digital_bloom_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  const t = (key) => {
    return dictionaries[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
