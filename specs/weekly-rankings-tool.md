# Weekly rankings tool — design

**Written 2026-10-03 for Glenn's call with Ivan Herrera.** Ivan: *"Yes I would love to build that
out for draft season next year and want to see what we can build out for in-season rankings."*

---

## The one line

**It is not a rankings site. It is "what do I do with *my* team this week, according to Ivan."**

Rankings are a commodity — FantasyPros aggregates everyone's for free. The draft tool's lesson
applies exactly: a list is a table, and nobody wants a table at 11am on Sunday. They want the
decision. **Start Chase or Nabers** is the question actually being asked, five thousand times a day
in every fantasy group on the internet.

---

## Inputs

| # | Input | Source | Friction |
|---|---|---|---|
| 1 | **Ivan's weekly rankings** | Ivan | **The moat. See the constraint below.** |
| 2 | **The user's roster** | Sleeper `/v1/user/<username>` → `/leagues` → `/rosters` | **Username only. No login, no typing, no OAuth** — verified 2026-10-03 |
| 3 | Injury + status | Sleeper `/v1/players/{nfl\|nba}` | Already proven in the draft tool |
| 4 | Current week | Sleeper `/v1/state/{nfl\|nba}` | Free. NFL returned `week: 4` |
| 5 | Who is actually free | the league's own rosters | **See WAIVERS — this is the differentiator** |

Everything except Ivan's rankings is free, public, unauthenticated, and already in use by the
existing tool.

★ **THE CONSTRAINT THAT DECIDES WHETHER THIS LIVES: Ivan's weekly input must take under ten
minutes.** He already builds rankings every week — his words, 8 Sep: *"I'm building out my rankings
and video scripts for the week."* The tool must ingest **what he already makes**, in whatever shape
he already makes it. The moment it asks him for bespoke work, it dies in week three, and it will die
quietly — he will just stop, and the product will serve a stale week to everyone who opens it.

---

## Defining attributes

**1 · It answers. It does not display.** One recommendation, one line of why. Not two rows of
numbers for the user to adjudicate.

**2 · It is ONE expert's calls, not consensus.** Consensus is free everywhere and worth what it
costs. Ivan's name and face on his own calls is a brand product — which is also the reason he will
promote it, because it is *his*. This dissolves the data-source problem that dogs the draft tool:
the data is him.

**3 · It knows YOUR roster.** Generic rankings make the user do the join in their head. Pulling the
roster means the tool can open with *"your three worst starts this week"* without being asked.

**4 · It is time-aware.** Rankings go stale at Sunday 1pm. A tool that knows it is Thursday and
leads with the Thursday-night decision is a different product from a static page.

**5 · The editorial layer, again.** Same as the draft tool's tier names. *"Start him, but it's
close"* vs *"Start him, it isn't close"* — in Ivan's voice. That writing is the product; the
ordering is the commodity.

---

## Three screens. No more.

**1 · MY WEEK** — the default. The user's roster split into **Start · Close call · Sit**, worst
problems first. This is the whole product for most people and they never leave it.

**2 · COMPARE** — two players, one answer, one line of why. The screen people screenshot and paste
into their league chat, which is also free distribution.

**3 · WAIVERS** — ★ **the differentiator.** Because the league's rosters are pulled, this shows
only players **actually available in that specific league** who Ivan ranks above somebody the user
is currently starting. Every other waiver list on the internet is generic and half of it is already
rostered. This one cannot be wrong about availability.

---

## What it is not

Not a projection engine. Not a trade analyzer in v1. Not a league-management app. Three screens
that answer "who do I start" better than anything free, and nothing else.

---

## The honest risks

**This is an app, not a page.** The draft tool is one static HTML file with baked data — it has no
users, no state, no accounts. This needs per-user roster sync, weekly ingestion and persistence.
**Materially bigger build.** Do not let the draft tool's simplicity set the expectation.

**It is dependent on one person shipping weekly.** Miss a week and the product serves stale advice
to everyone who opens it, which is worse than being empty. Needs a visible "rankings last updated"
stamp and a hard rule that stale rankings show a warning rather than pretending.

**NFL first, not NBA.** Ivan is a football creator and NFL in-season is live **right now** —
Sleeper reports `week: 4`. The NBA draft window closes 19 Oct and NBA in-season does not start
until after that. Do not arrive at the call assuming NBA.

---

## Business shape

Weekly use changes the model. The draft tool is $5.99 once a year. This is used every Tuesday
through January, which supports a subscription — or free-with-Ivan's-branding, where he gets
audience and Glenn gets the list.

**Worth settling on the call: what "we build out" means.** Revenue share, equity, or he brings the
audience and Glenn brings the build. Name it plainly on the first call rather than three weeks in.

And still unknown, still the number that decides everything: **Ivan's audience size.**
