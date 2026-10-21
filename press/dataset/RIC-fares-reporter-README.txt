RVA Cheap Flights - fare-level dataset
Richmond International (RIC) departures, August 17 - October 19, 2026

255 fares. Every row is a real round-trip fare observed on the date recorded.
Compiled by Glenn Brown - RVA Cheap Flights - rvacheapflights.com - 804-210-9657

HOW TO READ IT
Each fare is judged against Google's own published typical price range for that same trip,
captured at the moment the fare was found. That range already reflects the travel dates, how far
ahead the trip was being booked, and the season, so a fare is always compared with like for like
rather than with a single stored "normal price" for the route.

COLUMNS
  date_found              Date the fare was observed.
  origin                  Always RIC (Richmond International).
  destination_code        IATA code of the destination airport.
  destination             Destination city and airport.
  travel_dates            Outbound and return dates of the trip priced.
  departure_date          Outbound date, resolved to a full date.
  days_booked_ahead       Days between the fare being found and departure.
  trip_nights             Length of the trip.
  fare_usd                Round-trip fare in US dollars, taxes and fees included, economy.
  stops                   Stops each way. 0 = nonstop.
  airline                 Operating or marketing carrier as listed.
  google_typical_low_usd  Low end of Google's typical price range for this trip.
  google_typical_high_usd High end of that range.
  value_point_usd         The figure this fare is measured against, set within the range above,
                          deliberately toward its lower end so that an ordinary price inside the
                          typical range is not counted as a deal.
  pct_vs_value_point      How far the fare sits below that figure. Negative means above it.
  grade                   1-10. Distance below the value point sets the grade; a nonstop adds 0.2
                          and two or more stops subtract 0.2.
  sent_to_subscribers     Whether the fare reached the paid newsletter (grade 7.0 and above).

IMPORTANT LIMITS
  - Airfare moves constantly. Each price is accurate as of its date_found, not today.
  - 64 days is a real sample but not a seasonal one. These figures should not be read as a
    year-round pattern for any route.
  - Fares reach us through fare alerts, which surface notably low prices. The set is therefore
    weighted toward the cheaper end of the market and is not a representative sample of all
    fares sold out of RIC.
  - The data describes prices offered, not tickets sold. Nothing here measures how many people
    flew a route, which routes businesses use, or what any traveler actually paid.
  - No comparison with Dulles, BWI or any other airport is made or implied. Every figure
    compares a RIC fare with the typical price for that same RIC trip.
