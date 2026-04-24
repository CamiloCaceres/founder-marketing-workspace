---
name: write-blog-post
description: "Use when you say 'draft a blog post on {topic}' / 'write a post about {X}' — I write a 2,000–3,000-word draft with H1/H2/H3, meta description, URL slug, internal-link suggestions, and one clear CTA. Writes to `blog-posts/{slug}.md` plus a Google Doc if connected. Reads like you wrote it."
integrations: [googledocs, notion]
---

# Write Blog Post

## When to use

- Explicit: "draft a blog post on {topic}", "write a post about
  {keyword}", "blog on {topic} targeting {keyword}".
- Implicit: the user picks a priority term from `keyword-map.md` and
  asks to draft it.
- Produces a full draft; user reviews and signs off before publishing.

## Steps

1. **Read positioning doc**:
   `../head-of-marketing/product-marketing-context.md`. If missing,
   stop and tell the user to run `define-positioning` first. The
   positioning and voice guide the whole draft.
2. **Read config**: `config/site.json` (for CMS context and internal
   link targets) and — if it exists — `keyword-map.md` for the
   target keyword's cluster context. If no target keyword is named,
   ask ONE question: "What's the target keyword or working title?"
3. **Discover internal link targets.** If a CMS is connected, run
   `composio search content-cms` and list recent posts to surface
   natural internal-link candidates. Otherwise use `existingPosts`
   from `config/site.json`.
4. **Research** via `composio search web` / SERP tools to pull the
   top 5-10 ranking pages for the target keyword. Identify the
   angle gaps you can exploit, the structure readers expect, and
   cited sources.
5. **Draft the post** (2000-3000 words) with:
   - H1 (working title; keyword-forward but human).
   - Intro (hook + promise + table of contents).
   - H2s / H3s covering the sub-topics the SERP demands, plus at
     least one contrarian or original-angle section tied to the
     positioning doc.
   - Internal link suggestions inline (naming 3-7 candidate URLs).
   - Call-to-action at the end tied to the product's primary CTA
     from the positioning doc.
   - Meta description (≤155 chars).
   - Recommended URL slug (kebab-case).
   - Image brief section (alt text + 2-3 image ideas).
6. **Write** to `blog-posts/{slug}.md` atomically. Include a
   front-matter block with title, slug, metaDescription, targetKeyword,
   wordCount, status.
7. **Append to `outputs.json`** — `{ id, type: "blog-post", title,
   summary, path: "blog-posts/{slug}.md", status: "draft",
   createdAt, updatedAt }`.
8. **Summarize to user** — the post angle, the contrarian hook, the
   suggested internal links, and the path to the draft. Ask for
   sign-off before flipping status to `ready`.

## Never invent

Never fabricate statistics, customer quotes, or sources. Every
citable claim gets a URL or is marked TBD for the founder to verify.
Voice matches the positioning doc's tone — do not generic-ify.

## Outputs

- `blog-posts/{slug}.md`
- Appends to `outputs.json` with type `blog-post`.
