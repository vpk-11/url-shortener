import express, { Request, Response, Router } from 'express';
import { Url } from '../models/url';
import { LruCache } from '../lib/cache';
import { sendError } from '../lib/errors';

const router: Router = express.Router();

// Read-through cache for redirect lookups. 80/20 traffic assumption: a small
// set of short codes accounts for most redirect volume.
const redirectCache = new LruCache<string, string>(1000);

router.get('/:code', async (req: Request, res: Response) => {
  try {
    // Express 5 types params as string | string[] to cover wildcard routes;
    // ':code' is a named segment so it's always a single string here.
    const code = req.params.code as string;
    const cached = redirectCache.get(code);
    if (cached) {
      return res.redirect(301, cached);
    }

    const url = await Url.findOne({ urlCode: code });

    if (url) {
      redirectCache.set(code, url.longUrl);
      return res.redirect(301, url.longUrl);
    }

    return sendError(req, res, 404, 'NOT_FOUND', 'No url found for this code');
  } catch (err) {
    console.error(err);
    return sendError(req, res, 500, 'INTERNAL_ERROR', 'Server error');
  }
});

export default router;
