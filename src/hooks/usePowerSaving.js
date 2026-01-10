/**
 * usePowerSaving Hook - Battery & CPU Power Management
 * Detects low battery and provides power-saving mode toggle
 * Reduces animations and particle effects to conserve battery
 */

import { useState, useEffect, useCallback } from 'react';
import { POWER_SAVING_CONFIG } from '../config/uiConfig.js';

/**
 * Hook for managing power-saving mode
 * @returns {Object} Power saving state and controls
 */
export const usePowerSaving = () => {
  // Manual override from user preference (persisted)
  const [manualOverride, setManualOverride] = useState(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(POWER_SAVING_CONFIG.storageKey);
    return saved !== null ? JSON.parse(saved) : null;
  });

  // Battery state
  const [batteryState, setBatteryState] = useState({
    level: 1,
    charging: true,
    supported: false,
  });

  // Detect if reduced motion is preferred
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Initialize Battery API
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.getBattery) {
      // Battery API not supported (desktop browsers, etc.)
      return;
    }

    let battery = null;

    const updateBatteryState = (bat) => {
      setBatteryState({
        level: bat.level,
        charging: bat.charging,
        supported: true,
      });
    };

    navigator.getBattery().then((bat) => {
      battery = bat;
      updateBatteryState(bat);

      // Listen for battery changes
      bat.addEventListener('levelchange', () => updateBatteryState(bat));
      bat.addEventListener('chargingchange', () => updateBatteryState(bat));
    }).catch(() => {
      // Battery API failed (permissions, etc.)
      console.log('Battery API not available');
    });

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', () => {});
        battery.removeEventListener('chargingchange', () => {});
      }
    };
  }, []);

  // Listen for reduced motion preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setPrefersReducedMotion(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Persist manual override
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (manualOverride !== null) {
      localStorage.setItem(POWER_SAVING_CONFIG.storageKey, JSON.stringify(manualOverride));
    } else {
      localStorage.removeItem(POWER_SAVING_CONFIG.storageKey);
    }
  }, [manualOverride]);

  // Calculate if power saving should be active
  const isLowBattery = batteryState.supported && 
    !batteryState.charging && 
    batteryState.level < POWER_SAVING_CONFIG.batteryThreshold;

  // Final power saving state
  // Priority: manual override > low battery > reduced motion preference
  const isPowerSaving = manualOverride !== null 
    ? manualOverride 
    : (isLowBattery || prefersReducedMotion);

  // Manual toggle function
  const setPowerSavingManual = useCallback((value) => {
    setManualOverride(value);
  }, []);

  // Reset to automatic detection
  const resetToAutomatic = useCallback(() => {
    setManualOverride(null);
  }, []);

  return {
    // State
    isPowerSaving,
    isLowBattery,
    batteryLevel: batteryState.level,
    isCharging: batteryState.charging,
    isBatterySupported: batteryState.supported,
    prefersReducedMotion,
    isManualOverride: manualOverride !== null,
    
    // Actions
    setPowerSavingManual,
    resetToAutomatic,
    
    // Config (for components that need thresholds)
    config: POWER_SAVING_CONFIG,
  };
};

export default usePowerSaving;
