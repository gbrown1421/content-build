# Facebook REELS are being refused on the RVA and PixFix pages

Found by `producer-sweep`, 2026-09-24 11:54 ET. Owner: **Glenn** (it needs a re-connect in GHL —
credentials, so no session can do it).

## What is broken

Two reels went out to Instagram only. Facebook refused both with the same GHL error:

> Social Account token has expired, been revoked, or is otherwise invalid.
> Please re-connect your account and ensure the necessary permissions are granted.

| slot | project | title | FB | IG |
|---|---|---|---|---|
| 2026-09-21 18:00 | rva | Reel 18s — how far ahead to book | FAILED | [published](https://www.instagram.com/reel/DdkMZlrFQnw/) |
| 2026-09-23 18:00 | pixfix | Reel — one image in, eight angles out | FAILED | [published](https://www.instagram.com/reel/DdpXFIljdiX/) |

Row ids: `db299305-25ab-4d07-9a12-cfe928a45b19`, `14b06b7f-31bb-4a06-a2a7-15e1c6f25970`.

## It is NOT a dead Facebook connection

This is the part that matters, because the error message points the wrong way. Every Facebook page
is still publishing stills. Pulled from `calendar_entries.publish_results`, 9/10–9/24:

- **Stills/carousels/polls — all three pages, zero failures**, including RVA FB on 9/22 and 9/23,
  and PixFix FB on 9/22 — i.e. *after* their reels were refused.
- **UGH FB video — never failed**: 9/11, 9/15, 9/16, 9/17, 9/20 all published.
- **RVA FB video — published 9/20 12:00, failed 9/21 18:00.**
- **PixFix FB video — failed 9/23 18:00.**

So the token is valid for photos on all three pages, and valid for video on UGH. It is refused only
for **video, only on the RVA and PixFix pages, only since 9/21**. A plain expired page token would
have taken the stills down too, and it did not.

Best reading: publishing a Reel to a Page needs a permission grant the photo path does not, and the
RVA + PixFix connections are missing it while UGH's has it. The 9/20 RVA reel landing and the 9/21
one failing puts the change inside that window.

Ruled out — both rows booked cleanly, once, as 2 GHL posts, per `workflow_activity`. No double
booking, no media swap, no producer error. GHL accepted the booking and Facebook refused it at
publish time.

All 9 social accounts still list as connected via `ghl-social-post` `action:"accounts"`, so GHL's
own account list will NOT show you this. It only appears in the publish result.

## The fix (Glenn — 5 minutes, in GHL)

1. GHL → the Pix Fix Studio location → Settings → **Social Planner** → Connected Accounts.
2. **Re-connect "RVA Cheap Flights - Richmond Flight Deals"** and **"PixFix Studio - Character
   Turnarounds"** (Facebook pages).
3. On the Facebook permission screen, **grant every permission offered** — do not deselect any.
   The missing one is almost certainly the video/reels scope.
4. Compare against the **UGH** page's connection, which is the one that works.

Do NOT disconnect first if GHL offers a plain "reconnect" — a disconnect can drop the scheduled
posts already booked against that account.

## How to prove it is fixed

The next FB reel on either page is the test. From `C:/Users/gbrow/Downloads/content-kit`:

    node health/sweep.mjs

A clean run prints no half-published lines for rva/pixfix. Or read the row directly — Lovable
`query_database`, project `f42abd5c-1bf5-4137-b1a8-85fb291ddff5`:

```sql
select post_date, post_time, project, post_type, title,
       r->>'platform' as platform, r->>'status' as status, r->>'error' as error
from calendar_entries ce
cross join lateral jsonb_array_elements(ce.publish_results) r
where ce.post_type = 'video' and ce.post_date >= '2026-09-24'
order by ce.post_date, ce.post_time;
```

Facebook must read `published` with an empty `error`.

## Live test already in flight

**2026-09-24 12:30 ET — rva, "Reel 20s — how a fare gets graded before you see it"**
(row `b98d6691-feba-4a4d-9099-fb467f671403`) was already `booked` to FB + IG when this was written,
34 minutes out. It is the same RVA-Facebook-video combination. It went out untouched, deliberately,
because it is a free test: if Facebook publishes it, 9/21 was transient and nothing needs doing; if
Facebook refuses it, the re-connect above is required and this is now three in four days. The
reconciler writes the answer ~15 min after the slot. Run the query above to read it.

## The two reels that already missed Facebook

Not re-booked. Facebook never saw either one, but re-booking the failed half now would (a) almost
certainly hit the same refusal and (b) put 2–3 day old reels on the page. Fix the connection first;
then decide whether either is still worth a Facebook post on its own merits. Both are already
logged in `content-misfires.json` and show on the Project Board.
