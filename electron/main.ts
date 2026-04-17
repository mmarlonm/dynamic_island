
import { app, BrowserWindow, screen, ipcMain, desktopCapturer } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import { fork, exec, spawn } from 'node:child_process'
import os from 'node:os'
import https from 'node:https'
import { autoUpdater } from 'electron-updater'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

// Resource Path Helper for Production
const getResPath = (relPath: string) => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, relPath);
  }
  const devPath = path.join(process.cwd(), relPath);
  if (fs.existsSync(devPath)) return devPath;
  const electronPath = path.join(process.cwd(), 'electron', relPath);
  if (fs.existsSync(electronPath)) return electronPath;
  return path.join(__dirname, '..', relPath); 
};

// Advanced Active Notification Monitoring (WinRT Bridge)
let psNotif: any = null;
let psNotifBuf = '';
let notifMap = new Map<string, { title: string, app: string }>(); // Map hashes to notification info for dismissal
let psCalendar: any = null;

const startCalendarMonitor = () => {
  const calPath = getResPath('calendar-monitor.ps1');
  if (!fs.existsSync(calPath)) {
    console.error(`[MAIN] Calendar Monitor NOT FOUND at: ${calPath}`);
    return;
  }

  console.log(`[MAIN] Launching Calendar Monitor: ${calPath}`);
  psCalendar = spawn('powershell', ['-ExecutionPolicy', 'Bypass', '-File', calPath]);
  
  psCalendar.stdout!.on('data', (d: Buffer) => {
    const lines = d.toString().split('\n');
    let eventsFound: any[] = [];
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('__EVENT__')) {
        const parts = line.replace('__EVENT__', '').split('|||');
        if (parts.length >= 6) {
          const [title, start, end, loc, type, id] = parts;
          eventsFound.push({ title, start, end, loc, type, id });
        }
      }
    }
    if (eventsFound.length > 0) {
      safeSend(win, 'calendar-update', eventsFound);
    }
  });

  psCalendar.on('exit', () => setTimeout(startCalendarMonitor, 10000));
};

const startNotifMonitor = () => {
  const notifPath = getResPath('notifications-monitor.ps1');
  if (!fs.existsSync(notifPath)) {
    console.error(`[MAIN] Notification Monitor NOT FOUND at: ${notifPath}`);
    return;
  }

  console.log(`[MAIN] Launching Notification Monitor: ${notifPath}`);
  psNotif = spawn('powershell', ['-ExecutionPolicy', 'Bypass', '-File', notifPath]);
  
  psNotif.stdout!.on('data', (d: Buffer) => {
    const lines = d.toString().split('\n');
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('__NOTIF__')) {
        const parts = line.replace('__NOTIF__', '').split('|||');
        if (parts.length >= 4) {
          const [appStr, title, body, winId] = parts;
          // Store mapping for dismissal later
          notifMap.set(winId, { title, app: appStr });
          
          safeSend(win, 'notification-sync', { 
            id: winId, 
            app: appStr, 
            text: (title + ' ' + (body || '')).trim() 
          });
        }
      } else if (line.startsWith('__REMOVE__')) {
        const winId = line.replace('__REMOVE__', '').trim();
        notifMap.delete(winId);
        safeSend(win, 'notification-remove', winId);
      } else if (line.startsWith('__DEBUG__')) {
        console.log(`[NOTIF_DEBUG] ${line}`);
      }
    }
  });

  psNotif.on('exit', () => setTimeout(startNotifMonitor, 5000));
};

ipcMain.on('dismiss-notification', (_, id) => {
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
  spawn('powershell', ['-Command', dismissCmd]);
  notifMap.delete(String(id));
});

ipcMain.on('clear-all-notifications', () => {
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
  spawn('powershell', ['-Command', clearAllCmd]);
  notifMap.clear();
});

// Remote Update IPC Handlers
autoUpdater.autoDownload = false; // We want the user to trigger the download

autoUpdater.on('checking-for-update', () => {
  console.log('[UPDATER] Checking for update...');
  safeSend(win, 'update-checking');
});

autoUpdater.on('update-available', (info) => {
  safeSend(win, 'update-available', {
    version: info.version,
    releaseNotes: info.releaseNotes,
    releaseDate: info.releaseDate
  });
});

autoUpdater.on('download-progress', (progress) => {
  safeSend(win, 'update-progress', progress.percent);
});

autoUpdater.on('update-downloaded', () => {
  safeSend(win, 'update-ready');
});

autoUpdater.on('update-not-available', () => {
  safeSend(win, 'update-not-available');
});

autoUpdater.on('error', (err) => {
  console.error('[UPDATER_ERROR] ' + err);
  safeSend(win, 'update-error', err.message || String(err));
});

ipcMain.on('check-for-updates', () => {
  console.log('[UPDATER] Manual check requested');
  autoUpdater.checkForUpdates().then(result => {
    console.log('[UPDATER] Check result:', result ? ('Update ' + (result.updateInfo.version) + ' found') : 'No update found');
  }).catch(e => {
    console.error('[UPDATER] Check failed: ' + e);
    safeSend(win, 'update-error', 'Error al buscar actualizaciones: ' + (e.message || String(e)));
  });
});

  ipcMain.on('start-update-download', () => {
  console.log('[UPDATER] Starting download...');
  autoUpdater.downloadUpdate().then(() => {
    console.log('[UPDATER] Download process started');
  }).catch(e => {
    console.error('[UPDATER] Download failed: ' + e);
    safeSend(win, 'update-error', 'Error al descargar: ' + (e.message || String(e)));
  });
});

ipcMain.on('install-update-now', () => {
  console.log('[UPDATER] Quitting and installing...');
  autoUpdater.quitAndInstall();
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// Trigger Notification Access on startup
function requestNotificationAccess() {
  const accessCmd = `[void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]; [Windows.UI.Notifications.Management.UserNotificationListener]::Current.RequestAccessAsync()`;
  spawn('powershell', ['-Command', accessCmd]);
}

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

// Set AppUserModelId for Windows Notifications
if (process.platform === 'win32') {
  app.setAppUserModelId('com.notchly.app');
}

let win: BrowserWindow | null;
let isExpandedMode = false;
let isSuperPill = false;
let isPreviewMode = false;
let currentIslandX = 0;
let currentWidth = 440;
let currentHeight = 66;
let isInMeetingApp = false
let isCallActive = false;
let isControlsActive = false;
let currentMeetingApp = 'Teams'
let lastHasCam = false, lastHasMic = false
let audioOutputDevice: 'Speaker' | 'Headphones' = 'Speaker'
let lastWifi = true, lastBt = true
let currentMicState = false
let isUserMuted = false
let isUserCamOff = false;  // Track manual camera toggle
let meetingExitCounter = 0 // Debounce meeting exit

let proximityInterval: NodeJS.Timeout | null = null;
let systemUpdateInterval: NodeJS.Timeout | null = null;
let notifInterval: NodeJS.Timeout | null = null;
let volInterval: NodeJS.Timeout | null = null;
let weatherInterval: NodeJS.Timeout | null = null;
let networkInterval: NodeJS.Timeout | null = null;
let weatherLocation = '';
function safeSend(w: BrowserWindow | null, channel: string, ...args: any[]) {
  if (!w || w.isDestroyed()) return;
  try {
    const wc = w.webContents;
    if (!wc || wc.isDestroyed() || wc.isCrashed()) return;
    
    // Check main frame if available (Electron 22+)
    const mf = (wc as any).mainFrame;
    if (mf && (typeof mf.isDestroyed === 'function') && mf.isDestroyed()) return;

    wc.send(channel, ...args);
  } catch (e: any) {
    // Silence disposed frame errors
  }
}

const fetchWeather = () => {
  if (!win || win.isDestroyed()) return;
  const url = weatherLocation 
    ? `https://wttr.in/${encodeURIComponent(weatherLocation)}?format=j1` 
    : 'https://wttr.in?format=j1';
  
  https.get(url, (res: any) => {
    let data = '';
    res.on('data', (chunk: any) => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const current = json.current_condition[0];
        const area = json.nearest_area?.[0];
        const city = area?.areaName?.[0]?.value || 'Local';
        
        safeSend(win, 'weather-update', { 
          temp: current.temp_C, 
          condition: current.weatherDesc[0].value,
          city: city 
        });
      } catch (e) {}
    });
    }).on('error', () => {});
};

// Global IPC Handlers (Development-safe registration)
ipcMain.handle('get-system-audio-id', async () => {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
  return sources[0]?.id; // System audio is typically shared on Windows screen sources
});

ipcMain.removeAllListeners('set-weather-location');
ipcMain.on('set-weather-location', (_e, loc: string) => {
  weatherLocation = loc || '';
  fetchWeather();
});

// ── Global State Sync (v5.3 Stability) ──────────────────────────────────────
ipcMain.on('set-is-super-pill', (_, active) => { isSuperPill = active; });
ipcMain.on('set-is-preview', (_, preview) => { isPreviewMode = preview; });
ipcMain.on('update-island-pos', (_, x) => { currentIslandX = x; });

let lastAutoCheckTime = 0;
ipcMain.on('set-is-expanded', (_, expanded) => { 
  isExpandedMode = expanded; 
  // Trigger auto-check when expanding if more than 30 mins passed
  if (expanded && Date.now() - lastAutoCheckTime > 30 * 60 * 1000) {
    lastAutoCheckTime = Date.now();
    console.log('[UPDATER] Auto-check triggered on expansion');
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  }
});
ipcMain.on('set-window-dimensions', (_, d) => {
  currentWidth = d.w;
  currentHeight = d.h;
});
ipcMain.on('set-bubbles-state', (_, s) => {
  isCallActive = s.call;
  isControlsActive = s.controls;
});

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height, x, y } = primaryDisplay.bounds;

  win = new BrowserWindow({
    width: width,
    height: 800,
    x: x,
    y: y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    movable: false, // Window itself doesn't move, island moves inside
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
      autoplayPolicy: 'no-user-gesture-required',
      webviewTag: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  // Failsafe Visibility (v5.3.5): Start interactive and visible
  win.showInactive();
  win.setIgnoreMouseEvents(false);
  win.setAlwaysOnTop(true, 'screen-saver');

  // ── Background Services Initialization ─────────────────────────────────────
  setTimeout(() => {
    requestNotificationAccess();
    startNotifMonitor();
    startCalendarMonitor();
    startMediaReader();
    pollVol(); // Start volume polling
    pollNetworkStatus(); // Start WiFi/BT polling
    autoUpdater.checkForUpdatesAndNotify().catch(e => console.error('Update check failed: ' + e));
  }, 1200);

  const screenCenterX = x + (width / 2);
  if (proximityInterval) clearInterval(proximityInterval);

  proximityInterval = setInterval(() => {
    try {
      if (!win || win.isDestroyed()) return;

      const { x: mouseX, y: mouseY } = screen.getCursorScreenPoint();
      
      // Dynamic Hitbox PERFECT Sync (v7.6.5 - Anti-Ghosting)
      const islandPhysicalX = screenCenterX + (currentIslandX || 0);
      const halfW = (currentWidth || 440) / 2;
      const h = (currentHeight || 66);

      // 1. Detection zone for main island
      const isOverMainIsland = Math.abs(mouseX - islandPhysicalX) < (halfW + 10) && 
                               mouseY >= (y - 5) && 
                               mouseY < (y + h + 10);
      
      // 2. Detection zone for left-side bubbles (only if active)
      let isOverLeftBubbles = false;
      if (!isExpandedMode && (isCallActive || isControlsActive)) {
          const islandLeftEdge = islandPhysicalX - halfW;
          const bubbleWidth = (isCallActive && isControlsActive) ? 140 : 70;
          isOverLeftBubbles = mouseX >= (islandLeftEdge - bubbleWidth - 20) &&
                              mouseX < (islandLeftEdge - 5) &&
                              mouseY >= (y - 5) &&
                              mouseY < (y + 70);
      }

      const isOverPill = isOverMainIsland || isOverLeftBubbles;
      
      win.setIgnoreMouseEvents(!isOverPill, { forward: true });
    } catch (e) {
      // Silence intermittent screen-point errors
    }
  }, 30);

  win.on('closed', () => {
    if (proximityInterval) clearInterval(proximityInterval);
    if (systemUpdateInterval) clearInterval(systemUpdateInterval);
    if (notifInterval) clearInterval(notifInterval);
    if (volInterval) clearTimeout(volInterval);
    if (weatherInterval) clearInterval(weatherInterval);
    if (networkInterval) clearInterval(networkInterval);
    win = null;
  });

  ipcMain.handle('get-auto-launch', () => {
    return app.getLoginItemSettings().openAtLogin;
  });

  ipcMain.on('set-auto-launch', (_event, value) => {
    try {
      if (process.platform === 'win32') {
        app.setLoginItemSettings({
          openAtLogin: value,
          path: app.getPath('exe'),
          args: [
            '--hidden',
            '--start-minimized'
          ]
        });
        console.log(`[MAIN] Autostart ${value ? 'enabled' : 'disabled'} for: ${app.getPath('exe')}`);
      }
    } catch (e) {
      console.error('[AUTOSTART_ERROR] Failed to set login item settings:', e);
    }
  });

  // Re-run weather polling
  fetchWeather();
  weatherInterval = setInterval(fetchWeather, 20 * 60 * 1000);

  // Periodic Update Check (Every 4 hours)
  setInterval(() => {
    console.log('[UPDATER] Periodic 4h check');
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  }, 4 * 60 * 60 * 1000);
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
  return new Promise((resolve) => {
    const ps = spawn('powershell', ['-Command', psKey]);
    ps.stdout!.on('data', (d: Buffer) => { });
    ps.stderr!.on('data', (d: Buffer) => { });
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
systemUpdateInterval = setInterval(() => {
  try {
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
    safeSend(win, 'system-update', { cpu: cpuUsage, ram: ramUsage, net: 1.5 + Math.random() * 2 });
  } catch (e) {
    // Prevent system monitor crashes from affecting main thread
  }
}, 2000);

const pollNetworkStatus = async () => {
  if (!win || win.isDestroyed()) return;
  try {
    const script = `
      $wifi = $false; $bt = $false
      try {
        $w = Get-WmiObject -Class Win32_NetworkAdapter -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'Wi-Fi|Wireless|WLAN' -and $_.PhysicalAdapter -eq $true } | Select-Object -First 1
        if ($w -and $w.NetEnabled) { $wifi = $true }
        
        $b = Get-PnpDevice -Class Bluetooth -ErrorAction SilentlyContinue | Where-Object { ($_.InstanceId -match '^USB|^PCI') -and ($_.FriendlyName -notmatch 'Enumerator|LE|Device|Phone|Hands-free') } | Select-Object -First 1
        if ($b -and $b.Status -eq 'OK') { $bt = $true }
      } catch {}
      Write-Output "$($wifi)|$($bt)"
    `;
    exec(`powershell -Command "${script.replace(/\n/g, ' ')}"`, (err, stdout) => {
      if (!err && stdout) {
        const parts = stdout.trim().split('|');
        safeSend(win, 'network-status', {
          wifi: parts[0]?.toLowerCase() === 'true',
          bluetooth: parts[1]?.toLowerCase() === 'true'
        });
      }
      if (networkInterval) clearTimeout(networkInterval);
      networkInterval = setTimeout(pollNetworkStatus, 6000) as unknown as NodeJS.Timeout;
    });
  } catch (e) {
    if (networkInterval) clearTimeout(networkInterval);
    networkInterval = setTimeout(pollNetworkStatus, 6000) as unknown as NodeJS.Timeout;
  }
};

// ── Volume control Helpers ───────────────────────────────────────────────
const volExe = getResPath('volume.exe');
const getVol = (): Promise<number> => new Promise(res => {
  if (!fs.existsSync(volExe)) return res(-1);
  exec(`"${volExe}" get`, (err, stdout) => {
    if (err) return res(-1);
    const v = parseInt(stdout.trim(), 10);
    res(isNaN(v) ? -1 : v);
  });
});

let isSettingVolume = false;
let lastVolumeToSet: number | null = null;
const setVol = async (v: number) => {
  lastVolumeToSet = v;
  if (isSettingVolume) return;
  isSettingVolume = true;
  while (lastVolumeToSet !== null) {
    const target = lastVolumeToSet;
    lastVolumeToSet = null;
    await new Promise(res => {
      exec(`"${volExe}" set ${Math.round(target)}`, () => res(null));
    });
  }
  isSettingVolume = false;
};

const pollVol = async () => {
  if (!win || win.isDestroyed()) return;
  try {
    const v = await getVol();
    if (v >= 0) safeSend(win, 'volume-update', v);
  } catch (e) {}
  volInterval = setTimeout(pollVol, 2000); 
};

let mediaProc: any = null;
let lastMediaMsg: any = null;
let mediaSessions = new Map<string, any>(); // Track all media sessions for fallbacks

const startMediaReader = () => {
  try {
    const mediaReaderPath = app.isPackaged 
      ? path.join(__dirname, 'media-reader.js') 
      : path.join(process.cwd(), 'electron', 'media-reader.mjs');
      
    console.log(`[MAIN] Launching Media Reader: ${mediaReaderPath}`);

    mediaProc = fork(mediaReaderPath, [process.resourcesPath || ''], {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
      stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });

    if (mediaProc) {
      mediaProc.on('exit', (code: number) => {
        console.warn(`[MAIN] Media Reader exited with code ${code}. Restarting in 3s...`);
        setTimeout(startMediaReader, 3000);
      });

      mediaProc.on('message', (msg: any) => {
        if (msg?.type === 'MEDIA_UPDATE') { 
          const data = msg.data;
          if (!data) return;

          const sessionKey = (data.id && data.id !== 'system') ? data.id : (data.title + '||' + (data.artist || ''));
          
          if (data.title && data.title !== 'Sin Reproducción') {
             mediaSessions.set(sessionKey, { ...data, timestamp: Date.now() });
          }

          let sessionsList = Array.from(mediaSessions.values())
             .filter(s => s.title !== 'Sin Reproducción')
             .sort((a, b) => b.timestamp - a.timestamp);

          let displayData = data;
          const activePlaying = sessionsList.find(s => s.isPlaying);
          
          if (activePlaying) {
             displayData = activePlaying;
          } else if (sessionsList.length > 0) {
             displayData = sessionsList[0];
          }

          lastMediaMsg = displayData; 
          safeSend(win, 'media-update', displayData); 
        }
      });
    }
  } catch (err) {
    console.error('[MAIN] Media Reader Failed:', err);
    setTimeout(startMediaReader, 5000);
  }
};

try {
  startMediaReader();

  // System Notification Polling (Windows Event Logs)
  // v2.2.0: Advanced Meeting & Audio Detection
  let lastNotifId = '';
  let psMeet: any = null;
  let psMeetBuf = '';
  let meetingUpdateSilenceUntil = 0;

  const startMeetPS = () => {
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
          
          Write-Output "__MEET__$([string]$micFinal)|$([string]$isMeeting)|$($appName)|$($bt.FriendlyName)|$([string]$camInUse)|$conf|$([string]$titleMuted)"
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
        if (line.startsWith('__DEBUG__')) { continue; }
        if (line.startsWith('__MEET__')) {
            const parts = line.replace('__MEET__', '').split('|');
            if (parts.length >= 6) {
              const [micUseStr, isMeetStr, app, btDevice, camUseStr, conf, titleMutedStr] = parts;
              const micUse = micUseStr.toLowerCase() === 'true';
              const isMeetRaw = isMeetStr.toLowerCase() === 'true';
              const camUse = camUseStr.toLowerCase() === 'true';
              const titleMuted = (titleMutedStr ?? '').toLowerCase() === 'true';
              
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
                 isUserMuted = false;    // Reset when meeting is definitely over
                 isUserCamOff = false;   // Reset camera override too
              }

              // ── Mic state logic ──────────────────────────────────────────
              // Priority:
              //   1. Sound peak (micUse=true, High)  → ACTIVE; clear flag
              //   2. Title says muted                → MUTED; set flag
              //   3. High conf + no activity at all  → MUTED; sync flag to reality
              //      (catches mute done from within the meeting app)
              //   4. Low conf (session found, silent) → trust the flag
              if (micUse && conf === 'High') {
                // Real audio peak → definitely unmuted; undo any manual override
                currentMicState = true;
                isUserMuted = false;
              } else if (titleMuted) {
                // App title explicitly says muted
                currentMicState = false;
                isUserMuted = true;
              } else if (!micUse && conf === 'High') {
                // No session, no sound, no title — definitively inactive.
                // Sync the flag so external mutes are respected.
                currentMicState = false;
                isUserMuted = true;
              } else {
                // Low confidence (session active but silent) — trust the flag.
                // This preserves island-side toggles during normal speech gaps.
                currentMicState = !isUserMuted;
              }

              // ── Camera state logic ───────────────────────────────────────
              // If the user manually toggled camera off, respect that until
              // meeting ends or they explicitly toggle back on.
              const camFinal = isUserCamOff ? false : camUse;

              if (Date.now() < meetingUpdateSilenceUntil) return;


              safeSend(win, 'meeting-update', {
                isActive,
                app: (isActuallyActive || isActive) ? (app || 'Llamada Activa') : '', 
                device: btDevice || 'Sistema',
                micActive: currentMicState,
                camActive: camFinal
              });
            }
        }
      }
    });
    psMeet.stderr.on('data', (d: Buffer) => { });
    psMeet.on('exit', () => setTimeout(startMeetPS, 5000));
  };
  setTimeout(startMeetPS, 3000);

  // (Monitor logic moved to top level)

  ipcMain.handle('get-media-source-id', async (_event, mediaInfo) => {
    try {
      const sources = await desktopCapturer.getSources({ 
        types: ['window'], 
        thumbnailSize: { width: 0, height: 0 } 
      });
      const { title, artist } = mediaInfo;
      if (!title || title === 'Ningún origen de medios') return null;

      const t = title.toLowerCase();
      const a = (Array.isArray(artist) ? artist : [artist]).map((x: string) => x.toLowerCase());

      // Attempt high-fidelity match first: title + artist
      let source = sources.find(s => {
        const n = s.name.toLowerCase();
        return n.includes(t) && a.some(x => n.includes(x));
      });

      // Fallback: match title only
      if (!source) source = sources.find(s => s.name.toLowerCase().includes(t));

      // Second fallback: match common app names if it's the only one
      if (!source && a.some(x => x.includes('spotify'))) {
         source = sources.find(s => s.name.toLowerCase().includes('spotify'));
      }

      return source ? source.id : null;
    } catch (e) {
      return null;
    }
  });

  ipcMain.handle('get-current-media', async () => {
    if (lastMediaMsg) return lastMediaMsg;
    await new Promise(r => setTimeout(r, 1200));
    return lastMediaMsg || null;
  });

  const radioControlScript = `
function Invoke-WinRT($obj, $methodName) {
    if (-not $obj) { return $null }
    try { return $obj.$methodName() } catch {
        try { return $obj.GetType().InvokeMember($methodName, [System.Reflection.BindingFlags]::InvokeMethod, $null, $obj, $null) } catch { return $null }
    }
}
function Set-RadioState($RadioKind) {
    try {
        [void][Windows.Devices.Radios.Radio, Windows.Devices.Radios, ContentType=WindowsRuntime]
        $op = [Windows.Devices.Radios.Radio]::GetRadiosAsync()
        while($op.Status -eq 'Started') { Start-Sleep -m 20 }
        $rads = Invoke-WinRT $op "GetResults"
        $enumKind = if($RadioKind -eq "WiFi") { [Windows.Devices.Radios.RadioKind]::WiFi } else { [Windows.Devices.Radios.RadioKind]::Bluetooth }
        if ($rads) {
            $r = $rads | Where-Object { $_.Kind -eq $enumKind }
            if ($r) {
                $st = if($r.State -eq 'On') { 'Off' } else { 'On' }
                $task = $r.SetStateAsync($st)
                while($task.Status -eq 'Started') { Start-Sleep -m 20 }
            }
        }
    } catch {}
}
Set-RadioState -RadioKind $args[0]
`;

  ipcMain.handle('toggle-wifi', async () => {
    const psPath = path.join(os.tmpdir(), 'notchly-radio-cmd.ps1');
    fs.writeFileSync(psPath, radioControlScript, 'utf8');
    exec(`powershell -ExecutionPolicy Bypass -File "${psPath}" "WiFi"`, () => {
      if (networkInterval) clearTimeout(networkInterval);
      setTimeout(pollNetworkStatus, 1500);
    });
    return true;
  });

  ipcMain.handle('toggle-bluetooth', async () => {
    const psPath = path.join(os.tmpdir(), 'notchly-radio-cmd.ps1');
    fs.writeFileSync(psPath, radioControlScript, 'utf8');
    exec(`powershell -ExecutionPolicy Bypass -File "${psPath}" "Bluetooth"`, () => {
      if (networkInterval) clearTimeout(networkInterval);
      setTimeout(pollNetworkStatus, 1500);
    });
    return true;
  });

  ipcMain.on('media-command', (_event, action) => {
    if (mediaProc && !mediaProc.killed) {
      mediaProc.send(action);
    }
  });


  ipcMain.handle('get-volume', async () => await getVol());
  ipcMain.handle('set-volume', (_e, v: number) => { setVol(v); return true; });

  // ... moved out ...

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
    if (cmd === 'toggleMic') {
       isUserMuted = !isUserMuted;
       currentMicState = !isUserMuted;
       const keys = currentMeetingApp === 'Zoom' ? '%a' : (currentMeetingApp === 'Meet' ? '^d' : '^+m');
       await sendKeyToMeeting(keys);
    } else if (cmd === 'toggleCam') {
       isUserCamOff = !isUserCamOff;
       const keys = currentMeetingApp === 'Zoom' ? '%v' : (currentMeetingApp === 'Meet' ? '^e' : '^+o');
       await sendKeyToMeeting(keys);
    } else if (cmd === 'endCall') {
       isUserMuted = false;
       isUserCamOff = false;
       currentMicState = false;
       if (currentMeetingApp === 'Zoom') { await sendKeyToMeeting('%q'); setTimeout(() => sendKeyToMeeting('{ENTER}'), 200); }
       else if (currentMeetingApp === 'Meet') await sendKeyToMeeting('^w');
       else await sendKeyToMeeting('^+h');
    }
  });

  // ...

  app.on('before-quit', () => { 
    mediaProc?.kill(); 
    if (typeof psMeet !== 'undefined' && psMeet) (psMeet as any).kill(); 
    if (typeof psNotif !== 'undefined' && psNotif) (psNotif as any).kill();
  });
} catch (err) { 
  console.error('[MAIN] Setup Error:', err);
}

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});
