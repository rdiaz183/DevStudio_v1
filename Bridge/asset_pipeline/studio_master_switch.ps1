param(
    [ValidateSet('Toggle','Status')]
    [string]$Action = 'Toggle'
)

$StateFile = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge\asset_pipeline\studio_state.json"

$IsActive = $false
if (Test-Path $StateFile) {
    try {
        $StateData = Get-Content -Path $StateFile -Raw | ConvertFrom-Json
        $IsActive = $StateData.isActive
    } catch { $IsActive = $false }
}

if ($Action -eq 'Toggle') {
    $IsActive = -not $IsActive
}

$NewState = @{ isActive = $IsActive; updated = (Get-Date).ToString("o") } | ConvertTo-Json
[System.IO.File]::WriteAllText($StateFile, $NewState, [System.Text.Encoding]::UTF8)

if ($IsActive) {
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host " [STUDIO ECOSYSTEM: ACTIVE (ON-DEMAND READY)]" -ForegroundColor Green
    Write-Host " Ready to process queues, validations, and builds." -ForegroundColor White
    Write-Host "========================================================" -ForegroundColor Green
} else {
    Get-Process powershell -ErrorAction SilentlyContinue | Where-Object { 
        $_.CommandLine -like "*asset_pipeline*" -and $_.Id -ne $PID
    } | Stop-Process -Force -ErrorAction SilentlyContinue

    Write-Host "========================================================" -ForegroundColor Yellow
    Write-Host " [STUDIO ECOSYSTEM: DORMANT (OFF)]" -ForegroundColor Yellow
    Write-Host " Zero background overhead. Studio is completely offline." -ForegroundColor White
    Write-Host "========================================================" -ForegroundColor Yellow
}