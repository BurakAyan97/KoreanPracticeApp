import { Link, Outlet } from 'react-router-dom';
import { BookOpen, Languages, Sparkles, PencilLine, Mail, Home, Flame, Star, Mic, Trophy } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const Layout = () => {
  const { state } = useUser();

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🇰🇷</span>
            <h1>Korean Practice</h1>
          </Link>
          <div className="nav-stats" style={{ display: 'flex', gap: '15px', marginLeft: 'auto', marginRight: '20px' }}>
            <div title="Günlük Çalışma Serisi" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ff6b6b', fontWeight: 'bold' }}>
              <Flame size={20} />
              <span>{state.streak}</span>
            </div>
            <div title="Kazanılan Deneyim Puanı" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ffd43b', fontWeight: 'bold' }}>
              <Star size={20} />
              <span>{state.xp} XP</span>
            </div>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-item">
            <Home size={18} />
            <span className="nav-text">Ana Sayfa</span>
          </Link>
          <Link to="/grammar" className="nav-item">
            <BookOpen size={18} />
            <span className="nav-text">Gramer</span>
          </Link>
          <Link to="/flashcards" className="nav-item">
            <Languages size={18} />
            <span className="nav-text">Kartlar</span>
          </Link>
          <Link to="/story" className="nav-item">
            <Sparkles size={18} />
            <span className="nav-text">Hikaye</span>
          </Link>
          <Link to="/practice" className="nav-item">
            <PencilLine size={18} />
            <span className="nav-text">Pratik</span>
          </Link>
          <Link to="/voice" className="nav-item">
            <Mic size={18} />
            <span className="nav-text">Ses</span>
          </Link>
          <Link to="/exam" className="nav-item">
            <Trophy size={18} />
            <span className="nav-text">Sınav</span>
          </Link>
          <Link to="/contact" className="nav-item">
            <Mail size={18} />
            <span className="nav-text">İletişim</span>
          </Link>
        </div>
      </nav>
      
      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Korean Practice App for Turkish Learners.</p>
      </footer>
    </div>
  );
};
