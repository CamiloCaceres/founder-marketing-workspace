---
name: monitor-social-feed
description: "Use when you say 'scan my timeline' / 'what's worth engaging with' / 'Reddit signal' / 'IG mentions' — I filter your feed for relevance to your topics and engagement opportunities, then suggest concrete replies. No more doom-scrolling for something to comment on. Writes to `feed-digests/{platform}-{date}.md` with reply drafts per opportunity."
---

# Monitor Social Feed

## When to use

- User: "scan my X timeline" / "what's worth engaging with on
  LinkedIn" / "Reddit signal in {subreddit}" / "IG mentions" / "what
  did I miss".
- Can be routinized (e.g. daily at 8am, surface 5 high-signal posts).

## Steps

1. **Read positioning doc**:
   `../head-of-marketing/product-marketing-context.md`. If missing or
   empty, stop and tell the user to run `define-positioning` first.

2. **Read `config/platforms.json`, `config/topics.json`,
   `config/voice.md`.** If platforms or topics are missing, ask the
   minimal question and continue.

3. **Determine platform + scope.** Parse the user's request:
   - "scan my timeline" → X home timeline
   - "LinkedIn feed" → LinkedIn home feed
   - "Reddit {subreddit}" → top posts in that subreddit
   - "IG mentions" → Instagram mentions + comments on own posts
   - Default: the primary platform from `config/platforms.json`.

4. **Pull the feed.** Run `composio search <platform>` to discover
   the read-feed / top-posts / mentions tool. Execute by slug. Pull
   the last 24-48h window (or the user's range), capped at ~50 posts.
   If the connection is missing, tell the user which category to link
   and stop.

5. **Score and filter.** For each post, judge:
   - **Topical relevance.** Does it touch one of `config/topics.json`
     themes? High / medium / none.
   - **Engagement opportunity.** Is there an angle where we can add
     real value — disagree substantively, ask a sharp question, share
     a specific experience? Or is it a post where a like is enough?
   - **Risk.** Flag anything political / personal / off-brand.
   Keep 5-10 high-value posts. Drop the rest.

6. **Draft suggested replies** for the top 3-5 high-value posts. Each
   reply: 1-3 sentences, value-first, in voice from `config/voice.md`.
   No pitches.

7. **Write** to `feed-digests/{platform}-{YYYY-MM-DD}.md` atomically.
   File structure:
   ```markdown
   # {Platform} Feed Digest — {YYYY-MM-DD}

   **Window:** {last 24h / last 48h / custom}
   **Posts scanned:** {count}
   **High-signal:** {count}

   ---

   ## 1. {Author} — {one-line post summary}
   - URL: {link}
   - Topical relevance: {high / medium}
   - Why it matters: {one line}
   - **Suggested reply:**
     > {draft reply, 1-3 sentences}

   ## 2. ...

   ---

   ## Also worth a like
   - {shorter list of posts that don't need a reply}
   ```

8. **Append to `outputs.json`** — new entry, `type: "feed-digest"`,
   `path: "feed-digests/{platform}-{YYYY-MM-DD}.md"`, `status:
   "draft"`, atomic write.

9. **Summarize to user** — one paragraph: "{N} high-signal posts on
   {platform} in the last {window}. Top one: {author} on {topic} — I
   drafted a reply. Full digest at {path}."

## Outputs

- `feed-digests/{platform}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `{ id, type: "feed-digest", title,
  summary, path, status: "draft", createdAt, updatedAt }`.
