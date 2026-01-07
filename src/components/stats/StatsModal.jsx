/**
 * StatsModal.jsx
 * Displays practice statistics with visual flair
 */
import React from 'react';
import { Trophy, Calendar, Clock, Activity, X, Flame } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subtext, color = "text-[var(--color-gold)]" }) => (
  <div className="glass p-4 rounded-xl flex flex-col items-center justify-center text-center border border-white/5 hover:bg-white/5 transition-colors">
    <div className={`p-3 rounded-full bg-white/5 mb-3 ${color}`}>
      <Icon size={24} />
    </div>
    <h3 className="text-2xl font-bold text-white mb-1 font-[var(--font-display)]">{value}</h3>
    <p className="text-xs text-[var(--color-primary-light)] uppercase tracking-wider font-medium">{label}</p>
    {subtext && <p className="text-[10px] text-white/40 mt-1">{subtext}</p>}
  </div>
);

const StatsModal = ({ isOpen, onClose, stats, formatTime }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg glass-strong rounded-3xl overflow-hidden shadow-2xl animate-fadeInUp border border-white/10">
        
        {/* Header */}
        <div className="bg-[var(--color-primary-dark)]/50 p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-gold">
              <Trophy className="text-[var(--color-primary-deep)]" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white font-[var(--font-display)]">Your Progress</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Close statistics modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              icon={Flame} 
              label="Day Streak" 
              value={stats.streak} 
              subtext="Keep it up!"
              color="text-orange-500"
            />
            <StatCard 
              icon={Clock} 
              label="Total Practice" 
              value={formatTime(stats.totalSeconds)} 
              subtext={`${stats.sessions} sessions total`}
              color="text-blue-400"
            />
            <StatCard 
              icon={Activity} 
              label="Today" 
              value={formatTime(stats.dailyHistory[new Date().toISOString().split('T')[0]] || 0)} 
              color="text-green-400"
            />
            <StatCard 
              icon={Calendar} 
              label="Last Session" 
              value={stats.lastPracticeDate ? new Date(stats.lastPracticeDate).toLocaleDateString() : '-'} 
              color="text-purple-400"
            />
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[var(--color-primary-dark)]/40 border border-white/5 text-center">
            <p className="text-white/60 text-sm italic">
              "You don't get better by worrying about it. You get better by practicing."
            </p>
            <p className="text-[var(--color-gold)] text-xs mt-1 font-medium">— Victor Wooten</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
