# PROJECT_CONTEXT.md

## One-Liner
Single-process Node.js URL shortener backed by MongoDB and Mongoose. It accepts a long URL, stores it with a generated short code, and redirects `/:code` back to the original URL.

## Current State
- As of: June 17, 2026
- What is actually running and confirmed working: no end-to-end runtime is confirmed in this checkout. The source defines an Express app, a Mongoose `Url` model, a shorten form endpoint, and a redirect endpoint, but local module loading fails because the checked-in `node_modules` tree is not a normal Node install layout.
- What is broken, incomplete, or stubbed out: `routes/url.js` hardcodes a machine-specific absolute path in `res.sendFile(...)`; `index.js` serves `/public` from `__dirname/static`, but the repo has no `static/` directory; the model imports use `../models/Url` while the file on disk is `models/url.js`; `npm test` is a placeholder that exits 1.
- What is mocked, hardcoded, or clearly placeholder: MongoDB URI and base URL are hardcoded in `config/default.json`; the HTTP port is hardcoded to `5000`; the app has no build step, no lint step, and no real test suite.
- Overall readiness: local only, not production-ready, and not runnable as-is from this checkout.

## Core Stack

### Frontend
- `public/home.html` is the only UI artifact.
- It is plain HTML with a single `<form>` posting `longUrl` to `/api/url/shorten`.
- There is no frontend framework, asset pipeline, bundler, or client-side state.

### Backend
- Node.js with Express 4.x.
- Entry point: `index.js`.
- Routing: `routes/index.js` and `routes/url.js`.
- Database access: Mongoose 6.x in `config/db.js` and `models/url.js`.
- Request parsing: `express.json()` plus `body-parser.urlencoded(...)`.

### AI / LLM Layer
- None.

### Database & Storage
- MongoDB, using a single `Url` collection defined in `models/url.js`.
- `config/default.json` points at `mongodb://localhost:27017/url`.
- The schema has `urlCode`, `longUrl`, `shortUrl`, and `date`.
- There are no migrations, no seed data, and no indexes defined in source.

### External APIs & Integrations
- None beyond MongoDB.
- `valid-url` is used for URL validation.
- `shortid` is used for code generation.

### Dev Tooling
- `package.json` declares `npm start` as `nodemon index`.
- `package.json` declares `npm test` as a placeholder that exits 1.
- Dependency management is via npm lockfile format `lockfileVersion: 2`.
- No linter, formatter, type checker, or test runner is configured.

### Deployment Config
- None present.
- There is no `Dockerfile`, `vercel.json`, `railway.toml`, `wrangler.toml`, `Procfile`, or similar deployment manifest.

## Architecture Summary
- Overall shape: single-package Express monolith with server-rendered HTML and MongoDB persistence.
- Key files and ownership:
  - `/Users/vpk11/Library/CloudStorage/OneDrive-Personal/Documents/Development/url-shortner/index.js` bootstraps the app, connects to MongoDB, registers middleware, mounts routers, and listens on port 5000.
  - `/Users/vpk11/Library/CloudStorage/OneDrive-Personal/Documents/Development/url-shortner/config/db.js` reads `mongoURI` from config and opens the Mongoose connection.
  - `/Users/vpk11/Library/CloudStorage/OneDrive-Personal/Documents/Development/url-shortner/config/default.json` hardcodes local Mongo and base URL values.
  - `/Users/vpk11/Library/CloudStorage/OneDrive-Personal/Documents/Development/url-shortner/routes/url.js` serves the HTML form and handles short URL creation.
  - `/Users/vpk11/Library/CloudStorage/OneDrive-Personal/Documents/Development/url-shortner/routes/index.js` resolves short codes and redirects to the long URL.
  - `/Users/vpk11/Library/CloudStorage/OneDrive-Personal/Documents/Development/url-shortner/models/url.js` defines the Mongoose schema and model.
  - `/Users/vpk11/Library/CloudStorage/OneDrive-Personal/Documents/Development/url-shortner/public/home.html` contains the only user-facing form.
- Data model:
  - `Url` collection: `urlCode` stores the short code, `longUrl` stores the original URL, `shortUrl` stores the generated redirect URL, and `date` stores creation time.
- Notable patterns:
  - Request/response MVC-lite split across router, model, and config files.
  - Form POST -> create-or-return-existing URL record -> redirect by code.
  - No service layer, no repository abstraction, no auth layer, no background jobs.

## Runtime Flow
- Bootstrap flow:
  - `index.js` calls `connectDB()` from `config/db.js`.
  - `config/db.js` reads `mongoURI` with `config.get('mongoURI')` and calls `mongoose.connect(...)`.
  - `index.js` registers JSON and URL-encoded parsing, mounts `routes/index.js` at `/` and `routes/url.js` at `/api/url`, then listens on port 5000.
- Shorten flow:
  - `routes/url.js` handles `POST /api/url/shorten`.
  - The handler reads `req.body.longUrl`, validates `config.get('baseUrl')` and the submitted URL with `valid-url`, generates a code with `shortid.generate()`, and searches `Url.findOne({ longUrl })`.
  - If a record exists, the existing document is returned as JSON.
  - If not, a new `Url` document is created with `longUrl`, `shortUrl`, `urlCode`, and `date`, then saved.
- Redirect flow:
  - `routes/index.js` handles `GET /:code` at the app root.
  - The handler looks up `Url.findOne({ urlCode: req.params.code })`.
  - If found, it calls `res.redirect(url.longUrl)`; otherwise it returns a 404 JSON payload.

## API / Router Surface
- URL shortening domain:
  - `GET /api/url/shorten` implemented. It is intended to send the HTML form, but the current `res.sendFile(...)` path is hardcoded to a local desktop path and is broken off-machine.
  - `POST /api/url/shorten` implemented. It creates or returns a short URL record.
- Redirect domain:
  - `GET /:code` implemented. It redirects based on `urlCode`.
- Missing or stubbed:
  - `GET /` is not implemented.
  - There are no JSON list, delete, update, or stats endpoints.
  - There is no auth or admin surface.

## Environment
### Required
- None via `process.env`. The app does not read environment variables directly.
- Operationally, MongoDB must be available at the URI hardcoded in `config/default.json` or the app will fail to connect and exit.

### Optional
- None defined in source.
- `config/default.json` hardcodes `mongoURI` and `baseUrl`; changing behavior requires editing config, not setting env vars.

## Key Decisions
- MongoDB and Mongoose are the only persistence layer; there is no cache or secondary store.
- Short links are generated with `shortid` and persisted as full documents, not derived on read.
- Duplicate long URLs are deduplicated by `Url.findOne({ longUrl })` before insert.
- Redirects are database-driven; the app does not maintain a separate mapping cache.
- The UI is a plain HTML form served by the backend rather than a SPA.
- Configuration is file-based via `config/default.json`, not env-based.

## Local Dev
- Install dependencies: `npm install`
- Run the app: `npm start`
- Test: `npm test`
- Build: none
- Runtime prerequisite: start MongoDB locally so `mongodb://localhost:27017/url` is reachable.
- Current checkout caveat: the committed `node_modules` tree is not a valid install layout for Node module resolution; reinstalling dependencies is required before the app can load cleanly.

## Code Quality Flags
- Security concerns:
  - No auth, no ownership model, no rate limiting, and no abuse controls around URL creation.
  - URL input is only checked with `valid-url`; there is no content policy, hostname allowlist, or phishing protection.
  - `shortid` is old and unmaintained relative to modern code generators.
- Outdated or potentially vulnerable dependencies:
  - Declared versions are old: `express@^4.17.1`, `mongoose@^6.0.1`, `nodemon@^2.0.12`, `body-parser@^1.19.0`, `config@^3.3.6`, `valid-url@^1.0.9`, `shortid@^2.2.16`.
  - `package-lock.json` pins older resolved versions than the current pnpm-style `node_modules` pointers on disk, so the checkout is inconsistent.
- Missing error handling in critical paths:
  - `connectDB()` fails fast with `process.exit(1)` on connection errors, so there is no retry/backoff or degraded startup mode.
  - `routes/url.js` logs `req.body` and database errors, but does not normalize or enrich error responses.
  - No uniqueness enforcement exists for `urlCode`, so code collisions are not handled explicitly.
- Anti-patterns or structural debt:
  - `routes/url.js` uses a hardcoded absolute filesystem path in `res.sendFile(...)`.
  - `index.js` serves static files from `__dirname/static`, but the repo only has `public/`.
  - `models/Url` is required with a case mismatch against `models/url.js`.
  - `config/db.js` imports `copyFileSync` from `fs` and never uses it.
  - `routes/url.js` imports `path` and `body-parser` and never uses them.
  - `index.js` contains a stray `//git push -u origin main` comment.
  - `public/home.html` is incomplete HTML and does not close the form/body tags cleanly.
- Blocking TODOs or FIXME equivalents:
  - `npm test` is explicitly a placeholder and fails by design.
  - The app cannot be treated as portable until the hardcoded file path and the static path are fixed.

## Resume / Portfolio Highlights
- Minimal but complete product loop: form submission, validation, persistence, and redirect are all present in a few files and are easy to reason about.
- The code demonstrates a canonical URL shortener data path using MongoDB and Mongoose with deduplication by original URL.
- The redirect route is direct and low-latency in concept: lookup by code, then immediate HTTP redirect.
- The project shows baseline backend engineering judgment around route separation, configuration loading, and persistence modeling, even though the current implementation is rough.

## Gap Analysis
### Quick wins (< 1 day each)
- Replace the hardcoded `res.sendFile('/Users/.../public/home.html')` path with a path derived from `__dirname`.
- Point static middleware at the actual `public/` directory or remove it if the HTML file is always served directly.
- Fix the `Url` import casing to match the actual filename.
- Remove unused imports in `config/db.js` and `routes/url.js`.
- Add closing tags and a basic success/error message path to `public/home.html`.
- Change the port to use `process.env.PORT || 5000` if deployability matters.

### Medium lifts (1–3 days each)
- Replace `config/default.json` hardcoding with environment-driven config and a checked-in `.env.example`.
- Add a unique index on `urlCode` and handle collision retries.
- Add a real test suite for route handlers and model behavior.
- Add request validation and explicit error responses for invalid payloads and database failures.
- Replace `shortid` with a maintained code generator.

### Major reworks (1+ week)
- Rework the app into a deployable service with production config, health checks, and CI.
- Add analytics, click tracking, or abuse controls if the product needs to survive real usage.
- Rebuild the UI as an actual frontend rather than a bare HTML form if user experience matters.
- Remove stale generated artifacts and align the repository around one package manager and one install story.

## Cleanup Notes
- `/Users/vpk11/Library/CloudStorage/OneDrive-Personal/Documents/Development/url-shortner/graphify-out/` is tracked in git and appears stale and unrelated to this repo. `graphify-out/manifest.json` references a different `server/` and `client/` tree, not the current URL shortener code.
- `graphify-out/GRAPH_REPORT.md` is dated `2026-05-15`, which predates this audit and should not be treated as source of truth.
- `.gitignore` ignores only `graphify-out/manifest.json` and `graphify-out/cost.json`, but not the rest of `graphify-out/`, so generated artifacts remain tracked.
- `README.md` is terse and does not mention the actual runtime problems in this checkout.
- `index.js` has a stray push comment at the end of the file.
- `node_modules/` is present locally but not usable as a clean Node install, and it should not be relied on for repo truth.
