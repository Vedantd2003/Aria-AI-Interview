import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getVapi } from '../lib/vapi';
import { api } from '../lib/axios';
import { useInterviewStore } from '../store/interview.store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export function useVapi(interviewId: string) {
  const navigate = useNavigate();
  const store = useInterviewStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vapiRef = useRef(getVapi());

  const startCall = useCallback(
    async (assistantConfig: AnyRecord) => {
      const vapi = vapiRef.current;

      vapi.on('call-start', () => {
        store.setIsCallActive(true);
        store.setStatus('in_progress');
        timerRef.current = setInterval(() => {
          store.setElapsedSeconds(store.elapsedSeconds + 1);
        }, 1000);
      });

      vapi.on('speech-start', () => store.setIsSpeaking(true));
      vapi.on('speech-end', () => store.setIsSpeaking(false));

      vapi.on('volume-level', (v: number) => store.setVolumeLevel(v));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vapi.on('message', (msg: any) => {
        if (msg?.type === 'transcript' && msg.transcriptType === 'final') {
          store.appendTranscript({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            text: msg.transcript,
            ts: new Date().toISOString(),
          });
        }
        if (msg?.type === 'call-update' && msg.call?.id) {
          store.setVapiCallId(msg.call.id);
        }
      });

      vapi.on('call-end', async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        store.setIsCallActive(false);
        store.setStatus('completed');

        try {
          await api.post(`/interviews/${interviewId}/end`, {
            transcript: store.transcript,
            vapiCallId: store.vapiCallId,
          });
          await api.post(`/feedback/${interviewId}`);
          navigate(`/feedback/${interviewId}`);
        } catch {
          toast.error('Failed to save interview. Redirecting anyway.');
          navigate(`/feedback/${interviewId}`);
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vapi.on('error', (err: any) => {
        console.error('Vapi error:', err);
        toast.error('Voice connection error. Please try again.');
      });

      await vapi.start(assistantConfig);
    },
    [interviewId, navigate, store]
  );

  const endCall = useCallback(() => {
    vapiRef.current.stop();
  }, []);

  const toggleMute = useCallback(() => {
    const vapi = vapiRef.current;
    const muted = vapi.isMuted();
    vapi.setMuted(!muted);
    return !muted;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      vapiRef.current.stop();
    };
  }, []);

  return { startCall, endCall, toggleMute };
}
