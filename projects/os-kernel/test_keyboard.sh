#!/bin/bash
# End-to-end test: boot kernel, inject real PS/2 keypresses via QEMU monitor,
# capture shell output from the serial port.
cd /Users/isaac/Documents/projects/drafts/oskernel || exit 1
rm -f /tmp/os_serial.log

(
  sleep 14
  for k in h e l p ret; do echo "sendkey $k"; sleep 0.25; done
  sleep 3
  for k in l s ret; do echo "sendkey $k"; sleep 0.25; done
  sleep 2
  for k in u p t i m e ret; do echo "sendkey $k"; sleep 0.25; done
  sleep 3
  echo "quit"
) | qemu-system-i386 -kernel oskernel.elf -m 64 -display none \
      -serial file:/tmp/os_serial.log -monitor stdio -no-reboot >/dev/null 2>&1

echo "=========== SERIAL TRANSCRIPT ==========="
cat /tmp/os_serial.log
echo "========================================="
