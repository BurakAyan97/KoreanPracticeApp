import { Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>İletişim</h1>

      <div style={{ background: 'var(--bg-surface)', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginTop: '2rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Soru, görüş ve önerileriniz için benimle iletişime geçebilirsiniz. Projenin gelişimi için her türlü geri bildirime açığım!
        </p>

        <a href="mailto:burakayan97@outlook.com" className="btn primary-btn" style={{ width: '100%', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <Mail size={20} />
          Bana E-posta Gönder
        </a>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Sosyal Medya</h3>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <a href="https://www.instagram.com/aayanbey/" target="_blank" rel="noreferrer" style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', transition: 'all 0.2s', fontWeight: 'bold' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = '#fff' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
              Instagram
            </a>

            <a href="https://www.linkedin.com/in/burak-ayan-46a70b175/" target="_blank" rel="noreferrer" style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', transition: 'all 0.2s', fontWeight: 'bold' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = '#fff' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
              LinkedIn
            </a>

            <a href="https://github.com/BurakAyan97" target="_blank" rel="noreferrer" style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', transition: 'all 0.2s', fontWeight: 'bold' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = '#fff' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
