param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('Store','Search')]
    [string]$Action,
    
    [string]$Key,
    [string]$Content
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$MemoryDbDir = Join-Path $Workspace "Bridge\asset_pipeline\vector_memory"
if (!(Test-Path $MemoryDbDir)) { New-Item -ItemType Directory -Force -Path $MemoryDbDir | Out-Null }
$MemoryFile = Join-Path $MemoryDbDir "rag_store.json"

function Get-MemoryStore {
    if (Test-Path $MemoryFile) {
        try {
            return Get-Content -Path $MemoryFile -Raw -Encoding utf8 | ConvertFrom-Json -ErrorAction Stop
        } catch {
            return @{}
        }
    }
    return @{}
}

function Save-MemoryStore {
    param($Store)
    $Store | ConvertTo-Json -Depth 10 | Set-Content -Path $MemoryFile -Encoding utf8
}

switch ($Action) {
    'Store' {
        if (-not $Key -or -not $Content) {
            Write-Host "[Memory Error] Both -Key and -Content are required for storing memory." -ForegroundColor Red
            return
        }
        $Store = Get-MemoryStore
        $Store.$Key = @{
            content = $Content
            updated = (Get-Date).ToString("o")
        }
        Save-MemoryStore -Store $Store
        Write-Host "[Memory Success] Stored rule/lore entry under key: '$Key'" -ForegroundColor Green
    }
    'Search' {
        $Store = Get-MemoryStore
        Write-Host "================ VECTOR RAG MEMORY STORE ================" -ForegroundColor Cyan
        $Keys = $Store.psobject.properties.name
        if (-not $Keys) {
            Write-Host "Memory store is currently empty." -ForegroundColor Yellow
        } else {
            foreach ($K in $Keys) {
                if (-not $Key -or $K -like "*$Key*") {
                    Write-Host "Key: $K" -ForegroundColor Yellow
                    Write-Host "-> $($Store.$K.content)" -ForegroundColor White
                    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
                }
            }
        }
        Write-Host "=========================================================" -ForegroundColor Cyan
    }
}
