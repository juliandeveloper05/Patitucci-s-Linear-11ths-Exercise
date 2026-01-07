/**
 * TabNote Component - Bass Trainer
 * Single fret note indicator
 * ✅ Tamaños más grandes y legibles en móvil
 * ✅ Mejor contraste en todos los themes
 * ✅ Estados visuales mejorados
 */

import React from 'react';

function TabNote({ fret, isActive, size = 'default' }) {
  // Tamaños optimizados - MÁS GRANDES EN MÓVIL
  const sizeClasses = size === 'compact' 
    ? 'w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl text-xs sm:text-sm tab-note-mobile' // Aumentado de w-5 h-5
    : 'w-10 h-10 rounded-xl text-sm';
  
  const activeScale = size === 'compact' ? 'scale-110 sm:scale-125' : 'scale-125';
  
  return (
    <div
      className={`
        flex items-center justify-center 
        font-mono font-bold transition-all duration-150
        flex-shrink-0
        ${sizeClasses}
        ${
          isActive
            ? `bg-[var(--color-active)] text-[var(--color-primary-deep)] ${activeScale} 
               border-2 border-[var(--color-active)]
               shadow-[0_0_16px_var(--color-active-glow),0_0_32px_var(--color-active-glow)]
               animate-pulse z-20`
            : `bg-[var(--color-primary-dark)] text-[var(--color-cream)] 
               border-2 border-[var(--color-primary-medium)] 
               hover:border-[var(--color-gold)]/70 
               hover:bg-[var(--color-primary-medium)]/50
               shadow-[0_2px_8px_rgba(0,0,0,0.3)]`
        }
      `}
      data-active={isActive ? 'true' : 'false'}
      style={{
        // Asegurar que las notas activas sean súper visibles
        ...(isActive && {
          fontWeight: 900,
          textShadow: '0 0 2px rgba(0,0,0,0.5)'
        })
      }}
    >
      {fret}
    </div>
  );
}

export default TabNote;
