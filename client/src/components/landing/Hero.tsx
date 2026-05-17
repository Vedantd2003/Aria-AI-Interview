import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mic } from 'lucide-react';
import gsap from 'gsap';

export function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
      gsap.from(subtitleRef.current, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background orb glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.06) 40%, transparent 70%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
          style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.3)',
          }}
        >
          <Mic size={14} className="text-[#8B5CF6]" />
          <span className="text-[#9A9AA8]">Voice-first AI interviewer</span>
        </motion.div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="font-serif text-6xl md:text-7xl lg:text-8xl font-normal leading-none tracking-tight mb-6"
          style={{ color: '#F5F5F7' }}
        >
          Practice interviews
          <br />
          <span className="gradient-text italic">that feel real.</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-[#9A9AA8] max-w-2xl mx-auto mb-10 text-balance"
        >
          ARIA is your AI interview coach. Talk through real technical questions, get scored
          feedback on every dimension, and level up before the real thing.
        </p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-white transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
              boxShadow: '0 0 40px rgba(139,92,246,0.3)',
            }}
          >
            Start free interview
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F5F5F7',
            }}
          >
            Sign in
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-sm text-[#9A9AA8]"
        >
          No credit card required · Start in 30 seconds
        </motion.p>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #07070B)' }}
      />
    </section>
  );
}
