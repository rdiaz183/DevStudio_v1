param(
    [Parameter(Mandatory=$true)]
    [string]$PythonScriptPath
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$UnrealRemoteEndpoint = "http://localhost:30030/remote/object/call" # Default Unreal Remote Control API endpoint

if (!(Test-Path $PythonScriptPath)) {
    Write-Host "[Unreal Error] Python script not found at: $PythonScriptPath" -ForegroundColor Red
    return
}

$ScriptContent = Get-Content -Path $PythonScriptPath -Raw -Encoding utf8

$Payload = @{
    objectPath = "/Script/PythonScriptPlugin.DefaultPythonScriptPlugin"
    functionName = "ExecPythonCommand"
    parameters = @{
        Command = $ScriptContent
    }
} | ConvertTo-Json

try {
    Write-Host "[Unreal Connector] Sending payload to Unreal Engine Remote Control..." -ForegroundColor Cyan
    # Attempt connection to running Unreal Editor instance
    $Response = Invoke-RestMethod -Uri $UnrealRemoteEndpoint -Method Post -Body $Payload -ContentType "application/json" -ErrorAction Stop
    Write-Host "[Unreal Success] Command executed inside Unreal viewport!" -ForegroundColor Green
} catch {
    Write-Host "[Unreal Notice] Unreal Editor remote endpoint inactive. Staging script for daemon execution when project opens..." -ForegroundColor Yellow
    
    # Fallback staging for local execution when the project boots
    $StagedDir = Join-Path $Workspace "Bridge\unreal_connector\staged_scripts"
    if (!(Test-Path $StagedDir)) { New-Item -ItemType Directory -Force -Path $StagedDir | Out-Null }
    
    Copy-Item -Path $PythonScriptPath -Destination $StagedDir -Force
    Write-Host "[Unreal Staging] Script staged successfully in: $StagedDir" -ForegroundColor Green
}
