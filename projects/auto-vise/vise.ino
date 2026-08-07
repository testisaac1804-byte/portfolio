/*
 * Auto-Clamping Vise — Arduino Nano + NEMA 17 + ACS712 current sensing
 * 
 * Wiring:
 *   A4988 STEP  → D2
 *   A4988 DIR   → D3
 *   A4988 ENABLE → D4 (LOW = enabled)
 *   A4988 MS1/MS2/MS3 → D5/D6/D7 (optional microstepping, default all LOW = full step)
 *   ACS712 VOUT → A0
 *   CLAMP button → D9  (INPUT_PULLUP, GND when pressed)
 *   RELEASE button → D10 (INPUT_PULLUP, GND when pressed)
 *   GREEN LED → D11 (anode, cathode via 220Ω to GND)
 *   RED LED   → D12 (anode, cathode via 220Ω to GND)
 *
 * NOTE: A4988 VDD → 5V, VMOT → 12V (shared with stepper power),
 *       SLEEP+RESET tied together (or to 5V), GND shared with Arduino.
 *       ACS712 VCC → 5V, GND → GND. Load in series with stepper power (VMOT side).
 */

#include <Arduino.h>

// ── Pin Definitions ────────────────────────────────────────────────────
#define PIN_STEP      2
#define PIN_DIR       3
#define PIN_ENABLE    4
#define PIN_MS1       5   // optional — leave disconnected if not using
#define PIN_MS2       6
#define PIN_MS3       7
#define PIN_CURRENT   A0
#define BTN_CLAMP     9
#define BTN_RELEASE   10
#define LED_GREEN     11
#define LED_RED       12

// ── Parameters ─────────────────────────────────────────────────────────
#define STEP_DELAY_US     800       // microseconds between steps (speed)
#define RELEASE_STEPS     2000      // how far to back off on release
#define MAX_CLAMP_STEPS   5000      // safety limit — stop even without force detection
#define CURRENT_THRESHOLD 100       // ADC rise over baseline that = clamped (adjust!)
#define BASELINE_SAMPLES  50        // samples to establish idle current
#define CLAMP_HOLD_DELAY  500       // ms: confirm current spike is real (debounce)

// ── State ──────────────────────────────────────────────────────────────
enum State { IDLE, CLAMPING, CLAMPED, RELEASING };
State state = IDLE;
int baseline = 512;   // ADC value at idle (zero current ≈ Vcc/2)

// ── Setup ──────────────────────────────────────────────────────────────
void setup() {
  pinMode(PIN_STEP,   OUTPUT);
  pinMode(PIN_DIR,    OUTPUT);
  pinMode(PIN_ENABLE, OUTPUT);
  pinMode(PIN_MS1,    OUTPUT);
  pinMode(PIN_MS2,    OUTPUT);
  pinMode(PIN_MS3,    OUTPUT);
  pinMode(BTN_CLAMP,  INPUT_PULLUP);
  pinMode(BTN_RELEASE, INPUT_PULLUP);
  pinMode(LED_GREEN,  OUTPUT);
  pinMode(LED_RED,    OUTPUT);

  digitalWrite(PIN_ENABLE, HIGH);  // disabled during setup
  digitalWrite(PIN_DIR, LOW);
  digitalWrite(PIN_MS1, LOW);     // full step
  digitalWrite(PIN_MS2, LOW);
  digitalWrite(PIN_MS3, LOW);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_RED, LOW);

  // Calibrate baseline current (motor idle but enabled)
  digitalWrite(PIN_ENABLE, LOW);
  delay(100);
  baseline = readAverageCurrent(BASELINE_SAMPLES);
  digitalWrite(PIN_ENABLE, HIGH);

  // Startup blink
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_GREEN, HIGH); delay(150);
    digitalWrite(LED_GREEN, LOW);  delay(150);
  }
  setLEDs(false, false);
}

// ── Loop ───────────────────────────────────────────────────────────────
void loop() {
  switch (state) {
    case IDLE:
      setLEDs(false, false);
      if (digitalRead(BTN_CLAMP) == LOW) {
        state = CLAMPING;
        setLEDs(true, false);  // red = clamping
        digitalWrite(PIN_ENABLE, LOW);
        digitalWrite(PIN_DIR, HIGH);  // forward
      }
      break;

    case CLAMPING: {
      int steps = 0;
      while (steps < MAX_CLAMP_STEPS) {
        // Check for user cancel (second press = release)
        if (digitalRead(BTN_RELEASE) == LOW) {
          state = RELEASING;
          digitalWrite(PIN_DIR, LOW); // reverse
          break;
        }

        // Pulse one step
        digitalWrite(PIN_STEP, HIGH);
        delayMicroseconds(STEP_DELAY_US / 2);
        digitalWrite(PIN_STEP, LOW);
        delayMicroseconds(STEP_DELAY_US / 2);
        steps++;

        // Check current every 20 steps (reduce noise)
        if (steps % 20 == 0) {
          int currentADC = analogRead(PIN_CURRENT);
          int rise = abs(currentADC - baseline);

          if (rise > CURRENT_THRESHOLD) {
            // Confirm it's real — wait and sample again
            delay(CLAMP_HOLD_DELAY);
            int confirmADC = analogRead(PIN_CURRENT);
            int confirmRise = abs(confirmADC - baseline);

            if (confirmRise > CURRENT_THRESHOLD) {
              // Clamped! Hold position.
              digitalWrite(PIN_ENABLE, LOW);  // keep enabled = hold torque
              state = CLAMPED;
              setLEDs(true, true);   // red stays on, green on = done
              break;
            }
          }
        }
      }

      // Safety timeout — ran MAX steps without detecting clamp
      if (state == CLAMPING) {
        digitalWrite(PIN_ENABLE, HIGH);  // disable, free motor
        state = IDLE;
        blinkError();
      }
      break;
    }

    case CLAMPED:
      // Wait for release button
      if (digitalRead(BTN_RELEASE) == LOW) {
        state = RELEASING;
        setLEDs(true, false);          // red only = releasing
        digitalWrite(PIN_DIR, LOW);    // reverse direction
      }
      break;

    case RELEASING:
      for (int i = 0; i < RELEASE_STEPS; i++) {
        digitalWrite(PIN_STEP, HIGH);
        delayMicroseconds(STEP_DELAY_US / 2);
        digitalWrite(PIN_STEP, LOW);
        delayMicroseconds(STEP_DELAY_US / 2);
      }
      digitalWrite(PIN_ENABLE, HIGH);  // disable motor
      state = IDLE;
      setLEDs(false, true);  // green blink
      delay(300);
      break;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────
int readAverageCurrent(int samples) {
  long sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(PIN_CURRENT);
    delay(2);
  }
  return sum / samples;
}

void setLEDs(bool red, bool green) {
  digitalWrite(LED_RED, red);
  digitalWrite(LED_GREEN, green);
}

void blinkError() {
  for (int i = 0; i < 5; i++) {
    digitalWrite(LED_RED, HIGH); delay(100);
    digitalWrite(LED_RED, LOW);  delay(100);
  }
}
