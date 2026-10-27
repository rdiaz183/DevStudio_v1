param(
    [Parameter(Mandatory=$true)]
    [string]$Title,
    [Parameter(Mandatory=$true)]
    [string]$Message,
    [ValidateSet("Info", "Success", "Error")]
    [string]$Type = "Info"
)

# Play system audio chime based on notification type
switch ($Type) {
    "Success" { [System.Media.SystemSounds]::Asterisk.Play(); break }
    "Error"   { [System.Media.SystemSounds]::Hand.Play(); break }
    default   { [System.Media.SystemSounds]::Beep.Play(); break }
}

# Display Windows Toast / Balloon Notification
Add-Type -AssemblyName System.Windows.Forms
$global:balloon = New-Object System.Windows.Forms.NotifyIcon
$global:balloon.Icon = [System.Drawing.SystemIcons]::Information
$global:balloon.Visible = $true

$tooltip = switch ($Type) {
    "Success" { [System.Windows.Forms.ToolTipIcon]::Info }
    "Error"   { [System.Windows.Forms.ToolTipIcon]::Error }
    default   { [System.Windows.Forms.ToolTipIcon]::None }
}

$global:balloon.ShowBalloonTip(3000, $Title, $Message, $tooltip)
Start-Sleep -Seconds 1
$global:balloon.Dispose()