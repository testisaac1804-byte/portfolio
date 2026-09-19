#!/usr/bin/env python3
"""Build the Open-Source Machines catalog (single-file HTML + Markdown + JSON).
Run:  python3 build_catalog.py
Outputs land in the same folder as this script (Desktop/open-source-machines/).
"""
import json, os, html

OUT = os.path.dirname(os.path.abspath(__file__))
HKD = 7.8  # USD -> HKD

# usd = (low, high). hkd computed. Use 0/0 for "varies".
P = [
# ---------------------------------------------------------------- 3D PRINTING
dict(name="Hangprinter", cat="3D Printing", origin="Sweden", usd=(300, 600), diff="Hard",
     special="A 3D printer with NO FRAME. The toolhead hangs from your ceiling on cables and anchors to the floor. Prints metres-tall objects in a whole room. Genuinely the most 'wait, what?' machine here.",
     links=[("Site","https://hangprinter.org/"),("Wikipedia","https://en.wikipedia.org/wiki/Hangprinter"),("Overview","https://all3dp.com/open-source-hangprinter-prints-without-frame/")]),
dict(name="Voron 2.4 / Trident", cat="3D Printing", origin="Russia", usd=(300, 1600), diff="Hard",
     special="The gold standard open-source CoreXY. GPLv3, insane mod ecosystem, and Chinese kit makers (LDO, FYSETC, Siboor, Mellow) sell everything. Best documented printer on earth.",
     links=[("GitHub","https://github.com/VoronDesign/Voron-2"),("Wiki","https://voron3d.wiki/"),("CN kit","https://www.fysetc.com/products/voron-2-4-r2-pro-kit"),("中文教程","https://www.bilibili.com/video/BV1AF411J7fU/"),("YouTube","https://www.cnckitchen.com/blog/building-a-voron-24-r2-in-2022-ldo-kit")]),
dict(name="Voron V0.2", cat="3D Printing", origin="Russia", usd=(300, 450), diff="Medium",
     special="The desktop-sized Voron. Cheapest way into the Voron ecosystem, and Chinese kits + 保姆级 Chinese tutorials are everywhere.",
     links=[("GitHub","https://github.com/VoronDesign/Voron-0"),("FYSETC kit","https://www.fysetc.com/"),("中文教程","https://www.bilibili.com/video/BV1vL41177YE/")]),
dict(name="Rook MK1 / Rook 180", cat="3D Printing", origin="US", usd=(250, 350), diff="Easy",
     special="Cheap, mostly-3D-printed CoreXY from Rolohaun. Widely called the best FIRST CoreXY build. Officially kitted by Chinese LDO Motors.",
     links=[("GitHub","https://github.com/rolohaun/Rook"),("Printables","https://www.printables.com/model/387431-rook-mk1-3d-printer"),("LDO kit","https://store.ldomotion.com/collections/3d-printers")]),
dict(name="LayerFused C201", cat="3D Printing", origin="US", usd=(150, 200), diff="Easy",
     special="Under $200 and a full step-by-step YouTube build series by Makers Mashup. The cheapest honest entry into building a printer from scratch.",
     links=[("YouTube playlist","https://www.youtube.com/playlist?list=PLyYZUiBHD1QjaYx7eCEW8zXvsgwEbAykY"),("Writeup","https://www.hackster.io/news/this-open-source-3d-printer-design-will-cost-you-less-than-200-to-build-59b03e33e918")]),
dict(name="HyperCube Evolution", cat="3D Printing", origin="Community", usd=(300, 400), diff="Medium",
     special="Budget CoreXY. Built by a huge number of people, all parts off-the-shelf, fits in a 300mm cube. Lots of build logs.",
     links=[("Thingiverse","https://www.thingiverse.com/thing:2254103"),("Community","https://www.reddit.com/r/hypercubecorexy/")]),
dict(name="Mini Kossel (delta)", cat="3D Printing", origin="Netherlands", usd=(200, 400), diff="Medium",
     special="Delta printer — the head moves on three arms, not a gantry. Weird kinematics, cheap frame, and you learn real robotics maths.",
     links=[("GitHub","https://github.com/jcrocholl/kossel"),("RepRap wiki","https://reprap.org/wiki/Kossel")]),
dict(name="BLV mgn Cube", cat="3D Printing", origin="China", usd=(400, 600), diff="Medium",
     special="Open-source CoreXY on MGN linear rails, designed for cheap sourcing. Kitted by Chinese FYSETC; very popular in the Chinese maker scene.",
     links=[("Site","https://www.blvprojects.com/blv-mgn-cube-3d-printer"),("GitHub","https://github.com/BenBlv/-BLVCube"),("FYSETC kit","https://www.3dprintersonlinestore.com/fysetc-blv-mgn-cube-kit")]),
dict(name="White Knight belt printer", cat="3D Printing", origin="US", usd=(600, 900), diff="Medium",
     special="Belt instead of a bed = INFINITE Z. Print a 1.5 m long part in one go. NAK 3D Designs, fully open.",
     links=[("Design","https://3ddistributed.com/mrrf-2019/white-knight-3d-printer/"),("Discussion","https://www.reddit.com/r/3Dprinting/comments/bf60ny/infinite_z_white_knight_belt_driven_3d_printer_by/")]),
dict(name="Open5x / Rep5x (5-axis)", cat="3D Printing", origin="UK", usd=(250, 400), diff="Hard",
     special="Retrofits a normal printer with two extra rotation axes. Prints curved surfaces and overhangs with NO supports. From Imperial College London research; Rep5x is the newer DIY retrofit.",
     links=[("Open5x GitHub","https://github.com/FreddieHong19/Open5x"),("Rep5x GitHub","https://github.com/dennisklappe/rep5x")]),
dict(name="Positron V3.2", cat="3D Printing", origin="US / China", usd=(350, 450), diff="Medium",
     special="A printer that prints UPSIDE DOWN and folds flat for travel. Wild engineering; kitted by Chinese LDO.",
     links=[("Site","https://positron3d.com/"),("LDO kit","https://kb-3d.com/store/positron/1154-ldo-positron-v32-3d-printer-build-kit-1714355343710.html")]),
dict(name="Micron / Micron+", cat="3D Printing", origin="US", usd=(600, 700), diff="Medium",
     special="A shrunken Voron by the PrintersForAnts community. Desktop footprint, full Voron performance. Kitted by Chinese LDO.",
     links=[("GitHub","https://github.com/PrintersForAnts/Micron/"),("LDO kit","https://west3d.com/products/ldo-micron-3d-printer-kit-micron-plus-180")]),
dict(name="VzBot 330", cat="3D Printing", origin="Australia", usd=(700, 1200), diff="Medium-Hard",
     special="The speed demon. CNC aluminium frame, carbon rods, Klipper. Built to print fast as hell. Kitted by Chinese Mellow.",
     links=[("GitHub","https://github.com/VzBoT3D/VzBoT-Vz330"),("Mellow kit","https://3dmellow.com")]),
dict(name="RatRig V-Core 4.1", cat="3D Printing", origin="Portugal", usd=(700, 1500), diff="Medium",
     special="Very polished, highly configurable open-source kit. RatRig is a real company built entirely on open-source principles.",
     links=[("Site","https://v-core.ratrig.com/"),("Product","https://ratrig.com/products/rat-rig-v-core-4-1")]),
dict(name="Ender 3 to Switchwire", cat="3D Printing", origin="Community", usd=(150, 250), diff="Medium",
     special="Don't build new — convert a cheap Chinese Ender 3 into a Voron Switchwire. Cheapest route to a genuinely good printer.",
     links=[("GitHub","https://github.com/boubounokefalos/Ender_SW"),("Voron mods","https://mods.vorondesign.com/details/e1YOsV5tBlpfZovPJqXVLA")]),
dict(name="Original Prusa i3 MK3S", cat="3D Printing", origin="Czechia", usd=(600, 800), diff="Medium",
     special="Where open-source 3D printing went mainstream. Still one of the best-documented designs ever released.",
     links=[("GitHub","https://github.com/prusa3d/Original-Prusa-i3"),("Open source page","https://www.prusa3d.com/page/open-source-at-prusa-research_236812/")]),
dict(name="Cerambot (clay)", cat="3D Printing", origin="Taiwan", usd=(400, 600), diff="Medium",
     special="Prints in CLAY. Make pots, cups, sculptures, then fire them in a kiln. Compatible with normal slicers (Cura/Slic3r).",
     links=[("Site","https://www.cerambot.com/"),("Extruder files","https://www.thingiverse.com/thing:3196872")]),
dict(name="Cocoa Press 2 (chocolate)", cat="3D Printing", origin="US", usd=(1200, 1600), diff="Medium",
     special="A 3D printer that prints CHOCOLATE. Heated syringe extruder, open-source slicer, actually works.",
     links=[("Product","https://cocoapress.com/products/cocoa-press-2-3d-chocolate-printer-diy-kit"),("Hackaday","https://hackaday.com/2023/05/01/cocoa-press-chocolate-3d-printer-offered-as-diy-kit/")]),
dict(name="x-scara", cat="3D Printing", origin="Community", usd=(150, 400), diff="Hard",
     special="SCARA arm doubling as a 3D printer and CNC. Articulated-arm kinematics — you write your own inverse kinematics. Deep rabbit hole.",
     links=[("GitHub","https://github.com/madl3x/x-scara")]),
dict(name="SLS4All / OpenSLS", cat="3D Printing", origin="Czechia / US", usd=(3000, 5000), diff="Very Hard",
     special="Selective Laser Sintering — nylon POWDER printing. Zero supports, functional parts, actual industrial process at home. The hardest printer genre by far.",
     links=[("SLS4All","https://hackaday.io/project/184506-sls4all-affordable-sls-3d-printer"),("OpenSLS","https://github.com/MillerLabFTW/OpenSLS"),("RepRap wiki","https://reprap.org/wiki/OpenSLS")]),
dict(name="M3-CRETE (concrete)", cat="3D Printing", origin="US", usd=(2000, 8000), diff="Very Hard",
     special="Prints in CONCRETE at metre scale, from standard NEMA motors and off-the-shelf parts. Open-source construction printing.",
     links=[("GitHub","https://github.com/sunnyday-technologies/M3-CRETE"),("Writeup","https://all3dp.com/4/new-diy-concrete-3d-printer-from-off-the-shelf-parts/")]),
dict(name="reAM250 (metal)", cat="3D Printing", origin="US / China", usd=(5000, 20000), diff="Very Hard",
     special="Open-source METAL 3D printer. Chinese motor maker LDO is a prominent backer of the DIY 3D printing ecosystem behind it.",
     links=[("Article","https://3dprintingindustry.com/news/build-your-own-metal-3d-printer-with-the-new-open-source-ream250-project-234965/")]),
dict(name="MakerGear Micro", cat="3D Printing", origin="US", usd=(150, 250), diff="Easy",
     special="An open-source printer that is ITSELF 3D-printable. Designed so a kid can build it. Nice gentle intro.",
     links=[("GitHub","https://github.com/MakerGear/MakerGear_Micro")]),
dict(name="OLSK Large 3D Printer", cat="3D Printing", origin="Netherlands", usd=(800, 1500), diff="Hard",
     special="Open Lab Starter Kit — big-format printer with an interactive 3D assembly manual. Every part documented for replication.",
     links=[("GitHub","https://github.com/Open-Lab-Starter-Kit/OLSK-Large-3D-Printer")]),

# ----------------------------------------------------------------------- CNC
dict(name="MPCNC (Mostly Printed CNC)", cat="CNC", origin="Canada", usd=(300, 500), diff="Easy-Medium",
     special="Conduit pipe + 3D-printed parts. The classic first CNC. Ryan Zellars has documented every single step and there are thousands of builds online.",
     links=[("Docs","https://docs.v1e.com/"),("Site","https://www.v1e.com/"),("YouTube","https://www.youtube.com/channel/UCXf0vDExLLX1lb2cpyiOFbg")]),
dict(name="LowRider v4", cat="CNC", origin="Canada", usd=(400, 700), diff="Medium",
     special="V1E's big one — cuts FULL 4x8 SHEETS of plywood. Runs on wheels along your table. Can also carry a diode laser module (like your DAJA).",
     links=[("Docs","https://docs.v1e.com/lowrider/"),("Build video","https://www.youtube.com/watch?v=WMyjop0B4wU"),("Printables","https://www.printables.com/model/1034840-lowrider-4-cnc")]),
dict(name="Root 3 / Root 3 Lite", cat="CNC", origin="UK", usd=(300, 500), diff="Medium",
     special="Fully 3D-printed CNC with a 5-part video build series. Lighter and cheaper than MPCNC, nicer looking too.",
     links=[("Site","https://www.rootcnc.com/"),("GitHub","https://github.com/RootCNC/Root-3-Lite-CNC"),("YouTube","https://www.youtube.com/playlist?list=PL5hghy18PulWPo6cQd6N7WnEv9tpS6zwJ")]),
dict(name="PrintNC", cat="CNC", origin="Community", usd=(600, 900), diff="Medium-Hard",
     special="STEEL frame + linear rails + ballscrews for under $700. The cheap DIY machine that actually mills aluminium properly. 3D-printed parts, steel motion.",
     links=[("GitHub","https://github.com/threedesigns/printNC"),("Wiki","https://wiki.printnc.info/en/home")]),
dict(name="Millennium Milo v1.5 / 2.0", cat="CNC", origin="Canada / China", usd=(700, 1500), diff="Medium-Hard",
     special="Desktop CNC MILL (not a router) — cuts aluminium, steel and PCBs. Open source, kitted by Chinese LDO with a proper electronics box.",
     links=[("GitHub","https://github.com/MillenniumMachines/Milo-v1.5"),("LDO kit","https://west3d.com/products/milo-v2-cnc-kit-by-millennium-machines-and-ldo-systems")]),
dict(name="IndyMill", cat="CNC", origin="Poland", usd=(500, 800), diff="Medium",
     special="Metal-frame DIY router by Nikodem Bartnik, designed for simplicity. Chinese GTROB community produced full 中文 tutorial versions (51k views on bilibili).",
     links=[("GitHub","https://github.com/NikodemBartnik/IndyMill"),("Site","https://indystry.cc/indymill/"),("YouTube","https://www.youtube.com/playlist?list=PLktKi_COpyPRd8JZfjhskWSvsFN3Cb1v8"),("中文版","https://www.bilibili.com/video/BV1RA411v75T/")]),
dict(name="OpenBuilds WorkBee / LEAD", cat="CNC", origin="US", usd=(700, 1200), diff="Medium",
     special="The most popular kit-based open CNC ever. Endless build videos, huge forum, all files downloadable.",
     links=[("Build","https://builds.openbuilds.com/builds/workbee-cnc-machine.5626/"),("OpenBuilds","https://builds.openbuilds.com/")]),
dict(name="Shapeoko 2", cat="CNC", origin="US", usd=(400, 650), diff="Easy-Medium",
     special="The classic fully-open-source desktop CNC. Buildable over a weekend, GRBL-driven, enormous tutorial base.",
     links=[("GitHub","https://github.com/shapeoko/Shapeoko_2"),("Wiki","https://wiki.shapeoko.com/")]),
dict(name="3018 + GRBL", cat="CNC", origin="China", usd=(150, 300), diff="Easy",
     special="The cheap Chinese gateway drug. Buy it, then flash open-source GRBL and upgrade it. Cheapest possible way to learn CNC + G-code.",
     links=[("GRBL firmware","https://github.com/gnea/grbl"),("Setup guide","https://howtomechatronics.com/tutorials/how-to-setup-grbl-control-cnc-machine-with-arduino/")]),
dict(name="Arduino CNC Shield 3-axis", cat="CNC", origin="China", usd=(30, 80), diff="Easy",
     special="An Arduino Uno + CNC shield + A4988 drivers = a working CNC controller for pocket money. The absolute cheapest way in. Chinese kits are everywhere.",
     links=[("中文教程","https://www.bilibili.com/video/BV1P4411F71c/"),("OpenBuilds","https://builds.openbuilds.com/builds/simple-cnc-router-nema17-v-slot-2040-arduino-grbl.8485/")]),
dict(name="太极创客 DVD-drive mini laser/CNC", cat="CNC", origin="China", usd=(15, 30), diff="Easy",
     special="Build a working mini laser engraver out of TWO OLD DVD DRIVES for about ¥100. Chinese maker channel TaiChiMaker open-sources the whole thing with full GRBL tutorials. The cheapest machine on this list, period.",
     links=[("Project page","http://www.taichi-maker.com/arduino-cnc-laser/"),("bilibili","https://space.bilibili.com/103589285"),("GRBL host software","https://www.bilibili.com/video/BV1h441157Wa/")]),
dict(name="4-axis CNC hot wire foam cutter", cat="CNC", origin="Community", usd=(200, 500), diff="Medium",
     special="Cuts TAPERED AIRFOIL WING CORES from foam. This is literally the aerodynamics machine for F1 in Schools / RC planes. Reuses RAMPS + Arduino + 3D-printer hardware. rcKeith has a full video series.",
     links=[("GitHub","https://github.com/rahulsarchive/4AxisFoamCutter"),("Foldable version","https://github.com/MichaelRechtin/CNC-Hotwire-Foam-Cutter"),("OpenBuilds","https://builds.openbuilds.com/builds/hot-wire-4-axis-cnc-foam-cutter.2361/")]),
dict(name="OpenEDM (spark erosion)", cat="CNC", origin="Community", usd=(500, 1000), diff="Hard",
     special="Electrical Discharge Machining — burns through HARDENED STEEL with electric sparks and ZERO cutting force. Cuts shapes no drill or mill can touch.",
     links=[("GitHub","https://github.com/OpenEDM"),("Hackaday","https://hackaday.com/2021/04/30/homemade-edm-machine-moves-from-prototype-to-production/")]),
dict(name="DIWire Bender", cat="CNC", origin="US", usd=(400, 700), diff="Medium",
     special="Feeds wire off a spool and bends it into arbitrary 2D/3D shapes from a digital file. A completely different kind of CNC.",
     links=[("GitHub","https://github.com/diwire/DIWire-Bender"),("Make: article","https://makezine.com/article/digital-fabrication/machining/make-your-own-cnc-wire-bender/")]),
dict(name="CNC plasma table", cat="CNC", origin="Community", usd=(1000, 3000), diff="Hard",
     special="Cuts STEEL PLATE with a plasma torch on a gantry. The big-boy version of a CNC router.",
     links=[("GitHub","https://github.com/ccholas/DIY-CNC-Plasma-Table"),("OpenBuilds","https://builds.openbuilds.com/?id=305")]),
dict(name="Lasersaur", cat="CNC", origin="Switzerland / US", usd=(3000, 6000), diff="Hard",
     special="A fully open-source 100W CO2 laser cutter with a big bed. Real optics, real power, fully documented. The reference open laser.",
     links=[("GitHub","https://github.com/nortd/lasersaur"),("Wiki","https://github.com/nortd/lasersaur/wiki")]),
dict(name="Multimachine / Open Source Lathe", cat="CNC", origin="US", usd=(0, 0), diff="Hard",
     special="Open Source Ecology's lathe + mill + drill press built largely from scrap and cast concrete. Pay in labour, not money.",
     links=[("OSE wiki","https://wiki.opensourceecology.org/wiki/Multimachine_%26_Flex_Fab"),("Open Source Lathe","https://wiki.opensourceecology.org/wiki/Open_Source_Lathe")]),
dict(name="Open-source vacuum former", cat="CNC", origin="Community", usd=(100, 300), diff="Easy",
     special="Heat a plastic sheet, suck it over a mould. Make RC bodies, F1 shells, packaging. Simple, cheap, very useful.",
     links=[("OSE wiki","https://wiki.opensourceecology.org/wiki/Open_Source_Vacuum_Forming_Machine"),("OpenBuilds build","https://builds.openbuilds.com/builds/vacuum-forming-machine.5071/")]),
dict(name="3D printed drill press", cat="CNC", origin="Japan", usd=(40, 60), diff="Easy",
     special="3D-print a drill press that actually drills METAL, for about $45. Absurd value for money.",
     links=[("Tom's Hardware","https://www.tomshardware.com/3d-printing/3d-printed-drill-press-can-drill-through-metal-costs-around-usd45-to-create-your-own-drill-press")]),
dict(name="Open-source 3D printed lathe", cat="CNC", origin="Community", usd=(100, 400), diff="Hard",
     special="A printed lathe — normally you'd say impossible, but this technique opens the door to rose-engine and gear-cutting lathes.",
     links=[("Hackaday","https://hackaday.com/2024/10/23/a-3d-printed-open-source-lathe/")]),
dict(name="DIY 2x72 belt grinder", cat="CNC", origin="Community", usd=(300, 600), diff="Medium",
     special="The knife-maker's workhorse. Free PDF plans and CAD exist; huge YouTube build community. Grinds metal fast and flat.",
     links=[("Free plans","https://mazaydiy.com/2x72-belt-grinder/"),("BladeForums plans","https://www.bladeforums.com/threads/free-2-x-72-belt-grinder-plans-2020-version.1705344/")]),
dict(name="Mekanika Pro MK2 / FAB", cat="CNC", origin="Belgium", usd=(1000, 4000), diff="Hard",
     special="Open-source PANEL CNC — cuts full 1300x2700mm sheets for furniture and cabinets. Ball screws, prismatic rails, full CAD released.",
     links=[("Site","https://www.mekanika.io/en"),("GitHub","https://github.com/mekanika-dev/pro"),("Docs","https://support.mekanika.io/open-source/cnc-pro")]),
dict(name="DIYLILCNC", cat="CNC", origin="US", usd=(300, 500), diff="Easy",
     special="A free, open set of plans for a 3-axis CNC mill buildable by one person with basic shop skills. Old but still a great starting point.",
     links=[("Plans","https://www.craftsmanspace.com/free-projects/cnc-machine-diy-plans-and-build-instructions.html"),("Guide","https://github.com/maxvfischer/DIY-CNC-machine")]),

# -------------------------------------------------------------------- ROBOTS
dict(name="LumenPnP (pick & place)", cat="Robots", origin="US", usd=(500, 3000), diff="Hard",
     special="An open-source robot that PLACES ELECTRONIC COMPONENTS onto circuit boards — a real PCB assembly line at home. Feeders, vision alignment, the lot. Stephen Hawes documents every revision on YouTube.",
     links=[("GitHub","https://github.com/opulo-inc/lumenpnp"),("Creator site","https://stephenhawes.com/press/"),("Overview video","https://www.youtube.com/watch?v=i0hn9Ue1qgc"),("Wikipedia","https://en.wikipedia.org/wiki/LumenPnP")]),
dict(name="Annin Robotics AR4 / AR5", cat="Robots", origin="US", usd=(2000, 3000), diff="Hard",
     special="A 6-axis INDUSTRIAL ROBOT ARM you can build yourself, sitting on a desk. Machined or 3D-printed parts, Python-programmable. Chris Annin's build series is legendary.",
     links=[("Site","https://anninrobotics.com/"),("Video","https://www.youtube.com/watch?v=EwWnPqnSizQ")]),
dict(name="FarmBot", cat="Robots", origin="US", usd=(1000, 3000), diff="Medium-Hard",
     special="An open-source CNC FARMING robot. It plants seeds, waters, and weeds a garden bed by coordinates, driven from a web app.",
     links=[("Site","https://farm.bot/"),("Wikipedia","https://en.wikipedia.org/wiki/FarmBot")]),
dict(name="EEZYbotARM MK2", cat="Robots", origin="Italy", usd=(50, 100), diff="Easy",
     special="A 3D-printed 4-axis robot arm for about $60. Cheapest real robot arm on this list and a perfect first robotics build.",
     links=[("Thingiverse","https://www.thingiverse.com/thing:1015238"),("Instructables","https://www.instructables.com/EEZYbotARM-Mk2-3D-Printed-Robot/")]),
dict(name="Thor robot arm", cat="Robots", origin="Spain", usd=(250, 400), diff="Medium",
     special="Open-source 6-DOF arm, fully 3D printable, same joint configuration as real industrial manipulators. AngelLM's design.",
     links=[("Site","http://thor.angel-lm.com/"),("GitHub","https://github.com/AngelLM/Thor")]),
dict(name="Dummy-Robot (稚晖君)", cat="Robots", origin="China", usd=(250, 400), diff="Medium",
     special="Chinese maker 稚晖君's viral super-mini 6-axis arm. Fully open source, designed in Fusion 360, enormous bilibili following.",
     links=[("GitHub","https://github.com/peng-zhihui/Dummy-Robot"),("CN roundup","https://beets3d.cn/robot-arm-open-source-can-3dprint.html")]),
dict(name="MeArm / SmallRobotArm / Adeept", cat="Robots", origin="China / UK", usd=(50, 150), diff="Easy",
     special="Servo arms you print and bolt together in an evening. Adeept's Arduino arms are fully open and very cheap on AliExpress.",
     links=[("SmallRobotArm","https://github.com/SkyentificGit/SmallRobotArm"),("CN roundup","https://www.ncnynl.com/category/open-arm/")]),
dict(name="OpenAstroTracker", cat="Robots", origin="Germany", usd=(150, 300), diff="Medium",
     special="A 3D-printed GoTo star tracker for astrophotography. Tracks the sky so you can take long-exposure photos of galaxies with a normal camera.",
     links=[("GitHub","https://github.com/OpenAstroTech/OpenAstroTracker"),("Wiki","https://wiki.openastrotech.com/OpenAstroTracker")]),
dict(name="PiKon telescope", cat="Robots", origin="UK", usd=(100, 200), diff="Easy",
     special="A 3D-printed telescope using a Raspberry Pi camera as the eyepiece. Cheap, open, and you can image the planets.",
     links=[("Make: article","https://makezine.com/projects/gaze-across-the-solar-system-with-a-3d-printed-raspberry-pi-telescope/"),("Hackster","https://www.hackster.io/news/pikon-a-3d-printed-raspberry-pi-powered-telescope-608d1abfc9f1")]),
dict(name="OpenFlexure microscope", cat="Robots", origin="UK", usd=(200, 400), diff="Medium",
     special="A LAB-GRADE 3D-printed microscope with a sub-micron positioning stage. Used in real research labs and clinics in developing countries.",
     links=[("Site","https://openflexure.org/"),("Projects","https://openflexure.org/projects/")]),
dict(name="BrailleRAP braille embosser", cat="Robots", origin="France", usd=(250, 400), diff="Medium",
     special="Open-source BRAILLE EMBOSSER built on RepRap parts. Commercial ones cost $2500; this is a tenth of that and it makes real accessible documents.",
     links=[("Site","https://www.braillerap.org/en/"),("GitHub","https://github.com/braillerap/BrailleRap")]),
dict(name="e-NABLE prosthetic hand", cat="Robots", origin="Global", usd=(30, 80), diff="Easy",
     special="A global volunteer network giving away 3D-printable prosthetic hands. Print one for ~$50 and change someone's life. Great CAS/service project.",
     links=[("Models","https://3d.nih.gov/collections/prosthetics"),("Community","https://shop3duniverse.com/blogs/3d-printed-prosthetics-and-assistive-technology/10-years-of-free-3d-printed-prosthetics-with-the-e-nable-community")]),
dict(name="OpenPCR thermal cycler", cat="Robots", origin="US", usd=(400, 600), diff="Medium",
     special="A $500 open-source PCR machine — the DNA-copying machine labs use. Real molecular biology at home.",
     links=[("Site","https://openpcr.org/"),("Hackaday","https://hackaday.com/2020/01/26/put-the-power-of-pcr-in-your-pocket-with-this-open-source-thermal-cycler/")]),
dict(name="OpenFuge centrifuge", cat="Robots", origin="US", usd=(150, 250), diff="Easy",
     special="Open-source lab centrifuge for ~$200 from off-the-shelf parts. Spins samples at thousands of RPM.",
     links=[("Instructables","https://www.instructables.com/OpenFuge/"),("Writeup","https://www.thelabworldgroup.com/blog/build-your-own-centrifuge-20000-diybio-project-called-openfuge/")]),
dict(name="Open Syringe Pump", cat="Robots", origin="US", usd=(75, 400), diff="Easy",
     special="3D-printed precision liquid pump. Cheaper and more flexible than $1000 commercial units. Used for bioprinting, food engineering and microfluidics.",
     links=[("GitHub","https://github.com/manimino/OpenSyringePump"),("Appropedia","https://www.appropedia.org/Open-source_syringe_pump")]),
dict(name="OpenBCI EEG", cat="Robots", origin="US / China", usd=(200, 400), diff="Medium",
     special="Open-source brain-wave (EEG) hardware. Read your own brain signals and control things with them. AliExpress sells compatible 8/16-channel boards.",
     links=[("AliExpress module","https://www.aliexpress.com/item/4000244594585.html"),("Academic BCI","https://faculty.sites.uci.edu/ucibci/2017/03/29/portable-low-cost-and-open-source-brain-computer-interface-bci-arduino-based-system/")]),

# --------------------------------------------------------- MATERIAL / RECYCLE
dict(name="Polyformer (bottles to filament)", cat="Material", origin="US", usd=(80, 150), diff="Easy",
     special="A 3D-PRINTED machine that turns PET water bottles into 3D printer filament. Print it on your Bambu, feed it drink bottles, get free filament. Peak 'you built WHAT?' project.",
     links=[("Printables","https://www.printables.com/model/296063-polyformer"),("Writeup","https://3dprintingindustry.com/news/new-open-source-3d-printable-polyformer-recycles-plastic-bottles-into-filament-209877/")]),
dict(name="Precious Plastic", cat="Material", origin="Netherlands", usd=(300, 2000), diff="Medium",
     special="A full open-source recycling WORKSHOP: shredder, injection moulder, extruder and sheet press. Dave Hakkens' project spawned businesses worldwide.",
     links=[("Site","https://www.preciousplastic.com/"),("Machine plans","https://bazar.preciousplastic.com/machines/")]),
dict(name="Buster Beagle 3D injection moulder", cat="Material", origin="US", usd=(500, 800), diff="Medium",
     special="A desktop INJECTION MOULDING machine. Make real production plastic parts in aluminium moulds, from recycled pellets.",
     links=[("Site","https://www.busterbeagle3d.com/"),("Thingiverse MKII","https://www.thingiverse.com/thing:4799033")]),
dict(name="ExtrudeX / Recyclebot", cat="Material", origin="US", usd=(150, 300), diff="Easy",
     special="Grind up failed prints and purge lines, melt them, and get fresh usable filament back out. Closes the loop on your own waste.",
     links=[("ExtrudeX","https://creative3dp.com/products/extrudex-diy-filament-recycling-machine"),("Recyclebot paper","https://www.sciencedirect.com/science/article/pii/S2468067218300208")]),
dict(name="OpenShredder", cat="Material", origin="US", usd=(200, 400), diff="Medium",
     special="A general-purpose 3D-PRINTABLE plastic shredder. The front end for any recycling setup.",
     links=[("GitHub","https://github.com/specollective/Open-Shredder")]),
dict(name="Felfil filament maker", cat="Material", origin="Italy", usd=(400, 800), diff="Medium",
     special="Desktop filament extruder. Make your own filament from pellets in any colour, on demand.",
     links=[("Site","https://felfil.com/")]),

# ---------------------------------------------------------- ART / PLOT / TEXTILE
dict(name="Makelangelo polargraph", cat="Art", origin="Canada", usd=(100, 200), diff="Easy",
     special="A pen plotter that HANGS ON YOUR WALL on two strings and draws giant murals. Ridiculously cheap, and the software is open source.",
     links=[("Software","https://github.com/MarginallyClever/Makelangelo-Software"),("Plotter list","https://github.com/beardicus/awesome-plotters")]),
dict(name="EggBot / Sphere-O-Bot", cat="Art", origin="US", usd=(100, 250), diff="Easy",
     special="A CNC art robot that draws on EGGS, ping-pong balls, baubles and anything spherical. Open source hardware and software.",
     links=[("Site","https://egg-bot.com/"),("Sphere-O-Bot","https://www.thingiverse.com/thing:1683764")]),
dict(name="大鱼写字机 DayuWriter", cat="Art", origin="China", usd=(50, 100), diff="Easy",
     special="Chinese open-source WRITING/DRAWING robot — GRBL pen plotter, AxiDraw-style, ~¥300-500, 810k views on bilibili with a full tutorial and BOM spreadsheet. Massive in the Chinese maker scene.",
     links=[("CN roundup + BOM","http://dev.guyuehome.com/detail?id=1825482823486504962"),("Zhihu writeup","https://zhuanlan.zhihu.com/p/394133174"),("midbot variant","https://www.ikuju.com/archives/13911")]),
dict(name="AYAB knitting machine hack", cat="Art", origin="Germany", usd=(150, 300), diff="Medium",
     special="Hack a 1980s Brother knitting machine with an Arduino to knit images from your computer. 'All Yarns Are Beautiful' — open hardware + software.",
     links=[("Site","https://www.ayab-knitting.com/"),("Shop","https://shop.evilmadscientist.com/productsmenu/835"),("Hackaday.io","https://hackaday.io/project/1611-ayab-all-yarns-are-beautiful")]),

# ------------------------------------------------------------- FARM / ENERGY / BIG
dict(name="OSE Global Village Construction Set", cat="Big", origin="US", usd=(0, 0), diff="Hard",
     special="50 INDUSTRIAL MACHINES, all open source: brick press, tractor, sawmill, wind turbine, induction furnace, bakery oven. The single deepest rabbit hole on this list.",
     links=[("Wiki","https://wiki.opensourceecology.org/wiki/Global_Village_Construction_Set"),("Wikipedia","https://en.wikipedia.org/wiki/Open_Source_Ecology"),("MIT Tech Review","https://www.technologyreview.com/2025/10/16/1125146/civilization-start-kit-open-source-essential-machines/")]),
dict(name="CEB Press 'The Liberator'", cat="Big", origin="US", usd=(2000, 4000), diff="Hard",
     special="Presses local DIRT into building bricks at 10 bricks per minute, for 5-40 cents a block. You could literally build a house with it.",
     links=[("Project","https://www.opensourceecology.org/portfolio/ceb-press/"),("Wiki","https://wiki.opensourceecology.org/wiki/CEB_Press")]),
dict(name="Piggott wind turbine", cat="Big", origin="Scotland", usd=(500, 2000), diff="Medium",
     special="Hugh Piggott's open plans for a homebuilt wind turbine — carve the blades, cast the alternator, make your own electricity. Proven in the field for decades.",
     links=[("Plans","https://pureselfmade.com/wind-turbine-diy-book/"),("Background","https://windempowerment.org/research-and-devlopment/small-wind-systems/the-piggott-turbine/")]),
dict(name="Open Source Beehives", cat="Big", origin="US / Spain", usd=(150, 300), diff="Easy",
     special="Sensor-equipped beehives with open data — monitor temperature, humidity and sound inside a hive to track colony health.",
     links=[("Sensor kit","https://github.com/piettetech/OSBH"),("Project","https://iaac.net/projects/open-source-beehives-project/")]),
dict(name="Hydruino hydroponics", cat="Big", origin="US", usd=(100, 300), diff="Easy",
     special="Open-source Arduino controller for a hydroponic/aquaponic grow system. Fully configurable, no cloud account needed.",
     links=[("GitHub","https://github.com/NachtRaveVL/Simple-Hydroponics-Arduino"),("OpenHydroponics","https://github.com/evandavey/OpenHydroponics")]),
]

CATS = ["3D Printing", "CNC", "Robots", "Material", "Art", "Big"]
CATCOLOR = {"3D Printing": "#0b6bcb", "CNC": "#b3541e", "Robots": "#6a3d9a",
            "Material": "#1c7a4a", "Art": "#a8117a", "Big": "#6b6b1f"}
DIFFCOLOR = {"Easy": "#1c7a4a", "Easy-Medium": "#3f7a1c", "Medium": "#b07a00",
             "Medium-Hard": "#b3541e", "Hard": "#b02a1e", "Very Hard": "#7a0f0f"}

def hkd(usd):
    if usd == (0, 0):
        return "varies"
    lo, hi = usd
    if lo == hi:
        return f"HK${round(lo*HKD):,}"
    return f"HK${round(lo*HKD):,}–{round(hi*HKD):,}"

def usdstr(usd):
    if usd == (0, 0):
        return "varies"
    lo, hi = usd
    if lo == hi:
        return f"${lo:,}"
    return f"${lo:,}–{hi:,}"

# ---------- JSON payload for the HTML ----------
items = []
for p in P:
    items.append({
        "name": p["name"], "cat": p["cat"], "origin": p["origin"],
        "usd": p["usd"][0] if p["usd"][0] == p["usd"][1] else p["usd"][0],
        "usdhi": p["usd"][1], "varies": p["usd"] == (0, 0),
        "usdTxt": usdstr(p["usd"]), "hkdTxt": hkd(p["usd"]),
        "diff": p["diff"], "special": p["special"],
        "links": p["links"],
    })

DATA = json.dumps(items, ensure_ascii=False)
CATS_J = json.dumps(CATS)
CC_J = json.dumps(CATCOLOR)
DC_J = json.dumps(DIFFCOLOR)

HTML = """<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Open-Source Machines Catalog</title>
<style>
:root{--ink:#1a1a1a;--mut:#666;--line:#e2e2e2;--bg:#faf9f7;--card:#fff;--accent:#0b6bcb}
*{box-sizing:border-box}
body{margin:0;font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
     color:var(--ink);background:var(--bg)}
header{background:#fff;border-bottom:1px solid var(--line);padding:22px 26px 16px;position:sticky;top:0;z-index:20;
       box-shadow:0 1px 6px rgba(0,0,0,.04)}
h1{margin:0 0 4px;font-size:23px;letter-spacing:-.3px}
.sub{color:var(--mut);font-size:13px;margin-bottom:14px}
.controls{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
input[type=search]{flex:1 1 240px;min-width:180px;padding:9px 12px;border:1px solid var(--line);
  border-radius:8px;font-size:14px;background:#fff;color:var(--ink)}
input[type=search]:focus{outline:2px solid #cfe3fb;border-color:var(--accent)}
select{padding:9px 10px;border:1px solid var(--line);border-radius:8px;background:#fff;font-size:13px;color:var(--ink)}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.chip{border:1px solid var(--line);background:#fff;border-radius:999px;padding:5px 12px;font-size:12.5px;
      cursor:pointer;color:var(--mut);user-select:none;transition:.12s}
.chip:hover{border-color:#bbb}
.chip.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.toggle{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--mut);cursor:pointer;user-select:none;
        border:1px solid var(--line);border-radius:8px;padding:8px 11px;background:#fff}
.toggle.on{background:#fff3d6;border-color:#e8c56a;color:#7a5a00}
.count{font-size:12.5px;color:var(--mut);margin-top:11px}
main{padding:20px 26px 60px;max-width:1180px;margin:0 auto}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:15px 16px 13px;
      display:flex;flex-direction:column;gap:8px}
.card:hover{box-shadow:0 3px 14px rgba(0,0,0,.06)}
.top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.nm{font-weight:650;font-size:15.5px;line-height:1.3}
.tag{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#fff;
     padding:3px 8px;border-radius:5px;white-space:nowrap}
.meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:12px;color:var(--mut)}
.price{font-weight:700;color:var(--ink);font-size:13.5px}
.pill{font-size:11px;padding:2px 7px;border-radius:4px;background:#f0efec;color:#555}
.sp{font-size:13.4px;color:#333;margin:0}
.links{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:4px}
.links a{font-size:12px;text-decoration:none;color:var(--accent);border:1px solid #d5e4f7;
         background:#f4f8fd;padding:3px 9px;border-radius:6px}
.links a:hover{background:#e6f0fb}
.flag{font-size:13px;color:var(--mut)}
.none{color:var(--mut);padding:40px;text-align:center;grid-column:1/-1}
footer{max-width:1180px;margin:0 auto;padding:0 26px 50px;color:var(--mut);font-size:12.5px}
code{background:#f0efec;padding:1px 5px;border-radius:4px;font-size:12px}
</style></head><body>
<header>
  <h1>Open-Source Machines Catalog</h1>
  <div class="sub">__N__ buildable open-source machines &mdash; 3D printers, CNCs, robots, lab gear, recyclers and industrial kit. Prices are rough USD converted at HK$7.8; Chinese sourcing (AliExpress / Pinduoduo / Taobao) is usually 30&ndash;50% cheaper.</div>
  <div class="controls">
    <input type="search" id="q" placeholder="Search: foam cutter, robot arm, cheap, china, laser&hellip;">
    <select id="sort">
      <option value="cheap">Sort: cheapest first</option>
      <option value="exp">Sort: most expensive first</option>
      <option value="name">Sort: A &rarr; Z</option>
      <option value="cat">Sort: by category</option>
    </select>
    <div class="toggle" id="budget">Under HK$2,000 only</div>
  </div>
  <div class="chips" id="chips"></div>
  <div class="count" id="count"></div>
</header>
<main><div class="grid" id="grid"></div></main>
<footer>
  <p><strong>How to read this:</strong> prices assume Western kit sellers. Sourcing the same BOM from AliExpress / Pinduoduo / Taobao typically drops 30&ndash;50%. Add ~10&ndash;15% shipping to HK. Items marked <code>varies</code> are priced by labour, not parts (OSE machines, scrap builds).</p>
  <p>Built for Isaac &middot; single file, no internet needed.</p>
</footer>
<script>
const DATA=__DATA__, CATS=__CATS__, CC=__CC__, DC=__DC__;
let activeCat="All", budgetOnly=false, sortMode="cheap";
const $=s=>document.querySelector(s);
const chips=$("#chips");
["All",...CATS].forEach(c=>{
  const b=document.createElement("div");
  b.className="chip"+(c==="All"?" on":""); b.textContent=c; b.dataset.cat=c;
  b.onclick=()=>{activeCat=c;[...chips.children].forEach(x=>x.classList.toggle("on",x.dataset.cat===c));render();};
  chips.appendChild(b);
});
$("#q").oninput=render;
$("#sort").onchange=e=>{sortMode=e.target.value;render();};
$("#budget").onclick=()=>{budgetOnly=!budgetOnly;$("#budget").classList.toggle("on",budgetOnly);render();};
function esc(s){return s.replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));}
function render(){
  const q=$("#q").value.trim().toLowerCase();
  let rows=DATA.filter(d=>{
    if(activeCat!=="All"&&d.cat!==activeCat)return false;
    if(budgetOnly&&(d.varies||d.usdhi*7.8>2000))return false;
    if(!q)return true;
    const hay=(d.name+" "+d.cat+" "+d.origin+" "+d.diff+" "+d.special+" "+d.links.map(l=>l[0]).join(" ")).toLowerCase();
    return q.split(/\\s+/).every(w=>hay.includes(w));
  });
  const key=d=>d.varies?1e9:(d.usdhi||d.usd);
  if(sortMode==="cheap")rows.sort((a,b)=>key(a)-key(b));
  else if(sortMode==="exp")rows.sort((a,b)=>key(b)-key(a));
  else if(sortMode==="name")rows.sort((a,b)=>a.name.localeCompare(b.name));
  else rows.sort((a,b)=>a.cat.localeCompare(b.cat)||key(a)-key(b));
  $("#count").textContent=rows.length+" of "+DATA.length+" machines shown";
  $("#grid").innerHTML=rows.length?rows.map(d=>`
    <div class="card">
      <div class="top">
        <div class="nm">${esc(d.name)}</div>
        <div class="tag" style="background:${CC[d.cat]}">${d.cat}</div>
      </div>
      <div class="meta">
        <span class="price">${d.usdTxt}</span>
        <span class="pill">${d.hkdTxt}</span>
        <span class="pill" style="color:${DC[d.diff]}">${d.diff}</span>
        <span class="flag">${esc(d.origin)}</span>
      </div>
      <p class="sp">${esc(d.special)}</p>
      <div class="links">${d.links.map(l=>`<a href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])}</a>`).join("")}</div>
    </div>`).join(""):`<div class="none">Nothing matches that. Try clearing the search or the budget filter.</div>`;
}
render();
</script></body></html>
"""

HTML = (HTML.replace("__N__", str(len(P)))
            .replace("__DATA__", DATA)
            .replace("__CATS__", CATS_J)
            .replace("__CC__", CC_J)
            .replace("__DC__", DC_J))

html_path = os.path.join(OUT, "Open-Source-Machines-Catalog.html")
with open(html_path, "w") as f:
    f.write(HTML)

# ---------- Markdown ----------
md = ["# Open-Source Machines Catalog", "",
      f"**{len(P)} buildable open-source machines.** Prices are rough USD (converted at HK$7.8). "
      "Chinese sourcing (AliExpress / Pinduoduo / Taobao) is usually 30-50% cheaper.", ""]
for c in CATS:
    group = [p for p in P if p["cat"] == c]
    if not group:
        continue
    md.append(f"## {c}")
    md.append("")
    md.append("| Machine | Origin | Price | HK$ | Difficulty | Why it's special | Links |")
    md.append("|---|---|---|---|---|---|---|")
    for p in sorted(group, key=lambda x: (x["usd"][0] if x["usd"][0] else 10**9)):
        lk = " · ".join(f"[{n}]({u})" for n, u in p["links"])
        md.append(f"| **{p['name']}** | {p['origin']} | {usdstr(p['usd'])} | {hkd(p['usd'])} | {p['diff']} | {p['special']} | {lk} |")
    md.append("")
md.append("---")
md.append("")
md.append("*Prices assume Western kit sellers; AliExpress/Pinduoduo/Taobao sourcing typically drops 30-50%. "
          "Add ~10-15% for shipping to HK. `varies` = priced by labour, not parts.*")
md_path = os.path.join(OUT, "open-source-machines-catalog.md")
with open(md_path, "w") as f:
    f.write("\n".join(md))

json_path = os.path.join(OUT, "open-source-machines-catalog.json")
with open(json_path, "w") as f:
    json.dump(items, f, ensure_ascii=False, indent=1)

print("projects:", len(P))
print("html   :", html_path, os.path.getsize(html_path), "bytes")
print("md     :", md_path, os.path.getsize(md_path), "bytes")
print("json   :", json_path, os.path.getsize(json_path), "bytes")
for c in CATS:
    print(f"  {c:14s} {sum(1 for p in P if p['cat']==c)}")
print("under HK$2000:", sum(1 for p in P if p["usd"] != (0, 0) and p["usd"][1] * HKD <= 2000))
