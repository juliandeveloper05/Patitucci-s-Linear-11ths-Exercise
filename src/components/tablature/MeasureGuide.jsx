/**
 * MeasureGuide Component - Bass Trainer
 * Shows measure labels with chord names - Clickable for root note selection
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PATTERNS, formatNoteName } from '../../data/exerciseLibrary.js';

function MeasureGuide({ 
  selectedRoot = 'E', 
  selectedPattern = 'linear11thsMaj', 
  secondRoot = 'A', 
  secondPattern = 'linear11thsMin', 
  variant = 'desktop',
  onMeasureClick = null
}) {
  // Defensive: Ensure we have valid values
  const root1 = selectedRoot || 'E';
  const root2 = secondRoot || 'A';
  const pattern1Name = PATTERNS[selectedPattern]?.name || '';
  const pattern2Name = PATTERNS[secondPattern]?.name || '';
  
  // Common clickable styles
  const clickableClass = onMeasureClick 
    ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200' 
    : '';

  if (variant === 'desktop') {
    return (
      <div className="flex pl-14 mt-6 gap-4">
        <button 
          onClick={() => onMeasureClick?.(1)}
          className={`flex-1 glass rounded-xl p-3 text-center border-l-4 border-[var(--color-gold)] ${clickableClass}`}
          disabled={!onMeasureClick}
          aria-label="Change Measure 1 root note"
        >
          <p className="text-xs uppercase tracking-wider text-[var(--color-primary-light)] mb-1">Measure 1</p>
          <p className="font-mono font-bold text-[var(--color-gold)]">
            {formatNoteName(root1)}{pattern1Name}
          </p>
        </button>
        <div className="w-8 flex items-center justify-center">
          <ChevronRight className="w-6 h-6 text-[var(--color-primary-medium)]" />
        </div>
        <button 
          onClick={() => onMeasureClick?.(2)}
          className={`flex-1 glass rounded-xl p-3 text-center border-l-4 border-[var(--color-info)] ${clickableClass}`}
          disabled={!onMeasureClick}
          aria-label="Change Measure 2 root note"
        >
          <p className="text-xs uppercase tracking-wider text-[var(--color-primary-light)] mb-1">Measure 2</p>
          <p className="font-mono font-bold text-[var(--color-info)]">
            {formatNoteName(root2)}{pattern2Name}
          </p>
        </button>
      </div>
    );
  }
  
  // Mobile header variant
  const measureNum = variant === 'measure1' ? 1 : 2;
  
  return (
    <button 
      onClick={() => onMeasureClick?.(measureNum)}
      className={`flex items-center justify-between mb-2 w-full text-left ${clickableClass}`}
      disabled={!onMeasureClick}
      aria-label={`Change Measure ${measureNum} root note`}
    >
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-6 rounded-full ${variant === 'measure1' ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-info)]'}`} />
        <span className={`font-mono font-bold text-base sm:text-lg ${variant === 'measure1' ? 'text-[var(--color-gold)]' : 'text-[var(--color-info)]'}`}>
          {variant === 'measure1' 
            ? `${formatNoteName(root1)}${pattern1Name}`
            : `${formatNoteName(root2)}${pattern2Name}`
          }
        </span>
      </div>
      <span className="text-[10px] sm:text-xs text-[var(--color-primary-light)] uppercase tracking-wider">
        {variant === 'measure1' ? 'Compás 1' : 'Compás 2'}
      </span>
    </button>
  );
}

export default MeasureGuide;
