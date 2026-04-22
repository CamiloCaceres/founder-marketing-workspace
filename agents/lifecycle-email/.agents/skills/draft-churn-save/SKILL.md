---
name: draft-churn-save
description: Use when the user says "save email for {account}" / "churn-save" / "cancel-flow email" — drafts a save email that avoids defensive language, offers a genuine option (pause / downgrade / concierge help / refund), and never uses guilt, fake scarcity, or dark patterns.
---

# Draft Churn-Save

A save email is an honest off-ramp. If we can't offer something real,
we wish them well and ask for a reason.

## When to use

- User: "save email for {account}" / "churn-save" / "cancel-flow
  email" / "email for accounts that downgraded".
- User names a specific account, a segment, or a persona.

## Steps

1. **Read positioning doc** — `../head-of-marketing/product-marketing-context.md`.
   If missing or empty, tell the user to run the Head of Marketing's
   `define-positioning` first and stop.
2. **Read `config/voice.md`.** If missing, ask once with the
   connected-inbox hint (Composio-connected Gmail / Outlook /
   Superhuman > pasted samples), write the file, continue.
3. **Read or create `config/save-policy.json`.** If missing, ask the
   user once: "What are you genuinely willing to offer? Options:
   pause (how long?), downgrade (to which plan?), concierge call
   (how long, with whom?), refund (within what window?). Be honest —
   I won't draft anything you can't deliver." Write the policy.
4. **Gather context.** If the user named a specific account, ask for
   one or two details: what plan they're on, how long they've been a
   customer, the stated reason if known. If they only named a
   segment / persona, work from that.
5. **Pick ONE genuine offer** from the save policy that fits this
   user. Don't stack offers — a single real option converts better
   than a menu.
6. **Draft the email** in the user's voice:
   - **Subject** — no guilt ("Before you go"), no fake scarcity
     ("Last chance"). A clear, human subject.
   - **Preview text** — complements subject, hints at the offer.
   - **Body** — 3 short paragraphs. (1) Acknowledge the decision
     plainly. (2) Offer the one genuine option. (3) Ask the
     honest question: what wasn't working? One primary CTA (the
     offer). One secondary link (confirm cancel).
   Never use: "we'll miss you", "are you sure", countdown timers,
   fake urgency, "other customers are…", guilt, emoji tears.
7. **Write** `saves/{account-slug-or-persona}.md` atomically.
   Front-matter: `segment`, `offer` (the one real concession),
   `source: "coverage-gap"`.
8. **Append to `outputs.json`** — type `"save"`, status `"draft"`,
   2-3-sentence summary naming the offer and the segment.
9. **Summarize to user** — "Save email for {target} at {path}.
   Offer: {one line}. No guilt tactics. Review, tweak, paste into
   {platform} and trigger on your cancel-flow webhook — I don't
   send."

## Never do

- Guilt language, "we'll miss you", fake scarcity, countdown timers.
- Offers the user can't actually honor ("free concierge forever").
- Invent churn reasons — if the user hasn't told you why this person
  is leaving, don't make one up in the body.

## Outputs

- `saves/{account-slug-or-persona}.md`
- Appends to `outputs.json` with `{ id, type: "save", title, summary,
  path, status: "draft", createdAt, updatedAt }`.
