#include <kernel.h>

/* Keyboard scancode to ASCII mapping */
static const char scancode_ascii[] = {
    0,   0,   '1', '2', '3', '4', '5', '6', '7', '8',    /* 0-9 */
    '9', '0', '-', '=', 0,   0,   'q', 'w', 'e', 'r',    /* 10-19 */
    't', 'y', 'u', 'i', 'o', 'p', '[', ']', 0,   0,       /* 20-29 */
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';',    /* 30-39 */
    0x27,'`', 0,   '\\','z', 'x', 'c', 'v', 'b', 'n',    /* 40-49 */
    'm', ',', '.', '/', 0,   '*', 0,   ' ', 0,   0,       /* 50-59 */
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,        /* 60-69 */
    0,   0,   0,   0,   '-', 0,   0,   0,   '+', 0,        /* 70-79 */
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,        /* 80-89 */
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,        /* 90-99 */
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,        /* 100-109 */
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,        /* 110-119 */
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0         /* 120-127 */
};

/* Shifted scancode mapping */
static const char scancode_shift[] = {
    0,   0,   '!', '@', '#', '$', '%', '^', '&', '*',    /* 0-9 */
    '(', ')', '_', '+', 0,   0,   'Q', 'W', 'E', 'R',    /* 10-19 */
    'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', 0,   0,       /* 20-29 */
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':',    /* 30-39 */
    '"', '~', 0,   '|', 'Z', 'X', 'C', 'V', 'B', 'N',    /* 40-49 */
    'M', '<', '>', '?', 0,   '*', 0,   ' ', 0,   0,       /* 50-59 */
};

/* Keyboard buffer */
#define KEYBOARD_BUFFER_SIZE 256
static char buffer[KEYBOARD_BUFFER_SIZE];
static int buffer_head = 0;
static int buffer_tail = 0;

/* Modifier keys state */
static int shift_pressed = 0;
static int ctrl_pressed  = 0;
static int alt_pressed   = 0;
static int caps_lock     = 0;

static void keyboard_callback(registers_t* regs) {
    (void)regs;

    uint8_t scancode = inb(0x60);
    char c = 0;

    /* Key pressed (scancode < 0x80) */
    if (scancode < 0x80) {
        switch (scancode) {
            case 0x2A: case 0x36:  /* LShift, RShift */
                shift_pressed = 1;
                return;
            case 0x1D:  /* LCtrl */
                ctrl_pressed = 1;
                return;
            case 0x38:  /* LAlt */
                alt_pressed = 1;
                return;
            case 0x3A:  /* Caps Lock */
                caps_lock = !caps_lock;
                return;
            case 0x0E:  /* Backspace */
                c = '\b';
                break;
            case 0x1C:  /* Enter */
                c = '\n';
                break;
            case 0x0F:  /* Tab */
                c = '\t';
                break;
            case 0x01:  /* Escape */
                c = 27;
                break;
            default:
                if (shift_pressed || caps_lock) {
                    if (scancode < sizeof(scancode_shift)) {
                        c = scancode_shift[scancode];
                    }
                }
                if (c == 0 && scancode < sizeof(scancode_ascii)) {
                    c = scancode_ascii[scancode];
                }
                break;
        }
    } else {
        /* Key released */
        switch (scancode - 0x80) {
            case 0x2A: case 0x36:  /* LShift, RShift */
                shift_pressed = 0;
                return;
            case 0x1D:  /* LCtrl */
                ctrl_pressed = 0;
                return;
            case 0x38:  /* LAlt */
                alt_pressed = 0;
                return;
        }
        return;
    }

    /* Add to buffer */
    if (c != 0) {
        int next = (buffer_head + 1) % KEYBOARD_BUFFER_SIZE;
        if (next != buffer_tail) {
            buffer[buffer_head] = c;
            buffer_head = next;
        }
    }
}

void keyboard_init(void) {
    irq_install_handler(1, keyboard_callback);
    screen_writeln("[KEYBOARD] PS/2 keyboard driver initialized");
}

char keyboard_getchar(void) {
    /* Wait for a character */
    while (buffer_head == buffer_tail) {
        asm volatile("hlt");
    }

    char c = buffer[buffer_tail];
    buffer_tail = (buffer_tail + 1) % KEYBOARD_BUFFER_SIZE;
    return c;
}

int keyboard_is_key_available(void) {
    return buffer_head != buffer_tail;
}
