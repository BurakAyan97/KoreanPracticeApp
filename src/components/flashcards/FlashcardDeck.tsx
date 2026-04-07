import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { Flashcard } from '../../utils/types';

interface FlashcardDeckProps {
  cards: Flashcard[];
  onComplete: () => void;
}

export const FlashcardDeck = ({ cards, onComplete }: FlashcardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards] = useState<Flashcard[]>(() => 
    [...cards].sort(() => Math.random() - 0.5)
  );

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  if (shuffledCards.length === 0) return <div>Yükleniyor...</div>;

  const currentCard = shuffledCards[currentIndex];

  return (
    <div className="flashcard-deck">
      <div className="deck-progress">
        <span>{currentIndex + 1} / {shuffledCards.length}</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card-scene">
        <div 
          className={`card-container ${isFlipped ? 'is-flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="card-face card-front">
            <h2 className="korean-text">{currentCard.korean}</h2>
            <p className="card-hint">Çevirmek için dokun</p>
          </div>
          <div className="card-face card-back">
            <h2>{currentCard.turkish}</h2>
            {currentCard.pronunciation && (
              <p className="pronunciation">[{currentCard.pronunciation}]</p>
            )}
            <span className="card-type">{currentCard.type}</span>
          </div>
        </div>
      </div>

      <div className="deck-controls">
        <button 
          className="btn control-btn" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="btn control-btn" 
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RotateCcw size={24} />
        </button>
        <button 
          className="btn primary-btn control-btn" 
          onClick={handleNext}
        >
          {currentIndex === shuffledCards.length - 1 ? 'Bitir' : <ChevronRight size={24} />}
        </button>
      </div>

      <style>{`
        .flashcard-deck {
          max-width: 500px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .deck-progress {
          text-align: center;
          font-weight: 500;
          color: var(--text-muted);
        }
        .progress-bar {
          height: 6px;
          background: rgba(0,0,0,0.05);
          border-radius: 4px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        
        .card-scene {
          perspective: 1000px;
          height: 300px;
          width: 100%;
        }
        .card-container {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          cursor: pointer;
        }
        .card-container.is-flipped {
          transform: rotateY(180deg);
        }
        
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          background: var(--bg-surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .card-front h2 {
          font-size: 4rem;
          margin: 0;
          color: var(--primary-dark);
        }
        
        .card-back {
          transform: rotateY(180deg);
          border-color: var(--primary-light);
        }
        .card-back h2 {
          font-size: 2rem;
          margin: 0 0 0.5rem;
        }
        .pronunciation {
          font-family: monospace;
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        .card-type {
          position: absolute;
          bottom: 1rem;
          font-size: 0.8rem;
          background: rgba(0,0,0,0.05);
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          text-transform: uppercase;
        }
        
        .card-hint {
          position: absolute;
          bottom: 1rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          opacity: 0.7;
        }
        
        .deck-controls {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        .control-btn {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 1rem;
        }
        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
