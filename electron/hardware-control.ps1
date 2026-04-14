
# Notchly Hardware Control Maestro v8.4 (Technical Rescue)
Param([string]$Target, [string]$Action)

$LogFile = "$PSScriptRoot\hardware_log.txt"
function Log-Msg($m) { 
    $ts = Get-Date -Format "HH:mm:ss"
    "[$ts] $m" | Out-File -FilePath $LogFile -Append -Encoding utf8
}

Log-Msg "--- Technical Execution Started ($Target, $Action) ---"

# Safe Method Invoker for PS 5.1/7.0+ Compatibility
function Invoke-WinRT($obj, $methodName) {
    if (-not $obj) { return $null }
    try {
        # Try direct call first (PS 7+)
        return $obj.$methodName()
    } catch {
        # Fallback to Reflection (PS 5.1)
        try {
            return $obj.GetType().InvokeMember($methodName, [System.Reflection.BindingFlags]::InvokeMethod, $null, $obj, $null)
        } catch {
            Log-Msg "Failed to invoke ${methodName}: $($_.Exception.Message)"
            return $null
        }
    }
}

function Set-RadioState {
    param($RadioKind, $NewState)
    
    try {
        [void][Windows.Devices.Radios.Radio, Windows.Devices.Radios, ContentType=WindowsRuntime]
        $op = [Windows.Devices.Radios.Radio]::GetRadiosAsync()
        while($op.Status -eq 'Started') { Start-Sleep -m 10 }
        $rads = Invoke-WinRT $op "GetResults"
        
        # USE ENUMS for 100% ID Success
        $enumKind = if($RadioKind -eq "WiFi") { [Windows.Devices.Radios.RadioKind]::WiFi } else { [Windows.Devices.Radios.RadioKind]::Bluetooth }
        $r = $rads | Where-Object { $_.Kind -eq $enumKind }
        
        if ($r) {
            $st = $NewState
            if ($NewState -eq "toggle") { $st = if($r.State -eq 'On') { 'Off' } else { 'On' } }
            Log-Msg "Toggling $RadioKind ($enumKind) to $st via WinRT"
            
            $task = $r.SetStateAsync($st)
            while($task.Status -eq 'Started') { Start-Sleep -m 10 }
            $res = Invoke-WinRT $task "GetResults"
            Log-Msg "$RadioKind Result: $res"
            return ($res -eq "Success")
        }
    } catch {
        Log-Msg "WinRT Error: $($_.Exception.Message)"
    }
    return $false
}

# 2. Execution Strategy
if ($Target -eq "wifi") {
    # Layer 1: WinRT (Modern - Try first with Enum)
    $success = Set-RadioState "WiFi" $Action
    
    # Layer 2: Try netsh fallback if WinRT failed
    if (-not $success) {
        Log-Msg "WinRT failed or denied, trying netsh fallback..."
        $if = (netsh interface show interface | Select-String "Wi-Fi|WiFi|Inal|WLAN").ToString().Split(' ')[-1].Trim()
        if ($if) {
            $mode = if($Action -eq "off") { "disabled" } else { "enabled" }
            if ($Action -eq "toggle") {
                $isUp = (netsh interface show interface name="$if" | Select-String "Habilitado|Enabled|Conectado|Connected") -ne $null
                $mode = if($isUp) { "disabled" } else { "enabled" }
            }
            netsh interface set interface name="$if" admin=$mode
            Log-Msg "Netsh command sent to $if ($mode)"
        }
    }
}
elseif ($Target -eq "bluetooth") {
    Set-RadioState "Bluetooth" $Action
}

Log-Msg "--- Execution Finished ---"
