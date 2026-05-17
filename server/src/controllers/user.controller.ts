import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { extractTextFromPDF } from '../services/resume.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const updateSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  avatar: z.string().url().optional(),
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const data = updateSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: data },
    { new: true }
  ).select('-passwordHash -refreshTokens');

  if (!user) throw ApiError.notFound('User not found');
  res.json({ success: true, user });
});

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest('No file provided');

  const text = await extractTextFromPDF(req.file.buffer);
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { resumeText: text } },
    { new: true }
  ).select('-passwordHash -refreshTokens');

  if (!user) throw ApiError.notFound('User not found');
  res.json({ success: true, resumeText: text, user });
});

export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(req.userId, { $unset: { resumeText: 1 } });
  res.json({ success: true, message: 'Resume removed' });
});
