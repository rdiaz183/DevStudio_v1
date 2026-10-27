param(
    [Parameter(Mandatory=$true)]
    [string]$AudioFilePath,
    
    [string]$TargetQueue = "card_design_queue"
)

$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$SttQueueDir = Join-Path $Workspace "Bridge\asset_pipeline\stt_queue"
if (!(Test-Path $SttQueueDir)) { New-Item -ItemType Directory -Force -Path $SttQueueDir | Out-Null }

if (!(Test-Path $AudioFilePath)) {
    Write-Host "[STT Error] Audio file not found at: $AudioFilePath" -ForegroundColor Red
    return
}

$FileName = Split-Path $AudioFilePath -Leaf
$DestinationAudio = Join-Path $SttQueueDir $FileName

try {
    Copy-Item -Path $AudioFilePath -Destination $DestinationAudio -Force
    
    # Create metadata task wrapper for transcription worker
    $MetaPath = Join-Path $SttQueueDir "$([System.IO.Path]::GetFileNameWithoutExtension($FileName)).json"
    $MetaPayload = @{
        audioFile = $DestinationAudio
        targetQueue = $TargetQueue
        timestamp = (Get-Date).ToString("o")
        status = "PendingTranscription"
    } | ConvertTo-Json
    
    Set-Content -Path $MetaPath -Value $MetaPayload -Encoding utf8
    
    Write-Host "================ AUDIO STAGED FOR STT ================" -ForegroundColor Cyan
    Write-Host "File    : $FileName" -ForegroundColor Yellow
    Write-Host "Target  : $TargetQueue" -ForegroundColor White
    Write-Host "Staged  : $SttQueueDir" -ForegroundColor Green
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "[STT Success] Voice note queued for background transcription." -ForegroundColor Green
} catch {
    Write-Host "[STT Error] Failed to stage audio file: $_" -ForegroundColor Red
}
