# Code510 Cross-Engine Asset Bridge
$workspaceDir = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$interchangeDir = Join-Path $workspaceDir "Interchange"
$queuePath = Join-Path $workspaceDir "Bridge\unreal_queue.json"

if (-not (Test-Path $interchangeDir)) {
    New-Item -ItemType Directory -Path $interchangeDir | Out-Null
}

$incomingAssets = Get-ChildItem -Path $interchangeDir -Include "*.fbx", "*.obj", "*.png" -Recurse
if ($incomingAssets.Count -eq 0) {
    Write-Host "[CrossEngine] No new interchange assets found to sync." -ForegroundColor Yellow
    return
}

$rawQueue = Get-Content -Path $queuePath -Raw
$queueData = $rawQueue | ConvertFrom-Json

foreach ($asset in $incomingAssets) {
    Write-Host "[CrossEngine] Syncing asset: $($asset.Name)" -ForegroundColor Cyan
    
    $newTask = @{
        name = "import_interchange_asset"
        parameters = @(
            @{ asset_path = $asset.FullName }
        )
        timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }

    $queueData.call_stack = @($queueData.call_stack) + $newTask
}

$queueData | ConvertTo-Json -Depth 5 | Set-Content -Path $queuePath -Encoding utf8
Write-Host "[CrossEngine] Successfully queued interchange assets for Unreal ingestion!" -ForegroundColor Green