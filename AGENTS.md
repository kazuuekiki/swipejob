<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# JobSwipe — Project Briefing

This file is the project context every Cowork / Claude Code session reads first.

> **History**: For the full development timeline, decisions, and resolved/unresolved issues from the Claude Code era (2026-03-31 → 2026-04-29), see [`DEVELOPMENT_HISTORY.md`](./DEVELOPMENT_HISTORY.md).

## Product

**JobSwipe** is a Tinder-style job-matching web app for Japan. Target users are **mid-tier and below university students plus high school graduates** — segments existing platforms (Mynavi, Rikunabi) under-serve. Students swipe through company cards, apply with a reusable profile, and chat once both sides match. Companies pay **¥500,000 per successful hire only** (no monthly fee).

Status: **prototype, not yet launched. Zero real users, zero signed companies.**

Founder: solo builder.

## Tech stack

- **Next.js 16.2.1** with App Router — *this is a new major version with breaking changes; consult `node_modules/next/dist/docs/` rather than relying on training data*
- **React 19** with `"use client"` directives
- **Prisma 7.6.0** with `PrismaPg` adapter
- **PostgreSQL** via Neon (Vercel integration)
- **Tailwind CSS v4** with UCLA-style theme — primary `#2774AE` (navy), accent `#FFD100` (gold)
- **NextAuth** for auth (guest fallback enabled — auth required only on `/api/apply`)
- **Vercel** auto-deploy from `master` branch

## Key directories

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router routes (pages, API) |
| `app/api/` | API routes — most use `getProfile(session)` from `lib/guest.ts` (async) |
| `app/student/` | Student-facing pages: profile, favorites, applications, matches, chat |
| `app/companies/[id]/` | Company detail page |
| `components/SwipeCard.tsx` | The swipe card UI — uses `useRef` + `requestAnimationFrame` for smooth drag |
| `prisma/schema.prisma` | DB schema |
| `prisma/seed.ts` | Reads `prisma/collected.csv`, upserts companies + students |
| `prisma/collected.csv` | Source of company cards — copy of scraper output |
| `scripts/sync-csv.js` | `npm run csv:sync` copies latest scraper CSV into the repo |
| `lib/guest.ts` | Guest profile resolver (async — DB-backed lookup) |

## Conventions

- **Auto-push**: every code change is committed and pushed automatically without asking. See `~/.claude/projects/C--Spring-2026/memory/MEMORY.md`.
- **UCLA palette only** for new UI: `#2774AE` (navy), `#1F5D8A` (dark navy), `#FFD100` (gold). Replace any `indigo-*` you see — it's legacy.
- **`getProfile(session)` is async** (returns a Promise). Always `await` it.
- **NavBar height = 64px (`bottom-16`)**. Fixed-bottom action bars on pages with NavBar must sit *above* the NavBar (use `bottom-16`, not `bottom-0`).
- **Migrations are manual**: write `prisma/migrations/<timestamp>_<name>/migration.sql` by hand. The build runs `prisma migrate deploy`.
- **Don't use unfounded statistics** in any user-facing or pitch-facing material. Stick to what is actually true: 137 cards (from CSV), no real users, ¥500K/hire model, solo founder.

## Running

```bash
npm run dev          # Local dev server (port 3000)
npm run build        # Generates Prisma, deploys migrations, runs seed, builds Next
npm run csv:sync     # Refresh prisma/collected.csv from C:/GitProject/スクレイパー製作/
npx tsx prisma/seed.ts   # Reseed companies (upsert — preserves user data)
```

Vercel deploys on push to `master`. Build runs migrations and seed.

## Live links

- Production: https://swipejob.vercel.app
- Repo: https://github.com/kazuuekiki/swipejob

## Validation plan (next 6–8 weeks)

The pitch deck (`C:/Spring 2026/jobswipe-deck/JobSwipe_Pitch_Deck.pptx`) lays out three hypotheses to test before scaling:

1. **H1** — Show prototype to 30 students at mid-tier schools, ask "would you use this instead of Mynavi?"
2. **H2** — Pitch the ¥500K-on-hire-only model to 20 SMBs, measure willingness-to-sign.
3. **H3** — After 10 swipe-driven interviews, ask recruiters whether candidate fit beat their last Mynavi applicant. Target ≥60% yes.

If any fails, the model changes — not the validation criteria.
