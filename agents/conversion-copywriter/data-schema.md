# Conversion Copywriter — Data Schema

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

### `config/primary-page.json` — written by `onboard-me`

```ts
interface PrimaryPage {
  url: string;                 // e.g. "https://acme.com"
  primaryCta: string;          // visible button text on the page
  primaryConversionEvent: string; // "signup" | "demo-booked" | "purchase" | "install" | custom
  source: "composio" | "paste" | "file";
  capturedAt: string;
}
```

### `config/voice.md` — written by `onboard-me`

Free-form markdown. Contains 3-5 verbatim writing samples from the
founder (pulled from a connected inbox via Composio when possible;
otherwise pasted), plus a short tone summary: formality, sentence
length, greeting / closing patterns, quirks, words to avoid. Every
drafting / editing skill reads this before producing output.

### `config/leaky-surface.json` — written by `onboard-me`

```ts
interface LeakySurface {
  surface: "page" | "signup-flow" | "onboarding" | "paywall" | "popup" | "form";
  notes?: string;    // e.g. "homepage bounce rate ~80%"
  capturedAt: string;
}
```

Used by the handoff at the end of `onboard-me` to route the founder
to the right first skill.

### Other config files (just-in-time)

| File | Written by | When |
|------|------------|------|
| `config/form-prefs.json` | `optimize-form` | First form audit — captures form-tool preference |
| `config/signup-flow.json` | `optimize-signup-flow` | First flow review — captures step count + entry path |
| `config/paywall-prefs.json` | `optimize-paywall-upgrade` | First audit — captures current plan structure |

---

## Top-level files

### `outputs.json` — index of every artifact

```ts
interface Output extends BaseRecord {
  type: "page-copy" | "copy-edit" | "headline-variants" | "cta-variants"
      | "form-audit" | "signup-flow-review" | "onboarding-copy"
      | "paywall-audit" | "popup-spec";
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
| `page-copy/` | `write-page-copy` | Full page rewrite — hero + subhead + value props + social proof + objection + CTA, paired Current → Proposed → Why. Filename: `{page-slug}-{YYYY-MM-DD}.md`. |
| `copy-edits/` | `edit-copy` | Multi-sweep edit pass (clarity, voice, specificity, length, CTAs) of existing copy. Current → Proposed → Why per line. Filename: `{page-slug}-{YYYY-MM-DD}.md`. |
| `headline-variants/` | `write-headline-variants` | 10 headline + subhead pairs, each with the verbatim source quote it grounds on. Top 3 ranked. Filename: `{page-slug}-{YYYY-MM-DD}.md`. |
| `cta-variants/` | `write-cta-variants` | 5-7 CTA button variants, each tied to a specific objection. Top 2 ranked. Filename: `{page-slug}-{YYYY-MM-DD}.md`. |
| `form-audits/` | `optimize-form` | Field-by-field audit (keep / drop / defer), label rewrites, friction causes, top 3 changes. Filename: `{form-slug}-{YYYY-MM-DD}.md`. |
| `signup-flow-reviews/` | `optimize-signup-flow` | Step-by-step review — cut / merge / defer steps, full replacement copy. Filename: `{flow-slug}-{YYYY-MM-DD}.md`. |
| `onboarding-copy/` | `optimize-onboarding-copy` | Welcome screen, empty states, checklist, tooltips, aha-moment copy. Paired Current → Proposed → Why. Filename: `{product-slug}-{YYYY-MM-DD}.md`. |
| `paywall-audits/` | `optimize-paywall-upgrade` | Audit of in-product upgrade moment — timing, plan comparison, objections, social proof, CTA, dismissal. Filename: `{surface-slug}-{YYYY-MM-DD}.md`. |
| `popup-specs/` | `optimize-popup` | Full popup spec — trigger, targeting, copy, dismissal, frequency cap, success metric. Filename: `{goal-slug}-{YYYY-MM-DD}.md`. |

---

## Cross-agent reads

- **`../head-of-marketing/product-marketing-context.md`** — positioning
  / ICP / JTBD / objections / voice guidance. Read by every non-onboard
  skill before substantive output. If missing or empty, the skill stops
  and tells the user to run Head of Marketing's `define-positioning`
  first.
- **`../head-of-marketing/call-insights/`** (optional) — used by
  `write-headline-variants` and `write-cta-variants` for verbatim
  customer language. If absent, falls back to review-scrape via
  Composio.
- **`../head-of-marketing/research/`** (optional) — additional quote
  bank for headline grounding.

Conversion Copywriter does **not** write to other agents' directories.

---

## Write discipline

- Atomic writes: `{file}.tmp` → rename. Never leave partial JSON.
- Every record has `id` (uuid v4), `createdAt`, `updatedAt`.
- Updates refresh `updatedAt` only; `createdAt` is immutable.
- `outputs.json` is merged in place — read existing array, append /
  update, write atomically. Never overwrite wholesale.
- Never write under `.houston/<agent>/` — Houston's watcher skips it
  and dashboards won't react. The seeded `.houston/activity.json`
  onboarding card is the one exception (install-seeded, not
  runtime-written).
