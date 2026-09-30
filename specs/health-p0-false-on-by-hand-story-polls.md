# /functions/v1/health returns `p0: true` on a completely healthy system, and will keep doing it forever

**Found:** 2026-09-29 19:56 ET, `ugh-charter-review-3x-daily`
**Not deployed by that run on purpose** — see "Why this was not hot-fixed" at the bottom.

## The evidence

Live call tonight, `curl --max-time 90` against the Hub's `health` function:

```json
"p0": true,
"projects": [
  { "project": "ugh",    "hoursSincePublish": 11, "level": "ok" },
  { "project": "rva",    "hoursSincePublish": 8,  "level": "ok" },
  { "project": "pixfix", "hoursSincePublish": 3,  "level": "ok" }
],
"overdue": [
  { "date": "2026-09-25", "time": "08:00:00", "project": "rva",
    "title": "Story poll — THANKSGIVING: HOME OR AWAY", "lateHours": 108,
    "why": "marked posted locally but no published state came back" },
  { "date": "2026-09-28", "time": "07:30:00", "project": "rva",
    "title": "Story poll — THE MIDDLE SEAT", "lateHours": 36,
    "why": "marked posted locally but no published state came back" }
]
```

Every project is `ok`. `p0` is `true` anyway.

## Why

`ugh-content-hub/supabase/functions/health/index.ts`:

- **line 132** — the overdue loop skips a row only when `publish_state === 'published'`.
- **line 158** — `const p0 = projectHealth.some((p) => p.level === "P0") || overdue.length > 0;`

A **story poll can never reach `publish_state='published'`.** Instagram strips poll stickers from
anything auto-published, so GHL cannot post one at all; the producer refuses it with
`409 story_poll_posted_by_hand` and Glenn posts it from his phone. The row then gets
`status='posted'`, `copy_state='posted'`, `assigned_to='glenn'` and `publish_state=''` — which is
the correct, designed end state. The overdue loop reads the empty `publish_state` and flags it, for
the full 7 days the loop looks back (line 142).

So from 30 minutes after any story poll's slot until 7 days later, `p0` is `true`. Story polls run
roughly weekly. **`p0` is therefore true almost permanently, and it is measuring nothing.**

## Why it has not bitten yet, and why that is not reassuring

`content-kit/health/sweep.mjs` filters story polls out **client-side** — `isStoryPoll()`, added
2026-09-21 for this exact reason — so the producer sweep does not chase them and does not log
phantom misfires. That fix was applied to the consumer, not the producer of the bad signal. Any
other caller of `health` — anything reading `p0` to decide whether something is wrong — reads
`true` and is wrong. This is the charter's §3 failure shape: a check that fires on correct
behavior, desensitizing the one flag that is supposed to stop everything.

## The fix

In `health/index.ts`, treat a by-hand story poll that has been marked posted as finished, in the
endpoint rather than in every caller. Narrowest correct predicate — it must match the producer's
own refusal path, not just a title:

```ts
// A story poll is posted by hand by design (GHL cannot post an IG Story; the producer refuses it
// with 409 story_poll_posted_by_hand). It never reaches publish_state='published', so the overdue
// loop flagged it forever and pinned p0 true on a healthy system. Glenn marking it posted IS the
// published signal for this row type.
const byHandDone = String(r["post_type"]) === "poll"
  && /^\s*story poll\b/i.test(String(r["title"] ?? ""))
  && String(r["status"]) === "posted";
if (byHandDone) continue;
```

placed immediately after the `if (state === "published") continue;` on line 132.

## Proof it is done (charter §4 — all four, in order)

1. **Desired outcome, stated so it can fail:** a live call to `health` returns `p0: false` and an
   `overdue` array that does not contain either RVA story poll, while all three projects still
   read `level: "ok"`.
2. **Real path:** deploy the function, then call the deployed endpoint — not a local run.
3. **Proof:** paste the `p0` and `overdue` fields from that call.
4. **Show it can fail:** the guard must NOT swallow a real miss. Feed it a bad input — take any
   non-poll row whose slot has passed with `publish_state=''` (or temporarily clear
   `publish_state` on a recently published non-poll row in a branch DB) and confirm it still
   appears in `overdue` and still sets `p0: true`. A story poll left at `status='planned'` past its
   slot must also still flag, because that one really did go dark: the guard requires
   `status='posted'`.

## Related, already tracked on the Project Board — do not conflate

The same two rows have a **second, separate** defect: they read `status='posted'` with
`publish_results: []`, i.e. two slots that published nothing are recording themselves as done. The
board's UGH MEDIA CONTENT column already carries the action *"Correct both rows to `exception`"*.
That is a data correction about the calendar's history. **This spec is about the endpoint.** Fixing
the rows would clear tonight's `p0` and hide the bug until the next story poll — which is why both
are needed and why they are two items, not one.

## Why this was not hot-fixed by the run that found it

Deploying the `health` edge function auto-deploys into the path the producer sweep polls every two
hours. Pushing an unproven change to it from an unattended 8pm scheduled run, with step 4 above
unexercised, risks taking the sweep's only reality check offline overnight to fix a flag that has
so far cost nothing. The client-side filter means there is no live harm tonight. This is a
daylight change with a real test, not a 20:00 push.
