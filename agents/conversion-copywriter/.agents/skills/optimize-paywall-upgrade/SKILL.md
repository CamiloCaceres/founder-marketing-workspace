---
name: optimize-paywall-upgrade
description: "Use when you say 'upgrade paywall' / 'pricing modal' / 'free-to-paid prompt' / 'trial expiration screen' — I rewrite the upgrade moment: headline, value stack, price anchoring, CTA, social proof. Grounded in why users actually upgrade (from your call insights). Writes to `paywall-audits/{slug}.md`."
integrations: [firecrawl]
---

# Optimize Paywall / Upgrade

The in-product moment where a free or trialing user is asked to
upgrade. The biggest killer is firing it before value has been
delivered. This skill audits timing first, then the copy.

## When to use

- "Audit my upgrade paywall"
- "Pricing modal rewrite"
- "Free-to-paid prompt — why don't users upgrade?"
- "Trial expiration screen"
- "Feature gate copy"

**Not for the public pricing page** — use `write-page-copy`.
**Not for pricing strategy** — flag it back to Head of Marketing.

## Steps

1. **Read positioning doc** at
   `../head-of-marketing/product-marketing-context.md`. If missing,
   tell the user to run Head of Marketing's `define-positioning`
   first and stop. Pricing stance + objection handling live there.
2. **Read `config/voice.md`.** If missing, ask ONE question naming
   the best modality (connected inbox via Composio > paste samples)
   and write before rewriting copy.
3. **Collect the current state.** Accept URL, screenshots, Loom, or
   paste of the current copy + plan structure. If URL, fetch via
   any Composio-connected scraper / rendering tool. If nothing
   shared, ask for screenshots or a paste and stop.
4. **Identify the type** — upgrade modal (mid-session), trial
   expiration screen, feature-gate, limit-reached (hit-the-ceiling),
   comparison paywall, usage-based overage prompt.
5. **Audit timing FIRST.** The most common failure: the paywall
   fires before the user has experienced value. For each paywall
   surface, determine:
   - Has the user hit the aha-moment before this fires? (Ask the
     user if unclear.)
   - Is the trigger behavioral (feature-attempt) or temporal
     (day-7 banner)?
   - Is the dismissal gentle or punishing?
   If timing is broken, call it out as the first issue and flag it
   — copy changes downstream can't save a mistimed paywall.
6. **Audit the content.** For each element:
   - **Headline** — does it name the value of upgrading, not the
     limitation of free?
   - **Plan comparison** — is the recommended plan visually obvious
     (one, not three equal choices)? Are plan names outcome-led
     (e.g. "Solo", "Team", "Business") rather than tier-numeric
     ("Tier 1, 2, 3")? Are feature differences the ones that matter
     to the ICP — not a 40-row matrix?
   - **Objection handling** — price, commitment, cancel policy,
     data portability, "what happens to my data if I don't upgrade".
     Pull the top objections from the positioning doc.
   - **Social proof** — logo row or quote placed close to the CTA,
     not at the bottom.
   - **Primary CTA** — action + outcome ("Unlock unlimited
     projects"), not "Upgrade now". Hand to `write-cta-variants`
     for deeper variants if needed.
   - **Dismissal pattern** — gentle ("Maybe later") vs. dark-pattern.
     Default: easy dismiss, named re-prompt window (e.g. "next
     session").
7. **For each change, pair Current → Proposed → Why** (one line).
8. **Flag compliance / trust issues.** Auto-renew disclosure, cancel
   policy visibility, free-trial-to-paid default behavior. If the
   copy makes a promise the policy doesn't back, flag it.
9. **Hand-off hooks.** If pricing itself is the issue (plans don't
   match how customers buy), kick to Head of Marketing — paywalling
   the wrong plan structure is a positioning problem, not copy. If
   a formal test on the winning variant is needed, name Growth &
   Paid's `design-ab-test`.
10. **Write** atomically to
    `paywall-audits/{surface-slug}-{YYYY-MM-DD}.md` (`*.tmp` →
    rename). Timing verdict at the top, then the change list.
11. **Update `config/paywall-prefs.json`** with the current plan
    structure summary (names, gates, price points if shared).
12. **Append to `outputs.json`** — `{ id, type: "paywall-audit",
    title, summary, path, status: "ready", createdAt, updatedAt }`.
13. **Summarize to user** — timing verdict, the single biggest
    copy change, path to the audit.

## Never

- Rewrite pricing or change plan names without surfacing it to the
  founder first — that's a positioning decision.
- Add fake urgency ("only 2 spots left") or invented scarcity.
- Promise a lift percentage — every rewrite is a hypothesis.
- Recommend dark-pattern dismissal (hidden close X, forced-scroll
  to dismiss).

## Outputs

- `paywall-audits/{surface-slug}-{YYYY-MM-DD}.md`
- `config/paywall-prefs.json` (first run)
- Appends to `outputs.json` with `type: "paywall-audit"`.
