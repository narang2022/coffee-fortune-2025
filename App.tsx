import React from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import IntroPage from './pages/IntroPage';
import LoadingPage from './pages/LoadingPage';
import ResultPage from './pages/ResultPage';

/**
 * /loading 접근 가드:
 * - 인트로에서 정상적으로 navigate 했을 때만 허용한다.
 * - 주소창에 직접 #/loading 입력하거나 새로고침하면 인트로(/)로 돌려보낸다.
 */
function LoadingGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // IntroPage에서 넘긴 state가 없으면 비정상 접근으로 판단
    if (!location.state || (location.state as any).fromIntro !== true) {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  return <>{children}</>;
}

export default function App() {
  return (
    <LanguageProvider>
      <div className="w-full min-h-screen max-w-lg mx-auto bg-[#F8F5F2]">
        <HashRouter>
          <Routes>
            {/* 초기 화면: 인트로 */}
            <Route path="/" element={<IntroPage />} />

            {/* 로딩 화면: 가드로 보호 */}
            <Route
              path="/loading"
              element={
                <LoadingGuard>
                  <LoadingPage />
                </LoadingGuard>
              }
            />

            {/* 결과 화면: 공유/직접 접근 허용 */}
            <Route path="/result" element={<ResultPage />} />

            {/* 정의되지 않은 모든 경로는 인트로로 정규화 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </div>
    </LanguageProvider>
  );
}