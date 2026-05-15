# Graph Report - .  (2026-05-15)

## Corpus Check
- Corpus is ~688 words - fits in a single context window. You may not need a graph.

## Summary
- 39 nodes · 41 edges · 5 communities
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_URL Route Dependencies|URL Route Dependencies]]
- [[_COMMUNITY_URL Shorten and Redirect Handlers|URL Shorten and Redirect Handlers]]
- [[_COMMUNITY_Database Config and Connection|Database Config and Connection]]
- [[_COMMUNITY_Mongoose Schema and Model Setup|Mongoose Schema and Model Setup]]
- [[_COMMUNITY_App Entry Point|App Entry Point]]

## God Nodes (most connected - your core abstractions)
1. `POST /shorten URL Creation Handler` - 6 edges
2. `Url Mongoose Model` - 5 edges
3. `connectDB()` - 3 edges
4. `GET /:code Redirect Handler` - 3 edges
5. `URL Shortener Service` - 3 edges
6. `urlSchema` - 2 edges
7. `URL Shortener HTML Form` - 2 edges
8. `express` - 1 edges
9. `connectDB` - 1 edges
10. `path` - 1 edges

## Surprising Connections (you probably didn't know these)
- `URL Shortener Service` --conceptually_related_to--> `Url Mongoose Model`  [INFERRED]
  README.md → models/url.js
- `GET /:code Redirect Handler` --implements--> `URL Shortener Service`  [INFERRED]
  routes/index.js → README.md
- `URL Shortener HTML Form` --references--> `POST /shorten URL Creation Handler`  [EXTRACTED]
  public/home.html → routes/url.js
- `POST /shorten URL Creation Handler` --implements--> `URL Shortener Service`  [INFERRED]
  routes/url.js → README.md
- `connectDB()` --shares_data_with--> `Url Mongoose Model`  [INFERRED]
  config/db.js → models/url.js

## Hyperedges (group relationships)
- **URL Shortening Request Flow** — public_home_form, routes_url_postshorten, models_url_urlmodel [EXTRACTED 1.00]
- **URL Redirect Lookup Flow** — routes_index_redirecthandler, models_url_urlmodel, url_shortener_service [INFERRED 0.85]
- **Application Bootstrap and DB Connection** — index_app, config_db_connectdb, models_url_urlmodel [INFERRED 0.75]

## Communities (5 total, 0 thin omitted)

### Community 0 - "URL Route Dependencies"
Cohesion: 0.18
Nodes (10): baseUrl, bodyParser, config, express, path, router, shortid, Url (+2 more)

### Community 1 - "URL Shorten and Redirect Handlers"
Cohesion: 0.36
Nodes (8): Url Mongoose Model, URL Shortener HTML Form, GET /:code Redirect Handler, GET /shorten Handler, POST /shorten URL Creation Handler, Short ID Generation via shortid, URL Deduplication Pattern, URL Shortener Service

### Community 2 - "Database Config and Connection"
Cohesion: 0.29
Nodes (6): config, connectDB(), { copyFileSync }, db, mongoose, Express App Entry Point

### Community 3 - "Mongoose Schema and Model Setup"
Cohesion: 0.29
Nodes (5): mongoose, urlSchema, express, router, Url

### Community 4 - "App Entry Point"
Cohesion: 0.33
Nodes (5): app, bodyParser, connectDB, express, path

## Knowledge Gaps
- **27 isolated node(s):** `express`, `connectDB`, `path`, `bodyParser`, `app` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Url Mongoose Model` connect `URL Shorten and Redirect Handlers` to `Database Config and Connection`, `Mongoose Schema and Model Setup`?**
  _High betweenness centrality (0.642) - this node is a cross-community bridge._
- **Why does `urlSchema` connect `Mongoose Schema and Model Setup` to `URL Shorten and Redirect Handlers`?**
  _High betweenness centrality (0.508) - this node is a cross-community bridge._
- **Why does `connectDB()` connect `Database Config and Connection` to `URL Shorten and Redirect Handlers`?**
  _High betweenness centrality (0.459) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `POST /shorten URL Creation Handler` (e.g. with `URL Shortener Service` and `GET /:code Redirect Handler`) actually correct?**
  _`POST /shorten URL Creation Handler` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Url Mongoose Model` (e.g. with `URL Shortener Service` and `connectDB()`) actually correct?**
  _`Url Mongoose Model` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `GET /:code Redirect Handler` (e.g. with `URL Shortener Service` and `POST /shorten URL Creation Handler`) actually correct?**
  _`GET /:code Redirect Handler` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `URL Shortener Service` (e.g. with `Url Mongoose Model` and `GET /:code Redirect Handler`) actually correct?**
  _`URL Shortener Service` has 3 INFERRED edges - model-reasoned connections that need verification._