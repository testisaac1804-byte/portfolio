#include <kernel.h>

/* VGA text mode buffer */
static uint16_t* const vga_buffer = (uint16_t*) VGA_MEMORY;
static uint8_t current_color;
static int cursor_x = 0;
static int cursor_y = 0;

static uint16_t make_vga_entry(char c, uint8_t color) {
    return (uint16_t)c | (uint16_t)color << 8;
}

void screen_init(void) {
    screen_set_color(COLOR_LIGHT_GREY, COLOR_BLACK);
    screen_clear();
}

void screen_clear(void) {
    uint16_t blank = make_vga_entry(' ', current_color);
    for (int i = 0; i < VGA_WIDTH * VGA_HEIGHT; i++) {
        vga_buffer[i] = blank;
    }
    cursor_x = 0;
    cursor_y = 0;
    screen_set_cursor(0, 0);
}

void screen_set_color(uint8_t fg, uint8_t bg) {
    current_color = fg | (bg << 4);
}

void screen_putchar(char c) {
    switch (c) {
        case '\n':
            cursor_x = 0;
            cursor_y++;
            break;
        case '\r':
            cursor_x = 0;
            break;
        case '\t':
            cursor_x = (cursor_x + 8) & ~7;
            break;
        case '\b':
            if (cursor_x > 0) {
                cursor_x--;
                vga_buffer[cursor_y * VGA_WIDTH + cursor_x] = make_vga_entry(' ', current_color);
            }
            break;
        default:
            vga_buffer[cursor_y * VGA_WIDTH + cursor_x] = make_vga_entry(c, current_color);
            cursor_x++;
            break;
    }

    if (cursor_x >= VGA_WIDTH) {
        cursor_x = 0;
        cursor_y++;
    }

    if (cursor_y >= VGA_HEIGHT) {
        screen_scroll();
    }

    screen_set_cursor(cursor_x, cursor_y);
}

void screen_write(const char* str) {
    while (*str) {
        screen_putchar(*str++);
    }
}

void screen_writeln(const char* str) {
    screen_write(str);
    screen_putchar('\n');
}

void screen_write_dec(int value) {
    char buf[12];
    itoa(value, buf, 10);
    screen_write(buf);
}

void screen_write_hex(uint32_t value) {
    char buf[11];
    buf[0] = '0';
    buf[1] = 'x';
    buf[10] = '\0';

    for (int i = 0; i < 8; i++) {
        int nibble = (value >> (28 - i * 4)) & 0xF;
        buf[i + 2] = nibble < 10 ? '0' + nibble : 'A' + nibble - 10;
    }
    screen_write(buf);
}

void screen_set_cursor(int x, int y) {
    cursor_x = x;
    cursor_y = y;
    uint16_t pos = y * VGA_WIDTH + x;
    outb(0x3D4, 0x0F);
    outb(0x3D5, (uint8_t)(pos & 0xFF));
    outb(0x3D4, 0x0E);
    outb(0x3D5, (uint8_t)((pos >> 8) & 0xFF));
}

void screen_get_cursor(int* x, int* y) {
    *x = cursor_x;
    *y = cursor_y;
}

void screen_scroll(void) {
    /* Move all rows up by one */
    for (int y = 0; y < VGA_HEIGHT - 1; y++) {
        for (int x = 0; x < VGA_WIDTH; x++) {
            vga_buffer[y * VGA_WIDTH + x] = vga_buffer[(y + 1) * VGA_WIDTH + x];
        }
    }

    /* Clear last row */
    uint16_t blank = make_vga_entry(' ', current_color);
    for (int x = 0; x < VGA_WIDTH; x++) {
        vga_buffer[(VGA_HEIGHT - 1) * VGA_WIDTH + x] = blank;
    }

    cursor_y = VGA_HEIGHT - 1;
}
