---
name: audit-site-seo
description: "Use when you say 'run an SEO audit' / 'audit {domain}' / 'how's our SEO' — I run a full on-page + technical audit via your connected Semrush (or Ahrefs / Firecrawl fallback), rank issues by impact × ease, and give you 10 prioritized fixes you can ship this week. Writes to `seo-audits/{domain}-{date}.md` — a fix list, not a wall of warnings."
integrations: [semrush, ahrefs, firecrawl]
---

# Audit Site SEO

## When to use

- Explicit: "run an SEO audit", "audit {domain}", "how's our SEO",
  "SEO health check", "check our on-page SEO".
- Implicit: called by Head of Marketing during a launch plan, or by
  `analyze-content-gap` when baseline site health is unknown.
- Safe to run per-domain, ideally no more than weekly per domain.

## Steps

1. **Read positioning doc**:
   `../head-of-marketing/product-marketing-context.md`. If missing or
   empty, tell the user: "I need your positioning doc first — please
   spend 5 minutes with the Head of Marketing (`define-positioning`)."
   Stop.
2. **Read config**: `config/site.json` and `config/tooling.json`. If
   `site.domain` is missing, ask ONE question naming the best modality
   ("Paste your domain URL — or open Integrations and connect your
   CMS so I can pull posts directly"). Write to `config/site.json`
   and continue.
3. **Discover tools via Composio.** Run `composio search seo` to find
   audit/crawl tool slugs (Semrush / Ahrefs / Firecrawl / generic
   web-scrape). If no SEO-category tools are connected, tell the user
   which category to link from the Integrations tab and stop.
4. **Run the three audit passes** by executing the discovered tool
   slugs against the domain (or key URLs):
   - **On-page** — title tags, meta descriptions, H1/H2 hierarchy,
     canonical tags, schema, alt text, internal linking.
   - **Technical** — crawlability (robots.txt / sitemap), indexation,
     Core Web Vitals, mobile usability, HTTPS, broken links, redirects.
   - **Content** — top-performing pages, thin content, cannibalization,
     content-vs-positioning fit (use positioning doc here).
5. **Score + prioritize**: each finding tagged {severity: critical /
   high / medium / low} and {effort: quick-win / medium / heavy}.
   Surface the top 5 critical-or-high quick-wins at the top.
6. **Write** the audit to
   `seo-audits/{domain-slug}-{YYYY-MM-DD}.md` atomically
   (`*.tmp` → rename). Structure: Executive summary → Top 5 quick
   wins → On-page findings → Technical findings → Content findings →
   Recommended 30-day plan.
7. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "seo-audit", title, summary, path, status: "draft",
   createdAt, updatedAt }`, write atomically.
8. **Summarize to user** — one paragraph with the top 5 quick-wins
   and the path to the full report.

## Never invent

Every finding ties back to a real tool response or URL observation.
If a tool errored or returned no data, mark the finding MISSING or
UNKNOWN — don't guess.

## Outputs

- `seo-audits/{domain-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with type `seo-audit`.
