# Facebook Reels on the RVA and PixFix pages — **CLOSED, no action needed**

Opened by `producer-sweep` 2026-09-24 11:54 ET. Closed by `producer-sweep` 2026-09-24 14:15 ET.

> ## ★ GLENN: DO NOTHING. DO NOT RE-CONNECT ANY FACEBOOK ACCOUNT.
>
> This spec originally asked for a 5-minute re-connect of two Facebook pages in GHL. **That was
> wrong and it has been disproved.** Both pages published a Facebook Reel today, through the very
> connections the spec accused:
>
> | when | page | result |
> |---|---|---|
> | 2026-09-24 12:30 ET | RVA Cheap Flights | [published](https://www.facebook.com/reel/1786375986042461/) · `error` empty |
> | 2026-09-24 14:10 ET | PixFix Studio | [published](https://www.facebook.com/reel/2238329910046686/) · `error: null` |
>
> Re-granting permissions on two working accounts would risk the ~20 posts already booked against
> them, for no benefit. The original diagnosis is kept at the bottom of this file, struck through,
> so the reasoning is on record — **it is not an instruction.**

## What happened

Two reels went out to Instagram only. Facebook refused both with the same GHL error:

> Social Account token has expired, been revoked, or is otherwise invalid.
> Please re-connect your account and ensure the necessary permissions are granted.

| slot | project | title | FB | IG |
|---|---|---|---|---|
| 2026-09-21 18:00 | rva | Reel 18s — how far ahead to book | FAILED | [published](https://www.instagram.com/reel/DdkMZlrFQnw/) |
| 2026-09-23 18:00 | pixfix | Reel — one image in, eight angles out | FAILED → **reposted 9/24** | [published](https://www.instagram.com/reel/DdpXFIljdiX/) |

Row ids: `db299305-25ab-4d07-9a12-cfe928a45b19`, `14b06b7f-31bb-4a06-a2a7-15e1c6f25970`.

## What it actually was

**An intermittent failure in GHL's Facebook _video_ publish path, reported as a token error.**
The message points at credentials; the credentials are fine. The shape of it, 9/08–9/24, from
`calendar_entries.publish_results`:

- **Facebook video — 3 failures in ~10 posts** (9/08 ugh, 9/21 rva, 9/23 pixfix). Roughly 1 in 3.
- **Facebook stills, carousels and polls — 0 failures in ~30 posts**, on all three pages,
  including RVA and PixFix *after* their reels were refused.
- The same three pages published Facebook video fine on 9/11, 9/15, 9/16, 9/17, 9/20, and again
  on 9/24 twice.

A page token that had truly expired would have taken the stills down with it. None did — on any
page, on any day.

**This is diagnosed, not fixed. It will refuse another reel.** What changed is that the response is
now known and costs one command (below), instead of a permissions grant that would not have helped.

The one thing that would make this a different, genuine failure: Facebook **stills** starting to
fail too. If that happens, the struck-through re-connect at the bottom becomes the right move.

## Evidence the pages work

RVA, from the reconciler's own record on the calendar row:

```
2026-09-24 12:30  rva  video  "Reel 20s — how a fare gets graded before you see it"
  facebook   published   error ""   https://www.facebook.com/reel/1786375986042461/
  instagram  published   error ""   https://www.instagram.com/reel/DdrUft5ChLs/
```

PixFix, read back from GHL after the repair post below:

```
id: 6ab567a09a234aed09d95cee | status: published
  publishedAt = "2026-09-24T18:10:55.124Z"
  error       = null
  previewLink = "https://www.facebook.com/reel/2238329910046686/"
```

Both links return HTTP 200. GHL reissued the post id on publish — booked as `6ab5650b…`, published
as `6ab567a0…`, the same post; see memory `ghl-swaps-post-ids-on-publish`.

## How a half-published row gets repaired now

This did not exist when the spec was opened. The sweep printed *"re-book the FAILED platform only"*
and **no tool could do it**: `post-ghl.js` always sent both of a brand's accounts, so re-running it
would double-post the half that had already landed.

`post-ghl.js --platform fb|ig` (content-kit commit `65031d0`) narrows the send to one account:

    node post-ghl.js --no-calendar --brand pixfix --platform fb --caption cap.txt --media "<url>"

`--no-calendar` is required with it — the row is already booked and must not be booked again; the
script refuses `--platform` together with `--entry` for that reason. The caption guards test the
narrowed set, so a Facebook-only repost may carry a bare URL, while the Instagram "URLs are not
clickable" guard still fires whenever Instagram is in the send.

## The two reels that missed Facebook

**PixFix 9/23 — REPOSTED**, published 14:10 ET on 9/24. Caption taken verbatim from the row; the
reel is evergreen, so the day's delay costs it nothing. It doubled as the test that closed this
spec.

**RVA 9/21 — left alone, deliberately.** Its `caption` column is empty, so there is no copy to
repost with, and writing one is the Copywriter's lane, not the sweep's. 68h old against an
18-follower page — not worth authoring a caption for. If Glenn wants it on Facebook, the row is
`db299305-25ab-4d07-9a12-cfe928a45b19` and the media is still live in `publish-media`.

Both remain logged in `content-misfires.json` and show on the Project Board.

---

# ~~ORIGINAL DIAGNOSIS AND FIX~~ — SUPERSEDED 2026-09-24 14:15 ET

**Kept for the record. Do not act on any of it.** It read the error message at face value and
concluded a permission was missing from the RVA and PixFix connections. Both pages then published
Facebook Reels the same day, which that theory cannot explain.

> ### ~~The fix (Glenn — 5 minutes, in GHL)~~
>
> 1. ~~GHL → the Pix Fix Studio location → Settings → **Social Planner** → Connected Accounts.~~
> 2. ~~**Re-connect "RVA Cheap Flights - Richmond Flight Deals"** and **"PixFix Studio - Character
>    Turnarounds"** (Facebook pages).~~
> 3. ~~On the Facebook permission screen, **grant every permission offered** — do not deselect any.
>    The missing one is almost certainly the video/reels scope.~~
> 4. ~~Compare against the **UGH** page's connection, which is the one that works.~~

What the original got right, and is worth keeping: all 9 social accounts still list as connected
via `ghl-social-post` `action:"accounts"`, so **GHL's account list will never show you this** — a
publish failure of this kind appears only in the publish result. And both rows booked cleanly,
once, as 2 GHL posts per `workflow_activity`: no double booking, no media swap, no producer error.
GHL accepted the booking and Facebook refused it at publish time.
