import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { VoiceOrb } from '../components/interview/VoiceOrb';
import { Transcript } from '../components/interview/Transcript';
import { Controls } from '../components/interview/Controls';
import { Timer } from '../components/interview/Timer';
import { useVapi } from '../hooks/useVapi';
import { useInterviewStore } from '../store/interview.store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default function InterviewRoom() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [showTranscript, setShowTranscript] = useState(false);
  const [starting, setStarting] = useState(true);

  const store = useInterviewStore();
  const { startCall, endCall, toggleMute } = useVapi(id!);

  const assistantConfig = (location.state as { assistantConfig?: AnyRecord })?.assistantConfig;

  useEffect(() => {
    if (!assistantConfig) {
      toast.error('Interview session not found. Redirecting...');
      navigate('/interview/setup');
      return;
    }

    store.setInterviewId(id!);

    startCall(assistantConfig)
      .catch(() => toast.error('Failed to connect. Check your microphone permissions.'))
      .finally(() => setStarting(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick timer
  useEffect(() => {
    if (!store.isCallActive) return;
    const interval = setInterval(() => {
      store.setElapsedSeconds(store.elapsedSeconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.isCallActive, store.elapsedSeconds]);

  if (starting) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: '#07070B' }}
      >
        <Loader2 size={32} className="animate-spin text-[#8B5CF6]" />
        <p className="text-[#9A9AA8] text-sm">Connecting to ARIA...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: '#07070B' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: store.isSpeaking
            ? 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(34,211,238,0.06) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-20"
      >
        <div
          className="px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2"
          style={{
            background: 'rgba(14,14,20,0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: store.isSpeaking ? '#22D3EE' : store.isCallActive ? '#10B981' : '#9A9AA8',
              boxShadow: store.isSpeaking ? '0 0 8px #22D3EE' : store.isCallActive ? '0 0 8px #10B981' : 'none',
            }}
          />
          <span className="text-[#9A9AA8]">
            {store.isSpeaking ? 'ARIA is speaking...' : store.isCallActive ? 'Listening...' : 'Connecting...'}
          </span>
        </div>
      </motion.div>

      {/* Timer */}
      <Timer seconds={store.elapsedSeconds} duration={15} />

      {/* Voice orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-72 h-72">
          <VoiceOrb volumeLevel={store.volumeLevel} isSpeaking={store.isSpeaking} />
        </div>
      </div>

      {/* Transcript */}
      <Transcript
        entries={store.transcript}
        isOpen={showTranscript}
        onClose={() => setShowTranscript(false)}
      />

      {/* Controls */}
      <Controls
        onEndCall={endCall}
        onToggleMute={toggleMute}
        onToggleTranscript={() => setShowTranscript((v) => !v)}
        isCallActive={store.isCallActive}
      />
    </div>
  );
}
