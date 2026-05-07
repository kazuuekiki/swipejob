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
| `scripts/export-signals.ts` | `npm run signals:export` aggregates user feedback → `prisma/signals.json` + scraper dir |
| `scripts/full-cycle.ps1` | `npm run scrape:cycle` runs the full feedback loop (signals → scrape → sync → seed → push) |
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

## Scraper feedback loop

The scraper (`C:\GitProject\スクレイパー製作\`) auto-improves based on what real users like in the app.

1. `npm run signals:export` queries the DB and writes `signals.json` (top industries, locations, salary bands, weighted keywords) to both the repo and the scraper directory.
2. `python main.py --auto` in the scraper reads `signals.json`, picks a keyword weighted by user preference (e.g. "高卒 東京都" if Tokyo is dominant), then scrapes.
3. `npm run csv:sync` copies the updated `collected.csv` back into the repo.
4. `npx tsx prisma/seed.ts` upserts new companies (preserves existing favorites/applications).
5. Commit + push deploys via Vercel.

All five steps run in one shot via `npm run scrape:cycle` (`scripts/full-cycle.ps1`).

### Signal quality safeguards

The aggregation in `scripts/export-signals.ts` is intentionally conservative:

| Mechanism | Effect |
|---|---|
| **Event weighting** — apply (3.0) > favorite (2.0) > swipe-like (1.0) | Commitment-level signals dominate over casual swipes |
| **Recency decay** — half-life 30 days | A like from 60 days ago contributes 25% of a like today |
| **Base keyword floor** — `BASE_KEYWORD_FLOOR = 0.4` | `高卒` etc. always retain at least 0.4 weight, preserving exploration |
| **Signal keyword cap** — `SIGNAL_KEYWORD_CAP = 0.6` | A user-derived keyword can never outweigh the base keyword `高卒 (1.0)` |
| **Volume penalty** — `score = positiveRate × log(1 + n)` | Tiny samples cannot create runaway preferences |

Run `tsx scripts/smoke-test-signals.ts` to verify these properties offline (no DB needed).

The result: as students swipe more, the scraper gradually focuses on the kinds of companies they actually like — without ever fully closing the door on broader keywords.

## Validation plan (next 6–8 weeks)

The pitch deck (`C:/Spring 2026/jobswipe-deck/JobSwipe_Pitch_Deck.pptx`) lays out three hypotheses to test before scaling:

1. **H1** — Show prototype to 30 students at mid-tier schools, ask "would you use this instead of Mynavi?"
2. **H2** — Pitch the ¥500K-on-hire-only model to 20 SMBs, measure willingness-to-sign.
3. **H3** — After 10 swipe-driven interviews, ask recruiters whether candidate fit beat their last Mynavi applicant. Target ≥60% yes.

If any fails, the model changes — not the validation criteria.
