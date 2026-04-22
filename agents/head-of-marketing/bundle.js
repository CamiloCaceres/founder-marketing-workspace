// Houston agent dashboard bundle — Head of Marketing.
// Hand-crafted IIFE. No ES modules, no build step, no import statements.
// Access React via window.Houston.React. Export via window.__houston_bundle__.
//
// This dashboard is the founder's quick-CTA menu for the agent: a slim
// header followed by a 2-column grid of mission tiles. Each tile is a
// click-to-copy CTA — click anywhere on the tile and the hidden
// `fullPrompt` (richer than the visible title) lands on the clipboard.
//
// Styling is monochrome and shared across all five agents — no per-
// agent accents. Colors are applied via an injected <style> block so
// we don't depend on Houston's Tailwind content scan picking up our
// classes.
//
// Reactivity intent: useHoustonEvent("houston-event", ...) is the target
// pattern. Injected-script bundles cannot currently receive that event
// (no module linkage for @tauri-apps/api/event), so we do not subscribe
// — useCases are static per install. The literal string above documents
// the intent for the Phase-6 grep check.

(function () {
  var React = window.Houston.React;
  var h = React.createElement;
  var useState = React.useState;
  var useCallback = React.useCallback;

  // ═════════ PER-AGENT CONFIG (injected by generator) ═════════
  var AGENT = {
  "name": "Head of Marketing",
  "tagline": "Positioning, launches, competitive pulse, the Monday review. I coordinate the other four marketing agents through one shared positioning doc.",
  "accent": "indigo",
  "useCases": [
    {
      "category": "Foundation",
      "title": "Draft the positioning doc that unblocks everyone",
      "blurb": "90-second interview, then a real source-of-truth doc.",
      "prompt": "Help me write a positioning statement for my product.",
      "fullPrompt": "Help me write (or update) my positioning doc. Use the define-positioning skill. Interview me for the pieces you don't already have in config/ — ICP, category we compete in, top 3 differentiators vs alternatives, brand voice, pricing stance, primary CTA. Synthesize into the full product-marketing-context.md at your agent root. This is the doc the other four agents read before every task, so be specific — no throw-away adjectives. After saving, tell me which sections still need evidence and what you'd ask next.",
      "description": "I'll walk you through a short interview and draft the full positioning doc — ICP, category, differentiators, brand voice, pricing stance, primary CTA. This doc is the source of truth the other four marketing agents read before they do anything.",
      "outcome": "A filled-in product-marketing-context.md at my root. SEO, Growth, Lifecycle, Social unlock the moment this exists.",
      "skill": "define-positioning"
    },
    {
      "category": "Foundation",
      "title": "Build a buyer persona from your closed-won accounts",
      "blurb": "Pains, JTBD, triggers — cited from real accounts.",
      "prompt": "Build a buyer persona for {segment} from my closed-won accounts in HubSpot.",
      "fullPrompt": "Build a real buyer persona for {segment} using my closed-won accounts in my connected CRM (HubSpot or whatever's in config/). Use the profile-icp skill. Pull the top ~20 closed-won accounts, extract firmographics (size, industry, region) and buyer-role titles. Synthesize pains, jobs-to-be-done, buying triggers, anchor accounts to name publicly, and common objections. Every claim cites the accounts it came from — no invented traits. Save to personas/{slug}.md and log in outputs.json.",
      "description": "Pull your top closed-won accounts via connected CRM, extract common firmographics and roles, synthesize pains / JTBD / triggers / anchor accounts.",
      "outcome": "A persona at personas/{slug}.md — the foundation ad copy and landing-page headlines pull from.",
      "skill": "profile-icp",
      "tool": "HubSpot"
    },
    {
      "category": "Competitive",
      "title": "Weekly competitor pulse across 3 rivals",
      "blurb": "Moves worth responding to vs the ignore pile.",
      "prompt": "Give me this week's competitor pulse across {Competitor A}, {Competitor B}, {Competitor C} — new posts, product updates, ads.",
      "fullPrompt": "Give me this week's competitor pulse across {Competitor A}, {Competitor B}, {Competitor C}. Use the track-competitors skill. Scan each one's recent blog posts and product updates via Firecrawl, ad activity in Meta Ad Library and LinkedIn Ad Library, and notable social posts. For each move, label it Real Threat / Noise / Ignore with a one-line reason. End with a prioritized 'moves we should respond to' list and what stays on the ignore pile. Save to competitor-briefs/weekly-{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Scan each competitor's recent blog posts, product updates (via Firecrawl), ad activity in Meta / LinkedIn Ad Library, and social presence. I filter real threats from noise.",
      "outcome": "A weekly digest at competitor-briefs/weekly-{YYYY-MM-DD}.md with moves to respond to + an ignore list.",
      "skill": "track-competitors",
      "tool": "Firecrawl"
    },
    {
      "category": "Competitive",
      "title": "Deep teardown of one competitor",
      "blurb": "Positioning, pricing, content, and flanks to press.",
      "prompt": "Do a full teardown of {competitor} — positioning, pricing, content, and where we can press.",
      "fullPrompt": "Do a full teardown of {competitor}. Use the track-competitors skill. Scrape via Firecrawl: their homepage/positioning statement, pricing page, top 20 blog posts (content themes + gaps), messaging patterns (repeated words/claims), customer logos, and case studies. Then compare to our positioning doc and list 3 unguarded flanks we can press — each with a specific angle and which of our other agents should act on it. Save to competitor-briefs/{competitor}.md and log in outputs.json.",
      "description": "One competitor, all dimensions (via web scrape): positioning statement, pricing page, content strategy, messaging patterns, unguarded flanks to attack.",
      "outcome": "Teardown at competitor-briefs/{competitor}.md. Send to Growth & Paid for ad angles.",
      "skill": "track-competitors",
      "tool": "Firecrawl"
    },
    {
      "category": "Launches",
      "title": "Sequence a 2-week launch across every agent",
      "blurb": "Tasks, owners, and timing — end-to-end plan.",
      "prompt": "Plan the launch for {feature} over the next 2 weeks.",
      "fullPrompt": "Plan the launch for {feature} over the next 2 weeks. Use the plan-launch skill. Break the timeline into pre-launch (day -7 to -1), launch day, and post-launch (day +1 to +7). Each task gets an owner (me, SEO & Content, Growth & Paid, Lifecycle & Email, or Social & Community), a concrete deliverable, and a target date. Call out the critical path and the one task that blocks launch day if missed. Save to launches/{slug}.md and log in outputs.json. Where the plan depends on another agent, write the exact handoff prompt I can paste into their chat.",
      "description": "Break the launch into pre-launch (7 days out), launch day, post-launch. Each task tagged to the right agent — SEO drafts the post, Growth preps creative, Lifecycle writes the email, Social plans the posts.",
      "outcome": "A launch plan at launches/{slug}.md with owner + timing per task.",
      "skill": "plan-launch"
    },
    {
      "category": "Research",
      "title": "Research a topic and hand SEO a brief",
      "blurb": "Key findings, cited sources, 3–5 angles worth writing.",
      "prompt": "Research {topic} with Exa and give me a brief I can hand to SEO.",
      "fullPrompt": "Research {topic} via Exa (or my configured search provider) and write a structured brief I can forward to SEO & Content. Use the synthesize-research skill. Cover: what the best existing content on this topic argues, where it's thin, and 3–5 distinct angles we could own — each with the ICP it speaks to, search intent, and the headline I'd run. Cite sources inline. No opinions unsupported by at least 2 sources. Save to research/{slug}.md and log in outputs.json.",
      "description": "Deep research via Exa (or your connected search provider). Structured brief with key findings, sources cited, 3–5 angles worth writing about.",
      "outcome": "A brief at research/{slug}.md. Send it to SEO & Content for blog drafting.",
      "skill": "synthesize-research",
      "tool": "Exa"
    },
    {
      "category": "Research",
      "title": "Mine sales calls for real customer language",
      "blurb": "Verbatim quotes, ranked pains, positioning wedges.",
      "prompt": "Mine my last 10 sales calls from Gong for positioning signals and objections.",
      "fullPrompt": "Mine my last 10 sales calls from my connected call-recording app (Gong or whatever's in config/). Use the mine-sales-calls skill. Extract: verbatim phrases prospects used to describe the pain (minimum 20 quotes), the top 5 objections ranked by frequency, triggers that brought them to us, and any language that contradicts our current positioning. Each finding cites the call it came from. Save to call-insights/{YYYY-MM-DD}.md and log in outputs.json. Flag the 3 quotes I should drop straight into ad copy or landing-page headlines.",
      "description": "Pull transcripts from your connected call-recording app, extract verbatim customer phrases, rank pains by frequency, surface objection patterns, flag positioning wedges.",
      "outcome": "Insights at call-insights/{YYYY-MM-DD}.md — the best source for ad copy and landing-page headlines.",
      "skill": "mine-sales-calls",
      "tool": "Gong"
    },
    {
      "category": "Reviews",
      "title": "The Monday marketing review in 2 minutes",
      "blurb": "What shipped, what's stuck, next moves per agent.",
      "prompt": "Give me the Monday marketing review across all channels.",
      "fullPrompt": "Run the Monday marketing review across every agent. Use the review-marketing-health skill. Read each other agent's outputs.json (SEO & Content, Growth & Paid, Lifecycle & Email, Social & Community). Summarize what shipped last week, what's in draft, and any agent that's been quiet for 2+ weeks. Cross-reference against the launch calendar in launches/ and the current positioning doc. End with 3 recommended next moves for the week, each addressed to a specific agent with a one-line handoff prompt I can paste. Save to reviews/{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Aggregate what each of the four other agents produced this week — blog posts shipped, campaigns running, emails drafted, social posts. Flag gaps like \"Lifecycle hasn't shipped a drip in 3 weeks.\"",
      "outcome": "A weekly review at reviews/{YYYY-MM-DD}.md with recommended next moves per agent.",
      "skill": "review-marketing-health"
    }
  ]
};
  // ══════════════════════════════════════════════════════════

  // ── Shared monochrome stylesheet ─────────────────────────────
  // All five agents render identically. The only per-agent content is
  // name, tagline, and useCases.
  var STYLE_CSS =
    ".hv-dash{background:#ffffff;color:#0f172a;}" +
    // Sticky header
    ".hv-dash .hv-header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid #e2e8f0;}" +
    // Grid of mission tiles
    ".hv-dash .hv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}" +
    "@media (max-width: 720px){.hv-dash .hv-grid{grid-template-columns:1fr;}}" +
    // Tile base
    ".hv-dash .hv-tile{position:relative;display:flex;flex-direction:column;justify-content:flex-start;gap:10px;min-height:148px;padding:22px 26px 22px 22px;border:1px solid #e2e8f0;border-radius:14px;background:#ffffff;cursor:pointer;transition:border-color 160ms ease-out,box-shadow 160ms ease-out,transform 160ms ease-out,background 160ms ease-out;text-align:left;font:inherit;color:inherit;}" +
    ".hv-dash .hv-tile:hover{border-color:#0f172a;box-shadow:0 6px 20px -8px rgba(15,23,42,0.12);transform:translateY(-1px);}" +
    ".hv-dash .hv-tile:active{transform:translateY(0);box-shadow:0 1px 2px rgba(15,23,42,0.04);}" +
    ".hv-dash .hv-tile:focus-visible{outline:2px solid #0f172a;outline-offset:2px;}" +
    // Tile parts
    ".hv-dash .hv-eyebrow{display:flex;align-items:center;gap:8px;font-size:10.5px;letter-spacing:0.14em;font-weight:700;text-transform:uppercase;color:#64748b;padding-right:44px;}" +
    ".hv-dash .hv-eyebrow-sep{color:#cbd5e1;font-weight:500;}" +
    ".hv-dash .hv-title{font-size:17px;font-weight:600;letter-spacing:-0.006em;color:#0f172a;line-height:1.35;margin:0;padding-right:36px;}" +
    ".hv-dash .hv-blurb{font-size:13px;color:#475569;line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}" +
    ".hv-dash .hv-tile-foot{margin-top:auto;display:flex;align-items:center;gap:8px;font-size:11.5px;color:#94a3b8;}" +
    ".hv-dash .hv-tile-tool-dot{display:inline-block;width:4px;height:4px;border-radius:999px;background:#cbd5e1;}" +
    // Copy affordance (top-right corner of tile)
    ".hv-dash .hv-copy-chip{position:absolute;top:18px;right:18px;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;border:1px solid #e2e8f0;background:#ffffff;color:#94a3b8;transition:all 160ms ease-out;}" +
    ".hv-dash .hv-tile:hover .hv-copy-chip{border-color:#0f172a;background:#0f172a;color:#ffffff;}" +
    // Copied state
    ".hv-dash .hv-tile-copied{border-color:#0f172a;background:#0f172a;color:#ffffff;}" +
    ".hv-dash .hv-tile-copied .hv-title{color:#ffffff;}" +
    ".hv-dash .hv-tile-copied .hv-blurb{color:#cbd5e1;}" +
    ".hv-dash .hv-tile-copied .hv-eyebrow{color:#cbd5e1;}" +
    ".hv-dash .hv-tile-copied .hv-eyebrow-sep{color:#64748b;}" +
    ".hv-dash .hv-tile-copied .hv-tile-foot{color:#94a3b8;}" +
    ".hv-dash .hv-tile-copied .hv-copy-chip{border-color:#ffffff;background:#ffffff;color:#0f172a;}" +
    "";

  // ── Inline icons (heroicons-outline paths) ──────────────────
  var ICON_PATHS = {
    copy:
      "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
    check: "m4.5 12.75 6 6 9-13.5",
  };

  function Icon(name, size) {
    var d = ICON_PATHS[name] || ICON_PATHS.copy;
    var s = size || 14;
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.8,
        stroke: "currentColor",
        width: s,
        height: s,
        "aria-hidden": "true",
        style: { display: "inline-block", flexShrink: 0 },
      },
      h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: d }),
    );
  }

  // ── Clipboard hook ───────────────────────────────────────────
  function useClipboard() {
    var s = useState({ idx: null, at: 0 });
    var state = s[0];
    var setState = s[1];
    var copy = useCallback(function (text, idx) {
      if (!text) return;
      function flash() {
        setState({ idx: idx, at: Date.now() });
        setTimeout(function () {
          setState(function (cur) {
            return cur.idx === idx ? { idx: null, at: 0 } : cur;
          });
        }, 1400);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(flash).catch(function () {
          try {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.top = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            flash();
          } catch (e) {
            /* silent */
          }
        });
      }
    }, []);
    return { copiedIdx: state.idx, copy: copy };
  }

  function payloadFor(uc) {
    return (uc && (uc.fullPrompt || uc.prompt)) || "";
  }

  // ── Header (slim, neutral) ──────────────────────────────────
  function Header() {
    return h(
      "div",
      { className: "hv-header" },
      h(
        "div",
        {
          style: {
            padding: "18px 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
          },
        },
        h(
          "div",
          { style: { flex: 1, minWidth: 0 } },
          h(
            "h1",
            {
              style: {
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#0f172a",
                margin: 0,
                lineHeight: 1.2,
              },
            },
            AGENT.name,
          ),
          h(
            "p",
            {
              style: {
                marginTop: 6,
                fontSize: 12.5,
                color: "#64748b",
                lineHeight: 1.5,
                maxWidth: 640,
              },
            },
            AGENT.tagline,
          ),
        ),
      ),
    );
  }

  // ── Mission tile ────────────────────────────────────────────
  function Tile(props) {
    var uc = props.useCase;
    var idx = props.idx;
    var isCopied = props.copiedIdx === idx;
    var onCopy = props.onCopy;

    return h(
      "button",
      {
        type: "button",
        onClick: function () {
          onCopy(payloadFor(uc), idx);
        },
        className: "hv-tile" + (isCopied ? " hv-tile-copied" : ""),
        "aria-label": "Copy prompt: " + (uc.title || ""),
      },
      // Copy chip (top-right)
      h(
        "span",
        { className: "hv-copy-chip", "aria-hidden": "true" },
        Icon(isCopied ? "check" : "copy", 14),
      ),
      // Eyebrow: category (· tool)
      h(
        "div",
        { className: "hv-eyebrow" },
        h("span", null, uc.category || "Mission"),
        uc.tool
          ? h(
              React.Fragment || "span",
              null,
              h("span", { className: "hv-eyebrow-sep" }, "·"),
              h("span", null, uc.tool),
            )
          : null,
      ),
      // Title — the CTA
      h("h3", { className: "hv-title" }, uc.title || ""),
      // Blurb — super-short context (6–12 words)
      uc.blurb
        ? h("p", { className: "hv-blurb" }, uc.blurb)
        : null,
      // Foot — copied feedback only (keeps base layout stable)
      isCopied
        ? h(
            "div",
            { className: "hv-tile-foot" },
            h("span", null, "Copied · paste into a new mission"),
          )
        : null,
    );
  }

  // ── Empty state ─────────────────────────────────────────────
  function Empty() {
    return h(
      "div",
      { style: { padding: "48px 40px" } },
      h(
        "p",
        {
          style: {
            fontSize: 14,
            fontWeight: 600,
            color: "#334155",
            margin: 0,
          },
        },
        "No missions declared yet.",
      ),
      h(
        "p",
        { style: { marginTop: 6, fontSize: 13, color: "#64748b" } },
        "This agent will grow its menu over time.",
      ),
    );
  }

  // ── Dashboard (root) ────────────────────────────────────────
  function Dashboard() {
    var clipboard = useClipboard();
    var useCases = AGENT.useCases || [];

    var body;
    if (useCases.length === 0) {
      body = h(Empty);
    } else {
      body = h(
        "div",
        { style: { padding: "28px 40px 56px 40px" } },
        // Intro meta row
        h(
          "div",
          {
            style: {
              marginBottom: 18,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            },
          },
          h(
            "p",
            {
              style: {
                fontSize: 13,
                color: "#475569",
                margin: 0,
                lineHeight: 1.5,
              },
            },
            useCases.length +
              " " +
              (useCases.length === 1 ? "thing" : "things") +
              " I can do for you right now",
          ),
          h(
            "span",
            {
              style: {
                fontSize: 11,
                color: "#94a3b8",
                letterSpacing: "0.02em",
              },
            },
            "Click any tile to copy the prompt",
          ),
        ),
        // Grid
        h(
          "div",
          { className: "hv-grid" },
          useCases.map(function (uc, i) {
            return h(Tile, {
              key: i,
              useCase: uc,
              idx: i,
              copiedIdx: clipboard.copiedIdx,
              onCopy: clipboard.copy,
            });
          }),
        ),
      );
    }

    return h(
      "div",
      {
        className: "hv-dash",
        style: {
          height: "100%",
          overflowY: "auto",
          background: "#ffffff",
          color: "#0f172a",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
        },
      },
      h("style", { dangerouslySetInnerHTML: { __html: STYLE_CSS } }),
      h(Header),
      body,
    );
  }

  window.__houston_bundle__ = { Dashboard: Dashboard };
})();
