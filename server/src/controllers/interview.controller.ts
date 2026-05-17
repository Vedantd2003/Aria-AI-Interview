import { Request, Response } from 'express';
import { z } from 'zod';
import { Interview } from '../models/Interview';
import { User } from '../models/User';
import { buildAssistantConfig } from '../services/vapi.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { env } from '../config/env';

const createSchema = z.object({
  role: z.enum(['Frontend', 'Backend', 'Full-Stack', 'System Design', 'Behavioral', 'DSA']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  duration: z.number().min(5).max(60),
});

export const createInterview = asyncHandler(async (req: Request, res: Response) => {
  const { role, difficulty, duration } = createSchema.parse(req.body);
  const userId = req.userId!;

  const user = await User.findById(userId).select('name resumeText');
  if (!user) throw ApiError.notFound('User not found');

  const interview = await Interview.create({
    userId,
    role,
    difficulty,
    duration,
    status: 'pending',
  });

  const serverUrl = `${env.NODE_ENV === 'production' ? 'https' : 'http'}://${req.get('host')}/api/webhooks/vapi`;

  const assistantConfig = buildAssistantConfig({
    userName: user.name,
    role,
    difficulty,
    duration,
    resumeText: user.resumeText,
    serverUrl,
  });

  res.status(201).json({
    success: true,
    interview: {
      id: interview._id,
      role,
      difficulty,
      duration,
      status: interview.status,
    },
    assistantConfig,
    vapiPublicKey: env.VAPI_PUBLIC_KEY,
  });
});

export const listInterviews = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(20, parseInt(req.query.limit as string) || 10);
  const skip = (page - 1) * limit;

  const [interviews, total] = await Promise.all([
    Interview.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-transcript'),
    Interview.countDocuments({ userId: req.userId }),
  ]);

  res.json({
    success: true,
    interviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getInterview = asyncHandler(async (req: Request, res: Response) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!interview) throw ApiError.notFound('Interview not found');
  res.json({ success: true, interview });
});

export const endInterview = asyncHandler(async (req: Request, res: Response) => {
  const { transcript = [], vapiCallId } = req.body as {
    transcript?: Array<{ role: 'user' | 'assistant'; text: string; ts?: string }>;
    vapiCallId?: string;
  };

  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!interview) throw ApiError.notFound('Interview not found');
  if (interview.status === 'completed') {
    res.json({ success: true, interview });
    return;
  }

  interview.status = 'completed';
  interview.endedAt = new Date();
  if (vapiCallId) interview.vapiCallId = vapiCallId;
  if (transcript.length > 0) {
    interview.transcript = transcript.map((t) => ({
      role: t.role,
      text: t.text,
      ts: t.ts ? new Date(t.ts) : new Date(),
    }));
  }

  await interview.save();
  res.json({ success: true, interview });
});
