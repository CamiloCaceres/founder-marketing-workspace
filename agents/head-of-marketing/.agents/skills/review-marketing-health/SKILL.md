---
name: review-marketing-health
description: "Use when you say 'Monday marketing review' / 'weekly readout' — I aggregate what each of the other agents produced this week (blog posts, campaigns, emails, social, page rewrites), flag gaps like 'Lifecycle hasn't shipped a drip in 3 weeks', and recommend next moves per agent. Writes to `reviews/{date}.md` — a 2-minute scan."
---

# Review Marketing Health

The weekly cross-agent rollup. The one skill in the workspace that
reads other agents' output indexes (read-only) and gives the founder
a single narrative readout.

## When to use

- "Monday marketing review" / "how's marketing doing" / "give me the
  weekly readout" / "weekly marketing health check".
- Weekly routine (optional — the user wires it via the Routines tab
  for e.g. Monday 8:00).

## Steps

1. **Read positioning doc** (own file):
   `product-marketing-context.md`. The review frames everything
   against current positioning + primary CTA — not generic
   marketing KPIs.

2. **Read every peer agent's `outputs.json`** (read-only, handle
   missing gracefully):
   - `../seo-content/outputs.json`
   - `../growth-paid/outputs.json`
   - `../lifecycle-email/outputs.json`
   - `../social-community/outputs.json`
   - `outputs.json` (my own — HoM activity)

   If an agent isn't installed or the file is missing, note it as
   "no activity (not installed / no outputs yet)" and continue.

3. **Filter to the review window.** Default window: last 7 days by
   `createdAt` or `updatedAt`. If the user asks for a different
   window ("last 2 weeks", "since the launch"), use that.

4. **Per agent, compute:**
   - Count of outputs this window, by `type`.
   - Notable shipped items (top 3 by recency). Include title +
     path + status.
   - Drafts still open (status = "draft") that have been stale
     >7 days.
   - Gaps — what this agent hasn't produced that the solo-founder
     stack expects. Examples:
     - `seo-content` — no blog post this week.
     - `growth-paid` — no campaign brief this week, or no funnel
       review this month.
     - `lifecycle-email` — no newsletter, or welcome sequence never
       drafted.
     - `social-community` — fewer than N posts this week (if
       `social-calendar.md` exists, compare planned vs. shipped).

5. **Cross-cutting patterns.** Look for:
   - Launch drift — an open `launches/{slug}.md` from HoM whose
     dependent agents haven't shipped their piece.
   - Competitor pressure — recent `competitor-briefs/` flagging
     threats that no other agent has acted on.
   - Positioning drift — recent `call-insights/` deltas that never
     made it into `product-marketing-context.md`.

6. **Draft the review (markdown, ~400-700 words).**

   1. **Window + TL;DR** — 3-5 bullets covering the week.
   2. **What shipped, per agent** — short section per agent (HoM,
      SEO, Growth, Lifecycle, Social). Include counts, top items,
      status. Mark missing agents explicitly.
   3. **Gaps** — bulleted. Severity-ranked. Example: "Lifecycle
      hasn't shipped a drip in 3 weeks — we're leaking activation."
   4. **Cross-cutting issues** — launch drift, unactioned
      competitor signals, positioning drift from calls.
   5. **Recommended next moves** — 3-5 concrete actions, each
      tagged with the owner agent. These should be one-week
      actions.
   6. **What to flip to ready** — list of `draft` outputs across
      agents that the founder should review and sign off on.

7. **Never invent metrics.** If an agent has no tracking data,
   don't make one up. The review reports what the agents actually
   produced — it's a production review, not a GA4 dashboard.

8. **Write atomically** to `reviews/{YYYY-MM-DD}.md` — `{path}.tmp`
   then rename. Date is today's ISO date.

9. **Append to `outputs.json`** (my own index). Read-merge-write
   atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "review",
     "title": "Marketing review — <YYYY-MM-DD>",
     "summary": "<2-3 sentences — what shipped, top gap, top next move>",
     "path": "reviews/<YYYY-MM-DD>.md",
     "status": "ready",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

   (Reviews ship as `ready` — they're factual rollups, not drafts.)

10. **Summarize to user.** One paragraph: "This week {N} outputs
    across {agents shipping}. Biggest gap: {gap}. Biggest next
    move: {move}. Full review: {path}."

## Outputs

- `reviews/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "review"`.
