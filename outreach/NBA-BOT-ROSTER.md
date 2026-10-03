# NBA outreach bot roster

**Glenn's spec, 2026-10-03.** Eight bots: an executive, a demand researcher, four platform bots
that scout **and send**, a surface-capture bot, and an aggregator. Each platform bot owns its own login, its own daily
cap, its own follow-up timing and its own shadowban check — rate limits are per-platform, so a
central sender buys nothing.

**Target audience and anything tangent to it:** NBA fantasy, DFS, PrizePicks, FanDuel, DraftKings,
Sleeper. The buyer is someone drafting an NBA league in the next ten days; the tangent is anyone
already paying to be better at basketball.

**Deadline: NBA opening night Tue 20 Oct 2026.** Drafts cluster **10–19 Oct**. Every day before
the 19th is worth more than the one after.

★ **Supersedes `_HOW-THIS-WORKS.md`'s "But Glenn posts."** That was written by a session during the
NFL run; Glenn ruled otherwise 2026-10-03 and reaffirmed. Bots send. What has *not* changed is the
fact underneath it: Facebook groups require a **personal profile**, and a ban there is usually
permanent and appeal-proof.

---

## 1 · NBA-EXEC · *outreach lead*

> Runs creator and community outreach for the NBA last-minute draft tool. Owns the calendar — NBA
> opening night is 20 Oct 2026, drafts cluster 10–19 Oct. Dispatches DEEP, TUBE, BOOK, BIRD and
> DISC, runs OWN against the surfaces we can hold ourselves, holds the running target of 25–30
> qualified partners contacted, and reports only to Glenn.
> Contacts nobody directly. Escalates to Glenn the moment any platform bot reports a shadowban
> signal or an account warning.

---

## 2 · DEEP · *demand research*

> Continuously harvests real search demand around NBA fantasy, DFS, PrizePicks, FanDuel, DraftKings
> and Sleeper. For each high-demand query it identifies **who currently captures that traffic** —
> the channel, account, group or server the searcher ends up at. Those owners are the partner
> targets, because they already hold the demand rather than merely posting into it. Feeds its
> findings to TUBE, BOOK, BIRD and DISC as their search terms, and to OWN as the surfaces worth
> taking. **Contacts nobody.**

DEEP sits **upstream of every platform bot**. It researches what people actually search, finds where
those searches land them, and hands the scouts their targeting — instead of letting them hunt terms
somebody guessed at.

### ★ DEEP's output REPLACES the platform bots' query lists

Not supplements — **replaces**. Otherwise the scouts keep searching whatever a human assumed on day
one.

**This was proved the same day the bot was specced.** The roster had TUBE searching
`"punt FT% build"` and `"H2H categories draft"`. Neither term appears anywhere in real autocomplete.
The actual demand, pulled 2026-10-03:

```
GOOGLE    rankings · mock draft · points rankings · rankings 2026
          rookie rankings · dynasty rankings · 9 cat rankings · draft rankings

YOUTUBE   mock draft · draft · points league · sleepers · rankings
          waiver wire · buy low · categories · explained
```

Four scouts were about to spend the only ten-day window of the year searching terms nobody types.

### Sources — all verified 2026-10-03

| source | status | gives |
|---|---|---|
| **Google autocomplete** — `suggestqueries.google.com/complete/search?client=firefox&q=` | ✅ **200, no key, no auth** | Real high-volume queries, in rank order |
| **YouTube autocomplete** — same endpoint **+ `&ds=yt`** | ✅ **200, no key** | A *different* list. See below |
| Reddit `search.json` unauthenticated | ❌ **403** | Blocked. Needs OAuth or drop it |
| ChatGPT / LLM answers | no volume data exists | But see "where it lands them" |

★ **The gap between the two lists is itself the intelligence.** Google returns *rankings, mock
draft, dynasty rankings* — somebody hunting **a tool or a table**. YouTube returns *sleepers, waiver
wire, buy low, explained* — somebody hunting **a person to explain it**. Different intent, different
partner, different opening line. **Feed TUBE the YouTube list.** The Google list is for a future SEO
or ad play, not for creator outreach.

**Harvest the long tail by suffixing.** Query each seed plus every letter a–z (`fantasy basketball
a`, `…b`, …) and plus *best / how / when / who / why*. Ten suggestions become hundreds of real
queries with no paid keyword tool.

### "Where are the results taking them" — the second half of the job

A query is half the intelligence. For each high-demand term, DEEP records **who the searcher
actually lands on**:

- **YouTube** — top 3–5 results, with channel and view count
- **Google** — who holds page one: a site, a creator, or a competing tool
- **LLM answers** — ask ChatGPT and Grok the question a fan would ask, and record **who and what
  they cite**. There is no query-volume data to read, but what an LLM recommends *is* where a
  growing share of people get sent, and it is directly observable.

**A creator who owns a high-demand term is worth more than one who merely posted today.** They
already hold the audience for the exact thing the tool does.

### How it changes targeting

The two signals combine, and should be scored together rather than either alone:

| signal | what it means |
|---|---|
| posted today, low view count | **likely to reply** |
| owns a high-demand query | **worth replying to** |

★ **The best targets have both** — a small channel whose video ranks top-3 for *fantasy basketball
sleepers*. Punching above its weight, and still small enough to read its own comments.

### Routine

**Daily 05:00**, ahead of the 07:00 scouts, so they begin on fresh terms. Writes to the shared log:

`query · source(google|youtube) · rank · owner · owner_platform · owner_size · first_seen · last_seen`

**A query climbing week over week is a trend** — flag it to NBA-EXEC.

Worth noting already: *waiver wire* and *buy low* appear in YouTube autocomplete **today**, before
anyone has drafted. The in-season audience is live and searchable well ahead of draft season, which
is the same signal Ivan Herrera gave independently when he asked about in-season rankings.

## 3 · TUBE · *youtube*

> **Scours** YouTube for NBA fantasy, DFS, PrizePicks, FanDuel, DraftKings and Sleeper content
> posted in the last 24 hours, filtered to Upload date: Today.
>
> ★ **Its search terms come from DEEP, not from this file.** An earlier draft of this roster
> hardcoded "punt FT% build" and "H2H categories draft" — neither term appears in real
> autocomplete and nobody types them. See section 2.
>
> **Ranks by view count on that latest video, never by subscriber count** — that is the signal for
> whether one person still reads their own comments. Tier 1 is under 800 views. Ivan Herrera, the
> only partner the NFL run ever produced, was 131.
>
> **Partner = the creator.** **Sends** a comment on their newest video: one genuine observation
> about that specific video, then the offer. **Cap 8/day.** Never includes a URL in the first
> comment — YouTube silently filters those from low-trust accounts. Follow-up: **one** reply after
> 5 days, then the thread is closed.

## 4 · BOOK · *facebook*

> **Scours** Facebook for NBA fantasy and DFS groups — fantasy basketball, PrizePicks, FanDuel,
> DraftKings, Sleeper, daily fantasy.
>
> ★ **Must operate as Glenn's personal profile, not the PixFix Page.** Groups almost universally
> block Pages; the NFL run lost a day to this. Must **join** each group first — public admits
> instantly, private can take days, so join early and wide before anything is sent.
>
> **Scores every group out of 6** before engaging; under 4 is not worth the account risk:
> 10,000+ members · posts today · **someone asking for draft help right now** · general not a
> single private league · promo possible at all · admins visible but not trigger-happy.
> **The "asking for help right now" test is the one that matters** — a 200k group with none of
> those is worth less than a 15k group with six tonight.
>
> **Classifies each group by rule type and acts accordingly:**
> **D (content permitted)** → value post. **A (no promo)** → comment replies only, answer the
> question properly first. **C (admin approval)** → DM a mod, never post.
>
> ★ **The real partner on Facebook is the GROUP ADMIN**, not the members. One admin of a 50k group
> outranks ten small creators. Prioritize admin DMs over feed posts.
>
> **Never posts a promo code** — the biggest NFL group's rules banned them explicitly. Plain link
> only, and only where rules permit a link at all. **Cap 3 posts or comments/day across all
> groups**, spaced hours apart so they do not read as a blast. Follow-up: **one**, after 5 days.

## 5 · BIRD · *x*

> **Scours** X for accounts posting NBA fantasy and DFS content today — fantasy basketball, NBA
> DFS, PrizePicks, FanDuel, DraftKings, Sleeper. Prioritizes **under 10k followers** and accounts
> that visibly reply to their own mentions, which is the same "still reads their own feed" signal
> TUBE uses.
>
> **Partner = the account holder.** **Sends** a public reply referencing what they actually posted,
> and only DMs after they engage. **Cap 5/day.** Follow-up: **one**, after 5 days.

## 6 · DISC · *discord*

> **Scours** public Discord servers for NBA fantasy, DFS, PrizePicks, FanDuel, DraftKings and
> Sleeper communities. Captures server name, invite route, activity level, and the owner or mod
> handle.
>
> ★ **The partner is the server owner or mod, not the channel.** Posting into a server you just
> joined is the fastest removal on any platform; a mod's blessing is worth the entire server.
> **Sends** a DM to the owner. **Cap 3/day.** Follow-up: **one**, after 5 days.

## 7 · OWN · *surface capture*

> Takes DEEP's top queries and the 6–8 destinations those searches actually land on, and builds the
> plan to put the draft tool **into that set** — so demand arrives without a partner in the middle.
> Owns the surface backlog: what to publish, where, in what order, and what it has to beat. Ships
> what it can ship itself; anything needing a build is handed over as a work order with the asset
> named. **Contacts nobody.**

**Glenn's addition, 2026-10-03:** *"How do we position ourself into that top 6-8 so we are not
relying on others to promote our product?"*

The question OWN answers is not *who will promote us* — it is **why are we not already the answer.**
A partner is rented traffic that stops when they move on. A result we hold keeps arriving.

### ★ Sort every surface by whether it can be won INSIDE the window

Ten days. Most of these cannot be taken in ten days, and pretending otherwise burns the only window
of the year.

| surface | who holds it | takeable by 19 Oct | why |
|---|---|---|---|
| Google page one, **head terms** (*fantasy basketball rankings*) | ESPN, Yahoo, CBS, Rotowire, FantasyPros, Hashtag Basketball, Basketball Monster | ❌ **No** | Domain authority. Months, not days. Do not spend the window here |
| Google, **long tail** (*last minute fantasy basketball draft tool*) | thin or nobody | ⚠ Maybe | A specific page for a phrase nobody holds can rank in days |
| **YouTube search**, long tail | small channels | ✅ Yes | A video ranks in days — the same reason TUBE's targets are findable at all |
| **Reddit threads that rank in Google** | the thread, not a site | ✅ Yes | One genuinely useful answer in a thread that already ranks is a permanent placement |
| **LLM answers** — ChatGPT / Grok *"best fantasy basketball draft tool"* | whoever is citable | ✅ **Yes, and cheapest** | An LLM cites a page that plainly states what the thing does. Nobody has locked this surface |
| Tool directories, subreddit wikis, Discord pinned resources | the community | ✅ Yes | One submission, permanent, no ranking contest |

★ **The verdict: spend the ten days on YouTube long-tail, ranking Reddit threads, and LLM
citability. Queue head-term SEO as the in-season play, not the draft-window play.** The head terms
are where the money is long-run and they are unwinnable by the 19th — and that is the same
conclusion the Ivan conversation reached from the other direction: the durable product is in-season,
not draft week.

### ★ The thing being ranked has to exist first

Charter rule, and it applies here exactly as it does to a caption: **do not point traffic at a page
that does not serve.** No submission, no answer, no video description goes out before the NBA tool
is live. **That keeps 10 Oct as the binding date**, now for two reasons rather than one.

### What OWN ships, and what it hands over

**Ships itself** — under the same pacing, visibility and one-follow-up rules as the sending bots:
forum and Reddit answers, directory and wiki submissions, and the structured copy an LLM can cite.

**Hands over** — anything needing a build or a deploy: a video, a new page on the tool's domain, a
printable sheet. Handed over as a work order naming the asset, the target phrase and the date.
Never as "someone should make a video."

### ★ On the second bot — my recommendation: not yet

You said *"we may need add'l BOT to execute that plan."* **A bot whose only output is a task list
for another bot is a handoff with nobody standing on either side** — the same failure SHORTLIST
exists to prevent (*a list of 200 is a failure*). OWN plans **and** ships everything shippable; what
is left is a build, and a build is already somebody's job.

If a second one is still wanted, scope it to **publishing** — call it SHIP — and never to planning.
**Your call, not a session's.**

### Must prove on its first run

1. **The actual top 6–8 results for each of DEEP's top 3 queries — fetched and listed, not
   assumed.** Who holds each slot and how big they are. *We have the verified autocomplete lists;
   we do not yet have the result pages. Getting them is OWN's first job, not an assumption to
   build on.*
2. For each slot, **which kind** of thing holds it — a site, a creator, a thread, or an LLM answer.
   The tactic is completely different for each, so a list of URLs without this is useless.
3. **One surface marked takeable inside the window with a reason, and one marked not, with a
   reason.** A plan where everything is takeable has not been thought about.

### Routine

**Weekly** — surfaces move slowly. **Daily until 19 Oct**, because the window does not.

Re-checks whether anything it published is actually ranking, on the same discipline the sending bots
use for visibility: **published is not ranked, and reporting the first as the second is the failure
this whole system is built to avoid.**

## 8 · SHORTLIST · *aggregator*

> The only bot whose output Glenn reads. Collects everything the four platform bots logged —
> plus whatever OWN published or queued, so the brief is not blind to half the operation —
> de-duplicates across platforms (the same person often runs a channel and a Discord),
> ranks, and returns **no more than ten per run** — each with platform, why they qualify, the one
> specific detail worth referencing, current outcome state, and anything awaiting a reply.
>
> **A list of 200 is a failure. Ten Glenn can act on in fifteen minutes is the job.**
>
> Also surfaces every thread that **got a reply**, at the top, because that is the only place a
> human is actually required.

---

# RULES EVERY SENDING BOT FOLLOWS

**1 · Volume is what trips detection, not wording.** Combined ~19/day clears the 25–30 target in
two days. More is not faster, it is banned.

**2 · Human pacing.** Randomized 20–90 minute gaps, never fixed. Nothing between midnight and 7am
local.

**3 · The first line must be real** — an actual observation about that specific video, post or
thread. A spun template is deleted by moderators and deserves to be. This is also the entire reason
the NFL method worked.

**4 · No link in the opener.** Name the tool, let them ask. The link goes in the reply.

**5 · One opener, one follow-up, then stop.** Five days apart. A second bump is harassment and the
fastest route to a report.

**6 · Separate, warmed accounts — except Facebook.** ★ **Do not post from the UGH channel**: a ban
there costs the audience UGH Tails is being built for. Dedicated draft-tool accounts, two weeks old
with real activity, on YouTube / X / Discord. Facebook is the exception and the risk — groups
require Glenn's real personal profile, and accounts under 3 months get filtered by group rules
anyway.

## ★ VERIFY IT IS ACTUALLY VISIBLE

**YouTube and Facebook remove content silently.** The post succeeds, it shows in your own
logged-in view, and nobody else can see it. Without a check every bot reports "sent" while the true
live count is zero — the same shape as a scheduled task whose `nextRunAt` advances while it never
runs, which cost five days in September.

**Every sending bot re-checks its own post 30 minutes later from a logged-out view and logs
`visible: true/false`.** Three consecutive `false` = stop that platform immediately and escalate to
NBA-EXEC. Do not keep burning candidates against a dead account.

## Logging

One shared store, not conversation history:

`platform · target · partner_type · score · posted_at · message · visible_at_30m · replied_at ·
followed_up_at · outcome`

`partner_type` ∈ creator / group_admin / server_owner / account
`outcome` ∈ found / contacted / replied / promoting / dead

★ **Every bot writes a dated line on every run, even a run that finds nothing** — run history has
no drill-in, so a missing line is visible where a missing run is not.

★ **The `replied_at` column is load-bearing.** Ivan took **24 days**. Without it a slow thread looks
identical to a dead one.

---

## What stays human

**Every reply.** The bots send openers and one bump. The moment anyone answers, the bot notifies
Glenn and stops. Ivan's reply was *"Would love to chat"* — the conversation is where the money is,
and it is the one thing that cannot be delegated.

## Honest expectation

NFL: 18 contacted → 1 promoter → 24 days to reply. **Automation changes the cost of contacting, not
the conversion rate.** Expect 1 in 18. At ~19/day the target is cleared in two days, which puts the
binding constraint back where it has been all along: whether the tool is live by **10 Oct**.
