---
name: monitor-competitor-ads
description: Use when the user says "what ads is {competitor} running" / "competitor ad teardown" / "watch competitor creative" — pulls live ads from Meta Ad Library, LinkedIn Ad Library, and Google Ads Transparency Center (via Composio ad-intel or web-scrape), extracts the angles / messaging / creative patterns, and writes a dated teardown.
---

# Monitor Competitor Ads

Not an ad library dump — a synthesis. Angles they're pushing,
audiences they seem to be targeting, creative patterns, and what we
can steal or avoid.

## When to use

- "What ads is {competitor} running this week?"
- "Teardown of {competitor}'s Meta ads"
- "Competitor ad watch — any new creative?"
- Called weekly by a routine if the founder sets one up.

## Steps

1. **Read positioning doc** at
   `../head-of-marketing/product-marketing-context.md`. If missing,
   tell the user to run the Head of Marketing's `define-positioning`
   first and stop. (We need our own positioning to judge theirs.)
2. **Identify the competitor list.** If the user named one, use it.
   Otherwise read the "top 3 competitors" from the positioning doc.
   Also check `../head-of-marketing/competitor-briefs/` for any
   existing briefs.
3. **Pull live ads via Composio.** Run `composio search` for
   ad-library / ad-intelligence tools (Meta Ad Library, LinkedIn Ad
   Library, Google Ads Transparency Center) and for generic
   web-scrape tools (Firecrawl, ScrapingBee) as a fallback. Execute
   by slug to fetch the competitor's currently-active ads on each
   platform. If no tool is connected, ask the user to link a
   web-scrape category and stop.
4. **For each ad pulled, extract:**
   - Platform + format (search / feed image / video / carousel).
   - Headline + primary text (verbatim).
   - CTA.
   - Inferred target audience (if visible / derivable).
   - Inferred angle (pain / status / urgency / social-proof /
     feature-led / price-led).
   - Estimated run duration (if the library shows first-seen).
5. **Synthesize patterns across the pull:**
   - Dominant angle(s).
   - Which pains they're naming (quote verbatim).
   - Which differentiators they're claiming.
   - Creative format mix (what's getting invested behind).
   - Anything NEW this week vs. prior pulls (if a prior file exists
     for this competitor).
6. **Opportunity callouts:**
   - Angles they're missing that our positioning doc owns.
   - Claims we should counter on our landing page.
   - Creative patterns worth testing on our side (hand to
     `generate-ad-copy`).
7. **Write** atomically to
   `competitor-ads/{competitor-slug}-{YYYY-MM-DD}.md` (`*.tmp` →
   rename).
8. **Append to `outputs.json`** — `{ id, type: "competitor-ads",
   title, summary, path, status: "ready", createdAt, updatedAt }`.
   Merge with existing array, atomic write.
9. **Summarize to user** — dominant angle they're pushing, one
   opportunity for us, path to the teardown.

## Never invent

Every headline / CTA quoted must come from a real pulled ad. If the
library returned nothing, say so — do NOT fabricate ad copy.

## Outputs

- `competitor-ads/{competitor-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "competitor-ads"`.
