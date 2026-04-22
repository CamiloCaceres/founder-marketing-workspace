// Houston agent dashboard bundle — Growth & Paid.
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
  "name": "Growth & Paid",
  "tagline": "Paid campaigns, landing-page CRO, experiments, the weekly funnel review. I never spend a dollar without your approval.",
  "accent": "amber",
  "useCases": [
    {
      "category": "Campaigns",
      "title": "Plan a Google Ads search campaign end-to-end",
      "blurb": "Audience, keywords, budget, KPIs — agency-ready brief.",
      "prompt": "Plan a Google Ads search campaign for {keyword cluster}.",
      "fullPrompt": "Plan a Google Ads search campaign for {keyword cluster}. Use the plan-paid-campaign skill. Before writing, read the positioning doc and my config (channels, analytics, primary conversion). I want a full brief I could hand to an agency: audience + intent, keyword/placement strategy with negatives, ad-group structure, budget at three tiers (lean / base / aggressive), landing-page requirements, tracking + UTM plan, and KPI targets tied to my primary conversion. Save it to campaigns/google-ads-{slug}.md and log it in outputs.json. Be opinionated — tell me which ad group to launch first.",
      "description": "Full brief: audience, keyword/placement strategy, ad-group structure, suggested budget, landing-page requirements, KPI targets. Ready to hand to an agency or run yourself.",
      "outcome": "Campaign brief at campaigns/{channel}-{slug}.md — spec the experiment before you spend a dollar.",
      "skill": "plan-paid-campaign",
      "tool": "Google Ads"
    },
    {
      "category": "Competitive",
      "title": "Teardown a competitor's ads",
      "blurb": "Their live angles, hooks, and what to steal.",
      "prompt": "Teardown {competitor}'s current ads from Meta Ad Library and LinkedIn Ad Library.",
      "fullPrompt": "Pull {competitor}'s live ad creative from Meta Ad Library, LinkedIn Ad Library, and Google Ads Transparency via web-scrape. Use the monitor-competitor-ads skill. For each ad identify the angle, hook, offer, and which stage of the funnel it targets. Group by repeated angles (those are their bets). Write the teardown to competitor-ads/{competitor}-{YYYY-MM-DD}.md. Close with a 'steal this' list of 3 angles I should test against them — tied back to our positioning. Log it in outputs.json.",
      "description": "Pull their live creative from Meta Ad Library / LinkedIn Ad Library / Google Ads Transparency. Extract the angles, hooks, and offers they're testing.",
      "outcome": "Ad teardown at competitor-ads/{competitor}-{YYYY-MM-DD}.md — the best research for your own ad copy.",
      "skill": "monitor-competitor-ads",
      "tool": "Meta Ad Library"
    },
    {
      "category": "Ad copy",
      "title": "Draft ad copy grounded in real customer language",
      "blurb": "10 variants — each cites the review quote behind it.",
      "prompt": "Draft 10 ad variants grounded in real customer language from G2 reviews.",
      "fullPrompt": "Draft 10 ad variants for {campaign or product} grounded in actual customer language. Use the generate-ad-copy skill. Pull phrases from G2, Capterra, Trustpilot, and relevant Reddit threads via web-scrape. For each of the 10 variants write headline + description and cite the source quote that inspired it — verbatim, with link. No invented angles. No marketing adjectives that don't appear somewhere in the reviews. Save to ad-copy/{campaign-slug}.md and log it in outputs.json. Flag the 3 I should launch first and why.",
      "description": "Pull phrases from G2 / Capterra / Trustpilot (via web scrape) and write headlines + descriptions that sound like your customers talking — not like a marketer pitching.",
      "outcome": "Variants at ad-copy/{campaign-slug}.md with the source quote alongside each headline.",
      "skill": "generate-ad-copy",
      "tool": "G2"
    },
    {
      "category": "CRO",
      "title": "Rigorously critique a landing page",
      "blurb": "6 dimensions scored, fixes ranked by lift × effort.",
      "prompt": "Critique the landing page at {url}. Score each dimension and give me a fix list.",
      "fullPrompt": "I want a rigorous CRO teardown of {url}. Use the critique-landing-page skill and fetch the page via Firecrawl. Score 6 dimensions 0–3: headline clarity, value prop, social proof, CTA, objection handling, visual hierarchy. Call out above-the-fold vs below-the-fold separately. Then give me a prioritized fix list — each fix with the expected lift direction, effort (S/M/L), and the exact copy or element change. Save to cro-critiques/{url-slug}-{YYYY-MM-DD}.md and log in outputs.json. Don't hedge — I'll ship the top 3 fixes this week.",
      "description": "Fetch via Firecrawl. Score 6 dimensions 0–3: headline clarity, value prop, social proof, CTA, objection handling, visual hierarchy. Then a prioritized fix list — not a generic lecture.",
      "outcome": "Teardown at cro-critiques/{url-slug}-{YYYY-MM-DD}.md. Copy the fixes into your tracker.",
      "skill": "critique-landing-page",
      "tool": "Firecrawl"
    },
    {
      "category": "Experimentation",
      "title": "Design a proper A/B test, not a coin flip",
      "blurb": "Hypothesis, MDE, power, go/no-go — a real spec.",
      "prompt": "Design an A/B test for the pricing page headline.",
      "fullPrompt": "Design a proper A/B test for {change — e.g. the pricing page headline}. Use the design-ab-test skill. I want a full spec I could ship to engineering: hypothesis in PICOT form, the control and variant rendered as copy (or mockup pseudo-code), primary and secondary metrics tied to my analytics stack, sample-size estimate with the MDE and power I'm assuming, expected duration at current traffic, and go/no-go criteria. Call out risks and confounds. Save to ab-tests/{slug}.md and log in outputs.json. If traffic is too low for a real test, say so and suggest a qualitative alternative.",
      "description": "Full spec: hypothesis (PICOT), control vs variant, primary + secondary metrics, sample-size estimate with MDE + power, duration, go/no-go criteria — so you don't ship the loser.",
      "outcome": "Test spec at ab-tests/{slug}.md. Paste into your experimentation tool.",
      "skill": "design-ab-test"
    },
    {
      "category": "Measurement",
      "title": "Spec event tracking + a UTM matrix",
      "blurb": "Events, properties, owners — engineering-ready spec.",
      "prompt": "Spec the event tracking plan for sign-up → activation with GA4 and give me a UTM naming matrix.",
      "fullPrompt": "Spec the full event-tracking plan for sign-up → activation in GA4 (or my configured analytics tool — check config/). Use the setup-tracking skill. Define each event: name, trigger condition, required properties, owner on eng, and the funnel step it maps to. Then give me a UTM naming matrix so paid / social / email / referral are all comparable downstream — with concrete examples per channel. Save to tracking-plans/{slug}.md and log it in outputs.json. I'm going to hand this directly to engineering, so be exact.",
      "description": "Event names, triggers, properties, and owner per step. A UTM matrix so paid / social / email are comparable in GA4.",
      "outcome": "Plan at tracking-plans/{slug}.md you can hand to engineering.",
      "skill": "setup-tracking",
      "tool": "GA4"
    },
    {
      "category": "Measurement",
      "title": "Weekly funnel readout — find the leak",
      "blurb": "Biggest drop + 2–3 experiments ranked by lift/effort.",
      "prompt": "Give me the weekly funnel readout from PostHog — where are we leaking?",
      "fullPrompt": "Run the weekly funnel readout. Use the analyze-funnel skill. Pull last-7-days and trailing-4-week conversion at each step from my connected analytics (PostHog, GA4, or Mixpanel — whatever's in config/). Compare to the prior 4 weeks. Flag the biggest leak and whether it's new. Recommend 2–3 experiments ranked by expected lift × confidence ÷ effort — each with a one-line hypothesis. Save to funnel-reviews/{YYYY-MM-DD}.md and log it in outputs.json. No dashboard dumps — I want a decision, not a view.",
      "description": "Compute conversion at each step from connected analytics (PostHog / GA4 / Mixpanel). Flag the biggest drop, recommend 2–3 experiments ranked by expected lift vs effort.",
      "outcome": "Review at funnel-reviews/{YYYY-MM-DD}.md — clear next actions, not a dashboard dump.",
      "skill": "analyze-funnel",
      "tool": "PostHog"
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
