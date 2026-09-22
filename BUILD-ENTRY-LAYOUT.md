# Build entry layout — draft, revised after copywriter review (pipeline map, item 1)

**Drafted by the Peer 10 Sep 2026; revised the same night with the copywriter's review.** Nothing
here is built yet. Item 1 comes after 12 and 2/3/6 in the agreed order; this settles the shape first.

## What it's for

Today the build file is a set of markdown documents on the laptop (`CONTENT-BUILD-<project>.md`),
where the Automation can't read them. Item 1 moves it into the Lovable database: **one entry per
post, found by the calendar row's ID.** The copywriter fills it. Every maker (Automation, Builder,
Peer) reads it and builds it **verbatim**, exactly as the build files work now.

`CONTENT-FORMATS.md` keeps the shapes. An entry names a format from that file and gives only what
that format needs.

## Where it lives (proposed)

A new table, `build_entries`, one row per post:

| Column | What it holds |
|---|---|
| `calendar_entry_id` | The calendar row's ID. The key — one entry per post. |
| `format` | The format name exactly as `CONTENT-FORMATS.md` spells it, e.g. `REEL · Fare Drop`. |
| `status` | `draft` or `final`. The copywriter sets `final`; makers build `final` entries only. |
| `entry` | The fields below, as JSON. |
| `updated_at` | When the copywriter last changed it. |

## The fields

**Copy fields** are the copywriter's words and go in verbatim. **Build fields** tell the maker what
to make; they are not published words. **A maker never writes or picks a copy field.**

### Every entry

| Field | Kind | What it is |
|---|---|---|
| `headline` | copy | The words burned on the image or first frame. Static: 6 words or fewer. Link posts: none (the platform draws its own card). |
| `image_cta` | copy | The exact words burned at the **bottom** of the image, or `none`. Required on every entry that has an image. Makers never pick it. This is what stops "UGH. WE SHOW UP." landing on PixFix and RVA posts, and pathway lines being burned onto Tails posters. |
| `caption` | copy | The full caption, verbatim. Never empty. On Facebook a URL in it is clickable. |
| `caption_ig` | copy | Instagram's caption. **Required whenever `caption` contains a URL.** Instagram never linkifies a caption, so the link becomes the address in words plus "link in bio". Otherwise optional; if empty, Instagram uses `caption`. |
| `notes` | build | Anything a maker must know that isn't copy, e.g. "Already queued in GHL. Do not rebuild." |
| `fallback` | both | A complete second entry of the same shape, plus `when`: the condition that triggers it. **Required on every fare-bearing post** (CONTENT-FORMATS: a fare slot without a fallback is incomplete). |

### Reels: `beats[]`, one per beat, in order

| Field | Kind | What it is | Reel builder reads it as |
|---|---|---|---|
| `seconds` | build | The beat's planned length. The builder may lengthen a beat to fit its line, never shorten the voice. | `beats[].seconds` |
| `picture` | build | What the frame shows, described: "Charleston hero — harbor or Rainbow Row". The maker picks the file. | `beats[].image` (the file it picked) |
| `asset` | build | Optional. An exact library asset (its ID or file path). **Overrides `picture`**: the maker uses this file and picks nothing. | `beats[].image` |
| `on_screen` | copy | Text burned on that beat. Empty means nothing on screen. | `beats[].onScreen` |
| `say` | copy | What the narrator says in that beat. Empty means silence. | rendered to `beats[].voFile` |

These map straight onto what `content-kit/rva/build-fare-drop-reel.mjs` already takes
(`beats[].seconds / image / onScreen / voFile`). The builder turns `say` into the voice file and
`picture` (or `asset`) into an image path. The words never change on the way.

### Carousels: `cards[]`, 4 to 6

| Field | Kind | What it is |
|---|---|---|
| `picture` | build | What the slide shows, described. |
| `asset` | build | Optional exact library asset. Overrides `picture`. |
| `text` | copy | The words on the slide. Under 30 words. |

### Statics: `picture` / `asset`

A static carries one `picture` (described) or `asset` (exact, overrides `picture`), plus the
`headline` and `image_cta` above.

### Polls: `poll`

| Field | Kind | What it is |
|---|---|---|
| `question` | copy | The question. Story polls: it is the whole post. |
| `options` | copy | Exactly two. |

**Story polls are posted by hand** (GHL can't post a Story). The entry carries the question and
options for the background build; nothing books them. Every Story poll is listed on **Glenn's
morning report** as "post by hand", with its background attached.

### Link posts: `link`

| Field | Kind | What it is |
|---|---|---|
| `url` | build | Where the post sends people. |
| `ig_card_text` | copy | The words on the Instagram template background. |

Per item 14 (decided 10 Sep), a link post books as **two posts**: Facebook with its own link
preview card, and Instagram with an approved template background (3 per brand, rotated), carrying
`ig_card_text`. The maker picks the next background in the rotation; it never writes the words.

## Fares

A fare-bearing entry writes the number as a placeholder: `[FARE]`, `[DATES]`, `[DESTINATION]`.
The maker fills it from that morning's price check (CONTENT-FORMATS, "Any post carrying a fare is
built the SAME DAY"). Placeholders are allowed **only** in fare-bearing formats, and **never
survive into a built post** (see the checks).

In a `say` line the maker fills `[FARE]` as **spoken words**, e.g. "Ninety-eight dollars", so the
narrator never reads out a dollar sign.

**Copy that depends on the fare must be a placeholder or be cut.** A line like "under half the usual
price" is true for one fare only. Facts about the route (the usual price, flight time, nonstop)
can stay as written.

## Checks (proposed)

Each one can fail, and each is tested against a bad entry before it ships.

**Before a maker builds the entry:**

- **Caption present:** `caption` is not empty.
- **Image CTA present:** every entry with an image has `image_cta` (the words, or `none`).
- **Instagram caption:** `caption_ig` is present whenever `caption` contains a URL.
- **Link caption:** a Link post's `caption` contains its `link.url`.
- **Reel length:** words in all `say` lines ÷ 2.3 must fit the format's length. Fare Drop: 30s,
  70 words. Moment: 15–18s, 40 words. Destination Review: 60s, 135 words. Series Episode: under
  20s, 45 words.
- **Fallback present** on every fare-bearing format.
- **Carousel:** 4 to 6 cards, each `text` under 30 words.
- **Static:** `headline` 6 words or fewer.
- **Poll:** exactly two `options`.
- **Link:** no `headline` (a burned headline fights the preview card).
- **Format** matches a heading in `CONTENT-FORMATS.md` exactly.

**After it's built, before it's booked:**

- **No leftover placeholders** anywhere in the BUILT post — caption, `caption_ig`, burned text, or
  the voice script: no `{{…}}`, `[FARE]`, `[DATES]` or `[DESTINATION]`. A post that still carries
  one is not booked.

## Worked example: Tue 8 Sep 17:30, the Charleston fare drop

The copywriter's version, as it sits in the entry **before** the morning price check: the fare and
dates are placeholders. Everything else is verbatim from `CONTENT-BUILD-RVA.md`.

```json
{
  "calendar_entry_id": "<the 8 Sep 17:30 RVA row>",
  "format": "REEL · Fare Drop",
  "status": "final",
  "entry": {
    "headline": "[FARE]",
    "image_cta": "none",
    "beats": [
      { "seconds": 2, "picture": "Charleston hero — harbor or Rainbow Row", "on_screen": "[FARE]",
        "say": "[FARE]. Richmond to Charleston." },
      { "seconds": 4, "picture": "Charleston wide", "on_screen": "RIC → CHS · Breeze · January",
        "say": "That is the whole roundtrip, not one way, on Breeze in January." },
      { "seconds": 7, "picture": "Winter plate leads — gardens, quiet street, oysters", "on_screen": "",
        "say": "January runs high fifties, and the gardens outside town are in camellia bloom — Magnolia, Middleton, and almost nobody in them. It is peak oyster season too." },
      { "seconds": 4, "picture": "Calendar / booking", "on_screen": "[DATES]",
        "say": "These are the dates it is open on. We checked it this morning." },
      { "seconds": 3, "picture": "Brand card", "on_screen": "rvacheapflights.com",
        "say": "We grade every fare before we post it. New Richmond deals daily." }
    ],
    "caption": "[FARE] roundtrip, Richmond to Charleston. Nonstop on Breeze, in January.\n\nOpen at that price: [DATES].\n\nA RIC–Charleston roundtrip usually runs about $210. This one went out to the newsletter first.\n\nWe check every fare before we post it. Whether it is still there when you look is up to Breeze.\n\nrvacheapflights.com/deals",
    "caption_ig": "[FARE] roundtrip, Richmond to Charleston. Nonstop on Breeze, in January.\n\nOpen at that price: [DATES].\n\nA RIC–Charleston roundtrip usually runs about $210. This one went out to the newsletter first.\n\nWe check every fare before we post it. Whether it is still there when you look is up to Breeze.\n\nrvacheapflights.com/deals — or link in bio",
    "fallback": {
      "when": "all three newsletter deals fail the price check",
      "headline": "Nobody flies out of Richmond",
      "image_cta": "none",
      "beats": [
        { "seconds": 3, "picture": "RIC departures board, early", "on_screen": "Nobody flies out of Richmond",
          "say": "People will tell you that you can't fly anywhere good out of Richmond." },
        { "seconds": 6, "picture": "Map or route graphic, RIC centered", "on_screen": "23 destinations",
          "say": "There are twenty-three destinations you can reach from RIC, and eleven of them are nonstop." },
        { "seconds": 6, "picture": "Two or three destination heroes", "on_screen": "",
          "say": "Charleston in seventy-five minutes. Nashville in under two hours. Boston, Miami, Cancún, Dublin. From a small airport twenty minutes from most of the city." },
        { "seconds": 5, "picture": "Brand card", "on_screen": "rvacheapflights.com",
          "say": "The flights are there. Most people just never look. We look every morning." }
      ],
      "caption": "\"You can't fly anywhere good out of Richmond.\"\n\n23 destinations. 11 of them nonstop. Charleston in 1h15, Nashville in under two hours, and a list that runs through Boston, Miami, Cancún and Dublin.\n\nRIC is 20 minutes from most of the city and you're through security in ten.\n\nThe flights are there. Most people just never look — we look every morning."
    }
  }
}
```

**What the checks say about it:**

- **Instagram caption:** the main `caption` ends in `rvacheapflights.com/deals`, so `caption_ig` is
  required. The 8 Sep entry never had one and would have been **stopped**. The copywriter's
  `caption_ig` is now in the example, so it passes.
- **Reel length:** passes, main and fallback both. With the fare filled on the day (8 Sep:
  "Ninety-eight dollars"), the main version was **68 spoken words ÷ 2.3 = 29.6s**, and the fallback
  is **65 words = 28.3s**, both inside 70 words / 30s. (Counted 10 Sep with a script over the `say`
  lines.) The beat `seconds` add up to only 20s (the layout was first written for a 20s slot), so
  the builder lengthens each beat to fit its line; the voice is never sped up.
- **Placeholders in the built post:** the fare and dates are filled at build time, so this passes
  once built.
- **Fare-dependent lines (copywriter, 10 Sep):** "Three windows are open" became "Open at that
  price: [DATES]", which holds for any number of windows. "So this is under half, and it is the
  biggest drop we have graded in the last week" is cut, because both claims depend on the fare.
  The usual price (about $210) stays, since it's a fact about the route, not the fare.

## Settled in the review (10 Sep)

1. **Exact library asset:** added as the optional `asset` field on beats, cards and statics. It
   overrides `picture`.
2. **`caption_ig`:** required for any caption containing a URL, enforced by a check.
3. **Story polls:** posted by hand, and listed on Glenn's morning report as "post by hand".
