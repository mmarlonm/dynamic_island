import { app as y, ipcMain as l, screen as B, BrowserWindow as J } from "electron";
import M from "node:path";
import { fileURLToPath as Q } from "node:url";
import R from "node:fs";
import { fork as ee, spawn as V, exec as g } from "node:child_process";
import T from "node:os";
const P = M.dirname(Q(import.meta.url));
process.env.APP_ROOT = M.join(P, "..");
const Z = process.env.VITE_DEV_SERVER_URL, te = M.join(process.env.APP_ROOT, "dist");
let e, a = "Teams", I = !1, S = !1, _ = !1, F = 0;
function ne() {
  const i = B.getPrimaryDisplay(), { width: r, height: p } = i.bounds, s = r, u = 600;
  e = new J({
    width: s,
    height: u,
    x: 0,
    y: 0,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    hasShadow: !1,
    resizable: !1,
    webPreferences: {
      preload: M.join(P, "preload.js")
    }
  }), e.setIgnoreMouseEvents(!0, { forward: !0 }), Z ? e.loadURL(Z) : e.loadFile(M.join(te, "index.html")), e.webContents.on("did-finish-load", () => {
    e == null || e.show(), e == null || e.focus(), K();
  }), l.on("set-ignore-mouse-events", (o, n) => {
    e && !e.isDestroyed() && e.setIgnoreMouseEvents(n, { forward: !0 });
  });
  let h = !1;
  l.on("set-window-height", (o, n) => {
    e && !e.isDestroyed() && e.setSize(s, Math.max(n, 40), !0);
  }), l.on("set-is-expanded", (o, n) => {
    h = n;
  });
  let E = 0, t = !1;
  l.on("update-island-pos", (o, n) => {
    E = n;
  }), l.on("set-is-super-pill", (o, n) => {
    t = n;
  }), setInterval(() => {
    if (!e || e.isDestroyed()) return;
    const { x: o, y: n } = B.getCursorScreenPoint(), w = e.getBounds(), $ = w.x + w.width / 2 + E, c = o - $, m = n - w.y, [k, W] = e.getSize(), C = h ? 350 : t ? 40 : 180, b = Math.abs(c) <= C, G = !h && !t && (c >= -380 && c <= -220 || // Left bubble (Call)
    c >= 200 && c <= 270), v = h ? W - 10 : t ? 48 : 66, A = (b || G) && m >= 0 && m <= v;
    e.setIgnoreMouseEvents(!A, { forward: !0 }), e.webContents.send("mouse-proximity", { isNear: A, relX: c, relY: m });
  }, 35);
}
const ie = y.requestSingleInstanceLock();
ie ? (y.on("second-instance", () => {
  e && (e.isMinimized() && e.restore(), e.focus());
}), y.whenReady().then(() => {
  ne();
})) : y.quit();
const d = (i) => {
  const r = `
    $ErrorActionPreference = 'SilentlyContinue';
    Add-Type -AssemblyName System.Windows.Forms;
    $sig = '[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);';
    if (-not ([System.Management.Automation.PSTypeName]'Win32API.Win32').Type) {
        Add-Type -MemberDefinition $sig -Name "Win32" -Namespace "Win32API";
    }
    
    $search = if ('${a}' -eq 'Zoom') { 'Zoom Meeting|Zoom' } elseif ('${a}' -eq 'Meet') { 'Meet - |Google Meet' } else { 'Reunión|Llamada|Meeting|Teams' }
    # Strict filter: Must have MainWindowHandle, match title, but NOT be a shell or electron process.
    $p = Get-Process | Where-Object { 
        $_.MainWindowHandle -ne [IntPtr]::Zero -and 
        $_.MainWindowTitle -match $search -and 
        $_.ProcessName -notmatch 'powershell|node|electron|conhost' -and
        ($_.ProcessName -match 'Teams|ms-teams|Zoom|chrome|msedge|firefox' -or $_.MainWindowTitle -match 'Zoom Meeting|Google Meet|Reunión de ')
    } | Sort-Object { $_.MainWindowTitle -match 'Reunión|Llamada|Meeting|Zoom Meeting|Meet - ' } -Descending | Select-Object -First 1;

    if (-not $p -and '${a}' -eq 'Teams') {
        $p = Get-Process -Name 'ms-teams', 'Teams' -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero -and $_.ProcessName -notmatch 'powershell|node' } | Sort-Object { $_.MainWindowTitle.Length } -Descending | Select-Object -First 1
    }
    if ($p) {
        Write-Output "__DEBUG__TargetProcess: $($p.ProcessName) | Title: $($p.MainWindowTitle)"
        $res = [Win32API.Win32]::SetForegroundWindow($p.MainWindowHandle);
        Write-Output "__DEBUG__FocusResult: $res"
        Start-Sleep -m 400;
        [System.Windows.Forms.SendKeys]::SendWait('${i}');
        Write-Output "__DEBUG__KeysSent: ${i}"
    } else {
        Write-Output "__DEBUG__Error: No Meeting Window found for $search (Current app: ${a})"
    }
  `;
  return new Promise((p) => {
    const s = V("powershell", ["-Command", r]);
    s.stdout.on("data", (u) => {
    }), s.stderr.on("data", (u) => {
    }), s.on("close", () => p(!0));
  });
};
l.handle("toggle-system-mute", async () => (a === "Zoom" ? await d("%a") : a === "Meet" ? await d("^d") : await d("^+m"), !0));
l.handle("toggle-video", async () => (a === "Zoom" ? await d("%v") : a === "Meet" ? await d("^e") : await d("^+o"), !0));
l.handle("end-call", async () => (a === "Zoom" ? (await d("%q"), await d("{ENTER}")) : a === "Meet" ? await d("^w") : await d("^+h"), !0));
let H = T.cpus();
setInterval(() => {
  if (!e || e.isDestroyed()) return;
  const i = T.totalmem(), r = T.freemem(), p = (i - r) / i * 100, s = T.cpus();
  let u = 0, h = 0;
  for (let t = 0; t < s.length; t++) {
    const o = H[t].times, n = s[t].times, w = Object.values(o).reduce((c, m) => c + m, 0), $ = Object.values(n).reduce((c, m) => c + m, 0);
    u += $ - w, h += n.idle - o.idle;
  }
  const E = u > 0 ? (1 - h / u) * 100 : 0;
  H = s, e.webContents.send("system-update", { cpu: E, ram: p, net: 1.5 + Math.random() * 2 });
}, 2e3);
const oe = (i) => {
  if (y.isPackaged)
    return M.join(process.resourcesPath, i);
  const r = M.join(process.cwd(), i);
  return R.existsSync(r) ? r : M.join(P, "..", i);
}, L = oe("volume.exe"), q = () => new Promise((i) => {
  if (!R.existsSync(L)) return i(-1);
  g(`"${L}" get`, (r, p) => {
    if (r) return i(-1);
    const s = parseInt(p.trim(), 10);
    i(isNaN(s) ? -1 : s);
  });
});
let U = !1, D = null;
const se = async (i) => {
  if (D = i, !U) {
    for (U = !0; D !== null; ) {
      const r = D;
      D = null, await new Promise((p) => {
        g(`"${L}" set ${Math.round(r)}`, () => p(null));
      });
    }
    U = !1;
  }
}, K = async () => {
  if (!(!e || e.isDestroyed())) {
    try {
      const i = await q();
      i >= 0 && e.webContents.send("volume-update", i);
    } catch {
    }
    setTimeout(K, 1500);
  }
};
let f = null;
try {
  const i = y.isPackaged ? M.join(P, "media-reader.js") : M.join(process.cwd(), "electron", "media-reader.mjs");
  console.log(`[MAIN] Launching Media Reader: ${i}`), f = ee(i, [process.resourcesPath || ""], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
    stdio: ["inherit", "inherit", "inherit", "ipc"]
  });
  let r = null;
  f && (f.stdout && (f.stdout.on("data", (t) => {
  }), f.stderr.on("data", (t) => {
  })), f.on("message", (t) => {
    (t == null ? void 0 : t.type) === "MEDIA_UPDATE" && (r = t.data, e == null || e.webContents.send("media-update", t.data));
  }));
  let p = "", s = null, u = "", h = 0;
  const E = () => {
    const t = M.join(T.tmpdir(), "notchly-meet.ps1");
    R.writeFileSync(t, `
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
    `, "utf8"), s = V("powershell", ["-ExecutionPolicy", "Bypass", "-File", t]), s.stdout.on("data", (n) => {
      const w = n.toString();
      u += w;
      let $;
      for (; ($ = u.indexOf(`
`)) !== -1; ) {
        const c = u.slice(0, $).trim();
        if (u = u.slice($ + 1), !c.startsWith("__DEBUG__") && c.startsWith("__MEET__")) {
          const m = c.replace("__MEET__", "").split("|");
          if (m.length >= 6) {
            const [k, W, C, b, G, v, A] = m, N = k.toLowerCase() === "true", z = W.toLowerCase() === "true", j = G.toLowerCase() === "true", X = (A ?? "").toLowerCase() === "true", x = z && (N || j);
            x ? (F = 0, C.toLowerCase().includes("zoom") ? a = "Zoom" : C.toLowerCase().includes("meet") ? a = "Meet" : C.toLowerCase().includes("teams") ? a = "Teams" : a = C || "Llamada") : F++;
            const O = F < 6;
            O || (S = !1, _ = !1), N && v === "High" ? (I = !0, S = !1) : X || !N && v === "High" ? (I = !1, S = !0) : I = !S;
            const Y = _ ? !1 : j;
            if (Date.now() < h) return;
            e == null || e.webContents.send("meeting-update", {
              isActive: O,
              app: x || O ? C || "Llamada Activa" : "",
              device: b || "Sistema",
              micActive: I,
              camActive: Y
            });
          }
        }
      }
    }), s.stderr.on("data", (n) => {
    }), s.on("exit", () => setTimeout(E, 5e3));
  };
  setTimeout(E, 3e3), setInterval(() => {
    if (!e || e.isDestroyed()) return;
    const t = `
      $noise = 'SideBySide','VSS','ESENT','MSExchange','Security-SPP','Desktop Window Manager','.NET Runtime','Windows Error Reporting','DistributedCOM','Service Control Manager';
      $e = Get-WinEvent -LogName Application -MaxEvents 5 -ErrorAction SilentlyContinue | 
           Where-Object { $_.LevelDisplayName -eq 'Information' -and $noise -notcontains $_.ProviderName } |
           Select-Object -First 1 -Property TimeCreated, ProviderName, Message;
      if ($e) {
        $msg = ($e.Message -split '\\n')[0] -replace '[^\\x20-\\x7EáéíóúÁÉÍÓÚñÑ]', '';
        Write-Output ($e.TimeCreated.ToString('o') + '|||' + $e.ProviderName + '|||' + $msg)
      }
    `.trim();
    g(`powershell -Command "${t.replace(/\n/g, " ")}"`, (o, n) => {
      if (o || !(n != null && n.trim())) return;
      const w = n.trim().split("|||");
      if (w.length < 3) return;
      const [$, c, m] = w;
      !$ || $ === p || (p = $, e == null || e.webContents.send("notification", { app: c, text: m }));
    });
  }, 3e3), l.handle("get-current-media", async () => r || (await new Promise((t) => setTimeout(t, 1200)), r || null)), l.handle("toggle-wifi", async () => (g(`powershell -Command "if((Get-NetAdapter -Name 'Wi-Fi').Status -eq 'Up') { Disable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false } else { Enable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false }"`), !0)), l.handle("toggle-bluetooth", async () => (g(`powershell -Command "Add-Type -AssemblyName Windows.Devices.Radios; \\$r=[Windows.Devices.Radios.Radio]::GetRadiosAsync().GetAwaiter().GetResult() | Where-Object { \\$_.Kind -eq 'Bluetooth' }; if(\\$r.State -eq 'On') { \\$r.SetStateAsync('Off') } else { \\$r.SetStateAsync('On') }"`), !0)), l.handle("media-command", (t, o) => f == null ? void 0 : f.send(o)), l.handle("get-volume", async () => await q()), l.handle("set-volume", (t, o) => (se(o), !0)), l.handle("open-app", async (t, o) => {
    const n = o.toLowerCase();
    return n.includes("chrome") ? g("start chrome") : n.includes("spotify") ? g("start spotify") : n.includes("camera") ? g("start microsoft.windows.camera:") : g(`start "" "${o}"`), !0;
  }), l.handle("meeting-command", async (t, o) => {
    h = Date.now() + 8e3, o === "toggleMic" ? (S = !S, I = !S, await d(a === "Zoom" ? "%a" : a === "Meet" ? "^d" : "^+m")) : o === "toggleCam" ? (_ = !_, await d(a === "Zoom" ? "%v" : a === "Meet" ? "^e" : "^+o")) : o === "endCall" && (S = !1, _ = !1, I = !1, a === "Zoom" ? (await d("%q"), setTimeout(() => d("{ENTER}"), 200)) : a === "Meet" ? await d("^w") : await d("^+h"));
  }), y.on("before-quit", () => {
    f == null || f.kill(), typeof s < "u" && s && s.kill();
  });
} catch (i) {
  console.error("[MAIN] Setup Error:", i);
}
y.on("window-all-closed", () => {
  e = null, process.platform !== "darwin" && y.quit();
});
export {
  te as RENDERER_DIST,
  Z as VITE_DEV_SERVER_URL
};
