# SHORTLIST — the daily brief format

**The only bot output Glenn reads.** Everything else logs; this one is read. Designed against the
actual constraint: *"I can not sit here and do outreach all day long… can barely keep things
straight in my head as it is."*

**Target: 15 seconds to triage, 15 minutes to clear.**

Four sections, always in this order, always these names. Order is not cosmetic — it puts the only
thing that needs a human at the top, before attention runs out.

```
1 · NEEDS YOU          replies, and anything blocked
2 · READY TO SEND      max 10, drafted, one decision each
3 · PULSE              one line per platform
4 · NOTHING ELSE
```

---

## 1 · NEEDS YOU — always first, even when empty

A reply is the only event that cannot be delegated. If one came in, it is the first thing on the
page.

```
NEEDS YOU  (2)

▸ Hoops Hierarchy  ·  YouTube  ·  replied 14h ago
  "this is actually clean, how are you pulling the injury data?"
  → Technical question. Sleeper, hourly. He's evaluating, not deflecting.
  Thread: youtube.com/watch?v=...

▸ r/NBA DFS Discord  ·  owner "mikethegrinder"  ·  replied 2d ago  ⚠ AGING
  "might be a fit for my premium channel, what's the split?"
  → Asked a commercial question two days ago and has not been answered.
  This is the warmest thing on the board.
```

**Rules:** quote them verbatim, never paraphrase. Age every reply and flag anything over 24h as
`⚠ AGING`. Add one line of read — what they are actually asking — never a drafted response. Replies
are Glenn's.

**When empty, say so and say what is pending:**
`NEEDS YOU (0) — nothing awaiting you. 14 openers out, 9 inside the 5-day follow-up window.`

---

## 2 · READY TO SEND — ten maximum, each one decision

The bot has already done the work. Glenn's job is **send / edit / skip**.

```
READY TO SEND  (6 of 23 found — 17 below the bar, logged)

1 ▸ Punt Pavilion  ·  YouTube  ·  312 views  ·  posted 6h ago
    "Why I'm Punting FT% Again in 2026"
    HOOK  He spends 4:10 arguing Giannis is draftable in a punt-FT build,
          which is the opposite of the consensus take.
    DRAFT "The Giannis-in-a-punt-FT-build argument at 4:10 is the first
          time I've heard someone actually defend it with the math."
    → [send]  [edit]  [skip]

2 ▸ Fantasy Hoops Degens  ·  Facebook  ·  28.4K members  ·  score 5/6
    RULE TYPE  C — admin approval. Admin: Danielle R.
    WHY        41 posts today, six of them "who do I take at 1.4"
    PARTNER    admin DM, not a feed post
    DRAFT      "Hi Danielle — your group's the only NBA one I've found
               where people are actually asking draft questions this week
               rather than arguing about last season."
    → [send]  [edit]  [skip]

3 ▸ @dfs_nina  ·  X  ·  4.1K followers  ·  replies to her own mentions
    HOOK  Posted a PrizePicks slate breakdown 3h ago, 40 replies, she
          answered 11 of them
    DRAFT "The note about avoiding the Wemby over on back-to-backs is the
          only place I've seen anyone mention the minutes restriction."
    → [send]  [edit]  [skip]
```

**Each entry carries exactly five things:** who, the qualifying number, the **hook** (a specific
real detail), the **drafted first line**, and the decision. Nothing else.

**The drafted line is the whole product.** Everything below it comes verbatim from the fixed
template in `NBA-YOUTUBE-OUTREACH.md` — that part never varies and never needs reading. The first
line is the only thing that changes and the only thing that takes judgment, so it is the only thing
shown.

★ **A hook that could apply to any video is a failure.** "Great breakdown of the slate" is a bot
tell. If the bot cannot find a specific, checkable detail — a timestamp, a named player, an
argument made — it **drops the candidate** rather than padding the list to ten.

★ **Always report what was found and dropped** (`6 of 23`). It shows the bar is being applied, and
a sudden `10 of 11` means the bar slipped.

---

## 3 · PULSE — one line per platform, and the pace

```
PULSE

YouTube    8/8 sent   ✅ all visible      31 contacted
Facebook   2/3 sent   ✅ all visible      joined 5 groups, 2 pending
X          5/5 sent   ✅ all visible
Discord    0/3 sent   ⚠ no new servers found 2 days running

PACE  31 of 25–30 target  ·  6 days to 19 Oct  ·  2 replies  ·  1 aging
```

**The only numbers that earn a place:** cap used, visibility, running total, days left, replies.

★ **`visible` is not optional.** YouTube and Facebook remove content silently — the post succeeds,
it shows in your own logged-in view, nobody else sees it. A bot reporting "8 sent" while the true
live count is zero is the same failure shape as a scheduled task whose `nextRunAt` advances while
it never runs. That one cost five days in September.

**Shadowban escalation outranks everything, including NEEDS YOU:**

```
🛑 STOP — YOUTUBE
   Last 3 comments: visible:false at 30m.
   Sending halted. 6 candidates held, not burned.
   Account needs a human look before anything else goes out.
```

---

## 4 · NOTHING ELSE

No raw dumps. No "here are the 47 channels I looked at." No restating the strategy. No progress
narration. The log holds everything; the brief holds what changes a decision today.

**If there is nothing worth reading, say that in one line and stop:**

`Nothing needs you. 19 sent, all visible, no replies yet. Next follow-ups fire Tuesday.`

That is a complete, correct, useful brief. Length is not the measure.

---

## Delivery

**08:00 daily**, after DEEP has refreshed the search terms at 05:00 and the four platform bots have
run at 07:00. Phone notification, so it can be
cleared from a walk or a coffee.

**`NEEDS YOU` fires its own notification the moment a reply lands** — it does not wait for 08:00.
A warm reply aging for 24 hours because the brief is scheduled is the one failure this whole system
exists to prevent.
