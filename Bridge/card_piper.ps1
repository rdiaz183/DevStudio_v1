param(
    [string]$CardFile = "card_deck_1.json"
)

$workspaceDir = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$cardPath = Join-Path $workspaceDir "CardData\$CardFile"
$queuePath = Join-Path $workspaceDir "Bridge\unreal_queue.json"

if (-not (Test-Path $cardPath)) {
    Write-Error "Card data file '$CardFile' not found in CardData/!"
    return
}

$deckData = Get-Content -Path $cardPath -Raw | ConvertFrom-Json
$rawQueue = Get-Content -Path $queuePath -Raw
$queueData = $rawQueue | ConvertFrom-Json

foreach ($card in $deckData.cards) {
    Write-Host "[CardPiper] Queuing card layout for: $($card.card_name) (Cost: $($card.cost))" -ForegroundColor Cyan

    $newTask = @{
        name = "spawn_card_mesh"
        parameters = @{
            card_id = $card.card_id
            card_name = $card.card_name
            cost = $card.cost
            attack = $card.attack
            defense = $card.defense
            artwork_path = $card.artwork_path
        }
        timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }

    $queueData.call_stack = @($queueData.call_stack) + $newTask
}

$queueData | ConvertTo-Json -Depth 6 | Set-Content -Path $queuePath -Encoding utf8
Write-Host "[CardPiper] Successfully queued TCG deck data for Unreal rendering!" -ForegroundColor Green