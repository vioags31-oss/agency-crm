# Auto-push script - watches for file changes and auto-commits

$repoPath = Get-Location
$watchPath = Join-Path $repoPath "app"
$lastPush = Get-Date

Write-Host "Starting auto-push watcher..." -ForegroundColor Green
Write-Host "Watching folder: $watchPath" -ForegroundColor Cyan
Write-Host "Changes will auto-commit and push to GitHub" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

$ignoredFolders = @('.next', 'node_modules', '.git')

$action = {
    $path = $Event.SourceEventArgs.FullPath
    $name = $Event.SourceEventArgs.Name

    $skip = $false
    foreach ($folder in $ignoredFolders) {
        if ($path -like "*\$folder\*") {
            $skip = $true
            break
        }
    }

    if (-not $skip) {
        Start-Sleep -Seconds 2

        $status = git status --porcelain
        if ($status) {
            Write-Host "File changed: $name" -ForegroundColor Yellow

            try {
                Write-Host "Committing..." -ForegroundColor Gray
                git add -A
                $timestamp = Get-Date -Format "HH:mm:ss"
                git commit -m "Auto-commit: $timestamp"

                Write-Host "Pushing to GitHub..." -ForegroundColor Gray
                git push origin main 2>$null

                if ($LASTEXITCODE -eq 0) {
                    Write-Host "Success! Vercel deploying..." -ForegroundColor Green
                } else {
                    Write-Host "Push error - check internet" -ForegroundColor Red
                }
            } catch {
                Write-Host "Error: $_" -ForegroundColor Red
            }
        }
    }
}

Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action | Out-Null

while ($true) {
    Start-Sleep -Seconds 1
}
