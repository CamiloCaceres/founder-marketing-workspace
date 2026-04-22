# Founder Marketing Workspace

A Houston workspace of **five AI marketing hires for solo founders**.
You chat with them; they produce markdown artifacts (positioning
docs, blog posts, ad briefs, email drafts, LinkedIn posts) and keep
them consistent across channels via one shared positioning doc.

Built for: the founder at week 0 with a landing page they're not
proud of, a vague story about what the product does, and no budget
for a marketing hire or agency.

---

## The five agents

| Agent | Hired to… | Good first prompt |
|-------|-----------|-------------------|
| **Head of Marketing** | Own the story, coordinate launches, weekly marketing review | "Help me write a positioning statement for {product}" |
| **SEO & Content** | Run the inbound content engine — blog, SEO, case studies, repurposing | "Run an SEO audit of {domain}" |
| **Growth & Paid** | Paid campaigns, landing-page CRO, A/B tests, funnel review | "Critique the landing page at {url}" |
| **Lifecycle & Email** | Welcome sequences, newsletters, lifecycle drips, churn-save | "Draft a 5-email welcome series for new signups" |
| **Social & Community** | LinkedIn / X / Reddit organic presence, social calendar, podcast pitches | "Draft a LinkedIn post about {topic} in my voice" |

---

## Shared state — the positioning doc

The **Head of Marketing** owns a single source-of-truth document:
`agents/head-of-marketing/product-marketing-context.md`.

The other four agents read it (via `../head-of-marketing/product-marketing-context.md`)
before any substantive output. Write it once by chatting with the
Head of Marketing; every other agent stays on-brand automatically.

If the doc is missing, a non-HoM agent will say so and ask you to
spend 5 minutes with the Head of Marketing first.

---

## Install

1. Open Houston.
2. Settings → Add workspace from GitHub → paste this repo URL.
3. Houston installs all 5 agents as one workspace.
4. Open the **Head of Marketing**, click the "Onboard me" activity
   card, send a message — 3 questions, ~90 seconds.
5. Ask the Head of Marketing to draft your positioning doc.
6. Now every other agent is on-brand. Start chatting with them.

---

## Suggested "first week" of founder marketing ops

- **Monday, with Head of Marketing** — positioning, ICP, competitor list.
- **Tuesday, with SEO & Content** — run a site audit + a keyword map.
- **Wednesday, with Growth & Paid** — landing-page critique + a tracking plan.
- **Thursday, with Lifecycle & Email** — draft the welcome sequence.
- **Friday, with Social & Community** — plan next week's social calendar.
- **Any day** — ask Head of Marketing for the Monday review across
  all channels.

---

## Conventions

- **Chat-first.** Dashboards are read-only — they show what each agent
  has produced. All actions start with you chatting.
- **Markdown outputs.** Every artifact is a markdown file you can
  open, edit, version, or paste into your tools.
- **Composio is the only transport.** Any connected app (Gmail,
  LinkedIn, Webflow, Semrush, Notion, etc.) is reached via Composio.
  If a connection is missing, the agent tells you which category to
  link and stops.
- **Standalone-capable.** Each agent would work as a standalone
  install if pulled out — cross-agent reads are limited to the
  shared positioning doc.

---

## Attribution & context

The team roster and skill set were derived from a Chrome scrape of
Gumloop's marketing templates (68 templates as of 2026-04-22) plus
solo-founder coverage gaps. See `TEAM-GUIDE.md` for the design
rationale and `research/` for the source catalog.

A separate `../marketing-workspace/` exists and ships Corey Haines'
36 MIT-licensed marketing skills across a different 5-agent split
(Strategist / SEO / CRO / Distribution / Revenue). That workspace is
the broad catalog; this workspace is the opinionated solo-founder cut.
