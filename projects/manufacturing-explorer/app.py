#!/usr/bin/env python3
"""Manufacturing Method Explorer — 100+ methods, 3D preview, G-code export, toolpath simulation."""

import os
import json
import math
import re
import uuid
from datetime import datetime
from pathlib import Path

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.secret_key = os.urandom(24).hex()
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# ── LOAD METHODS FROM JSON ──────────────────────────────────────────
def _load_methods():
    p = os.path.join(os.path.dirname(__file__), "methods.json")
    if os.path.exists(p):
        with open(p) as f:
            return json.load(f)
    return {}

MANUFACTURING_METHODS = _load_methods()

SUPPORTED_EXTENSIONS = {
    ".dxf": "DXF", ".svg": "SVG", ".stl": "STL", ".obj": "OBJ",
    ".step": "STEP", ".stp": "STEP", ".iges": "IGES", ".igs": "IGES",
    ".gcode": "G-code", ".nc": "G-code", ".3mf": "3MF", ".amf": "AMF",
    ".ply": "PLY", ".off": "OFF", ".fbx": "FBX", ".glb": "GLB",
    ".gltf": "GLTF", ".dae": "Collada", ".x3d": "X3D", ".wrl": "VRML",
    ".xyz": "Point Cloud", ".pcd": "PCD", ".las": "LiDAR",
    ".png": "Heightmap", ".jpg": "Heightmap", ".bmp": "Heightmap",
    ".ai": "Illustrator", ".eps": "EPS", ".pdf": "PDF",
    ".dwg": "DWG", ".sldprt": "SolidWorks", ".ipt": "Inventor",
    ".3ds": "3DS Max", ".blend": "Blender", ".scad": "OpenSCAD",
}

def _parse_toolpath(gcode_text):
    """Parse G-code into structured toolpath coordinates for 3D animation."""
    moves = []
    current = {"x": 0, "y": 0, "z": 10, "f": 1000}
    rapid = False

    for line in gcode_text.split("\n"):
        line = line.split(";")[0].strip()
        if not line:
            continue

        parts = line.upper().split()
        if not parts:
            continue

        cmd = parts[0]
        if cmd == "G0":
            rapid = True
        elif cmd == "G1":
            rapid = False
        else:
            # Check for parameter words
            has_coords = any(p[0] in "XYZ" for p in parts[1:] if len(p) > 1)
            if not has_coords:
                continue

        # Parse coordinate words
        new_pos = dict(current)
        for p in parts[1:]:
            if len(p) < 2:
                continue
            letter, val = p[0], p[1:]
            try:
                if letter in "XYZEF":
                    new_pos[letter.lower()] = float(val)
                elif letter == "F":
                    new_pos["f"] = float(val)
            except ValueError:
                continue

        # Only record if position changed
        dx = abs(new_pos["x"] - current["x"])
        dy = abs(new_pos["y"] - current["y"])
        dz = abs(new_pos["z"] - current["z"])
        if dx > 0.001 or dy > 0.001 or dz > 0.001:
            moves.append({
                "x": round(new_pos["x"], 2),
                "y": round(new_pos["y"], 2),
                "z": round(new_pos["z"], 2),
                "f": round(new_pos["f"], 1),
                "rapid": rapid,
                "type": "travel" if rapid else "cut",
            })
            current = new_pos

    return moves

@app.route("/min3d")
def min3d():
    return render_template("min3d.html")

@app.route("/cube")
def cube():
    return render_template("cube.html")

@app.route("/test3d")
def test3d():
    return render_template("test3d.html")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/methods")
def get_methods():
    return jsonify(MANUFACTURING_METHODS)

@app.route("/api/profiles")
def get_profiles():
    return jsonify(MANUFACTURING_METHODS.get("_machine_profiles", {}))

@app.route("/api/methods/<method_id>")
def get_method(method_id):
    if method_id not in MANUFACTURING_METHODS:
        return jsonify({"error": "Method not found"}), 404
    return jsonify(MANUFACTURING_METHODS[method_id])

@app.route("/api/generate-gcode", methods=["POST"])
def generate_gcode():
    data = request.get_json()
    method_id = data.get("method", "fdm")
    params = data.get("params", {})
    wp = data.get("workpiece", {"width": 100, "height": 100, "depth": 10})
    method = MANUFACTURING_METHODS.get(method_id)
    if not method:
        return jsonify({"error": "Unknown method"}), 400

    gcode = _gen_gcode(method_id, method, params, wp)
    toolpath = _parse_toolpath(gcode)

    return jsonify({
        "gcode": gcode,
        "method": method["name"],
        "category": method["category"],
        "toolpath": toolpath,
        "moves_count": len(toolpath),
        "params_used": params,
    })

@app.route("/api/parse-stl", methods=["POST"])
def parse_stl():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files["file"]
    fp = os.path.join("/tmp", "stl_preview_" + uuid.uuid4().hex[:8] + ".stl")
    file.save(fp)
    try:
        tris = _parse_stl_binary(fp)
        # Scale to fit in build volume
        xs = [t[i] for t in tris for i in range(0,9,3)]
        ys = [t[i] for t in tris for i in range(1,9,3)]
        zs = [t[i] for t in tris for i in range(2,9,3)]
        minx, maxx = min(xs), max(xs)
        miny, maxy = min(ys), max(ys)
        minz, minz2 = min(zs), max(zs)
        sw, sh, sd = maxx-minx, maxy-miny, maxz2-minz
        sc = min(150/sw, 150/sh, 40/sd) if sw and sh and sd else 1
        ox, oy, oz = -(minx+maxx)/2, -(miny+maxy)/2, -minz
        sc_tris = []
        for t in tris:
            sc_tris.append([(t[0]+ox)*sc+90,(t[1]+oy)*sc+90,(t[2]+oz)*sc+8])
        return jsonify({"triangles": sc_tris, "count": len(sc_tris), "bbox": [round(sc*sw),round(sc*sh),round(sc*sd)]})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        try: os.unlink(fp)
        except: pass

def _parse_stl_binary(fp):
    tris = []
    with open(fp, "rb") as f:
        f.read(80)
        ntri = struct.unpack("<I", f.read(4))[0]
        for _ in range(min(ntri, 50000)):
            f.read(12)
            for _ in range(3):
                tris.append([round(struct.unpack("<f", f.read(4))[0], 3) for _ in range(3)])
            f.read(2)
    return tris

@app.route("/api/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No filename"}), 400

    ext = Path(file.filename).suffix.lower()
    if ext not in SUPPORTED_EXTENSIONS:
        return jsonify({"error": f"Unsupported: {ext}"}), 400

    fid = uuid.uuid4().hex[:8]
    fp = os.path.join(app.config["UPLOAD_FOLDER"], f"{fid}_{file.filename}")
    file.save(fp)
    sz = os.path.getsize(fp)
    analysis = _analyze(fp, ext)

    return jsonify({
        "file_id": fid, "filename": file.filename,
        "format": SUPPORTED_EXTENSIONS[ext], "extension": ext,
        "size": sz, "size_human": _hsz(sz), "analysis": analysis,
    })

def _analyze(fp, ext):
    a = {}
    try:
        if ext == ".stl":
            with open(fp, "rb") as f:
                hdr = f.read(80).decode("ascii", errors="ignore").strip()
                a["header"] = hdr or "(binary)"
        elif ext in (".gcode", ".nc"):
            with open(fp, "r", errors="ignore") as f:
                lines = f.read().strip().split("\n")
            a["lines"] = len(lines)
            a["g_cmds"] = sum(1 for l in lines if l.strip().upper().startswith("G"))
            a["m_cmds"] = sum(1 for l in lines if l.strip().upper().startswith("M"))
        elif ext == ".dxf":
            with open(fp, "r", errors="ignore") as f:
                c = f.read()
            a["chars"] = len(c)
            a["entities"] = max(1, c.count("ENTITIES") + c.count("AcDbEntity"))
        elif ext == ".svg":
            with open(fp, "r", errors="ignore") as f:
                c = f.read()
            for tag in ["path", "circle", "rect", "line", "polygon"]:
                n = c.count(f"<{tag}")
                if n:
                    a[f"{tag}s"] = n
    except Exception as e:
        a["error"] = str(e)
    return a

def _hsz(b):
    for u in ["B", "KB", "MB", "GB"]:
        if b < 1024:
            return f"{b:.1f} {u}"
        b /= 1024
    return f"{b:.1f} TB"

# ── G-CODE GENERATION ───────────────────────────────────────────────
def _gen_gcode(mid, m, params, wp):
    w, h, d = wp.get("width", 100), wp.get("height", 100), wp.get("depth", 10)
    cat = m["category"]

    lines = [
        f"; {m['name']} | {cat}",
        f"; Workpiece: {w}x{h}x{d}mm",
        "",
    ]
    for k, v in params.items():
        lines.append(f"; {k} = {v}")
    lines.append("")

    if cat == "Additive":
        lines += _additive(mid, params, w, h, d)
    elif cat == "Subtractive":
        lines += _subtractive(mid, params, w, h, d)
    elif cat == "Forming":
        lines += _forming(mid, params, w, h, d)
    elif cat == "Joining":
        lines += _joining(mid, params, w, h, d)
    elif cat == "Casting":
        lines += _casting(mid, params, w, h, d)
    elif cat == "Finishing":
        lines += _finishing(mid, params, w, h, d)
    else:
        lines += _generic(mid, params, w, h, d)

    return "\n".join(lines)

def _additive(mid, p, w, h, d):
    L = []
    L += ["G90", "G21", ""]
    nt = p.get("nozzle_temp", 210)
    bt = p.get("bed_temp", 60)
    sp = p.get("print_speed", 60) or p.get("scan_speed", 1500)
    lh = p.get("layer_height", 0.2)
    nd = p.get("nozzle_diameter", 0.4)
    spm = sp * 60 if "fdm" in mid else sp

    if mid in ("fdm", "fdm_industrial", "peek_printing"):
        L += [f"M104 S{nt}", f"M140 S{bt}", f"M109 S{nt}", f"M190 S{bt}", "G28", "G92 E0", ""]
        L += ["; Prime", "G1 Z5 F300", "G1 X10 Y10 F3000", "G1 Z0.3 F300", f"G1 X{w-10} E{0.02*w:.2f} F{spm}", "G92 E0", ""]
        nl = max(1, int(d / lh))
        inc = d / nl
        for lyr in range(nl):
            z = round(inc * (lyr + 1), 3)
            L += [f"G1 Z{z} F300"]
            if lyr == 0 or lyr == nl - 1:
                for y in range(0, int(h), max(1, int(nd * 2))):
                    L += [f"G1 X5 Y{y:.1f} F{spm}", f"G1 X{w-5} Y{y:.1f} E{0.01*w:.3f} F{spm}"]
            else:
                ip = p.get("infill", 20)
                spc = max(nd * 2, w / max(1, ip / 100 * w / nd))
                if lyr % 2 == 0:
                    for y in range(0, int(h), max(1, int(spc))):
                        L += [f"G1 X5 Y{y:.1f} E0.5 F{spm}", f"G1 X{w-5} Y{y:.1f} E{0.01*w:.3f} F{spm}"]
                else:
                    for x in range(0, int(w), max(1, int(spc))):
                        L += [f"G1 X{x:.1f} Y5 E0.5 F{spm}", f"G1 X{x:.1f} Y{h-5} E{0.01*h:.3f} F{spm}"]
    elif mid in ("sla", "dlp", "cdlp", "two_photon"):
        L += ["G28"]
        nl = max(1, int((d * 1000) / float(p.get("layer_height", 50))))
        exp = p.get("exposure_time", 6)
        for lyr in range(min(nl, 20)):
            z = (lyr + 1) * 0.05
            L += [f"G1 Z{-z:.3f} F100", f"G4 P{int(exp * 1000)}", f"G1 Z5 F200"]
    elif mid in ("sls", "slm", "dmls", "ebm"):
        L += ["G28"]
        nl = max(1, int((d * 1000) / float(p.get("layer_height", 100))))
        for lyr in range(min(nl, 15)):
            z = (lyr + 1) * 0.1
            L += [f"G1 Z{z:.3f} F100"]
            for sy in range(0, int(h), 5):
                L += [f"G1 X5 Y{sy} F{spm}", f"G1 X{w-5} Y{sy} F{spm}"]
    elif mid == "waam":
        tv = p.get("travel_speed", 500)
        for lyr in range(min(int(d / 2), 10)):
            z = (lyr + 1) * 2
            L += [f"G1 Z{z:.1f} F200"]
            for y in range(0, int(h), 10):
                L += [f"G1 X5 Y{y:.1f} F{tv}", f"G1 X{w-5} Y{y:.1f} F{tv}"]
    else:
        L += ["G28"]
        for lyr in range(min(int(d), 10)):
            L += [f"G1 Z{lyr + 1:.1f} F200", f"G1 X0 Y0 F500", f"G1 X{w} Y{h} F500"]

    L += ["", "G1 Z20 F300", "M104 S0", "M140 S0", "M84", "M30"]
    return L

def _subtractive(mid, p, w, h, d):
    L = []
    sr = p.get("spindle_speed", 10000)
    fr = p.get("feed_rate", 800)
    dc = p.get("depth_of_cut", 1) or p.get("depth_per_pass", 1)
    L += ["G90 G21 G17 G40 G49 G80", ""]
    L += ["T1 M6", "G43 H1", f"M3 S{sr}", "G54", "", "G0 Z10", "G0 X0 Y0", ""]

    if mid in ("cnc_mill_3axis", "cnc_mill_5axis", "cnc_router", "micro_machining", "kuka_robotic_milling"):
        np = max(1, int(d / dc))
        pd = d / np
        td = p.get("tool_diameter", 6)
        so = td * p.get("stepover", 40) / 100
        coolant = p.get("coolant", "Flood")
        if coolant == "Flood":
            L += ["M8"]
        elif coolant == "Mist":
            L += ["M7"]
        for pn in range(np):
            z = -pd * (pn + 1)
            L += [f"G0 Z1", f"G1 Z{z:.2f} F{fr * 0.5}"]
            for y in range(5, int(h) - 5, max(1, int(so))):
                L += [f"G1 X5 Y{y:.1f} F{fr}", f"G1 X{w-5} Y{y:.1f} F{fr}"]
            L += [f"G1 X5 Y5 F{fr}", f"G1 X{w-5} Y5 F{fr}", f"G1 X{w-5} Y{h-5} F{fr}", f"G1 X5 Y{h-5} F{fr}", f"G1 X5 Y5 F{fr}"]
        L += ["M9"]
    elif mid == "laser_cutting":
        pas = p.get("passes", 1)
        cs = p.get("cut_speed", 50)
        for pp in range(pas):
            L += [f"M3 S{p.get('laser_power', 150)}"]
            L += [f"G1 X5 Y5 F{cs * 60}", f"G1 X{w-5} Y5 F{cs * 60}", f"G1 X{w-5} Y{h-5} F{cs * 60}", f"G1 X5 Y{h-5} F{cs * 60}", f"G1 X5 Y5 F{cs * 60}"]
            L += ["M5"]
    elif mid == "laser_engraving":
        es = p.get("engrave_speed", 500)
        L += [f"M3 S{int(p.get('laser_power', 40) * 10)}"]
        for y in range(0, int(h), 2):
            L += [f"G1 X5 Y{y} F{es}", f"G1 X{w-5} Y{y} F{es}"]
        L += ["M5"]
    elif mid == "waterjet":
        cs = p.get("cut_speed", 250)
        L += ["M7", "G4 P2"]
        L += [f"G1 X5 Y5 F{cs}", f"G1 X{w-5} Y5 F{cs}", f"G1 X{w-5} Y{h-5} F{cs}", f"G1 X5 Y{h-5} F{cs}", f"G1 X5 Y5 F{cs}"]
        L += ["M9"]
    elif mid == "plasma_cutting":
        cs = p.get("cut_speed", 1500)
        ph = p.get("pierce_height", 3.8)
        ch = p.get("cut_height", 1.5)
        L += [f"G0 Z{ph:.1f}", "M3", "G4 P0.5", f"G1 Z{ch:.1f} F500"]
        L += [f"G1 X5 Y5 F{cs}", f"G1 X{w-5} Y5 F{cs}", f"G1 X{w-5} Y{h-5} F{cs}", f"G1 X5 Y{h-5} F{cs}", f"G1 X5 Y5 F{cs}"]
        L += ["M5", "G0 Z10"]
    elif mid in ("edm_sinker", "edm_wire", "edm_hole_drilling"):
        L += ["M60"]
        if mid == "edm_wire":
            L += ["M62"]
            L += [f"G1 X5 Y5 F2", f"G1 X{w-5} Y5 F2", f"G1 X{w-5} Y{h-5} F2", f"G1 X5 Y{h-5} F2"]
            L += ["M63"]
        else:
            L += [f"G1 Z-{d} F0.5", "G4 P1", "G1 Z10 F5"]
        L += ["M61"]
    elif mid == "drill_press":
        L += ["G81"]
        L += [f"G99 G81 X{w/2:.1f} Y{h/2:.1f} Z-{d:.1f} R2 F100"]
        for xp in [w * 0.2, w * 0.5, w * 0.8]:
            for yp in [h * 0.2, h * 0.5, h * 0.8]:
                L += [f"G81 X{xp:.1f} Y{yp:.1f} Z-{d:.1f} R2 F100"]
        L += ["G80"]
    elif mid == "lathe":
        L += ["G18", "G96 S150"]
        L += [f"G0 X{w+10:.1f} Z2"]
        for zc in range(0, int(h), max(1, int(dc * 10))):
            z = min(zc / 10, h)
            L += [f"G1 X{w-2*dc:.1f} Z-{z:.1f} F200"]
        L += [f"G0 X{w+10:.1f} Z10"]
    elif mid == "grinding":
        L += [f"M3 S{sr}", "M8"]
        dpp = p.get("depth_per_pass", 10) / 1000
        np = max(1, int(d / dpp))
        for pn in range(np):
            z = -dpp * (pn + 1)
            L += [f"G1 Z{z:.4f} F50"]
            for y in range(0, int(h), 2):
                L += [f"G1 X5 Y{y} F{fr}", f"G1 X{w-5} Y{y} F{fr}"]
        L += ["M9"]
    else:
        L += [f"G1 Z-{d} F{fr}", f"G1 X0 Y0 F{fr}", f"G1 X{w} Y0 F{fr}", f"G1 X{w} Y{h} F{fr}", f"G1 X0 Y{h} F{fr}", f"G1 X0 Y0 F{fr}"]

    L += ["", "G0 Z50", "M5", "M9", "G28", "M30"]
    return L

def _forming(mid, p, w, h, d):
    L = ["G90"]
    if mid in ("injection_molding", "die_casting"):
        L += ["G28", "M103 S1", "G4 P2", "M104 S1", f"G4 P{p.get('cooling_time', 25)}", "M105 S1", "M106 S1"]
    elif mid == "heat_press":
        t = p.get("temperature", 190)
        pt = p.get("press_time", 45)
        L += [f"M140 S{t}", f"M190 S{t}", "G1 Z0 F100", f"G4 P{pt * 1000}", "G1 Z50 F100"]
    elif mid == "metal_stamping":
        L += ["G91"]
        for _ in range(5):
            L += ["G1 Z-20 F2000", "G1 Z20 F2000"]
        L += ["G90"]
    elif mid == "sheet_bending":
        a = p.get("bend_angle", 90)
        bd = (w / 2) * math.tan(math.radians(a) / 2)
        L += ["G28", f"G1 X{p.get('backgauge', 50)} F500", f"G1 Z-{bd:.1f} F100", "G4 P0.5", "G1 Z10 F200"]
    elif mid == "forging":
        L += ["G91"]
        for _ in range(8):
            L += ["G1 Z-15 F1000", "G1 Z15 F1000"]
        L += ["G90"]
    elif mid == "spinning":
        L += [f"M3 S{p.get('spindle_speed', 800)}"]
        for a in range(10, 80, 10):
            r = w * (1 - a / 90)
            L += [f"G1 X{r*math.cos(math.radians(a)):.1f} Z{-r*math.sin(math.radians(a)):.1f} F100"]
        L += ["M5"]
    else:
        L += ["G28", f"G1 X0 Y0 Z-{d} F200", "G4 P2", "G1 Z50 F200"]
    L += ["", "G28", "M30"]
    return L

def _joining(mid, p, w, h, d):
    L = ["G90 G21"]
    ts = p.get("travel_speed", 8) or p.get("welding_speed", 50) or 8
    if mid in ("mig_welding", "stick_welding", "tig_welding"):
        L += [f"M3 S{p.get('current', 120) * 10}", "G4 P1"]
        L += [f"G1 X5 Y{h/2:.1f} F{ts * 60}", f"G1 X{w-5} Y{h/2:.1f} F{ts * 60}", "M5"]
    elif mid == "laser_welding":
        L += [f"M3 S{p.get('laser_power', 2000)}", f"G1 X5 Y{h/2:.1f} F{ts * 60}", f"G1 X{w-5} Y{h/2:.1f} F{ts * 60}", "M5"]
    elif mid == "spot_welding":
        for x in [w * 0.25, w * 0.5, w * 0.75]:
            for y in [h * 0.25, h * 0.5, h * 0.75]:
                L += [f"G0 X{x:.1f} Y{y:.1f}", "M3 S100", "G4 P0.15", "M5", "G4 P0.5"]
    elif mid == "friction_stir":
        L += [f"M3 S{p.get('rotation_speed', 800)}", f"G1 Z-{d/2:.1f} F20"]
        L += [f"G1 X5 Y{h/2:.1f} F{ts * 60}", f"G1 X{w-5} Y{h/2:.1f} F{ts * 60}", "G1 Z20 F50", "M5"]
    elif mid == "soldering":
        L += [f"M140 S{p.get('solder_temp', 250)}", f"G1 X5 Y{h/2:.1f} F100", f"G1 X{w-5} Y{h/2:.1f} F100"]
    elif mid == "friction_welding":
        L += [f"M3 S{p.get('rotation_speed', 2000)}", f"G1 Z-{p.get('burnoff', 5)} F50", "G4 P2", "M5", "G4 P1"]
    elif mid == "ultrasonic_welding":
        L += ["M3 S1", "G1 Z-1 F10", f"G4 P{p.get('weld_time', 500) / 1000:.2f}", "M5", "G1 Z20 F50"]
    else:
        L += ["M3 S100", f"G1 X5 Y{h/2} F200", f"G1 X{w-5} Y{h/2} F200", "M5"]
    L += ["", "G0 Z50", "M30"]
    return L

def _casting(mid, p, w, h, d):
    L = ["G90", f"; Pour temp: {p.get('pour_temp', 1450)}°C", "G28"]
    L += ["M103 S1", "G4 P3", "M104 S1"]
    L += [f"G4 P{(p.get('cooling_time', 6) * 3600) / 60:.0f}", "M105 S1", "M106 S1"]
    L += ["G1 Z50 F200", "M30"]
    return L

def _finishing(mid, p, w, h, d):
    L = ["G90"]
    if mid == "anodizing":
        L += ["G28", f"G1 Z-{d+50:.1f} F100", f"G4 P{p.get('duration', 45) * 60}", "G1 Z50 F100", "M7", "G4 P5", "M9"]
    elif mid == "powder_coating":
        L += ["M140 S190", "M190 S190", "M3 S70", f"G1 X{w/2:.1f} Y{h/2:.1f} F200", "G4 P15", "M5", f"G4 P{p.get('cure_time', 20) * 60}"]
    elif mid == "electroplating":
        L += [f"G1 Z-{d+30:.1f} F100", f"G4 P{p.get('plating_time', 30) * 60}", "G1 Z50 F100"]
    elif mid == "sandblasting":
        L += ["M7"]
        for y in range(0, int(h), 10):
            L += [f"G1 X5 Y{y} F1000", f"G1 X{w-5} Y{y} F1000"]
        L += ["M9"]
    elif mid == "vibratory_finishing":
        L += [f"M3 S{p.get('frequency', 30)}", f"G4 P{p.get('duration', 8) * 3600}", "M5"]
    elif mid in ("cvd", "pvd"):
        L += ["G28", "M120 S1", "G4 P120", "M121 S1", f"G4 P{p.get('deposition_time', 30) * 60}", "M121 S0", "M120 S0"]
    elif mid == "shot_peening":
        L += ["M7"]
        for _ in range(3):
            for y in range(0, int(h), 5):
                L += [f"G1 X5 Y{y} F500", f"G1 X{w-5} Y{y} F500"]
        L += ["M9"]
    else:
        L += ["G28", f"G1 Z-{d} F100", "G4 P30", "G1 Z50 F100"]
    L += ["", "G28", "M30"]
    return L

def _generic(mid, p, w, h, d):
    return ["G90 G21", "G28", f"G1 X0 Y0 F500", f"G1 X{w} Y0 F500", f"G1 X{w} Y{h} F500", f"G1 X0 Y{h} F500", f"G1 X0 Y0 F500", "G1 Z50 F200", "G28", "M30"]

if __name__ == "__main__":
    print("🏭 Manufacturing Explorer – http://localhost:8530")
    app.run(host="127.0.0.1", port=8530, debug=True)
