import { motion } from 'framer-motion';
import { formatDuration } from '../../lib/utils';

interface TimerProps {
  seconds: number;
  duration: number;
}

export function Timer({ seconds, duration }: TimerProps) {
  const totalSeconds = duration * 60;
  const progress = Math.min(1, seconds / totalSeconds);
  const isNearEnd = progress > 0.85;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-24 right-6 z-20"
    >
      <div
        className="px-4 py-2 rounded-xl flex items-center gap-3"
        style={{
          background: 'rgba(14,14,20,0.9)',
          border: `1px solid ${isNearEnd ? 'rgba(244,63,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: isNearEnd ? '#F43F5E' : '#10B981' }}
        />
        <span
          className="font-mono text-sm font-medium"
          style={{ color: isNearEnd ? '#F43F5E' : '#F5F5F7' }}
        >
          {formatDuration(seconds)}
        </span>
        <span className="text-xs text-[#9A9AA8]">/ {duration}m</span>
      </div>
    </motion.div>
  );
}
