import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();


  const handleView = () => {
    // fromIntro: true 를 state로 전달 → LoadingGuard 통과 키
    navigate('/loading', { state: { fromIntro: true } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#EFEBE6] to-[#F8F5F2] text-[#483434]">
      <LanguageToggle />
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-sm mb-12">
          {t('mainTitle')}
        </h1>
        <button
          onClick= {handleView}
          className="bg-[#6B4F4F] text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 transform"
        >
          {t('viewFortuneButton')}
        </button>
      </main>
    </div>
  );
};

export default IntroPage;
