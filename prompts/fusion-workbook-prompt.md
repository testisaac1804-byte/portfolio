# Master Fusion Workbook — build spec

Source: a Google Slides deck with download and copy disabled (owner restriction).
Target: a 55-slide, full-screen presenter with every image and every animation working.

## Method
1. Open /present in an offscreen Chrome on a debug port, signed in.
2. Launch with --disable-backgrounding-occluded-windows and friends, or every DOM read costs 5-11s.
3. Jump to each slide with present?slide=id.<pageId>; a bare pageId silently lands on slide 1.
4. Capture 3840x2160 PNGs, one per slide, then downscale to 960x540 PDF pages.
5. Fetch every image slot in one in-page Promise.all per slide, original bytes, saved per slot. Never dedupe slots.
6. Transcode each GIF to H.264 MP4; never trust the resize endpoint to keep animation.
7. Harvest shape links from SVG <a> elements (xlink:href), normalise against the 1419x798 stage, render as hotspots.

## Verify
- 0 broken images, 0 fetch errors, 55/55 slides.
- A video element currentTime must advance, not just report playing.
- A Drive player iframe must be present after clicking a video card.
- Hotspot count per slide must match the SVG anchor count.
