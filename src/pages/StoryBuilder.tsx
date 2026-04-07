import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { generateStory, type GeneratedStory } from '../utils/storyEngine';
import type { Flashcard, StoryTemplate } from '../utils/types';

const StoryBuilder = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [templates, setTemplates] = useState<StoryTemplate[]>([]);
  const [currentStory, setCurrentStory] = useState<GeneratedStory | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [level, setLevel] = useState<'A1' | 'A2'>('A1');

  useEffect(() => {
    // Load all data dynamically
    const loadAssets = async () => {
      try {
        const [
          fruits, numbers, family, positions, verbs, adjectives, places, base, templatesModule
        ] = await Promise.all([
          import('../content/flashcards/fruits.json'),
          import('../content/flashcards/numbers.json'),
          import('../content/flashcards/family.json'),
          import('../content/flashcards/positions.json'),
          import('../content/flashcards/verbs.json'),
          import('../content/flashcards/adjectives.json'),
          import('../content/flashcards/places.json'),
          import('../content/flashcards/base.json'),
          import('../content/story-templates/templates.json')
        ]);
        
        const allFlashcards = [
          ...(fruits.default as Flashcard[]),
          ...(numbers.default as Flashcard[]),
          ...(family.default as Flashcard[]),
          ...(positions.default as Flashcard[]),
          ...(verbs.default as Flashcard[]),
          ...(adjectives.default as Flashcard[]),
          ...(places.default as Flashcard[]),
          ...(base.default as Flashcard[])
        ];

        setFlashcards(allFlashcards);
        setTemplates(templatesModule.default as StoryTemplate[]);
      } catch (err) {
        console.error("Could not load story generation assets", err);
      }
    };
    
    loadAssets();
  }, []);

  const handleGenerate = () => {
    if (flashcards.length === 0 || templates.length === 0) return;
    const story = generateStory(level, templates, flashcards);
    setCurrentStory(story);
    setShowTranslation(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Sparkles size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h1>Okuma & Hikaye</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Öğrendiğin kelimelerle rastgele oluşturulmuş kısa hikayeler oku.</p>

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

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button 
          className="btn primary-btn" 
          onClick={handleGenerate}
          disabled={flashcards.length === 0}
        >
          <RefreshCw size={18} />
          {currentStory ? "Yeni Hikaye Oluştur" : "Hikaye Oluştur"}
        </button>
      </div>

      {currentStory && (
        <div style={{ 
          background: 'var(--bg-surface)', 
          padding: '3rem 2rem', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--primary-light)',
          animation: 'fadeIn 0.5s ease'
        }}>
          <div className="korean-text" style={{ fontSize: '1.8rem', lineHeight: '1.8', marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-dark)' }}>
            {currentStory.koreanText}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            {!showTranslation ? (
              <button 
                className="btn" 
                style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}
                onClick={() => setShowTranslation(true)}
              >
                Çeviriyi Göster
              </button>
            ) : (
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1.5rem', 
                background: 'var(--bg-surface-hover)', 
                borderRadius: 'var(--radius-sm)',
                fontSize: '1.1rem',
                color: 'var(--text-main)',
                borderLeft: '4px solid var(--primary)'
              }}>
                <span dangerouslySetInnerHTML={{ __html: currentStory.turkishText }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryBuilder;
