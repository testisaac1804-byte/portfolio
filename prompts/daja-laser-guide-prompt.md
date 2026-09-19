# DAJA Laser Guide

Interactive laser-cutter guide + safety simulator for the DAJA A6 Pro 20W.
Location: ~/Desktop/DAJA-A6-Pro-20W-Guide/ (guide HTML + clips/ + shots/ + SHOOT-LIST.md)

## Stack
- Single self-contained HTML/CSS/JS, no deps, LIGHT theme (Isaac's reading-doc preference).
- Verified with Playwright + cached chromium_headless_shell (file:// URL).

## How it works
- 3 tabs: **Learn** (23 steps, 4 phases: A design + IsaacDrop transfer, B machine setup, C running, D cleanup), **Practice** simulator, **Cheat sheet** (A4 print).
- Media slots auto-load `clips/<slug>.mp4` + `shots/<slug>.png` sitting next to the file; dashed placeholder shown until the file is dropped in. SHOOT-LIST.md tells Isaac what to film for each slot.
- Simulator: clickable machine diagram (power, E-stop, lid, blower, purifier, exhaust pipe, honeycomb bed, focus, material, Frame, Start). Start refuses with ranked blockers: power → E-stop → lid → purifier → blower → pipe → honeycomb → focus → material → framed. Mid-cut lid open = interlock stop. Job end → cleanup checklist → done banner. Reset = cold machine.
- Mission list right panel = the one true order; the first unmet item is highlighted.
- Print button jumps to cheat sheet; @media print hides other tabs → A4 one-pager (23 checkboxes + ⛔ NEVER safety box).

## Key workflow facts (Isaac's real order — trust him over research)
- Setup order: power → E-stop → blower MAX → purifier MAX → exhaust pipe out window → material (magnets / 4 corner weights) → focus (lid OPEN) → honeycomb check (lid OPEN) → close lid → frame (works open or closed) → start.
- LightBurn DXF ritual: Select all → Arrange Ungroup → Arrange Break apart → Edit Delete Duplicate Lines → Arrange Auto Group (Auto Group is a real feature).
- Transfer: da.gd/isaacdrop → lasercut folder → upload with optional password; on the laser PC refresh if the file hasn't loaded yet. Import with Cmd+I, pick mm.
- Banned on the diode: PVC/ABS/vinyl/clear acrylic. Fire response: E-stop first, lid stays shut, purifier keeps running.

## Usage
- Open the HTML directly (file://). Media auto-appears when files with matching names land in clips/ + shots/.
- Cheat Sheet tab → 🖨 → laminate → tape next to the machine.
- Version lives in header + footer — bump both on changes (currently v1.4).

## Related
- ~/Desktop/DAJA-A6-Pro-20W-Material-Reference.html (linked as the settings reference).
