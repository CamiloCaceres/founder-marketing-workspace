# Head of Marketing — Data Schema

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
reactivity breaks. Exception: the seeded `.houston/activity.json`
onboarding card at install time is fine; the agent never writes there
at runtime.

---

## Config — what the agent learns about the user

Nothing in `config/` is shipped in the repo. Every file appears at
runtime, written by `onboard-me` or by progressive capture.

### `config/profile.json` — written by `onboard-me`

```ts
interface Profile {
  userName: string;
  company: string;
  role?: string;
  onboardedAt: string;        // ISO-8601
  status: "onboarded" | "partial";
}
```

### `config/company.json` — written by `onboard-me`

```ts
interface Company {
  name: string;
  oneLine: string;            // one-line pitch
  url?: string;
  painsSolved: string[];
  differentiators?: string[];
  pricing?: { model: string; range?: string };
  source: "paste" | "url" | "file";
  capturedAt: string;
}
```

### `config/icp.json` — written by `onboard-me` or `profile-icp`

```ts
interface Icp {
  industry: string[];
  size: { min?: number; max?: number; band?: string };
  role: string[];              // e.g. ["Head of RevOps", "VP Marketing"]
  stage?: string[];
  triggers: string[];          // signal patterns
  examples: string[];          // named anchor accounts
  pains?: string[];
  jobsToBeDone?: string[];
  source: "paste" | "url" | "file" | "connected-crm";
  capturedAt: string;
}
```

### `config/voice.md` — written by `onboard-me`

Markdown. 3-5 verbatim samples of the user's writing plus a short
"tone notes" block (greeting habits, sentence length, formality,
quirks). Refreshable.

---

## The shared positioning doc

### `product-marketing-context.md` — written by `define-positioning`

**Special file.** Lives at the agent root (NOT in a subfolder, NOT
under `.agents/`). This is the single source of truth for positioning,
ICP, JTBD, and differentiation across the whole workspace.

- The Head of Marketing is the ONLY agent that writes it.
- Every non-HoM agent reads it via
  `../head-of-marketing/product-marketing-context.md` before any
  substantive output. If missing, they stop and tell the user to run
  the Head of Marketing first.
- It is a live document, NOT a deliverable — it is **not** recorded
  in `outputs.json`.

Structure (markdown, ~300-500 words):

1. Company overview
2. ICP (with 1-2 anchor accounts)
3. Jobs-to-be-done
4. Positioning statement
5. Category & differentiators
6. Top 3 competitors
7. Brand voice notes
8. Pricing stance
9. Primary CTA

---

## Domain data — what the agent produces

### `outputs.json` — dashboard index

Single array at the agent root. Every substantive artifact appends an
entry. Read-merge-write atomically — never overwrite the whole array.

```ts
interface Output extends BaseRecord {
  type: "positioning"         // define-positioning (note: context doc itself is NOT indexed; only explicit positioning memos are)
       | "persona"            // profile-icp
       | "competitor"         // track-competitors
       | "launch"             // plan-launch
       | "research"           // synthesize-research
       | "call-insight"       // mine-sales-calls
       | "review";            // review-marketing-health
  title: string;
  summary: string;            // 2-3 sentences — what this artifact concludes
  path: string;               // relative to agent root
  status: "draft" | "ready";
}
```

- Mark `draft` while iterating with the founder. Flip to `ready` on
  sign-off.
- On update: refresh `updatedAt`, never touch `createdAt`.

### Topic subfolders

All markdown artifacts. One file per deliverable.

| Subfolder | Written by | Filename pattern | Content |
|-----------|------------|------------------|---------|
| `personas/` | `profile-icp` | `{segment-slug}.md` | Persona: pains, JTBD, triggers, anchor accounts, objections, buying process |
| `competitor-briefs/` | `track-competitors` | `{competitor-slug}.md` or `weekly-{YYYY-MM-DD}.md` | Teardown or weekly digest — recent activity, threats, opportunities vs our positioning |
| `launches/` | `plan-launch` | `{launch-slug}.md` | Pre-launch / launch-day / post-launch plan with tasks per other marketing agent |
| `research/` | `synthesize-research` | `{topic-slug}.md` | Structured research brief |
| `call-insights/` | `mine-sales-calls` | `{YYYY-MM-DD}-batch.md` or `{call-slug}.md` | Verbatim customer language, pains, objections, positioning signals |
| `reviews/` | `review-marketing-health` | `{YYYY-MM-DD}.md` | Weekly cross-agent rollup + gaps + next moves |

`{slug}` is a short kebab-case identifier derived from the title
(e.g. `personas/series-b-revops.md`,
`competitor-briefs/notion-2026-04-20.md`).

---

## Cross-agent reads

The Head of Marketing reads (never writes) these files to produce the
Monday review:

- `../seo-content/outputs.json`
- `../growth-paid/outputs.json`
- `../lifecycle-email/outputs.json`
- `../social-community/outputs.json`

Each read handles missing gracefully — if an agent isn't installed or
has no outputs yet, note it as "no activity" and continue.

---

## Write discipline

- **Atomic writes.** Always write to `{file}.tmp` first, then rename.
  Partial JSON crashes the dashboard.
- **IDs** are UUID v4.
- **Timestamps** are ISO-8601 UTC.
- **Never write under `.houston/<agent>/` at runtime.** The watcher
  skips that path. The seeded install-time `.houston/activity.json`
  card is fine — that's written once at install, not by the agent.
- **`product-marketing-context.md` is live.** It's not recorded in
  `outputs.json`. Every update refreshes it in place (atomic rename).
