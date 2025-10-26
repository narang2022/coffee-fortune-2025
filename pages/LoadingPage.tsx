import React, { useEffect } from 'react';
// FIX: Reordered the import of global type definitions to occur after React is imported.
// This ensures that the JSX namespace is available for augmentation, allowing custom elements like 'lottie-player' to be recognized.
import '../types';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FORTUNES, LUCKY_COLORS, LUCKY_NUMBERS, LUCKY_PLACES } from '../constants';

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate random fortune
      const fortuneId = Math.floor(Math.random() * FORTUNES[language].length);
      const colorIndex = Math.floor(Math.random() * LUCKY_COLORS[language].length);
      const luckyColor = LUCKY_COLORS[language][colorIndex];
      const luckyNumber = LUCKY_NUMBERS[Math.floor(Math.random() * LUCKY_NUMBERS.length)];
      const luckyPlace = LUCKY_PLACES[language][Math.floor(Math.random() * LUCKY_PLACES[language].length)];
      
      const params = new URLSearchParams({
        id: fortuneId.toString(),
        color: luckyColor.name,
        num: luckyNumber.toString(),
        place: luckyPlace
      });

      navigate(`/result?${params.toString()}`);
    }, 1800); // 1.8 seconds for animation

    return () => clearTimeout(timer);
  }, [navigate, language]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#EFEBE6] to-[#F8F5F2] text-[#483434]">
      <div className="w-48 h-48">
        <lottie-player
            src="https://raw.githubusercontent.com/narang2022/coffee-fortune-assets-2025/main/loading-coffee-animation.json"
            background="transparent"
            speed="1"
            autoplay
        ></lottie-player>
      </div>
      <p className="mt-4 text-lg">{t('loadingMessage')}</p>
    </div>
  );
};

export default LoadingPage;
