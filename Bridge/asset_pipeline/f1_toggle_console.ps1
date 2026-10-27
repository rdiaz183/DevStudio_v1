Clear-Host
$MasterSwitch = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge\asset_pipeline\studio_master_switch.ps1"
$StateFile = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge\asset_pipeline\studio_state.json"

Write-Host "================ CODE510 ON-DEMAND STUDIO ===============" -ForegroundColor Cyan
Write-Host " Press [F1] to toggle the Studio Ecosystem ON/OFF instantly." -ForegroundColor Yellow
Write-Host " Press [ESC] to close this control panel." -ForegroundColor White
Write-Host "=========================================================" -ForegroundColor Cyan

if (Test-Path $MasterSwitch) {
    & $MasterSwitch -Action Status
}

while ($true) {
    if ([Console]::KeyAvailable) {
        $Key = [Console]::ReadKey($true)
        if ($Key.Key -eq 'F1') {
            Write-Host "`n[F1 Pressed] Toggling Code510 Studio State..." -ForegroundColor Cyan
            if (Test-Path $MasterSwitch) {
                & $MasterSwitch -Action Toggle
            }
            Write-Host "`n--- Ready (Press F1 to toggle again, or ESC to exit) ---" -ForegroundColor DarkGray
        }
        elseif ($Key.Key -eq 'Escape') {
            Write-Host "`nClosing Master Control Panel. Studio state preserved." -ForegroundColor Yellow
            break
        }
    }
    Start-Sleep -Milliseconds 100
}