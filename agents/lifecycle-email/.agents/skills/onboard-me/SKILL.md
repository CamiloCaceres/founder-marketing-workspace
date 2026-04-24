---
name: onboard-me
description: "Use when you say 'onboard me' / 'set me up' — I ask 3 quick questions (~90s): your email platform (Customer.io / Mailchimp / Beehiiv / Loops / Resend — connect via Composio or name it), your voice, and your product milestones. Then I can draft sequences, newsletters, drips, saves, and announcements."
---

# Onboard Me

## When to use

First-run setup. Triggered by:

- "onboard me" / "set me up" / "let's get started"
- The user opens the pre-seeded "Onboard me" activity card (from the
  Needs-you column) and sends any short message to kick it off
  (including "go", "ok", "start", "yes", or even an empty-seeming
  prompt) — when `config/profile.json` is missing, treat any such
  short opener as a signal to run me.
- About-to-do-real-work and `config/profile.json` is missing.

Only run ONCE unless the user explicitly re-invokes.

## Principles

- **Lead with a scope + modality preamble.** Name the three topics
  AND the easiest way to share each BEFORE the first question.
- **3 questions is the ceiling, not the target.** If you can do 2, do 2.
- **One question at a time after the preamble.**
- **Rank modalities:** connected app via Composio > file/URL > paste.
- **Anything skipped** → note "TBD" and ask again just-in-time later.

## Steps

0. **Scope + modality preamble — the FIRST message, then roll into Q1:**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   > Here's what I need and the easiest way to share each:
   >
   > 1. **Your email platform** — where your marketing email lives
   >    (Mailchimp, Customer.io, ConvertKit, Beehiiv, Loops, Resend,
   >    Klaviyo, other). *Best: connect via Composio (Integrations tab)
   >    so I can draft straight into your platform later — I never
   >    trigger a send. Or paste the platform name plus "will connect
   >    later" and we'll work on drafts you copy over.*
   > 2. **Your voice** — how you write. *Best: if you've connected a
   >    personal inbox (Gmail / Outlook / Superhuman) via Composio,
   >    just say so and I'll pull 20-30 of your recent sent messages.
   >    Otherwise paste 2-3 emails you've actually sent.*
   > 3. **Your product milestones** — what happens to a user from
   >    signup onward (signup → activation event → aha → habit →
   >    upgrade). *Best: paste 3-5 named events. Or point me at a
   >    connected analytics/CRM tool (Composio) and I'll pull them.*
   >
   > Let's start with #1 — which platform is your email on?"

1. **Capture topic 1 (email platform).** Based on modality chosen:
   - If user picks Composio: run `composio search email_marketing` (or
     closest category) to list candidates, confirm the slug of the
     connected platform, mark `connected: true`.
   - If user names a platform + "will connect later": record the name,
     mark `connected: false`, `source: "paste"`.
   Write `config/platform.json` with `{ name, connected, composioSlug?,
   sendsFromAgent: false, notes?, source, capturedAt }`. Remind them:
   "I never trigger a send — drafts only." Roll into Q2.
2. **Capture topic 2 (voice).** If user took the connected-inbox route:
   run `composio search` for their connected inbox provider's
   list-sent-messages tool; fetch the 20-30 most recent outbound
   messages; extract tone cues (subject-line habits, greeting, closing,
   sentence length, formality, quirks); write 3-5 verbatim excerpts
   plus a tone summary to `config/voice.md`. If they pasted 2-3 emails,
   write those samples verbatim plus a short tone summary. If they
   skip, write a stub noting TBD and carry on. Roll into Q3.
3. **Capture topic 3 (product milestones).** Ask for 3-5 named events
   from signup onward. Parse paste, fetch from a connected analytics
   / CRM via `composio search`, or read a pasted file. For each event
   capture `{ name, label, stage, order, description? }`. Write
   `config/journey.json` with `{ events, source, capturedAt }`.
4. **Write `config/profile.json`** with `{ userName, company, role?,
   onboardedAt, status: "onboarded" | "partial" }`. Use `"partial"`
   if any topic was skipped.
5. **Hand off:** "Ready. Try: `Draft a 5-email welcome series for new
   signups`. I'll ask for anything else just-in-time."

## Outputs

- `config/profile.json`
- `config/platform.json`
- `config/voice.md`
- `config/journey.json`
