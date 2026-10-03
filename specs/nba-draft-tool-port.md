# NBA draft tool — port spec

**Written 2026-10-03 by the Copywriter. The build is not my lane — this is the handover.**

Glenn's call: NFL draft season is over, NBA opening night is **Tue 20 Oct 2026**, drafts cluster
**10–19 Oct**, so port the last-minute draft tool to NBA and hit the live window.

**Hard deadline: live by 10 Oct.** After the 19th the window is shut for a year.

---

## What exists

`Downloads/draft-board-site/` — `index.html` (39,690 bytes) + `tips.html`, plus a 14-team variant
at `Downloads/draft-board-14-site/`. Single-file static site, deployed to Netlify at
**`last-minute-draft-tool.netlify.app`** (HTTP 200 verified 2026-10-03).

## What ports for free — verified, not assumed

**Sleeper covers NBA.** `GET https://api.sleeper.app/v1/players/nba` returns **HTTP 200, 2.5 MB**,
carrying the identical fields the NFL build consumes:

```
injury_status · injury_notes · injury_body_part · team · position
full_name · search_rank · status ("RET" filters retired)
fantasy_positions: ["PF","SF"]
```

So the **live injury-flag feature is a one-word change**: `/v1/players/nfl` → `/v1/players/nba`.
That was one of the two features Glenn highlighted to Ivan and it transfers at zero cost.

The UI, the tap-off interaction, the double-tap "my pick" marking, the tips page and the whole
layout port unchanged.

## ★ What does NOT port — the blocker

**The tier data is hardcoded in `index.html` and there is no pipeline behind it.** The NFL board
tiers off *"7,681 real drafts from the last seven days."* A filesystem search for a harvester
(`7681`, `adp`, `average draft`, `mock draft` across js/mjs/py/json/md) found **nothing** — only
Blender's bundled Python. Sleeper's players endpoint carries `search_rank`, which is a popularity
signal, **not ADP**.

**So an NBA draft-position source has to be found or built, and that is the long pole — not the UI.**
Decide this first; everything else is hours.

## ★ And the product logic needs rethinking, not translating

The NFL tool's core insight is **positional tier cliffs** — *how many RBs are left before it falls
off*. **NBA fantasy does not work that way:**

- Multi-position eligibility is standard; Sleeper returns `["PF","SF"]` on a single player.
- Most leagues are **9-cat H2H or points**, not positional-scarcity drafts.
- There is no RB-cliff equivalent. Scarcity in NBA is **categorical**.

**The NBA equivalent of "how many are left before the cliff" is "how many players are left who
actually get me blocks."** Same emotional job — *am I about to miss the last one?* — different axis.

A find-and-replace port would answer a football question about a basketball draft, and the
creators being pitched will notice: they talk about **punt builds** (punt FT%, punt assists), not
positional runs.

**Recommendation: keep the interaction, re-cut the axis from position to category.** Per-category
scarcity boards (blocks / threes / steals / FT% / assists), each showing who is left and how deep
it runs. The tap-off and the double-tap-is-my-pick mechanics carry over untouched.

This is a product call, not a code call — **Glenn's to make, not a maker's.**

## Sequencing — the part that decides whether this works

★ **OUTREACH STARTS BEFORE THE TOOL IS DONE.** Ivan Herrera took **24 days** to reply to the NFL
pitch. Creators need lead time to script, record and publish. If the first comment goes out the day
the build lands, their video publishes after everyone has drafted.

The NFL tool being live and free is the asset here: it proves the thing ships. Lead with it, name
the NBA date. Method and message are in
`Downloads/Draft-Tool-Groups/NBA-YOUTUBE-OUTREACH.md`.

## Must prove before it is called done

Per charter §4 — state the outcome first, run the real path, capture evidence, show it can fail:

1. The NBA board loads and tiers real players — paste a row.
2. **An injury flag renders from live Sleeper data** — name the player and the note, fetched, not
   assumed.
3. A retired or inactive player (`status: "RET"`) does **not** appear on the board.
4. The deployed URL returns 200 and shows NBA, not NFL — fetched, not assumed.

## Also

- Two team-size variants exist for NFL (12 and 14). Decide whether NBA needs both or ships one.
- The 14-team variant is a separate directory, i.e. a fork, not a setting. Worth collapsing to one
  file with a toggle rather than maintaining two NBA forks as well.
