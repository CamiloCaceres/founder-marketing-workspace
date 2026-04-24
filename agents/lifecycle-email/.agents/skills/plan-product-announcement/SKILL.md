---
name: plan-product-announcement
description: "Use when you say 'draft the {feature} announcement' / 'email + in-app for {launch}' — I write both the announcement email AND matching in-app copy (banner / modal / empty-state nudge), keyed to the Head of Marketing's launch plan if one exists. Writes to `announcements/{feature-slug}.md` — email body + in-app strings together."
integrations: [customerio, mailchimp]
---

# Plan Product Announcement

Email and in-app copy belong together. Mismatched messaging across the
two is how launches leak attention.

## When to use

- User: "draft the {feature} announcement email" / "announcement for
  the launch" / "in-app + email for {feature}" / "launch email".

## Steps

1. **Read positioning doc** — `../head-of-marketing/product-marketing-context.md`.
   If missing or empty, tell the user to run the Head of Marketing's
   `define-positioning` first and stop.
2. **Read `config/voice.md`.** If missing, ask once with the
   connected-inbox hint (Composio-connected Gmail / Outlook /
   Superhuman > pasted samples), write the file, continue.
3. **Look for a launch plan.** Try
   `../head-of-marketing/launches/{feature-slug}.md`. If present,
   read it and key the announcement to the planned narrative
   (positioning, audience, sequencing, primary CTA). If missing,
   ask the user for: feature name, one-line value prop, the audience
   segment, and the primary CTA. Note the absent launch plan in the
   artifact front-matter (`launchPlan: "none found"`).
4. **Draft the announcement email.**
   - **Subject** — ≤60 chars, names the feature OR names the job
     it does. No "Introducing…" boilerplate unless voice samples use
     that pattern.
   - **Preview text** — 50-90 chars, complements subject.
   - **Body** — (1) why now (the pain / trigger), (2) what it does
     (concrete, not hype), (3) how to try it (the one action), (4) a
     short proof / example if available. One primary CTA matching
     the launch plan.
   - **Success metric** — activation of the feature within N days.
5. **Draft the matching in-app copy.** All three variants, each keyed
   to the same primary CTA as the email:
   - **Banner** — one line, dismissible, top of app or dashboard.
     ≤90 chars.
   - **Modal** — headline, 1-2 line body, primary button (same CTA),
     secondary "not now". Shown on first post-launch login; dismiss
     permanently after action or close.
   - **Empty-state / contextual nudge** — a single line that appears
     at the exact surface the feature improves (e.g. in the view
     where the user would otherwise hit the old limit).
6. **Write** `announcements/{feature-slug}.md` atomically.
   Front-matter: `feature`, `audience`, `primaryCta`, `launchPlan`
   (path or "none found"), `source: "gtm-co-pilot-adjacent"`.
   Structure the file in two labeled sections: `## Email` and
   `## In-app copy` (with `### Banner`, `### Modal`,
   `### Empty-state / nudge`).
7. **Append to `outputs.json`** — type `"announcement"`, status
   `"draft"`, 2-3-sentence summary naming the feature and the
   primary CTA.
8. **Summarize to user** — "Announcement for {feature} at {path}.
   Email + banner + modal + nudge, all keyed to CTA '{cta}'.
   Review, tweak, then paste the email into {platform} and hand the
   in-app copy to your dev — I don't send or ship."

## Outputs

- `announcements/{feature-slug}.md`
- Appends to `outputs.json` with `{ id, type: "announcement", title,
  summary, path, status: "draft", createdAt, updatedAt }`.
