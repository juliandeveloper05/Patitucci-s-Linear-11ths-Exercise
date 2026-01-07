/**
 * TabString Component - Bass Trainer
 * Single bass string with notes
 * ✅ Líneas de cuerda VISIBLES en todos los themes
 * ✅ Mejor contraste y profundidad
 * ✅ Scroll horizontal en móvil sin overflow
 */

import React from 'react';
import TabNote from './TabNote.jsx';

function TabString({ 
  stringName, 
  notes, 
  currentNoteIndex, 
  variant = 'desktop',
  colorClass = 'text-[var(--color-gold)]',
  lineColorClass = 'bg-[var(--color-gold)]'
}) {
  // Desktop variant
  if (variant === 'desktop') {
    return (
      <div className="flex items-center mb-4 relative h-12 select-none group">
        {/* String Label */}
        <div 
          className="w-14 font-mono text-lg font-bold text-[var(--color-gold)] 
                     flex items-center justify-center z-10"
        >
          <span className="bg-[var(--color-primary-dark)] px-3 py-1 rounded-lg border border-[var(--color-gold)]/30">
            {stringName}
          </span>
        </div>
        
        {/* String Container */}
        <div className="flex-1 relative flex items-center">
          {/* String Line with Gradient - VISIBLE */}
          <div 
            className="absolute w-full h-[3px] rounded-full tab-string-line"
            style={{
              background: `linear-gradient(90deg, 
                var(--color-primary-medium) 0%, 
                var(--color-gold) 20%, 
                var(--color-gold-light) 50%, 
                var(--color-gold) 80%, 
                var(--color-primary-medium) 100%)`,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
            }}
          />

          {/* Notes */}
          <div className="flex w-full justify-between relative z-10 px-3">
            {notes.map((note, idx) => {
              if (note.string !== stringName) {
                return <div key={idx} className="w-10 h-10" />;
              }
              
              return (
                <TabNote 
                  key={idx}
                  fret={note.fret}
                  isActive={currentNoteIndex === note.id}
                  size="default"
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  
  // Mobile compact variant - MEJORADO
  return (
    <div className="flex items-center h-9 sm:h-10 relative tab-string-mobile">
      {/* String Label - Más visible */}
      <div className={`
        w-8 sm:w-10 font-mono text-sm sm:text-base font-bold ${colorClass} 
        flex-shrink-0 flex items-center justify-center
        bg-[var(--color-primary-dark)]/60 rounded-lg
        border border-current/20
        mr-2
      `}>
        {stringName}
      </div>
      
      {/* String Container */}
      <div className="flex-1 relative flex items-center min-h-full">
        {/* String Line - VISIBLE CON GRADIENTE */}
        <div 
          className="absolute w-full rounded-full tab-string-line"
          style={{
            height: 'var(--string-line-height, 2.5px)',
            background: lineColorClass === 'bg-[var(--color-gold)]' 
              ? `linear-gradient(90deg, 
                  transparent 0%, 
                  var(--color-gold) 10%, 
                  var(--color-gold-light) 50%, 
                  var(--color-gold) 90%, 
                  transparent 100%)`
              : `linear-gradient(90deg, 
                  transparent 0%, 
                  var(--color-info) 10%, 
                  #60A5FA 50%, 
                  var(--color-info) 90%, 
                  transparent 100%)`,
            boxShadow: 'var(--string-line-shadow, 0 1px 2px rgba(0, 0, 0, 0.2))',
            opacity: 0.9
          }}
        />
        
        {/* Notes - Con spacing fijo */}
        <div className="flex relative z-10 gap-1.5 sm:gap-2">
          {notes.map((note, idx) => {
            if (note.string !== stringName) {
              return <div key={idx} className="w-8 h-8 sm:w-9 sm:h-9 tab-note-mobile" />;
            }
            
            return (
              <TabNote 
                key={idx}
                fret={note.fret}
                isActive={currentNoteIndex === note.id}
                size="compact"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TabString;
