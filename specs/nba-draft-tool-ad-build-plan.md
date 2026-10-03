# NBA Last-Minute Draft Tool — 30s ad, episode build plan

**Glenn, 2026-10-03: "create a similar video for the NBA season."** This is the NFL spot
(`LMDT_AD30_MASTER_FINAL.mp4`, built 2026-09-06) ported to basketball.

Source of truth for the original: `Downloads/Go Win Your Draft_Vibe.co/
Last-Minute-Draft-Tool_Episode_Build_Plan.docx` and `content-kit/lmdt/build-vibe.mjs`.
Product port spec: `specs/nba-draft-tool-port.md`.

**The clock:** NBA opening night **Tue 20 Oct 2026**, drafts cluster **10–19 Oct**. The ad is
worthless after the 19th, so it ships alongside the tool, not after it.

---

## CREATIVE NORTH STAR

Your draft is starting. Everyone else is guessing. You do not have to. The Last-Minute Draft Tool
turns draft-night panic into a confident, actionable plan — then closes with one clear command:
**GO WIN YOUR DRAFT.**

Unchanged from NFL. It was right, and brand continuity across the two seasons is worth more than
a new line.

| Build item | Decision |
|---|---|
| Ad length | 30 seconds |
| Master format | 16:9, 1920×1080, 30 FPS, MP4 |
| Primary audience | Fantasy-basketball drafters approaching draft day |
| Primary emotion | Urgency → control → confidence |
| Primary CTA | Scan the QR, get the tool for $6 |
| Final promise | GO WIN YOUR DRAFT |
| Spokesman | **Anthony** — purple cap, white **#22 basketball jersey** (sleeveless), blue jeans, white sneakers, smartphone |

---

## ★ THE AXIS — SETTLED, POSITIONAL (Glenn, 2026-10-03)

An earlier draft of this plan moved the hero line from positional tier cliffs to category
scarcity, following the recommendation in `specs/nba-draft-tool-port.md`. **Glenn ruled against
that on 2026-10-03: keep the positional / value axis.**

His evidence, from YouTube autocomplete pulled the same day (`own/reports/2026-10-03.md`):

| rank | query |
|---|---|
| 2 | fantasy basketball points league |
| 4 | nba fantasy points league |
| 7 | nba fantasy category league |
| 9 | fantasy basketball categories |

Points leagues outrank categories on **both** seeds. A points league has no categories at all —
value is a single number, which is exactly the NFL model. And the largest draft-lane outreach
target found (11 slots) is **"BLEAV in Fantasy Basketball — NBA Points & Dynasty"**, a
points-league channel.

So the hero line stays about **value and tier cliffs**, and the three VO lines that had been
flagged flip back to their NFL wording. DON'T REACH / DON'T PANIC / DON'T GUESS, GO WIN YOUR
DRAFT and the QR + $6 close are all verbatim from the NFL spot.

**Category boards are v2, and nothing is wasted by deferring them.** The per-category stats
(BLK / STL / AST / 3PM / FT%) come from the same free ESPN call that supplies ADP — verified 200,
no key, 400 players, every one carrying a real `averageDraftPosition` (Jokic 1.6, SGA 2.9,
Wemby 3.1):

```
lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/2027/segments/0/leaguedefaults/3
  ?view=kona_player_info      + x-fantasy-filter header
```

### The one real adjustment — multi-position eligibility

This is the part that is **not** a find-and-replace. NBA players carry more than one position:
Sleeper and ESPN both return e.g. `["PF","SF"]` on a single player. So **a player must count in
every slot he qualifies for, or the tier counts lie** — and the tier count is the whole product.
A dual-eligible forward taken off the board has to decrement both SF and PF.

Board labels are **PG / SG / SF / PF / C / UTIL**. No CB, no DL, and none of the invented
abbreviations the first image pass produced.

## 1. What carries over untouched

- The six-scene structure and the 30s timeline
- **DON'T REACH. DON'T PANIC. DON'T GUESS.** — draft behavior, not football. Keep verbatim.
- GO WIN YOUR DRAFT
- The war-room environment, purple/white palette, broadcast type treatment
- Anthony as the emotional guide: worried → focused → confident → presenter
- QR + $6 end card, no URL ([[Glenn, 2026-09-05]] — the QR encodes the Stripe link directly, so
  it needs no domain and works today)
- `content-kit/lmdt/build-vibe.mjs` — the assembly, motion, DON'T treatment and QR verification all
  run unchanged on new plates

## 2. What changes

| Element | NFL | NBA |
|---|---|---|
| Jersey | white #22 **football** jersey, shoulder bulk | white #22 **basketball tank**, same purple trim |
| Round board | WR / QB / RB / TE / CB / DL | **PG / SG / SF / PF / C / UTIL** |
| Wall diagram | football X's and O's play | **basketball halfcourt set** |
| Checklist panel | TALENT · FIT · VALUE · UPSIDE · DEPTH · SCHEME | **PTS · REB · AST · 3PM · STL · BLK · FG% · FT%** |
| Season hook | "Draft night is here" | "Draft night is here" (unchanged — still true) |
| Clock | ON THE CLOCK 02:37 | ON THE CLOCK 02:37 (unchanged) |

---

## 3. 30-second master timeline

Scene timings are identical to the NFL cut, so `build-vibe.mjs` SCENES needs only new filenames.

| Time | Beat | Visual / motion | Voiceover | On-screen copy |
|---|---|---|---|---|
| 0:00–0:03 | **HOOK** | Dark war-room. Draft-clock beep, arena lights hit. Anthony walks left-to-right, shoulders hunched, staring worriedly at his phone. | "Draft night is here. You gonna guess your way through it?" | YOUR DRAFT STARTS SOON. / YOU READY? |
| 0:03–0:07 | **PROBLEM → CONTROL** | Flash of draft-pressure alerts, then Anthony stops and presents his phone to camera. Hard cut into the tool. | "Or are you gonna know exactly where the value is?" | WHO'S LEFT? / WHERE'S THE DROP-OFF? |
| 0:07–0:12 | **TOOL REVEAL** | Animate into the board. Fast crops across three position tiers. Show players-left counters. Cross one player off and update the count. | "The Last-Minute Draft Tool tracks your tiers live as players come off the board." | CROSS THEM OFF. / TIERS UPDATE LIVE. |
| 0:12–0:18 | **WHY IT MATTERS** | Zoom to a position tier reading **1 LEFT**, pulsing warning. Shift to a category with depth remaining. | "See where the drop-off is coming. Know when to strike — and when you can wait." | DON'T REACH. / DON'T PANIC. / DON'T GUESS. |
| 0:18–0:23 | **RAH-RAH PAYOFF** | Confident Anthony. Upright, raised eyebrow, slight smile. Brighter arena atmosphere than the open. | "Stay ahead of the run. Take the value. Build the roster everybody else wishes they drafted." | GO WIN YOUR DRAFT. |
| 0:23–0:30 | **HARD CTA** | Anthony left, presenting toward clean right space. Large QR, $6, product name. | "Your draft isn't waiting. Get the Last-Minute Draft Tool for six bucks. Scan it now — and go win your draft." | LAST-MINUTE DRAFT TOOL / $6 / SCAN. SET YOUR LEAGUE. DRAFT. |

No flagged lines remain — the axis is settled, so every line above is final copy.

## 4. Final 30-second voiceover script

**Performance:** energetic sports-commercial read. Start urgent and challenging, build confidence
through the product proof, hit the final GO WIN YOUR DRAFT strong but controlled. The escalation is
what creates the energy — do not shout every line.

> "Draft night is here. You gonna guess your way through it? Or are you gonna know exactly where the
> value is? The Last-Minute Draft Tool tracks your tiers live as players come off the board. See
> where the drop-off is coming. Know when to strike — and when you can wait. Don't reach.
> Don't panic. Don't guess. Stay ahead of the run. Take the value. Build the roster everybody else
> wishes they drafted. Your draft isn't waiting. Get the Last-Minute Draft Tool for six bucks. Scan
> it now — and go win your draft."

Word count is within two words of the NFL read, so the existing timing and the three DON'T impact
hits at **13.37 / 13.90 / 14.79** should survive. Re-derive from the chosen read before delivery.

## 5. Image / visual asset plan

| ID | Description | Status | Notes |
|---|---|---|---|
| NBA-ANT-01 | Hook — Anthony walking L→R, worried, phone | GENERATE | Basketball tank. Round board reads PG/SG/SF/PF/C/UTIL. |
| NBA-ANT-02 | Problem→control — stopped, phone toward viewer | GENERATE | |
| NBA-ANT-03 | Tool reveal — product screen dominant | GENERATE + **placeholder UI** | Real screenshots not available yet |
| NBA-ANT-04 | Why it matters — the three DON'T phrases burned in | GENERATE | **Phrase x-ranges must be re-measured off the new plate** — `build-vibe.mjs` has the NFL coordinates hardcoded |
| NBA-ANT-05 | Rah-rah payoff — upright, confident | GENERATE | Brighter arena light than the open |
| NBA-ANT-06 | Hard CTA — Anthony left, clean right for QR | GENERATE | QR laid in at assembly, never burned into art |
| NBA-UI-01..n | Actual category board screens | **BLOCKED** | Tool not built. Placeholders stand in; swap before delivery. |

★ **PRODUCT UI IS NEVER AI-GENERATED.** The NFL plan says it and it still holds: fake UI in an ad
for a real tool is a promise that breaks the moment someone buys. Placeholders are explicitly
labelled as such in the working files, and the spot does not ship until real captures replace them.

## 6. Motion / editing plan

Unchanged from NFL — `build-vibe.mjs` already implements all of it:

- Hard cuts, whip crops, short digital pushes. No static hold over ~2–3s in the first 23 seconds.
- Product UI motion is deterministic: crop, pan, highlight, cross off, update the counter.
- Anthony is parallax and push-in only; no character animation needed.
- The three DON'T phrases are **burned into scene 4 from its first frame**. What lands on each
  audio hit is a shake, a bloom and a scale punch on that phrase alone — emphasis, not reveal.
- Every plate is upscaled to 1920×1080 **once**, before the motion chain, so nothing resamples twice.

## 7. What must be true before this is called done

1. Every plate is 1920×1080 or larger and Anthony is recognisably the same man as the NFL spot.
2. The three DON'T phrase x-ranges are **measured off the new scene-4 plate**, not inherited.
3. The QR in the finished MP4 **decodes** — `build-vibe.mjs` already decodes it at the end of the
   run and fails loudly if it does not.
4. No placeholder UI remains in the delivered master.
5. Total runtime is 30.0s and the audio bed lines up with the three hits.
