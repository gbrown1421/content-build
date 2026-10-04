# Story polls permanently force a P0 on the channel check

**Found 2026-10-04 by the Copywriter session. Owner: the Producer / peer — this is an edge
function, and per memory `edge-function-deploy-route` edge functions deploy ONLY via Lovable
`send_message`, never a git push, and the Supabase MCP cannot see the project.**

## What is wrong, right now

An Instagram story poll **can only ever be posted by hand** — GHL cannot post a Story. So a story
poll row can never report a published state, ever, by design.

`supabase/functions/health/index.ts` has **no exclusion for that**. Walk the code:

- **line 42** — the select pulls `post_type` and `platforms`, so the information needed to identify
  a story poll is already in hand.
- **line 95** — `const GRACE_MIN = 30`.
- **line 132** — `if (state === "published") continue;` — a story poll never qualifies.
- **line 140-142** — past grace and under 7 days, it falls through.
- **line 143** — `overdue.push({...})`.
- **line 158** — `const p0 = projectHealth.some(...) || overdue.length > 0;`

**Therefore every story poll sets `p0 = true` for a week after its slot.** `health` reports P0,
`channels.mjs` exits 1, and `sweep` exits 1 — on a row where nothing is wrong and nothing can be.

## Proof it is firing

Channel check, 2026-10-04 12:22 ET. Both OVERDUE rows were story polls, and **both were fine**:

```
2026-09-28 07:30  rva  Story poll — THE MIDDLE SEAT     149h late
                       "marked posted locally but no published state came back"
2026-10-02 08:00  rva  Story poll — RED EYE OR LAYOVER   52h late
                       "booked in GHL and never reported published"
```

Glenn, same day: **"I posted the middle seat the day it was due. I just posted the red-eye poll.
these 2 are complete."** The MIDDLE SEAT had been posted on 28 Sep — on time — and the check called
it 149 hours late for six days.

## Why it matters more than two rows

This is an alarm that cries wolf on a schedule. The misfire counter already got this right —
`generate-board.js` prints `(story polls excluded: 0)` — so the exclusion exists in one place and
not the other. An operator who learns that OVERDUE contains routine false positives stops reading
OVERDUE, and the next real silent failure sits in that list unread. That is the exact failure mode
the health function was written to end: *"the system had a doer and no watcher."*

## The fix

Identify story polls off `post_type` / `platforms` (both already selected, line 42) and route them
to a **separate `byHand[]` array** rather than `overdue[]`, and **exclude them from the `p0`
calculation on line 158**.

Do **not** simply drop them. They still need surfacing — the whole point is that Glenn has to
post them — but as *"waiting on Glenn"*, not as *"the pipeline failed."* `channels.mjs` prints
`byHand` under its own heading.

★ **THE DISCRIMINATOR IS VERIFIED — queried 2026-10-04, do not re-derive it.** Both rows carry
`post_type = 'poll'` and `platforms = ["instagram"]`. That pair is the test: an Instagram-only poll
cannot be machine-posted. Do **not** match on the title — titles are copy and copy changes.

```
a4e06531-ddb3-432b-880f-b9dd94a150d0  2026-09-28 07:30  poll  [instagram]  status=posted
d0e099ed-4f8d-41c6-ad9b-172711b851ed  2026-10-02 08:00  poll  [instagram]  status=booked
```

⚠ Note they reached `overdue` through **different branches** (`status='posted'` vs `'booked'`), so a
fix keyed on `status` will only catch one of them. Key on `post_type` + `platforms`.

## It must prove

1. **A story poll past its slot does NOT appear in `overdue` and does NOT set `p0`.** Feed it the
   two rows above and show `p0: false` where it was `true`.
2. **It still appears** — under `byHand`, with its date, title and age.
3. **A genuine miss still fires.** Feed a non-story row past grace with no published state and show
   `p0: true` and the row in `overdue`. A guard that cannot fail has not been tested — four QA
   dimensions shipped hardcoded `pass: true` on 2026-08-22 for exactly this reason.
4. `channels.mjs` renders the new section.

## ★ THE SECOND DEFECT — AND GLENN HAS RULED ON THE FIX

**Glenn cannot mark a hand-posted row complete once it ages off the schedule** (his words,
2026-10-04): *"normally I would update the status after i post it. But since this was scheduled 2
days ago, it is no longer on the schedule for me to update."*

A story poll is the only row type that **requires** a human to close it, and the Planner stops
showing it before he can. Post it late, or post it on time and close it tomorrow, and the row is
stranded `booked` forever — unfixable from the UI and a standing P0 under the current health logic.

### ★ THE RULING (Glenn, 2026-10-04) — build THIS, not a way to reach backwards

> *"instead of reaching back to update a row, have the peer adjust feed on screen so that any row
> that has not been properly closed as either processed/killed, remains at the top of the feed and
> does not count toward the 2 week window from the past Sunday."*

Two parts, both required:

**1. An unclosed row PINS TO THE TOP OF THE FEED and stays there.** It never ages off. "Properly
closed" means exactly two terminal states — **processed** (it went out) or **killed** (it is not
going out). Anything else is open, and an open row sits at the top until someone resolves it. This
removes the need to hunt for a past row, because the row never leaves.

**2. An unclosed row DOES NOT COUNT toward the two-week window measured from the past Sunday.**
The planning horizon counts forward from the last Sunday review. A straggler pinned at the top is
*outside* that count — so a row nobody closed cannot masquerade as planned coverage and cannot eat
into the fortnight the Sunday review is supposed to guarantee.

★ **An earlier draft of this spec proposed a backwards date range or a "needs closing" list.
That is superseded — it was a Copywriter session's suggestion, not a ruling, and Glenn has
replaced it.** Do not build a way to reach back into the past; build a feed where the row never
falls out of reach in the first place.

### What the ruling must prove

1. A row past its slot with no terminal state **appears at the top of the feed** and stays across
   a reload and a date change.
2. Marking it **processed** or **killed** removes it from the top. Nothing else does.
3. The two-week-from-Sunday count **excludes** pinned rows — demonstrate the horizon number with
   and without one open straggler and show it does not move.
4. A genuine miss still reaches `overdue` and still sets `p0` (see "It must prove" above). The
   pin is a UI affordance; it is not a substitute for the alarm.

## Already done, 2026-10-04

The two rows are closed — Glenn confirmed he posted both, so the Copywriter session set
`publish_state='published'` and `published_at` on each, and the 15:50 channel check came back with
both gone from OVERDUE and RVA reading `last published 0h ago`. ⚠ MIDDLE SEAT's `published_at` is
its **slot time** (2026-09-28 11:30Z), not an observed timestamp — Glenn said he posted it the day
it was due and the exact minute is not recoverable.
