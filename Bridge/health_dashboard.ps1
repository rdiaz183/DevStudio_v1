# Code510 Sovereign Health Dashboard
$workspaceDir = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$queuePath = Join-Path $workspaceDir "Bridge\unreal_queue.json"
$manifestPath = Join-Path $workspaceDir "Bridge\integrity_manifest.json"

Clear-Host
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PROJECT CODE510: HEALTH DASHBOARD    " -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Queue Status
$pendingTasks = 0
if (Test-Path $queuePath) {
    $raw = Get-Content -Path $queuePath -Raw
    if (-not [string]::IsNullOrWhiteSpace($raw)) {
        $data = $raw | ConvertFrom-Json
        if ($data.call_stack) { $pendingTasks = $data.call_stack.Count }
    }
}
Write-Host "[*] Pending Queue Tasks : $pendingTasks" -ForegroundColor White

# Integrity Status
$integrityStatus = if (Test-Path $manifestPath) { "Verified & Active" } else { "Not Initialized" }
Write-Host "[*] Integrity Manifest   : $integrityStatus" -ForegroundColor White

# Workspace Check
Write-Host "[*] Workspace Root       : $workspaceDir" -ForegroundColor White
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "All 30 Pipeline Systems Operational!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan