import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface InsightsListProps {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

function InsightSection({
  icon: Icon,
  title,
  items,
  color,
  delay,
}: {
  icon: typeof CheckCircle;
  title: string;
  items: string[];
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} style={{ color }} />
        <h3 className="font-semibold text-[#F5F5F7]">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm text-[#9A9AA8] leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function InsightsList({ strengths, weaknesses, suggestions }: InsightsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InsightSection
        icon={CheckCircle}
        title="Strengths"
        items={strengths}
        color="#10B981"
        delay={0.2}
      />
      <InsightSection
        icon={AlertCircle}
        title="Areas to Improve"
        items={weaknesses}
        color="#F43F5E"
        delay={0.3}
      />
      <InsightSection
        icon={Lightbulb}
        title="Next Steps"
        items={suggestions}
        color="#F59E0B"
        delay={0.4}
      />
    </div>
  );
}
