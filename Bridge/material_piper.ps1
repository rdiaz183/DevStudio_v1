# Code510 PowerShell Material Piper
$workspaceDir = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$textureDir = Join-Path $workspaceDir "Textures"
$queuePath = Join-Path $workspaceDir "Bridge\unreal_queue.json"

if (-not (Test-Path $textureDir)) {
    New-Item -ItemType Directory -Path $textureDir | Out-Null
    Write-Host "[MaterialPiper] Created Textures directory." -ForegroundColor Yellow
    return
}

$textures = Get-ChildItem -Path $textureDir -File -Include "*.png", "*.tga", "*.jpg"
if ($textures.Count -eq 0) {
    Write-Host "[MaterialPiper] No textures found in Textures/ directory." -ForegroundColor Yellow
    return
}

$rawQueue = Get-Content -Path $queuePath -Raw
$queueData = $rawQueue | ConvertFrom-Json

foreach ($tex in $textures) {
    if ($tex.Name -match "_BaseColor|_BC") {
        $matName = "M_" + $tex.BaseName -replace "_BaseColor|_BC", ""
        Write-Host "[MaterialPiper] Detected BaseColor texture for material: $matName" -ForegroundColor Cyan

        $newTask = @{
            name = "generate_material"
            parameters = @{
                material_name = $matName
                base_color_path = "/Game/Code510/Textures/$($tex.BaseName)"
            }
            timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        }

        $queueData.call_stack = @($queueData.call_stack) + $newTask
    }
}

$queueData | ConvertTo-Json -Depth 5 | Set-Content -Path $queuePath -Encoding utf8
Write-Host "[MaterialPiper] Successfully queued material generation tasks!" -ForegroundColor Green