---
name: analyze-content-gap
description: "Use when you say 'content gap vs {competitor}' / 'what are we missing' / 'where can we out-rank {X}' — I crawl their content via Firecrawl, compare to ours, and rank gaps by search volume × how easily we could take the topic. Writes to `content-gap-analyses/{competitor}-{date}.md` with a first-draft brief per gap."
integrations: [firecrawl, semrush]
---

# Analyze Content Gap

## When to use

- Explicit: "content gap vs {competitor}", "what topics are we
  missing", "where can we out-rank {competitor}", "what's {competitor}
  publishing that we're not".
- Implicit: inside a launch plan when the Head of Marketing needs to
  pick a counter-positioning content beat.
- Per-competitor, no more than monthly per competitor.

## Steps

1. **Read positioning doc**:
   `../head-of-marketing/product-marketing-context.md`. If missing,
   stop and tell the user to run `define-positioning` first. The
   competitor list and differentiators live there.
2. **Read config**: `config/site.json`, `config/tooling.json`. If no
   SEO tool or web-scrape tool is connected, ask ONE question:
   "Connect a web scrape or SEO tool in the Integrations tab
   (Firecrawl / Semrush / Ahrefs) — which do you want to use?"
3. **Identify competitor + target keywords universe.** Take the
   named competitor (or pull top 1-3 from the positioning doc if
   user says "our competitors"). Resolve competitor domain(s).
4. **Crawl competitor content** via `composio search web-scrape` or
   `composio search seo` to pull:
   - Their ranking keywords + top pages.
   - Top content by estimated traffic.
   - Topic clusters they own.
5. **Crawl our content** via the connected CMS or by reading
   `config/site.existingPosts`. Build our topic coverage set.
6. **Compute the gap.** For each competitor-owned topic / keyword:
   - Do we cover it? (yes / partial / no)
   - Search volume (from keyword tool).
   - Estimated difficulty (relative — can we realistically out-rank).
   - Positioning fit (does it reinforce our differentiation from
     the positioning doc? yes / neutral / off-brand).
7. **Rank opportunities** by `(volume × fit) / difficulty`. Surface
   the top 10 with recommended next-actions (new post / refresh
   existing / skip + why).
8. **Write** to
   `content-gap-analyses/{competitor-slug}-{YYYY-MM-DD}.md`
   atomically. Structure: Executive summary → Top 10 opportunities
   (table) → Topic-by-topic detail → Skip list with reasons.
9. **Append to `outputs.json`** — `{ id, type: "content-gap", title,
   summary, path, status: "draft", createdAt, updatedAt }`.
10. **Summarize to user** — the top 3 opportunities with a one-line
    recommended post title each, and the path.

## Never invent

Never estimate competitor traffic without a tool response. Mark
partial-data findings TBD. Don't inflate gaps where our coverage
is actually fine.

## Outputs

- `content-gap-analyses/{competitor-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with type `content-gap`.
