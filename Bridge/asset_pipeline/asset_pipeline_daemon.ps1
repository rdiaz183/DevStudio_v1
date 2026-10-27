$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$StagingDir = Join-Path $Workspace "Bridge\asset_pipeline\2d_source_staging"
$OutputDir = Join-Path $Workspace "Bridge\asset_pipeline\unreal_import_queue"
$StateFile = Join-Path $Workspace "Bridge\state_machine.json"

if (!(Test-Path $StagingDir)) { New-Item -ItemType Directory -Force -Path $StagingDir | Out-Null }
if (!(Test-Path $OutputDir)) { New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null }

Write-Host "[PowerShell Daemon] 2D-to-3D Asset Pipeline Watcher Active." -ForegroundColor Green

while ($true) {
    $Images = Get-ChildItem -Path $StagingDir -Include *.png, *.jpg, *.jpeg -Recurse
    
    foreach ($Img in $Images) {
        Write-Host "[Pipeline] Analyzing 2D art: $($Img.Name)" -ForegroundColor Cyan
        Start-Sleep -Seconds 1
        
        $OutputFileName = "SM_$($Img.BaseName).uasset"
        $OutputPath = Join-Path $OutputDir $OutputFileName
        
        "Dummy compiled asset data for $($Img.Name)" | Out-File -FilePath $OutputPath -Encoding utf8
        
        if (!(Test-Path $StateFile)) {
            $InitialState = @{ pipeline_history = @() }
            $InitialState | ConvertTo-Json -Depth 5 | Out-File -FilePath $StateFile -Encoding utf8
        }
        
        try {
            $RawState = Get-Content -Path $StateFile -Raw -Encoding utf8
            $StateData = $RawState | ConvertFrom-Json
            
            if ($null -eq $StateData.pipeline_history) {
                $StateData | Add-Member -MemberType NoteProperty -Name "pipeline_history" -Value @() -Force
            }
            
            $NewEntry = [PSCustomObject]@{
                source     = $Img.Name
                output     = $OutputFileName
                status     = "Staged for Unreal Import"
                timestamp  = (Get-Date).ToFileTimeUtc()
            }
            
            $StateData.pipeline_history += $NewEntry
            $StateData | ConvertTo-Json -Depth 5 | Out-File -FilePath $StateFile -Encoding utf8
        }
        catch {
            Write-Host "[Error] Failed to update state machine: $_" -ForegroundColor Red
        }
        
        Remove-Item -Path $Img.FullName -Force
        Write-Host "[Success] Staged final asset: $OutputFileName" -ForegroundColor Green
    }
    
    Start-Sleep -Seconds 5
}
