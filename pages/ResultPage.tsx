import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FORTUNES, LUCKY_COLORS, LUCKY_PLACES, UI_TEXT } from '../constants';
import { FortuneData, Language } from '../types';
import { getTodayStats, incrementViewCount, recordFeedback } from '../services/firebaseService';
import { trackEvent } from '../services/analyticsService';
import MenuSlider from '../components/MenuSlider';
import Toast from '../components/Toast';
import LanguageToggle from '../components/LanguageToggle';

interface FortuneIndices {
    id: number;
    colorIndex: number;
    placeIndex: number;
    luckyNumber: number;
}

const ResultPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { language, t } = useLanguage();
    
    const [fortune, setFortune] = useState<FortuneData | null>(null);
    const [fortuneIndices, setFortuneIndices] = useState<FortuneIndices | null>(null);
    const [viewCount, setViewCount] = useState(0);
    const [feedbackSelection, setFeedbackSelection] = useState<'like' | 'dislike' | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const id = searchParams.get('id');
        const colorName = searchParams.get('color');
        const num = searchParams.get('num');
        const placeName = searchParams.get('place');
        
        if (id && colorName && num && placeName) {
            const fortuneId = parseInt(id, 10);
            
            let colorIndex = LUCKY_COLORS[Language.KO].findIndex(c => c.name === colorName);
            if (colorIndex === -1) {
                colorIndex = LUCKY_COLORS[Language.EN].findIndex(c => c.name === colorName);
            }
            
            let placeIndex = LUCKY_PLACES[Language.KO].findIndex(p => p === placeName);
            if (placeIndex === -1) {
                placeIndex = LUCKY_PLACES[Language.EN].findIndex(p => p === placeName);
            }

            if (colorIndex !== -1 && placeIndex !== -1) {
                setFortuneIndices({
                    id: fortuneId,
                    colorIndex,
                    placeIndex,
                    luckyNumber: parseInt(num, 10),
                });
                incrementViewCount();
            } else {
                navigate('/');
            }
        } else {
            navigate('/');
        }
        
        getTodayStats().then(stats => {
            setViewCount(stats.views);
        });
    }, [searchParams, navigate]);

    useEffect(() => {
        if (fortuneIndices) {
            const { id, colorIndex, placeIndex, luckyNumber } = fortuneIndices;
            const luckyColorData = LUCKY_COLORS[language][colorIndex];
            const luckyPlace = LUCKY_PLACES[language][placeIndex];
            const utmSource = searchParams.get('utm_source');

            setFortune({
                id,
                text: FORTUNES[language][id],
                luckyColor: luckyColorData.name,
                luckyColorHex: luckyColorData.hex,
                luckyNumber,
                luckyPlace,
            });
            trackEvent('fortune_view', {
                fortune_id: id,
                lucky_color: luckyColorData.name,
                lucky_number: luckyNumber,
                lucky_place: luckyPlace,
                ...(utmSource && { utm_source: utmSource }),
            });
        }
    }, [fortuneIndices, language, searchParams]);
    
    const showToastWithMessage = (messageKey: keyof typeof UI_TEXT) => {
        setToastMessage(t(messageKey));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleFeedback = (type: 'like' | 'dislike') => {
        if (feedbackSelection) return;
        setFeedbackSelection(type);
        recordFeedback(type);

        const utmSource = searchParams.get('utm_source');
        trackEvent('feedback_click', {
            type,
            fortune_id: fortune?.id,
            ...(utmSource && { utm_source: utmSource }),
        });
        showToastWithMessage('feedbackToast');
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            trackEvent('share', { url });
            showToastWithMessage('shareToast');
        });
    };
    
    const handleRetry = () => {
        trackEvent('retry_fortune');
        navigate('/');
    };

    if (!fortune) {
        return null; // Or a loading spinner
    }

    return (
        <div className="p-6 pb-24 bg-[#F8F5F2] min-h-screen">
            <LanguageToggle />
            <header className="text-center my-8">
                <h1 className="text-2xl font-bold text-[#483434]">{t('todaysFortune')}</h1>
            </header>

            <main>
                <section className="bg-white p-6 rounded-2xl shadow-lg text-center mb-8">
                    <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">{fortune.text}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-[#6B4F4F] mb-4 text-center">{t('luckyItems')}</h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <span className="text-sm text-gray-500 block">{t('luckyColor')}</span>
                            <div className="flex items-center justify-center mt-2">
                                <div className="w-5 h-5 rounded-full mr-2 border border-gray-200" style={{ backgroundColor: fortune.luckyColorHex }}></div>
                                <span className="font-bold text-[#483434]">{fortune.luckyColor}</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <span className="text-sm text-gray-500 block">{t('luckyNumber')}</span>
                            <span className="font-bold text-2xl text-[#483434] mt-1 block">{fortune.luckyNumber}</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <span className="text-sm text-gray-500 block">{t('luckyPlace')}</span>
                            <span className="font-bold text-md text-[#483434] mt-2 block">{fortune.luckyPlace}</span>
                        </div>
                    </div>
                </section>

                <section className="text-center mb-8">
                    <p className="text-gray-600 mb-3">{t('feedbackPrompt')}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => handleFeedback('like')}
                            disabled={!!feedbackSelection}
                            className={`text-3xl transition-all duration-300 ${
                                !feedbackSelection ? 'hover:scale-110' : ''
                            } ${
                                feedbackSelection === 'like' ? 'scale-110' : ''
                            } ${
                                feedbackSelection && feedbackSelection !== 'like' ? 'opacity-50 scale-90' : ''
                            }`}
                        >
                            👍
                        </button>
                        <button
                            onClick={() => handleFeedback('dislike')}
                            disabled={!!feedbackSelection}
                            className={`text-3xl transition-all duration-300 ${
                                !feedbackSelection ? 'hover:scale-110' : ''
                            } ${
                                feedbackSelection === 'dislike' ? 'scale-110' : ''
                            } ${
                                feedbackSelection && feedbackSelection !== 'dislike' ? 'opacity-50 scale-90' : ''
                            }`}
                        >
                            👎
                        </button>
                    </div>
                </section>

                <div className="border-t border-gray-200 my-8"></div>
                
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-[#6B4F4F] mb-4 text-center">{t('newMenu')}</h2>
                    <MenuSlider />
                </section>

                <section className="flex justify-center gap-4 mt-8">
                    <button onClick={handleShare} className="bg-[#A0847E] text-white px-6 py-2 rounded-full font-semibold shadow-md transition-transform hover:scale-105">{t('shareButton')}</button>
                    <button onClick={handleRetry} className="bg-[#6B4F4F] text-white px-6 py-2 rounded-full font-semibold shadow-md transition-transform hover:scale-105">{t('retryButton')}</button>
                </section>
            </main>

            <footer className="text-center text-gray-500 mt-12 text-sm">
                 <p className="mb-2">{t('viewCount').replace('{count}', viewCount.toLocaleString())}</p>
                 <p className="font-semibold">{t('cafeInfo')}</p>
                 <p>{t('cafeAddress')}</p>
            </footer>

            <Toast message={toastMessage} show={showToast} />
        </div>
    );
};

export default ResultPage;