param(
    [Parameter(Mandatory=$true)]
    [string]$AssetJsonPath
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"

Write-Host "================ ASSET SCHEMA VALIDATOR ================" -ForegroundColor Cyan
Write-Host "Validating Asset : $AssetJsonPath" -ForegroundColor Yellow

if (!(Test-Path $AssetJsonPath)) {
    Write-Host "[Validation Error] Asset file not found at path." -ForegroundColor Red
    return
}

try {
    $AssetData = Get-Content -Path $AssetJsonPath -Raw -Encoding utf8 | ConvertFrom-Json -ErrorAction Stop
    
    # Enforce mandatory trading card game asset schema properties
    $RequiredProps = @('cardId', 'cardName', 'cardCost', 'cardType')
    $Missing = foreach ($Prop in $RequiredProps) {
        if (-not $AssetData.psobject.properties[$Prop]) { $Prop }
    }

    if ($Missing) {
        Write-Host "[Validation Failed] Asset missing required schema properties: $($Missing -join ', ')" -ForegroundColor Red
    } else {
        Write-Host "[Validation Success] Asset schema is fully compliant with studio standards." -ForegroundColor Green
    }
} catch {
    Write-Host "[Validation Error] Failed to parse asset JSON syntax: $_" -ForegroundColor Red
}
Write-Host "========================================================" -ForegroundColor Cyan
