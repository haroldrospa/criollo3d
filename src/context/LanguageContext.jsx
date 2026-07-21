import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // 1. Detect device language or saved preference
  const getInitialLanguage = () => {
    const saved = localStorage.getItem('criollo3d_lang');
    if (saved && (saved === 'es' || saved === 'en')) {
      return saved;
    }

    const browserLang = navigator.language || navigator.userLanguage || 'es';
    if (browserLang.toLowerCase().startsWith('es')) {
      return 'es';
    }
    return 'en';
  };

  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = (lang) => {
    if (lang === 'es' || lang === 'en') {
      setLanguageState(lang);
      localStorage.setItem('criollo3d_lang', lang);
    }
  };

  // Helper translation function t('nav.home')
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[language];

    for (let key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to Spanish if missing
        let fallback = translations['es'];
        for (let fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
