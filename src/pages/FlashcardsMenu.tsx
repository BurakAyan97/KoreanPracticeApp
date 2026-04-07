import { useState, useEffect } from 'react';
import { BookMarked } from 'lucide-react';
import { FlashcardDeck } from '../components/flashcards/FlashcardDeck';
import type { Flashcard } from '../utils/types';

interface DeckData {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
}

const FlashcardsMenu = () => {
  const [activeDeck, setActiveDeck] = useState<Flashcard[] | null>(null);
  const [decks, setDecks] = useState<DeckData[]>([]);

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const [fruits, numbers, family, positions, verbs, adjectives, places] = await Promise.all([
          import('../content/flashcards/fruits.json'),
          import('../content/flashcards/numbers.json'),
          import('../content/flashcards/family.json'),
          import('../content/flashcards/positions.json'),
          import('../content/flashcards/verbs.json'),
          import('../content/flashcards/adjectives.json'),
          import('../content/flashcards/places.json')
        ]);

        setDecks([
          { id: 'fruits', title: 'Meyveler', description: 'En çok kullanılan 20 meyve.', cards: fruits.default },
          { id: 'numbers', title: 'Sayılar', description: 'Sino-Korean ve Native Korean sayı sistemleri.', cards: numbers.default },
          { id: 'family', title: 'Aile Üyeleri', description: 'Aile ilişkilerini anlatan 20 kelime.', cards: family.default },
          { id: 'positions', title: 'Konum ve Yön', description: 'Cisim nerede? Konum bildiren kelimeler.', cards: positions.default },
          { id: 'verbs', title: 'Temel Fiiller', description: 'Günlük hayatta en sık kullanılan 100 fiil.', cards: verbs.default },
          { id: 'adjectives', title: 'Temel Sıfatlar', description: 'Sık kullanılan 20 sıfat.', cards: adjectives.default },
          { id: 'places', title: 'Mekanlar', description: 'Şehirdeki 20 temel mekan.', cards: places.default }
        ]);
      } catch (err) {
        console.error("Could not load flashcards", err);
      }
    };

    loadDecks();
  }, []);

  if (activeDeck) {
    return (
      <div className="page-container">
        <button 
          className="btn mb-4" 
          onClick={() => setActiveDeck(null)}
          style={{ marginBottom: '2rem', background: 'var(--bg-surface)' }}
        >
          ← Setlere Dön
        </button>
        <FlashcardDeck 
          cards={activeDeck} 
          onComplete={() => setActiveDeck(null)} 
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <BookMarked size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h1>Kelime Kartları</h1>
        <p style={{ color: 'var(--text-muted)' }}>Öğrenmek istediğin kelime setini seç.</p>
      </div>

      <div className="deck-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {decks.map((deck) => (
          <div 
            key={deck.id}
            className="deck-card" 
            onClick={() => setActiveDeck(deck.cards)}
            style={{
              background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            <h2>{deck.title}</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{deck.description}</p>
            <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
              {deck.cards.length} Kart
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardsMenu;
