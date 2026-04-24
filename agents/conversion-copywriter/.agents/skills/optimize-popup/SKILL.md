---
name: optimize-popup
description: "Use when you say 'exit popup' / 'modal copy' / 'lead-capture popup' / 'announcement banner' — I write popup copy (hook, offer, dismiss/accept CTAs) tied to a trigger (scroll, exit, time-on-page) with targeting recommendations. Writes to `popup-specs/{slug}.md`."
integrations: [firecrawl]
---

# Optimize Popup

Popups earn their interrupt by exchanging value for attention.
Bad popups feel like spam; good ones feel like timely help. This
skill produces a full spec — not just copy — that the founder can
drop into their popup tool of choice.

## When to use

- "Exit popup for {page}"
- "Lead-capture modal"
- "Announcement banner for {launch}"
- "Scroll-trigger email capture"
- "Cart-abandon save popup"
- "Sticky bar for {promo}"

**Not for paywalls / upgrade modals** — use
`optimize-paywall-upgrade`.
**Not for non-popup forms** — use `optimize-form`.

## Steps

1. **Read positioning doc** at
   `../head-of-marketing/product-marketing-context.md`. If missing,
   tell the user to run Head of Marketing's `define-positioning`
   first and stop.
2. **Read `config/voice.md`.** If missing, ask ONE question naming
   the best modality (connected inbox via Composio > paste samples)
   and write before drafting.
3. **Clarify the job in one question** (if unclear): what is the
   popup trying to accomplish? Lead capture, announcement, cart
   abandon save, promo / discount, survey, upgrade-adjacent reminder.
   Different jobs → different triggers and copy.
4. **Identify the target page(s) + audience.** New vs returning,
   logged-in vs anonymous, cart-has-items vs empty. Ask ONE
   question if not implied.
5. **Source evidence for the copy.** Priority order:
   - a) `../head-of-marketing/call-insights/` for verbatim phrases.
   - b) `../head-of-marketing/research/` for research-grounded hooks.
   - c) Run `composio search` for review-scrape tools (G2, Capterra,
     Trustpilot, Reddit, App Store) and pull relevant phrases.
   - d) If nothing is available, ask for 3-5 quotes from real
     customers and stop. Never invent.
6. **Draft the full spec** — every field filled, no blanks:
   - **Trigger** — exit-intent / scroll-% / time-on-page / behavioral
     (e.g. visited pricing twice). Name the rule. Respect a minimum
     engagement threshold: don't fire an interrupt before the user
     has earned it (early-session interrupts get dismissed and
     train future ignore).
   - **Targeting** — page rules (include / exclude URL patterns),
     visitor rules (new vs returning, session count, referrer),
     device rules (mobile vs desktop), time rules (business hours,
     date range).
   - **Frequency cap** — per session, per user, per day. Default to
     once-per-user for anything above a light banner.
   - **Copy:** headline (<10 words, grounded in a named quote or
     review line), subhead (1-2 lines expanding the value), form
     fields if any (run past `optimize-form` logic — minimum
     viable), CTA (action + outcome), dismissal copy ("No thanks"
     variants that don't shame the user), trust line if relevant
     (real policy only — no invented guarantees).
   - **Success metric** — the one thing that defines "working"
     (e.g. opt-in rate, CTR, or assisted conversion). Paired with
     a guardrail (e.g. bounce rate on pages where it fires).
7. **Spec the A/B plan if requested.** Hand off the test design to
   Growth & Paid's `design-ab-test`.
8. **Anti-patterns named.** Flag if the founder's current popup (or
   the draft) commits any: fires-before-earned, no-dismiss, forced
   scroll, double-popup (one overlay hiding another), mobile-full-
   screen-with-tiny-close, delayed-close-button, guilt-close
   ("No, I don't want to save money").
9. **Write** atomically to
   `popup-specs/{goal-slug}-{YYYY-MM-DD}.md` (`*.tmp` → rename).
10. **Append to `outputs.json`** — `{ id, type: "popup-spec",
    title, summary, path, status: "draft", createdAt, updatedAt }`.
11. **Summarize to user** — the trigger, the copy's source quote,
    the success metric, path to the spec.

## Never

- Fire before the user has engaged.
- Hide the close button or delay it past a couple seconds.
- Make the dismissal text shame the user.
- Invent scarcity or urgency not backed by policy.

## Outputs

- `popup-specs/{goal-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "popup-spec"`.
