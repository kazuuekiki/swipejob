@echo off
REM swipejob-v2 push script
REM Usage: double-click or run from cmd
cd /d "%~dp0"

echo === Status ===
git status -sb
echo.

echo === Adding all changes ===
git add -A

echo === Committing ===
git commit -m "feat(v2): SVG company posters, 3-tab nav, Neon connect_timeout, 800-company support"

echo === Adding remote 'v2' (ignore error if already exists) ===
git remote add v2 https://github.com/kazuuekiki/swipejob-v2.git 2>nul

echo === Pushing v2-poster -^> v2/master ===
git push v2 v2-poster:master

echo.
echo Done. If push succeeded, open:
echo   https://github.com/kazuuekiki/swipejob-v2
echo Then import to Vercel.
pause
