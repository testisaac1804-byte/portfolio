# Hermes OS — x86 Kernel from Scratch

**Category:** Software & Apps · **Status:** Done

32-bit x86 operating system kernel written from scratch. Multiboot bootloader (GRUB-loadable),
GDT + IDT, 8259A PIC remapped to vectors 32-47, PIT timer at 100 Hz, 8042 PS/2 keyboard driver,
bitmap physical memory manager with x86 paging (16 MB identity-mapped), round-robin preemptive
scheduler with assembly context switching, in-memory filesystem, and an interactive shell with
9 commands. Freestanding C + NASM — no libc, no host runtime.

**Verified:** boots in QEMU; full shell session driven by real PS/2 scancodes
(help, hello, echo, uptime, ps, ls, cat, mem). Transcript in `DEMO-TRANSCRIPT.log`.

**Stack / Tools:** OS, x86, Assembly, C, NASM, QEMU

**Location:** `~/Documents/projects/drafts/oskernel`

## Where it lives
- Source folder: `~/Documents/projects/drafts/oskernel`
- Artefacts on the site: 47 files · 2,635 lines of text · 302 KB

## Stack
- binary ×16 · C ×15 · C/C++ header ×6 · Shell ×3

## What's in the code
- `kernel/shell.c` — 286 lines (C)
- `include/kernel.h` — 248 lines (C/C++ header)
- `kernel/scheduler.c` — 245 lines (C)
- `kernel/keyboard.c` — 175 lines (C)
- `kernel/fs.c` — 159 lines (C)
- `kernel/kernel.c` — 156 lines (C)
- `lib/string.c` — 138 lines (C)
- `kernel/screen.c` — 128 lines (C)
- `lib/printf.c` — 120 lines (C)
- `kernel/idt.c` — 113 lines (C)
- `kernel/pmm.c` — 101 lines (C)
- `kernel/paging.c` — 99 lines (C)

## Verified in the Python source
- functions: `pump`, `send`, `wait_for`

## Notes found in the scripts
- End-to-end test: boot kernel, inject real PS/2 keypresses via QEMU monitor,
- capture shell output from the serial port.
- Full end-to-end demo: boot Hermes OS, inject real PS/2 keystrokes, capture output.
- Test script for Hermes OS

---
_Spec generated from the project's own files on 2026-10-22 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
