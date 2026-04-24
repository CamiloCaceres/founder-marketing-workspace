---
name: draft-x-thread
description: "Use when you say 'X thread on {topic}' / 'Twitter thread' / 'draft a viral-shape thread' — I write a 5–12-tweet thread with a hook tweet, numbered progression, and a CTA tweet at the end. Each tweet fits the 280-char budget with room for edits. Writes to `threads/x-{slug}.md` — copy tweet-by-tweet into your scheduler."
---

# Draft X Thread

## When to use

- User: "X thread on {topic}" / "Twitter thread on {X}" / "draft a
  thread" / "viral-shape thread on {idea}".
- Also invoked by `plan-social-calendar` when a calendar slot calls
  for an X thread.

## Steps

1. **Read positioning doc**:
   `../head-of-marketing/product-marketing-context.md`. If missing or
   empty, tell the user:
   > "I need your positioning doc first — please spend 5 minutes with
   > the Head of Marketing (`define-positioning`)."
   …and stop.

2. **Read `config/voice.md` and `config/topics.json`.** If `voice.md`
   is missing, ask one targeted question:
   > "Before I draft, how do you sound on X? Connect X via Composio
   > and say so — I'll pull recent tweets — or paste 2-3 of your
   > recent posts."
   Write and continue.

3. **Optional research pass.** Run `composio search web-search` to
   pull 1-3 grounding facts if the thread needs data. Never invent
   stats. If the thread is a story or opinion piece, skip.

4. **Draft the thread.** Structure:
   - **Tweet 1 — Hook.** Must stop the scroll. Punchy, under 280
     chars, no emoji fluff. Patterns that work: contrarian claim,
     specific number + surprising outcome, "X does Y because Z", or a
     bold promise. End with "🧵" or a curiosity gap, not both.
   - **Tweets 2 to N-1 — Numbered progression.** 4-10 tweets. Each
     tweet is one beat of the argument. Each stands alone but pulls
     the reader to the next. Keep under 280 chars each; break long
     ideas into separate tweets.
   - **Final tweet — CTA.** Direct ask: follow, reply with their
     take, retweet tweet 1, or a link to the blog / product /
     sign-up.
   - Voice: match `config/voice.md`. X tends to be punchier than
     LinkedIn — shorter sentences, more cadence.

5. **Write** to `threads/x-{slug}.md` atomically. Slug is
   kebab(first-5-hook-words). File structure:
   ```markdown
   # {short title}

   **Type:** x-thread
   **Topic:** {topic slug if applicable}
   **Tweets:** {count}

   ---

   **1/** {hook tweet}

   **2/** {tweet 2}

   **3/** {tweet 3}
   ...

   **N/** {CTA tweet}

   ---

   ## Notes
   - {angle, why this shape}
   - {grounding sources, if any}
   ```

6. **Append to `outputs.json`** — new entry, `type: "x-thread"`,
   `path: "threads/x-{slug}.md"`, `status: "draft"`, atomic write.

7. **Summarize to user** — one paragraph naming the hook, the
   progression, and the CTA, plus the path. Remind: "Review, edit,
   post it yourself."

## Outputs

- `threads/x-{slug}.md`
- Appends to `outputs.json` with `{ id, type: "x-thread", title,
  summary, path, status: "draft", createdAt, updatedAt }`.
