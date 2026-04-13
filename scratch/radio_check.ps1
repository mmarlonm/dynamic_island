
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$as = [System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")
# Try to find the radio kind manually using UWP APIs if possible, or fallback to netsh
try {
    [void][Windows.Devices.Radios.Radio, Windows.Devices.Radios, ContentType=WindowsRuntime]
    $op = [Windows.Devices.Radios.Radio]::GetRadiosAsync()
    while ($op.Status -eq 'Started') { Start-Sleep -m 50 }
    $rads = $op.GetResults()
    foreach ($r in $rads) {
        Write-Output "RADIO:$($r.Kind):$($r.State)"
    }
} catch {
    Write-Output "UWP_FAILED:$($_.Exception.Message)"
}
