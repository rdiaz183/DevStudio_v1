param(
    [Parameter(Mandatory=$true)]
    [string]$ImagePath
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$StagingDir = Join-Path $Workspace "Bridge\asset_pipeline\2d_source_staging"

if (!(Test-Path $StagingDir)) {
    New-Item -ItemType Directory -Force -Path $StagingDir | Out-Null
}

if (Test-Path $ImagePath) {
    $FileName = Split-Path -Leaf $ImagePath
    $Destination = Join-Path $StagingDir $FileName
    Copy-Item -Path $ImagePath -Destination $Destination -Force
    Write-Host "[Success] Staged '$FileName' into pipeline for Unreal conversion." -ForegroundColor Green
} else {
    Write-Host "[Error] Image path not found: $ImagePath" -ForegroundColor Red
}
