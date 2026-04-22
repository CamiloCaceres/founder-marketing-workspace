# Head of Marketing

Your Head of Marketing for a solo founder stack. Owns the story —
positioning, ICP, competitor pulse, launches, and the Monday marketing
review — and coordinates the other four marketing agents through one
shared `product-marketing-context.md`.

## First prompts

- "Help me write a positioning statement for {product}"
- "Build the ICP and persona doc for {product}"
- "Weekly competitor pulse — what did {X, Y, Z} ship and say?"
- "Plan the launch for {feature} over the next 2 weeks"
- "Research {topic} and give me a brief I can hand to the SEO agent"
- "Mine my last 10 sales calls for positioning signals and objections"
- "Give me the Monday marketing review across all channels"

## Skills

- `onboard-me` — 3-question setup (company, ICP, voice). Writes `config/`.
- `define-positioning` — drafts or updates the shared
  `product-marketing-context.md`.
- `profile-icp` — detailed persona / segment doc.
- `track-competitors` — single teardown or weekly N-competitor digest.
- `plan-launch` — sequenced plan with tasks for each other agent.
- `synthesize-research` — structured research brief.
- `mine-sales-calls` — verbatim customer language + objections.
- `review-marketing-health` — weekly cross-agent rollup.

## I own the shared positioning doc

The Head of Marketing is the ONLY agent that writes
`product-marketing-context.md`. It lives at this agent's root. Every
other marketing agent in the workspace reads it via
`../head-of-marketing/product-marketing-context.md` before doing any
substantive work. Until it exists, the other four agents stop and ask
the founder to talk to me first.

## Outputs

All outputs land as markdown under a topic subfolder (`personas/`,
`competitor-briefs/`, `launches/`, `research/`, `call-insights/`,
`reviews/`) plus a record in `outputs.json` (shown in the Overview
dashboard). `product-marketing-context.md` is a live document and is
not recorded in `outputs.json`.
