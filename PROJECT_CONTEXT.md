# PROJECT_CONTEXT.md

## One-Liner
Single-process Node.js URL shortener backed by MongoDB. Accepts a long URL, stores it with a nanoid-generated short code, and redirects `/:code` to the original URL.

## Current State
- As of: June 19, 2026
- Status: runnable. Requires a valid `.env` file and a reachable MongoDB instance.
- All blocking issues from the initial audit have been resolved (see changelog below).

## Core Stack

### Frontend
- `public/home.html`: plain HTML form, single `POST` to `/api/url/shorten`.
- No framework, no bundler, no client-side state.

### Backend
- Node.js 22.x, Express 5.x.
- Entry point: `index.js`.
- Routing: `routes/index.js` (redirect) and `routes/url.js` (shorten).
- Database: Mongoose 8.x, `config/db.js`, model in `models/url.js`.
- Request parsing: `express.json()` + `express.urlencoded()` (body-parser removed, built into Express 5).

### AI / LLM Layer
- None.

### Database & Storage
- MongoDB via Mongoose. Single `Url` collection.
- Schema: `urlCode` (unique index), `longUrl`, `shortUrl`, `date`.
- No migrations, no seed data.

### External APIs & Integrations
- None. URL validation via Node's built-in `URL` constructor (no external packages).

### Dev Tooling
- `npm start`: nodemon 3.x dev server.
- `npm test`: placeholder, exits 0.
- No linter, formatter, or type checker configured.

### Deployment Config
- None. No Dockerfile, Procfile, or cloud manifest.

## Environment

### Required
- `MONGO_URI`: MongoDB connection string.
- `BASE_URL`: public base URL used to construct short links (e.g. `http://localhost:5000`).

### Optional
- `PORT`: defaults to `5000`.

Copy `.env.example` to `.env` and fill in values before running.

## Architecture Summary
Single-package Express monolith, server-rendered HTML, MongoDB persistence.

Key files:
- `index.js`: app bootstrap, DB connection, middleware, router mounts, server listen.
- `config/db.js`: opens Mongoose connection from `MONGO_URI` env var.
- `routes/url.js`: serves shorten form (`GET /api/url/shorten`) and handles creation (`POST /api/url/shorten`).
- `routes/index.js`: resolves short codes and issues HTTP redirects (`GET /:code`).
- `models/url.js`: Mongoose schema and model. Unique index on `urlCode`.
- `public/home.html`: the only user-facing page.

Data model: `Url` collection holds `urlCode`, `longUrl`, `shortUrl`, `date`.

## Runtime Flow

### Bootstrap
`index.js` calls `connectDB()`, registers middleware, mounts routers, listens on `PORT`.

### Shorten (`POST /api/url/shorten`)
1. Validate `BASE_URL` env var and submitted `longUrl` with `isValidUrl()` (http/https only, blocks `javascript:` and other schemes).
2. Check `Url.findOne({ longUrl })` — return existing record if found.
3. Generate code with `nanoid`. Save new `Url` document.
4. On `E11000` (code collision), regenerate and retry once.

### Redirect (`GET /:code`)
1. Look up `Url.findOne({ urlCode })`.
2. `res.redirect(url.longUrl)` if found; 404 JSON otherwise.

## API Surface

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/url/shorten` | Serves the HTML shorten form |
| `POST` | `/api/url/shorten` | Creates or returns a short URL record |
| `GET` | `/:code` | Redirects to original URL |

No list, delete, update, stats, auth, or admin endpoints.

## Local Dev

```bash
cp .env.example .env   # fill in MONGO_URI, BASE_URL, PORT
npm install
npm start              # http://localhost:5000/api/url/shorten
```

MongoDB must be running and reachable at the URI in `.env`.

## Key Decisions
- Short codes generated with `nanoid` 5.x (ESM-only; used via cached dynamic `import()` at module level to stay CJS-compatible).
- URL validation: `new URL(str)` + protocol allowlist (`http:`, `https:`). Blocks `javascript:` and other XSS vectors.
- Deduplication: `Url.findOne({ longUrl })` before insert. Duplicate long URLs return the same short code.
- Unique index on `urlCode` enforces collision safety at the DB layer; app retries once on `E11000`.
- Configuration via dotenv and `process.env`. No hardcoded URIs or ports.

## Graphify
- Post-commit hook active at `.git/hooks/post-commit`. Graph auto-rebuilds on every commit (AST layer, no API cost).
- Committed outputs: `graphify-out/graph.html`, `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`.
- Machine-local files gitignored: `manifest.json`, `cost.json`, `.graphify_root`, `.graphify_python`, dated snapshot dirs (`YYYY-MM-DD/`).

## Known Gaps / Future Work
- No test suite. Route handlers and model behavior are untested.
- No rate limiting or abuse controls on URL creation.
- No auth or ownership model.
- No click tracking or analytics.
- No health check endpoint.
- Redirect performance relies on MongoDB lookup per request; no cache layer.

## Changelog

### June 2026 — Dependency upgrade + security baseline
- Upgraded Express 4 to 5, Mongoose 6 to 8, nodemon 2 to 3.
- Replaced `shortid` with `nanoid` 5.x.
- Replaced `valid-url` with native `URL` constructor; restricted to `http:`/`https:` to block `javascript:` URI XSS.
- Replaced `config` package with `dotenv` + `process.env`. Deleted `config/default.json`.
- Removed `body-parser` (built into Express 5).
- Fixed hardcoded absolute `res.sendFile` path in `routes/url.js`.
- Fixed static middleware path from missing `static/` to `public/`.
- Fixed model import casing (`../models/Url` to `../models/url`).
- Removed unused imports (`copyFileSync`, stale `path`, `body-parser`).
- Added unique index on `urlCode` in `models/url.js`.
- Added `E11000` collision retry in `routes/url.js`.
- Fixed `public/home.html` (closed `<form>`, fixed label `for` attr).
- Added `.env.example`.
- Initialized Graphify knowledge graph; post-commit hook active.
