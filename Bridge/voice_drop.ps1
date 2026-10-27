param(
    [Parameter(Mandatory=$true)]
    [string]$IdeaText
)

$queuePath = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge\unreal_queue.json"

if (-not (Test-Path $queuePath)) {
    $initial = @{ call_stack = @() } | ConvertTo-Json -Depth 5
    Set-Content -Path $queuePath -Value $initial -Encoding utf8
}

$rawQueue = Get-Content -Path $queuePath -Raw
$queueData = $rawQueue | ConvertFrom-Json

$newTask = @{
    name = "voice_memo_task"
    parameters = @(
        @{ prompt = $IdeaText }
    )
    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
}

$stackList = @($queueData.call_stack) + $newTask
$queueData.call_stack = $stackList

$queueData | ConvertTo-Json -Depth 5 | Set-Content -Path $queuePath -Encoding utf8
Write-Host "[VoiceDrop] Successfully injected voice memo into queue: '$IdeaText'" -ForegroundColor Green