# Interview Pipeline Dashboard

## What this is

A React SPA that reads and writes `pipeline.json` directly from a GitHub repo
via the GitHub REST API. Hosted on GitHub Pages. Acts as a personal Kanban
board for tracking interview stages across companies.

## Tech stack

- React 18 (Create React App, react-scripts 5)
- Vanilla CSS (no Tailwind, no UI library)
- gh-pages for deployment
- GitHub REST API for data persistence (reads/writes pipeline.json in this repo)

## Architecture

- Single-page app, no backend
- pipeline.json lives in this repo's root and is the source of truth
- App fetches it on load, mutations PUT it back via GitHub Contents API
- Auth: classic GitHub Personal Access Token with `repo` scope, stored in localStorage
- User pastes token once on first load, persists across sessions

## Responsive design requirements

- Must work fully on both desktop and mobile (iPhone Safari is the priority)
- All features available on mobile, not just read-only — adding, editing,
  and deleting entries must work with touch
- Breakpoint: single-column stacked lanes below 768px, multi-column above
- Touch targets minimum 44x44px (Apple HIG)
- Forms use native mobile inputs (date pickers, etc.) — no custom date widgets
- Modals/forms must be scrollable and not get trapped behind iOS keyboard
- Test in Chrome DevTools mobile emulation AND on actual iPhone before shipping
- No horizontal scroll on any screen size
- Font size minimum 16px on inputs (prevents iOS auto-zoom on focus)

## Pipeline data model

Each entry: { id, company, role, recruiter, status, stage, nextStep, date, notes }
Statuses map to lanes:

- "Screen Scheduled", "Screen Done" → Recruiter Screening
- "Interview Scheduled", "Interview Done", "Onsite", "Final Round" → Interview
- "Offer", "Accepted", "Rejected", "Not Moving Forward", "Closed", "Withdrawn" → Rejected/Accepted
- "Applied" is not tracked — tracking starts when a recruiter engages
- Unknown statuses are hidden (not misfiled into a fallback lane)

## Card display fields

Cards show three fields only: company (bold), recruiter, next event date.
Date label is "Next:" and formatted as "Mon, May 5" (year appended only when
it differs from the current year). Sort order within each lane: ascending by
date (soonest first); entries with missing/invalid dates sort to the bottom.

## Critical gotchas (lessons from v1)

- Lane matching MUST be exact string match on status field — never substring/includes()
  (substring caused "Not Moving Forward" to land in "Interview" lane)
- Always fetch the latest SHA fresh before every PUT — stale SHAs cause 409 conflicts
- Use a CLASSIC PAT, not fine-grained — fine-grained gave "Resource not accessible"
- Token in localStorage only, never commit it

## Deployment

- `npm run deploy` → builds and pushes to gh-pages branch
- homepage in package.json must be set to https://<user>.github.io/<repo>
- Repo must have GitHub Pages enabled, source = gh-pages branch

## Coding conventions

- Functional components with hooks only
- Plain CSS in component-level .css files
- Keep components small, one per file
- No TypeScript for this project (keep it light)
