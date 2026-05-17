import mongoose, { Document, Schema } from 'mongoose';

interface Scores {
  technical: number;
  communication: number;
  confidence: number;
  problemSolving: number;
  overall: number;
}

export interface IFeedback extends Document {
  _id: mongoose.Types.ObjectId;
  interviewId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  scores: Scores;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
  generatedAt: Date;
}

const ScoresSchema = new Schema<Scores>(
  {
    technical: { type: Number, min: 0, max: 100, required: true },
    communication: { type: Number, min: 0, max: 100, required: true },
    confidence: { type: Number, min: 0, max: 100, required: true },
    problemSolving: { type: Number, min: 0, max: 100, required: true },
    overall: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false }
);

const FeedbackSchema = new Schema<IFeedback>({
  interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  scores: { type: ScoresSchema, required: true },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
  summary: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
});

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
