const express = require('express');
const router = express.Router();
const path = require('path');
const Url = require('../models/url');

const nanoidPromise = import('nanoid').then(m => m.nanoid);

function isValidUrl(str) {
    try {
        const u = new URL(str);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch { return false; }
}

router.get('/shorten', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
});

router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = process.env.BASE_URL;

    if (!isValidUrl(baseUrl)) {
        return res.status(400).json('Invalid base url');
    }

    if (!isValidUrl(longUrl)) {
        return res.status(400).json('Invalid long url');
    }

    try {
        let url = await Url.findOne({ longUrl });

        if (url) {
            return res.json(url);
        }

        const nanoid = await nanoidPromise;

        const saveWithCode = async (code) => {
            const shortUrl = `${baseUrl}/${code}`;
            const doc = new Url({ longUrl, shortUrl, urlCode: code, date: new Date() });
            return doc.save();
        };

        try {
            url = await saveWithCode(nanoid());
        } catch (err) {
            if (err.code === 11000) {
                url = await saveWithCode(nanoid());
            } else {
                throw err;
            }
        }

        res.json(url);
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

module.exports = router;
