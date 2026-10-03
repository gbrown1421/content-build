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

## ★ CORRECTED 2026-10-03 — the data source, and it is NOT the long pole

An earlier version of this spec said the tier data had "no pipeline behind it" and called it
the long pole. **That was wrong.** There was never a harvester to find because there was never
a harvester — the NFL board pulls from a free public API.

**Source identified: Fantasy Football Calculator.**
`https://fantasyfootballcalculator.com/api/v1/adp/ppr?teams=12&year=2026` returns 200 with
meta `{type, teams, rounds, total_drafts, start_date, end_date}` — byte-for-byte the shape
embedded in `BOARD`, and player records `{name, team, adp, bye}` mapping exactly onto the
four-field arrays `["Jahmyr Gibbs","DET",1.5,6]`.

**It is football-only.** `fantasybasketballcalculator.com` does not resolve;
`/v1/players/nba/adp` and `/v1/adp/nba` on Sleeper both 404.

**Two live NBA candidates, probed 2026-10-03:**

| source | result | note |
|---|---|---|
| `lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/2027/players` | **200** | Same endpoint family as the `ffl` football game. Already returns `ownership.percentOwned`. ESPN publishes average draft position in its player views — needs the right `view` param (likely `kona_player_info` + an `X-Fantasy-Filter` header). **Strongest lead.** |
| `hashtagbasketball.com/fantasy-basketball-rankings` | 200, 1.8 MB **HTML** | Full rankings, but scraping not an API |

**The NBA record is smaller than the NFL one: name, team, ADP.** Basketball has no bye weeks,
so the fourth field is free — use it for primary category contribution or multi-position
eligibility.

★ **The real long pole is the EDITORIAL layer.** The tier names and position notes are
hand-written and they are the product: "Crème de la crème", "Same points, three rounds
later", "The wait-and-win zone", "After the cliff — stream instead", "Last pick, no
thought", and notes like *"1 starter · one goes early, the next five don't — waiting costs
almost nothing."* An API hands you a table of numbers; that writing is what makes it a tool.
**No source provides it and it is the Copywriter's job, not a maker's.**

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
