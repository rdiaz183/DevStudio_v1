param(
    [string]$SnapshotName = "snapshot_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$BridgeDir = Join-Path $Workspace "Bridge"
$BackupRoot = Join-Path $Workspace "Bridge\asset_pipeline\backups"
$TargetBackupDir = Join-Path $BackupRoot $SnapshotName

if (!(Test-Path $BackupRoot)) { New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null }
if (!(Test-Path $TargetBackupDir)) { New-Item -ItemType Directory -Force -Path $TargetBackupDir | Out-Null }

try {
    Write-Host "[Backup Utility] Creating workspace snapshot: $SnapshotName..." -ForegroundColor Cyan
    
    # Copy critical Bridge state and queues
    Copy-Item -Path $BridgeDir -Destination $TargetBackupDir -Recurse -Force -ErrorAction Stop
    
    Write-Host "================ BACKUP SUCCESS ================" -ForegroundColor Green
    Write-Host "Snapshot Name : $SnapshotName" -ForegroundColor White
    Write-Host "Saved To      : $TargetBackupDir" -ForegroundColor Yellow
    Write-Host "================================================" -ForegroundColor Green
} catch {
    Write-Host "[Backup Error] Failed to create workspace snapshot: $_" -ForegroundColor Red
}
