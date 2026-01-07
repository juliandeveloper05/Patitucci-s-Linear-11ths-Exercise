/**
 * TablatureMobile Component - Bass Trainer
 * Mobile compact grid tablature view with IMPROVED RESPONSIVE DESIGN
 * ✅ Scroll horizontal para evitar overflow
 * ✅ Líneas de cuerda visibles
 * ✅ Tamaños optimizados para móvil
 */

import React, { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import TabString from './TabString.jsx';
import MeasureGuide from './MeasureGuide.jsx';
import ProgressBar from './ProgressBar.jsx';
import { STRING_ORDER } from '../../config/audioConfig.js';

function TablatureMobile({ 
  tabData = [], 
  currentNoteIndex = -1, 
  selectedRoot = 'E', 
  selectedPattern = 'linear11thsMaj', 
  secondRoot = 'A', 
  secondPattern = 'linear11thsMin',
  tempo = 60,
  isPlaying = false,
  onMeasureClick = null
}) {
  const measure1Ref = useRef(null);
  const measure2Ref = useRef(null);
  const measure1ScrollRef = useRef(null);
  const measure2ScrollRef = useRef(null);

  // Split notes into two measures (0-11 and 12-23)
  const measure1Notes = tabData.slice(0, 12);
  const measure2Notes = tabData.slice(12, 24);

  // Auto-scroll to active measure
  useEffect(() => {
    if (currentNoteIndex >= 0 && currentNoteIndex < 12 && measure1Ref.current) {
      measure1Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (currentNoteIndex >= 12 && measure2Ref.current) {
      measure2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentNoteIndex]);

  // Auto-scroll horizontally to active note within measure
  useEffect(() => {
    if (currentNoteIndex >= 0 && currentNoteIndex < 12 && measure1ScrollRef.current) {
      const noteIndex = currentNoteIndex;
      const scrollContainer = measure1ScrollRef.current;
      const noteWidth = 40; // Approximate width per note
      const targetScroll = noteIndex * noteWidth - (scrollContainer.offsetWidth / 2) + (noteWidth / 2);
      scrollContainer.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    } else if (currentNoteIndex >= 12 && measure2ScrollRef.current) {
      const noteIndex = currentNoteIndex - 12;
      const scrollContainer = measure2ScrollRef.current;
      const noteWidth = 40;
      const targetScroll = noteIndex * noteWidth - (scrollContainer.offsetWidth / 2) + (noteWidth / 2);
      scrollContainer.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    }
  }, [currentNoteIndex]);

  // Determine which measure is currently active
  const activeMeasure = currentNoteIndex < 12 ? 1 : 2;
  
  return (
    <div className="md:hidden">
      {/* Compact Progress Bar */}
      <ProgressBar 
        currentIndex={currentNoteIndex}
        totalNotes={tabData.length}
        tempo={tempo}
        isPlaying={isPlaying}
        variant="compact"
      />

      <div className="p-3 sm:p-4 space-y-4">
        {/* Measure 1 Section */}
        <div 
          ref={measure1Ref}
          className={`transition-opacity duration-300 ${
            isPlaying && activeMeasure === 2 ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <MeasureGuide
            selectedRoot={selectedRoot}
            selectedPattern={selectedPattern}
            secondRoot={secondRoot}
            secondPattern={secondPattern}
            variant="measure1"
            onMeasureClick={onMeasureClick}
          />
          
          {/* 4 Strings - Scrollable Horizontal Tab */}
          <div 
            className={`glass rounded-xl p-3 sm:p-4 transition-all duration-300 ${
              activeMeasure === 1 && isPlaying ? 'ring-2 ring-[var(--color-gold)]/50' : ''
            }`}
          >
            {/* Scroll container wrapper */}
            <div 
              ref={measure1ScrollRef}
              className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gold scrollbar-track-dark pb-2"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--color-gold) var(--color-primary-dark)'
              }}
            >
              <div className="min-w-max space-y-2">
                {STRING_ORDER.map(stringName => (
                  <TabString
                    key={stringName}
                    stringName={stringName}
                    notes={measure1Notes}
                    currentNoteIndex={currentNoteIndex}
                    variant="mobile"
                    colorClass="text-[var(--color-gold)]"
                    lineColorClass="bg-[var(--color-gold)]"
                  />
                ))}
              </div>
            </div>
            
            {/* Scroll Hint */}
            {measure1Notes.length > 6 && (
              <div className="text-center mt-2">
                <span className="text-[10px] text-[var(--color-primary-light)] opacity-60 scroll-hint">
                  ← Desliza para ver todas las notas →
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Arrow Divider */}
        <div className="flex justify-center my-2">
          <ChevronRight className={`w-6 h-6 rotate-90 transition-colors duration-300 ${
            activeMeasure === 2 ? 'text-[var(--color-info)]' : 'text-[var(--color-primary-medium)]'
          }`} />
        </div>

        {/* Measure 2 Section */}
        <div 
          ref={measure2Ref}
          className={`transition-opacity duration-300 ${
            isPlaying && activeMeasure === 1 ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <MeasureGuide
            selectedRoot={selectedRoot}
            selectedPattern={selectedPattern}
            secondRoot={secondRoot}
            secondPattern={secondPattern}
            variant="measure2"
            onMeasureClick={onMeasureClick}
          />
          
          {/* 4 Strings - Scrollable Horizontal Tab */}
          <div 
            className={`glass rounded-xl p-3 sm:p-4 transition-all duration-300 ${
              activeMeasure === 2 && isPlaying ? 'ring-2 ring-[var(--color-info)]/50' : ''
            }`}
          >
            {/* Scroll container wrapper */}
            <div 
              ref={measure2ScrollRef}
              className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-info scrollbar-track-dark pb-2"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--color-info) var(--color-primary-dark)'
              }}
            >
              <div className="min-w-max space-y-2">
                {STRING_ORDER.map(stringName => (
                  <TabString
                    key={stringName}
                    stringName={stringName}
                    notes={measure2Notes.map((note, idx) => ({ ...note, id: idx + 12 }))}
                    currentNoteIndex={currentNoteIndex}
                    variant="mobile"
                    colorClass="text-[var(--color-info)]"
                    lineColorClass="bg-[var(--color-info)]"
                  />
                ))}
              </div>
            </div>
            
            {/* Scroll Hint */}
            {measure2Notes.length > 6 && (
              <div className="text-center mt-2">
                <span className="text-[10px] text-[var(--color-primary-light)] opacity-60 scroll-hint">
                  ← Desliza para ver todas las notas →
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TablatureMobile;
