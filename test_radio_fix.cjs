const { exec } = require('child_process');
const script = `
[void][Windows.Devices.Radios.Radio, Windows.Devices.Radios, ContentType=WindowsRuntime];
$a = [Windows.Devices.Radios.Radio]::RequestAccessAsync();
while($a.Status -eq 'Started'){ Start-Sleep -m 50 };
$o = [Windows.Devices.Radios.Radio]::GetRadiosAsync();
while($o.Status -eq 'Started'){ Start-Sleep -m 50 };
$r = $o.GetResults() | Where-Object { $_.Kind -eq 'WiFi' } | Select-Object -First 1;
if ($r) {
  $s = if($r.State -eq 'On') { 'Off' } else { 'On' };
  $t = $r.SetStateAsync($s);
  while($t.Status -eq 'Started'){ Start-Sleep -m 50 };
  Write-Output "Success";
}
`;
// Notice the semicolon replacement!
exec(`powershell -Command "${script.replace(/\n/g, '; ')}"`, (e, o, er) => {
    console.log('Err:', e, '\nOut:', o, '\nStderr:', er);
});
