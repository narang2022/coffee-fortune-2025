
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === Language.KO ? Language.EN : Language.KO;
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm text-sm px-3 py-1 rounded-full text-gray-700 shadow-sm transition-transform hover:scale-105"
    >
      {language === Language.KO ? 'EN' : 'KO'}
    </button>
  );
};

export default LanguageToggle;
