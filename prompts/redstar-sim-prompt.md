# Build spec — 붉은별 3.0 (Red Star OS desktop simulator)

> This is the **operating-system** project. The intranet it browses is a 49-entry sample of the
> Kwangmyong address book; the full 136-entry network is a separate project, Kwangmyong Network 3.0
> (`prompts/kwangmyong-sim-prompt.md`). Do not fold them together.

**Goal.** One offline HTML file that behaves like a 2013 North Korean desktop (Red Star OS 3.0, KCC) browsing
the Kwangmyong intranet, where the site list is a **real published address table** rather than invented
filler, and where the restricted-network behaviour (blocked pages, read-only guests, watermarking, watch
logging) is functional rather than decorative.

## Hard requirements

- Single file, **zero network requests**: no CDN, no webfonts, no raster assets. Icons are inline SVG,
  wallpapers are CSS gradients. Must open from `file://` and from a USB stick.
- **49 catalogue entries** = 45 hosts with addresses (33 rows from the “As of May 2016” table, 12 from the
  2015 Rason chart) + 4 services only reported in press. Six categories: core / dept / lib / remote / infra / svc.
  No invented hosts, no invented addresses.
- Address resolution accepts **IP · `.kp` host · Korean name · English name** and lands on the same site.
  Four failure paths must exist as first-class pages: blocked host (접속금지), unroutable address (no route),
  unknown `.kp` (name not found + suggestions), and 404 inside a site.
- **22 apps**, each a real maker in a registry: Naenara browser, catalogue, mail, shop, files, office, media,
  dictionary, janggi, monitor, Bokem, SamTaeSong, calculator, preferences, terminal, watch log, network monitor,
  vaccine, terminal registration, remote lectures, about, trash.
- **Copy protection is behaviour, not copy**: copying a document to external media rewrites the copy's body with
  `© KCC · <drive serial> · <terminal IP> · <timestamp>`; disabling the mark is refused and logged.
- A **read-only account** (방문자 / Visitor) whose refusals (checkout, send, save, media copy) are each asserted.
- `localStorage` persistence for basket, balance, files, read mail, log, prefs — one key, versioned.
- Korean is the default interface; `?lang=en` re-renders every string, including user names and window titles.
- Self-test of **≥40 assertions** reachable in-page and via `?selftest=1`; layout probe via `?probe=1`.

## Data shape

```js
RS.SITES = [ { ko:'남산', en:'Namsan', ip:'10.30.80.101', host:'www.gpsh.edu.kp',
               cat:'lib', page:'namsan', note:'…' }, … ];   // 45 of these carry an ip
RS.APPS  = [ { id:'browser', ic:'globe', ko:'내나라', en:'Naenara', w:900, h:620,
               dock:true, start:true, single:true, make:RS.MK.browser }, … ];
RS.PAGES = { namsan: (site) => `…`, … };                    // 24 builders
```

One entry per host; a page builder per *type* of site, so 45 hosts do not need 45 bespoke pages. Anything a
source does not say gets an honest placeholder page with the address and the table's own label.

## Editorial rules

1. **Sources in the product, not just in the README.** The 정보 (About) panel lists the address table, the
   Rason chart, Wikipedia, messaroundery's internals notes and Trend Micro's proxy finding.
2. **Invented content is labelled.** Every page body, article, product, price, mail and log line is written for
   the simulation; the About panel says so plainly.
3. **Bokem is theatre.** Character scrambling, not cryptography — stated on the box.
4. **Dead ends teach.** A simulated intranet that reaches everything is a lie about the network it models.
5. **Counts come from data.** Every number printed in the UI is computed from its array at render time.

## Verification (all of it ran)

```bash
cd ~/Desktop/redstar-sim && ./build.sh        # node --check on the assembled single <script>
python3.14 dev/verify.py                      # Playwright, 3 widths + flows
```

```
1440x900   selftest 45/45  probe_ok=True  console=0  pageerrors=0
 768x1024  selftest 45/45  probe_ok=True  console=0  pageerrors=0
 390x844   selftest 45/45  probe_ok=True  console=0  pageerrors=0
```

The probe opens **every app** at each width and fails on: window outside viewport, window under the dock,
horizontal scroll inside an app body, empty app body, missing menubar/dock/start menu/modal. Flows: boot,
empty-password refusal, login, home page, blocked host, IP resolve, nxdomain, basket maths, checkout deduction,
mail rows, terminal, watermark modal, guest read-only, English build.

## File map

    html/head.html  html/body.html
    parts/css1..css5.css                       tokens/boot/login · desktop/shell · pages · responsive · app interiors
    parts/js1_core.js                          namespace, T(ko,en), state, storage, icons, toast, modal, log
    parts/js2_wm.js                            boot, login, desktop, menubar, dock, start menu, window manager
    parts/js3_data.js                          the 49 entries + goods, mail, dictionary, quiz, files
    parts/js4a_pages.js                        page frame + 내나라/광명/남산/과학기술전당/로동신문/만방
    parts/js4b_shop_mail.js                    만물상 + 전자결제, 실리 우편, 사전
    parts/js4c_inst.js                         북극성, 락원, 기관 사무, 감시/망/백신/등록
    parts/js4d_misc.js                         원격교육 + 시험, provincial pages, 일반 page, 류경장기
    parts/js4e_extra.js                        보켐 (encryption), 삼태성 (IDE)
    parts/js5_apps.js                          browser engine, catalogue, files+watermark, office, media,
                                               monitor, preferences, calculator, trash
    parts/js6_about.js                         terminal, about/sources, app registry, boot entry,
                                               self-test, layout probe
    build.sh  dev/verify.py  dev/shots.py

Rebuild: `./build.sh && python3.14 dev/verify.py`.
