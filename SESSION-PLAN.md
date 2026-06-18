# URL Shortener — Session Plan

> Read alongside `PROJECT_CONTEXT.md`. That doc is the audit. This doc is the mission.

---

## Session Scope

Kaushik is reworking the architecture of this project himself. This session does not propose any architectural changes, new features, new UI patterns, or deployment decisions. The scope is exactly this: bring every dependency to current LTS, fix the security baseline, and leave the codebase in a clean and portable state so he can build on top of it without fighting legacy debt.

If he asks for architectural input during the session, ask him what he wants first — do not volunteer a direction.

---

## Dependency Upgrade Targets

| Package | Current | Target |
|---|---|---|
| Node.js | unspecified | `22.x` LTS |
| Express | `4.17.1` | `5.x` latest stable |
| Mongoose | `6.0.1` | `8.x` latest stable |
| `shortid` | `2.2.16` | **Remove** — unmaintained. Replace with `nanoid` `5.x` |
| `valid-url` | `1.0.9` | **Remove** — unmaintained and unnecessary (see note below) |
| `body-parser` | `1.19.0` | **Remove** — built into Express 5 |
| `config` | `3.3.6` | **Remove** — replace with `dotenv` + `process.env` directly |
| `nodemon` | `2.0.12` | `3.x` latest stable (devDependency) |

**`valid-url` replacement note:** Node has a built-in `URL` constructor that throws on invalid URLs. Use it:
```js
function isValidUrl(str) {
  try { new URL(str); return true; }
  catch { return false; }
}
```
No package required. No dependency to maintain.

**`nanoid` note:** `nanoid` is ESM-only from v4 onwards. Either use `nanoid` `5.x` with ES module syntax or use `nanoid/non-secure` for a CommonJS-compatible import. Check whether the project is using CommonJS (`require`) or ESM (`import`) and pick accordingly.

---

## Security Baseline — All Blocking

1. **No `process.env` anywhere.** The app reads zero environment variables — everything is hardcoded in `config/default.json`. Replace the `config` package entirely. Move `mongoURI`, `baseUrl`, and `PORT` to `.env`. Read them with `dotenv`. Add `.env.example` with all three documented. Add `.env` to `.gitignore` if it is not already there.

2. **`shortid` is unmaintained.** Replace with `nanoid` as specified above. The generated code replaces `shortid.generate()` — a drop-in swap at the call site.

3. **No index on `urlCode`.** Short codes are looked up on every redirect but there is no index defined in `models/url.js`. Add a unique index on `urlCode`. Handle `E11000` duplicate key errors at the code generation call site — regenerate the code and retry once on collision.

---

## Code Fixes

These are not architectural changes — they are bugs and broken behavior that exist in the current source.

- **Hardcoded absolute path in `routes/url.js`.** `res.sendFile('/Users/vpk11/Library/...')` is machine-specific. Replace with `path.join(__dirname, '..', 'public', 'home.html')`.

- **Static middleware points at missing directory.** `index.js` mounts `express.static` from `__dirname/static` but only `public/` exists. Fix the path to `public/` or remove the static mount if the HTML file is always served directly via `sendFile`.

- **Model import casing mismatch.** The model is required as `../models/Url` but the file on disk is `models/url.js`. Fix the import to match the actual filename: `../models/url`.

- **Unused imports.** Remove `copyFileSync` from `config/db.js`. Remove `path` and `body-parser` from `routes/url.js`. Remove `body-parser` as a package dependency.

- **HTML is incomplete.** `public/home.html` is missing closing tags. Fix the markup so it is valid HTML.

- **Stray comment in `index.js`.** The `//git push -u origin main` comment at the end of the file — delete it.

- **`npm test` placeholder.** Leave it as-is or set it to `echo "No tests yet" && exit 0`. Do not add a test suite — that is an architectural decision for Kaushik.

---

## Repo Cleanup

- Delete the entire `graphify-out/` directory from the repo and restart the graphify process with the /graphify skill and the /dev-graphify skill
- Remove the checked-in `node_modules/` if it is present. Add `node_modules/` to `.gitignore` if not already there.
- Remove the `config/` directory and `config` package after migrating to `dotenv`.
- Add `package-lock.json` to version control. Delete it from `.gitignore` if it is listed there.

---

## Done When

- [ ] `npm install` on a clean checkout installs all deps without errors.
- [ ] `npm start` starts the app given a valid `.env` file.
- [ ] `shortid` is gone — `nanoid` is the code generator.
- [ ] `valid-url` is gone — native `URL` constructor is used.
- [ ] `body-parser` and `config` packages are gone.
- [ ] No hardcoded paths, URIs, or ports anywhere in source.
- [ ] Unique index on `urlCode` is defined in `models/url.js`.
- [ ] `.env.example` exists with `MONGO_URI`, `BASE_URL`, and `PORT` documented.
- [ ] `graphify-out/` is removed from the repo and gitignored.
- [ ] `public/home.html` is valid HTML with all tags closed.