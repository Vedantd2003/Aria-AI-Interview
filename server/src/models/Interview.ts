import mongoose, { Document, Schema } from 'mongoose';

export type InterviewRole =
  | 'Frontend'
  | 'Backend'
  | 'Full-Stack'
  | 'System Design'
  | 'Behavioral'
  | 'DSA';

export type InterviewDifficulty = 'easy' | 'medium' | 'hard';
export type InterviewStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

interface TranscriptEntry {
  role: 'user' | 'assistant';
  text: string;
  ts: Date;
}

export interface IInterview extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  duration: number;
  status: InterviewStatus;
  vapiCallId?: string;
  transcript: TranscriptEntry[];
  questions: string[];
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TranscriptEntrySchema = new Schema<TranscriptEntry>(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true },
    ts: { type: Date, default: Date.now },
  },
  { _id: false }
);

const InterviewSchema = new Schema<IInterview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: {
      type: String,
      enum: ['Frontend', 'Backend', 'Full-Stack', 'System Design', 'Behavioral', 'DSA'],
      required: true,
    },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    duration: { type: Number, required: true, min: 5, max: 60 },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed'],
      default: 'pending',
    },
    vapiCallId: { type: String },
    transcript: { type: [TranscriptEntrySchema], default: [] },
    questions: { type: [String], default: [] },
    startedAt: { type: Date },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

export const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
