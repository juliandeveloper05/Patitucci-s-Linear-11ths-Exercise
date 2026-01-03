/**
 * OfflineIndicator - Bass Academy
 * Shows a banner when the app is offline
 */

import React from 'react';
import { WifiOff } from 'lucide-react';

const OfflineIndicator = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 animate-fadeInUp"
      style={{ animationDuration: '0.3s' }}
    >
      <div 
        className="bg-[var(--color-warning)] text-[var(--color-primary-deep)]
                   px-4 py-2 flex items-center justify-center gap-2 
                   text-sm font-medium shadow-lg"
      >
        <WifiOff className="w-4 h-4" />
        <span>Sin conexión - Trabajando offline</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
