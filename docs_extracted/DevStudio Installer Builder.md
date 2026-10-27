<# .SYNOPSIS Dev Studio v1 - Windows Desktop Installer Package Creator UI Application Target: 16TB SSD on D:\\ drive (Strict 6.0 GB VRAM optimization) .DESCRIPTION Builds a standalone graphical Windows Forms application (.NET) that manages backend configurations, inventory modules, VRAM limiters, and compiles everything into a fully structured ZIP distribution package on D:\\DevStudio_v1_Installer_Package.zip. #>

Add-Type -AssemblyName System.Windows.Forms Add-Type -AssemblyName System.Drawing

# Create Main Form

\$form = New-Object System.Windows.Forms.Form $form.Text = "Dev Studio v1 - Windows Desktop Installer Creator" $form.Size = New-Object System.Drawing.Size(750, 650)$form.StartPosition = "CenterScreen" $form.BackColor = \[System.Drawing.Color\]::FromArgb(30, 30, 30) $form.ForeColor = \[System.Drawing.Color\]::FromArgb(240, 240, 240)$form.FormBorderStyle = \[System.Windows.Forms.FormBorderStyle\]::FixedDialog $form.MaximizeBox =$false

# Title Label

\$lblTitle = New-Object System.Windows.Forms.Label $lblTitle.Text = "DEV STUDIO v1 - INSTALLER & PACKAGE CREATOR" $lblTitle.Font = New-Object System.Drawing.Font("Segoe UI", 14, \[System.Drawing.FontStyle\]::Bold) $lblTitle.ForeColor = \[System.Drawing.Color\]::FromArgb(79, 195, 247) $lblTitle.Location = New-Object System.Drawing.Point(20, 20)$lblTitle.Size = New-Object System.Drawing.Size(700, 30) $form.Controls.Add($lblTitle)

# Target Drive GroupBox

\$gbDrive = New-Object System.Windows.Forms.GroupBox $gbDrive.Text = " 16TB SSD Target Configuration (D:\\ Drive) " $gbDrive.ForeColor = \[System.Drawing.Color\]::FromArgb(255, 183, 77) $gbDrive.Location = New-Object System.Drawing.Point(20, 65)$gbDrive.Size = New-Object System.Drawing.Size(690, 90) $form.Controls.Add($gbDrive)

\$lblDrivePath = New-Object System.Windows.Forms.Label $lblDrivePath.Text = "Workspace Root: D:\\DevStudio_v1_Workspace" $lblDrivePath.Location = New-Object System.Drawing.Point(15, 30)$lblDrivePath.Size = New-Object System.Drawing.Size(400, 20) $gbDrive.Controls.Add($lblDrivePath)

\$lblVram = New-Object System.Windows.Forms.Label $lblVram.Text = "VRAM Limit: 6.0 GB Strict Cap" $lblVram.Location = New-Object System.Drawing.Point(430, 30)$lblVram.Size = New-Object System.Drawing.Size(240, 20) $gbDrive.Controls.Add($lblVram)

# Modules Checklist GroupBox

\$gbModules = New-Object System.Windows.Forms.GroupBox $gbModules.Text = " Included Modules & Open-Source Inventory " $gbModules.ForeColor = \[System.Drawing.Color\]::FromArgb(255, 183, 77) $gbModules.Location = New-Object System.Drawing.Point(20, 170)$gbModules.Size = New-Object System.Drawing.Size(690, 200) $form.Controls.Add($gbModules)

\$chkList = New-Object System.Windows.Forms.CheckedListBox $chkList.Location = New-Object System.Drawing.Point(15, 25)$chkList.Size = New-Object System.Drawing.Size(660, 155) $chkList.BackColor = \[System.Drawing.Color\]::FromArgb(45, 45, 45)$chkList.ForeColor = \[System.Drawing.Color\]::FromArgb(240, 240, 240)