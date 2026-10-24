#ifndef KERNEL_H
#define KERNEL_H

#include <stdint.h>
#include <stddef.h>
#include <io.h>

/* Multiboot info structure (from GRUB) */
typedef struct {
    uint32_t flags;
    uint32_t mem_lower;
    uint32_t mem_upper;
    uint32_t boot_device;
    uint32_t cmdline;
    uint32_t mods_count;
    uint32_t mods_addr;
    uint32_t syms[4];
    uint32_t mmap_length;
    uint32_t mmap_addr;
    uint32_t drives_length;
    uint32_t drives_addr;
    uint32_t config_table;
    uint32_t boot_loader_name;
    uint32_t apm_table;
    uint32_t vbe_control_info;
    uint32_t vbe_mode_info;
    uint16_t vbe_mode;
    uint16_t vbe_interface_seg;
    uint16_t vbe_interface_off;
    uint16_t vbe_interface_len;
    uint64_t framebuffer_addr;
    uint32_t framebuffer_pitch;
    uint32_t framebuffer_width;
    uint32_t framebuffer_height;
    uint8_t  framebuffer_bpp;
    uint8_t  framebuffer_type;
} __attribute__((packed)) multiboot_info_t;

/* Memory map entry from GRUB */
typedef struct {
    uint32_t size;
    uint64_t base_addr;
    uint64_t length;
    uint32_t type;
} __attribute__((packed)) mmap_entry_t;

/* Key codes returned by keyboard */
#define KEY_BACKSPACE 0x08
#define KEY_ENTER     0x0A
#define KEY_TAB       0x09
#define KEY_ESC       0x1B
#define KEY_LSHIFT    0x80
#define KEY_RSHIFT    0x81
#define KEY_CTRL      0x82
#define KEY_ALT       0x83
#define KEY_CAPS      0x84
#define KEY_F1        0x85
#define KEY_F2        0x86
#define KEY_UP        0xE0
#define KEY_DOWN      0xE1
#define KEY_LEFT      0xE2
#define KEY_RIGHT     0xE3

/* Screen dimensions */
#define VGA_WIDTH  80
#define VGA_HEIGHT 25
#define VGA_MEMORY 0xB8000

/* Colors */
#define COLOR_BLACK         0
#define COLOR_BLUE          1
#define COLOR_GREEN         2
#define COLOR_CYAN          3
#define COLOR_RED           4
#define COLOR_MAGENTA       5
#define COLOR_BROWN         6
#define COLOR_LIGHT_GREY    7
#define COLOR_DARK_GREY     8
#define COLOR_LIGHT_BLUE    9
#define COLOR_LIGHT_GREEN   10
#define COLOR_LIGHT_CYAN    11
#define COLOR_LIGHT_RED     12
#define COLOR_LIGHT_MAGENTA 13
#define COLOR_YELLOW        14
#define COLOR_WHITE         15

/* Kernel functions */
void kernel_main(uint32_t magic, multiboot_info_t* mb_info);
void panic(const char* msg);
void reboot(void);

/* Screen functions */
void screen_init(void);
void screen_clear(void);
void screen_set_color(uint8_t fg, uint8_t bg);
void screen_putchar(char c);
void screen_write(const char* str);
void screen_writeln(const char* str);
void screen_write_dec(int value);
void screen_write_hex(uint32_t value);
void screen_set_cursor(int x, int y);
void screen_get_cursor(int* x, int* y);
void screen_scroll(void);

/* GDT functions */
void gdt_init(void);
void gdt_set_gate(int num, uint32_t base, uint32_t limit, uint8_t access, uint8_t gran);
extern void gdt_flush(uint32_t gdt_ptr);

/* IDT functions */
void idt_init(void);
void idt_set_gate(uint8_t num, uint32_t base, uint16_t sel, uint8_t flags);
extern void idt_flush(uint32_t idt_ptr);

/* ISR functions */
typedef struct {
    uint32_t ds;
    uint32_t edi, esi, ebp, esp, ebx, edx, ecx, eax;
    uint32_t int_no;
    uint32_t err_code;
    uint32_t eip, cs, eflags, useresp, ss;
} registers_t;

typedef void (*isr_handler_t)(registers_t*);
void isr_install_handler(int irq, isr_handler_t handler);
void isr_uninstall_handler(int irq);
void isr_handler(registers_t* regs);

/* IRQ functions */
void irq_init(void);
void irq_install_handler(int irq, isr_handler_t handler);
void irq_uninstall_handler(int irq);
void irq_handler(registers_t* regs);
void irq_enable(int irq);

/* Timer functions */
void timer_init(uint32_t frequency);
void timer_wait(uint32_t ticks);
uint32_t timer_get_ticks(void);
extern volatile uint32_t tick_count;

/* Keyboard functions */
void keyboard_init(void);
char keyboard_getchar(void);
int keyboard_is_key_available(void);

/* Physical Memory Manager */
void pmm_init(uint32_t mem_upper_kb);
void* pmm_alloc_block(void);
void pmm_free_block(void* addr);
uint32_t pmm_get_free_count(void);

/* Paging */
#define PAGE_SIZE 4096
#define PAGE_PRESENT  0x1
#define PAGE_WRITE    0x2
#define PAGE_USER     0x4

void paging_init(void);
void paging_map_page(uint32_t vaddr, uint32_t paddr, uint32_t flags);
void paging_unmap_page(uint32_t vaddr);
int  paging_is_mapped(uint32_t vaddr);

/* Task / Scheduler */
#define TASK_MAX_NAME 32
#define TASK_STACK_SIZE 4096

typedef enum {
    TASK_READY,
    TASK_RUNNING,
    TASK_BLOCKED,
    TASK_TERMINATED
} task_state_t;

typedef struct task {
    uint32_t esp;                         /* Stack pointer (saved/restored on context switch) */
    uint32_t pid;                         /* Process ID */
    task_state_t state;                   /* Task state */
    char name[TASK_MAX_NAME];             /* Task name */
    struct task* next;                    /* Next task in list */
    uint8_t stack[TASK_STACK_SIZE];       /* Kernel stack */
} task_t;

/* Scheduler variables - referenced from assembly */
extern volatile uint8_t scheduler_needs_switch;
extern task_t* current_task_ptr;
extern task_t* next_task_ptr;

/* Task list for shell commands */
#define TASK_MAX_SLOTS 16
extern task_t task_list[];

void scheduler_init(void);
int  scheduler_create_task(const char* name, void (*entry)(void));
void scheduler_start(void);
void scheduler_stop(void);
void scheduler_remove_task(int pid);
int  scheduler_task_count(void);

/* Filesystem */
#define FS_MAX_FILES 64
#define FS_MAX_NAME  32
#define FS_FILE      0
#define FS_DIRECTORY 1

typedef struct {
    char name[FS_MAX_NAME];
    uint32_t type;
    uint32_t size;
    uint32_t data_block;
    uint32_t inode;
} fs_entry_t;

typedef struct {
    char name[FS_MAX_NAME];
    uint32_t type;
    uint32_t size;
    char* data;
} fs_file_t;

void fs_init(void);
fs_file_t* fs_open(const char* path);
int fs_read(fs_file_t* file, char* buffer, uint32_t size);
void fs_close(fs_file_t* file);
int fs_list(const char* path, fs_entry_t* entries, int max_entries);

/* Shell */
void shell_init(void);
void shell_run(void);
void shell_register_command(const char* name, void (*handler)(int argc, char** argv), const char* help);

/* Standard library */
void memset(void* ptr, int value, size_t num);
void memcpy(void* dest, const void* src, size_t num);
void memmove(void* dest, const void* src, size_t num);
int memcmp(const void* ptr1, const void* ptr2, size_t num);
size_t strlen(const char* str);
int strcmp(const char* s1, const char* s2);
int strncmp(const char* s1, const char* s2, size_t n);
char* strcpy(char* dest, const char* src);
char* strncpy(char* dest, const char* src, size_t n);
char* strcat(char* dest, const char* src);
int atoi(const char* str);
char* itoa(int value, char* str, int base);

int printf(const char* fmt, ...);

#endif /* KERNEL_H */
