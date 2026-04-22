---
name: write-newsletter
description: Use when the user says "draft this week's newsletter" / "newsletter on {theme}" / "weekly update email" — pulls source material (user paste, a recent blog or repurposed asset via `../seo-content/outputs.json`, or internal updates) and produces one edition with subject + preview + body organized around a single clear through-line.
---

# Write Newsletter

One edition, one through-line. Not a link-dump, not a changelog.

## When to use

- User: "draft this week's newsletter" / "newsletter on {theme}" /
  "weekly update email".
- User provides a theme, a set of recent updates, or a source URL.

## Steps

1. **Read positioning doc** — `../head-of-marketing/product-marketing-context.md`.
   If missing or empty, say: "I need the shared positioning doc first.
   Run the Head of Marketing's `define-positioning` first." Stop.
2. **Read `config/voice.md`.** If missing, ask once: "To sound like
   you I need your voice — easiest: connect a personal inbox (Gmail /
   Outlook / Superhuman) via Composio and I'll pull recent sent
   messages. Otherwise paste 2-3 emails. Which do you prefer?" Write
   `config/voice.md` and continue.
3. **Gather source material**, in this order of preference:
   - Anything the user pasted or linked in the prompt.
   - `../seo-content/outputs.json` — if present, offer the most recent
     blog post / repurposed asset as the edition's spine. Handle
     missing file gracefully.
   - Ask the user: "What happened this week worth an email? 3-5 bullets
     or a paste."
4. **Pick the through-line.** One sentence — what the reader should
   take away. If you can't state it in one sentence, ask the user
   which of their updates is the headline before drafting.
5. **Draft the edition.**
   - **Subject** — ≤60 chars, specific, tied to the through-line.
     Avoid "Newsletter #N" boilerplate.
   - **Preview text** — 50-90 chars, complements subject.
   - **Body** — opens with the through-line, 3-5 short sections that
     serve it (a "what shipped", a customer moment, a pointer to the
     blog, etc.), ends with one primary CTA. Plain-text-first. Cite
     source URLs inline where used.
6. **Write** `newsletters/{YYYY-MM-DD}.md` atomically. Front-matter:
   `throughLine`, `sources` (array of URLs / internal refs),
   `source: "beehiiv-adjacent"`.
7. **Append to `outputs.json`** — type `"newsletter"`, status
   `"draft"`, 2-3-sentence summary naming the through-line.
8. **Summarize to user** — "Newsletter for {date} at {path}.
   Through-line: '{one sentence}'. Review, tweak, paste into
   {platform}."

## Outputs

- `newsletters/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `{ id, type: "newsletter", title,
  summary, path, status: "draft", createdAt, updatedAt }`.
