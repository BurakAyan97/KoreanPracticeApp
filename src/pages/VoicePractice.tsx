import { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, ArrowRight, RefreshCw, Check, X, Speech } from 'lucide-react';
import type { GrammarV2 } from '../utils/types';

// Declare standard Window Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Mode = 'speaking' | 'listening';

const VoicePractice = () => {
  const [a1Data, setA1Data] = useState<GrammarV2 | null>(null);
  const [currentSentence, setCurrentSentence] = useState<{ko: string, tr: string, hint?: string} | null>(null);
  const [mode, setMode] = useState<Mode>('speaking');
  
  // Speaking State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  
  // Listening State
  const [userInput, setUserInput] = useState('');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    import('../content/grammar/a1.json').then(res => {
      setA1Data(res.default as GrammarV2);
      pickRandomSentence(res.default as GrammarV2);
    }).catch(err => console.error(err));

    // Warm up speech synthesis voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.getVoices();
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        checkPronunciation(text);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const getSimilarity = (s1: string, s2: string): number => {
    const normalize = (s: string) => s.replace(/[\s\.\,\?\!]/g, '').toLowerCase();
    const a = normalize(s1);
    const b = normalize(s2);
    if (a.length === 0) return b.length === 0 ? 100 : 0;
    if (b.length === 0) return 0;
    
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j += 1) {
      for (let i = 1; i <= a.length; i += 1) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i] + 1, // deletion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    const distance = matrix[b.length][a.length];
    const maxLen = Math.max(a.length, b.length);
    return Math.round((1 - distance / maxLen) * 100);
  };

  const pickRandomSentence = (data: GrammarV2) => {
    if (!data) return;
    const allExamples = data.lessons.flatMap(l => l.examples);
    const randomEx = allExamples[Math.floor(Math.random() * allExamples.length)];
    if (!randomEx) return;
    
    // Build full korean text from pairs
    setCurrentSentence({
      ko: randomEx.koText,
      tr: randomEx.trText,
      hint: randomEx.pairs[0]?.ko
    });
    
    setFeedback(null);
    setSimilarityScore(null);
    setTranscript('');
    setUserInput('');
    setIsListening(false);
  };

  const nextSentence = () => {
    if (a1Data) pickRandomSentence(a1Data);
  };

  // --- SPEAKING LOGIC ---
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Tarayıcınız ses tanıma özelliğini desteklemiyor. Lütfen Chrome kullanın.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setFeedback(null);
      setSimilarityScore(null);
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Microphone start error:", err);
        alert("Mikrofon başlatılamadı. Sayfayı yenileyip tekrar deneyin.");
      }
    }
  };

  const checkPronunciation = (spokenText: string) => {
    if (!currentSentence) return;
    
    const sim = getSimilarity(currentSentence.ko, spokenText);
    setSimilarityScore(sim);
    
    if (sim >= 75) {
      setFeedback('success'); 
    } else {
      setFeedback('error');
    }
  };

  // --- LISTENING LOGIC ---
  const playAudio = () => {
    if (!currentSentence) return;
    if ('speechSynthesis' in window) {
      // Chrome sometimes loses voices if getVoices is not called frequently
      let voices = window.speechSynthesis.getVoices();
      
      const utterance = new SpeechSynthesisUtterance(currentSentence.ko);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8; // slightly slower for dictation
      
      // Try to force a Korean voice if available
      const krVoice = voices.find(v => v.lang.includes('ko') || v.lang.includes('KO'));
      if (krVoice) {
        utterance.voice = krVoice;
      }
      
      window.speechSynthesis.cancel(); // Stop any pending speech
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkListening = () => {
    if (!currentSentence) return;
    
    const sim = getSimilarity(currentSentence.ko, userInput);
    setSimilarityScore(sim);
    
    if (sim >= 85) { // Stricter checking for dictation
      setFeedback('success');
    } else {
      setFeedback('error');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Speech size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h1>Sesli Pratik</h1>
        <p style={{ color: 'var(--text-muted)' }}>Telaffuzunu geliştir veya dinlediğini anlama pratiği yap.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <button 
          className={`btn ${mode === 'speaking' ? 'primary-btn' : ''}`}
          onClick={() => { setMode('speaking'); setFeedback(null); }}
          style={mode !== 'speaking' ? { background: 'var(--bg-surface)' } : {}}
        >
          <Mic size={18} /> Söyleyiş (Speaking)
        </button>
        <button 
          className={`btn ${mode === 'listening' ? 'primary-btn' : ''}`}
          onClick={() => { setMode('listening'); setFeedback(null); }}
          style={mode !== 'listening' ? { background: 'var(--bg-surface)' } : {}}
        >
          <Volume2 size={18} /> Dinleme (Dictation)
        </button>
      </div>

      {!currentSentence ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Yükleniyor...</div>
      ) : (
        <div style={{ background: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          
          {/* ----- SPEAKING MODE ----- */}
          {mode === 'speaking' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Aşağıdaki Cümleyi Oku
              </div>
              <h2 className="korean-text" style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', marginBottom: '1rem', lineHeight: 1.4 }}>
                {currentSentence.ko}
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                {currentSentence.tr}
              </p>

              <button 
                onClick={toggleRecording}
                style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: isListening ? '#ff6b6b' : 'var(--primary)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto', boxShadow: isListening ? '0 0 20px rgba(255, 107, 107, 0.6)' : '0 4px 15px rgba(var(--primary-rgb), 0.4)',
                  transition: 'all 0.3s', animation: isListening ? 'pulse 1.5s infinite' : 'none'
                }}
              >
                <Mic size={32} />
              </button>
              <div style={{ marginTop: '1rem', color: isListening ? '#ff6b6b' : 'var(--text-muted)', minHeight: '1.5rem' }}>
                {isListening ? 'Dinleniyor... (Konuşmaya başlayın)' : 'Mikrofona tıklayıp konuşun'}
              </div>

              {transcript && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-page)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SENİN SÖYLEDİĞİN:</div>
                  <div className="korean-text" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{transcript}</div>
                </div>
              )}
            </div>
          )}

          {/* ----- LISTENING MODE ----- */}
          {mode === 'listening' && (
            <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Duyduğunu Yaz
              </div>
              
              <button 
                onClick={playAudio}
                style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'var(--secondary)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 2rem', boxShadow: '0 4px 15px rgba(var(--secondary-rgb), 0.4)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Volume2 size={32} />
              </button>

              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Korece yaz..."
                className="korean-text"
                style={{
                  width: '100%', padding: '1rem', fontSize: '1.3rem', borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--primary-light)', outline: 'none', marginBottom: '1rem',
                  textAlign: 'center'
                }}
              />
              
              {feedback === null && (
                <button className="btn primary-btn" onClick={checkListening} style={{ width: '100%' }}>
                  Kontrol Et
                </button>
              )}
            </div>
          )}

          {/* FEEDBACK (Common) */}
          {feedback && (
            <div style={{ 
              marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-sm)',
              background: feedback === 'success' ? '#e8f8f5' : '#fff0f0',
              color: feedback === 'success' ? '#27ae60' : '#e74c3c',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
                {feedback === 'success' ? <Check size={20} /> : <X size={20} />}
                {feedback === 'success' ? 'Harika! Doğru bildin.' : 'Maalesef yanlış.'}
                {similarityScore !== null && (
                  <span style={{ 
                    background: feedback === 'success' ? '#2ecc71' : '#e74c3c', 
                    color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', marginLeft: '0.5rem'
                  }}>
                    %{similarityScore} Eşleşme
                  </span>
                )}
              </div>
              {feedback === 'error' && (
                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#e74c3c', opacity: 0.8 }}>Doğrusu:</div>
                  <div className="korean-text" style={{ fontSize: '1.2rem', fontWeight: 600 }}>{currentSentence.ko}</div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
             <button className="btn" onClick={nextSentence} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-page)' }}>
               {feedback === 'success' ? <ArrowRight size={18} /> : <RefreshCw size={18} />}
               {feedback === 'success' ? 'Sonraki Cümle' : 'Geç (Başka Cümle)'}
             </button>
          </div>

        </div>
      )}

      {/* Basic Keyframes for Mic Pulse inside this component for simplicity */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(255, 107, 107, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
        }
      `}</style>
    </div>
  );
};

export default VoicePractice;
