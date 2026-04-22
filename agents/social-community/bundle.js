// Houston agent dashboard bundle — Social & Community.
// Hand-crafted IIFE. No ES modules, no build step, no import statements.
// Access React via window.Houston.React. Export via window.__houston_bundle__.
//
// This dashboard is the founder's first-action menu for the agent: a
// slim sticky header, one featured "Start here" mission inside a
// tinted panel, then a dense categorized list of remaining missions.
// Each row copies a hidden `fullPrompt` (richer than the visible
// title) to clipboard — the Overview surface stays clean while the
// agent gets enough context.
//
// Styling note: accent colors are applied via an injected <style>
// block using CSS custom properties (one palette per accent). This
// bypasses Houston's Tailwind content scan, which only picks up
// classes that appear literally in other scanned files. Relying on
// `bg-{accent}-600` etc. would render as no-op because those classes
// aren't present in Houston's bundled CSS.
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
      "prompt": "Plan this week's social content across LinkedIn and X.",
      "fullPrompt": "Plan this week's social content across LinkedIn and X (plus any other platform in config/). Use the plan-social-calendar skill. Read ../seo-content/outputs.json and ../head-of-marketing/outputs.json so I can repurpose existing angles instead of inventing duplicates. Give me a Mon–Fri plan per platform, each slot with the angle, hook, source artifact, and status. Balance original posts, repurposed content, and community engagement. Append to the living social-calendar.md and save the week's view to social-calendars/{YYYY-WNN}.md. Log in outputs.json.",
      "description": "Mon–Fri plan per platform, keyed to your topics, mixing original posts with repurposed content from the SEO agent's outputs index (zero duplicate angles).",
      "outcome": "Calendar at social-calendars/{YYYY-WNN}.md + appended to the living social-calendar.md.",
      "skill": "plan-social-calendar"
    },
    {
      "category": "Planning",
      "title": "Scan your X timeline for what to engage with",
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

  // ── Accent palettes (hex values from Tailwind's default palette) ──
  // We apply these via CSS variables below so they work without any
  // Tailwind classes being present in Houston's CSS bundle.
  var PALETTES = {
    indigo: { c50: "#eef2ff", c100: "#e0e7ff", c500: "#6366f1", c600: "#4f46e5", c700: "#4338ca" },
    emerald: { c50: "#ecfdf5", c100: "#d1fae5", c500: "#10b981", c600: "#059669", c700: "#047857" },
    amber: { c50: "#fffbeb", c100: "#fef3c7", c500: "#f59e0b", c600: "#d97706", c700: "#b45309" },
    sky: { c50: "#f0f9ff", c100: "#e0f2fe", c500: "#0ea5e9", c600: "#0284c7", c700: "#0369a1" },
    rose: { c50: "#fff1f2", c100: "#ffe4e6", c500: "#f43f5e", c600: "#e11d48", c700: "#be123c" },
  };
  var PALETTE = PALETTES[AGENT.accent] || PALETTES.indigo;

  // Scoped style block. Everything is prefixed with `.hv-dash` so we
  // don't leak into the host app's styles.
  var STYLE_CSS =
    ".hv-dash{" +
    "--hv-50:" + PALETTE.c50 + ";" +
    "--hv-100:" + PALETTE.c100 + ";" +
    "--hv-500:" + PALETTE.c500 + ";" +
    "--hv-600:" + PALETTE.c600 + ";" +
    "--hv-700:" + PALETTE.c700 + ";" +
    "}" +
    // Sticky header
    ".hv-dash .hv-header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid #e2e8f0;}" +
    // Featured panel
    ".hv-dash .hv-featured{position:relative;background:linear-gradient(180deg,var(--hv-50) 0%,rgba(255,255,255,0) 85%);border-left:3px solid var(--hv-500);border-bottom:1px solid #e2e8f0;}" +
    ".hv-dash .hv-eyebrow{color:var(--hv-700);}" +
    ".hv-dash .hv-eyebrow-dot{background:var(--hv-500);}" +
    ".hv-dash .hv-featured-title{font-family:ui-serif,Georgia,Cambria,'Times New Roman',Times,serif;font-weight:600;letter-spacing:-0.01em;}" +
    // CTA button
    ".hv-dash .hv-cta{background:var(--hv-600);color:#fff;border:none;cursor:pointer;transition:background 160ms ease-out,transform 160ms ease-out;}" +
    ".hv-dash .hv-cta:hover{background:var(--hv-700);}" +
    ".hv-dash .hv-cta:active{transform:translateY(1px);}" +
    ".hv-dash .hv-cta-copied{background:#0f172a;}" +
    // Category label + rule
    ".hv-dash .hv-cat-label{color:var(--hv-700);}" +
    ".hv-dash .hv-cat-rule{background:var(--hv-500);}" +
    // Rows
    ".hv-dash .hv-row{cursor:pointer;transition:background 120ms ease-out;border-top:1px solid #f1f5f9;}" +
    ".hv-dash .hv-row:first-child{border-top:1px solid #e2e8f0;}" +
    ".hv-dash .hv-row:last-child{border-bottom:1px solid #e2e8f0;}" +
    ".hv-dash .hv-row:hover{background:color-mix(in srgb,var(--hv-500) 5%,transparent);}" +
    ".hv-dash .hv-row:hover .hv-row-title{color:var(--hv-700);}" +
    ".hv-dash .hv-row-title{transition:color 120ms ease-out;}" +
    // Copy pill on each row
    ".hv-dash .hv-copy-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid #e2e8f0;background:#fff;color:#64748b;font-size:11.5px;font-weight:500;transition:all 140ms ease-out;}" +
    ".hv-dash .hv-row:hover .hv-copy-pill{border-color:var(--hv-500);color:var(--hv-700);}" +
    ".hv-dash .hv-copy-pill-copied{background:var(--hv-600);color:#fff;border-color:var(--hv-600);}" +
    ".hv-dash .hv-row:hover .hv-copy-pill-copied{background:var(--hv-600);color:#fff;border-color:var(--hv-600);}" +
    "";

  // ── Inline icons (heroicons-outline paths) ──────────────────
  var ICON_PATHS = {
    copy:
      "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
    check: "m4.5 12.75 6 6 9-13.5",
    arrowRight: "M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75",
  };

  function Icon(name, size) {
    var d = ICON_PATHS[name] || ICON_PATHS.arrowRight;
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.8,
        stroke: "currentColor",
        width: size || 14,
        height: size || 14,
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
        }, 1800);
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

  // ── Header ──────────────────────────────────────────────────
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
            "div",
            { style: { display: "flex", alignItems: "center", gap: 10 } },
            h("span", {
              className: "hv-eyebrow-dot",
              style: {
                width: 8,
                height: 8,
                borderRadius: 999,
                display: "inline-block",
              },
              "aria-hidden": "true",
            }),
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
        h(
          "span",
          {
            style: {
              flexShrink: 0,
              marginTop: 2,
              fontSize: 11,
              color: "#94a3b8",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            },
          },
          "Click any mission to copy a ready prompt",
        ),
      ),
    );
  }

  // ── Featured mission ────────────────────────────────────────
  function Featured(props) {
    var uc = props.useCase;
    var idx = props.idx;
    var isCopied = props.copiedIdx === idx;
    var onCopy = props.onCopy;

    return h(
      "section",
      {
        className: "hv-featured",
        style: { padding: "44px 40px 48px 40px" },
      },
      // Eyebrow
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          },
        },
        h(
          "span",
          {
            className: "hv-eyebrow",
            style: {
              fontSize: 10.5,
              letterSpacing: "0.16em",
              fontWeight: 700,
              textTransform: "uppercase",
            },
          },
          "Start here",
        ),
        uc.category
          ? h(
              "span",
              {
                style: {
                  fontSize: 10.5,
                  letterSpacing: "0.16em",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  color: "#94a3b8",
                },
              },
              "· " + uc.category,
            )
          : null,
      ),
      // Title
      h(
        "h2",
        {
          className: "hv-featured-title",
          style: {
            fontSize: 30,
            lineHeight: 1.15,
            color: "#0f172a",
            margin: 0,
            maxWidth: 720,
          },
        },
        uc.title || "",
      ),
      // Outcome
      uc.outcome
        ? h(
            "p",
            {
              style: {
                marginTop: 14,
                fontSize: 14.5,
                lineHeight: 1.6,
                color: "#475569",
                maxWidth: 640,
              },
            },
            uc.outcome,
          )
        : null,
      // CTA
      h(
        "div",
        {
          style: {
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px 20px",
          },
        },
        h(
          "button",
          {
            type: "button",
            onClick: function () {
              onCopy(payloadFor(uc), idx);
            },
            className: "hv-cta" + (isCopied ? " hv-cta-copied" : ""),
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 20px",
              borderRadius: 999,
              fontSize: 13.5,
              fontWeight: 600,
              letterSpacing: "-0.005em",
            },
          },
          Icon(isCopied ? "check" : "copy", 15),
          h(
            "span",
            null,
            isCopied ? "Copied — paste into a new mission" : "Copy this prompt",
          ),
          isCopied ? null : Icon("arrowRight", 13),
        ),
        uc.tool
          ? h(
              "span",
              {
                style: {
                  fontSize: 11.5,
                  color: "#64748b",
                  letterSpacing: "0.02em",
                },
              },
              "Uses " + uc.tool,
            )
          : null,
      ),
    );
  }

  // ── Mission row ─────────────────────────────────────────────
  function Row(props) {
    var uc = props.useCase;
    var idx = props.idx;
    var isCopied = props.copiedIdx === idx;
    var onCopy = props.onCopy;

    return h(
      "div",
      {
        className: "hv-row",
        role: "button",
        tabIndex: 0,
        onClick: function () {
          onCopy(payloadFor(uc), idx);
        },
        onKeyDown: function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onCopy(payloadFor(uc), idx);
          }
        },
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          padding: "16px 12px 16px 16px",
        },
      },
      h(
        "div",
        { style: { flex: 1, minWidth: 0 } },
        h(
          "h3",
          {
            className: "hv-row-title",
            style: {
              fontSize: 15,
              fontWeight: 600,
              color: "#0f172a",
              margin: 0,
              lineHeight: 1.35,
              letterSpacing: "-0.005em",
            },
          },
          uc.title || "",
        ),
        uc.outcome
          ? h(
              "p",
              {
                style: {
                  marginTop: 4,
                  fontSize: 12.5,
                  color: "#64748b",
                  lineHeight: 1.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              },
              uc.outcome,
            )
          : null,
      ),
      h(
        "span",
        {
          className:
            "hv-copy-pill" + (isCopied ? " hv-copy-pill-copied" : ""),
        },
        Icon(isCopied ? "check" : "copy", 13),
        h(
          "span",
          null,
          isCopied ? "Copied" : "Copy",
        ),
      ),
    );
  }

  // ── Category section ────────────────────────────────────────
  function CategorySection(props) {
    return h(
      "section",
      { style: { marginBottom: 36 } },
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
            paddingLeft: 16,
          },
        },
        h("span", {
          className: "hv-cat-rule",
          style: {
            display: "inline-block",
            width: 14,
            height: 2,
            borderRadius: 1,
          },
          "aria-hidden": "true",
        }),
        h(
          "h2",
          {
            className: "hv-cat-label",
            style: {
              fontSize: 10.5,
              letterSpacing: "0.16em",
              fontWeight: 700,
              textTransform: "uppercase",
              margin: 0,
            },
          },
          props.category,
        ),
        h(
          "span",
          {
            style: {
              fontSize: 11,
              color: "#cbd5e1",
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
            },
          },
          props.items.length,
        ),
      ),
      h(
        "div",
        null,
        props.items.map(function (item) {
          return h(Row, {
            key: item.idx,
            useCase: item.useCase,
            idx: item.idx,
            copiedIdx: props.copiedIdx,
            onCopy: props.onCopy,
          });
        }),
      ),
    );
  }

  // ── Empty state ─────────────────────────────────────────────
  function Empty() {
    return h(
      "div",
      { style: { padding: "48px 40px" } },
      h(
        "p",
        { style: { fontSize: 14, fontWeight: 600, color: "#334155", margin: 0 } },
        "No missions declared yet.",
      ),
      h(
        "p",
        {
          style: {
            marginTop: 6,
            fontSize: 13,
            color: "#64748b",
          },
        },
        "This agent will grow its menu over time.",
      ),
    );
  }

  // ── Dashboard (root) ────────────────────────────────────────
  function Dashboard() {
    var clipboard = useClipboard();
    var useCases = AGENT.useCases || [];

    var content;
    if (useCases.length === 0) {
      content = h(Empty);
    } else {
      var featured = { useCase: useCases[0], idx: 0 };
      var rest = useCases.slice(1);

      var groups = (function () {
        if (rest.length === 0) return [];
        var order = [];
        var map = {};
        rest.forEach(function (uc, i) {
          var cat = uc.category || "Other";
          if (!map[cat]) {
            map[cat] = [];
            order.push(cat);
          }
          map[cat].push({ useCase: uc, idx: i + 1 });
        });
        return order.map(function (cat) {
          return { category: cat, items: map[cat] };
        });
      })();

      content = h(
        React.Fragment || "div",
        null,
        h(Featured, {
          useCase: featured.useCase,
          idx: featured.idx,
          copiedIdx: clipboard.copiedIdx,
          onCopy: clipboard.copy,
        }),
        groups.length > 0
          ? h(
              "div",
              { style: { padding: "36px 40px 48px 40px" } },
              h(
                "div",
                {
                  style: {
                    marginBottom: 20,
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "#94a3b8",
                  },
                },
                "Or browse · " +
                  rest.length +
                  " more mission" +
                  (rest.length === 1 ? "" : "s"),
              ),
              groups.map(function (g) {
                return h(CategorySection, {
                  key: g.category,
                  category: g.category,
                  items: g.items,
                  copiedIdx: clipboard.copiedIdx,
                  onCopy: clipboard.copy,
                });
              }),
            )
          : null,
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
      content,
    );
  }

  window.__houston_bundle__ = { Dashboard: Dashboard };
})();
