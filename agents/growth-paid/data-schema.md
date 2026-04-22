# Growth & Paid — Data Schema

All paths are relative to the agent root. Nothing lives under
`.houston/<agent>/` — Houston's file watcher skips that prefix.
Every JSON write is atomic: write `{file}.tmp` then rename.

## Base record

```ts
interface BaseRecord {
  id: string;          // uuid v4
  createdAt: string;   // ISO-8601 UTC
  updatedAt: string;   // ISO-8601 UTC
}
```

---

## Config — what the agent has learned about the user

Nothing in `config/` ships in the repo. Every file appears at runtime,
written by `onboard-me` or progressively the first time a skill needs
the value.

### `config/profile.json` — written by `onboard-me`

```ts
interface Profile {
  userName?: string;
  company?: string;
  onboardedAt: string;
  status: "onboarded" | "partial";
}
```

### `config/channels.json` — written by `onboard-me`

```ts
interface Channels {
  active: string[];          // e.g. ["google-ads", "meta-ads", "linkedin-ads"]
  connectedSlugs: string[];  // Composio tool slugs discovered at onboard time
  monthlyBudgetUSD?: number;
  source: "composio" | "paste" | "file";
  capturedAt: string;
}
```

### `config/analytics.json` — written by `onboard-me`

```ts
interface Analytics {
  stack: string[];           // e.g. ["ga4", "posthog"]
  connectedSlugs: string[];  // Composio slugs
  source: "composio" | "paste" | "none";
  capturedAt: string;
}
```

### `config/conversion.json` — written by `onboard-me`

```ts
interface Conversion {
  primaryEvent: string;      // "signup" | "install" | "purchase" | "demo-booked" | custom
  definition?: string;       // free-text definition of the event
  currentRate?: number;      // baseline conversion rate 0..1
  capturedAt: string;
}
```

### Other config files (just-in-time)

| File | Written by | When |
|------|------------|------|
| `config/landing-page.json` | `critique-landing-page` | First critique — captures the primary URL + CTA |
| `config/tracking-prefs.json` | `setup-tracking` | First tracking plan — captures naming conventions |
| `config/funnel-stages.json` | `analyze-funnel` | First funnel review — captures stage names |

---

## Top-level files

### `outputs.json` — index of every artifact

```ts
interface Output extends BaseRecord {
  type: "campaign" | "competitor-ads" | "ad-copy" | "cro-critique"
      | "ab-test" | "tracking-plan" | "funnel-review";
  title: string;
  summary: string;           // 2-3 sentences — what this artifact concludes
  path: string;              // relative to agent root
  status: "draft" | "ready";
}
```

Seeded to `[]` via `agentSeeds` so a fresh install doesn't flood with
"file not found" toasts. The dashboard reads it on mount and polls
every 5s.

---

## Topic subfolders (markdown artifacts)

Each output's full document is a markdown file under a topic subfolder
at the agent root. Created on first use. Filenames are kebab-case.

| Subfolder | Written by | Contents |
|-----------|------------|----------|
| `campaigns/` | `plan-paid-campaign` | Full campaign brief — audience, keywords/placements, budget plan, ad-group structure, creative angles, landing-page requirement, KPI targets. Filename: `{channel}-{slug}.md` (e.g. `google-ads-solo-founders.md`). |
| `competitor-ads/` | `monitor-competitor-ads` | Teardown of a competitor's live ads pulled from Meta / LinkedIn / Google Ad Libraries. Filename: `{competitor-slug}-{YYYY-MM-DD}.md`. |
| `ad-copy/` | `generate-ad-copy` | Headlines + descriptions + CTAs grounded in real customer quotes (from `../head-of-marketing/call-insights/` or scraped reviews). Filename: `{campaign-slug}.md`. |
| `cro-critiques/` | `critique-landing-page` | Scored teardown of a landing page (headline / value prop / social proof / CTA / objections / visual hierarchy / speed), 0-3 per dimension, prioritized fix list. Filename: `{url-slug}-{YYYY-MM-DD}.md`. |
| `ab-tests/` | `design-ab-test` | Hypothesis (PICOT), control vs variant, primary + secondary metrics, sample-size estimate with MDE + power, duration, go/no-go criteria. Filename: `{slug}.md`. |
| `tracking-plans/` | `setup-tracking` | Event-tracking spec (event name, trigger, properties, owner) + UTM matrix (source/medium/campaign naming rules). Filename: `{slug}.md`. |
| `funnel-reviews/` | `analyze-funnel` | Weekly readout — stage-by-stage conversion, biggest drop-off, recommended experiments. Filename: `{YYYY-MM-DD}.md`. |

---

## Cross-agent reads

- **`../head-of-marketing/product-marketing-context.md`** — positioning
  / ICP / voice. Read by every non-onboard skill before substantive
  output. If missing or empty, the skill stops and tells the user to
  run Head of Marketing's `define-positioning` first.
- **`../head-of-marketing/call-insights/`** (optional) — used by
  `generate-ad-copy` for verbatim customer language. If absent, falls
  back to competitor-review scraping via Composio.

Growth & Paid does **not** write to other agents' directories.

---

## Write discipline

- Atomic writes: `{file}.tmp` → rename. Never leave partial JSON.
- Every record has `id` (uuid v4), `createdAt`, `updatedAt`.
- Updates refresh `updatedAt` only; `createdAt` is immutable.
- `outputs.json` is merged in place — read existing array, append /
  update, write atomically. Never overwrite wholesale.
- Never write under `.houston/<agent>/` — Houston's watcher skips it
  and dashboards won't react. The seeded `.houston/activity.json`
  onboarding card is the one exception (it's install-seeded, not
  runtime-written).
