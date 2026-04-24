---
name: design-lifecycle-campaign
description: "Use when you say 'design a drip' / 're-activation campaign' / 'lifecycle for {segment}' — I build an event-triggered drip with trigger event, frequency rules, branching by user action, and drafted copy per email. Honest about when to stop emailing. Writes to `drips/{slug}.md` with every branch labeled."
integrations: [customerio, loops]
---

# Design Lifecycle Campaign

Event-triggered drip, not a time-based broadcast. Every email branches
on what the user did (or didn't do) since the last touch.

## When to use

- User: "design a drip" / "re-activation campaign" / "lifecycle for
  {segment}" / "drip for users who {did/didn't do X}".
- User names a specific segment or a specific event gap.

## Steps

1. **Read positioning doc** — `../head-of-marketing/product-marketing-context.md`.
   If missing or empty, tell the user to run the Head of Marketing's
   `define-positioning` first and stop.
2. **Read `config/voice.md`.** If missing, ask once with the
   connected-inbox hint (Composio-connected Gmail / Outlook /
   Superhuman > pasted samples), write the file, continue.
3. **Read `config/journey.json`.** If missing or the named segment's
   trigger event isn't there, ask one targeted question: "Which event
   triggers this drip, and what's the success action we want them to
   take?" Update `config/journey.json` (and `config/segments.json` if
   this is a new segment) and continue.
4. **Name the trigger and goal event.** Trigger = the event (or
   missing-event) that enrolls a user. Goal = the event that exits
   them from the drip successfully.
5. **Decide frequency rules.** Default: 3 touches over 14 days, with
   a 72-hour minimum gap. If the user has a stricter rule (e.g. no
   more than one marketing email per user per week), honor it. Note
   the rule in the artifact.
6. **Branch by user action.** For each email after the first:
   - If the user took the goal action → exit the drip, fire a
     thank-you (optional), stop.
   - If the user opened but didn't act → variant A (re-frame the
     value prop with a different pain).
   - If the user didn't open → variant B (fresh subject, shorter
     body, different send time).
   - After the final email with no action → mark as "cold", exit drip,
     optionally enroll in a lower-frequency nurture (out of scope
     for this artifact — flag to the user).
7. **Draft each email** in the user's voice: subject, preview, body,
   single CTA, success metric per email.
8. **Write** `drips/{campaign-slug}.md` atomically. Front-matter:
   `trigger`, `goalEvent`, `segment`, `frequencyRule`, `exitRules`,
   `source: "coverage-gap"`. Include a short diagram (ASCII or
   bullet tree) of the branches.
9. **Append to `outputs.json`** — type `"drip"`, status `"draft"`,
   2-3-sentence summary naming the trigger and the goal event.
10. **Summarize to user** — "Drip designed for trigger
    `{trigger_event}` → goal `{goal_event}` at {path}. {N} emails,
    {freq} cadence. Review the branches, then build the automation
    in {platform} — I don't trigger it."

## Outputs

- `drips/{campaign-slug}.md`
- Appends to `outputs.json` with `{ id, type: "drip", title, summary,
  path, status: "draft", createdAt, updatedAt }`.
