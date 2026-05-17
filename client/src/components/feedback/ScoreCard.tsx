import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel } from '../../lib/utils';

interface ScoreCardProps {
  label: string;
  score: number;
  delay?: number;
}

export function ScoreCard({ label, score, delay = 0 }: ScoreCardProps) {
  const color = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm text-[#9A9AA8] font-medium">{label}</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
          {scoreLabel}
        </span>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[#9A9AA8] text-sm mb-1">/100</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </motion.div>
  );
}
