#include <kernel.h>
#include <serial.h>

/* Demo task functions */
void task_demo1(void);
void task_demo2(void);
void task_demo3(void);

static int task_counter[3] = {0, 0, 0};

/* Kernel entry point - called from boot.asm */
void kernel_main(uint32_t magic, multiboot_info_t* mb_info) {
    serial_init(COM1_PORT);
    serial_write(COM1_PORT, "[OS] Booting...\r\n");
    serial_write_hex(COM1_PORT, magic);
    serial_write(COM1_PORT, "\r\n");

    screen_init();
    screen_writeln("========================================");
    screen_writeln("  Hermes OS - x86 Kernel from Scratch");
    screen_writeln("========================================\n");

    /* Verify multiboot magic */
    if (magic != 0x2BADB002) {
        serial_write(COM1_PORT, "[PANIC] Bad magic\r\n");
        for (;;) asm("hlt");
    }
    screen_write("[BOOT] Multiboot OK (magic: ");
    screen_write_hex(magic);
    screen_write(")\n");

    uint32_t mem_upper = mb_info->mem_upper;
    serial_write(COM1_PORT, "[BOOT] Mem: ");
    serial_write_dec(COM1_PORT, mem_upper);
    serial_write(COM1_PORT, " KB upper\r\n");
    screen_write("[BOOT] Memory: ");
    screen_write_dec(mem_upper);
    screen_write(" KB upper\n");

    /* Initialize core subsystems */
    gdt_init();
    idt_init();
    irq_init();
    timer_init(100);
    keyboard_init();

    __asm__ volatile("sti");
    screen_writeln("[CPU] Interrupts enabled\n");

    pmm_init(mem_upper);
    paging_init();
    fs_init();
    shell_init();

    /* === Cooperative Multitasking Demo === */
    screen_writeln("\n=== Cooperative Multitasking Demo ===");
    screen_writeln("3 tasks demonstrating scheduler infrastructure\n");

    scheduler_init();
    scheduler_create_task("demo1", task_demo1);
    scheduler_create_task("demo2", task_demo2);
    scheduler_create_task("demo3", task_demo3);

    /* Enable keyboard IRQ for shell input */
    outb(0x21, inb(0x21) & ~2);  /* Unmask IRQ1 */

    /* Run demo tasks manually - each runs to completion, then next starts */
    screen_writeln("[SCHED] Running demo1...");
    serial_write(COM1_PORT, "[DEMO] task_demo1 starting...\r\n");
    task_demo1();
    serial_write(COM1_PORT, "[DEMO] task_demo1 done\r\n");

    screen_writeln("[SCHED] Running demo2...");
    serial_write(COM1_PORT, "[DEMO] task_demo2 starting...\r\n");
    task_demo2();
    serial_write(COM1_PORT, "[DEMO] task_demo2 done\r\n");

    screen_writeln("[SCHED] Running demo3...");
    serial_write(COM1_PORT, "[DEMO] task_demo3 starting...\r\n");
    task_demo3();
    serial_write(COM1_PORT, "[DEMO] task_demo3 done\r\n");

    /* All demos complete - start interactive shell */
    screen_writeln("\n=== All demo tasks completed! ===");
    screen_writeln("Starting interactive shell...\n");
    serial_write(COM1_PORT, "[SHELL] Starting interactive shell...\r\n");

    /* Re-enable keyboard - ensure PS/2 port is active */
    outb(0x64, 0xAE);   /* Enable keyboard interface (PS/2 command) */
    /* Flush keyboard output buffer */
    if (inb(0x64) & 0x01) {
        inb(0x60);  /* Read and discard */
    }
    /* Unmask keyboard IRQ on PIC */
    outb(0x21, inb(0x21) & ~2);

    shell_run();
}

/* ====== DEMO TASKS ====== */

void task_demo1(void) {
    screen_set_color(COLOR_LIGHT_GREEN, COLOR_BLACK);
    for (int i = 0; i < 5; i++) {
        task_counter[0]++;
        printf(" [TASK1] Iteration %d/5  (PID=%d)\n", i+1, 0);
        serial_write(COM1_PORT, "[TASK1] Iteration ");
        serial_write_dec(COM1_PORT, i+1);
        serial_write(COM1_PORT, "/5\n");
        for (volatile int j = 0; j < 2000000; j++);
    }
    screen_writeln(" [TASK1] Done!");
    serial_write(COM1_PORT, "[TASK1] Done!\r\n");
}

void task_demo2(void) {
    screen_set_color(COLOR_LIGHT_MAGENTA, COLOR_BLACK);
    for (int i = 0; i < 3; i++) {
        task_counter[1]++;
        printf(" [TASK2] Iteration %d/3  (PID=%d)\n", i+1, 1);
        serial_write(COM1_PORT, "[TASK2] Iteration ");
        serial_write_dec(COM1_PORT, i+1);
        serial_write(COM1_PORT, "/3\n");
        for (volatile int j = 0; j < 2000000; j++);
    }
    screen_writeln(" [TASK2] Done!");
    serial_write(COM1_PORT, "[TASK2] Done!\r\n");
}

void task_demo3(void) {
    screen_set_color(COLOR_YELLOW, COLOR_BLACK);
    for (int i = 0; i < 4; i++) {
        task_counter[2]++;
        printf(" [TASK3] Iteration %d/4  (PID=%d)\n", i+1, 2);
        serial_write(COM1_PORT, "[TASK3] Iteration ");
        serial_write_dec(COM1_PORT, i+1);
        serial_write(COM1_PORT, "/4\n");
        for (volatile int j = 0; j < 2000000; j++);
    }
    screen_writeln(" [TASK3] Done!");
    serial_write(COM1_PORT, "[TASK3] Done!\r\n");
}

void panic(const char* msg) {
    screen_set_color(COLOR_RED, COLOR_BLACK);
    screen_write("\n[PANIC] ");
    screen_writeln(msg);
    for (;;) asm("hlt");
}

void reboot(void) {
    uint8_t good;
    do { good = inb(0x64); } while (good & 0x02);
    outb(0x64, 0xFE);
    for (;;) asm("hlt");
}
