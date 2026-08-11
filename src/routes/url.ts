import express, { Request, Response, Router } from 'express';
import path from 'path';
import { Url } from '../models/url';
import { sendError } from '../lib/errors';

const router: Router = express.Router();

const nanoidPromise = import('nanoid').then((m) => m.nanoid);

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

router.get('/shorten', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'home.html'));
});

router.post('/shorten', async (req: Request, res: Response) => {
  const { longUrl } = req.body as { longUrl: string };
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl || !isValidUrl(baseUrl)) {
    return sendError(req, res, 500, 'SERVER_MISCONFIGURED', 'Invalid BASE_URL');
  }

  if (!isValidUrl(longUrl)) {
    return sendError(req, res, 400, 'VALIDATION_FAILED', 'longUrl is not a valid http(s) URL', 'longUrl');
  }

  try {
    const existing = await Url.findOne({ longUrl });

    if (existing) {
      return res.status(200).json({
        urlCode: existing.urlCode,
        longUrl: existing.longUrl,
        shortUrl: `${baseUrl}/${existing.urlCode}`,
      });
    }

    const nanoid = await nanoidPromise;

    const saveWithCode = async (code: string) => {
      const doc = new Url({ longUrl, urlCode: code });
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
