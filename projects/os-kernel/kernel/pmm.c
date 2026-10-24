#include <kernel.h>

/* Simple bitmap-based physical memory manager */
/* We'll manage memory from 1MB up to the top of available memory */

#define PMM_BLOCK_SIZE      4096
#define PMM_BLOCKS_PER_BYTE 8
#define PMM_MAX_BLOCKS      131072  /* 512 MB max */

static uint32_t memory_size = 0;
static uint32_t total_blocks = 0;
static uint32_t used_blocks = 0;
static uint32_t bitmap[PMM_MAX_BLOCKS / 32];

static inline void bitmap_set(int bit) {
    bitmap[bit / 32] |= (1 << (bit % 32));
}

static inline void bitmap_clear(int bit) {
    bitmap[bit / 32] &= ~(1 << (bit % 32));
}

static inline int bitmap_test(int bit) {
    return (bitmap[bit / 32] & (1 << (bit % 32))) != 0;
}

/* Find first free block */
static int find_first_free(void) {
    for (uint32_t i = 0; i < total_blocks; i++) {
        if (!bitmap_test(i)) {
            return i;
        }
    }
    return -1;
}

void pmm_init(uint32_t mem_upper_kb) {
    memory_size = mem_upper_kb * 1024;
    total_blocks = memory_size / PMM_BLOCK_SIZE;

    if (total_blocks > PMM_MAX_BLOCKS) {
        total_blocks = PMM_MAX_BLOCKS;
    }

    /* Mark all blocks as free initially */
    for (uint32_t i = 0; i < (total_blocks + 31) / 32; i++) {
        bitmap[i] = 0;
    }
    used_blocks = 0;

    /* Block 0 is reserved (NULL page) */
    bitmap_set(0);
    used_blocks++;

    /* Reserve kernel memory - from 0x100000 (1MB) to the end of our kernel */
    /* The kernel typically sits at 1MB and extends for some amount */
    /* We'll be conservative and reserve the first few MB */
    extern uint32_t end;  /* Defined in linker script */
    uint32_t kernel_end = (uint32_t)&end;
    uint32_t kernel_blocks = (kernel_end + PMM_BLOCK_SIZE - 1) / PMM_BLOCK_SIZE;

    for (uint32_t i = 1; i < kernel_blocks; i++) {
        bitmap_set(i);
        used_blocks++;
    }

    screen_write("[PMM] Physical Memory Manager initialized: ");
    screen_write_dec(total_blocks);
    screen_write(" blocks (");
    screen_write_dec(memory_size / 1024);
    screen_write(" KB), ");
    screen_write_dec(total_blocks - used_blocks);
    screen_write(" free\n");
}

void* pmm_alloc_block(void) {
    int block = find_first_free();
    if (block == -1) {
        return 0;  /* Out of memory */
    }

    bitmap_set(block);
    used_blocks++;
    return (void*)(block * PMM_BLOCK_SIZE);
}

void pmm_free_block(void* addr) {
    uint32_t addr_int = (uint32_t)addr;
    int block = addr_int / PMM_BLOCK_SIZE;

    if (block < 0 || (uint32_t)block >= total_blocks) {
        return;
    }

    bitmap_clear(block);
    used_blocks--;
}

uint32_t pmm_get_free_count(void) {
    return total_blocks - used_blocks;
}
