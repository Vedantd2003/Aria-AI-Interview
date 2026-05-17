import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#07070B',
          elevated: '#0E0E14',
          glass: 'rgba(255,255,255,0.04)',
        },
        border: 'rgba(255,255,255,0.08)',
        text: {
          primary: '#F5F5F7',
          secondary: '#9A9AA8',
        },
        accent: {
          violet: '#8B5CF6',
          cyan: '#22D3EE',
        },
        danger: '#F43F5E',
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        card: '20px',
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
        'card-gradient': 'linear-gradient(145deg, rgba(139,92,246,0.08), rgba(34,211,238,0.04))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
