# School Shield

**Category:** Software & Apps · **Status:** Done

Network shield — toggles school-filter DNS blocking.

**Stack / Tools:** Networking, DNS, Bypass

**Location:** `~/school-shield`

## Where it lives
- Source folder: `~/Documents/projects/network-tools/school-shield`
- Artefacts on the site: 11 files · 776 lines of text · 67 KB

## Stack
- Python ×6 · .lock ×1 · TOML ×1 · Markdown ×1 · pyproject

## What's in the code
- `shield.py` — 208 lines (Python)
- `dashboard.py` — 144 lines (Python)
- `doh_proxy.py` — 143 lines (Python)
- `detector.py` — 132 lines (Python)
- `firewall.py` — 130 lines (Python)
- `pyproject.toml` — 13 lines (TOML)
- `main.py` — 6 lines (Python)
- `README.md` — 0 lines (Markdown)

## Verified in the Python source
- routes: `get /`, `get /status`
- classes: `DoHProxy`, `_DNSProtocol`
- functions: `_disable_all`, `_is_doh_running`, `_require_root`, `_run_pfctl`, `_start_doh_background`, `_stop_doh_background`, `_write_rules`, `create_app`, `dashboard`, `disable_killswitch`, `enable_killswitch`, `get_current_dns`, `get_current_wifi`, `get_network_info`, `is_school_network`, `main`

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
