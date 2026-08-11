# Graph Report - url-shortner  (2026-08-11)

## Corpus Check
- 13 files · ~2,093 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 79 nodes · 85 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b8e834ce`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Package Metadata|Package Metadata]]
- [[_COMMUNITY_App Bootstrap and DB|App Bootstrap and DB]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_URL Validation and Code Gen|URL Validation and Code Gen]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Claude Code Permissions|Claude Code Permissions]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 10 edges
2. `URL Shortener` - 8 edges
3. `scripts` - 6 edges
4. `LruCache` - 6 edges
5. `sendError()` - 3 edges
6. `Url` - 3 edges
7. `connectDB()` - 3 edges
8. `pnpm` - 2 edges
9. `requestId()` - 2 edges
10. `urlSchema` - 2 edges

## Surprising Connections (you probably didn't know these)
- `connectDB()` --shares_data_with--> `urlSchema`  [INFERRED]
  src/config/db.ts → src/models/url.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **URL Shortening Request Flow** — public_home_form, routes_url_shorten_post, models_url_urlmodel [EXTRACTED 1.00]
- **Short Code Redirect Flow** — routes_index_redirect_handler, models_url_urlmodel, concept_url_deduplication [INFERRED 0.85]
- **App Bootstrap and DB Connection Flow** — index_app, config_db_connectdb, models_url_urlschema [EXTRACTED 1.00]

## Communities (11 total, 2 thin omitted)

### Community 0 - "Package Metadata"
Cohesion: 0.22
Nodes (8): author, description, license, main, name, pnpm, onlyBuiltDependencies, version

### Community 1 - "App Bootstrap and DB"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, rootDir, skipLibCheck (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.38
Nodes (4): connectDB(), Request, requestId(), app

### Community 3 - "URL Validation and Code Gen"
Cohesion: 0.22
Nodes (8): sendError(), IUrl, Url, urlSchema, redirectCache, router, nanoidPromise, router

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, tsx, @types/express, @types/node, typescript, typescript-eslint

### Community 5 - "Runtime Dependencies"
Cohesion: 0.40
Nodes (5): dependencies, dotenv, express, mongoose, nanoid

### Community 7 - "Project Documentation"
Cohesion: 0.22
Nodes (8): API, Changelog, Environment Variables, Notes, Roadmap, Setup, Stack, URL Shortener

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

## Knowledge Gaps
- **46 isolated node(s):** `name`, `version`, `description`, `main`, `dev` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 4` to `Package Metadata`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `scripts` connect `Community 9` to `Package Metadata`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._