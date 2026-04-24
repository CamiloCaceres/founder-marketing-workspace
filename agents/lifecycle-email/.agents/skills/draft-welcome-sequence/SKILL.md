---
name: draft-welcome-sequence
description: "Use when you say 'draft a welcome series' / 'onboarding emails for new signups' — I write a 5-email sequence (Day 0 / 1 / 3 / 7 / 14 default, override any cadence), each with subject, preview, body, CTA, and success metric. Formatted for your connected ESP (Customer.io / Mailchimp / ConvertKit / Beehiiv / etc.). Writes to `sequences/welcome-{variant}.md`."
---

# Draft Welcome Sequence

A 5-email series for new signups. Each email earns its place with a
single clear job (welcome + setup, aha moment, social proof, habit
nudge, upgrade prompt by default).

## When to use

- User: "draft a welcome series" / "welcome emails for signups" /
  "onboarding sequence" / "new-user emails".
- User asks to rework an existing welcome flow.

## Steps

1. **Read positioning doc** — `../head-of-marketing/product-marketing-context.md`.
   If missing or empty, say: "I need the shared positioning doc first.
   Run the Head of Marketing's `define-positioning` (5 minutes), then
   come back." Stop.
2. **Read `config/voice.md`.** If missing, ask once: "To sound like you
   I need your voice — easiest: connect a personal inbox (Gmail /
   Outlook / Superhuman) via Composio and I'll pull 20-30 recent sent
   messages. Otherwise paste 2-3 emails you've sent. Which do you
   prefer?" Write `config/voice.md` and continue.
3. **Read `config/journey.json`.** If missing, ask for the activation
   event and the aha moment in one short message, then write a minimal
   `config/journey.json` and continue.
4. **Confirm cadence.** Default Day 0 / 1 / 3 / 7 / 14. If the user
   specified a different cadence in the prompt, honor it. Otherwise
   use default and note it in the artifact's front-matter.
5. **Draft the 5 emails.** For each:
   - **Subject** — specific, ≤50 chars, no ALL-CAPS, no emoji unless
     voice samples use them.
   - **Preview text** — 50-90 chars that complements the subject.
   - **Body** — short, plain-text-first, in the user's voice. Reference
     the primary CTA from the positioning doc.
   - **CTA** — one primary action per email. No double-CTA.
   - **Success metric** — the one number this email should move
     (e.g. "% of recipients who create their first workspace
     within 48h").
   Default jobs per email: (1) welcome + fastest-path setup, (2) aha
   moment with a concrete next action, (3) social proof / customer
   result, (4) habit formation / use-case expansion, (5) upgrade /
   plan-fit nudge.
6. **Write** `sequences/welcome-{variant-slug}.md` atomically (`.tmp`
   → rename). Front-matter: `cadence`, `segment` (default "all new
   signups"), `source: "coverage-gap"`. Include a header block
   restating the positioning and the primary CTA being used.
7. **Append to `outputs.json`** — type `"sequence"`, status `"draft"`,
   2-3-sentence summary naming the cadence and the activation event
   it's keyed to. Read-merge-write atomically.
8. **Summarize to user** — one paragraph: "5-email welcome sequence
   keyed to `{activation_event}` at {path}. Day 0/1/3/7/14 cadence.
   Open it, tweak any subject lines, and paste into {platform} when
   you're ready — I don't send." Offer one next-step: "Want me to
   spin a variant for {segment}?"

## Outputs

- `sequences/welcome-{variant-slug}.md`
- Appends to `outputs.json` with `{ id, type: "sequence", title,
  summary, path, status: "draft", createdAt, updatedAt }`.
