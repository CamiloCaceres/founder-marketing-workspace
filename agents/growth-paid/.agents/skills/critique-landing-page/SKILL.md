---
name: critique-landing-page
description: "Use when you say 'critique {url}' / 'teardown my landing page' / 'why isn't {page} converting' — I fetch the page via Firecrawl and score 6 dimensions 0–3 (headline clarity, value prop, social proof, CTA, objection handling, visual hierarchy), then give a prioritized fix list — not a generic lecture. Writes to `cro-critiques/{url-slug}-{date}.md`. For a rewrite, Conversion Copywriter's `write-page-copy` takes it from here."
integrations: [firecrawl]
---

# Critique Landing Page

Not a "looks nice" review — a scored teardown with a prioritized
fix list the founder can ship this week.

## When to use

- "Critique the landing page at {url}"
- "Teardown my pricing page"
- "Why isn't /signup converting?"
- Called by `plan-paid-campaign` when the routed landing page needs
  sharpening before a campaign launches.

## Steps

1. **Read positioning doc** at
   `../head-of-marketing/product-marketing-context.md`. If missing,
   tell the user to run the Head of Marketing's `define-positioning`
   first and stop. (We judge the page against their own positioning,
   not a generic template.)
2. **Read config:** `config/conversion.json` (what the page should
   drive), `config/landing-page.json` if present.
3. **Fetch the page.** Run `composio search` for web-scrape tools
   (Firecrawl, ScrapingBee, Browserless) and execute by slug to pull
   the rendered HTML + visible text + primary image URLs + page
   title / meta + any page-speed signals the tool returns. If no
   web-scrape tool is connected, ask the user to link one and stop.
4. **Score each dimension 0-3** with a one-sentence reason quoting
   the page:
   - **Headline clarity** — does it name WHO + WHAT in <=12 words?
   - **Value prop above the fold** — is the outcome (not feature
     list) visible without scrolling?
   - **Social proof** — logos / numbers / testimonials credible and
     close to the CTA?
   - **Primary CTA** — one unambiguous action, visible, matches the
     conversion event from `config/conversion.json`?
   - **Objection handling** — FAQ / guarantee / pricing visibility
     addressing the top 2-3 ICP objections from the positioning doc?
   - **Visual hierarchy** — eye-path leads to CTA; no competing CTAs.
   - **Page speed signals** — TTFB / image weight / render-blocking
     flags from the scrape (if available — otherwise "not measured").
5. **Prioritized fix list.** Rank fixes by (impact × ease). Top 3
   get "ship this week" framing. Each fix:
   - Current state (quoted from page).
   - Proposed change (1-2 line hypothesis).
   - Why (tied to a positioning-doc claim or an ICP pain).
   - Suggested A/B test if the fix is non-obvious (hand to
     `design-ab-test`).
6. **Save URL baseline.** Write `config/landing-page.json` (first
   time) with `{ url, primaryCta, fetchedAt }`.
7. **Write** atomically to
   `cro-critiques/{url-slug}-{YYYY-MM-DD}.md` (`*.tmp` → rename).
   Include the total score out of 21 at the top.
8. **Append to `outputs.json`** — `{ id, type: "cro-critique",
   title, summary, path, status: "ready", createdAt, updatedAt }`.
9. **Summarize to user** — total score, the single biggest fix, path
   to the teardown.

## Outputs

- `cro-critiques/{url-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "cro-critique"`.
