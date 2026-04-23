# Conversion Copywriter — Build Research

**Agent:** `conversion-copywriter`
**Workspace:** `founder-marketing-workspace/`
**Built:** 2026-04-23
**Source:** adapted from `marketing-workspace/agents/cro/` (the
Corey-Haines-style CRO agent that didn't port into the solo-founder
vertical).

---

## Why this agent exists

The new `founder-marketing-workspace/` intentionally merged CRO into
`growth-paid` on the theory that "the ad → landing-page → test loop
is one workflow" (see `TEAM-GUIDE.md` → "Why this split"). That holds
for **campaign-level** CRO (landing-page teardowns from a paid lens,
A/B test design). But the older `marketing-workspace/` had a dedicated
CRO agent with 8 skills covering **copy craft + surface-specific
optimization** that didn't survive the merge:

- Copywriting (page-level)
- Copy-editing (line-level polish)
- Page CRO (full-page teardown)
- Signup-flow CRO (click → account creation)
- Onboarding CRO (post-signup → aha)
- Form CRO (non-signup forms)
- Popup CRO (modals, banners, interrupts)
- Paywall / upgrade CRO (in-product upgrade moments)
- A/B test setup (survived — lives in growth-paid as `design-ab-test`)

Only `critique-landing-page` + `design-ab-test` made it to
`growth-paid`. The rest is a gap the solo founder absolutely feels on
week 0 ("my landing page isn't proud of", "my signup flow leaks",
"my paywall doesn't work") but has nowhere to take it.

**Conversion Copywriter fills that gap** without stepping on
growth-paid's campaign-lane. Two agents, two lanes.

---

## Scope decisions vs. `growth-paid`

The risk with this agent is territory creep. Here's where I drew
lines, and why.

| Territory | Conversion Copywriter | Growth & Paid |
|-----------|------------------------|---------------|
| **Landing-page teardown** (scored 6-dimension CRO audit from a paid-acquisition lens) | NO | YES (`critique-landing-page`) |
| **Full page rewrite** (headline + body + CTA, paired Current → Proposed → Why) | YES (`write-page-copy`) | NO |
| **A/B test design** (hypothesis, MDE, sample size, go/no-go) | NO | YES (`design-ab-test`) |
| **Headline variants** (10 grounded in quotes) | YES (`write-headline-variants`) | NO — but `generate-ad-copy` produces ad-specific headlines (10 variants + creative concepts) |
| **CTA variants** for on-site buttons | YES (`write-cta-variants`) | NO |
| **Ad copy** (platform-constrained RSA / Meta / LinkedIn headlines + descriptions) | NO | YES (`generate-ad-copy`) |
| **Form CRO** (lead / demo / contact / checkout) | YES (`optimize-form`) | NO |
| **Signup-flow CRO** (registration → account creation) | YES (`optimize-signup-flow`) | NO |
| **Onboarding copy** (post-signup in-product) | YES (`optimize-onboarding-copy`) | NO |
| **Paywall / upgrade** (in-product upgrade moments) | YES (`optimize-paywall-upgrade`) | NO |
| **Popups / modals / banners** (on-site interrupts) | YES (`optimize-popup`) | NO |
| **Event tracking + UTM** | NO | YES (`setup-tracking`) |
| **Funnel analytics** | NO | YES (`analyze-funnel`) |
| **Competitor ad intel** | NO | YES (`monitor-competitor-ads`) |

**Rule of thumb baked into Conversion Copywriter's CLAUDE.md:**
> *"Scored teardowns and A/B test specs → Growth & Paid. Rewriting
> the page, headline / CTA variants, form / onboarding / paywall /
> popup copy → me."*

Every skill that touches the landing-page surface explicitly hands
off to Growth & Paid for scored audits and formal test design. And
vice-versa — Growth & Paid's `critique-landing-page` already flags
when the fix is a copy problem (which is when the founder should run
this agent's `write-page-copy` or `write-headline-variants`).

### Cases where both agents could legitimately help

- **"My landing page is leaking."** Start with Growth & Paid's
  `critique-landing-page` for the scored 6-dimension teardown. Take
  the flagged copy fixes to Conversion Copywriter's `write-page-copy`
  / `write-headline-variants` / `write-cta-variants`.
- **"Should I test this headline?"** Conversion Copywriter drafts the
  variants; Growth & Paid's `design-ab-test` specs the test. The
  hand-off is explicit in both SKILL.md files.
- **"My signup flow is long."** Both agents should read the positioning
  doc. Conversion Copywriter reviews step count + rewrites copy;
  Growth & Paid specs the test for a combined step-reduction
  experiment. The `optimize-signup-flow` skill names
  `design-ab-test` as the hand-off for formal test design.

---

## Skills shipped (10 + onboard-me)

| Skill | Rationale |
|-------|-----------|
| `onboard-me` | Standard Houston onboarding — 3 questions + scope+modality preamble. Topics: primary page + conversion event, voice, leakiest surface. The leakiest-surface answer routes the hand-off to the right first skill. |
| `write-page-copy` | Full page rewrite. Absorbs the `copywriting` skill from the source CRO agent but scoped to *page-level* copy (homepage / landing / pricing / about / feature). Ad copy stays in `growth-paid`; email stays in `lifecycle-email`. |
| `edit-copy` | Multi-sweep line edit — clarity, voice, specificity, length, CTAs. Adapted from the source `copy-editing` skill's "seven sweeps" pattern, compressed to the five that actually matter for a solo founder. |
| `write-headline-variants` | 10 headlines + subheads, each grounded in a verbatim source quote or positioning claim. Mirrors Growth & Paid's `generate-ad-copy` discipline ("no invented phrases") applied to on-site headlines. Top-3 ranked to test. |
| `write-cta-variants` | 5-7 button variants, each paired with the objection it answers. High-leverage surface, low effort per variant — deserves its own skill, not a sub-step. Optional from the brief; shipped because it's a distinct, recurring ask. |
| `optimize-form` | Field-by-field audit (keep / drop / defer / make-optional / compliance-required). Absorbs the source `form-cro` skill, renamed from the tool-nounish source to the verb-led `optimize-form`. Non-signup forms only. |
| `optimize-signup-flow` | Step-by-step review of the signup journey. Produces full replacement copy, not just a suggestion list. Signup ≠ lead capture ≠ in-app onboarding — three separate skills. Adapted from the source `signup-flow-cro`. |
| `optimize-onboarding-copy` | In-product copy from welcome screen to aha. Renamed from source `onboarding-cro` to make the "copy not flow architecture" scope explicit — a solo founder running this wants copy lines, not a product-management lecture. Email sequences explicitly hand off to `lifecycle-email`. |
| `optimize-paywall-upgrade` | In-product upgrade moments — NOT the public pricing page (that's `write-page-copy`). Timing audit first, then copy. Absorbs source `paywall-upgrade-cro`. |
| `optimize-popup` | Full popup / modal / banner / sticky-bar spec — trigger, targeting, copy, dismissal, frequency cap, success metric. Absorbs source `popup-cro`. |

### Skills from the source dropped / merged

| Source skill | Decision | Rationale |
|--------------|----------|-----------|
| `ab-test-setup` | SKIP | Already lives in `growth-paid` as `design-ab-test`. Don't duplicate — every skill that would invoke A/B testing names the growth-paid skill as the hand-off. |
| `page-cro` (scored 6-dimension teardown) | SKIP | Already lives in `growth-paid` as `critique-landing-page`. Conversion Copywriter's `write-page-copy` is the copy-rewrite pair to that scored teardown — complementary, not duplicate. |

Everything else from the source CRO agent's skill list either landed
(page rewrite, copy-editing, form, signup-flow, onboarding, paywall,
popup) or got renamed to fit the verb-led pattern (e.g. `form-cro` →
`optimize-form`, `paywall-upgrade-cro` → `optimize-paywall-upgrade`).

### New skills invented beyond the source

- `write-headline-variants` — the source's `copywriting` skill covered
  "headlines" as a sub-step. Making it a dedicated skill means the
  founder can ask for exactly this ("10 headlines — each citing the
  quote") without also dragging the rest of the page rewrite along.
  High recurring demand; low coupling.
- `write-cta-variants` — same logic. "Better CTAs" is a distinct
  founder-ask with its own evidence path (objection-focused, not
  quote-focused). Optional in the brief; shipped because it earned
  its slot.

---

## Coordinator pattern compliance

Every substantive skill opens with:
> "Read `../head-of-marketing/product-marketing-context.md`. If
> missing or empty, tell the user to run the Head of Marketing's
> `define-positioning` first and stop."

Every **drafting or editing** skill additionally reads
`config/voice.md` — the positioning doc gives the substance
(ICP / JTBD / pains / objections / positioning line); voice.md gives
the sound (so the copy is the founder's voice, not a chatbot's).

Confirmed the exact shared-doc filename by reading
`agents/head-of-marketing/CLAUDE.md` → "I own
`product-marketing-context.md`."

---

## Hard-rule compliance audit

| Rule | Status |
|------|--------|
| `onboard-me` has exactly 3 questions + scope+modality preamble | Yes (primary page + conversion · voice · leakiest surface) |
| No hardcoded tool names in skills | Yes — "any Composio-connected scraper", "any Composio-connected review-scrape", discover via `composio search` |
| No hardcoded thresholds | Yes |
| Every SKILL.md description starts with "Use when…" | Yes |
| Hard nos in CLAUDE.md (never publish, never invent, never write under `.houston/<agent>/`) | Yes |
| Atomic writes documented in every skill | Yes (`*.tmp` → rename) |
| Records have `id` (uuid v4), `createdAt`, `updatedAt` | Yes |
| `CLAUDE.md` under 100 lines | Yes (100 lines on the nose) |
| First tab id is `overview` | Yes |
| `agentSeeds` includes `outputs.json` + `.houston/activity.json` | Yes |
| Every `useCase` has `title`, `blurb`, `prompt`, `fullPrompt`, `category`, `outcome`, `skill` (+ `tool` where relevant) | Yes (9 use cases, all 4 prompt fields populated) |
| `icon.png` present | Yes (copied from growth-paid as per brief — no better option yet) |

---

## What I deliberately did NOT do

- **Did not modify `workspace.json`** — the orchestrator adds new
  agents to it separately.
- **Did not run `scripts/generate_bundles.py`** — the orchestrator
  handles bundle generation.
- **Did not author `bundle.js`** — generated by the bundle script.
- **Did not touch other agents** in this workspace or any other.
- **Did not fold orphan source skills into existing agents** — out of
  scope for this dispatch.
- **Did not commit.**

---

## Suggested follow-ups (for a separate session)

1. Run `scripts/generate_bundles.py` to produce
   `agents/conversion-copywriter/bundle.js` with the 9 use cases
   as tiles.
2. Add `conversion-copywriter` to `workspace.json`.
3. Confirm the growth-paid `critique-landing-page` + `design-ab-test`
   hand-off language now correctly routes copy work to Conversion
   Copywriter (currently they hand to each other).
4. Consider whether Head of Marketing's `plan-launch` should include
   Conversion Copywriter as one of the owners for launch-page copy
   tasks.
5. Design a custom `icon.png` (currently the growth-paid icon is
   reused as a placeholder).
