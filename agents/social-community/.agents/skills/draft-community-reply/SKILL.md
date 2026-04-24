---
name: draft-community-reply
description: "Use when you say 'draft a Reddit reply to {URL}' / 'respond to this thread' / 'community reply' — I pull the source thread (via Composio / Firecrawl) and draft a value-first reply. Helpful first, link only if it truly belongs. Writes to `community-replies/{source-slug}.md`."
---

# Draft Community Reply

## When to use

- User: "draft a Reddit reply for {thread URL}" / "respond to {URL}" /
  "community reply on {forum}" / "reply to this thread".
- Also invoked by `monitor-social-feed` on a flagged high-signal
  thread.

## Rule of thumb

Helpful first, link last or not at all. Reddit / forum communities
detect and punish pitches on contact. If we can't add value without
the link, we don't reply.

## Steps

1. **Read positioning doc**:
   `../head-of-marketing/product-marketing-context.md`. If missing or
   empty, stop and tell the user to run `define-positioning` first.

2. **Read `config/voice.md`.** If missing, ask one targeted question
   and write it before continuing.

3. **Pull the source thread.** Run `composio search web-scrape` (or a
   Reddit-specific tool if available, `composio search reddit`), fetch
   the thread URL, extract the OP's question + top 3-5 comments so we
   understand the tone and what's been said. If the fetch fails or
   returns nothing, ask the user to paste the thread.

4. **Assess value.** Decide in one sentence: "do we genuinely have
   something useful to add here?" If no, tell the user and stop. Do
   not draft a filler reply.

5. **Draft the reply.** Structure:
   - **Acknowledge** the OP's specific question or situation (one
     line, shows you read it).
   - **Concrete value.** 2-4 short paragraphs — a framework, a
     specific number, a gotcha, a step-by-step, or a counter-take
     grounded in the user's experience / positioning.
   - **Optional soft mention.** Only if directly relevant and only
     after the value. Mention the product by name, not link. If a
     link is genuinely useful (docs, blog post, tool), include it,
     but default to "happy to share if useful."
   - **No signatures, no marketing flourishes.** Sound like a human
     who's been there, not a brand.
   - Voice: match `config/voice.md` but shift toward the community's
     register (Reddit is more casual than LinkedIn).

6. **Write** to `community-replies/{source-slug}.md`. Slug is
   kebab(subreddit-or-domain + first-5-title-words). File structure:
   ```markdown
   # Reply to: {thread title}

   **Type:** community-reply
   **Source URL:** {URL}
   **Subreddit / community:** {name}
   **OP question:** {one-line summary}

   ---

   ## Source thread excerpt

   > {OP post, quoted verbatim, truncated to 400 chars}

   **Top comments (summary):** {one line each, 3 max}

   ---

   ## Draft reply

   {the reply, ready to paste}

   ---

   ## Notes
   - Value add: {one-line}
   - Link decision: {included / withheld + why}
   ```

7. **Append to `outputs.json`** — new entry, `type: "community-reply"`,
   `path: "community-replies/{source-slug}.md"`, `status: "draft"`.

8. **Summarize to user** — one paragraph naming the value add, the
   link decision, and the path. Remind: "Review tone, then reply
   yourself — I never post."

## Outputs

- `community-replies/{source-slug}.md`
- Appends to `outputs.json` with `{ id, type: "community-reply",
  title, summary, path, status: "draft", createdAt, updatedAt }`.
