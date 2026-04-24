---
name: analyze-funnel
description: "Use when you say 'weekly funnel readout' / 'where are we leaking' / 'analyze the signup funnel' — I compute conversion at each step (from your connected PostHog / GA4 / Mixpanel, or paste), flag the biggest drop, and recommend 2–3 experiments ranked by expected lift × effort. Writes to `funnel-reviews/{date}.md` — clear next actions, not a dashboard dump."
---

# Analyze Funnel

The weekly "where are we leaking" readout. Stage-by-stage conversion,
the one drop-off that matters most, and 2-3 experiments sized to
the founder's week.

## When to use

- "Weekly funnel review"
- "Where are we leaking?"
- "Analyze the signup / activation / purchase funnel"
- Typically run weekly (Monday / Friday) by a routine.

## Steps

1. **Read positioning doc** at
   `../head-of-marketing/product-marketing-context.md`. If missing,
   tell the user to run the Head of Marketing's `define-positioning`
   first and stop.
2. **Read config:** `config/analytics.json`, `config/conversion.json`,
   `config/funnel-stages.json` if present.
3. **Source the numbers — priority order:**
   - a) Connected analytics via Composio. Run `composio search` for
     the provider in `config/analytics.json` (GA4 / PostHog /
     Mixpanel / Amplitude), execute the funnel / query tool by slug,
     pull stage counts for the last 7 days and the prior 7 days.
   - b) If no analytics connected, ask the user to paste numbers in
     the format `stage | count | period`.
   - c) If they can't either, stop — tell them to either connect
     analytics or paste. Don't make up numbers.
4. **Define stages.** If `config/funnel-stages.json` exists, use it.
   Else propose 4-6 stages based on `config/conversion.json` (e.g.
   for signup: `visit → signup_started → signup_completed →
   activation_event → retained_day_7`). Confirm with the user on
   first run, write the chosen stages to `config/funnel-stages.json`.
5. **Compute per-stage conversion.**
   - Stage → next-stage rate (%).
   - Week-over-week delta per stage (if prior-week data available).
   - Absolute drop count per stage (visits lost).
6. **Biggest leak.** The stage with the highest absolute drop AND
   the lowest conversion relative to a reasonable benchmark (B2B
   SaaS: visit→signup 2-5%, signup→activation 30-60%, activation→
   day-7 retention 40-70%). Name it, quantify the gap, quote
   possible causes grounded in anything we know from the positioning
   doc or `cro-critiques/`.
7. **Recommended experiments.** 2-3 experiments, ranked, each:
   - Which stage it targets.
   - The hypothesis (can hand to `design-ab-test` for full spec).
   - Estimated effort (this-week / this-month / larger).
   - Expected directional lift tied to a real mechanism, not a
     magic number.
8. **Write** atomically to `funnel-reviews/{YYYY-MM-DD}.md`
   (`*.tmp` → rename). Include a simple text-based funnel diagram.
9. **Append to `outputs.json`** — `{ id, type: "funnel-review",
   title, summary, path, status: "ready", createdAt, updatedAt }`.
   Merge with existing array, atomic write.
10. **Summarize to user** — top-line conversion, biggest leak with
    the number, one experiment to run this week, path to the full
    review.

## Never invent numbers

If the data source is unreachable, say so and stop. A made-up funnel
is worse than no funnel.

## Outputs

- `funnel-reviews/{YYYY-MM-DD}.md`
- Writes / updates `config/funnel-stages.json` on first run.
- Appends to `outputs.json` with `type: "funnel-review"`.
