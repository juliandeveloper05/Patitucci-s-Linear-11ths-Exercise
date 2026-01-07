/**
 * Audio Service - Bass Trainer
 * Sample-based audio playback using Web Audio API
 * Uses master gain nodes for real-time volume control
 */

import { STRING_FREQUENCIES, SAMPLE_PATHS, SAMPLE_CONFIG } from '../config/audioConfig.js';

class AudioService {
  constructor() {
    this.context = null;
    this.isReady = false;
    
    // Audio buffers cache
    this.buffers = {
      bass: null,
      metronome: {
        click: null,
      },
    };
    
    // Master gain nodes for real-time volume control
    this.masterGains = {
      bass: null,
      metronome: null,
    };
    
    this.samplesLoaded = false;
  }

  /**
   * Initialize or get the AudioContext
   */
  init() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();
      
      // Create master gain nodes
      this.masterGains.bass = this.context.createGain();
      this.masterGains.bass.gain.value = 0.7;
      this.masterGains.bass.connect(this.context.destination);
      
      this.masterGains.metronome = this.context.createGain();
      this.masterGains.metronome.gain.value = 0.5;
      this.masterGains.metronome.connect(this.context.destination);
    }
    return this.context;
  }

  /**
   * Resume audio context (required for browsers that suspend on load)
   */
  async resume() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
    
    // Load samples if not already loaded
    if (!this.samplesLoaded) {
      await this.loadSamples();
    }
    
    this.isReady = true;
    return this.isReady;
  }

  /**
   * Close and cleanup the AudioContext
   */
  close() {
    if (this.context) {
      this.context.close();
      this.context = null;
      this.isReady = false;
      this.samplesLoaded = false;
      this.buffers = { bass: null, metronome: { click: null } };
      this.masterGains = { bass: null, metronome: null };
    }
  }

  /**
   * Get current time from AudioContext
   */
  get currentTime() {
    return this.context ? this.context.currentTime : 0;
  }

  /**
   * Set bass volume in real-time (0.0 - 1.0)
   */
  setBassVolume(volume) {
    if (this.masterGains.bass) {
      this.masterGains.bass.gain.value = volume;
    }
  }

  /**
   * Set metronome volume in real-time (0.0 - 1.0)
   */
  setMetronomeVolume(volume) {
    if (this.masterGains.metronome) {
      this.masterGains.metronome.gain.value = volume;
    }
  }

  /**
   * Immediately stop all scheduled sounds by muting master gains
   * This is called when the user pauses playback
   */
  stopAllSounds() {
    if (!this.context) return;
    
    const currentTime = this.context.currentTime;
    
    // Immediately ramp down all master gains to stop scheduled sounds
    if (this.masterGains.bass) {
      this.masterGains.bass.gain.cancelScheduledValues(currentTime);
      this.masterGains.bass.gain.setValueAtTime(this.masterGains.bass.gain.value, currentTime);
      this.masterGains.bass.gain.linearRampToValueAtTime(0, currentTime + 0.01);
    }
    
    if (this.masterGains.metronome) {
      this.masterGains.metronome.gain.cancelScheduledValues(currentTime);
      this.masterGains.metronome.gain.setValueAtTime(this.masterGains.metronome.gain.value, currentTime);
      this.masterGains.metronome.gain.linearRampToValueAtTime(0, currentTime + 0.01);
    }
  }

  /**
   * Restore master gains after stopping (call before playing again)
   * @param {number} bassVolume - Bass volume (0.0 - 1.0)
   * @param {number} metronomeVolume - Metronome volume (0.0 - 1.0)
   */
  restoreVolumes(bassVolume = 0.7, metronomeVolume = 0.5) {
    if (this.masterGains.bass) {
      this.masterGains.bass.gain.value = bassVolume;
    }
    if (this.masterGains.metronome) {
      this.masterGains.metronome.gain.value = metronomeVolume;
    }
  }

  /**
   * Load a single audio sample
   * @param {string} url - Path to the audio file
   * @returns {Promise<AudioBuffer|null>}
   */
  async loadSample(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to load sample: ${url}`);
        return null;
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Error loading sample ${url}:`, error);
      return null;
    }
  }

  /**
   * Load all audio samples
   */
  async loadSamples() {
    if (!this.context) {
      console.warn('AudioContext not initialized');
      return;
    }

    try {
      // Load bass sample
      this.buffers.bass = await this.loadSample(SAMPLE_PATHS.bass);
      
      // Load metronome click sample
      this.buffers.metronome.click = await this.loadSample(SAMPLE_PATHS.metronome.click);
      
      this.samplesLoaded = true;
      console.log('🎵 Audio samples loaded successfully');
    } catch (error) {
      console.error('Error loading samples:', error);
    }
  }

  /**
   * Play a bass note using the loaded sample
   * @param {string} string - String name ('E', 'A', 'D', 'G')
   * @param {number} fret - Fret number
   * @param {number} time - Scheduled time
   * @param {boolean} muted - If true, skip playing
   */
  playSound(string, fret, time, muted = false) {
    if (!this.context || muted) return;

    // If sample is loaded, use it
    if (this.buffers.bass) {
      this.playSampleNote(string, fret, time);
    }
  }

  /**
   * Play bass sample with pitch adjustment
   * Volume is controlled by master gain node in real-time
   */
  playSampleNote(string, fret, time) {
    if (!this.buffers.bass || !this.masterGains.bass) return;

    const { bass: bassConfig } = SAMPLE_CONFIG;
    
    // Calculate target frequency
    const baseFreq = STRING_FREQUENCIES[string];
    const targetFreq = baseFreq * Math.pow(2, fret / 12);
    
    // Calculate playback rate based on sample's base frequency
    const playbackRate = targetFreq / bassConfig.baseFrequency;

    // Create buffer source
    const source = this.context.createBufferSource();
    source.buffer = this.buffers.bass;
    source.playbackRate.setValueAtTime(playbackRate, time);

    // Create envelope gain node (for attack/release shape)
    const envelopeGain = this.context.createGain();
    envelopeGain.gain.setValueAtTime(0, time);
    envelopeGain.gain.linearRampToValueAtTime(1, time + 0.05);
    envelopeGain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

    // Connect: source -> envelope -> master gain -> destination
    source.connect(envelopeGain);
    envelopeGain.connect(this.masterGains.bass);

    // Play
    source.start(time);
    source.stop(time + 0.6);
  }

  /**
   * Play metronome click
   * @param {number} time - Scheduled time
   * @param {boolean} isDownbeat - First beat of measure
   * @param {boolean} isFirstOfBeat - First triplet of beat
   * @param {boolean} enabled - If false, skip playing
   */
  playMetronomeClick(time, isDownbeat, isFirstOfBeat, enabled = true) {
    if (!this.context || !enabled) return;

    // If sample is loaded, use it
    if (this.buffers.metronome.click) {
      this.playSampleMetronome(time, isDownbeat, isFirstOfBeat);
    }
  }

  /**
   * Play metronome sample
   * Volume is controlled by master gain node in real-time
   */
  playSampleMetronome(time, isDownbeat, isFirstOfBeat) {
    if (!this.buffers.metronome.click || !this.masterGains.metronome) return;

    // Create buffer source
    const source = this.context.createBufferSource();
    source.buffer = this.buffers.metronome.click;

    // Beat-type multiplier for dynamics (downbeat louder)
    const beatMultiplier = isDownbeat && isFirstOfBeat 
      ? 1.4 
      : isFirstOfBeat 
        ? 1.0 
        : 0.5;

    // Create gain node for beat dynamics
    const dynamicsGain = this.context.createGain();
    dynamicsGain.gain.setValueAtTime(beatMultiplier, time);

    // Connect: source -> dynamics -> master gain -> destination
    source.connect(dynamicsGain);
    dynamicsGain.connect(this.masterGains.metronome);

    source.start(time);
  }

  /**
   * Play countdown beep (uses oscillator)
   * @param {boolean} isStart - Higher pitch for "GO!" beep
   */
  playCountdownBeep(isStart = false) {
    if (!this.context) return;

    const currentTime = this.context.currentTime;

    const osc = this.context.createOscillator();
    const gainNode = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isStart ? 880 : 440, currentTime);

    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.context.destination);

    osc.start(currentTime);
    osc.stop(currentTime + 0.2);
  }
}

// Singleton instance
export const audioService = new AudioService();

export default AudioService;
