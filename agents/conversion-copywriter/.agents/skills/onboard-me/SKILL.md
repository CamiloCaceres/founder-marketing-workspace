---
name: onboard-me
description: "Use when you say 'onboard me' / 'set me up' — I ask 3 quick questions (~90s): your primary page + conversion event, your voice, and which surfaces are leaking (forms / signup / paywall / popup / onboarding). Then I can rewrite pages, generate variants, and optimize the surfaces that leak conversion."
---

# Onboard Me

## When to use

First-run setup. Triggered by:

- "onboard me" / "set me up" / "let's get started".
- The user clicks the pre-seeded "Onboard me" activity card and sends
  any short message (including "go", "ok", "start", "yes", or an
  empty-seeming prompt) — when `config/profile.json` is missing, treat
  any such short opener as a signal to run me.
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
   > 1. **Your primary page + conversion event** — the page that
   >    matters most (homepage / landing / pricing) and what you want
   >    visitors to do (signup / demo / purchase / install). *Best:
   >    paste the URL + one word for the conversion. Or share a file
   >    describing the page.*
   > 2. **Your voice** — how you sound in writing, so I don't rewrite
   >    you into chatbot-speak. *Best: if you've connected an inbox
   >    via Composio, just say so — I'll pull 20-30 of your recent
   >    sent messages. Otherwise paste 2-3 emails / posts you've
   >    actually sent.*
   > 3. **Which surface is leaking** — where do you feel conversion
   >    leaks right now? (page / signup flow / in-app onboarding /
   >    paywall / popup / form). *Best: one line of paste.*
   >
   > For any of these you can also drop files or public URLs. Let's
   > start with #1 — what's your primary page, and what's the one
   > thing you want visitors to do?"

1. **Capture topic 1 (primary page + conversion).** Parse the paste
   or fetch the URL via any Composio-connected scraper / rendering
   tool (discover the slug with `composio search` and execute by
   slug). Extract the visible primary CTA text. Write
   `config/primary-page.json` with `{ url, primaryCta,
   primaryConversionEvent, source, capturedAt }`. Acknowledge and
   roll into Q2: "Got it — now how do you sound when you write?"

2. **Capture topic 2 (voice).** If the user took the connected-inbox
   route: run `composio search` for their connected provider's
   list-sent-messages capability (discover the slug, execute by
   slug); fetch the 20-30 most recent outbound messages; extract 3-5
   verbatim excerpts + a tone summary (greeting, closing, sentence
   length, formality, quirks, words to avoid). Write to
   `config/voice.md`. If they pasted, write the paste verbatim plus
   the tone summary. Roll into Q3: "Last one — which surface feels
   leakiest right now?"

3. **Capture topic 3 (leakiest surface).** Short paste. Write
   `config/leaky-surface.json` with `{ surface, notes?, capturedAt }`.
   Use the answer to pick the hand-off skill.

4. **Write `config/profile.json`** with `{ userName?, company?,
   onboardedAt, status: "onboarded" | "partial" }`. Use `"partial"`
   if any topic was skipped.

5. **Atomic writes.** Every file written as `{path}.tmp` then
   renamed. Never partial JSON.

6. **Hand-off — routed by the leakiest-surface answer:**
   - `page` → "Ready. Try: `Rewrite my homepage at {url}`."
   - `signup-flow` → "Ready. Try: `Review my signup flow at {url}`."
   - `onboarding` → "Ready. Try: `Rewrite the in-app onboarding copy
     for {product}`."
   - `paywall` → "Ready. Try: `Audit my upgrade paywall`."
   - `popup` → "Ready. Try: `Spec an exit popup for {goal}`."
   - `form` → "Ready. Try: `Audit my lead / contact / demo form`."

## Outputs

- `config/profile.json`
- `config/primary-page.json`
- `config/voice.md`
- `config/leaky-surface.json`

(No entry appended to `outputs.json` — onboarding is setup, not a
deliverable.)
