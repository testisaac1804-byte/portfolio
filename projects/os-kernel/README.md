# Hermes OS — x86 kernel from scratch

A 32-bit x86 operating system kernel written from scratch. No libc, no host runtime,
no framework — just NASM, freestanding C, and a linker script.

Boots under GRUB via a Multiboot header, brings up its own descriptor tables and hardware
interrupts, manages physical and virtual memory, and drops into an interactive shell.

## Status: working

Verified end-to-end in `qemu-system-i386`: the kernel boots, runs three scheduled demo
tasks, and accepts an interactive shell session driven by real PS/2 scancodes.
Captured output: [`DEMO-TRANSCRIPT.log`](DEMO-TRANSCRIPT.log).

```
$ help                 → 9 commands listed
$ uptime               → Uptime: 15.7 seconds (1575 ticks)
$ ps                   → PID 0/1/2  READY  demo1 demo2 demo3
$ ls                   → README 665, VERSION 60, HELLO 37, docs DIR
$ cat README           → full file contents
$ mem                  → Free memory blocks: 15784 (63136 KB)
```

## Layout

```
boot/boot.asm      Multiboot header, entry, GDT/IDT flush, ISR/IRQ stubs, context switch
boot/linker.ld     Links the kernel at 1 MiB, .multiboot section first
include/           kernel.h, io.h, serial.h, stdint.h, stddef.h, stdarg.h
kernel/kernel.c    Kernel entry point, subsystem bring-up
kernel/screen.c    VGA text mode driver (80x25)
kernel/gdt.c       5 descriptors — null, ring0 code/data, ring3 code/data
kernel/idt.c       256 gates — 32 CPU exceptions + 16 hardware IRQs
kernel/isr.c       Exception handler registry
kernel/irq.c       8259A remap to 32-47, per-IRQ handler table, EOI
kernel/timer.c     PIT channel 0 at 100 Hz
kernel/keyboard.c  8042 init, scancode→ASCII, shift/caps, ring buffer
kernel/pmm.c       Bitmap physical frame allocator (4 KiB blocks)
kernel/paging.c    x86 paging, 16 MB identity-mapped
kernel/scheduler.c Round-robin task table + context switch
kernel/fs.c        In-memory filesystem
kernel/shell.c     Interactive shell, 9 commands
lib/string.c       memset/memcpy/strlen/strcmp/atoi/itoa
lib/printf.c       Minimal printf
```

## Build

Requires `nasm`, `clang` (freestanding), `x86_64-elf-ld`, and `qemu-system-i386`.

```bash
make                 # → oskernel.elf (~37 KB)
```

## Run

```bash
# windowed
qemu-system-i386 -kernel oskernel.elf -m 64

# headless, shell on your terminal
qemu-system-i386 -kernel oskernel.elf -m 64 -serial stdio -display none
```

The shell is reachable over both the PS/2 keyboard and COM1.

## Test

```bash
bash test_all.sh     # boots QEMU, injects real PS/2 keystrokes, prints the transcript
bash test_keyboard.sh
python3 test_shell.py
```

## Three bugs worth remembering

1. **ISR/IRQ stubs didn't pass the frame pointer.** `irq_handler(registers_t*)` was called
   with nothing on the stack, so the C handler read a garbage `int_no` and indexed the
   handler table with it — page fault at `0xc014d3d0`, recursing until the stack overflowed
   into an unmapped page and triple-faulted. Fix: `push esp` before the call, `add esp, 4` after.

2. **The PIC mask is inverted.** `0xFB` looks like "unmask IRQ0 and IRQ1" but bit=1 means
   *masked*, so it disabled both the timer and the keyboard. Correct value: `0xFC`.

3. **`hlt` with everything masked is a deadlock.** The idle loop halts until an interrupt;
   with IRQ0/IRQ1 masked and the UART receive interrupt off, nothing ever woke it, so polled
   serial input was never read. Keeping the 100 Hz timer unmasked fixes it — and the 8042
   controller's keyboard-interrupt bit (config byte bit 0) must be set during init, which the
   driver originally never did.

## Shell commands

| Command | Action |
|---|---|
| `help` | List commands |
| `hello` | Print a greeting |
| `echo <text>` | Echo arguments |
| `uptime` | Ticks and seconds since boot |
| `ps` | List tasks |
| `ls` | List files |
| `cat <file>` | Print file contents |
| `mem` | Free memory blocks |
| `reboot` | Triple-fault reset |
