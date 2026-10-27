$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
Write-Host "=== STUDIO STATUS AUDIT (FIXED) ===" -ForegroundColor Yellow

$departments = @(
    "01_Studio_Inbox",
    "02_Ideation_Brainstorming",
    "03_Narrative_And_Writing",
    "04_Art_And_Visuals",
    "05_Engineering_And_Code"
)

foreach ($dept in $departments) {
    $path = Join-Path $Workspace $dept
    if (Test-Path $path) {
        $count = (Get-ChildItem -Path $path -Recurse -File).Count
        Write-Host "$dept : $count files tracked" -ForegroundColor Cyan
    } else {
        Write-Host "$dept : Directory missing" -ForegroundColor Red
    }
}

$managerPath = Join-Path $Workspace "00_Studio_Core\00_manager_sovereign.md"
if (Test-Path $managerPath) {
    Write-Host "`n--- Sovereign Manager Log ---" -ForegroundColor Yellow
    Get-Content $managerPath | Select-Object -First 5
}
