const { exec } = require('child_process');
const script = `
[void][Windows.Devices.Radios.Radio, Windows.Devices.Radios, ContentType=WindowsRuntime];
$o = [Windows.Devices.Radios.Radio]::GetRadiosAsync();
while($o.Status -eq 'Started'){ Start-Sleep -m 50 };
$r = $o.GetResults() | Where-Object { $_.Kind -eq 'WiFi' } | Select-Object -First 1;
if ($r) {
  $s = if($r.State -eq 'On') { 'Off' } else { 'On' };
  [void]$r.SetStateAsync($s);
  Start-Sleep -m 500;
  Write-Output "Toggle commanded asynchronously.";
} else {
  Write-Output "No Wi-Fi radio found";
}
`;
exec(`powershell -Command "${script.replace(/\n/g, ' ')}"`, (e, o, er) => {
    console.log('Err:', e, '\nOut:', o, '\nStderr:', er);
});
