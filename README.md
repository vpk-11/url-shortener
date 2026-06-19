# URL Shortener

A Node.js URL shortener backed by MongoDB. Submit a long URL, get a short code back, paste the short link anywhere — it redirects to the original.

Built as a clean backend exercise: Express 5, Mongoose 8, nanoid for code generation, dotenv for config.

## Setup

```bash
# 1. clone and install
npm install

# 2. configure environment
cp .env.example .env
# edit .env: set MONGO_URI, BASE_URL, and optionally PORT

# 3. start MongoDB locally (or point MONGO_URI at a hosted instance)

# 4. run
npm start
```

The app listens on `PORT` (default: `5000`). Open `http://localhost:5000/api/url/shorten` to use the form.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `BASE_URL` | Yes | Public base URL for constructing short links |
| `PORT` | No | Server port, defaults to `5000` |

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/url/shorten` | HTML shorten form |
| `POST` | `/api/url/shorten` | Create or return a short URL (body: `longUrl`) |
| `GET` | `/:code` | Redirect to original URL |

`POST /api/url/shorten` returns the full URL document as JSON. If the long URL has been shortened before, the existing record is returned.

## Stack

- **Runtime:** Node.js 22.x
- **Framework:** Express 5
- **Database:** MongoDB via Mongoose 8
- **Code generation:** nanoid 5
- **Config:** dotenv
- **Dev server:** nodemon 3

## Notes

- URL validation accepts `http` and `https` only. `javascript:` and other schemes are rejected.
- Short codes are unique at the DB layer (index on `urlCode`). Collisions trigger a single retry.
- Duplicate long URLs return the same short code without creating a new record.
- No auth, no rate limiting, no analytics. Suitable for local or trusted-network use.
