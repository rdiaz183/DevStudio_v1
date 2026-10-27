# Code510 Resource Lock Monitor
$queuePath = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge\unreal_queue.json"
if (Test-Path $queuePath) {
    try {
        $stream = [System.IO.File]::Open($queuePath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
        $stream.Close()
        Write-Host "[LockMonitor] Queue file is unlocked and ready." -ForegroundColor Green
    } catch {
        Write-Warning "[LockMonitor] Queue file is locked by another process! Resetting handle..."
        '{"call_stack": []}' | Set-Content -Path $queuePath -Encoding utf8 -Force
    }
}