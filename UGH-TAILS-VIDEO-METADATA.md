---
name: ugh-tails-video-metadata
description: Set the YouTube title, description and tags on a UGH Tails episode after Glenn uploads it. Use when Glenn says a UGH Tails video is posted or loaded, or asks for an episode's metadata to be set or updated. Not scheduled — he says when.
---

# UGH Tails — set a video's YouTube metadata

**Glenn tells you a video is up. You run this.** Deliberately not a scheduled agent
(Glenn, 2026-10-11): a daily run that is forbidden to write copy is only a reminder, and he
is a better reminder.

## The lane, which is the whole reason this is written down

- **The Copywriter writes the metadata file.** Title, description, tags are copy.
- **This procedure applies it verbatim.** If no file exists for that episode, **write nothing**
  and say so. A video left unset is the correct outcome; an invented description is not.

★ **NEVER invent storyline detail.** Everything in the description comes from that episode's
build plan. If the plan is missing, stop and say the plan is missing.

## Step 1 — the credential, and why it used to keep dying

```bash
node C:/Users/gbrow/Downloads/content-kit/yt/ugh-meta.mjs --list
```

If that refuses for a missing token, Glenn runs this **once** and picks **UGH** at the account
chooser:

```bash
node C:/Users/gbrow/Downloads/Draft-Tool-Groups/own/yt-auth.mjs --out C:/Users/gbrow/.secrets/yt-token-ugh.json --channel UGH
```

★ **Use `--out`, never the env var.** Each terminal tab starts a fresh shell, so a variable
set in one tab does not reach node in the next — and the script's default path is
`yt-token.json`, the draft-tool token TUBE's live comment threads run on. It also prints a
loud "STOP, that is the UGH channel" afterwards: that guard is for the comment bot, it is
wrong here, and the token is correct. Do not revoke on the strength of it.

★ **Do not use `yt/meta.mjs` or `yt/_client.mjs`.** They read `content-kit/.env`, whose OAuth
client (`362662212350-l2cvbeijqv95lns…`) is still in **Testing** — a Testing app's refresh token
**expires every 7 days**. That is why this job kept coming back: the credential was dying on a
timer, not the task failing. `ugh-meta.mjs` uses the client in `.secrets`
(`362662212350-1n2uk12pk7gn43j…`), published 2026-10-03, which does not expire.

## Step 2 — read the build plan, never the video

Build plans live in OneDrive, extracted copies in `Downloads/content-kit/out/epNNNdoc/epNNN-build-plan.txt`.
Take only: **Episode Title · Episode Tagline · Primary Pathway · Core Premise**.

★ **Check the episode NUMBER against the plan, not against memory.** The memory slate was off by
one on 2026-10-10 and nearly produced a mis-titled upload. Published episodes are the other
check: the next number is one past the newest published episode.

## Step 3 — write `ugh/tails/yt-meta-epNNN.json`

Match the template exactly. Read a published episode's description off the channel first if in
any doubt — that is the source of truth for the shape, not this file.

```
UGH Tails EP 0NN — The Title
<the tagline, verbatim from the build plan>

<two sentences from the Core Premise, in the series voice>

UGH happens, and we still show up.

New UGH Tail every Sunday.
Watch the whole season in order: https://www.youtube.com/playlist?list=PLQ01JzyQDkBQ

#UGHTails #UGHUniverse #<Pathway> #animatedshorts #dogs
```

Pathway hashtag comes from the plan's Primary Pathway: GROW → `#GrowThroughIt`,
LAUGH → `#LaughThroughIt`, PUSH → `#PushThroughIt`, EXPRESS → `#ExpressYourself`.

Tags, same ten-slot shape every time:
```
ugh tails, ugh universe, animated series, animated shorts, cartoon dogs,
funny dogs, pip tank mabel, <the title>, <one topic word>, ugh happens
```
`categoryId` is `"23"`.

★ US spelling and idiom throughout. Read it aloud as an American.

## Step 4 — apply, then read it back

```bash
node yt/ugh-meta.mjs --id <videoId> --apply ugh/tails/yt-meta-epNNN.json        # dry run
node yt/ugh-meta.mjs --id <videoId> --apply ugh/tails/yt-meta-epNNN.json --go   # write
```

It prints BEFORE/AFTER, writes only with `--go`, and reads the snippet back afterwards. **Report
the read-back, not the HTTP 200.** A 200 says the request was accepted, not that the page shows it.

## Guards already in the script — do not route around them

- **Refuses any channel not named UGH.** The mirror of the draft-tool guard: that one keeps the
  bot off UGH, this one keeps this off everything else.
- **Merges onto the current snippet**, because `snippet.update` is a REPLACE — a partial payload
  would wipe fields off a live video.
- **Dry run unless `--go`.**

## Step 5 — the playlist, ONLY once the episode is public

```bash
node yt/ugh-playlist.mjs          # dry run
node yt/ugh-playlist.mjs --go
```

Adds the episode to the UGH Tails playlist in season order. **It skips anything still
private on purpose** — a private video in a public playlist shows viewers a grey "Private
video" row, so a queued episode would park one there for weeks. Run it after the video
flips public, not when it is uploaded. Idempotent; it writes nothing when nothing changed.

## Status

✅ **PROVEN 2026-10-11** (commit `308468a`). All three applied and read back off the channel:

```
XBOt5wt6w9A  UGH Tails EP 009 — The Leash
-m5fw-zjdoA  UGH Tails EP 010 — The Stick
jHwG7gRy1ow  UGH Tails EP 011 — The Hiccups
```

★ **The read-back lies for a few seconds.** `videos.list` is stale right after a write — the
first run reported the OLD title and 0 tags on all three while every write had in fact
landed. `ugh-meta.mjs` now polls for ~15s and prints `✓ confirmed on the channel`. If you see
that line, it is real. If you see `✗ STILL NOT REFLECTED`, check by hand before re-running.

★ **Keep this to the ask.** On the run that proved this, the metadata took five minutes and
then the session went and rebuilt the playlist unasked. Glenn: *"you are just fucking creating
issues out of thin air."* Set the metadata, report it, stop.
