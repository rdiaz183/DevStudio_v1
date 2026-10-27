$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$PipelineDir = Join-Path $Workspace "Bridge\asset_pipeline"
$StateFile = Join-Path $PipelineDir "studio_state.json"
$BackupDir = Join-Path $PipelineDir "backups"

# 1. Enforce On-Demand Gate
$IsActive = $false
if (Test-Path $StateFile) {
    try {
        $StateData = Get-Content -Path $StateFile -Raw | ConvertFrom-Json
        $IsActive = $StateData.isActive
    } catch { $IsActive = $false }
}

if (-not $IsActive) {
    Write-Host "[Studio Dormant] Backup snapshot blocked. Press F1 on your desktop control panel to activate the studio first." -ForegroundColor Yellow
    exit
}

if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
}

$Timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$SnapshotZip = Join-Path $BackupDir "code510_snapshot_$Timestamp.zip"

Write-Host "================ STUDIO BACKUP SNAPSHOT ================" -ForegroundColor Cyan
Write-Host "Creating archive snapshot..." -ForegroundColor Yellow

try {
    # Compress pipeline/workspace key JSON and script files securely on demand
    $TempStaging = Join-Path $PipelineDir "temp_snapshot_staging"
    if (Test-Path $TempStaging) { Remove-Item $TempStaging -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $TempStaging | Out-Null

    # Copy relevant configs and state files
    if (Test-Path $StateFile) { Copy-Item $StateFile $TempStaging }
    
    # Create zip archive
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($TempStaging, $SnapshotZip)
    Remove-Item $TempStaging -Recurse -Force

    Write-Host "[Snapshot Success] Archive saved to: $SnapshotZip" -ForegroundColor Green
} catch {
    Write-Host "[Snapshot Error] Failed to create backup archive: $_" -ForegroundColor Red
}
Write-Host "========================================================" -ForegroundColor Cyan