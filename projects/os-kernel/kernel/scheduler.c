#include <kernel.h>
#include <serial.h>

/* This variable is checked by irq_common_stub in boot.asm after every IRQ */
/* Set to 1 to request a context switch on return from the timer interrupt */
volatile uint8_t scheduler_needs_switch = 0;

/* Task control block pointer - used by assembly irq_common_stub */
task_t* current_task_ptr = 0;
task_t* next_task_ptr = 0;

/* Task list - non-static so shell.c can access it (via extern) */
#define TASK_MAX_SLOTS 16
task_t task_list[TASK_MAX_SLOTS];
static int task_count = 0;
static int scheduler_running = 0;

/* The idle task - runs when nothing else can */
static void idle_task(void) {
    while (1) {
        asm volatile("hlt");
    }
}

/* Called from the timer IRQ handler (IRQ0) */
/* This runs at IRQ time, inside the irq_common_stub handler */
static void scheduler_tick(registers_t* regs) {
    (void)regs;

    /* Tick the system timer */
    /* timer_tick_count is managed by timer.c */
    extern volatile uint32_t tick_count;
    tick_count++;

    if (!scheduler_running || task_count <= 0) {
        return;
    }

    /* Debug: print tick every 100 ticks */
    if ((tick_count % 100) == 0) {
        serial_write(COM1_PORT, "[SCHED] Tick ");
        serial_write_dec(COM1_PORT, tick_count);
        serial_write(COM1_PORT, ", current PID=");
        serial_write_dec(COM1_PORT, current_task_ptr ? current_task_ptr->pid : 999);
        serial_write(COM1_PORT, "\r\n");
    }

    /* Find next ready task (round-robin) */
    int current_pid = current_task_ptr ? current_task_ptr->pid : 0;
    int found = 0;

    for (int i = 1; i <= TASK_MAX_SLOTS; i++) {
        int pid = (current_pid + i) % TASK_MAX_SLOTS;
        if (task_list[pid].state == TASK_READY || task_list[pid].state == TASK_RUNNING) {
            next_task_ptr = &task_list[pid];
            found = 1;
            break;
        }
    }

    if (!found || next_task_ptr == current_task_ptr) {
        return;  /* No other task to switch to */
    }

    /* Mark current as ready (if it was running) */
    if (current_task_ptr && current_task_ptr->state == TASK_RUNNING) {
        current_task_ptr->state = TASK_READY;
    }

    /* Mark next as running */
    next_task_ptr->state = TASK_RUNNING;

    /* Request context switch in irq_common_stub */
    scheduler_needs_switch = 1;
}

void scheduler_init(void) {
    /* Clear task list */
    for (int i = 0; i < TASK_MAX_SLOTS; i++) {
        task_list[i].state = TASK_TERMINATED;
        task_list[i].pid = i;
        task_list[i].esp = 0;
        task_list[i].next = 0;
    }
    task_count = 0;
    current_task_ptr = 0;
    scheduler_running = 0;

    screen_writeln("[SCHEDULER] Scheduler subsystem initialized");
}

int scheduler_create_task(const char* name, void (*entry)(void)) {
    if (task_count >= TASK_MAX_SLOTS) {
        screen_write("[SCHEDULER] ERROR: Max tasks reached\n");
        return -1;
    }

    /* Find a free slot */
    int slot = -1;
    for (int i = 0; i < TASK_MAX_SLOTS; i++) {
        if (task_list[i].state == TASK_TERMINATED) {
            slot = i;
            break;
        }
    }
    if (slot == -1) return -1;

    task_t* task = &task_list[slot];
    task->pid = slot;
    task->state = TASK_READY;
    task->next = 0;

    /* Copy name */
    int i;
    for (i = 0; name[i] && i < TASK_MAX_NAME - 1; i++) {
        task->name[i] = name[i];
    }
    task->name[i] = '\0';

    /* Set up the task's initial stack for context switching.
     *
     * The irq_common_stub saves registers in this order (from top of stack):
     *   [esp]     = saved DS
     *   [esp+4]   = EDI (from pusha - first pushed)
     *   [esp+8]   = ESI
     *   [esp+12]  = EBP
     *   [esp+16]  = ESP (original, unused)
     *   [esp+20]  = EBX
     *   [esp+24]  = EDX
     *   [esp+28]  = ECX
     *   [esp+32]  = EAX (from pusha - last pushed)
     *   [esp+36]  = IRQ number (dummy, from push)
     *   [esp+40]  = error code (dummy, from push)
     *   [esp+44]  = EIP (from IRET frame)
     *   [esp+48]  = CS
     *   [esp+52]  = EFLAGS
     *   [esp+56]  = user ESP (if ring change, not used in ring 0)
     *   [esp+60]  = user SS (if ring change, not used in ring 0)
     *
     * For a fresh task, we set up the stack so that on first context switch:
     *   - It pops DS, then pusha regs, then removes the IRQ#/err, then IRETs
     *   - IRET pops EIP=entry, CS=0x08, EFLAGS=0x202 (IF set)
     */
    uint32_t* stack = (uint32_t*)(task->stack + TASK_STACK_SIZE);

    /* IRET frame - must be pushed in reverse order (bottom to top):
       [low address / ESP points here] EIP
       CS
       EFLAGS
       [high address]
       IRET pops: EIP, then CS, then EFLAGS */
    *--stack = 0x202;         /* EFLAGS - IF bit set (pushed first, highest addr) */
    *--stack = 0x08;          /* CS - kernel code segment */
    *--stack = (uint32_t)entry;  /* EIP - entry point (pushed last, lowest addr = ESP) */

    /* Fake IRQ number & error code (will be popped by add esp,8) */
    *--stack = 0;             /* error code */
    *--stack = 0;             /* IRQ number */

    /* pusha frame - matches order that popa will pop */
    *--stack = 0;             /* EAX */
    *--stack = 0;             /* ECX */
    *--stack = 0;             /* EDX */
    *--stack = 0;             /* EBX */
    *--stack = (uint32_t)(task->stack + TASK_STACK_SIZE); /* ESP (dummy) */
    *--stack = 0;             /* EBP */
    *--stack = 0;             /* ESI */
    *--stack = 0;             /* EDI */

    /* DS */
    *--stack = 0x10;          /* DS - kernel data segment */

    task->esp = (uint32_t)stack;
    task_count++;

    screen_write("[SCHEDULER] Created task '");
    screen_write(task->name);
    screen_write("' (PID: ");
    screen_write_dec(task->pid);
    screen_write(")\n");

    return task->pid;
}

void scheduler_start(void) {
    if (task_count == 0) return;

    /* Find first ready task */
    for (int i = 0; i < TASK_MAX_SLOTS; i++) {
        if (task_list[i].state == TASK_READY) {
            current_task_ptr = &task_list[i];
            current_task_ptr->state = TASK_RUNNING;
            break;
        }
    }

    if (!current_task_ptr) {
        screen_write("[SCHEDULER] ERROR: No ready tasks!\n");
        return;
    }

    scheduler_running = 1;

    /* Install scheduler_tick as the timer IRQ handler */
    irq_install_handler(0, scheduler_tick);

    serial_write(COM1_PORT, "[SCHED] Starting round-robin tasks at 100Hz...\r\n");

    __asm__ volatile(
        "mov %0, %%esp\n"     /* Switch to task's stack */
        "pop %%eax\n"         /* Restore DS */
        "mov %%ax, %%ds\n"
        "mov %%ax, %%es\n"
        "mov %%ax, %%fs\n"
        "mov %%ax, %%gs\n"
        "popa\n"              /* Restore general registers */
        "add $8, %%esp\n"     /* Skip IRQ number and error code */
        "iret\n"              /* Jump to task entry point */
        :
        : "r"(current_task_ptr->esp)
        : "memory"
    );
}

void scheduler_stop(void) {
    scheduler_running = 0;
}

void scheduler_remove_task(int pid) {
    if (pid < 0 || pid >= TASK_MAX_SLOTS) return;
    if (task_list[pid].state == TASK_TERMINATED) return;

    task_list[pid].state = TASK_TERMINATED;
    task_count--;

    screen_write("[SCHEDULER] Task '");
    screen_write(task_list[pid].name);
    screen_write("' (PID: ");
    screen_write_dec(pid);
    screen_write(") terminated\n");
}

int scheduler_task_count(void) {
    return task_count;
}
