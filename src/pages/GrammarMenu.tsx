import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import type { GrammarConcept } from '../utils/types';
import { BilingualSentence } from '../components/typography/BilingualSentence';

const GrammarMenu = () => {
  const [activeLesson, setActiveLesson] = useState<GrammarConcept | null>(null);
  const [a1Data, setA1Data] = useState<GrammarConcept[]>([]);
  const [a2Data, setA2Data] = useState<GrammarConcept[]>([]);
  const [activeTab, setActiveTab] = useState<'A1' | 'A2'>('A1');

  useEffect(() => {
    // Dynamic import for grammar content
    Promise.all([
      import('../content/grammar/a1.json'),
      import('../content/grammar/a2.json')
    ])
    .then(([a1Res, a2Res]) => {
      setA1Data(a1Res.default as GrammarConcept[]);
      setA2Data(a2Res.default as GrammarConcept[]);
    })
    .catch(err => console.error("Could not load grammar data", err));
  }, []);

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
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>{activeLesson.title}</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>{activeLesson.description}</p>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📌</span> Kurallar
            </h3>
            <ul style={{ listStyle: 'none', paddingLeft: '1rem', borderLeft: '3px solid var(--primary-light)' }}>
              {activeLesson.rules.map((rule, idx) => (
                <li key={idx} style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600 }}>{rule.condition}:</span> 
                  <span className="korean-text" style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', fontWeight: 700, color: 'var(--highlight-particle)' }}>
                    {rule.suffix}
                  </span>
                  {rule.explanation && <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9em' }}>({rule.explanation})</span>}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💡</span> Örnekler
            </h3>
            {activeLesson.examples.map((ex, idx) => (
              <BilingualSentence key={idx} koreanParts={ex.koreanParts} turkish={ex.turkish} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentData = activeTab === 'A1' ? a1Data : a2Data;

  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <BookOpen size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h1>Gramer Dersleri</h1>
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

      <div>
        <div className="deck-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {currentData.map((concept) => (
            <div 
              key={concept.id}
              className="deck-card" 
              onClick={() => setActiveLesson(concept)}
              style={{
                background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>{concept.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {concept.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrammarMenu;
