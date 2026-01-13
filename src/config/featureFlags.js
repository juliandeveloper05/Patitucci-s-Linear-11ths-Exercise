/**
 * Feature Flags - Bass Academy
 * Runtime toggles for experimental features
 */

export const FEATURES = {
  // BassAI Vision - Gesture control via MediaPipe
  // OFF by default - opt-in feature
  VISION_ENABLED: import.meta.env.VITE_VISION_ENABLED === 'true',
  
  // Web Worker processing for vision (better performance)
  // DISABLED: MediaPipe has compatibility issues with ES module workers
  // Fallback to main thread processing for now
  VISION_WORKERS: false,
  
  // Debug mode for vision - shows FPS, latency, landmarks
  VISION_DEBUG: import.meta.env.VITE_VISION_DEBUG === 'true'
};

// Feature check helper
export function isFeatureEnabled(featureName) {
  return FEATURES[featureName] ?? false;
}

export default FEATURES;
