import {
  Radar,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { FeedbackScores } from '../../types';

interface RadarChartProps {
  scores: FeedbackScores;
}

export function RadarChart({ scores }: RadarChartProps) {
  const data = [
    { subject: 'Technical', value: scores.technical },
    { subject: 'Communication', value: scores.communication },
    { subject: 'Confidence', value: scores.confidence },
    { subject: 'Problem Solving', value: scores.problemSolving },
    { subject: 'Overall', value: scores.overall },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-[#F5F5F7] font-semibold mb-4 text-center">Performance Radar</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ReRadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#9A9AA8', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9A9AA8', fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
