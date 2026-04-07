import React from 'react';
import type { ContextualSentence, GrammarExampleV2 } from '../../utils/types';

interface BilingualSentenceProps {
  sentence?: ContextualSentence; // Old V1
  example?: GrammarExampleV2;    // New V2
  palette?: Record<string, string>;
}

export const BilingualSentence: React.FC<BilingualSentenceProps> = ({ sentence, example, palette }) => {
  // Normalize data for rendering
  const isV2 = !!example;
  const pairs = isV2 
    ? example?.pairs.map(p => ({
        korean: p.ko,
        turkish: p.tr,
        romanized: '', // V2 doesn't have per-word romanization in the provided structure
        type: p.type,
        key: p.key
      })) 
    : sentence?.words.map(w => ({
        korean: w.korean,
        turkish: w.turkish,
        romanized: w.romanized,
        type: 'word',
        key: ''
      }));

  if (!pairs) return null;

  return (
    <div className="bilingual-sentence" style={{ 
      background: 'var(--bg-page)', 
      padding: '2rem', 
      borderRadius: 'var(--radius-md)', 
      border: '1px solid rgba(0,0,0,0.05)', 
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      
      {/* Word blocks */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.75rem', 
        marginBottom: '1.5rem',
        alignItems: 'flex-end'
      }}>
        {pairs.map((word, index) => {
          const color = word.type === 'suffix' ? (palette?.[word.key] || 'var(--secondary)') : 'var(--primary-dark)';
          
          return (
            <div key={index} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              background: 'var(--bg-surface)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${word.type === 'suffix' ? 'var(--primary-light)' : 'rgba(0,0,0,0.05)'}`,
              minWidth: '60px'
            }}>
              <span className="korean-text" style={{ 
                fontSize: '1.5rem', 
                fontWeight: 600, 
                color: color,
                marginBottom: '0.2rem' 
              }}>
                {word.korean}
              </span>
              {word.romanized && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
                  {word.romanized}
                </span>
              )}
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)', opacity: 0.8 }}>
                {word.turkish}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: 'var(--radius-sm)' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          <strong>Çeviri:</strong> {isV2 ? example?.trText : sentence?.turkishSentence}
        </div>
        <div className="korean-text" style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          <strong>Cümle:</strong> {isV2 ? example?.koText : sentence?.koreanSentence}
        </div>
      </div>
    
    </div>
  );
};
