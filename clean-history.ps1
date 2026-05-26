param()

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Cleaning Git History - Removing Firebase Credentials" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Remove local credentials file
if (Test-Path "swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json") {
    Write-Host "Removing local credentials file..." -ForegroundColor Yellow
    Remove-Item "swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json" -Force
    Write-Host "Done." -ForegroundColor Green
}

Write-Host ""
Write-Host "Cleaning git history from credentials..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Try git-filter-repo
try {
    $filterRepoPath = & git config --get-all --name-only init.defaultbranch 2>$null
    $hasFilterRepo = $null -ne (Get-Command git-filter-repo -ErrorAction SilentlyContinue)

    if ($hasFilterRepo) {
        Write-Host "Using git-filter-repo..." -ForegroundColor Cyan
        & git-filter-repo --force --invert-paths --path swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json
    } else {
        Write-Host "Using git filter-branch..." -ForegroundColor Cyan
        & git filter-branch --tree-filter "del swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json 2>nul || true" --force -- --all
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error during cleanup!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "History cleaned!" -ForegroundColor Green
Write-Host ""
Write-Host "Now pushing to GitHub with force..." -ForegroundColor Yellow
Write-Host ""

& git push --force origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error during push!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "SUCCESS!" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Credentials removed from history" -ForegroundColor Green
Write-Host "✓ Changes pushed to GitHub" -ForegroundColor Green
Write-Host "✓ Vercel will auto-deploy now" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
