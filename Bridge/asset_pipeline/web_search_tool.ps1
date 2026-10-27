param(
    [Parameter(Mandatory=$true)]
    [string]$Query
)

$EncodedQuery = [System.Web.HttpUtility]::UrlEncode($Query)
# Using a public SearXNG instance endpoint or fallback API pattern for sovereign querying
$SearchUrl = "https://html.duckduckgo.com/html/?q=$EncodedQuery"

try {
    Write-Host "[Web Search] Querying live data for: '$Query'..." -ForegroundColor Cyan
    $Response = Invoke-WebRequest -Uri $SearchUrl -UserAgent "Mozilla/5.0" -UseBasicParsing -ErrorAction Stop
    
    # Extract basic result snippets from HTML response
    $ParsedResults = [regex]::Matches($Response.Content, '<a class="result__snippet[^>]*>(.*?)<\/a>')
    
    if ($ParsedResults.Count -gt 0) {
        Write-Host "[Web Search Success] Top results found:" -ForegroundColor Green
        for ($i = 0; $i -lt [Math]::Min(3, $ParsedResults.Count); $i++) {
            $Snippet = $ParsedResults[$i].Groups[1].Value -replace '<[^>]+>',''
            Write-Host "  -> $($Snippet.Trim())" -ForegroundColor White
        }
    } else {
        Write-Host "[Web Search] Query completed, but no direct snippets extracted." -ForegroundColor Yellow
    }
} catch {
    Write-Host "[Web Search Error] Failed to fetch search results: $_" -ForegroundColor Red
}
