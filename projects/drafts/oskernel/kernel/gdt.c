#include <kernel.h>

/* GDT entry structure */
typedef struct {
    uint16_t limit_low;
    uint16_t base_low;
    uint8_t  base_middle;
    uint8_t  access;
    uint8_t  granularity;
    uint8_t  base_high;
} __attribute__((packed)) gdt_entry_t;

typedef struct {
    uint16_t limit;
    uint32_t base;
} __attribute__((packed)) gdt_ptr_t;

static gdt_entry_t gdt_entries[5];
static gdt_ptr_t   gdt_ptr;

/* Set a GDT entry */
void gdt_set_gate(int num, uint32_t base, uint32_t limit, uint8_t access, uint8_t gran) {
    gdt_entries[num].base_low     = base & 0xFFFF;
    gdt_entries[num].base_middle  = (base >> 16) & 0xFF;
    gdt_entries[num].base_high    = (base >> 24) & 0xFF;
    gdt_entries[num].limit_low    = limit & 0xFFFF;
    gdt_entries[num].granularity  = (limit >> 16) & 0x0F;
    gdt_entries[num].granularity |= gran & 0xF0;
    gdt_entries[num].access       = access;
}

void gdt_init(void) {
    gdt_ptr.limit = sizeof(gdt_entries) - 1;
    gdt_ptr.base  = (uint32_t)&gdt_entries;

    /* Null segment */
    gdt_set_gate(0, 0, 0, 0, 0);

    /* Code segment: base=0, limit=4GB, access=0x9A, gran=0xCF */
    /* 0x9A = Present, Ring 0, Code, Execute/Read */
    /* 0xCF = Granularity 4KB, 32-bit, limit high nibble = 0xF */
    gdt_set_gate(1, 0, 0xFFFFFFFF, 0x9A, 0xCF);

    /* Data segment: base=0, limit=4GB, access=0x92, gran=0xCF */
    /* 0x92 = Present, Ring 0, Data, Read/Write */
    gdt_set_gate(2, 0, 0xFFFFFFFF, 0x92, 0xCF);

    /* User mode code segment */
    gdt_set_gate(3, 0, 0xFFFFFFFF, 0xFA, 0xCF);

    /* User mode data segment */
    gdt_set_gate(4, 0, 0xFFFFFFFF, 0xF2, 0xCF);

    gdt_flush((uint32_t)&gdt_ptr);
    screen_writeln("[GDT] Global Descriptor Table initialized");
}
