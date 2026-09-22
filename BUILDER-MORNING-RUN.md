# Builder morning run — 6:15 AM ET, every day

Written by the copywriter, 12 Sep 2026. Runs as a scheduled task created **from the Builder's own
folder**, so it never stops on a permission prompt. It needs the laptop awake with the Claude app
open.

**Why this run exists (Glenn, 8 Sep).** Everything was landing on the Peer — code changes, episode
builds, VO compilations, hand-offs, and whatever it gets asked in chat — and it had too much pulling
at it. The Builder is a dedicated producer: it takes the routine daily production, and nothing else
competes for it. Reels stay with the Peer, which has the video path.

**Why the code does not route to it yet.** On 11 Sep the driver began routing this run's formats to
`assigned_to='builder'` while this run did not exist. Nothing read those rows, and 12 Sep posted 1 of
5 planned rows. So the order here is strict: **this run proves itself first, and the code routes to
it second.** See *Switching it on*, below. Until that second step, the Builder pulls its own work —
nothing pushes work to it.

---

## What is the Builder's

| Takes | Leaves |
|---|---|
| PixFix stills · RVA stills (Question post, Local identity, Story set) | **Reels and any video → the Peer.** It has the video path. |
| Carousels, all three projects | **UGH Static, UGH Comment poll, Link → the Automation.** It does these correctly and books them itself. |
| Story poll **backgrounds** — build the image only | **Posting a Story poll → Glenn.** GHL cannot post an Instagram Story. Never book one. |

---

## The job, in order

1. **Kill switch.** Read `content_config` (Content Hub, Lovable project
   `f42abd5c-1bf5-4137-b1a8-85fb291ddff5`). If `kill_switch` is on, do nothing and report that.

2. **Build the to-do — pull it, don't wait to be given it.**

   ★ **THERE IS NO DATE CEILING** (Glenn, 2026-09-22: *"allow the builder to complete anything that
   is within their build structure that is at a status of planned. We do not need to put any day,
   date or time qualifiers around this"*). Read every `calendar_entries` row whose **`status` is `planned` or
   `ready`** and whose **slot is not more than 2 hours past** (America/New_York) — today, tomorrow,
   three weeks out. Keep the ones that are the Builder's by the table above. Build and book as far
   ahead as the copy allows; do not stop at today.

   ★ **`ready` IS UNFINISHED WORK AND IT IS YOURS** (Glenn, 2026-09-22). `ready` means built but
   not yet in GHL — keep working a row until it reaches `booked`. Naming the two statuses also
   stops an already-`booked` row being swept up and booked a second time, which "not posted" allowed.

   **The floor is T−2h, and it is an expiry, not a filter.** A row more than 2 hours past its slot
   has expired: set `status = 'exception'` and do not build it. Without this the unbounded query
   reaches backwards forever — 47 stale rows piled up through 19 Sep before they were closed by hand.

   **Why the ceiling went away.** The runs only ever booked same-day because they were written as
   daily runs that queried today; nobody chose that horizon. The one rule that justified it — RVA
   fare posts had to be built the morning of, because a price goes stale — was retired when fares
   moved to the freebie job (`CONTENT-FORMATS.md`: *"There is no same-day fare build"*). Booking
   same-day left a 6:18 AM build under three hours from a 9:00 slot with nothing watching it. Include a row whose `assigned_to` is `peer` or `builder` when its
   format is the Builder's: those are the held rows, and taking them is the point of this run. Skip
   anything `assigned_to='glenn'`. Work them in slot order.

3. **For each row:**
   - Find its entry in `C:\Users\gbrow\Downloads\CONTENT-BUILD-<UGH|RVA|PIXFIX>.md` by date and time.
   - **Copy comes only from the build file, verbatim.** If the entry is missing, marked NOT READY, or
     lacks a caption or a headline the format needs, write none: hand the row to Glenn (step 5).
     Never invent a caption, headline, poll option or on-screen line.
   - Build to `C:\Users\gbrow\Downloads\CONTENT-FORMATS.md`: feed images 1080×1350, carousel cards
     1080×1350, Story backgrounds 1080×1920.
   - **Brand rules, and this run exists partly to enforce them.** Each project gets its own look:
     PixFix uses the PixFix Studio header and its style badge; RVA uses its navy and orange. **UGH's
     font and "UGH. WE SHOW UP." never appear on an RVA or PixFix post** — on 12 Sep a PixFix post
     went out with both burned over a stock photo of cables, because the Automation generated it.
     The words at the bottom of the image are exactly the entry's, or nothing.
   - No placeholder (`[FARE]`, `[DESTINATION]`, `{{…}}`) survives into a built post. Copy that depends
     on a fare is filled from that morning's price check, or it is cut.
   - **The Proof / receipt format is retired** (Glenn, 12 Sep): RVA does not post evidence that its
     deals are real, and never posts a "most days there's nothing" line. If a row like that appears,
     it is a planning mistake — hand it to Glenn rather than build it.
   - **Look at the finished image yourself before booking.** Every card of a carousel.
4. **Book through the one booking step only:**
   `node C:/Users/gbrow/Downloads/content-kit/post-ghl.js --entry <row id> …`, with `--caption-ig`
   whenever the caption has a URL. **Read the booking back from GHL and confirm the post is really
   there** — on 12 Sep a booking returned an ID for a post the Social Planner never showed. Book at
   least 15 minutes before the slot. A slot more than 2 hours past is expired — mark it `exception`,
   do not build it, and never re-date it.
5. **What you can't finish goes to Glenn.** Set the row's `assigned_to` = `glenn` and
   `handoff_reason` = one plain sentence saying what's missing and what would unblock it. Never hand
   a row to `builder` — that is this run, and a row it could not finish does not go back to itself.

---

## The report (end of run)

Short, plain, lead with anything that needs Glenn:

- **Needs you:** each row handed to Glenn, with its time and the one-sentence reason.
- **Post by hand today:** each Story poll, with its time and the background this run built.
- **Booked:** each row booked, with its time and GHL ID, confirmed present in GHL.
- **Expired:** any slot more than 2 hours past, marked `exception`.
- **Booked ahead:** how far out the queue now reaches, so the horizon is visible without asking.
- **Left for the Peer:** any reel or video seen today, named, so the Peer's 6:30 run knows.

If everything was booked and nothing needs Glenn, say that in one line and stop.

---

## Live from 13 September

**It builds and it books. There is no approval step** (Glenn, 12 Sep: "I want this shit built,
scheduled and posted based on your plan"). A dry first day was proposed and rejected — do not
reintroduce one. The only things that reach Glenn are the hand-offs in step 5: missing copy, an
unfillable placeholder, a Story poll background, or something that genuinely would not build.

**It pulls its own rows**, so nothing in the code has to change for it to work, and if a morning is
missed the day behaves exactly as it did before this run existed.

**The one step still ahead.** Once this has run clean for a week, `_shared/formats.ts` can route to
it directly: return `"builder"` from `makerOf` for PixFix and RVA stills, carousels and Story poll
backgrounds, and put `"builder"` back in `ASSIGNABLE` so `ownerOf` honours the assignment. That is
what finally takes the load off the Peer in the code as well as in practice.

**The rule that comes out of 11–12 Sep:** a maker gets work routed to it **after** it runs, never
before. If this run stops running, that step must be undone the same day.

---

## Never

- Invent copy, or change the copywriter's words (flag a problem instead).
- Put UGH's CTA, font or photo style on an RVA or PixFix post.
- Book a Story poll in GHL.
- Book around the booking step, or host media anywhere but the app's storage.
- Touch code, deploy anything, or change settings. This run builds and books; nothing else.
