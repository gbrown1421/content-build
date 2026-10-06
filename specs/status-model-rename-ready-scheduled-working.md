# Status model: `ready` → `scheduled`, `needs_media` → `working`

**Glenn's ruling, 2026-10-06.** The definition of record is **charter §2c-1** (`desire-confidant-craft`,
commits `3835ceec` + the `working` rename). Read that first — this file is only how to land it.

Owner: the Producer. Enum migration, edge functions, app, scripts.

## ★ FIRST: THE CODE COMMENT THAT CAUSED THIS IS WRONG

`supabase/functions/producer/index.ts:150` (and the mirror in `health/index.ts`) says `booked` was
introduced *"so a booking stops being confused with a post."*

**That is not why.** Glenn, 2026-10-06: *"It was written so I'd have another status to use for
manual Story Polls."*

A session read that comment on 2026-10-06, concluded a `booked` Story poll was a lie, and moved
five rows to `ready`. They were put back. **Delete or correct that comment in the same change** —
it will mislead the next reader exactly as it misled this one.

## The two renames

| from | to | definition |
|---|---|---|
| `ready` | **`scheduled`** | **It is scheduled in GHL.** |
| `needs_media` | **`working`** | **Not done yet, for whatever reason** — may still need media, may be built and failing to schedule. |

★ **There is no ready-then-scheduled step.** Glenn: *"Every other post should be scheduled as soon
as it is ready, so there is no need for a 'Ready' status and then a 'Scheduled' status."* The
Producer has it ready → schedules it in GHL → writes `scheduled`. **One move.** Anything still in
flight is `working` until it reaches `scheduled`, `booked` or `exception`.

★ **`working` deliberately does not name a cause.** That is the entire reason for the rename: the
old name asserted "no media" when the real reason is usually something else.

## The Story poll lifecycle — three owners, and `booked` is CORRECT

1. **Copywriter** puts the `.txt` in the drop folder → marks the row **`planned`**
2. **Producer** builds the background image into the drop folder → marks it **`booked`**
3. **Glenn** posts the Story on Instagram by hand → sets it **`posted`**

★ **A `booked` Story poll past its slot is NOT a failure.** It is waiting on Glenn. `health`
currently reports it as *"booked in GHL and never reported published — check the Social Planner
post"*, which is false twice over — it is not in GHL, and GHL cannot post an Instagram Story. Fix
that string as part of this change, or the rename lands and the alarm still lies.

## Every reader that has to move

- `supabase/functions/producer/index.ts` — writes `ready` at **730, 761, 1041**; the `booked`
  comment at ~150; `getPublicUrl(entry.rendered_image_path)` at **527** and **1105** is unaffected.
- `supabase/functions/health/index.ts` — the `why` strings at **73–76** and **150**. Line 76 says
  *"the publish sweep only takes status='ready'"* and must follow the rename.
- The Planner UI and anything reading `entry_status`.
- `content-kit/health/channels.mjs`, `health/sweep.mjs`.
- `builder-morning-run/SKILL.md` and `peer-morning-run/SKILL.md` — both define `ready` in prose.
- The `ready_means_rendered` check constraint names `ready`/`booked`/`posted` in its definition.

★ Edge functions deploy **only via Lovable `send_message`** (memory `edge-function-deploy-route`).
A git push ships the frontend alone.

## It must prove

1. A normal post reaches GHL and the row reads **`scheduled`** — in **one move**, with no
   intermediate state written.
2. A `booked` Story poll past its slot does **NOT** appear as a failure in `/health`, and no string
   anywhere claims it was booked in GHL.
3. **Show it can fail:** feed a row carrying an old value (`ready`, `needs_media`) and show it is
   either migrated or loudly rejected — never silently skipped. A rename that drops rows on the
   floor is worse than the old names.
4. Row counts before and after match per status, with the two old values at zero.

## Not in this change

Under §2c-1 the Story poll `.txt` is the **Copywriter's** file; only the `.jpg` is the Producer's.
`rva/build-poll-dropfiles.mjs` currently writes both. **Do not change that yet** — four polls are
already staged and the split needs Glenn's timing, not a mid-week surprise.
