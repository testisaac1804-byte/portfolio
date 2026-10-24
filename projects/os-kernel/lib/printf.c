#include <kernel.h>
#include <stdarg.h>

/* Minimal printf implementation */
static void print_dec(unsigned int value, int width, int pad_zero) {
    char buf[12];
    int i = 0;

    if (value == 0) {
        buf[i++] = '0';
    } else {
        while (value > 0) {
            buf[i++] = '0' + (value % 10);
            value /= 10;
        }
    }

    /* Pad */
    while (i < width) {
        buf[i++] = pad_zero ? '0' : ' ';
    }

    /* Reverse and print */
    for (int j = i - 1; j >= 0; j--) {
        screen_putchar(buf[j]);
    }
}

static void print_hex(unsigned int value, int width) {
    char buf[10];
    int i = 0;

    screen_write("0x");
    if (value == 0) {
        buf[i++] = '0';
    } else {
        while (value > 0) {
            int nibble = value & 0xF;
            buf[i++] = nibble < 10 ? '0' + nibble : 'A' + nibble - 10;
            value >>= 4;
        }
    }

    while (i < width) {
        buf[i++] = '0';
    }

    for (int j = i - 1; j >= 0; j--) {
        screen_putchar(buf[j]);
    }
}

static void print_str(const char* str) {
    screen_write(str);
}

int printf(const char* fmt, ...) {
    va_list args;
    va_start(args, fmt);

    int count = 0;
    while (*fmt) {
        if (*fmt != '%') {
            screen_putchar(*fmt);
            count++;
        } else {
            fmt++;
            int width = 0;
            int pad_zero = 0;

            if (*fmt == '0') {
                pad_zero = 1;
                fmt++;
            }

            while (*fmt >= '0' && *fmt <= '9') {
                width = width * 10 + (*fmt - '0');
                fmt++;
            }

            switch (*fmt) {
                case 'd':
                case 'i': {
                    int val = va_arg(args, int);
                    if (val < 0) {
                        screen_putchar('-');
                        val = -val;
                    }
                    print_dec((unsigned int)val, width, pad_zero);
                    break;
                }
                case 'u':
                    print_dec(va_arg(args, unsigned int), width, pad_zero);
                    break;
                case 'x':
                case 'X':
                    print_hex(va_arg(args, unsigned int), width);
                    break;
                case 's':
                    print_str(va_arg(args, const char*));
                    break;
                case 'c':
                    screen_putchar((char)va_arg(args, int));
                    break;
                case '%':
                    screen_putchar('%');
                    break;
                default:
                    screen_putchar('%');
                    screen_putchar(*fmt);
                    break;
            }
            count++;
        }
        fmt++;
    }

    va_end(args);
    return count;
}
