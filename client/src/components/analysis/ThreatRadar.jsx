import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export const ThreatRadar = ({ factorContributions = [] }) => {
  if (!factorContributions || factorContributions.length === 0) {
    return null;
  }

  // Normalize data for Radar
  const data = factorContributions.map((fc) => ({
    factor: fc.factor,
    score: fc.score || 0,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-64 flex flex-col items-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#233554" />
          <PolarAngleAxis
            dataKey="factor"
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#233554" />
          <Radar
            name="Threat Score"
            dataKey="score"
            stroke="#14B8A6"
            fill="#0D9488"
            fillOpacity={0.45}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
