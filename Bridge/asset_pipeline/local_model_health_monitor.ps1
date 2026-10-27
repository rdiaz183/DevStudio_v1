param(
    [string]$ModelEndpoint = "http://localhost:11434/api/tags"
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$HealthLogDir = Join-Path $Workspace "Bridge\asset_pipeline"
$HealthLogFile = Join-Path $HealthLogDir "model_health_log.json"

Write-Host "================ MODEL HEALTH MONITOR ================" -ForegroundColor Cyan
Write-Host "Checking Endpoint : $ModelEndpoint" -ForegroundColor Yellow

try {
    $Response = Invoke-RestMethod -Uri $ModelEndpoint -Method Get -TimeoutSec 5 -ErrorAction Stop
    $Timestamp = (Get-Date).ToString("o")
    
    $HealthPayload = @{
        endpoint = $ModelEndpoint
        status = "Online"
        timestamp = $Timestamp
    } | ConvertTo-Json
    
    Set-Content -Path $HealthLogFile -Value $HealthPayload -Encoding utf8
    
    Write-Host "[Model Status] Endpoint is ONLINE and responding." -ForegroundColor Green
} catch {
    $Timestamp = (Get-Date).ToString("o")
    $HealthPayload = @{
        endpoint = $ModelEndpoint
        status = "Offline"
        error = $_.Exception.Message
        timestamp = $Timestamp
    } | ConvertTo-Json
    
    Set-Content -Path $HealthLogFile -Value $HealthPayload -Encoding utf8
    
    Write-Host "[Model Warning] Endpoint is OFFLINE or unreachable: $_" -ForegroundColor Red
}
Write-Host "======================================================" -ForegroundColor Cyan
