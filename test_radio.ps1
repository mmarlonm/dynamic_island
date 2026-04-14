[void][Windows.Devices.Radios.Radio, Windows.Devices.Radios, ContentType=WindowsRuntime]
$op = [Windows.Devices.Radios.Radio]::GetRadiosAsync()
while($op.Status -eq 'Started') { Start-Sleep -m 50 }
Write-Output "Status: $($op.Status.ToString())"

# Cast explicitly instead of relying on COM wrapping
$asInfo = [Windows.Foundation.IAsyncOperation[System.Collections.Generic.IReadOnlyList[Windows.Devices.Radios.Radio]]]$op
Write-Output "Has method GetResults? $(if ($asInfo.GetResults) { 'Yes' } else { 'No' })"

if ($op.Status -eq 'Completed') {
    # It turns out, PowerShell handles WinRT arrays differently.
    # On Windows 10/11, if .GetResults() is not there, we can access the result via .Result if it's a task, 
    # but since it's COM, powershell might just map the property differently, or we just cast to IAsyncInfo.
    
    # Try getting the task dynamically
    $taskMethod = [System.WindowsRuntimeSystemExtensions].GetMethod("AsTask", [type[]]@($op.GetType()))
    if ($taskMethod) {
        Write-Output "Found AsTask!"
        $task = $taskMethod.Invoke($null, @($op))
        $task.Wait()
        $radios = $task.Result
        foreach ($r in $radios) {
            Write-Output "Found: $($r.Kind) state. $($r.State)"
        }
    } else {
        Write-Output "No AsTask method found for this type."
        # alternative: just calling .GetResults() via reflection?
        $m = $op.GetType().GetMethod("GetResults")
        if ($m) {
            $radios = $m.Invoke($op, $null)
            foreach ($r in $radios) {
                Write-Output "Found by ref: $($r.Kind)"
            }
        } else {
            Write-Output "No GetResults via reflection."
        }
    }
}
