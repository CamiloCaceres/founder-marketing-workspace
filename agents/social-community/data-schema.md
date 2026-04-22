# Social & Community — Data Schema

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

## Cross-agent reads

Before any substantive output, this agent reads:

1. `../head-of-marketing/product-marketing-context.md` — the shared
   positioning / ICP / voice / competitor doc owned by the Head of
   Marketing. If missing or empty, skills tell the user to run the
   Head of Marketing's `define-positioning` first and stop.
2. `../seo-content/outputs.json` — used by `plan-social-calendar` to
   surface blog posts, case studies, and repurposed artifacts worth
   cross-posting to social. Optional read — if missing, the calendar
   simply omits repurpose slots.

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
  onboardedAt: string;         // ISO-8601
  status: "onboarded" | "partial";
}
```

### `config/platforms.json` — written by `onboard-me`

```ts
interface Platforms {
  active: Array<
    "linkedin" | "x" | "reddit" | "instagram" | "tiktok" | "other"
  >;
  connectedViaComposio: string[];  // subset of `active` that are linked
  handles?: Record<string, string>; // e.g. { linkedin: "in/jane", x: "@jane" }
  primary: string;                  // the platform you care about most
  source: "paste" | "connected-app";
  capturedAt: string;
}
```

### `config/voice.md` — written by `onboard-me` (refreshable)

Markdown. 2-3 verbatim samples of the user's recent posts (LinkedIn / X)
plus a short "tone notes" block (hook style, sentence length, formality,
emoji usage, hashtag habits, quirks). If connected inbox via Composio,
may also include 3-5 excerpts from recent sent messages.

### `config/topics.json` — written by `onboard-me`

```ts
interface Topics {
  themes: Array<{
    slug: string;              // kebab-case, e.g. "saas-pricing"
    label: string;             // display, e.g. "SaaS pricing"
    pov: string;               // one-line point of view
    examplePosts?: string[];   // optional anchor posts
  }>;
  capturedAt: string;
}
```

### Other config files (written just-in-time)

| File | Written by | When |
|------|------------|------|
| `config/podcast-targets.json` | `pitch-podcast` | First run — audience / category preferences |
| `config/calendar-cadence.json` | `plan-social-calendar` | First run — posts-per-week per platform |

---

## Top-level files at agent root

### `outputs.json`

Index of every deliverable this agent has produced. Read by the
dashboard; seeded to `[]` via `agentSeeds`.

```ts
interface Output {
  id: string;          // uuid v4
  type: "linkedin-post" | "x-thread" | "community-reply"
      | "social-calendar" | "feed-digest" | "linkedin-digest"
      | "podcast-pitch";
  title: string;
  summary: string;     // 2-3 sentences — the angle / conclusion
  path: string;        // relative to agent root
  status: "draft" | "ready";
  createdAt: string;   // ISO-8601
  updatedAt: string;   // ISO-8601
}
```

Rules:
- On update, refresh `updatedAt`, never touch `createdAt`.
- Never overwrite the array — read, merge, write atomically.
- Mark `draft` until you (the founder) sign off; flip to `ready`.

### `social-calendar.md` (living document, root)

Single living markdown doc. One section per week, newest on top.
`plan-social-calendar` appends a new week without rewriting previous
weeks. Full per-week detail (per-day, per-platform draft slots) lives
under `social-calendars/{YYYY-WNN}.md`.

---

## Topic subfolders (markdown files)

Each artifact's full document is a markdown file under a topic
subfolder at the agent root. The subfolder is created on first use.

| Subfolder | Written by | Contents | `type` |
|-----------|------------|----------|--------|
| `posts/` | `draft-linkedin-post` | `linkedin-{slug}.md` — hook, body, CTA, suggested hashtags. | `linkedin-post` |
| `threads/` | `draft-x-thread` | `x-{slug}.md` — numbered 5-12 tweets, hook, CTA tweet. | `x-thread` |
| `community-replies/` | `draft-community-reply` | `{source-slug}.md` — source-thread summary + value-first reply. | `community-reply` |
| `social-calendars/` | `plan-social-calendar` | `{YYYY-WNN}.md` — full per-week per-platform per-day plan. | `social-calendar` |
| `feed-digests/` | `monitor-social-feed` | `{platform}-{YYYY-MM-DD}.md` — signal posts + suggested replies. | `feed-digest` |
| `linkedin-digests/` | `digest-linkedin-activity` | `{YYYY-MM-DD}.md` — own-post stats + notable network posts. | `linkedin-digest` |
| `podcast-pitches/` | `pitch-podcast` | `{YYYY-MM-DD}.md` — per-show section (host, show, angle, pitch email). | `podcast-pitch` |

Filenames are kebab-case; dates ISO (`YYYY-MM-DD`); week files use
ISO week (`YYYY-WNN`).

---

## Write discipline

- Atomic writes: `{file}.tmp` → rename. Never leave partial JSON
  readable by the dashboard.
- IDs are uuid v4.
- Timestamps are ISO-8601.
- Updates mutate `updatedAt` only; `createdAt` is immutable.
- `outputs.json` is merged in-place — read the existing array, append
  or update in memory, write atomically.
- `social-calendar.md` is appended in-place — read, prepend the new
  week section, write atomically. Never overwrite prior weeks.
- Never write under `.houston/<agent>/` (the seeded
  `.houston/activity.json` onboarding card is fine — written by
  install, not by the agent at runtime).
