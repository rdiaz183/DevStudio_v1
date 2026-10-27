param(
    [string]$SessionNote = "Routine studio automation run."
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$JournalDir = Join-Path $Workspace "Bridge\asset_pipeline\journals"
if (!(Test-Path $JournalDir)) { New-Item -ItemType Directory -Force -Path $JournalDir | Out-Null }

$Timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$FileTimestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$JournalFile = Join-Path $JournalDir "journal_$FileTimestamp.md"

$JournalContent = @"
# Code510 Studio Journal Entry
- **Timestamp:** $Timestamp
- **Session Note:** $SessionNote
- **Workspace:** $Workspace

## Status Summary
- Automated pipeline monitors active.
- State machine synchronized.
- Ready for next design cycle.
"@

try {
    Set-Content -Path $JournalFile -Value $JournalContent -Encoding utf8
    Write-Host "================ SESSION JOURNAL CREATED ================" -ForegroundColor Cyan
    Write-Host "Log Note : $SessionNote" -ForegroundColor Yellow
    Write-Host "Saved To : $JournalFile" -ForegroundColor Green
    Write-Host "=========================================================" -ForegroundColor Cyan
} catch {
    Write-Host "[Journal Error] Failed to write session journal: $_" -ForegroundColor Red
}
