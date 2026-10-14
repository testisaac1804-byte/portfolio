#!/bin/bash
# Reliable launcher for the Password Game solver.
# Kills only the solver's own python + its Chrome profile, never the calling shell.
cd /Users/isaac/password-game-solver || exit 1
ps -eo pid,command | grep "Python -u sol[v]e" | awk '{print $1}' | xargs -r kill -9 2>/dev/null
ps -eo pid,command | grep "password-game-solver-profi[l]e" | awk '{print $1}' | xargs -r kill -9 2>/dev/null
pkill -9 -f "yt-dl[p]" 2>/dev/null
sleep 3
# keep the previous win screenshot instead of destroying it
if [ -f won.png ]; then mv -f won.png "won_$(date +%Y%m%d-%H%M%S).png"; fi
nohup python3 -u solve.py > /tmp/pgRun.log 2>&1 &
echo "launched pid $!"
