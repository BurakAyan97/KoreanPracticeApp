import { Link } from 'react-router-dom';
import { BookOpen, Languages, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1 className="hero-title">Korece Öğrenimi Artık Daha Kolay</h1>
        <p className="hero-subtitle">
          Türkçe konuşan öğrencilere özel hazırlanmış pratik ve eğlenceli Korece eğitim platformu.
        </p>
      </header>

      <section className="features-grid">
        <Link to="/grammar" className="feature-card grammar-card">
          <BookOpen className="feature-icon" size={32} />
          <h2>Gramer</h2>
          <p>A1 ve A2 seviyelerinde temel dilbilgisini renklerle ve Türkçe uyumlu açıklamalarla keşfet.</p>
        </Link>
        
        <Link to="/flashcards" className="feature-card flashcards-card">
          <Languages className="feature-icon" size={32} />
          <h2>Kelime Kartları</h2>
          <p>Sayılar, güncel kelimeler ve kategorik setlerle kelime hazneni hızla geliştir.</p>
        </Link>

        <Link to="/story" className="feature-card story-card">
          <Sparkles className="feature-icon" size={32} />
          <h2>Okuma & Hikaye</h2>
          <p>Öğrendiğin kelime ve gramerlerle dinamik olarak oluşturulan hikayeler oku.</p>
        </Link>
      </section>
    </div>
  );
};

export default Home;
