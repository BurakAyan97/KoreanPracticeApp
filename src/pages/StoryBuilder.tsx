import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import type { GeneratedStory } from '../utils/types';
import { BilingualSentence } from '../components/typography/BilingualSentence';

const StoryBuilder = () => {
  const [stories, setStories] = useState<GeneratedStory[]>([]);
  const [level, setLevel] = useState<'A1' | 'A2'>('A1');
  const [selectedStory, setSelectedStory] = useState<GeneratedStory | null>(null);

  useEffect(() => {
    // Load pre-generated high-quality stories
    import('../content/stories/stories.json')
      .then(res => {
        setStories(res.default as GeneratedStory[]);
      })
      .catch(err => console.error("Could not load stories", err));
  }, []);

  const currentLevelStories = stories.filter(s => s.level === level);

  if (selectedStory) {
    return (
      <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button 
          className="btn mb-4" 
          onClick={() => setSelectedStory(null)}
          style={{ marginBottom: '2rem', background: 'var(--bg-surface)' }}
        >
          ← Hikayelere Dön
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="korean-text" style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
            {selectedStory.title.korean}
          </h2>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            {selectedStory.title.turkish}
          </h3>
        </div>

        <div>
          {selectedStory.sentences.map((sentence, idx) => (
            <BilingualSentence key={idx} sentence={sentence} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <BookOpen size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h1>Okuma Pratikleri</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Gerçek hayattan kısa hikayeler ve diyaloglar okuyarak çeviri pratiği yapın. 
          Kelimelerin üzerindeki okunuşları ve Türkçe karşılıklarını inceleyebilirsiniz.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className={`btn ${level === 'A1' ? 'primary-btn' : ''}`}
            onClick={() => setLevel('A1')}
            style={level !== 'A1' ? { background: 'var(--bg-surface)' } : {}}
          >
            A1 Seviye
          </button>
          <button 
            className={`btn ${level === 'A2' ? 'primary-btn' : ''}`}
            onClick={() => setLevel('A2')}
            style={level !== 'A2' ? { background: 'var(--bg-surface)' } : {}}
          >
            A2 Seviye
          </button>
        </div>
      </div>

      <div className="deck-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {currentLevelStories.map(story => (
          <div 
            key={story.id}
            className="deck-card"
            onClick={() => setSelectedStory(story)}
            style={{
              background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
              border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            <h3 className="korean-text" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>
              {story.title.korean}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              {story.title.turkish}
            </p>
          </div>
        ))}
        {currentLevelStories.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>Bu seviye için henüz hikaye bulunmuyor.</p>
        )}
      </div>
    </div>
  );
};

export default StoryBuilder;
