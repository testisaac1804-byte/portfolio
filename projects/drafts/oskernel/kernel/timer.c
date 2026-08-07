#include <kernel.h>

volatile uint32_t tick_count = 0;

static void timer_callback(registers_t* regs) {
    (void)regs;
    /* tick_count is now incremented by scheduler_tick in scheduler.c */
    /* We keep this handler for non-scheduled timer use */
}

void timer_init(uint32_t frequency) {
    /* Install handler for IRQ0 */
    irq_install_handler(0, timer_callback);

    /* Calculate PIT divisor */
    uint32_t divisor = 1193180 / frequency;

    /* Send command byte */
    outb(0x43, 0x36);  /* Channel 0, lobyte/hibyte, rate generator, binary */

    /* Send divisor */
    outb(0x40, (uint8_t)(divisor & 0xFF));
    outb(0x40, (uint8_t)((divisor >> 8) & 0xFF));

    screen_write("[TIMER] PIT initialized at ");
    screen_write_dec(frequency);
    screen_write(" Hz\n");
}

void timer_wait(uint32_t ticks) {
    uint32_t target = tick_count + ticks;
    while (tick_count < target) {
        asm volatile("hlt");
    }
}

uint32_t timer_get_ticks(void) {
    return tick_count;
}
