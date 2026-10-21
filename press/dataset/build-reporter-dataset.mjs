// Builds the fare-level dataset Glenn forwards to a reporter.
//   node build-reporter-dataset.mjs
//
// Glenn, 2026-10-21: "update the fare-level data set (CSV) file with the google high/low and the
// new calculated baseline based on the new calculation so I can forward that on if mike asks."
//
// CUT AT 2026-10-19 ON PURPOSE. The source file holds 258 rows; 3 are later. Every figure already
// sent to Axios, BizSense and Mike Platania, and every number on the one-pager, is the 255-row
// Aug 17 - Oct 19 window. A file saying 258 next to a PDF saying 255 is exactly the mismatch
// Glenn caught in the BizSense QA failure on 2026-10-20. Same window, same number, every time.
//
// THE RETIRED BASELINE IS NOT IN THIS FILE. routes.baseline_price was 40 numbers typed by hand on
// 2026-08-17 and never recomputed; it is being replaced. Shipping it beside the new comparator
// would invite a reporter to ask which one is real and get two different answers. It stays
// available in the source CSV for internal work.
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const CUTOFF = '2026-10-19';
const W = 0.375; // (mid - low) * 0.75 + low

const P = (l) => { const o = []; let c = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = ''; } else c += ch; } o.push(c); return o; };
const L = fs.readFileSync(path.join(DIR, 'ric-fares-FULL-aug-oct-2026.csv'), 'utf-8').trim().split('\n');
const H = P(L[0]);
const src = L.slice(1).map(l => { const f = P(l); const o = {}; H.forEach((k, i) => o[k] = f[i]); return o; });
const rows = src.filter(r => r.date_found <= CUTOFF && r.google_typical_low_usd);

const MONTH = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const DAY = 86400000;

const out = [];
let noBand = 0;
for (const r of rows) {
  const lo = +r.google_typical_low_usd, hi = +r.google_typical_high_usd, fare = +r.fare_usd;
  if (!(Number.isFinite(lo) && Number.isFinite(hi) && hi > lo && lo > 0)) { noBand++; continue; }
  const vp = lo + W * (hi - lo);
  const pct = ((vp - fare) / vp) * 100;
  let b = 6;
  if (pct >= 40) b = 10; else if (pct >= 36) b = 9; else if (pct >= 26) b = 8; else if (pct >= 15) b = 7; else if (pct <= 0) b = 4;
  let grade = b;
  if (+r.stops === 0) grade += 0.2; else if (+r.stops >= 2) grade -= 0.2;
  grade = Math.max(0, Math.min(10, grade));

  // lead time + nights from travel_dates ("Thu, Sep 17 - Sun, Sep 20"), year inferred as the
  // first occurrence on/after date_found.
  let lead = '', nights = '', dep = '';
  const parts = (r.travel_dates || '').split(/\s*[–—-]\s*/);
  const grab = (s) => { const m = (s || '').match(/([A-Z][a-z]{2})\s+(\d{1,2})/); return m ? { mo: MONTH[m[1]], d: +m[2] } : null; };
  const a = grab(parts[0]), bk = grab(parts[1]);
  if (a) {
    const found = new Date(r.date_found + 'T00:00:00Z');
    const after = (x, base) => { let d = new Date(Date.UTC(base.getUTCFullYear(), x.mo, x.d)); if (d < base) d = new Date(Date.UTC(base.getUTCFullYear() + 1, x.mo, x.d)); return d; };
    const d1 = after(a, found);
    lead = Math.round((d1 - found) / DAY);
    dep = d1.toISOString().slice(0, 10);
    if (bk) nights = Math.round((after(bk, d1) - d1) / DAY);
  }

  out.push({
    date_found: r.date_found,
    origin: 'RIC',
    destination_code: r.destination_code,
    destination: r.destination,
    travel_dates: r.travel_dates,
    departure_date: dep,
    days_booked_ahead: lead,
    trip_nights: nights,
    fare_usd: fare,
    stops: r.stops,
    airline: r.airline,
    google_typical_low_usd: lo,
    google_typical_high_usd: hi,
    value_point_usd: +vp.toFixed(2),
    pct_vs_value_point: +pct.toFixed(1),
    grade: grade.toFixed(1),
    sent_to_subscribers: grade >= 7 ? 'yes' : 'no',
  });
}

out.sort((x, y) => x.date_found.localeCompare(y.date_found) || x.destination.localeCompare(y.destination));
const cols = Object.keys(out[0]);
const esc = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const csv = [cols.join(','), ...out.map(r => cols.map(c => esc(r[c])).join(','))].join('\n') + '\n';
fs.writeFileSync(path.join(DIR, 'RIC-fares-reporter-aug-oct-2026.csv'), csv, 'utf-8');

const dict = `RVA Cheap Flights - fare-level dataset
Richmond International (RIC) departures, August 17 - October 19, 2026

${out.length} fares. Every row is a real round-trip fare observed on the date recorded.
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
`;
fs.writeFileSync(path.join(DIR, 'RIC-fares-reporter-README.txt'), dict, 'utf-8');

const sent = out.filter(r => r.sent_to_subscribers === 'yes').length;
console.log(`rows: ${out.length} (source ${src.length}, after ${CUTOFF} cutoff ${rows.length}, dropped for no band ${noBand})`);
console.log(`window: ${out[0].date_found} -> ${out.at(-1).date_found}`);
console.log(`airports: ${new Set(out.map(r => r.destination_code)).size}   grade 7+: ${sent}`);
console.log(`retired baseline column present: ${/baseline/i.test(cols.join(','))}`);
console.log('wrote RIC-fares-reporter-aug-oct-2026.csv + RIC-fares-reporter-README.txt');
