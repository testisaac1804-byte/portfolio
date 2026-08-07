#!/bin/bash
# Stop IsaacNet and restore system proxy
lsof -ti :8540 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti :8541 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null
# Restore proxy settings in case cleanup didn't run
networksetup -setwebproxystate Wi-Fi off 2>/dev/null
networksetup -setsecurewebproxystate Wi-Fi off 2>/dev/null
echo "IsaacNet stopped, proxy restored"
