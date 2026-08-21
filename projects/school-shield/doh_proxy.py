"""
DNS-over-HTTPS proxy — intercepts all DNS queries and forwards them
to Cloudflare over HTTPS. School can't see what domains you look up.
"""

from __future__ import annotations

import asyncio
import base64
import logging
import socket
import struct
import sys
from typing import Optional

import dns.message
import httpx

logger = logging.getLogger("school-shield.doh")

# Cloudflare and Quad9 DoH endpoints
DOH_SERVERS = [
    "https://cloudflare-dns.com/dns-query",
    "https://dns.quad9.net/dns-query",
]
FALLBACK_DOH = DOH_SERVERS[1]

DOQ_SERVER = ("1.1.1.1", 853)  # DNS-over-QUIC fallback
LOCAL_PORT = 53
LOCAL_HOST = "127.0.0.1"


class DoHProxy:
    """Local DNS proxy that forwards queries over HTTPS."""

    def __init__(self, host: str = LOCAL_HOST, port: int = LOCAL_PORT):
        self.host = host
        self.port = port
        self.running = False
        self._transport: Optional[asyncio.DatagramTransport] = None

    async def start(self):
        """Start the DNS-over-HTTPS proxy."""
        loop = asyncio.get_event_loop()
        self.running = True

        try:
            self._transport, _ = await loop.create_datagram_endpoint(
                lambda: _DNSProtocol(self._handle_query),
                local_addr=(self.host, self.port),
            )
            logger.info("🔒 DoH proxy listening on %s:%d", self.host, self.port)
            logger.info("   Forwarding to: %s", DOH_SERVERS[0])
        except PermissionError:
            logger.error(
                "❌ Permission denied binding port %d. Run with sudo.", self.port
            )
            sys.exit(1)

    def stop(self):
        """Stop the proxy."""
        self.running = False
        if self._transport:
            self._transport.close()
            self._transport = None

    async def _handle_query(self, data: bytes, addr: tuple) -> bytes | None:
        """Handle a DNS query — forward to DoH."""
        try:
            # Parse DNS wire format
            query = dns.message.from_wire(data)

            # Encode for DoH (DNS wire format as base64url in GET param)
            dns_b64 = base64.urlsafe_b64encode(data).decode().rstrip("=")

            async with httpx.AsyncClient(timeout=5.0) as client:
                for doh_url in DOH_SERVERS:
                    try:
                        # Use GET with dns parameter (RFC 8484)
                        resp = await client.get(
                            doh_url,
                            params={"dns": dns_b64},
                            headers={"Accept": "application/dns-message"},
                        )
                        if resp.status_code == 200:
                            return resp.content
                        logger.warning(
                            "DoH %s returned %d", doh_url, resp.status_code
                        )
                    except httpx.HTTPError as e:
                        logger.warning("DoH %s failed: %s", doh_url, e)
                        continue

                logger.error("All DoH servers failed for query from %s", addr)
                return None

        except Exception as e:
            logger.error("Query handling error: %s", e)
            return None


class _DNSProtocol(asyncio.DatagramProtocol):
    """Async UDP protocol handler for DNS."""

    def __init__(self, handler):
        self.handler = handler
        self.transport: Optional[asyncio.DatagramTransport] = None

    def connection_made(self, transport):
        self.transport = transport

    def datagram_received(self, data, addr):
        asyncio.create_task(self._respond(data, addr))

    async def _respond(self, data, addr):
        response = await self.handler(data, addr)
        if response and self.transport:
            self.transport.sendto(response, addr)

    def error_received(self, exc):
        logger.error("DNS protocol error: %s", exc)

    def connection_lost(self, exc):
        pass


def run_doh_proxy(host: str = LOCAL_HOST, port: int = LOCAL_PORT):
    """Run the DoH proxy (blocking)."""
    proxy = DoHProxy(host, port)
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(proxy.start())
        loop.run_forever()
    except KeyboardInterrupt:
        proxy.stop()
    finally:
        loop.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_doh_proxy()
