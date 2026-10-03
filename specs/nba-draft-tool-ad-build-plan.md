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

## ★ THE ONE THING THAT IS NOT A FIND-AND-REPLACE

The NFL spot sells **positional tier cliffs** — *how many RBs are left before it falls off*.
`specs/nba-draft-tool-port.md` establishes that NBA fantasy does not work that way: multi-position
eligibility is standard, most leagues are 9-cat H2H or points, and there is no RB-cliff equivalent.
**Scarcity in NBA is categorical.** The creators being pitched talk about punt builds — punt FT%,
punt assists — not positional runs.

So the hero product line changes axis:

| | NFL (shipped) | NBA |
|---|---|---|
| Hero line | "tracks your tiers live as players come off the board" | "tracks every category live as players come off the board" |
| The fear | the last good RB goes | **the last guy who gets you blocks goes** |
| The proof shot | a position tier reading 1 LEFT | **a category column reading 1 LEFT** |

The emotional job is identical — *am I about to miss the last one?* — which is why everything else
in the spot survives intact.

⚠ **This depends on a product decision Glenn has not made yet.** The port spec recommends re-cutting
the axis from position to category and flags it as his call. **If he keeps the positional board,
three lines change and nothing else does** — they are marked ⚑ in the timeline below. Do not
generate final plates until that is settled; the copy is burned into the art.

---

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
| Round board | WR / QB / RB / TE / CB / DL | **PG / SG / SF / PF / C / G / F** |
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
| 0:07–0:12 | **TOOL REVEAL** | Animate into the board. Fast crops across three categories. Show players-left counters. Cross one player off and update the count. | ⚑ "The Last-Minute Draft Tool tracks every category live as players come off the board." | CROSS THEM OFF. / COUNTS UPDATE LIVE. |
| 0:12–0:18 | **WHY IT MATTERS** | Zoom to a category reading **1 LEFT**, pulsing warning. Shift to a category with depth remaining. | ⚑ "See which categories are about to run dry. Know when to strike — and when you can wait." | DON'T REACH. / DON'T PANIC. / DON'T GUESS. |
| 0:18–0:23 | **RAH-RAH PAYOFF** | Confident Anthony. Upright, raised eyebrow, slight smile. Brighter arena atmosphere than the open. | ⚑ "Stay ahead of the run. Take the value. Build the roster everybody else wishes they drafted." | GO WIN YOUR DRAFT. |
| 0:23–0:30 | **HARD CTA** | Anthony left, presenting toward clean right space. Large QR, $6, product name. | "Your draft isn't waiting. Get the Last-Minute Draft Tool for six bucks. Scan it now — and go win your draft." | LAST-MINUTE DRAFT TOOL / $6 / SCAN. SET YOUR LEAGUE. DRAFT. |

⚑ = changes if Glenn keeps the positional board instead of category scarcity. Positional fallback:
"tracks your tiers live" / "See where the drop-off is coming" / payoff line unchanged.

## 4. Final 30-second voiceover script

**Performance:** energetic sports-commercial read. Start urgent and challenging, build confidence
through the product proof, hit the final GO WIN YOUR DRAFT strong but controlled. The escalation is
what creates the energy — do not shout every line.

> "Draft night is here. You gonna guess your way through it? Or are you gonna know exactly where the
> value is? The Last-Minute Draft Tool tracks every category live as players come off the board. See
> which categories are about to run dry. Know when to strike — and when you can wait. Don't reach.
> Don't panic. Don't guess. Stay ahead of the run. Take the value. Build the roster everybody else
> wishes they drafted. Your draft isn't waiting. Get the Last-Minute Draft Tool for six bucks. Scan
> it now — and go win your draft."

Word count is within two words of the NFL read, so the existing timing and the three DON'T impact
hits at **13.37 / 13.90 / 14.79** should survive. Re-derive from the chosen read before delivery.

## 5. Image / visual asset plan

| ID | Description | Status | Notes |
|---|---|---|---|
| NBA-ANT-01 | Hook — Anthony walking L→R, worried, phone | GENERATE | Basketball tank. Round board reads PG/SG/SF/PF/C. |
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
