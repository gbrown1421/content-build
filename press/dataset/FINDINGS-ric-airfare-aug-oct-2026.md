# Richmond International (RIC) airfare — what 254 graded fares show

**Period:** August 17 – October 19, 2026 (64 days)
**Fares logged and graded:** 254
**Destinations covered:** 26
**Compiled by:** Glenn Brown, RVA Cheap Flights · rvacheapflights.com · 804-210-9657

Every fare below is a real round-trip fare observed on the date shown, recorded with the normal
price range Google reports for that same route. The full row-level data is in
`ric-fares-aug-oct-2026.csv`.

---

## The headline finding

**Whether RIC is a bargain or a rip-off depends almost entirely on direction, and the split is
sharper than ""drive to DC for international."**

Richmond is genuinely, repeatedly cheap to the **Carolinas, central Florida, the Gulf coast and
Nashville.** It is consistently expensive to the **Northeast corridor and south Florida** — the
exact short-haul routes travelers assume will be cheap.

**The useful question for a Richmond reader:** *when is flying from RIC actually the better deal,
and when isn't it?*

---

## Where RIC beats its reputation

Routes where observed fares repeatedly came in **below** the normal low for that route.

| Destination | Fares logged | Cheapest seen | Typical floor for the route | Top-grade fares |
|---|---|---|---|---|
| **Charleston** | 11 | **$98** | ~$185 | 8 |
| **Orlando** | 11 | **$52** | ~$90 | 5 |
| Las Vegas | 12 | $208 | ~$273 | 3 |
| Tampa | 8 | $103 | ~$125 | 2 |
| Nashville | 9 | $127 | ~$190 | 2 |
| Fort Myers | 8 | $128 | ~$235 | 2 |
| Aruba | 9 | $304 | ~$320 | 1 |

**Charleston is the standout.** 8 of its 11 observed fares graded at the top of our scale, and it
hit **$98 four separate times** — September 8, September 15, September 25 and October 9. A fare
that recurs is a different kind of fact from a one-off: it means a Richmond traveler who waits will
very likely get another chance.

**Orlando produced the single cheapest fare in the dataset: $52 round trip on October 7.**

---

## Where Richmonders are paying a premium

Routes where observed RIC fares averaged well **above** the normal floor for that route. These are
the trips where driving to Dulles, BWI or Norfolk deserves a look.

| Destination | Fares logged | Average RIC fare | Typical floor | Premium |
|---|---|---|---|---|
| **Fort Lauderdale** | 11 | $207 | $102 | **2.0×** |
| **Boston** | 12 | $288 | $147 | **2.0×** |
| **Miami** | 11 | $296 | $153 | **1.9×** |
| LaGuardia | 10 | $279 | $177 | 1.6× |
| Chicago | 8 | $268 | $185 | 1.4× |
| Newark | 10 | $255 | $179 | 1.4× |
| JFK | 10 | $289 | $207 | 1.4× |

**This is the counterintuitive part.** "Florida is cheap from Richmond" is only half true — Orlando,
Tampa and Fort Myers are genuinely cheap, while **Miami and Fort Lauderdale run roughly twice their
normal floor.** Same state, opposite answer.

Boston at double its normal floor is the other surprise, given how short the route is.

---

## Europe: expensive, with one caveat

Transatlantic fares out of RIC were weak through the period, which matches the common assumption.

| Destination | Cheapest seen | Median | Typical floor |
|---|---|---|---|
| Dublin | $548 | $699 | ~$490 |
| Rome | $575 | $725 | ~$600 |
| Lisbon | $577 | $718 | ~$550 |
| Paris | $640 | $780 | ~$550 |
| London (Heathrow) | $746 | $860 | ~$620 |

Rome is the one exception worth noting: its cheapest observed fare, $575, came in slightly under
the normal floor. Everything else stayed above it for the full period.

---

## What's in the CSV

`ric-fares-aug-oct-2026.csv` — 254 rows, one per graded fare:

| Column | Meaning |
|---|---|
| `date_found` | Date the fare was observed |
| `origin` / `destination_code` / `destination` | Always RIC → the destination |
| `fare_usd` | Round-trip fare observed |
| `normal_range_low_usd` / `normal_range_high_usd` | The normal price range Google reports for that route |
| `pct_vs_normal_low_pos_is_cheaper` | Fare vs the normal floor. **Positive = cheaper than normal; negative = a premium over normal.** |
| `deal_grade` | Our 1–10 grade for the fare |
| `stops`, `airline`, `travel_dates` | Trip details |

Happy to cut this any way that's useful — by month, by route, by airline, or as charts.

---

## Notes on method

Each fare is graded against the normal price range for that **specific route**, not against a flat
dollar threshold. That's what separates "cheap flight" from "unusually good fare": $575 to Rome and
$98 to Charleston are not comparable numbers, but they are comparable *relative to what those
routes normally cost.*

The normal-range figures in the CSV come from Google's own reported range for each route and can be
checked independently. The grading formula built on top of them is ours.

**Caveats worth stating plainly:**
- These are fares *observed*, not every fare that existed. The dataset reflects what the monitoring
  caught over 64 days.
- Airfare moves. Prices here are accurate as of the `date_found`, not today.
- 64 days is a real sample but not a seasonal one. It covers late summer into fall and should not
  be read as a year-round pattern.
