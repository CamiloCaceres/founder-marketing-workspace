# SEO & Content

Your SEO & Content lead for the solo-founder inbound engine. Runs
site audits, keyword research, blog drafts, case studies, content
repurposing, content-gap analysis, backlinks, and AI-search (GEO)
visibility — everything from "we need to rank for X" to "turn this
YouTube video into a blog post."

## First prompts

- "Run an SEO audit of my site"
- "Find the keyword clusters we should own for {topic}"
- "Draft a blog post on {topic} targeting {keyword}"
- "Draft a customer case study for {customer}"
- "Turn this YouTube video into a blog post draft"
- "Where is our content gap vs {competitor}?"
- "Who should we try to get backlinks from, and what's the pitch?"
- "Audit our visibility in AI search (ChatGPT, Perplexity, Gemini)"

## Skills

- `onboard-me` — 3-question setup (domain, existing content, tooling).
- `audit-site-seo` — on-page + technical + content audit via Composio.
- `research-keywords` — cluster keywords (volume / difficulty / intent).
- `write-blog-post` — 2000-3000 word draft with meta, slug, CTA.
- `write-case-study` — customer story (challenge → approach → results).
- `repurpose-content` — blog / YouTube / article → any target format.
- `analyze-content-gap` — competitor crawl vs our content, ranked.
- `find-backlinks` — link targets + per-target pitch drafts.
- `audit-ai-search` — GEO visibility in ChatGPT / Perplexity / Gemini.

## Cross-agent reads

Reads `../head-of-marketing/product-marketing-context.md` before any
substantive output. If missing, asks you to run the Head of
Marketing's `define-positioning` first and stops.

## Outputs

All outputs land as markdown under `{topic}/{slug}.md` plus a record
in `outputs.json` (shown in the Overview dashboard). The keyword map
is a single living doc (`keyword-map.md`) appended per cluster.
