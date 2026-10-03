# The last-minute draft tool — what it is, where the data came from, what it assumes

**Written 2026-10-03.** A plain-English account of the tool at
**`last-minute-draft-tool.netlify.app`**, for a conversation with a partner. Everything below was
read out of the live file, not remembered.

---

## What it is, in one line

A tiered draft board for somebody who is drafting tonight and has not prepared. It tells you which
round each tier of players actually goes in, and how many are left in that tier before it runs dry.

**It is one HTML file.** No server, no accounts, no signup, no database. It is a static page on
Netlify. That is why it is free and why it loads instantly on a phone at a draft table.

---

## Where the numbers came from

**Average draft position comes from Fantasy Football Calculator's free public API.**

```
https://fantasyfootballcalculator.com/api/v1/adp/ppr?teams=12&year=2026
```

They run public mock drafts and publish the aggregate. The board was built from a pull covering
**7,681 real drafts between 28 Aug and 4 Sep 2026.** That exact window is stamped in the file:

```json
"meta": { "type":"PPR", "teams":12, "rounds":15,
          "total_drafts":7681,
          "start_date":"2026-08-28", "end_date":"2026-09-04" }
```

FFC returns eleven fields per player. **Four were kept** — name, team, ADP, bye week — and the rest
(position rank, times drafted, high, low, standard deviation) were dropped as noise for this use.

**Injuries come from Sleeper**, live:

```
https://api.sleeper.app/v1/players/nfl
```

Fetched when the page opens and re-checked hourly, cached, and **fails silently** — if Sleeper is
down the board still works, it just shows no flags. A player is flagged red if his Sleeper status is
`out`, `doubtful`, `ir`, `pup` or `sus`.

**Nothing else is fetched. There is no back end to go wrong.**

---

## What is NOT from any data source — and this is the actual product

**The tiers are hand-written.** No algorithm grouped these. The names are editorial judgment:

> "Crème de la crème" · "The QB1 block — take one here" · "Same points, three rounds later"
> "The wait-and-win zone" · "After the cliff — stream instead" · "Handcuffs with a path"
> "Truly interchangeable" · "Last pick, no thought"

So are the position notes:

> *QB — "1 starter · one goes early, the next five don't — waiting costs almost nothing"*
> *TE — "1 starter · early or late, never the middle"*
> *K — "1 · your very last pick. They are interchangeable."*

**FFC hands you a table of numbers. Anyone can pull that table.** The tier breaks and the plain
language telling you what the numbers mean are the reason someone keeps the page open during a
draft, and no API provides them.

---

## Every assumption baked in

| # | Assumption | Consequence |
|---|---|---|
| 1 | **The ADP window is frozen at 28 Aug – 4 Sep 2026** | It does not update. Open it today and you see late-August consensus. It was built to be used for one week and it was |
| 2 | **Snake draft** | It is literally titled "Snake Draft Tiers". No auction support |
| 3 | **PPR, half or full** | Both boards are baked in and toggle. No standard scoring |
| 4 | **12 teams** by default | A **14-team version is a separate file in a separate folder**, not a setting |
| 5 | **15 rounds** | |
| 6 | Defaults: **half PPR · 12 teams · 2 flex · DEF on · K off** | Stored per browser |
| 7 | **QB, RB, WR, TE, DEF, K only** | No IDP, no superflex, no dynasty, no keeper logic |
| 8 | **Round ranges derived from ADP ÷ team count** | `r:[5,6]` means "this tier goes in rounds 5–6" — it moves if you change team count |
| 9 | **News alerts are hand-edited** | The file says *"edit this list by hand. Leave it empty and nothing renders."* **It is currently empty.** Suspensions and late news only appear if a human types them in |
| 10 | **Injuries match on normalised name + team** | A mid-week trade or an unusual name spelling can miss. Fails to no-flag, never to a wrong flag |
| 11 | **State lives in the browser** (`localStorage`) | Who is taken and who is yours survives a refresh but **not a different device, and not clearing the browser**. No accounts, nothing stored anywhere else |
| 12 | **No tracking of who used it** | There is no analytics and no user record. Sales were to be tracked by giving each partner their own Stripe payment link |

---

## What a user actually does

1. Opens it. No signup, no email, nothing to install.
2. Sets scoring, team count, flex — or leaves the defaults.
3. Sees every position broken into tiers, each labelled with the round it actually goes and **how
   many players are left in that tier**. The count turns red at zero — that is the "cliff."
4. **Taps a name as it is drafted** by anyone. It crosses off and the tier's remaining count drops.
5. **Double-taps a player they drafted themselves.** It turns green, so their own roster builds down
   the page while they draft.
6. Red and amber flags appear beside injured players, pulled live.

The whole design question it answers is **"do I need to take one of these now, or can I wait?"**

---

## Honest limitations

- **It is useless outside draft week.** No in-season function whatsoever.
- **The data is stale** until someone re-pulls FFC and rebuilds the file.
- **Tiers must be re-written by hand** every time the data is refreshed — that is the labour.
- **Two separate files** for 12-team and 14-team, which will drift apart.
- **No way to know if anyone used it.** No analytics, no accounts.
- **Nothing persists across devices.** Draft on your laptop, your phone knows nothing.

---

## What it cost to make it work

The hard part was never the data — it is a free URL with no key and no scraping. **The hard part is
the editorial layer**: deciding where a tier breaks, and writing the line that tells somebody what
to do about it. That is the part that cannot be automated, and it is the part worth asking a fantasy
creator about, because it is exactly the judgment they already apply every week.
