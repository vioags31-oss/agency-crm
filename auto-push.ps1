# Auto-push скрипт - запускає auto-commit і автоматично пушить зміни
# Використовуй: powershell -ExecutionPolicy Bypass -File auto-push.ps1

$repoPath = Get-Location
$watchPath = Join-Path $repoPath "app"
$lastPush = Get-Date

Write-Host "🚀 Auto-push скрипт запущений!" -ForegroundColor Green
Write-Host "📁 Слідкую за змінами в: $watchPath" -ForegroundColor Cyan
Write-Host "💾 Зміни будуть автоматично коммітитися та пушитися на GitHub" -ForegroundColor Cyan
Write-Host "Натисни Ctrl+C щоб зупинити`n" -ForegroundColor Yellow

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Ігнорувати папки
$ignoredFolders = @('.next', 'node_modules', '.git')

$action = {
    $path = $Event.SourceEventArgs.FullPath
    $name = $Event.SourceEventArgs.Name

    # Пропустити ігноровані папки
    $skip = $false
    foreach ($folder in $ignoredFolders) {
        if ($path -like "*\$folder\*") {
            $skip = $true
            break
        }
    }

    if (-not $skip) {
        # Затримка 2 сек для збереження файлу
        Start-Sleep -Seconds 2

        # Перевірити чи є зміни
        $status = git status --porcelain
        if ($status) {
            Write-Host "📝 Зміни: $name" -ForegroundColor Yellow

            try {
                Write-Host "⏳ Коммітую..." -ForegroundColor Gray
                git add -A
                $timestamp = Get-Date -Format "HH:mm:ss"
                git commit -m "🔄 Auto-push: $timestamp"

                Write-Host "📤 Пушу на GitHub..." -ForegroundColor Gray
                git push origin main 2>$null

                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Успішно! Vercel деплойиться..." -ForegroundColor Green
                } else {
                    Write-Host "⚠️  Помилка при push - перевір інтернет" -ForegroundColor Red
                }
            } catch {
                Write-Host "❌ Помилка: $_" -ForegroundColor Red
            }
        }
    }
}

Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action | Out-Null

# Тримати скрипт активним
while ($true) {
    Start-Sleep -Seconds 1
}
