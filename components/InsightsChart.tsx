import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Persona } from '../types';

interface InsightsChartProps {
  personas: Persona[];
}

export const InsightsChart: React.FC<InsightsChartProps> = ({ personas }) => {
  // Transform data for the chart
  // We will visualize 3 dimensions: Score, Pain Point Count, Motivation Count (normalized loosely)
  const data = personas.map((p) => ({
    subject: p.role.split(' ')[0], // Shorten name
    Score: p.compatibilityScore,
    PainPoints: p.painPoints.length * 20, // Scale for visibility
    Motivations: p.motivations.length * 20, // Scale for visibility
    fullRole: p.role
  }));

  return (
    <div className="w-full h-[300px] bg-slate-800/50 rounded-xl border border-slate-700 p-4">
      <h3 className="text-lg font-semibold text-white mb-2">Compatibility Analysis</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Fit Score"
            dataKey="Score"
            stroke="#6366f1"
            strokeWidth={3}
            fill="#6366f1"
            fillOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
            itemStyle={{ color: '#818cf8' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};