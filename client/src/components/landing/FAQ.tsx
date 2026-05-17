import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is ARIA free to use?',
    a: 'Yes — get started for free with no credit card required. You can run full mock interviews immediately after signing up.',
  },
  {
    q: 'How realistic is the interview experience?',
    a: 'Very. ARIA uses a state-of-the-art voice model with natural pacing, follow-up questions, and role-specific question banks. Users consistently report it feels like talking to a real interviewer.',
  },
  {
    q: 'What roles does ARIA support?',
    a: 'Frontend, Backend, Full-Stack, System Design, Behavioral, and DSA. Each mode has a tailored question bank and evaluation criteria.',
  },
  {
    q: 'Can I upload my resume?',
    a: 'Yes. Upload a PDF resume and ARIA will reference your experience when asking questions — making the session feel truly personalized.',
  },
  {
    q: 'How is my feedback generated?',
    a: "After the interview, the transcript is analyzed by GPT-4o-mini with a structured scoring rubric. You'll get scores, strengths, weaknesses, and actionable suggestions within seconds.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 max-w-3xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="font-serif text-4xl text-[#F5F5F7] mb-4">
          Frequently asked questions
        </h2>
      </motion.div>

      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="text-[#F5F5F7] font-medium pr-4">{faq.q}</span>
              <ChevronDown
                size={18}
                className="text-[#9A9AA8] flex-shrink-0 transition-transform duration-200"
                style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0)' }}
              />
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? 'auto' : 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <p className="px-5 pb-5 text-[#9A9AA8] text-sm leading-relaxed">{faq.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
