param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet('Read','Write','Release')]
    [string]$Action,
    
    [string]$DataContent
)

function Invoke-SafeFileOperation {
    param(
        [string]$Path,
        [scriptblock]$Operation,
        [int]$MaxRetries = 5,
        [int]$DelayMs = 200
    )
    
    $Attempt = 0
    while ($Attempt -lt $MaxRetries) {
        try {
            return & $Operation
        } catch {
            $Attempt++
            if ($Attempt -ge $MaxRetries) {
                Write-Host "[File Lock Error] Failed to access locked file after $MaxRetries attempts: $Path" -ForegroundColor Red
                throw $_
            }
            Start-Sleep -Milliseconds ($DelayMs * $Attempt)
        }
    }
}

switch ($Action) {
    'Read' {
        Invoke-SafeFileOperation -Path $FilePath -Operation {
            if (Test-Path $FilePath) {
                Get-Content -Path $FilePath -Raw -Encoding utf8 -ErrorAction Stop
            } else {
                Write-Host "[Warning] File does not exist for reading: $FilePath" -ForegroundColor Yellow
                return $null
            }
        }
    }
    'Write' {
        Invoke-SafeFileOperation -Path $FilePath -Operation {
            $Dir = Split-Path $FilePath -Parent
            if (!(Test-Path $Dir)) { New-Item -ItemType Directory -Force -Path $Dir | Out-Null }
            Set-Content -Path $FilePath -Value $DataContent -Encoding utf8 -ErrorAction Stop
            Write-Host "[File Lock Success] Safely wrote content to $(Split-Path $FilePath -Leaf)" -ForegroundColor Green
        }
    }
    'Release' {
        # Force garbage collection handle release on stale file streams if needed
        [System.GC]::Collect()
        [System.GC]::WaitForPendingFinalizers()
        Write-Host "[Resource Release] Flushed file stream handles and released locks." -ForegroundColor Cyan
    }
}
