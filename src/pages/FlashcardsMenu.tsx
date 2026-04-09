import { useState, useEffect, useMemo } from 'react';
import { BookMarked, Search, Loader2, X, Star, CalendarClock, Library} from 'lucide-react';
import { FlashcardDeck } from '../components/flashcards/FlashcardDeck';
import type { Flashcard } from '../utils/types';
import { translateWord } from '../utils/translation';
import { useUser } from '../context/UserContext';

interface DeckData {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
}

const FlashcardsMenu = () => {
  const [activeDeck, setActiveDeck] = useState<Flashcard[] | null>(null);
  const [decks, setDecks] = useState<DeckData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [externalResult, setExternalResult] = useState<Flashcard | null>(null);
  const { state } = useUser();
  const [activeTab, setActiveTab] = useState<'all' | 'dictionary' | 'srs'>('all');
  const [isSRSMode, setIsSRSMode] = useState(false);

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const [
          numbers, family, verbs, adjectives,
          greetings, timeDays, colors, house, food, jobs, shopping, transport, weather, health, hobbies
        ] = await Promise.all([
          import('../content/flashcards/numbers.json'),
          import('../content/flashcards/family.json'),
          import('../content/flashcards/verbs.json'),
          import('../content/flashcards/adjectives.json'),
          import('../content/flashcards/greeting_classroom.json'),
          import('../content/flashcards/time_days.json'),
          import('../content/flashcards/colors.json'),
          import('../content/flashcards/house_objects.json'),
          import('../content/flashcards/food_drink.json'),
          import('../content/flashcards/jobs.json'),
          import('../content/flashcards/shopping_clothing.json'),
          import('../content/flashcards/transportation.json'),
          import('../content/flashcards/weather_seasons.json'),
          import('../content/flashcards/health_body.json'),
          import('../content/flashcards/hobbies_leisure.json')
        ]);

        setDecks([
          { id: 'greetings', title: 'Selamlaşma & Sınıf', description: 'Günlük selamlaşmalar ve sınıf dili.', cards: greetings.default },
          { id: 'family', title: 'Aile Üyeleri', description: 'Aile ilişkilerini anlatan kelimeler.', cards: family.default },
          { id: 'numbers', title: 'Sayılar', description: 'Sino-Korean ve Native Korean sayıları.', cards: numbers.default },
          { id: 'time', title: 'Zaman & Günler', description: 'Bugün, dün, haftanın günleri ve saatler.', cards: timeDays.default },
          { id: 'verbs', title: 'Temel Fiiller', description: 'Günlük hayatta en sık kullanılan 100 fiil.', cards: verbs.default },
          { id: 'adjectives', title: 'Önemli Sıfatlar', description: 'Sık kullanılan 20 temel sıfat.', cards: adjectives.default },
          { id: 'colors', title: 'Renkler', description: 'Korece renk isimleri.', cards: colors.default },
          { id: 'house', title: 'Ev & Eşyalar', description: 'Evin bölümleri ve temel eşyalar.', cards: house.default },
          { id: 'food', title: 'Mutfak & Yemek', description: 'Temel yiyecekler, içecekler ve meyveler.', cards: food.default },
          { id: 'jobs', title: 'Meslekler', description: 'Sık karşılaşılan meslek grupları.', cards: jobs.default },
          { id: 'shopping', title: 'Alışveriş & Kıyafet', description: 'Mağaza içi terimler ve giysiler.', cards: shopping.default },
          { id: 'transport', title: 'Ulaşım & Yönler', description: 'Taşıtlar, istasyonlar ve yön tarifleri.', cards: transport.default },
          { id: 'weather', title: 'Hava & Mevsimler', description: 'Hava durumu ve mevsim terimleri.', cards: weather.default },
          { id: 'health', title: 'Vücut & Sağlık', description: 'Vücudun bölümleri ve temel hastalıklar.', cards: health.default },
          { id: 'hobbies', title: 'Hobi & Boş Zaman', description: 'Popüler hobiler ve sporlar.', cards: hobbies.default }
        ]);
      } catch (err) {
        console.error("Could not load flashcards", err);
      }
    };

    loadDecks();
  }, []);

  // Compute SRS Deck
  const srsReviewCards = useMemo(() => {
    const today = new Date().toISOString();
    const all = decks.flatMap(d => d.cards);
    return all.filter(c => {
      const srsStatus = state.srsDeck[c.id];
      if (!srsStatus) return true; // New words are due
      return srsStatus.nextReviewDate <= today;
    });
  }, [decks, state.srsDeck]);

  const dictionaryCards = state.myDictionary as Flashcard[]; // Cast correctly based on properties

  // Filter existing cards locally
  const allCards = useMemo(() => decks.flatMap(d => d.cards), [decks]);
  
  const localFiltered = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allCards.filter(c => 
      c.korean.toLowerCase().includes(query) || 
      c.turkish.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to top 10 matches
  }, [allCards, searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Clear previous external result
    setExternalResult(null);

    // If no local exact match, try API
    const exactMatch = localFiltered.find(c => 
      c.korean === searchQuery || c.turkish.toLowerCase() === searchQuery.toLowerCase()
    );

    if (!exactMatch) {
      setIsSearching(true);
      const result = await translateWord(searchQuery);
      setIsSearching(false);

      if (result) {
        setExternalResult({
          id: `ext-${Date.now()}`,
          korean: result.ko,
          turkish: result.tr,
          pronunciation: result.pronunciation,
          type: 'external'
        });
      }
    }
  };

  if (activeDeck) {
    return (
      <div className="page-container">
        <button 
          className="btn mb-4" 
          onClick={() => { setActiveDeck(null); setIsSRSMode(false); }}
          style={{ marginBottom: '2rem', background: 'var(--bg-surface)' }}
        >
          ← Setlere Dön
        </button>
        <FlashcardDeck 
          cards={activeDeck} 
          isSRSMode={isSRSMode}
          onComplete={() => { setActiveDeck(null); setIsSRSMode(false); }} 
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <BookMarked size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h1>Kelime Sistemim</h1>
        <p style={{ color: 'var(--text-muted)' }}>Öğrenmek istediğin kelime setini seç veya hemen ara.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'all' ? 'primary-btn' : ''}`}
          onClick={() => setActiveTab('all')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...(activeTab !== 'all' ? { background: 'var(--bg-surface)' } : {}) }}
        >
          <Library size={18} /> Tüm Setler
        </button>
        <button 
          className={`btn ${activeTab === 'srs' ? 'primary-btn' : ''}`}
          onClick={() => setActiveTab('srs')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...(activeTab !== 'srs' ? { background: 'var(--bg-surface)' } : {}) }}
        >
          <CalendarClock size={18} /> Günlük Tekrar ({srsReviewCards.length})
        </button>
        <button 
          className={`btn ${activeTab === 'dictionary' ? 'primary-btn' : ''}`}
          onClick={() => setActiveTab('dictionary')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...(activeTab !== 'dictionary' ? { background: 'var(--bg-surface)' } : {}) }}
        >
          <Star size={18} /> Sözlüğüm ({dictionaryCards.length})
        </button>
      </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text"
              placeholder="Kelime ara... (Korece veya Türkçe)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '1.2rem 1.5rem 1.2rem 3.5rem', borderRadius: '50px',
                border: '2px solid var(--primary-light)', background: 'var(--bg-surface)',
                fontSize: '1.1rem', boxShadow: 'var(--shadow-md)', outline: 'none'
              }}
            />
            <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
            {searchQuery && (
              <X 
                onClick={() => { setSearchQuery(''); setExternalResult(null); }}
                style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }} 
              />
            )}
          </div>
          <button type="submit" style={{ display: 'none' }}>Ara</button>
        </form>

      {/* Search Results Area */}
      {searchQuery && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary-dark)', paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary-light)' }}>
            Arama Sonuçları
          </h2>

          <div className="deck-grid grid-auto-fit" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {/* Local Results */}
            {localFiltered.map(card => (
              <div 
                key={card.id}
                style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(var(--primary-rgb), 0.1)' }}
              >
                <div className="korean-text" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary-dark)' }}>{card.korean}</div>
                {card.pronunciation && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{card.pronunciation}</div>}
                <div style={{ marginTop: '0.5rem', fontWeight: 500 }}>{card.turkish}</div>
              </div>
            ))}

            {/* API Result */}
            {externalResult && (
              <div 
                style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', border: '2px solid var(--secondary)', position: 'relative' }}
              >
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.7rem', background: 'var(--secondary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>ÇEVİRİ</div>
                <div className="korean-text" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--secondary)' }}>{externalResult.korean}</div>
                {externalResult.pronunciation && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{externalResult.pronunciation}</div>}
                <div style={{ marginTop: '0.5rem', fontWeight: 500 }}>{externalResult.turkish}</div>
              </div>
            )}

            {isSearching && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Loader2 className="animate-spin" /> API üzerinden çeviri aranıyor...
              </div>
            )}

            {!isSearching && localFiltered.length === 0 && !externalResult && searchQuery && (
              <div style={{ color: 'var(--text-muted)' }}>Eşleşen kelime bulunamadı. Enter'a basarak çevirmeyi deneyebilirsiniz.</div>
            )}
          </div>
        </div>
      )}

      {/* Original Decks Grid */}
      {!searchQuery && activeTab === 'all' && (
        <div className="deck-grid grid-auto-fit" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {decks.map((deck) => (
            <div 
              key={deck.id}
              className="deck-card" 
              onClick={() => { setActiveDeck(deck.cards); setIsSRSMode(false); }}
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
      )}

      {/* SRS Deck Grid */}
      {!searchQuery && activeTab === 'srs' && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
          {srsReviewCards.length > 0 ? (
            <>
              <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>Sıradaki Kartlar Bekliyor</h2>
              <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Bugün tekrar etmen gereken {srsReviewCards.length} kelime var.</p>
              <button 
                className="btn primary-btn" 
                style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
                onClick={() => { setActiveDeck(srsReviewCards); setIsSRSMode(true); }}
              >
                Çalışmaya Başla
              </button>
            </>
          ) : (
             <div style={{ color: 'var(--text-muted)' }}>Bugünlük tekrar edilecek kelime kalmadı! Harikasın! 🎉</div>
          )}
        </div>
      )}

      {/* Dictionary Deck Grid */}
      {!searchQuery && activeTab === 'dictionary' && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
          {dictionaryCards.length > 0 ? (
            <>
              <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>Sözlüğün Dolu</h2>
              <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Kaydettiğin {dictionaryCards.length} kelime var.</p>
              <button 
                className="btn primary-btn" 
                style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
                onClick={() => { setActiveDeck(dictionaryCards); setIsSRSMode(false); }}
              >
                Kelimelerimle Pratik Yap
              </button>
            </>
          ) : (
             <div style={{ color: 'var(--text-muted)' }}>Henüz hiç kelime kaydetmedin. Kartlardaki veya hikayelerdeki yıldız ikonlarına tıklayarak kelime ekleyebilirsin.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardsMenu;
