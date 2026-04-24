---
name: write-page-copy
description: "Use when you say 'write copy for {page}' / 'rewrite my homepage' / 'draft the pricing page' / 'headline + body for {landing page}' — I write full page copy grounded in your positioning and real customer language (from your call insights or G2 / Capterra reviews). Sections, headlines, bodies, CTAs, social-proof placement. Writes to `page-copy/{page-slug}.md`."
integrations: [firecrawl]
---

# Write Page Copy

Full-page rewrite for the founder's landing / homepage / pricing /
about / feature page. Every line is grounded in the positioning doc
and sounds like the founder — not a chatbot, not a marketer.

## When to use

- "Rewrite my homepage at {url}"
- "Write copy for my pricing page"
- "Draft the about page — in my voice"
- "Headline + body for the {campaign} landing page"

## Steps

1. **Read positioning doc** at
   `../head-of-marketing/product-marketing-context.md`. If missing
   or empty, tell the user to run Head of Marketing's
   `define-positioning` first and stop. Don't guess the business.
2. **Read `config/voice.md`.** If missing, ask ONE question naming
   the best modality: "I need 2-3 writing samples from you so this
   sounds like you. Easiest path: if you've connected an inbox via
   Composio, say so — I'll pull your recent sent messages. Otherwise
   paste 2-3 emails / posts you've actually written." Write
   `config/voice.md` before continuing.
3. **Read `config/primary-page.json`** to know the primary
   conversion event. If the user named a different page, continue —
   just align the CTA to the same conversion.
4. **Fetch the page.** Run `composio search` for web-scrape / page
   rendering tools, execute by slug, pull the rendered HTML + visible
   text + primary image URLs + the current primary CTA. If no
   scraper is connected, ask the user to link one category (or paste
   the current page copy), and stop.
5. **Optional: pull supporting customer language.** If
   `../head-of-marketing/call-insights/` or
   `../head-of-marketing/research/` exist, skim the most recent 3-5
   files for verbatim phrases. Otherwise fall back to review-scrape
   via `composio search` (G2, Capterra, Trustpilot, Reddit, App
   Store). Never invent quotes.
6. **Identify the ONE primary action** the page must drive (from
   `config/primary-page.json` and the page purpose).
7. **Draft the page top-to-bottom.** For each section, give:
   - **Current** (quoted verbatim from the scrape).
   - **Proposed** (new copy, in the founder's voice, grounded in the
     positioning doc and customer phrases).
   - **Why** (one line — which principle, which ICP pain, which
     positioning claim).
   Cover: hero headline + subhead, social-proof slot, value props
   (3-5 benefits tied to ICP pains), how-it-works, objection section
   (tied to objections in the positioning doc), final CTA recap.
8. **Alternatives for load-bearing lines.** Give 2-3 options for the
   hero headline and primary CTA. Short rationale per option. Flag
   the one to ship first and why.
9. **Flag contradictions.** If any current-page claim contradicts
   the positioning doc, call it out in a "Flagged" section — do NOT
   rewrite positioning myself (that's Head of Marketing).
10. **Write** atomically to `page-copy/{page-slug}-{YYYY-MM-DD}.md`
    (`*.tmp` → rename).
11. **Append to `outputs.json`** — `{ id, type: "page-copy", title,
    summary, path, status: "draft", createdAt, updatedAt }`. Merge
    in place, atomic write.
12. **Summarize to user** — the single highest-leverage change, the
    top-3 to ship this week, path to the full rewrite.

## Never invent

- No fabricated stats, testimonials, or customer quotes. If the page
  cites numbers, confirm them with the founder or mark TBD.
- No "trust us" adjectives. Every benefit ties to an outcome.
- Don't rewrite the positioning. Flag contradictions; don't overwrite.

## Outputs

- `page-copy/{page-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "page-copy"`.
