import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Play, Pause, SkipBack, SkipForward, Music, Bell, Cloud,
  CheckSquare, Pin, Activity, Volume2, HardDrive, Cpu, Trash2, Eye,
  EyeOff, BellOff, Timer, RotateCcw, ChevronUp, ChevronDown
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
const TimerBubble = ({ time, total, isActive }: { time: number; total: number; isActive: boolean }) => {
  const pct = total > 0 ? time / total : 0;
  const r = 22, circ = 2 * Math.PI * r;
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed top-2 pointer-events-none select-none z-[998]"
      style={{ right: 'calc(50% - 220px)' }}
    >
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} strokeWidth="3" fill="rgba(0,0,0,0.85)" stroke="rgba(255,255,255,0.08)" />
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
          <span className="text-[10px] font-black text-white tabular-nums">
            {`${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`}
          </span>
          <span className="text-[6px] text-blue-400 uppercase font-black tracking-wider mt-0.5">
            {isActive ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
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

  // Timer state
  const [timerTime, setTimerTime]     = useState(0);
  const [timerTotal, setTimerTotal]   = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMins, setTimerMins]     = useState(25);
  const [timerSecs, setTimerSecs]     = useState(0);
  const timerRef = useRef<any>(null);

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
    if (ipc) {
      ipc.on('media-update',   (_: any, d: any) => setMedia(d));
      ipc.on('system-update',  (_: any, d: any) => setSystemInfo(d));
      ipc.on('weather-update', (_: any, d: any) => setWeather(d));
      ipc.on('notification',   (_: any, d: any) => setNotifications(p => [{ id: Date.now(), ...d }, ...p.slice(0, 9)]));
      ipc.on('mouse-proximity', (_: any, d: any) => {
        const near = typeof d === 'object' ? d.isNear : d;
        if (near)  { setIsHovered(true);  ipc.send('set-ignore-mouse-events', false); }
        else if (!isPinned && !showSettings) { setIsHovered(false); ipc.send('set-ignore-mouse-events', true); }
      });
    }
    return () => clearInterval(clock);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-close settings on mouse leave
  useEffect(() => {
    if (!isHovered && !isPinned && showSettings) setShowSettings(false);
  }, [isHovered, isPinned, showSettings]);

  // Timer tick
  useEffect(() => {
    if (timerActive && timerTime > 0) {
      timerRef.current = setInterval(() => setTimerTime(p => p - 1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (timerTime === 0 && timerActive) setTimerActive(false);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timerTime]);

  const startTimer = () => {
    const total = timerMins * 60 + timerSecs;
    if (total === 0) return;
    setTimerTotal(total);
    setTimerTime(total);
    setTimerActive(true);
  };
  const resetTimer = () => { setTimerActive(false); setTimerTime(0); setTimerTotal(0); };

  // ── Window geometry ──────────────────────────────────────────────────────
  const isExpanded = isHovered || isPinned || notifications.length > 0 || showSettings;
  useEffect(() => {
    const ipc = (window as any).ipcRenderer;
    if (!ipc) return;
    const h = showSettings ? 600 : isExpanded ? 220 : 80;
    ipc.send('set-window-height', h);
    ipc.send('set-is-expanded', isExpanded);
  }, [isExpanded, showSettings]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const openApp   = (app: string) => (window as any).ipcRenderer?.invoke('open-app', app);
  const toggleTab = (tab: string) => setVisibleTabs(p => p.includes(tab) ? p.filter(x => x !== tab) : [...p, tab]);
  const fmtTime   = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Wing/body colors must match exactly for seamless look
  const bg       = isLightMode ? 'rgba(248,248,248,0.94)' : 'rgba(10,10,10,0.92)';
  const WING_R   = 34;
  const monthName = currentTime.toLocaleString(lang === 'zh' ? 'zh-CN' : lang, { month: 'short' });
  const dayNum    = currentTime.getDate();
  const showTimerBubble = timerTime > 0 && !isExpanded;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-[999]">

      {/* ── Floating timer bubble (pill mode) ── */}
      <AnimatePresence>
        {showTimerBubble && (
          <TimerBubble time={timerTime} total={timerTotal} isActive={timerActive} />
        )}
      </AnimatePresence>

      {/* ── Island body — overflow:visible so wings extend outside, content div is overflow:hidden ── */}
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
          height: showSettings ? 480 : isExpanded ? 180 : 66,
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

        {/* Inner content wrapper — clips content but not the wings */}
        <div className="absolute inset-0 overflow-hidden" style={{
          background: bg,
          borderLeft: `1px solid ${isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}`,
          borderRight: `1px solid ${isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}`,
          borderBottom: `1px solid ${isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}`,
          borderTop: 'none',
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
            {/* RESUMEN */}
            {activeView === 'Resumen' && (
              <div className="absolute inset-0 flex items-center justify-between px-2 gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-5 border-r border-white/5">
                  <div onDoubleClick={() => openApp('Spotify')} className="w-[68px] h-[68px] rounded-[22px] overflow-hidden shrink-0 border border-white/10 bg-zinc-900 relative shadow-2xl cursor-pointer hover:scale-105 transition-transform">
                    {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-7 h-7 m-auto opacity-10" />}
                    <div className="absolute -bottom-1 -right-1 bg-[#fc3c44] w-6 h-6 rounded-full flex items-center justify-center border-2 border-black shadow-lg"><Music className="w-2.5 h-2.5 text-white" /></div>
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <h4 className="text-[17px] font-black truncate tracking-tighter leading-tight">{media.title}</h4>
                    <p  className="text-[11px] font-bold truncate mt-0.5" style={{ opacity: 0.4 }}>{media.artist}</p>
                    <div className="flex items-center gap-5 mt-2.5">
                      <SkipBack    onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'prev')}      className="w-4.5 h-4.5 cursor-pointer transition-all hover:scale-110" style={{ opacity: 0.45 }} />
                      <button      onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'playPause')} className="w-7 h-7 hover:scale-110 transition-all outline-none">
                        {media.isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                      </button>
                      <SkipForward onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'next')}      className="w-4.5 h-4.5 cursor-pointer transition-all hover:scale-110" style={{ opacity: 0.45 }} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center px-4 text-left shrink-0">
                  <div onClick={() => openApp('outlook')} className="flex items-end gap-2 mb-2 cursor-pointer font-black hover:opacity-70 transition-all">
                    <span className="text-[32px] tracking-tighter leading-none">{monthName}</span>
                    <span className="text-[11px] uppercase tracking-wider pb-1" style={{ opacity: 0.3 }}>{dayNum}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest" style={{ opacity: 0.2 }}>
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> {t.empty}
                  </div>
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

            {/* MULTIMEDIA */}
            {activeView === 'Multimedia' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-12">
                  <SkipBack    onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'prev')}      className="w-8 h-8 cursor-pointer transition-all hover:scale-110" style={{ opacity: 0.3 }} />
                  <button      onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'playPause')} className="w-20 h-20 rounded-full flex items-center justify-center border outline-none hover:scale-105 transition-all shadow-2xl" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    {media.isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                  </button>
                  <SkipForward onClick={() => (window as any).ipcRenderer?.invoke('media-command', 'next')}      className="w-8 h-8 cursor-pointer transition-all hover:scale-110" style={{ opacity: 0.3 }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] truncate max-w-[400px]" style={{ opacity: 0.25 }}>{media.title}</span>
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
                <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 px-1 pb-1">
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
              <div className="absolute inset-0 flex items-center justify-between px-8">
                {/* Timer display / ring */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="42" strokeWidth="4" fill="transparent" stroke="rgba(255,255,255,0.06)" />
                    <motion.circle
                      cx="48" cy="48" r="42" strokeWidth="4" fill="transparent"
                      stroke="#3b82f6"
                      strokeDasharray={2 * Math.PI * 42}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (timerTotal > 0 ? 1 - timerTime / timerTotal : 0) }}
                      style={{ filter: 'drop-shadow(0 0 6px #3b82f6)' }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-[20px] font-black tabular-nums tracking-tighter">{fmtTime(timerTime)}</span>
                    <span className="text-[8px] uppercase font-black text-blue-400 tracking-widest mt-0.5">{t.timer}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-3 flex-1 pl-8">
                  {/* Time picker */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <button onClick={() => setTimerMins(m => Math.min(m + 1, 99))} className="opacity-40 hover:opacity-100 transition-all"><ChevronUp className="w-4 h-4" /></button>
                      <div className="text-[22px] font-black tabular-nums w-12 text-center">{String(timerMins).padStart(2, '0')}</div>
                      <button onClick={() => setTimerMins(m => Math.max(m - 1, 0))} className="opacity-40 hover:opacity-100 transition-all"><ChevronDown className="w-4 h-4" /></button>
                    </div>
                    <span className="text-[22px] font-black opacity-30 mb-0.5">:</span>
                    <div className="flex flex-col items-center gap-1">
                      <button onClick={() => setTimerSecs(s => Math.min(s + 5, 55))} className="opacity-40 hover:opacity-100 transition-all"><ChevronUp className="w-4 h-4" /></button>
                      <div className="text-[22px] font-black tabular-nums w-12 text-center">{String(timerSecs).padStart(2, '0')}</div>
                      <button onClick={() => setTimerSecs(s => Math.max(s - 5, 0))} className="opacity-40 hover:opacity-100 transition-all"><ChevronDown className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Start / Pause / Reset */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => timerActive ? setTimerActive(false) : (timerTime > 0 ? setTimerActive(true) : startTimer())}
                      className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      style={{ background: timerActive ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.8)', color: timerActive ? '#f87171' : 'white', border: timerActive ? '1px solid rgba(239,68,68,0.3)' : 'none' }}
                    >
                      {timerActive ? t.pause : t.start}
                    </button>
                    <button onClick={resetTimer} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-40 hover:opacity-100" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                      <RotateCcw className="w-4 h-4" />
                    </button>
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
    </div>
  );
};
