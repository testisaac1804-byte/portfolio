; boot.asm - Multiboot-compliant bootloader entry point
; Assembled with NASM, loaded by GRUB or any Multiboot-compliant bootloader

MBALIGN     equ  1 << 0                    ; align loaded modules on page boundaries
MEMINFO     equ  1 << 1                    ; provide memory map
FLAGS       equ  MBALIGN | MEMINFO         ; Multiboot flag field
MAGIC       equ  0x1BADB002                ; Multiboot magic value
CHECKSUM    equ -(MAGIC + FLAGS)           ; checksum to prove we're multiboot

section .multiboot
align 4
    dd MAGIC
    dd FLAGS
    dd CHECKSUM

section .bss
align 16
stack_bottom:
    resb 16384                             ; 16 KB stack
stack_top:

section .text
extern kernel_main
extern isr_handler
extern irq_handler
extern scheduler_needs_switch
extern current_task_ptr
extern next_task_ptr

global _start
_start:
    mov esp, stack_top                     ; Set up stack

    ; Push multiboot info pointer (ebx) and magic (eax) for kernel_main
    push ebx                               ; multiboot_info_t pointer
    push eax                               ; magic number
    call kernel_main

    ; Should never reach here
    cli
.hang:
    hlt
    jmp .hang

; Global descriptor table loading
global gdt_flush
gdt_flush:
    mov eax, [esp + 4]                     ; Get GDT pointer
    lgdt [eax]                             ; Load the new GDT
    mov ax, 0x10                           ; Data segment selector
    mov ds, ax
    mov es, ax
    mov fs, ax
    mov gs, ax
    mov ss, ax
    jmp 0x08:.flush                        ; Far jump to code segment
.flush:
    ret

; Interrupt descriptor table loading
global idt_flush
idt_flush:
    mov eax, [esp + 4]                     ; Get IDT pointer
    lidt [eax]                             ; Load the new IDT
    ret

; === Interrupt Service Routine common stub ===
global isr_common_stub
isr_common_stub:
    pusha
    mov ax, ds
    push eax
    mov ax, 0x10
    mov ds, ax
    mov es, ax
    mov fs, ax
    mov gs, ax
    call isr_handler
    pop eax
    mov ds, ax
    mov es, ax
    mov fs, ax
    mov gs, ax
    popa
    add esp, 8
    iret

; === IRQ common stub (with scheduler context switch support) ===
; After calling the C handler, checks if scheduler wants to reschedule
global irq_common_stub
irq_common_stub:
    pusha

    mov ax, ds
    push eax

    mov ax, 0x10
    mov ds, ax
    mov es, ax
    mov fs, ax
    mov gs, ax

    call irq_handler

    ; After handler returns, check if scheduler wants to reschedule
    cmp byte [scheduler_needs_switch], 1
    jne .no_switch

    ; --- Context switch ---
    mov byte [scheduler_needs_switch], 0

    ; Save current stack pointer into current_task->esp
    mov eax, [current_task_ptr]
    mov [eax], esp

    ; Get next task
    mov eax, [next_task_ptr]
    mov [current_task_ptr], eax
    mov esp, [eax]

.no_switch:
    pop eax
    mov ds, ax
    mov es, ax
    mov fs, ax
    mov gs, ax
    popa
    add esp, 8
    iret

; Generate ISR stubs
%macro ISR_NOERR 1
global isr%1
isr%1:
    push 0                                  ; Push dummy error code
    push %1                                 ; Push interrupt number
    jmp isr_common_stub
%endmacro

%macro ISR_ERR 1
global isr%1
isr%1:
    push %1                                 ; Push interrupt number
    jmp isr_common_stub
%endmacro

%macro IRQ 2
global irq%1
irq%1:
    push 0                                  ; Push dummy error code
    push %2                                 ; Push remapped interrupt number
    jmp irq_common_stub
%endmacro

; CPU exception handlers (ISRs 0-31)
ISR_NOERR 0     ; Division by zero
ISR_NOERR 1     ; Debug
ISR_NOERR 2     ; Non-maskable interrupt
ISR_NOERR 3     ; Breakpoint
ISR_NOERR 4     ; Overflow
ISR_NOERR 5     ; Bound range exceeded
ISR_NOERR 6     ; Invalid opcode
ISR_NOERR 7     ; Device not available
ISR_ERR   8     ; Double fault
ISR_NOERR 9     ; Coprocessor segment overrun
ISR_ERR   10    ; Invalid TSS
ISR_ERR   11    ; Segment not present
ISR_ERR   12    ; Stack-segment fault
ISR_ERR   13    ; General protection fault
ISR_ERR   14    ; Page fault
ISR_NOERR 15    ; Reserved
ISR_NOERR 16    ; x87 FPU error
ISR_ERR   17    ; Alignment check
ISR_NOERR 18    ; Machine check
ISR_NOERR 19    ; SIMD floating-point exception
ISR_NOERR 20    ; Virtualization exception
ISR_NOERR 21    ; Control protection exception
ISR_NOERR 22    ; Reserved
ISR_NOERR 23    ; Reserved
ISR_NOERR 24    ; Reserved
ISR_NOERR 25    ; Reserved
ISR_NOERR 26    ; Reserved
ISR_NOERR 27    ; Reserved
ISR_NOERR 28    ; Reserved
ISR_NOERR 29    ; Reserved
ISR_ERR   30    ; Security exception
ISR_NOERR 31    ; Reserved

; IRQ handlers (remapped to 32-47)
IRQ 0,  32     ; PIT Timer
IRQ 1,  33     ; Keyboard
IRQ 2,  34     ; Cascade
IRQ 3,  35     ; COM2
IRQ 4,  36     ; COM1
IRQ 5,  37     ; LPT2
IRQ 6,  38     ; Floppy
IRQ 7,  39     ; LPT1
IRQ 8,  40     ; CMOS RTC
IRQ 9,  41     ; Free
IRQ 10, 42     ; Free
IRQ 11, 43     ; Free
IRQ 12, 44     ; PS/2 Mouse
IRQ 13, 45     ; FPU
IRQ 14, 46     ; Primary ATA
IRQ 15, 47     ; Secondary ATA
