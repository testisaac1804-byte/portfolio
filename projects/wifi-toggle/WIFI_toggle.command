#!/bin/bash
clear

# --- CONFIGURATION ---
# This is usually en0 for Wi-Fi. 
# If you use a different adapter, change en0 below.
DEVICE="en0" 
# ---------------------

echo "Checking current MTU for $DEVICE..."

# Get the current MTU value
CURRENT=$(networksetup -getMTU $DEVICE | grep -o '[0-9]\{4\}' | head -1)

if [ "$CURRENT" == "1500" ]; then
    echo "----------------------------------------"
    echo "Current MTU is 1500 (Standard)."
    echo "SWITCHING TO VPN MODE (1350)..."
    echo "----------------------------------------"
	echo "Requires Laptop Password"
    sudo networksetup -setMTU $DEVICE 1350
    echo "SUCCESS: MTU set to 1350."
else
    echo "----------------------------------------"
    echo "Current MTU is $CURRENT (VPN/Custom)."
    echo "SWITCHING TO STANDARD MODE (1500)..."
    echo "----------------------------------------"
    sudo networksetup -setMTU $DEVICE 1500
    echo "SUCCESS: MTU set to 1500."
fi

# Keep the window open so you can see the result
echo ""
echo "You can close this window now."
read -n 1

