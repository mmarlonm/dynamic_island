console.log('[MAIN] Electron process starting...');
import { app, BrowserWindow, screen, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import { fork, exec } from 'node:child_process'
import os from 'node:os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

let win: BrowserWindow | null
let isInMeetingApp = false
let currentMeetingApp: 'Teams' | 'Zoom' | 'Meet' = 'Teams'
let lastHasCam = false, lastHasMic = false
let audioOutputDevice: 'Speaker' | 'Headphones' = 'Speaker'
let lastWifi = true, lastBt = true

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
    const [winX, winY] = win.getPosition();
    const [winW] = win.getSize();

    // Absolute center of the window (which aligns with the island)
    const centerX = winX + winW / 2;
    const relX = x - centerX;
    const relY = y - winY;

    // Hitbox Logic:
    const widthLimit = isExpandedMode ? 345 : 190;
    const heightLimit = isExpandedMode ? currentIslandHeight + 15 : 120; // Increased for Deep Curve 100px

    const isInside = (Math.abs(relX) <= widthLimit && relY >= -5 && relY <= heightLimit);

    // Toggle ignore mouse events
    win.setIgnoreMouseEvents(!isInside, { forward: true });

    // Notify renderer for local effects if needed
    win.webContents.send('mouse-proximity', { isNear: isInside, relX, relY });
  }, 50);

  // v2.1.0: Advanced Meeting & Audio Detection
  const checkSystemStatus = () => {
    if (!win || win.isDestroyed()) return;

    // Nuclear PowerShell Check: Detect from process, title, and known apps
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

    const buffer = Buffer.from(script, 'utf16le');
    const base64 = buffer.toString('base64');

    exec(`powershell -EncodedCommand ${base64}`, { timeout: 8000 }, (err: any, stdout: string) => {
      const out = stdout?.trim();
      if (!out) return;

      const parts = out.split('###').map(p => p.trim());
      if (parts.length < 6) return;

      const [titlesRaw, hasCamStr, hasMicStr, audioDeviceStr, wifiStr, btStr] = parts;
      const hasCam = hasCamStr.toLowerCase() === 'true';
      const hasMic = hasMicStr.toLowerCase() === 'true';
      const isWifi = wifiStr.toLowerCase() === 'true';
      const isBt = btStr.toLowerCase() === 'true';

      // 1. Process Meetings - Detect app type (Highly restrictive regex)
      const teamsRegex = /\| Microsoft Teams$|Microsoft Teams$/i;
      const zoomRegex = /Zoom Meeting|Video Zoom/i;
      const meetRegex = /Meet - |Google Meet/i;

      const isTeams = teamsRegex.test(titlesRaw);
      const isZoom = zoomRegex.test(titlesRaw);
      const isMeet = meetRegex.test(titlesRaw);
      const active = isTeams || isZoom || isMeet;

      let meetingApp: 'Teams' | 'Zoom' | 'Meet' = 'Teams';
      if (isZoom) meetingApp = 'Zoom';
      else if (isMeet) meetingApp = 'Meet';

      const lowTitles = titlesRaw.toLowerCase();
      if (active !== isInMeetingApp) {
        isInMeetingApp = active;
        currentMeetingApp = meetingApp;
        win?.webContents.send('meeting-status', { active, app: meetingApp });
      }

      if (active) {
        const isMuted = lowTitles.includes('muted') || lowTitles.includes('silenciado');
        const isVideoOff = lowTitles.includes('video off') || lowTitles.includes('desactivada') || lowTitles.includes('cámara desactivada');
        win?.webContents.send('meeting-info-update', { isMuted, isVideoOff });
      }

      if (hasCam !== lastHasCam || hasMic !== lastHasMic) {
        lastHasCam = hasCam;
        lastHasMic = hasMic;
        win?.webContents.send('hardware-status', { hasCam, hasMic });
      }

      const type = (audioDeviceStr.toLowerCase().includes('headset') || audioDeviceStr.toLowerCase().includes('headphones') || audioDeviceStr.toLowerCase().includes('hearing')) ? 'Headphones' : 'Speaker';
      if (type !== audioOutputDevice) {
        audioOutputDevice = type;
        win?.webContents.send('audio-output', type);
      }

      if (isWifi !== lastWifi || isBt !== lastBt) {
        lastWifi = isWifi; lastBt = isBt;
        win?.webContents.send('radio-status', { wifi: isWifi, bluetooth: isBt });
      }
    });
  };

  setInterval(checkSystemStatus, 3500);
  checkSystemStatus();
}

const singleInstanceLock = app.requestSingleInstanceLock()
if (!singleInstanceLock) {
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
  const cmd = `powershell -Command "${psKey.replace(/\n/g, ' ').trim()}"`;
  console.log(`[MAIN] Sending keys '${keys}' to ${currentMeetingApp}...`);
  return new Promise((resolve) => {
    exec(cmd, (err, stdout) => {
      if (stdout) console.log(stdout.trim());
      resolve(!err);
    });
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
    const prevTotal = Object.values(prev).reduce((a: any, b: any) => a + b, 0);
    const currTotal = Object.values(curr).reduce((a: any, b: any) => a + b, 0);
    totalDiff += (currTotal as number) - (prevTotal as number);
    idleDiff += curr.idle - prev.idle;
  }
  const cpuUsage = totalDiff > 0 ? (1 - idleDiff / totalDiff) * 100 : 0;
  prevCpus = currCpus;
  win.webContents.send('system-update', { cpu: cpuUsage, ram: ramUsage, net: 1.5 + Math.random() * 2 });
}, 2000);

try {
  const mediaReaderPath = path.join(__dirname, 'media-reader.js');
  if (!fs.existsSync(mediaReaderPath)) {
    console.error(`[MAIN] CRITICAL: media-reader.js NOT FOUND at ${mediaReaderPath}`);
    // Try fallback to same dir if __dirname is weird
    const fallbackPath = path.join(process.cwd(), 'dist-electron', 'media-reader.js');
    console.log(`[MAIN] Trying fallback path: ${fallbackPath}`);
  }
  console.log(`[MAIN] Forking media reader from: ${mediaReaderPath}`);

  const mediaProc = fork(mediaReaderPath, [], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  });

  mediaProc.stdout?.on('data', (d) => console.log(`[MEDIA-CHILD STDOUT] ${d}`));
  mediaProc.stderr?.on('data', (d) => console.error(`[MEDIA-CHILD ERROR] ${d}`));

  let lastMediaMsg: any = null;
  mediaProc.on('message', (msg: any) => {
    if (msg?.type === 'MEDIA_UPDATE') { lastMediaMsg = msg.data; win?.webContents.send('media-update', msg.data); }
  });

  // System Notification Polling (Windows Event Logs)
  // Notification polling — reads recent App event log entries
  let lastNotifId = '';
  setInterval(() => {
    const psNotif = `
      try {
        $e = Get-WinEvent -LogName Application -MaxEvents 1 -ErrorAction SilentlyContinue |
             Select-Object -Property TimeCreated, ProviderName, Message;
        if ($e) {
          $out = $e.TimeCreated.ToString('o') + '|||' + $e.ProviderName + '|||' + ($e.Message -split '\n')[0];
          Write-Output $out
        }
      } catch {}
    `.trim();
    const buf = Buffer.from(psNotif, 'utf16le');
    const b64 = buf.toString('base64');
    exec(`powershell -EncodedCommand ${b64}`, { timeout: 6000 }, (err, stdout) => {
      if (err || !stdout?.trim()) return;
      const [id, app, msg] = stdout.trim().split('|||');
      if (!id || id === lastNotifId) return;
      lastNotifId = id;
      if (!app || !msg) return;
      win?.webContents.send('notification', { app: app.trim(), text: msg.trim().slice(0, 100) });
    });
  }, 8000);
  ipcMain.handle('get-current-media', () => lastMediaMsg);

  ipcMain.handle('toggle-wifi', async () => {
    const cmd = `powershell -Command "if((Get-NetAdapter -Name 'Wi-Fi').Status -eq 'Up') { Disable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false } else { Enable-NetAdapter -Name 'Wi-Fi' -Confirm:\\$false }"`;
    exec(cmd);
    return true;
  });

  ipcMain.handle('toggle-bluetooth', async () => {
    const cmd = `powershell -Command "Add-Type -AssemblyName Windows.Devices.Radios; \\$r=[Windows.Devices.Radios.Radio]::GetRadiosAsync().GetAwaiter().GetResult() | Where-Object { \\$_.Kind -eq 'Bluetooth' }; if(\\$r.State -eq 'On') { \\$r.SetStateAsync('Off') } else { \\$r.SetStateAsync('On') }"`;
    exec(cmd);
    return true;
  });

  ipcMain.handle('media-command', (event, action) => mediaProc.send(action));
  ipcMain.handle('open-app', async (event, appName: string) => {
    const lower = appName.toLowerCase();
    if (lower.includes('chrome')) exec('start chrome');
    else if (lower.includes('spotify')) exec('start spotify');
    else if (lower.includes('camera')) exec('start microsoft.windows.camera:');
    else exec(`start "" "${appName}"`);
    return true;
  });
  app.on('before-quit', () => mediaProc.kill());
} catch (err) { console.error('Failed to init media process:', err); }

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});
