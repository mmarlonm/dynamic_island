import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls, useMotionValue, Reorder } from 'framer-motion';
import {
  Settings, Play, Pause, SkipBack, SkipForward, Music, Bell, Cloud,
  CheckSquare, Pin, Activity, Volume2, HardDrive, Cpu, Trash2, Eye,
  EyeOff, BellOff, Timer, RotateCcw, Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
  ChevronLeft, ChevronRight, Download, MessageCircle, Wifi, WifiOff, Bluetooth, LayoutGrid, GripVertical
} from 'lucide-react';
import clsx from 'clsx';

// ── Pure UI Sound Visualizer (5-bar Equalizer) ────────────────────────────────
const SoundVisualizer = ({ 
  isPlaying, 
  bars = [4, 4, 4, 4, 4] 
}: { 
  isPlaying: boolean; 
  bars?: number[];
}) => {
  return (
    <div className="w-10 h-4 flex items-center justify-center gap-[3px] pointer-events-none px-1 overflow-hidden" 
         style={{ filter: !isPlaying ? 'grayscale(1) opacity(0.3)' : 'none' }}>
      {bars.map((h, i) => (
        <motion.div
  key={i}
  animate={{ height: isPlaying ? h : 4 }}
  transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.5 }}
  className={clsx('w-[3px] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]', 
    isPlaying ? 'bg-blue-400' : 'bg-gray-400 opacity-20')}
/>
      ))}
    </div>
  );
};


// ── Floating timer circle (pill-mode) ────────────────────────────────────────
const TimerBubble = ({ time, total, isActive, isLightMode, onClick }: { time: number; total: number; isActive: boolean; isLightMode: boolean; onClick?: () => void }) => {
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
      className="pointer-events-auto select-none cursor-pointer"
      onClick={onClick}
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

// ── Control Center Bubble (Left Side) ───────────────────────────
const ControlCenterBubble = ({ 
  wifiActive, btActive, volume, onToggleWifi, onToggleBt, onVolumeChange 
}: { 
  wifiActive: boolean; btActive: boolean; volume: number; 
  onToggleWifi: () => void; onToggleBt: () => void; onVolumeChange: (v: number) => void 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ipc = (window as any).ipcRenderer;
  const pct = volume / 100;

  return (
    <motion.div
      onMouseEnter={() => { setIsHovered(true); ipc?.send('set-ignore-mouse-events', false); }}
      onMouseLeave={() => { setIsHovered(false); }}
      initial={{ scale: 0, opacity: 0, x: 20 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        x: 0,
        width: isHovered ? 240 : 56,
      }}
      className="pointer-events-auto select-none cursor-pointer h-14 bg-black/80 backdrop-blur-3xl rounded-[28px] flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl"
    >
      {!isHovered ? (
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" strokeWidth="2.5" fill="transparent" stroke="rgba(255,255,255,0.08)" />
            <motion.circle
              cx="28" cy="28" r="22" strokeWidth="2.5" fill="transparent"
              stroke="#3b82f6"
              strokeDasharray={2 * Math.PI * 22}
              animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - pct) }}
              style={{ filter: 'drop-shadow(0 0 4px #3b82f6)' }}
            />
          </svg>
          <div className="relative z-10 flex flex-col items-center">
            <LayoutGrid className="w-4 h-4 text-white/60" />
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-4 px-5 w-full h-full"
        >
          <div className="flex gap-2.5 shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleWifi(); }}
              className={clsx("w-9 h-9 rounded-xl flex items-center justify-center transition-all", wifiActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 text-white/30 border border-white/5")}
            >
              <Wifi className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleBt(); }}
              className={clsx("w-9 h-9 rounded-xl flex items-center justify-center transition-all", btActive ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 text-white/30 border border-white/5")}
            >
              <Bluetooth className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
             <div className="flex items-center justify-between px-0.5 mb-1">
               <Volume2 className="w-3 h-3 text-white/30" />
               <span className="text-[8px] font-black text-blue-400 tabular-nums">{volume}%</span>
             </div>
             <div className="relative flex items-center h-4">
               <input 
                 type="range" min="0" max="100" value={volume}
                 onChange={(e) => onVolumeChange(parseInt(e.target.value))}
                 onPointerDown={(e) => { e.stopPropagation(); ipc?.send('set-ignore-mouse-events', false); }}
                 className="w-full h-1 rounded-full outline-none cursor-pointer bg-white/10"
                 style={{ accentColor: '#3b82f6' }}
               />
             </div>
          </div>
        </motion.div>
      )}
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
  const [activeView, setActiveView]   = useState<'Resumen' | 'Sistema' | 'Multimedia' | 'Notificación' | 'Herramientas' | 'Llamada' | 'Actualización' | 'WhatsApp' | 'YouTube'>('Resumen');
  const [lang, setLang]               = useState<'es' | 'en' | 'zh'>('es');
  const [isLightMode, setIsLightMode] = useState(false);
  const [summaryTemplate, setSummaryTemplate] = useState<'Moderno' | 'Mínimo' | 'Clásico'>('Moderno');
  const [visibleTabs, setVisibleTabs] = useState<string[]>(['Resumen', 'Sistema', 'Multimedia', 'Llamada', 'Notificación', 'Herramientas', 'WhatsApp', 'YouTube', 'Actualización']);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [media, setMedia]   = useState({ title: 'Ningún origen de medios', artist: 'Sin Reproducción', isPlaying: false, thumbnail: '', id: '' });
  const [notifications, setNotifications] = useState<Array<{ id: number; app: string; text: string }>>([]);
  const [systemInfo, setSystemInfo]   = useState({ cpu: 12, ram: 45, net: 2.1, temp: 42 });
  const [wifiActive, setWifiActive] = useState(true);
  const [btActive, setBtActive]     = useState(true);
  const [musicIntensity, setMusicIntensity] = useState(0);
  const [beatPulse, setBeatPulse]           = useState(0); 
  const [visualizerBars, setVisualizerBars] = useState([4, 4, 4, 4, 4]);
  const [weather, setWeather]         = useState({ temp: '22', condition: 'Clear', city: 'Local' });
  const [volume, setVolume]           = useState(50);
  const [meeting, setMeeting] = useState({ isActive: false, app: '', device: '', micActive: false, camActive: false });
  const whatsappWebviewRef = useRef<any>(null);
  const youtubeWebviewRef  = useRef<any>(null);

  // 0-100 system volume

  const [timerTime, setTimerTime]      = useState(0);
  const [currentVersion, setCurrentVersion] = useState('0.0.0');
  const [updateInfo, setUpdateInfo]    = useState<{version: string, status: 'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error', error?: string} | null>(null);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [timerTotal, setTimerTotal]    = useState(0);
  const [timerActive, setTimerActive]  = useState(false);
  const [timerHours, setTimerHours]    = useState(0);
  const [timerMins, setTimerMins]      = useState(25);
  const [timerSecs, setTimerSecs]      = useState(0);
  const timerRef = useRef<any>(null);
  const lastCommandTimeRef = useRef(0);
  const volDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Selected calendar day
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [superPill, setSuperPill] = useState(false);
  const [superPillMode, setSuperPillMode] = useState<'Auto' | 'Multimedia' | 'Clima'>('Auto');
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [visitedViews, setVisitedViews] = useState<Set<string>>(new Set(['Resumen']));
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [weatherCity, setWeatherCity] = useState(localStorage.getItem('weatherLocation') || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false); // Track active transition
  const isExpanded = isHovered || isPinned || showSettings;
  const [autoLaunch, setAutoLaunch] = useState(false);
  const [lastSelectedCity, setLastSelectedCity] = useState(localStorage.getItem('weatherLocation') || '');
  const [showControlsBubble, setShowControlsBubble] = useState(JSON.parse(localStorage.getItem('showControlsBubble') || 'true'));
  const [recentNotif, setRecentNotif] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeViewRef = useRef(activeView);
  useEffect(() => { activeViewRef.current = activeView; }, [activeView]);
  const [showAura, setShowAura] = useState(() => JSON.parse(localStorage.getItem('showAura') || 'true'));
  const [tabOrder, setTabOrder] = useState<any[]>(() => {
    const saved = localStorage.getItem('tabOrder');
    return saved ? JSON.parse(saved) : ['Resumen', 'Multimedia', 'Herramientas', 'Notificación', 'Actualización', 'WhatsApp', 'YouTube', 'Sistema', 'Llamada'];
  });

  // ── CENTRALIZED AUDIO CAPTURE ENGINE (v1.0 Sync) ──────────────────────────
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioRafRef = useRef<number | null>(null);
  const prevBassRef = useRef(0);
  const beatPulseRef = useRef(0);

  const stopAudioCapture = () => {
    if (audioRafRef.current) cancelAnimationFrame(audioRafRef.current);
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t: any) => t.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    audioAnalyserRef.current = null;
    audioSourceRef.current = null;
  };

  useEffect(() => {
    let active = true;
    let setupTimer: any;

    const setupAudio = async () => {
      stopAudioCapture();
      if (!media.isPlaying) {
        setMusicIntensity(0);
        setBeatPulse(0);
        setVisualizerBars([4, 4, 4, 4, 4]);
        return;
      }

      setupTimer = setTimeout(async () => {
        try {
          const ipc = (window as any).ipcRenderer;
          const sourceId = await ipc?.invoke('get-system-audio-id');
          if (!sourceId || !active) return;

          const stream = await (window as any).navigator.mediaDevices.getUserMedia({
            audio: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: sourceId } },
            video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: sourceId } }
          } as any);

          if (!active) {
            stream.getTracks().forEach((t: any) => t.stop());
            return;
          }

          audioStreamRef.current = stream;
          stream.getVideoTracks().forEach((t: any) => t.stop()); // Only need audio

          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const ans = ctx.createAnalyser();
          ans.fftSize = 64;
          const src = ctx.createMediaStreamSource(stream);
          src.connect(ans);
          
          audioContextRef.current = ctx;
          audioAnalyserRef.current = ans;
          audioSourceRef.current = src;

          const loop = () => {
            if (!active || !ans) return;
            const data = new Uint8Array(ans.frequencyBinCount);
            ans.getByteFrequencyData(data);

            // 1. Sustained Intensity (Norm: 85 for sensitivity)
            const bassAvg = (data[0] + data[1] + data[2]) / 3;
            const midAvg = (data[3] + data[4] + data[5]) / 3;
            const intensity = (bassAvg * 0.75 + midAvg * 0.25) / 85; 
            setMusicIntensity(Math.min(1, intensity));

            // 2. Beat Pulse Detection (Threshold: 0.07 for high response)
            const bassNow = (data[0] + data[1] + data[2]) / 3 / 255;
            const delta = bassNow - prevBassRef.current;
            if (delta > 0.07) {
              beatPulseRef.current = Math.min(1, beatPulseRef.current + delta * 3.0);
            }
            beatPulseRef.current *= 0.82; // Decay
            prevBassRef.current = bassNow * 0.6 + prevBassRef.current * 0.4;
            setBeatPulse(beatPulseRef.current);

            // 3. Visualizer Bars (Mapped to 4-16px)
            setVisualizerBars([
              Math.max(4, (data[1] / 255) * 16),
              Math.max(4, (data[3] / 255) * 16),
              Math.max(4, (data[5] / 255) * 16),
              Math.max(4, (data[2] / 255) * 16),
              Math.max(4, (data[7] / 255) * 16)
            ]);

            audioRafRef.current = requestAnimationFrame(loop);
          };
          loop();
        } catch (e) {
          console.warn('[AUDIO_SYNC] Capture failed, using fallback simulation:', e);
          const sim = () => {
            if (!active || !media.isPlaying) return;
            setVisualizerBars(prev => prev.map(() => Math.random() * 12 + 4));
            setMusicIntensity(Math.random() * 0.4);
            setBeatPulse(Math.random() > 0.88 ? 0.6 : 0);
            audioRafRef.current = requestAnimationFrame(sim);
          };
          if (media.isPlaying) sim();
        }
      }, 200);
    };

    setupAudio();
    return () => {
      active = false;
      clearTimeout(setupTimer);
      stopAudioCapture();
    };
  }, [media.isPlaying]);

  useEffect(() => {
    (window as any).ipcRenderer?.invoke('get-auto-launch').then(setAutoLaunch);
  }, []);

  useEffect(() => {
    let active = true;
    let timer: any;
    let activeStream: MediaStream | null = null;

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
            activeStream = s;
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
      if (activeStream) {
        (activeStream as MediaStream).getTracks().forEach(t => t.stop());
      }
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
  const islandX = useMotionValue(0); // Reactive offset from center for bubble sync
  const dragControls = useDragControls();

  useEffect(() => { isPinnedRef.current = isPinned; }, [isPinned]);
  useEffect(() => { showSettingsRef.current = showSettings; }, [showSettings]);
  useEffect(() => { isHoveredRef.current = isHovered; }, [isHovered]);

  // Sync the main process with the island position for hitbox updates
  useEffect(() => {
    // FM 6-10 onChange returns unsubscribe
    return islandX.onChange((v) => {
      (window as any).ipcRenderer?.send('update-island-pos', v);
    });
  }, [islandX]);

  useEffect(() => {
    const wv = whatsappWebviewRef.current;
    if (wv) {
      const onDomReady = () => {
        wv.insertCSS(`
          body { zoom: 0.85 !important; }
          header { display: none !important; } 
          #side { background: transparent !important; }
          ._3B79H { border: none !important; } 
        `);
      };
      wv.addEventListener('dom-ready', onDomReady);
      return () => wv.removeEventListener('dom-ready', onDomReady);
    }
  }, []);

  useEffect(() => {
    const yv = youtubeWebviewRef.current;
    if (!yv || !(window as any).ipcRenderer) return;

    const injectCSS = () => {
      yv.insertCSS(`
        /* ── Scale down slightly so more content fits ── */
        html { font-size: 13px !important; }
        ytd-app { zoom: 0.85; transform-origin: top left; }

        /* ── Keep header visible and sticky ── */
        #masthead-container, ytd-masthead { display: flex !important; }

        /* ── Remove left sidebar/guide (saves ~240px of horizontal space) ── */
        #guide, tp-yt-app-drawer, ytd-guide-renderer,
        ytd-mini-guide-renderer, #mini-guide { display: none !important; }

        /* ── Remove sign-in / cookie banners ── */
        ytd-popup-container, tp-yt-paper-dialog,
        yt-mealbar-promo-renderer { display: none !important; }

        /* ── Expand page content to use full width ── */
        ytd-page-manager, #page-manager { margin-left: 0 !important; }
        #content, ytd-browse { --ytd-margin-2x-default: 0px !important; }
      `).catch(() => {});
    };

    const injectPlaybackDetector = () => {
      yv.executeJavaScript(`
        const video = document.querySelector('video');
        if (video) {
          const notify = () => {
             console.log('YOUTUBE_STATUS:' + (video.paused ? 'paused' : 'playing') + '|' + document.title.replace(' - YouTube', ''));
          };
          video.addEventListener('play', notify);
          video.addEventListener('pause', notify);
          video.addEventListener('ended', notify);
          setInterval(notify, 5000); // Polling backup
          notify();
        }
      `);
    };

    const handleConsoleMessage = (e: any) => {
      if (e.message.startsWith('YOUTUBE_STATUS:')) {
        const data = e.message.replace('YOUTUBE_STATUS:', '');
        const [status, title] = data.split('|');
        const isPlaying = status === 'playing';
        if (activeViewRef.current === 'YouTube') {
          setMedia(p => ({ ...p, isPlaying, title: isPlaying ? title : p.title }));
        }
      }
    };

    yv.addEventListener('dom-ready', injectCSS);
    yv.addEventListener('dom-ready', injectPlaybackDetector);
    yv.addEventListener('console-message', handleConsoleMessage);

    return () => {
      yv.removeEventListener('dom-ready', injectCSS);
      yv.removeEventListener('dom-ready', injectPlaybackDetector);
      yv.removeEventListener('console-message', handleConsoleMessage);
    };
  }, []);

  const T: Record<string, any> = {
    es: { resumen:'Resumen', sistema:'Sistema', multimedia:'Multimedia', llamada:'Llamada', notificacion:'Notificación', herramientas:'Herramientas', empty:'Limpio', now:'AHORA', settings:'AJUSTES', template:'Diseño', moderno:'Moderno', minimo:'Mínimo', clasico:'Clásico', lang:'Idioma', visibility:'Pestañas', clear:'Borrar todo', theme:'Apariencia', light:'Claro', dark:'Oscuro', timer:'Temporizador', start:'Iniciar', pause:'Pausar', reset:'Reiniciar', weatherLoc:'Ubicación Clima', whatsapp:'WhatsApp', youtube:'YouTube', autoLaunch:'Auto-inicio', update:'Actualización', rhythmGlow: 'Contorno Dinámico', updVers: 'Versión Actual:', updChan: 'Canal: Estable', updStatus: 'Estado del Sistema', updIdle: 'Haz clic para buscar la versión más reciente.', updWait: 'Verificando...', updErr: 'Error de Red', updRetry: 'Reintentar', updNew: 'Nueva Versión', updDesc: 'Mejoras de rendimiento y correcciones.', updBtn: 'Descargar Ahora', updSkip: 'Omitir', updLoad: 'Recibiendo Paquete...', updReady: 'Lista para Instalar', updReadyDesc: 'La descarga ha finalizado. Reinicia Notchly.', updInstall: 'Reiniciar e Instalar' },
    en: { resumen:'Summary', sistema:'System', multimedia:'Media', llamada:'Call', notificacion:'Alerts', herramientas:'Tools', empty:'Clean', now:'NOW', settings:'SETTINGS', template:'Design', moderno:'Modern', minimo:'Minimal', clasico:'Classic', lang:'Language', visibility:'Tabs', clear:'Clear all', theme:'Theme', light:'Light', dark:'Dark', timer:'Timer', start:'Start', pause:'Pause', reset:'Reset', weatherLoc:'Weather Location', whatsapp:'WhatsApp', youtube:'YouTube', autoLaunch:'Auto-Launch', update:'Update', rhythmGlow: 'Rhythm Glow', updVers: 'Current Version:', updChan: 'Channel: Stable', updStatus: 'System Status', updIdle: 'Click below to check for the latest version.', updWait: 'Checking...', updErr: 'Network Error', updRetry: 'Retry', updNew: 'New Version', updDesc: 'Performance improvements and bug fixes.', updBtn: 'Download Now', updSkip: 'Skip', updLoad: 'Receiving Package...', updReady: 'Ready to Install', updReadyDesc: 'Download finished. Restart Notchly to apply.', updInstall: 'Restart and Install' },
    zh: { resumen:'摘要', sistema:'系统', multimedia:'多媒体', llamada:'通话', notificacion:'通知', herramientas:'工具', empty:'无内容', now:'现在', settings:'设置', template:'设计', moderno:'现代', minimo:'极简', clasico:'经典', lang:'语言', visibility:'标签页', clear:'全部清除', theme:'主题', light:'浅色', dark:'深色', timer:'计时器', start:'开始', pause:'暂停', reset:'重置', weatherLoc:'天气位置', whatsapp:'WhatsApp', youtube:'YouTube', autoLaunch:'自动启动', update:'更新', rhythmGlow: '节奏光晕', updVers: '当前版本:', updChan: '频道: 稳定版', updStatus: '系统状态', updIdle: '点击下方以检查最新版本。', updWait: '正在检查...', updErr: '网络错误', updRetry: '重试', updNew: '新版本', updDesc: '性能改进和错误修复。', updBtn: '立即下载', updSkip: '跳过', updLoad: '正在接收更新包...', updReady: '准备安装', updReadyDesc: '下载完成。重新启动 Notchly 以应用。', updInstall: '立即重启并安装' },
  };
  const t = T[lang] ?? T.es;

  // ── IPC listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    const ipc = (window as any).ipcRenderer;

    if (ipc) {
      ipc.invoke('get-app-version').then((v: string) => setCurrentVersion(v));
      ipc.send('set-ignore-mouse-events', true); // Estado inicial: ignorar
      ipc.invoke('get-current-media').then((d: any) => { if (d) setMedia(d); }).catch(() => {});
      ipc.invoke('get-volume').then((v: any) => { if (typeof v === 'number') setVolume(v); }).catch(() => {});
      ipc.on('media-update',   (_: any, d: any) => setMedia(d));
      ipc.on('notification-sync', (_: any, d: any) => {
        setNotifications(p => {
          const exists = p.find(n => n.id === d.id);
          if (exists) return p.map(n => n.id === d.id ? { ...n, ...d } : n);
          
          // Enhanced notification visibility
          setRecentNotif(d);
          setTimeout(() => setRecentNotif(null), 6000); // Show banner for 6s

          return [d, ...p.slice(0, 14)]; // Guardar hasta 15 recientes
        });
      });
      ipc.on('notification-remove', (_: any, id: string) => {
        setNotifications(p => p.filter(n => String(n.id) !== String(id)));
        setRecentNotif((current: any) => (current && String(current.id) === String(id)) ? null : current);
      });

      // Update System Listeners
      ipc.on('update-checking', () => {
        setUpdateInfo({ version: '...', status: 'checking' });
      });
      ipc.on('update-available', (_: any, info: any) => {
        setUpdateInfo({ version: info.version, status: 'available' });
        setNotifications(p => [{
          id: 999999,
          app: 'SISTEMA',
          text: `Nueva versión v${info.version} disponible.`
        }, ...p.filter(n => n.id !== 999999)]);
      });
      ipc.on('update-progress', (_: any, percent: number) => {
        setUpdateProgress(percent);
        setUpdateInfo(p => p ? { ...p, status: 'downloading' } : null);
      });
      ipc.on('update-ready', () => {
        setUpdateInfo(p => (p && p.status === 'downloading') ? { ...p, status: 'ready' } : p);
      });
      ipc.on('update-not-available', () => {
        setUpdateInfo(null);
      });
      ipc.on('update-error', (_: any, err: string) => {
        console.error('[UPDATER] Error:', err);
        setUpdateInfo({ version: '', status: 'error', error: err });
        setTimeout(() => setUpdateInfo(null), 5000); // Clear error after 5s
      });
      ipc.on('system-update',  (_: any, d: any) => setSystemInfo(d));
      ipc.on('weather-update', (_: any, d: any) => setWeather(d));
      ipc.on('network-status',  (_: any, d: any) => {
        if (d.wifi !== undefined) setWifiActive(d.wifi);
        if (d.bluetooth !== undefined) setBtActive(d.bluetooth);
      });
      ipc.send('set-weather-location', weatherCity);
    }

    (window as any).ipcRenderer?.on('meeting-update', (_: any, data: any) => {
      if (Date.now() - lastCommandTimeRef.current < 8000) return;
      setMeeting(data);
    });

    return () => {
      clearInterval(clock);
      if (ipc) {
        ipc.removeAllListeners('media-update');
        ipc.removeAllListeners('notification-sync');
        ipc.removeAllListeners('notification-remove');
        ipc.removeAllListeners('update-available');
        ipc.removeAllListeners('update-progress');
        ipc.removeAllListeners('update-ready');
        ipc.removeAllListeners('system-update');
        ipc.removeAllListeners('weather-update');
        ipc.removeAllListeners('volume-update');
        ipc.removeAllListeners('mouse-proximity');
        ipc.removeAllListeners('meeting-update');
        ipc.removeAllListeners('network-status');
        ipc.send('set-ignore-mouse-events', true);
      }
    };
  }, []);

  // Sync weather city with main process (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      (window as any).ipcRenderer?.send('set-weather-location', weatherCity);
      localStorage.setItem('weatherLocation', weatherCity);
    }, 1000);
    return () => clearTimeout(timer);
  }, [weatherCity]);

  // City Autocomplete Logic
  useEffect(() => {
    if (weatherCity.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (weatherCity === lastSelectedCity || !weatherCity || weatherCity.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(weatherCity)}&format=json&limit=5`, {
          headers: { 'User-Agent': 'Notchly-App' }
        });
        const data = await res.json();
        const names = data.map((x: any) => x.display_name).filter(Boolean);
        setSuggestions(names);
        setShowSuggestions(names.length > 0);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce for API search
    return () => clearTimeout(timer);
  }, [weatherCity]);

  // Auto-close settings on mouse leave and track collapse state
  useEffect(() => {
    if (!isHovered && !isPinned && showSettings) setShowSettings(false);
    
    if (isExpanded && activeView) {
      setVisitedViews(prev => {
        if (prev.has(activeView)) return prev;
        const next = new Set(prev);
        next.add(activeView);
        return next;
      });
    }

    // If we transition from expanded to collapsed, set a "collapsing" flag
    if (!isExpanded) {
      setIsCollapsing(true);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsCollapsing(false);
        setIsTransitioning(false);
      }, 400); // Wait for sync
      return () => clearTimeout(timer);
    } else {
      setIsCollapsing(false);
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 400); 
      return () => clearTimeout(timer);
    }
  }, [isHovered, isPinned, showSettings, isExpanded, activeView]);

  // Sync weather location to localStorage
  useEffect(() => {
    if (weatherCity) localStorage.setItem('weatherLocation', weatherCity);
  }, [weatherCity]);

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
    const ipc = (window as any).ipcRenderer;
    const isLarge = isHovered || isPinned || showSettings;
    const totalW = (showSettings ? 720 : isLarge ? (activeView === 'Multimedia' && showPreview ? 840 : (['WhatsApp', 'YouTube'].includes(activeView) ? 800 : 680)) : (superPill ? 72 : 440)) + 68;
    const totalH = showSettings ? 480 : isLarge ? (['Herramientas', 'Llamada', 'WhatsApp', 'YouTube'].includes(activeView) ? 600 : 180) : (superPill ? 42 : 66);
    
    ipc?.send('set-window-dimensions', { w: totalW, h: totalH });
    ipc?.send('set-is-expanded', isExpanded);
    ipc?.send('set-is-super-pill', superPill && !isExpanded);
    ipc?.send('set-bubbles-state', { 
      call: meeting.isActive && !isLarge, 
      controls: showControlsBubble && !isLarge 
    });
  }, [isExpanded, superPill, activeView, isHovered, isPinned, showSettings, showPreview, meeting.isActive, showControlsBubble]);


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

  // ── Helpers ──────────────────────────────────────────────────────────────
  const handleMeetingCommand = (cmd: string) => {
    lastCommandTimeRef.current = Date.now();
    if (cmd === 'toggleMic') setMeeting(p => ({ ...p, micActive: !p.micActive }));
    if (cmd === 'toggleCam') setMeeting(p => ({ ...p, camActive: !p.camActive }));
    (window as any).ipcRenderer?.invoke('meeting-command', cmd);
  };
  const openApp   = (app: string) => (window as any).ipcRenderer?.invoke('open-app', app);
  const toggleTab = (tab: string) => setVisibleTabs(p => p.includes(tab) ? p.filter(x => x !== tab) : [...p, tab]);
  const handleReorder = (newOrder: any[]) => {
    setTabOrder(newOrder);
    localStorage.setItem('tabOrder', JSON.stringify(newOrder));
  };
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

  // ── Reactive State Derived ────────────────────────────────────────────────

  // Wing/body colors must match exactly for seamless look
  const WING_R   = 34;
  const showTimerBubble = timerTime > 0 && !isExpanded;
  const showNotifBubble = notifications.length > 0 && !isExpanded;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-[999] px-[50px] pb-[50px]">
      <div className="relative flex items-start justify-center">
        {/* Call / Control Bubbles — Left side (Outside Body to prevent hover triggers) */}
        <motion.div 
          style={{ x: islandX }}
          className="absolute right-full mr-4 top-1 flex flex-row-reverse items-center gap-3 pointer-events-none z-[1001]"
        >
          <AnimatePresence>
            {meeting.isActive && !isExpanded && (
              <div 
                className="pointer-events-auto"
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

              {showControlsBubble && !isExpanded && (
                <div 
                  className="pointer-events-auto"
                  onMouseEnter={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', false)}
                  onMouseLeave={() => {
                    if (!isHovered) (window as any).ipcRenderer?.send('set-ignore-mouse-events', true);
                  }}
                >
                  <ControlCenterBubble 
                    key="controls"
                    wifiActive={wifiActive}
                    btActive={btActive}
                    volume={volume}
                    onToggleWifi={() => {
                      setWifiActive(!wifiActive);
                      (window as any).ipcRenderer?.invoke('toggle-wifi');
                    }}
                    onToggleBt={() => {
                      setBtActive(!btActive);
                      (window as any).ipcRenderer?.invoke('toggle-bluetooth');
                    }}
                    onVolumeChange={(v) => {
                      setVol(v);
                    }}
                  />
                </div>
              )}
          </AnimatePresence>
        </motion.div>

        {/* ── Island body ── */}
        <motion.div
          drag="x"
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{ left: -2000, right: 2000 }}
          dragElastic={0}
          dragMomentum={false}
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
          className="relative pointer-events-auto cursor-default"
          style={{
            x: islandX,
            overflow: 'visible',
            color: isLightMode ? '#111' : '#fff',
            willChange: 'width, height, transform',
          }}
          animate={{
            width: (showSettings ? 720 : (isHovered || isPinned) ? (showPreview && activeView === 'Multimedia' ? 840 : (['WhatsApp', 'YouTube'].includes(activeView) ? 800 : 680)) : (superPill ? 72 : 440)) + 68,
            height: showSettings ? 480 : (isHovered || isPinned) ? (['Herramientas', 'Llamada', 'WhatsApp', 'YouTube'].includes(activeView) ? 600 : (activeView === 'Actualización' ? 450 : (activeView === 'Sistema' ? 300 : 180))) : (superPill ? 42 : 66),
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
        >
        {/* UNIFIED BACKGROUND SVG LAYER — Production Fix & Subtle Drop */}
        <div className="absolute inset-0 pointer-events-none z-[-1] overflow-visible">
          <svg width="100%" height="100%" shapeRendering="geometricPrecision" style={{ display: 'block', overflow: 'visible' }}>

             {(() => {
                const isLarge = showSettings || isExpanded;
                const isPreview = showPreview && activeView === 'Multimedia';
                const w = (showSettings ? 720 : isExpanded ? (isPreview ? 840 : (['WhatsApp', 'YouTube'].includes(activeView) ? 800 : 680)) : (superPill ? 72 : 440));
                const h_base = showSettings ? 480 : isExpanded ? (['Herramientas', 'Llamada', 'WhatsApp', 'YouTube'].includes(activeView) ? 600 : (activeView === 'Actualización' ? 450 : (activeView === 'Sistema' ? 300 : 180))) : (superPill ? 42 : 66);
                const h = (superPill && !isLarge) ? (h_base + (musicIntensity || 0) * 4) : h_base;
                const totalW = w + 68;
                const neck = 42;

                // Shared Geometry Logic
                const islandD = (superPill && !isLarge) 
                  ? `M 0 0 C ${neck} 0, ${neck} ${h}, ${totalW/2} ${h} S ${totalW-neck} 0, ${totalW} 0 Z`
                  : (() => {
                      const r = 34;
                      return `M 0 0 A ${r} ${r} 0 0 1 ${r} ${r} V ${h-r} A ${r} ${r} 0 0 0 ${r*2} ${h} H ${totalW-(r*2)} A ${r} ${r} 0 0 0 ${totalW-r} ${h-r} V ${r} A ${r} ${r} 0 0 1 ${totalW} 0 Z`;
                    })();

                return (

                  <>
                    <motion.path
                      initial={false}
                      animate={{ d: islandD }}
                      fill={isLightMode ? '#fdfdfd' : '#0a0a0a'}
                      stroke={isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'}
                      strokeWidth="0.5"
                      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
                    />

                    {/* ── QUANTUM PULSE AURA (Innovative Rhythm System) ── */}
                    <AnimatePresence>
                      {superPill && !isLarge && media.isPlaying && showAura && (() => {
                        const mi = musicIntensity || 0;
                        const bp = beatPulse || 0;
                        const defH = h + bp * 24; // React relative to body height
                        const spineD = `M 0 0 C ${neck} 0, ${neck} ${defH}, ${totalW/2} ${defH + bp*6} S ${totalW-neck} 0, ${totalW} 0`;
                        const auraD  = `M 0 0 C ${neck-2} -2, ${neck-2} ${defH+8}, ${totalW/2} ${defH+14} S ${totalW-neck+2} -2, ${totalW} 0`;

                        return (
                          <g key="quantum-pulse-system">
                            <motion.path
                              d={auraD}
                              fill="none"
                              stroke="url(#rgQuantum)"
                              strokeLinecap="round"
                              animate={{
                                strokeWidth: 1.5 + mi * 3.5 + bp * 5,
                                opacity: 0.1 + mi * 0.1 + bp * 0.2,
                              }}
                              transition={{ type: 'spring', stiffness: 800, damping: 35 }}
                              style={{ filter: `blur(${2.5 + mi * 3 + bp * 5}px)`, mixBlendMode: 'screen', pointerEvents: 'none' }}
                            />
                            {[1, 1.04, 1.08].map((scale, i) => (
                              <motion.path
                                key={i}
                                d={spineD}
                                fill="none"
                                stroke="url(#rgPulse)"
                                strokeLinecap="round"
                                strokeWidth={0.5 + bp * 2}
                                animate={{
                                  opacity: (0.4 - i * 0.1) + mi * 0.4 + bp * 0.6,
                                  scaleX: scale,
                                  scaleY: scale,
                                }}
                                transition={{ type: 'spring', stiffness: 800, damping: 40 }}
                                style={{ transformOrigin: 'center top', filter: i === 0 ? 'none' : 'blur(2px)', pointerEvents: 'none' }}
                              />
                            ))}
                            {[0.2, 0.5, 0.8].map((offset, i) => (
                              <motion.circle
                                key={`p-${i}`}
                                r={1 + bp * 3}
                                fill="#fff"
                                animate={{
                                  offsetDistance: [`${offset * 100}%`, `${(offset * 100 + (30 + bp * 50)) % 100}%`],
                                  opacity: [0, 0.9, 0],
                                }}
                                transition={{ duration: 1.0 / (1 + bp * 2), repeat: Infinity, ease: "linear" }}
                                style={{ offsetPath: `path("${spineD}")`, filter: 'drop-shadow(0 0 4px #fff)', pointerEvents: 'none' }}
                              />
                            ))}
                          </g>
                        );
                      })()}
                    </AnimatePresence>
                  </>
                );
              })()}


              <defs>
                <linearGradient id="rgQuantum" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="30%" stopColor="#c084fc" />
                  <stop offset="70%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#06b6d4" />
                  <animate attributeName="x1" values="0%;-100%;0%" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="x2" values="100%;200%;100%" dur="3s" repeatCount="indefinite" />
                </linearGradient>
                <linearGradient id="rgPulse" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#38bdf8" />
                  <animate attributeName="x1" values="-50%;150%;-50%" dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="x2" values="0%;200%;0%" dur="1.2s" repeatCount="indefinite" />
                </linearGradient>
                <radialGradient id="rgSpark">
                  <stop offset="10%" stopColor="white" />
                  <stop offset="90%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
              </defs>
           </svg>
           <div className="absolute inset-0 z-[-2] rounded-[34px]" style={{ backdropFilter: 'blur(24px)', background: 'transparent' }} />
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
          {superPill && !isCollapsing ? (
            <div className="flex items-center justify-center w-full h-full" onPointerDown={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                {recentNotif && !isExpanded ? (
                  <motion.div 
                    key="notif-banner"
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full"
                  >
                    <Bell className="w-3 h-3 text-blue-400 animate-bounce" />
                    <span className="text-[10px] font-black text-white truncate max-w-[140px]">{recentNotif.text}</span>
                  </motion.div>
                ) : (
                  <>
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
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full px-4 h-full">
              
              {/* --- COLLAPSED: MODERNO --- */}
              {summaryTemplate === 'Moderno' && (
                <>
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
                  <div className="flex items-center gap-4 mr-3">
                    <AnimatePresence mode="wait">
                      {recentNotif && !isExpanded ? (
                        <motion.div 
                          key="pill-notif"
                          initial={{ x: 10, opacity: 0 }} 
                          animate={{ x: 0, opacity: 1 }} 
                          exit={{ x: -10, opacity: 0 }}
                          className="flex items-center gap-2 px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded-full"
                        >
                          <Bell className="w-2.5 h-2.5 text-blue-400 animate-pulse" />
                          <span className="text-[9px] font-black text-white truncate max-w-[100px] uppercase">{recentNotif.app}</span>
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-4">
                          {media.isPlaying && <SoundVisualizer isPlaying={media.isPlaying} bars={visualizerBars} />}
                          <div className={clsx('flex items-center gap-1 py-0.5 px-2 rounded-full border text-[9px] font-black', isLightMode ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10')}>
                            <Cloud className="w-3 h-3 text-blue-400" />
                            <span className="tracking-tight">{weather.temp}°</span>
                            <span className="ml-1 opacity-40 font-bold">{weather.city}</span>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                    <div className="flex items-center gap-1 font-black text-[12px] tracking-tighter" style={{ opacity: 0.35 }}>
                      <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                      <span className="text-[7px] uppercase font-mono">{currentTime.getHours() >= 12 ? 'PM' : 'AM'}</span>
                    </div>
                  </div>
                </>
              )}

              {/* --- COLLAPSED: MÍNIMO (Just icons and clock) --- */}
              {summaryTemplate === 'Mínimo' && (
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-zinc-900 shrink-0">
                       {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-4 h-4 m-auto opacity-10" />}
                    </div>
                    <SoundVisualizer isPlaying={media.isPlaying} bars={visualizerBars} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[18px] font-black tracking-[-0.05em] text-blue-400">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    <span className="text-[8px] font-black opacity-20 uppercase tracking-widest">
                       {currentTime.getHours() >= 12 ? 'PM' : 'AM'}
                    </span>
                  </div>
                </div>
              )}

              {/* --- COLLAPSED: CLÁSICO (Ticker-style text) --- */}
              {summaryTemplate === 'Clásico' && (
                <div className="flex-1 flex items-center gap-4 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-zinc-950 shrink-0">
                     {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-4 h-4 m-auto opacity-10" />}
                  </div>
                  <div className="flex-1 flex items-baseline gap-2 overflow-hidden">
                    <span className="text-[13px] font-black whitespace-nowrap">{media.isPlaying ? media.title : 'Sistema Activo'}</span>
                    <span className="text-[10px] font-bold opacity-30 truncate uppercase">{media.isPlaying ? `- ${media.artist}` : '- Todo en orden'}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {media.isPlaying && <SoundVisualizer isPlaying={media.isPlaying} bars={visualizerBars} />}
                    <Cloud className="w-3.5 h-3.5 text-blue-400 opacity-50" />
                    <span className="text-[13px] font-black tabular-nums">{weather.temp}°</span>
                  </div>
                </div>
              )}

            </div>
          )}
        </motion.div>

        {/* ── EXPANDED PANEL ── */}
        <motion.div
          animate={{ opacity: isExpanded && !showSettings ? 1 : 0 }}
          className={clsx('absolute inset-0 flex flex-col pt-2.5 px-4 pb-2', (!isExpanded || showSettings) && 'pointer-events-none')}
          onPointerDown={(e) => {
             // Only start drag if clicking the background, not a button/input/webview/no-drag zone
             const target = e.target as HTMLElement;
             if (
               target.tagName !== 'BUTTON' &&
               target.tagName !== 'INPUT' &&
               target.tagName !== 'WEBVIEW' &&
               !target.closest('.no-drag')
             ) {
               dragControls.start(e);
             }
          }}
        >
          <div className={clsx('flex items-center justify-between mb-2 pb-2 border-b shrink-0 z-50', isLightMode ? 'border-black/5' : 'border-white/5')}>
            <div 
              className="flex-1 flex gap-1 items-center overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap" 
              style={{ 
                maskImage: 'linear-gradient(to right, black 95%, transparent 100%)', 
                WebkitMaskImage: 'linear-gradient(to right, black 95%, transparent 100%)' 
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
            >
              {tabOrder.map(v =>
                visibleTabs.includes(v) && (
                  <button
                    key={v}
                    onClick={() => setActiveView(v as any)}
                    className={clsx(
                      'px-3 py-1 rounded-full text-[9.5px] font-black flex items-center gap-1 transition-all uppercase whitespace-nowrap shrink-0',
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
                    {v === 'WhatsApp'     && <MessageCircle className="w-2.5 h-2.5" />}
                    {v === 'Actualización' && <Download className="w-2.5 h-2.5" />}
                    {v === 'YouTube'      && (
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )}
                    {t[v === 'Notificación' ? 'notificacion' : (v === 'WhatsApp' ? 'whatsapp' : (v === 'YouTube' ? 'youtube' : (v === 'Herramientas' ? 'timer' : (v === 'Actualización' ? 'update' : v.toLowerCase()))))] || v}
                  </button>
                )
              )}
            </div>
            <div className="flex items-center gap-2.5 shrink-0 px-2">
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
            {/* RESUMEN — supports 3 different templates (diseños) */}
            {activeView === 'Resumen' && (
              <div className="absolute inset-0 flex items-stretch">
                
                {/* --- TEMPLATE: MODERNO (Existing 3-column Layout) --- */}
                {summaryTemplate === 'Moderno' && (
                  <>
                    {/* Col 1: Music — large album art + info + controls */}
                    <div className="flex items-center gap-3 px-4 border-r shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)', width: 260 }}>
                      <div onDoubleClick={() => openApp('Spotify')} className="w-[90px] h-[90px] rounded-[22px] overflow-hidden shrink-0 border border-white/10 bg-zinc-900 relative shadow-2xl cursor-pointer hover:scale-105 transition-transform">
                        {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-9 h-9 m-auto opacity-10" />}
                        <div className="absolute -bottom-1 -right-1 bg-[#fc3c44] w-7 h-7 rounded-full flex items-center justify-center border-2 border-black shadow-lg"><Music className="w-3 h-3 text-white" /></div>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 text-left gap-0.5">
                        <span className="text-[14px] font-black truncate tracking-tight leading-tight">{media.title}</span>
                        <span className="text-[10px] font-bold truncate" style={{ opacity: 0.45 }}>{media.artist}</span>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'prev')}      className="hover:scale-110 transition-all outline-none opacity-40">
                            <SkipBack className="w-4 h-4" />
                          </button>
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'playPause')} className="w-7 h-7 hover:scale-110 transition-all outline-none">
                            {media.isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                          </button>
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'next')}      className="hover:scale-110 transition-all outline-none opacity-40">
                            <SkipForward className="w-4 h-4" />
                          </button>
                        </div>
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

                    {/* Col 2: Week calendar */}
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
                      const viewMonth = targetDate.toLocaleString(lang === 'zh' ? 'zh-CN' : lang, { month: 'short' });
                      
                      return (
                        <div className="flex-1 flex flex-col justify-center px-5 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-baseline gap-2 font-black">
                              <span className="text-[22px] tracking-tighter leading-none" style={{ opacity: 0.9 }}>{viewMonth}</span>
                              <span className="text-[12px] text-blue-400 font-mono font-black">{calendarOffset === 0 ? todayNum : ''}</span>
                            </div>
                            <div className="flex items-center gap-1 no-drag pointer-events-auto">
                              <button onClick={(e) => { e.stopPropagation(); setCalendarOffset(p => p - 1); }} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                                <ChevronLeft className="w-3.5 h-3.5 text-blue-400 opacity-60" />
                              </button>
                              {calendarOffset !== 0 && (
                                <button onClick={(e) => { e.stopPropagation(); setCalendarOffset(0); }} className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase bg-blue-500/20 text-blue-400">Hoy</button>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); setCalendarOffset(p => p + 1); }} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
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
                                <button key={i} onClick={(e) => { e.stopPropagation(); setSelectedDay(isSel ? null : new Date(d)); }} className="flex flex-col items-center gap-0.5 outline-none no-drag pointer-events-auto">
                                  <span className="text-[7.5px] font-black uppercase" style={{ opacity: isToday ? 1 : 0.3, color: isWeekend && !isToday ? 'rgba(255,100,100,0.7)' : 'inherit' }}>{dayAbbr[i]}</span>
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all" style={{ background: isToday ? '#3b82f6' : isSel ? 'rgba(255,255,255,0.15)' : 'transparent', color: isToday ? '#fff' : 'inherit', opacity: isToday || isSel ? 1 : 0.4, boxShadow: isToday ? '0 0 10px rgba(59,130,246,0.5)' : 'none' }}>
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
                      <div className="w-14 h-14 rounded-full flex items-center justify-center relative cursor-pointer hover:scale-105 transition-transform" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setActiveView('Notificación')}>
                        <Bell className="w-6 h-6" style={{ opacity: 0.5 }} />
                        {notifications.length > 0 && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 10px rgba(59,130,246,0.6)' }}>
                            {notifications.length > 9 ? '9+' : notifications.length}
                          </div>
                        )}
                      </div>
                      <span className="text-[7.5px] font-black uppercase tracking-widest" style={{ opacity: 0.25 }}>Alertas</span>
                    </div>
                  </>
                )}

                {/* --- TEMPLATE: MÍNIMO (Sleek, minimalist with big clock) --- */}
                {summaryTemplate === 'Mínimo' && (
                   <div className="flex-1 flex items-center px-12 gap-12">
                     {/* Left: Compact Music Info */}
                     <div className="flex items-center gap-4 min-w-0 max-w-[40%]">
                       <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-[20px] overflow-hidden shrink-0 border border-white/10 bg-zinc-900 relative shadow-xl">
                         {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-6 h-6 m-auto opacity-10" />}
                       </motion.div>
                       <div className="flex flex-col min-w-0 text-left">
                         <span className="text-[15px] font-black truncate tracking-tight">{media.title}</span>
                         <span className="text-[10px] font-bold opacity-30 truncate uppercase tracking-widest">{media.artist}</span>
                         <div className="flex items-center gap-4 mt-2">
                            <button onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'playPause')} className="opacity-60 hover:opacity-100 transition-opacity">
                              {media.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                            </button>
                            <SoundVisualizer isPlaying={media.isPlaying} bars={visualizerBars} />
                         </div>
                       </div>
                     </div>

                     {/* Divider (Gradient line) */}
                     <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                     {/* Right: Large Elegant Clock & Date */}
                     <div className="flex-1 flex flex-col items-start">
                        <div className="flex items-baseline gap-3">
                          <span className="text-[42px] font-black tracking-[-0.05em] leading-none text-blue-400">
                             {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </span>
                          <span className="text-[12px] font-black opacity-30 uppercase tracking-[0.3em]">
                             {currentTime.getHours() >= 12 ? 'PM' : 'AM'}
                          </span>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-500 mt-1 pl-1">
                           {currentTime.toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang, { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                     </div>
                   </div>
                )}

                {/* --- TEMPLATE: CLÁSICO (Notification-style row) --- */}
                {summaryTemplate === 'Clásico' && (
                  <div className="flex-1 flex items-center px-10 gap-8">
                    {/* Art on the left */}
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-24 h-24 rounded-[28px] overflow-hidden shrink-0 border border-white/10 bg-zinc-900 shadow-2xl">
                       {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-10 h-10 m-auto opacity-10" />}
                    </motion.div>
                    
                    {/* Large info center-right */}
                    <div className="flex-1 flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Música</span>
                        <span className="text-[9px] font-black opacity-20 uppercase tracking-[0.2em]">{media.isPlaying ? 'Reproduciendo' : 'Pausado'}</span>
                      </div>
                      <span className="text-[24px] font-black tracking-tight leading-tight truncate w-full text-left">{media.title}</span>
                      <span className="text-[14px] font-bold opacity-40 leading-none truncate w-full text-left">{media.artist}</span>
                      
                      <div className="flex items-center gap-8 mt-4">
                        <button onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'prev')} className="opacity-30 hover:opacity-100 transition-all hover:scale-110">
                          <SkipBack className="w-5 h-5" />
                        </button>
                        <button onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'playPause')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all hover:scale-105 active:scale-95 shadow-lg">
                          {media.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                        </button>
                        <button onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'next')} className="opacity-30 hover:opacity-100 transition-all hover:scale-110">
                          <SkipForward className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Right side: weather summary */}
                    <div className="flex flex-col items-end gap-1 px-4 border-l border-white/5">
                       <span className="text-[28px] font-black tracking-tighter">{weather.temp}°</span>
                       <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30">{weather.condition}</span>
                       <Cloud className="w-6 h-6 text-blue-400 mt-1" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SISTEMA — Compact Controls (v5.5.1) */}
            {activeView === 'Sistema' && (
              <div className="absolute inset-0 flex flex-col justify-center px-8 gap-3">
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'CPU', val: systemInfo.cpu,      col: 'bg-blue-500',    icon: <Cpu       className="w-3 h-3 text-blue-400"   /> },
                    { label: 'RAM', val: systemInfo.ram,      col: 'bg-purple-500',  icon: <HardDrive className="w-3 h-3 text-purple-400" /> },
                    { label: 'NET', val: systemInfo.net * 10, col: 'bg-emerald-500', icon: <Activity  className="w-3 h-3 text-emerald-400"/> },
                  ].map(s => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center px-1 font-black uppercase text-[8.5px]">
                        <div className="flex items-center gap-2 opacity-60 font-black">{s.icon} {s.label}</div>
                        <span className="font-mono opacity-40">{Math.round(s.val)}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.val}%` }} className={clsx('h-full', s.col)} transition={{ type: 'spring', stiffness: 100, damping: 20 }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-2 no-drag">
                  <button 
                    onClick={(e) => { e.stopPropagation(); (window as any).ipcRenderer?.send('toggle-wifi'); }}
                    className={clsx(
                      "flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-[20px] border transition-all duration-300 no-drag",
                      wifiActive ? "bg-blue-600/10 border-blue-500/20 text-blue-400" : "bg-white/5 border-transparent text-white/20"
                    )}
                  >
                    {wifiActive ? <Wifi className="w-5 h-5 shadow-blue-500/50" /> : <WifiOff className="w-5 h-5 text-white/20" />}
                    <span className="text-[8px] font-black uppercase tracking-widest">{wifiActive ? 'WiFi' : 'Off'}</span>
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); (window as any).ipcRenderer?.send('toggle-bluetooth'); }}
                    className={clsx(
                      "flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-[20px] border transition-all duration-300 no-drag",
                      btActive ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400" : "bg-white/5 border-transparent text-white/20"
                    )}
                  >
                    <Bluetooth className={clsx("w-5 h-5", btActive ? "text-indigo-400" : "text-white/20")} />
                    <span className="text-[8px] font-black uppercase tracking-widest">{btActive ? 'BT' : 'Off'}</span>
                  </button>
                </div>
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
                  {!showPreview && <SoundVisualizer isPlaying={media.isPlaying} bars={visualizerBars} />}
                </div>

                {/* Centro: Info de pista + Controles principales */}
                <div className="flex-1 flex flex-col items-start justify-center px-8 gap-1.5 min-w-0">
                  <motion.div layout className="flex flex-col w-full text-left">
                    <span className="text-[16px] font-black truncate w-full tracking-tighter leading-none">{media.title}</span>
                    <span className="text-[11px] font-bold truncate w-full mt-1" style={{ opacity: 0.4 }}>{media.artist}</span>
                  </motion.div>
                  
                  <div className="flex items-center gap-6 mt-3">
                    <button 
                      onClick={() => (window as any).ipcRenderer?.send('media-command', 'prev')}      
                      className="hover:scale-125 transition-all opacity-40 hover:opacity-100"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button      
                      onClick={() => (window as any).ipcRenderer?.send('media-command', 'playPause')} 
                      className="w-12 h-12 rounded-full flex items-center justify-center border outline-none hover:scale-105 active:scale-95 transition-all shadow-xl bg-white/5 border-white/10"
                    >
                      {media.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <button 
                      onClick={() => (window as any).ipcRenderer?.send('media-command', 'next')}      
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
                  <button onClick={() => {
                    (window as any).ipcRenderer?.send('clear-all-notifications');
                    setNotifications([]);
                  }} className="text-[9px] font-black text-red-500 flex items-center gap-1.5 uppercase">
                    <Trash2 className="w-3 h-3" /> {t.clear}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 px-1 pb-1">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} onClick={() => {
                      (window as any).ipcRenderer?.send('dismiss-notification', n.id);
                      if (n.app === 'WhatsApp' && visibleTabs.includes('WhatsApp')) {
                        setActiveView('WhatsApp');
                        setIsPinned(true);
                      }
                      setNotifications(p => p.filter(x => x.id !== n.id));
                    }} className="rounded-[16px] border p-3 flex items-center gap-3 cursor-pointer transition-all hover:!bg-white/10" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0"><Bell className="w-4 h-4" /></div>
                      <div className="text-left min-w-0">
                        <span className="text-[9px] font-black text-blue-500 uppercase">{n.app}</span>
                        <p className="text-[12px] font-bold opacity-90 leading-tight truncate">{n.text}</p>
                        {n.id === 999999 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              (window as any).ipcRenderer?.send('start-update-download');
                              setActiveView('Actualización');
                              setNotifications(p => p.filter(x => x.id !== 999999));
                            }}
                            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-lg"
                          >
                            Actualizar Ahora
                          </button>
                        )}
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

            {/* WHATSAPP — display:none when inactive to remove native compositor layer */}
            <div
              className="absolute inset-0 flex flex-col"
              style={{ display: activeView === 'WhatsApp' ? 'flex' : 'none' }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseEnter={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', false)}
            >
              <div className={clsx("flex-1 rounded-[34px] overflow-hidden border border-white/5 bg-black relative flex flex-col transition-opacity", isTransitioning && "opacity-20 pointer-events-none")}>
                {(window as any).ipcRenderer && visitedViews.has('WhatsApp') && (
                  <webview
                    ref={whatsappWebviewRef}
                    src="https://web.whatsapp.com"
                    className={clsx("flex-1 w-full", activeView !== 'WhatsApp' && "invisible absolute")}
                    useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                    style={{ width: '100%', height: 'calc(100% + 50px)', marginTop: '-50px' }}
                    partition="persist:whatsapp"
                  />
                )}
                {activeView !== 'WhatsApp' && visitedViews.has('WhatsApp') && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md">
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">En Suspensión</span>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute top-0 right-0 p-4 pointer-events-none">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-green-400 tracking-widest px-1">WhatsApp Secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* YOUTUBE MINI-EXPLORER — display:none when inactive to remove native compositor layer */}
            <div
              className="absolute inset-0 flex flex-col"
              style={{ display: activeView === 'YouTube' ? 'flex' : 'none' }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseEnter={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', false)}
            >
              <div className={clsx("flex-1 rounded-[20px] overflow-hidden border border-red-500/10 bg-black relative flex flex-col shadow-2xl transition-opacity", isTransitioning && "opacity-20 pointer-events-none")}>
                {/* Minimal YouTube toolbar — quick shortcuts only */}
                <div className="flex items-center gap-2 px-3 py-1.5 shrink-0 bg-black/80 backdrop-blur-xl border-b border-white/5">
                  {/* Logo → home */}
                  <button
                    onClick={() => { youtubeWebviewRef.current?.loadURL('https://www.youtube.com'); }}
                    className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                    title="Inicio"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#ff0000">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </button>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Quick nav */}
                  <button
                    onClick={() => { youtubeWebviewRef.current?.loadURL('https://music.youtube.com'); }}
                    className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter text-red-400 border border-red-500/20 bg-red-500/10 hover:bg-red-500/25 transition-all shrink-0"
                  >
                    YT Music
                  </button>
                  <button
                    onClick={() => { youtubeWebviewRef.current?.loadURL('https://www.youtube.com/feed/subscriptions'); }}
                    className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter text-white/30 border border-white/8 bg-white/5 hover:bg-white/10 transition-all shrink-0"
                  >
                    Subs
                  </button>
                  <button
                    onClick={() => { youtubeWebviewRef.current?.loadURL('https://www.youtube.com/trending'); }}
                    className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter text-white/30 border border-white/8 bg-white/5 hover:bg-white/10 transition-all shrink-0"
                  >
                    Trending
                  </button>
                </div>

                {/* Webview — full remaining height so YouTube's native header+search are fully visible */}
                {(window as any).ipcRenderer && visitedViews.has('YouTube') && (
                  <webview
                    ref={youtubeWebviewRef}
                    src="https://www.youtube.com"
                    className={clsx("w-full flex-1", activeView !== 'YouTube' && "invisible absolute")}
                    useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                    style={{ width: '100%', height: 'calc(100% - 33px)' }}
                    partition="persist:youtube"
                  />
                )}
                {activeView !== 'YouTube' && visitedViews.has('YouTube') && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md">
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">En Suspensión</span>
                  </div>
                )}

                {/* Status badge */}
                <div className="absolute top-10 right-0 p-3 pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/70 border border-red-500/20 rounded-full backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[7px] font-black uppercase text-red-400 tracking-widest">Streaming</span>
                  </div>
                </div>
              </div>
            </div>

            {activeView === 'Actualización' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="absolute inset-0 flex flex-col gap-4 p-8 pointer-events-auto"
                onMouseEnter={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', false)}
              >
                <div className="flex justify-between items-center px-2 shrink-0">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-black uppercase tracking-[0.3em] text-blue-500">Notchly Update</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isLightMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }}>{t.updVers}</span>
                      <span className="text-[10px] font-black" style={{ color: isLightMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)' }}>v{currentVersion}</span>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <span className="text-[11px] font-black text-blue-400 uppercase tracking-tighter">{t.updChan}</span>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-center items-center gap-6 text-center px-10">
                  {(!updateInfo || updateInfo.status === 'idle') ? (
                    <>
                      <div className="w-24 h-24 rounded-[38px] bg-blue-500/5 flex items-center justify-center text-blue-500/30 mb-2 border border-blue-500/10 relative overflow-hidden group">
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 opacity-10"
                        >
                          <Settings className="w-full h-full p-4" />
                        </motion.div>
                        <CheckSquare className="w-10 h-10 text-blue-400 shadow-xl" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[20px] font-black tracking-tight uppercase tracking-widest">
                          {!updateInfo ? t.updStatus : t.resumen}
                        </span>
                        <p className="text-[11px] leading-relaxed font-bold uppercase max-w-[280px]" style={{ color: isLightMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }}>
                          {!updateInfo 
                            ? t.updIdle
                            : t.resumen
                          }
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          setUpdateInfo({ version: '...', status: 'checking' });
                          (window as any).ipcRenderer?.send('check-for-updates');
                        }}
                        className="px-8 py-3 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest border border-blue-500/20 no-drag mt-2"
                      >
                         {t.update}
                      </button>
                    </>
                  ) : (
                    <>
                      {updateInfo.status === 'checking' && (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 flex items-center justify-center">
                            <Activity className="w-12 h-12 text-blue-400 animate-pulse" />
                          </div>
                          <span className="text-[12px] font-black uppercase tracking-widest text-blue-400/60 animate-bounce">{t.updWait}</span>
                        </div>
                      )}

                      {updateInfo.status === 'error' && (
                        <div className="flex flex-col items-center gap-4 text-center">
                          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                             <Trash2 className="w-10 h-10 text-red-500" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[14px] font-black text-red-400 uppercase tracking-widest">{t.updErr}</span>
                            <p className="text-[9px] uppercase font-bold max-w-[300px]" style={{ color: isLightMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}>{updateInfo.error || t.updErr}</p>
                          </div>
                          <button 
                            onClick={() => setUpdateInfo(null)}
                            className="mt-4 px-6 py-2 bg-white/5 text-[10px] font-black uppercase rounded-xl border border-white/5 no-drag"
                            style={{ 
                              background: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                              borderColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'
                            }}
                          >
                            {t.updRetry}
                          </button>
                        </div>
                      )}

                      {updateInfo.status === 'available' && (
                        <>
                          <div className="w-20 h-20 rounded-[30px] bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2 border border-blue-400/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                            <Download className="w-10 h-10" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-center gap-2 mb-1">
                               <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[8px] font-black rounded uppercase">{t.updNew}</span>
                               <span className="text-[18px] font-black tracking-tight tracking-widest uppercase" style={{ color: isLightMode ? '#000' : '#fff' }}>v{updateInfo.version}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed font-bold uppercase max-w-[320px]" style={{ color: isLightMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }}>{t.updDesc}</p>
                          </div>
                          <div className="flex gap-4 w-full mt-2">
                             <button 
                                onClick={() => (window as any).ipcRenderer?.send('start-update-download')}
                                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] text-[11px] font-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 uppercase tracking-widest no-drag"
                              >
                                <Download className="w-4 h-4" /> {t.updBtn}
                              </button>
                              <button 
                                onClick={() => setUpdateInfo(null)}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-[24px] text-[11px] font-black uppercase tracking-widest no-drag"
                                style={{
                                  background: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                                  color: isLightMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)'
                                }}
                              >
                                {t.updSkip}
                              </button>
                          </div>
                        </>
                      )}
                      
                      {updateInfo.status === 'downloading' && (
                        <div className="flex flex-col gap-6 w-full items-center px-4">
                          <div className="relative w-24 h-24">
                             <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                               <circle cx="50" cy="50" r="45" fill="none" stroke={isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} strokeWidth="8" />
                               <motion.circle 
                                 cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8"
                                 strokeDasharray={2 * Math.PI * 45}
                                 animate={{ strokeDashoffset: (2 * Math.PI * 45) * (1 - updateProgress / 100) }}
                                 style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }}
                               />
                             </svg>
                             <div className="absolute inset-0 flex items-center justify-center flex-col">
                               <span className="text-[18px] font-black tabular-nums">{Math.round(updateProgress)}%</span>
                               <span className="text-[7px] font-black uppercase text-blue-400">Loading</span>
                             </div>
                          </div>
                          <div className="flex flex-col gap-2 items-center">
                            <span className="text-[14px] font-black uppercase tracking-[0.2em] text-blue-500">{t.updLoad}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: isLightMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}>{t.updGitHub}</span>
                          </div>
                        </div>
                      )}
                      
                      {updateInfo.status === 'ready' && (
                        <>
                          <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="w-24 h-24 rounded-[38px] bg-green-500/10 flex items-center justify-center text-green-400 mb-2 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]"
                          >
                            <RotateCcw className="w-12 h-12" />
                          </motion.div>
                          <div className="flex flex-col gap-2">
                            <span className="text-[20px] font-black tracking-tight text-green-400 uppercase tracking-widest">{t.updReady}</span>
                            <p className="text-[11px] leading-relaxed font-bold uppercase max-w-[300px]" style={{ color: isLightMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }}>{t.updReadyDesc}</p>
                          </div>
                          <button 
                            onClick={() => (window as any).ipcRenderer?.send('install-update-now')}
                            className="w-full mt-4 py-5 bg-green-600 hover:bg-green-500 text-white rounded-[28px] text-[12px] font-black transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 uppercase tracking-[0.1em] no-drag"
                          >
                            <RotateCcw className="w-5 h-5" /> {t.updInstall}
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em]" style={{ borderColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', color: isLightMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }}>
                   <span>Notchly v2 Stable Release</span>
                   <span className="text-blue-500/40">Secure Update Path</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>


        {/* ── SETTINGS OVERLAY (larger, detached-style) ── */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1,  scale: 1,    y: 0   }}
              exit={{   opacity: 0,  scale: 0.97,  y: -8  }}
              className="absolute inset-0 flex flex-col overflow-hidden pointer-events-auto"
              onMouseEnter={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', false)}
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
                <div className="flex flex-col gap-4 p-8 overflow-y-auto no-scrollbar" style={{ borderRight: `1px solid ${isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t.visibility}</span>
                    <span className="text-[8px] font-bold text-white/20 uppercase">Ordenable</span>
                  </div>
                  <div className="flex flex-col gap-2 pb-10">
                    <Reorder.Group axis="y" values={tabOrder} onReorder={handleReorder} className="flex flex-col gap-2">
                      {tabOrder.map((v) => (
                        <Reorder.Item 
                          key={v} 
                          value={v}
                          className="group relative flex items-center gap-2 outline-none"
                        >
                          <div className="shrink-0 w-6 h-10 flex items-center justify-center opacity-0 group-hover:opacity-20 cursor-grab active:cursor-grabbing transition-opacity">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          
                          <button
                            onClick={() => toggleTab(v)}
                            className="flex-1 flex items-center justify-between px-4 py-3 rounded-2xl border transition-all font-black text-[11px] uppercase pointer-events-auto"
                            style={{
                              background: visibleTabs.includes(v) ? (isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)') : 'transparent',
                              borderColor: visibleTabs.includes(v) ? (isLightMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)') : (isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'),
                              opacity: visibleTabs.includes(v) ? 1 : 0.4,
                            }}
                          >
                            <span>{v}</span>
                            {visibleTabs.includes(v) ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>
                </div>

                {/* Col 2: Template */}
                <div className="flex flex-col gap-4 p-8 overflow-y-auto no-scrollbar" style={{ borderRight: `1px solid ${isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}` }}>
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

                  <div className="flex flex-col gap-3 mt-4">
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

                {/* Col 3: Theme + Language + SuperPill */}
                <div className="flex-1 flex flex-col gap-5 p-8 overflow-y-auto no-scrollbar">
                    <div className="flex flex-col gap-3 relative">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t.weatherLoc}</span>
                      <div className="relative group">
                        <input
                          type="text"
                          value={weatherCity}
                          onChange={(e) => { 
                            setWeatherCity(e.target.value); 
                            if (e.target.value.length > 2) setShowSuggestions(true); 
                          }}
                          onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                          placeholder="IP Geolocation..."
                          className="w-full px-4 py-3 rounded-2xl border transition-all font-black text-[11px] outline-none pr-10"
                          style={{
                            background: isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
                            borderColor: isLightMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
                            color: isLightMode ? '#111' : '#fff'
                          }}
                        />
                        {isSearching && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Activity className="w-3 h-3 animate-pulse text-blue-400" />
                          </div>
                        )}
                      </div>

                      {/* Autocomplete Dropdown */}
                      <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-full left-0 right-0 mt-2 z-[999] rounded-[24px] overflow-hidden border shadow-2xl"
                            style={{
                              background: isLightMode ? 'rgba(255,255,255,0.95)' : 'rgba(20,20,20,0.95)',
                              backdropFilter: 'blur(30px)',
                              borderColor: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                            }}
                          >
                            <div className="max-h-[220px] overflow-y-auto no-scrollbar py-2">
                              {suggestions.map((s, i) => (
                                <button
                                  key={i}
                                  onClick={() => { 
                                    setWeatherCity(s); 
                                    setLastSelectedCity(s);
                                    setShowSuggestions(false);
                                    localStorage.setItem('weatherLocation', s);
                                  }}
                                  className="w-full text-left px-5 py-3 text-[10px] font-bold hover:bg-blue-500/10 transition-colors border-b last:border-0"
                                  style={{ 
                                    borderColor: isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
                                    color: isLightMode ? '#333' : '#eee'
                                  }}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

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

                  {/* SISTEMA / AUTO-START */}
                  <div className="flex flex-col gap-3 mt-2">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t.sistema}</span>
                    <button
                      onClick={() => {
                        const next = !autoLaunch;
                        setAutoLaunch(next);
                        (window as any).ipcRenderer?.send('set-auto-launch', next);
                      }}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl border transition-all font-black text-[11px] uppercase pointer-events-auto"
                      style={{
                        background: autoLaunch ? (isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)') : 'transparent',
                        borderColor: autoLaunch ? (isLightMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)') : (isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'),
                        color: autoLaunch ? '#60a5fa' : 'inherit',
                      }}
                    >
                      <span>{t.autoLaunch}</span>
                      <div className={clsx('w-8 h-4 rounded-full relative transition-all', autoLaunch ? 'bg-blue-500' : 'bg-zinc-700')}>
                        <div className={clsx('absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all', autoLaunch ? (isLightMode ? 'left-4' : 'left-4.5') : 'left-0.5')} />
                      </div>
                    </button>
                  </div>
                  
                  {/* EFECTOS VISUALES */}
                  <div className="flex flex-col gap-3 mt-2">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Efectos Visuales</span>
                    <button
                      onClick={() => {
                        const next = !showAura;
                        setShowAura(next);
                        localStorage.setItem('showAura', JSON.stringify(next));
                      }}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl border transition-all font-black text-[11px] uppercase pointer-events-auto"
                      style={{
                        background: showAura ? (isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)') : 'transparent',
                        borderColor: showAura ? (isLightMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)') : (isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'),
                        color: showAura ? '#60a5fa' : 'inherit',
                      }}
                    >
                    <span>{t.rhythmGlow}</span>
                      <div className={clsx('w-8 h-4 rounded-full relative transition-all', showAura ? 'bg-blue-500' : 'bg-zinc-700')}>
                        <div className={clsx('absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all', showAura ? (isLightMode ? 'left-4' : 'left-4.5') : 'left-0.5')} />
                      </div>
                    </button>
                  </div>
                  
                  {/* CENTRO DE CONTROL TOGGLE */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Burbujas</span>
                    <button
                      onClick={() => {
                        const next = !showControlsBubble;
                        setShowControlsBubble(next);
                        localStorage.setItem('showControlsBubble', JSON.stringify(next));
                      }}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl border transition-all font-black text-[11px] uppercase pointer-events-auto"
                      style={{
                        background: showControlsBubble ? (isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)') : 'transparent',
                        borderColor: showControlsBubble ? (isLightMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)') : (isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'),
                        color: showControlsBubble ? '#60a5fa' : 'inherit',
                      }}
                    >
                      <span>Controlador Emergente</span>
                      <div className={clsx('w-8 h-4 rounded-full relative transition-all', showControlsBubble ? 'bg-blue-500' : 'bg-zinc-700')}>
                        <div className={clsx('absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all', showControlsBubble ? (isLightMode ? 'left-4' : 'left-4.5') : 'left-0.5')} />
                      </div>
                    </button>
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div 
          className="absolute left-full ml-0 top-1 pointer-events-auto flex flex-col gap-2 translate-y-[-2px]"
          onMouseEnter={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', false)}
          onMouseLeave={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', true)}
        >
            {/* Timer bubble */}
            <AnimatePresence>
              {showTimerBubble && (
                <TimerBubble 
                  time={timerTime} 
                  total={timerTotal} 
                  isActive={timerActive} 
                  isLightMode={isLightMode} 
                  onClick={() => { 
                    setIsPinned(true); 
                    setActiveView('Herramientas'); 
                    (window as any).ipcRenderer?.send('set-ignore-mouse-events', false); 
                  }} 
                />
              )}
            </AnimatePresence>

            {/* Notification bubble */}
            <AnimatePresence>
              {showNotifBubble && (
                <NotifBubble
                  count={notifications.length}
                  onClick={() => { 
                    setIsPinned(true);
                    setActiveView('Notificación'); 
                    (window as any).ipcRenderer?.send('set-ignore-mouse-events', false); 
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
