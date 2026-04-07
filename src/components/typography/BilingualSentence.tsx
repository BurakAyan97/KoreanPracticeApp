import React from 'react';
import type { TextPart } from '../../utils/types';

interface BilingualSentenceProps {
  koreanParts: TextPart[];
  turkish: string;
}

export const BilingualSentence: React.FC<BilingualSentenceProps> = ({ koreanParts, turkish }) => {
  const getPartColor = (type: TextPart['type']) => {
    switch (type) {
      case 'root': return 'var(--highlight-root)';
      case 'particle': return 'var(--highlight-particle)';
      case 'ending': return 'var(--highlight-ending)';
      default: return 'inherit';
    }
  };

  return (
    <div className="bilingual-sentence" style={{ background: 'var(--bg-page)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '1rem' }}>
      <div className="korean-sentence korean-text" style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 500 }}>
        {koreanParts.map((part, index) => (
          <span 
            key={index} 
            style={{ 
              color: getPartColor(part.type),
              fontWeight: part.type !== 'base' ? 700 : 'normal',
              padding: part.type !== 'base' ? '0 2px' : 0
            }}
          >
            {part.text}
          </span>
        ))}
      </div>
      <div className="turkish-sentence" style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
        {turkish}
      </div>
      
      {/* Legend inside sentence blocks, keeping it minimal */}
      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        {koreanParts.some(p => p.type === 'root') && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--highlight-root)' }}></span>
            Kök
          </span>
        )}
        {koreanParts.some(p => p.type === 'particle') && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--highlight-particle)' }}></span>
            Ek / Edat
          </span>
        )}
        {koreanParts.some(p => p.type === 'ending') && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--highlight-ending)' }}></span>
            Fiil Çekimi
          </span>
        )}
      </div>
    </div>
  );
};
