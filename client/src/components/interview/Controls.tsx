import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, PhoneOff, MessageSquare } from 'lucide-react';

interface ControlsProps {
  onEndCall: () => void;
  onToggleMute: () => boolean;
  onToggleTranscript: () => void;
  isCallActive: boolean;
}

export function Controls({ onEndCall, onToggleMute, onToggleTranscript, isCallActive }: ControlsProps) {
  const [isMuted, setIsMuted] = useState(false);

  const handleMute = () => {
    const muted = onToggleMute();
    setIsMuted(muted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20"
    >
      <div
        className="flex items-center gap-3 px-6 py-4 rounded-2xl"
        style={{
          background: 'rgba(14,14,20,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Transcript toggle */}
        <button
          onClick={onToggleTranscript}
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          title="Toggle transcript"
        >
          <MessageSquare size={18} className="text-[#9A9AA8]" />
        </button>

        {/* Mute */}
        <button
          onClick={handleMute}
          disabled={!isCallActive}
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-40"
          style={{
            background: isMuted ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isMuted ? 'rgba(244,63,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
          }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <MicOff size={18} className="text-[#F43F5E]" />
          ) : (
            <Mic size={18} className="text-[#9A9AA8]" />
          )}
        </button>

        {/* End call */}
        <button
          onClick={onEndCall}
          disabled={!isCallActive}
          className="w-14 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-40"
          style={{
            background: 'rgba(244,63,94,0.15)',
            border: '1px solid rgba(244,63,94,0.4)',
          }}
          title="End interview"
        >
          <PhoneOff size={18} className="text-[#F43F5E]" />
        </button>
      </div>
    </motion.div>
  );
}
