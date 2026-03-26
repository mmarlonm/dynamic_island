import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Play, Pause, SkipBack, SkipForward, Music, Bell, Cloud,
  CheckSquare, Pin, Activity, Volume2, HardDrive, Cpu, Trash2, Eye,
  EyeOff, BellOff, Timer, RotateCcw
} from 'lucide-react';
import clsx from 'clsx';

// ── Animated wave visualizer ─────────────────────────────────────────────────
const SoundVisualizer = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className="w-12 h-4 flex items-center justify-center pointer-events-none overflow-visible">
    <svg width="48" height="16" viewBox="0 0 48 16">
      <defs>
        <linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <motion.path
        fill="none" stroke="url(#wg)" strokeWidth="2" strokeLinecap="round"
        filter="url(#glow)"
        animate={{
          d: isPlaying
            ? ['M 0 8 Q 6 2 12 8 Q 18 14 24 8 Q 30 2 36 8 Q 42 14 48 8',
               'M 0 8 Q 6 14 12 8 Q 18 2 24 8 Q 30 14 36 8 Q 42 2 48 8',
               'M 0 8 Q 6 2 12 8 Q 18 14 24 8 Q 30 2 36 8 Q 42 14 48 8']
            : 'M 0 8 L 48 8'
        }}
        transition={{ duration: 0.85, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
      />
    </svg>
  </div>
);

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
      style={{ marginTop: 4 }}
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
    style={{ marginTop: 4, marginLeft: 6 }}
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
  const [activeView, setActiveView]   = useState<'Resumen' | 'Sistema' | 'Multimedia' | 'Notificación' | 'Herramientas'>('Resumen');
  const [lang, setLang]               = useState<'es' | 'en' | 'zh'>('es');
  const [isLightMode, setIsLightMode] = useState(false);
  const [summaryTemplate, setSummaryTemplate] = useState<'Moderno' | 'Mínimo' | 'Clásico'>('Moderno');
  const [visibleTabs, setVisibleTabs] = useState<string[]>(['Resumen', 'Sistema', 'Multimedia', 'Notificación', 'Herramientas']);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [media, setMedia]   = useState({ title: 'Ningún origen de medios', artist: 'Sin Reproducción', isPlaying: false, thumbnail: '' });
  const [notifications, setNotifications] = useState<Array<{ id: number; app: string; text: string }>>([]);
  const [systemInfo, setSystemInfo]   = useState({ cpu: 12, ram: 45, net: 2.1 });
  const [weather, setWeather]         = useState({ temp: '22' });
  const [volume, setVolume]           = useState(70); // 0-100 system volume

  // Timer state
  const [timerTime, setTimerTime]     = useState(0);
  const [timerTotal, setTimerTotal]   = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerHours, setTimerHours]   = useState(0);
  const [timerMins, setTimerMins]     = useState(25);
  const [timerSecs, setTimerSecs]     = useState(0);
  const timerRef = useRef<any>(null);
  const volDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Selected calendar day
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Refs to avoid stale closure in IPC listener
  const isPinnedRef    = useRef(false);
  const showSettingsRef = useRef(false);
  const setIsHoveredRef = useRef(setIsHovered);
  const isHoveredRef    = useRef(false);
  useEffect(() => { isPinnedRef.current = isPinned; }, [isPinned]);
  useEffect(() => { showSettingsRef.current = showSettings; }, [showSettings]);
  useEffect(() => { isHoveredRef.current = isHovered; }, [isHovered]);

  const T: Record<string, any> = {
    es: { resumen:'Resumen', sistema:'Sistema', multimedia:'Multimedia', notificacion:'Notificación', herramientas:'Herramientas', empty:'Limpio', now:'AHORA', settings:'AJUSTES', template:'Diseño', moderno:'Moderno', minimo:'Mínimo', clasico:'Clásico', lang:'Idioma', visibility:'Pestañas', clear:'Borrar todo', theme:'Apariencia', light:'Claro', dark:'Oscuro', timer:'Temporizador', start:'Iniciar', pause:'Pausar', reset:'Reiniciar' },
    en: { resumen:'Summary', sistema:'System', multimedia:'Media', notificacion:'Alerts', herramientas:'Tools', empty:'Clean', now:'NOW', settings:'SETTINGS', template:'Design', moderno:'Modern', minimo:'Minimal', clasico:'Classic', lang:'Language', visibility:'Tabs', clear:'Clear all', theme:'Theme', light:'Light', dark:'Dark', timer:'Timer', start:'Start', pause:'Pause', reset:'Reset' },
    zh: { resumen:'摘要', sistema:'系统', multimedia:'多媒体', notificacion:'通知', herramientas:'工具', empty:'无内容', now:'现在', settings:'设置', template:'设计', moderno:'现代', minimo:'极简', clasico:'经典', lang:'语言', visibility:'标签页', clear:'全部清除', theme:'主题', light:'浅色', dark:'深色', timer:'计时器', start:'开始', pause:'暂停', reset:'重置' },
  };
  const t = T[lang] ?? T.es;

  // ── IPC listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    const ipc = (window as any).ipcRenderer;
    const hoverTimeoutRef = { current: null as any };

    if (ipc) {
      ipc.invoke('get-current-media').then((d: any) => { if (d) setMedia(d); }).catch(() => {});
      ipc.invoke('get-volume').then((v: any) => { if (typeof v === 'number') setVolume(v); }).catch(() => {});
      ipc.on('media-update',   (_: any, d: any) => setMedia(d));
      ipc.on('system-update',  (_: any, d: any) => setSystemInfo(d));
      ipc.on('weather-update', (_: any, d: any) => setWeather(d));
      ipc.on('notification',   (_: any, d: any) => setNotifications(p => [{ id: Date.now(), ...d }, ...p.slice(0, 9)]));
      ipc.on('volume-update',  (_: any, v: number) => setVolume(v));
      // FIX: use refs so handler always reads current isPinned/showSettings (no stale closure)
      ipc.on('mouse-proximity', (_: any, d: any) => {
        const near = typeof d === 'object' ? d.isNear : d;
        if (near) {
          if (hoverTimeoutRef.current || isHoveredRef.current) return;
          hoverTimeoutRef.current = setTimeout(() => {
            setIsHoveredRef.current(true);
            ipc.send('set-ignore-mouse-events', false);
            hoverTimeoutRef.current = null;
          }, 100);
        } else {
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
          }
          if (!isPinnedRef.current && !showSettingsRef.current) {
            setIsHoveredRef.current(false);
            ipc.send('set-ignore-mouse-events', true);
          }
        }
      });
    }
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
    } catch (e) { console.error('Alarm failed', e); }
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
    const h = showSettings ? 600 : isExpanded ? (activeView === 'Herramientas' ? 480 : 220) : 80;
    ipc.send('set-window-height', h);
    // Robust expansion report: true if any state implies expansion
    const effectivelyExpanded = isExpanded || showSettings || (activeView && activeView !== 'Resumen');
    ipc.send('set-is-expanded', !!effectivelyExpanded);
  }, [isExpanded, showSettings, activeView]);

  // ── Helpers ──────────────────────────────────────────────────────────────
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
  const bg       = isLightMode ? 'rgba(248,248,248,0.94)' : 'rgba(10,10,10,0.92)';
  const WING_R   = 34;
  const monthName = currentTime.toLocaleString(lang === 'zh' ? 'zh-CN' : lang, { month: 'short' });
  const showTimerBubble = timerTime > 0 && !isExpanded;
  const showNotifBubble = notifications.length > 0 && !isExpanded;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 flex flex-row items-start pointer-events-none select-none z-[999]">

      {/* ── Island body ── */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { if (!isPinned && !showSettings) setIsHovered(false); }}
        className="relative pointer-events-auto"
        style={{
          overflow: 'visible',
          color: isLightMode ? '#111' : '#fff',
        }}
        animate={{
          width: showSettings ? 720 : isExpanded ? 680 : 360,
          height: showSettings ? 480 : isExpanded ? (activeView === 'Herramientas' ? 450 : 180) : 66,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        {/* Wings — pinned inside motion.div so they always track its corners */}
        <svg width={WING_R} height={WING_R} shapeRendering="geometricPrecision" className="absolute top-0 pointer-events-none z-[1]" style={{ left: -WING_R, display: 'block' }}>
          <path d={`M 0 0 H ${WING_R} V ${WING_R} A ${WING_R} ${WING_R} 0 0 0 0 0 Z`} fill={bg} />
        </svg>
        <svg width={WING_R} height={WING_R} shapeRendering="geometricPrecision" className="absolute top-0 pointer-events-none z-[1]" style={{ right: -WING_R, display: 'block' }}>
          <path d={`M ${WING_R} 0 H 0 V ${WING_R} A ${WING_R} ${WING_R} 0 0 1 ${WING_R} 0 Z`} fill={bg} />
        </svg>

        {/* Inner content wrapper — clips content, NO side borders so wings are seamless */}
        <div className="absolute inset-0 overflow-hidden" style={{
          background: bg,
          borderBottom: `1px solid ${isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}`,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderRadius: `0 0 ${WING_R}px ${WING_R}px`,
          backdropFilter: 'blur(80px)',
          boxShadow: isLightMode
            ? '0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08)'
            : '0 20px 60px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.4)',
        }}>
        {/* ── COLLAPSED PILL ── */}
        <motion.div
          animate={{ opacity: isExpanded ? 0 : 1 }}
          className={clsx('absolute inset-0 flex items-center px-4', isExpanded && 'pointer-events-none')}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 relative shrink-0 shadow-lg">
                {media.thumbnail
                  ? <img src={media.thumbnail} className="w-full h-full object-cover" />
                  : <Music className="w-5 h-5 m-auto opacity-10" />}
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#fc3c44] w-4 h-4 rounded-full flex items-center justify-center border-2 border-black">
                  <Music className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="flex flex-col min-w-0 max-w-[130px]">
                <span className="text-[12px] font-black truncate tracking-tight text-left">
                  {media.isPlaying ? media.title : t.resumen}
                </span>
                <span className="text-[9px] font-bold truncate uppercase text-left" style={{ opacity: 0.35 }}>
                  {media.isPlaying ? media.artist : 'Sin Actividad'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SoundVisualizer isPlaying={media.isPlaying} />
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
        </motion.div>

        {/* ── EXPANDED PANEL ── */}
        <motion.div
          animate={{ opacity: isExpanded && !showSettings ? 1 : 0 }}
          className={clsx('absolute inset-0 flex flex-col pt-2.5 px-4 pb-2', (!isExpanded || showSettings) && 'pointer-events-none')}
        >
          {/* Tab bar */}
          <div className={clsx('flex items-center justify-between mb-2 pb-2 border-b shrink-0', isLightMode ? 'border-black/5' : 'border-white/5')}>
            <div className="flex gap-1 items-center">
              {(['Resumen', 'Sistema', 'Multimedia', 'Notificación', 'Herramientas'] as const).map(v =>
                visibleTabs.includes(v) && (
                  <button
                    key={v}
                    onClick={() => setActiveView(v)}
                    className={clsx(
                      'px-3 py-1 rounded-full text-[9.5px] font-black flex items-center gap-1 transition-all uppercase',
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
                    {t[v === 'Notificación' ? 'notificacion' : v.toLowerCase()] || v}
                  </button>
                )
              )}
            </div>
            <div className="flex items-center gap-3">
              <SoundVisualizer isPlaying={media.isPlaying} />
              <div onClick={() => setIsPinned(p => !p)} className={clsx('cursor-pointer p-1 rounded-lg transition-all', isPinned ? 'text-blue-500' : 'opacity-20 hover:opacity-70')}>
                <Pin className="w-3.5 h-3.5" />
              </div>
              <Settings onClick={() => setShowSettings(s => !s)} className={clsx('w-3.5 h-3.5 cursor-pointer hover:rotate-90 transition-all', isLightMode ? 'opacity-30 hover:opacity-80' : 'opacity-30 hover:opacity-80')} />
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
                      <SkipBack    onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'prev')}      className="w-4 h-4 cursor-pointer hover:scale-110 transition-all" style={{ opacity: 0.4 }} />
                      <button      onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'playPause')} className="w-7 h-7 hover:scale-110 transition-all outline-none">
                        {media.isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                      </button>
                      <SkipForward onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'next')}      className="w-4 h-4 cursor-pointer hover:scale-110 transition-all" style={{ opacity: 0.4 }} />
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
                  const todayNum = today.getDate();
                  const todayMonth = today.getMonth();
                  const dayOfWeek = today.getDay();
                  const days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(today);
                    d.setDate(todayNum - dayOfWeek + i);
                    return d;
                  });
                  const dayAbbr = ['S','M','T','W','T','F','S'];
                  const sel = selectedDay;
                  return (
                    <div className="flex-1 flex flex-col justify-center px-5 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="flex items-baseline gap-2 font-black mb-2">
                        <span className="text-[24px] tracking-tighter leading-none" style={{ opacity: 0.9 }}>{monthName}</span>
                        <span className="text-[12px] text-blue-400 font-mono font-black">{todayNum}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        {days.map((d, i) => {
                          const isToday   = d.getDate() === todayNum && d.getMonth() === todayMonth;
                          const isSel     = sel && d.getDate() === sel.getDate() && d.getMonth() === sel.getMonth();
                          const isWeekend = i === 0 || i === 6;
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedDay(isSel ? null : new Date(d))}
                              className="flex flex-col items-center gap-0.5 outline-none"
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
                {/* Left: album art + wave */}
                <div className="flex flex-col items-center justify-center px-6 border-r gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)', minWidth: 120 }}>
                  <div onDoubleClick={() => openApp('Spotify')} className="w-16 h-16 rounded-[20px] overflow-hidden border border-white/10 bg-zinc-900 relative shadow-2xl cursor-pointer hover:scale-105 transition-transform">
                    {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-7 h-7 m-auto opacity-10" />}
                  </div>
                  <SoundVisualizer isPlaying={media.isPlaying} />
                </div>
                {/* Center: track info + big controls */}
                <div className="flex-1 flex flex-col items-start justify-center px-6 gap-2">
                  <span className="text-[15px] font-black truncate w-full tracking-tight leading-tight">{media.title}</span>
                  <span className="text-[11px] font-bold truncate w-full" style={{ opacity: 0.4 }}>{media.artist}</span>
                  <div className="flex items-center gap-5 mt-1">
                    <SkipBack    onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'prev')}      className="w-5 h-5 cursor-pointer hover:scale-110 transition-all" style={{ opacity: 0.4 }} />
                    <button      onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'playPause')} className="w-11 h-11 rounded-full flex items-center justify-center border outline-none hover:scale-105 transition-all shadow-xl" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)' }}>
                      {media.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <SkipForward onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'next')}      className="w-5 h-5 cursor-pointer hover:scale-110 transition-all" style={{ opacity: 0.4 }} />
                  </div>
                </div>
                {/* Right: volume slider column */}
                <div className="flex flex-col items-center justify-center px-4 gap-2" style={{ minWidth: 70 }}>
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

            {/* HERRAMIENTAS */}
            {activeView === 'Herramientas' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[450px] h-[450px] flex items-center justify-center">
                  
                  {/* Unified Triple Timer System */}
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

                  {/* Center Controls — inside a smaller safe zone */}
                  <div className="absolute z-30 flex flex-col items-center pointer-events-auto">
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
                    {(['Resumen', 'Sistema', 'Multimedia', 'Notificación', 'Herramientas'] as const).map(v => (
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

                {/* Col 3: Theme + Language */}
                <div className="flex flex-col gap-6 p-8">
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

                  {/* Version badge */}
                  <div className="mt-auto pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ opacity: 0.2 }}>Dynamic Island Win</span>
                      <span className="text-[9px] font-bold" style={{ opacity: 0.15 }}>v2.5.0 · Unified Architecture</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>{/* end inner content wrapper */}
      </motion.div>

      {/* Timer bubble — flex sibling, sits right of the island edge, coupled to wing */}
      <AnimatePresence>
        {showTimerBubble && (
          <div style={{ marginLeft: 6 }}>
            <TimerBubble time={timerTime} total={timerTotal} isActive={timerActive} isLightMode={isLightMode} />
          </div>
        )}
      </AnimatePresence>

      {/* Notification bubble — appears when collapsed and there are unread notifications */}
      <AnimatePresence>
        {showNotifBubble && (
          <NotifBubble
            count={notifications.length}
            onClick={() => { setIsHovered(true); setActiveView('Notificación'); (window as any).ipcRenderer?.send('set-ignore-mouse-events', false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
