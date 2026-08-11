import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- required by Express's own declaration-merging pattern for extending Request
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

// Stamps every request with an ID so error responses and logs can be
// correlated. Accepts an inbound X-Request-Id so a caller (or a proxy
// in front of this service) can propagate its own trace ID.
export function requestId(req: Request, res: Response, next: NextFunction): void {
  req.id = (req.header('X-Request-Id') || randomUUID());
  res.setHeader('X-Request-Id', req.id);
  next();
}
