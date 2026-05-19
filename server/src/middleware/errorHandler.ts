import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ZodError } from 'zod';

interface MongoError {
  code?: number;
  keyPattern?: Record<string, number>;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  if (err instanceof ZodError) {
    const fields = err.flatten().fieldErrors;
    // Pick the first meaningful message to surface as the top-level message
    const firstMsg = Object.values(fields).flat()[0] ?? 'Validation error';
    res.status(400).json({
      success: false,
      message: firstMsg,
      code: 'VALIDATION_ERROR',
      details: fields,
    });
    return;
  }

  // MongoDB duplicate key (E11000) — e.g. unique email constraint
  const mongoErr = err as MongoError;
  if (mongoErr?.code === 11000) {
    const field = Object.keys(mongoErr.keyPattern ?? {})[0] ?? 'field';
    res.status(409).json({
      success: false,
      message: `An account with this ${field} already exists`,
      code: 'DUPLICATE_KEY',
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
