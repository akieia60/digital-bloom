import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { en } from '../locales/en';

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'pt-BR', label: 'Português', short: 'PT' },
  { code: 'ht', label: 'Kreyòl', short: 'HT' },
  { code: 'vi', label: 'Tiếng Việt', short: 'VI' },
  { code: 'tl', label: 'Tagalog', short: 'TL' },
  { code: 'zh', label: '中文', short: 'ZH' },
  { code: 'ja', label: '日本語', short: 'JA' },
];

const LanguageContext = createContext();

async function loadDictionary(code) {
  switch (code) {
    case 'es':
      return (await import('../locales/es')).es;
    case 'fr':
      return (await import('../locales/fr')).fr;
    case 'de':
      return (await import('../locales/de')).de;
    case 'pt-BR':
      return (await import('../locales/pt-BR')).ptBR;
    case 'ht':
      return (await import('../locales/ht')).ht;
    case 'vi':
      return (await import('../locales/vi')).vi;
    case 'tl':
      return (await import('../locales/tl')).tl;
    case 'zh':
      return (await import('../locales/zh')).zh;
    case 'ja':
      return (await import('../locales/ja')).ja;
    case 'en':
    default:
      return en;
  }
}

function detectBrowserLanguage() {
  if (typeof navigator === 'undefined') return 'en';
  const supported = AVAILABLE_LANGUAGES.map(l => l.code);
  const langs = navigator.languages || [navigator.language || 'en'];
  for (const raw of langs) {
    if (!raw) continue;
    if (supported.includes(raw)) return raw;
    const base = raw.split('-')[0];
    if (supported.includes(base)) return base;
    if (base === 'pt') return 'pt-BR';
  }
  return 'en';
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('digital_bloom_lang');
    if (stored && AVAILABLE_LANGUAGES.some(l => l.code === stored)) return stored;
    return detectBrowserLanguage();
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
