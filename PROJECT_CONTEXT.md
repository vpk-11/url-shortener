# PROJECT_CONTEXT.md

## One-Liner
Single-process Node.js URL shortener backed by MongoDB. Accepts a long URL, stores it with a nanoid-generated short code, and redirects `/:code` to the original URL.

## Current State
- As of: June 19, 2026
- Status: runnable. Requires a valid `.env` file and a reachable MongoDB instance.
- Language: TypeScript 5.x (strict mode). Compiled to `dist/` via `tsc`.
- Package manager: pnpm 10.x.
- All blocking issues from the initial audit have been resolved (see changelog below).

## Core Stack

### Frontend
- `public/home.html`: plain HTML form, single `POST` to `/api/url/shorten`.
- No framework, no bundler, no client-side state.

### Backend
- Node.js 22.x, Express 5.x, TypeScript 5.x (strict).
- Entry point: `src/index.ts` (dev: `tsx watch`, prod: `dist/index.js`).
- Routing: `src/routes/index.ts` (redirect) and `src/routes/url.ts` (shorten).
- Database: Mongoose 8.x, `src/config/db.ts`, model in `src/models/url.ts`.
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
- `pnpm dev`: tsx watch dev server (hot reload, no compile step).
- `pnpm build`: `tsc` compiles `src/` to `dist/`.
- `pnpm start`: runs compiled `dist/index.js` (production).
- `pnpm test`: placeholder, exits 0.
- No linter or formatter configured.

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
- `src/index.ts`: app bootstrap, DB connection, middleware, router mounts, server listen.
- `src/config/db.ts`: opens Mongoose connection from `MONGO_URI` env var.
- `src/routes/url.ts`: serves shorten form (`GET /api/url/shorten`) and handles creation (`POST /api/url/shorten`).
- `src/routes/index.ts`: resolves short codes and issues HTTP redirects (`GET /:code`).
- `src/models/url.ts`: Mongoose schema and model with `IUrl` interface. Unique index on `urlCode`.
- `public/home.html`: the only user-facing page.
- `tsconfig.json`: TypeScript config, `module: Node16`, outputs to `dist/`.
- `pnpm-lock.yaml`: lockfile (committed).

Data model: `Url` collection holds `urlCode`, `longUrl`, `shortUrl`, `date`.

## Runtime Flow

### Bootstrap
`src/index.ts` calls `connectDB()`, registers middleware, mounts routers, listens on `PORT`.

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
pnpm install
pnpm dev               # http://localhost:5000/api/url/shorten
```

MongoDB must be running and reachable at the URI in `.env`.

For production:
```bash
pnpm build
pnpm start
```

## Key Decisions
- TypeScript strict mode. `module: Node16` in tsconfig for correct ESM/CJS interop with nanoid.
- Short codes generated with `nanoid` 5.x (ESM-only; used via cached dynamic `import()` at module level; Node16 module resolution handles this correctly in TypeScript).
- URL validation: `new URL(str)` + protocol allowlist (`http:`, `https:`). Blocks `javascript:` and other XSS vectors.
- Deduplication: `Url.findOne({ longUrl })` before insert. Duplicate long URLs return the same short code.
- Unique index on `urlCode` enforces collision safety at the DB layer; app retries once on `E11000`.
- Configuration via dotenv and `process.env`. No hardcoded URIs or ports.

## Graphify
- Post-commit hook active at `.git/hooks/post-commit`. Graph auto-rebuilds on every commit (AST layer, no API cost).
- Committed outputs: `graphify-out/graph.html`, `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`.
- Machine-local files gitignored: `manifest.json`, `cost.json`, `.graphify_root`, `.graphify_python`, dated snapshot dirs (`YYYY-MM-DD/`).

## Planned Work

### Next: UI overhaul
The current frontend is a bare HTML form at `/api/url/shorten`. It will be replaced with a proper UI.

Design intent:
- React SPA served from `/` (static build in `public/` or separate frontend service).
- `/api/*` becomes pure JSON — no HTML served from route handlers. The `GET /api/url/shorten` form route is removed; the form lives in the frontend.
- The `POST /api/url/shorten` response shape is already clean JSON — no backend changes needed for the happy path.
- Short link display, copy-to-clipboard, and link history (if auth is added) are frontend concerns.

Backend prep needed: none. API shape is already suitable.

### Next: Analytics dashboard
Click tracking does not exist. Adding it requires changes to both the data layer and the API surface.

Data layer:
- Option A: add `clicks: number` to `IUrl` and `$inc` on every redirect. Simple, loses time-series data.
- Option B (preferred): separate `Click` collection — `{ urlCode, timestamp, referrer?, userAgent? }`. Records one document per redirect. Enables time-series queries, per-code charts, and referrer breakdown without schema changes to `Url`.
- IP logging: avoid or anonymize (hash + truncate) for privacy.

API additions needed:
- `GET /api/url/:code/stats` — click count, first/last seen, referrer breakdown.
- `GET /api/url/` — list all shortened URLs with click totals (requires auth to be useful).

Dashboard UI: separate from the shorten form. Can live at `/dashboard` in the same React SPA.

### Later
- Auth and ownership model (links tied to a user).
- Rate limiting on `POST /api/url/shorten`.
- Health check endpoint (`GET /health`).
- Test suite for route handlers and model behavior.
- Cache layer for redirect lookups (Redis or in-process LRU) if latency matters at volume.

## Changelog

### June 2026 (second pass) — TypeScript migration + pnpm
- Migrated all source files from JavaScript to TypeScript (strict mode).
- Source tree moved to `src/`. Compiled output goes to `dist/` (gitignored).
- Mongoose model now has `IUrl` interface; all handlers are fully typed.
- Added `tsx` for zero-config dev server (`pnpm dev`).
- Switched package manager from npm to pnpm 10.x. `pnpm-lock.yaml` committed; `package-lock.json` gitignored.
- `tsconfig.json`: `target: ES2022`, `module: Node16`, `moduleResolution: Node16`, `strict: true`.
- Removed nodemon; replaced with `tsx watch`.

### June 2026 (first pass) — Dependency upgrade + security baseline
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
