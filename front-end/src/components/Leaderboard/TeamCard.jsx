import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react';
import { getTrendDisplay, formatNumber } from '../../utils/helpers';

/**
 * Team card component with score animation
 */
const TeamCard = ({ team, rank, isLeader = false }) => {
  const { icon, color, label } = getTrendDisplay(team.trend);
  const [displayScore, setDisplayScore] = useState(team.score || 0);

  // Animate score change
  useEffect(() => {
    const targetScore = team.score || 0;
    const duration = 1000;
    const startScore = displayScore;
    const difference = targetScore - startScore;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentScore = Math.round(startScore + difference * easeOutQuart);
      setDisplayScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    if (targetScore !== displayScore) {
      requestAnimationFrame(animate);
    }
  }, [team.score]);

  const TrendIcon = team.trend === 'up' ? TrendingUp : team.trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={`glass rounded-lg p-3 sm:p-4 transition-smooth hover:scale-[1.02] hover:shadow-lg ${isLeader ? 'ring-2 ring-warning' : ''
        }`}
      style={{
        animation: 'slideUp 0.3s ease-out',
        animationDelay: `${rank * 0.05}s`,
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Rank and Team Info */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex-shrink-0">
            <span
              className={`text-xl sm:text-2xl font-bold ${rank <= 3 ? 'text-primary' : 'text-slate-500'
                }`}
              aria-label={`Position ${rank}`}
            >
              #{rank}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base sm:text-lg truncate">{team.name}</h3>
              {isLeader && (
                <Crown
                  className="w-4 h-4 sm:w-5 sm:h-5 text-warning flex-shrink-0"
                  aria-label="Équipe leader"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">
                {team.members?.join(', ') || 'Aucun membre'}
              </span>
            </div>
          </div>
        </div>

        {/* Score and Trend */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {formatNumber(displayScore)}
            </div>
            <div className="text-xs text-slate-500">points</div>
          </div>

          <div
            className={`flex items-center gap-1 ${color}`}
            aria-label={`Tendance: ${label}`}
            title={label}
          >
            <TrendIcon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TeamCard);

