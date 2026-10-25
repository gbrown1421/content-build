# EP 011 off 1 Nov onto tonight; EP 012 onto 1 Nov

**Glenn, 2026-10-25 ~19:45 ET:** *"the post for EP 011 correctly scheduled for 11/01, reschedule it
for right now. Then everything for next week will be EP 012."*

**Owner: the PRODUCER.** Every step below touches a post GHL already holds, which the Copywriter
does not do. The copy half is already finished — `CONTENT-BUILD-UGH.md` carries the 25 Oct 19:55
EP 011 reel entry and the EP 012 entries now sit under SUN 1 NOV.

## Why

The Sunday-review run of Fri 23 Oct 15:15 ET (`content-build` `5c190c2`) re-sequenced Series 1 on
its own authority and created the moved rows at `2026-10-23 19:11:40Z`. Glenn did not authorize it.
Charter §2d already forbade it: a slot more than 2 hours past is dead and gone, do not re-date it.
EP 010's three 18 Oct rows were dead; re-dating EP 010 onto 25 Oct spent EP 011's slot.

Authorized cadence is **Sunday**, unbroken since EP 003 on 30 Aug: 09:00 poster, 12:00 announcement,
17:00 reel. Target end state: **EP 011 tonight (25 Oct), EP 012 finale 1 Nov, nothing on 8 Nov.**

## The rows

| entry_id | current slot | what | GHL ref | action |
|---|---|---|---|---|
| `22464eb1-2028-4ea8-8b12-4af4d2c4206f` | 11/01 17:00 | EP 011 reel | `6adbbfa204b8b3377c369982` | **re-book for tonight** |
| `936d70c7-868d-4824-af40-41f06e19d8be` | 11/01 09:00 | EP 011 poster | `6adbbf9a3001992f3763728f` | cancel, do not re-book |
| `0bb14c4b-2821-4c9d-a4b4-ceb93a80dac4` | 11/01 12:00 | EP 011 announcement | `6adbbf9eaea12bf943d9ae03` | cancel, do not re-book |
| `1c21b5ba-734d-4ef0-9bf5-e8591f9437e1` | 11/08 09:00 | EP 012 poster | — | move to 11/01 09:00 |
| `e6fd3c47-2455-4e5b-942b-662f5763607b` | 11/08 12:00 | EP 012 announcement | — | move to 11/01 12:00 |
| `aee093a1-0dfc-497d-ae8a-9cc11bcc84a5` | 11/08 17:00 | EP 012 reel | — | move to 11/01 17:00 |

## Steps, in this order

1. **Cancel all three EP 011 bookings in GHL** by the refs above. ⚠ GHL returns success on deletes
   that never happen and reports deleted posts as published — **confirm by re-reading the scheduled
   LIST**, never by trusting the delete response (memory `ghl-swaps-post-ids-on-publish`).
2. **Re-book `22464eb1` for tonight.** The media is already rendered and in the publish bucket at
   `booked/22464eb1-.../1792786336392-ugh-tails-ep011-reel.mp4`, so this is a re-book, not a
   rebuild. Facebook + Instagram. Caption unchanged — it is still true tonight, because airing on
   Sun 25 Oct makes "Next Sunday at five: THE BUBBLES" land on 1 Nov, which is where EP 012 now is.
   ⚠ **`producer action=publish` will now REFUSE this row**, because as of today it calls
   `alreadyBooked()` and the row carries a ref. Clear `publish_ref` first, or take the rebook path
   (`isRebook` is true once `status='exception'` or `publish_state='failed'`), which replaces the
   old id rather than adding a second booking.
   ⚠ GHL will not schedule inside ~10 minutes (`SCHEDULE_FLOOR_MS`). Earliest is now + 10 min.
3. **Close `936d70c7` and `0bb14c4b`** — `status='exception'`, `handoff_reason` naming this spec.
   Do **not** re-book them: both captions read "five o'clock today", and five o'clock today was
   spent on EP 010. (The EP 011 collectible poster is part of a set and is **OPEN — NEEDS GLENN**;
   it could run alone on Mon 26 Oct with the teaser line cut. Do not decide that here.)
4. **Only once 1 Nov is clear in GHL**, move the three EP 012 rows from 11/08 to 11/01, same times.
   Doing this before step 1 lands puts two UGH rows on each 1 Nov slot.

## What it must prove

- The GHL scheduled LIST shows **exactly one** EP 011 reel post per account for tonight, and
  **nothing** for EP 011 on 1 Nov.
- `calendar_entries` for 2026-11-01 holds **only** EP 012, three rows.
- `calendar_entries` for 2026-11-08 holds **no** UGH Tails rows.
- `workflow_activity` for `22464eb1` shows exactly **one** `Published ... via GHL` row after this.
