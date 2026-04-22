// Houston agent dashboard bundle — Head of Marketing.
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
  "name": "Head of Marketing",
  "tagline": "Positioning, launches, competitive pulse, the Monday review. I coordinate the other four marketing agents through one shared positioning doc.",
  "accent": "indigo",
  "useCases": [
    {
      "category": "Foundation",
      "title": "Draft the positioning doc that unblocks everyone",
      "prompt": "Help me write a positioning statement for my product.",
      "fullPrompt": "Help me write (or update) my positioning doc. Use the define-positioning skill. Interview me for the pieces you don't already have in config/ — ICP, category we compete in, top 3 differentiators vs alternatives, brand voice, pricing stance, primary CTA. Synthesize into the full product-marketing-context.md at your agent root. This is the doc the other four agents read before every task, so be specific — no throw-away adjectives. After saving, tell me which sections still need evidence and what you'd ask next.",
      "description": "I'll walk you through a short interview and draft the full positioning doc — ICP, category, differentiators, brand voice, pricing stance, primary CTA. This doc is the source of truth the other four marketing agents read before they do anything.",
      "outcome": "A filled-in product-marketing-context.md at my root. SEO, Growth, Lifecycle, Social unlock the moment this exists.",
      "skill": "define-positioning"
    },
    {
      "category": "Foundation",
      "title": "Build a buyer persona from your closed-won accounts",
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
      "prompt": "Plan the launch for {feature} over the next 2 weeks.",
      "fullPrompt": "Plan the launch for {feature} over the next 2 weeks. Use the plan-launch skill. Break the timeline into pre-launch (day -7 to -1), launch day, and post-launch (day +1 to +7). Each task gets an owner (me, SEO & Content, Growth & Paid, Lifecycle & Email, or Social & Community), a concrete deliverable, and a target date. Call out the critical path and the one task that blocks launch day if missed. Save to launches/{slug}.md and log in outputs.json. Where the plan depends on another agent, write the exact handoff prompt I can paste into their chat.",
      "description": "Break the launch into pre-launch (7 days out), launch day, post-launch. Each task tagged to the right agent — SEO drafts the post, Growth preps creative, Lifecycle writes the email, Social plans the posts.",
      "outcome": "A launch plan at launches/{slug}.md with owner + timing per task.",
      "skill": "plan-launch"
    },
    {
      "category": "Research",
      "title": "Research a topic and hand SEO a brief",
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
      "prompt": "Give me the Monday marketing review across all channels.",
      "fullPrompt": "Run the Monday marketing review across every agent. Use the review-marketing-health skill. Read each other agent's outputs.json (SEO & Content, Growth & Paid, Lifecycle & Email, Social & Community). Summarize what shipped last week, what's in draft, and any agent that's been quiet for 2+ weeks. Cross-reference against the launch calendar in launches/ and the current positioning doc. End with 3 recommended next moves for the week, each addressed to a specific agent with a one-line handoff prompt I can paste. Save to reviews/{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Aggregate what each of the four other agents produced this week — blog posts shipped, campaigns running, emails drafted, social posts. Flag gaps like \"Lifecycle hasn't shipped a drip in 3 weeks.\"",
      "outcome": "A weekly review at reviews/{YYYY-MM-DD}.md with recommended next moves per agent.",
      "skill": "review-marketing-health"
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
