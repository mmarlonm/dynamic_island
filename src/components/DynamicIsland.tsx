import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
  Settings, Play, Pause, SkipBack, SkipForward, Music, Bell, Cloud,
  CheckSquare, Pin, Activity, Volume2, HardDrive, Cpu, Trash2, Eye,
  EyeOff, BellOff, Timer, RotateCcw, Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

// ── Modern Reactive Sound Visualizer (5-bar Equalizer) ──────────────────────
const SoundVisualizer = ({ isPlaying, onIntensity }: { isPlaying: boolean; onIntensity?: (v: number) => void }) => {
  const [bars, setBars] = useState([4, 4, 4, 4, 4]); // Heights (1-16px)
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
        streamRef.current = null;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    analyserRef.current = null;
  };

  useEffect(() => {
    let active = true;
    let timer: any;

    const setupAnalyser = async () => {
      // 1. Mandatory cleanup of previous attempts
      stopStream();

      if (!isPlaying) {
        setBars([4, 4, 4, 4, 4]);
        if (onIntensity) onIntensity(0);
        return;
      }

      // Small delay: Chromium's desktop capture system needs safety gaps after song/state changes
      timer = setTimeout(async () => {
        try {
          const ipc = (window as any).ipcRenderer;
          const sourceId = await ipc?.invoke('get-system-audio-id');
          if (!sourceId || !active) return;

          const constraints = {
            audio: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: sourceId } },
            video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: sourceId } }
          };

          const stream = await (window as any).navigator.mediaDevices.getUserMedia(constraints as any);
          if (!active) { 
            stream.getTracks().forEach((t: MediaStreamTrack) => t.stop()); 
            return; 
          }
          
          streamRef.current = stream;
          stream.getVideoTracks().forEach((t: MediaStreamTrack) => t.stop());

          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const src = ctx.createMediaStreamSource(stream);
          const ans = ctx.createAnalyser();
          ans.fftSize = 64; 
          src.connect(ans);
          analyserRef.current = ans;

          const update = () => {
            if (!active) return;
            const data = new Uint8Array(ans.frequencyBinCount);
            ans.getByteFrequencyData(data);
            
            if (onIntensity) {
              const bassAvg = (data[0] + data[1] + data[2]) / 3;
              const midAvg = (data[3] + data[4] + data[5]) / 3;
              // Higher gain: 110 instead of 140 for more sensitivity
              const intensity = (bassAvg * 0.75 + midAvg * 0.25) / 110; 
              onIntensity(Math.min(1, intensity)); 
            }


            const newBars = [
              Math.max(4, (data[1] / 255) * 16),
              Math.max(4, (data[3] / 255) * 16),
              Math.max(4, (data[5] / 255) * 16),
              Math.max(4, (data[2] / 255) * 16),
              Math.max(4, (data[7] / 255) * 16)
            ];
            setBars(newBars);
            rafRef.current = requestAnimationFrame(update);
          };
          update();
        } catch (e) {
          console.warn('[VISUALIZER] Audio capture failed:', e);
          const sim = () => {
            if (!active) return;
            const b = bars.map(() => Math.random() * 12 + 4);
            setBars(b);
            if (onIntensity) onIntensity(Math.random() * 0.3);
            rafRef.current = requestAnimationFrame(sim);
          };
          sim();
        }
      }, 150);
    };

    setupAnalyser();
    return () => { 
      active = false; 
      clearTimeout(timer);
      stopStream();
    };
  }, [isPlaying]);


  return (
    <div className="w-10 h-4 flex items-center justify-center gap-[3px] pointer-events-none px-1 overflow-hidden" 
         style={{ filter: !isPlaying ? 'grayscale(1) opacity(0.3)' : 'none' }}>
      {bars.map((h, i) => (
        <motion.div
  key={i}
  animate={{ height: isPlaying ? h : 4 }}
  transition={{ type: 'spring', stiffness: 350, damping: 18 }}
  className="w-[3px] rounded-full"
  style={{
    background: isPlaying 
      ? `linear-gradient(to top, #34d399, #3b82f6)` 
      : 'rgba(255,255,255,0.2)'
  }}
/>
      ))}
    </div>
  );
};

// ── Floating timer circle (pill-mode) ────────────────────────────────────────
const TimerBubble = ({ time, total, isActive, isLightMode }: { time: number; total: number; isActive: boolean; isLightMode: boolean }) => {
  const pct = total > 0 ? time / total : 0;
  const r = 22, circ = 2 * Math.PI * r;
  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 
      ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: -6 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0, opacity: 0, x: -6 }}
      className="pointer-events-auto select-none"
    >
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} strokeWidth="3" 
            fill={isLightMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.88)'} 
            stroke={isLightMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'} 
          />
          <motion.circle
            cx="28" cy="28" r={r} strokeWidth="3" fill="transparent"
            stroke="#3b82f6"
            strokeDasharray={circ}
            animate={{ strokeDashoffset: circ * (1 - pct) }}
            style={{ filter: 'drop-shadow(0 0 4px #3b82f6)' }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="relative z-10 flex flex-col items-center leading-none">
          <span className={clsx("text-[9px] font-black tabular-nums", isLightMode ? "text-zinc-800" : "text-white")}>
            {fmt(time)}
          </span>
          <span className="text-[6px] text-blue-400 uppercase font-black tracking-wider mt-0.5">
            {isActive ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Notification count bubble (pill-mode) ─────────────────────────────────────
const NotifBubble = ({ count, onClick }: { count: number; onClick: () => void }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0, x: -6 }}
    animate={{ scale: 1, opacity: 1, x: 0 }}
    exit={{ scale: 0, opacity: 0, x: -6 }}
    className="pointer-events-auto select-none cursor-pointer"
    onClick={onClick}
  >
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="22" strokeWidth="2" fill="rgba(0,0,0,0.88)" stroke="rgba(255,255,255,0.08)" />
        <motion.circle cx="28" cy="28" r="22" strokeWidth="2" fill="transparent" stroke="#3b82f6"
          animate={{ opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 4px #3b82f6)' }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center leading-none">
        <Bell className="w-4 h-4 text-blue-400" />
        <span className="text-[11px] font-black text-white tabular-nums mt-0.5">{count > 9 ? '9+' : count}</span>
      </div>
    </div>
  </motion.div>
);
// ── Meeting status bubble (pill-mode - Left Side) ───────────────────────────
const CallBubble = ({ app, micActive, camActive, onClick, onCommand, onEndCall }: { app: string; micActive: boolean; camActive: boolean; onClick: () => void; onCommand: (cmd: string) => void; onEndCall: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ipc = (window as any).ipcRenderer;
  const btnClass = "w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 active:scale-90 border border-transparent hover:border-white/10";

  return (
    <motion.div
      onMouseEnter={() => { setIsHovered(true); ipc?.send('set-ignore-mouse-events', false); }}
      onMouseLeave={() => { setIsHovered(false); }}
      initial={{ scale: 0, opacity: 0, x: 20 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        x: 0,
        width: isHovered ? 160 : 56,
      }}
      exit={{ scale: 0, opacity: 0, x: 20 }}
      className="pointer-events-auto select-none cursor-pointer h-14 bg-black/70 backdrop-blur-3xl rounded-[24px] flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl"
      onClick={!isHovered ? onClick : undefined}
    >
      <AnimatePresence mode="wait">
        {!isHovered ? (
          <motion.div 
            key="icon" 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          className={clsx("flex flex-col items-center leading-none", (micActive || camActive) ? "text-green-500" : "text-zinc-500")}
          >
             {micActive ? <Mic className="w-4 h-4" /> : (camActive ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />)}
             <span className="text-[6px] font-black uppercase mt-1 tracking-tighter w-10 truncate text-center">{app}</span>
          </motion.div>
        ) : (
          <motion.div 
            key="actions"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 w-full justify-center px-2"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onCommand('toggleMic'); }} 
              className={clsx(btnClass, micActive ? "text-green-400" : "text-white opacity-40")}
            >
              {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onCommand('toggleCam'); }} 
              className={clsx(btnClass, camActive ? "text-green-400" : "text-white opacity-40")}
            >
              {camActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onCommand('endCall'); onEndCall(); }} 
              className={clsx(btnClass, "bg-red-500/20 hover:bg-red-500/80 group")}
            >
              <PhoneOff className="w-4 h-4 text-red-400 group-hover:text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Unified Triple Circle Timer ─────────────────────────────────────────────
const UnifiedCircularTimer = ({ 
  hours, mins, secs, onChange, disabled, isLightMode 
}: { 
  hours: number; mins: number; secs: number; 
  onChange: (type: 'h' | 'm' | 's', v: number) => void; 
  disabled: boolean; isLightMode: boolean 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRing, setActiveRing] = useState<'h' | 'm' | 's' | null>(null);

  const R_H = 155, R_M = 115, R_S = 75, TOL = 22;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt(Math.pow(e.clientX - cx, 2) + Math.pow(e.clientY - cy, 2));

    if (Math.abs(dist - R_H) < TOL) setActiveRing('h');
    else if (Math.abs(dist - R_M) < TOL) setActiveRing('m');
    else if (Math.abs(dist - R_S) < TOL) setActiveRing('s');
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!activeRing || disabled || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      const normalized = (angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
      const max = activeRing === 'h' ? 12 : 60;
      const val = Math.round((normalized / (2 * Math.PI)) * max) % max;
      onChange(activeRing, val);
    };
    const handleUp = () => setActiveRing(null);

    if (activeRing) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [activeRing, disabled]);

  const Ring = ({ r, val, max, color, label }: any) => {
    // 0 is at top (12 o'clock), 360 is full circle
    const angle = (val / max) * 360;
    const circ = 2 * Math.PI * r;
    
    return (
      <g>
        {/* Background Gray Ring */}
        <circle cx="200" cy="200" r={r} fill="none" strokeWidth="4" 
          stroke={isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'} 
        />
        {/* Colored Progress Arc (rotated to start at top) */}
        <motion.circle
          cx="200" cy="200" r={r} fill="none" strokeWidth={label === 'H' ? 10 : 8} stroke={color}
          strokeDasharray={circ}
          animate={{ strokeDashoffset: circ * (1 - (val || 0.001) / max) }}
          transform="rotate(-90 200 200)"
          style={{ filter: `drop-shadow(0 0 12px ${color})`, opacity: disabled ? 0.35 : 0.9 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          strokeLinecap="round"
        />
        {/* Unit Label */}
        <text 
          x="200" y={200 - r - 12} 
          textAnchor="middle" 
          fill={color} 
          className="text-[11px] font-black opacity-60 select-none pointer-events-none tracking-tighter"
        >
          {label}
        </text>
        {/* Interactive Handle (Dot) */}
        {!disabled && (
          <motion.circle
            cx={200 + r * Math.sin((angle * Math.PI) / 180)}
            cy={200 - r * Math.cos((angle * Math.PI) / 180)}
            r="12" fill={color}
            style={{ filter: `drop-shadow(0 0 15px ${color})`, cursor: 'pointer' }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        )}
      </g>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-[400px] h-[400px] flex items-center justify-center pointer-events-auto"
      onMouseDown={handleMouseDown}
    >
      <svg width="400" height="400" viewBox="0 0 400 400" className="overflow-visible">
        <Ring r={R_H} val={hours} max={12} color="#3b82f6" label="H" />
        <Ring r={R_M} val={mins} max={60} color="#8b5cf6" label="M" />
        <Ring r={R_S} val={secs} max={60} color="#ec4899" label="S" />
      </svg>
    </div>
  );
};
export const DynamicIsland = () => {
  const [isHovered, setIsHovered]     = useState(false);
  const [isPinned, setIsPinned]       = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeView, setActiveView]   = useState<'Resumen' | 'Sistema' | 'Multimedia' | 'Notificación' | 'Herramientas' | 'Llamada'>('Resumen');
  const [lang, setLang]               = useState<'es' | 'en' | 'zh'>('es');
  const [isLightMode, setIsLightMode] = useState(false);
  const [summaryTemplate, setSummaryTemplate] = useState<'Moderno' | 'Mínimo' | 'Clásico'>('Moderno');
  const [visibleTabs, setVisibleTabs] = useState<string[]>(['Resumen', 'Sistema', 'Multimedia', 'Llamada', 'Notificación', 'Herramientas']);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [media, setMedia]   = useState({ title: 'Ningún origen de medios', artist: 'Sin Reproducción', isPlaying: false, thumbnail: '', id: '' });
  const [notifications, setNotifications] = useState<Array<{ id: number; app: string; text: string }>>([]);
  const [systemInfo, setSystemInfo]   = useState({ cpu: 12, ram: 45, net: 2.1, temp: 42 });
  const [musicIntensity, setMusicIntensity] = useState(0);
  const [weather, setWeather]         = useState({ temp: '22', condition: 'Clear' });
  const [volume, setVolume]           = useState(50);
  const [meeting, setMeeting] = useState({ isActive: false, app: '', device: '', micActive: false, camActive: false });

  // 0-100 system volume

  // Timer state
  const [timerTime, setTimerTime]     = useState(0);
  const [timerTotal, setTimerTotal]   = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerHours, setTimerHours]   = useState(0);
  const [timerMins, setTimerMins]     = useState(25);
  const [timerSecs, setTimerSecs]     = useState(0);
  const timerRef = useRef<any>(null);
  const lastCommandTimeRef = useRef(0);
  const volDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Selected calendar day
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [superPill, setSuperPill] = useState(false);
  const [superPillMode, setSuperPillMode] = useState<'Auto' | 'Multimedia' | 'Clima'>('Auto');
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let active = true;
    let timer: any;

    const startStream = async () => {
      // Cleanup old stream
      if (stream) {
        stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
        setStream(null);
      }

      if (!showPreview || !media.title || media.title === 'Ningún origen de medios') return;

      // Small delay: Desktop capture ID blessing in Chromium needs a safety gap
      timer = setTimeout(async () => {
        try {
          const sourceId = await (window as any).ipcRenderer?.invoke('get-media-source-id', { 
            title: media.title, 
            artist: media.artist 
          });
          
          if (!active || !sourceId) return;

          const s = await (window as any).navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sourceId,
                minWidth: 480,
                maxWidth: 1280,
                minHeight: 270,
                maxHeight: 720
              }
            }
          } as any);

          if (active) {
            setStream(s);
          } else {
            s.getTracks().forEach((t: MediaStreamTrack) => t.stop());
          }
        } catch (e) {
          console.error('[DYNAMIC_ISLAND] Error capturing window:', e);
        }
      }, 150);
    };

    startStream();
    return () => { 
      active = false; 
      clearTimeout(timer);
    };
  }, [showPreview, media.title, media.artist]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Refs to avoid stale closure in IPC listener
  const isPinnedRef    = useRef(false);
  const showSettingsRef = useRef(false);
  const isHoveredRef    = useRef(false);
  const [islandX, setIslandX] = useState(0); // Offset from center
  const islandXRef = useRef(0);
  const dragControls = useDragControls();
  useEffect(() => { isPinnedRef.current = isPinned; }, [isPinned]);
  useEffect(() => { showSettingsRef.current = showSettings; }, [showSettings]);
  useEffect(() => { isHoveredRef.current = isHovered; }, [isHovered]);
  useEffect(() => { islandXRef.current = islandX; }, [islandX]);

  const T: Record<string, any> = {
    es: { resumen:'Resumen', sistema:'Sistema', multimedia:'Multimedia', llamada:'Llamada', notificacion:'Notificación', herramientas:'Herramientas', empty:'Limpio', now:'AHORA', settings:'AJUSTES', template:'Diseño', moderno:'Moderno', minimo:'Mínimo', clasico:'Clásico', lang:'Idioma', visibility:'Pestañas', clear:'Borrar todo', theme:'Apariencia', light:'Claro', dark:'Oscuro', timer:'Temporizador', start:'Iniciar', pause:'Pausar', reset:'Reiniciar' },
    en: { resumen:'Summary', sistema:'System', multimedia:'Media', llamada:'Call', notificacion:'Alerts', herramientas:'Tools', empty:'Clean', now:'NOW', settings:'SETTINGS', template:'Design', moderno:'Modern', minimo:'Minimal', clasico:'Classic', lang:'Language', visibility:'Tabs', clear:'Clear all', theme:'Theme', light:'Light', dark:'Dark', timer:'Timer', start:'Start', pause:'Pause', reset:'Reset' },
    zh: { resumen:'摘要', sistema:'系统', multimedia:'多媒体', llamada:'通话', notificacion:'通知', herramientas:'工具', empty:'无内容', now:'现在', settings:'设置', template:'设计', moderno:'现代', minimo:'极简', clasico:'经典', lang:'语言', visibility:'标签页', clear:'全部清除', theme:'主题', light:'浅色', dark:'深色', timer:'计时器', start:'开始', pause:'暂停', reset:'重置' },
  };
  const t = T[lang] ?? T.es;

  // ── IPC listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    const ipc = (window as any).ipcRenderer;

    if (ipc) {
      ipc.send('set-ignore-mouse-events', true); // Estado inicial: ignorar
      ipc.invoke('get-current-media').then((d: any) => { if (d) setMedia(d); }).catch(() => {});
      ipc.invoke('get-volume').then((v: any) => { if (typeof v === 'number') setVolume(v); }).catch(() => {});
      ipc.on('media-update',   (_: any, d: any) => setMedia(d));
      ipc.on('system-update',  (_: any, d: any) => setSystemInfo(d));
      ipc.on('weather-update', (_: any, d: any) => setWeather(d));
      ipc.on('notification',   (_: any, d: any) => setNotifications(p => [{ id: Date.now(), ...d }, ...p.slice(0, 9)]));
      ipc.on('volume-update',  (_: any, v: number) => setVolume(v));
      ipc.on('mouse-proximity', () => { /* Reservado para efectos visuales futuros */ });
    }

    (window as any).ipcRenderer?.on('meeting-update', (_: any, data: any) => {
      if (Date.now() - lastCommandTimeRef.current < 8000) return;
      setMeeting(data);
    });

    return () => clearInterval(clock);
  }, []);

  // Auto-close settings on mouse leave
  useEffect(() => {
    if (!isHovered && !isPinned && showSettings) setShowSettings(false);
  }, [isHovered, isPinned, showSettings]);

  const playAlarm = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const playTone = (f: number, s: number) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.setValueAtTime(f, ctx.currentTime + s);
        g.gain.setValueAtTime(0, ctx.currentTime + s);
        g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + s + 0.05);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + s + 0.25);
        o.start(ctx.currentTime + s); o.stop(ctx.currentTime + s + 0.3);
      };
      playTone(880, 0); playTone(880, 0.3); playTone(1100, 0.6);
    } catch (e) { }
  };

  const startTimer = () => {
    const total = timerHours * 3600 + timerMins * 60 + timerSecs;
    if (total === 0) return;
    setTimerTotal(total);
    setTimerTime(total);
    setTimerActive(true);
  };
  const resetTimer = () => { setTimerActive(false); setTimerTime(0); setTimerTotal(0); };

  // Timer tick
  useEffect(() => {
    if (timerActive && timerTime > 0) {
      timerRef.current = setInterval(() => setTimerTime(p => p - 1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (timerTime === 0 && timerActive) {
        setTimerActive(false);
        playAlarm();
      }
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timerTime]);

  // ── Window geometry ──────────────────────────────────────────────────────
  const isExpanded = isHovered || isPinned || showSettings;
  useEffect(() => {
    const ipc = (window as any).ipcRenderer;
    if (!ipc) return;
    const h = showSettings ? 600 : isExpanded ? (['Herramientas', 'Llamada'].includes(activeView) ? 480 : 220) : 120;


    ipc.send('set-window-height', h);
    // Robust expansion report: true ONLY if actually expanded (hovered/pinned)
    const effectivelyExpanded = isExpanded || showSettings;
    ipc.send('set-is-expanded', !!effectivelyExpanded);
    ipc.send('set-is-super-pill', superPill && !effectivelyExpanded);
    ipc.send('set-is-preview', showPreview && activeView === 'Multimedia' && effectivelyExpanded);
  }, [isExpanded, showSettings, activeView, superPill, showPreview]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const handleMeetingCommand = (cmd: string) => {
    lastCommandTimeRef.current = Date.now();
    if (cmd === 'toggleMic') setMeeting(p => ({ ...p, micActive: !p.micActive }));
    if (cmd === 'toggleCam') setMeeting(p => ({ ...p, camActive: !p.camActive }));
    (window as any).ipcRenderer?.invoke('meeting-command', cmd);
  };
  const openApp   = (app: string) => (window as any).ipcRenderer?.invoke('open-app', app);
  const toggleTab = (tab: string) => setVisibleTabs(p => p.includes(tab) ? p.filter(x => x !== tab) : [...p, tab]);
  const fmtTime   = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 
      ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${m}:${String(sec).padStart(2, '0')}`;
  };
  const setVol = (v: number) => {
    setVolume(v); // instant visual
    if (volDebounceRef.current) clearTimeout(volDebounceRef.current);
    volDebounceRef.current = setTimeout(() => {
      (window as any).ipcRenderer?.invoke('set-volume', v);
    }, 80);
  };

  // Wing/body colors must match exactly for seamless look
  const WING_R   = 34;
  const showTimerBubble = timerTime > 0 && !isExpanded;
  const showNotifBubble = notifications.length > 0 && !isExpanded;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-[999]">
      {/* Active analyzer layer: 1x1 pixel but "visible" to bypass background capture throttling */}
      <div className="absolute top-0 left-0 w-[1px] h-[1px] opacity-[0.01] pointer-events-none overflow-hidden z-[-1]">
        <SoundVisualizer isPlaying={media.isPlaying} onIntensity={setMusicIntensity} />
      </div>
      <div className="relative flex items-start justify-center">
        {/* ── Island body ── */}
        <motion.div
          drag="x"
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{ left: -1000, right: 1000 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDrag={(_, info) => {
            const newX = islandXRef.current + info.delta.x;
            setIslandX(newX);
            (window as any).ipcRenderer?.send('update-island-pos', newX);
          }}
          onMouseEnter={() => {
            setIsHovered(true);
            (window as any).ipcRenderer?.send('set-ignore-mouse-events', false);
          }}
          onMouseLeave={() => {
            if (!isPinned && !showSettings) {
              setIsHovered(false);
              (window as any).ipcRenderer?.send('set-ignore-mouse-events', true);
            }
          }}
          onClick={() => {
             // Deactivated background pinning by user request. 
             // Pinning is now EXCLUSIVELY via the Pin Button.
          }}
          className="relative pointer-events-auto cursor-default"
          style={{
            overflow: 'visible',
            color: isLightMode ? '#111' : '#fff',
            x: islandX,
          }}
          animate={{
            width: (showSettings ? 720 : isExpanded ? (showPreview && activeView === 'Multimedia' ? 840 : 680) : (superPill ? 72 : 360)) + 68,
            height: showSettings ? 480 : isExpanded ? (activeView === 'Herramientas' || activeView === 'Llamada' ? 420 : 180) : (superPill ? 42 : 66),
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          {/* Call Bubble — Left side, outside hover zone */}
          <AnimatePresence>
            {meeting.isActive && !isExpanded && (
              <div 
                className="absolute right-full mr-10 top-1 pointer-events-auto translate-y-[-2px]"
                onMouseEnter={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', false)}
                onMouseLeave={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', true)}
              >
                <CallBubble 
                  key="call" 
                  app={meeting.app} 
                  micActive={meeting.micActive} 
                  camActive={meeting.camActive}
                  onClick={() => { setActiveView('Llamada'); }} 
                  onCommand={handleMeetingCommand}
                  onEndCall={() => setMeeting(m => ({ ...m, isActive: false }))}
                />
              </div>
            )}
          </AnimatePresence>
        {/* UNIFIED BACKGROUND SVG LAYER — Production Fix & Subtle Drop */}
        <div className="absolute inset-0 pointer-events-none z-[-1] overflow-visible" 
             style={{ filter: isLightMode ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.12))' : 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}>
          <svg width="100%" height="100%" shapeRendering="geometricPrecision" style={{ display: 'block', overflow: 'visible' }}>

             <motion.path
                initial={false}
                animate={{ d: (() => {
                  const isLarge = showSettings || isExpanded;
                  const isPreview = showPreview && activeView === 'Multimedia';
                  const w = (showSettings ? 720 : isExpanded ? (isPreview ? 840 : 680) : (superPill ? 72 : 360));
                  const h_base = showSettings ? 480 : isExpanded ? (['Herramientas', 'Llamada'].includes(activeView) ? 420 : 180) : (superPill ? 42 : 66);
                  const h = (superPill && !isLarge) ? (h_base + (musicIntensity || 0) * 4) : h_base;
                  const totalW = w + 68;
                  
                  if (superPill && !isLarge) {
                    const neck = 42; 
                    return `M 0 0 C ${neck} 0, ${neck} ${h}, ${totalW/2} ${h} S ${totalW-neck} 0, ${totalW} 0 Z`;
                  } else {
                    const r = 34;
                    return `M 0 0 A ${r} ${r} 0 0 1 ${r} ${r} V ${h-r} A ${r} ${r} 0 0 0 ${r*2} ${h} H ${totalW-(r*2)} A ${r} ${r} 0 0 0 ${totalW-r} ${h-r} V ${r} A ${r} ${r} 0 0 1 ${totalW} 0 Z`;
                  }
                })() }}
                fill={isLightMode ? '#fdfdfd' : '#0a0a0a'}
                stroke={isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'}
                strokeWidth="0.5"
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
             />

             {/* Modern Rhythm Contour Effect */}
             <AnimatePresence>
               {superPill && !isExpanded && media.isPlaying && (
                 <motion.path
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ 
                     d: (() => {
                       const w = 72;
                       const h = 42 + (musicIntensity || 0) * 4;
                       const totalW = w + 68;
                       const neck = 42;
                       return `M 2 0 C ${neck} 0, ${neck} ${h}, ${totalW/2} ${h} S ${totalW-neck} 0, ${totalW-2} 0`;
                     })(),
                     pathLength: 1, 
                     opacity: 0.3 + (musicIntensity || 0) * 0.4,
                     strokeWidth: 0.8 + (musicIntensity || 0) * 1,
                   }}
                   style={{ 
                     filter: `drop-shadow(0 0 ${2 + (musicIntensity || 0) * 6}px rgba(139, 92, 246, 0.4))` 
                   }}
                   exit={{ opacity: 0 }}
                   fill="none"
                   stroke="url(#modernRhythmGradient)"
                   strokeLinecap="round"
                 />
               )}
             </AnimatePresence>

             <defs>
               <linearGradient id="modernRhythmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#3b82f6" />
                 <stop offset="50%" stopColor="#8b5cf6" />
                 <stop offset="100%" stopColor="#ec4899" />
                 <animate 
                   attributeName="x1" 
                   values="0%;100%;0%" 
                   dur="3s" 
                   repeatCount="indefinite" 
                 />
               </linearGradient>
             </defs>
          </svg>
          <div className="absolute inset-0 z-[-2] rounded-[34px]" style={{ backdropFilter: 'blur(80px)', background: 'transparent' }} />
        </div>

        {/* Content wrapper — centered relative to the whole silhouette */}
        <div 
          className="absolute overflow-hidden"
          style={{ 
            left: 34, 
            right: 34,
            top: 0,
            bottom: 0,
          }}
        >
        {/* ── COLLAPSED PILL ── */}
        <motion.div
          animate={{ opacity: isExpanded ? 0 : 1 }}
          className={clsx('absolute inset-0 flex items-center', isExpanded && 'pointer-events-none')}
          onPointerDown={(e) => !isExpanded && dragControls.start(e)}
        >
          {superPill ? (
            <div className="flex items-center justify-center w-full h-full" onPointerDown={(e) => e.stopPropagation()}>
              {(() => {
                const mode = superPillMode === 'Auto' ? (media.isPlaying ? 'Multimedia' : 'Clima') : superPillMode;
                if (mode === 'Multimedia') {
                  return (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/10 bg-zinc-900 relative shadow-2xl">
                      {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-4 h-4 m-auto opacity-10" />}
                    </motion.div>
                  );
                } else {
                  return (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-lg">
                      <Cloud className="w-5 h-5 text-blue-400" />
                    </motion.div>
                  );
                }
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 relative shrink-0 shadow-lg">
                  {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-5 h-5 m-auto opacity-10" />}
                  <div className="absolute -bottom-0.5 -right-0.5 bg-[#fc3c44] w-4 h-4 rounded-full flex items-center justify-center border-2 border-black"><Music className="w-2 h-2 text-white" /></div>
                </div>
                <div className="flex flex-col min-w-0 max-w-[130px]">
                  <span className="text-[12px] font-black truncate tracking-tight text-left">{media.isPlaying ? media.title : t.resumen}</span>
                  <span className="text-[9px] font-bold truncate uppercase text-left" style={{ opacity: 0.35 }}>{media.isPlaying ? media.artist : 'Sin Actividad'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={clsx('flex items-center gap-1 py-0.5 px-2 rounded-full border text-[9px] font-black', isLightMode ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10')}>
                  <Cloud className="w-3 h-3 text-blue-400" />
                  <span className="tracking-tight">{weather.temp}°</span>
                </div>
                <div className="flex items-center gap-1 font-black text-[12px] tracking-tighter" style={{ opacity: 0.35 }}>
                  <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  <span className="text-[7px] uppercase font-mono">{currentTime.getHours() >= 12 ? 'PM' : 'AM'}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── EXPANDED PANEL ── */}
        <motion.div
          animate={{ opacity: isExpanded && !showSettings ? 1 : 0 }}
          className={clsx('absolute inset-0 flex flex-col pt-2.5 px-4 pb-2', (!isExpanded || showSettings) && 'pointer-events-none')}
          onPointerDown={(e) => {
             // Only start drag if clicking the background, not a button or control
             const target = e.target as HTMLElement;
             if (target.tagName !== 'BUTTON' && target.tagName !== 'INPUT' && !target.closest('.no-drag')) {
               dragControls.start(e);
             }
          }}
        >
          {/* Tab bar */}
          <div className={clsx('flex items-center justify-between mb-2 pb-2 border-b shrink-0 z-50', isLightMode ? 'border-black/5' : 'border-white/5')}>
            <div className="flex gap-1 items-center overflow-x-auto no-scrollbar max-w-[80%]" onPointerDown={(e) => e.stopPropagation()}>
              {(['Resumen', 'Sistema', 'Multimedia', 'Llamada', 'Notificación', 'Herramientas'] as const).map(v =>
                visibleTabs.includes(v) && (
                  <button
                    key={v}
                    onClick={() => setActiveView(v)}
                    className={clsx(
                      'px-3 py-1 rounded-full text-[9.5px] font-black flex items-center gap-1 transition-all uppercase whitespace-nowrap',
                      activeView === v
                        ? (isLightMode ? 'bg-black text-white' : 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.2)]')
                        : (isLightMode ? 'opacity-30 hover:opacity-60' : 'opacity-30 hover:opacity-70')
                    )}
                  >
                    {v === 'Resumen'      && <Activity className="w-2.5 h-2.5" />}
                    {v === 'Sistema'      && <Cpu       className="w-2.5 h-2.5" />}
                    {v === 'Multimedia'   && <Volume2   className="w-2.5 h-2.5" />}
                    {v === 'Notificación' && <Bell      className="w-2.5 h-2.5" />}
                    {v === 'Herramientas' && <Timer     className="w-2.5 h-2.5" />}
                    {v === 'Llamada'      && <Video      className="w-2.5 h-2.5" />}
                    {t[v === 'Notificación' ? 'notificacion' : v.toLowerCase()] || v}
                  </button>
                )
              )}
            </div>
            <div className="flex items-center gap-2.5 shrink-0 px-2">
              <SoundVisualizer isPlaying={media.isPlaying} />
              <button 
                onClick={() => setIsPinned(p => !p)} 
                className={clsx('p-1.5 rounded-xl transition-all border', isPinned ? 'bg-blue-500 text-white border-blue-400' : 'opacity-40 hover:opacity-100 border-transparent hover:bg-white/10')}
              >
                <Pin className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowSettings(s => !s)} 
                className="p-1.5 rounded-xl opacity-40 hover:opacity-100 hover:bg-white/10 transition-all"
              >
                <Settings className="w-4 h-4 hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {/* RESUMEN — matches reference: large music left | week calendar center | notif count right */}
            {activeView === 'Resumen' && (
              <div className="absolute inset-0 flex items-stretch">

                {/* Col 1: Music — large album art + info + controls */}
                <div className="flex items-center gap-3 px-4 border-r shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)', width: 260 }}>
                  {/* Big album art */}
                  <div onDoubleClick={() => openApp('Spotify')} className="w-[90px] h-[90px] rounded-[22px] overflow-hidden shrink-0 border border-white/10 bg-zinc-900 relative shadow-2xl cursor-pointer hover:scale-105 transition-transform">
                    {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-9 h-9 m-auto opacity-10" />}
                    <div className="absolute -bottom-1 -right-1 bg-[#fc3c44] w-7 h-7 rounded-full flex items-center justify-center border-2 border-black shadow-lg"><Music className="w-3 h-3 text-white" /></div>
                  </div>
                  {/* Track info + controls vertical */}
                  <div className="flex flex-col min-w-0 flex-1 text-left gap-0.5">
                    <span className="text-[14px] font-black truncate tracking-tight leading-tight">{media.title}</span>
                    <span className="text-[10px] font-bold truncate" style={{ opacity: 0.45 }}>{media.artist}</span>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'prev')}      className="hover:scale-110 transition-all outline-none opacity-40">
                        <SkipBack className="w-4 h-4" />
                      </button>
                      <button      onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'playPause')} className="w-7 h-7 hover:scale-110 transition-all outline-none">
                        {media.isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                      </button>
                      <button onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'next')}      className="hover:scale-110 transition-all outline-none opacity-40">
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Compact volume slider */}
                    <div className="flex items-center gap-1.5 mt-2 w-full">
                      <Volume2 className="w-3 h-3 shrink-0" style={{ opacity: 0.3 }} />
                      <input type="range" min={0} max={100} value={volume}
                        onChange={e => setVol(Number(e.target.value))}
                        className="flex-1 h-1 rounded-full outline-none cursor-pointer"
                        style={{ accentColor: '#3b82f6' }}
                      />
                      <span className="text-[8px] font-black tabular-nums w-5 text-right" style={{ opacity: 0.3 }}>{volume}</span>
                    </div>
                  </div>
                </div>

                {/* Col 2: Week calendar — selectable days */}
                {(() => {
                  const today = currentTime;
                  const targetDate = new Date(today);
                  targetDate.setDate(targetDate.getDate() + (calendarOffset * 7));
                  
                  const todayNum = today.getDate();
                  const todayMonth = today.getMonth();
                  
                  const days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(targetDate);
                    d.setDate(targetDate.getDate() - targetDate.getDay() + i);
                    return d;
                  });
                  const dayAbbr = ['S','M','T','W','T','F','S'];
                  const sel = selectedDay;
                  
                  // For the title: show the month of the current view
                  const viewMonth = targetDate.toLocaleString(lang === 'zh' ? 'zh-CN' : lang, { month: 'short' });
                  
                  return (
                    <div className="flex-1 flex flex-col justify-center px-5 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-baseline gap-2 font-black">
                          <span className="text-[22px] tracking-tighter leading-none" style={{ opacity: 0.9 }}>{viewMonth}</span>
                          <span className="text-[12px] text-blue-400 font-mono font-black">{calendarOffset === 0 ? todayNum : ''}</span>
                        </div>
                        <div className="flex items-center gap-1 no-drag pointer-events-auto">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setCalendarOffset(p => p - 1); }}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 text-blue-400 opacity-60" />
                          </button>
                          {calendarOffset !== 0 && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setCalendarOffset(0); }}
                              className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase bg-blue-500/20 text-blue-400"
                            >
                              Hoy
                            </button>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setCalendarOffset(p => p + 1); }}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-blue-400 opacity-60" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {days.map((d, i) => {
                          const isToday   = d.getDate() === todayNum && d.getMonth() === todayMonth && calendarOffset === 0;
                          const isSel     = sel && d.getDate() === sel.getDate() && d.getMonth() === sel.getMonth();
                          const isWeekend = i === 0 || i === 6;
                          return (
                            <button
                              key={i}
                              onClick={(e) => { e.stopPropagation(); setSelectedDay(isSel ? null : new Date(d)); }}
                              className="flex flex-col items-center gap-0.5 outline-none no-drag pointer-events-auto"
                            >
                              <span className="text-[7.5px] font-black uppercase" style={{ opacity: isToday ? 1 : 0.3, color: isWeekend && !isToday ? 'rgba(255,100,100,0.7)' : 'inherit' }}>{dayAbbr[i]}</span>
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all"
                                style={{
                                  background: isToday ? '#3b82f6' : isSel ? 'rgba(255,255,255,0.15)' : 'transparent',
                                  color: isToday ? '#fff' : 'inherit',
                                  opacity: isToday || isSel ? 1 : 0.4,
                                  boxShadow: isToday ? '0 0 10px rgba(59,130,246,0.5)' : 'none',
                                }}
                              >
                                {d.getDate()}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-[8px] font-black uppercase tracking-wider" style={{ opacity: 0.18 }}>
                        <CheckSquare className="w-2.5 h-2.5 text-emerald-400" />
                        {sel ? sel.toLocaleDateString(lang, { weekday: 'short', day: 'numeric' }) : t.empty}
                      </div>
                    </div>
                  );
                })()}

                {/* Col 3: Notification count badge */}
                <div className="flex flex-col items-center justify-center px-5 gap-1.5 shrink-0" style={{ width: 90 }}>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center relative cursor-pointer hover:scale-105 transition-transform"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => setActiveView('Notificación')}
                  >
                    <Bell className="w-6 h-6" style={{ opacity: 0.5 }} />
                    {notifications.length > 0 && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 10px rgba(59,130,246,0.6)' }}>
                        {notifications.length > 9 ? '9+' : notifications.length}
                      </div>
                    )}
                  </div>
                  <span className="text-[7.5px] font-black uppercase tracking-widest" style={{ opacity: 0.25 }}>Alertas</span>
                </div>
              </div>
            )}

            {/* SISTEMA */}
            {activeView === 'Sistema' && (
              <div className="absolute inset-0 flex flex-col justify-center px-12 gap-4">
                {[
                  { label: 'CPU', val: systemInfo.cpu,      col: 'bg-blue-500',    icon: <Cpu       className="w-3.5 h-3.5 text-blue-400"   /> },
                  { label: 'RAM', val: systemInfo.ram,      col: 'bg-purple-500',  icon: <HardDrive className="w-3.5 h-3.5 text-purple-400" /> },
                  { label: 'NET', val: systemInfo.net * 10, col: 'bg-emerald-500', icon: <Activity  className="w-3.5 h-3.5 text-emerald-400"/> },
                ].map(s => (
                  <div key={s.label} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center px-1 font-black uppercase tracking-widest text-[9.5px]">
                      <div className="flex items-center gap-2" style={{ opacity: 0.7 }}>{s.icon} {s.label}</div>
                      <span className="font-mono" style={{ opacity: 0.5 }}>{Math.round(s.val)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full border overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.05)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.val}%` }} className={clsx('h-full rounded-full', s.col)} transition={{ type: 'spring', stiffness: 80, damping: 15 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MULTIMEDIA — album art left + controls right */}
            {activeView === 'Multimedia' && (
              <div className="absolute inset-0 flex items-stretch">
                {/* Columna Izquierda: Arte / Vista Previa en Vivo */}
                <div 
                  className="flex flex-col items-center justify-center px-6 border-r gap-2 transition-all duration-500" 
                  style={{ borderColor: 'rgba(255,255,255,0.06)', minWidth: showPreview ? 320 : 140 }}
                >
                  <motion.div 
                    layout
                    className={clsx(
                      "rounded-[22px] overflow-hidden border border-white/10 bg-zinc-950 relative shadow-2xl cursor-pointer group",
                      showPreview ? "w-64 h-36" : "w-20 h-20"
                    )}
                    onClick={() => {
                      if (showPreview) {
                        const app = media.id === 'system' ? 'Chrome' : media.id;
                        openApp(app);
                      } else {
                        setShowPreview(true);
                      }
                    }}
                  >
                    {showPreview && stream ? (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-contain bg-black" 
                      />
                    ) : (
                      <>
                        {media.thumbnail ? (
                          <img src={media.thumbnail} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-full opacity-10">
                            <Music className="w-8 h-8" />
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Botón de alternancia de vista previa */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowPreview(!showPreview); }}
                      className={clsx(
                        "absolute top-2 right-2 p-1.5 rounded-lg transition-all backdrop-blur-md",
                        showPreview ? "bg-red-500/80 text-white" : "bg-black/40 text-white/60 opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {showPreview ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                    </button>
                    
                    {showPreview && (
                      <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/95 to-transparent flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        <span className="text-[8px] font-black uppercase text-white tracking-widest">En Vivo</span>
                      </div>
                    )}
                  </motion.div>
                  {!showPreview && <SoundVisualizer isPlaying={media.isPlaying} />}
                </div>

                {/* Centro: Info de pista + Controles principales */}
                <div className="flex-1 flex flex-col items-start justify-center px-8 gap-1.5 min-w-0">
                  <motion.div layout className="flex flex-col w-full text-left">
                    <span className="text-[16px] font-black truncate w-full tracking-tighter leading-none">{media.title}</span>
                    <span className="text-[11px] font-bold truncate w-full mt-1" style={{ opacity: 0.4 }}>{media.artist}</span>
                  </motion.div>
                  
                  <div className="flex items-center gap-6 mt-3">
                    <button 
                      onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'prev')}      
                      className="hover:scale-125 transition-all opacity-40 hover:opacity-100"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button      
                      onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'playPause')} 
                      className="w-12 h-12 rounded-full flex items-center justify-center border outline-none hover:scale-105 active:scale-95 transition-all shadow-xl bg-white/5 border-white/10"
                    >
                      {media.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <button 
                      onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'next')}      
                      className="hover:scale-125 transition-all opacity-40 hover:opacity-100"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {/* Right: volume slider column */}
                <div 
                  className="flex flex-col items-center justify-center px-4 gap-2 no-drag" 
                  style={{ minWidth: 70 }} 
                >
                  <Volume2 className="w-4 h-4" style={{ opacity: 0.35 }} />
                  <input type="range" min={0} max={100} value={volume}
                    onChange={e => setVol(Number(e.target.value))}
                    className="h-1 rounded-full outline-none cursor-pointer"
                    style={{ accentColor: '#3b82f6', writingMode: 'vertical-lr', direction: 'rtl', height: 80, width: 'auto' }}
                  />
                  <span className="text-[9px] font-black tabular-nums" style={{ opacity: 0.35 }}>{volume}%</span>
                </div>
              </div>
            )}

            {/* NOTIFICACIÓN */}
            {activeView === 'Notificación' && (
              <div className="absolute inset-0 flex flex-col">
                <div className="flex justify-between items-center px-2 py-1 shrink-0">
                  <span className="text-[9.5px] font-black uppercase tracking-[0.4em]" style={{ opacity: 0.4 }}>{t.notificacion}</span>
                  <button onClick={() => setNotifications([])} className="text-[9px] font-black text-red-500 flex items-center gap-1.5 uppercase">
                    <Trash2 className="w-3 h-3" /> {t.clear}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 px-1 pb-1">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} onClick={() => setNotifications(p => p.filter(x => x.id !== n.id))} className="rounded-[16px] border p-3 flex items-center gap-3 cursor-pointer transition-all hover:!bg-white/10" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0"><Bell className="w-4 h-4" /></div>
                      <div className="text-left min-w-0">
                        <span className="text-[9px] font-black text-blue-500 uppercase">{n.app}</span>
                        <p className="text-[12px] font-bold opacity-90 leading-tight truncate">{n.text}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4" style={{ opacity: 0.1 }}>
                      <BellOff className="w-9 h-9" />
                      <span className="text-[11px] font-black uppercase tracking-[0.7em]">{t.empty}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LLAMADA / REUNIÓN */}
            {activeView === 'Llamada' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-20 h-20 rounded-[32px] bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/20 shadow-2xl"
                  >
                    <Video className="w-10 h-10" />
                  </motion.div>
                  <div className="flex flex-col items-center">
                    <span className="text-[20px] font-black tracking-tight">{meeting.app || 'Llamada Activa'}</span>
                    <span className="text-[11px] font-bold opacity-40 uppercase tracking-[0.2em]">{meeting.device}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <button 
                    onClick={() => handleMeetingCommand('toggleMic')}
                    className={clsx(
                      "w-16 h-16 rounded-full flex items-center justify-center transition-all border shadow-xl hover:scale-105 active:scale-95",
                      meeting.micActive ? "bg-green-500 text-white border-green-400" : "bg-white/10 border-white/20 hover:bg-white/20"
                    )}
                  >
                    {meeting.micActive ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
                  </button>
                  <button 
                    onClick={() => handleMeetingCommand('toggleCam')}
                    className={clsx(
                      "w-16 h-16 rounded-full flex items-center justify-center transition-all border shadow-xl hover:scale-105 active:scale-95",
                      meeting.camActive ? "bg-green-500 text-white border-green-400" : "bg-white/10 border-white/20 hover:bg-white/20"
                    )}
                  >
                    {meeting.camActive ? <Video className="w-7 h-7" /> : <VideoOff className="w-7 h-7" />}
                  </button>
                  <button 
                    onClick={() => handleMeetingCommand('endCall')}
                    className="w-20 h-20 rounded-full flex items-center justify-center bg-red-600 text-white shadow-2xl shadow-red-600/40 hover:scale-110 active:scale-95 transition-all"
                  >
                    <PhoneOff className="w-9 h-9" />
                  </button>
                </div>
              </div>
            )}

            {/* HERRAMIENTAS */}
            {activeView === 'Herramientas' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[450px] h-[450px] flex items-center justify-center">
                  
                  {/* Unified Triple Timer System */}
                  <div className="no-drag">
                    <UnifiedCircularTimer 
                      hours={timerActive ? (timerTime / 3600) : timerHours}
                      mins={timerActive ? ((timerTime % 3600) / 60) : timerMins}
                      secs={timerActive ? (timerTime % 60) : timerSecs}
                      onChange={(type, val) => {
                        if (type === 'h') setTimerHours(val);
                        else if (type === 'm') setTimerMins(val);
                        else setTimerSecs(val);
                      }}
                      disabled={timerActive}
                      isLightMode={isLightMode}
                    />
                  </div>

                  {/* Center Controls — inside a smaller safe zone */}
                  <div className="absolute z-30 flex flex-col items-center pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
                    <div className="flex flex-col items-center mb-1">
                      <span className="text-[22px] font-black tabular-nums tracking-tighter leading-none">
                        {fmtTime(timerTime || (timerHours * 3600 + timerMins * 60 + timerSecs))}
                      </span>
                      <span className="text-[8px] font-black uppercase text-blue-500 tracking-[0.2em] mt-0.5">
                        {timerActive ? 'EN MARCHA' : 'DESLIZA'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => timerActive ? setTimerActive(false) : (timerTime > 0 ? setTimerActive(true) : startTimer())}
                        className={clsx(
                          "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                          timerActive ? "bg-red-500/20 text-red-500 border border-red-500/30" : "bg-blue-500 text-white shadow-xl shadow-blue-500/30"
                        )}
                      >
                        {timerActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                      </button>
                      <button 
                        onClick={resetTimer} 
                        className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all border",
                          isLightMode ? "border-black/10 bg-black/5" : "border-white/10 bg-white/5"
                        )}
                      >
                        <RotateCcw className="w-4 h-4 opacity-50" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── SETTINGS OVERLAY (larger, detached-style) ── */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1,  scale: 1,    y: 0   }}
              exit={{   opacity: 0,  scale: 0.97,  y: -8  }}
              className="absolute inset-0 flex flex-col overflow-hidden"
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                background: isLightMode ? 'rgba(252,252,252,0.97)' : 'rgba(8,8,8,0.97)',
                backdropFilter: 'blur(40px)',
                borderRadius: `0 0 ${WING_R}px ${WING_R}px`,
                color: isLightMode ? '#111' : '#fff',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-10 py-6 border-b" style={{ borderColor: isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)' }}>
                <div>
                  <h2 className="text-[18px] font-black uppercase tracking-[0.4em]" style={{ opacity: 0.7 }}>{t.settings}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mt-0.5">Dynamic Island v2.5</p>
                </div>
                <button onClick={() => setShowSettings(false)} className="w-9 h-9 rounded-full flex items-center justify-center font-black text-lg hover:bg-red-500 hover:text-white transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>✕</button>
              </div>

              {/* Body — 3-column grid */}
              <div className="flex-1 overflow-hidden grid grid-cols-3">

                {/* Col 1: Tabs visibility */}
                <div className="flex flex-col gap-4 p-8" style={{ borderRight: `1px solid ${isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}` }}>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t.visibility}</span>
                  <div className="flex flex-col gap-2">
                    {(['Resumen', 'Sistema', 'Multimedia', 'Llamada', 'Notificación', 'Herramientas'] as const).map(v => (
                      <button
                        key={v}
                        onClick={() => toggleTab(v)}
                        className="flex items-center justify-between px-4 py-3 rounded-2xl border transition-all font-black text-[11px] uppercase"
                        style={{
                          background: visibleTabs.includes(v) ? (isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)') : 'transparent',
                          borderColor: visibleTabs.includes(v) ? (isLightMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)') : 'transparent',
                          opacity: visibleTabs.includes(v) ? 1 : 0.3,
                        }}
                      >
                        <span>{v}</span>
                        {visibleTabs.includes(v) ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Col 2: Template */}
                <div className="flex flex-col gap-4 p-8" style={{ borderRight: `1px solid ${isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}` }}>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t.template}</span>
                  <div className="flex flex-col gap-3">
                    {(['Moderno', 'Mínimo', 'Clásico'] as const).map(k => (
                      <button
                        key={k}
                        onClick={() => setSummaryTemplate(k)}
                        className="py-4 rounded-2xl font-black text-[12px] uppercase tracking-wider transition-all border"
                        style={{
                          background: summaryTemplate === k ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                          borderColor: summaryTemplate === k ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.06)',
                          color: summaryTemplate === k ? '#60a5fa' : 'inherit',
                          opacity: summaryTemplate === k ? 1 : 0.4,
                          boxShadow: summaryTemplate === k ? '0 0 20px rgba(59,130,246,0.15)' : 'none',
                        }}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Col 3: Theme + Language + SuperPill */}
                <div className="flex-1 flex flex-col gap-5 p-8">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Minimalismo</span>
                    <button
                      onClick={() => setSuperPill(p => !p)}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl border transition-all font-black text-[11px] uppercase pointer-events-auto"
                      style={{
                        background: superPill ? (isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)') : 'transparent',
                        borderColor: superPill ? (isLightMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)') : (isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'),
                        color: superPill ? '#60a5fa' : 'inherit',
                      }}
                    >
                      <span>Super Minimizar</span>
                      <div className={clsx('w-8 h-4 rounded-full relative transition-all', superPill ? 'bg-blue-500' : 'bg-zinc-700')}>
                        <div className={clsx('absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all', superPill ? (isLightMode ? 'left-4' : 'left-4.5') : 'left-0.5')} />
                      </div>
                    </button>
                    {superPill && (
                      <div className="flex gap-1.5 mt-1 no-drag pointer-events-auto">
                        {(['Auto', 'Multimedia', 'Clima'] as const).map(m => (
                          <button key={m} onClick={() => setSuperPillMode(m)} className="flex-1 py-2 rounded-xl border font-black text-[8px] uppercase tracking-tighter"
                            style={{
                              background: superPillMode === m ? 'rgba(59,130,246,0.2)' : 'transparent',
                              borderColor: superPillMode === m ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.05)',
                              color: superPillMode === m ? '#60a5fa' : 'inherit',
                              opacity: superPillMode === m ? 1 : 0.4
                            }}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t.theme}</span>
                    <button
                      onClick={() => setIsLightMode(m => !m)}
                      className="w-full py-4 rounded-2xl font-black uppercase text-[12px] tracking-wider transition-all border"
                      style={{
                        background: isLightMode ? '#111' : '#f8f8f8',
                        color: isLightMode ? '#fff' : '#111',
                        borderColor: 'transparent',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      }}
                    >
                      {isLightMode ? t.dark : t.light}
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t.lang}</span>
                    <div className="flex gap-2">
                      {(['es', 'en', 'zh'] as const).map(l => (
                        <button
                          key={l}
                          onClick={() => setLang(l)}
                          className="flex-1 py-3 rounded-xl font-black uppercase text-[11px] tracking-wider transition-all border"
                          style={{
                            background: lang === l ? 'rgba(59,130,246,0.8)' : 'rgba(255,255,255,0.04)',
                            borderColor: lang === l ? 'transparent' : 'rgba(255,255,255,0.08)',
                            color: lang === l ? '#fff' : 'inherit',
                            opacity: lang === l ? 1 : 0.4,
                          }}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        <div 
          className="absolute left-full ml-6 top-1 pointer-events-auto flex flex-col gap-2 translate-y-[-2px]"
          onMouseEnter={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', false)}
          onMouseLeave={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', true)}
        >
            {/* Timer bubble */}
            <AnimatePresence>
              {showTimerBubble && (
                <TimerBubble time={timerTime} total={timerTotal} isActive={timerActive} isLightMode={isLightMode} />
              )}
            </AnimatePresence>

            {/* Notification bubble */}
            <AnimatePresence>
              {showNotifBubble && (
                <NotifBubble
                  count={notifications.length}
                  onClick={() => { setIsHovered(true); setActiveView('Notificación'); (window as any).ipcRenderer?.send('set-ignore-mouse-events', false); }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
