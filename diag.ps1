$ErrorActionPreference = 'SilentlyContinue'
Write-Output "--- WINDOWS ---"
Get-Process | Where-Object { $_.MainWindowTitle -ne '' } | Select-Object -Property ProcessName, MainWindowTitle | Format-Table
Write-Output "--- HARDWARE ---"
$cam = @(Get-CimInstance Win32_PnPEntity | Where-Object { $_.Service -eq 'usbvideo' -or $_.Caption -match 'Camera' }).Count
$mic = @(Get-CimInstance Win32_PnPEntity | Where-Object { $_.Caption -match 'Microphone|Micr|Audio|Headset|Hands-Free' }).Count
Write-Output "CamCount: $cam, MicCount: $mic"
Write-Output "--- EVENTS ---"
Get-WinEvent -LogName "Microsoft-Windows-TWinUI/Operational" -MaxEvents 1 | Select-Object -Property TimeCreated, Message | Format-List
