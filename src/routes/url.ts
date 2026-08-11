import express, { Request, Response, Router } from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { Url } from '../models/url';
import { sendError } from '../lib/errors';

const router: Router = express.Router();

const nanoidPromise = import('nanoid').then((m) => m.nanoid);

// IP-based, no new infra: express-rate-limit's default store is in-memory.
// ponytail: resets on restart and doesn't share state across instances,
// swap for a Redis store if this ever runs multi-process behind a load balancer.
const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    sendError(req, res, 429, 'RATE_LIMITED', 'Too many requests, try again later');
  },
});

// Returns the normalized href (http/https only) or null. Storing the
// re-serialized URL instead of the raw input string means stray control
// characters (CR/LF etc.) that the WHATWG URL parser strips never survive
// into the DB, so they can't resurface later in a Location header.
function normalizeUrl(str: string): string | null {
  try {
    const u = new URL(str);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.href;
  } catch {
    return null;
  }
}

router.get('/shorten', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'home.html'));
});

router.post('/shorten', shortenLimiter, async (req: Request, res: Response) => {
  const { longUrl } = req.body as { longUrl: string };
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl || !normalizeUrl(baseUrl)) {
    return sendError(req, res, 500, 'SERVER_MISCONFIGURED', 'Invalid BASE_URL');
  }

  const normalizedLongUrl = normalizeUrl(longUrl);
  if (!normalizedLongUrl) {
    return sendError(req, res, 400, 'VALIDATION_FAILED', 'longUrl is not a valid http(s) URL', 'longUrl');
  }

  try {
    const existing = await Url.findOne({ longUrl: normalizedLongUrl });

    if (existing) {
      return res.status(200).json({
        urlCode: existing.urlCode,
        longUrl: existing.longUrl,
        shortUrl: `${baseUrl}/${existing.urlCode}`,
      });
    }

    const nanoid = await nanoidPromise;

    const saveWithCode = async (code: string) => {
      const doc = new Url({ longUrl: normalizedLongUrl, urlCode: code });
      return doc.save();
    };

    let url;
    try {
      url = await saveWithCode(nanoid());
    } catch (err: unknown) {
      if ((err as { code?: number }).code === 11000) {
        url = await saveWithCode(nanoid());
      } else {
        throw err;
      }
    }

    return res.status(201).json({
      urlCode: url.urlCode,
      longUrl: url.longUrl,
      shortUrl: `${baseUrl}/${url.urlCode}`,
    });
  } catch (err) {
    console.error(err);
    return sendError(req, res, 500, 'INTERNAL_ERROR', 'Server error');
  }
});

export default router;
