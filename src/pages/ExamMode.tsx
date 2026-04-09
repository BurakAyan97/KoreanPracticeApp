import { useState, useEffect } from 'react';
import { Trophy, Clock, BrainCog, Check, X, LogOut } from 'lucide-react';
import type { GrammarV2 } from '../utils/types';
import { generateExercises, type BlankExercise } from '../utils/exerciseGenerator';
import { useUser } from '../context/UserContext';

type ExamPhase = 'intro' | 'exam' | 'result';

const ExamMode = () => {
  const [a1Data, setA1Data] = useState<GrammarV2 | null>(null);
  const [a2Data, setA2Data] = useState<GrammarV2 | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2'>('A1');
  
  const [phase, setPhase] = useState<ExamPhase>('intro');
  const [questions, setQuestions] = useState<BlankExercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [score, setScore] = useState(0);

  const { addXP } = useUser();

  useEffect(() => {
    Promise.all([
      import('../content/grammar/a1.json'),
      import('../content/grammar/a2.json')
    ]).then(([a1Res, a2Res]) => {
      setA1Data(a1Res.default as GrammarV2);
      setA2Data(a2Res.default as GrammarV2);
    }).catch(err => console.error("Could not load grammar data for exam", err));
  }, []);

  // Timer logic
  useEffect(() => {
    let timer: number;
    if (phase === 'exam' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  const startExam = () => {
    const data = selectedLevel === 'A1' ? a1Data : a2Data;
    if (!data) return;

    // Pick 5 random lessons, and generate exercises
    const allLessons = [...data.lessons].sort(() => Math.random() - 0.5);
    const validLessons = allLessons.filter(l => l.examples.length > 0);
    
    let generated: BlankExercise[] = [];
    // Just blindly generate from multiple lessons until we have 20 or run out
    for (const lesson of validLessons) {
      const ex = generateExercises(lesson);
      generated = [...generated, ...ex];
      if (generated.length >= 20) break;
    }
    
    // Limit to 20 precisely and shuffle
    const finalQuestions = generated.slice(0, 20).sort(() => Math.random() - 0.5);

    setQuestions(finalQuestions);
    setAnswers({});
    setTimeLeft(10 * 60); // 10 min
    setScore(0);
    setPhase('exam');
  };

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const finishExam = () => {
    let calculatedScore = 0;
    questions.forEach(q => {
      const userAns = answers[q.id];
      const correctOpt = q.options.find(o => o.isCorrect);
      if (userAns === correctOpt?.id) calculatedScore++;
    });
    
    setScore(calculatedScore);
    setPhase('result');
    
    // Reward XP based on exam performance
    addXP(calculatedScore * 5);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- RENDERING --- //

  if (phase === 'intro') {
    return (
      <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <BrainCog size={64} style={{ color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
        <h1>Deneme Sınavı Merkezi</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Seviye sonu bilginizi 20 soruluk, 10 dakikalık zaman karşılaştırılmalı deneme sınavıyla test edin.
        </p>

        <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Sınav Seviyesi Seçin</h2>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <button 
              className={`btn ${selectedLevel === 'A1' ? 'primary-btn' : ''}`}
              onClick={() => setSelectedLevel('A1')}
              style={selectedLevel !== 'A1' ? { background: 'var(--bg-page)' } : {}}
            >
               A1 (Başlangıç)
            </button>
            <button 
              className={`btn ${selectedLevel === 'A2' ? 'primary-btn' : ''}`}
              onClick={() => setSelectedLevel('A2')}
              style={selectedLevel !== 'A2' ? { background: 'var(--bg-page)' } : {}}
            >
               A2 (Temel)
            </button>
          </div>

          <button className="btn primary-btn" onClick={startExam} style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }} disabled={!a1Data || !a2Data}>
            Sınavı Başlat 🚀
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "Sınavı tamamladın!";
    if (percentage >= 80) message = "Olağanüstü başarı! Bir sonraki seviyeye geçmeye hazırsın.";
    else if (percentage >= 50) message = "Fena değil, ama biraz daha pratik yapmanda fayda var.";
    else message = "Konu eksiklerin var. Lütfen kuralları tekrar gözden geçir.";

    return (
      <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="result-banner" style={{ textAlign: 'center', background: 'var(--bg-surface)', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '3rem' }}>
          <Trophy size={64} style={{ color: percentage >= 80 ? '#f1c40f' : 'var(--primary)', margin: '0 auto 1.5rem' }} />
          <h1 style={{ color: 'var(--primary-dark)' }}>{message}</h1>
          <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-main)', margin: '1rem 0' }}>
            {score} <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/ {questions.length}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
            Başarı oranı: <strong style={{ color: percentage >= 80 ? '#2ecc71' : (percentage < 50 ? '#e74c3c' : '#f39c12') }}>%{percentage}</strong>
          </p>
          <div style={{ marginTop: '1rem', color: '#ffd43b', fontWeight: 'bold' }}>
            +{score * 5} XP Kazanıldı!
          </div>
          
          <button className="btn primary-btn" onClick={() => setPhase('intro')} style={{ marginTop: '2rem' }}>
            Yeni Sınav Başlat
          </button>
        </div>

        <h3 style={{ marginBottom: '1.5rem' }}>Cevap Anahtarı ve Hatalar</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {questions.map((q, idx) => {
             const userAns = answers[q.id];
             const isCorrect = q.options.find(o => o.id === userAns)?.isCorrect;
             
             return (
               <div key={q.id} style={{ 
                 background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', 
                 borderLeft: `4px solid ${isCorrect ? '#2ecc71' : '#e74c3c'}`,
                 boxShadow: 'var(--shadow-sm)'
               }}>
                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                   <div style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>{idx + 1}.</div>
                   <div style={{ flex: 1 }}>
                     <div className="korean-text" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{q.fullSentence}</div>
                     <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{q.turkishTranslation}</div>
                     
                     {!isCorrect && (
                       <div style={{ color: '#e74c3c', fontSize: '0.9rem' }}>
                         Senin cevabın: <strong className="korean-text" style={{ textDecoration: 'line-through' }}>{q.options.find(o => o.id === userAns)?.text || 'Boş Bırakıldı'}</strong>
                       </div>
                     )}
                     <div style={{ color: '#27ae60', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                       Doğru cevap: <strong className="korean-text">{q.correctAnswer}</strong> <span>({q.correctAnswerHint})</span>
                     </div>
                   </div>
                   <div>{isCorrect ? <Check color="#2ecc71" /> : <X color="#e74c3c" />}</div>
                 </div>
               </div>
             )
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="exam-header-bar" style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--primary-dark)', color: 'white', borderRadius: 'var(--radius-md)', position: 'sticky', top: '1rem', zIndex: 100 }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Cevaplanan: {Object.keys(answers).length} / {questions.length}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: timeLeft < 60 ? '#ff6b6b' : 'white' }}>
          <Clock /> {formatTime(timeLeft)}
        </div>
        <button 
          className="btn" 
          onClick={finishExam} 
          style={{ background: 'white', color: 'var(--primary-dark)', fontWeight: 'bold' }}
        >
          Sınavı Bitir <LogOut size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gap: '2.5rem' }}>
        {questions.map((q, idx) => (
          <div key={q.id} style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ background: 'var(--primary-light)', padding: '0.5rem 1rem', borderRadius: '50%', fontWeight: 'bold' }}>{idx + 1}</span>
              <div style={{ flex: 1 }}>
                {/* Sentence with blank */}
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }} className="korean-text">
                  {q.sentenceWithBlank.split('_____').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span style={{ 
                          display: 'inline-block', minWidth: '80px', borderBottom: '3px solid var(--primary)', 
                          textAlign: 'center', padding: '0 0.5rem', color: 'var(--primary)', fontWeight: 'bold' 
                        }}>
                          {answers[q.id] ? q.options.find(o => o.id === answers[q.id])?.text : '?'}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>{q.turkishTranslation}</div>
              </div>
            </div>

            <div className="exam-options-grid">
              {q.options.map(opt => {
                const isSelected = answers[q.id] === opt.id;
                return (
                  <button 
                    key={opt.id}
                    onClick={() => handleSelectAnswer(q.id, opt.id)}
                    style={{ 
                      padding: '1rem', borderRadius: 'var(--radius-sm)', border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.1)'}`,
                      background: isSelected ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--bg-page)', cursor: 'pointer', textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                    className="korean-text"
                  >
                    <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{opt.text}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
        <button className="btn primary-btn" onClick={finishExam} style={{ fontSize: '1.3rem', padding: '1rem 4rem' }}>
          Sınavı Bitir ve Puanı Gör
        </button>
      </div>
    </div>
  );
};

export default ExamMode;
