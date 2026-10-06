# Story-poll drop-files never stamp the row — four rows are already stuck

**Reported by the builder-morning-run session, 2026-10-06. Every claim re-verified
independently by the Copywriter session the same morning before this file was written —
and the report is right, but it understates the scope.**

Owner: the Producer. This is a builder script plus a DB write path.

## Verified, claim by claim

**1. Nothing in content-kit writes `rendered_image_path`.** Confirmed:

```
grep -rn "rendered_image_path" --include=*.mjs --include=*.js  (content-kit, minus node_modules)
  → zero matches
```

**2. `rva/build-poll-dropfiles.mjs` makes no database call of any kind.** Confirmed — grepping it
for `copy_state`, `calendar_entries`, `fetch`, `supabase` and `UPDATE` returns nothing. It writes
two files and tells the Hub nothing.

**3. The `copy_state='staged'` rule is prose only.** It lives in
`.claude/scheduled-tasks/builder-morning-run/SKILL.md` under WHAT IS YOURS, attributed
**(Glenn, 2026-09-25)** — so it is a real rule, set by Glenn, with **nothing in code enforcing it**.
An agent either remembers or it does not.

**4. The constraint is exactly as described.** Read from `pg_constraint`:

```sql
ready_means_rendered CHECK (
      status <> ALL (ARRAY['ready','booked','posted'])
   OR COALESCE(rendered_image_path,'') <> ''
   OR requires_media = false )
```

So `requires_media = true` + empty `rendered_image_path` = **the row can never reach ready, booked
or posted.**

## ★ IT IS FOUR ROWS, NOT ONE

The report names THE AISLE. Queried 2026-10-06, every forward story poll is in the same state, and
all four have both drop-files sitting in `content-kit/out/drive` since **Oct 1 07:50**:

| row | date | copy_state | requires_media | rendered_image_path |
|---|---|---|---|---|
| `6a59bc1e-638d-49e4-9718-a140324254c3` THE AISLE | 2026-10-05 | `written` | **true** | `''` |
| `9cdf1edf-dd4f-4513-9f30-1955ee3467f4` THE CARRY-ON | 2026-10-09 | `written` | **true** | `''` |
| `3af03093-b8e0-4ee5-a564-c30c8aa3b065` THE EARLY ONE | 2026-10-12 | `written` | **true** | `''` |
| `3f806110-d0a9-4631-afaa-4ac5a474f9b1` THE LONG WEEKEND | 2026-10-16 | `written` | **true** | `''` |

**THE AISLE is already overdue** — it showed in the 2026-10-06 07:55 channel check at 24h late.
The other three will hit the same wall on 9, 12 and 16 Oct.

## ★ AND THE OLDER ROWS DISAGREE WITH THESE — `requires_media` IS INCONSISTENT

Every **posted** story poll carries `requires_media = false`; every **forward** one carries `true`.

| row | status | requires_media |
|---|---|---|
| THANKSGIVING 09-25 | posted | false |
| THE MIDDLE SEAT 09-28 | posted | false |
| RED EYE OR LAYOVER 10-02 | posted | false |
| the four above | planned | **true** |

That is the real tell. The older rows did not pass the constraint — **they were let through by
`requires_media` being false**, not by anything being rendered. So "it worked before" is not
evidence the path works; it is evidence the flag used to be set differently.

★ **DECIDE WHICH ONE IS CORRECT AND MAKE ALL STORY POLLS MATCH.** Both options are defensible and
the choice is the Producer's to put to Glenn, not to split the difference:

- **`requires_media = false`** — the Hub does not claim to hold the image, because it genuinely
  does not; the file lives on the laptop and goes to Drive. Matches every row that has ever posted.
- **`rendered_image_path` set to the drop-file path** — the Hub records where the background is.
  Honest only if that path means something to anything that reads it.

What must not happen is four rows on one rule and three on another.

## The fix

When `build-poll-dropfiles.mjs` has written **both** files, it updates that row in the same run:

- `copy_state = 'staged'`, `copy_state_at = now()`
- whichever of `requires_media = false` / `rendered_image_path = <path>` is chosen above
- `assigned_to` stays `'glenn'` — he still posts it by hand. **Staged means ready FOR him, not done.**

Putting it in the script rather than the SKILL.md is the whole point: the rule has existed since
2026-09-25 and was skipped four times in a row because prose does not execute.

## It must prove

1. Build a poll, then **read the row back from the database** — `copy_state = 'staged'`,
   `copy_state_at` set. Not the script's own log saying it did it.
2. The **Planner Copy column shows STAGED** for that row.
3. The row can now be closed: move it to `posted` and show it does **not** trip
   `ready_means_rendered`.
4. **Show it can fail** — run with one drop-file missing and show the row is *not* stamped. A stamp
   that fires regardless of whether the files exist is worse than no stamp, because it tells Glenn
   a background is waiting when it is not.
5. Backfill the four rows above and show all four reading `staged`.

## Related — build once, do not build three times

- `health-story-polls-force-p0.md` — the same rows also force `p0: true` on the channel check.
- `health-p0-false-on-by-hand-story-polls.md` (`8f68503`, 2026-09-29) — older spec, same endpoint,
  same cause as the one above.
- The Planner pin ruling (Glenn, 2026-10-04) — unclosed rows pin to the top of the feed. Built and
  deployed in ugh-content-hub `91dd0bf`, not yet seen rendering.

All four touch the story-poll path. **This spec is the upstream one:** if the row gets stamped
correctly at build time, the others have far less to catch.

---

## ★ VERIFIED 2026-10-06 — THE FIX LANDED, AND IT INTRODUCED ONE REGRESSION

Checked independently against the live DB and the live `health` endpoint, not from the build
session's report.

**What is genuinely fixed — all confirmed:**

| | |
|---|---|
| All five forward story polls | `copy_state='staged'`, `copy_state_at` set |
| `requires_media` | `false` on every one — the right call, and the data already said so |
| `rendered_image_path` | left empty, correctly: it is a publish-media storage key with `getPublicUrl()` called on it |
| `assigned_to` | still `glenn` on all five |
| 23 Oct THE RED EYE copy | **verbatim** against `CONTENT-BUILD-RVA.md` — question and both options match exactly |

**The regression: `status` was moved from `planned` to `booked`, and that made the alarm lie.**

Read from `/functions/v1/health` at 2026-10-06, HTTP 200:

```
2026-10-05 07:30  rva  Story poll — THE AISLE   27h
  why: booked in GHL and never reported published — check the Social Planner post
```

**It was never booked in GHL.** `publish_ref` is empty on all five, and GHL cannot post an
Instagram Story at all — that is the entire reason this row type exists. The health function's
`status='booked'` branch now sends Glenn to look for a Social Planner post that does not and
cannot exist. Before this change the same row said *"its time passed and it never left the
calendar"* — noisy but true. It is now false, and the other four repeat it on 9, 12, 16 and 23 Oct.

★ **The right status is `ready`, not `booked`.** The enum has it, and `builder-morning-run/SKILL.md`
defines it precisely: *"'ready' means built but NOT yet in GHL."* That is exactly what a staged
story poll is — built, not in GHL, waiting for Glenn. `booked` means GHL is holding it, which is
impossible here.

**Fix:** set those five rows to `ready`, and have the `stage` action write `ready` rather than
`booked`.

```
6a59bc1e THE AISLE 10-05 · 9cdf1edf THE CARRY-ON 10-09 · 3af03093 THE EARLY ONE 10-12
3f806110 THE LONG WEEKEND 10-16 · 265cca31 THE RED EYE 10-23
```

**Must prove:** re-read `/health` and show THE AISLE's `why` no longer claims a GHL booking.

⚠ **Scoring note for the implementation review:** the Process Alert *"Story poll drop-files now
stamp their own calendar row"* is **PARTIAL** — the stamp works, the flag decision is right and
evidenced, and a false statement now appears in the P0 alarm. Partial is FAIL by §4 of the charter.

## ⚠ A LANE CLAIM THAT IS NOT GLENN'S

The build session wrote: *"Calendar rows are my lane — I created it from the 16 Oct row's shape."*

**The charter says the opposite.** §2c and the block at the top of `CLAUDE.md` both put
*"slot times, calendar rows and the 14-day plan"* with the **Copywriter**. No Glenn ruling moves
them. The row itself is fine — its copy is verbatim and it needed to exist — so this is a routing
note, not a rebuild: **the missing row should have been handed back, not created.** Per §1, a rule
a session states about itself is that session's opinion until Glenn sets it.
