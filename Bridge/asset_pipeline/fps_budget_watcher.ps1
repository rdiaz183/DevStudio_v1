param(
    [string]$PerformanceLogPath,
    [int]$MinFpsThreshold = 60
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
if (-not $PerformanceLogPath) {
    $PerformanceLogPath = Join-Path $Workspace "Bridge\asset_pipeline\performance_log.json"
}

Write-Host "================ FPS BUDGET WATCHER ================" -ForegroundColor Cyan
if (!(Test-Path $PerformanceLogPath)) {
    Write-Host "[FPS Watcher Notice] No performance log found at: $PerformanceLogPath" -ForegroundColor Yellow
    Write-Host "[FPS Watcher] Initializing baseline monitor (Target: $MinFpsThreshold FPS)..." -ForegroundColor Green
    return
}

try {
    $Data = Get-Content -Path $PerformanceLogPath -Raw -Encoding utf8 | ConvertFrom-Json -ErrorAction Stop
    $CurrentFps = $Data.fps
    
    if ($CurrentFps -lt $MinFpsThreshold) {
        Write-Host "[FPS Warning] Frame rate drop detected! Current: $CurrentFps FPS (Target: >= $MinFpsThreshold)" -ForegroundColor Red
    } else {
        Write-Host "[FPS Success] Frame rate nominal: $CurrentFps FPS" -ForegroundColor Green
    }
} catch {
    Write-Host "[FPS Error] Failed to parse performance log: $_" -ForegroundColor Red
}
Write-Host "====================================================" -ForegroundColor Cyan
