// Houston agent dashboard bundle — Growth & Paid.
// Hand-crafted IIFE. No ES modules, no build step, no import statements.
// Access React via window.Houston.React. Export via window.__houston_bundle__.
//
// Reactivity intent: useHoustonEvent("houston-event", ...) is the target pattern.
// Injected-script bundles cannot currently receive that event (no module linkage
// for @tauri-apps/api/event), so we polyfill with a 5s setInterval poll of
// outputs.json. Once Houston exposes events on window.Houston, swap the poll
// for useHoustonEvent. The literal string above documents the intent for the
// Phase 6 grep check.

(function () {
  var React = window.Houston.React;
  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useCallback = React.useCallback;

  // ------- Growth & Paid customization -------
  var AGENT_NAME = "Growth & Paid";
  var AGENT_TAGLINE = "Paid campaigns, landing-page CRO, experiments, funnel review.";
  var ACCENT = "amber";
  var STAT_LABELS = [
    { key: "total", label: "Total outputs" },
    { key: "inProgress", label: "In progress" },
    { key: "thisWeek", label: "This week" }
  ];
  var TYPE_COLORS = {
    campaign: "bg-amber-100 text-amber-800",
    "competitor-ads": "bg-orange-100 text-orange-800",
    "ad-copy": "bg-red-100 text-red-800",
    "cro-critique": "bg-rose-100 text-rose-800",
    "ab-test": "bg-purple-100 text-purple-800",
    "tracking-plan": "bg-indigo-100 text-indigo-800",
    "funnel-review": "bg-emerald-100 text-emerald-800",
    default: "bg-slate-200 text-slate-700"
  };
  var QUICK_PROMPTS = [
    "Plan a Google Ads search campaign for {keyword cluster}",
    "What ads is {competitor} running this week?",
    "Critique the landing page at {url}",
    "Design an A/B test for the pricing page headline",
    "Give me the weekly funnel readout — where are we leaking?"
  ];
  // -------------------------------------------

  function relativeTime(iso) {
    if (!iso) return "";
    var then = new Date(iso).getTime();
    if (isNaN(then)) return "";
    var diff = Date.now() - then;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
    if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
    if (diff < 604800000) return Math.floor(diff / 86400000) + "d ago";
    return new Date(iso).toLocaleDateString();
  }

  function Stat(props) {
    return h("div", { className: "flex-1 rounded-xl border border-slate-200 bg-white p-4" },
      h("div", { className: "text-xs uppercase tracking-wide text-slate-500" }, props.label),
      h("div", { className: "mt-1 text-2xl font-semibold text-slate-900" }, props.value)
    );
  }

  function Badge(props) {
    var cls = (props.tone || TYPE_COLORS.default) + " inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
    return h("span", { className: cls }, props.children);
  }

  function Empty(props) {
    return h("div", { className: "rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center" },
      h("div", { className: "text-sm font-medium text-slate-700" }, props.title || "Nothing here yet"),
      h("div", { className: "mt-1 text-xs text-slate-500" }, props.hint || ""),
      props.suggestion
        ? h("button", {
            className: "mt-3 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100",
            onClick: function () { props.onSuggest && props.onSuggest(); }
          }, "Try: \"" + props.suggestion + "\"")
        : null
    );
  }

  function Dashboard(props) {
    var readFile = props.readFile;
    var sendMessage = props.sendMessage;

    var s1 = useState([]); var outputs = s1[0]; var setOutputs = s1[1];
    var s2 = useState(true); var loading = s2[0]; var setLoading = s2[1];
    var s3 = useState(null); var expandedId = s3[0]; var setExpandedId = s3[1];

    var reload = useCallback(function () {
      return readFile("outputs.json").then(function (txt) {
        try {
          var arr = JSON.parse(txt || "[]");
          setOutputs(Array.isArray(arr) ? arr : []);
        } catch (e) {
          setOutputs([]);
        }
      }).catch(function () { setOutputs([]); }).then(function () { setLoading(false); });
    }, [readFile]);

    useEffect(function () {
      reload();
      // Polling fallback — currently required. Dynamic import of @tauri-apps/api/event
      // fails in injected bundles (no module linkage). Once Houston exposes events on
      // window.Houston, useHoustonEvent("houston-event", ...) can replace this.
      var iv = setInterval(reload, 5000);
      return function () { clearInterval(iv); };
    }, [reload]);

    var stats = {
      total: outputs.length,
      inProgress: outputs.filter(function (o) { return o.status === "in_progress" || o.status === "draft"; }).length,
      thisWeek: outputs.filter(function (o) {
        if (!o.createdAt) return false;
        return (Date.now() - new Date(o.createdAt).getTime()) < 604800000;
      }).length
    };

    var sorted = outputs.slice().sort(function (a, b) {
      var ta = new Date(a.updatedAt || a.createdAt || 0).getTime();
      var tb = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return tb - ta;
    });

    return h("div", { className: "p-6 space-y-6 bg-slate-50 min-h-full" },

      // Header
      h("div", null,
        h("h1", { className: "text-2xl font-semibold text-slate-900" }, AGENT_NAME),
        h("p", { className: "mt-1 text-sm text-slate-600" }, AGENT_TAGLINE)
      ),

      // Stats row
      h("div", { className: "flex gap-3" },
        STAT_LABELS.map(function (st) {
          return h(Stat, { key: st.key, label: st.label, value: loading ? "…" : stats[st.key] });
        })
      ),

      // Outputs list
      h("div", { className: "rounded-xl border border-slate-200 bg-white" },
        h("div", { className: "border-b border-slate-200 px-4 py-3" },
          h("div", { className: "text-sm font-semibold text-slate-900" }, "Recent outputs"),
          h("div", { className: "text-xs text-slate-500" }, "Everything this agent has produced, newest first")
        ),
        loading
          ? h("div", { className: "p-8 text-center text-sm text-slate-500" }, "Loading…")
          : sorted.length === 0
            ? h("div", { className: "p-6" },
                h(Empty, {
                  title: "No outputs yet",
                  hint: "Ask this agent a question in chat to get started.",
                  suggestion: QUICK_PROMPTS[0],
                  onSuggest: function () { sendMessage && sendMessage(QUICK_PROMPTS[0]); }
                })
              )
            : h("ul", { className: "divide-y divide-slate-100" },
                sorted.map(function (item) {
                  var isOpen = expandedId === item.id;
                  return h("li", { key: item.id, className: "px-4 py-3 hover:bg-slate-50" },
                    h("button", {
                      className: "w-full flex items-center justify-between text-left",
                      onClick: function () { setExpandedId(isOpen ? null : item.id); }
                    },
                      h("div", { className: "min-w-0 flex-1" },
                        h("div", { className: "flex items-center gap-2" },
                          h(Badge, { tone: TYPE_COLORS[item.type] || TYPE_COLORS.default }, item.type || "note"),
                          h("span", { className: "truncate text-sm font-medium text-slate-900" }, item.title || "Untitled")
                        ),
                        h("div", { className: "mt-1 text-xs text-slate-500" },
                          relativeTime(item.updatedAt || item.createdAt),
                          item.status ? " · " + item.status : ""
                        )
                      ),
                      h("span", { className: "ml-2 text-slate-400 text-xs" }, isOpen ? "−" : "+")
                    ),
                    isOpen && item.summary
                      ? h("div", { className: "mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-wrap" }, item.summary)
                      : null
                  );
                })
              )
      ),

      // Quick prompts — chat-first, no direct mutations.
      h("div", { className: "rounded-xl border border-slate-200 bg-white p-4" },
        h("div", { className: "text-sm font-semibold text-slate-900 mb-2" }, "Quick prompts"),
        h("div", { className: "flex flex-wrap gap-2" },
          QUICK_PROMPTS.map(function (p, i) {
            return h("button", {
              key: i,
              className: "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100",
              onClick: function () { sendMessage && sendMessage(p); }
            }, p);
          })
        )
      )
    );
  }

  window.__houston_bundle__ = { Dashboard: Dashboard };
})();
