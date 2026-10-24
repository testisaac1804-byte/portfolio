# Build spec — IGCSE 2028 · 79-week scheme of work

**Artifact:** `demos/study-plan-2028.html` (single file, 411,902 bytes, sha256 `426b7331…ba5225`)
**Mirror:** `demos/study-plan-2028-mirror/index.html` (byte-identical copy)
**Analysis:** `demos/study-plan-2028-analysis.html`
**Generator:** `~/.hermes/scripts/igcse80/` (`units.py`, `build.py`, `plan_template.html`, `prepare_inventories.py`, `test_plan80.sh`)

## What it is

One offline HTML file that schedules nine IGCSE subjects from **26 Oct 2026 to 30 Apr 2028** (79 weeks,
1,422 blocks) covering **185 official syllabus units**, each tagged with the reference it came from.

## Hard requirements (do not regress these)

1. **Every unit scheduled.** The build prints `unscheduled units: none`; a unit without a block is a bug,
   not a rounding error.
2. **Reference on every block.** No block may say only "Chemistry" — it carries `4SD0 Chem 1.1–1.4` or
   `0500 P1 Q2(a)`.
3. **Syllabus version that names 2028.** Cambridge codes run in three-year windows (0500 2027–2029,
   0509 2028–2029, 0445 2028–2030, 0457 2028); Pearson keeps one standing Issue (4MA1 Issue 2,
   4SD0 Issue 4, 4EC1 Issue 3 Feb 2026). Record which one was read.
4. **Offline.** No fetch, no fonts, no CDN. Opens from the Desktop with the network down.
5. **Progress in localStorage** (`igcse-plan-2028-v1` + `igcse-log-2028-v1`) with a try/catch fallback so a
   blocked store degrades to session-only instead of breaking the page.

## Structure

- 18 slots/week: Mon–Fri 2 blocks, Sat 4, Sun 4.
- Subjects: Chem 2 · Maths 3 · Phys 2 · Bio 2 · Econ 2 · DT 1 · FLE 2 · CN 2 · GP 1 · Review 1.
- Phase 1 (W1–30) new unit + two-week-spaced re-touch; Phase 2 (W31–66) same unit as topical past-paper
  questions marked against the scheme; Phase 3 (W67–79) two subjects a week sit a full timed paper while the
  rest rework weak topics, then a two-week taper (error log + formula sheets only).
- Subject queues are reset at each phase boundary — forgetting that makes phase 2 silently continue into the
  "extra practice" units instead of starting at unit 1.

## Regenerating

```bash
cd ~/.hermes/scripts/igcse80
python3 prepare_inventories.py     # re-parse /tmp/*.txt syllabus dumps if the PDFs changed
python3 build.py                   # writes ~/Desktop/study-plan-2028-full.html
bash test_plan80.sh                # headless: coverage, DOM counts, checkbox persistence, every tab
```

Edit `units.py` (the 185-unit inventory) or `build.py` (PHASE_A_END / PHASE_B_END / SLOTS / task templates),
never the generated HTML.

## Checks the test performs

- `PLAN.weeks.length === 79`, `blocks.length === 1422`, 18 blocks in week 1
- 185 unit tiles, 185 marked "已排", `unscheduled === 0`
- ticking a box writes `{"w1-0":true}` and updates "1 / 18 完成" plus the global counter
- all five tabs render (coverage / audit / log), audit tables ≥ 9, mistake log saves
- jumping to a far week re-renders its blocks and phase label

## Known limits (stated on the analysis page)

- Starts at each subject's 1.1; the school's actual position is not known.
- D&T planned as Paper 3 Materials; Graphic Products changes the option units.
- 18 blocks ≈ 12 h/week; holidays are labelled but not lightened, no automatic catch-up week.
- localStorage is per browser, not synced.
