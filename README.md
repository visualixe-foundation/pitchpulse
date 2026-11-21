# PitchPulse

Live football matchday hub for **UEFA Champions League** and **UEFA Nations League**.

One place for fixtures, live scores, results, tables, and team pages.

**Live site:** https://pitchpulse.vercel.app *(coming soon)*

---

## Features

- Clean competition selector on the homepage
- Dedicated sections for Champions League and Nations League
- Shared UI components for match cards, tables, and team pages
- Built with Next.js 14 + TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx              # Landing page (choose competition)
  ucl/                  # Champions League routes
  nations/              # Nations League routes
components/
  shared/               # Reusable components
lib/
  api/                  # Data fetching per competition
```

## Built by

Visualixe Foundation
