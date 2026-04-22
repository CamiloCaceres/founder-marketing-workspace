// Houston agent dashboard bundle — Lifecycle & Email.
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
  "name": "Lifecycle & Email",
  "tagline": "Welcome series, newsletters, drips, churn-save, product announcements. Drafts only — I never send.",
  "accent": "sky",
  "useCases": [
    {
      "category": "Activation",
      "title": "Draft a 5-email welcome series for new signups",
      "prompt": "Draft a 5-email welcome series for new signups in Customer.io.",
      "fullPrompt": "Draft a 5-email welcome series for new signups. Use the draft-welcome-sequence skill. Default cadence is Day 0 / 1 / 3 / 7 / 14 — override if config/ says my product needs a different activation window. Each email: subject, preview text, body in my voice, primary CTA tied to the next activation step, and the success metric that says it worked. Format for my connected email platform (Customer.io or whatever's in config/). Read the positioning doc for voice and value-prop claims. Save to sequences/welcome-{variant}.md and log in outputs.json as status: draft. I'll review before anything ships.",
      "description": "Day 0 / 1 / 3 / 7 / 14 sequence (override any cadence). Each email: subject, preview, body, CTA, success metric. Formatted for your connected ESP.",
      "outcome": "A full sequence at sequences/welcome-{variant}.md. Drop it into your email platform and ship.",
      "skill": "draft-welcome-sequence",
      "tool": "Customer.io"
    },
    {
      "category": "Activation",
      "title": "Re-activate signups who never activated",
      "prompt": "Design a re-activation drip in Customer.io for users who signed up but never activated.",
      "fullPrompt": "Design a re-activation drip for users who signed up but never hit my activation event. Use the design-lifecycle-campaign skill. Define: the trigger event and eligibility window (from config/milestones.json), frequency rules, exit criteria, and branching logic when the user activates mid-drip. Draft every email in the flow with subject/preview/body/CTA in my voice. Be honest about when to stop emailing — dead accounts shouldn't get 10 emails. Save to drips/{slug}.md with every branch labeled and log in outputs.json as status: draft.",
      "description": "Event-triggered drip: trigger event, frequency rules, branching if the user takes the desired action, drafted copy per email. Honest about when to stop emailing.",
      "outcome": "Drip plan at drips/{slug}.md with every email drafted and every branch labeled.",
      "skill": "design-lifecycle-campaign",
      "tool": "Customer.io"
    },
    {
      "category": "Newsletter",
      "title": "Draft this week's newsletter",
      "prompt": "Draft this week's newsletter for Beehiiv — here's what shipped: {paste details}.",
      "fullPrompt": "Draft this week's newsletter. Use the write-newsletter skill. Source material: what shipped this week — {paste details or point to the SEO agent's blog-posts/ or the Head of Marketing's reviews/ folder}. Pick ONE through-line for the issue — not 5 updates glued together. Write a subject line that earns the open, preview text that delivers on it, and a body in my voice with a clear next step. Format for my newsletter platform (Beehiiv or whatever's in config/). Save to newsletters/{YYYY-MM-DD}.md and log in outputs.json as status: draft.",
      "description": "Subject + preview + body, with one clear through-line (not 5 updates glued together). Can pull source material from SEO agent's outputs if you point me there.",
      "outcome": "Newsletter at newsletters/{YYYY-MM-DD}.md ready for Beehiiv.",
      "skill": "write-newsletter",
      "tool": "Beehiiv"
    },
    {
      "category": "Retention",
      "title": "Save a downgrade without the guilt trip",
      "prompt": "Draft a save email for accounts that downgraded in Stripe.",
      "fullPrompt": "Draft a churn-save email for accounts that downgraded or canceled. Use the draft-churn-save skill. Pull the downgrade/cancellation signal from my billing system (Stripe or whatever's in config/). No guilt tactics, no fake scarcity, no 'we'll miss you' sap. Offer a genuine option: pause, downgrade further, concierge onboarding, or a refund if relevant. Voice matches how I'd actually write to a customer I respect. Save to saves/{persona}.md with variants for 1–2 common downgrade reasons, and log in outputs.json as status: draft.",
      "description": "Pull the downgrade signal from Stripe. No guilt tactics, no fake scarcity. Offer a genuine option (pause / downgrade further / concierge help / refund).",
      "outcome": "Save email at saves/{persona}.md — one version you can send or adapt.",
      "skill": "draft-churn-save",
      "tool": "Stripe"
    },
    {
      "category": "Announcements",
      "title": "Product announcement: email + in-app, coordinated",
      "prompt": "Plan the email + in-app announcement for {feature}.",
      "fullPrompt": "Plan the announcement for {feature} — email + in-app, coordinated. Use the plan-product-announcement skill. If the Head of Marketing has a launch plan at ../head-of-marketing/launches/{slug}.md, read it first and match the narrative. Deliver: (1) the announcement email — subject, preview, body, CTA, send segment — and (2) the in-app copy — banner headline, modal title/body, and an empty-state nudge for users who haven't used the feature yet. One voice, one core message across both. Save to announcements/{feature-slug}.md and log in outputs.json as status: draft.",
      "description": "Announcement email AND matching in-app copy (banner / modal / empty-state nudge), keyed to the Head of Marketing's launch plan if one exists.",
      "outcome": "A full announcement set at announcements/{feature-slug}.md — email body + in-app strings together.",
      "skill": "plan-product-announcement"
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
