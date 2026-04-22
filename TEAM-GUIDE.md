# Founder Marketing Team — Build Guide

**Workspace:** `founder-marketing-workspace/`
**Framing:** A solo founder downloads Houston and "hires" a marketing
department. No human team. The five agents below are everything they
need to run marketing ops end-to-end — from "what do we even say" to
"the welcome email converted 34% this week."

This document is the **team-level spec**. It sits above the per-agent
Gumloop research MDs (in `research/`). Build order, agent roster,
skill lists, and use cases are decided here. Each agent then gets its
own Gumloop research MD per `../gumloop-research-playbook.md`, then
its own build.

---

## Who we're building for

**The solo founder, week 0.** They have:

- A product (or close enough) and a domain.
- A landing page that is probably bad.
- Zero marketing hires, zero agency retainer, zero runway for either.
- A Stripe account, a Google Workspace, maybe HubSpot free, maybe a
  Substack, definitely a Twitter / LinkedIn account they barely post
  from.
- A vague story about what the product does, not a positioning.
- A nagging feeling that they should "be doing SEO" and "be running
  ads" but don't know where to start.

What they need is **not** another SaaS subscription that tells them
what to do. They need a team they can **chat with** that produces the
artifacts (positioning doc, blog post, ad brief, email copy) and
keeps them consistent across channels.

**The "done" line:** the founder can go from empty domain to
consistently running weekly marketing ops (publish, post, send,
experiment, measure) without a human marketer in the loop.

---

## The five agents

Five hireable roles, each self-contained but aware of the others via
a shared positioning doc. Err toward fewer, sharper agents: two
overlapping agents is worse than one clear one.

| # | Agent | Hired to… | Primary owner of |
|---|-------|-----------|------------------|
| 1 | **Head of Marketing** (`head-of-marketing`) | Own the story and coordinate launches | Positioning, ICP, competitor pulse, launch plans |
| 2 | **SEO & Content** (`seo-content`) | Run the inbound content engine | Site SEO, keyword map, blog posts, backlinks, AI-search visibility |
| 3 | **Growth & Paid** (`growth-paid`) | Run the acquisition / CRO loop | Paid campaigns, landing-page CRO, A/B tests, funnel analytics |
| 4 | **Lifecycle & Email** (`lifecycle-email`) | Run the email / activation layer | Welcome sequences, newsletters, lifecycle drips, churn-save emails |
| 5 | **Social & Community** (`social-community`) | Run the organic presence | LinkedIn / X content, social listening, podcast pitches, community touchpoints |

### Why this split (and why not the other splits)

- **Head of Marketing, not "Strategist."** Solo founders want to chat
  with a boss-shaped agent that owns positioning AND coordinates the
  other four. Strategist is too academic; the job is operational.
- **SEO & Content bundled, not split.** SEO without content is a
  spreadsheet. Content without SEO is a blog nobody reads. One agent
  that owns both loops is more useful than two that argue.
- **Growth & Paid bundled with CRO.** The feedback loop
  (ad → landing page → test → iterate) is one workflow. Splitting CRO
  from paid creates a ping-pong the founder has to referee.
- **Lifecycle & Email is its own agent.** Email drives the activation
  and retention numbers. Solo founders under-invest here because it
  doesn't feel urgent. Making it a named hire forces the question.
- **Social & Community is its own agent.** Organic social is high-freq
  small-artifact work (multiple posts/week). If Head of Marketing
  owned it, HoM would spend all day writing LinkedIn posts. Separate.
- **We do NOT have** a PR agent (too niche, low ROI pre-PMF), a
  Brand/Design agent (solo founder uses a template), or a BDR/Sales
  agent (out of scope — the SDR agent already exists and lives in
  `../sdr-agent/`).

---

## Shared state: the positioning doc

All five agents read **one** shared markdown file owned by the Head
of Marketing:

- Path (inside the workspace): `agents/head-of-marketing/product-marketing-context.md`
- Cross-agent read: `../head-of-marketing/product-marketing-context.md`

It contains: ICP (jobs/pains), positioning statement, category,
differentiators, brand voice, top 3 competitors, pricing stance,
current primary CTA.

**Rule baked into every non-HoM agent's `CLAUDE.md`:** "Before any
substantive output, read the positioning doc. If it's empty or stale,
say so and ask the founder to chat with the Head of Marketing
first." This was the single highest-leverage pattern in the existing
`../marketing-workspace/` build and we carry it forward.

---

## Per-agent skill lists

Each list is a first-pass. The per-agent Gumloop research MD will
tighten (split, merge, add coverage gaps) before build. Every agent
also gets `onboard-me` (standard across Houston role agents).

### 1. Head of Marketing — `head-of-marketing`

**Skills (7 + onboard-me):**

| Skill | Use case (README "First prompt") | Source templates |
|-------|----------------------------------|------------------|
| `define-positioning` | "Help me write a positioning statement for {product}" | Coverage gap (solo-founder essential) |
| `profile-icp` | "Build the ICP and persona doc for {product}" | Market Segmentation: Buyer Persona Pain Point Report |
| `track-competitors` | "Weekly competitor pulse — what did {X, Y, Z} ship and say?" | Competitive SEO Analyzer, Competitive Ad Intelligence, Competitive Conquest, Competitor Article Insights, Analyze competitors' recent content activity |
| `plan-launch` | "Plan the launch for {feature} over the next 2 weeks" | Go-to-Marketing Content Co-Pilot |
| `synthesize-research` | "Research {topic} and give me a brief I can hand to the SEO agent" | AI Research Agent with Automated Report Generation |
| `mine-sales-calls` | "Mine my last 10 sales calls for positioning signals and objections" | Sales Call Intelligence for B2B Product Marketing |
| `review-marketing-health` | "Give me the Monday marketing review across all channels" | Coverage gap |

**Owns:** `product-marketing-context.md`, `personas/{slug}.md`,
`competitor-briefs/{slug}.md`, `launches/{slug}.md`,
`research/{slug}.md`, `call-insights/{slug}.md`,
`reviews/{YYYY-MM-DD}.md`.

### 2. SEO & Content — `seo-content`

**Skills (8 + onboard-me):**

| Skill | Use case | Source templates |
|-------|----------|------------------|
| `audit-site-seo` | "Run an SEO audit of {domain}" | Blog SEO Audit and Optimizer Agent, Conduct an SEO audit with Semrush data, Go-to-Marketing Content Co-Pilot |
| `research-keywords` | "Find the keyword clusters we should own for {topic}" | Research SEO keywords with Semrush |
| `write-blog-post` | "Draft a blog post on {topic} targeting {keyword}" | Automated Blog Post Generation with OpenAI GPT-4 and Google Docs |
| `write-case-study` | "Draft a customer case study for {customer}" | Customer case study agent with Airtable |
| `repurpose-content` | "Turn {source: blog post / YouTube video / article} into {target: LinkedIn posts / X thread / blog draft / shareable insights}" | Turn Blog Post Into Shareable Insights, Turn a YouTube video into a blog post draft, Analyze and summarize a YouTube video, Turn Any Article Into 5 Viral LinkedIn Posts, Repurpose a competitor's blog post |
| `analyze-content-gap` | "Where is our content gap vs {competitor}?" | Content Gap Analysis - Strategic Marketing Workflow, Competitor Article Insights & Content Gap Analyzer |
| `find-backlinks` | "Who should we try to get backlinks from, and what's the pitch?" | Backlink Specialist, Webflow Linkbuilder |
| `audit-ai-search` | "Audit our visibility in AI search (ChatGPT, Perplexity, Gemini)" | GEO Audit Report, GEO Audit Flow - Automated Workflow |

**Owns:** `seo-audits/{slug}.md`, `keyword-map.md`,
`blog-posts/{slug}.md`, `case-studies/{slug}.md`,
`repurposed/{slug}.md`, `content-gap-analyses/{slug}.md`,
`backlink-targets.md`, `ai-search-audits/{YYYY-MM-DD}.md`.

### 3. Growth & Paid — `growth-paid`

**Skills (7 + onboard-me):**

| Skill | Use case | Source templates |
|-------|----------|------------------|
| `plan-paid-campaign` | "Plan a Google Ads search campaign for {keyword cluster}" | Google Ads Search Analyst, AI Google Ads Audit & Optimization Agent |
| `monitor-competitor-ads` | "What ads is {competitor} running this week?" | Competitive Ad Intelligence, Brand & Competitor Ad Analysis Generator |
| `generate-ad-copy` | "Draft 10 ad copy variants for {product} using real customer-review phrases" | Generate Ad Copy from Competitor Reviews |
| `critique-landing-page` | "Critique the landing page at {url}" | Coverage gap (solo-founder essential) |
| `design-ab-test` | "Design an A/B test for the pricing page headline" | Coverage gap |
| `setup-tracking` | "Spec the event tracking + UTM plan for sign-up → activation" | UTM Builder with Google Sheets Integration |
| `analyze-funnel` | "Give me the weekly funnel readout — where are we leaking?" | Coverage gap |

**Owns:** `campaigns/{slug}.md`, `competitor-ads/{slug}.md`,
`ad-copy/{slug}.md`, `cro-critiques/{url-slug}.md`,
`ab-tests/{slug}.md`, `tracking-plans/{slug}.md`,
`funnel-reviews/{YYYY-MM-DD}.md`.

### 4. Lifecycle & Email — `lifecycle-email`

**Skills (5 + onboard-me):**

| Skill | Use case | Source templates |
|-------|----------|------------------|
| `draft-welcome-sequence` | "Draft a 5-email welcome series for new signups" | Coverage gap (solo-founder essential) |
| `write-newsletter` | "Draft this week's newsletter — here's what shipped" | Beehiiv agent |
| `design-lifecycle-campaign` | "Design a re-activation drip for users who signed up but never activated" | Coverage gap |
| `draft-churn-save` | "Draft a save email for accounts that downgraded" | Coverage gap |
| `plan-product-announcement` | "Plan the email + in-app announcement for {feature}" | Go-to-Marketing Content Co-Pilot adjacent |

**Owns:** `sequences/{slug}.md`, `newsletters/{YYYY-MM-DD}.md`,
`drips/{slug}.md`, `saves/{slug}.md`, `announcements/{slug}.md`.

**Note:** Gumloop's "email" templates skew toward inbound triage
(support) and outbound prospecting (SDR), both out of scope here.
Lifecycle email is mostly coverage-gap territory — the Beehiiv
template is the only direct Gumloop signal, covering newsletters.

### 5. Social & Community — `social-community`

**Skills (7 + onboard-me):**

| Skill | Use case | Source templates |
|-------|----------|------------------|
| `draft-linkedin-post` | "Draft a LinkedIn post about {topic} in my voice" | Automated AI-Powered LinkedIn Research and Content Creator, LinkedIn Post Generator with Research Insights, LinkedIn Post Automation with Gmail and OpenAI, Technical Insights to LinkedIn Content Auto-Generator |
| `draft-x-thread` | "Draft an X thread on {topic}" | X Viral Script Finder, X (twitter) agent |
| `draft-community-reply` | "Draft a Reddit reply for {thread}" | Reddit Reply Agent |
| `plan-social-calendar` | "Plan this week's social content across LinkedIn / X / Reddit" | Social Media Content Copilot |
| `monitor-social-feed` | "Scan my X timeline / Reddit community / IG mentions and surface what's worth engaging with" | X Timeline Summarizer, Analyze top posts on a Reddit community, Instagram Post Sentiment Analysis & Reporting |
| `digest-linkedin-activity` | "Email me this week's LinkedIn digest — what my posts did, what my network posted" | Automated Weekly LinkedIn Post Digest Email |
| `pitch-podcast` | "Draft podcast outreach pitches for 5 shows our ICP listens to" | Coverage gap |

**Owns:** `posts/{slug}.md`, `threads/{slug}.md`,
`community-replies/{slug}.md`, `social-calendar.md`,
`feed-digests/{YYYY-MM-DD}.md`, `linkedin-digests/{YYYY-MM-DD}.md`,
`podcast-pitches/{slug}.md`.

---

## Gumloop → Houston mapping (from the full 68-template scrape)

Full Chrome scrape of `gumloop.com/templates/solutions/marketing`
on 2026-04-22 returned 68 unique templates (page badge says "65+").
Raw catalog lives at
`research/gumloop-marketing-catalog-2026-04-22.md`.
Per-agent research MDs will do deeper template-page fetches for
inputs/outputs specifics; this table is the **team-level
mapping**.

### Templates → skills (consolidated)

| Gumloop template | Agent | Skill | Verdict |
|------------------|-------|-------|---------|
| Competitive Ad Intelligence | `growth-paid` | `monitor-competitor-ads` | NEW-SKILL |
| Brand & Competitor Ad Analysis Generator | `growth-paid` | `monitor-competitor-ads` | ROLL-INTO |
| Generate Ad Copy from Competitor Reviews | `growth-paid` | `generate-ad-copy` | NEW-SKILL |
| Google Ads Search Analyst | `growth-paid` | `plan-paid-campaign` | NEW-SKILL |
| AI Google Ads Audit & Optimization Agent | `growth-paid` | `plan-paid-campaign` | ROLL-INTO |
| UTM Builder with Google Sheets Integration | `growth-paid` | `setup-tracking` | ROLL-INTO |
| Blog SEO Audit and Optimizer Agent | `seo-content` | `audit-site-seo` | NEW-SKILL |
| Conduct an SEO audit with Semrush data | `seo-content` | `audit-site-seo` | ROLL-INTO |
| Go-to-Marketing Content Co-Pilot | `seo-content` + `head-of-marketing` | `audit-site-seo` / `plan-launch` | SPLIT (audit side → SEO, launch-planning framing → HoM) |
| Research SEO keywords with Semrush | `seo-content` | `research-keywords` | NEW-SKILL |
| Automated Blog Post Generation with OpenAI GPT-4 and Google Docs | `seo-content` | `write-blog-post` | NEW-SKILL |
| Customer case study agent with Airtable | `seo-content` | `write-case-study` | NEW-SKILL |
| Turn Blog Post Into Shareable Insights | `seo-content` | `repurpose-content` | NEW-SKILL |
| Turn a YouTube video into a blog post draft | `seo-content` | `repurpose-content` | ROLL-INTO |
| Analyze and summarize a YouTube video | `seo-content` | `repurpose-content` | ROLL-INTO |
| Turn Any Article Into 5 Viral LinkedIn Posts | `seo-content` | `repurpose-content` | ROLL-INTO |
| Repurpose a competitor's blog post | `seo-content` | `repurpose-content` | ROLL-INTO |
| Content Gap Analysis - Strategic Marketing Workflow | `seo-content` | `analyze-content-gap` | NEW-SKILL |
| Competitor Article Insights & Content Gap Analyzer | `seo-content` | `analyze-content-gap` | ROLL-INTO |
| Backlink Specialist | `seo-content` | `find-backlinks` | NEW-SKILL |
| Webflow Linkbuilder | `seo-content` | `find-backlinks` | ROLL-INTO |
| GEO Audit Report | `seo-content` | `audit-ai-search` | NEW-SKILL |
| GEO Audit Flow - Automated Workflow | `seo-content` | `audit-ai-search` | ROLL-INTO |
| Competitive SEO Analyzer | `head-of-marketing` | `track-competitors` | ROLL-INTO |
| Competitive Conquest: Your Product vs. Giant | `head-of-marketing` | `track-competitors` | ROLL-INTO |
| Analyze competitors' recent content activity and generate an email report | `head-of-marketing` | `track-competitors` | ROLL-INTO |
| Market Segmentation: Buyer Persona Pain Point Report | `head-of-marketing` | `profile-icp` | NEW-SKILL |
| AI Research Agent with Automated Report Generation | `head-of-marketing` | `synthesize-research` | NEW-SKILL |
| Sales Call Intelligence for B2B Product Marketing | `head-of-marketing` | `mine-sales-calls` | NEW-SKILL |
| Beehiiv agent | `lifecycle-email` | `write-newsletter` | NEW-SKILL |
| Automated AI-Powered LinkedIn Research and Content Creator | `social-community` | `draft-linkedin-post` | NEW-SKILL |
| LinkedIn Post Generator with Research Insights | `social-community` | `draft-linkedin-post` | ROLL-INTO |
| LinkedIn Post Automation with Gmail and OpenAI | `social-community` | `draft-linkedin-post` | ROLL-INTO |
| Technical Insights to LinkedIn Content Auto-Generator | `social-community` | `draft-linkedin-post` | ROLL-INTO |
| X Viral Script Finder | `social-community` | `draft-x-thread` | NEW-SKILL |
| X (twitter) agent | `social-community` | `draft-x-thread` | ROLL-INTO |
| Reddit Reply Agent | `social-community` | `draft-community-reply` | NEW-SKILL |
| Social Media Content Copilot | `social-community` | `plan-social-calendar` | NEW-SKILL |
| X Timeline Summarizer | `social-community` | `monitor-social-feed` | NEW-SKILL |
| Analyze top posts on a Reddit community and get insights | `social-community` | `monitor-social-feed` | ROLL-INTO |
| Instagram Post Sentiment Analysis & Reporting | `social-community` | `monitor-social-feed` | ROLL-INTO |
| Automated Weekly LinkedIn Post Digest Email | `social-community` | `digest-linkedin-activity` | NEW-SKILL |

### Templates we skip (and why)

**SDR / Sales — belong to `../sdr-agent/`:**

| Template | SDR skill it fits |
|----------|--------------------|
| Scoring Distance Agent | `score-icp-fit` |
| LinkedIn Contact Enrichment with HubSpot and Slack | `enrich-contact` |
| Meeting Transcript Enrichment with Circleback and Airtable | `capture-call-notes` |
| Reference finder agent | `find-references` |
| Search-grounded Email | `draft-grounded-email` |
| LinkedIn URL Auto-Finder Using Email Address | `enrich-contact` adjacent |
| LinkedIn Comment Lead Compiler | prospecting |
| LinkedIn Profile Scraper | `enrich-contact` adjacent |
| Scrape a company's LinkedIn page (both variants) | `enrich-contact` adjacent |
| Google Maps Lead Finder | local-biz prospecting |
| Lead Scoring and Routing from Typeform to HubSpot | `score-icp-fit` |

**Support / Ops — out of scope for marketing:**

| Template | Reason |
|----------|--------|
| Automated email draft responses with AI | Inbound support — fits `../solo-support-workspace/`, not marketing. |
| Automated email triage | Support / inbox triage. |
| Automated AI approval flow using Agents | Generic workflow utility. |
| Automated Insight Extraction and Organization | Generic — too abstract to skill-ify. |
| Data Analyst Agent | Ops / analytics. |
| AI Data Analyst for Snowflake | BI — not a marketing workflow. |
| Talk to Google Doc | Utility — not a role skill. |
| Talk to Google Sheet | Utility. |
| Lana Linear | Linear-specific helper. |

**Creative / niche — skip for v1, note as extension:**

| Template | Reason |
|----------|--------|
| UGC Vetting Agent + TikTok UGC Vetting Agent | Admin workflow (reviewing UGC submissions). Niche; revisit if the founder runs a UGC program. |
| Research TikTok influencers and generate personalized outreach | Influencer outreach is niche for a solo founder at week 0. Revisit for creator-led products. |
| Generate YouTube Thumbnails with Nano Banana and GPT Models | Image generation — skip for v1; thumbnail design is usually Canva + human taste. |
| Retrieve social media accounts & Followers | Admin utility — no standalone skill value. |

### Coverage gaps (invented from role knowledge, not on Gumloop)

Solo founders need these on day one; Gumloop's catalog under-serves them:

- **Strategy foundation** — positioning statement, brand voice
  (HoM: `define-positioning`).
- **Weekly marketing health review** across all channels (HoM:
  `review-marketing-health`).
- **Landing-page CRO critique** — concrete, URL-in / teardown-out
  (`growth-paid: critique-landing-page`).
- **A/B test design** — hypothesis, variants, sample size, success
  metric (`growth-paid: design-ab-test`).
- **Funnel analysis** — weekly "where are we leaking" readout
  (`growth-paid: analyze-funnel`).
- **Entire lifecycle email surface** — welcome sequences, drip
  campaigns, churn-save, product announcements. Gumloop's email
  templates skew toward support/sales; lifecycle is almost entirely
  coverage gap. Beehiiv agent covers newsletter only.
- **Podcast pitch drafting** — high-leverage distribution for solo
  founders (`social-community: pitch-podcast`).

---

## Build order (recommended)

Don't build all five in parallel — the Head of Marketing ships first
because the other four read its `product-marketing-context.md`.

1. **Head of Marketing** first. Without positioning, the others
   produce bland output. Ship HoM, have the founder run
   `define-positioning` and `profile-icp`, lock the context doc.
2. **SEO & Content** second. Highest-leverage inbound work, longest
   time-to-value — start it early.
3. **Growth & Paid** third. Needs a live landing page (which ideally
   SEO & Content has helped sharpen).
4. **Lifecycle & Email** fourth. Needs signups flowing from Growth +
   SEO to be worth running.
5. **Social & Community** fifth. Highest frequency, lowest setup —
   safe to slot in whenever.

Each agent is built per the playbook:

1. Run `../gumloop-research-playbook.md` against the relevant Gumloop
   page(s) for that role. Output: `research/{agent-id}.md`.
2. USER CHECKPOINT on the research MD.
3. Build the agent per `../role-agents-workspace/role-agent-guide.md`,
   using the research MD's skills table as the skill list and the
   use-cases table as the README "First prompts" + CLAUDE.md "My
   skills" one-liners.

---

## Workspace conventions

- **Directory:** `founder-marketing-workspace/` (this dir).
- **Each agent is self-contained** — would work as a standalone
  install. Cross-agent reads are **only** for
  `product-marketing-context.md`, and each non-HoM CLAUDE.md handles
  the "file not found" case gracefully.
- **Outputs are markdown, not JSON.** Every skill writes a markdown
  artifact (blog post, email draft, competitor brief). A JSON index
  (`outputs.json`) at each agent root tracks `{id, title, type,
  createdAt, path}` for the dashboard.
- **Dashboard:** hand-crafted IIFE per agent, read-only, shows:
  (1) last N outputs, (2) key state (e.g. HoM shows positioning-doc
  status, SEO shows keyword-map coverage, Growth shows active
  campaigns). See `../houston/vertical-orchestrator-brief.md` "Field
  notes" for the IIFE + polling-fallback reality.
- **Data paths never go under `.houston/<agent>/`** — the Houston
  file watcher skips that prefix.

---

## What lives where (output tree after all five are built)

```
founder-marketing-workspace/
├── workspace.json
├── README.md                       # install + first-prompts
├── TEAM-GUIDE.md                   # this file
├── research/
│   ├── head-of-marketing.md
│   ├── seo-content.md
│   ├── growth-paid.md
│   ├── lifecycle-email.md
│   └── social-community.md
└── agents/
    ├── head-of-marketing/
    ├── seo-content/
    ├── growth-paid/
    ├── lifecycle-email/
    └── social-community/
```

---

## Hand-off to the per-agent phase

The next session (or the next sub-task in this session) does, **per
agent, one at a time starting with Head of Marketing**:

1. Start from the full catalog at
   `research/gumloop-marketing-catalog-2026-04-22.md` — it already
   contains the deep 68-template scrape (Chrome, JS-rendered). For
   each agent, identify the subset of templates mapped to its skills
   (see the mapping table in this guide) and do Chrome follow-up
   fetches on the individual template pages for inputs/outputs
   detail where useful.
2. Write `research/{agent-id}.md` per the playbook template.
3. USER CHECKPOINT.
4. Build the agent per `../role-agents-workspace/role-agent-guide.md`,
   writing files under `agents/{agent-id}/`.

The skill lists in this guide are the **starting draft**. Per-agent
research will add, remove, and rename — that's expected. When the
research MD and this guide disagree, the research MD wins (it's
newer and closer to evidence).

---

## Deltas vs. the existing `../marketing-workspace/`

The existing workspace ships 5 agents (Strategist, SEO, CRO,
Distribution, Revenue) built on Corey Haines' 36 MIT-licensed skills.
It's a fine reference and a superset of general marketing skills.

This workspace is **different on purpose**:

- **Framing is solo founder, not "a marketing team."** Skills are
  selected for a founder running everything alone, not for teams that
  can staff specialists.
- **Fewer, more operational skills per agent.** 5-7 skills per agent
  vs. the existing workspace's wider coverage. Deeper, not broader.
- **Skills derive from Gumloop signal (real user demand) + explicit
  coverage gaps**, not from a third-party curated set. Build
  happens per the Gumloop research playbook.
- **Head of Marketing, not Strategist.** Operational coordinator, not
  an isolated thinker. Owns the Monday review and the launch plan.
- **No CRO agent.** CRO lives inside Growth & Paid because the
  CRO/ad loop is one workflow for a solo founder.
- **Lifecycle & Email replaces Revenue.** Revenue was too broad;
  solo-founder-stage work is almost entirely lifecycle emails.

If we ship both, the existing workspace remains the "broad catalog"
option and `founder-marketing-workspace/` is the "solo founder
opinionated" option.

---

## Done criteria for this guide

- [x] Team roster locked (5 agents named).
- [x] Per-agent skill list drafted with use-case phrasings.
- [x] Full Gumloop marketing scrape (68 templates, Chrome) mapped
      or skipped, with verdict per template.
- [x] Coverage gaps named.
- [x] Build order decided.
- [ ] User reviews and approves this file.
- [ ] Per-agent research MDs exist in `research/` (blocked on user
      approval).
- [ ] Agents are built under `agents/` (blocked on research MDs).
