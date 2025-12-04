import React, { useState } from 'react';
import { Download, FileText, FileJson } from 'lucide-react';
import { useTeamContext } from '../../contexts/TeamContext';
import StatsContainer from './StatsWidget';
import ProgressChart from './ProgressChart';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import { exportToCSV, exportToJSON, formatDate } from '../../utils/helpers';

/**
 * Dashboard component with statistics and charts
 */
const Dashboard = () => {
  const { teams, leaderboard, loading, error, fetchLeaderboard } = useTeamContext();
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportCSV = () => {
    setExportLoading(true);
    const exportData = leaderboard.map(team => ({
      Rang: team.rank,
      'Nom de l\'équipe': team.name,
      Membres: team.members?.join('; ') || '',
      Score: team.score || 0,
      'Date de création': formatDate(team.created_at),
      'Dernière mise à jour': formatDate(team.updated_at),
    }));
    exportToCSV(exportData, `classement-${new Date().toISOString().split('T')[0]}.csv`);
    setExportLoading(false);
  };

  const handleExportJSON = () => {
    setExportLoading(true);
    exportToJSON(leaderboard, `classement-${new Date().toISOString().split('T')[0]}.json`);
    setExportLoading(false);
  };

  if (loading && teams.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && teams.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={fetchLeaderboard} />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={exportLoading || leaderboard.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-smooth focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Exporter en CSV"
          >
            <FileText className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            disabled={exportLoading || leaderboard.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Exporter en JSON"
          >
            <FileJson className="w-4 h-4" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <StatsContainer teams={teams} leaderboard={leaderboard} />

      {/* Progress Chart */}
      <div className="mb-8">
        <ProgressChart leaderboard={leaderboard} />
      </div>

      {/* Timeline (simplified) */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Derniers changements</h3>
        {leaderboard.length === 0 ? (
          <p className="text-slate-500 text-center py-4">Aucun changement récent</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 10).map((team, index) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">#{team.rank}</span>
                  <span className="font-medium">{team.name}</span>
                  {team.trend === 'up' && (
                    <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">
                      ↑ Montée
                    </span>
                  )}
                  {team.trend === 'down' && (
                    <span className="text-xs bg-danger/20 text-danger px-2 py-1 rounded">
                      ↓ Descente
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(team.updated_at || team.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;

