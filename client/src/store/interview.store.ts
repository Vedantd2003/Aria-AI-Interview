import { create } from 'zustand';
import { TranscriptEntry, InterviewStatus } from '../types';

interface InterviewState {
  interviewId: string | null;
  status: InterviewStatus | null;
  transcript: TranscriptEntry[];
  volumeLevel: number;
  isSpeaking: boolean;
  isCallActive: boolean;
  elapsedSeconds: number;
  vapiCallId: string | null;

  setInterviewId: (id: string) => void;
  setStatus: (s: InterviewStatus) => void;
  appendTranscript: (entry: TranscriptEntry) => void;
  setVolumeLevel: (v: number) => void;
  setIsSpeaking: (s: boolean) => void;
  setIsCallActive: (a: boolean) => void;
  setElapsedSeconds: (s: number) => void;
  setVapiCallId: (id: string) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  interviewId: null,
  status: null,
  transcript: [],
  volumeLevel: 0,
  isSpeaking: false,
  isCallActive: false,
  elapsedSeconds: 0,
  vapiCallId: null,

  setInterviewId: (id) => set({ interviewId: id }),
  setStatus: (s) => set({ status: s }),
  appendTranscript: (entry) => set((state) => ({ transcript: [...state.transcript, entry] })),
  setVolumeLevel: (v) => set({ volumeLevel: v }),
  setIsSpeaking: (s) => set({ isSpeaking: s }),
  setIsCallActive: (a) => set({ isCallActive: a }),
  setElapsedSeconds: (s) => set({ elapsedSeconds: s }),
  setVapiCallId: (id) => set({ vapiCallId: id }),
  reset: () =>
    set({
      interviewId: null,
      status: null,
      transcript: [],
      volumeLevel: 0,
      isSpeaking: false,
      isCallActive: false,
      elapsedSeconds: 0,
      vapiCallId: null,
    }),
}));
