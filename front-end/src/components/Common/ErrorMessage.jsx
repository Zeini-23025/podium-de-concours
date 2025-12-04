import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Error message component with accessibility
 */
const ErrorMessage = ({ message, onRetry, className = '' }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger ${className}`}
      aria-live="assertive"
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <p className="font-medium">Erreur</p>
        <p className="text-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-danger text-white rounded-md hover:bg-danger/90 transition-smooth focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
          aria-label="Réessayer"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

