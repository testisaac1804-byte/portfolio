// Clip Thermometer Enclosure
// Holds: ESP32-C3 SuperMini + MAX6675 + SSD1306 OLED
// Units: mm

// ── Parameters ──────────────────────────────────────────
wall = 2.0;           // wall thickness
inner_w = 28;          // PCB width (SuperMini)
inner_l = 50;          // PCB length
inner_h = 12;          // PCB height + clearance
oled_w = 27;           // OLED board width
oled_h = 27;           // OLED height
oled_x = 0;            // OLED flush left
oled_y = 0;            // OLED flush top

// ── Box ─────────────────────────────────────────────────
module box() {
    difference() {
        // Outer shell
        cube([inner_w + wall*2, inner_l + wall*2 + 8, inner_h + wall*2]);
        
        // Hollow inside
        translate([wall, wall, wall])
            cube([inner_w, inner_l + 8, inner_h + 1]);
        
        // OLED cutout (on the top face / lid area)
        translate([wall + 4, wall + 4, inner_h + wall - 0.1])
            cube([24, 24, wall + 2]);
        
        // Thermocouple connector cutout (side)
        translate([-1, wall + inner_l - 10, wall + 2])
            cube([wall + 2, 14, 8]);
        
        // USB cutout (opposite side)
        translate([wall + 4, -1, wall + 2])
            cube([10, wall + 2, 5]);
    }
}

// ── Lid ─────────────────────────────────────────────────
module lid() {
    difference() {
        cube([inner_w + wall*2, inner_l + wall*2 + 8, wall]);
        
        // OLED window
        translate([wall + 2, wall + 2, -0.1])
            cube([24, 24, wall + 2]);
    }
}

// ── Clip arm (holds thermocouple bead) ──────────────────
module probe_clip(wire_dia = 0.5, bead_dia = 2.0) {
    // A simple clamp that holds the thermocouple bead against the wire
    
    difference() {
        // Main body
        hull() {
            translate([0, 0, 0]) cylinder(r=4, h=6, $fn=32);
            translate([15, 0, 0]) cylinder(r=4, h=6, $fn=32);
        }
        
        // Wire groove (bottom)
        translate([2, -wire_dia/2 - 0.2, -0.1])
            cube([11, wire_dia + 0.4, 2.5]);
        
        // Probe channel (runs parallel)
        translate([2, -1.5, 1.5])
            rotate([0, 90, 0])
            cylinder(r=bead_dia/2 + 0.3, h=11, $fn=24);
        
        // Bead pocket (where bead touches wire)
        translate([12, 0, 3])
            sphere(r=bead_dia/2 + 0.5, $fn=24);
    }
}

// ── Render ───────────────────────────────────────────────
// Comment/uncomment as needed:

// Full enclosure
box();

// Lid (translate to view)
// translate([0, 0, inner_h + wall*2 + 5]) lid();

// Probe clip
// translate([40, 0, 0]) probe_clip();
