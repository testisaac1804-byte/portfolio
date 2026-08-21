#!/usr/bin/env python3
"""
IsaacNet Probe — find out HOW the school's FortiGuard is blocking you.

Run this AT SCHOOL (on the school WiFi):

    python3 probe.py youtube.com

It runs four tests and prints a verdict telling you which FortiGuard
method is in play, so we know exactly what the bypass needs to defeat:

  1. System DNS   — is the domain *lookup* blocked?
  2. DoH          — can encrypted DNS get the real IP?
  3. Real SNI     — does the TLS handshake to the real site get killed?
  4. Benign SNI   — does the *same IP* work with a fake name? (SNI vs IP)

No dependencies beyond the Python stdlib.
"""

import base64
import json
import socket
import ssl
import struct
import sys
import urllib.parse
import urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) IsaacNetProbe/1.0"
DOH = [
    ("cloudflare-dns.com", "/dns-query", "1.1.1.1", "1.0.0.1"),
    ("dns.google", "/dns-query", "8.8.8.8", "8.8.4.4"),
]


def _opener():
    return urllib.request.build_opener(
        urllib.request.ProxyHandler({}),
        urllib.request.HTTPSHandler(context=ssl._create_unverified_context()),
    )


def doh_resolve(host):
    labels = host.rstrip(".").split(".")
    buf = b"\xaa\xbb\x01\x00\x00\x01\x00\x00\x00\x00\x00\x00"
    for lab in labels:
        buf += struct.pack("B", len(lab)) + lab.encode()
    buf += b"\x00\x00\x01\x00\x01"
    qb64 = base64.urlsafe_b64encode(buf).rstrip(b"=").decode()
    for dh, path, ip1, ip2 in DOH:
        for ip in (ip1, ip2):
            try:
                url = f"https://{ip}{path}?dns={qb64}"
                req = urllib.request.Request(
                    url,
                    headers={"Accept": "application/dns-message",
                             "User-Agent": UA, "Host": dh},
                )
                body = _opener().open(req, timeout=6).read()
                ancount = struct.unpack(">H", body[6:8])[0]
                pos = 12
                while pos < len(body):
                    if body[pos] == 0:
                        pos += 5
                        break
                    pos += 1 + body[pos]
                ips = []
                for _ in range(ancount):
                    if pos >= len(body):
                        break
                    if body[pos] & 0xC0:
                        pos += 2
                    else:
                        while pos < len(body) and body[pos]:
                            pos += 1 + body[pos]
                        pos += 1
                    if pos + 10 > len(body):
                        break
                    rtype, _, _, rdlen = struct.unpack(">HHIH", body[pos:pos + 10])
                    pos += 10
                    if rtype == 1 and rdlen == 4:
                        ips.append(".".join(str(b) for b in body[pos:pos + 4]))
                    pos += rdlen
                if ips:
                    return ips
            except Exception:
                continue
    return []


def tls_handshake(ip, sni, port=443, timeout=6):
    """Try a TLS handshake to ip with the given SNI. Returns (ok, info)."""
    try:
        s = socket.create_connection((ip, port), timeout=timeout)
        ctx = ssl._create_unverified_context()
        ss = ctx.wrap_socket(s, server_hostname=sni)
        cert = ss.getpeercert(binary_form=True)
        # crude issuer extraction
        issuer = "unknown"
        try:
            d = ssl._ssl._test_decode_cert(cert)
            for tup in d.get("issuer", []):
                if tup[0][0] == "organizationName":
                    issuer = tup[0][1]
        except Exception:
            pass
        ss.close()
        return True, issuer
    except ssl.SSLError as e:
        return False, f"TLS error: {e}"
    except (socket.timeout, ConnectionRefusedError, ConnectionResetError, OSError) as e:
        return False, f"{type(e).__name__}: {e}"


def main():
    host = sys.argv[1] if len(sys.argv) > 1 else "youtube.com"
    host = host.replace("https://", "").replace("http://", "").split("/")[0]
    print("=" * 60)
    print(f"  IsaacNet Probe — target: {host}")
    print("=" * 60)

    # 1. System DNS
    print("\n[1] System DNS lookup...")
    sys_ip = None
    try:
        sys_ip = socket.gethostbyname(host)
        print(f"    -> resolved to {sys_ip}  (system DNS NOT blocked)")
    except socket.gaierror as e:
        print(f"    -> FAILED ({e})  (system DNS blocked or poisoned)")

    # 2. DoH
    print("\n[2] DoH (encrypted DNS) lookup...")
    ips = doh_resolve(host)
    if ips:
        print(f"    -> {ips[0]}  (DoH works — DNS bypass OK)")
    else:
        print("    -> FAILED  (DoH also blocked — unusual)")

    if not ips:
        print("\n⚠️  Can't get an IP at all. FortiGuard is doing full DNS lockdown.")
        print("    A tunnel to an external server is the only option.")
        return

    ip = ips[0]

    # 3. TLS with real SNI
    print(f"\n[3] TLS handshake to {ip} with real SNI '{host}'...")
    ok, info = tls_handshake(ip, host)
    if ok:
        print(f"    -> OK, cert issuer: {info}")
        print("    -> Site NOT blocked at TLS layer (only DNS was the problem).")
        print("       Your DoH browser should already reach it.")
    else:
        print(f"    -> BLOCKED ({info})")

    # 4. TLS with benign SNI (same IP)
    print(f"\n[4] TLS handshake to {ip} with benign SNI 'cloudflare.com'...")
    ok2, info2 = tls_handshake(ip, "cloudflare.com")
    if ok2:
        print(f"    -> OK (got cert for issuer: {info2})")
    else:
        print(f"    -> BLOCKED ({info2})")

    # Verdict
    print("\n" + "=" * 60)
    if not ok and not ok2:
        print("  VERDICT: IP-BASED or full MITM blocking")
        print("  The whole IP is blocked, not just the name.")
        print("  → DoH/CONNECT alone CANNOT beat this. You need a tunnel")
        print("    to a server outside the school.")
    elif not ok and ok2:
        print("  VERDICT: SNI-BASED blocking (certificate inspection)")
        print("  FortiGuard kills the TLS handshake when it sees the real name.")
        print("  → DoH/CONNECT alone CANNOT beat this. You need a tunnel")
        print("    (or ECH where the site supports it).")
    else:
        print("  VERDICT: DNS-only blocking")
        print("  → Your DoH + CONNECT browser already defeats this. ")
        print("    Just make sure the browser is actually routing through the proxy.")
    print("=" * 60)


if __name__ == "__main__":
    main()
