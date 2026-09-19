# Hong Kong Observatory — Parody Page (FICTIONAL)

**Type:** Single-file HTML parody website (comedy)
**Built:** September 2026
**File:** `demos/hko-funny.html`

## What it is

A deadpan comedy parody of the **Hong Kong Observatory** homepage. The page keeps the
real HKO visual identity — the genuine HKO logo, the HKO blue palette, official
typography and section structure — but every piece of content is absurd bureaucratic
humour delivered in the straight-faced tone of an official weather notice.

It is clearly labelled as fiction in two places: a sticky strip at the very top
("FICTIONAL DEMONSTRATION — NOT the real Hong Kong Observatory · 純屬搞笑虛構") and a
disclaimer in the footer. It is not affiliated with the HKO or any government body.

## How it was built

1. **Template source:** the live HKO homepage (`hko.gov.hk/en/index.html`) was rendered
   in a headless browser to capture its real DOM and its 8 stylesheets.
2. **Real asset:** the genuine HKO logo (`images/logo_hko_index_e.png`) is inlined as a
   base64 data URI so the page is fully self-contained (no external files, works offline).
3. **Rebuild, not salvage:** HKO's page is JavaScript-driven (animated weather map, radar
   loop, mega-menu, carousels). Rather than strip the JS and patch the wreckage — which
   produced an 18,000px broken layout — the page was **re-written as clean hand-authored
   HTML** that reuses the HKO look: blue gradient header, logo, nav bar, search box,
   section headings with blue underlines, white content cards, dark-blue footer.
4. **Warning badges** are hand-drawn inline SVG circles in the style of HKO warning
   symbols. **Forecast icons** are inline SVG glyphs.

## Content (the jokes)

| Section | Content |
|---|---|
| Slogan | "Measure the Sky, Apologise for the Rain" |
| Ticker | Scrolling warning marquee |
| Announcement | 6 deadpan notices |
| Special Bulletin | Typhoon Signal No. 11 — "the supernumerary signal, issued when the Observatory has run out of numbers" |
| Today's Warning | 8 badges (No. 11, Very Mild Weather Warning, Chance of Clouds Advisory, Amber Humidity Advisory, Frost Warning for your freezer…) |
| Warning Summary | Table with "in force since: Tuesday / Always / Once, briefly / 2019" |
| Current Weather | 27°C "feels like 27°C, but louder"; humidity "100% — you are now part of the air"; "Update at 11:40 (the time is also weather)" |
| General Situation | "An anticyclone aloft is bringing weather to Guangdong… the sky remains up." |
| Regional Temperature | Central 27°C, Your Kitchen 31°C, The Shade 24°C, Inside a Coat 34°C, "The Window — being looked out of" |
| 9-Day Outlook | "Sunny, then not." / "Cloudy with a chance of clouds." / "Unsettled. So are we." with rain probability relabelled Certain / Who Knows / Ask Again Later |
| UV & Health | "Consider a hat, or don't. The sun has been notified." |
| Marine | "Wave Height: A wave · Fish: Informed · Sea State: Wet" → "Small craft are advised to remain small." |
| FAQ | "Will it rain tomorrow? — The Observatory does not comment on the future." / "Can I speak to a meteorologist? — Our Chief Meteorologist is currently looking out of the window. This is a scheduled activity and cannot be interrupted." |
| What's New | "Is it Possible to be Rained On?" / "Study finds Tuesday still the most Tuesday-like day of the week" |
| Earthquake Report | "A magnitude 0.3 tremor was felt by one person, who was mistaken. Epicentre: The kitchen." |
| Careers | Window Looker (Senior) — "Requirements: ability to look." / Rain Namer / Future Correspondent |
| Public Consultation | Views on the sky: "It's up" (4,102) · "It's grey" (987) · "No comment" (1) |
| Thought for the Day | "There is no bad weather — only weather for which the Observatory has not yet apologised." |

## Technical notes

- Single self-contained file (~43 KB), no external requests, works offline.
- Responsive: two/three-column grids collapse to one column under 900px; the 9-day grid
  drops to 3 columns.
- Only inline SVG icons + one inlined base64 PNG logo. No JS required.
- Verified in headless Chromium: 15 sections, 9 forecast cards, 8 badges, 2 tables,
  8 FAQs, **0 broken images, no horizontal overflow, 0 failed requests**.

## Disclaimer

Fictional comedy project. The HKO template and logo are used as parody. For actual
weather information, see hko.gov.hk.
