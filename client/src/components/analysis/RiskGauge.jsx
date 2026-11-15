import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getThreatDetails } from '../../constants/threatLevels';

export const RiskGauge = ({ score = 0, size = 220 }) => {
  const threat = getThreatDetails(score);

  // Gauge data: current score slice and remainder slice up to 100
  const validScore = Math.max(0, Math.min(100, Math.round(score)));
  const data = [
    { name: 'Risk', value: validScore },
    { name: 'Remaining', value: 100 - validScore },
  ];

  const colors = [threat.color, '#1E3A8A44'];

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div style={{ width: size, height: size * 0.65 }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.35}
              outerRadius={size * 0.48}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text Overlay */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center text-center">
          <span
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: threat.color }}
          >
            {validScore}
          </span>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Risk Score / 100
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span
          className="inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
          style={{
            backgroundColor: `${threat.color}22`,
            color: threat.color,
            border: `1px solid ${threat.color}66`,
          }}
        >
          {threat.label}
        </span>
      </div>
    </div>
  );
};
