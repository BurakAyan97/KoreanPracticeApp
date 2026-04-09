import './Practice.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { PencilLine, RotateCcw, ChevronRight, Check, X, Sparkles, Trophy } from 'lucide-react';
import type { GrammarV2, LessonV2 } from '../utils/types';
import { generateExercises, type BlankExercise } from '../utils/exerciseGenerator';

type Phase = 'select' | 'exercise' | 'result';

const Practice = () => {
  const [a1Data, setA1Data] = useState<GrammarV2 | null>(null);
  const [a2Data, setA2Data] = useState<GrammarV2 | null>(null);
  const [activeTab, setActiveTab] = useState<'A1' | 'A2'>('A1');
  const [selectedLesson, setSelectedLesson] = useState<LessonV2 | null>(null);
  const [exercises, setExercises] = useState<BlankExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>('select');
  const [draggedOption, setDraggedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const blankRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    Promise.all([
      import('../content/grammar/a1.json'),
      import('../content/grammar/a2.json'),
    ])
      .then(([a1Res, a2Res]) => {
        setA1Data(a1Res.default as GrammarV2);
        setA2Data(a2Res.default as GrammarV2);
      })
      .catch(err => console.error('Could not load grammar data', err));
  }, []);

  const currentCurriculum = activeTab === 'A1' ? a1Data : a2Data;
  const lessons = currentCurriculum?.lessons || [];

  const handleStartExercise = useCallback((lesson: LessonV2) => {
    setSelectedLesson(lesson);
    const generated = generateExercises(lesson);
    setExercises(generated);
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setShowResult(null);
    setPhase('exercise');
  }, []);

  const handleRegenerateExercises = useCallback(() => {
    if (!selectedLesson) return;
    const generated = generateExercises(selectedLesson);
    setExercises(generated);
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setShowResult(null);
  }, [selectedLesson]);

  const currentExercise = exercises[currentIndex];

  const handleOptionSelect = useCallback(
    (optionId: string) => {
      if (!currentExercise || answers[currentExercise.id]) return;

      const selected = currentExercise.options.find(o => o.id === optionId);
      if (!selected) return;

      setAnswers(prev => ({ ...prev, [currentExercise.id]: optionId }));

      if (selected.isCorrect) {
        setShowResult('correct');
        setScore(prev => prev + 1);
      } else {
        setShowResult('wrong');
      }

      // Auto-advance after delay
      setTimeout(() => {
        setShowResult(null);
        if (currentIndex < exercises.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setPhase('result');
        }
      }, 1500);
    },
    [currentExercise, answers, currentIndex, exercises.length],
  );

  // Drag & Drop handlers
  const handleDragStart = (optionId: string) => {
    setDraggedOption(optionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (blankRef.current) {
      blankRef.current.classList.add('practice-blank--drag-over');
    }
  };

  const handleDragLeave = () => {
    if (blankRef.current) {
      blankRef.current.classList.remove('practice-blank--drag-over');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (blankRef.current) {
      blankRef.current.classList.remove('practice-blank--drag-over');
    }
    if (draggedOption) {
      handleOptionSelect(draggedOption);
      setDraggedOption(null);
    }
  };

  const handleBackToSelect = () => {
    setPhase('select');
    setSelectedLesson(null);
    setExercises([]);
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setShowResult(null);
  };

  // ─── RESULT PHASE ───
  if (phase === 'result') {
    const percentage = Math.round((score / exercises.length) * 100);
    let emoji = '😊';
    let message = 'İyi iş çıkardın!';
    if (percentage === 100) {
      emoji = '🏆';
      message = 'Mükemmel! Hepsini doğru bildin!';
    } else if (percentage >= 80) {
      emoji = '🌟';
      message = 'Harika! Çok iyi gidiyorsun!';
    } else if (percentage >= 60) {
      emoji = '💪';
      message = 'Fena değil, biraz daha pratikle olacak!';
    } else {
      emoji = '📚';
      message = 'Biraz daha çalışmaya ihtiyacın var, tekrar dene!';
    }

    return (
      <div className="page-container">
        <div className="practice-result">
          <div className="practice-result__emoji">{emoji}</div>
          <h2 className="practice-result__title">{message}</h2>
          <div className="practice-result__score">
            <Trophy size={24} />
            <span>
              {score} / {exercises.length} doğru ({percentage}%)
            </span>
          </div>

          <div className="practice-result__review">
            {exercises.map((ex, idx) => {
              const answerId = answers[ex.id];
              const selectedOption = ex.options.find(o => o.id === answerId);
              const isCorrect = selectedOption?.isCorrect ?? false;

              return (
                <div
                  key={ex.id}
                  className={`practice-review-card ${isCorrect ? 'practice-review-card--correct' : 'practice-review-card--wrong'}`}
                >
                  <div className="practice-review-card__header">
                    <span className="practice-review-card__number">{idx + 1}</span>
                    {isCorrect ? (
                      <Check size={18} className="practice-review-card__icon--correct" />
                    ) : (
                      <X size={18} className="practice-review-card__icon--wrong" />
                    )}
                  </div>
                  <p className="korean-text practice-review-card__sentence">{ex.fullSentence}</p>
                  <p className="practice-review-card__translation">{ex.turkishTranslation}</p>
                  {!isCorrect && (
                    <p className="practice-review-card__correct-answer">
                      Doğru cevap: <strong className="korean-text">{ex.correctAnswer}</strong>{' '}
                      <span>({ex.correctAnswerHint})</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="practice-result__actions">
            <button className="btn practice-btn--secondary" onClick={handleRegenerateExercises} onClickCapture={() => setPhase('exercise')}>
              <RotateCcw size={18} />
              Yeni Sorular Üret
            </button>
            <button className="btn practice-btn--primary" onClick={handleBackToSelect}>
              Konulara Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── EXERCISE PHASE ───
  if (phase === 'exercise' && currentExercise) {
    const answeredId = answers[currentExercise.id];
    const isAnswered = Boolean(answeredId);

    // Render sentence with blank replaced by answer or blank slot
    const renderSentence = () => {
      const parts = currentExercise.sentenceWithBlank.split('_____');
      return (
        <span className="practice-sentence__text korean-text">
          {parts[0]}
          <span
            ref={blankRef}
            className={`practice-blank ${
              isAnswered
                ? showResult === 'correct'
                  ? 'practice-blank--correct'
                  : 'practice-blank--wrong'
                : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isAnswered ? (
              <span className="practice-blank__filled">
                {currentExercise.options.find(o => o.id === answeredId)?.text}
              </span>
            ) : (
              <span className="practice-blank__placeholder">?</span>
            )}
          </span>
          {parts[1]}
        </span>
      );
    };

    return (
      <div className="page-container">
        <div className="practice-exercise">
          {/* Header */}
          <div className="practice-exercise__header">
            <button className="btn practice-btn--ghost" onClick={handleBackToSelect}>
              ← Konulara Dön
            </button>
            <div className="practice-exercise__progress">
              <div className="practice-progress-bar">
                <div
                  className="practice-progress-bar__fill"
                  style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
                />
              </div>
              <span className="practice-exercise__counter">
                {currentIndex + 1} / {exercises.length}
              </span>
            </div>
          </div>

          {/* Lesson Title */}
          <div className="practice-exercise__lesson-tag">
            <Sparkles size={14} />
            <span>{selectedLesson?.title}</span>
          </div>

          {/* Sentence Card */}
          <div className="practice-sentence-card">
            <div className="practice-sentence-card__badge">
              {currentExercise.blankType === 'suffix' ? '📎 Ek Çalışması' : '📝 Kelime Çalışması'}
            </div>
            <div className="practice-sentence">{renderSentence()}</div>
            <p className="practice-sentence__translation">{currentExercise.turkishTranslation}</p>
          </div>

          {/* Feedback Animation */}
          {showResult && (
            <div className={`practice-feedback practice-feedback--${showResult}`}>
              {showResult === 'correct' ? (
                <>
                  <Check size={20} /> Doğru!
                </>
              ) : (
                <>
                  <X size={20} /> Yanlış! Doğrusu:{' '}
                  <strong className="korean-text">{currentExercise.correctAnswer}</strong>
                </>
              )}
            </div>
          )}

          {/* Options */}
          <div className="practice-options">
            {currentExercise.options.map(opt => {
              let optionClass = 'practice-option';
              if (isAnswered) {
                if (opt.isCorrect) {
                  optionClass += ' practice-option--correct';
                } else if (opt.id === answeredId) {
                  optionClass += ' practice-option--wrong';
                } else {
                  optionClass += ' practice-option--disabled';
                }
              }

              return (
                <button
                  key={opt.id}
                  className={optionClass}
                  draggable={!isAnswered}
                  onDragStart={() => handleDragStart(opt.id)}
                  onClick={() => handleOptionSelect(opt.id)}
                  disabled={isAnswered}
                >
                  <span className="practice-option__text korean-text">{opt.text}</span>
                  {isAnswered && opt.isCorrect && <Check size={16} className="practice-option__check" />}
                </button>
              );
            })}
          </div>

          {/* Skip hint */}
          {!isAnswered && (
            <p className="practice-hint">
              💡 Seçeneklerden birini <strong>tıkla</strong> veya boşluğa <strong>sürükle-bırak</strong>
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── SELECT PHASE ───
  return (
    <div className="page-container">
      <div className="practice-select">
        <div className="practice-select__header">
          <PencilLine size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
          <h1>Pratik Yap</h1>
          <p className="practice-select__subtitle">
            Bir konu seç ve boşluk doldurma egzersizleriyle pratik yap.
            Her seferinde farklı sorular üretilir!
          </p>
        </div>

        {/* Level Tabs */}
        <div className="practice-tabs">
          <button
            className={`btn ${activeTab === 'A1' ? 'practice-tab--active' : 'practice-tab--inactive'}`}
            onClick={() => setActiveTab('A1')}
          >
            A1 Seviye
          </button>
          <button
            className={`btn ${activeTab === 'A2' ? 'practice-tab--active' : 'practice-tab--inactive'}`}
            onClick={() => setActiveTab('A2')}
          >
            A2 Seviye
          </button>
        </div>

        {/* Lesson Grid */}
        <div className="practice-grid">
          {lessons.map(lesson => {
            // Check if lesson has enough pairs for exercises
            const totalPairs = lesson.examples.reduce((sum, ex) => sum + ex.pairs.length, 0);
            const canGenerate = totalPairs >= 3 && lesson.examples.length >= 2;

            return (
              <div
                key={lesson.id}
                className={`practice-card ${!canGenerate ? 'practice-card--disabled' : ''}`}
                onClick={() => canGenerate && handleStartExercise(lesson)}
              >
                <div className="practice-card__order">DERS {lesson.order}</div>
                <h3 className="practice-card__title">{lesson.title}</h3>
                <p className="practice-card__description">{lesson.description}</p>
                <div className="practice-card__footer">
                  {canGenerate ? (
                    <span className="practice-card__action">
                      Örnek Oluştur <ChevronRight size={16} />
                    </span>
                  ) : (
                    <span className="practice-card__unavailable">Yeterli veri yok</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Practice;
