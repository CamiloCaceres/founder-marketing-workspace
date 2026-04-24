---
name: track-competitors
description: "Use when you say 'weekly competitor pulse' / 'what did {competitor} ship' / 'teardown of {X}' — I scan each competitor's recent blog posts, product updates (via Firecrawl), ad activity (Meta / LinkedIn Ad Library), and social, filtering real threats from noise. Works as a single-competitor teardown or an N-competitor weekly digest. Writes to `competitor-briefs/{slug}.md`."
---

# Track Competitors

Absorbs the Gumloop competitor templates into one skill: Competitive
SEO Analyzer, Competitive Ad Intelligence, Competitive Conquest,
Competitor Article Insights, Analyze competitors' recent content
activity.

## When to use

- "weekly competitor pulse" / "what did {A, B, C} ship this week".
- "teardown of {competitor}" / "give me a Competitive Conquest on
  {competitor}".
- Weekly routine (optional — the user can wire it via the Routines
  tab).

Supports two modes, chosen by the user phrasing:

- **Teardown** — one named competitor. Deep dive.
- **Weekly digest** — N competitors (default: the 3 in the positioning
  doc). Broader, shorter per competitor.

## Steps

1. **Read positioning doc** (own file):
   `product-marketing-context.md`. Extract current named competitors
   from section 6 and our stated differentiators (section 5). If
   missing, run `define-positioning` first — competitor work without
   positioning is just gossip.

2. **Determine mode + competitor list.** If user named one
   competitor → teardown mode. If user said "weekly pulse" or named
   multiple → digest mode. If no names given, default to the 3 from
   the positioning doc.

3. **Discover tools at runtime.** Do NOT hardcode tool names. Run:
   - `composio search web-scrape` — for homepage / blog / changelog
     fetches.
   - `composio search web-search` — for news and funding events.
   - `composio search seo-intel` — for ranking / keyword changes
     (optional, only if the user has a connected provider).
   - `composio search ad-intel` — for ad activity (optional).

   If a needed category has no connected tool, note it in the brief
   ("no ad-intel connection — ad activity: UNKNOWN") and continue.

4. **Gather evidence per competitor** (last 7 days for digest, last
   30 days for teardown):
   - **Site / messaging** — homepage hero, any changed copy.
   - **Product / changelog** — new features or pricing changes.
   - **Content** — recent blog posts, podcast appearances, newsletters.
   - **SEO** — ranking gains / losses on positioning-relevant
     keywords (if seo-intel connected).
   - **Ads** — active paid creative angles (if ad-intel connected).
   - **Social / news** — funding, hires, product launches.

5. **Compare against our positioning.** For each signal, ask: does
   this threaten one of OUR differentiators? Does it open a gap WE
   should attack? Cite verbatim competitor copy vs. our
   positioning-doc copy — side-by-side is clearer than prose.

6. **Structure the output (markdown).**

   **Teardown mode** (`competitor-briefs/{competitor-slug}.md`,
   ~500-800 words):

   1. One-paragraph summary of who they are + where they sit vs. us.
   2. What's new (last 30 days, bulleted with dates + sources).
   3. How they're positioning themselves right now (quote them).
   4. Threats — ranked. What they're doing that attacks our
      differentiation.
   5. Opportunities — ranked. Where they're weak / silent / over-
      promising and we should press.
   6. Recommended moves — 3 concrete, one-week actions the founder
      can hand directly to `seo-content`, `growth-paid`,
      `lifecycle-email`, or `social-community`.
   7. Sources — URLs with fetch timestamps.

   **Digest mode** (`competitor-briefs/weekly-{YYYY-MM-DD}.md`,
   ~300-500 words):

   1. Headline table: competitor · top signal · threat? · opportunity?
   2. Per-competitor: 3-5 bullets each, newest first, with source
      links.
   3. Cross-cutting pattern: is anything converging (e.g. all three
      competitors are talking about the same category shift)?
   4. Recommended moves — 3 actions, each tagged with the agent
      that should execute it.
   5. Sources.

7. **Never invent.** Every claim ties to a URL + timestamp or is
   marked `UNKNOWN`. Competitor teardowns with made-up quotes are
   worse than no teardown.

8. **Write atomically** to the target path — write `{path}.tmp`,
   then rename.

9. **Append to `outputs.json`.** Read-merge-write atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "competitor",
     "title": "<Competitor name> teardown" | "Weekly competitor pulse <YYYY-MM-DD>",
     "summary": "<2-3 sentences — top threat + top opportunity>",
     "path": "competitor-briefs/<slug>.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

10. **Summarize to user.** One paragraph: biggest threat, biggest
    opportunity, the 1 move to make this week, path to the artifact.

## Outputs

- `competitor-briefs/{competitor-slug}.md` (teardown) or
  `competitor-briefs/weekly-{YYYY-MM-DD}.md` (digest).
- Appends to `outputs.json` with `type: "competitor"`.
