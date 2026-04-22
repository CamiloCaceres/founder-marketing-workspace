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
    { "id": "files", "label": "Files", "builtIn": "files" },
    { "id": "integrations", "label": "Integrations", "builtIn": "integrations" }
  ],
  "defaultTab": "overview",
  "agentSeeds": {
    "outputs.json": "[]",
    ".houston/activity.json": "[{\"id\":\"{uuid}\",\"title\":\"Onboard me — 3 quick questions (~90s)\",\"description\":\"Click this card, then send any message to kick off onboarding. I'll ask three things: {T1}, {T2}, {T3}. Best modality per topic: connected app via Composio (Integrations tab) > file/URL > paste.\",\"status\":\"needs_you\"}]"
  }
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
- Use a distinct `icon` (Lucide name) and `tags` per agent.

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

## `bundle.js` — hand-crafted IIFE (DO NOT USE JSX / build tools)

Clone `../marketing-workspace/agents/strategist/bundle.js` exactly
and customize ONLY these five blocks at the top:

```js
var AGENT_NAME = "{Agent Name}";
var AGENT_TAGLINE = "{1-line tagline matching the role}";
var ACCENT = "{tailwind-color-word}";  // indigo / emerald / amber / rose / sky
var TYPE_COLORS = {
  {your-output-types-from-data-schema}: "bg-{tw}-100 text-{tw}-800",
  ...,
  default: "bg-slate-200 text-slate-700"
};
var QUICK_PROMPTS = [
  "{First prompt from the agent's README}",
  "{...}",   // 5 prompts total
];
```

The rest of the file (Stat, Badge, Empty, Dashboard, reload logic,
5s polling fallback, `window.__houston_bundle__ = { Dashboard }`)
stays identical.

**Hard rules for bundle.js:**

- `var React = window.Houston.React;` — never `import React`.
- Use `React.createElement` (aliased as `h`). No JSX.
- Do NOT use `@houston-ai/core` — it's not exposed to bundle scope.
  Inline Card / Badge / Empty equivalents with raw divs + Tailwind.
- Keep the `useHoustonEvent("houston-event", ...)` literal string
  in a comment — the Phase-6 grep check needs it.
- 5s `setInterval(reload, 5000)` polling fallback is required
  until Houston exposes `window.Houston` events.
- Export: `window.__houston_bundle__ = { Dashboard: Dashboard };`

**Verification:** every build subagent runs the Node shim to confirm
the bundle loads:

```bash
node -e "global.window={Houston:{React:{createElement:()=>null,useState:()=>[[],()=>{}],useEffect:()=>{},useCallback:f=>f}}}; eval(require('fs').readFileSync('bundle.js','utf8')); console.log(Object.keys(window.__houston_bundle__))"
```

Expected output: `[ 'Dashboard' ]`.

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
