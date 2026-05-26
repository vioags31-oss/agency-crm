@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo.
echo ==================================================
echo   AUTO-PUSH - File Watch and Auto-Commit
echo ==================================================
echo.
echo Pushing local changes to GitHub first...
echo.

git push origin main

if %ERRORLEVEL% neq 0 (
    echo Error on push. Check internet connection.
    pause
    exit /b 1
)

echo.
echo Push successful!
echo.
echo Starting file watcher...
echo All changes in app/ folder will auto-commit and push
echo Press Ctrl+C to stop
echo.
pause

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0auto-push.ps1"

pause
