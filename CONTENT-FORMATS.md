# Content formats — approved structures

The shape of every content type we publish. **Structure lives here. Copy lives in the
`CONTENT-BUILD-<project>.md` files.** A build entry names a format from this document and then
gives only the words.

Applies to UGH, RVA and PixFix unless a format says otherwise.

---

## Rules that hold across every format

**Every reel has a narrator.** A spoken voice track, not background music with text on screen.
Music sits under the voice and never replaces it.

**One narrator per property**, consistent across every reel:

| Property | Voice |
|---|---|
| RVA | Travel guide. Warm, unhurried, has been there. Never salesy. |
| UGH | Dry, deadpan, in on the joke. Never zany. |
| PixFix | Studio craftsman. Plain, precise, quietly proud of the work. |

**The voice carries the detail; the screen carries only what has to be read.** If a line works
spoken, it does not also go on screen. Text on screen is for the things a viewer must see —
a name, a number, a call to action.

**Reel length is derived from the script, not asserted next to it.** Narration runs at
**2.3 words per second** — measured 8 Sep across four candidate voices, all of which landed
between 2.26 and 2.36. So:

    seconds = spoken words ÷ 2.3        word cap = length in seconds × 2.3

Every length in this file is now derived that way. When a format names a length, that length
carries a word cap, and the copywriter writes to the cap. **If rendered VO measures over, cut
words — never speed the voice.** Pushing a voice to 1.3× buys about 0.8 w/s and costs the
property its narrator; a rushed read is a different voice.

★ This rule exists because every reel script in the 8–14 Sep plan measured 40–75% over its
stated length, and one format asserted "~90 words" and "20s" in the same block — 90 words is
39 seconds. The lengths had never been checked against a clock. They have been now.


**Nothing is written by the builder.** If a build entry doesn't say it, ask. Don't fill it in.

---

## ★ RETIRED — the calendar does not carry fares  *(Glenn, 14 Sep 2026)*

**No calendar post carries a fare.** Not a reel, not a static, not a caption. There is no
same-day fare build, no newsletter screenshot step, and no fallback to name, because there is no
fare-bearing slot left to plan.

**Fares are published by the freebie job, and only by it.** That job price-checks at :00 every
hour and posts at :30, so every number it shows was verified thirty minutes earlier. It renders
its own card at the verified price, and every caption links `/deals`. It posts several times a
day. Scheduling a second, slower, hand-built fare post around that adds nothing and is exactly
what produced stale numbers — a Charleston fare written at $98 and still sitting in a build file
when the real fare was $188.

**Retired with this section:** the Fare Drop reel format, "Book it this weekend", and
Proof / Receipt (already retired 12 Sep — RVA does not post evidence that its deals are real).
The 15 Sep and 19 Sep fare reels have been deleted from the calendar.

**What RVA still plans on the calendar:** destination reviews, explainers, local identity,
question posts, carousels and polls — anything whose value does not depend on a number that
expires. "Why fares jump on a Sunday" is the model: it is about fares and carries none.

**If a future post genuinely needs a live price**, it does not get planned ahead. It gets added
to the freebie job, which is the only thing in this system that knows a fare is still real.

**The freebies do appear on the calendar** (Glenn, 13 Sep) — as a record, not a plan. When the
job books a freebie it writes a `calendar_entries` row: project `rva`, the slot it booked, status
`booked`, the GHL id in `publish_ref`. That is so the sweep, the reconcile and the board can see
those posts. Nothing re-books them, and nobody plans them. (▲8, with the Peer.)

---

# REEL · Destination Review *(RVA)*

**Job:** make the account worth following between deals. Earns the audience the fare drops sell to.

**Length:** 60s · **Max 135 spoken words** · **Built from:** 4 library stills + narration. No footage needed.

| Image | Contains | On screen |
|---|---|---|
| **1** | Logo, destination hero, spotlight title | Destination name + "Destination Spotlight" |
| **2** | Destination hero — the season | *nothing* |
| **3** | Destination hero — attractions, food | *nothing* |
| **4** | Brand CTA card | "Get notified first" · 23 destinations from RIC · site |

**Narration:** 120–135 words. Opens naming the destination. Middle covers what to expect *this
time of year* — weather, what's on, what to do, what to eat. Closes on the subscribe.

**HARD RULE: no fares.** No price, no dates, no booking language, in the voiceover, on screen
or in the caption. The moment a price appears it becomes an ad and gets filed as one.

**CTA:** subscribe to the newsletter — get told first, across all 23 destinations.

---

# REEL · Fare Drop *(RVA)* — RETIRED 14 Sep 2026

This format carried a live fare and is retired with the fare section above. The freebie job
publishes fares now. Do not plan one; do not revive it without replacing the section above too.

---

# REEL · Moment *(UGH)*

**Job:** recognition. Someone sees their own week in it.

**Length:** 15–18s · **Max 40 spoken words** · **Built from:** one photoreal still, or a short cut

**Structure:** setup → the thing going wrong → land on the headline. No resolution, no lesson.
The joke is that it happened, not that anyone learned anything.

**Narration:** short. Under 40 words. Deadpan. The headline appears on screen; the voice does
not read it aloud.

---

# REEL · Series Episode *(UGH Tails)*

**Length:** under 20s · **Max 45 spoken words** · **Built from:** a vertical cut of the episode

Ends **before** the payoff. The reel is a tease; the episode is the product. Always paired
with the poster and the announcement card on the same day.

---

# CAROUSEL

**Job:** saves and shares. A reference people keep.

**Slides:** 4–6. Every slide has one job and the build entry names it.

| Slide | Job |
|---|---|
| 1 | **Hook.** A plain promise. No cleverness, no teasing |
| 2–4 | **The substance.** One idea per slide. The finding, the trap, the second answer |
| Last | **CTA.** Brand card |

Text on a carousel slide is read, not heard — so it carries the full idea, unlike a reel.
Keep each slide under 30 words.

---

# STATIC

**Job:** the daily beat. Cheapest to make, most frequent.

**Structure:** one image, one headline burned on, caption underneath.

- **Headline:** on the image. Short — six words or fewer reads at thumbnail size
- **Image:** photoreal, with a real person in frame having the moment — unposed, not looking at
  the camera, not mugging. ★ The person is the subject, not the mess (Glenn, 13 Sep). The earlier
  "object-led, strongly prefer no people" line was never approved and is what turned the library
  into photographs of spills with nobody in them.
- **Caption:** carries the rest. This is where the length goes
- **Source (UGH Moments):** the moment comes from the `ugh_moment_pool` table, never invented.
  Picked while `active`, set to `bide` at planning time, back to `active` after 90 days.

---

# POLL · Story *(Instagram only)*

Two options, no more. The question is the whole post — the background is a plain branded card.
Nobody reads a story poll twice, so the question has to land in one pass.

---

# POLL · Comment *(Facebook + Instagram)*

A split image — the two options side by side — and a question in the caption asking people to
answer in the comments. The image does the choosing; the caption does the asking.

Options must be genuinely arguable. A poll with an obvious answer gets no comments.

---

# LINK

**Job:** send traffic. The only format where the click is the point.

One image or thumbnail, caption, link. No overlay burn — the platform draws its own preview
card and a burned headline fights it.

Keep the caption short. Every extra sentence is a reason not to click.

---

## Changing a format

These are the approved shapes. If a build entry needs something not described here, that's a
new format and it gets added to this file first — not improvised inside one post.
