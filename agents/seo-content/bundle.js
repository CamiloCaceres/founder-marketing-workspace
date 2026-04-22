// Houston agent dashboard bundle — SEO & Content.
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
