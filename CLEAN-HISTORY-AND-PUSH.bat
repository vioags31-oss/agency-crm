@echo off
chcp 65001 >nul 2>&1
color 0C
title CLEAN GIT HISTORY

echo.
echo ================================================================
echo   Cleaning Git History - Removing Firebase Credentials
echo ================================================================
echo.

cd /d "%~dp0"

REM Remove local credentials file if exists
if exist "swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json" (
    echo Removing local credentials file...
    del "swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json"
    echo Done.
)

echo.
echo Cleaning git history from credentials...
echo This may take a few minutes...
echo.

REM Try git-filter-repo first
where git-filter-repo >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Using git-filter-repo...
    git-filter-repo --force --invert-paths --path swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json
) else (
    echo Using git filter-branch...
    for /f "tokens=*" %%A in ('git rev-parse --git-dir') do set GIT_DIR=%%A
    git filter-branch --tree-filter "del swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json 2>nul || true" --force -- --all
)

if %ERRORLEVEL% neq 0 (
    echo Error during cleanup!
    pause
    exit /b 1
)

echo.
echo History cleaned!
echo.
echo Now pushing to GitHub with force...
echo.

git push --force origin main

if %ERRORLEVEL% neq 0 (
    echo Error during push!
    pause
    exit /b 1
)

echo.
echo SUCCESS!
echo.
echo Credentials removed from history
echo Changes pushed to GitHub
echo Vercel will auto-deploy now
echo.
pause
