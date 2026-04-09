import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { UserProvider } from './context/UserContext';

// Lazy load pages for performance
const Home = React.lazy(() => import('./pages/Home'));
const GrammarMenu = React.lazy(() => import('./pages/GrammarMenu'));
const FlashcardsMenu = React.lazy(() => import('./pages/FlashcardsMenu'));
const StoryBuilder = React.lazy(() => import('./pages/StoryBuilder'));
const Practice = React.lazy(() => import('./pages/Practice'));
const Contact = React.lazy(() => import('./pages/Contact'));
const VoicePractice = React.lazy(() => import('./pages/VoicePractice'));
const ExamMode = React.lazy(() => import('./pages/ExamMode'));

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="loading-spinner">Yükleniyor...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="grammar" element={<GrammarMenu />} />
              <Route path="flashcards" element={<FlashcardsMenu />} />
              <Route path="story" element={<StoryBuilder />} />
              <Route path="practice" element={<Practice />} />
              <Route path="voice" element={<VoicePractice />} />
              <Route path="exam" element={<ExamMode />} />
              <Route path="contact" element={<Contact />} />
              {/* Catch all route - 404 */}
              <Route path="*" element={<div className="not-found"><h2>404 - Sayfa Bulunamadı</h2><p>Aradığınız sayfa mevcut değil.</p></div>} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
