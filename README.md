# National Fantasy League — Website Starter

A data-driven Next.js public-readonly fantasy football league archive.

## Start locally

1. Install Node.js 20+.
2. Open a terminal inside this folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit http://localhost:3000.

## What is working

- ESPN-inspired white desktop/mobile layout and horizontal navigation.
- Eight functional page sections.
- Historical matchups: 70 in 2025 and 20 through Week 5, 2026.
- Automatic regular-season standings and points, including bye-week scoring.
- Head-to-head comparisons, high-score records, historical team directory.
- 2025 champion and playoff archive.
- All data in `data/league.json`.

## Data conventions

Matchups, byes, and postseason results are separate. Byes count toward total fantasy points but not wins/losses. Playoffs do not count toward regular-season standings. Inactive franchises remain in league history. The 2026 newcomer manager name is pending confirmation.

## Deployment

The site is **not deployed yet**. It can be deployed later to Vercel through a Git repository after user approval. Public pages have no login; changes require source/deployment access. The website currently reads static JSON, not ESPN live updates.

## Accuracy note

Data is imported from the previous archive based on ESPN screenshots. Before publishing, verify all historical results and member names against ESPN. Future automated imports or a secured admin interface can be added separately.
