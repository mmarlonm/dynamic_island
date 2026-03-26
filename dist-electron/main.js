var _a, _b;
import { app, ipcMain, screen, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { fork, exec, spawn } from "node:child_process";
import os from "node:os";
console.log("[MAIN] Electron process starting...");
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
let win;
let isInMeetingApp = false;
let currentMeetingApp = "Teams";
let lastHasCam = false, lastHasMic = false;
let audioOutputDevice = "Speaker";
let lastWifi = true, lastBt = true;
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
    const widthLimit = isExpandedMode ? 400 : 120;
    const heightLimit = isExpandedMode ? winH + 40 : 35;
    const isInside = Math.abs(relX) <= widthLimit && relY >= 0 && relY <= heightLimit;
    win.setIgnoreMouseEvents(!isInside, { forward: true });
    win.webContents.send("mouse-proximity", { isNear: isInside, relX, relY });
  }, 35);
  const checkSystemStatus = () => {
    if (!win || win.isDestroyed()) return;
    const script = `
      $ErrorActionPreference = 'SilentlyContinue';
      $titles = ''; $cam = 'false'; $mic = 'false'; $audio = 'None'; $wifi = 'false'; $bt = 'false';
      
      try {
        $proc = Get-Process | Where-Object { $_.MainWindowTitle -ne '' -and ($_.ProcessName -match 'Teams|Zoom|ms-teams|chrome|msedge|brave|opera|firefox|Meet|Llamada|Reunión|Call|Hangout|Webex|Session') };
        if ($proc) { 
           $titles = ($proc.MainWindowTitle | Where-Object { $_ -ne $null }) -join '+'
        }
      } catch {}

      try {
        $cam = ((Get-CimInstance Win32_PnPEntity | Where-Object { $_.Service -eq 'usbvideo' -or $_.Caption -match 'Camera' }).Count -gt 0).ToString()
      } catch {}

      try {
        $mic = ((Get-CimInstance Win32_PnPEntity | Where-Object { $_.Caption -match 'Microphone|Micr|Audio|Headset|Hands-Free' }).Count -gt 0).ToString()
      } catch {}

      try {
        $audio = (Get-CimInstance Win32_SoundDevice | Where-Object { $_.Status -eq 'OK' }).Name -join '+'
        if (-not $audio) { $audio = 'None' }
      } catch {}

      try {
        $wifi = ((Get-NetAdapter | Where-Object { $_.Name -match 'Wi-Fi' }).Status -eq 'Up').ToString()
      } catch {}

      try {
        Add-Type -AssemblyName Windows.Devices.Radios -ErrorAction SilentlyContinue;
        $radios = [Windows.Devices.Radios.Radio]::GetRadiosAsync().GetAwaiter().GetResult();
        $bt = (($radios | Where-Object { $_.Kind -eq 'Bluetooth' }).State -eq 'On').ToString()
      } catch {}

      Write-Output ($titles + '###' + $cam + '###' + $mic + '###' + $audio + '###' + $wifi + '###' + $bt);
    `.trim();
    const buffer = Buffer.from(script, "utf16le");
    const base64 = buffer.toString("base64");
    exec(`powershell -EncodedCommand ${base64}`, { timeout: 8e3 }, (err, stdout) => {
      const out = stdout == null ? void 0 : stdout.trim();
      if (!out) return;
      const parts = out.split("###").map((p) => p.trim());
      if (parts.length < 6) return;
      const [titlesRaw, hasCamStr, hasMicStr, audioDeviceStr, wifiStr, btStr] = parts;
      const hasCam = hasCamStr.toLowerCase() === "true";
      const hasMic = hasMicStr.toLowerCase() === "true";
      const isWifi = wifiStr.toLowerCase() === "true";
      const isBt = btStr.toLowerCase() === "true";
      const teamsRegex = /\| Microsoft Teams$|Microsoft Teams$/i;
      const zoomRegex = /Zoom Meeting|Video Zoom/i;
      const meetRegex = /Meet - |Google Meet/i;
      const isTeams = teamsRegex.test(titlesRaw);
      const isZoom = zoomRegex.test(titlesRaw);
      const isMeet = meetRegex.test(titlesRaw);
      const active = isTeams || isZoom || isMeet;
      let meetingApp = "Teams";
      if (isZoom) meetingApp = "Zoom";
      else if (isMeet) meetingApp = "Meet";
      const lowTitles = titlesRaw.toLowerCase();
      if (active !== isInMeetingApp) {
        isInMeetingApp = active;
        currentMeetingApp = meetingApp;
        win == null ? void 0 : win.webContents.send("meeting-status", { active, app: meetingApp });
      }
      if (active) {
        const isMuted = lowTitles.includes("muted") || lowTitles.includes("silenciado");
        const isVideoOff = lowTitles.includes("video off") || lowTitles.includes("desactivada") || lowTitles.includes("cámara desactivada");
        win == null ? void 0 : win.webContents.send("meeting-info-update", { isMuted, isVideoOff });
      }
      if (hasCam !== lastHasCam || hasMic !== lastHasMic) {
        lastHasCam = hasCam;
        lastHasMic = hasMic;
        win == null ? void 0 : win.webContents.send("hardware-status", { hasCam, hasMic });
      }
      const type = audioDeviceStr.toLowerCase().includes("headset") || audioDeviceStr.toLowerCase().includes("headphones") || audioDeviceStr.toLowerCase().includes("hearing") ? "Headphones" : "Speaker";
      if (type !== audioOutputDevice) {
        audioOutputDevice = type;
        win == null ? void 0 : win.webContents.send("audio-output", type);
      }
      if (isWifi !== lastWifi || isBt !== lastBt) {
        lastWifi = isWifi;
        lastBt = isBt;
        win == null ? void 0 : win.webContents.send("radio-status", { wifi: isWifi, bluetooth: isBt });
      }
    });
  };
  setInterval(checkSystemStatus, 3500);
  checkSystemStatus();
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
try {
  const mediaReaderPath = path.join(__dirname$1, "media-reader.js");
  if (!fs.existsSync(mediaReaderPath)) {
    console.error(`[MAIN] CRITICAL: media-reader.js NOT FOUND at ${mediaReaderPath}`);
    const fallbackPath = path.join(process.cwd(), "dist-electron", "media-reader.js");
    console.log(`[MAIN] Trying fallback path: ${fallbackPath}`);
  }
  console.log(`[MAIN] Forking media reader from: ${mediaReaderPath}`);
  const mediaProc = fork(mediaReaderPath, [], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
    stdio: ["pipe", "pipe", "pipe", "ipc"]
  });
  (_a = mediaProc.stdout) == null ? void 0 : _a.on("data", (d) => console.log(`[MEDIA-CHILD STDOUT] ${d}`));
  (_b = mediaProc.stderr) == null ? void 0 : _b.on("data", (d) => console.error(`[MEDIA-CHILD ERROR] ${d}`));
  let lastMediaMsg = null;
  mediaProc.on("message", (msg) => {
    if ((msg == null ? void 0 : msg.type) === "MEDIA_UPDATE") {
      lastMediaMsg = msg.data;
      win == null ? void 0 : win.webContents.send("media-update", msg.data);
    }
  });
  let lastNotifId = "";
  setInterval(() => {
    const psNotif = `
      try {
        $noise = 'SideBySide','VSS','ESENT','MSExchange','Security-SPP','Desktop Window Manager','.NET Runtime','Windows Error Reporting','DistributedCOM','Service Control Manager';
        $e = Get-WinEvent -LogName Application -MaxEvents 5 -ErrorAction SilentlyContinue | 
             Where-Object { $_.LevelDisplayName -eq 'Information' -and $noise -notcontains $_.ProviderName } |
             Select-Object -First 1 -Property TimeCreated, ProviderName, Message;
        if ($e) {
          $msg = ($e.Message -split '
')[0] -replace '[^ -~áéíóúÁÉÍÓÚñÑ]', '';
          $out = $e.TimeCreated.ToString('o') + '|||' + $e.ProviderName + '|||' + $msg;
          Write-Output $out
        }
      } catch {}
    `.trim();
    const buf = Buffer.from(psNotif, "utf16le");
    const b64 = buf.toString("base64");
    exec(`powershell -EncodedCommand ${b64}`, { timeout: 6e3 }, (err, stdout) => {
      if (err || !(stdout == null ? void 0 : stdout.trim())) return;
      const [id, app2, msg] = stdout.trim().split("|||");
      if (!id || id === lastNotifId) return;
      lastNotifId = id;
      if (!app2 || !msg) return;
      win == null ? void 0 : win.webContents.send("notification", { app: app2.trim(), text: msg.trim().slice(0, 100) });
    });
  }, 8e3);
  ipcMain.handle("get-current-media", async () => {
    if (lastMediaMsg) return lastMediaMsg.data;
    await new Promise((r) => setTimeout(r, 1200));
    return (lastMediaMsg == null ? void 0 : lastMediaMsg.data) || null;
  });
  ipcMain.handle("toggle-wifi", async () => {
    const cmd = `powershell -Command "if((Get-NetAdapter -Name 'Wi-Fi').Status -eq 'Up') { Disable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false } else { Enable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false }"`;
    exec(cmd);
    return true;
  });
  ipcMain.handle("toggle-bluetooth", async () => {
    const cmd = `powershell -Command "Add-Type -AssemblyName Windows.Devices.Radios; \\$r=[Windows.Devices.Radios.Radio]::GetRadiosAsync().GetAwaiter().GetResult() | Where-Object { \\$_.Kind -eq 'Bluetooth' }; if(\\$r.State -eq 'On') { \\$r.SetStateAsync('Off') } else { \\$r.SetStateAsync('On') }"`;
    exec(cmd);
    return true;
  });
  ipcMain.handle("media-command", (event, action) => mediaProc.send(action));
  let psVol = null;
  let psVolReady = false;
  let psVolBuf = "";
  let psVolQueue = [];
  const volCS = [
    'Add-Type -TypeDefinition @"',
    "using System.Runtime.InteropServices;",
    // IMMDeviceEnumerator: EnumAudioEndpoints(slot0), GetDefaultAudioEndpoint(slot1)
    '[Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]',
    "interface IEnum {",
    "  [return:MarshalAs(UnmanagedType.IUnknown)] object EnumEp(int f,int s);",
    "  [return:MarshalAs(UnmanagedType.IUnknown)] object GetDef(int f,int r);",
    "}",
    // IMMDevice: Activate is slot 0
    '[Guid("D666063F-1587-4E43-81F1-B948E807363F"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]',
    "interface IDev {",
    "  [return:MarshalAs(UnmanagedType.IUnknown)] object Act([MarshalAs(UnmanagedType.LPStruct)] System.Guid id,int c,int p);",
    "}",
    // IAudioEndpointVolume correct vtable:
    // 0:RegisterControlChangeNotify 1:UnregisterControlChangeNotify 2:GetChannelCount
    // 3:SetMasterVolumeLevel(dB)  4:SetMasterVolumeLevelScalar  5:GetMasterVolumeLevel(dB)  6:GetMasterVolumeLevelScalar
    '[Guid("5CDF2C82-841E-4546-9722-0CF74078229A"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]',
    "interface IVol {",
    "  void R1();void R2();void R3();",
    "  void SetDb(float v,System.Guid ctx);",
    "  void SetScalar(float v,System.Guid ctx);",
    "  void GetDb(out float v);",
    "  void GetScalar(out float v);",
    "}",
    '[ComImport,Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMDev {}',
    "public class WinVol {",
    "  static IVol Ep() {",
    "    var e=(IEnum)(new MMDev());",
    "    var d=(IDev)e.GetDef(0,1);",
    "    return (IVol)d.Act(typeof(IVol).GUID,23,0);",
    "  }",
    "  public static int Get() { float f=0f; Ep().GetScalar(out f); return (int)(f*100+0.5); }",
    "  public static void Set(int n) { Ep().SetScalar((float)n/100,System.Guid.Empty); }",
    "}",
    "@ -Language CSharp",
    "Write-Output __VOL_READY__"
  ].join("\n");
  const startVolPS = () => {
    console.log("[VOL] Starting PowerShell volume process...");
    psVol = spawn("powershell", ["-NoExit", "-NonInteractive", "-Command", "-"], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    psVol.stderr.on("data", (d) => {
      console.error(`[VOL-PS ERROR] ${d.toString().trim()}`);
    });
    psVol.stdout.on("data", (d) => {
      psVolBuf += d.toString();
      let nl;
      while ((nl = psVolBuf.indexOf("\n")) !== -1) {
        const line = psVolBuf.slice(0, nl).replace(/\r/g, "").trim();
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
    psVol.on("exit", () => {
      psVolReady = false;
      psVol = null;
    });
    psVol.stdin.write(volCS + "\n");
  };
  startVolPS();
  const getVol = () => new Promise((res) => {
    if (!psVolReady || !psVol) {
      res(null);
      return;
    }
    psVolQueue.push(res);
    psVol.stdin.write("[WinVol]::Get()\n");
  });
  const setVol = (v) => {
    if (!psVolReady || !psVol) return;
    const clamped = Math.max(0, Math.min(100, Math.round(v)));
    psVol.stdin.write(`[WinVol]::Set(${clamped})
`);
  };
  ipcMain.handle("get-volume", async () => await getVol());
  ipcMain.handle("set-volume", (_e, v) => {
    setVol(v);
    return true;
  });
  setInterval(async () => {
    const v = await getVol();
    if (v !== null) win == null ? void 0 : win.webContents.send("volume-update", v);
  }, 3e3);
  ipcMain.handle("open-app", async (event, appName) => {
    const lower = appName.toLowerCase();
    if (lower.includes("chrome")) exec("start chrome");
    else if (lower.includes("spotify")) exec("start spotify");
    else if (lower.includes("camera")) exec("start microsoft.windows.camera:");
    else exec(`start "" "${appName}"`);
    return true;
  });
  app.on("before-quit", () => mediaProc.kill());
} catch (err) {
  console.error("Failed to init media process:", err);
}
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});
export {
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
