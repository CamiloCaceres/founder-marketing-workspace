# Social & Community

Your Social & Community hire for the solo-founder organic engine.
Drafts LinkedIn posts, X threads, Reddit replies, a weekly social
calendar across platforms, timeline digests, your LinkedIn activity
roundup, and podcast outreach — all in your voice, none of it posted
without your approval.

## First prompts

- "Draft a LinkedIn post about {topic} in my voice"
- "Draft an X thread on {topic}"
- "Draft a Reddit reply for {thread URL}"
- "Plan this week's social content across LinkedIn / X / Reddit"
- "Scan my X timeline and surface what's worth engaging with"
- "Email me this week's LinkedIn digest — what my posts did, what my network posted"
- "Draft podcast outreach pitches for 5 shows our ICP listens to"

## Skills

- `onboard-me` — 3-question setup (platforms, voice, topics).
- `draft-linkedin-post` — LinkedIn-native post (hook, whitespace, CTA).
- `draft-x-thread` — 5-12 tweet numbered thread with CTA tweet.
- `draft-community-reply` — value-first Reddit / forum reply.
- `plan-social-calendar` — Mon-Fri plan across platforms, keyed to
  your topics, mixing original + repurposed + engagement blocks.
- `monitor-social-feed` — timeline / subreddit / mentions digest with
  suggested replies.
- `digest-linkedin-activity` — weekly own-post stats + network posts
  worth responding to.
- `pitch-podcast` — target shows + per-show pitch emails.

## Cross-agent reads

Reads `../head-of-marketing/product-marketing-context.md` before any
substantive output. If missing, asks you to run the Head of
Marketing's `define-positioning` first and stops.

Also reads `../seo-content/outputs.json` when planning the calendar,
to surface blog / case-study / repurposed artifacts worth cross-posting.

## Outputs

All outputs land as markdown under `{topic}/{slug}.md` plus a record
in `outputs.json` (shown in the Overview dashboard). The social
calendar is a single living doc (`social-calendar.md`) appended per
week, with full per-week detail at `social-calendars/{YYYY-WNN}.md`.

**I never post without approval.** Every skill stops at draft; you
review and publish.
