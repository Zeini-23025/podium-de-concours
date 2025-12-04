import React from 'react';
import { Users, Trophy, TrendingUp, Clock } from 'lucide-react';
import { formatNumber, calculateAverage, formatDate } from '../../utils/helpers';

/**
 * Stats widget component
 */
const StatsWidget = ({ icon: Icon, label, value, subtitle, className = '' }) => {
  return (
    <div className={`glass rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Stats container component
 */
const StatsContainer = ({ teams, leaderboard }) => {
  const totalTeams = teams.length;
  const averageScore = calculateAverage(teams.map(t => t.score || 0));
  const leader = leaderboard[0];
  const leaderGap = leader && leaderboard[1] 
    ? leader.score - leaderboard[1].score 
    : 0;
  const lastUpdate = teams.length > 0 
    ? teams.reduce((latest, team) => {
        const teamDate = new Date(team.updated_at || team.created_at);
        return teamDate > latest ? teamDate : latest;
      }, new Date(0))
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsWidget
        icon={Users}
        label="Total d'équipes"
        value={formatNumber(totalTeams)}
        subtitle="Équipes enregistrées"
      />
      <StatsWidget
        icon={TrendingUp}
        label="Score moyen"
        value={formatNumber(averageScore)}
        subtitle="Points par équipe"
      />
      <StatsWidget
        icon={Trophy}
        label="Équipe leader"
        value={leader?.name || 'Aucune'}
        subtitle={leaderGap > 0 ? `Écart: ${formatNumber(leaderGap)} pts` : 'En tête'}
      />
      <StatsWidget
        icon={Clock}
        label="Dernière mise à jour"
        value={lastUpdate ? formatDate(lastUpdate) : 'Jamais'}
        subtitle="Dernière modification"
      />
    </div>
  );
};

export default StatsContainer;

