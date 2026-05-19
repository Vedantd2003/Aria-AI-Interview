import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getVapi } from '../lib/vapi';
import { api } from '../lib/axios';
import { useInterviewStore } from '../store/interview.store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

// Always return a plain string — never pass an object to toast (React error #31)
function extractErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object') {
    const o = err as AnyRecord;
    const statusCode = o.error?.statusCode ?? o.statusCode;
    if (statusCode === 403) return 'Voice call blocked (403). The proxy may need a moment — please try again.';
    if (statusCode === 401) return 'Invalid Vapi API key. Check VITE_VAPI_PUBLIC_KEY.';
    if (typeof o.error?.message === 'string') return o.error.message;
    if (typeof o.message === 'string') return o.message;
    if (typeof o.error === 'string') return o.error;
  }
  return 'Voice connection error. Please try again.';
}

export function useVapi(interviewId: string) {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vapiRef = useRef(getVapi());
  const endedRef = useRef(false);
  const listenersRef = useRef(false);

  const startCall = useCallback(
    async (assistantId: string, overrides: AnyRecord) => {
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
          // Log full details for debugging — never just "Object"
          try { console.error('Vapi error:', JSON.stringify(err, null, 2)); } catch { console.error('Vapi error:', err); }
          toast.error(extractErrorMessage(err));
        });
      }

      // Use the pre-configured assistant ID with dynamic overrides.
      // The key doesn't allow transient (inline) assistants, but it does
      // allow overriding a named assistant's firstMessage + system prompt.
      await vapi.start(assistantId, overrides as Parameters<typeof vapi.start>[1]);
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
