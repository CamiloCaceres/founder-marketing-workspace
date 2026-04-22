# Build Conventions — founder-marketing-workspace

Every build subagent reads this before writing files. Reference
implementations:

- `../sdr-agent/` — canonical role-agent shape (CLAUDE.md, data-schema.md, onboard-me SKILL.md, houston.json)
- `../marketing-workspace/agents/strategist/` — canonical bundle.js + outputs-index pattern we mirror exactly
- `../role-agents-workspace/role-agent-guide.md` — full contract (696 lines)
- `TEAM-GUIDE.md` (this workspace) — agent roster, skill lists, use cases, source templates

## File tree per agent

```
agents/{agent-id}/
├── houston.json            # manifest (required)
├── CLAUDE.md               # 50-100 lines, pointer-style identity + skill index
├── data-schema.md          # documents every file read/written
├── README.md               # who this agent is for + first prompts
├── bundle.js               # read-only dashboard (hand-crafted IIFE)
├── icon.png                # 256×256 solid-color PNG (already generated per agent)
├── .gitignore              # one line: *.tmp
└── .agents/skills/
    ├── onboard-me/SKILL.md
    ├── {skill-1}/SKILL.md
    ├── {skill-2}/SKILL.md
    └── ...
```

## `houston.json` template

```json
{
  "id": "{agent-id}",
  "name": "{Agent Display Name}",
  "description": "{one-paragraph}",
  "icon": "{LucideIconName}",
  "category": "business",
  "author": "Houston Founder Marketing",
  "tags": ["marketing", "solo-founder", "..."],
  "tabs": [
    { "id": "overview", "label": "Overview", "customComponent": "Dashboard" },
    { "id": "activity", "label": "Activity", "builtIn": "board", "badge": "activity" },
    { "id": "job-description", "label": "Job Description", "builtIn": "job-description" },
    { "id": "files", "label": "Files", "builtIn": "files" },
    { "id": "integrations", "label": "Integrations", "builtIn": "integrations" }
  ],
  "defaultTab": "overview",
  "agentSeeds": {
    "outputs.json": "[]",
    ".houston/activity.json": "[{\"id\":\"{uuid}\",\"title\":\"Onboard me — 3 quick questions (~90s)\",\"description\":\"Click this card, then send any message to kick off onboarding. I'll ask three things: {T1}, {T2}, {T3}. Best modality per topic: connected app via Composio (Integrations tab) > file/URL > paste.\",\"status\":\"needs_you\"}]"
  },
  "useCases": [
    {
      "category": "{Group label — e.g. Launches, Audits, CRO}",
      "title": "{short display title, opinionated verb phrase — the ONLY text shown on the Overview dashboard}",
      "prompt": "{short, human ready-to-send text with {placeholders} — shown in Job Description, used as clipboard fallback}",
      "fullPrompt": "{3–8 line rich prompt copied to clipboard from the Overview dashboard — states goal, inputs, deliverable, constraints}",
      "description": "{1–2 sentences: what the agent does when you send this — shown in Job Description only}",
      "outcome": "{what the user walks away with — concrete path/artifact — revealed on row hover in Overview}",
      "skill": "{skill-id this use case primarily invokes}"
    }
  ]
}
```

**Rules:**

- First tab `id` must be `overview`, not `dashboard` / `connections` /
  `settings` (those collide with app shell).
- `customComponent` is exactly `"Dashboard"` — matches the bundle
  export `window.__houston_bundle__ = { Dashboard: Dashboard }`.
- `agentSeeds` MUST include every file the dashboard reads on mount.
  Our dashboards read `outputs.json` → seed to `[]`.
- `agentSeeds` MUST include the `.houston/activity.json` onboarding
  card (seeds the "Needs you" column on first install).
- Include the `job-description` built-in tab. Houston renders it as
  "Job Description" with four sub-tabs: **Use Cases · Instructions ·
  Skills · Learnings**. Our `useCases` array populates the first
  sub-tab, which is the founder's primary "what can this agent do for
  me" surface.
- Use a distinct `icon` (Lucide name) and `tags` per agent.

### `useCases` — the founder-facing prompt menu

Every role agent SHOULD declare 5–10 use cases. These drive two
surfaces with different densities:

- **Overview tab** (`bundle.js`) is the founder's first-run menu: the
  first use case renders as a featured "Start here" mission, the rest
  as a compact one-line list grouped by `category`. The row shows ONLY
  `title`; hover reveals `outcome`. Clicking copies `fullPrompt` (or
  `prompt` if `fullPrompt` is absent) to the clipboard.
- **Job Description → Use Cases** shows the full record for each use
  case — `title`, `description`, `prompt`, `outcome`, `skill`, `tool`.

**Writing rules (important — bad use cases are worse than none):**

1. **Be concrete, not generic.** ❌ "Analyze my marketing." ✅
   "Give me the weekly funnel readout — where are we leaking?"
2. **Lead the `title` with a verb + outcome.** ❌ "Launch planning
   skill." ✅ "Sequence a 2-week launch across every agent." The
   `title` is the only text shown on the Overview dashboard — it must
   stand on its own as a one-line CTA.
3. **`prompt` is what the user types.** Short, human, uses
   `{placeholders}` they'll fill in — not imperative robot-speak. This
   is the fallback clipboard payload when `fullPrompt` is absent, and
   it's what renders in the Job Description tab's raw view.
4. **`fullPrompt` is the richer payload copied from the Overview
   dashboard.** Optional but recommended. 3–8 lines of natural-language
   instruction: state the goal, name the inputs the founder should fill
   (`{placeholders}` preserved), the shape of the deliverable, and any
   non-obvious constraint (e.g. "don't invent ad angles — ground every
   headline in a pulled quote"). Reference the target skill/tooling in
   plain language where it helps routing ("Use the `critique-landing-page`
   skill; fetch via Firecrawl."). Never invented by the founder — the
   Overview card is clean because `fullPrompt` carries the context.
5. **`description` is 1–2 sentences, no marketing words.** Describe
   what the agent actually does step-by-step. "Crawls X, extracts Y,
   writes Z." Only visible in Job Description.
6. **`outcome` is concrete.** Name the file path and what the user
   does with it. "A brief at `research/{slug}.md` you can forward to
   any other agent." Revealed on row hover in Overview.
7. **Group by `category`.** 2–4 categories per agent. Examples:
   `Foundation / Competitive / Launches / Research / Reviews` for
   HoM; `Audits / Strategy / Content / Repurposing / Backlinks` for
   SEO. Categories are free-form strings but stay short (1–2 words).
8. **One skill per use case.** `skill` points to the SKILL.md that
   answers this prompt. If two prompts invoke the same skill with
   different framing (e.g. "single-competitor teardown" vs "N-competitor
   weekly digest"), that's fine — two use cases, one skill.
9. **Order matters on Overview.** `useCases[0]` becomes the featured
   "Start here" mission — put the highest-value first action there.
   The rest render in declaration order inside their category groups.
10. **No fluff.** If you can cut an adjective, cut it.

## `CLAUDE.md` template (50-100 lines)

Follow `../sdr-agent/CLAUDE.md` shape. Required sections, in order:

1. `# I'm your {role}` — 2-3 lines: mission + boundary.
2. `## To start` — the "Onboard me" activity card + trigger rule (if first message is short/empty/"go" AND `config/profile.json` is missing, run `onboard-me` immediately).
3. `## My skills` — one line per skill: "`skill-name` — use when X".
4. `## Cross-agent read (all non-HoM agents)` — pointer to `../head-of-marketing/product-marketing-context.md`. Rule: **before any substantive output, read the positioning doc. If it's empty or missing, tell the user to spend 5 minutes with the Head of Marketing first and stop.** (HoM agent omits this section and instead has a section about owning the doc.)
5. `## Composio is my only transport` — copy verbatim from sdr-agent with the agent's integration categories named.
6. `## Data rules` — agent root, never under `.houston/<agent>/`, atomic writes, record id + timestamps, list the key top-level files.
7. `## What I never do` — role-specific hard nos (never send emails without approval, never invent customer facts, never post to social without approval, etc.).

No marketing fluff. If longer than ~100 lines you're manifesto-ing — cut.

## `SKILL.md` template

```markdown
---
name: {skill-id}
description: Use when {observable trigger} — {one-sentence summary of what happens}.
---

# {Skill Title}

## When to use

- Explicit trigger phrases the user says.
- Implicit triggers (e.g. another skill calls this as a dependency).
- Only runs {N} times / per-entity / per-week (if relevant).

## Steps

1. **Read positioning doc** (non-HoM agents only):
   `../head-of-marketing/product-marketing-context.md`. If missing,
   tell the user to run the Head of Marketing's `define-positioning`
   first and stop.
2. **Read config** needed for this skill. If missing, ask ONE
   targeted question naming the best modality (connected app > file
   > URL > paste). Write to `config/{file}.{json|md}` and continue.
3. {actual work — concrete, numbered, imperative}
4. **Write** the markdown artifact to `{topic}/{slug}.md` (atomic:
   `*.tmp` → rename).
5. **Append to `outputs.json`** — new entry with the Output schema
   below. Read existing array, merge, write atomically.
6. **Summarize to user** — one paragraph + path to the artifact.

## Outputs

- `{topic}/{slug}.md`
- Appends to `outputs.json` with `{ id, type, title, summary, path,
  status, createdAt, updatedAt }`.
```

**Rules:**

- Description starts with "Use when…" and names an observable trigger.
- One skill = one purpose. If a skill does 3 things, it's 3 skills.
- Every skill that drafts messages reads `config/voice.md` and
  handles missing voice gracefully (asks with the connected-inbox hint).
- Every skill that needs positioning reads the shared doc first.
- Every skill writes an entry to `outputs.json` AND a markdown file.
- No hardcoded tool names — use `composio search <category>` at
  runtime and execute by slug.
- Atomic writes: write `*.tmp` → rename. Never partial JSON.

## `outputs.json` schema (every agent)

```ts
interface Output {
  id: string;           // uuid v4
  type: string;         // agent-specific enum — see each agent's data-schema.md
  title: string;        // user-facing title
  summary: string;      // 2-3 sentences — what this artifact concludes
  path: string;         // relative to agent root, e.g. "blog-posts/why-solo-founders-fail.md"
  status: "draft" | "ready";
  createdAt: string;    // ISO-8601
  updatedAt: string;    // ISO-8601
}
```

- Mark `draft` while iterating with the founder. Flip to `ready`
  on sign-off.
- On update: refresh `updatedAt`, never touch `createdAt`.
- Never overwrite the whole array — read, merge, write.

## `bundle.js` — hand-crafted IIFE, generated from a template

**Don't author `bundle.js` directly.** Every agent's `bundle.js` is
generated from `scripts/bundle_template.js` + that agent's
`houston.json` by `scripts/generate_bundles.py`. The bundle renders
the agent's `useCases` as an editorial first-action menu: a slim
sticky header, `useCases[0]` as a featured "Start here" mission with a
prominent accent CTA, then the rest as a compact list grouped by
`category`. Each row shows only the `title`; hover reveals the
`outcome`; click copies `fullPrompt` (or `prompt` as fallback) to
clipboard. No gradient cards, no visible prompt text, no stats, no
activity feed.

**The only per-agent inputs:**

1. Agent display name (from `houston.json`).
2. One-line tagline (mapped in `generate_bundles.py`'s `TAGLINES`
   dict — keep it role-specific and opinionated).
3. Accent hue (mapped in `generate_bundles.py`'s `ACCENTS` dict —
   one of `indigo / emerald / amber / sky / rose`).
4. `useCases` array from the agent's `houston.json`.

**To regenerate all 5 bundles after editing `useCases` or the
template:**

```bash
python3 scripts/generate_bundles.py
```

The script writes `agents/{agent-id}/bundle.js` for all five agents
and verifies each loads via a Node shim.

**Hard rules the template enforces:**

- `var React = window.Houston.React;` — never `import React`.
- `React.createElement` (aliased as `h`). No JSX, no build step.
- Do NOT use `@houston-ai/core` — it's not exposed to bundle scope.
  All UI primitives (card, chip, button) are inlined with Tailwind.
- Keep the `useHoustonEvent("houston-event", ...)` literal string
  in a comment — the Phase-6 grep check needs it.
- Export: `window.__houston_bundle__ = { Dashboard: Dashboard };`.
- Tailwind classes the template uses: look up each accent's full
  class strings in the `ACCENTS` object at the top of the template.
  Tailwind's JIT needs literal class strings, so we never build class
  names dynamically with `"bg-" + hue + "-50"`.

**Verification (already baked into the generator):**

```bash
node -e "global.window={Houston:{React:{createElement:()=>null,useState:()=>[{idx:null,at:0},()=>{}],useEffect:()=>{},useCallback:f=>f}}}; eval(require('fs').readFileSync('bundle.js','utf8')); console.log(Object.keys(window.__houston_bundle__))"
```

Expected output: `[ 'Dashboard' ]`.

**Single source of truth:** `useCases` live in each agent's
`houston.json`. The Job Description → Use Cases sub-tab reads them
live from config; the Overview dashboard reads them from the baked-in
bundle. If you edit `useCases`, re-run the generator or the Overview
dashboard will be stale.

## `data-schema.md` template

Document every file the agent reads or writes:

1. `config/` files — what learned context, written by which skill, TS interface.
2. Top-level files at agent root — `outputs.json`, any role-specific top-level file, TS interface.
3. Subfolders — e.g. `blog-posts/{slug}.md`, `campaigns/{slug}.md`.
4. Cross-agent reads (all non-HoM agents) — `../head-of-marketing/product-marketing-context.md`.
5. Atomic-write rule + `.houston/` prohibition.

Follow `../sdr-agent/data-schema.md` shape (229 lines but comprehensive — you can be shorter, 100-150 lines is fine).

## `README.md` template (per-agent, ~40 lines)

```markdown
# {Agent Name}

{2-sentence mission.}

## First prompts

- "{use case 1}"
- "{use case 2}"
- ...   # from TEAM-GUIDE.md

## Skills

{short bulleted list matching CLAUDE.md}

## Cross-agent reads

Reads `../head-of-marketing/product-marketing-context.md` before any
substantive output. (HoM agent omits this — it owns the doc.)

## Outputs

All outputs land as markdown under `{topic}/{slug}.md` plus a
record in `outputs.json` (shown in the Overview dashboard).
```

## `.gitignore` per agent

```
*.tmp
config/
```

(Config is per-install state — never committed.)

## Hard rules (summary — break these = rebuild)

1. **Never write under `.houston/<agent-path>/`** — the Houston
   watcher skips those paths, dashboards won't react. Exception:
   the seeded `.houston/activity.json` onboarding card is fine
   (written by install, not by the agent at runtime).
2. **Never use JSX or build tools** — hand-crafted IIFE bundle.js
   with `React.createElement`.
3. **Never hardcode tool names** — Composio only, discovered at
   runtime with `composio search`.
4. **Never skip atomic writes** — temp-file + rename. Partial JSON
   crashes dashboards.
5. **Never exceed 3 questions in onboard-me** — scope + modality
   preamble + 3 questions + hand-off. More is a research memo, not
   onboarding.
6. **Every skill description starts with "Use when…"** and names an
   observable trigger. Generic descriptions are failed skills.
7. **Non-HoM agents read the positioning doc first** — if missing,
   tell the user and stop. Don't make up the business.
8. **First tab id must NOT be `dashboard`/`connections`/`settings`**.
