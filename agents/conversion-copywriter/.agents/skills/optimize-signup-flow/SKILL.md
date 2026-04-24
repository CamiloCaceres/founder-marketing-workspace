---
name: optimize-signup-flow
description: "Use when you say 'signup flow review' / 'signup dropoff' / 'trial signup isn't working' — I audit the whole signup funnel: pre-signup page, email field, password requirements, verification, first-screen post-signup. Copy + field-level recommendations. Writes to `signup-flow-reviews/{slug}.md`."
---

# Optimize Signup Flow

Signup is where intent meets friction. Every extra step, field, or
vague microcopy line is a leak. This skill audits the flow from
first click to first value and produces the full replacement copy —
not just a list of suggestions.

## When to use

- "Review my signup flow at {url}"
- "Reduce signup dropoff"
- "Free trial signup isn't converting"
- "Too many steps to sign up"

**Not for lead capture or contact forms** — use `optimize-form`.
**Not for post-signup onboarding** — use `optimize-onboarding-copy`.

## Steps

1. **Read positioning doc** at
   `../head-of-marketing/product-marketing-context.md`. If missing,
   tell the user to run Head of Marketing's `define-positioning`
   first and stop.
2. **Read `config/voice.md`.** If missing, ask ONE question naming
   the best modality (connected inbox via Composio > paste samples)
   and write before rewriting copy.
3. **Read `config/primary-page.json`** for the primary conversion
   event (the event this flow should complete).
4. **Collect the flow.** Accept {url + each step's URL or path}, a
   screen-by-screen screenshot set, or a written description. If
   URLs are given, fetch each via any Composio-connected scraper /
   rendering tool (discover slug with `composio search`, execute by
   slug). If not connected, ask the user to describe each step or
   share screenshots and stop.
5. **Map the flow.** Produce an enumerated step list: 1. entry (ad
   / link / referral), 2. landing page → signup CTA, 3. email /
   SSO / magic link, 4. email verification, 5. plan selection,
   6. password set, 7. org / team, 8. billing, etc. Mark which step
   is the conversion event itself.
6. **For each step, record:**
   - **Necessity** — keep / merge with next / defer post-signup /
     kill. Name the friction category: data-collection,
     decision-point, verification, account-setup.
   - **Friction sources** — cognitive load, missing value prop,
     error-state shaming, lack of progress signal, captcha placement,
     mobile-keyboard mismatch, forced password rules, double-entry,
     credit-card-up-front-when-not-needed.
   - **Drop triggers** — the thing most likely to make a user bail
     on this step.
   - **Copy rewrites** — headline, subhead (if any), field labels,
     button CTA, error states, confirmation line. Full replacement
     copy, in the founder's voice. Each change paired Current →
     Proposed → Why.
7. **Defer where possible.** Anything that can be captured post-
   conversion should move (org name, team size, role title, phone
   number). Flag these with "defer to onboarding" and hand to
   `optimize-onboarding-copy` for where to capture them.
8. **Rewrite the full flow top-to-bottom.** One consolidated
   section showing the proposed end-state flow copy — the founder
   should be able to paste this directly to engineering.
9. **Top 3 ship-this-week changes.** Rank by (impact × ease) and
   name the single biggest leak.
10. **Hand-off hooks.** If the page that enters the flow needs a
    copy rewrite, name `write-page-copy`. If the entry CTA needs
    variants, name `write-cta-variants`. If Growth & Paid should
    formally test a step change, name `design-ab-test`.
11. **Write** atomically to
    `signup-flow-reviews/{flow-slug}-{YYYY-MM-DD}.md` (`*.tmp` →
    rename).
12. **Update `config/signup-flow.json`** with `{ stepCount,
    entryPath, capturedAt }`.
13. **Append to `outputs.json`** — `{ id, type:
    "signup-flow-review", title, summary, path, status: "ready",
    createdAt, updatedAt }`.
14. **Summarize to user** — current step count → recommended step
    count, the single biggest leak, top 3 changes, path to the
    review.

## Never

- Require email verification before the user experiences value —
  flag it and suggest magic-link or post-activation verification
  instead.
- Put billing before value (free trials especially) unless the
  founder confirms the business model requires it.
- Add fields the marketing team wants but ops never uses.

## Outputs

- `signup-flow-reviews/{flow-slug}-{YYYY-MM-DD}.md`
- `config/signup-flow.json` (first run)
- Appends to `outputs.json` with `type: "signup-flow-review"`.
