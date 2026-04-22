---
name: plan-paid-campaign
description: Use when the user says "plan a paid campaign" / "Google Ads for {keyword cluster}" / "should we run ads on {channel}" — produces a full campaign brief (audience, keyword/placement strategy, budget plan, ad-group structure, creative angles, landing-page requirement, KPI targets) grounded in the positioning doc and whatever channel data is available via Composio.
---

# Plan Paid Campaign

Turns a channel + goal into a ready-to-execute campaign brief. Does
not launch anything — the founder takes the brief into the ad
platform themselves (or approves, then runs a launch skill later).

## When to use

- "Plan a Google Ads search campaign for {cluster}"
- "Should we try Meta for {audience}"
- "Build me a LinkedIn campaign brief"
- "Paid campaign plan for {feature launch}"

## Steps

1. **Read positioning doc** at `../head-of-marketing/product-marketing-context.md`.
   If missing or empty, tell the user to run the Head of Marketing's
   `define-positioning` skill first and stop.
2. **Read config:** `config/channels.json`, `config/conversion.json`,
   `config/analytics.json`. If the channel the user named isn't in
   `channels.active`, ask one question naming the best modality
   (Composio connection to the ad platform > paste current account
   shape > "I'll plan blind from public best-practice"). Update
   `config/channels.json` accordingly.
3. **Pull channel data (if connected).** Run `composio search
   {channel}` to find the right slug (e.g. `GOOGLEADS_`,
   `META_ADS_`, `LINKEDIN_ADS_`). Call list-accounts /
   list-keywords / list-audiences. Skip gracefully if not connected.
4. **Draft the brief** in this structure:
   - **Objective** — one sentence tied to the primary conversion event.
   - **Audience** — targeting spec (keywords for search; interests /
     lookalikes / job titles for social). Grounded in ICP from the
     positioning doc.
   - **Budget plan** — daily + monthly, split by ad group.
   - **Ad-group structure** — 2-5 groups with theme + sample keywords
     or audience slice each.
   - **Creative angles** — 3-5 angles, each tied to a pain or
     differentiator from the positioning doc. (For exact copy, hand
     to `generate-ad-copy`.)
   - **Landing-page requirement** — which URL each ad group routes
     to; flag if a new page is needed. (Hand to
     `critique-landing-page` if the existing page is weak.)
   - **KPI targets** — CPC / CPM / CPA / CTR benchmarks. Cite source
     (industry benchmark vs. historical from connected account).
   - **Tracking** — the events + UTMs this campaign needs. (Hand to
     `setup-tracking` if not yet specced.)
   - **Launch checklist** — conversion tracking live, landing page
     approved, creative approved, budget caps set.
5. **Write** the brief atomically to
   `campaigns/{channel}-{slug}.md` (`*.tmp` → rename).
6. **Append to `outputs.json`** — new entry `{ id, type:
   "campaign", title, summary, path, status: "draft", createdAt,
   updatedAt }`. Read existing array, merge, write atomically.
7. **Summarize to user** — one paragraph covering objective,
   audience, budget, biggest open question, path to the brief.

## Outputs

- `campaigns/{channel}-{slug}.md`
- Appends to `outputs.json` with `type: "campaign"`.
