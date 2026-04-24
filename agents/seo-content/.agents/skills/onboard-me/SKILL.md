---
name: onboard-me
description: "Use when you say 'onboard me' / 'set me up', or on the first task before `config/` exists — I ask 3 quick questions (~90s): your domain, your existing content (connected CMS or top post URLs), and which SEO tools you've connected via Composio. Then I can audit, rank, and draft."
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
- **3 questions is the ceiling, not the target.**
- **One question at a time after the preamble.**
- **Rank modalities:** connected app via Composio > file/URL > paste.
- **Anything skipped** → note "TBD" and ask again just-in-time later.

## Steps

0. **Scope + modality preamble — the FIRST message, then roll into Q1:**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   > Here's what I need and the easiest way to share each:
   >
   > 1. **Your domain** — the site I'll audit. *Best: paste the URL
   >    (e.g. `acme.com`).*
   > 2. **Your existing content** (if any) — so I can read what's
   >    already published. *Best: connect your blog/CMS via Composio
   >    (WordPress / Webflow / Ghost / Notion) from the Integrations
   >    tab. Or paste your top 5 post URLs.*
   > 3. **Your SEO tooling** — which Composio categories you've
   >    connected (Semrush / Ahrefs / Firecrawl / etc) so I know what's
   >    available to call. *Best: tell me what's connected, or link
   >    them from the Integrations tab first.*
   >
   > Let's start with #1 — what's your domain?"

1. **Capture topic 1 (domain).** Parse paste or URL. Normalize to
   `{ domain, rootUrl }`. Write initial stub to `config/site.json`
   with `{ domain, rootUrl, cmsConnectedViaComposio: false, source,
   capturedAt }`. Acknowledge and roll into Q2: "Got it — now your
   existing content. CMS connected, or want to paste your top post URLs?"
2. **Capture topic 2 (existing content).** If user says they've
   connected a CMS: run `composio search content-cms` (or
   `composio search cms`) to discover the tool slug; record
   `cms` and set `cmsConnectedViaComposio: true`. If they paste
   URLs: store them as `existingPosts` (up to 5). Update
   `config/site.json`. Roll into Q3: "Last one — which SEO tools do
   you have connected (Semrush, Ahrefs, Firecrawl, others)?"
3. **Capture topic 3 (SEO tooling).** Record categories the user
   names. Optionally verify via `composio search seo`. Write
   `config/tooling.json` with `{ seoCategories, youtubeConnected,
   webScrapeConnected, notes?, capturedAt }`. If none connected,
   still capture the answer and note it — skills will prompt to
   connect when needed.
4. **Write `config/profile.json`** with `{ userName, company,
   onboardedAt, status: "onboarded" | "partial" }`. Use `"partial"`
   if any topic was skipped.
5. **Hand-off:** "Ready. Try: `Run an SEO audit of my site`."

## Outputs

- `config/profile.json`
- `config/site.json`
- `config/tooling.json`
