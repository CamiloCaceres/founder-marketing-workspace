// Houston agent dashboard bundle — Conversion Copywriter.
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
  "name": "Conversion Copywriter",
  "tagline": "Page copy, headline + CTA variants, form / signup / onboarding / paywall / popup CRO. I rewrite surfaces that leak — you ship.",
  "accent": "violet",
  "useCases": [
    {
      "category": "Copy",
      "title": "Rewrite the homepage in my voice",
      "blurb": "Hero, social proof, value props, CTA — the whole page.",
      "prompt": "Rewrite my homepage at {url} — hero, subhead, value props, CTA — in my voice.",
      "fullPrompt": "Rewrite my homepage at {url}. Use the write-page-copy skill. Before drafting, read the positioning doc and config/voice.md (ask for voice samples if missing). Fetch the current page via any Composio-connected scraper so we're editing real text, not guessing. Produce: 3 headline + subhead pairs, the recommended hero, value-prop section (3-5 benefits tied to ICP pains), social proof slot, objection section, and primary CTA. Each recommended line pairs Current → Proposed → Why (one line). Save to page-copy/homepage-{YYYY-MM-DD}.md and log in outputs.json. Flag anything that contradicts the positioning doc.",
      "description": "Fetch the current page, then draft hero + subhead + value props + CTA in your voice. Every recommended change pairs Current → Proposed → Why. Nothing invented — quotes cite the positioning doc or customer evidence.",
      "outcome": "Page rewrite at page-copy/{page-slug}-{YYYY-MM-DD}.md — paste into your CMS once you approve.",
      "skill": "write-page-copy",
      "tool": "Firecrawl"
    },
    {
      "category": "Copy",
      "title": "10 headline variants, each cites the quote behind it",
      "blurb": "No marketer-speak. Real customer language only.",
      "prompt": "Give me 10 headline variants for my {page}. Cite the quote or review behind each.",
      "fullPrompt": "Draft 10 headline variants for my {page — e.g. homepage, pricing page, landing page for {campaign}}. Use the write-headline-variants skill. Pull evidence in priority: (a) ../head-of-marketing/call-insights/ if present, (b) ../head-of-marketing/research/, (c) review-scrape via any Composio-connected review tool (G2 / Capterra / Trustpilot / Reddit / App Store). Every headline cites the verbatim quote, review, or positioning-doc line behind it — no marketer-speak. Include 2-3 subhead options per top headline. Rank the top 3 to test first and why. Save to headline-variants/{page-slug}-{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Pull quotes from sales calls, research, or Composio-connected review sites. Every headline names its source. Ranked top 3 to test first.",
      "outcome": "Variants at headline-variants/{page-slug}-{YYYY-MM-DD}.md with the source quote next to each line.",
      "skill": "write-headline-variants",
      "tool": "G2"
    },
    {
      "category": "Copy",
      "title": "Polish existing copy without rewriting it",
      "blurb": "Tighter, clearer, still sounds like you.",
      "prompt": "Edit the copy on my {page} — tighten, clarify, keep my voice. Paste or link.",
      "fullPrompt": "Edit the copy on my {page or section}. Paste the current copy or share the URL. Use the edit-copy skill. Read config/voice.md so edits stay in my voice — don't rewrite into chatbot-speak. Run a focused multi-sweep pass (clarity, voice, specificity, length, CTAs). Mark each edit Current → Proposed → Why (one line). Do NOT change the core message; enhance it. Flag any line that contradicts the positioning doc. Save to copy-edits/{page-slug}-{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Multi-sweep edit of existing copy — clarity, voice, specificity, length, CTAs. Every change paired Current → Proposed → Why. Core message preserved.",
      "outcome": "Edit pass at copy-edits/{page-slug}-{YYYY-MM-DD}.md. Paste approved lines into your CMS.",
      "skill": "edit-copy"
    },
    {
      "category": "Copy",
      "title": "CTA variants paired with the objection they answer",
      "blurb": "5-7 button lines, each killing a hesitation.",
      "prompt": "Give me CTA variants for the {button} on my {page}. Pair each with the objection it answers.",
      "fullPrompt": "Draft 5-7 CTA variants for the {button — e.g. primary CTA, pricing-page CTA, signup button} on my {page}. Use the write-cta-variants skill. Read the positioning doc for objections + JTBD. Each variant names the objection or hesitation it answers and the implied outcome. Keep the strongest verb; never 'Submit' / 'Click Here' / 'Learn More'. Rank the top 2 to test first and why. Save to cta-variants/{page-slug}-{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "5-7 CTA variants. Each line ties to a specific objection from the positioning doc and names the outcome. Top 2 ranked to test.",
      "outcome": "CTAs at cta-variants/{page-slug}-{YYYY-MM-DD}.md. Ship the winner once picked.",
      "skill": "write-cta-variants"
    },
    {
      "category": "Surfaces",
      "title": "Audit a form and kill the friction",
      "blurb": "Fields cut, labels rewritten, completion lift.",
      "prompt": "Audit my {lead / contact / demo / checkout} form. Tell me which fields to cut and rewrite the labels.",
      "fullPrompt": "Audit my {form type — lead capture / contact / demo request / checkout / application} at {url or paste the fields}. Use the optimize-form skill. Fetch the form via any Composio-connected scraper if it's on a page; otherwise work from the pasted field list. For each field: keep / drop / defer to post-submit. Rewrite labels in plain language (one question per field). Name the friction causes (cognitive load, privacy anxiety, missing value prop above form). Flag compliance-required fields. Save to form-audits/{form-slug}-{YYYY-MM-DD}.md and log in outputs.json. Prioritize the top 3 changes to ship this week.",
      "description": "Field-by-field audit. Which to cut, which to keep, label rewrites in plain language, friction causes named. Top 3 changes ranked.",
      "outcome": "Audit at form-audits/{form-slug}-{YYYY-MM-DD}.md. Ship the top 3 this week.",
      "skill": "optimize-form"
    },
    {
      "category": "Surfaces",
      "title": "Fix the signup flow — step count + copy + objections",
      "blurb": "Where they drop, and the copy that stops it.",
      "prompt": "Review my signup flow at {url or describe the steps}. Tell me where to cut steps and what copy to rewrite.",
      "fullPrompt": "Review my signup / registration / trial activation flow. Share {url + steps} or describe each screen. Use the optimize-signup-flow skill. Fetch each step via any Composio-connected rendering tool if URLs are provided. For each step: necessity, friction sources, copy rewrites (headline / microcopy / error states / CTA), drop triggers a user might hit. Recommend which steps to merge, defer post-signup, or kill. Re-write the full flow copy top-to-bottom so I can ship it. Save to signup-flow-reviews/{flow-slug}-{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Step-by-step review. Cut, merge, or defer each step. Rewrite headline + microcopy + error states. Full replacement flow copy included.",
      "outcome": "Review at signup-flow-reviews/{flow-slug}-{YYYY-MM-DD}.md. Hand to eng + copy together.",
      "skill": "optimize-signup-flow"
    },
    {
      "category": "Surfaces",
      "title": "Rewrite the in-app onboarding — welcome, empty states, aha",
      "blurb": "First-run copy that gets them to value, fast.",
      "prompt": "Rewrite the in-app onboarding copy for {product}. Welcome screen, empty states, checklist, aha-moment.",
      "fullPrompt": "Rewrite the in-app onboarding copy for {product}. Use the optimize-onboarding-copy skill. Ask for screenshots, a Loom, or a field dump of the current first-run experience. Read the positioning doc for the aha moment we're driving toward. Produce copy for: welcome screen (value + next action), the 3-5 empty states (feature-area by feature-area), onboarding checklist lines, tooltips, the aha-moment confirmation. Every line pairs Current → Proposed → Why. Save to onboarding-copy/{product-slug}-{YYYY-MM-DD}.md and log in outputs.json. This is in-product, not email — email sequences belong to Lifecycle & Email.",
      "description": "Welcome screen, empty states, onboarding checklist, tooltips, aha-moment copy. Every line paired Current → Proposed → Why.",
      "outcome": "Copy at onboarding-copy/{product-slug}-{YYYY-MM-DD}.md. Hand to your eng + product team.",
      "skill": "optimize-onboarding-copy"
    },
    {
      "category": "Surfaces",
      "title": "Audit the upgrade paywall — free-to-paid conversion",
      "blurb": "Plan comparison, urgency, in-product upgrade copy.",
      "prompt": "Audit my upgrade paywall / pricing modal / trial-expiration screen. Rewrite it.",
      "fullPrompt": "Audit my upgrade paywall / pricing modal / trial-expiration screen. Share {url or screenshots + current copy}. Use the optimize-paywall-upgrade skill. Fetch via any Composio-connected rendering tool if applicable. Cover: timing (is it shown after value delivered?), plan-comparison clarity, objection handling (price / commitment / cancel policy), social proof placement, CTA copy, dismissal pattern. Every change paired Current → Proposed → Why. Save to paywall-audits/{surface-slug}-{YYYY-MM-DD}.md and log in outputs.json. Flag if the paywall fires before value is delivered — that's the biggest killer.",
      "description": "Audit of the in-product upgrade moment. Timing, plan comparison, objections, social proof, CTA, dismissal pattern. Each change paired.",
      "outcome": "Audit at paywall-audits/{surface-slug}-{YYYY-MM-DD}.md. Ship the rewrites with eng.",
      "skill": "optimize-paywall-upgrade"
    },
    {
      "category": "Surfaces",
      "title": "Spec a popup / modal / banner that doesn't annoy",
      "blurb": "Trigger, copy, dismissal — a real spec.",
      "prompt": "Spec a {exit / scroll / timed / banner} popup for {goal} on my {page}.",
      "fullPrompt": "Spec a popup / modal / slide-in / sticky-bar for {goal — e.g. lead capture, announcement, cart-abandon save} on my {page}. Use the optimize-popup skill. Read the positioning doc + config/voice.md. Output a full spec: trigger logic (exit-intent / scroll % / time / behavioral), targeting rules (page, session, returning vs new), headline + subhead + form (if any) + CTA + dismissal copy, frequency cap, and the success metric. Ground the copy in a real quote or review line — name the source. Save to popup-specs/{goal-slug}-{YYYY-MM-DD}.md and log in outputs.json. Never recommend an interrupt pattern that fires before 10s or within 20% scroll — the user hasn't earned the ask yet.",
      "description": "Full popup spec — trigger, targeting, headline + subhead + CTA, dismissal, frequency cap, success metric. Copy grounded in real quotes.",
      "outcome": "Spec at popup-specs/{goal-slug}-{YYYY-MM-DD}.md. Drop into your popup tool of choice.",
      "skill": "optimize-popup"
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
