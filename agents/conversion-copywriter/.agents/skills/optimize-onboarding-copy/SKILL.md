---
name: optimize-onboarding-copy
description: "Use when you say 'in-app onboarding copy' / 'empty states' / 'first-run messaging' — I rewrite empty states, tooltips, nudges, and welcome modals inside the product. Every string ties to an activation event you care about. Writes to `onboarding-copy/{slug}.md`."
---

# Optimize Onboarding Copy

Post-signup in-product copy. The user has converted. Now the job is
getting them to value (aha-moment) as fast as the product allows.
Copy does a lot of the work: welcome, next action, empty-state
guidance, tooltips, checklist items, the aha confirmation.

## When to use

- "Rewrite the in-app onboarding for {product}"
- "Empty states for my {feature area}"
- "Welcome screen copy"
- "First-run messaging"
- "Users aren't activating — the copy is unclear"

**Not for email sequences** — those go to Lifecycle & Email's
`draft-welcome-sequence` / `design-lifecycle-campaign`.
**Not for upgrade paywalls** — use `optimize-paywall-upgrade`.

## Steps

1. **Read positioning doc** at
   `../head-of-marketing/product-marketing-context.md`. If missing,
   tell the user to run Head of Marketing's `define-positioning`
   first and stop.
2. **Read `config/voice.md`.** If missing, ask ONE question naming
   the best modality (connected inbox via Composio > paste samples)
   and write before drafting.
3. **Name the aha-moment.** Ask (if not obvious from the positioning
   doc) ONE question: "What's the single in-product moment where a
   user first gets value?" (e.g. "first invoice sent", "first project
   shared", "first insight generated"). Everything below works
   backwards from this.
4. **Collect the current state.** Accept screenshots, a Loom, a text
   dump of current copy, or a live product URL. If URL, fetch via
   any Composio-connected scraper / rendering tool. If nothing
   shared, ask for the current copy (screen-by-screen paste is fine)
   and stop.
5. **Enumerate the surfaces.** Map the post-signup journey by
   surface, each getting its own copy pass:
   - **Welcome screen** — value reminder + single next action. The
     CTA is the fastest path to aha, not "Take a tour".
   - **Empty states** (one per feature area the user will land in
     before it has content) — what the area does, the single
     next action, the value when full.
   - **Onboarding checklist** — 3-5 items max, each a verb + outcome.
     Order by aha-moment adjacency.
   - **Tooltips** — for any UI element whose label isn't self-evident.
     Short, action-led.
   - **Aha-moment confirmation** — the line that tells the user
     they've just done the thing that makes this worth paying for.
     Earns the first upsell cue (but doesn't fire the paywall —
     that's `optimize-paywall-upgrade`).
6. **For each surface, produce:**
   - **Current** (verbatim from the scrape / paste / screenshot
     reading).
   - **Proposed** (in the founder's voice, grounded in the
     positioning doc).
   - **Why** — one line. Name the principle: value-first,
     single-next-action, action-led-label, aha-adjacency, empty-
     state-promise, expectation-set.
7. **Flag sequencing issues.** If the onboarding asks for data that
   should have been captured in `optimize-signup-flow` (or vice
   versa), name it in a "Flow flags" section.
8. **Hand-off hooks.** If the welcome email / post-signup emails
   need rewriting, name Lifecycle & Email's
   `draft-welcome-sequence`. If the in-product upgrade prompt needs
   work, name `optimize-paywall-upgrade`.
9. **Write** atomically to
   `onboarding-copy/{product-slug}-{YYYY-MM-DD}.md` (`*.tmp` →
   rename).
10. **Append to `outputs.json`** — `{ id, type: "onboarding-copy",
    title, summary, path, status: "draft", createdAt, updatedAt }`.
11. **Summarize to user** — the aha-moment we're driving toward,
    the single highest-leverage rewrite, path to the full file.

## Never

- Stretch onboarding with tours or videos that delay aha.
- Fire the paywall in the onboarding window unless the user has
  already had value (flag this — hand to `optimize-paywall-upgrade`).
- Write empty states that describe the feature without naming the
  single next action.

## Outputs

- `onboarding-copy/{product-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "onboarding-copy"`.
