@echo off
REM Run the PowerShell cleanup script
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0clean-history.ps1"
