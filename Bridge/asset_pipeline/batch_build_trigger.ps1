param(
    [string]$Configuration = "Development",
    [string]$TargetPlatform = "Win64"
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$BuildQueueDir = Join-Path $Workspace "Bridge\asset_pipeline\build_queue"
if (!(Test-Path $BuildQueueDir)) { New-Item -ItemType Directory -Force -Path $BuildQueueDir | Out-Null }

$Timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$BuildManifestPath = Join-Path $BuildQueueDir "build_request_$Timestamp.json"

$BuildPayload = @{
    projectPath = $Workspace
    configuration = $Configuration
    platform = $TargetPlatform
    timestamp = (Get-Date).ToString("o")
    status = "PendingIdleBuild"
} | ConvertTo-Json

try {
    Set-Content -Path $BuildManifestPath -Value $BuildPayload -Encoding utf8
    
    Write-Host "================ BATCH BUILD QUEUED ================" -ForegroundColor Cyan
    Write-Host "Configuration : $Configuration" -ForegroundColor Yellow
    Write-Host "Platform      : $TargetPlatform" -ForegroundColor White
    Write-Host "Manifest      : $BuildManifestPath" -ForegroundColor Green
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host "[Build Success] Build request staged for automated execution." -ForegroundColor Green
} catch {
    Write-Host "[Build Error] Failed to queue build request: $_" -ForegroundColor Red
}
