param(
    [string]$FeedUrl = "https://unrealengine.com/en-US/rss"
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$NewsLogDir = Join-Path $Workspace "Bridge\asset_pipeline\news_feed"
if (!(Test-Path $NewsLogDir)) { New-Item -ItemType Directory -Force -Path $NewsLogDir | Out-Null }

try {
    Write-Host "[RSS Aggregator] Fetching feed from: $FeedUrl..." -ForegroundColor Cyan
    [xml]$RSSFeed = Invoke-RestMethod -Uri $FeedUrl -ErrorAction Stop
    
    $Items = $RSSFeed.rss.channel.item
    if (-not $Items) {
        $Items = $RSSFeed.feed.entry # Support Atom feeds as fallback
    }
    
    Write-Host "================ RECENT FEED UPDATES ================" -ForegroundColor Cyan
    $Count = 0
    foreach ($Item in $Items) {
        if ($Count -ge 5) { break }
        $Title = $Item.title
        $Link = if ($Item.link.href) { $Item.link.href } else { $Item.link }
        
        Write-Host "-> $Title" -ForegroundColor Green
        Write-Host "   $Link" -ForegroundColor White
        
        $Count++
    }
    Write-Host "=====================================================" -ForegroundColor Cyan
    Write-Host "[RSS Success] Feed successfully parsed and displayed." -ForegroundColor Green
} catch {
    Write-Host "[RSS Error] Failed to fetch or parse RSS feed: $_" -ForegroundColor Red
}
