param(
    [Parameter(Mandatory=$true)]
    [string]$ScriptName,
    
    [Parameter(Mandatory=$true)]
    [string]$ErrorMessage
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$ErrorQueueDir = Join-Path $Workspace "Bridge\asset_pipeline\error_queue"
if (!(Test-Path $ErrorQueueDir)) { New-Item -ItemType Directory -Force -Path $ErrorQueueDir | Out-Null }

$Timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$ErrorRecordPath = Join-Path $ErrorQueueDir "error_${ScriptName}_$Timestamp.json"

$ErrorPayload = @{
    script = $ScriptName
    timestamp = (Get-Date).ToString("o")
    error = $ErrorMessage
    status = "PendingAutonomousPatch"
} | ConvertTo-Json

try {
    Set-Content -Path $ErrorRecordPath -Value $ErrorPayload -Encoding utf8
    
    Write-Host "================ ERROR CAPTURED & QUEUED ================" -ForegroundColor Red
    Write-Host "Script  : $ScriptName" -ForegroundColor Yellow
    Write-Host "Error   : $ErrorMessage" -ForegroundColor White
    Write-Host "Logged  : $ErrorRecordPath" -ForegroundColor Cyan
    Write-Host "=========================================================" -ForegroundColor Red
    Write-Host "[Self-Correction] Error packaged into prompt queue for autonomous agent healing." -ForegroundColor Green
} catch {
    Write-Host "[Self-Correction Error] Failed to log error record: $_" -ForegroundColor Red
}
