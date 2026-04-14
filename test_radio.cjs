const { exec } = require('child_process');
const script = `
[void][Windows.Devices.Radios.Radio, Windows.Devices.Radios, ContentType=WindowsRuntime]
$a = [Windows.Devices.Radios.Radio]::GetRadiosAsync()
while($a.Status -eq 'Started'){ Start-Sleep -m 50 }
$r = $a.GetResults() | Where-Object { $_.Kind -eq 'WiFi' }
Write-Output "Radio found: $(if($r){$true}else{$false})"
if ($r) {
  Write-Output "Current state: $($r.State)"
  $s = if($r.State -eq 'On') { 'Off' } else { 'On' }
  Write-Output "Setting state to: $s"
  $t = $r.SetStateAsync($s)
  while($t.Status -eq 'Started'){ Start-Sleep -m 50 }
  Write-Output "Task status: $($t.Status)"
}
`;
exec(`powershell -Command "${script.replace(/\n/g, ' ')}"`, (e, o, er) => {
    console.log('Err:', e, '\nOut:', o, '\nStderr:', er);
});
