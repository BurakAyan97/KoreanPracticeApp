import { Link, Outlet } from 'react-router-dom';
import { BookOpen, Languages, Sparkles, PencilLine, Mail, Home } from 'lucide-react';

export const Layout = () => {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🇰🇷</span>
            <h1>Korean Practice</h1>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-item">
            <Home size={18} />
            <span>Ana Sayfa</span>
          </Link>
          <Link to="/grammar" className="nav-item">
            <BookOpen size={18} />
            <span>Gramer</span>
          </Link>
          <Link to="/flashcards" className="nav-item">
            <Languages size={18} />
            <span>Kelime Kartları</span>
          </Link>
          <Link to="/story" className="nav-item">
            <Sparkles size={18} />
            <span>Hikaye</span>
          </Link>
          <Link to="/practice" className="nav-item">
            <PencilLine size={18} />
            <span>Pratik</span>
          </Link>
          <Link to="/contact" className="nav-item">
            <Mail size={18} />
            <span>İletişim</span>
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
