# SEO & Content — Data Schema

All records share these base fields:

```ts
interface BaseRecord {
  id: string;          // UUID v4
  createdAt: string;   // ISO-8601 UTC
  updatedAt: string;   // ISO-8601 UTC
}
```

All writes are atomic: write to a sibling `*.tmp` file, then rename
onto the target path. Never edit in-place. Never write anywhere under
`.houston/<agent>/` — the Houston file watcher skips those paths and
reactivity breaks.

---

## Cross-agent read

Before any substantive output, this agent reads
`../head-of-marketing/product-marketing-context.md` — the shared
positioning / ICP / voice / competitor doc owned by the Head of
Marketing. If missing or empty, skills tell the user to run the Head
of Marketing's `define-positioning` first and stop.

---

## `config/` — what the agent learns about the user

Nothing under `config/` is shipped. Every file appears at runtime,
written by `onboard-me` or by progressive capture inside another
skill the first time it needs the value. `config/` is per-install
state and is gitignored.

### `config/profile.json` — written by `onboard-me`

```ts
interface Profile {
  userName: string;
  company: string;
  onboardedAt: string;        // ISO-8601
  status: "onboarded" | "partial";
}
```

### `config/site.json` — written by `onboard-me`

```ts
interface Site {
  domain: string;              // e.g. "acme.com"
  rootUrl: string;             // e.g. "https://acme.com"
  cms?: "wordpress" | "webflow" | "ghost" | "notion" | "other";
  cmsConnectedViaComposio: boolean;
  existingPosts?: string[];    // top 5 post URLs if no CMS connection
  source: "paste" | "url" | "connected-cms";
  capturedAt: string;
}
```

### `config/tooling.json` — written by `onboard-me`

```ts
interface Tooling {
  seoCategories: string[];     // Composio categories the user has connected
                                //  (e.g. ["semrush", "ahrefs", "firecrawl"])
  youtubeConnected: boolean;
  webScrapeConnected: boolean;
  notes?: string;
  capturedAt: string;
}
```

---

## Top-level files at agent root

### `outputs.json`

Index of every deliverable this agent has produced. Read by the
dashboard; seeded to `[]` via `agentSeeds`.

```ts
interface Output {
  id: string;          // uuid v4
  type: "seo-audit" | "keyword-map" | "blog-post" | "case-study"
      | "repurposed" | "content-gap" | "backlink-plan"
      | "ai-search-audit";
  title: string;
  summary: string;     // 2-3 sentences — the conclusion of this artifact
  path: string;        // relative to agent root
  status: "draft" | "ready";
  createdAt: string;   // ISO-8601
  updatedAt: string;   // ISO-8601
}
```

Rules:
- On update, refresh `updatedAt`, never touch `createdAt`.
- Never overwrite the array — read, merge, write atomically.
- Mark `draft` while iterating; flip to `ready` on founder sign-off.

### `keyword-map.md` (living document, root)

Single living markdown doc. One section per keyword cluster with
volume / difficulty / intent / priority. Appended (not overwritten)
each time `research-keywords` runs a new cluster. Full per-cluster
detail lives under `keyword-clusters/`.

---

## Topic subfolders (markdown files)

Each output's full document is a markdown file under a topic
subfolder at the agent root. The subfolder is created on first use.

| Subfolder                | Written by             | Contents                                                              | `type`             |
| ------------------------ | ---------------------- | --------------------------------------------------------------------- | ------------------ |
| `seo-audits/`            | `audit-site-seo`       | `{domain-slug}-{YYYY-MM-DD}.md` — on-page + technical + content audit. | `seo-audit`        |
| `keyword-clusters/`      | `research-keywords`    | `{cluster-slug}.md` — per-cluster detail (terms, metrics, intent).    | `keyword-map`      |
| `blog-posts/`            | `write-blog-post`      | `{slug}.md` — full draft with H1/H2/H3, meta, slug, internal links, CTA. | `blog-post`        |
| `case-studies/`          | `write-case-study`     | `{customer-slug}.md` — challenge → approach → results (numbers).       | `case-study`       |
| `repurposed/`            | `repurpose-content`    | `{source-slug}-to-{target}.md` — any source → target format.           | `repurposed`       |
| `content-gap-analyses/`  | `analyze-content-gap`  | `{competitor-slug}-{YYYY-MM-DD}.md` — ranked opportunities.            | `content-gap`      |
| `backlink-plans/`        | `find-backlinks`       | `{YYYY-MM-DD}.md` — target sites + per-target pitch emails.            | `backlink-plan`    |
| `ai-search-audits/`      | `audit-ai-search`      | `{YYYY-MM-DD}.md` — GEO audit + recommended changes.                   | `ai-search-audit`  |

Filenames are kebab-case; dates are ISO (`YYYY-MM-DD`).

---

## Write discipline

- Atomic writes: `{file}.tmp` → rename. Never leave partial JSON
  readable by the dashboard.
- IDs are uuid v4.
- Timestamps are ISO-8601.
- Updates mutate `updatedAt` only; `createdAt` is immutable.
- `outputs.json` is merged in-place — read the existing array, append
  or update in memory, write atomically.
- Never write under `.houston/<agent>/` (the seeded
  `.houston/activity.json` onboarding card is fine — that's written by
  install, not by the agent at runtime).
