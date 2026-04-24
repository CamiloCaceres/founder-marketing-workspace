---
name: onboard-me
description: "Use when you say 'onboard me' / 'set me up' — I ask 3 quick questions (~90s): your acquisition channels today, your analytics stack, and your primary conversion event. Then I can plan campaigns, critique landing pages, design tests, spec tracking, and run funnel reviews."
---

# Onboard Me

## When to use

First-run setup. Triggered by:
- "onboard me" / "set me up" / "let's get started"
- The user clicks the pre-seeded "Onboard me" activity card and sends
  any short message (including "go", "ok", "start", "yes", or empty)
  — when `config/profile.json` is missing, treat any such short
  opener as a signal to run me.
- About-to-do-real-work and `config/profile.json` is missing.

Only run ONCE unless the user explicitly re-invokes.

## Principles

- **Lead with a scope + modality preamble.** Name the three topics
  AND the easiest way to share each BEFORE the first question.
- **3 questions is the ceiling, not the target.** If you can do 2, do 2.
- **One question at a time after the preamble.** Short follow-ups.
- **Rank modalities:** connected app via Composio > file/URL > paste.
- **Anything skipped** → note "TBD" and ask again just-in-time later.

## Steps

0. **Scope + modality preamble — the FIRST message, then roll into Q1:**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   > Here's what I need and the easiest way to share each:
   >
   > 1. **Your primary acquisition channels today** — where traffic
   >    and signups come from (Google / Meta / LinkedIn / Reddit /
   >    organic / referral / none-yet). *Best: connect any ad
   >    platform via Composio (Integrations tab) and I'll read
   >    accounts directly. Or paste a short list.*
   > 2. **Your analytics stack** — how you measure today (GA4 /
   >    Segment / PostHog / Mixpanel / Amplitude / none-yet).
   >    *Best: connect via Composio. Or tell me what you use.*
   > 3. **Your primary conversion event** — the one thing a visit
   >    has to do for it to count (signup / install / purchase /
   >    demo-booked / other). *Best: one line of paste.*
   >
   > Let's start with #1 — what channels are you running or
   > planning?"

1. **Capture topic 1 (channels).** Based on modality: run
   `composio search` to discover any connected ad platforms (Google
   Ads, Meta Ads, LinkedIn Ads, Reddit Ads, X Ads); or parse the
   pasted list. Write `config/channels.json` with `{ active,
   connectedSlugs, monthlyBudgetUSD?, source, capturedAt }`.
   Acknowledge and roll into Q2.
2. **Capture topic 2 (analytics).** Run `composio search analytics`
   to find connected providers (GA4 / PostHog / Mixpanel / Segment /
   Amplitude), or capture the paste. Write `config/analytics.json`
   with `{ stack, connectedSlugs, source, capturedAt }`. If "none
   yet", write `source: "none"` and a note that `setup-tracking`
   will be the first priority. Roll into Q3.
3. **Capture topic 3 (primary conversion).** Short paste expected.
   Write `config/conversion.json` with `{ primaryEvent, definition?,
   currentRate?, capturedAt }`.
4. **Write `config/profile.json`** with `{ userName?, company?,
   onboardedAt, status }`. Use `"partial"` if any topic was skipped.
5. **Hand-off:** "Ready. Try: `Critique the landing page at {url}`.
   I'll ask for anything else just-in-time."

## Outputs

- `config/profile.json`
- `config/channels.json`
- `config/analytics.json`
- `config/conversion.json`
