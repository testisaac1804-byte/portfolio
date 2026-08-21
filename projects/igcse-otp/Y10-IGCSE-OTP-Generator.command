#!/usr/bin/env python3
"""OTP Generator for Y10-IGCSE-Guide — generates one-time passwords for sharing.
Run this when someone needs access to your guide. Gives you the current password."""

import hashlib, time

SECRET = "McGill-DT-2026-IGCSE-0445"

def generate_otp():
    now = int(time.time() / 3600)  # current hour
    otp = hashlib.sha256(f"{SECRET}:{now}".encode()).hexdigest()[:8]
    
    # Also calculate expiry
    next_hour = (now + 1) * 3600
    remaining = int(next_hour - time.time())
    mins = remaining // 60
    
    print(f"""
╔══════════════════════════════════════╗
║     🔐 IGCSE Guide OTP Generator     ║
╠══════════════════════════════════════╣
║                                      ║
║  Current password:  {otp}           ║
║                                      ║
║  Valid for:          {mins} minutes           ║
║                                      ║
║  Give this to the person who needs   ║
║  access to your guide. They enter    ║
║  it on the lock screen.              ║
║                                      ║
║  Password changes every hour.        ║
║                                      ║
╚══════════════════════════════════════╝
""")

if __name__ == "__main__":
    generate_otp()
    input("Press Enter to close...")
