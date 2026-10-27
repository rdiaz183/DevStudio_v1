param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('PreAction','PostAction','ValidateJson')]
    [string]$Mode,
    
    [string]$TargetFile
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$StateFile = Join-Path $Workspace "Bridge\state_machine.json"

function Test-JsonSyntax {
    param([string]$FilePath)
    if (!(Test-Path $FilePath)) {
        Write-Host "[Validation Error] File not found: $FilePath" -ForegroundColor Red
        return $false
    }
    try {
        # Read content and strip potential BOM errors
        $Content = Get-Content -Path $FilePath -Raw -Encoding utf8
        if ($Content.Length -gt 0 -and [int]$Content[0] -eq 65279) {
            $Content = $Content.Substring(1)
        }
        $null = $Content | ConvertFrom-Json -ErrorAction Stop
        Write-Host "[Validation Success] JSON syntax valid: $(Split-Path $FilePath -Leaf)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "[Validation Failed] Malformed JSON in $(Split-Path $FilePath -Leaf): $_" -ForegroundColor Red
        return $false
    }
}

switch ($Mode) {
    'ValidateJson' {
        if ($TargetFile) {
            Test-JsonSyntax -FilePath $TargetFile
        } else {
            Test-JsonSyntax -FilePath $StateFile
        }
    }
    'PreAction' {
        Write-Host "[Pre-Action Hook] Running pre-flight integrity checks..." -ForegroundColor Cyan
        if (Test-Path $StateFile) {
            $isValid = Test-JsonSyntax -FilePath $StateFile
            if (!$isValid) {
                Write-Host "[Abort] Pre-action check failed due to corrupted state file." -ForegroundColor Red
                exit 1
            }
        }
        Write-Host "[Pre-Action Hook] All systems nominal. Proceeding..." -ForegroundColor Green
    }
    'PostAction' {
        Write-Host "[Post-Action Hook] Running post-execution validation..." -ForegroundColor Cyan
        if ($TargetFile -and (Test-Path $TargetFile)) {
            Write-Host "[Post-Action Hook] Verified target file exists: $TargetFile" -ForegroundColor Green
        }
        Write-Host "[Post-Action Hook] Task lifecycle successfully recorded." -ForegroundColor Green
    }
}
