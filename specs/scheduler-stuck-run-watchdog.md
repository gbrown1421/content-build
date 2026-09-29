# Stuck-run watchdog — one hung tool call froze every scheduled task for 4 days 18 hours

**Priority: P1.** Not started. Any session that can edit the scheduled tasks can pick this up.
Found by `producer-sweep` on 2026-09-29. This is a second, worse occurrence of the incident the
sweep's own `SKILL.md` already documents — the rule written after the first one did not contain it,
because the rule prevents *one cause* and nothing limits the *blast radius*.

## What happened, with evidence

`producer-sweep` run `local_acf589ed-aaff-4dc4-9e7c-b768d2ce38e7`:

    started_at:        2026-09-24T21:54:10.381Z
    last_activity_at:  2026-09-29T16:17:27.133Z      <-- 4d 18h 23m

The next sweep (`local_106a2289`, this one) started 2026-09-29T16:22:16Z — **~5 minutes after the
hung run finally released.** It did not recover because anyone intervened. It recovered because the
call eventually returned on its own.

The sweep's `SKILL.md` states this session "was still running at 2026-09-27T02:24Z" and that it
"froze the machine for two days." Both are understatements of the same event: it ran for nearly five
days. A stuck run blocks the whole scheduler, so everything behind it was skipped while each task's
`nextRunAt` kept advancing and `lastRunAt` stood still — the exact signature in memory
`scheduled-task-permission-freeze`.

Skipped in the window 2026-09-24T21:54Z → 2026-09-29T16:17Z, from each task's cron and `lastRunAt`:

| Task | lastRunAt before recovery | Skipped |
|---|---|---|
| `producer-sweep` (8×/day) | 2026-09-24T21:54Z (the hung one) | ~34 |
| `implementation-review-3x-daily` | 2026-09-24T21:08Z | ~12 |
| `builder-morning-run` | 2026-09-24T10:18Z | 5 |
| `peer-morning-run` | 2026-09-24T10:40Z | 5 |
| `ugh-daily-report-10pm` | (drained 2026-09-29T16:14Z) | ~4 |
| `ugh-board-reconciliation-930pm` | 2026-09-25T22:39Z | ~3 |

**No content was lost.** Every calendar slot from 2026-09-25 to 2026-09-29 is `posted`, and the
health check read ugh 3h / rva 0h / pixfix 24h. Publishing survived because it does not depend on
these tasks — the server-side `daily-driver` (08:00 ET) and the 6 AM Automation publish rows that
were already `booked`, and the 14-day planning buffer meant five days of rows were already built.
**The buffer did exactly the job §2c says it exists for.** That is also why nobody noticed: the
visible output stayed correct for five days while every build and every check was dark.

## Why the existing rule is not enough

`producer-sweep/SKILL.md` now says never open a browser in that task, and puts a 3-minute
`AbortController` timeout on every `fetch`. That is correct and it should stay. But:

- It binds **one task**. The other six can hang on anything.
- It binds **one cause**. Any MCP call, any network read, any subprocess can block indefinitely.
- It is a rule a model has to remember and obey mid-run. The failure it prevents is exactly the
  kind that happens when a run is already off the rails.

A rule cannot bound a hang. Only a supervisor outside the run can.

## What to build

A wall-clock ceiling on scheduled runs, enforced by something that is not the run itself.

1. **Per-run hard timeout.** A scheduled run that exceeds its budget is terminated, not waited on.
   Suggested ceilings, from observed healthy durations (sweeps normally finish in 1–35 min):
   `producer-sweep` 20 min · `implementation-review` 30 min · the two morning runs 90 min ·
   `daily-report` / `board-reconciliation` 30 min. Kill, mark the run `failed` with reason
   `exceeded wall-clock ceiling`, and let the scheduler move on.
2. **The scheduler must not be blocked by one task.** If a single stuck run can stop six unrelated
   tasks, that serialization is the actual defect. Either run tasks independently, or have the
   dispatcher skip a task whose prior run is still alive past its ceiling instead of stalling.
3. **Surface the freeze.** Any task whose `lastRunAt` is older than 3× its interval is a P1 line on
   the Project Board. Today the only way to see a five-day freeze is to read `lastRunAt` by hand and
   do the arithmetic — which is how it went unseen for five days.

If the ceiling cannot be enforced where runs are launched, the fallback is a tiny independent
task (every 30 min, no MCP calls, no network) that reads the runs list and kills anything past its
ceiling. A watchdog that itself can hang is not a watchdog — it gets a hard timeout and nothing else.

## What it must prove

Per CLAUDE.md §4, a process change is CHANGED, not WORKING, until all four land:

1. **Desired outcome, stated so it can fail:** a scheduled run still alive past its ceiling is
   terminated, and the next scheduled task fires on time.
2. **Run it through the real path** — a real scheduled run, not a hand-run of the same code.
3. **Proof Glenn can check in one action:** a runs-list row showing `status: failed`, reason
   `exceeded wall-clock ceiling`, with `last_activity_at - started_at` at the ceiling and not
   beyond; plus the next task's `lastRunAt` advancing on schedule afterward.
4. **Show it can fail.** Deliberately hang a throwaway task — `sleep` past its ceiling — and show
   the kill, and show an unrelated task firing on time while it is hung. A watchdog that has never
   killed anything has never been tested; that is how four QA dimensions shipped hardcoded
   `pass: true` on 2026-08-22.

Then post one **Process Alert** carrying the killed-run row and the SHA. One alert: the ceiling and
the un-serialization are one change if shipped together, two if not.

## Traps

- **`nextRunAt` lies.** It advances while a task is frozen. Read `lastRunAt` only
  (memory `scheduled-task-permission-freeze`).
- **Don't judge the freeze from content.** Five days of correct posts hid it completely. Task health
  and channel health are different questions.
- **Don't widen the browser ban into the fix.** Banning tools one at a time chases causes forever;
  the ceiling is what bounds the damage regardless of cause.
- Leave `producer-sweep/SKILL.md`'s no-browser rule and 3-minute fetch timeouts in place. This is
  defense in depth, not a replacement.
