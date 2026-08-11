import express, { Request, Response, Router } from 'express';
import path from 'path';
import { Url } from '../models/url';

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
    return res.status(400).json('Invalid base url');
  }

  if (!isValidUrl(longUrl)) {
    return res.status(400).json('Invalid long url');
  }

  try {
    const existing = await Url.findOne({ longUrl });

    if (existing) {
      return res.json(existing);
    }

    const nanoid = await nanoidPromise;

    const saveWithCode = async (code: string) => {
      const shortUrl = `${baseUrl}/${code}`;
      const doc = new Url({ longUrl, shortUrl, urlCode: code, date: new Date() });
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

    return res.json(url);
  } catch (err) {
    console.error(err);
    return res.status(500).json('Server error');
  }
});

export default router;
