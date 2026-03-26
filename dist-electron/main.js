import { app, ipcMain, screen, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { fork, spawn, exec } from "node:child_process";
import os from "node:os";
console.log("[MAIN] Electron process starting...");
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
let win;
let currentMeetingApp = "Teams";
function createWindow() {
  console.log("[MAIN] Creating BrowserWindow...");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;
  const windowWidth = width;
  const windowHeight = 600;
  win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname$1, "preload.js")
    }
  });
  win.setIgnoreMouseEvents(true, { forward: true });
  if (VITE_DEV_SERVER_URL) {
    console.log("[MAIN] Loading from Vite Dev Server:", VITE_DEV_SERVER_URL);
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    console.log("[MAIN] Loading from packaged dist...");
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.webContents.on("did-finish-load", () => {
    console.log("[MAIN] Window content loaded successfully.");
    win == null ? void 0 : win.show();
    win == null ? void 0 : win.focus();
  });
  win.webContents.on("did-fail-load", (e, code, desc) => {
    console.error(`[MAIN] Failed to load window: ${desc} (${code})`);
  });
  ipcMain.on("set-ignore-mouse-events", (event, ignore) => {
    if (win && !win.isDestroyed()) {
      win.setIgnoreMouseEvents(ignore, { forward: true });
    }
  });
  let isExpandedMode = false;
  ipcMain.on("set-window-height", (event, h) => {
    if (win && !win.isDestroyed()) {
      win.setSize(windowWidth, Math.max(h, 40), true);
    }
  });
  ipcMain.on("set-is-expanded", (event, expanded) => {
    isExpandedMode = expanded;
  });
  ipcMain.on("update-island-pos", (event, x) => {
  });
  setInterval(() => {
    if (!win || win.isDestroyed()) return;
    const { x, y } = screen.getCursorScreenPoint();
    const b = win.getBounds();
    const relX = x - (b.x + b.width / 2);
    const relY = y - b.y;
    const [winW, winH] = win.getSize();
    const widthLimit = isExpandedMode ? 400 : 200;
    const heightLimit = isExpandedMode ? winH + 40 : 35;
    const isInside = Math.abs(relX) <= widthLimit && relY >= 0 && relY <= heightLimit;
    win.setIgnoreMouseEvents(!isInside, { forward: true });
    win.webContents.send("mouse-proximity", { isNear: isInside, relX, relY });
  }, 35);
}
const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
  app.whenReady().then(() => {
    console.log("[MAIN] App ready, creating window...");
    createWindow();
  });
}
const sendKeyToMeeting = (keys) => {
  const psKey = `
    Add-Type -AssemblyName System.Windows.Forms;
    $sig = '[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);';
    $type = Add-Type -MemberDefinition $sig -Name "Win32" -Namespace "Win32API" -PassThru;
    
    $searchPattern = switch ('${currentMeetingApp}') {
        'Zoom'  { 'Zoom Meeting|Zoom' }
        'Meet'  { 'Meet - |Google Meet' }
        Default { 'Meeting |Microsoft Teams|Llamada|Reunión' }
    }

    $proc = Get-Process | Where-Object { 
        ($_.ProcessName -match 'Teams|Zoom|ms-teams|chrome|msedge|brave|opera|firefox') -and ($_.MainWindowTitle -match $searchPattern)
    } | Select-Object -First 1;

    if ($proc) {
        $hwnd = $proc.MainWindowHandle;
        for ($i=0; $i -lt 3; $i++) {
            if ($hwnd -ne [IntPtr]::Zero) {
                [Win32API.Win32]::SetForegroundWindow($hwnd);
                Start-Sleep -m 500;
                [System.Windows.Forms.SendKeys]::SendWait('${keys}');
                exit 0;
            }
            $proc = Get-Process -Id $proc.Id; $hwnd = $proc.MainWindowHandle;
            Start-Sleep -m 250;
        }
    }
    exit 1;
  `;
  const cmd = `powershell -Command "${psKey.replace(/\n/g, " ").trim()}"`;
  console.log(`[MAIN] Sending keys '${keys}' to ${currentMeetingApp}...`);
  return new Promise((resolve) => {
    exec(cmd, (err, stdout) => {
      if (stdout) console.log(stdout.trim());
      resolve(!err);
    });
  });
};
ipcMain.handle("toggle-system-mute", async () => {
  if (currentMeetingApp === "Zoom") await sendKeyToMeeting("%a");
  else if (currentMeetingApp === "Meet") await sendKeyToMeeting("^d");
  else await sendKeyToMeeting("^+m");
  return true;
});
ipcMain.handle("toggle-video", async () => {
  if (currentMeetingApp === "Zoom") await sendKeyToMeeting("%v");
  else if (currentMeetingApp === "Meet") await sendKeyToMeeting("^e");
  else await sendKeyToMeeting("^+o");
  return true;
});
ipcMain.handle("end-call", async () => {
  if (currentMeetingApp === "Zoom") {
    await sendKeyToMeeting("%q");
    await sendKeyToMeeting("{ENTER}");
  } else if (currentMeetingApp === "Meet") await sendKeyToMeeting("^w");
  else await sendKeyToMeeting("^+h");
  return true;
});
let prevCpus = os.cpus();
setInterval(() => {
  if (!win || win.isDestroyed()) return;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const ramUsage = (totalMem - freeMem) / totalMem * 100;
  const currCpus = os.cpus();
  let totalDiff = 0, idleDiff = 0;
  for (let i = 0; i < currCpus.length; i++) {
    const prev = prevCpus[i].times, curr = currCpus[i].times;
    const prevTotal = Object.values(prev).reduce((a, b) => a + b, 0);
    const currTotal = Object.values(curr).reduce((a, b) => a + b, 0);
    totalDiff += currTotal - prevTotal;
    idleDiff += curr.idle - prev.idle;
  }
  const cpuUsage = totalDiff > 0 ? (1 - idleDiff / totalDiff) * 100 : 0;
  prevCpus = currCpus;
  win.webContents.send("system-update", { cpu: cpuUsage, ram: ramUsage, net: 1.5 + Math.random() * 2 });
}, 2e3);
let mediaProc = null;
try {
  const mediaReaderPath = path.join(__dirname$1, "media-reader.js");
  if (!fs.existsSync(mediaReaderPath)) {
    console.error(`[MAIN] CRITICAL: media-reader.js NOT FOUND at ${mediaReaderPath}`);
    const fallbackPath = path.join(process.cwd(), "dist-electron", "media-reader.js");
    console.log(`[MAIN] Trying fallback path: ${fallbackPath}`);
  }
  console.log(`[MAIN] Forking media reader from: ${mediaReaderPath}`);
  mediaProc = fork(mediaReaderPath, [], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
    stdio: ["pipe", "pipe", "pipe", "ipc"]
  });
  if (mediaProc.stdout) {
    mediaProc.stdout.on("data", (d) => console.log(`[MEDIA-CHILD STDOUT] ${d.toString().trim()}`));
  }
  if (mediaProc.stderr) {
    mediaProc.stderr.on("data", (d) => console.error(`[MEDIA-CHILD ERROR] ${d.toString().trim()}`));
  }
  let lastMediaMsg = null;
  mediaProc.on("message", (msg) => {
    if ((msg == null ? void 0 : msg.type) === "MEDIA_UPDATE") {
      lastMediaMsg = msg.data;
      win == null ? void 0 : win.webContents.send("media-update", msg.data);
    }
  });
  let lastNotifId = "";
  let psMeet = null;
  let psMeetBuf = "";
  const startMeetPS = () => {
    console.log("[MEET] Starting persistent meeting detection...");
    const psCode = `
      $ErrorActionPreference = 'SilentlyContinue'
      $code = @'
      using System;
      using System.Runtime.InteropServices;
      [Guid("E2F5BB11-0570-40CA-ACDD-3AA01277DEE8"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IAudioSessionEnumerator { int GetCount(out int c); int GetSession(int n, out IAudioSessionControl s); }
      [Guid("F4B1A599-7266-4319-A8CA-E70ACB1118D7"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IAudioSessionControl { int GetState(out int s); int GetDisplayName([MarshalAs(UnmanagedType.LPWStr)] out string d); int GetIconPath([MarshalAs(UnmanagedType.LPWStr)] out string i); }
      [Guid("77AA9910-1EE6-440D-B95F-456477E6E273"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IAudioSessionManager2 { int GetSessionEnumerator(out IAudioSessionEnumerator e); }
      [Guid("D6660639-8874-4034-AD23-37284F510F4F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IMMDevice { int Activate(ref Guid id, int cls, IntPtr p, out IAudioSessionManager2 m); }
      [Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IMMDeviceEnumerator { int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice endpoint); }
      [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMDevEnum { }
      public class MicCheck {
          public static bool IsInUse() {
              try {
                  var enumerator = (IMMDeviceEnumerator)new MMDevEnum();
                  IMMDevice device;
                  if (enumerator.GetDefaultAudioEndpoint(1, 0, out device) != 0) return false;
                  IAudioSessionManager2 manager;
                  var iid = new Guid("77AA9910-1EE6-440D-B95F-456477E6E273");
                  if (device.Activate(ref iid, 23, IntPtr.Zero, out manager) != 0) return false;
                  IAudioSessionEnumerator sessionEnum;
                  if (manager.GetSessionEnumerator(out sessionEnum) != 0) return false;
                  int count; sessionEnum.GetCount(out count);
                  for (int i = 0; i < count; i++) {
                      IAudioSessionControl session;
                      if (sessionEnum.GetSession(i, out session) == 0) {
                          int state; session.GetState(out state);
                          if (state == 1) return true;
                      }
                  }
              } catch {}
              return false;
          }
      }
'@
      Add-Type -TypeDefinition $code -ErrorAction SilentlyContinue
      while($true) {
        $micInUse = [MicCheck]::IsInUse()
        if (-not $micInUse) {
           $regs = @("HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone", "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone")
           foreach ($r in $regs) { if(Test-Path $r) { if((Get-ChildItem $r -Recurse | Get-ItemProperty -Name "LastUsedTimeStop" -ErrorAction SilentlyContinue | Where-Object { $_.LastUsedTimeStop -eq 0 }).Count -gt 0) { $micInUse = $true; break } } }
        }
        $found = Get-Process | Where-Object { $_.MainWindowTitle -match "Teams|Zoom|Meet|Llamada|Call|Reunión|Webex|Discord|Slack|Skype|WhatsApp|Telegram" -or $_.ProcessName -match "Teams|Zoom|ms-teams|Webex|vMix|Discord|Slack|Skype" } | Select-Object -First 1
        $isMeeting = if($found){ ($found.MainWindowTitle -match 'Llamada|Call|Meeting|Reunión|Reunion|Activo|En curso|Talk|Join|Unirse') -or ($found.MainWindowTitle.Length -gt 25) } else { $false }
        $bt = Get-PnpDevice -Class 'AudioEndpoint' -Status 'OK' -ErrorAction SilentlyContinue | Where-Object { $_.FriendlyName -match 'Bluetooth' } | Select-Object -First 1
        $appName = if($found){ if($found.MainWindowTitle -match 'Teams' -or $found.ProcessName -match 'Teams'){ 'Teams' } elseif($found.MainWindowTitle -match 'Zoom' -or $found.ProcessName -match 'Zoom'){ 'Zoom' } elseif($found.MainWindowTitle -match 'Meet'){ 'Meet' } else { $found.ProcessName } } else { '' }
        Write-Output "__MEET__$([string]$micInUse)|$([string]$isMeeting)|$($appName)|$($bt.FriendlyName)"
        Start-Sleep -Seconds 2
      }
    `;
    psMeet = spawn("powershell", ["-NoExit", "-NonInteractive", "-Command", "-"], { stdio: ["pipe", "pipe", "pipe"] });
    psMeet.stdin.write(psCode + "\n");
    psMeet.stdout.on("data", (d) => {
      psMeetBuf += d.toString();
      let nl;
      while ((nl = psMeetBuf.indexOf("\n")) !== -1) {
        const line = psMeetBuf.slice(0, nl).trim();
        psMeetBuf = psMeetBuf.slice(nl + 1);
        if (line.startsWith("__MEET__")) {
          const parts = line.replace("__MEET__", "").split("|");
          if (parts.length >= 4) {
            const [micUse, isMeeting, app2, btDevice] = parts;
            const isActive = micUse.toLowerCase() === "true" || isMeeting.toLowerCase() === "true";
            console.log(`[MEET-STATUS] mic:${micUse} meet:${isMeeting} app:${app2} isActive:${isActive}`);
            if (isActive) {
              if (app2.toLowerCase().includes("zoom")) currentMeetingApp = "Zoom";
              else if (app2.toLowerCase().includes("meet")) currentMeetingApp = "Meet";
              else if (app2.toLowerCase().includes("teams")) currentMeetingApp = "Teams";
              else currentMeetingApp = app2 || "Llamada";
            }
            win == null ? void 0 : win.webContents.send("meeting-update", {
              isActive,
              app: isActive ? app2 || "Llamada Activa" : "",
              device: btDevice || "Sistema",
              micMuted: false
            });
          }
        }
      }
    });
    psMeet.stderr.on("data", (d) => console.error("[MEET-PS ERROR]", d.toString()));
    psMeet.on("exit", () => setTimeout(startMeetPS, 5e3));
  };
  startMeetPS();
  setInterval(() => {
    if (!win || win.isDestroyed()) return;
    const psNotif = `
      $noise = 'SideBySide','VSS','ESENT','MSExchange','Security-SPP','Desktop Window Manager','.NET Runtime','Windows Error Reporting','DistributedCOM','Service Control Manager';
      $e = Get-WinEvent -LogName Application -MaxEvents 5 -ErrorAction SilentlyContinue | 
           Where-Object { $_.LevelDisplayName -eq 'Information' -and $noise -notcontains $_.ProviderName } |
           Select-Object -First 1 -Property TimeCreated, ProviderName, Message;
      if ($e) {
        $msg = ($e.Message -split '\\n')[0] -replace '[^\\x20-\\x7EáéíóúÁÉÍÓÚñÑ]', '';
        Write-Output ($e.TimeCreated.ToString('o') + '|||' + $e.ProviderName + '|||' + $msg)
      }
    `.trim();
    exec(`powershell -Command "${psNotif.replace(/\n/g, " ")}"`, (err, stdout) => {
      if (err || !(stdout == null ? void 0 : stdout.trim())) return;
      const parts = stdout.trim().split("|||");
      if (parts.length < 3) return;
      const [id, appStr, msg] = parts;
      if (!id || id === lastNotifId) return;
      lastNotifId = id;
      win == null ? void 0 : win.webContents.send("notification", { app: appStr, text: msg });
    });
  }, 3e3);
  ipcMain.handle("get-current-media", async () => {
    if (lastMediaMsg) return lastMediaMsg.data;
    await new Promise((r) => setTimeout(r, 1200));
    return (lastMediaMsg == null ? void 0 : lastMediaMsg.data) || null;
  });
  ipcMain.handle("toggle-wifi", async () => {
    exec(`powershell -Command "if((Get-NetAdapter -Name 'Wi-Fi').Status -eq 'Up') { Disable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false } else { Enable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false }"`);
    return true;
  });
  ipcMain.handle("toggle-bluetooth", async () => {
    exec(`powershell -Command "Add-Type -AssemblyName Windows.Devices.Radios; \\$r=[Windows.Devices.Radios.Radio]::GetRadiosAsync().GetAwaiter().GetResult() | Where-Object { \\$_.Kind -eq 'Bluetooth' }; if(\\$r.State -eq 'On') { \\$r.SetStateAsync('Off') } else { \\$r.SetStateAsync('On') }"`);
    return true;
  });
  ipcMain.handle("media-command", (_event, action) => mediaProc == null ? void 0 : mediaProc.send(action));
  let psVol = null;
  let psVolReady = false;
  let psVolBuf = "";
  let psVolQueue = [];
  const volCS = [
    'Add-Type -TypeDefinition @"',
    "using System.Runtime.InteropServices;",
    '[Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]',
    "interface IVol { int f1(); int f2(); int f3(); int f4(); int SetMasterVolumeLevelScalar(float f, System.Guid g); int GetMasterVolumeLevelScalar(out float f); }",
    '[Guid("D6660639-8874-4034-AD23-37284F510F4F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]',
    "interface IDev { int Activate(ref System.Guid id, int cls, System.IntPtr p, out IVol v); }",
    '[Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]',
    "interface IEnum { int GetDefaultAudioEndpoint(int df, int r, out IDev e); }",
    '[ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMDev { }',
    "public class WinVol {",
    "    public static int Get() {",
    '        try { var e = (IEnum)new MMDev(); IDev d; e.GetDefaultAudioEndpoint(0, 0, out d); IVol v; var iid = new System.Guid("5CDF2C82-841E-4546-9722-0CF74078229A"); d.Activate(ref iid, 23, System.IntPtr.Zero, out v); float f; v.GetMasterVolumeLevelScalar(out f); return (int)(f * 100); } catch { return 0; }',
    "    }",
    "    public static void Set(int n) {",
    '        try { var e = (IEnum)new MMDev(); IDev d; e.GetDefaultAudioEndpoint(0, 0, out d); IVol v; var iid = new System.Guid("5CDF2C82-841E-4546-9722-0CF74078229A"); d.Activate(ref iid, 23, System.IntPtr.Zero, out v); v.SetMasterVolumeLevelScalar((float)n / 100, System.Guid.Empty); } catch {}',
    "    }",
    "}",
    '"@ -Language CSharp',
    "Write-Output __VOL_READY__"
  ].join("\n");
  const startVolPS = () => {
    psVol = spawn("powershell", ["-NoExit", "-NonInteractive", "-Command", "-"], { stdio: ["pipe", "pipe", "pipe"] });
    psVol.stdout.on("data", (d) => {
      psVolBuf += d.toString();
      let nl;
      while ((nl = psVolBuf.indexOf("\n")) !== -1) {
        const line = psVolBuf.slice(0, nl).trim();
        psVolBuf = psVolBuf.slice(nl + 1);
        if (line === "__VOL_READY__") {
          psVolReady = true;
          psVol.stdin.write("[WinVol]::Get()\n");
        } else if (/^\d+$/.test(line)) {
          const v = parseInt(line, 10);
          const cb = psVolQueue.shift();
          if (cb) cb(v);
          win == null ? void 0 : win.webContents.send("volume-update", v);
        }
      }
    });
    psVol.stdin.write(volCS + "\n");
    psVol.on("exit", () => {
      psVolReady = false;
      setTimeout(startVolPS, 5e3);
    });
  };
  startVolPS();
  const getVol = () => new Promise((res) => {
    if (!psVolReady || !psVol) return res(null);
    psVolQueue.push(res);
    psVol.stdin.write("[WinVol]::Get()\n");
  });
  ipcMain.handle("get-volume", async () => await getVol());
  ipcMain.handle("set-volume", (_e, v) => {
    const clamped = Math.round(Math.max(0, Math.min(100, v)));
    psVol == null ? void 0 : psVol.stdin.write(`[WinVol]::Set(${clamped})
`);
    return true;
  });
  setInterval(async () => {
    const v = await getVol();
    if (v !== null) win == null ? void 0 : win.webContents.send("volume-update", v);
  }, 4e3);
  ipcMain.handle("open-app", async (_event, appName) => {
    const lower = appName.toLowerCase();
    if (lower.includes("chrome")) exec("start chrome");
    else if (lower.includes("spotify")) exec("start spotify");
    else if (lower.includes("camera")) exec("start microsoft.windows.camera:");
    else exec(`start "" "${appName}"`);
    return true;
  });
  ipcMain.handle("meeting-command", async (_event, cmd) => {
    if (cmd === "toggleMic") {
      const ps = `
$code = @'
using System.Runtime.InteropServices;
[Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IVol { int f1(); int f2(); int f3(); int f4(); int SetMute([MarshalAs(UnmanagedType.Bool)] bool m, System.Guid g); int GetMute(out bool m); }
[Guid("D6660639-8874-4034-AD23-37284F510F4F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IDev { int Activate(ref System.Guid id, int cls, System.IntPtr p, out IVol v); }
[Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IEnum { int GetDefaultAudioEndpoint(int df, int r, out IDev e); }
[ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMDev { }
public class Mic {
    public static void Toggle() {
        var e = (IEnum)new MMDev(); IDev d; e.GetDefaultAudioEndpoint(1, 0, out d);
        IVol v; var iid = new System.Guid("5CDF2C82-841E-4546-9722-0CF74078229A");
        if (d.Activate(ref iid, 23, System.IntPtr.Zero, out v) == 0) {
          bool m; v.GetMute(out m); v.SetMute(!m, System.Guid.Empty);
        }
    }
}
'@
Add-Type -TypeDefinition $code; [Mic]::Toggle()
`.trim();
      exec(`powershell -Command "${ps.replace(/\n/g, " ")}"`);
    } else if (cmd === "toggleCam") {
      const keys = currentMeetingApp === "Zoom" ? "%v" : currentMeetingApp === "Meet" ? "^e" : "^+o";
      exec(`powershell -Command "(new-object -com wscript.shell).SendKeys('${keys}')"`);
    } else if (cmd === "endCall") {
      if (currentMeetingApp === "Zoom") exec(`powershell -Command "(new-object -com wscript.shell).SendKeys('%q'); Start-Sleep -m 200; (new-object -com wscript.shell).SendKeys('{ENTER}')"`);
      else if (currentMeetingApp === "Meet") exec(`powershell -Command "(new-object -com wscript.shell).SendKeys('^w')"`);
      else exec(`powershell -Command "(new-object -com wscript.shell).SendKeys('^+h')"`);
    }
  });
  app.on("before-quit", () => {
    mediaProc == null ? void 0 : mediaProc.kill();
    psMeet == null ? void 0 : psMeet.kill();
    psVol == null ? void 0 : psVol.kill();
  });
} catch (err) {
  console.error("[MAIN] CRITICAL Initialization error:", err);
}
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});
export {
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
