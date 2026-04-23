#!/usr/bin/env python3
"""Generate bundle.js per agent from the template + houston.json useCases."""
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
BASE = REPO / "agents"
TEMPLATE = (Path(__file__).resolve().parent / "bundle_template.js").read_text()

# Accent per agent
ACCENTS = {
    "head-of-marketing": "indigo",
    "seo-content": "emerald",
    "growth-paid": "amber",
    "lifecycle-email": "sky",
    "social-community": "rose",
    "conversion-copywriter": "violet",
}

TAGLINES = {
    "head-of-marketing": "Positioning, launches, competitive pulse, the Monday review. I coordinate the other four marketing agents through one shared positioning doc.",
    "seo-content": "Audit, rank, draft, repurpose, and link. The inbound content engine — tool-agnostic, Composio-first.",
    "growth-paid": "Paid campaigns, landing-page CRO, experiments, the weekly funnel review. I never spend a dollar without your approval.",
    "lifecycle-email": "Welcome series, newsletters, drips, churn-save, product announcements. Drafts only — I never send.",
    "social-community": "LinkedIn posts, X threads, Reddit replies, your weekly social calendar and podcast pitches. Drafts only — I never post.",
    "conversion-copywriter": "Page copy, headline + CTA variants, form / signup / onboarding / paywall / popup CRO. I rewrite surfaces that leak — you ship.",
}


def build_for(agent_id: str) -> tuple[str, int]:
    agent_dir = BASE / agent_id
    houston_json = json.loads((agent_dir / "houston.json").read_text())

    agent_config = {
        "name": houston_json["name"],
        "tagline": TAGLINES[agent_id],
        "accent": ACCENTS[agent_id],
        "useCases": houston_json.get("useCases", []),
    }

    # Inject as a JS object literal. json.dumps produces valid JS for our values
    # (strings, numbers, arrays, plain objects with string keys — no functions or undefined).
    injected = json.dumps(agent_config, indent=2, ensure_ascii=False)
    # Bump indent to match the surrounding context (2-space global indent in template)
    injected_js = injected

    bundle_source = TEMPLATE.replace("{{AGENT_NAME}}", houston_json["name"])
    bundle_source = bundle_source.replace("{{AGENT_CONFIG}}", injected_js)

    target = agent_dir / "bundle.js"
    target.write_text(bundle_source)
    return str(target), len(bundle_source)


def verify(agent_id: str) -> bool:
    agent_dir = BASE / agent_id
    node_check = (
        "global.window={Houston:{React:{createElement:()=>null,"
        "useState:()=>[{idx:null,at:0},()=>{}],"
        "useEffect:()=>{},useCallback:f=>f}}};"
        "eval(require('fs').readFileSync('bundle.js','utf8'));"
        "console.log(Object.keys(window.__houston_bundle__));"
    )
    result = subprocess.run(
        ["node", "-e", node_check],
        cwd=agent_dir,
        capture_output=True,
        text=True,
    )
    ok = result.returncode == 0 and "Dashboard" in result.stdout
    status = "OK" if ok else "FAIL"
    print(f"  {status}  {result.stdout.strip() or result.stderr.strip()[:200]}")
    return ok


print("=== Generating bundle.js per agent ===")
all_ok = True
for agent_id in ACCENTS:
    path, size = build_for(agent_id)
    print(f"\n{agent_id}: wrote {size:,} bytes")
    if not verify(agent_id):
        all_ok = False

print("\n=== Summary ===")
print("All bundles verified." if all_ok else "SOME BUNDLES FAILED VERIFICATION.")
sys.exit(0 if all_ok else 1)
