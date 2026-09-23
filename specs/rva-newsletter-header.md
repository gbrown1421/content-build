# SPEC — RVA newsletter header: use the approved logo

**★ APPROVED BY GLENN 2026-09-23 — the header design below is signed off, build it as written.**
**Not started. Higher priority than `rva-catch-all.md`** —
this is customer-facing and a press pitch already went out carrying the old header.

## What is wrong

The newsletter header currently renders:

    ✈️ RVA Cheap Flights
    🔥 INCREDIBLE SAVINGS for RIC Travelers! 🔥
    [ Don't Miss Out - Subscribe Today ]

on an orange panel.

1. All-caps + fire emojis is the visual grammar of spam. A reader sorts it before reading the
   fare underneath.
2. It contradicts the product's own positioning two inches lower — *"checked and graded, most
   don't make the cut"* is an editorial voice; "INCREDIBLE SAVINGS!" is a shouting one.
3. It shows a **SUBSCRIBE** button to people who are already subscribers — a template artifact.
4. It is not the brand. RVA is navy `#153556`, orange `#F37727`, white (memory
   `rva-brand-identity`), and the approved logo is not used at all.

**This exact header went to `editor@rvahub.com` on 2026-09-23 as a press pitch.**

## Where

`C:\Users\gbrow\rva-flight-src\RVAFlight-Web-1\src\mastra\tools\newsletterTool.ts`
Header block is lines **1316–1321**. Replace lines **1317 (h1), 1318 (p), 1319 (a)**.

## The logo — verified public 2026-09-23, signed out

    https://rvacheapflights.com/media/rva/brand/rva-logo-white.png
    HTTP 200 · 155,813 bytes · image/png · 2172 x 724 · RGBA transparent

Transparent white artwork, so it **must** sit on a dark panel. Panel background becomes
`#153556`, not `themeColors.bgColor`.

## Replacement

    <img src="https://rvacheapflights.com/media/rva/brand/rva-logo-white.png"
         alt="RVA Cheap Flights" width="280"
         style="display:block;margin:0 auto 18px auto;width:280px;max-width:80%;height:auto;border:0;" />
    <p style="margin:0 0 25px 0;font-size:18px;color:#ffffff;font-weight:500;line-height:1.4;">Real fares out of Richmond, checked and graded.</p>
    <a href="https://rvacheapflights.com/deals" style="display:inline-block;background-color:#F37727;color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:25px;font-weight:bold;font-size:17px;">See what didn&rsquo;t make the cut</a>

280px keeps the 3:1 logo sharp without overflowing a 680px email table. **The copy is the
copywriter's and is final** — "Real fares out of Richmond, checked and graded" matches the live
`/deals` page voice.

## The validator — housekeeping, NOT a blocker

`newsletterTool.ts` around line **1494**:

    const headerPatterns = [
      /✈️ RVA Cheap Flights/,
      /INCREDIBLE SAVINGS for RIC Travelers/,
      /View All Deals/
    ];

All three strings disappear with this change. Update the patterns so the check stays meaningful —
**but it does NOT block a send, and this spec previously claimed it did. That was wrong.** Replace the first two with checks for the logo
`src` and the new subhead. **All THREE patterns now change** — the button text changes too (see below), so replace the third as well.

**Grep for other references** before committing — there may be a snapshot test, a preview
renderer, or a plain-text alternative carrying the old strings. Line 1496 is only the one found.

## Prove it

- logo renders, not a broken-image icon (a 404 in an email client is the failure mode)
- panel is `#153556`, white logo legible
- no "INCREDIBLE SAVINGS", no "Subscribe Today" and no "View All Deals" anywhere in the output
- validation **passes** with updated patterns
- **and show it can fail**: feed the validator HTML missing the logo, confirm it rejects

## Deploy

`railway up` ships the WORKING DIRECTORY, not HEAD (memory `rva-repo-cleanup`), and
`.mastra/output/mastra.mjs` is dated **30 Aug** — twelve days older than source. **Rebuild before
deploying** or you ship August code.

Post a Process Alert when it lands, with the deployed evidence.

---

## ★ AMENDMENT (Glenn, 2026-09-23) — the button must not sell the free tier

The original spec sent the header button to `/deals` labelled **"View All Deals"**. Glenn caught
that this is backwards: **`/deals` is the FREE tier — the 6.0-graded fares that did not qualify
for the newsletter.** Pushing a paying subscriber from the paid product to the freebie page is
counterproductive.

**Button copy is now:** `See what didn't make the cut` → `https://rvacheapflights.com/deals`

That reframes the free page as *evidence of the grading standard* rather than a lesser version of
what they bought. It reinforces the filter instead of undercutting it.

**Note the validator consequence:** `/View All Deals/` was the one header pattern the original
spec said to keep. It no longer survives. **All three `headerPatterns` change.**

## ⚠ FOLLOW-ON, NOT PART OF THIS SPEC — `/deals` does not know who is arriving

`/deals` currently shows **"Join for $72 a year"** and *"Members get the top-graded fares by
email."* A paying subscriber clicking this new button lands on a page selling them the thing they
already own.

This spec does not fix that, and it should not be bundled in. Raising it so it is not discovered
by a subscriber. Options, for Glenn: leave it (a subscriber can ignore a signup panel), suppress
the panel via a query parameter on the link from the newsletter, or give the page a members-aware
variant. **Glenn's call, not the builder's.**

---

## ★ CORRECTION (Glenn, 2026-09-23) — the validator does not block anything

An earlier version of this spec warned that changing the header would fail validation and "may
block a send". **That was wrong, and Glenn caught it from evidence:** "View All Deals" is not in
the newsletter that arrived in his inbox this morning — zero occurrences — and it sent anyway.

The reason, at `newsletterTool.ts` ~line 1793:

    // TEMPORARY: Allow testing with relaxed validation to verify email formatting
    if (!validationResult.isValid) {
      logger?.warn('⚠️ Newsletter validation WARNINGS detected - proceeding for testing', ...);
      // Continue execution for testing - validation is too strict
    }

It logs and proceeds. **Today's newsletter already fails the header check and went out regardless.**

So updating `headerPatterns` is tidiness, not a tripwire. Do it anyway — leaving a check that
describes an email nobody sends any more is worse than no check — but nothing breaks if the order
of work puts it second.

**Separate finding, not part of this spec:** a QA check that cannot fail is the failure mode the
charter names explicitly (§3, the 2026-08-22 incident where four QA dimensions reported success
without testing anything). This bypass is marked TEMPORARY and is evidently permanent. Whether to
re-arm it is Glenn's call — re-arming it today would immediately start blocking sends, because
the current template fails its own check.
