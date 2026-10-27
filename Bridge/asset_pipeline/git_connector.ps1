param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
Set-Location $Workspace

# Check if git repository is initialized
if (!(Test-Path (Join-Path $Workspace ".git"))) {
    Write-Host "[Git Connector] Initializing new Git repository for Code510..." -ForegroundColor Cyan
    git init | Out-Null
}

try {
    # Stage all workspace modifications
    git add . | Out-Null
    
    # Check if there are changes to commit
    $Status = git status --porcelain
    if (-not $Status) {
        Write-Host "[Git Connector] No changes to commit. Working tree clean." -ForegroundColor Yellow
        return
    }
    
    # Commit changes
    git commit -m "[Code510 Pipeline] $CommitMessage" | Out-Null
    Write-Host "[Git Success] Milestone committed: $CommitMessage" -ForegroundColor Green
} catch {
    Write-Host "[Git Error] Failed to commit changes: $_" -ForegroundColor Red
}
