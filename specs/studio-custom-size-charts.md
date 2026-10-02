# Custom Size Charts — UGH Media Studio

**Asked for by Glenn, 2026-10-02.** A section under **Character Compositions** that builds a size
chart for an arbitrary PROJECT rather than for a Family.

> "Under the 'Character Compositions' menu I'd like a section to build custom size charts. These
> instead of being tied to a Family name, user will be asked to enter a project name. They can then
> select from any of the canons in the Studio or they can add additional Master image transparent
> images to be included (will need name, height to top of head, height to top of silhouette,
> transparent master image). Once user has selected/submitted all characters to be included, they
> will submit. Size chart should be created and displayed. User should have option to approve and
> download or reroll with prompt describing issue. Once approved and downloaded the size chart
> should be saved as project name/date in a User library somewhere. Note: Any character added for
> the specific project will not be saved to Media Studio canon library."

---

## The hard requirement that shapes everything

★ **A PROJECT CHARACTER MUST NEVER REACH THE CANON LIBRARY.** Glenn said it explicitly and it is
the one thing that cannot be got wrong, because the canon library is the product PixFix sells. So
the isolation is STRUCTURAL, not a convention:

- ad-hoc members live in their own table (`ugh_size_chart_members`), never `ugh_characters`
- their images live in their own bucket (`size-chart-projects`), never `character-master-references`
  or `canon-asset-uploads`
- nothing in the project path writes to `ugh_characters`, `ugh_canon_items` or `ugh_canon_assets`

A canon member is stored as a REFERENCE (`character_id`) and read fresh at render time. A project
can therefore use canon without copying it, and ad-hoc art cannot leak the other way.

---

## Decisions made without asking (veto any of these)

**1. "Height to top of head" and "height to top of silhouette" are the two heights the Studio
already models.** They map exactly onto the existing pair:

| Glenn's words | existing column | what it does |
|---|---|---|
| height to top of **head** | `canonical_height_inches` | the TRUE height — the number printed on the label, and the gridline the crown sits on |
| height to top of **silhouette** | `size_chart_render_height_in` | the top of the drawn pixels — hair, ears, hat — what the image is SCALED to |

This is why both numbers are needed: scaling art to the canonical height puts the *hair* on the
gridline instead of the crown. Mitch is 71" canonical and renders at 74". Same model, same two
fields, for an ad-hoc member.

**2. Reroll re-renders the layout. It does NOT regenerate the image with AI.** A size chart's whole
job is to be dimensionally true — three dogs at exactly 23", 22" and 18" on one axis. No image model
can place figures to the inch, so an AI-generated chart would be a picture that lies about the one
thing it exists to state. So: the prompt ("names overlap", "Tank should be first", "too much empty
space up top") is read by `google/gemini-2.5-flash` — already wired in this repo — and returned as a
**patch to the layout JSON**, which is then re-composed by the existing deterministic compositor. The
UI shows which parameters changed, so a reroll that understood nothing says so instead of silently
returning an identical PNG.

Layout knobs the patch may set: member order, axis max / headroom, gap, min cell width, label
placement, background, and a per-member render-height nudge.

**3. The "User library somewhere" is a new Size Chart Library page**, backed by the two new tables,
listed under Library in the sidebar. Entries are named `<project name> / <date>` exactly as asked.

---

## Schema (new)

```
ugh_size_chart_projects
  id uuid pk
  project_name text not null
  status text not null default 'draft'      -- draft | rendered | approved
  layout jsonb not null default '{}'        -- compositor parameters; a reroll patches this
  chart_path text                           -- storage path of the latest render
  chart_width int, chart_height int
  render_count int not null default 0
  approved_at timestamptz
  downloaded_at timestamptz
  created_by uuid, created_at, updated_at

ugh_size_chart_members
  id uuid pk
  project_id uuid not null references ugh_size_chart_projects on delete cascade
  source text not null                      -- 'canon' | 'adhoc'
  character_id uuid                         -- set ONLY when source='canon'; a reference, never a copy
  name text not null
  height_inches numeric not null            -- top of head
  render_height_inches numeric              -- top of silhouette; falls back to height_inches
  image_path text                           -- set ONLY when source='adhoc'
  figure_bbox jsonb, intrinsic_width int, intrinsic_height int, figure_px_height int
  sort_order int not null default 0
  created_at
```

Bucket `size-chart-projects` (private): `members/<project_id>/<member_id>.png`,
`renders/<project_id>/<timestamp>.png`.

---

## Server work

The compositor is currently welded to families: `composeFamilySizeChart(familyId, title)` calls
`getFamilySizeChart(familyId)` itself. Split it:

- `composeSizeChart(rows, title, layout)` — pure, takes rows. The existing drawing code moves here.
- `composeFamilySizeChart(familyId, title)` — thin wrapper. **Behavior must not change** — the
  family chart was fixed on 2026-09-29 (`37402f54`, `66158391`) and that fix has to survive.
- `composeProjectSizeChart(projectId)` — new wrapper; resolves canon members through the same
  `signCanonPath` / `readFigureBounds` path, and ad-hoc members from the project bucket.

Ad-hoc uploads get their alpha bbox computed server-side on upload with the existing
`computePngAlphaBounds`, exactly as locked canon frames do — a client canvas would be tainted by the
signed URL.

## UI

- `/character-studio/size-charts` — the library (list, open, download)
- `/character-studio/size-charts/$projectId` — the builder: name, member picker (canon multi-select
  + ad-hoc add form), Render, then Approve & Download / Reroll with a prompt box
- sidebar: under Characters beside Character Compositions, and the library under Library

## What proves it

1. A project mixing canon and ad-hoc members renders with every figure on one true axis.
2. A reroll with a real complaint changes named layout parameters and the PNG bytes.
3. **The family chart is byte-identical before and after the refactor** — re-pull Craggers and
   Pathway Pack and compare.
4. After approve + download, the row is in the library as `<name> / <date>` and the PNG downloads.
5. `ugh_characters` row count is unchanged across the whole flow — the isolation requirement,
   tested rather than asserted.
