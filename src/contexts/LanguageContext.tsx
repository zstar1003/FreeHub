import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslations, Translations } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    // 检查本地存储或浏览器语言偏好
    const savedLang = localStorage.getItem('language') as Language;
    const browserLang = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';

    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguageState(savedLang);
    } else {
      setLanguageState(browserLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
