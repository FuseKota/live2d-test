/**
 * 言語コンテキスト
 * アプリ全体の言語状態を管理し、i18nextと同期
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import i18n from '../i18n';
import { SupportedLanguage } from '../types/spot';

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'ja'
  );

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * 言語コンテキストを使用するフック
 */
export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
