param(
    [Parameter(Mandatory=$true)]
    [string]$CardJsonPath
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$StateFile = Join-Path $Workspace "Bridge\asset_pipeline\studio_state.json"

# 1. Enforce On-Demand Gate: Must be active via F1 switch
$IsActive = $false
if (Test-Path $StateFile) {
    try {
        $StateData = Get-Content -Path $StateFile -Raw | ConvertFrom-Json
        $IsActive = $StateData.isActive
    } catch { $IsActive = $false }
}

if (-not $IsActive) {
    Write-Host "[Studio Dormant] Card validation blocked. Press F1 on your desktop control panel to activate the studio first." -ForegroundColor Yellow
    exit
}

Write-Host "================ TCG CARD VALIDATION & BALANCE ================" -ForegroundColor Cyan
Write-Host "Target Card File : $CardJsonPath" -ForegroundColor Yellow

if (!(Test-Path $CardJsonPath)) {
    Write-Host "[Error] Card definition file not found." -ForegroundColor Red
    exit
}

try {
    $Card = Get-Content -Path $CardJsonPath -Raw -Encoding utf8 | ConvertFrom-Json -ErrorAction Stop

    # 2. Schema Validation Checks
    $Required = @('cardId', 'cardName', 'cardCost', 'cardType')
    $Missing = foreach ($Prop in $Required) {
        if (-not $Card.psobject.properties[$Prop]) { $Prop }
    }

    if ($Missing) {
        Write-Host "[Validation Failed] Missing mandatory properties: $($Missing -join ', ')" -ForegroundColor Red
        exit
    }

    Write-Host "[Schema Check] All core properties present ($($Required -join ', '))" -ForegroundColor Green

    # 3. Balance Heuristic Check (Example rule: Cost vs Power ratio)
    if ($Card.cardCost -gt 10) {
        Write-Host "[Balance Warning] High cost card detected ($($Card.cardCost)). Verify high-impact effect balancing." -ForegroundColor Yellow
    } else {
        Write-Host "[Balance Check] Card cost ($($card.cardCost)) is within standard operating parameters." -ForegroundColor Green
    }

    Write-Host "===============================================================" -ForegroundColor Cyan
} catch {
    Write-Host "[Parse Error] Failed to read card JSON structure: $_" -ForegroundColor Red
}