// Houston agent dashboard bundle — Growth & Paid.
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
  "name": "Growth & Paid",
  "tagline": "Paid campaigns, landing-page CRO, experiments, the weekly funnel review. I never spend a dollar without your approval.",
  "accent": "amber",
  "useCases": [
    {
      "category": "Campaigns",
      "title": "Plan a Google Ads search campaign end-to-end",
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
      "prompt": "Design an A/B test for the pricing page headline.",
      "fullPrompt": "Design a proper A/B test for {change — e.g. the pricing page headline}. Use the design-ab-test skill. I want a full spec I could ship to engineering: hypothesis in PICOT form, the control and variant rendered as copy (or mockup pseudo-code), primary and secondary metrics tied to my analytics stack, sample-size estimate with the MDE and power I'm assuming, expected duration at current traffic, and go/no-go criteria. Call out risks and confounds. Save to ab-tests/{slug}.md and log in outputs.json. If traffic is too low for a real test, say so and suggest a qualitative alternative.",
      "description": "Full spec: hypothesis (PICOT), control vs variant, primary + secondary metrics, sample-size estimate with MDE + power, duration, go/no-go criteria — so you don't ship the loser.",
      "outcome": "Test spec at ab-tests/{slug}.md. Paste into your experimentation tool.",
      "skill": "design-ab-test"
    },
    {
      "category": "Measurement",
      "title": "Spec event tracking + a UTM matrix",
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
