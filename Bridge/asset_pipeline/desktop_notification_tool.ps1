param(
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$true)]
    [string]$Message,
    
    [ValidateSet('Info','Success','Warning','Error')]
    [string]$Type = 'Success'
)

# Play system audio chime based on notification type
switch ($Type) {
    'Success' { [System.Media.SystemSounds]::Asterisk.Play() }
    'Warning' { [System.Media.SystemSounds]::Exclamation.Play() }
    'Error'   { [System.Media.SystemSounds]::Hand.Play() }
    default   { [System.Media.SystemSounds]::Beep.Play() }
}

# Trigger Windows Toast Notification using PowerShell PresentationFramework
try {
    Add-Type -AssemblyName System.Windows.Forms
    $BalloonIcon = switch ($Type) {
        'Success' { [System.Windows.Forms.ToolTipIcon]::Info }
        'Warning' { [System.Windows.Forms.ToolTipIcon]::Warning }
        'Error'   { [System.Windows.Forms.ToolTipIcon]::Error }
        default   { [System.Windows.Forms.ToolTipIcon]::None }
    }

    $NotifyIcon = New-Object System.Windows.Forms.NotifyIcon
    $NotifyIcon.Icon = [System.Drawing.SystemIcons]::Application
    $NotifyIcon.Visible = $true
    $NotifyIcon.ShowBalloonTip(3000, "Code510 Studio: $Title", $Message, $BalloonIcon)
    
    Write-Host "[Notification] Sent desktop alert: '$Title - $Message'" -ForegroundColor Green
} catch {
    Write-Host "[Notification Fallback] $Title: $Message" -ForegroundColor Cyan
}
