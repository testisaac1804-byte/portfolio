#include <kernel.h>

/* x86 paging: 4KB pages, 1024-entry page directory, 1024-entry page tables */
/* Each entry: 32 bits. We identity-map the first 16 MB */

#define PAGE_DIR_ENTRIES  1024
#define PAGE_TABLE_ENTRIES 1024
#define PAGE_TABLES_NEEDED 4  /* 4 page tables = 4 * 4MB = 16MB */

static uint32_t page_directory[PAGE_DIR_ENTRIES] __attribute__((aligned(4096)));
static uint32_t page_tables[PAGE_TABLES_NEEDED][PAGE_TABLE_ENTRIES] __attribute__((aligned(4096)));

void paging_init(void) {
    /* Clear page directory */
    for (int i = 0; i < PAGE_DIR_ENTRIES; i++) {
        page_directory[i] = 0x02;  /* Supervisor, R/W, Not Present */
    }

    /* Identity-map first 16 MB */
    for (int pt_idx = 0; pt_idx < PAGE_TABLES_NEEDED; pt_idx++) {
        for (int pe_idx = 0; pe_idx < PAGE_TABLE_ENTRIES; pe_idx++) {
            uint32_t addr = (pt_idx * PAGE_TABLE_ENTRIES + pe_idx) * PAGE_SIZE;
            page_tables[pt_idx][pe_idx] = addr | PAGE_PRESENT | PAGE_WRITE;
        }
        /* Attach page table to directory */
        page_directory[pt_idx] = ((uint32_t)&page_tables[pt_idx]) | PAGE_PRESENT | PAGE_WRITE;
    }

    /* Set recursive page directory entry for last entry (self-reference) */
    /* This allows us to modify page tables by accessing address 0xFFC00000 */
    page_directory[1023] = ((uint32_t)page_directory) | PAGE_PRESENT | PAGE_WRITE;

    /* Load page directory */
    asm volatile("mov %0, %%cr3" : : "r"(page_directory));

    /* Enable paging (set PG bit in CR0) */
    uint32_t cr0;
    asm volatile("mov %%cr0, %0" : "=r"(cr0));
    cr0 |= 0x80000000;  /* Enable paging */
    asm volatile("mov %0, %%cr0" : : "r"(cr0));

    screen_writeln("[PAGING] Paging enabled - 16MB identity mapped");
}

void paging_map_page(uint32_t vaddr, uint32_t paddr, uint32_t flags) {
    uint32_t pd_idx = vaddr >> 22;
    uint32_t pt_idx = (vaddr >> 12) & 0x3FF;

    /* Check if page table exists */
    if (!(page_directory[pd_idx] & PAGE_PRESENT)) {
        /* Allocate a new page table */
        uint32_t* new_table = (uint32_t*)pmm_alloc_block();
        if (!new_table) {
            screen_write("[PAGING] ERROR: No memory for page table\n");
            return;
        }

        /* Clear the table */
        for (int i = 0; i < PAGE_TABLE_ENTRIES; i++) {
            new_table[i] = 0;
        }

        /* Set up the page directory entry */
        page_directory[pd_idx] = ((uint32_t)new_table) | PAGE_PRESENT | PAGE_WRITE | (flags & 0xFFF);

        /* Flush TLB */
        asm volatile("invlpg (%0)" : : "r"(vaddr));
    }

    /* Get the page table and set the entry */
    uint32_t* page_table = (uint32_t*)(page_directory[pd_idx] & 0xFFFFF000);
    page_table[pt_idx] = paddr | PAGE_PRESENT | (flags & 0xFFF);

    /* Flush TLB */
    asm volatile("invlpg (%0)" : : "r"(vaddr));
}

void paging_unmap_page(uint32_t vaddr) {
    uint32_t pd_idx = vaddr >> 22;
    uint32_t pt_idx = (vaddr >> 12) & 0x3FF;

    if (page_directory[pd_idx] & PAGE_PRESENT) {
        uint32_t* page_table = (uint32_t*)(page_directory[pd_idx] & 0xFFFFF000);
        page_table[pt_idx] = 0;
        asm volatile("invlpg (%0)" : : "r"(vaddr));
    }
}

int paging_is_mapped(uint32_t vaddr) {
    uint32_t pd_idx = vaddr >> 22;
    uint32_t pt_idx = (vaddr >> 12) & 0x3FF;

    if (!(page_directory[pd_idx] & PAGE_PRESENT)) {
        return 0;
    }

    uint32_t* page_table = (uint32_t*)(page_directory[pd_idx] & 0xFFFFF000);
    return (page_table[pt_idx] & PAGE_PRESENT) != 0;
}
