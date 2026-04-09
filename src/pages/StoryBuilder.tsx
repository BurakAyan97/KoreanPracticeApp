import { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import type { GeneratedStory } from '../utils/types';
import './StoryBuilder.css';

const StoryBuilder = () => {
  const [stories, setStories] = useState<GeneratedStory[]>([]);
  const [level, setLevel] = useState<'A1' | 'A2'>('A1');
  const [selectedStory, setSelectedStory] = useState<GeneratedStory | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    import('../content/stories/stories.json')
      .then(res => {
        setStories(res.default as GeneratedStory[]);
      })
      .catch(err => console.error("Could not load stories", err));
  }, []);

  const currentLevelStories = stories.filter(s => s.level === level);

  const handleSelectStory = (story: GeneratedStory) => {
    setSelectedStory(story);
    setShowTranslation(false);
  };

  // ─── STORY DETAIL VIEW ───
  if (selectedStory) {
    // 3 cümlede bir paragraf bölme mantığı
    const paragraphs = [];
    for (let i = 0; i < selectedStory.sentences.length; i += 3) {
      paragraphs.push(selectedStory.sentences.slice(i, i + 3));
    }

    return (
      <div className="page-container">
        <div className="story-detail">
          <button
            className="btn story-btn--back"
            onClick={() => setSelectedStory(null)}
          >
            <ChevronLeft size={18} />
            Hikayelere Dön
          </button>

          <div className="story-detail__header">
            <div className="story-detail__level-badge">{selectedStory.level}</div>
            <h2 className="story-detail__title korean-text">{selectedStory.title.korean}</h2>
            <p className="story-detail__subtitle">{selectedStory.title.turkish}</p>
          </div>

          <div className="story-content-box">
            {/* Korece Paragraflar */}
            <div className="story-text-section">
              {paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="story-paragraph korean-text">
                  {p.map(s => s.koreanSentence).join(' ')}
                </p>
              ))}
            </div>

            {/* Türkçe Paragraflar */}
            {showTranslation && (
              <div className="story-text-section story-text-section--turkish">
                {paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="story-paragraph">
                    {p.map(s => s.turkishSentence).join(' ')}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="story-actions">
            <button
              className={`btn story-btn--translate ${showTranslation ? 'story-btn--translate-active' : ''}`}
              onClick={() => setShowTranslation(prev => !prev)}
            >
              {showTranslation ? (
                <>
                  <EyeOff size={18} />
                  Türkçeyi Gizle
                </>
              ) : (
                <>
                  <Eye size={18} />
                  Türkçesini Göster
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }


  // ─── STORY LIST VIEW ───
  return (
    <div className="page-container">
      <div className="story-list">
        <div className="story-list__header">
          <BookOpen size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
          <h1>Okuma Pratikleri</h1>
          <p className="story-list__subtitle">
            Korece hikayeler okuyarak kelime ve dilbilgisi pratiği yapın.
            Her hikaye bir seviyeye özel konuları kapsar.
          </p>
        </div>

        {/* Level Tabs */}
        <div className="story-tabs">
          <button
            className={`btn story-tab ${level === 'A1' ? 'story-tab--active' : ''}`}
            onClick={() => setLevel('A1')}
          >
            A1 Seviye
          </button>
          <button
            className={`btn story-tab ${level === 'A2' ? 'story-tab--active' : ''}`}
            onClick={() => setLevel('A2')}
          >
            A2 Seviye
          </button>
        </div>

        {/* Story Cards */}
        <div className="story-grid">
          {currentLevelStories.map((story, idx) => (
            <div
              key={story.id}
              className="story-card"
              onClick={() => handleSelectStory(story)}
            >
              <div className="story-card__number">{idx + 1}</div>
              <div className="story-card__content">
                <h3 className="story-card__title korean-text">{story.title.korean}</h3>
                <p className="story-card__subtitle">{story.title.turkish}</p>
              </div>
              <div className="story-card__meta">
                <span className="story-card__word-count">
                  {story.sentences.length} cümle
                </span>
                <span className="story-card__arrow">→</span>
              </div>
            </div>
          ))}
          {currentLevelStories.length === 0 && (
            <p className="story-list__empty">Bu seviye için henüz hikaye bulunmuyor.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryBuilder;
