param(
    [Parameter(Mandatory=$true)]
    [string]$VideoUrl
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$EncodedUrl = [System.Web.HttpUtility]::UrlEncode($VideoUrl)
$OEmbedUrl = "https://www.youtube.com/oembed?url=$EncodedUrl&format=json"

try {
    Write-Host "[YouTube Tool] Fetching video metadata..." -ForegroundColor Cyan
    $Response = Invoke-RestMethod -Uri $OEmbedUrl -ErrorAction Stop
    
    Write-Host "================ YOUTUBE VIDEO METADATA ================" -ForegroundColor Cyan
    Write-Host "Title   : $($Response.title)" -ForegroundColor Green
    Write-Host "Author  : $($Response.author_name)" -ForegroundColor Yellow
    Write-Host "URL     : $VideoUrl" -ForegroundColor White
    Write-Host "========================================================" -ForegroundColor Cyan
    
    # Log research to workspace scratchpad
    $ResearchLog = Join-Path $Workspace "Bridge\asset_pipeline\youtube_research_log.txt"
    $LogEntry = "$(Get-Date): Analyzed video '$($Response.title)' by $($Response.author_name) [$VideoUrl]"
    Add-Content -Path $ResearchLog -Value $LogEntry -Encoding utf8
    Write-Host "[YouTube Success] Video info logged to research scratchpad." -ForegroundColor Green
} catch {
    Write-Host "[YouTube Error] Failed to fetch video metadata: $_" -ForegroundColor Red
}
