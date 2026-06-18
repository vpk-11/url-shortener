# Graph Report - url-shortner  (2026-06-18)

## Corpus Check
- 10 files · ~2,942 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 83 nodes · 79 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1f4230b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Package Metadata|Package Metadata]]
- [[_COMMUNITY_App Bootstrap and DB|App Bootstrap and DB]]
- [[_COMMUNITY_URL Shortening Flow|URL Shortening Flow]]
- [[_COMMUNITY_URL Validation and Code Gen|URL Validation and Code Gen]]
- [[_COMMUNITY_Mongoose Model and Redirect|Mongoose Model and Redirect]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Claude Code Permissions|Claude Code Permissions]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `Core Stack` - 8 edges
2. `URL Shortener — Session Plan` - 7 edges
3. `Gap Analysis` - 4 edges
4. `Url Mongoose Model` - 4 edges
5. `Environment` - 3 edges
6. `connectDB()` - 3 edges
7. `urlSchema` - 3 edges
8. `scripts` - 3 edges
9. `POST /shorten Handler` - 3 edges
10. `permissions` - 2 edges

## Surprising Connections (you probably didn't know these)
- `connectDB()` --shares_data_with--> `urlSchema`  [INFERRED]
  config/db.js → models/url.js
- `app` --calls--> `connectDB()`  [EXTRACTED]
  index.js → config/db.js
- `Redirect by Code Handler` --calls--> `Url Mongoose Model`  [EXTRACTED]
  routes/index.js → models/url.js
- `saveWithCode Inner Function` --calls--> `Url Mongoose Model`  [EXTRACTED]
  routes/url.js → models/url.js
- `POST /shorten Handler` --calls--> `Url Mongoose Model`  [EXTRACTED]
  routes/url.js → models/url.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **URL Shortening Request Flow** — public_home_form, routes_url_shorten_post, models_url_urlmodel [EXTRACTED 1.00]
- **Short Code Redirect Flow** — routes_index_redirect_handler, models_url_urlmodel, concept_url_deduplication [INFERRED 0.85]
- **App Bootstrap and DB Connection Flow** — index_app, config_db_connectdb, models_url_urlschema [EXTRACTED 1.00]

## Communities (12 total, 3 thin omitted)

### Community 0 - "Package Metadata"
Cohesion: 0.17
Nodes (11): author, description, devDependencies, nodemon, license, main, name, scripts (+3 more)

### Community 1 - "App Bootstrap and DB"
Cohesion: 0.29
Nodes (6): connectDB(), mongoose, app, connectDB, express, path

### Community 3 - "URL Validation and Code Gen"
Cohesion: 0.16
Nodes (12): mongoose, Url Mongoose Model, urlSchema, Redirect by Code Handler, express, isValidUrl(), nanoidPromise, path (+4 more)

### Community 4 - "Mongoose Model and Redirect"
Cohesion: 0.50
Nodes (3): express, router, Url

### Community 5 - "Runtime Dependencies"
Cohesion: 0.40
Nodes (5): dependencies, dotenv, express, mongoose, nanoid

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (13): API / Router Surface, Architecture Summary, Cleanup Notes, Code Quality Flags, Current State, Environment, Key Decisions, Local Dev (+5 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (8): AI / LLM Layer, Backend, Core Stack, Database & Storage, Deployment Config, Dev Tooling, External APIs & Integrations, Frontend

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (7): Code Fixes, Dependency Upgrade Targets, Done When, Repo Cleanup, Security Baseline — All Blocking, Session Scope, URL Shortener — Session Plan

### Community 11 - "Community 11"
Cohesion: 0.50
Nodes (4): Gap Analysis, Major reworks (1+ week), Medium lifts (1–3 days each), Quick wins (< 1 day each)

## Knowledge Gaps
- **58 isolated node(s):** `One-Liner`, `Current State`, `Frontend`, `Backend`, `AI / LLM Layer` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `urlSchema` connect `URL Validation and Code Gen` to `App Bootstrap and DB`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Core Stack` connect `Community 9` to `Community 8`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `connectDB()` connect `App Bootstrap and DB` to `URL Validation and Code Gen`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `One-Liner`, `Current State`, `Frontend` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._