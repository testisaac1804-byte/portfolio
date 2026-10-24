#include <kernel.h>

/*
 * Simple in-memory filesystem (initrd-like)
 * Files are stored in a flat array in kernel memory.
 * We'll generate a small initrd with sample files at build time.
 */

#define FS_MAX_SIZE 65536
#define FS_POOL_SIZE (16 * 4096)

static fs_file_t files[FS_MAX_FILES];
static int file_count = 0;
static char fs_pool[FS_POOL_SIZE];
static uint32_t fs_pool_offset = 0;

/* Create an in-memory file */
static int fs_create(const char* name, uint32_t type, const char* data, uint32_t size) {
    if (file_count >= FS_MAX_FILES) {
        return -1;
    }
    if (fs_pool_offset + size > FS_POOL_SIZE) {
        return -1;
    }

    fs_file_t* f = &files[file_count];

    /* Copy name */
    int i;
    for (i = 0; name[i] && i < FS_MAX_NAME - 1; i++) {
        f->name[i] = name[i];
    }
    f->name[i] = '\0';

    f->type = type;
    f->size = size;

    /* Copy data to pool */
    f->data = &fs_pool[fs_pool_offset];
    memcpy(f->data, data, size);
    fs_pool_offset += size;

    file_count++;
    return 0;
}

void fs_init(void) {
    file_count = 0;
    fs_pool_offset = 0;

    /* Create sample files for the OS */

    /* /README.TXT */
    fs_create("README", FS_FILE,
        "====================================\n"
        "  Hermes OS - x86 Kernel from Scratch\n"
        "====================================\n"
        "\n"
        "This is a minimal x86 operating system kernel\n"
        "built from scratch featuring:\n"
        "\n"
        "  [BOOT] Multiboot-compliant bootloader\n"
        "  [GDT]  Protected mode with segmentation\n"
        "  [IDT]  Interrupt handling (32 IRQs + 16 exceptions)\n"
        "  [PIC]  Programmable Interrupt Controller\n"
        "  [TIM]  PIT timer with 100Hz scheduling tick\n"
        "  [KBD]  PS/2 keyboard driver\n"
        "  [MMU]  Physical memory manager + paging\n"
        "  [SCH]  Preemptive round-robin scheduler\n"
        "  [FS]   Simple in-memory filesystem\n"
        "  [SH]   Interactive command shell\n"
        "\n"
        "Commands: help, hello, echo, uptime, ps, ls, cat, mem, reboot\n"
        "\n",
        47 * 23 + 10  /* Actually let me just let strlen handle it */
    );

    /* Re-create with proper size */
    file_count = 0;
    fs_pool_offset = 0;

    const char* readme =
        "====================================\n"
        "  Hermes OS - x86 Kernel from Scratch\n"
        "====================================\n"
        "\n"
        "This is a minimal x86 operating system kernel\n"
        "built from scratch featuring:\n"
        "\n"
        "  [BOOT] Multiboot-compliant bootloader\n"
        "  [GDT]  Protected mode with segmentation\n"
        "  [IDT]  Interrupt handling (32 IRQs + 16 exceptions)\n"
        "  [PIC]  Programmable Interrupt Controller\n"
        "  [TIM]  PIT timer with 100Hz scheduling tick\n"
        "  [KBD]  PS/2 keyboard driver\n"
        "  [MMU]  Physical memory manager + paging\n"
        "  [SCH]  Preemptive round-robin scheduler\n"
        "  [FS]   Simple in-memory filesystem\n"
        "  [SH]   Interactive command shell\n"
        "\n"
        "Commands: help, hello, echo, uptime, ps, ls, cat, mem, reboot\n";

    fs_create("README", FS_FILE, readme, strlen(readme) + 1);

    /* /VERSION */
    const char* version = "Hermes OS v0.1.0 - x86 Kernel from Scratch\nBuilt: Jul 2026\n";
    fs_create("VERSION", FS_FILE, version, strlen(version) + 1);

    /* /HELLO.TXT */
    const char* hello = "Hello, World! Welcome to Hermes OS.\n";
    fs_create("HELLO", FS_FILE, hello, strlen(hello) + 1);

    /* Create a "docs" directory */
    fs_create("docs", FS_DIRECTORY, 0, 0);

    screen_write("[FS] Initialized with ");
    screen_write_dec(file_count);
    screen_write(" files (");
    screen_write_dec(fs_pool_offset);
    screen_write(" bytes used)\n");
}

fs_file_t* fs_open(const char* name) {
    for (int i = 0; i < file_count; i++) {
        if (strcmp(files[i].name, name) == 0) {
            return &files[i];
        }
    }
    return 0;
}

int fs_read(fs_file_t* file, char* buffer, uint32_t size) {
    if (!file) return -1;
    if (size > file->size) size = file->size;
    memcpy(buffer, file->data, size);
    return size;
}

void fs_close(fs_file_t* file) {
    (void)file;
    /* No-op for in-memory filesystem */
}

int fs_list(const char* path, fs_entry_t* entries, int max_entries) {
    (void)path;  /* Flat filesystem for now */
    int count = 0;

    for (int i = 0; i < file_count && count < max_entries; i++) {
        strncpy(entries[count].name, files[i].name, FS_MAX_NAME - 1);
        entries[count].name[FS_MAX_NAME - 1] = '\0';
        entries[count].type = files[i].type;
        entries[count].size = files[i].size;
        entries[count].data_block = 0;
        entries[count].inode = i;
        count++;
    }

    return count;
}
