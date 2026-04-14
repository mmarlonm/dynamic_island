$w = Get-WmiObject Win32_NetworkAdapter -Filter "Name LIKE '%Wi-Fi%' AND PhysicalAdapter=True"
if ($w) {
    Write-Output "NetEnabled: $($w.NetEnabled)"
    $res = $w.Disable()
    Write-Output "Disable result: $($res.ReturnValue)"
} else {
    Write-Output "Not found"
}
