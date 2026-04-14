const { exec } = require('child_process');
exec("powershell -Command \"Get-NetAdapter | Where-Object { $_.Name -match 'Wi-Fi' } | Disable-NetAdapter -Confirm:$false\"", (e, o, er) => {
    console.log('Err:', e, '\nOut:', o, '\nStderr:', er);
});
