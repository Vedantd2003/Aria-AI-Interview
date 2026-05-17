import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getVapi } from '../lib/vapi';
import { api } from '../lib/axios';
import { useInterviewStore } from '../store/interview.store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

// Always return a renderable string regardless of what Vapi throws
function extractErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object') {
    const o = err as AnyRecord;
    // Vapi error shape: { type, error: { message, statusCode }, ... }
    if (typeof o.error?.message === 'string') return o.error.message;
    if (typeof o.message === 'string') return o.message;
    if (typeof o.error === 'string') return o.error;
  }
  return 'Voice connection error';
}

export function useVapi(interviewId: string) {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vapiRef = useRef(getVapi());
  const endedRef = useRef(false);
  const listenersRef = useRef(false);

  const startCall = useCallback(
    async (vapiConfig: AnyRecord) => {
      const vapi = vapiRef.current;
      endedRef.current = false;

      // Attach listeners only once per hook instance
      if (!listenersRef.current) {
        listenersRef.current = true;

        vapi.on('call-start', () => {
          useInterviewStore.getState().setIsCallActive(true);
          useInterviewStore.getState().setStatus('in_progress');
          timerRef.current = setInterval(() => {
            useInterviewStore.setState((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 }));
          }, 1000);
        });

        vapi.on('speech-start', () => useInterviewStore.getState().setIsSpeaking(true));
        vapi.on('speech-end', () => useInterviewStore.getState().setIsSpeaking(false));
        vapi.on('volume-level', (v: number) => useInterviewStore.getState().setVolumeLevel(v));

        vapi.on('message', (msg: AnyRecord) => {
          if (msg?.type === 'transcript' && msg.transcriptType === 'final') {
            useInterviewStore.getState().appendTranscript({
              role: msg.role === 'assistant' ? 'assistant' : 'user',
              text: msg.transcript,
              ts: new Date().toISOString(),
            });
          }
          if (msg?.call?.id && !useInterviewStore.getState().vapiCallId) {
            useInterviewStore.getState().setVapiCallId(msg.call.id);
          }
        });

        vapi.on('call-end', async () => {
          if (endedRef.current) return;
          endedRef.current = true;
          if (timerRef.current) clearInterval(timerRef.current);
          useInterviewStore.getState().setIsCallActive(false);
          useInterviewStore.getState().setIsSpeaking(false);

          try {
            const { transcript, vapiCallId } = useInterviewStore.getState();
            await api.post(`/interviews/${interviewId}/end`, { transcript, vapiCallId });
            await api.post(`/feedback/${interviewId}`);
          } catch {
            // best-effort save; navigate regardless
          }
          navigate(`/feedback/${interviewId}`);
        });

        vapi.on('error', (err: unknown) => {
          console.error('Vapi error:', err);
          // extractErrorMessage ensures we always pass a string — never an
          // object — to toast, which would otherwise trigger React error #31
          toast.error(extractErrorMessage(err));
        });
      }

      // Pass the full inline config — Vapi creates a transient assistant
      // for this specific web call, no dashboard assistant ID required
      await vapi.start(vapiConfig as Parameters<typeof vapi.start>[0]);
    },
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
