#!/bin/bash
# Full end-to-end demo: boot Hermes OS, inject real PS/2 keystrokes, capture output.
cd /Users/isaac/Documents/projects/drafts/oskernel || exit 1
rm -f /tmp/ser_full.log

keys_for() {
  # Translate a command string into QEMU monitor sendkey commands
  local s="$1"
  local i c
  for (( i=0; i<${#s}; i++ )); do
    c="${s:$i:1}"
    case "$c" in
      " ") echo "sendkey spc" ;;
      [A-Z]) echo "sendkey shift-$(echo "$c" | tr 'A-Z' 'a-z')" ;;
      *)   echo "sendkey $c" ;;
    esac
  done
  echo "sendkey ret"
}

(
  sleep 10
  for cmd in "help" "hello" "echo hermes os" "uptime" "ps" "ls" "cat README" "mem"; do
    keys_for "$cmd"
    sleep 2
  done
  sleep 2
  echo "quit"
) | qemu-system-i386 -kernel oskernel.elf -m 64 -display none \
      -serial file:/tmp/ser_full.log -monitor stdio -no-reboot >/dev/null 2>&1

echo "=========== HERMES OS DEMO TRANSCRIPT ==========="
cat /tmp/ser_full.log
echo "================================================="
