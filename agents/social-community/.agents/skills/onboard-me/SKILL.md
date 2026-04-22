---
name: onboard-me
description: Use when the user explicitly says "onboard me" / "set me up" / "let's get started", or on the first real task when no `config/profile.json` exists — open with a scope + modality preamble naming the three topics (platforms, voice, topics/POV) AND the best way to share each, then run a tight 90-second 3-question interview and write results to `config/`.
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

- **Lead with a scope + modality preamble.** Name the three topics AND
  the easiest way to share each BEFORE the first question.
- **3 questions is the ceiling, not the target.** If you can do 2, do 2.
- **One question at a time after the preamble.**
- **Rank modalities:** connected app via Composio > file/URL > paste.
- **Anything skipped** → note "TBD" and ask again just-in-time later.

## Steps

0. **Scope + modality preamble — the FIRST message, then roll into Q1:**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   > Here's what I need and the easiest way to share each:
   >
   > 1. **Your platforms** — which social platforms you're active on
   >    (LinkedIn, X/Twitter, Reddit, Instagram, TikTok, other).
   >    *Best: connect them via Composio in the Integrations tab —
   >    I'll read your handles and feeds directly. Or just list them.*
   > 2. **Your voice** — how you write. *Best: connect an inbox via
   >    Composio and say so — I'll pull 20-30 of your recent sent
   >    messages to calibrate tone. Or paste 2-3 of your recent
   >    LinkedIn / X posts.*
   > 3. **Your topics / POV** — the 3-5 themes you post about, each
   >    with a one-line point of view (e.g. "SaaS pricing — flat fees
   >    beat per-seat for SMB", "Solo founder ops — ship weekly or
   >    you're not shipping"). *Best: paste them.*
   >
   > Let's start with #1 — which platforms are you active on, and
   > have you connected any of them via Composio?"

1. **Capture topic 1 (platforms).** Parse the answer. If connected
   apps, run `composio search linkedin`, `composio search twitter`,
   etc. to confirm tool availability. Identify the primary platform.
   Write `config/platforms.json` with `{ active, connectedViaComposio,
   handles?, primary, source, capturedAt }`. Acknowledge and roll into
   Q2: "Got it — now your voice. Connected inbox, or paste a couple
   recent posts?"

2. **Capture topic 2 (voice).** If connected-inbox route: run
   `composio search` for the provider's list-sent-messages tool, fetch
   20-30 recent outbound messages, extract tone cues (greeting,
   closing, sentence length, formality, emoji / hashtag habits,
   quirks), write 3-5 verbatim excerpts plus a tone summary to
   `config/voice.md`. If pasted posts: write them verbatim plus a
   short tone summary. Roll into Q3: "Last one — what 3-5 topics do
   you post about, and your one-line POV on each?"

3. **Capture topic 3 (topics).** Parse themes and POVs. Write
   `config/topics.json` with `{ themes: [{ slug, label, pov,
   examplePosts? }], capturedAt }`.

4. **Write `config/profile.json`** with `{ userName, company,
   onboardedAt, status: "onboarded" | "partial" }`. Use `"partial"`
   if any topic was skipped.

5. **Hand off:**
   > "Ready. Try: `Draft a LinkedIn post about {recent idea}`. I'll
   > read your positioning doc and your voice before drafting, and
   > I'll only ever draft — you press publish."

## Outputs

- `config/profile.json`
- `config/platforms.json`
- `config/voice.md`
- `config/topics.json`
