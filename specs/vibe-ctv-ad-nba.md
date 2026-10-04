# Vibe.co CTV ad — NBA Last-Minute Draft Tool

**Written 2026-10-04.** Replaces nothing: `Downloads/Draft-Tool-Groups/META-AD.md` is the **Meta**
plan and is NFL-era. Keep it for the social cuts; it is not this.

Everything marked ✅ was read off vibe.co today. Everything marked **confirm in the dashboard** is
something only visible after logging in — it is not guessed at here.

---

## What it costs

| | |
|---|---|
| Minimum | ✅ **$50 per DAY.** "Starts at only $50/d — No Commitment" |
| CPM | ✅ **$15–$35** |
| Payment | ✅ Credit card or wire |
| Commitment | ✅ None — self-serve, stop whenever |

★ **$50 is a daily floor, not a total.** If "$50" was the whole budget in mind, that is exactly one
day of running. Decide the number of days before starting, because the floor sets the pace.

## What $50 actually buys, and what to expect

At $15–35 CPM, **$50 buys roughly 1,400–3,300 impressions.** One day.

The only response mechanism on a TV is the QR code. Treat scan rates as a fraction of a percent —
on that volume you are hoping for **single-digit scans**, and of those only some buy. Realistically
**$50 is a test for one or two sales, not a revenue channel.**

★ **That is still worth doing, for one reason:** it is the cheapest way to find out whether the spot
makes anyone move at all. What it is not is a way to make money this week. **Do not raise the budget
chasing it** — if $50 produces nothing, $200 produces nothing four times over.

## Creative — ready now

**File:** `Downloads/NBA-LMDT-ad/NBA_LMDT_AD30_CTV_-24LUFS.mp4`

| | |
|---|---|
| Duration | **30.00s exactly** |
| Picture | 1920×1080, H.264 High, 30 fps, 8,512 kb/s |
| Audio | AAC-LC, 48 kHz stereo, 192 kb/s |
| Loudness | **−24.0 LUFS, −8.2 dBTP** |

★ **Submit the −24 LUFS version, not the delivered cut.** The original is **−19.3 LUFS** — about
5 dB hot for streaming TV. That gets rejected on some platforms and, where it is accepted, it is the
ad that blares louder than the programme. The video stream is copied untouched, so the picture is
bit-identical.

★ **UPDATED 2026-10-04 — the QR goes to the ORDER PAGE, not straight to checkout.** Decoded out of
the finished file rather than trusted: `https://lastminutedrafttool.com/order?board=nba`. That page
states the $6, the window to 11 Apr 2027 and a support address before handing off to the right
Stripe product — and it means the price or the offer can change later **without reissuing a QR that
is already in the world.**

★ **Source is `NBA_LMDT_AD30_CTV.mp4`. NOT `v01`,** which is superseded and still carries the old
code that went straight to Stripe. Nothing ships from v01.

**Confirm in the dashboard:** Vibe's accepted file size, container and whether they re-encode.

## Targeting

**Confirm in the dashboard** — Vibe advertises geo, audience segments and channel selection, but the
exact taxonomy is only visible once logged in. What to aim for:

- **Geography:** United States. No reason to narrow — NBA leagues are everywhere and narrowing a
  1,400-impression buy makes it thinner.
- **Audience:** sports, fantasy sports, basketball viewers if those segments exist.
- **Channels:** sports and sports-adjacent apps over general entertainment.
- **Flight:** ★ **now through 19 Oct.** NBA opening night is **20 Oct 2026** and drafts cluster
  10–19 Oct. A draft-tool ad after the 19th is money set on fire.

## The landing — a decision worth making before launch

The QR currently goes **straight to Stripe checkout**. `lastminutedrafttool.com/order?board=nba`
did not exist when that code was generated and now does.

★ **Repoint the QR at the order page.** A cold scanner who has watched 30 seconds of TV lands on a
page that says what they get, states the access window, and shows a support address — then pays
through the same Stripe link. Same number of taps to buy, far less cold. It also means the price or
the offer can change later **without regenerating a QR that is already in circulation.**

## How to tell whether it worked

★ **Check Stripe, not the Vibe dashboard.** There is no pixel on the site, so Vibe cannot see a
sale — it can only report impressions and completions, which tell you the ad played, not that it
worked. The real number is **orders on the NBA link during the flight**.

Baseline before starting: **NBA link payment volume is $0.** Anything above that is attributable.

## After it runs

- **1+ sales:** the spot moves people. Decide whether CTV or the creator outreach is the cheaper
  path to the next ten, and spend there.
- **0 sales, scans happened:** the ad works and the landing does not. That is a page problem and a
  cheap fix.
- **0 scans:** people are not scanning a QR from a TV at this volume. That is the honest, most
  likely outcome at 1,400–3,300 impressions, and it is not evidence the spot is bad.

★ **Whatever happens, write the number down.** A $50 test with no recorded result is $50 spent
twice.

## What is NOT in this plan

- **Social.** Cut and delivered, but a **different channel with a different close** — a QR is dead
  weight on a phone-held screen, so the social version speaks and shows the domain instead.
  `cuts/NBA_LMDT_SOCIAL_9x16.mp4` and `cuts/NBA_LMDT_SOCIAL_1x1.mp4`, both from
  `NBA_LMDT_AD30_SOCIAL.mp4`, both 30.00s.

  ★ **Social is mastered to −14 LUFS, not −24.** Instagram, TikTok and YouTube normalise to roughly
  −14; a −24 file plays noticeably quiet against everything around it. Same spot, two deliveries,
  two targets — do not submit the CTV master to social or the social cut to Vibe.

  The ad *plan* for social is still unwritten: `META-AD.md` is NFL-era and points at the dead $5.99
  link.
- **The NFL spot.** Still points at the $5.99 legacy link. Separate decision.

---

## ★ LAUNCHED 2026-10-04 — read off the Vibe campaigns table, not assumed

| | |
|---|---|
| Campaign | `NBA Last-Minute Draft Tool - Oct 2026 test` |
| Status | **Delivering** (Vibe shows "Learning") |
| Goal | Traffic · $10 Cost per Session |
| Flight | **10/04/2026 – 10/05/2026** (2 days) |
| Budget | **$50 Daily** → $100 total, Strategy #1 |
| Targeting | All Apps & Channels · TV · Entire US · Basketball audience 20.8M |
| Creative | `NBA_LMDT_AD30_CTV_-24LUFS`, 30s, transcoded by Vibe |
| Spend / Impressions / CPM at launch | — / — / — (nothing served yet) |

★ **The publish button does not visibly respond.** It stayed on screen, enabled, with the URL still
at `?step=summary` after the click — the same non-advancing behaviour every other button in this SPA
has. **It had published.** The proof is the dashboard counter moving **Draft 0 / Delivering 1** (it
was 0/0/0/0 beforehand) and the campaign row above. Do not re-click a publish button here on the
strength of the button still being there; go read the campaigns table.

### The two numbers to read on 2026-10-06

Baselines taken **before** anything served:

1. **Stripe NBA link volume: $0.** Product `prod_` behind
   `https://buy.stripe.com/9B6dR81Uk87t7xpgNn93y02`. Anything above $0 during the flight is
   attributable to this spot — nothing else points at that link yet.
2. **Vibe pixel `WtTtWi` sessions.** Now installed on `/`, `/order`, `/privacy` and `/thanks`, so
   unlike the version of this plan written this morning, **Vibe CAN see a visit** — a household that
   saw the ad and later landed on the order page shows up as a Session. That is the number the $10
   Cost per Session goal is optimising against.

★ **Scans are not the only path any more.** The pixel means a viewer who ignores the QR and types the
domain later still counts. If sessions are non-zero and Stripe is $0, the landing page is the
problem, not the spot — which is the cheap fix.
