#include <kernel.h>
#include <serial.h>

#define SHELL_MAX_ARGS   16
#define SHELL_MAX_CMDS   32
#define SHELL_LINE_SIZE  256

typedef struct {
    char name[32];
    void (*handler)(int argc, char** argv);
    char help[64];
} shell_command_t;

static shell_command_t commands[SHELL_MAX_CMDS];
static int command_count = 0;
static char line_buffer[SHELL_LINE_SIZE];
static int line_pos = 0;

/* Echo output to both VGA and serial */
static void shell_puts(const char* str) {
    screen_write(str);
    serial_write(COM1_PORT, str);
}

static void shell_putchar(char c) {
    screen_putchar(c);
    if (c == '\n') serial_write_char(COM1_PORT, '\r');
    serial_write_char(COM1_PORT, c);
}

static void shell_writeln(const char* str) {
    screen_writeln(str);
    serial_write(COM1_PORT, str);
    serial_write(COM1_PORT, "\r\n");
}

#define screen_write shell_puts
#define screen_writeln shell_writeln
#define screen_putchar shell_putchar

/* Read a character from either keyboard or serial */
static char shell_getchar(void) {
    while (1) {
        /* Check serial first for remote interaction */
        if (serial_received(COM1_PORT)) {
            char c = serial_read(COM1_PORT);
            /* Echo back to serial so user sees their input */
            if (c == '\r') {
                serial_write(COM1_PORT, "\r\n");
                return '\n';
            }
            serial_write_char(COM1_PORT, c);
            return c;
        }
        if (keyboard_is_key_available()) {
            return keyboard_getchar();
        }
        asm("hlt");
    }
}

/* Built-in commands */
static void cmd_help(int argc, char** argv) {
    (void)argc; (void)argv;
    screen_writeln("Available commands:");
    for (int i = 0; i < command_count; i++) {
        screen_write("  ");
        screen_write(commands[i].name);
        int pad = 12 - strlen(commands[i].name);
        for (int j = 0; j < (pad > 0 ? pad : 1); j++) screen_putchar(' ');
        screen_write(commands[i].help);
        screen_putchar('\n');
    }
}

static void cmd_hello(int argc, char** argv) {
    (void)argc; (void)argv;
    screen_writeln("Hello, World! Welcome to Hermes OS.");
}

static void cmd_echo(int argc, char** argv) {
    for (int i = 1; i < argc; i++) {
        screen_write(argv[i]);
        if (i < argc - 1) screen_putchar(' ');
    }
    screen_putchar('\n');
}

static void cmd_reboot(int argc, char** argv) {
    (void)argc; (void)argv;
    screen_writeln("Rebooting...");
    uint8_t good = 0x02;
    while (good & 0x02) {
        good = inb(0x64);
    }
    outb(0x64, 0xFE);
    asm volatile("hlt");
}

static void cmd_uptime(int argc, char** argv) {
    (void)argc; (void)argv;
    uint32_t ticks = timer_get_ticks();
    screen_write("Uptime: ");
    screen_write_dec(ticks / 100);
    screen_write(".");
    screen_write_dec((ticks % 100) / 10);
    screen_write(" seconds (");
    screen_write_dec(ticks);
    screen_write(" ticks)\n");
}

static void cmd_ps(int argc, char** argv) {
    (void)argc; (void)argv;
    screen_writeln("PID  STATE  NAME");
    screen_writeln("---  -----  ----");
    for (int i = 0; i < TASK_MAX_SLOTS; i++) {
        if (task_list[i].state != TASK_TERMINATED) {
            screen_write(" ");
            screen_write_dec(task_list[i].pid);
            screen_write("    ");
            switch (task_list[i].state) {
                case TASK_READY:     screen_write("READY "); break;
                case TASK_RUNNING:   screen_write("RUN   "); break;
                case TASK_BLOCKED:   screen_write("BLOCK "); break;
                case TASK_TERMINATED: screen_write("DONE  "); break;
            }
            screen_writeln(task_list[i].name);
        }
    }
}

static void cmd_ls(int argc, char** argv) {
    (void)argc; (void)argv;
    fs_entry_t entries[FS_MAX_FILES];
    int count = fs_list("/", entries, FS_MAX_FILES);

    screen_writeln("NAME                        TYPE      SIZE");
    screen_writeln("----                        ----      ----");
    for (int i = 0; i < count; i++) {
        screen_write(entries[i].name);
        int pad = 28 - strlen(entries[i].name);
        for (int j = 0; j < (pad > 0 ? pad : 1); j++) screen_putchar(' ');
        screen_write(entries[i].type == FS_FILE ? "FILE" : "DIR ");
        screen_write("  ");
        screen_write_dec(entries[i].size);
        screen_putchar('\n');
    }
}

static void cmd_cat(int argc, char** argv) {
    if (argc < 2) {
        screen_writeln("Usage: cat <filename>");
        return;
    }

    fs_file_t* file = fs_open(argv[1]);
    if (!file) {
        screen_write("File not found: ");
        screen_writeln(argv[1]);
        return;
    }

    screen_write(file->data);
    if (file->data[file->size - 1] != '\n') {
        screen_putchar('\n');
    }
}

static void cmd_mem(int argc, char** argv) {
    (void)argc; (void)argv;
    screen_write("Free memory blocks: ");
    screen_write_dec(pmm_get_free_count());
    screen_write(" (");
    screen_write_dec(pmm_get_free_count() * 4);
    screen_write(" KB)\n");
}

void shell_register_command(const char* name, void (*handler)(int, char**), const char* help) {
    if (command_count >= SHELL_MAX_CMDS) return;

    strncpy(commands[command_count].name, name, 31);
    commands[command_count].name[31] = '\0';
    commands[command_count].handler = handler;
    strncpy(commands[command_count].help, help, 63);
    commands[command_count].help[63] = '\0';
    command_count++;
}

void shell_init(void) {
    shell_register_command("help",   cmd_help,   "Show this help message");
    shell_register_command("hello",  cmd_hello,  "Print hello world");
    shell_register_command("echo",   cmd_echo,   "Echo text to screen");
    shell_register_command("uptime", cmd_uptime, "Show system uptime");
    shell_register_command("ps",     cmd_ps,     "List running tasks");
    shell_register_command("ls",     cmd_ls,     "List files in filesystem");
    shell_register_command("cat",    cmd_cat,    "Display file contents");
    shell_register_command("mem",    cmd_mem,    "Show memory info");
    shell_register_command("reboot", cmd_reboot, "Reboot the system");

    screen_writeln("[SHELL] Command shell initialized");
}

static int parse_line(char* line, char** argv, int max_args) {
    int argc = 0;
    char* p = line;

    while (*p && argc < max_args) {
        /* Skip whitespace */
        while (*p == ' ' || *p == '\t') p++;
        if (!*p) break;

        argv[argc++] = p;

        /* Find end of argument */
        while (*p && *p != ' ' && *p != '\t') p++;
        if (*p) *p++ = '\0';
    }

    return argc;
}

static void process_command(char* line) {
    char* argv[SHELL_MAX_ARGS];
    int argc = parse_line(line, argv, SHELL_MAX_ARGS);

    if (argc == 0) return;

    /* Find the command */
    for (int i = 0; i < command_count; i++) {
        if (strcmp(argv[0], commands[i].name) == 0) {
            commands[i].handler(argc, argv);
            return;
        }
    }

    screen_write("Unknown command: ");
    screen_writeln(argv[0]);
}

void shell_run(void) {
    screen_writeln("\n=== Hermes OS Shell ===");
    screen_writeln("Type 'help' for available commands.\n");

    while (1) {
        screen_write("$ ");

        /* Read a line */
        line_pos = 0;
        while (1) {
            char c = shell_getchar();

            if (c == '\n') {
                line_buffer[line_pos] = '\0';
                screen_putchar('\n');
                break;
            } else if (c == '\b') {
                if (line_pos > 0) {
                    line_pos--;
                    screen_write("\b \b");
                }
            } else if (c >= ' ' && c <= '~') {
                if (line_pos < SHELL_LINE_SIZE - 1) {
                    line_buffer[line_pos++] = c;
                    screen_putchar(c);
                }
            }
        }

        /* Process the command */
        if (line_pos > 0) {
            process_command(line_buffer);
        }
    }
}
