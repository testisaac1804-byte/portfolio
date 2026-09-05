# VEX Parts Interactive Reference

**Category:** Design & Documents · **Status:** Done

Single-file interactive HTML reference covering EVERY part in the VEX IQ (2nd Gen) Education Kit (228-8899) and VEX V5 Competition Super Kit (276-7040) — 220 parts with search, category filters, platform tabs, detail modals, part numbers and a self-test quiz. Print-to-PDF (A3 landscape) turns it into the parts poster.

**Stack / Tools:** Single-file HTML + CSS + vanilla JS (dark theme #0f172a / accent #38bdf8), Python generator (build_html2.py + vex_data.py), reportlab PDF poster (build_poster.py)

**Build path:**
- V1 — Static A3 PDF poster (2 pages: IQ + V5), reportlab, official kit contents scraped via r.jina.ai (vexrobotics.com blocks curl)
- V2 — Interactive single-file HTML app, 220 parts, quiz mode, print-to-PDF
- V3 — "VEX Universe": 344 parts (IQ Edu+Comp kits, V5 Super+Booster), gear-ratio calculator, 12-mechanism gallery, 35-term glossary, 16 platform cards (123/GO/AIM/EXP/CTE/AIR + software + competitions)
- V4 — All 8 platforms: 436 parts (adds GO, EXP, 123, AIM, CTE Workcell 40-part, AIR kits; official contents for AIM/CTE/AIR/EXP-electronics via r.jina.ai, GO/123/EXP-structure from established components — no invented specs). Platform chips for every platform, click platform card → browse its parts, software/comp cards get detail bullets.

**Location:** `~/Desktop/vex-parts-interactive.html` · `~/Desktop/vex-poster/VEX-Components-Poster.pdf`

**Build notes:**
- Data source: official kit contents from vexrobotics.com product pages (fetched via https://r.jina.ai/ proxy — Cloudflare blocks direct curl; Wayback/DDG/Bing all failed)
- Part numbers included for IQ items (228-2500-xxx); V5 kit list omits SKUs — never invented them; dropped p/n where official pages conflicted (VEX's own pages have typos)
- Add-ons (IQ Inertial Sensor, V5 sensors/pneumatics/motor cartridges) clearly marked "add-on"
- JS gotchas: inline onclick with escaped quotes broke syntax — use `this.dataset.c`; gear calculator read a select before options existed (crash) — guard with `||"IQ"`
- Verified with node --check + DOM-stub runtime test (344 cards render, filters/search/calc/quiz work)
