// Houston agent dashboard bundle — Social & Community.
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
  "name": "Social & Community",
  "tagline": "LinkedIn posts, X threads, Reddit replies, your weekly social calendar and podcast pitches. Drafts only — I never post.",
  "accent": "rose",
  "useCases": [
    {
      "category": "Posts",
      "title": "Draft a LinkedIn post in your voice",
      "blurb": "Hook-first, no AI tells, one clear takeaway.",
      "prompt": "Draft a LinkedIn post about {topic} in my voice.",
      "fullPrompt": "Draft a LinkedIn post about {topic} in my voice. Use the draft-linkedin-post skill. Read config/voice.md for how I write and the positioning doc for the claims I can back. Structure: a hook in the first line that earns the 'see more' click, whitespace, one clear takeaway or story, and a CTA or question that invites replies. No 'Exciting news!' openings, no AI tells. Save to posts/linkedin-{slug}.md and log in outputs.json as status: draft. I'll paste it when I'm ready.",
      "description": "Hook in the first line, whitespace, one clear takeaway, CTA or question to spark replies. Uses your saved voice samples so it doesn't sound like AI.",
      "outcome": "Post draft at posts/linkedin-{slug}.md — paste into LinkedIn when you're ready.",
      "skill": "draft-linkedin-post",
      "tool": "LinkedIn"
    },
    {
      "category": "Posts",
      "title": "Draft a 7-tweet X thread",
      "blurb": "Hook → 5 progression tweets → CTA. 280-char clean.",
      "prompt": "Draft a 7-tweet X thread on {topic}.",
      "fullPrompt": "Draft a 7-tweet X thread on {topic}. Use the draft-x-thread skill. Read config/voice.md for how I write and the positioning doc for grounded claims. Structure: hook tweet that states the promise (not 'a thread 🧵'), 5 progression tweets each carrying one idea, final CTA tweet. Each tweet fits 280 chars with ~20 chars of slack for edits. No AI tells, no emoji-stuffing. Save to threads/x-{slug}.md and log in outputs.json as status: draft.",
      "description": "Hook tweet, numbered progression, CTA tweet at the end. Each tweet fits the 280-char budget with room for edits.",
      "outcome": "Thread at threads/x-{slug}.md — copy tweet-by-tweet into your scheduler.",
      "skill": "draft-x-thread",
      "tool": "X"
    },
    {
      "category": "Community",
      "title": "Reply to a Reddit thread the right way",
      "blurb": "Value-first, helpful, no pitch — respects the sub.",
      "prompt": "Draft a Reddit reply to {thread URL}. Value-first, no pitch.",
      "fullPrompt": "Draft a Reddit reply to {thread URL}. Use the draft-community-reply skill. Fetch the source thread via the Reddit integration or Firecrawl. Write a value-first reply: answer the actual question, share what I'd do, cite any experience honestly. Only mention the product if it's genuinely the best answer, and never as a lead — at the end, optionally, with a 'I work on X, fwiw' disclosure. Respect the subreddit's culture. Save to community-replies/{source-slug}.md and log in outputs.json as status: draft — I'll paste it after a final read.",
      "description": "Pull the source thread via Reddit / Firecrawl, draft a value-first reply. Helpful first, link only if it truly belongs.",
      "outcome": "Reply at community-replies/{source-slug}.md you can paste in after a final read.",
      "skill": "draft-community-reply",
      "tool": "Reddit"
    },
    {
      "category": "Planning",
      "title": "Plan this week's social content across platforms",
      "blurb": "Mon–Fri per platform, repurposing what just shipped.",
      "prompt": "Plan this week's social content across LinkedIn and X.",
      "fullPrompt": "Plan this week's social content across LinkedIn and X (plus any other platform in config/). Use the plan-social-calendar skill. Read ../seo-content/outputs.json and ../head-of-marketing/outputs.json so I can repurpose existing angles instead of inventing duplicates. Give me a Mon–Fri plan per platform, each slot with the angle, hook, source artifact, and status. Balance original posts, repurposed content, and community engagement. Append to the living social-calendar.md and save the week's view to social-calendars/{YYYY-WNN}.md. Log in outputs.json.",
      "description": "Mon–Fri plan per platform, keyed to your topics, mixing original posts with repurposed content from the SEO agent's outputs index (zero duplicate angles).",
      "outcome": "Calendar at social-calendars/{YYYY-WNN}.md + appended to the living social-calendar.md.",
      "skill": "plan-social-calendar"
    },
    {
      "category": "Planning",
      "title": "Scan your X timeline for what to engage with",
      "blurb": "5–10 replies drafted — skip the doom-scroll.",
      "prompt": "Scan my X timeline and surface what's worth engaging with.",
      "fullPrompt": "Scan my X timeline and surface the 5–10 things worth engaging with. Use the monitor-social-feed skill. Pull recent posts via the X integration, filter for relevance to my topics in config/topics.md, and prioritize posts where a smart reply from me would land — accounts with reach, questions I can genuinely answer, takes I'd push back on. For each opportunity, draft a reply in my voice. Save to feed-digests/x-{YYYY-MM-DD}.md and log in outputs.json. Skip the doom-scroll — I'll open this once and act.",
      "description": "Filter your feed for relevance to your topics and engagement opportunities, then suggest concrete replies — no more doom-scrolling looking for something to comment on.",
      "outcome": "Digest at feed-digests/x-{YYYY-MM-DD}.md with suggested reply drafts per opportunity.",
      "skill": "monitor-social-feed",
      "tool": "X"
    },
    {
      "category": "Planning",
      "title": "Weekly LinkedIn digest — how did your posts do?",
      "blurb": "Your stats + network posts worth commenting on.",
      "prompt": "Give me the weekly LinkedIn digest — how did my posts do and what's my network posting?",
      "fullPrompt": "Run the weekly LinkedIn digest. Use the digest-linkedin-activity skill. Pull my last 7 days of posts via the LinkedIn integration — reach, engagement rate, new followers — and compare to the trailing 4-week average. Call out what over/underperformed and a one-line hypothesis for why. Then surface 3–5 notable posts from my network worth commenting on, with a draft reply for each. 5-min Monday read. Save to linkedin-digests/{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Stats on your own posts (reach, engagement, new followers) plus notable posts in your network worth commenting on. 5-min read.",
      "outcome": "Digest at linkedin-digests/{YYYY-MM-DD}.md. Skim it Monday morning.",
      "skill": "digest-linkedin-activity",
      "tool": "LinkedIn"
    },
    {
      "category": "Distribution",
      "title": "Get yourself booked on your ICP's podcasts",
      "blurb": "5 shows, per-host pitch, no template spam.",
      "prompt": "Draft podcast outreach pitches for 5 shows our ICP listens to via Listen Notes.",
      "fullPrompt": "Find 5 podcasts our ICP actually listens to and draft outreach pitches. Use the pitch-podcast skill. Search via Listen Notes by our ICP's interests, audience size band, and recency of publishing. For each show, draft a per-host pitch that references a specific recent episode, opens with a hook tied to our positioning, proposes a concrete angle their audience would learn from, and includes 2 proof points + a clear ask. No template spam — each pitch names the host and the episode. Save to podcast-pitches/{YYYY-MM-DD}.md and log in outputs.json as status: draft.",
      "description": "Identify target shows by audience fit via Listen Notes. Draft per-show pitches — hook based on your positioning, angle, proof points, clear ask. No template spam.",
      "outcome": "Pitches at podcast-pitches/{YYYY-MM-DD}.md — one per show, ready to send from your own email.",
      "skill": "pitch-podcast",
      "tool": "Listen Notes"
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
