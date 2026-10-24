#ifndef SERIAL_H
#define SERIAL_H

#include <stdint.h>
#include <io.h>

#define COM1_PORT 0x3F8
#define COM2_PORT 0x2F8

static inline void serial_init(uint16_t port) {
    outb(port + 1, 0x00);    /* Disable all interrupts */
    outb(port + 3, 0x80);    /* Enable DLAB (set baud rate divisor) */
    outb(port + 0, 0x03);    /* Set divisor to 3 (38400 baud) */
    outb(port + 1, 0x00);    /* High byte divisor */
    outb(port + 3, 0x03);    /* 8 bits, no parity, one stop bit */
    outb(port + 2, 0xC7);    /* Enable FIFO, clear them, with 14-byte threshold */
    outb(port + 4, 0x0B);    /* IRQs enabled, RTS/DSR set */
}

static inline int serial_received(uint16_t port) {
    return inb(port + 5) & 1;
}

static inline char serial_read(uint16_t port) {
    while (!serial_received(port));
    return inb(port);
}

static inline int serial_is_transmit_empty(uint16_t port) {
    return inb(port + 5) & 0x20;
}

static inline void serial_write_char(uint16_t port, char c) {
    while (!serial_is_transmit_empty(port));
    outb(port, c);
}

static inline void serial_write(uint16_t port, const char* str) {
    while (*str) {
        if (*str == '\n') {
            serial_write_char(port, '\r');
        }
        serial_write_char(port, *str++);
    }
}

static inline void serial_write_hex(uint16_t port, uint32_t value) {
    serial_write(port, "0x");
    for (int i = 0; i < 8; i++) {
        int nibble = (value >> (28 - i * 4)) & 0xF;
        char c = nibble < 10 ? '0' + nibble : 'A' + nibble - 10;
        serial_write_char(port, c);
    }
}

static inline void serial_write_dec(uint16_t port, uint32_t value) {
    char buf[12];
    int i = 0;
    if (value == 0) {
        serial_write_char(port, '0');
        return;
    }
    while (value > 0) {
        buf[i++] = '0' + (value % 10);
        value /= 10;
    }
    while (i > 0) {
        serial_write_char(port, buf[--i]);
    }
}

#endif /* SERIAL_H */
