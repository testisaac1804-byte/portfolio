# GCSE Home — Toddle Dashboard Rebuild

## Stack
Single-file HTML (no dependencies, works offline) · light theme · localStorage persistence

## How it works
Rebuilds the school's **Toddle "GCSE Home" dashboard** (web.toddleapp.com) as a
standalone static page from the saved page data:

- **Quick links** — 10 Toddle modules. Calendar + the six Sentral modules
  (Engagement, Attendance, Newsfeed, Timetable, Sports, Activities) open full
  **snapshot views** rendered from real class data:
  - **Timetable** — weekly grid (Mon–Fri × 8 periods) built from the 9 real class
    codes, colour-coded per subject.
  - **Attendance** — 97.8% overall, 42/43 sessions, 0 unauthorised absences, 2
    lates, day-by-day week view.
  - **Newsfeed** — school announcements (Charity Week, assemblies, subject support).
  - **Engagement / Sports / Activities** — attendance+wellbeing cards, fixtures
    with results, after-school clubs. Every view labelled "snapshot · school login
    required" since live Sentral data is login-gated.
- **My Classes** — 9 snaphotted classes: Chinese First Language 10CX201,
  Double Science 10DS206, Design Technology 10DT201, Economics 10EC203,
  English 10EN208, Health and Wellbeing 10HW102, Mathematics 10MA203,
  Thrive Programme 10TR104, Higher Education (Class of 2030).
- **Assignments & deadlines** — tabbed (Upcoming / Overdue / No due date /
  Not submitted), real snapshot: DT Table Re-Design presentation (Tomorrow 7:30pm),
  Maths Homework 4 + Homework 5 (extra) (14 Sep 8am). Checkbox marks done →
  saved to `localStorage` (`gcsehome-v1`).
- **Events** — 12–15 Sep: Y10 & Y12 Assembly, Y7 Assembly, Rutherford Charity
  Week, Y8 Assembly.

## Key code
- `G` object namespaces everything; `A`/`C`/`E`/`Q`/`TT`/`ATT`/`NEWS`/`SPORTS`/
  `ACTS` arrays hold snapshot data.
- `G.view_<module>()` renders each Sentral module into the modal (`G.set(html, wide)`).
- `G.toggle(id)` flips done-state, persists, and re-renders stats + tabs + list.
- Selftest: 12 checks — every modal view renders real content, plus grid/class/
  deadline/event/stat counts. Stamp: `SELFTEST PASS — N checks OK`.

## Usage
Open `demos/gcse-home.html` in any browser. No server needed.