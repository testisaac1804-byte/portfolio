#!/bin/bash
# Test script for Hermes OS
rm -f /tmp/qemu_serial_in
mkfifo /tmp/qemu_serial_in

# Run QEMU with serial reading from the pipe
qemu-system-i386 -kernel /Users/isaac/Desktop/oskernel/oskernel.elf -m 64 -serial stdio -display none -no-reboot 2>&1 &
QEMU_PID=$!
echo "QEMU PID: $QEMU_PID" >&2

# Wait for boot
sleep 4

# Send commands one by one
for cmd in "help" "ls" "cat README" "hello" "uptime" "ps" "mem" "version" "cat VERSION" "cat HELLO"; do
    echo "$cmd" > /tmp/qemu_serial_in
    sleep 2
done

# Kill QEMU
kill $QEMU_PID 2>/dev/null
wait $QEMU_PID 2>/dev/null
rm -f /tmp/qemu_serial_in
