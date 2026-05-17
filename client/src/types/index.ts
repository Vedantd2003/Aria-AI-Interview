export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  resumeText?: string;
}

export type InterviewRole =
  | 'Frontend'
  | 'Backend'
  | 'Full-Stack'
  | 'System Design'
  | 'Behavioral'
  | 'DSA';

export type InterviewDifficulty = 'easy' | 'medium' | 'hard';
export type InterviewStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface TranscriptEntry {
  role: 'user' | 'assistant';
  text: string;
  ts: string;
}

export interface Interview {
  _id: string;
  userId: string;
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  duration: number;
  status: InterviewStatus;
  vapiCallId?: string;
  transcript: TranscriptEntry[];
  questions: string[];
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackScores {
  technical: number;
  communication: number;
  confidence: number;
  problemSolving: number;
  overall: number;
}

export interface Feedback {
  _id: string;
  interviewId: string;
  userId: string;
  scores: FeedbackScores;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
  generatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  interviews: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
