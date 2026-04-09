import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import type { GrammarV2, LessonV2 } from '../utils/types';
import { BilingualSentence } from '../components/typography/BilingualSentence';
import { useUser } from '../context/UserContext';

const GrammarMenu = () => {
  const [activeLesson, setActiveLesson] = useState<LessonV2 | null>(null);
  const [a1Data, setA1Data] = useState<GrammarV2 | null>(null);
  const [a2Data, setA2Data] = useState<GrammarV2 | null>(null);
  const [activeTab, setActiveTab] = useState<'A1' | 'A2'>('A1');
  const { state, markLessonComplete, addXP } = useUser();

  useEffect(() => {
    // Dynamic import for grammar content
    Promise.all([
      import('../content/grammar/a1.json'),
      import('../content/grammar/a2.json')
    ])
    .then(([a1Res, a2Res]) => {
      setA1Data(a1Res.default as GrammarV2);
      setA2Data(a2Res.default as GrammarV2);
    })
    .catch(err => console.error("Could not load grammar data", err));
  }, []);

  const currentCurriculum = activeTab === 'A1' ? a1Data : a2Data;
  const lessons = currentCurriculum?.lessons || [];

  const handleLessonOpen = (lesson: LessonV2) => {
    setActiveLesson(lesson);
    if (!state.completedLessons.includes(lesson.id)) {
      markLessonComplete(lesson.id);
      addXP(10); // Reward for viewing a new lesson
    }
  };

  if (activeLesson) {
    return (
      <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button 
          className="btn mb-4" 
          onClick={() => setActiveLesson(null)}
          style={{ marginBottom: '2rem', background: 'var(--bg-surface)' }}
        >
          ← Konulara Dön
        </button>
        
        <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: 0 }}>{activeLesson.title}</h2>
            {state.completedLessons.includes(activeLesson.id) && (
              <span title="Tamamlandı" style={{ color: '#2ecc71', fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>✓</span>
            )}
          </div>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>{activeLesson.description}</p>
          
          <div style={{ background: 'rgba(var(--primary-rgb), 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
            <h4 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Öğretmen Notu:</h4>
            <p style={{ fontStyle: 'italic' }}>{activeLesson.teacherExplanation}</p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📌</span> Kurallar
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {activeLesson.rules.map((rule, idx) => (
                <div key={idx} style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>{rule.name}</div>
                  {rule.pattern && <div className="korean-text" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700 }}>{rule.pattern}</div>}
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{rule.explanation}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💡</span> Örnekler
            </h3>
            {activeLesson.examples.map((ex, idx) => (
              <BilingualSentence 
                key={idx} 
                example={ex} 
                palette={currentCurriculum?.uiGuide.suffixPalette}
              />
            ))}
          </div>

          {activeLesson.checkpoints && activeLesson.checkpoints.length > 0 && (
            <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px dashed var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>✅ Kontrol Listesi</h3>
              <ul style={{ paddingLeft: '1.2rem' }}>
                {activeLesson.checkpoints.map((cp, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{cp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <BookOpen size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h1>{currentCurriculum?.title || 'Gramer Dersleri'}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Seviyeye göre dilbilgisi konuları.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            className={`btn ${activeTab === 'A1' ? 'primary-btn' : ''}`}
            onClick={() => setActiveTab('A1')}
            style={activeTab !== 'A1' ? { background: 'var(--bg-surface)' } : {}}
          >
            A1 Seviye
          </button>
          <button 
            className={`btn ${activeTab === 'A2' ? 'primary-btn' : ''}`}
            onClick={() => setActiveTab('A2')}
            style={activeTab !== 'A2' ? { background: 'var(--bg-surface)' } : {}}
          >
            A2 Seviye
          </button>
        </div>
      </div>

      <div className="deck-grid grid-auto-fit" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {lessons.map((lesson) => {
          const isCompleted = state.completedLessons.includes(lesson.id);
          return (
            <div 
              key={lesson.id}
              className="deck-card" 
              onClick={() => handleLessonOpen(lesson)}
              style={{
                background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                border: isCompleted ? '1px solid #2ecc71' : '1px solid rgba(0,0,0,0.05)',
                position: 'relative'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>DERS {lesson.order}</div>
                {isCompleted && <span style={{ color: '#2ecc71', fontSize: '1.2rem' }}>✓</span>}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>{lesson.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {lesson.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GrammarMenu;
