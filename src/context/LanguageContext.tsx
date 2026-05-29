'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKey } from '@/lib/translations';
import LogoLoader from '@/components/LogoLoader';

type Language = 'en' | 'ml';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ml');
  // Controls the initial full-screen loader; true until localStorage is read
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'en' || savedLang === 'ml') {
      setLanguageState(savedLang);
    }
    // Brief intentional delay so the pop animation plays at least once
    const t = setTimeout(() => setIsHydrated(true), 800);
    return () => clearTimeout(t);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: TranslationKey, defaultValue?: string): string => {
    const trans = translations[language];
    if (!trans) return defaultValue || String(key);
    // @ts-ignore
    return trans[key] || defaultValue || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {/* Full-screen initial loader — fades out once hydrated */}
      {!isHydrated && <LogoLoader variant="fullscreen" />}
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

