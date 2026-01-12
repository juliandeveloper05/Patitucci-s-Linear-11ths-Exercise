/**
 * useLoopMode Hook - Bass Academy
 * Manages playhead position and loop state using requestAnimationFrame
 * synced to audioContext.currentTime for drift-free animation
 * 
 * FIXED: Uses refs to avoid stale closures and dependency cycles
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { RHYTHM_CONFIG, LOOP_MODE_CONFIG } from '../config/uiConfig.js';

/**
 * @param {Object} options
 * @param {Object} options.scheduler - Audio scheduler from useAudioScheduler
 * @param {number} options.tempo - Current tempo in BPM
 * @param {number} options.loopLength - Number of measures to loop (1, 2, or 4)
 * @param {boolean} options.isPlaying - Whether playback is active
 * @param {Function} options.onLoopRestart - Callback when loop restarts
 */
export function useLoopMode({ 
  scheduler, 
  tempo, 
  loopLength = LOOP_MODE_CONFIG.defaultLoopLength,
  isPlaying = false,
  onLoopRestart,
}) {
  // Playhead position 0..1 within the current loop
  const [playhead, setPlayhead] = useState(0);
  
  // Currently highlighted note index
  const [highlightNoteIndex, setHighlightNoteIndex] = useState(-1);
  
  // Internal refs for animation loop (avoid stale closures)
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastLoopCountRef = useRef(0);
  const playheadRef = useRef(0);
  
  // Refs to hold current values (avoids stale closure issues)
  const schedulerRef = useRef(scheduler);
  const tempoRef = useRef(tempo);
  const loopLengthRef = useRef(loopLength);
  const onLoopRestartRef = useRef(onLoopRestart);
  
  // Keep refs in sync with props
  useEffect(() => {
    schedulerRef.current = scheduler;
  }, [scheduler]);
  
  useEffect(() => {
    tempoRef.current = tempo;
  }, [tempo]);
  
  useEffect(() => {
    loopLengthRef.current = loopLength;
  }, [loopLength]);
  
  useEffect(() => {
    onLoopRestartRef.current = onLoopRestart;
  }, [onLoopRestart]);

  // Calculate loop duration in seconds
  const getLoopDuration = useCallback(() => {
    return (60 / tempoRef.current) * RHYTHM_CONFIG.beatsPerMeasure * loopLengthRef.current;
  }, []);

  /**
   * Animation tick - called every frame via rAF
   * Uses refs to access current values without dependencies
   */
  const tick = useCallback(() => {
    const audioContext = schedulerRef.current?.getAudioContext?.();
    if (!audioContext) {
      // Keep trying until audioContext is available
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const now = audioContext.currentTime;
    const currentTempo = tempoRef.current;
    const currentLoopLength = loopLengthRef.current;
    const loopDuration = (60 / currentTempo) * RHYTHM_CONFIG.beatsPerMeasure * currentLoopLength;
    const elapsed = now - startTimeRef.current;
    
    // Handle negative elapsed time (before start)
    if (elapsed < 0) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    
    // Calculate progress within current loop (0..1)
    const progress = (elapsed % loopDuration) / loopDuration;
    
    // Detect loop restart
    const currentLoopCount = Math.floor(elapsed / loopDuration);
    if (currentLoopCount > lastLoopCountRef.current) {
      lastLoopCountRef.current = currentLoopCount;
      onLoopRestartRef.current?.();
    }
    
    // Update playhead ref for direct DOM access
    playheadRef.current = progress;
    
    // Update React state
    setPlayhead(progress);
    
    // Calculate which note the playhead is on
    const beatProgress = progress * RHYTHM_CONFIG.beatsPerMeasure * currentLoopLength;
    const currentBeat = Math.floor(beatProgress);
    const noteIndex = currentBeat * RHYTHM_CONFIG.tripletsPerBeat;
    
    setHighlightNoteIndex(noteIndex);
    
    // Continue animation loop
    rafRef.current = requestAnimationFrame(tick);
  }, []); // No dependencies - uses refs

  /**
   * Start the playhead animation
   */
  const start = useCallback(() => {
    const audioContext = schedulerRef.current?.getAudioContext?.();
    
    // If audioContext not ready, retry in 50ms
    if (!audioContext) {
      const retryTimeout = setTimeout(() => {
        if (rafRef.current === null) {
          start();
        }
      }, 50);
      // Store timeout ref for cleanup if needed
      return () => clearTimeout(retryTimeout);
    }
    
    startTimeRef.current = audioContext.currentTime;
    lastLoopCountRef.current = 0;
    playheadRef.current = 0;
    setPlayhead(0);
    setHighlightNoteIndex(0);
    
    // Cancel any existing animation frame before starting new one
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  /**
   * Stop the playhead animation
   */
  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setPlayhead(0);
    setHighlightNoteIndex(-1);
    playheadRef.current = 0;
  }, []);

  /**
   * Seek to a specific position in the loop
   */
  const seek = useCallback((position) => {
    const clamped = Math.max(0, Math.min(1, position));
    setPlayhead(clamped);
    playheadRef.current = clamped;
    
    // Recalculate start time to match new position
    const audioContext = schedulerRef.current?.getAudioContext?.();
    if (audioContext) {
      const loopDuration = getLoopDuration();
      startTimeRef.current = audioContext.currentTime - (clamped * loopDuration);
    }
  }, [getLoopDuration]);

  // Auto-start/stop based on isPlaying prop
  useEffect(() => {
    if (isPlaying) {
      start();
    } else {
      stop();
    }
    
    // Cleanup on effect re-run
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    playhead,           // 0..1 position in loop (for React state)
    playheadRef,        // Ref for direct DOM access (60fps)
    highlightNoteIndex, // Current note to highlight
    start,
    stop,
    seek,
    loopDuration: getLoopDuration(),
  };
}

export default useLoopMode;
