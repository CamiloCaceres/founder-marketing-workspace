---
name: plan-launch
description: Use when the user says "plan the launch of {feature}" / "help me prep the {feature} launch" / "we're launching {X}, coordinate" — produces a sequenced plan (pre-launch, launch day, post-launch) with specific tasks tagged for each of the other four marketing agents.
---

# Plan Launch

Source template: Gumloop "Go-to-Marketing Content Co-Pilot", reframed
for a solo founder coordinating four agents instead of a 10-person
GTM team.

## When to use

- "plan the launch of {feature}" / "help me prep the {feature}
  launch" / "we're launching {X}, coordinate".
- "update the launch plan — we slipped the date".
- The user just finished `define-positioning` or `profile-icp` and
  asks "what do we do next for this?" in the context of shipping.

## Steps

1. **Read positioning doc** (own file):
   `product-marketing-context.md`. Extract current ICP, top
   differentiators, primary CTA. If missing, run
   `define-positioning` first.

2. **Gather launch inputs** — ask ONE tight question if any is
   missing (best modality hint first):
   - **What is launching** — feature name, one-line description,
     target date. (Best: paste a PRD URL or a short description.)
   - **Why now** — the customer problem this unblocks. Cite a call
     quote if you have `call-insights/`.
   - **Audience** — which ICP segment benefits most. Default to the
     positioning doc's core ICP unless the user says otherwise.
   - **Scale** — soft launch (customers + quiet blog) / standard
     (blog + email + social + ads) / big (above plus PR +
     Product Hunt). Default: standard.

3. **Draft the sequenced plan (markdown, ~600-900 words).**
   Organized into three phases:

   ### Pre-launch (2 weeks before → launch eve)

   - `head-of-marketing` (me) — positioning delta, launch narrative
     in 3 sentences, press + Product Hunt prep if scale warrants.
   - `seo-content` — launch blog post brief (keyword target,
     outline, target length), case-study brief if applicable.
   - `growth-paid` — paid creative brief (headlines, angles
     derived from positioning), landing-page updates or a
     dedicated launch LP.
   - `lifecycle-email` — announcement email to all users,
     optional drip for new signups arriving via launch, in-app
     message spec.
   - `social-community` — teaser posts calendar (LinkedIn / X /
     relevant community), podcast/newsletter pitches if scale
     warrants.

   ### Launch day

   - Sequenced minute-by-minute (or hour-by-hour) list.
   - Who (which agent) drafts what, when it goes live, who
     approves. The founder approves every external send.

   ### Post-launch (week 1 → week 2)

   - Metrics to watch (primary CTA conversion, blog traffic, email
     opens, social engagement, paid CAC).
   - Follow-up content (one case-study post-launch, one "lessons
     learned" post).
   - Paid scale-up / kill rules for `growth-paid`.
   - Lifecycle drip refresh.
   - A retro entry for the next `review-marketing-health` run.

4. **Make every task assignable.** Each bullet is prefixed with
   `[{agent-id}]` so the founder (or the other agents reading this
   plan) can see ownership at a glance. Example:
   `[seo-content] Draft the launch blog post targeting "{keyword}"
   — target 1200 words, publish by {date}.`

5. **Flag dependencies + risks.** One short section: "What could
   kill this launch" — 3 bullets, each with a mitigation.

6. **Sanity check against the positioning doc.** Every piece of
   copy or angle proposed should echo the positioning doc's
   differentiators or JTBD — not freestyle marketing-speak.

7. **Write atomically** to `launches/{launch-slug}.md` —
   `{path}.tmp` then rename. `{launch-slug}` is kebab-case of the
   feature name + target-date month (e.g.
   `launches/voice-import-2026-05.md`).

8. **Append to `outputs.json`.** Read-merge-write atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "launch",
     "title": "<Feature name> launch plan",
     "summary": "<2-3 sentences — what's launching, when, the scale choice>",
     "path": "launches/<slug>.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

9. **Summarize to user.** One paragraph: launch summary + the 3
   highest-leverage tasks the founder should kick off this week +
   which agents will do the heavy lifting + path to the plan.

## Outputs

- `launches/{launch-slug}.md`
- Appends to `outputs.json` with `type: "launch"`.
