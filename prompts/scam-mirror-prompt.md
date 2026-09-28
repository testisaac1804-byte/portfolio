# Scam Mirror

**Category:** Software & Apps · **Status:** Done

Automated phishing cloner - registrar takedown reports.

**Stack / Tools:** Security, Scraping, Python

**Build path:**
- V1 — Manual per-site.
- V2 — Automated: one command.

**Location:** `~/demos/scam-mirror.html`

Full spec already in this prompt file (single-file HTML evidence mirror in Python).

## Where it lives
- Source folder: `~/Documents/projects/scam-tools/scam-mirror`
- Artefacts on the site: 6 files · 389 lines of text · 23 KB

## Stack
- Python ×2 · .lock ×1 · TOML ×1 · pyproject

## What's in the code
- `mirror.py` — 374 lines (Python)
- `pyproject.toml` — 9 lines (TOML)
- `main.py` — 6 lines (Python)

## Verified in the Python source
- classes: `Mirrorer`
- functions: `_clean_filename`, `_is_absolute`, `_is_data_uri`, `_make_absolute`, `_mime_to_ext`, `main`, `mimetypes_mime`

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
