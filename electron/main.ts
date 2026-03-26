console.log('[MAIN] Electron process starting...');
import { app, BrowserWindow, screen, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import { fork, exec, spawn } from 'node:child_process'
import os from 'node:os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

let win: BrowserWindow | null
let isInMeetingApp = false
let currentMeetingApp = 'Teams'
let lastHasCam = false, lastHasMic = false
let audioOutputDevice: 'Speaker' | 'Headphones' = 'Speaker'
let lastWifi = true, lastBt = true
let currentMicState = false
let isUserMuted = false
let meetingExitCounter = 0 // Debounce meeting exit

function createWindow() {
  console.log('[MAIN] Creating BrowserWindow...');
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.bounds
  const windowWidth = width
  const windowHeight = 600

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
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Essential for transparency visibility
  win.setIgnoreMouseEvents(true, { forward: true })

  if (VITE_DEV_SERVER_URL) {
    console.log('[MAIN] Loading from Vite Dev Server:', VITE_DEV_SERVER_URL);
    win.loadURL(VITE_DEV_SERVER_URL)
    // win.webContents.openDevTools({ mode: 'detach' }) // Optional: uncomment if needed
  } else {
    console.log('[MAIN] Loading from packaged dist...');
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  win.webContents.on('did-finish-load', () => {
    console.log('[MAIN] Window content loaded successfully.');
    win?.show();
    win?.focus();
  });

  win.webContents.on('did-fail-load', (e, code, desc) => {
    console.error(`[MAIN] Failed to load window: ${desc} (${code})`);
  });

  ipcMain.on('set-ignore-mouse-events', (event, ignore) => {
    if (win && !win.isDestroyed()) {
      // Robust Logic: If ignore is true, we ONLY ignore if not in expanded state
      // (This is a safety net in case the renderer sends stale ignore true)
      win.setIgnoreMouseEvents(ignore, { forward: true })
    }
  })

  let isExpandedMode = false;
  let currentIslandHeight = 75;

  ipcMain.on('set-window-height', (event, h) => {
    if (win && !win.isDestroyed()) {
      currentIslandHeight = h;
      win.setSize(windowWidth, Math.max(h, 40), true);
    }
  });

  ipcMain.on('set-is-expanded', (event, expanded) => {
    isExpandedMode = expanded;
  });

  let currentIslandX = width / 2;
  ipcMain.on('update-island-pos', (event, x) => {
    currentIslandX = x;
  });

  setInterval(() => {
    if (!win || win.isDestroyed()) return;
    const { x, y } = screen.getCursorScreenPoint();
    const b = win.getBounds();

    // Calculate relative to window center top
    const relX = x - (b.x + b.width / 2);
    const relY = y - b.y;
    const [winW, winH] = win.getSize();
    
    // Narrow body proximity for collapsed mode
    const isOverIsland = Math.abs(relX) <= (isExpandedMode ? 400 : 185);
    // Bubble zone on the left (approx range -360 to -185)
    const isOverBubble = (!isExpandedMode && relX >= -360 && relX <= -180);
    
    const heightLimit = isExpandedMode ? winH + 40 : 50; 

    const isInside = (isOverIsland || isOverBubble) && relY >= 0 && relY <= heightLimit;

    win.setIgnoreMouseEvents(!isInside, { forward: true });
    win.webContents.send('mouse-proximity', { isNear: isInside, relX, relY });
  }, 35);
}

const singleInstanceLock = app.requestSingleInstanceLock()
if (!singleInstanceLock) {
  console.log('[MAIN] Single instance lock failed. Closing new instance...');
  app.quit()
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.whenReady().then(() => {
    console.log('[MAIN] App ready, creating window...');
    createWindow();
  });
}

const sendKeyToMeeting = (keys: string) => {
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
  console.log(`[MEET] Sending keys '${keys}' to ${currentMeetingApp}...`);
  return new Promise((resolve) => {
    const ps = spawn('powershell', ['-Command', psKey]);
    ps.stdout!.on('data', (d: Buffer) => console.log('[MEET-CMD-LOG]', d.toString().trim()));
    ps.stderr!.on('data', (d: Buffer) => console.error('[MEET-CMD-ERR]', d.toString().trim()));
    ps.on('close', () => resolve(true));
  });
};

ipcMain.handle('toggle-system-mute', async () => {
  if (currentMeetingApp === 'Zoom') await sendKeyToMeeting('%a');
  else if (currentMeetingApp === 'Meet') await sendKeyToMeeting('^d');
  else await sendKeyToMeeting('^+m');
  return true;
});

ipcMain.handle('toggle-video', async () => {
  if (currentMeetingApp === 'Zoom') await sendKeyToMeeting('%v');
  else if (currentMeetingApp === 'Meet') await sendKeyToMeeting('^e');
  else await sendKeyToMeeting('^+o');
  return true;
});

ipcMain.handle('end-call', async () => {
  if (currentMeetingApp === 'Zoom') { await sendKeyToMeeting('%q'); await sendKeyToMeeting('{ENTER}'); }
  else if (currentMeetingApp === 'Meet') await sendKeyToMeeting('^w');
  else await sendKeyToMeeting('^+h');
  return true;
});

// System Monitoring
let prevCpus = os.cpus();
setInterval(() => {
  if (!win || win.isDestroyed()) return;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const ramUsage = ((totalMem - freeMem) / totalMem) * 100;
  const currCpus = os.cpus();
  let totalDiff = 0, idleDiff = 0;
  for (let i = 0; i < currCpus.length; i++) {
    const prev = prevCpus[i].times, curr = currCpus[i].times;
    const prevTotal = Object.values(prev).reduce((a: number, b: number) => a + b, 0);
    const currTotal = Object.values(curr).reduce((a: number, b: number) => a + b, 0);
    totalDiff += (currTotal as number) - (prevTotal as number);
    idleDiff += curr.idle - prev.idle;
  }
  const cpuUsage = totalDiff > 0 ? (1 - idleDiff / totalDiff) * 100 : 0;
  prevCpus = currCpus;
  win.webContents.send('system-update', { cpu: cpuUsage, ram: ramUsage, net: 1.5 + Math.random() * 2 });
}, 2000);

let mediaProc: any = null;
try {
  let mediaReaderPath = path.join(__dirname, 'media-reader.js');
  if (!fs.existsSync(mediaReaderPath)) {
    // Fallback to source directory or different extension for dev
    mediaReaderPath = path.join(__dirname, '..', 'electron', 'media-reader.mjs');
    if (!fs.existsSync(mediaReaderPath)) {
       mediaReaderPath = path.join(process.cwd(), 'electron', 'media-reader.mjs');
    }
  }
  console.log(`[MAIN] Forking media reader from: ${mediaReaderPath}`);

  mediaProc = fork(mediaReaderPath, [], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  });

  let lastMediaMsg: any = null;
  if (mediaProc) {
    if (mediaProc.stdout) {
      mediaProc.stdout.on('data', (d: Buffer) => console.log(`[MEDIA-CHILD STDOUT] ${d.toString().trim()}`));
    }
    if (mediaProc.stderr) {
      mediaProc.stderr.on('data', (d: Buffer) => console.error(`[MEDIA-CHILD ERROR] ${d.toString().trim()}`));
    }

    mediaProc.on('message', (msg: any) => {
      if (msg?.type === 'MEDIA_UPDATE') { lastMediaMsg = msg.data; win?.webContents.send('media-update', msg.data); }
    });
  }

  // System Notification Polling (Windows Event Logs)
  // v2.2.0: Advanced Meeting & Audio Detection
  let lastNotifId = '';
  let psMeet: any = null;
  let psMeetBuf = '';
  let meetingUpdateSilenceUntil = 0;

  const startMeetPS = () => {
    try { exec('taskkill /F /IM powershell.exe /FI "WINDOWTITLE eq notchly-meet.ps1*"'); } catch(e){}
    console.log('[MEET] Starting persistent meeting detection loop...');
    const psPath = path.join(os.tmpdir(), 'notchly-meet.ps1');
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
                 if ($t -match ' \(Silenciado\)| \(Muted\)| \(Desactivado\)| \(Mic Off\)| \(Silenciar\)| \(Mute\)') { $titleMuted = $true }
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
          
          Write-Output "__MEET__$([string]$micFinal)|$([string]$isMeeting)|$($appName)|$($bt.FriendlyName)|$([string]$camInUse)|$conf"
        } catch {
          Write-Output "__DEBUG__Loop_Error: $($_.Exception.Message)"
        }
        Start-Sleep -m 500
      }
    `;
    fs.writeFileSync(psPath, psCode, 'utf8');
    psMeet = spawn('powershell', ['-ExecutionPolicy', 'Bypass', '-File', psPath]);
    
    psMeet.stdout!.on('data', (d: Buffer) => {
      const str = d.toString();
      psMeetBuf += str;
      let nl: number;
      while ((nl = psMeetBuf.indexOf('\n')) !== -1) {
        const line = psMeetBuf.slice(0, nl).trim();
        psMeetBuf = psMeetBuf.slice(nl + 1);
        if (line.startsWith('__DEBUG__')) { console.log('[MEET-DEBUG]', line); continue; }
        if (line.startsWith('__MEET__')) {
            const parts = line.replace('__MEET__', '').split('|');
            if (parts.length >= 6) {
              const [micUseStr, isMeetStr, app, btDevice, camUseStr, conf] = parts;
              const micUse = micUseStr.toLowerCase() === 'true';
              const isMeetRaw = isMeetStr.toLowerCase() === 'true';
              const camUse = camUseStr.toLowerCase() === 'true';
              
              const isActuallyActive = isMeetRaw && (micUse || camUse);
              
              if (isActuallyActive) {
                meetingExitCounter = 0;
                if (app.toLowerCase().includes('zoom')) currentMeetingApp = 'Zoom';
                else if (app.toLowerCase().includes('meet')) currentMeetingApp = 'Meet';
                else if (app.toLowerCase().includes('teams')) currentMeetingApp = 'Teams';
                else currentMeetingApp = (app || 'Llamada');
              } else {
                meetingExitCounter++;
              }

              // Debounce: Stay active for ~3s (6 polls) after detection loss
              const isActive = meetingExitCounter < 6;
              
              if (!isActive) {
                 isUserMuted = false; // Finally reset when meeting is definitely over
              }

              // Advanced Logic: High confidence (SoundPeak or Title) clears or sets states
              if (conf === 'High') {
                currentMicState = micUse;
                if (micUse) isUserMuted = false; // Sound clears manual mute
              } else if (!micUse) {
                currentMicState = false;
                // Don't reset isUserMuted here, wait for isActive=false
              } else {
                // Low Confidence (Session Active but silent)
                // Use isUserMuted flag to decide
                currentMicState = !isUserMuted;
              }
              
              if (Date.now() < meetingUpdateSilenceUntil) return;

              console.log(`[MEET-POLL] Sending Update: Active=${isActive} | App=${app} | Mic=${currentMicState} | Cam=${camUse} | UserMuted=${isUserMuted} | Conf=${conf}`);

              win?.webContents.send('meeting-update', {
                isActive,
                app: (isActuallyActive || isActive) ? (app || 'Llamada Activa') : '', 
                device: btDevice || 'Sistema',
                micActive: currentMicState,
                camActive: camUse
              });
            }
        }
      }
    });
    psMeet.stderr.on('data', (d: Buffer) => console.error('[MEET-PS ERROR]', d.toString()));
    psMeet.on('exit', () => setTimeout(startMeetPS, 5000));
  };
  setTimeout(startMeetPS, 3000);

  // Notification Polling (Windows Event Logs)
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
    exec(`powershell -Command "${psNotif.replace(/\n/g, ' ')}"`, (err, stdout) => {
      if (err || !stdout?.trim()) return;
      const parts = stdout.trim().split('|||');
      if (parts.length < 3) return;
      const [id, appStr, msg] = parts;
      if (!id || id === lastNotifId) return;
      lastNotifId = id;
      win?.webContents.send('notification', { app: appStr, text: msg });
    });
  }, 3000);

  ipcMain.handle('get-current-media', async () => {
    if (lastMediaMsg) return lastMediaMsg.data;
    await new Promise(r => setTimeout(r, 1200));
    return lastMediaMsg?.data || null;
  });

  ipcMain.handle('toggle-wifi', async () => {
    exec(`powershell -Command "if((Get-NetAdapter -Name 'Wi-Fi').Status -eq 'Up') { Disable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false } else { Enable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false }"`);
    return true;
  });

  ipcMain.handle('toggle-bluetooth', async () => {
    exec(`powershell -Command "Add-Type -AssemblyName Windows.Devices.Radios; \\$r=[Windows.Devices.Radios.Radio]::GetRadiosAsync().GetAwaiter().GetResult() | Where-Object { \\$_.Kind -eq 'Bluetooth' }; if(\\$r.State -eq 'On') { \\$r.SetStateAsync('Off') } else { \\$r.SetStateAsync('On') }"`);
    return true;
  });

  ipcMain.handle('media-command', (_event, action) => mediaProc?.send(action));

  // ── Volume control ──────────────────────────────────────────────────────────
  let psVol: ReturnType<typeof spawn> | null = null;
  let psVolReady = false;
  let psVolBuf = '';
  let psVolQueue: Array<(v: number | null) => void> = [];

  const volCS = [
    'Add-Type -TypeDefinition @"',
    'using System.Runtime.InteropServices;',
    '[Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]',
    'interface IVol { int f1(); int f2(); int f3(); int f4(); int SetMasterVolumeLevelScalar(float f, System.Guid g); int GetMasterVolumeLevelScalar(out float f); }',
    '[Guid("D6660639-8874-4034-AD23-37284F510F4F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]',
    'interface IDev { int Activate(ref System.Guid id, int cls, System.IntPtr p, out IVol v); }',
    '[Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]',
    'interface IEnum { int GetDefaultAudioEndpoint(int df, int r, out IDev e); }',
    '[ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMDev { }',
    'public class WinVol {',
    '    public static int Get() {',
    '        try { var e = (IEnum)new MMDev(); IDev d; e.GetDefaultAudioEndpoint(0, 0, out d); IVol v; var iid = new System.Guid("5CDF2C82-841E-4546-9722-0CF74078229A"); d.Activate(ref iid, 23, System.IntPtr.Zero, out v); float f; v.GetMasterVolumeLevelScalar(out f); return (int)(f * 100); } catch { return 0; }',
    '    }',
    '    public static void Set(int n) {',
    '        try { var e = (IEnum)new MMDev(); IDev d; e.GetDefaultAudioEndpoint(0, 0, out d); IVol v; var iid = new System.Guid("5CDF2C82-841E-4546-9722-0CF74078229A"); d.Activate(ref iid, 23, System.IntPtr.Zero, out v); v.SetMasterVolumeLevelScalar((float)n / 100, System.Guid.Empty); } catch {}',
    '    }',
    '}',
    '"@ -Language CSharp',
    'Write-Output __VOL_READY__'
  ].join('\n');

  const startVolPS = () => {
    psVol = spawn('powershell', ['-NoExit', '-NonInteractive', '-Command', '-'], { stdio: ['pipe', 'pipe', 'pipe'] });
    psVol.stdout!.on('data', (d: Buffer) => {
      psVolBuf += d.toString();
      let nl: number;
      while ((nl = psVolBuf.indexOf('\n')) !== -1) {
        const line = psVolBuf.slice(0, nl).trim();
        psVolBuf = psVolBuf.slice(nl + 1);
        if (line === '__VOL_READY__') { psVolReady = true; psVol!.stdin!.write('[WinVol]::Get()\n'); }
        else if (/^\d+$/.test(line)) {
          const v = parseInt(line, 10);
          const cb = psVolQueue.shift();
          if (cb) cb(v);
          win?.webContents.send('volume-update', v);
        }
      }
    });
    psVol.stdin!.write(volCS + '\n');
    psVol.on('exit', () => { psVolReady = false; setTimeout(startVolPS, 5000); });
  };
  startVolPS();

  const getVol = (): Promise<number | null> => new Promise(res => {
    if (!psVolReady || !psVol) return res(null);
    psVolQueue.push(res);
    psVol.stdin!.write('[WinVol]::Get()\n');
  });

  ipcMain.handle('get-volume', async () => await getVol());
  ipcMain.handle('set-volume', (_e, v: number) => { 
    const clamped = Math.round(Math.max(0, Math.min(100, v)));
    psVol?.stdin!.write(`[WinVol]::Set(${clamped})\n`);
    return true; 
  });

  setInterval(async () => {
    const v = await getVol();
    if (v !== null) win?.webContents.send('volume-update', v);
  }, 4000);

  ipcMain.handle('open-app', async (_event, appName: string) => {
    const lower = appName.toLowerCase();
    if (lower.includes('chrome')) exec('start chrome');
    else if (lower.includes('spotify')) exec('start spotify');
    else if (lower.includes('camera')) exec('start microsoft.windows.camera:');
    else exec(`start "" "${appName}"`);
    return true;
  });

  ipcMain.handle('meeting-command', async (_event, cmd: string) => {
    meetingUpdateSilenceUntil = Date.now() + 8000;
    console.log(`[MEET-CMD] Action: ${cmd} | App: ${currentMeetingApp} | PrevUserMuted: ${isUserMuted}`);
    if (cmd === 'toggleMic') {
       isUserMuted = !isUserMuted;
       console.log(`[MEET-CMD] NewUserMuted: ${isUserMuted}`);
       const keys = currentMeetingApp === 'Zoom' ? '%a' : (currentMeetingApp === 'Meet' ? '^d' : '^+m');
       await sendKeyToMeeting(keys);
    } else if (cmd === 'toggleCam') {
       const keys = currentMeetingApp === 'Zoom' ? '%v' : (currentMeetingApp === 'Meet' ? '^e' : '^+o');
       await sendKeyToMeeting(keys);
    } else if (cmd === 'endCall') {
       isUserMuted = false;
       if (currentMeetingApp === 'Zoom') { await sendKeyToMeeting('%q'); setTimeout(() => sendKeyToMeeting('{ENTER}'), 200); }
       else if (currentMeetingApp === 'Meet') await sendKeyToMeeting('^w');
       else await sendKeyToMeeting('^+h');
    }
  });

  app.on('before-quit', () => { mediaProc?.kill(); psMeet?.kill(); psVol?.kill(); });
} catch (err) { console.error('[MAIN] CRITICAL Initialization error:', err); }

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});
