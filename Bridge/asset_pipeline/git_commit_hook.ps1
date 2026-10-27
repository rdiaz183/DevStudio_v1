param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage,
    
    [string]$TargetSubDir = "."
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
Set-Location $Workspace

try {
    Write-Host "[Git Hook] Checking repository status..." -ForegroundColor Cyan
    
    # Check if git is initialized
    if (!(Test-Path (Join-Path $Workspace ".git"))) {
        Write-Host "[Git Notice] Initializing local Git repository for Code510 Studio..." -ForegroundColor Yellow
        git init | Out-Null
    }
    
    # Stage changes
    git add $TargetSubDir | Out-Null
    
    # Check if there are changes to commit
    $Status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($Status)) {
        Write-Host "[Git Info] No changes detected to commit." -ForegroundColor Yellow
        return
    }
    
    # Commit changes
    $FullMessage = "[Code510 Autonomous Studio] $CommitMessage"
    git commit -m $FullMessage | Out-Null
    
    Write-Host "================ GIT COMMIT SUCCESS ================" -ForegroundColor Green
    Write-Host "Message : $FullMessage" -ForegroundColor White
    Write-Host "====================================================" -ForegroundColor Green
} catch {
    Write-Host "[Git Error] Failed to complete automated commit: $_" -ForegroundColor Red
}
