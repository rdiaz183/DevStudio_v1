param(
    [Parameter(Mandatory=$true)]
    [string]$Prompt,
    
    [string]$NegativePrompt = "blurry, low quality, distorted",
    
    [string]$OutputFilename = "card_asset_$(Get-Date -Format 'yyyyMMdd_HHmmss').png"
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$ArtQueueDir = Join-Path $Workspace "Bridge\asset_pipeline\art_queue"
if (!(Test-Path $ArtQueueDir)) { New-Item -ItemType Directory -Force -Path $ArtQueueDir | Out-Null }

$LocalSDApi = "http://127.0.0.1:7860/sdapi/v1/txt2img"

$Payload = @{
    prompt = $Prompt
    negative_prompt = $NegativePrompt
    steps = 30
    width = 512
    height = 768
} | ConvertTo-Json

try {
    Write-Host "[Image Gen] Connecting to local generation backend..." -ForegroundColor Cyan
    $Response = Invoke-RestMethod -Uri $LocalSDApi -Method Post -Body $Payload -ContentType "application/json" -ErrorAction Stop
    
    if ($Response.images) {
        $Base64Image = $Response.images[0]
        $ImageBytes = [Convert]::FromBase64String($Base64Image)
        $FinalOutputPath = Join-Path $ArtQueueDir $OutputFilename
        [System.IO.File]::WriteAllBytes($FinalOutputPath, $ImageBytes)
        
        Write-Host "[Image Success] Asset generated and saved to: $FinalOutputPath" -ForegroundColor Green
    }
} catch {
    Write-Host "[Image Notice] Local SD backend inactive. Staging prompt for autonomous queue processing..." -ForegroundColor Yellow
    
    $StagedJsonPath = Join-Path $ArtQueueDir "$([System.IO.Path]::GetFileNameWithoutExtension($OutputFilename)).json"
    $Payload | Set-Content -Path $StagedJsonPath -Encoding utf8
    
    Write-Host "[Art Staging] Prompt logged to queue: $StagedJsonPath" -ForegroundColor Green
}
