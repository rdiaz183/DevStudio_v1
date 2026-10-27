$Workspace = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$StagingDir = Join-Path $Workspace "Bridge\asset_pipeline\2d_source_staging"
$OutputDir = Join-Path $Workspace "Bridge\asset_pipeline\unreal_import_queue"
$StateFile = Join-Path $Workspace "Bridge\state_machine.json"

function Get-Code510Status {
    if (!(Test-Path $StagingDir)) { New-Item -ItemType Directory -Force -Path $StagingDir | Out-Null }
    if (!(Test-Path $OutputDir)) { New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null }
    
    $StagingFiles = Get-ChildItem -Path $StagingDir | Select-Object -ExpandProperty Name
    $QueueFiles = Get-ChildItem -Path $OutputDir | Select-Object -ExpandProperty Name
    
    Write-Host "================ CODE510 WORKSPACE STATUS ================" -ForegroundColor Cyan
    Write-Host "Staging Folder     : $(if($StagingFiles){$StagingFiles -join ', '}else{'Empty'})" -ForegroundColor Yellow
    Write-Host "Unreal Import Queue: $(if($QueueFiles){$QueueFiles -join ', '}else{'Empty'})" -ForegroundColor Yellow
    
    if (Test-Path $StateFile) {
        Write-Host "State Machine      : Active & Found" -ForegroundColor Green
        $StateData = Get-Content -Path $StateFile -Raw -Encoding utf8 | ConvertFrom-Json
        if ($StateData.pipeline_history) {
            Write-Host "Recent History Entries: $($StateData.pipeline_history.Count)" -ForegroundColor White
        }
    } else {
        Write-Host "State Machine      : Not Found" -ForegroundColor Red
    }
    Write-Host "==========================================================" -ForegroundColor Cyan
}

function Stage-Code510Asset {
    param([Parameter(Mandatory=$true)][string]$ImagePath)
    if (!(Test-Path $ImagePath)) {
        Write-Host "[Error] Image path not found: $ImagePath" -ForegroundColor Red
        return
    }
    if (!(Test-Path $StagingDir)) { New-Item -ItemType Directory -Force -Path $StagingDir | Out-Null }
    
    $FileName = Split-Path -Leaf $ImagePath
    $Dest = Join-Path $StagingDir $FileName
    Copy-Item -Path $ImagePath -Destination $Dest -Force
    Write-Host "[Success] Staged '$FileName' into pipeline for processing." -ForegroundColor Green
}

function Move-Code510Asset {
    param(
        [Parameter(Mandatory=$true)][string]$FileName,
        [Parameter(Mandatory=$true)][ValidateSet('staging','queue')][string]$SourceFolder,
        [Parameter(Mandatory=$true)][string]$DestinationRelativePath
    )
    $SrcBase = if($SourceFolder -eq 'staging') { $StagingDir } else { $OutputDir }
    $SrcPath = Join-Path $SrcBase $FileName
    
    if (!(Test-Path $SrcPath)) {
        Write-Host "[Error] File '$FileName' not found in $SourceFolder." -ForegroundColor Red
        return
    }
    
    $DestPath = Join-Path $Workspace "$DestinationRelativePath\$FileName"
    $DestDir = Split-Path $DestPath -Parent
    if (!(Test-Path $DestDir)) { New-Item -ItemType Directory -Force -Path $DestDir | Out-Null }
    
    Move-Item -Path $SrcPath -Destination $DestPath -Force
    Write-Host "[Success] Moved '$FileName' to $DestinationRelativePath" -ForegroundColor Green
}
