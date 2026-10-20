# Richmond International (RIC) airfare — what 255 graded fares show

**Period:** August 17 – October 19, 2026 (64 days)
**Fares logged and graded:** 255 across 26 destinations
**Compiled by:** Glenn Brown, RVA Cheap Flights · rvacheapflights.com · 804-210-9657

Every fare below is a real round-trip fare observed on the date shown. Fare-level data is in
`ric-fares-aug-oct-2026.csv`, which also carries Google's own typical price range for each route
so every figure can be checked two ways: against our own baseline and against Google's.

---

## The headline finding

**Richmond beats the normal price on 17 of the 26 routes tracked — and the nine it loses on are
mostly the short hops travelers assume will be cheap.**

The New York airports, Chicago and Miami are the weakest value out of RIC. Orlando, Charleston,
Las Vegas and Tampa are the strongest.

**The useful question for a Richmond reader:** *when is flying from RIC actually the better deal,
and when isn't it?*

---

## Where RIC comes in below the normal price

Average across every fare observed on that route.

| Destination | Fares observed | Average vs normal | Cheapest seen |
|---|---|---|---|
| **Orlando** | 11 | **41% below** | **$52** |
| **Charleston** | 11 | **37% below** | **$98** |
| Las Vegas | 12 | 30% below | $208 |
| Punta Cana | 8 | 30% below | $403 |
| Tampa | 8 | 29% below | $103 |
| Aruba | 9 | 29% below | $304 |
| Nashville | 9 | 26% below | $127 |
| Fort Myers | 8 | 21% below | $128 |
| Providenciales | 9 | 13% below | $503 |
| Dublin | 9 | 12% below | $548 |
| Rome | 9 | 10% below | $575 |

Cancun, Paris, Lisbon, Montego Bay, Denver and Boston also averaged below normal, by smaller
margins.

**Charleston is the most consistent.** It hit **$98 on four separate occasions** — September 8,
September 15, September 25 and October 9. A fare that recurs is a different kind of fact from a
one-off: it means a traveler who waits will very likely get another chance.

**Orlando produced the single cheapest fare in the dataset: $52 round trip on October 7**, which
is 74% below what that route normally costs.

---

## Where Richmonders pay above the normal price

These are the trips where driving to Dulles, BWI or Norfolk deserves a look.

| Destination | Fares observed | Average vs normal |
|---|---|---|
| **New York (JFK)** | 10 | **26% above** |
| **Chicago (Midway)** | 13 | **20% above** |
| **Miami** | 11 | **18% above** |
| New York (LaGuardia) | 10 | 16% above |
| Fort Lauderdale | 11 | 15% above |
| Chicago (O'Hare) | 8 | 14% above |
| London (Heathrow) | 10 | 5% above |
| London (Gatwick) | 10 | 4% above |
| Newark | 10 | 2% above |

**Same state, opposite answer.** Orlando and Tampa are two of the strongest routes out of RIC.
Miami and Fort Lauderdale are among the weakest. "Florida is cheap from Richmond" is true for
central Florida and the Gulf, and false for the south-east corner.

**The Northeast corridor is the clearest pattern.** All four New York-area and Boston-area options
sit at or above normal, and JFK is the single worst value in the dataset.

---

## What's in the CSV

`ric-fares-FULL-aug-oct-2026.csv` — one row per graded fare, 258 as of Oct 20 (255 through Oct 19):

| Column | Meaning |
|---|---|
| `date_found` | Date the fare was observed |
| `origin` / `destination_code` / `destination` | Always RIC → the destination |
| `fare_usd` | Round-trip fare observed |
| `route_baseline_usd` | What that route normally costs — the figure the grade is computed from |
| `pct_below_baseline` | How far under that figure this fare landed |
| `deal_grade` | Our 1–10 grade for that fare |
| `stops`, `airline`, `travel_dates` | Trip details |
| `google_typical_low_usd` / `google_typical_high_usd` | Google's own typical range for that route, included as an independent reference |

Happy to cut this any way that's useful — by month, by route, by airline, or as charts.

---

## Notes on method

Each fare is graded against what that **specific route** normally costs, not against a flat dollar
threshold. That is what separates "a cheap flight" from "an unusually good fare": $575 to Rome and
$98 to Charleston are not comparable numbers, but they are comparable relative to their own routes.

The percentages in this document are averages across all fares observed on each route.

**Caveats worth stating plainly:**
- These are fares *observed*, not every fare that existed. The dataset reflects what the monitoring
  caught over 64 days.
- Airfare moves. Prices here are accurate as of the `date_found`, not today.
- 64 days is a real sample but not a seasonal one. It covers late summer into fall and should not
  be read as a year-round pattern.
