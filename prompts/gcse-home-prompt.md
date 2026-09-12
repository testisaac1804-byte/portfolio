# GCSE Home — Toddle Dashboard Rebuild

## Stack
Single-file HTML (no dependencies, works offline) · light theme · localStorage persistence

## How it works
Rebuilds the school's **Toddle "GCSE Home" dashboard** (web.toddleapp.com) as a
standalone static page from the saved page data:

- **Quick links** — 10 Toddle modules (Calendar, Progress reports, Gradebook,
  School policies, Engagement/Attendance/Newsfeed/Timetable/Sports/Activities —
  the last six "Powered by Sentral"). Clicking opens an info modal.
- **My Classes** — 9 snapshotted classes: Chinese First Language 10CX201,
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
- `G` object namespaces everything; `A`/`C`/`E`/`Q` arrays hold snapshot data.
- `G.toggle(id)` flips done-state, persists, and re-renders stats + tabs + list.
- Selftest stamp: `SELFTEST PASS — GCSE Home OK` written into `#selftest`.

## Usage
Open `demos/gcse-home.html` in any browser. No server needed.