# NBA outreach — the method, retargeted

**Written 2026-10-03.** This is the NFL playbook (`YOUTUBE-OUTREACH.md`) pointed at NBA. Do not
rewrite the method — it worked. 18 channels contacted 6 Sep, predicted "2–4 replies, maybe 1 who
actually promotes," and produced **Ivan Herrera** (Tier 1, 131 views on his latest) who came back
2026-10-02 wanting to talk. The method is validated. Only the targets and the calendar change.

---

## THE CALENDAR IS THE WHOLE GAME

**NBA opening night: Tue 20 Oct 2026.** Fantasy drafts cluster in the **10 days before**, with the
heaviest concentration the weekend of **17–19 Oct**.

| date | what |
|---|---|
| **now – 9 Oct** | Pull the channel list. Start commenting. Tool need not be finished. |
| **10–16 Oct** | Peak outreach. Drafts begin. Tool must be live by **10 Oct**. |
| **17–19 Oct** | Heaviest draft weekend. Anything landing now is late. |
| **20 Oct** | Opening night. The window is shut. |

★ **DO NOT WAIT FOR THE TOOL BEFORE STARTING OUTREACH.** Ivan took **24 days** to reply. A creator
needs lead time to script, record and publish. If the first comment goes out the day the tool is
finished, their video lands after everyone has drafted. **Comment now**, lead with the NFL tool as
proof it exists and ships, and name the NBA date.

---

## FINDING THE CHANNELS — pull this list live, do not reuse the NFL one

The NFL list was pulled live on the day because the whole signal is *"posted in the last 24
hours."* A stale list is worthless. Search YouTube, filter **Upload date: Today**, for:

`fantasy basketball draft 2026` · `fantasy basketball mock draft` · `NBA fantasy draft strategy`
`fantasy basketball sleepers 2026` · `fantasy basketball rankings 2026-27` · `punt FT% build`
`H2H categories draft` · `fantasy hoops draft prep`

**Rank by the VIEW COUNT OF THAT VIDEO, not by subscribers.** That is the rule that made the NFL
run work: it measures whether one person still reads their own comments today.

| Tier | Views on latest | Expectation |
|---|---|---|
| **1 — start here** | **under ~800** | Best odds by far. Ivan was 131. |
| 2 | ~1K–5K | Worth a comment, lower odds |
| 3 | 8K+ | Already has sponsors. Free to try, don't invest |

**Skip:** major media and anyone selling a competing subscription — the NBA equivalents of the
LeBatard/Berry/4for4/FTN exclusions. Hashtag Basketball, Fantrax and the big rankings sites sell
their own product and are competitors, not partners.

**Contact route: comment on their newest video.** Business emails sit behind a per-channel captcha
and cannot be collected in bulk. A comment on a video posted hours ago gets read.

---

## THE MESSAGE

**Change the first line every single time** — name the actual video, a take in it, a player they
argued about. A generic paste reads as a bot and gets deleted. Everything below the first line can
stay fixed.

```
[ONE SPECIFIC THING ABOUT THIS VIDEO — a take, a player, a punt build, a segment.]

Quick offer, no strings. I build last-minute draft boards — the football one is live and free
if you want to see the thing actually works: last-minute-draft-tool.netlify.app

The basketball version lands [DATE]. Same idea, built for the person drafting tonight who
hasn't prepped: who's actually left that gets you [blocks / threes / steals], live injury
flags off Sleeper, and you tap names off as they go.

It's yours free, no signup.

And if you think your audience would use it, I'll split it with you 50/50 — $5.99, so $3 a
sale, your own tracking link, nothing for you to manage.

Either way, good luck with your own draft.

— Glenn
```

**Why lead with the NFL tool:** it is live, free and takes ten seconds to verify. It converts
"some guy is pitching me a thing that does not exist yet" into "this person ships." That is the
single biggest advantage this run has that the NFL run did not.

**If they say yes:** create a separate **Stripe Payment Link** per creator — same $5.99, different
link. Stripe reports per link so payout is exact and the buyer sees no difference. **Do not use
discount codes for this** (and see [[pixfix-paid-path-proven]]: a promo code's `expires_at` cannot
be edited after creation, which makes codes the wrong instrument here twice over).

---

## HONEST EXPECTATION

The NFL run: 18 contacted → 1 real promoter, and he took 24 days. Budget the same. **Contact 25–30
for NBA**, because the window is 10 days rather than a full preseason and some will simply not
reply in time.

Tier 1 is where the yield is. A 30K channel already has sponsors; a 115-view channel has never
been offered a revenue share by anyone, which is exactly why the $3 split earns a reply.

---

## WHAT IS DIFFERENT ABOUT THE NBA BUYER

Worth knowing before writing the first lines, because it changes which creators are worth
contacting at all:

- **NBA fantasy is mostly 9-cat H2H or points, not positional-scarcity drafting.** Multi-position
  eligibility is standard — Sleeper returns `fantasy_positions: ["PF","SF"]`. There is no RB cliff.
- So the pitch is **not** "how many are left before the cliff." It is **"who is left that actually
  gets you the category you're short in."**
- Creators talk about **punt builds** (punt FT%, punt assists) far more than positional runs. A
  comment that shows you know what a punt build is will read as credible; one about tier cliffs
  will read as someone who ported a football tool without thinking.

See `specs/nba-draft-tool-port.md` for what that means for the build.
