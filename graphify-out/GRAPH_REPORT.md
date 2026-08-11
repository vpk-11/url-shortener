# Graph Report - url-shortner  (2026-06-19)

## Corpus Check
- 10 files · ~2,177 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 93 nodes · 91 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6a3cf135`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Package Metadata|Package Metadata]]
- [[_COMMUNITY_App Bootstrap and DB|App Bootstrap and DB]]
- [[_COMMUNITY_URL Shortening Flow|URL Shortening Flow]]
- [[_COMMUNITY_URL Validation and Code Gen|URL Validation and Code Gen]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Claude Code Permissions|Claude Code Permissions]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 10 edges
2. `Core Stack` - 8 edges
3. `URL Shortener` - 7 edges
4. `scripts` - 5 edges
5. `Runtime Flow` - 4 edges
6. `Planned Work` - 4 edges
7. `Environment` - 3 edges
8. `Changelog` - 3 edges
9. `Url` - 3 edges
10. `pnpm` - 2 edges

## Surprising Connections (you probably didn't know these)
- `connectDB()` --shares_data_with--> `urlSchema`  [INFERRED]
  src/config/db.ts → src/models/url.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **URL Shortening Request Flow** — public_home_form, routes_url_shorten_post, models_url_urlmodel [EXTRACTED 1.00]
- **Short Code Redirect Flow** — routes_index_redirect_handler, models_url_urlmodel, concept_url_deduplication [INFERRED 0.85]
- **App Bootstrap and DB Connection Flow** — index_app, config_db_connectdb, models_url_urlschema [EXTRACTED 1.00]

## Communities (11 total, 1 thin omitted)

### Community 0 - "Package Metadata"
Cohesion: 0.14
Nodes (13): author, description, devDependencies, tsx, @types/express, @types/node, typescript, license (+5 more)

### Community 1 - "App Bootstrap and DB"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, rootDir, skipLibCheck (+4 more)

### Community 2 - "URL Shortening Flow"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, test

### Community 3 - "URL Validation and Code Gen"
Cohesion: 0.19
Nodes (8): connectDB(), IUrl, Url, urlSchema, router, nanoidPromise, router, app

### Community 4 - "Community 4"
Cohesion: 0.50
Nodes (4): Later, Next: Analytics dashboard, Next: UI overhaul, Planned Work

### Community 5 - "Runtime Dependencies"
Cohesion: 0.40
Nodes (5): dependencies, dotenv, express, mongoose, nanoid

### Community 7 - "Project Documentation"
Cohesion: 0.25
Nodes (7): API, Environment Variables, Notes, Roadmap, Setup, Stack, URL Shortener

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (13): API Surface, Architecture Summary, Changelog, Current State, Environment, Graphify, June 2026 (first pass) — Dependency upgrade + security baseline, June 2026 (second pass) — TypeScript migration + pnpm (+5 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (8): AI / LLM Layer, Backend, Core Stack, Database & Storage, Deployment Config, Dev Tooling, External APIs & Integrations, Frontend

### Community 10 - "Community 10"
Cohesion: 0.50
Nodes (4): Bootstrap, Redirect (`GET /:code`), Runtime Flow, Shorten (`POST /api/url/shorten`)

## Knowledge Gaps
- **66 isolated node(s):** `One-Liner`, `Current State`, `Frontend`, `Backend`, `AI / LLM Layer` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Core Stack` connect `Community 9` to `Community 8`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `Runtime Flow` connect `Community 10` to `Community 8`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Planned Work` connect `Community 4` to `Community 8`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `One-Liner`, `Current State`, `Frontend` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Metadata` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._