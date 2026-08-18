// Hot Wire Cutter Thermocouple Clip
// Snaps onto cutter frame bar, holds bead against cutting wire
// Units: mm — adjust frame_thickness and wire_offset for your cutter

// ── Measure your hot wire cutter ──
frame_thickness = 8;    // thickness of the frame bar the clip grabs
frame_width      = 20;   // width of the frame bar
wire_offset      = 15;   // distance from frame edge to hot wire
wire_diameter    = 0.5;  // hot wire thickness (nichrome)
bead_diameter    = 2.0;  // thermocouple bead size
probe_wire_dia   = 1.2;  // thermocouple cable thickness

// ── Design ──────────────────────────────────────────────
clip_wall      = 2.5;   // clip arm thickness
clip_depth     = frame_width + 4;
clip_height    = frame_thickness + 4;
tolerance      = 0.3;   // loose fit so it snaps on

module thermocouple_clip() {
    difference() {
        union() {
            // ── Frame clamp (C-shape) ──
            difference() {
                cube([clip_wall * 2 + frame_thickness, clip_depth, clip_height]);
                // cutout for frame bar
                translate([clip_wall, -1, clip_wall - tolerance])
                    cube([frame_thickness + tolerance*2, clip_depth + 2, frame_thickness + tolerance*2]);
            }
            
            // ── Arm reaching to the wire ──
            translate([0, clip_depth/2 - 4, 0]) {
                difference() {
                    // arm body
                    cube([clip_wall, wire_offset + bead_diameter + 6, clip_height]);
                    
                    // probe cable channel (along top of arm)
                    translate([-1, 3, clip_height/2])
                        rotate([0, 90, 0])
                            cylinder(r = probe_wire_dia/2 + 0.3, h = clip_wall + 2, $fn = 24);
                }
                
                // ── Bead holder at end of arm ──
                translate([0, wire_offset + 3, clip_height/2]) {
                    difference() {
                        // holder block
                        translate([-1, -3, -clip_height/2])
                            cube([clip_wall + 2, 6, clip_height]);
                        
                        // bead pocket
                        translate([clip_wall/2, 0, 0])
                            sphere(r = bead_diameter/2 + 0.3, $fn = 24);
                        
                        // wire groove (bottom, where hot wire passes)
                        translate([0, -bead_diameter/2 - 1, -clip_height/2 - 1])
                            cube([clip_wall + 2, bead_diameter + wire_diameter + 1, wire_diameter + 1]);
                        
                        // opening for wire to enter
                        translate([clip_wall/2 - 0.5, bead_diameter/2 - 1, -clip_height/2 - 1])
                            cube([1, 4, 4]);
                    }
                }
            }
        }
    }
}

// Render
thermocouple_clip();
