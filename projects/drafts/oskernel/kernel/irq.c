#include <kernel.h>

static isr_handler_t irq_routines[16];

void irq_install_handler(int irq, isr_handler_t handler) {
    irq_routines[irq] = handler;
}

void irq_uninstall_handler(int irq) {
    irq_routines[irq] = 0;
}

void irq_remap(void) {
    /* Send ICW1 to both PICs */
    outb(0x20, 0x11);  /* Master PIC */
    outb(0xA0, 0x11);  /* Slave PIC */

    /* Send ICW2: remap IRQs to interrupts 32-47 */
    outb(0x21, 0x20);  /* Master: IRQ0-7 -> INT 32-39 */
    outb(0xA1, 0x28);  /* Slave: IRQ8-15 -> INT 40-47 */

    /* Send ICW3: tell PICs their connection */
    outb(0x21, 0x04);  /* Master: slave at IRQ2 */
    outb(0xA1, 0x02);  /* Slave: cascade to master IRQ2 */

    /* Send ICW4: set 8086 mode */
    outb(0x21, 0x01);
    outb(0xA1, 0x01);

    /* Mask all interrupts - will be unmasked later */
    outb(0x21, 0xFF);  /* Mask everything on master PIC */
    outb(0xA1, 0xFF);  /* Mask everything on slave PIC */
}

/* Enable specific IRQs */
void irq_enable(int irq) {
    screen_write("[IRQ] Enabling ");
    screen_write_dec(irq);
    screen_write("...");
    if (irq < 8) {
        uint8_t mask = inb(0x21);
        screen_write("R ");
        screen_write_hex(mask);
        mask &= ~(1 << irq);
        outb(0x21, mask);
        screen_write(" -> ");
        screen_write_hex(inb(0x21));
    } else {
        uint8_t mask = inb(0xA1);
        mask &= ~(1 << (irq - 8));
        outb(0xA1, mask);
    }
    screen_writeln("OK");
}

void irq_init(void) {
    irq_remap();
    screen_writeln("[IRQ] PIC remapped to interrupts 32-47");
}

/* Called from irq_common_stub in boot.asm */
void irq_handler(registers_t* regs) {
    int irq = regs->int_no - 32;

    /* Call handler if registered */
    if (irq_routines[irq] != 0) {
        irq_routines[irq](regs);
    }

    /* Send EOI (End of Interrupt) */
    if (irq >= 8) {
        outb(0xA0, 0x20);  /* Slave PIC */
    }
    outb(0x20, 0x20);      /* Master PIC */
}
