import { Request, Response } from 'express';

// Structured error envelope, consistent across every endpoint.
// { error: { code, message, field?, request_id } }
export function sendError(
  req: Request,
  res: Response,
  status: number,
  code: string,
  message: string,
  field?: string,
): Response {
  return res.status(status).json({
    error: {
      code,
      message,
      ...(field ? { field } : {}),
      request_id: req.id,
    },
  });
}
