import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/errors';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ error: err.message, details: err.details || undefined });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}
