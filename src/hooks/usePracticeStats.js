/**
 * usePracticeStats.js
 * Tracks practice time, sessions, and streaks.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'bass-academy-stats-v1';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const INITIAL_STATS = {
  totalSeconds: 0,
  sessions: 0,
  streak: 0,
  lastPracticeDate: null,
  dailyHistory: {}, // { "2024-01-01": 300 } (seconds)
};

export function usePracticeStats(isPlaying) {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  // Load stats from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setStats({ ...INITIAL_STATS, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.error("Failed to load stats", e);
    }
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  // Handle Practice Timer
  useEffect(() => {
    if (isPlaying) {
      // Start/Resume Practice
      startTimeRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - startTimeRef.current) / 1000);
        setSessionSeconds(delta);
      }, 1000);

    } else {
      // Stop/Pause Practice - Commit time to stats
      if (startTimeRef.current) {
        const now = Date.now();
        const delta = Math.floor((now - startTimeRef.current) / 1000);
        
        if (delta > 0) {
          commitSession(delta);
        }
        
        startTimeRef.current = null;
        setSessionSeconds(0);
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const commitSession = (seconds) => {
    const today = getTodayDate();
    
    setStats(prev => {
      // Streak Calculation
      let newStreak = prev.streak;
      const lastDate = prev.lastPracticeDate;
      
      if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        if (lastDate === yesterdayString) {
          newStreak += 1; // Continued streak
        } else {
          newStreak = 1; // New streak (or reset)
        }
      }

      return {
        ...prev,
        totalSeconds: prev.totalSeconds + seconds,
        sessions: prev.sessions + 1,
        streak: newStreak || 1, // Ensure at least 1 if we just practiced
        lastPracticeDate: today,
        dailyHistory: {
          ...prev.dailyHistory,
          [today]: (prev.dailyHistory[today] || 0) + seconds
        }
      };
    });
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
  };

  return {
    stats,
    currentSessionTime: sessionSeconds,
    formatTime
  };
}
