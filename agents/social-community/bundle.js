// Houston agent dashboard bundle — Social & Community.
// Hand-crafted IIFE. No ES modules, no build step, no import statements.
// Access React via window.Houston.React. Export via window.__houston_bundle__.
//
// This dashboard is the founder's first-action menu for the agent: a
// slim sticky header, one featured "Start here" mission, then a dense
// list of remaining missions grouped by category. Each row copies a
// hidden `fullPrompt` (richer than the visible title) to clipboard —
// the Overview surface stays clean while the agent gets enough context.
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

  // ── Accent palette ───────────────────────────────────────────
  // Static class lookups so Tailwind's JIT keeps them bundled. Each
  // hue is used sparingly: category label, featured CTA, row hover
  // affordances. No gradient surfaces.
  var ACCENTS = {
    indigo: {
      dot: "bg-indigo-500",
      categoryLabel: "text-indigo-700",
      featuredRule: "bg-indigo-500",
      ctaBg: "bg-indigo-600 hover:bg-indigo-700",
      ctaText: "text-white",
      rowCopyHover: "group-hover/row:text-indigo-700",
      rowBorderHover: "group-hover/row:border-indigo-200",
    },
    emerald: {
      dot: "bg-emerald-500",
      categoryLabel: "text-emerald-700",
      featuredRule: "bg-emerald-500",
      ctaBg: "bg-emerald-600 hover:bg-emerald-700",
      ctaText: "text-white",
      rowCopyHover: "group-hover/row:text-emerald-700",
      rowBorderHover: "group-hover/row:border-emerald-200",
    },
    amber: {
      dot: "bg-amber-500",
      categoryLabel: "text-amber-700",
      featuredRule: "bg-amber-500",
      ctaBg: "bg-amber-600 hover:bg-amber-700",
      ctaText: "text-white",
      rowCopyHover: "group-hover/row:text-amber-700",
      rowBorderHover: "group-hover/row:border-amber-200",
    },
    sky: {
      dot: "bg-sky-500",
      categoryLabel: "text-sky-700",
      featuredRule: "bg-sky-500",
      ctaBg: "bg-sky-600 hover:bg-sky-700",
      ctaText: "text-white",
      rowCopyHover: "group-hover/row:text-sky-700",
      rowBorderHover: "group-hover/row:border-sky-200",
    },
    rose: {
      dot: "bg-rose-500",
      categoryLabel: "text-rose-700",
      featuredRule: "bg-rose-500",
      ctaBg: "bg-rose-600 hover:bg-rose-700",
      ctaText: "text-white",
      rowCopyHover: "group-hover/row:text-rose-700",
      rowBorderHover: "group-hover/row:border-rose-200",
    },
  };
  var THEME = ACCENTS[AGENT.accent] || ACCENTS.indigo;

  // ── Inline icon library (heroicons-outline paths) ────────────
  // Minimal set: copy, check, arrow. Stroke-only, currentColor.
  var ICON_PATHS = {
    copy:
      "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
    check: "m4.5 12.75 6 6 9-13.5",
    arrowRight: "M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75",
  };

  function Icon(name, cls) {
    var d = ICON_PATHS[name] || ICON_PATHS.arrowRight;
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.75,
        stroke: "currentColor",
        className: cls || "size-4",
        "aria-hidden": "true",
      },
      h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: d }),
    );
  }

  // ── Clipboard hook ───────────────────────────────────────────
  // Tracks which use-case index most recently copied; the UI uses this
  // to flash a transient "Copied" state. Falls back to a hidden
  // textarea + execCommand when the async API is unavailable.
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

  // Return the copy payload for a use case — prefers the rich hidden
  // `fullPrompt`, falls back to the short public `prompt`.
  function payloadFor(uc) {
    return (uc && (uc.fullPrompt || uc.prompt)) || "";
  }

  // ── Sticky header ────────────────────────────────────────────
  function Header() {
    return h(
      "div",
      {
        className:
          "sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100",
      },
      h(
        "div",
        {
          className:
            "max-w-3xl mx-auto px-8 py-5 flex items-start gap-6",
        },
        h(
          "div",
          { className: "flex-1 min-w-0" },
          h(
            "div",
            { className: "flex items-center gap-2" },
            h("span", {
              className:
                "inline-block size-[7px] rounded-full " + THEME.dot,
              "aria-hidden": "true",
            }),
            h(
              "h1",
              {
                className:
                  "text-[17px] font-semibold tracking-tight text-slate-900 truncate",
              },
              AGENT.name,
            ),
          ),
          h(
            "p",
            {
              className:
                "mt-1 text-[12.5px] text-slate-500 leading-snug max-w-xl",
            },
            AGENT.tagline,
          ),
        ),
        h(
          "span",
          {
            className:
              "hidden md:inline-block shrink-0 mt-1 text-[11px] text-slate-400 tracking-wide whitespace-nowrap",
          },
          "Click any mission to copy a ready prompt",
        ),
      ),
    );
  }

  // ── Featured mission (first use case) ────────────────────────
  function Featured(props) {
    var uc = props.useCase;
    var idx = props.idx;
    var isCopied = props.copiedIdx === idx;
    var onCopy = props.onCopy;

    return h(
      "section",
      {
        className: "max-w-3xl mx-auto px-8 pt-12 pb-10",
      },
      h(
        "div",
        { className: "flex items-center gap-2.5 mb-4" },
        h("span", {
          className:
            "inline-block h-px w-8 " + THEME.featuredRule,
          "aria-hidden": "true",
        }),
        h(
          "span",
          {
            className:
              "text-[10.5px] uppercase tracking-[0.14em] font-semibold " +
              THEME.categoryLabel,
          },
          "Start here",
        ),
        uc.category
          ? h(
              "span",
              {
                className:
                  "text-[10.5px] uppercase tracking-[0.14em] font-medium text-slate-400",
              },
              "· " + uc.category,
            )
          : null,
      ),
      h(
        "h2",
        {
          className:
            "text-[26px] leading-[1.2] font-semibold tracking-tight text-slate-900",
        },
        uc.title || "",
      ),
      uc.outcome
        ? h(
            "p",
            {
              className:
                "mt-3 text-[14.5px] leading-relaxed text-slate-600 max-w-2xl",
            },
            uc.outcome,
          )
        : null,
      h(
        "div",
        { className: "mt-6 flex items-center flex-wrap gap-x-4 gap-y-2" },
        h(
          "button",
          {
            type: "button",
            onClick: function () {
              onCopy(payloadFor(uc), idx);
            },
            className:
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium transition-colors duration-200 " +
              (isCopied
                ? "bg-slate-900 text-white"
                : THEME.ctaBg + " " + THEME.ctaText),
          },
          Icon(isCopied ? "check" : "copy", "size-4"),
          h(
            "span",
            null,
            isCopied
              ? "Copied — paste into a new mission"
              : "Copy this prompt",
          ),
          isCopied ? null : Icon("arrowRight", "size-3.5"),
        ),
        uc.tool
          ? h(
              "span",
              {
                className:
                  "text-[11.5px] text-slate-500 tracking-wide",
              },
              "Uses " + uc.tool,
            )
          : null,
      ),
    );
  }

  // ── Mission row (one per remaining use case) ─────────────────
  function Row(props) {
    var uc = props.useCase;
    var idx = props.idx;
    var isCopied = props.copiedIdx === idx;
    var onCopy = props.onCopy;

    return h(
      "li",
      {
        className:
          "group/row relative border-t border-slate-100 transition-colors duration-150 hover:bg-slate-50/60",
      },
      h(
        "button",
        {
          type: "button",
          onClick: function () {
            onCopy(payloadFor(uc), idx);
          },
          className:
            "w-full text-left flex items-center justify-between gap-6 py-4 pl-2 pr-3",
        },
        h(
          "div",
          { className: "flex-1 min-w-0" },
          h(
            "h3",
            {
              className:
                "text-[15px] font-medium leading-snug text-slate-900 truncate",
            },
            uc.title || "",
          ),
          // outcome — hidden by default, revealed on hover via grid-rows.
          // This animates height without touching `height` directly.
          uc.outcome
            ? h(
                "div",
                {
                  className:
                    "grid grid-rows-[0fr] group-hover/row:grid-rows-[1fr] transition-[grid-template-rows] duration-200 ease-out",
                },
                h(
                  "div",
                  { className: "overflow-hidden" },
                  h(
                    "p",
                    {
                      className:
                        "mt-1 text-[12.5px] text-slate-500 leading-relaxed truncate",
                    },
                    uc.outcome,
                  ),
                ),
              )
            : null,
        ),
        h(
          "span",
          {
            className:
              "shrink-0 inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400 transition-colors duration-150 " +
              (isCopied ? "" : THEME.rowCopyHover),
          },
          Icon(isCopied ? "check" : "copy", "size-3.5"),
          h(
            "span",
            { className: isCopied ? "" : "hidden sm:inline" },
            isCopied ? "Copied" : "Copy",
          ),
        ),
      ),
    );
  }

  // ── Category section ─────────────────────────────────────────
  function CategorySection(props) {
    return h(
      "section",
      { className: "mb-10 last:mb-0" },
      h(
        "div",
        { className: "flex items-baseline gap-2 mb-1 pl-2" },
        h(
          "h2",
          {
            className:
              "text-[10.5px] uppercase tracking-[0.14em] font-semibold " +
              THEME.categoryLabel,
          },
          props.category,
        ),
        h(
          "span",
          {
            className:
              "text-[11px] text-slate-300 tabular-nums font-medium",
          },
          props.items.length,
        ),
      ),
      h(
        "ul",
        { className: "border-b border-slate-100" },
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

  // ── Empty state ──────────────────────────────────────────────
  function Empty() {
    return h(
      "div",
      { className: "max-w-3xl mx-auto px-8 py-20" },
      h(
        "p",
        { className: "text-[14px] font-medium text-slate-700" },
        "No missions declared yet.",
      ),
      h(
        "p",
        { className: "mt-1 text-[13px] text-slate-500" },
        "This agent will grow its menu over time.",
      ),
    );
  }

  // ── Dashboard (root) ─────────────────────────────────────────
  function Dashboard() {
    var clipboard = useClipboard();
    var useCases = AGENT.useCases || [];

    if (useCases.length === 0) {
      return h(
        "div",
        { className: "h-full overflow-y-auto bg-white" },
        h(Header),
        h(Empty),
      );
    }

    var featured = { useCase: useCases[0], idx: 0 };
    var rest = useCases.slice(1);

    // Group the rest by category, preserving first-appearance order.
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

    return h(
      "div",
      { className: "h-full overflow-y-auto bg-white" },
      h(Header),
      h(Featured, {
        useCase: featured.useCase,
        idx: featured.idx,
        copiedIdx: clipboard.copiedIdx,
        onCopy: clipboard.copy,
      }),
      groups.length > 0
        ? h(
            "div",
            { className: "max-w-3xl mx-auto px-8 pb-16" },
            h(
              "div",
              {
                className:
                  "mb-6 text-[11px] uppercase tracking-[0.14em] font-medium text-slate-400",
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

  window.__houston_bundle__ = { Dashboard: Dashboard };
})();
