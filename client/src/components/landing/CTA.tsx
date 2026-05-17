import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center glass-card p-16"
        style={{
          background:
            'linear-gradient(145deg, rgba(139,92,246,0.08), rgba(34,211,238,0.04))',
          boxShadow: '0 0 80px rgba(139,92,246,0.1)',
        }}
      >
        <h2 className="font-serif text-5xl md:text-6xl text-[#F5F5F7] mb-4">
          Ready to level up?
        </h2>
        <p className="text-[#9A9AA8] text-lg mb-10 max-w-xl mx-auto">
          Your next interview is closer than you think. Start practicing with ARIA today.
        </p>
        <Link
          to="/register"
          className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl font-medium text-white text-lg"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
            boxShadow: '0 0 60px rgba(139,92,246,0.4)',
          }}
        >
          Start free interview
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}
