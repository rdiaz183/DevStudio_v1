# Code510 Workspace Integrity Checksum Utility
$workspaceDir = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$manifestPath = Join-Path $workspaceDir "Bridge\integrity_manifest.json"

$criticalFiles = @(
    "Bridge\unreal_queue.json",
    "Bridge\unreal_consumer.py",
    "Bridge\workspace_daemon.ps1"
)

$manifest = @{}
foreach ($file in $criticalFiles) {
    $fullPath = Join-Path $workspaceDir $file
    if (Test-Path $fullPath) {
        $hash = (Get-FileHash -Path $fullPath -Algorithm SHA256).Hash
        $manifest[$file] = $hash
    }
}

$manifest | ConvertTo-Json -Depth 3 | Set-Content -Path $manifestPath -Encoding utf8
Write-Host "[Integrity] Checksum manifest successfully updated at $manifestPath" -ForegroundColor Green