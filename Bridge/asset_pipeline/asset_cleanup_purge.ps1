param(
    [int]$DaysOld = 7
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$TargetDirs = @(
    Join-Path $Workspace "Bridge\asset_pipeline\stt_queue",
    Join-Path $Workspace "Bridge\asset_pipeline\build_queue"
)

Write-Host "================ WORKSPACE CLEANUP & PURGE ================" -ForegroundColor Cyan
$CutoffDate = (Get-Date).AddDays(-$DaysOld)

foreach ($Dir in $TargetDirs) {
    if (Test-Path $Dir) {
        Write-Host "Scanning directory: $Dir" -ForegroundColor Yellow
        $OldFiles = Get-ChildItem -Path $Dir -Recurse | Where-Object { $_.LastWriteTime -lt $CutoffDate -and -not $_.PSIsContainer }
        
        foreach ($File in $OldFiles) {
            try {
                Remove-Item -Path $File.FullName -Force -ErrorAction Stop
                Write-Host "Purged old temp file: $($File.Name)" -ForegroundColor DarkGray
            } catch {
                Write-Host "Failed to remove file $($File.Name): $_" -ForegroundColor Red
            }
        }
    }
}

Write-Host "[Cleanup Success] Temporary staging purge completed." -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Cyan
