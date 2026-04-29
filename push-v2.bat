@echo off
REM swipejob-v2 push script (deploy fix v2)
cd /d "%~dp0"

echo === Updating lockfile (npm install) ===
call npm install --no-audit --no-fund

echo === Status ===
git status -sb
echo.

echo === Adding all changes ===
git add -A

echo === Committing ===
git commit -m "fix(v2): pin tailwind 4.1, skip migrate/seed in build, escape emoji codepoints"

echo === Pushing v2-poster -^> v2/master ===
git push v2 v2-poster:master

echo.
echo Done. Check Vercel — new build should auto-trigger.
pause
