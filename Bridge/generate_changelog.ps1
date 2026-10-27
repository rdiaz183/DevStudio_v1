param(
    [string]$Version = "v0.1.0",
    [string]$ReleaseNotes = "Automated pipeline task synchronization."
)

$workspaceDir = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$changelogPath = Join-Path$workspaceDir "CHANGELOG.md"
$queuePath = Join-Path$workspaceDir "Bridge\unreal_queue.json"

$timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")

# Read queue if available to list processed actions
$tasksSummary = "- Routine system maintenance and pipeline health checks."
if (Test-Path $queuePath) {
    $raw = Get-Content -Path$queuePath -Raw
    if (-not [string]::IsNullOrWhiteSpace($raw)) {
        $data =$raw | ConvertFrom-Json
        if ($data.call_stack -and$data.call_stack.Count -gt 0) {
            $taskNames =$data.call_stack | ForEach-Object { "- Task: $($_.name) [$($_.timestamp)]" }
            $tasksSummary =$taskNames -join "`n"
        }
    }
}

$entry = @"

## [$Version] - $timestamp
- **Summary:** $ReleaseNotes
### Queue Activity
$tasksSummary
"@

if (-not (Test-Path $changelogPath)) {
    "# Code510 Project Changelog`n" | Set-Content -Path $changelogPath -Encoding utf8
}

Add-Content -Path $changelogPath -Value$entry -Encoding utf8
Write-Host "[Changelog] Successfully updated CHANGELOG.md for version $Version" -ForegroundColor Green