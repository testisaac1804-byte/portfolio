# 6-Axis Robot Arm

# 6-Axis Robot Arm

A 6-axis robotic arm project — mechanics, drawings, and stepper-control firmware.

## Contents
- **`图纸/`** — drawings and CAD: `arm.STEP` (full assembly, 38 MB), `UpperArm_short.STL`, `WE-2.4.step.zip`
- **`TicStepTest/`** — firmware/test code for Pololu **TicStep** stepper drivers:
  - `main.h` / `main.c`, `sio_util.h`, `TicStepTest.mk` / `.res` (Microchip project)
  - `testpoints_circle.txt` — circular interpolation test path for the arm
- **`TicStep.pdf`** / **`RunFile.pdf`** — driver docs and how to run a motion file
- 13 STL parts for printing

## Notes
Stepper-driven 6-DOF arm; the test firmware streams coordinates from a points file so the arm traces a circle — the same G-code-style approach used for CNC motion.
