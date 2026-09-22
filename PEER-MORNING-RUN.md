# Peer morning run — 6:30 AM ET, every day

Written by the copywriter, 11 Sep 2026, on Glenn's GO (pipeline map item 5). Runs as a scheduled
task created **from the Peer's own folder** (`C:\Users\gbrow\desire-confidant-craft`), so it never
stops on a permission prompt. It needs the laptop awake with the Claude app open.

Until the Builder's 6:15 run is switched on, this run works **both** the Builder's and the Peer's
hand-offs. That job is written: `BUILDER-MORNING-RUN.md` (12 Sep). The day it goes live, this run
drops the Builder's formats — PixFix and RVA stills, carousels, Story poll backgrounds — and keeps
reels, video, ads, episodes, VO and anything handed on. That hand-back is the whole point of it:
the Peer had too much pulling at it.

## The job, in order

1. **Kill switch.** Read `content_config` (Content Hub, Lovable project `f42abd5c-1bf5-4137-b1a8-85fb291ddff5`).
   If `kill_switch` is on, do nothing and report that.
2. **The to-do — there is no date ceiling.** Read today's (America/New_York) `driver_v2_runs`
   report and every `calendar_entries` row whose **`status` is `planned` or `ready`** and whose
   **slot is not more than 2 hours past** — today, tomorrow, three weeks out (Glenn, 2026-09-22).
   Build and book as far ahead as the copy allows. A row more than 2 hours past its slot has
   expired: set `status = 'exception'` and do not build it. Keep the rows that are either
   `assigned_to` builder/peer or was handed off by the 6 AM run (`handoff_reason` set).
   Work them in slot order. **Never** a Story poll: those are Glenn's, posted by hand.

   ★ **`ready` IS UNFINISHED WORK AND IT IS YOURS** (Glenn, 2026-09-22). `ready` means built but
   not yet in GHL — keep working a row until it reaches `booked`. The old filter said "not
   posted", which both missed the point and swept up rows already `booked`, risking a second
   booking of the same post.
3. **For each row:**
   - Find its entry in `C:\Users\gbrow\Downloads\CONTENT-BUILD-<UGH|RVA|PIXFIX>.md` by date and time.
   - **Copy comes only from the build file, verbatim.** If the entry is missing, marked NOT READY,
     or lacks a caption or headline the format needs, do not write any: hand the row to Glenn
     (below). Never invent a caption, headline, poll option or on-screen line.
   - Build it to `C:\Users\gbrow\Downloads\CONTENT-FORMATS.md`: the format's shape and length
     (spoken words ÷ 2.3 = seconds), feed images 1080×1350, reels 1080×1920 with faststart.
     Brand rules: UGH's font and "UGH. WE SHOW UP." never appear on RVA or PixFix. The words at the
     bottom of the image are exactly the entry's, or nothing. No placeholder (`[FARE]`, `{{…}}`)
     survives into a built post; fare posts are filled from that morning's price check.
   - Look at the finished image or frames yourself before booking.
   - **Book through the one booking step only:** `node C:/Users/gbrow/Downloads/content-kit/post-ghl.js --entry <row id> ...`,
     with `--caption-ig` whenever the caption has a URL. Read the booking back from GHL.
   - Book at least 15 minutes before the slot. A slot already more than 2 hours past is not
     posted: record it as missed.
4. **What you can't finish goes to Glenn.** Set the row's `assigned_to` = `glenn` and
   `handoff_reason` = one plain sentence saying what's missing and what would unblock it.

## The report (end of run)

Short, plain, lead with anything that needs Glenn:

- **Needs you:** each row handed to Glenn, with its time and the one-sentence reason.
- **Post by hand today:** each Story poll, with its time and its background link.
- **Booked:** each row booked, with its time and GHL ID.
- **Missed:** any slot more than 2 hours past.

If everything was booked and nothing needs Glenn, say that in one line and stop.

## Never

- Invent copy, or change the copywriter's words (flag a problem instead).
- Book around the booking step, or host media anywhere but the app's storage.
- Touch code, deploy anything, or change settings. This run builds and books; nothing else.
