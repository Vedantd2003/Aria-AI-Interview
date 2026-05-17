import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Choose your role',
    description:
      'Pick the interview type, difficulty level, and duration. Optionally upload your resume for a personalized session.',
  },
  {
    number: '02',
    title: 'Talk to ARIA',
    description:
      'Have a real conversation. ARIA asks questions, listens, follows up, and adapts to your answers — just like a human interviewer.',
  },
  {
    number: '03',
    title: 'Get your report',
    description:
      'Receive a detailed scored report instantly: strengths, gaps, and concrete next steps to improve before the real interview.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6" style={{ background: 'rgba(14,14,20,0.6)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-[#22D3EE] uppercase tracking-widest mb-4">
            How it works
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F5F5F7]">
            Three steps to
            <br />
            <span className="gradient-text italic">interview ready</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div
            className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(34,211,238,0.3), transparent)' }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(34,211,238,0.1))',
                  border: '1px solid rgba(139,92,246,0.3)',
                }}
              >
                <span className="font-mono text-lg font-bold gradient-text">{step.number}</span>
              </div>
              <h3 className="text-[#F5F5F7] text-xl font-semibold mb-3 text-center md:text-left">
                {step.title}
              </h3>
              <p className="text-[#9A9AA8] leading-relaxed text-center md:text-left">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
