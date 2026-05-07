# JobSwipe — Full feedback-cycle pipeline
#
# 1. Export user-feedback signals from DB → scraper dir
# 2. Run scraper in --auto mode (uses those signals to pick a keyword)
# 3. Sync the latest scraper CSV into the repo
# 4. Reseed the DB (upsert; preserves user data)
# 5. Commit and push
#
# Usage:
#   pwsh scripts\full-cycle.ps1                # default 1 page
#   pwsh scripts\full-cycle.ps1 -MaxPages 5    # 5 pages

[CmdletBinding()]
param(
  [int]$MaxPages = 1,
  [switch]$SkipScrape,
  [switch]$SkipPush
)

$ErrorActionPreference = "Stop"
$repo = (Resolve-Path "$PSScriptRoot/..").Path
$scraper = "C:\GitProject\スクレイパー製作"

function Step($n, $msg) { Write-Host "`n=== [$n] $msg ===" -ForegroundColor Cyan }

# --- 1. Export signals ---
Step 1 "Exporting user-feedback signals from DB"
Push-Location $repo
try {
  npm run signals:export
} catch {
  Write-Warning "signals:export failed (DB unreachable?). Continuing with last-known signals.json."
} finally {
  Pop-Location
}

# --- 2. Scrape ---
if (-not $SkipScrape) {
  Step 2 "Running scraper (--auto mode, $MaxPages page(s))"
  Push-Location $scraper
  try {
    $env:PYTHONIOENCODING = "utf-8"
    python main.py --auto --max-pages $MaxPages
  } finally {
    Pop-Location
  }
} else {
  Step 2 "Skipping scrape (--SkipScrape)"
}

# --- 3. Sync CSV into repo ---
Step 3 "Syncing collected.csv into repo"
Push-Location $repo
try {
  npm run csv:sync
} finally {
  Pop-Location
}

# --- 4. Reseed DB ---
Step 4 "Reseeding DB (upsert)"
Push-Location $repo
try {
  npx tsx prisma/seed.ts
} catch {
  Write-Warning "Seed failed (DB unreachable?). CSV is still updated locally; Vercel build will pick it up."
} finally {
  Pop-Location
}

# --- 5. Commit & push ---
if (-not $SkipPush) {
  Step 5 "Committing and pushing"
  Push-Location $repo
  try {
    git add prisma/collected.csv prisma/signals.json 2>$null
    $changed = git diff --cached --name-only
    if ($changed) {
      $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
      git commit -m "data: scraper feedback cycle ($stamp)"
      git push
    } else {
      Write-Host "No CSV/signals changes to commit."
    }
  } finally {
    Pop-Location
  }
}

Write-Host "`n[done] Full feedback cycle complete." -ForegroundColor Green
