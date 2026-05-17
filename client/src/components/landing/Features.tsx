import { motion } from 'framer-motion';
import { Mic, Target, FileText, Zap } from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Voice-first',
    description:
      'Talk naturally with ARIA like you would in a real interview. No typing, no lag — pure conversation.',
    color: '#8B5CF6',
  },
  {
    icon: Target,
    title: 'Role-specific',
    description:
      'Choose your track: Frontend, Backend, Full-Stack, System Design, DSA, or Behavioral. ARIA adapts.',
    color: '#22D3EE',
  },
  {
    icon: FileText,
    title: 'Resume-aware',
    description:
      'Upload your resume and ARIA incorporates your background into questions — just like a real interviewer.',
    color: '#10B981',
  },
  {
    icon: Zap,
    title: 'Instant feedback',
    description:
      'Get scored on technical accuracy, communication, confidence, and problem-solving the moment the call ends.',
    color: '#F59E0B',
  },
];

export function Features() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-medium text-[#8B5CF6] uppercase tracking-widest mb-4">
          Why ARIA
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-[#F5F5F7]">
          Everything you need to
          <br />
          <span className="gradient-text italic">ace the interview</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card p-6 cursor-default group"
            style={{
              transition: 'all 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${f.color}18` }}
            >
              <f.icon size={22} style={{ color: f.color }} />
            </div>
            <h3 className="text-[#F5F5F7] font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-[#9A9AA8] text-sm leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
