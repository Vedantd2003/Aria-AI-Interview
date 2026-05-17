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
  const endedRef = useRef(false);

  const startCall = useCallback(
    async (vapiAssistantId: string, assistantOverrides: AnyRecord) => {
      const vapi = vapiRef.current;
      endedRef.current = false;

      vapi.on('call-start', () => {
        store.setIsCallActive(true);
        store.setStatus('in_progress');
        timerRef.current = setInterval(() => {
          useInterviewStore.setState((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 }));
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
        if (msg?.call?.id && !store.vapiCallId) {
          store.setVapiCallId(msg.call.id);
        }
      });

      vapi.on('call-end', async () => {
        if (endedRef.current) return;
        endedRef.current = true;
        if (timerRef.current) clearInterval(timerRef.current);
        store.setIsCallActive(false);
        store.setIsSpeaking(false);

        try {
          const currentTranscript = useInterviewStore.getState().transcript;
          const currentCallId = useInterviewStore.getState().vapiCallId;
          await api.post(`/interviews/${interviewId}/end`, {
            transcript: currentTranscript,
            vapiCallId: currentCallId,
          });
          await api.post(`/feedback/${interviewId}`);
        } catch {
          // Best-effort — still navigate to feedback
        }
        navigate(`/feedback/${interviewId}`);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vapi.on('error', (err: any) => {
        console.error('Vapi error:', err);
        const msg = err?.error?.message || err?.message || 'Voice connection error';
        toast.error(msg);
      });

      // Start using the pre-built assistant ID with dynamic overrides
      await vapi.start(vapiAssistantId, assistantOverrides);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [interviewId, navigate]
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
      if (!endedRef.current) vapiRef.current.stop();
    };
  }, []);

  return { startCall, endCall, toggleMute };
}
