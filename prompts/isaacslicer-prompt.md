# IsaacSlicer

Multi-technology 3D printing slicer — 14 technologies, Bambu Lab MQTT, PyQt6 + OpenGL, macOS .app bundle.

## Stack
- Python 3.14, PyQt6, OpenGL, trimesh, numpy, paho-mqtt
- BambuStudio CLI backend, PrusaSlicer CLI backend
- macOS .app bundle in /Applications

## Features
- 14 technologies: FDM, SLA, DLP, MSLA, SLS, MJF, DMLS, SLM, PolyJet, Binder Jetting, CLIP, EBM, LOM, FGF
- 10 built-in printers, 6 materials, 14 process presets
- Bambu Lab MQTT connectivity (status, control, LAN discovery)
- Sidebar UI with 12 navigation pages + splash screen
- OpenGL 3D model viewer with STL/OBJ/3MF + G-code toolpath preview
- 11 settings panels with 100+ parameters per technology

## Launch
- Double-click ~/Documents/IsaacSlicer.command
- Or: open /Applications/IsaacSlicer.app
- Or: cd ~/Documents/projects/apps/IsaacSlicer && source venv/bin/activate && python3 main.py