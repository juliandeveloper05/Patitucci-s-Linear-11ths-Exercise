/**
 * PWAInstallBanner - Bass Academy
 * Shows an install prompt banner for PWA installation
 */

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const PWAInstallBanner = ({ isInstallable, onInstall, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage for previous dismissal
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const now = Date.now();
    
    // Show banner again after 7 days
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (now - dismissedTime > sevenDays) {
      setIsDismissed(false);
    } else {
      setIsDismissed(true);
    }
  }, []);

  // Show banner when installable and not dismissed
  useEffect(() => {
    if (isInstallable && !isDismissed) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isInstallable, isDismissed]);

  const handleInstall = async () => {
    const installed = await onInstall();
    if (installed) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 
                 animate-fadeInUp"
      style={{ animationDuration: '0.4s' }}
    >
      <div 
        className="glass-strong rounded-2xl p-4 border border-[var(--color-gold)]/30
                   shadow-lg shadow-black/20"
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-[var(--color-primary-deep)]" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--color-cream)] text-sm sm:text-base mb-1">
              Instalar Bass Academy
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-primary-light)] mb-3">
              Practica offline y accede rápidamente desde tu escritorio o pantalla de inicio.
            </p>
            
            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                           bg-[var(--color-gold)] text-[var(--color-primary-deep)]
                           font-medium text-sm hover:bg-[var(--color-gold-light)]
                           transition-all duration-200 hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 rounded-lg text-[var(--color-primary-light)]
                           text-sm hover:text-[var(--color-cream)]
                           hover:bg-[var(--color-primary-dark)]/50
                           transition-all duration-200"
              >
                Ahora no
              </button>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-lg text-[var(--color-primary-light)]
                       hover:text-[var(--color-cream)] hover:bg-[var(--color-primary-dark)]/50
                       transition-colors duration-200"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Feature highlights */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--color-primary-medium)]/20">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-primary-light)]">
            <span className="text-[var(--color-success)]">✓</span>
            Funciona offline
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-primary-light)]">
            <span className="text-[var(--color-success)]">✓</span>
            Carga instantánea
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-primary-light)]">
            <span className="text-[var(--color-success)]">✓</span>
            Sin ads
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
