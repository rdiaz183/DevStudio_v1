param(
    [string]$SolutionPath = "",
    [string]$Configuration = "Development",
    [string]$Platform = "Win64"
)

$workspaceDir = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
$queuePath = Join-Path $workspaceDir "Bridge\unreal_queue.json"

$solutionFile = $SolutionPath
if ([string]::IsNullOrWhiteSpace($solutionFile)) {
    $solutionFile = "C:\Users\rdiaz\Documents\Unreal Projects\test\Automation_test.sln"
}

if (-not (Test-Path $solutionFile)) {
    Write-Error "[VSBuilder] Critical: Solution file not found at $solutionFile"
    return
}

Write-Host "[VSBuilder] Targeting solution: $solutionFile" -ForegroundColor Cyan

$msbuildPath = "C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin\MSBuild.exe"
if (-not (Test-Path $msbuildPath)) {
    $vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
    if (Test-Path $vswhere) {
        $vsInstall = & $vswhere -latest -products * -requires Microsoft.Component.MSBuild -property installationPath
        if ($vsInstall) {
            $msbuildPath = Join-Path $vsInstall "MSBuild\Current\Bin\MSBuild.exe"
        }
    }
}

Write-Host "[VSBuilder] Compiling with MSBuild ($Configuration | $Platform)..." -ForegroundColor Yellow
& $msbuildPath $solutionFile /p:Configuration=$Configuration /p:Platform=$Platform /restore /maxCpuCount /verbosity:minimal

# Intelligent Fallback: If configuration/platform is invalid for this solution, retry with standard Debug / Any CPU
if ($LASTEXITCODE -ne 0) {
    Write-Warning "[VSBuilder] Initial build configuration ($Configuration | $Platform) failed or mismatch detected. Retrying with fallback (Debug | Any CPU)..."
    & $msbuildPath $solutionFile /p:Configuration="Debug" /p:Platform="Any CPU" /restore /maxCpuCount /verbosity:minimal
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "[VSBuilder] Solution build completed successfully!" -ForegroundColor Green
    if (Test-Path $queuePath) {
        $rawQueue = Get-Content -Path $queuePath -Raw
        if (-not [string]::IsNullOrWhiteSpace($rawQueue)) {
            $queueData = $rawQueue | ConvertFrom-Json
            $newTask = @{
                name = "vs_build_success"
                parameters = @{ solution = $solutionFile }
                timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            }
            $queueData.call_stack = @($queueData.call_stack) + $newTask
            $queueData | ConvertTo-Json -Depth 5 | Set-Content -Path $queuePath -Encoding utf8
        }
    }
} else {
    Write-Error "[VSBuilder] Build failed completely with exit code $LASTEXITCODE."
    exit $LASTEXITCODE
}