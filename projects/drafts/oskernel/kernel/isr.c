#include <kernel.h>

static isr_handler_t interrupt_handlers[256];

/* Install a handler for an interrupt */
void isr_install_handler(int irq, isr_handler_t handler) {
    interrupt_handlers[irq] = handler;
}

void isr_uninstall_handler(int irq) {
    interrupt_handlers[irq] = 0;
}

/* Called from isr_common_stub in boot.asm */
void isr_handler(registers_t* regs) {
    if (interrupt_handlers[regs->int_no] != 0) {
        isr_handler_t handler = interrupt_handlers[regs->int_no];
        handler(regs);
        return;
    }

    /* Unhandled exception - print info and halt */
    screen_set_color(COLOR_RED, COLOR_BLACK);
    screen_write("\n[PANIC] Unhandled exception: ");
    screen_write_dec(regs->int_no);
    screen_write("\n  EIP: ");
    screen_write_hex(regs->eip);
    screen_write("  CS: ");
    screen_write_hex(regs->cs);
    screen_write("  EFLAGS: ");
    screen_write_hex(regs->eflags);

    if (regs->err_code) {
        screen_write("\n  Error code: ");
        screen_write_hex(regs->err_code);
    }

    /* Print exception name */
    static const char* exception_names[] = {
        "Division By Zero",
        "Debug",
        "Non Maskable Interrupt",
        "Breakpoint",
        "Into Detected Overflow",
        "Out of Bounds",
        "Invalid Opcode",
        "No Coprocessor",
        "Double Fault",
        "Coprocessor Segment Overrun",
        "Bad TSS",
        "Segment Not Present",
        "Stack Fault",
        "General Protection Fault",
        "Page Fault",
        "Unknown Interrupt",
        "Coprocessor Fault",
        "Alignment Check",
        "Machine Check",
        "Reserved",
        "Reserved",
        "Reserved"
    };

    if (regs->int_no < 22) {
        screen_write("\n  Exception: ");
        screen_write(exception_names[regs->int_no]);
    }

    screen_set_color(COLOR_LIGHT_GREY, COLOR_BLACK);
    screen_write("\n\nSystem halted.");

    /* If page fault, show address */
    if (regs->int_no == 14) {
        uint32_t fault_addr;
        asm volatile("mov %%cr2, %0" : "=r"(fault_addr));
        screen_write("\n  Page fault at virtual address: ");
        screen_write_hex(fault_addr);
        screen_write("\n  Accessed: ");
        screen_write(regs->err_code & 0x1 ? "Present page" : "Non-present page");
        screen_write(regs->err_code & 0x2 ? " (Write)" : " (Read)");
        screen_write(regs->err_code & 0x4 ? " (User-mode)" : " (Supervisor)");
    }

    for (;;) {
        asm volatile("hlt");
    }
}
