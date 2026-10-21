# RVA baseline fares — the exact calculation, read out of the live code 2026-10-21

Glenn asked for the exact calculations. Everything below was read from the files named, today,
not from memory. Paths are in `C:\Users\gbrow\rva-flight-src\RVAFlight-Web-1`.

**Why this file exists:** he is about to talk to Mike Platania, the reporter who covers RIC for
BizSense. Describing the method wrong to that person is worse than not describing it.

---

## 1. THE FORMULA

`src/mastra/index.ts:2113` — the live path, `/api/database/score-deal`:

```ts
const percentBelowBaseline = ((baselinePrice - deal.price) / baselinePrice) * 100;
```

That is the whole comparison. One fare against one number. **No averaging happens at scoring
time** — the averaging, such as it is, already happened when the baseline was set by hand.

## 2. THE GRADE BANDS

`src/mastra/index.ts:2116-2120`, verbatim:

```ts
let baseRating = 6;                                  // 0% < discount < 15%
if (percentBelowBaseline >= 40) baseRating = 10;
else if (percentBelowBaseline >= 36) baseRating = 9;
else if (percentBelowBaseline >= 26) baseRating = 8;
else if (percentBelowBaseline >= 15) baseRating = 7;
else if (percentBelowBaseline <= 0)  baseRating = 4; // at or above normal = not a deal
```

| % below the baseline | grade |
|---|---|
| 40% or more | **10** |
| 36 – 39.9% | **9** |
| 26 – 35.9% | **8** |
| 15 – 25.9% | **7** |
| above 0 but under 15% | **6** |
| 0% or above normal | **4** |

Nothing produces a 5. Grades 1–3 do not exist.

## 3. THE ADJUSTMENTS, then the thresholds

`src/mastra/index.ts:2124-2131`:

```ts
if (deal.stops === 0) score += 0.2;          // nonstop
else if (deal.stops >= 2) score -= 0.2;      // 1 stop = no change
if (cabin === "business" || cabin === "first") score += 0.3;
score = Math.max(0, Math.min(10, score));
```

Then the two thresholds that decide where a fare goes (`src/mastra/publicBand.ts`, Glenn
2026-08-29):

- **7.0 and up** → the **paid** $72/yr newsletter.
- **5.0 up to 7.0** → the **free** tier: FB/IG and `/deals`.
- **Below 5** → nothing. Closed.

## 4. 🛑 THE METHOD IS A 6-MONTH RUNNING AVERAGE. IT WAS NEVER BUILT.

**Glenn, 2026-10-21:** *"we absolutely established how the baseline fare was to be determined. It
is a running average, I believe 6 months."*

**He is right, and the spec is recorded in the repo in his terms.** `src/mastra/storage/seed-routes-baselines.sql`
header, verbatim:

> *"METHOD: baseline = average fare over the trailing 6 months for that route."*
> *"CADENCE: recompute and re-run this file every 3 months to stay current."*
> *"This file IS the quarterly refresh: update the numbers below and re-run it."*

**What is deployed is not that.** The field holds a one-time set of hand-researched numbers, and
no code computes an average of anything. This is a **build gap, not a method disagreement** — my
first draft of this file said "it is not a running average," which described the deployed state
and wrongly implied the method was something else. The method is the running average. Nothing
implements it.

### There is no other column. I checked under every name.

`routes`, from the live `pg_dump` at `schema.sql:164` — **11 columns, all of them:**

```
id · route_key · baseline_price · seasonal_adjustment · created_at · updated_at
destination_name · destination_image · typical_travel_time · destination_color · city_aliases
```

`baseline_price` is the only price-comparison field. A grep across both schema files for
`rolling|trailing|avg_|_avg|average_|six_month|6mo|median|running` returns **zero rows**. So the
figure Glenn expects in that table does not exist under a different name — it does not exist.

### `seasonal_adjustment` is inert too

It is in the table, defaults to `0`, and the scorer never reads it. Its only appearances are
`index.ts:2590` and `2613`, a route-reference endpoint. **No score has ever been seasonally
adjusted.** That is a second piece of the intended method sitting unwired.

### How the numbers in the field were actually produced

The line that describes the domestic values: 

> *"Domestic/US baselines (added 2026-08-17): round-trip economy ~6-month typical,*
> ***researched off Kayak/Expedia/Google/FareCompare. Low-confidence: JFK, CHS.***"

So, verified today:

| | spec | deployed |
|---|---|---|
| How derived | 6-month trailing average of that route's fares | **Human research off Kayak/Expedia/Google/FareCompare.** Not computed from anything. |
| Recomputed | every 3 months | **Never.** `grep` for any write to `baseline_price` across `src/` returns **zero** results. |
| Mechanism | — | **None.** `refreshTablesWorkflow` does the weather matrix and destination images only, and `/health` on 2026-10-21 shows `lastRunAt: null`, **0 runs — it has never executed.** |
| Seasonal adjustment | a column exists | **Never read by the scorer.** Always effectively 0. |
| When entered | — | **2026-08-17**, the day tracking started. Unchanged for 65 days. |
| First refresh due | 2026-11-17 | nothing will do it |

**Why this went unnoticed for 65 days:** the spec lives in a SQL comment, the scorer reads the
field without caring how it was filled, and the field is named `baseline_price` rather than
anything that would advertise it should be computed. Nothing fails. The scorer returns a number,
the grades look plausible, and the newsletter sends. This is the half-landed state the charter
warns about — correct in one place, absent in another, and invisible from both.

**An unseeded route is capped**, correctly — `index.ts` logs `🛑 NO SEEDED BASELINE` and holds the
score below 7.0 so a phantom baseline cannot auto-publish. That fail-safe was added 2026-08-20
after RIC-RSW scored a fake 10/10 against a guessed $600. That part works.

## 5. 🛑 THE EXPOSURE — our own observations do not straddle the baselines

The seed file flags exactly two routes low-confidence: **JFK and CHS**. Those are the two we have
quoted hardest to Axios, to BizSense, and in the Oct 21 reply to Mike Platania.

Our 255 observed fares against the seeded baseline, cut Oct 19:

| route | seeded baseline | our observed avg | our min | our max | n | |
|---|---|---|---|---|---|---|
| **Charleston** | $210 | $133 | $98 | **$206** | 11 | ⚠ low-confidence. **Every** fare we logged is below the baseline. |
| **New York JFK** | $230 | $289 | **$249** | $329 | 10 | ⚠ low-confidence. **Every** fare we logged is above the baseline. |
| Orlando | $200 | $118 | $52 | $183 | 11 | all below |
| Las Vegas | $355 | $250 | $208 | $324 | 12 | all below |
| Punta Cana | $650 | $454 | $403 | $474 | 8 | all below |
| Tampa | $190 | $136 | $103 | $153 | 8 | all below |
| Aruba | $520 | $367 | $304 | $423 | 9 | all below |
| Miami | $250 | $296 | $247 | $340 | 11 | all but one above |
| Chicago Midway | $235 | $281 | $237 | $327 | 13 | all above |
| LaGuardia | $240 | $279 | $249 | $309 | 10 | all above |
| Boston | $290 | $288 | $256 | $315 | 12 | **straddles — this is what a good baseline looks like** |
| Newark | $250 | $255 | $200 | $289 | 10 | **straddles** |
| London LHR | $800 | $837 | $746 | $891 | 10 | straddles |

**What is established:** for most routes our observations sit entirely on one side of the
baseline. A number described as "what that route normally costs" should have fares above and
below it. Boston, Newark and London do. Charleston, Orlando, Las Vegas, JFK and Midway do not.

**What is my inference, not established:** the direction of the error. Fares enter via Google
Flights price alerts, which fire on notable prices, so the sample skews cheap. That explains the
all-below routes. It does **not** explain the all-above routes — if the sample skews cheap and
JFK still never once reached $230, the **$230 baseline is probably too low.** Same for Midway,
LaGuardia and Miami.

**Why this is not a hypothetical.** The direction of the suspected error runs the same way as our
single most-quoted finding — leisure routes cheap, New York and Chicago expensive. Baselines that
are too high on leisure routes and too low on short-haul routes would manufacture exactly that
headline. That claim is already in three reporters' inboxes.

## 6. WHAT GLENN CAN SAY ON THE CALL

**Safe, and all verified:**
- Every observed fare, with its date, route and price. **These are observations and they are
  solid** — $98 to Charleston on four dates is a fact regardless of any baseline.
- The approach: each fare is compared against a researched typical round-trip economy price for
  that specific route, rather than against a generic idea of "cheap."
- 255 graded fares, 26 airports, Aug 17 – Oct 19, 2026. 64 days — a sample, not a season.
- That the baseline is researched and refreshed periodically, and that two routes are held at
  lower confidence.

**Do NOT say:**
- ⛔ **"a running average"** or "a rolling six-month average." It is a static number entered once
  on 2026-08-17 and not changed since. This is the correction to my own earlier wording.
- ⛔ **"computed from our data."** It is researched off consumer fare sites.
- ⛔ Any precise percentage for **JFK or Charleston** as settled fact. Use the raw fares instead:
  "Charleston at $98 round trip, four separate times" needs no baseline at all and is stronger.

**If he asks for the formula:** give it to him. Glenn, 2026-10-20: *"nothing you have shown above
states that we can not post a baseline number. It talks about the formula."* The $72 product is
curation and speed, not a secret ratio — and a reporter who is told "proprietary" stops treating
you as a source. The honest version is also the more credible one.

## 7. THE ONE THING THAT SHOULD HAPPEN BEFORE ANY NUMBER GOES INTO PRINT

**Recompute the 40 baselines and re-run the seed file.** A get-acquainted call is safe if the
method is described accurately. A percentage in a BizSense story is not, while our own
observations sit one-sided against a hand-researched number that is 65 days stale and
self-flagged on two routes.

**The genuine blocker:** this needs a fare source independent of our own alert-biased sample.
Our observations cannot set the baseline they are measured against — that is circular, and it
would move every percentage toward zero. **This is a real gate and it is Glenn's call**, because
it may mean paying for a fare-history source.

**Not done, stated plainly:** the baselines have not been recomputed, no refresh mechanism has
been built, and `refreshTablesWorkflow` still does not touch them.

---

# 8. WHAT GOOGLE FLIGHTS ACTUALLY EXPOSES — read off the live site 2026-10-21

Glenn asked what history can be pulled from Google Flights for our destinations. I opened the real
pages rather than answering from memory. Everything below was read on screen today.

## What IS available, per route + date range

| Field | What it looks like | Verified on |
|---|---|---|
| **Typical price range** | *"The least expensive flights for similar trips to Orlando usually cost between $120–265"* | RIC→MCO, RIC→JFK |
| **Price level** | *"Prices are currently low / typical / high for your search"* | both |
| **Lowest current fare** | `from $58` (MCO), `from $323` (JFK Feb) | both |
| **Price history graph** | plotted axis read: *52 days ago · 38 · 24 · 10* | RIC→JFK |
| **Booking-window advice** | *"lowest prices … about 1–3 months before takeoff. Prices during this time are $74 cheaper on average"* | RIC→MCO |
| **Date grid** | cheapest fare by departure × return date | control present, both |
| **Price graph** | cheapest fare across departure dates | control present, both |

## 🛑 What is NOT available — and it is the thing we need

1. **There is no 6-month history.** The price-history graph covers **~60 days** (axis above), and
   it is history *for that search*, not for the route.
2. **There is no Google Flights API.** QPX Express was retired in 2018 and nothing public replaced
   it. Reading these pages at scale means a third-party scraper.
3. **The "typical range" is NOT a route constant.** This is the finding that matters:

| RIC→JFK, same route | Google's typical range | verdict on ~$325 |
|---|---|---|
| Nov 26 – Dec 2, 2026 *(Thanksgiving week)* | **$240 – 445** | "typical" |
| Feb 10 – 17, 2027 *(quiet week)* | **$160 – 240** | "high" |

**Normal for one route moves from $160–240 to $240–445 depending on the week.** A single static
number per route cannot represent that. This is precisely why Glenn's spec says *running* average
and why `seasonal_adjustment` exists in `routes` — both design instincts were right, neither built.

## ⚠ MY OWN NEAR-MISS, RECORDED SO IT IS NOT REPEATED

Section 5 inferred that **the $230 JFK baseline is probably too low**, because our observed JFK
fares all sat above it. I was one step from reporting that as a finding.

**It does not hold.** That inference came from the Thanksgiving-week band ($240–445). On a neutral
February week Google's band is **$160–240**, which *brackets* our $230 — the seeded baseline looks
reasonable there. I caught it only by noticing Google had auto-selected Thanksgiving week.

Same pattern as the BizSense QA failure: a real observation, one plausible cause, stated as fact.
**Section 5's direction-of-error claim is WITHDRAWN.**

## What this means for the claim already with three reporters

Our JFK observations: **$249–$329, average $289, Aug–Oct 2026.**

- Against the quiet-week band ($160–240) → above normal.
- Against the Thanksgiving band ($240–445) → squarely normal.

Our fares were logged Aug–Oct, which includes late-summer peak. So **"JFK averaged 26% above its
own normal price" is not proven false — it is unfalsifiable with what we have**, because the
seasonal comparator that would settle it was never built. For a reporter who covers this beat,
unfalsifiable is as dangerous as wrong.

**The observed fares are unaffected.** "$98 round trip to Charleston on four dates" is an
observation and needs no baseline. The *percentages* are what rest on the unbuilt method.

## The practical paths, and what they cost

- ⛔ **Amadeus Self-Service — DEAD.** Decommissioned **17 July 2026**; keys deactivated, SDKs
  archived. Enterprise only, by contract. (Several secondary sources agree; not confirmed on an
  Amadeus primary page.)
- ✅ **SerpAPI Google Flights** returns a `price_insights` object carrying `typical_price_range`,
  `price_level`, `lowest_price` and `price_history` — the exact fields above, as JSON. Free tier
  reported at **250 searches/month**, paid from **~$50/mo (~$0.05/search)**. ⚠ Not verified against
  SerpAPI's own pricing page, and a round trip may count as two searches.
- Apify lists Google Flights scrapers with equivalent output.

**Volume math:** 26 airports sampled **weekly** ≈ **112 searches/month** (224 if round trips count
double). That fits the reported free tier and sits well inside the cheapest paid tier.

## MY RECOMMENDATION — one, not a menu

**Adopt Google's own date-conditioned band instead of computing our own average.**

Score each fare against `typical_price_range` for that route *and that travel window*, rather than
against one static number:

1. It is **already seasonally correct** — the band moves with the week, which is the entire problem
   with a single baseline.
2. It is computed by a party with incomparably more fare data than we will ever hold.
3. It **cannot be circular.** Averaging our own alert-sourced fares to set the baseline they are
   measured against would drag every percentage toward zero, because our feed only sees fares cheap
   enough to trip an alert.
4. *"Below the bottom of the range Google itself calls typical"* is a **stronger and far more
   defensible public claim** than a percentage off a number we researched by hand.

A trailing 6-month average of our own data is still worth accumulating — we have 65 days — but as a
cross-check, never the comparator.

**This changes the scoring model, so it is Glenn's call.** Point-vs-band also means the grade bands
in §2 would need restating.

**NOT DONE, stated plainly:** nothing in §8 is built. No baseline recomputed, no API account, no
sampling job written, and `seasonal_adjustment` is still unread by the scorer.
