/**
 * UpdateNotification - Bass Academy
 * Shows a notification when a new version of the app is available
 */

import React from 'react';
import { RefreshCw, X } from 'lucide-react';

const UpdateNotification = ({ isVisible, onUpdate, onDismiss }) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 
                 animate-fadeInUp"
      style={{ animationDuration: '0.3s' }}
    >
      <div 
        className="glass-strong rounded-xl p-4 border border-[var(--color-info)]/30
                   shadow-lg shadow-black/20"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-info)]/20 
                            flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-[var(--color-info)]" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--color-cream)] text-sm mb-1">
              Actualización disponible
            </h3>
            <p className="text-xs text-[var(--color-primary-light)] mb-3">
              Una nueva versión de Bass Academy está lista.
            </p>
            
            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onUpdate}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                           bg-[var(--color-info)] text-white
                           font-medium text-xs hover:bg-[var(--color-info)]/90
                           transition-all duration-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Actualizar ahora
              </button>
              <button
                onClick={onDismiss}
                className="px-3 py-1.5 rounded-lg text-[var(--color-primary-light)]
                           text-xs hover:text-[var(--color-cream)]
                           hover:bg-[var(--color-primary-dark)]/50
                           transition-all duration-200"
              >
                Más tarde
              </button>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-lg text-[var(--color-primary-light)]
                       hover:text-[var(--color-cream)] hover:bg-[var(--color-primary-dark)]/50
                       transition-colors duration-200"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;
