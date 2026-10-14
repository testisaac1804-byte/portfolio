# Anatomy of a Fake "DNS Optimizer" — teardown of `DNS一键优化.exe`

**Category:** Software & Security · **Status:** Done · **Type:** Defensive reverse engineering

A 3.6 MB Windows program called `DNS一键优化.exe` ("one-click DNS optimization") is handed to
users by an online gambling portal as a fix for "the game won't open / black screen". It looks
like a friendly support utility. It is actually an unsigned, administrator-level tool that
rewrites the DNS servers on **every network adapter** in Windows, published by the operator of
the site you were trying to unblock. This is the full teardown: what it does, what it does *not*
do, and why the answer is still "don't run it".

**Stack / Tools:** Python (PE/resource parsing) · UPX (built from source) · Qt/MinGW binary analysis · macOS provenance (`xattr`) · HTML write-up

**Artifacts on the site:**

- `demos/exe-teardown.html` — the published write-up (self-contained, dark/light)
- `demos/dns-exe-icon.png` — the sample's own icon, extracted from its `.rsrc`
- this file — the build spec / method notes

---

## Verdict

**Not a password stealer — and still not safe.** No spyware, no backdoor, no payload. It is an
unsigned, unversioned, administrator-level utility whose entire function is to replace your DNS
servers, and it arrives from an unlicensed gambling operation as part of an access-bypass kit.
The risk is not a hidden virus; it is **who is handing you an admin-level network tool, and what
that tool is permitted to point your traffic at.**

## 1 — Provenance (no guessing required)

macOS records the source of every download in an extended attribute:

```
$ xattr -l DNS一键优化.exe
com.apple.metadata:kMDItemWhereFroms: https://www.218yc.com/static/file/DNS一键优化.exe
                                     https://www.218yc.com/
com.apple.quarantine: 0081;6aae4c6a;Chrome;67742DF8-97D5-48D8-9C09-BB275F6181D3
```

| Field | Value |
|---|---|
| Download URL | `https://www.218yc.com/static/file/DNS一键优化.exe` |
| Linking page | `https://www.218yc.com/` |
| Fetched by | Google Chrome |
| Timestamp | 2026-09-19 16:48 HKT (decoded from the quarantine stamp `6aae4c6a`) |

`218yc.com` is a search-engine-camouflaged portal for an unlicensed gambling operation — scraped
news snippets, bank and email links for legitimacy, and links into browser-based casino games. Its
help page offers a three-item "self-rescue" kit: **① 一键优化修改DNS (this file)**, **② 寰宇浏览器**
(a promoted "goes anywhere" browser), **③ a line-check tool**. All three exist to make a blocked
site load.

## 2 — File facts

| Property | Finding |
|---|---|
| Format | Windows PE32 GUI executable, Intel 80386 |
| Size | 3,767,808 bytes packed → 11,321,344 bytes unpacked |
| Packer | UPX 3.91 (sections `UPX0` / `UPX1`) |
| Toolchain | Statically-linked **Qt** GUI app, built with **MinGW-W64 GCC 4.8.3** |
| Digital signature | none |
| Version resource | **absent** — no publisher, product name or version |
| Requested privilege | **`requireAdministrator`** (UAC elevation on launch) |
| Network code | none — no HTTP client, downloader or socket code in the app layer |

The manifest is stored uncompressed even inside a packed PE, so it is readable *without*
unpacking:

```xml
<requestedExecutionLevel level="requireAdministrator" uiAccess="false" />
```

No signature + no version resource + admin demand = a throwaway build nobody can be held to.

## 3 — The whole program, in four lines

Application class names are `UDnsOptimizer` / `UDnsWindow`. Its working code wraps Windows' own
network CLI:

```
netsh interface ip   set dns "%1" static %2
netsh interface ip   add dns "%1" %2 index=2
netsh interface ipv4 set dnsserver "%1" static %2
netsh interface ip   set dns "%1" dhcp          // "reset to automatic"

HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\%1 → NameServer
```

The UI it presents is a single button, with these strings:

> **DNS 设置尚未优化** · **按下 "优化" 按键, 以优化 DNS 服务器的设置。** · **DNS 设定中…** · **DNS 设置已优化** · **DNS 优化失败**

The only DNS server addresses anywhere in the binary are **`8.8.8.8` and `8.8.4.4`** — Google
Public DNS. There is no latency test and no provider comparison, so "optimize" means exactly one
thing: *replace your ISP's resolvers with Google's*.

It also carries hidden command-line options — `--adapter-index`, `--preferred-dns-server`,
`--alternate-dns-server` — and programmatic entry points such as `setAllDnsAddressManually()`.
**Whoever launches it can aim your DNS at any resolver they choose**, elevated, on every adapter.

## 4 — Why a gambling site ships a DNS tool

DNS is usually what blocks it. Casino domains are commonly sinkholed at the DNS layer (notably on
mainland ISP resolvers), so the site simply won't resolve. The standard workaround is a foreign
resolver plus a proxy-capable browser — which is exactly the three-item kit on the help page.
The tool is not random; it is step one of a documented access-bypass workflow, dressed up as
consumer-friendly "one-click" support.

## 5 — What was *not* found (kept deliberately honest)

- No C2 or network behaviour: no `InternetOpen`, `URLDownloadToFile` or `WinHttpConnect`; no
  embedded URLs or IP endpoints beyond Qt library text.
- No persistence: no `Run` keys, scheduled tasks, services or startup-folder drops.
- No second stage: no dropped files, no appended overlay beyond the packed image.
- No hosts-file edit, no proxy reconfiguration, no UAC tampering (it only *reads* the UAC state
  and can open the UAC settings panel).
- The scary-looking strings (`\\.\lnk`, `NetShareEnum`, UNC paths) are Qt/Windows shell library
  strings present in every Qt app — a classic false positive.

"No payload" is a statement about **this build, today**. You are still granting administrator
rights to an unsigned, unversioned binary from an unlicensed gambling operator with no support
channel and no update path — and trojanising an update to a tool people already trust is the
ordinary way this pattern turns bad later.

## 6 — Why you shouldn't run it (five reasons)

1. **Unverifiable authorship, with admin rights.** No signature, no version info, no publisher;
   you cannot distinguish this build from a modified one.
2. **It rewrites every adapter, and rollback is on you.** Changes are applied per adapter and
   written to the registry. A partial failure or a VPN/school/work profile with its own resolver
   leaves you with broken name resolution and only a blunt "set it back to automatic".
3. **It silently redirects all DNS traffic to a third party.** A real privacy change, and it
   commonly breaks split-horizon internal DNS, captive portals, and ISP/parental/campus filtering.
4. **It can be aimed at *any* resolver by whoever runs it.** The `--preferred-dns-server` /
   `--alternate-dns-server` switches make it a generic DNS-setting engine that a launcher can
   drive to a malicious resolver without any prompt — and DNS decides where traffic goes.
5. **Provenance is disqualifying.** Distributed by an unlicensed gambling operation from a
   disguised pseudo-news domain, as part of a workflow whose purpose is evading network controls.

## 7 — The pattern to recognise next time

- Pushed by the site you were trying to reach, rather than by a vendor.
- An **unsigned** binary asking for **administrator** rights.
- **No version info at all** — nobody intends to be held to it.
- The "fix" is actually a **bypass**: "fixes the black screen", "works anywhere", "unblocks the game".
- A **browser bundled with the fix** — a network setting change plus a vendor-controlled browser
  are the two halves of a traffic-redirection kit.

## 8 — Method (static analysis only)

| # | Step | How |
|---|---|---|
| 1 | Provenance first | `xattr -l` → `kMDItemWhereFroms` + quarantine stamp (URL, link page, browser, exact time) |
| 2 | Identify + hash | `file`, `shasum -a 256` |
| 3 | Read resources while packed | parse PE section table → dump `.rsrc` (UPX leaves it uncompressed) → manifest, icons, absence of version info |
| 4 | Unpack | build UPX from source (no macOS prebuilts; Homebrew here is x86_64 vs an arm64-only toolchain) → `upx -d` → 11.3 MB image |
| 5 | Classify by string cluster | extract printable runs + maximal valid-UTF-8 CJK runs, then read the cluster around the giveaway; Qt meta-object strings reveal the app's function list |
| 6 | Behaviour hunt | grep imports/strings for network, persistence and drop primitives; **absence** is a finding |
| 7 | Cross-check the story | fetch the source domain and read the surrounding help page → the three-item bypass kit |

Notes worth keeping:

- A naive byte-pair "GBK" regex over a binary yields ~22k false positives; require successful
  UTF-8 decoding *and* a CJK run.
- `brew install upx | tail -5` masks the real exit code — the pipeline returns `tail`'s status.
- Don't pass `-DCMAKE_OSX_ARCHITECTURES=arm64` when building UPX here; it triggers the same
  x86_64 `libxcrun` failure. Pin `CMAKE_C_COMPILER`/`CMAKE_CXX_COMPILER` instead.

## 9 — Indicators

| Item | Value |
|---|---|
| Filename | `DNS一键优化.exe` |
| SHA-256 (packed) | `6c47bebfc1a0cc53be82268de3c7c6781d89254e54421091d7fa2c26e9514b01` |
| SHA-256 (unpacked) | `bbfd77a19f2b98ba57c02f64bcfb3a1efa061351ca998226a26cef53118e444f` |
| Distribution host | `www.218yc.com` (`/static/file/`) |
| Component names | `UDnsOptimizer`, `UDnsWindow` |
| Registry touch point | `HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\<adapter>` → `NameServer` |

## 10 — If it was already run on a Windows machine

```
:: see current DNS servers per adapter
netsh interface ip show dns

:: revert an adapter to the network's own resolvers
netsh interface ip set dns "Wi-Fi" dhcp
netsh interface ip set dns "Ethernet" dhcp
```

Then confirm the `NameServer` values under
`HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\` are empty/automatic.

The sample is deliberately **not** hosted on this site. To get a scanner's opinion, submit the
hashes above to a service such as VirusTotal instead of running the file.

## Scope note

Static analysis of one sample, identified by the hashes above. No dynamic execution was performed
(a Windows PE cannot run on the analysing macOS host). Findings describe this build; they are not
a general claim about every "DNS optimizer". Analysed 19 Sep 2026 · published 8 Oct 2026.
