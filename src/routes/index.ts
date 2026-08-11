import express, { Request, Response, Router } from 'express';
import { Url } from '../models/url';

const router: Router = express.Router();

router.get('/:code', async (req: Request, res: Response) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      return res.redirect(url.longUrl);
    }

    return res.status(404).json('No url found');
  } catch (err) {
    console.error(err);
    return res.status(500).json('Server error');
  }
});

export default router;
