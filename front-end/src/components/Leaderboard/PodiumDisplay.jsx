import React, { useEffect, useRef } from 'react';
import { Medal, Crown } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';
import { MEDAL_COLORS } from '../../utils/constants';

/**
 * Confetti animation component
 */
const Confetti = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

    // Create confetti particles
    for (let i = 0; i < 50; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -10,
        width: Math.random() * 10 + 5,
        height: Math.random() * 10 + 5,
        speed: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((particle, index) => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
        ctx.restore();

        particle.y += particle.speed;
        particle.rotation += particle.rotationSpeed;

        if (particle.y > canvas.height) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
};

/**
 * Podium step component
 */
const PodiumStep = ({ team, position, medalColor, height }) => {
  if (!team) {
    return (
      <div
        className="flex flex-col items-center justify-end"
        style={{ height: `${height}px` }}
        aria-label={`Position ${position} - Vide`}
      >
        <div className="w-20 sm:w-24 md:w-32 bg-slate-200 dark:bg-slate-700 rounded-t-lg h-full flex items-center justify-center text-slate-400">
          <span className="text-sm">-</span>
        </div>
      </div>
    );
  }

  const isFirst = position === 1;

  return (
    <div
      className="flex flex-col items-center justify-end transition-smooth"
      style={{ height: `${height}px` }}
      aria-label={`Position ${position}: ${team.name}`}
    >
      {/* Team Info */}
      <div className="mb-1 sm:mb-2 text-center px-1">
        {isFirst && (
          <Crown
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-warning mx-auto mb-1 animate-bounce"
            aria-label="Champion"
          />
        )}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
          <Medal
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            style={{ color: medalColor }}
            aria-hidden="true"
          />
          <h3 className="font-bold text-xs sm:text-sm md:text-lg truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">
            {team.name}
          </h3>
        </div>
        <div className="text-base sm:text-xl md:text-2xl font-bold text-primary mb-1">
          {formatNumber(team.score || 0)}
        </div>
        <div className="hidden sm:block text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate max-w-[120px] md:max-w-none mx-auto">
          {team.members?.slice(0, 2).join(', ') || 'Aucun membre'}
          {team.members?.length > 2 && '...'}
        </div>
      </div>

      {/* Podium Step */}
      <div
        className="w-20 sm:w-24 md:w-32 rounded-t-lg flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl shadow-lg transition-smooth hover:scale-105"
        style={{
          backgroundColor: medalColor,
          height: `${height}px`,
        }}
      >
        #{position}
      </div>
    </div>
  );
};

/**
 * Main Podium Display component
 */
const PodiumDisplay = ({ topTeams }) => {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const previousLeader = React.useRef(null);

  useEffect(() => {
    if (topTeams[0] && topTeams[0].id !== previousLeader.current) {
      previousLeader.current = topTeams[0].id;
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [topTeams]);

  // Responsive heights
  const heights = {
    mobile: { 1: 120, 2: 90, 3: 70 },
    tablet: { 1: 160, 2: 120, 3: 95 },
    desktop: { 1: 200, 2: 150, 3: 120 },
  };

  const positions = [2, 1, 3]; // Display order: 2nd, 1st, 3rd

  return (
    <div className="relative mb-6 sm:mb-8" aria-label="Podium du classement">
      <Confetti active={showConfetti} />
      <div className="flex items-end justify-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4">
        {positions.map((position) => {
          const team = topTeams[position - 1];
          const medalColors = {
            1: MEDAL_COLORS.gold,
            2: MEDAL_COLORS.silver,
            3: MEDAL_COLORS.bronze,
          };

          // Use CSS classes for responsive heights
          const heightClass = position === 1
            ? 'h-[120px] sm:h-[160px] md:h-[200px]'
            : position === 2
              ? 'h-[90px] sm:h-[120px] md:h-[150px]'
              : 'h-[70px] sm:h-[95px] md:h-[120px]';

          return (
            <div key={position} className={heightClass}>
              <PodiumStep
                team={team}
                position={position}
                medalColor={medalColors[position]}
                height={heights.desktop[position]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(PodiumDisplay);
