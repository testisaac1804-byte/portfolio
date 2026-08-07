# Makefile for Hermes OS
# Targets: i386 (32-bit) protected mode kernel
# Tools: NASM, Clang (cross-compile to x86-64 ELF), x86_64-elf-ld

CC      := clang
ASM     := nasm
LD      := x86_64-elf-ld
OBJCOPY := x86_64-elf-objcopy

CFLAGS  := -target x86_64-elf -m32 -ffreestanding -nostdlib -fno-builtin \
           -fno-stack-protector -fno-pie -fno-pic -mno-sse -Wall -Wextra \
           -Wno-unused-parameter -Iinclude -O2 -g

ASMFLAGS := -f elf32 -g
LDFLAGS  := -T boot/linker.ld -m elf_i386 -nostdlib
QEMU     := qemu-system-i386

# Source files
C_SOURCES := $(wildcard kernel/*.c lib/*.c)
ASM_SOURCES := $(wildcard boot/*.asm)
C_OBJS    := $(patsubst %.c, %.o, $(C_SOURCES))
ASM_OBJS  := $(patsubst %.asm, %.o, $(ASM_SOURCES))
ALL_OBJS  := $(C_OBJS) $(ASM_OBJS)

# Target
KERNEL_BIN := oskernel.elf

.PHONY: all clean run debug qemu-gdb

all: $(KERNEL_BIN)

# Compile C files to ELF objects (32-bit)
kernel/%.o: kernel/%.c include/kernel.h include/io.h include/stdint.h include/stddef.h include/stdarg.h
	@echo "  CC    $@"
	@$(CC) $(CFLAGS) -c -o $@ $<

lib/%.o: lib/%.c include/kernel.h include/stdint.h include/stddef.h include/stdarg.h
	@echo "  CC    $@"
	@$(CC) $(CFLAGS) -c -o $@ $<

# Assemble assembly files
boot/%.o: boot/%.asm
	@echo "  ASM   $@"
	@$(ASM) $(ASMFLAGS) -o $@ $<

# Link the kernel
$(KERNEL_BIN): $(ALL_OBJS) boot/linker.ld
	@echo "  LD    $@"
	@$(LD) $(LDFLAGS) -o $@ $(ALL_OBJS)
	@echo "  Built: $@"
	@$(OBJCOPY) --only-keep-debug $@ $@.sym 2>/dev/null || true
	@echo "  Size:"
	@$(SIZE) --format=berkeley $@ 2>/dev/null || stat -f "%z" $@

# Run in QEMU
run: $(KERNEL_BIN)
	@echo "  Starting Hermes OS in QEMU..."
	@$(QEMU) -kernel $(KERNEL_BIN) -m 64 -serial stdio -vga std \
		-device AC97 -audiodev coreaudio,id=audio0 2>/dev/null || \
	$(QEMU) -kernel $(KERNEL_BIN) -m 64 -serial stdio -vga std

# Debug mode (with GDB stub)
debug: $(KERNEL_BIN)
	@echo "  Starting Hermes OS in QEMU with GDB debugging..."
	@echo "  Connect: gdb -ex 'target remote localhost:1234' -ex 'symbol-file $(KERNEL_BIN)'"
	@$(QEMU) -kernel $(KERNEL_BIN) -m 64 -serial stdio -vga std -s -S

# Create bootable ISO (optional, requires grub-mkrescue)
iso: $(KERNEL_BIN)
	@mkdir -p iso/boot/grub
	@cp $(KERNEL_BIN) iso/boot/
	@echo 'set timeout=0' > iso/boot/grub/grub.cfg
	@echo 'set default=0' >> iso/boot/grub/grub.cfg
	@echo 'menuentry "Hermes OS" {' >> iso/boot/grub/grub.cfg
	@echo '  multiboot /boot/oskernel.elf' >> iso/boot/grub/grub.cfg
	@echo '}' >> iso/boot/grub/grub.cfg
	@grub-mkrescue -o oskernel.iso iso 2>/dev/null && echo "ISO: oskernel.iso" || \
		echo "grub-mkrescue failed - install xorriso and grub"

# Clean
clean:
	@echo "  Cleaning..."
	@rm -f $(ALL_OBJS) $(KERNEL_BIN) $(KERNEL_BIN).sym
	@rm -rf iso/
	@rm -f *.iso
	@echo "  Done"

# Print sizes
size: $(KERNEL_BIN)
	@$(OBJCOPY) -O binary $(KERNEL_BIN) /tmp/oskernel.bin 2>/dev/null; \
	ls -la /tmp/oskernel.bin 2>/dev/null; \
	stat -f "%z" $(KERNEL_BIN)
