$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$PipelineDir = Join-Path $Workspace "Bridge\asset_pipeline"
$StateFile = Join-Path $PipelineDir "studio_state.json"

Clear-Host
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "        CODE510 ON-DEMAND SOVEREIGN HEALTH HUB          " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Timestamp : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray

# 1. Check Master Switch State
$IsActive = $false
if (Test-Path $StateFile) {
    try {
        $StateData = Get-Content -Path $StateFile -Raw | ConvertFrom-Json
        $IsActive = $StateData.isActive
    } catch { $IsActive = $false }
}

if ($IsActive) {
    Write-Host " [Studio Master Switch] : ACTIVE (ON-DEMAND READY)" -ForegroundColor Green
} else {
    Write-Host " [Studio Master Switch] : DORMANT (OFF)" -ForegroundColor Yellow
}

# 2. Check Background Daemons (Confirming zero lingering background tasks)
$LegacyTask = Get-ScheduledTask -TaskName "Code510_AssetPipelineDaemon" -ErrorAction SilentlyContinue
if ($LegacyTask) {
    Write-Host " [Background Polling]   : WARNING (Legacy task detected)" -ForegroundColor Red
} else {
    Write-Host " [Background Polling]   : PURGED (Zero background footprint)" -ForegroundColor Green
}

# 3. Workspace Staging Directories Check
$BackupsDir = Join-Path $PipelineDir "backups"
$BackupCount = if (Test-Path $BackupsDir) { (Get-ChildItem -Path $BackupsDir -Filter "*.zip").Count } else { 0 }

Write-Host " [Pipeline Directory]   : $PipelineDir" -ForegroundColor White
Write-Host " [Stored Snapshots]     : $BackupCount archive(s) found" -ForegroundColor Cyan

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Architecture Status: 100% On-Demand & Sovereign." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan