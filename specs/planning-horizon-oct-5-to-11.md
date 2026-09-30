# Planning horizon is 5 days. The floor is 7. Oct 5–11 is empty across all three projects.

**Found:** 2026-09-29 19:55 ET, `ugh-charter-review-3x-daily`
**Owner: THE COPYWRITER (the interactive session).** Not mine — a scheduled run may not write a
caption, a headline, a poll option or a calendar row. This spec is the handover.

## The evidence

Queried `calendar_entries` on Lovable `f42abd5c-1bf5-4137-b1a8-85fb291ddff5`:

```
project | last_planned | rows after 2026-09-29
pixfix  | 2026-10-04   | 5
rva     | 2026-10-04   | 6
ugh     | 2026-10-04   | 7
```

Today is Tue 2026-09-29. **Horizon = 5 days.** Charter §2c: *"The horizon must never fall below
7 days. If it has, that is a gap to close now, not at the next review."*

The root cause is upstream of the decay: **the Sunday 2026-09-27 review planned ONE week, not two.**
Sep 28 → Oct 4 is exactly 7 days. The rule is 14 (Glenn, 2026-09-20, restated 2026-09-21), and the
second week is the buffer that stops the far edge ever becoming today. It was never laid down, so
there is no buffer to spend — the horizon went from 7 to 5 in two days with nothing behind it.

## What has to be written: Mon 2026-10-05 → Sun 2026-10-11

The weekly slot pattern is stable and verified over two consecutive full weeks (Sep 21–27 and
Sep 28–Oct 4). Copy it forward — 24 rows:

| Day | Time | Project | Type | Slot |
|---|---|---|---|---|
| Mon 10-05 | 08:00 | ugh | daily_moment | UGH static |
| Mon 10-05 | 12:00 | pixfix | carousel | 5 slides |
| Mon 10-05 | 18:00 | rva | video | Reel 15s |
| Tue 10-06 | 09:00 | ugh | daily_moment | UGH static |
| Tue 10-06 | 12:00 | rva | carousel | 5 cards |
| Tue 10-06 | 17:00 | pixfix | daily_moment | studio explainer |
| Wed 10-07 | 12:00 | ugh | poll | Ask the Feed |
| Wed 10-07 | 18:00 | pixfix | video | Reel |
| Wed 10-07 | 19:00 | rva | daily_moment | Question post |
| Thu 10-08 | 08:00 | ugh | daily_moment | UGH static |
| Thu 10-08 | 12:00 | pixfix | carousel | 5 slides |
| Thu 10-08 | 12:30 | rva | video | Reel 20s |
| Fri 10-09 | 08:00 | rva | poll | **Story poll — Glenn's lane, posted by hand** |
| Fri 10-09 | 17:00 | ugh | video | Friday reel |
| Fri 10-09 | 17:00 | pixfix | daily_moment | Character spotlight |
| Fri 10-09 | 17:30 | rva | daily_moment | Local identity |
| Sat 10-10 | 10:00 | rva | daily_moment | Route check |
| Sat 10-10 | 11:00 | ugh | daily_moment | UGH static |
| Sat 10-10 | 12:00 | pixfix | poll | Comment poll |
| Sun 10-11 | 09:00 | ugh | daily_moment | **UGH Tails EP 009 — poster** |
| Sun 10-11 | 12:00 | ugh | daily_moment | **UGH Tails EP 009 — episode announcement** |
| Sun 10-11 | 17:00 | ugh | video | **UGH Tails EP 009 — reel** |
| Sun 10-11 | 17:00 | pixfix | daily_moment | Turnaround of the week |
| Sun 10-11 | 19:00 | rva | carousel | 4 cards |

## The one row with a real production dependency

**UGH Tails EP 009, Sun 2026-10-11** — poster, announcement and reel, three rows. EP 008 lands
Sun 10-04. An episode is the single thing on this calendar that cannot be produced the morning it
posts, and the 14-day rule exists for exactly this row. Writing the Oct 5–11 week gives the Peer
run eleven days of lead time on EP 009. Leaving it unwritten gives it whatever is left when
someone notices.

## Cautions that apply to this copy

- **US spelling in every line** (charter §3). Grep the week before it is committed.
- **A caption may only promise a thing that exists.** No "subscribe to watch the next adventure"
  unless EP 009 is hosted; no back-catalogue or cadence promise without checking the mechanism.
- **Story poll Fri 10-09 needs a background built and Glenn posts it by hand** — GHL cannot post an
  Instagram Story. Two of these went dark (25 Sep, 28 Sep) because the copy was never written and
  the Builder is forbidden to invent a line. Write the poll question and options with the row.
- Rows land as `status='planned'`; UGH static and comment polls are booked by server Automation at
  6 AM on the day, so `planned` the night before is normal for those and not a gap.

## Done means

`select project, max(post_date) from calendar_entries group by project` returns `2026-10-11` for
all three projects, and every new row has a non-empty caption. Then the horizon is 12 days and the
Sunday 2026-10-04 review extends it to 2026-10-18.
