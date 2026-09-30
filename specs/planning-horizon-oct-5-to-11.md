# The calendar horizon is 5 days. The floor is 7. The copy is mostly written; the ROWS are not.

**Found:** 2026-09-29 19:55 ET, `ugh-charter-review-3x-daily`
**Revised 20:05 ET the same run** — the first version of this spec said the Oct 5–11 copy needed
writing. That was wrong and is corrected below: most of it already exists.

## The one hard fact

Queried `calendar_entries` on Lovable `f42abd5c-1bf5-4137-b1a8-85fb291ddff5`:

```
project | max(post_date) | rows after 2026-09-29
pixfix  | 2026-10-04     | 5
rva     | 2026-10-04     | 6
ugh     | 2026-10-04     | 7
```

Today is Tue 2026-09-29. **Horizon = 5 days**, against charter §2c: *"The horizon must never fall
below 7 days. If it has, that is a gap to close now, not at the next review."*

The publish path reads `calendar_entries` — `daily-driver` selects `status='ready'` off that table.
**Copy in a build file with no calendar row is not a scheduled post.** So the floor is breached on
the measure that matters, whatever the build files hold.

## What is NOT the problem — corrected

The copy largely exists already. Read off the build files tonight:

| Build file | October slots written | Last day |
|---|---|---|
| `CONTENT-BUILD-UGH.md` | Mon 5, Wed 7, Fri 9, Sat 10, Sun 11 (×3), Mon 12, Wed 14, Fri 16, Sat 17, Sun 18 | **18 Oct** |
| `CONTENT-BUILD-PIXFIX.md` | Mon 5, Tue 6, Wed 7, Thu 8, Fri 9, Sat 10, Sun 11, Mon 12, Tue 13, Wed 14, Thu 15, Fri 16, Sat 17, Sun 18 | **18 Oct** |
| `CONTENT-BUILD-RVA.md` | Thu 1, Fri 2, Sat 3, Sun 4 | **4 Oct** |

UGH and PixFix are written nineteen days out — past the 14-day rule, not short of it. **This is not
a Copywriter failure to plan.** It is uncommitted at the moment of writing because that session is
mid-write: `CONTENT-BUILD-UGH.md` mtime 19:59, `CONTENT-BUILD-PIXFIX.md` mtime 20:01, i.e. being
edited as this ran. Deliberately not committed by this run — in-flight work belongs to the session
writing it.

## What is actually outstanding

1. **Calendar rows for Oct 5 onward do not exist for any project.** The copy for UGH and PixFix is
   ready to attach to rows. Until the rows exist, nothing after Sun 4 Oct can be booked or
   published, and the horizon reads 5 days.
2. **RVA copy stops at Sun 4 Oct** — the only project genuinely short of copy. It needs Oct 5–11 at
   minimum to clear the floor: Mon 18:00 reel 15s · Tue 12:00 carousel 5 cards · Wed 19:00 question
   post · Thu 12:30 reel 20s · **Fri 08:00 story poll (Glenn's lane, posted by hand)** · Fri 17:30
   local identity · Sat 10:00 route check · Sun 19:00 carousel 4 cards. That pattern is verified
   over the two full weeks 21–27 Sep and 28 Sep–4 Oct.
3. **UGH Tails EP 009, Sun 11 Oct** — poster, announcement and reel. Copy is written. It is the one
   row on the calendar that cannot be produced the morning it posts, and it has no row yet. This is
   precisely the production dependency the 14-day buffer exists to protect.

## Whose it is

Calendar rows and slot times are the **Copywriter's** (charter §2c: "Plus slot times, calendar rows
and the 14-day plan"). A scheduled run may not create them, which is why this is a spec and not a
fix. RVA's Oct 5–11 copy is the Copywriter's too.

## Cautions that apply

- **US spelling in every line** (charter §3) — grep the new weeks before they deploy.
- **A caption may only promise a thing that exists.** No back-catalogue or cadence promise for
  EP 009 without checking the mechanism first.
- **Fri 9 Oct 08:00 RVA story poll needs a background built and Glenn posts it by hand.** Two of
  these went dark (25 Sep, 28 Sep) because no copy existed and the Builder is forbidden to invent a
  line. Write the question and the options with the row.
- Rows land `status='planned'`; UGH statics and comment polls are booked by server Automation at
  6 AM on the day, so `planned` the night before is normal for those and is not a gap.

## Done means

`select project, max(post_date) from calendar_entries group by project` returns **2026-10-11 or
later** for all three projects, every new row has a non-empty caption, and `CONTENT-BUILD-RVA.md`
carries Oct 5–11. The horizon is then 12+ days and the Sun 4 Oct review extends it to 18 Oct —
which UGH and PixFix copy already reaches.
