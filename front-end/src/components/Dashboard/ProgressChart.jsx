import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../utils/helpers';

/**
 * Progress chart component for top teams
 */
const ProgressChart = ({ leaderboard }) => {
  // For now, we'll show current scores
  // In a real app, you'd have historical data
  const top5 = leaderboard.slice(0, 5);

  const chartData = top5.map((team, index) => ({
    name: team.name.length > 10 ? team.name.substring(0, 10) + '...' : team.name,
    fullName: team.name,
    score: team.score || 0,
    rank: index + 1,
  }));

  if (chartData.length === 0) {
    return (
      <div className="glass rounded-lg p-8 text-center text-slate-500">
        <p>Aucune donnée disponible pour le graphique</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Progression des 5 premières équipes</h3>
      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={80}
            className="sm:text-xs"
          />
          <YAxis
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => formatNumber(value)}
            className="sm:text-xs"
          />
          <Tooltip
            formatter={(value) => formatNumber(value)}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullName;
              }
              return label;
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;

