const { exec } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const psScript = `
$code = @"
using System;
using System.Threading.Tasks;
using Windows.Devices.Radios;

public class RadioMotor {
    public static void Toggle(string kind) {
        var t = Radio.GetRadiosAsync().AsTask();
        t.Wait();
        foreach(var r in t.Result) {
            if (r.Kind.ToString().Equals(kind, StringComparison.OrdinalIgnoreCase)) {
                var newState = r.State == RadioState.On ? RadioState.Off : RadioState.On;
                var st = r.SetStateAsync(newState).AsTask();
                st.Wait();
                Console.WriteLine("Success: " + r.Kind.ToString() + " is now " + newState.ToString());
            }
        }
    }
}
"@
$refs = @(
    "C:\\Windows\\System32\\WinMetadata\\Windows.Devices.winmd",
    "C:\\Windows\\System32\\WinMetadata\\Windows.Foundation.winmd",
    "System.Runtime.WindowsRuntime.dll"
)
Add-Type -TypeDefinition $code -Language CSharp -ReferencedAssemblies $refs
[RadioMotor]::Toggle('WiFi')
`;

const psPath = path.join(os.tmpdir(), 'notchly-radio-test.ps1');
fs.writeFileSync(psPath, psScript, 'utf8');

exec(`powershell -ExecutionPolicy Bypass -File "${psPath}"`, (e, o, er) => {
    console.log('Err:', e, '\nOut:', o, '\nStderr:', er);
});
