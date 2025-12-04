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
    <div className="glass rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Progression des 5 premières équipes</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatNumber(value)}
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
          <Legend />
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

