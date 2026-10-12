# Spec — the producer must never burn markup into an image

**Raised 2026-10-12 by Glenn**, who found `<BR>` rendered into the middle of a live UGH post:
*"the text overlay is crap, `<BR>` should not be part of the graphic"*. He deleted that post.

## What is wrong, verified

`supabase/functions/producer/index.ts` burns the headline with **imagescript**, which renders
**plain text and nothing else**:

```ts
const headline = String(entry.overlay_headline ?? "").toUpperCase();
Image.renderText(font, size, headline, fill, new TextLayout({ maxWidth: safe, wrapStyle: "word" }))
```

There is no HTML parser anywhere in that path, so `<br>` is drawn as the literal characters —
and `.toUpperCase()` is why it appears as `<BR>`. The layout **already word-wraps** on
`maxWidth`, and `fitSizeCapped` already shrinks the type until it fits three lines, so an
explicit break was never needed for the text to lay out correctly.

**Four UGH posts went out this way**, confirmed by opening the rendered PNGs:

| Date | Burned into the image |
|---|---|
| 2026-10-05 08:00 | `PLUGGED iN<BR>TO NOTHiNG` |
| 2026-10-07 12:00 | `WHICH ONE HAS<BR>BEEN LONGER?` |
| 2026-10-10 11:00 | `ONE THiNG.<BR>iT WAS ONE THiNG.` |
| 2026-10-12 08:00 | `iT iS RiGHT<BR>THERE. iNSiDE.` |

**RVA and PixFix are NOT affected** and need no change — their stills are built by the
HTML-template builders, where `<br>` is real markup and renders as a line break. Verified by
eye on the 2026-10-13 PixFix still and the 2026-10-14 RVA question card; both are clean. So
this is a producer-burn-path bug only, and `<br>` stays valid copy for those two lanes.

## The desired outcome, stated so it can fail

1. A headline containing `<br>` renders with a **line break and no visible tag**.
2. A headline containing **any** other angle-bracket markup never reaches the canvas as
   literal characters.
3. Feeding the burn path `A<br>B` and asserting the burned string contains no `<` **fails
   against today's code** and passes after the change. Per the charter, show it failing first —
   four QA dimensions shipped as hardcoded `pass: true` on 2026-08-22 because nobody did.

## The change

In `producer/index.ts`, between reading `overlay_headline` and burning it:

- Replace `<br>`, `<br/>`, `<br />` (any case, surrounding spaces absorbed) with a newline if
  `Image.renderText` honors `\n` — **test that first, it is not documented**. If it does not,
  replace with a single space and let the existing word-wrap place the break.
- Then **strip any remaining `<...>`** rather than drawing it.
- Then, if the cleaned string still contains `<` or `>`, **throw** so the row goes to
  `exception` instead of publishing a broken graphic. A silent strip hides the next variant of
  this; a throw surfaces it.

Apply the same treatment to the CTA string, which goes through `drawText` on the same path.

## What it must prove

- The new unit test fails on the current code and passes after. Paste both runs.
- One real render through the actual producer — not a hand-run of the same function — of a row
  whose headline contains `<br>`, with the output PNG linked.
- `select count(*) from calendar_entries where project='ugh' and overlay_headline ilike '%<br%'`
  returns rows that now render clean.

## Already done, do not redo

The two unrendered UGH rows were cleaned in the DB on 2026-10-12 (`17b62d2d…` 10-14 12:00 and
`e443388b…` 10-17 11:00) so nothing upcoming ships broken while this is built. The four posted
rows were **deliberately left** carrying `<br>` — they are the record of what actually went out.

Deleting the four live 2026-10-12 posts is Glenn's, in hand.
