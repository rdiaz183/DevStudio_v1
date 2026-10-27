param(
    [Parameter(Mandatory=$true)]
    [string]$TemplateName,
    [hashtable]$Tokens
)

$path = "C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge\templates\$TemplateName"
if (-not (Test-Path $path)) {
    Write-Error "Template '$TemplateName' not found!"
    return
}

$content = Get-Content -Path $path -Raw
foreach ($key in $Tokens.Keys) {
    $content = $content.Replace("{$key}", $Tokens[$key])
}

return $content