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

★ **Check what the real discriminator is before coding.** `post_type` may not be populated on every
historical story-poll row; the two above were written weeks apart and reached `overdue` through two
*different* branches (`status='posted'` vs `status='booked'`), so they do not look identical in the
data. A title match on `Story poll` is a fallback, not the primary test — titles are copy and copy
changes.

## It must prove

1. **A story poll past its slot does NOT appear in `overdue` and does NOT set `p0`.** Feed it the
   two rows above and show `p0: false` where it was `true`.
2. **It still appears** — under `byHand`, with its date, title and age.
3. **A genuine miss still fires.** Feed a non-story row past grace with no published state and show
   `p0: true` and the row in `overdue`. A guard that cannot fail has not been tested — four QA
   dimensions shipped hardcoded `pass: true` on 2026-08-22 for exactly this reason.
4. `channels.mjs` renders the new section.

## Also outstanding, separately

The two rows above are **complete** (Glenn posted both) but their calendar state does not say so.
Whoever fixes this should close them out so they stop surfacing regardless of the code change.
