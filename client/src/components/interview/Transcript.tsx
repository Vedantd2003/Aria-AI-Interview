import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';
import { TranscriptEntry } from '../../types';

interface TranscriptProps {
  entries: TranscriptEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export function Transcript({ entries, isOpen, onClose }: TranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          className="fixed right-0 top-0 bottom-0 w-80 z-30 flex flex-col"
          style={{
            background: 'rgba(14,14,20,0.95)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[#8B5CF6]" />
              <span className="text-sm font-medium text-[#F5F5F7]">Live Transcript</span>
            </div>
            <button
              onClick={onClose}
              className="text-[#9A9AA8] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare size={32} className="text-[#9A9AA8] mb-3 opacity-40" />
                <p className="text-[#9A9AA8] text-sm">Transcript will appear here during the interview</p>
              </div>
            ) : (
              entries.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${entry.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{
                      background:
                        entry.role === 'assistant'
                          ? 'linear-gradient(135deg, #8B5CF6, #22D3EE)'
                          : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    {entry.role === 'assistant' ? 'A' : 'Y'}
                  </div>
                  <div
                    className="flex-1 px-3 py-2 rounded-xl text-xs leading-relaxed max-w-[85%]"
                    style={{
                      background:
                        entry.role === 'assistant'
                          ? 'rgba(139,92,246,0.1)'
                          : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: entry.role === 'assistant' ? '#F5F5F7' : '#9A9AA8',
                    }}
                  >
                    {entry.text}
                  </div>
                </motion.div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
