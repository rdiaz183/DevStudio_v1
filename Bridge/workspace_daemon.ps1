# Code510 Workspace Efficiency Daemon
$bridgeDir = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge"
$logDir = Join-Path $bridgeDir "logs"

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

Write-Host "[Daemon] Code510 Efficiency Daemon Active. Monitoring Bridge logs and hot-reload triggers..." -ForegroundColor Cyan

while ($true) {
    # Log Cleaner: Archive or remove files older than 24 hours in logs folder
    Get-ChildItem -Path $logDir -File | Where-Object { $_.LastWriteTime -lt (Get-Date).AddHours(-24) } | Remove-Item -Force -ErrorAction SilentlyContinue
    
    # Keep queue lock clean
    $queuePath = Join-Path $bridgeDir "unreal_queue.json"
    if (Test-Path $queuePath) {
        # Ensure valid JSON structure if file is accidentally blank
        $content = Get-Content $queuePath -Raw
        if ([string]::IsNullOrWhiteSpace($content)) {
            '{"call_stack": []}' | Set-Content $queuePath -Encoding utf8
        }
    }

    Start-Sleep -Seconds 10
}