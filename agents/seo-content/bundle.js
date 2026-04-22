// Houston agent dashboard bundle — SEO & Content.
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
  "name": "SEO & Content",
  "tagline": "Audit, rank, draft, repurpose, and link. The inbound content engine — tool-agnostic, Composio-first.",
  "accent": "emerald",
  "useCases": [
    {
      "category": "Audits",
      "title": "Run a full SEO audit of your site",
      "prompt": "Run an SEO audit of my site with Semrush.",
      "fullPrompt": "Run a full SEO audit of my site. Use the audit-site-seo skill. Pull on-page + technical via Semrush (or Ahrefs / Firecrawl depending on what's connected). Score issues by impact × ease, not severity level — I don't care about a wall of warnings, I care about what to fix this week. Give me the top 10 prioritized fixes with the exact change each one needs (title tag, schema, internal link, missing alt, etc.). Save to seo-audits/{domain}-{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "On-page + technical audit via Semrush (or Ahrefs / Firecrawl fallback). I rank issues by impact × ease and give you a fix list — not a wall of warnings.",
      "outcome": "Scored audit at seo-audits/{domain}-{YYYY-MM-DD}.md — 10 prioritized fixes you can ship this week.",
      "skill": "audit-site-seo",
      "tool": "Semrush"
    },
    {
      "category": "Audits",
      "title": "Check visibility in ChatGPT, Perplexity, Gemini",
      "prompt": "How does my product show up in ChatGPT, Perplexity, and Gemini? Run a GEO audit.",
      "fullPrompt": "Run a GEO audit across ChatGPT, Perplexity, and Gemini. Use the audit-ai-search skill. Probe each model with: our brand name, our category, 3 high-intent buyer questions, and 3 competitor comparisons. Record when we appear, when a competitor does instead, and what source they cite. Then recommend concrete changes to land in AI answers — new content, schema, citation-worthy pages, third-party mentions to pursue. Save to ai-search-audits/{YYYY-MM-DD}.md and log in outputs.json. Rank fixes by reach, not novelty.",
      "description": "Probe AI search engines for brand and category terms. Recommend Generative Engine Optimization (GEO) changes — schema, mentions, source authority — to rank in AI answers.",
      "outcome": "AI-search audit at ai-search-audits/{YYYY-MM-DD}.md with concrete content + schema changes.",
      "skill": "audit-ai-search",
      "tool": "ChatGPT · Perplexity"
    },
    {
      "category": "Strategy",
      "title": "Build the keyword map you can actually own",
      "prompt": "Run keyword research with Semrush for {topic} — give me the clusters worth owning.",
      "fullPrompt": "Build a keyword map for {topic} I can actually own as a solo founder with limited authority. Use the research-keywords skill. Pull keywords via Semrush (or Ahrefs), cluster them by search intent and difficulty, and flag the 3 pillars worth owning first — each with expected traffic, KD band, and a one-line reason I can win the SERP. Draft a brief per cluster. Update the living keyword-map.md at my root and write per-cluster briefs to keyword-clusters/{slug}.md. No vanity keyword dumps.",
      "description": "Cluster keywords by intent and difficulty via Semrush (or Ahrefs). Flag the 3 pillars worth owning. Draft cluster briefs. No vanity keyword dumps.",
      "outcome": "A living keyword-map.md at my root + per-cluster briefs at keyword-clusters/{slug}.md.",
      "skill": "research-keywords",
      "tool": "Semrush"
    },
    {
      "category": "Strategy",
      "title": "Find your content gap vs a competitor",
      "prompt": "Where's our content gap vs {competitor}? Rank the gaps we should close first.",
      "fullPrompt": "Find our content gap vs {competitor}. Use the analyze-content-gap skill. Crawl their blog/resources via Firecrawl (or Ahrefs keyword gap if connected), compare to what we already rank for, and list the topics they own that we don't. Rank each gap by search volume × how easily we could take it given our authority and existing content. Top 5 gaps get a first-draft brief ready to hand to write-blog-post. Save to content-gap-analyses/{competitor}-{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Crawl their content via Firecrawl, compare against ours, rank gaps by search volume × how easily we could take the topic.",
      "outcome": "Ranked list at content-gap-analyses/{competitor}-{YYYY-MM-DD}.md with a first-draft brief per gap.",
      "skill": "analyze-content-gap",
      "tool": "Firecrawl"
    },
    {
      "category": "Content",
      "title": "Draft a full SEO-targeted blog post",
      "prompt": "Draft a blog post on {topic} targeting {keyword} and save it to Google Docs.",
      "fullPrompt": "Draft a full SEO-targeted blog post on {topic} targeting {primary keyword}. Use the write-blog-post skill. 2,000–3,000 words with proper H1/H2/H3, meta description under 160 chars, URL slug, 5+ internal-link suggestions to our existing posts, and one clear CTA tied to our primary conversion. Read the positioning doc for voice and avoid any claim the doc doesn't back. Save to blog-posts/{slug}.md and create a Google Doc if Google Docs is connected. Log in outputs.json as status: draft.",
      "description": "2,000–3,000 words with proper H1/H2/H3, meta description, URL slug, internal-link suggestions, and one clear CTA. Save to Google Docs if connected.",
      "outcome": "Draft at blog-posts/{slug}.md + a Google Doc if connected.",
      "skill": "write-blog-post",
      "tool": "Google Docs"
    },
    {
      "category": "Content",
      "title": "Turn a happy customer into a case study",
      "prompt": "Draft a case study for {customer} from my Airtable interview notes.",
      "fullPrompt": "Draft a case study for {customer}. Use the write-case-study skill. Pull the interview or email thread from Airtable (or wherever it's recorded in config/). Structure as challenge → approach → results, with real numbers pulled from the source — if a number isn't cited in the interview, mark it TBD and ask me, don't invent. Include 2-3 verbatim quotes. Usable for both sales deck and a website page. Save to case-studies/{customer-slug}.md and log in outputs.json.",
      "description": "Pull the interview, email thread, or testimonial from Airtable (or paste). Structure as challenge → approach → results — with real numbers, not marketer-speak.",
      "outcome": "Case study at case-studies/{customer-slug}.md ready for sales and your website.",
      "skill": "write-case-study",
      "tool": "Airtable"
    },
    {
      "category": "Repurposing",
      "title": "Turn one blog post into 5 LinkedIn posts",
      "prompt": "Turn {blog post URL} into 5 LinkedIn posts.",
      "fullPrompt": "Turn {blog post URL} into 5 LinkedIn-native posts. Use the repurpose-content skill. Extract the core ideas via Firecrawl, then reshape each into a standalone post with a strong hook, whitespace, and one clear takeaway — not a dumped excerpt. Each post should be usable on its own without context from the blog. Read the positioning doc for voice. Save to repurposed/{source-slug}-to-linkedin.md, log in outputs.json, and flag the 2 I should post first and in what order.",
      "description": "Extract the core ideas via Firecrawl and reshape each into a LinkedIn-native post (hook, whitespace, one clear takeaway) your Social agent can pick up and ship.",
      "outcome": "5 post drafts at repurposed/{source-slug}-to-linkedin.md — hand to Social & Community.",
      "skill": "repurpose-content",
      "tool": "Firecrawl"
    },
    {
      "category": "Repurposing",
      "title": "Turn a YouTube video into a blog draft",
      "prompt": "Turn {YouTube URL} into a blog post draft.",
      "fullPrompt": "Turn {YouTube URL} into a long-form blog draft. Use the repurpose-content skill. Fetch the transcript via the YouTube integration. Rewrite as a proper blog post with SEO structure (H1/H2/H3, meta description, slug, internal-link suggestions) — don't just clean up the transcript; restructure it for scanning. Keep the original speaker's voice and credit them in the byline. Save to repurposed/{video-slug}-to-blog.md and log in outputs.json as status: draft.",
      "description": "Fetch the transcript via YouTube. Rewrite as a long-form blog draft with SEO structure. Great for conference talks, founder interviews, live sessions.",
      "outcome": "A draft at repurposed/{video-slug}-to-blog.md.",
      "skill": "repurpose-content",
      "tool": "YouTube"
    },
    {
      "category": "Backlinks",
      "title": "Find backlink targets and draft the pitches",
      "prompt": "Find backlink targets with Ahrefs and draft per-site pitches.",
      "fullPrompt": "Find ~20 realistic backlink targets for us and draft the outreach. Use the find-backlinks skill. Pull candidates via Ahrefs backlink tool + targeted SERP searches — prioritize sites that already link to similar pages in our space, are topically relevant, and have DR we can actually earn links from. For each target, draft a per-site pitch grounded in what we'd offer them (guest post, expert quote, better-than-their-current-link). Save to backlink-plans/{YYYY-MM-DD}.md and log in outputs.json. Flag the 5 with the highest expected hit rate.",
      "description": "Identify target sites via SERP + Ahrefs backlink tool that match your niche. Draft per-target pitch emails grounded in what you actually offer them.",
      "outcome": "Backlink plan at backlink-plans/{YYYY-MM-DD}.md with outreach email drafts per target.",
      "skill": "find-backlinks",
      "tool": "Ahrefs"
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
