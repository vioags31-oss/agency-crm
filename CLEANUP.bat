@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
echo Cleaning credentials from git history...
echo.
if exist "swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json" del "swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json"
echo Running git cleanup...
git-filter-repo --force --invert-paths --path swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json
if %ERRORLEVEL% equ 0 (
  echo Cleanup successful. Pushing to GitHub...
  git push --force origin main
  if %ERRORLEVEL% equ 0 (
    echo Success! All done.
  ) else (
    echo Push failed. Check internet connection.
  )
) else (
  echo Cleanup failed. Trying alternative method...
  git filter-branch --tree-filter "del swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json 2>nul || true" --force -- --all
  if %ERRORLEVEL% equ 0 (
    echo Pushing to GitHub...
    git push --force origin main
  )
)
pause
