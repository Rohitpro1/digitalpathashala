import { useState, useEffect, createContext, useContext } from 'react';
import { translations } from '../constants/translations';
import { saveLanguage, getLanguage } from '../services/storage';

const LanguageContext = createContext({});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('english');
  const [t, setT] = useState(translations.english);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await getLanguage();
    if (savedLanguage) {
      setLanguageState(savedLanguage);
      setT(translations[savedLanguage]);
    }
  };

  const setLanguage = async (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguageState(newLanguage);
      setT(translations[newLanguage]);
      await saveLanguage(newLanguage);
    }
  };

  const getMultilingualText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    return textObj?.[language] || textObj?.['english'] || '';
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getMultilingualText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
