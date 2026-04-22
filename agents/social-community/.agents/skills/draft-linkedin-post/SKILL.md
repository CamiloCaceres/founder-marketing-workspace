---
name: draft-linkedin-post
description: Use when the user says "draft a LinkedIn post" / "LinkedIn on {topic}" / "post about {idea}" — produces a LinkedIn-native post (hook in the first line, whitespace between lines, one clear takeaway, clear CTA or question) grounded in the shared positioning doc and the user's voice, written as a draft the user reviews before posting.
---

# Draft LinkedIn Post

## When to use

- User: "draft a LinkedIn post about {topic}" / "LinkedIn on {X}" /
  "post about {idea}" / "write me a LinkedIn post".
- Also invoked by `plan-social-calendar` when a calendar slot calls for
  a LinkedIn original.

## Steps

1. **Read positioning doc**:
   `../head-of-marketing/product-marketing-context.md`. If missing or
   empty, tell the user:
   > "I need your positioning doc first — please spend 5 minutes with
   > the Head of Marketing (`define-positioning`)."
   …and stop.

2. **Read `config/voice.md` and `config/topics.json`.** If `voice.md`
   is missing, ask one targeted question:
   > "Before I draft, how do you sound on LinkedIn? Connect your
   > LinkedIn (or email inbox) via Composio and say so — I'll pull
   > recent posts — or paste 2-3 of your recent LinkedIn posts."
   Write to `config/voice.md` and continue. If the requested topic
   isn't in `config/topics.json`, proceed anyway but note the topic as
   a candidate new theme.

3. **Optional research pass.** If the topic needs a fresh angle or
   data point, run `composio search web-search` (or the connected
   research provider) to pull 1-3 facts to ground the post. Never
   invent stats.

4. **Draft the post.** Structure:
   - **Hook** (line 1, 4-10 words, contrarian / curiosity / specific
     number). Must stop the scroll.
   - **Whitespace.** Short lines, no walls of text.
   - **One clear takeaway.** The single idea the reader should leave with.
   - **Body** of 3-6 short paragraphs (each 1-3 lines).
   - **CTA or question.** Invite a reply — "What's your take?" /
     "Anyone else see this?" / "Try it this week."
   - **Hashtags** (optional, 0-3 max, lowercase, specific — not #marketing).
   - Respect voice: formality, emoji habit, sentence length from
     `config/voice.md`. If voice is flat, default to direct + warm.

5. **Write** to `posts/linkedin-{slug}.md` atomically (`*.tmp` →
   rename). Slug is kebab(first-5-hook-words). File structure:
   ```markdown
   # {short title}

   **Type:** linkedin-post
   **Topic:** {topic slug from config/topics.json if applicable}
   **Hook:** {the first line}

   ---

   {full post body, ready to paste into LinkedIn}

   ---

   ## Notes
   - {one-line on angle / tradeoff}
   - {grounding sources, if any}
   ```

6. **Append to `outputs.json`** — read the existing array, add a new
   `Output` entry (`id` uuid v4, `type: "linkedin-post"`, `title`,
   `summary`, `path: "posts/linkedin-{slug}.md"`, `status: "draft"`,
   timestamps), write atomically.

7. **Summarize to user** — one paragraph naming the hook, the
   takeaway, and the CTA, plus the path to the draft. Remind: "Review,
   edit if needed, then post it yourself — I never post for you."

## Outputs

- `posts/linkedin-{slug}.md`
- Appends to `outputs.json` with `{ id, type: "linkedin-post", title,
  summary, path, status: "draft", createdAt, updatedAt }`.
