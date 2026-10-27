param(
    [Parameter(Mandatory=$true)]
    [scriptblock]$Operation,
    
    [int]$MaxRetries = 5,
    [int]$InitialDelayMs = 200
)

$Attempt = 0
$Delay = $InitialDelayMs

while ($Attempt -lt $MaxRetries) {
    try {
        $Attempt++
        Write-Host "[Retry Handler] Executing operation (Attempt $Attempt/$MaxRetries)..." -ForegroundColor Cyan
        return & $Operation
    } catch {
        if ($Attempt -ge $MaxRetries) {
            Write-Host "[Retry Fatal] Operation failed completely after $MaxRetries attempts: $_" -ForegroundColor Red
            throw $_
        }
        
        Write-Host "[Retry Warning] Operation encountered lock/clash. Retrying in ${Delay}ms..." -ForegroundColor Yellow
        Start-Sleep -Milliseconds $Delay
        # Exponential backoff multiplier
        $Delay = $Delay * 2
    }
}
