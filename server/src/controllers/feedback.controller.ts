import { Request, Response } from 'express';
import { Interview } from '../models/Interview';
import { Feedback } from '../models/Feedback';
import { generateFeedback } from '../services/openai.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const createFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { interviewId } = req.params;

  const interview = await Interview.findOne({
    _id: interviewId,
    userId: req.userId,
  });
  if (!interview) throw ApiError.notFound('Interview not found');
  if (interview.status !== 'completed') throw ApiError.badRequest('Interview not completed');

  const existing = await Feedback.findOne({ interviewId });
  if (existing) {
    res.json({ success: true, feedback: existing });
    return;
  }

  if (interview.transcript.length === 0) {
    throw ApiError.badRequest('No transcript available for feedback generation');
  }

  const result = await generateFeedback(
    interview.transcript,
    interview.role,
    interview.difficulty
  );

  const feedback = await Feedback.create({
    interviewId,
    userId: req.userId,
    ...result,
  });

  res.status(201).json({ success: true, feedback });
});

export const getFeedback = asyncHandler(async (req: Request, res: Response) => {
  const feedback = await Feedback.findOne({
    interviewId: req.params.interviewId,
    userId: req.userId,
  });

  if (!feedback) throw ApiError.notFound('Feedback not found');
  res.json({ success: true, feedback });
});
