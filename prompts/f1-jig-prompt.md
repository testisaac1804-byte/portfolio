# F1 Model Block Jig — four fixtures, one datum

**Category:** Parametric CAD (build123d) · **Status:** Done, unprinted

Four fixtures that hold the official 223 × 65 × 50 mm F1 in Schools model block while it is machined:
a printed pair of beds, a machined aluminium version, a zero-hardware version with no screws at all, and
a rotary carrier that flips the block through 180° without unloading it. One self-contained
`guide.html` — 21 sections, every table generated from the CAD report files.

**Stack / Tools:** F1 in Schools (Development Class, 2024-25), build123d 0.13, numpy-stl, Playwright,
FDM printing, 3-axis CNC.

**Build path:**
- V1 — SLOTRAIL-223. Two printed beds + rail + collar. 5 parts, 298 g. The block hangs on a 6 mm rail
  in its own tether groove; flip = lift off, roll, put back.
- V2 — SLOTRAIL-223-M. Same datum, machined: base plate, two saddles, two clamp caps, collar. 2.0 kg of
  6061, ≤2 setups, 0 sloped faces, bought 6 × 6 mm ground bar.
- V3 — SLOTRAIL-223-ZH. Zero hardware: integral sliding dovetail joins the halves, a sliding wedge on a
  10° self-locking incline replaces every screw. 5 parts, 439 g.
- V4 — SLOTRAIL-223-X. The rail becomes an axle. Lever-throw 180° flip with a 5 mm detent pin in a
  5.05 mm hole, jaw travels 20 mm so 203–223 mm blocks fit, 10 parts / 448 g.
- V5 — the guide. Seven cross-variant sections (choose / BOM / every part / assembly / the numbers /
  evidence / files) generated from the four report files, plus per-fixture build sequences with the
  measurement that catches each step going wrong.

**Why the groove.** Every commercial jig clamps the outer faces, which are the two surfaces the rules do
not control — a 65.4 mm block is legal and sits crooked in a 65.0 mm vice. The 6 × 6 mm tether groove is
moulded, full length, and 6.00 mm on every block, so it is the datum. Seat 74.000, rail top 80.000,
mirror plane 77.000, X stop 223.000 — identical in all four reports, so one CAM formula covers every
fixture.

**The numbers that matter.** Block solid 703,489.6 mm³, 9/9 official dimensions exact. Fixture ∩ block
0.000 mm³ in both operations. Rotary sweep of 37 poses 0°→180°: worst case 0.000 mm³ at 0°. Detent slop
0.169° = 0.191 mm across the face, against a 1.0 mm rule. Printed rail sags 0.61 mm over 291 mm versus
0.01 mm for bought ground bar — which is why the BOM says buy the bar.

**Not proven.** None of the four has been printed or cut. The 5.9 mm rail in a 6.0 mm groove leaves
0.1 mm to a ±0.2 mm printer. The rotary version indexes at 0° and 180° only — at 90° the block droops
0.96°, which is 0.83 mm across the face. Every one of these is written into the guide, with the test
that would settle it.
