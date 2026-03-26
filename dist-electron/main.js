import { app as y, ipcMain as l, screen as N, BrowserWindow as k } from "electron";
import E from "node:path";
import { fileURLToPath as V } from "node:url";
import U from "node:fs";
import { fork as x, spawn as R, exec as M } from "node:child_process";
import T from "node:os";
console.log("[MAIN] Electron process starting...");
const G = E.dirname(V(import.meta.url));
process.env.APP_ROOT = E.join(G, "..");
const b = process.env.VITE_DEV_SERVER_URL, j = E.join(process.env.APP_ROOT, "dist");
let e, r = "Teams";
function B() {
  console.log("[MAIN] Creating BrowserWindow...");
  const d = N.getPrimaryDisplay(), { width: I, height: h } = d.bounds, a = I, u = 600;
  e = new k({
    width: a,
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
      preload: E.join(G, "preload.js")
    }
  }), e.setIgnoreMouseEvents(!0, { forward: !0 }), b ? (console.log("[MAIN] Loading from Vite Dev Server:", b), e.loadURL(b)) : (console.log("[MAIN] Loading from packaged dist..."), e.loadFile(E.join(j, "index.html"))), e.webContents.on("did-finish-load", () => {
    console.log("[MAIN] Window content loaded successfully."), e == null || e.show(), e == null || e.focus();
  }), e.webContents.on("did-fail-load", (o, i, m) => {
    console.error(`[MAIN] Failed to load window: ${m} (${i})`);
  }), l.on("set-ignore-mouse-events", (o, i) => {
    e && !e.isDestroyed() && e.setIgnoreMouseEvents(i, { forward: !0 });
  });
  let p = !1;
  l.on("set-window-height", (o, i) => {
    e && !e.isDestroyed() && e.setSize(a, Math.max(i, 40), !0);
  }), l.on("set-is-expanded", (o, i) => {
    p = i;
  }), l.on("update-island-pos", (o, i) => {
  }), setInterval(() => {
    if (!e || e.isDestroyed()) return;
    const { x: o, y: i } = N.getCursorScreenPoint(), m = e.getBounds(), g = o - (m.x + m.width / 2), C = i - m.y, [A, S] = e.getSize(), t = p ? 400 : 200, s = p ? S + 40 : 35, n = Math.abs(g) <= t && C >= 0 && C <= s;
    e.setIgnoreMouseEvents(!n, { forward: !0 }), e.webContents.send("mouse-proximity", { isNear: n, relX: g, relY: C });
  }, 35);
}
const Z = y.requestSingleInstanceLock();
Z ? (y.on("second-instance", () => {
  e && (e.isMinimized() && e.restore(), e.focus());
}), y.whenReady().then(() => {
  console.log("[MAIN] App ready, creating window..."), B();
})) : (console.log("[MAIN] Single instance lock failed. Closing new instance..."), y.quit());
const c = (d) => {
  const h = `powershell -Command "${`
    Add-Type -AssemblyName System.Windows.Forms;
    $sig = '[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);';
    $type = Add-Type -MemberDefinition $sig -Name "Win32" -Namespace "Win32API" -PassThru;
    
    $searchPattern = switch ('${r}') {
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
                [System.Windows.Forms.SendKeys]::SendWait('${d}');
                exit 0;
            }
            $proc = Get-Process -Id $proc.Id; $hwnd = $proc.MainWindowHandle;
            Start-Sleep -m 250;
        }
    }
    exit 1;
  `.replace(/\n/g, " ").trim()}"`;
  return console.log(`[MAIN] Sending keys '${d}' to ${r}...`), new Promise((a) => {
    M(h, (u, p) => {
      p && console.log(p.trim()), a(!u);
    });
  });
};
l.handle("toggle-system-mute", async () => (r === "Zoom" ? await c("%a") : r === "Meet" ? await c("^d") : await c("^+m"), !0));
l.handle("toggle-video", async () => (r === "Zoom" ? await c("%v") : r === "Meet" ? await c("^e") : await c("^+o"), !0));
l.handle("end-call", async () => (r === "Zoom" ? (await c("%q"), await c("{ENTER}")) : r === "Meet" ? await c("^w") : await c("^+h"), !0));
let L = T.cpus();
setInterval(() => {
  if (!e || e.isDestroyed()) return;
  const d = T.totalmem(), I = T.freemem(), h = (d - I) / d * 100, a = T.cpus();
  let u = 0, p = 0;
  for (let i = 0; i < a.length; i++) {
    const m = L[i].times, g = a[i].times, C = Object.values(m).reduce((S, t) => S + t, 0), A = Object.values(g).reduce((S, t) => S + t, 0);
    u += A - C, p += g.idle - m.idle;
  }
  const o = u > 0 ? (1 - p / u) * 100 : 0;
  L = a, e.webContents.send("system-update", { cpu: o, ram: h, net: 1.5 + Math.random() * 2 });
}, 2e3);
let f = null;
try {
  const d = E.join(G, "media-reader.js");
  if (!U.existsSync(d)) {
    console.error(`[MAIN] CRITICAL: media-reader.js NOT FOUND at ${d}`);
    const t = E.join(process.cwd(), "dist-electron", "media-reader.js");
    console.log(`[MAIN] Trying fallback path: ${t}`);
  }
  console.log(`[MAIN] Forking media reader from: ${d}`), f = x(d, [], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
    stdio: ["pipe", "pipe", "pipe", "ipc"]
  });
  let I = null;
  f && (f.stdout && f.stdout.on("data", (t) => console.log(`[MEDIA-CHILD STDOUT] ${t.toString().trim()}`)), f.stderr && f.stderr.on("data", (t) => console.error(`[MEDIA-CHILD ERROR] ${t.toString().trim()}`)), f.on("message", (t) => {
    (t == null ? void 0 : t.type) === "MEDIA_UPDATE" && (I = t.data, e == null || e.webContents.send("media-update", t.data));
  }));
  let h = "", a = null, u = "";
  const p = () => {
    console.log("[MEET] Starting persistent meeting detection loop...");
    const t = E.join(T.tmpdir(), "notchly-meet.ps1");
    U.writeFileSync(t, `
      $ErrorActionPreference = 'SilentlyContinue'
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
        try {
          $micInUse = [MicCheck]::IsInUse()
          if (-not $micInUse) {
            $regs = @("HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone", "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone")
            foreach ($r in $regs) { if(Test-Path $r) { if((Get-ChildItem $r -Recurse | Get-ItemProperty -Name "LastUsedTimeStop" -ErrorAction SilentlyContinue | Where-Object { $_.LastUsedTimeStop -eq 0 }).Count -gt 0) { $micInUse = $true; break } } }
          }
          # Deep search for meeting windows - optimized
          $keywords = 'Llamada|Call|Meeting|Reun|Activo|curso|Talk|Join|Unirse|Meet|Vid|Video|Screen|Sharing'
          $allP = Get-Process | Where-Object { $_.MainWindowTitle -ne '' -and ($_.MainWindowTitle -match $keywords) }
          $found = $allP | Select-Object -First 1
          $isMeeting = if ($found) { $true } else { $false }
          
          # Definitive Mic check
          $micInUse = [MicCheck]::IsInUse()
          if (-not $micInUse) {
             $regs = @("HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone", "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone")
             foreach ($r in $regs) { if(Test-Path $r) { if((Get-ChildItem $r -Recurse | Get-ItemProperty -Name "LastUsedTimeStop" -ErrorAction SilentlyContinue | Where-Object { $_.LastUsedTimeStop -eq 0 }).Count -gt 0) { $micInUse = $true; break } } }
          }
          
          # Camera check
          $camInUse = $false
          $camRegs = @("HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam", "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam")
          foreach ($r in $camRegs) { if(Test-Path $r) { if((Get-ChildItem $r -Recurse | Get-ItemProperty -Name "LastUsedTimeStop" -ErrorAction SilentlyContinue | Where-Object { $_.LastUsedTimeStop -eq 0 }).Count -gt 0) { $camInUse = $true; break } } }
          
          if ($micInUse -and $found -and ($found.ProcessName -match 'Teams|Zoom|ms-teams|Meet')) {
            $isMeeting = $true
          }
          
          if ($isMeeting) { Write-Output "__DEBUG__ACTIVE: $($found.MainWindowTitle) [Mic:$micInUse|Cam:$camInUse]" }
          
          $bt = Get-PnpDevice -Class 'AudioEndpoint' -Status 'OK' -ErrorAction SilentlyContinue | Where-Object { $_.FriendlyName -match 'Bluetooth' } | Select-Object -First 1
          $appName = if($found){ 
            if($found.MainWindowTitle -match 'Teams' -or $found.ProcessName -match 'Teams'){ 'Teams' } 
            elseif($found.MainWindowTitle -match 'Zoom' -or $found.ProcessName -match 'Zoom'){ 'Zoom' } 
            elseif($found.MainWindowTitle -match 'Meet|Google'){ 'Meet' } 
            else { $found.ProcessName } 
          } else { '' }
          
          Write-Output "__MEET__$([string]$micInUse)|$([string]$isMeeting)|$($appName)|$($bt.FriendlyName)|$([string]$camInUse)"
        } catch {
          Write-Output "__DEBUG__Error:$($_.Exception.Message)"
        }
        Start-Sleep -m 500
      }
    `), a = R("powershell", ["-ExecutionPolicy", "Bypass", "-File", t], { stdio: ["ignore", "pipe", "pipe"] }), a.stdout.on("data", (n) => {
      console.log(`[MEET-RAW] ${n.toString().trim()}`), u += n.toString();
      let $;
      for (; ($ = u.indexOf(`
`)) !== -1; ) {
        const w = u.slice(0, $).trim();
        if (u = u.slice($ + 1), w.startsWith("__DEBUG__")) {
          console.log("[MEET-DEBUG]", w.replace("__DEBUG__", ""));
          continue;
        }
        if (w.startsWith("__MEET__")) {
          const D = w.replace("__MEET__", "").split("|");
          if (D.length >= 5) {
            const [_, O, v, F, P] = D, W = _.toLowerCase() === "true" || O.toLowerCase() === "true" || P.toLowerCase() === "true";
            W && (v.toLowerCase().includes("zoom") ? r = "Zoom" : v.toLowerCase().includes("meet") ? r = "Meet" : v.toLowerCase().includes("teams") ? r = "Teams" : r = v || "Llamada"), e == null || e.webContents.send("meeting-update", {
              isActive: W,
              app: W ? v || "Llamada Activa" : "",
              device: F || "Sistema",
              micActive: _.toLowerCase() === "true",
              camActive: P.toLowerCase() === "true"
            });
          }
        }
      }
    }), a.stderr.on("data", (n) => console.error("[MEET-PS ERROR]", n.toString())), a.on("exit", () => setTimeout(p, 5e3));
  };
  setTimeout(p, 3e3), setInterval(() => {
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
    M(`powershell -Command "${t.replace(/\n/g, " ")}"`, (s, n) => {
      if (s || !(n != null && n.trim())) return;
      const $ = n.trim().split("|||");
      if ($.length < 3) return;
      const [w, D, _] = $;
      !w || w === h || (h = w, e == null || e.webContents.send("notification", { app: D, text: _ }));
    });
  }, 3e3), l.handle("get-current-media", async () => I ? I.data : (await new Promise((t) => setTimeout(t, 1200)), (I == null ? void 0 : I.data) || null)), l.handle("toggle-wifi", async () => (M(`powershell -Command "if((Get-NetAdapter -Name 'Wi-Fi').Status -eq 'Up') { Disable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false } else { Enable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false }"`), !0)), l.handle("toggle-bluetooth", async () => (M(`powershell -Command "Add-Type -AssemblyName Windows.Devices.Radios; \\$r=[Windows.Devices.Radios.Radio]::GetRadiosAsync().GetAwaiter().GetResult() | Where-Object { \\$_.Kind -eq 'Bluetooth' }; if(\\$r.State -eq 'On') { \\$r.SetStateAsync('Off') } else { \\$r.SetStateAsync('On') }"`), !0)), l.handle("media-command", (t, s) => f == null ? void 0 : f.send(s));
  let o = null, i = !1, m = "", g = [];
  const C = [
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
  ].join(`
`), A = () => {
    o = R("powershell", ["-NoExit", "-NonInteractive", "-Command", "-"], { stdio: ["pipe", "pipe", "pipe"] }), o.stdout.on("data", (t) => {
      m += t.toString();
      let s;
      for (; (s = m.indexOf(`
`)) !== -1; ) {
        const n = m.slice(0, s).trim();
        if (m = m.slice(s + 1), n === "__VOL_READY__")
          i = !0, o.stdin.write(`[WinVol]::Get()
`);
        else if (/^\d+$/.test(n)) {
          const $ = parseInt(n, 10), w = g.shift();
          w && w($), e == null || e.webContents.send("volume-update", $);
        }
      }
    }), o.stdin.write(C + `
`), o.on("exit", () => {
      i = !1, setTimeout(A, 5e3);
    });
  };
  A();
  const S = () => new Promise((t) => {
    if (!i || !o) return t(null);
    g.push(t), o.stdin.write(`[WinVol]::Get()
`);
  });
  l.handle("get-volume", async () => await S()), l.handle("set-volume", (t, s) => {
    const n = Math.round(Math.max(0, Math.min(100, s)));
    return o == null || o.stdin.write(`[WinVol]::Set(${n})
`), !0;
  }), setInterval(async () => {
    const t = await S();
    t !== null && (e == null || e.webContents.send("volume-update", t));
  }, 4e3), l.handle("open-app", async (t, s) => {
    const n = s.toLowerCase();
    return n.includes("chrome") ? M("start chrome") : n.includes("spotify") ? M("start spotify") : n.includes("camera") ? M("start microsoft.windows.camera:") : M(`start "" "${s}"`), !0;
  }), l.handle("meeting-command", async (t, s) => {
    s === "toggleMic" ? await c(r === "Zoom" ? "%a" : r === "Meet" ? "^d" : "^+m") : s === "toggleCam" ? await c(r === "Zoom" ? "%v" : r === "Meet" ? "^e" : "^+o") : s === "endCall" && (r === "Zoom" ? (await c("%q"), setTimeout(() => c("{ENTER}"), 200)) : r === "Meet" ? await c("^w") : await c("^+h"));
  }), y.on("before-quit", () => {
    f == null || f.kill(), a == null || a.kill(), o == null || o.kill();
  });
} catch (d) {
  console.error("[MAIN] CRITICAL Initialization error:", d);
}
y.on("window-all-closed", () => {
  e = null, process.platform !== "darwin" && y.quit();
});
export {
  j as RENDERER_DIST,
  b as VITE_DEV_SERVER_URL
};
