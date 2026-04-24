---
name: optimize-form
description: "Use when you say 'audit my form' / 'too many fields' / 'demo form isn't converting' — I review a form (demo / contact / lead), flag unnecessary fields, rewrite labels + helper text, and sequence fields by friction. Writes to `form-audits/{form-slug}.md`. For signup flows, see `optimize-signup-flow`."
integrations: [firecrawl]
---

# Optimize Form

Form completion follows one rule: value > effort. Every field is a
cost. This skill decides which fields earn their seat, rewrites the
ones that stay, and names the friction the founder can ship this
week.

## When to use

- "Audit my lead capture form"
- "Too many fields on my demo request — fix it"
- "Nobody fills out the contact form"
- "Review my checkout form"

**Not for signup forms** — use `optimize-signup-flow` for those.
**Not for popups containing forms** — use `optimize-popup`.

## Steps

1. **Read positioning doc** at
   `../head-of-marketing/product-marketing-context.md`. If missing,
   tell the user to run Head of Marketing's `define-positioning`
   first and stop.
2. **Read `config/voice.md`.** If missing, ask ONE question naming
   the best modality (connected inbox via Composio > paste samples)
   and write it before labeling.
3. **Collect the form.** Accept URL, screenshot, or pasted field
   list. If URL, fetch via any Composio-connected scraper / page
   renderer (discover the slug with `composio search` and execute
   by slug). If not connected, ask for the pasted field list and
   stop.
4. **Identify form type** — lead capture / contact / demo request /
   application / survey / checkout / quote. Ask ONE clarifying
   question only if genuinely ambiguous.
5. **Ask (ONE question only) for business context** if it's not
   already clear from config: what happens to each submission, which
   fields actually get used in follow-up, any compliance
   requirements. Skip if obvious.
6. **Field-by-field audit.** For every current field:
   - **Verdict:** keep / drop / defer (capture post-submit via
     progressive profiling) / make-optional / compliance-required.
   - **Reason:** one line tied to value-vs-effort or follow-up
     actually using it.
   - **Label rewrite** (if keep): plain language, one question per
     field, conversational (e.g. "What's your role?" not "Job
     Title").
   - **Input-type fixes** — proper mobile keyboard, inline
     validation, smart defaults, typo detection for email.
7. **Value proposition above the form.** Rewrite the headline +
   subhead above the form so what they get is obvious in <5 seconds.
   Ground in the positioning doc and (if present)
   `../head-of-marketing/call-insights/` phrases.
8. **Friction causes — named.** Call out anti-patterns by name:
   cognitive-load, privacy-anxiety-no-trust-line, missing-value-prop,
   too-many-fields, poor-mobile-keyboard, error-state-shaming,
   double-confirmation, captcha-above-submit, no-progress-signal.
9. **Button copy.** Replace "Submit" with action + outcome. Hand to
   `write-cta-variants` only if the CTA needs deeper work.
10. **Prioritize the top 3 changes** by (impact × ease). Ship-this-
    week framing.
11. **Write** atomically to
    `form-audits/{form-slug}-{YYYY-MM-DD}.md` (`*.tmp` → rename).
12. **Update `config/form-prefs.json`** (first time) with any
    captured form-tool preference.
13. **Append to `outputs.json`** — `{ id, type: "form-audit",
    title, summary, path, status: "ready", createdAt, updatedAt }`.
14. **Summarize to user** — current field count → recommended
    field count, the top-3 changes, path to the audit.

## Never

- Drop a legally required field (ask if uncertain).
- Add new fields without a named reason tied to follow-up.
- Promise a lift percentage — ship the changes, measure, iterate.

## Outputs

- `form-audits/{form-slug}-{YYYY-MM-DD}.md`
- May update `config/form-prefs.json`.
- Appends to `outputs.json` with `type: "form-audit"`.
