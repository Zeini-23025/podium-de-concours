import React, { useState } from 'react';
import { Plus, Minus, Save } from 'lucide-react';

/**
 * Quick score updater component
 */
const ScoreUpdater = ({ team, onUpdate, loading = false }) => {
  const [score, setScore] = useState(team.score || 0);
  const [isEditing, setIsEditing] = useState(false);

  const handleIncrement = () => {
    setScore(prev => prev + 1);
  };

  const handleDecrement = () => {
    setScore(prev => Math.max(0, prev - 1));
  };

  const handleSave = () => {
    onUpdate(team.id, { score });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setScore(team.score || 0);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <button
            onClick={handleDecrement}
            className="p-1 bg-danger text-white rounded hover:bg-danger/90 transition-smooth focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
            aria-label="Diminuer le score"
            disabled={loading}
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min="0"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 border border-slate-300 rounded text-center focus:ring-2 focus:ring-primary focus:border-primary"
            aria-label="Score"
            disabled={loading}
          />
          <button
            onClick={handleIncrement}
            className="p-1 bg-success text-white rounded hover:bg-success/90 transition-smooth focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2"
            aria-label="Augmenter le score"
            disabled={loading}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="p-1 bg-primary text-white rounded hover:bg-primary/90 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Enregistrer"
            disabled={loading}
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="px-2 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-smooth focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            disabled={loading}
          >
            Annuler
          </button>
        </>
      ) : (
        <>
          <span className="font-bold text-primary">{score}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-sm text-primary border border-primary rounded hover:bg-primary/10 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Modifier le score"
          >
            Modifier
          </button>
        </>
      )}
    </div>
  );
};

export default ScoreUpdater;

