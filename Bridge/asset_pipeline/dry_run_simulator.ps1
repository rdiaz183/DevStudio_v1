param(
    [Parameter(Mandatory=$true)]
    [string]$TaskName,
    
    [Parameter(Mandatory=$true)]
    [string]$TargetAction
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$StateFile = Join-Path $Workspace "Bridge\state_machine.json"

Write-Host "================ DRY-RUN SIMULATOR ================" -ForegroundColor Cyan
Write-Host "Simulating Task : $TaskName" -ForegroundColor Yellow
Write-Host "Action Planned  : $TargetAction" -ForegroundColor White
Write-Host "---------------------------------------------------" -ForegroundColor Cyan

# Pre-flight checks on state and environment
if (Test-Path $StateFile) {
    Write-Host "[Dry-Run] State machine detected. Verifying readability..." -ForegroundColor Green
    try {
        $null = Get-Content $StateFile -Raw -Encoding utf8 | ConvertFrom-Json -ErrorAction Stop
        Write-Host "[Dry-Run] State machine structure is valid for operation." -ForegroundColor Green
    } catch {
        Write-Host "[Dry-Run Warning] State machine contains syntax errors that would block live execution." -ForegroundColor Yellow
    }
} else {
    Write-Host "[Dry-Run Notice] State machine not found at expected path. A new one would be initialized." -ForegroundColor Yellow
}

Write-Host "[Dry-Run Result] Simulation complete. No live workspace changes were made." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
