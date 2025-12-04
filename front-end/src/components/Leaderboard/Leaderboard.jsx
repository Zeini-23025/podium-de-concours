import React, { useState, useEffect } from 'react';
import { useTeamContext } from '../../contexts/TeamContext';
import { usePolling } from '../../hooks/usePolling';
import PodiumDisplay from './PodiumDisplay';
import TeamCard from './TeamCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import { RefreshCw } from 'lucide-react';

/**
 * Leaderboard component with real-time updates
 */
const Leaderboard = () => {
  const { leaderboard, loading, error, fetchLeaderboard } = useTeamContext();
  const [isPolling, setIsPolling] = useState(true);

  // Polling for real-time updates
  usePolling(() => {
    if (isPolling) {
      fetchLeaderboard();
    }
  }, 5000, isPolling);

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const handleRefresh = () => {
    fetchLeaderboard();
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && leaderboard.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={handleRefresh} />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Classement en temps réel</h1>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Actualiser le classement"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Actualiser</span>
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Mise à jour automatique toutes les 5 secondes
        </p>
      </div>

      {/* Podium */}
      {top3.length > 0 && (
        <section aria-label="Top 3 du classement">
          <PodiumDisplay topTeams={top3} />
        </section>
      )}

      {/* Full Leaderboard */}
      <section aria-label="Classement complet">
        <h2 className="text-2xl font-bold mb-4">Classement complet</h2>
        {leaderboard.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>Aucune équipe enregistrée pour le moment.</p>
          </div>
        ) : (
          <div
            className="space-y-3"
            role="list"
            aria-label="Liste des équipes"
            aria-live="polite"
            aria-atomic="false"
          >
            {leaderboard.map((team, index) => (
              <div key={team.id} role="listitem">
                <TeamCard
                  team={team}
                  rank={team.rank || index + 1}
                  isLeader={index === 0}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Loading overlay for updates */}
      {loading && leaderboard.length > 0 && (
        <div className="fixed bottom-4 left-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <LoadingSpinner size="sm" className="text-white" />
          <span className="text-sm">Mise à jour...</span>
        </div>
      )}
    </main>
  );
};

export default Leaderboard;

