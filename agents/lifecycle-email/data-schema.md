# Lifecycle & Email — Data Schema

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
runtime, written by `onboard-me` or by progressive capture inside
another skill the first time it needs the value.

### `config/profile.json` — written by `onboard-me`

```ts
interface Profile {
  userName: string;
  company: string;
  role?: string;
  onboardedAt: string;       // ISO-8601
  status: "onboarded" | "partial";
}
```

### `config/platform.json` — written by `onboard-me`

```ts
interface Platform {
  name: string;               // e.g. "Customer.io", "Beehiiv", "Resend"
  connected: boolean;         // true if a Composio connection is live
  composioSlug?: string;      // resolved at runtime; never hardcoded here
  sendsFromAgent: false;      // always false — this agent never triggers sends
  notes?: string;             // e.g. "will connect later"
  source: "composio" | "paste";
  capturedAt: string;
}
```

### `config/voice.md` — written by `onboard-me` (refreshable)

Markdown. 3-5 verbatim samples of the user's outbound email style
plus a short "tone notes" block (subject-line habits, greeting,
closing, sentence length, formality, quirks). If the user connected
an inbox via Composio, samples are pulled from the 20-30 most recent
sent messages. Otherwise pasted verbatim.

Every drafting skill reads this file. If missing, each skill asks
once with the connected-inbox hint (Composio-connected Gmail /
Outlook / Superhuman > pasted samples) and writes the file before
continuing.

### `config/journey.json` — written by `onboard-me`

The product's lifecycle milestones. Drip triggers and success metrics
reference these event names.

```ts
interface Journey {
  events: {
    name: string;             // e.g. "signup", "first_workspace_created"
    label: string;            // human-readable ("Signed up")
    stage: "signup" | "activation" | "aha" | "habit" | "upgrade"
         | "churn-risk" | "churn";
    order: number;            // display order
    description?: string;
  }[];
  source: "paste" | "file" | "connected-analytics";
  capturedAt: string;
}
```

### Other config files (written just-in-time)

| File | Written by | When |
|------|------------|------|
| `config/segments.json` | `design-lifecycle-campaign` | First drip that targets a defined segment |
| `config/save-policy.json` | `draft-churn-save` | First save — captures the real concessions available (pause, discount, refund window) |

---

## Domain data — what the agent produces

Sits at the agent root. Markdown artifacts + one JSON index.

### `outputs.json` — dashboard index

Single array at the agent root. Every substantive artifact appends an
entry. Read-merge-write atomically — never overwrite the whole array.

```ts
interface Output extends BaseRecord {
  type: "sequence"        // draft-welcome-sequence
      | "newsletter"      // write-newsletter
      | "drip"            // design-lifecycle-campaign
      | "save"            // draft-churn-save
      | "announcement";   // plan-product-announcement
  title: string;
  summary: string;        // 2-3 sentences
  path: string;           // relative to agent root
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
| `sequences/` | `draft-welcome-sequence` | `welcome-{variant-slug}.md` | 5-email welcome series; per-email subject, preview, body, CTA, success metric |
| `newsletters/` | `write-newsletter` | `{YYYY-MM-DD}.md` | Single-edition newsletter; subject + preview + body with one through-line |
| `drips/` | `design-lifecycle-campaign` | `{campaign-slug}.md` | Event-triggered drip; trigger, frequency, branches, drafted emails |
| `saves/` | `draft-churn-save` | `{account-slug-or-persona}.md` | Save email + genuine offer (pause/downgrade/concierge/refund) |
| `announcements/` | `plan-product-announcement` | `{feature-slug}.md` | Announcement email + matching in-app copy (banner / modal / nudge) |

`{slug}` is short kebab-case (e.g. `drips/reactivation-14d-silent.md`,
`announcements/scheduled-sends.md`).

---

## Cross-agent reads

Before any substantive output, skills read:

- `../head-of-marketing/product-marketing-context.md` — **required**.
  Positioning, ICP, voice notes, primary CTA. If missing or empty, the
  skill tells the user to run the Head of Marketing's
  `define-positioning` first and stops.

Optional cross-agent reads (graceful if missing):

- `../head-of-marketing/launches/{feature-slug}.md` —
  `plan-product-announcement` keys the email + in-app copy to this
  launch plan when one exists.
- `../seo-content/outputs.json` — `write-newsletter` can pull a recent
  blog post or repurposed asset as source material for the edition.

Each read handles missing gracefully — if a file isn't there, note it
and continue with what the user provided directly.

---

## Write discipline

- **Atomic writes.** Always write to `{file}.tmp` first, then rename.
  Partial JSON crashes the dashboard.
- **IDs** are UUID v4.
- **Timestamps** are ISO-8601 UTC.
- **Never write under `.houston/<agent>/` at runtime.** The watcher
  skips that path. The seeded install-time `.houston/activity.json`
  card is fine — that's written once at install, not by the agent.
- **Drafts only.** Every artifact is a draft for the user to review
  and send from their own platform. The agent never triggers a send.
