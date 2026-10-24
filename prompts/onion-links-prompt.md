# Build spec — Legit .onion link board (verified)

**Slug:** `onion-links` · **Status:** done · **Date:** 20 Oct 2026

## Goal

Give Isaac a page of **legal** `.onion` addresses he can open in Tor Browser — news, search, email,
whistleblower drop boxes — with every address actually tested rather than copied from a directory.

Constraint from the user, verbatim: *“maybe not those dark web ones … maybe like find links but doesnt
have to be illegal”*. So: no markets, no "hidden wiki", no link that needs a judgement call. If it is not
run openly by a named organisation, it is not on the board.

## Deliverables

| File | What it is |
|---|---|
| `demos/onion-links-mirror/index.html` | the artifact — single-file dark-theme link board, Open/Copy per row |
| `demos/onion-links-analysis.html` | long-form verification teardown (this card's "Read the analysis") |
| `prompts/onion-links-prompt.md` | this spec |

## Verification method (the part that matters)

1. Start the tor daemon headless: `tor --SocksPort 9050 --DataDirectory /tmp/tordata`
   (Tor Browser lives at `/Applications/Installed Applications/Tor Browser.app`; do not assume a GUI
   implies a working address).
2. Fetch each address with `curl --socks5-hostname 127.0.0.1:9050 -L --max-time 45-100`.
   `--socks5-hostname` is required: the `.onion` name must be resolved **by Tor**, not by local DNS.
3. Record three signals per address: HTTP status, download size, page `<title>`. A bare 200 proves
   nothing — captive portals and clones return 200 too.
4. Retry failed rows up to 3 times with a rising ceiling before calling anything dead. Onion circuits
   drop mid-handshake on throttled networks; four addresses moved between runs.
5. Cross-check the failures against dark.fail's published up/down labels before declaring them offline.
6. Clearnet control fetches over the same Tor circuits (freedom.press, securedrop.org, signal.org,
   archive.org, wikipedia.org) to prove the network had capacity, so a failing `.onion` is the address,
   not the pipe.

## Address sourcing rules

- **Operators' own sites first** — Onion-Location header (the purple ".onion available" chip in Tor
  Browser) is the only poisoning-proof source.
- **`securedrop.org/api/v1/directory/`** for newsroom drop boxes — JSON, official, 24 instances.
- **`onion.torproject.org`** for Tor Project's own services.
- **dark.fail** for status confirmation only, never as the source of a `.onion` you will use.
- Never a "2026 updated onion list" from a search result. Those are where phishing clones come from.

## Results this pass

24 onion addresses tried → **13 confirmed serving content**, 1 responded with unverified content,
10 no response. 5 clearnet controls all returned real pages.

Notable: my first BBC address (`bbcixlktsuk…onion`) was dead — the live one is
`bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd` (710,312 B, "BBC - Home"), the address
dark.fail lists. Reconstructed addresses are the single biggest source of dead links; five of this
pass's failures were my own bad guesses or the retired 16-char v2 network.

## Pitfalls

- **v2 addresses (16 chars) are all dead.** The v2 network was retired in 2021. Any list containing
  a 16-character address is stale by definition.
- **`.onion` needs no exit node.** `tor` logs *"The current consensus has no exit nodes. Tor can only
  build internal paths, such as paths to onion services."* — that warning is irrelevant to onion fetches
  (the third hop is the service, via a rendezvous point) but does break clearnet fetches.
- **Parallel curls contend for circuits.** 6 at a time is fine; 8+ on a throttled link produces false
  timeouts that look like dead sites.
- **`xargs -I{}` mangles the `label|url` pipe-delimited payload.** Use a `while read` loop with
  `wait` every N jobs instead.
- **Do not ship a page that only Chrome can open.** `.onion` cannot resolve outside Tor; the board says
  so and is meant to be dragged into Tor Browser.
- **Deploy injection is not a mirror mismatch.** Served copies gain the site skin engine + Cloudflare
  beacon (a few hundred bytes); the repo file and its mirror stay byte-identical, hash recorded on the
  analysis page.

## Acceptance

- [x] 24 addresses tested, per-address evidence recorded (status, bytes, title)
- [x] 13 live rows on the board; every shipped address is a verified row
- [x] mirror byte-identical (sha256 `6b2109896039b068f9604fe9cf7d4534c9b2cc7ea7b3df65144f69829511f064`)
- [x] failures reported as failures, including the BBC address I had wrong
- [x] no market / illegal-adjacent links included
