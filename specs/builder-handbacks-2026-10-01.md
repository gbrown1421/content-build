# Builder hand-backs — 1 Oct 2026 morning run

Written by `builder-morning-run`, 2026-10-01. Four rows were **not built and not booked**. Each needs
the Copywriter (or an asset) before the Builder can take it. The Builder could not write
`assigned_to` / `handoff_reason` onto the rows itself — see the last section — so the rows still read
`planned` and unassigned in the calendar. This file is the hand-back until that is done.

## 1. RVA · Tue 6 Oct 12:00 · Carousel — "Cities that are better in October"
Row `42593104-21c1-4c8a-aa5e-cdc778f4b658` · `CONTENT-BUILD-RVA.md` line 781.

Card 1 reads **FIVE CITIES THAT ARE BETTER NOW**. The carousel has three city cards (Boston,
Chicago, New York) and the caption says "All three". Built verbatim, the cover promises five and
the post delivers three. Needs either the number changed on card 1 or two more city cards.
Everything else in the entry is buildable as written (heroes exist: `BOS_FAL_freedom-trail`,
`ORD_FAL_riverwalk`, `JFK_FAL_central-park-fall`).

## 2. PixFix · Mon 12 Oct 12:00 · Carousel — "Why one good picture is not a character"
Row `c3a5fd46-6a33-4aa2-94ff-d7cdd4f8ab86` · `CONTENT-BUILD-PIXFIX.md` line 890.

Slide 2 asks for "the same character, second angle, subtly different" and slide 3 for a
"side-by-side with drift ringed — jaw, collar, hairline". The library holds only approved canon
sets, which do not drift, and PixFix posts are library-only with no generation. Ringing "drift" on a
matched pair would show a fault that is not there. Needs a real drifted pair supplied, or slides 2–3
re-specified to pictures the library has.

## 3. PixFix · Thu 15 Oct 12:00 · Carousel — "How an order actually runs"
Row `17965912-c4ff-4de3-a2c1-04a8400a9507` · `CONTENT-BUILD-PIXFIX.md` line 964.

Two things:
- Slide 3 asks for "work in progress plates". No such asset exists; only finished canon angles.
- Slide 1 says "Reference images, **or a description**." The build file's own "Facts you may state —
  and only these" list says one image in, and the live order form (screenshot 21 Sep) requires a
  master image. A description-only order is not on that list. Not the Builder's call — flagged.

Slides 1, 2 and 4 have pictures on disk (`out/pixfix-0921/order-step-upload.png`,
`out/pixfix/_subjects/order-check-crop.png`, any character's nine files).

## 4. PixFix · Sat 17 Oct 12:00 · Comment poll — "What are you building?"
Row `657191ae-725c-4910-9b6f-7c3a68ec7dee` · `CONTENT-BUILD-PIXFIX.md` line 1005.

The card wants "a stack of pages suggesting a book" on the left and "a screen suggesting a game" on
the right. Neither picture exists in the library and the entry does not say where they come from.
Needs the two pictures supplied or named.

## The calendar writes this run could not make

The Builder has no cancellable way to write to `calendar_entries` (the only route is the Lovable
`query_database` MCP, which takes no timeout — charter §3). Paste-ready, for an interactive session:

```sql
-- hand-backs
update calendar_entries set assigned_to='glenn', handoff_reason='Builder 2026-10-01: card 1 says FIVE CITIES but the carousel and caption carry three. Copy needs the number or two more cards. See content-build/specs/builder-handbacks-2026-10-01.md' where id='42593104-21c1-4c8a-aa5e-cdc778f4b658';
update calendar_entries set assigned_to='glenn', handoff_reason='Builder 2026-10-01: slides 2-3 need a drifted pair; the library only holds matched canon sets. See content-build/specs/builder-handbacks-2026-10-01.md' where id='c3a5fd46-6a33-4aa2-94ff-d7cdd4f8ab86';
update calendar_entries set assigned_to='glenn', handoff_reason='Builder 2026-10-01: no work-in-progress plates exist for slide 3, and slide 1 says "or a description", which is not on the PixFix facts list. See content-build/specs/builder-handbacks-2026-10-01.md' where id='17965912-c4ff-4de3-a2c1-04a8400a9507';
update calendar_entries set assigned_to='glenn', handoff_reason='Builder 2026-10-01: the card needs a picture of pages and a picture of a screen; neither exists in the library. See content-build/specs/builder-handbacks-2026-10-01.md' where id='657191ae-725c-4910-9b6f-7c3a68ec7dee';
-- Story polls staged in content-kit/out/drive (jpg + txt both on disk)
update calendar_entries set copy_state='staged' where id in ('6a59bc1e-638d-49e4-9718-a140324254c3','9cdf1edf-dd4f-4513-9f30-1955ee3467f4','3af03093-b8e0-4ee5-a564-c30c8aa3b065','3f806110-d0a9-4631-afaa-4ac5a474f9b1');
```

## Update — 5 Oct 2026 morning run

- All four hand-backs above still stand: none of the four build-file entries has changed (the only
  build-file commit since 30 Sep is `f8504fc`, which appended 19–25 Oct). Row 1 is tomorrow, 12:00.
- The SQL above is still unapplied as of the last calendar list on disk (peer run, 4 Oct 06:41 ET).
- **New Story poll staged:** RVA · Fri 23 Oct 08:00 · THE RED EYE —
  `C:\Users\gbrow\Downloads\content-kit\out\drive\2026-10-23-0800-RVA.jpg` + `.txt`, copy verbatim
  from `CONTENT-BUILD-RVA.md` line 1193. Its calendar row id is not known to the Builder (the row
  list on disk predates the 19–25 Oct plan), so its `copy_state='staged'` update is by date:

```sql
update calendar_entries set copy_state='staged', assigned_to='glenn'
where project='rva' and post_date='2026-10-23' and post_time='08:00' and title ilike 'Story poll%';
```
