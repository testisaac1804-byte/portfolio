/* linker.ld - Linker script for the kernel */
ENTRY(_start)

SECTIONS
{
    /* Begin at 1MB - conventional location for kernel */
    . = 1M;

    .multiboot : {
        *(.multiboot)
    }

    .text : {
        *(.text)
    }

    .rodata : {
        *(.rodata)
        *(.rodata.*)
    }

    .data : {
        *(.data)
    }

    .bss : {
        *(COMMON)
        *(.bss)
    }

    /* Symbol for end of kernel - used by physical memory manager */
    end = .;

    /* Discard unnecessary sections */
    /DISCARD/ : {
        *(.comment)
        *(.note.*)
        *(.eh_frame)
        *(.debug_*)
    }
}
