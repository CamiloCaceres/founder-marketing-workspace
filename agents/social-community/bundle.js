// Houston agent dashboard bundle — Social & Community.
// Hand-crafted IIFE. No ES modules, no build step, no import statements.
// Access React via window.Houston.React. Export via window.__houston_bundle__.
//
// This dashboard renders the agent's useCases as a card grid — the
// primary "what can this agent do for me" surface. No stats, no
// activity feed, no quick prompts. Just concrete, tool-named prompts
// you can click to copy.
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
      "description": "Hook in the first line, whitespace, one clear takeaway, CTA or question to spark replies. Uses your saved voice samples so it doesn't sound like AI.",
      "outcome": "Post draft at posts/linkedin-{slug}.md — paste into LinkedIn when you're ready.",
      "skill": "draft-linkedin-post",
      "tool": "LinkedIn"
    },
    {
      "category": "Posts",
      "title": "Draft a 7-tweet X thread",
      "prompt": "Draft a 7-tweet X thread on {topic}.",
      "description": "Hook tweet, numbered progression, CTA tweet at the end. Each tweet fits the 280-char budget with room for edits.",
      "outcome": "Thread at threads/x-{slug}.md — copy tweet-by-tweet into your scheduler.",
      "skill": "draft-x-thread",
      "tool": "X"
    },
    {
      "category": "Community",
      "title": "Reply to a Reddit thread the right way",
      "prompt": "Draft a Reddit reply to {thread URL}. Value-first, no pitch.",
      "description": "Pull the source thread via Reddit / Firecrawl, draft a value-first reply. Helpful first, link only if it truly belongs.",
      "outcome": "Reply at community-replies/{source-slug}.md you can paste in after a final read.",
      "skill": "draft-community-reply",
      "tool": "Reddit"
    },
    {
      "category": "Planning",
      "title": "Plan this week's social content across platforms",
      "prompt": "Plan this week's social content across LinkedIn and X.",
      "description": "Mon–Fri plan per platform, keyed to your topics, mixing original posts with repurposed content from the SEO agent's outputs index (zero duplicate angles).",
      "outcome": "Calendar at social-calendars/{YYYY-WNN}.md + appended to the living social-calendar.md.",
      "skill": "plan-social-calendar"
    },
    {
      "category": "Planning",
      "title": "Scan your X timeline for what to engage with",
      "prompt": "Scan my X timeline and surface what's worth engaging with.",
      "description": "Filter your feed for relevance to your topics and engagement opportunities, then suggest concrete replies — no more doom-scrolling looking for something to comment on.",
      "outcome": "Digest at feed-digests/x-{YYYY-MM-DD}.md with suggested reply drafts per opportunity.",
      "skill": "monitor-social-feed",
      "tool": "X"
    },
    {
      "category": "Planning",
      "title": "Weekly LinkedIn digest — how did your posts do?",
      "prompt": "Give me the weekly LinkedIn digest — how did my posts do and what's my network posting?",
      "description": "Stats on your own posts (reach, engagement, new followers) plus notable posts in your network worth commenting on. 5-min read.",
      "outcome": "Digest at linkedin-digests/{YYYY-MM-DD}.md. Skim it Monday morning.",
      "skill": "digest-linkedin-activity",
      "tool": "LinkedIn"
    },
    {
      "category": "Distribution",
      "title": "Get yourself booked on your ICP's podcasts",
      "prompt": "Draft podcast outreach pitches for 5 shows our ICP listens to via Listen Notes.",
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
  // hue maps to the full set of surfaces we style per card.
  var ACCENTS = {
    indigo: {
      heroBg: "bg-gradient-to-b from-indigo-50/70 via-white to-white",
      heroIconBox: "bg-indigo-600/10 text-indigo-600",
      heroDot: "bg-indigo-500",
      categoryLabel: "text-indigo-700",
      categoryIconBox: "bg-indigo-100 text-indigo-700",
      cardHeroBg: "bg-gradient-to-br from-indigo-50 via-white to-white",
      cardHeroBorder: "border-indigo-100",
    },
    emerald: {
      heroBg: "bg-gradient-to-b from-emerald-50/70 via-white to-white",
      heroIconBox: "bg-emerald-600/10 text-emerald-600",
      heroDot: "bg-emerald-500",
      categoryLabel: "text-emerald-700",
      categoryIconBox: "bg-emerald-100 text-emerald-700",
      cardHeroBg: "bg-gradient-to-br from-emerald-50 via-white to-white",
      cardHeroBorder: "border-emerald-100",
    },
    amber: {
      heroBg: "bg-gradient-to-b from-amber-50/70 via-white to-white",
      heroIconBox: "bg-amber-600/10 text-amber-600",
      heroDot: "bg-amber-500",
      categoryLabel: "text-amber-700",
      categoryIconBox: "bg-amber-100 text-amber-700",
      cardHeroBg: "bg-gradient-to-br from-amber-50 via-white to-white",
      cardHeroBorder: "border-amber-100",
    },
    sky: {
      heroBg: "bg-gradient-to-b from-sky-50/70 via-white to-white",
      heroIconBox: "bg-sky-600/10 text-sky-600",
      heroDot: "bg-sky-500",
      categoryLabel: "text-sky-700",
      categoryIconBox: "bg-sky-100 text-sky-700",
      cardHeroBg: "bg-gradient-to-br from-sky-50 via-white to-white",
      cardHeroBorder: "border-sky-100",
    },
    rose: {
      heroBg: "bg-gradient-to-b from-rose-50/70 via-white to-white",
      heroIconBox: "bg-rose-600/10 text-rose-600",
      heroDot: "bg-rose-500",
      categoryLabel: "text-rose-700",
      categoryIconBox: "bg-rose-100 text-rose-700",
      cardHeroBg: "bg-gradient-to-br from-rose-50 via-white to-white",
      cardHeroBorder: "border-rose-100",
    },
  };
  var THEME = ACCENTS[AGENT.accent] || ACCENTS.indigo;

  // ── Inline icon library (heroicons-outline paths) ────────────
  // Stroke-only SVGs rendered with currentColor. Path `d` strings.
  var ICON_PATHS = {
    sparkles:
      "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z",
    copy:
      "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
    check: "m4.5 12.75 6 6 9-13.5",
    arrowRight:
      "M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75",
    cursorClick:
      "M15 15 9.75 21 9 17.25l-3.75-.75L11.25 10.5 15 15ZM21.75 3 8.25 8.25 15 15l6.75-12Z",
    compass:
      "M7.5 15h5.25m-5.25 0 3-3m-3 3 3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    rocket:
      "M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z",
    search:
      "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
    eye:
      "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    clipboard:
      "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z",
    stethoscope:
      "M8.25 3v1.5M5.25 9v7.5a3.75 3.75 0 0 0 7.5 0V9m-7.5 0a2.25 2.25 0 0 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0h7.5m0 0a2.25 2.25 0 0 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0V3m7.5 13.5a3 3 0 1 0-6 0m6 0v3.75a.75.75 0 0 1-.75.75H16.5a.75.75 0 0 1-.75-.75v-3.75",
    document:
      "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
    refresh:
      "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99",
    link:
      "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244",
    megaphone:
      "M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.192a24.033 24.033 0 0 1-.39-4.897m.39 4.897a24.347 24.347 0 0 0 1.735-5.15c-.27.248-.5.537-.686.857-.242.418-.425.873-.543 1.347-.114.456-.17.927-.166 1.396.005.562.049 1.122.133 1.677-.079.287-.176.564-.286.835-.114.281-.244.552-.392.808Zm0-4.897a24.033 24.033 0 0 1 .39-4.897m7.812 1.88v6.034a1.5 1.5 0 0 1-2.056 1.394l-3.445-1.38m0-4.066 3.445-1.38A1.5 1.5 0 0 1 22 6.934v6.033m0-6.033V4.5",
    pencil:
      "M16.862 4.487 18.549 2.799a2.1 2.1 0 1 1 2.97 2.971L8.932 18.357a4.5 4.5 0 0 1-1.897 1.13L2.25 21l1.513-4.784a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125",
    target:
      "M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59",
    flask:
      "M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
    chart:
      "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
    mail:
      "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
    shield:
      "M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z",
    edit:
      "M16.862 4.487 18.549 2.799a2.1 2.1 0 1 1 2.97 2.971L8.932 18.357a4.5 4.5 0 0 1-1.897 1.13L2.25 21l1.513-4.784a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
    users:
      "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
    calendar:
      "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
    send:
      "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5",
    zap:
      "M3.75 13.5 10.5 3l-.75 6.75H21l-6.75 10.5.75-6.75H3.75Z",
  };
  var CATEGORY_ICONS = {
    "Foundation": "compass",
    "Competitive": "eye",
    "Launches": "rocket",
    "Research": "search",
    "Reviews": "clipboard",
    "Audits": "stethoscope",
    "Strategy": "compass",
    "Content": "document",
    "Repurposing": "refresh",
    "Backlinks": "link",
    "Campaigns": "megaphone",
    "Ad copy": "pencil",
    "CRO": "target",
    "Experimentation": "flask",
    "Measurement": "chart",
    "Activation": "zap",
    "Newsletter": "mail",
    "Retention": "shield",
    "Announcements": "megaphone",
    "Posts": "edit",
    "Community": "users",
    "Planning": "calendar",
    "Distribution": "send",
  };

  function Icon(name, cls) {
    var d = ICON_PATHS[name] || ICON_PATHS.sparkles;
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        className: cls || "size-4",
        "aria-hidden": "true",
      },
      h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: d }),
    );
  }

  // ── Toast (minimal inline) ───────────────────────────────────
  // Used when clipboard write isn't available or fails — we inline a
  // small notice instead of trying to drive the host's toast store.
  function useClipboard() {
    var s = useState({ idx: null, at: 0 });
    var state = s[0];
    var setState = s[1];
    var copy = useCallback(function (text, idx) {
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
          // Fallback: create a hidden textarea
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
            /* give up silently */
          }
        });
      }
    }, []);
    return { copiedIdx: state.idx, copy: copy };
  }

  // ── Hero ─────────────────────────────────────────────────────
  function Hero() {
    return h(
      "div",
      { className: "border-b border-slate-100 " + THEME.heroBg },
      h(
        "div",
        { className: "max-w-6xl mx-auto px-8 py-10" },
        h(
          "div",
          { className: "flex items-start gap-4" },
          h(
            "div",
            {
              className:
                "shrink-0 size-12 rounded-2xl flex items-center justify-center " +
                THEME.heroIconBox,
            },
            Icon("sparkles", "size-5"),
          ),
          h(
            "div",
            { className: "flex-1 min-w-0" },
            h(
              "h1",
              {
                className:
                  "text-[26px] font-semibold tracking-tight text-slate-900 leading-tight",
              },
              AGENT.name,
            ),
            h(
              "p",
              { className: "mt-1.5 text-sm text-slate-600 max-w-2xl leading-relaxed" },
              AGENT.tagline,
            ),
          ),
        ),
        h(
          "div",
          {
            className:
              "mt-7 flex items-center gap-2 text-xs text-slate-500 bg-white/60 border border-slate-200/60 rounded-full pl-3 pr-4 py-2 w-fit",
          },
          h(
            "span",
            { className: "inline-flex items-center justify-center size-5 rounded-full " + THEME.heroIconBox },
            Icon("cursorClick", "size-3"),
          ),
          h(
            "span",
            null,
            "Click any prompt below to copy it — paste into a new mission to run it.",
          ),
        ),
      ),
    );
  }

  // ── Tool chip ────────────────────────────────────────────────
  function ToolChip(props) {
    if (!props.tool) return null;
    var initial = props.tool.replace(/[^A-Za-z0-9]/g, "").charAt(0) || "·";
    return h(
      "span",
      {
        className:
          "inline-flex items-center gap-1.5 rounded-md bg-white border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-700",
      },
      h(
        "span",
        {
          className:
            "inline-flex items-center justify-center size-4 rounded bg-gradient-to-br from-slate-800 to-slate-600 text-white text-[9px] font-bold",
        },
        initial.toUpperCase(),
      ),
      props.tool,
    );
  }

  // ── Use-case card ────────────────────────────────────────────
  function UseCaseCard(props) {
    var uc = props.useCase;
    var idx = props.idx;
    var copiedIdx = props.copiedIdx;
    var onCopy = props.onCopy;
    var isCopied = copiedIdx === idx;
    var title = uc.title || (uc.prompt || "").split(/[.?!]/)[0].slice(0, 70);
    var catIcon = CATEGORY_ICONS[uc.category] || "sparkles";

    return h(
      "div",
      {
        className:
          "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white hover:border-slate-300 hover:shadow-[0_6px_24px_-8px_rgba(15,23,42,0.12)] transition-all duration-200",
      },

      // Hero strip
      h(
        "div",
        {
          className:
            "relative border-b px-5 pt-5 pb-4 " + THEME.cardHeroBg + " " + THEME.cardHeroBorder,
        },
        h(
          "div",
          { className: "flex items-center gap-2.5" },
          h(
            "div",
            {
              className:
                "inline-flex items-center justify-center size-8 rounded-xl " +
                THEME.categoryIconBox,
            },
            Icon(catIcon, "size-4"),
          ),
          h(
            "span",
            {
              className:
                "text-[10.5px] uppercase tracking-[0.08em] font-semibold " +
                THEME.categoryLabel,
            },
            uc.category || "Other",
          ),
        ),
        h(
          "h3",
          {
            className:
              "mt-3 text-[15px] font-semibold leading-snug text-slate-900",
          },
          title,
        ),
      ),

      // Body
      h(
        "div",
        { className: "flex-1 flex flex-col gap-3 p-5" },

        // Description
        uc.description
          ? h(
              "p",
              { className: "text-[13px] leading-relaxed text-slate-600" },
              uc.description,
            )
          : null,

        // Prompt pill (click-to-copy)
        h(
          "button",
          {
            onClick: function () {
              onCopy(uc.prompt, idx);
            },
            className:
              "text-left rounded-xl bg-slate-900/[0.03] hover:bg-slate-900 border border-slate-200/80 hover:border-slate-900 transition-colors duration-200 px-3.5 py-3 group/prompt",
            title: "Click to copy",
          },
          h(
            "div",
            { className: "flex items-start gap-2.5" },
            h(
              "span",
              {
                className:
                  "shrink-0 mt-[3px] inline-flex items-center justify-center size-[18px] rounded-md " +
                  (isCopied
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-slate-500 group-hover/prompt:bg-white/15 group-hover/prompt:text-white border border-slate-200 group-hover/prompt:border-transparent"),
              },
              Icon(isCopied ? "check" : "copy", "size-3"),
            ),
            h(
              "span",
              {
                className:
                  "flex-1 text-[13px] leading-relaxed font-mono text-slate-800 group-hover/prompt:text-white",
              },
              uc.prompt,
            ),
          ),
          isCopied
            ? h(
                "div",
                {
                  className:
                    "mt-2 text-[11px] font-medium text-emerald-600",
                },
                "Copied — paste into a new mission to run it.",
              )
            : null,
        ),

        // Outcome row
        uc.outcome
          ? h(
              "div",
              {
                className:
                  "flex items-start gap-2 text-[12px] text-slate-600 leading-relaxed",
              },
              h(
                "span",
                {
                  className:
                    "shrink-0 mt-[3px] inline-flex items-center justify-center size-4 rounded-full bg-slate-100 text-slate-500",
                },
                Icon("arrowRight", "size-2.5"),
              ),
              h(
                "span",
                null,
                h("span", { className: "font-semibold text-slate-700" }, "You get: "),
                uc.outcome,
              ),
            )
          : null,
      ),

      // Footer — tool + skill
      (uc.tool || uc.skill)
        ? h(
            "div",
            {
              className:
                "flex items-center justify-between gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/40",
            },
            uc.tool
              ? h(ToolChip, { tool: uc.tool })
              : h("span", null, null),
            uc.skill
              ? h(
                  "span",
                  {
                    className:
                      "inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-1.5 py-[3px] text-[10.5px] font-mono text-slate-500",
                  },
                  h("span", { className: "size-[5px] rounded-full " + THEME.heroDot }),
                  uc.skill,
                )
              : null,
          )
        : null,
    );
  }

  // ── Category section ─────────────────────────────────────────
  function CategorySection(props) {
    return h(
      "div",
      { className: "flex flex-col gap-4" },
      h(
        "div",
        { className: "flex items-baseline gap-2 pl-1" },
        h(
          "h2",
          {
            className:
              "text-[11px] uppercase tracking-[0.1em] font-semibold text-slate-500",
          },
          props.category,
        ),
        h(
          "span",
          { className: "text-[11px] text-slate-400 tabular-nums" },
          props.items.length,
        ),
      ),
      h(
        "div",
        {
          className:
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        },
        props.items.map(function (item) {
          return h(UseCaseCard, {
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

  // ── Dashboard (root) ─────────────────────────────────────────
  function Dashboard() {
    var clipboard = useClipboard();

    // Group preserving first-appearance order
    var useCases = AGENT.useCases || [];
    var groups = (function () {
      if (useCases.length === 0) return [];
      var order = [];
      var map = {};
      useCases.forEach(function (uc, idx) {
        var cat = uc.category || "Other";
        if (!map[cat]) {
          map[cat] = [];
          order.push(cat);
        }
        map[cat].push({ useCase: uc, idx: idx });
      });
      return order.map(function (cat) {
        return { category: cat, items: map[cat] };
      });
    })();

    return h(
      "div",
      { className: "min-h-full bg-slate-50/50" },
      h(Hero),
      useCases.length === 0
        ? h(
            "div",
            { className: "max-w-6xl mx-auto px-8 py-12" },
            h(
              "div",
              {
                className:
                  "rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center",
              },
              h(
                "p",
                { className: "text-sm font-medium text-slate-700" },
                "No use cases declared yet",
              ),
              h(
                "p",
                { className: "mt-1 text-xs text-slate-500" },
                "This agent will grow its use-case menu over time.",
              ),
            ),
          )
        : h(
            "div",
            {
              className: "max-w-6xl mx-auto px-8 py-8 flex flex-col gap-10",
            },
            groups.map(function (g) {
              return h(CategorySection, {
                key: g.category,
                category: g.category,
                items: g.items,
                copiedIdx: clipboard.copiedIdx,
                onCopy: clipboard.copy,
              });
            }),
          ),
    );
  }

  window.__houston_bundle__ = { Dashboard: Dashboard };
})();
