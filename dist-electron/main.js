import { ipcMain, app, desktopCapturer, screen, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { spawn, fork, exec } from "node:child_process";
import os from "node:os";
import https from "node:https";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
let psNotif = null;
let notifMap = /* @__PURE__ */ new Map();
const startNotifMonitor = () => {
  const paths = [
    path.join(__dirname$1, "notifications-monitor.ps1"),
    path.join(process.cwd(), "electron", "notifications-monitor.ps1")
  ];
  const notifPath = paths.find((p) => fs.existsSync(p));
  if (!notifPath) return;
  console.log(`[MAIN] Launching Notification Monitor: ${notifPath}`);
  psNotif = spawn("powershell", ["-ExecutionPolicy", "Bypass", "-File", notifPath]);
  psNotif.stdout.on("data", (d) => {
    const lines = d.toString().split("\n");
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith("__NOTIF__")) {
        const parts = line.replace("__NOTIF__", "").split("|||");
        if (parts.length >= 4) {
          const [appStr, title, body, winId] = parts;
          notifMap.set(winId, { title, app: appStr });
          safeSend(win, "notification-sync", {
            id: winId,
            app: appStr,
            text: (title + " " + (body || "")).trim()
          });
        }
      } else if (line.startsWith("__REMOVE__")) {
        const winId = line.replace("__REMOVE__", "").trim();
        notifMap.delete(winId);
        safeSend(win, "notification-remove", winId);
      } else if (line.startsWith("__DEBUG__")) {
        console.log(`[NOTIF_DEBUG] ${line}`);
      }
    }
  });
  psNotif.on("exit", () => setTimeout(startNotifMonitor, 5e3));
};
ipcMain.on("dismiss-notification", (_, id) => {
  const info = notifMap.get(String(id));
  if (!info) return;
  const dismissCmd = `
    $ErrorActionPreference = 'SilentlyContinue'
    [void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]
    $l = [Windows.UI.Notifications.Management.UserNotificationListener]::Current
    $o = $l.GetNotificationsAsync(1)
    $asInfo = [Windows.Foundation.IAsyncInfo]$o
    while($asInfo.Status -eq 'Started') { [System.Threading.Thread]::Sleep(50) }
    $ns = $o.GetResults()
    $t = $ns | Where-Object { 
        ($_.AppInfo.DisplayInfo.DisplayName -match '${info.app}' -or $_.AppInfo.Id -match '${info.app}') -and 
        ($_.Notification.Visual.GetBinding('ToastGeneric').GetTextElements()[0].Text -like '*${info.title.replace(/'/g, "''")}*')
    } | Select-Object -First 1
    if ($t) { $l.RemoveNotification($t.Id) }
  `;
  spawn("powershell", ["-Command", dismissCmd]);
  notifMap.delete(String(id));
});
ipcMain.on("clear-all-notifications", () => {
  const clearAllCmd = `
    $ErrorActionPreference = 'SilentlyContinue'
    [void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]
    $l = [Windows.UI.Notifications.Management.UserNotificationListener]::Current
    $o = $l.GetNotificationsAsync(1)
    $asInfo = [Windows.Foundation.IAsyncInfo]$o
    while($asInfo.Status -eq 'Started') { [System.Threading.Thread]::Sleep(50) }
    $ns = $o.GetResults()
    foreach($n in $ns) {
      $l.RemoveNotification($n.Id)
    }
  `;
  spawn("powershell", ["-Command", clearAllCmd]);
  notifMap.clear();
});
function requestNotificationAccess() {
  const accessCmd = `[void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]; [Windows.UI.Notifications.Management.UserNotificationListener]::Current.RequestAccessAsync()`;
  spawn("powershell", ["-Command", accessCmd]);
}
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
if (process.platform === "win32") {
  app.setAppUserModelId("com.notchly.app");
}
let win;
let currentMeetingApp = "Teams";
let currentMicState = false;
let isUserMuted = false;
let isUserCamOff = false;
let meetingExitCounter = 0;
let proximityInterval = null;
let systemUpdateInterval = null;
let volInterval = null;
let weatherInterval = null;
let weatherLocation = "";
function safeSend(w, channel, ...args) {
  if (!w || w.isDestroyed()) return;
  try {
    const wc = w.webContents;
    if (!wc || wc.isDestroyed() || wc.isCrashed()) return;
    const mf = wc.mainFrame;
    if (mf && typeof mf.isDestroyed === "function" && mf.isDestroyed()) return;
    wc.send(channel, ...args);
  } catch (e) {
  }
}
const fetchWeather = () => {
  if (!win || win.isDestroyed()) return;
  const url = weatherLocation ? `https://wttr.in/${encodeURIComponent(weatherLocation)}?format=j1` : "https://wttr.in?format=j1";
  https.get(url, (res) => {
    let data = "";
    res.on("data", (chunk) => data += chunk);
    res.on("end", () => {
      var _a, _b, _c;
      try {
        const json = JSON.parse(data);
        const current = json.current_condition[0];
        const area = (_a = json.nearest_area) == null ? void 0 : _a[0];
        const city = ((_c = (_b = area == null ? void 0 : area.areaName) == null ? void 0 : _b[0]) == null ? void 0 : _c.value) || "Local";
        safeSend(win, "weather-update", {
          temp: current.temp_C,
          condition: current.weatherDesc[0].value,
          city
        });
      } catch (e) {
      }
    });
  }).on("error", () => {
  });
};
ipcMain.handle("get-system-audio-id", async () => {
  var _a;
  const sources = await desktopCapturer.getSources({ types: ["screen"] });
  return (_a = sources[0]) == null ? void 0 : _a.id;
});
ipcMain.removeAllListeners("set-weather-location");
ipcMain.on("set-weather-location", (_e, loc) => {
  weatherLocation = loc || "";
  fetchWeather();
});
function createWindow() {
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
      preload: path.join(__dirname$1, "preload.js"),
      backgroundThrottling: false,
      autoplayPolicy: "no-user-gesture-required"
    }
  });
  win.setIgnoreMouseEvents(true, { forward: true });
  setTimeout(() => {
    if (typeof startNotifMonitor === "function") startNotifMonitor();
    if (typeof requestNotificationAccess === "function") requestNotificationAccess();
  }, 1e3);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.webContents.on("did-finish-load", () => {
    pollVol();
  });
  win.on("closed", () => {
    if (proximityInterval) clearInterval(proximityInterval);
    if (systemUpdateInterval) clearInterval(systemUpdateInterval);
    if (volInterval) clearTimeout(volInterval);
    if (weatherInterval) clearInterval(weatherInterval);
    win = null;
  });
  fetchWeather();
  weatherInterval = setInterval(fetchWeather, 20 * 60 * 1e3);
  ipcMain.on("set-ignore-mouse-events", (event, ignore) => {
    if (win && !win.isDestroyed()) {
      win.setIgnoreMouseEvents(ignore, { forward: true });
    }
  });
  ipcMain.on("set-window-height", (event, h) => {
    if (win && !win.isDestroyed()) {
      win.setSize(windowWidth, Math.max(h, 40), true);
    }
  });
  ipcMain.on("set-is-expanded", (event, expanded) => {
  });
  ipcMain.on("set-is-preview", (event, preview) => {
  });
  let currentIslandX = 0;
  ipcMain.on("update-island-pos", (event, x) => {
    currentIslandX = x;
  });
  ipcMain.on("set-is-super-pill", (event, active) => {
  });
  proximityInterval = setInterval(() => {
    if (!win || win.isDestroyed()) return;
    const { x, y } = screen.getCursorScreenPoint();
    const b = win.getBounds();
    const islandCenterX = b.x + b.width / 2 + currentIslandX;
    const relX = x - islandCenterX;
    const relY = y - b.y;
    const [winW, winH] = win.getSize();
    safeSend(win, "mouse-proximity", { relX, relY });
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
    createWindow();
  });
}
const sendKeyToMeeting = (keys) => {
  const psKey = `
    $ErrorActionPreference = 'SilentlyContinue';
    Add-Type -AssemblyName System.Windows.Forms;
    $sig = '[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);';
    if (-not ([System.Management.Automation.PSTypeName]'Win32API.Win32').Type) {
        Add-Type -MemberDefinition $sig -Name "Win32" -Namespace "Win32API";
    }
    
    $search = if ('${currentMeetingApp}' -eq 'Zoom') { 'Zoom Meeting|Zoom' } elseif ('${currentMeetingApp}' -eq 'Meet') { 'Meet - |Google Meet' } else { 'Reunión|Llamada|Meeting|Teams' }
    # Strict filter: Must have MainWindowHandle, match title, but NOT be a shell or electron process.
    $p = Get-Process | Where-Object { 
        $_.MainWindowHandle -ne [IntPtr]::Zero -and 
        $_.MainWindowTitle -match $search -and 
        $_.ProcessName -notmatch 'powershell|node|electron|conhost' -and
        ($_.ProcessName -match 'Teams|ms-teams|Zoom|chrome|msedge|firefox' -or $_.MainWindowTitle -match 'Zoom Meeting|Google Meet|Reunión de ')
    } | Sort-Object { $_.MainWindowTitle -match 'Reunión|Llamada|Meeting|Zoom Meeting|Meet - ' } -Descending | Select-Object -First 1;

    if (-not $p -and '${currentMeetingApp}' -eq 'Teams') {
        $p = Get-Process -Name 'ms-teams', 'Teams' -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero -and $_.ProcessName -notmatch 'powershell|node' } | Sort-Object { $_.MainWindowTitle.Length } -Descending | Select-Object -First 1
    }
    if ($p) {
        Write-Output "__DEBUG__TargetProcess: $($p.ProcessName) | Title: $($p.MainWindowTitle)"
        $res = [Win32API.Win32]::SetForegroundWindow($p.MainWindowHandle);
        Write-Output "__DEBUG__FocusResult: $res"
        Start-Sleep -m 400;
        [System.Windows.Forms.SendKeys]::SendWait('${keys}');
        Write-Output "__DEBUG__KeysSent: ${keys}"
    } else {
        Write-Output "__DEBUG__Error: No Meeting Window found for $search (Current app: ${currentMeetingApp})"
    }
  `;
  return new Promise((resolve) => {
    const ps = spawn("powershell", ["-Command", psKey]);
    ps.stdout.on("data", (d) => {
    });
    ps.stderr.on("data", (d) => {
    });
    ps.on("close", () => resolve(true));
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
systemUpdateInterval = setInterval(() => {
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
  safeSend(win, "system-update", { cpu: cpuUsage, ram: ramUsage, net: 1.5 + Math.random() * 2 });
}, 2e3);
const getResPath = (relPath) => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, relPath);
  }
  const devPath = path.join(process.cwd(), relPath);
  if (fs.existsSync(devPath)) return devPath;
  return path.join(__dirname$1, "..", relPath);
};
const volExe = getResPath("volume.exe");
const getVol = () => new Promise((res) => {
  if (!fs.existsSync(volExe)) return res(-1);
  exec(`"${volExe}" get`, (err, stdout) => {
    if (err) return res(-1);
    const v = parseInt(stdout.trim(), 10);
    res(isNaN(v) ? -1 : v);
  });
});
let isSettingVolume = false;
let lastVolumeToSet = null;
const setVol = async (v) => {
  lastVolumeToSet = v;
  if (isSettingVolume) return;
  isSettingVolume = true;
  while (lastVolumeToSet !== null) {
    const target = lastVolumeToSet;
    lastVolumeToSet = null;
    await new Promise((res) => {
      exec(`"${volExe}" set ${Math.round(target)}`, () => res(null));
    });
  }
  isSettingVolume = false;
};
const pollVol = async () => {
  if (!win || win.isDestroyed()) return;
  try {
    const v = await getVol();
    if (v >= 0) safeSend(win, "volume-update", v);
  } catch (e) {
  }
  volInterval = setTimeout(pollVol, 1500);
};
let mediaProc = null;
try {
  const mediaReaderPath = app.isPackaged ? path.join(__dirname$1, "media-reader.js") : path.join(process.cwd(), "electron", "media-reader.mjs");
  console.log(`[MAIN] Launching Media Reader: ${mediaReaderPath}`);
  mediaProc = fork(mediaReaderPath, [process.resourcesPath || ""], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
    stdio: ["inherit", "inherit", "inherit", "ipc"]
  });
  let lastMediaMsg = null;
  let mediaSessions = /* @__PURE__ */ new Map();
  if (mediaProc) {
    if (mediaProc.stdout) {
      mediaProc.stdout.on("data", (d) => {
      });
      mediaProc.stderr.on("data", (d) => {
      });
    }
    mediaProc.on("message", (msg) => {
      if ((msg == null ? void 0 : msg.type) === "MEDIA_UPDATE") {
        const data = msg.data;
        if (!data) return;
        const sessionKey = data.id && data.id !== "system" ? data.id : data.title + "||" + (data.artist || "");
        if (data.title && data.title !== "Sin Reproducción") {
          mediaSessions.set(sessionKey, { ...data, timestamp: Date.now() });
        }
        let sessionsList = Array.from(mediaSessions.values()).filter((s) => s.title !== "Sin Reproducción").sort((a, b) => b.timestamp - a.timestamp);
        let displayData = data;
        const activePlaying = sessionsList.find((s) => s.isPlaying);
        if (activePlaying) {
          displayData = activePlaying;
        } else {
          if (sessionsList.length > 0) {
            displayData = sessionsList[0];
          }
        }
        lastMediaMsg = displayData;
        safeSend(win, "media-update", displayData);
      }
    });
  }
  let lastNotifId = "";
  let psMeet = null;
  let psMeetBuf = "";
  let meetingUpdateSilenceUntil = 0;
  const startMeetPS = () => {
    const psPath = path.join(os.tmpdir(), "notchly-meet.ps1");
    const psCode = `
      $ErrorActionPreference = 'Continue'
      Write-Output "__DEBUG__PS_Script_Internal_Start"
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
      interface IMMDeviceEnumerator { int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice endpoint); int EnumAudioEndpoints(int dataFlow, int stateMask, out IMMDeviceCollection devices); }
      [Guid("0BD7A1AD-7E6D-4359-8CA7-3C5644E2096F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IMMDeviceCollection { int GetCount(out int count); int Item(int index, out IMMDevice device); }
      [Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IAudioMeterInformation { int GetPeakValue(out float peak); }
      [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMDevEnum { }
      public class MicCheck {
          public static int GetStatus() {
              try {
                  var enumerator = (IMMDeviceEnumerator)new MMDevEnum();
                  IMMDeviceCollection devices;
                  if (enumerator.EnumAudioEndpoints(1, 1, out devices) != 0) return 0;
                  int deviceCount; devices.GetCount(out deviceCount);
                  var iid = new Guid("77AA9910-1EE6-440D-B95F-456477E6E273");
                  bool sessionFound = false;
                  for (int j = 0; j < deviceCount; j++) {
                      IMMDevice device; 
                      if (devices.Item(j, out device) != 0) continue;
                      IAudioSessionManager2 manager;
                      if (device.Activate(ref iid, 23, IntPtr.Zero, out manager) != 0) continue;
                      IAudioSessionEnumerator sessionEnum;
                      if (manager.GetSessionEnumerator(out sessionEnum) != 0) continue;
                      int count; sessionEnum.GetCount(out count);
                      for (int i = 0; i < count; i++) {
                          IAudioSessionControl session;
                          if (sessionEnum.GetSession(i, out session) == 0) {
                              int state; session.GetState(out state);
                              if (state == 1) {
                                  sessionFound = true;
                                  IAudioMeterInformation meter = (IAudioMeterInformation)session;
                                  float peak = 0;
                                  if (meter.GetPeakValue(out peak) == 0 && peak > 0.0001f) return 2; // DEFINITELY ACTIVE (SOUND)
                              }
                          }
                      }
                  }
                  return sessionFound ? 1 : 0; // 1 = POTENTIALLY ACTIVE (SESSION)
              } catch {}
              return 0;
          }
      }
'@
      try {
        Add-Type -TypeDefinition $code -ErrorAction Stop
      } catch {
        Write-Output "__DEBUG__AddType_Failed: $($_.Exception.Message)"
      }
      Write-Output "__DEBUG__PS_Script_Started"
      while($true) {
        try {
          # 1. C# Hybrid Check
          $micStatus = [MicCheck]::GetStatus()
          
          # 2. Registry Scan (Baseline)
          $regMic = $false
          $parents = "HKCU:/Software/Microsoft/Windows/CurrentVersion/CapabilityAccessManager/ConsentStore/microphone", 
                     "HKLM:/Software/Microsoft/Windows/CurrentVersion/CapabilityAccessManager/ConsentStore/microphone"
          foreach ($p in $parents) {
            if (Test-Path $p) {
              $active = Get-ChildItem -Path $p -Recurse -Depth 3 -ErrorAction SilentlyContinue | 
                        Get-ItemProperty -ErrorAction SilentlyContinue | 
                        Where-Object { $_.LastUsedTimeStop -eq 0 -and $_.LastUsedTimeStart -gt 0 }
              if ($active) { $regMic = $true; break }
            }
          }
          
          # 3. Camera Scan
          $camInUse = $false
          $camParents = "HKCU:/Software/Microsoft/Windows/CurrentVersion/CapabilityAccessManager/ConsentStore/webcam", 
                        "HKLM:/Software/Microsoft/Windows/CurrentVersion/CapabilityAccessManager/ConsentStore/webcam"
          foreach ($p in $camParents) {
            if (Test-Path $p) {
              $active = Get-ChildItem -Path $p -Recurse -Depth 3 -ErrorAction SilentlyContinue | 
                        Get-ItemProperty -ErrorAction SilentlyContinue | 
                        Where-Object { $_.LastUsedTimeStop -eq 0 -and $_.LastUsedTimeStart -gt 0 }
              if ($active) { $camInUse = $true; break }
            }
          }
          
          # 4. Window Detection (Ultra-Strict keywords to avoid Chat/Home windows)
          $keywords = 'Reunión|Llamada|Meeting|Call|Meet|Reun|curso|Zoom Meeting'
          $allP = Get-Process | Where-Object { 
            $_.MainWindowTitle -ne '' -and 
            ($_.MainWindowTitle -match $keywords) -and 
            ($_.ProcessName -match 'Teams|Zoom|ms-teams|Meet|Webex|chrome|msedge|firefox') 
          }
          $found = $null
          $isMeeting = $false
          $titleMuted = $false
          if ($allP) {
            foreach($p in $allP) {
              $t = $p.MainWindowTitle
              # Filter out chat/home windows explicitly
              if ($t -match $keywords -and $t -notmatch '^Teams$|^Microsoft Teams$|^Zoom$|^Zoom Cloud Meetings$|^Chat ') {
                 $found = $p; $isMeeting = $true
                 # Detect mute state by title suffix
                 if ($t -match ' (Silenciado)| (Muted)| (Desactivado)| (Mic Off)| (Silenciar)| (Mute)') { $titleMuted = $true }
                 break
              }
            }
            if (-not $found) { 
              # Final attempt: grab anything that matched process but be less confident
              $found = $allP | Select-Object -First 1 
            }
          }
          
          # Hybrid Logic: Confidence-based states
          $micFinal = $false
          $conf = "Low"
          if ($micStatus -eq 2) { 
            $micFinal = $true; $conf = "High" # Sound Peak
          } elseif ($isMeeting -and $titleMuted) {
            $micFinal = $false; $conf = "High" # Title Match
          } elseif ($micStatus -eq 1 -or $regMic) {
            $micFinal = $true; $conf = "Low" # Active Session
          } else {
            $micFinal = $false; $conf = "High" # Definitely inactive
          }
          
          # Diagnostic output
          Write-Output "__DEBUG__Stats | Status:$micStatus | Reg:$regMic | TitleMute:$titleMuted | Final:$micFinal | Conf:$conf | Title:$($found.MainWindowTitle)"
          
          $bt = Get-PnpDevice -Class 'AudioEndpoint' -Status 'OK' -ErrorAction SilentlyContinue | 
                Where-Object { $_.FriendlyName -match 'Bluetooth|Headset|Auricular|Hand-free|Llamada' } | 
                Select-Object -First 1
          
          $appName = if($found){ 
            if($found.MainWindowTitle -match 'Teams' -or $found.ProcessName -match 'Teams'){ 'Teams' } 
            elseif($found.MainWindowTitle -match 'Zoom' -or $found.ProcessName -match 'Zoom'){ 'Zoom' } 
            elseif($found.MainWindowTitle -match 'Meet|Google'){ 'Meet' } 
            else { $found.ProcessName } 
          } else { '' }
          
          Write-Output "__MEET__$([string]$micFinal)|$([string]$isMeeting)|$($appName)|$($bt.FriendlyName)|$([string]$camInUse)|$conf|$([string]$titleMuted)"
        } catch {
          Write-Output "__DEBUG__Loop_Error: $($_.Exception.Message)"
        }
        Start-Sleep -m 500
      }
    `;
    fs.writeFileSync(psPath, psCode, "utf8");
    psMeet = spawn("powershell", ["-ExecutionPolicy", "Bypass", "-File", psPath]);
    psMeet.stdout.on("data", (d) => {
      const str = d.toString();
      psMeetBuf += str;
      let nl;
      while ((nl = psMeetBuf.indexOf("\n")) !== -1) {
        const line = psMeetBuf.slice(0, nl).trim();
        psMeetBuf = psMeetBuf.slice(nl + 1);
        if (line.startsWith("__DEBUG__")) {
          continue;
        }
        if (line.startsWith("__MEET__")) {
          const parts = line.replace("__MEET__", "").split("|");
          if (parts.length >= 6) {
            const [micUseStr, isMeetStr, app2, btDevice, camUseStr, conf, titleMutedStr] = parts;
            const micUse = micUseStr.toLowerCase() === "true";
            const isMeetRaw = isMeetStr.toLowerCase() === "true";
            const camUse = camUseStr.toLowerCase() === "true";
            const titleMuted = (titleMutedStr ?? "").toLowerCase() === "true";
            const isActuallyActive = isMeetRaw && (micUse || camUse);
            if (isActuallyActive) {
              meetingExitCounter = 0;
              if (app2.toLowerCase().includes("zoom")) currentMeetingApp = "Zoom";
              else if (app2.toLowerCase().includes("meet")) currentMeetingApp = "Meet";
              else if (app2.toLowerCase().includes("teams")) currentMeetingApp = "Teams";
              else currentMeetingApp = app2 || "Llamada";
            } else {
              meetingExitCounter++;
            }
            const isActive = meetingExitCounter < 6;
            if (!isActive) {
              isUserMuted = false;
              isUserCamOff = false;
            }
            if (micUse && conf === "High") {
              currentMicState = true;
              isUserMuted = false;
            } else if (titleMuted) {
              currentMicState = false;
              isUserMuted = true;
            } else if (!micUse && conf === "High") {
              currentMicState = false;
              isUserMuted = true;
            } else {
              currentMicState = !isUserMuted;
            }
            const camFinal = isUserCamOff ? false : camUse;
            if (Date.now() < meetingUpdateSilenceUntil) return;
            safeSend(win, "meeting-update", {
              isActive,
              app: isActuallyActive || isActive ? app2 || "Llamada Activa" : "",
              device: btDevice || "Sistema",
              micActive: currentMicState,
              camActive: camFinal
            });
          }
        }
      }
    });
    psMeet.stderr.on("data", (d) => {
    });
    psMeet.on("exit", () => setTimeout(startMeetPS, 5e3));
  };
  setTimeout(startMeetPS, 3e3);
  ipcMain.handle("get-media-source-id", async (_event, mediaInfo) => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ["window"],
        thumbnailSize: { width: 0, height: 0 }
      });
      const { title, artist } = mediaInfo;
      if (!title || title === "Ningún origen de medios") return null;
      const t = title.toLowerCase();
      const a = (Array.isArray(artist) ? artist : [artist]).map((x) => x.toLowerCase());
      let source = sources.find((s) => {
        const n = s.name.toLowerCase();
        return n.includes(t) && a.some((x) => n.includes(x));
      });
      if (!source) source = sources.find((s) => s.name.toLowerCase().includes(t));
      if (!source && a.some((x) => x.includes("spotify"))) {
        source = sources.find((s) => s.name.toLowerCase().includes("spotify"));
      }
      return source ? source.id : null;
    } catch (e) {
      return null;
    }
  });
  ipcMain.handle("get-current-media", async () => {
    if (lastMediaMsg) return lastMediaMsg;
    await new Promise((r) => setTimeout(r, 1200));
    return lastMediaMsg || null;
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
  ipcMain.handle("get-volume", async () => await getVol());
  ipcMain.handle("set-volume", (_e, v) => {
    setVol(v);
    return true;
  });
  ipcMain.handle("open-app", async (_event, appName) => {
    const lower = appName.toLowerCase();
    if (lower.includes("chrome")) exec("start chrome");
    else if (lower.includes("spotify")) exec("start spotify");
    else if (lower.includes("camera")) exec("start microsoft.windows.camera:");
    else exec(`start "" "${appName}"`);
    return true;
  });
  ipcMain.handle("meeting-command", async (_event, cmd) => {
    meetingUpdateSilenceUntil = Date.now() + 8e3;
    if (cmd === "toggleMic") {
      isUserMuted = !isUserMuted;
      currentMicState = !isUserMuted;
      const keys = currentMeetingApp === "Zoom" ? "%a" : currentMeetingApp === "Meet" ? "^d" : "^+m";
      await sendKeyToMeeting(keys);
    } else if (cmd === "toggleCam") {
      isUserCamOff = !isUserCamOff;
      const keys = currentMeetingApp === "Zoom" ? "%v" : currentMeetingApp === "Meet" ? "^e" : "^+o";
      await sendKeyToMeeting(keys);
    } else if (cmd === "endCall") {
      isUserMuted = false;
      isUserCamOff = false;
      currentMicState = false;
      if (currentMeetingApp === "Zoom") {
        await sendKeyToMeeting("%q");
        setTimeout(() => sendKeyToMeeting("{ENTER}"), 200);
      } else if (currentMeetingApp === "Meet") await sendKeyToMeeting("^w");
      else await sendKeyToMeeting("^+h");
    }
  });
  app.on("before-quit", () => {
    mediaProc == null ? void 0 : mediaProc.kill();
    if (typeof psMeet !== "undefined" && psMeet) psMeet.kill();
    if (typeof psNotif !== "undefined" && psNotif) psNotif.kill();
  });
} catch (err) {
  console.error("[MAIN] Setup Error:", err);
}
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});
export {
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
