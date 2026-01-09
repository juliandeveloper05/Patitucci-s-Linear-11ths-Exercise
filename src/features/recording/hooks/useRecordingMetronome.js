/**
 * useRecordingMetronome Hook - Bass Academy
 * Metronome for recording with hi-hat sound synthesis
 * 
 * @module useRecordingMetronome
 */

import { useState, useRef, useCallback, useEffect } from 'react';

// ============================================
// DEFAULT CONFIG
// ============================================

const DEFAULT_CONFIG = {
  tempo: 100,
  timeSignature: 4, // beats per bar
  preRollBars: 1,   // bars before recording starts
  accentFirst: true,
};

// ============================================
// HOOK: useRecordingMetronome
// ============================================

/**
 * Metronome hook with hi-hat sound synthesis
 * 
 * @param {Object} options
 * @param {number} options.initialTempo - Starting tempo
 * @param {Function} options.onPreRollComplete - Called when pre-roll finishes
 * @returns {Object} Metronome state and controls
 */
export function useRecordingMetronome({
  initialTempo = DEFAULT_CONFIG.tempo,
  onPreRollComplete = null,
} = {}) {
  // ============================================
  // STATE
  // ============================================
  
  const [tempo, setTempo] = useState(initialTempo);
  const [timeSignature, setTimeSignature] = useState(DEFAULT_CONFIG.timeSignature);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreRoll, setIsPreRoll] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [preRollBeat, setPreRollBeat] = useState(0);
  
  // Refs for timing
  const audioContextRef = useRef(null);
  const nextBeatTimeRef = useRef(0);
  const timerIdRef = useRef(null);
  const beatCountRef = useRef(0);
  const preRollCountRef = useRef(0);
  
  // ============================================
  // AUDIO CONTEXT INIT
  // ============================================
  
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);
  
  // ============================================
  // HI-HAT SOUND SYNTHESIS
  // ============================================
  
  /**
   * Generate hi-hat sound using noise + filter
   * @param {boolean} isAccent - Louder accent on first beat
   * @param {boolean} isPreRoll - Different sound during pre-roll
   */
  const playHiHat = useCallback((isAccent = false, isPreRoll = false) => {
    const ctx = getAudioContext();
    const time = ctx.currentTime;
    
    // Create noise source
    const bufferSize = ctx.sampleRate * 0.1; // 100ms of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // High-pass filter for hi-hat character
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = isPreRoll ? 8000 : 6000;
    highpass.Q.value = 1;
    
    // Bandpass for metallic sound
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = isPreRoll ? 12000 : 10000;
    bandpass.Q.value = 2;
    
    // Envelope for decay
    const envelope = ctx.createGain();
    const volume = isAccent ? 0.4 : 0.25;
    const finalVolume = isPreRoll ? volume * 0.7 : volume;
    
    envelope.gain.setValueAtTime(finalVolume, time);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + (isPreRoll ? 0.05 : 0.08));
    
    // Connect nodes
    noise.connect(highpass);
    highpass.connect(bandpass);
    bandpass.connect(envelope);
    envelope.connect(ctx.destination);
    
    // Play
    noise.start(time);
    noise.stop(time + 0.1);
  }, [getAudioContext]);
  
  // ============================================
  // SCHEDULER
  // ============================================
  
  const scheduleNextBeat = useCallback(() => {
    const ctx = getAudioContext();
    const secondsPerBeat = 60.0 / tempo;
    
    // Look ahead 100ms
    while (nextBeatTimeRef.current < ctx.currentTime + 0.1) {
      const beatInBar = beatCountRef.current % timeSignature;
      const isAccent = beatInBar === 0;
      
      if (isPreRoll) {
        // Pre-roll mode
        playHiHat(isAccent, true);
        preRollCountRef.current++;
        setPreRollBeat(preRollCountRef.current);
        
        // Check if pre-roll complete
        if (preRollCountRef.current >= timeSignature * DEFAULT_CONFIG.preRollBars) {
          setIsPreRoll(false);
          preRollCountRef.current = 0;
          beatCountRef.current = 0;
          onPreRollComplete?.();
        }
      } else {
        // Normal metronome
        playHiHat(isAccent, false);
        setCurrentBeat(beatInBar + 1);
      }
      
      beatCountRef.current++;
      nextBeatTimeRef.current += secondsPerBeat;
    }
    
    // Schedule next check
    timerIdRef.current = setTimeout(scheduleNextBeat, 25);
  }, [tempo, timeSignature, playHiHat, isPreRoll, onPreRollComplete, getAudioContext]);
  
  // ============================================
  // CONTROLS
  // ============================================
  
  /**
   * Start metronome with optional pre-roll
   * @param {boolean} withPreRoll - Start with pre-roll countdown
   */
  const start = useCallback((withPreRoll = true) => {
    const ctx = getAudioContext();
    
    // Resume if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    beatCountRef.current = 0;
    preRollCountRef.current = 0;
    nextBeatTimeRef.current = ctx.currentTime + 0.05;
    
    if (withPreRoll) {
      setIsPreRoll(true);
      setPreRollBeat(0);
    } else {
      setIsPreRoll(false);
    }
    
    setIsPlaying(true);
    setCurrentBeat(0);
    
    scheduleNextBeat();
  }, [getAudioContext, scheduleNextBeat]);
  
  /**
   * Stop metronome
   */
  const stop = useCallback(() => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    
    setIsPlaying(false);
    setIsPreRoll(false);
    setCurrentBeat(0);
    setPreRollBeat(0);
    beatCountRef.current = 0;
    preRollCountRef.current = 0;
  }, []);
  
  /**
   * Start metronome for playback (sync with audio position)
   * @param {number} startTime - Audio position in seconds
   */
  const startForPlayback = useCallback((startTime = 0) => {
    const ctx = getAudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const secondsPerBeat = 60.0 / tempo;
    // Calculate which beat we should be on
    beatCountRef.current = Math.floor(startTime / secondsPerBeat);
    nextBeatTimeRef.current = ctx.currentTime + (secondsPerBeat - (startTime % secondsPerBeat));
    
    setIsPlaying(true);
    setIsPreRoll(false);
    setCurrentBeat((beatCountRef.current % timeSignature) + 1);
    
    scheduleNextBeat();
  }, [getAudioContext, tempo, timeSignature, scheduleNextBeat]);
  
  // ============================================
  // CLEANUP
  // ============================================
  
  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Update tempo effect
  useEffect(() => {
    setTempo(initialTempo);
  }, [initialTempo]);
  
  // ============================================
  // RETURN API
  // ============================================
  
  return {
    // State
    tempo,
    timeSignature,
    isPlaying,
    isPreRoll,
    currentBeat,
    preRollBeat,
    preRollTotal: timeSignature * DEFAULT_CONFIG.preRollBars,
    
    // Setters
    setTempo,
    setTimeSignature,
    
    // Controls
    start,
    stop,
    startForPlayback,
    
    // Utilities
    playClick: playHiHat,
  };
}

export default useRecordingMetronome;
