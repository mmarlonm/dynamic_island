import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls, useMotionValue, Reorder } from 'framer-motion';
import {
  Settings, Play, Pause, SkipBack, SkipForward, Music, Bell, Cloud,
  CheckSquare, Pin, Activity, Volume2, HardDrive, Cpu, Trash2, Eye,
  EyeOff, BellOff, Timer, RotateCcw, Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
  Download, MessageCircle, Wifi, WifiOff, Bluetooth, LayoutGrid, GripVertical, CheckCircle2,
  ShoppingBag, Zap, Layers
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
// ── Mini Island Preview Wrapper ─────────────────────────────────────────────
const MiniIslandPreview = ({ 
  children, 
  bg = 'bg-black', 
  w = 320, 
  h = 66, 
  r = 34 
}: { 
  children: React.ReactNode, 
  bg?: string,
  w?: number,
  h?: number,
  r?: number
}) => {
  const totalW = w + 68;
  const islandD = `M 0 0 A ${r} ${r} 0 0 1 ${r} ${r} V ${h-r} A ${r} ${r} 0 0 0 ${r*2} ${h} H ${totalW-(r*2)} A ${r} ${r} 0 0 0 ${totalW-r} ${h-r} V ${r} A ${r} ${r} 0 0 1 ${totalW} 0 Z`;

  return (
    <div className="w-full h-full min-h-[140px] flex items-center justify-center p-4 bg-zinc-900/50 rounded-[40px] border border-white/5 overflow-hidden group hover:bg-zinc-800/80 transition-all duration-500">
       <div className="relative flex items-center justify-center scale-[0.6] origin-center group-hover:scale-[0.65] transition-transform duration-500">
          <svg width={totalW} height={h} viewBox={`0 0 ${totalW} ${h}`} className="absolute drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
             <path d={islandD} fill={bg.startsWith('bg-') ? (bg === 'bg-black' ? '#0a0a0a' : '#111') : bg} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          </svg>
          <div className="relative z-10 flex items-center justify-center" style={{ width: totalW, height: h }}>
            {children}
          </div>
       </div>
    </div>
  );
};

// ── Style Store Component (Tienda) ──────────────────────────────────────────
const TiendaView = ({ t, templates, auras, currentT, currentA, onApplyT, onApplyA, dockMode }: any) => {
  const isSideDock = dockMode === 'left' || dockMode === 'right';
  
  // Estados locales para la previsualización interactiva
  const [previewT, setPreviewT] = useState(currentT);
  const [previewA, setPreviewA] = useState(currentA);
  const [previewState, setPreviewState] = useState<'collapsed' | 'superPill' | 'expanded'>('collapsed');

  // Sincronizar previsualizaciones con cambios externos
  useEffect(() => {
    setPreviewT(currentT);
  }, [currentT]);

  useEffect(() => {
    setPreviewA(currentA);
  }, [currentA]);

  // Reloj simulado local para el previsualizador
  const [simTime, setSimTime] = useState(new Date());
  useEffect(() => {
    const clock = setInterval(() => setSimTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // ── Renderizador de contenido simulado de la Isla ──
  const renderMockupContent = (templateId: string, state: string, time: Date) => {
    const fmt = (val: number) => String(val).padStart(2, '0');
    const timeStr = `${time.getHours()}:${fmt(time.getMinutes())}`;
    
    // 1. MODO GOTA / SUPER PILL (collapsed-pill pequeño)
    if (state === 'superPill') {
      if (templateId === 'ID-Runner') {
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <motion.div 
              animate={{ x: [-15, 15] }} 
              transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v7" />
                <path d="M12 9l-4 4 M12 9l4-2" />
                <path d="M12 14l-4 6 M12 14l4 2" />
              </svg>
            </motion.div>
          </div>
        );
      }
      if (templateId === 'ID-C2') {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Zap className="w-5 h-5 text-amber-500 fill-current drop-shadow-[0_0_8px_#f59e0b]" />
            </motion.div>
          </div>
        );
      }
      if (templateId === 'ID-C3') {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Activity className="w-4 h-4 text-blue-400 drop-shadow-[0_0_6px_#60a5fa]" />
            </motion.div>
          </div>
        );
      }
      if (templateId === 'ID-C4') {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent" 
            />
          </div>
        );
      }
      if (templateId === 'ID-Neon-Media') {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="w-7 h-7 rounded-full border border-pink-500 flex items-center justify-center bg-black">
              <Music className="w-3.5 h-3.5 text-pink-500" />
            </motion.div>
          </div>
        );
      }
      if (templateId === 'ID-Glass-Weather') {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <Cloud className="w-5 h-5 text-blue-400 drop-shadow-[0_0_6px_#3b82f6]" />
          </div>
        );
      }
      if (templateId === 'ID-Device-Manager') {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <Bluetooth className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
        );
      }
      if (templateId === 'ID-Orbit-Music') {
        return (
          <div className="flex items-center justify-center w-full h-full relative">
            <div className="w-6 h-6 rounded-full border border-purple-500/40 flex items-center justify-center bg-black">
              <div className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full border border-black -top-0.5" />
              <Music className="w-3 h-3 text-purple-400" />
            </div>
          </div>
        );
      }
      // Por defecto en súper gota: Portada de música rotando
      return (
        <div className="flex items-center justify-center w-full h-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="w-7 h-7 rounded-full overflow-hidden border border-white/20 bg-blue-600 flex items-center justify-center shadow-lg"
          >
            <Music className="w-3.5 h-3.5 text-white" />
          </motion.div>
        </div>
      );
    }

    // 2. MODO COLAPSADO NORMAL (pill grande)
    if (state === 'collapsed') {
      if (templateId === 'Moderno') {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center shrink-0">
                <Music className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black truncate max-w-[110px] leading-tight">Blinding Lights</span>
                <span className="text-[7.5px] font-bold opacity-40 leading-none">The Weeknd</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-[2px] h-2.5 items-end">
                {[1,2,3,4,5].map(i => (
                  <motion.div 
                    key={i} 
                    animate={{ height: [3, 10, 3] }} 
                    transition={{ duration: 0.4 + i*0.08, repeat: Infinity }}
                    className="w-[2px] bg-blue-400 rounded-full" 
                  />
                ))}
              </div>
              <div className="flex items-center gap-0.5 py-0.5 px-1.5 rounded-full border border-white/10 bg-white/5 text-[8px] font-black">
                <Cloud className="w-2.5 h-2.5 text-blue-400" />
                <span>24°</span>
              </div>
              <span className="text-[10px] font-black opacity-40 tabular-nums">{timeStr}</span>
            </div>
          </div>
        );
      }
      if (templateId === 'Mínimo') {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                <Music className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div className="flex gap-[2px] h-2.5 items-end">
                {[1,2,3,4].map(i => (
                  <motion.div 
                    key={i} 
                    animate={{ height: [3, 10, 3] }} 
                    transition={{ duration: 0.5 + i*0.12, repeat: Infinity }}
                    className="w-[2px] bg-white/30 rounded-full" 
                  />
                ))}
              </div>
            </div>
            <span className="text-[14px] font-black text-blue-400 tracking-tight tabular-nums">{timeStr}</span>
          </div>
        );
      }
      if (templateId === 'Clásico') {
        return (
          <div className="flex items-center gap-3 w-full px-4 h-full text-white overflow-hidden">
            <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center shrink-0">
              <Music className="w-3.5 h-3.5 text-white/30" />
            </div>
            <div className="flex-1 flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden">
              <span className="text-[11px] font-black">Blinding Lights</span>
              <span className="text-[8.5px] font-bold opacity-30">- The Weeknd</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Cloud className="w-3 h-3 text-blue-400 opacity-60" />
              <span className="text-[11px] font-black">24°</span>
            </div>
          </div>
        );
      }
      if (['ID-C1', 'ID-C2', 'ID-C3', 'ID-C4'].includes(templateId)) {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse fill-current" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-black leading-none">85%</span>
                <span className="text-[6.5px] font-black uppercase opacity-30 tracking-wider">Carga Core</span>
              </div>
            </div>
            <span className="text-[12px] font-black text-blue-400 tabular-nums">{timeStr}</span>
          </div>
        );
      }
      if (templateId.includes('-Art')) {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-[8.5px] font-black uppercase tracking-[0.2em] opacity-60">Fine Art</span>
            </div>
            <span className="text-[14px] font-black opacity-80 tabular-nums">{timeStr}</span>
          </div>
        );
      }
      if (templateId.includes('-Retro')) {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-black tracking-tighter text-purple-400 italic">2026</span>
              <span className="text-[6.5px] font-black uppercase opacity-20 tracking-widest">Retro-Bit</span>
            </div>
            <span className="text-[11px] font-black font-mono opacity-50 tabular-nums">{timeStr}</span>
          </div>
        );
      }
      if (templateId.includes('-Pop')) {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 -rotate-3 scale-110" />
              <span className="relative text-[11px] font-black italic uppercase text-black px-1.5">POP!</span>
            </div>
            <span className="text-[15px] font-black tracking-tight tabular-nums">{timeStr}</span>
          </div>
        );
      }
      if (['ID-Google', 'ID-iOS', 'ID-Dashboard'].includes(templateId)) {
        const isGoogle = templateId === 'ID-Google';
        const isiOS = templateId === 'ID-iOS';
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className={clsx("w-7 h-7 rounded-xl flex items-center justify-center border", 
              isGoogle ? "bg-indigo-500 border-indigo-400" :
              isiOS ? "bg-white/10 border-white/20 backdrop-blur-md" : "bg-blue-500/20 border-blue-500/30"
            )}>
              {isGoogle ? <Activity className="w-3.5 h-3.5 text-white" /> : <Layers className="w-3.5 h-3.5 text-blue-400" />}
            </div>
            <span className={clsx("text-[14px] font-black tabular-nums", isGoogle ? "text-indigo-400" : "text-white")}>
              {timeStr}
            </span>
          </div>
        );
      }
      if (templateId === 'ID-Neon-Media') {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="w-8 h-8 rounded-full border border-pink-500/40 flex items-center justify-center bg-black/40">
              <Music className="w-4 h-4 text-pink-500 animate-pulse" />
            </div>
            <div className="flex gap-[2px] h-3 items-end">
              {[1,2,3,4].map(i => (
                <motion.div key={i} animate={{ height: [3, 11, 3] }} transition={{ duration: 0.4 + i*0.1, repeat: Infinity }} className="w-[2px] bg-pink-500 rounded-full" />
              ))}
            </div>
          </div>
        );
      }
      if (templateId === 'ID-Glass-Weather') {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-400 drop-shadow-[0_0_4px_#3b82f6]" />
              <span className="text-[10px] font-black uppercase opacity-60">Atmosphere</span>
            </div>
            <span className="text-[14px] font-black text-blue-400 tabular-nums">24°C</span>
          </div>
        );
      }
      if (templateId === 'ID-Device-Manager') {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="flex items-center gap-2">
              <Bluetooth className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase opacity-60">Device Hub</span>
            </div>
            <span className="text-[11px] font-black text-indigo-400">4 Active</span>
          </div>
        );
      }
      if (templateId === 'ID-Orbit-Music') {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="w-7 h-7 rounded-full border border-purple-500/30 flex items-center justify-center bg-black/60 relative">
              <Music className="w-3.5 h-3.5 text-purple-400" />
              <div className="absolute w-2 h-2 bg-cyan-400 rounded-full border border-black -top-0.5" />
            </div>
            <span className="text-[12px] font-black text-cyan-400 font-mono tabular-nums">{timeStr}</span>
          </div>
        );
      }
      if (templateId === 'ID-iPhone-Pro') {
        return (
          <div className="flex items-center justify-between w-full px-4 h-full text-white">
            <div className="w-7 h-7 rounded-full border border-white/10 overflow-hidden relative flex items-center justify-center shrink-0 bg-zinc-950">
              <Music className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-[2.5px] h-3 items-end">
                {[4, 9, 6, 8, 3].map((h, i) => (
                  <motion.div key={i} animate={{ height: [`30%`, `${h * 10}%`, `30%`] }} transition={{ duration: 0.5 + i*0.1, repeat: Infinity }} className="w-[2px] bg-emerald-400 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        );
      }
      // Por defecto para colapsados
      return (
        <div className="flex items-center justify-between w-full px-4 h-full text-white">
          <span className="text-[10px] font-black uppercase tracking-wider opacity-40">{templateId.replace('ID-', '')} Mode</span>
          <span className="text-[13px] font-black opacity-80 tabular-nums">{timeStr}</span>
        </div>
      );
    }

    // 3. MODO EXPANDIDO
    if (state === 'expanded') {
      if (templateId === 'ID-Google') {
        return (
          <div className="flex-1 flex gap-4 px-6 py-3 w-full h-full text-white">
            <div className="bg-white/5 backdrop-blur-3xl rounded-[20px] flex-1 p-4 flex flex-col justify-between border border-white/10 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[18px] font-black text-indigo-400 leading-none">24°</span>
                  <span className="text-[7px] font-black uppercase opacity-40">Local</span>
                </div>
              </div>
              <div className="flex flex-col text-left mt-2">
                <span className="text-[14px] font-black truncate max-w-[180px]">Blinding Lights</span>
                <span className="text-[8.5px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">The Weeknd</span>
              </div>
            </div>
            <div className="w-[120px] flex flex-col gap-2.5 shrink-0">
              <div className="flex-1 bg-emerald-500/20 rounded-[16px] flex flex-col items-center justify-center border border-emerald-500/30">
                <Zap className="w-4 h-4 text-emerald-400 fill-current mb-0.5" />
                <span className="text-[14px] font-black leading-none">85%</span>
                <span className="text-[6.5px] font-black uppercase opacity-40 mt-0.5">Efficient</span>
              </div>
              <div className="bg-amber-500/20 rounded-[16px] py-2 flex items-center justify-center border border-amber-500/30 font-black">
                <span className="text-[14px] tabular-nums">{timeStr}</span>
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-iOS') {
        return (
          <div className="flex-1 relative overflow-hidden flex flex-col p-5 w-full h-full text-white">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/25 blur-[50px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/25 blur-[50px] rounded-full" />
            <div className="relative z-10 flex-1 flex gap-4">
              <div className="bg-white/5 backdrop-blur-3xl rounded-[20px] border border-white/10 flex-1 p-5 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4 text-white/30" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[14px] font-black">Blinding Lights</span>
                    <span className="text-[8.5px] font-black text-white/30 uppercase tracking-widest mt-0.5">The Weeknd</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[53%]" />
                  </div>
                  <span className="text-[6.5px] font-black text-white/40">1:45 / 3:30</span>
                </div>
              </div>
              <div className="w-[110px] flex flex-col gap-2 shrink-0">
                <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-[16px] border border-white/10 flex flex-col items-center justify-center">
                  <Cloud className="w-4 h-4 text-white mb-0.5" />
                  <span className="text-[16px] font-black leading-none">22°</span>
                  <span className="text-[6.5px] font-black uppercase opacity-40 mt-0.5">Clear</span>
                </div>
                <div className="bg-white rounded-[14px] py-1.5 flex items-center justify-center text-black font-black text-[11px] tabular-nums">
                  {timeStr}
                </div>
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-Dashboard') {
        return (
          <div className="flex-1 flex bg-black p-4 gap-4 w-full h-full text-white">
            <div className="bg-zinc-900/50 rounded-[18px] border border-white/5 flex-1 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[7.5px] font-black uppercase tracking-[0.25em] text-white/20">System Deck</span>
                <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-blue-500" />)}
                </div>
              </div>
              <div className="flex-1 flex items-end gap-1 mb-2 h-10 mt-1">
                {[40, 70, 30, 90, 60, 45, 80, 55, 100, 75, 40, 60].map((h, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ height: [`15%`, `${h}%`, `15%`] }}
                    transition={{ duration: 1.2 + i*0.08, repeat: Infinity }}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm" 
                  />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-black leading-none">12.8% CPU</span>
                <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 text-[6.5px] font-black text-blue-400">
                  <Activity className="w-1.5 h-1.5" />
                  <span>STABLE</span>
                </div>
              </div>
            </div>
            <div className="w-[130px] flex flex-col gap-2.5 shrink-0">
              <div className="flex-1 bg-zinc-900 rounded-[14px] border border-white/5 flex flex-col items-center justify-center py-1.5">
                <div className="w-7 h-7 rounded-full border-[2.5px] border-emerald-500/20 flex items-center justify-center relative">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="282" strokeDashoffset={282*0.15} />
                  </svg>
                  <Zap className="w-3 h-3 text-emerald-500 fill-current" />
                </div>
                <span className="text-[9px] font-black mt-1">85% Power</span>
              </div>
              <div className="bg-blue-600 rounded-[12px] py-1.5 flex items-center justify-center shadow-lg shadow-blue-500/20 text-[9px] font-black uppercase tracking-wider">
                Stealth
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-C1') {
        return (
          <div className="flex-1 flex flex-col justify-center px-10 gap-5 bg-zinc-950 w-full h-full text-white">
            <div className="flex flex-col gap-1.5 text-left">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Core Battery</span>
                <span className="text-[18px] font-black">85%</span>
              </div>
              <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-green-400 w-[85%]" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">System Link</span>
                <span className="text-[18px] font-black">Connected</span>
              </div>
              <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-400 w-full" />
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-01-Art') {
        return (
          <div className="flex-1 relative overflow-hidden w-full h-full text-white">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1280px-Great_Wave_off_Kanagawa2.jpg" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/40" />
            <div className="absolute bottom-5 left-8 flex flex-col gap-0.5 z-20 text-left">
              <span className="text-[28px] font-black tracking-tighter leading-none">{timeStr}</span>
              <span className="text-[9px] font-black uppercase tracking-wider text-white/60">Zen Wave Master</span>
            </div>
            <div className="absolute top-5 right-8 z-20">
              <div className="px-3 py-1.5 bg-white/5 backdrop-blur-3xl rounded-[14px] border border-white/20 flex flex-col items-center">
                <span className="text-[12px] font-black">24° Clear</span>
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-14-Pop') {
        return (
          <div className="flex-1 flex items-center justify-around bg-[#ffeb3b] px-8 relative overflow-hidden w-full h-full text-black">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(black 2px, transparent 0)', backgroundSize: '15px 15px' }} />
            <div className="relative px-8 py-3 bg-[#f44336] border-[4px] border-black -rotate-3 shadow-[8px_8px_0_black]">
              <span className="text-[32px] font-black text-white italic tracking-tighter uppercase leading-none" style={{ WebkitTextStroke: '1.2px black' }}>Kaboom!</span>
            </div>
            <div className="flex flex-col gap-2 text-left shrink-0">
              <span className="text-[22px] font-black italic">9:41</span>
              <div className="px-3 py-1 bg-blue-500 border-[3px] border-black shadow-[4px_4px_0_#000] text-[8px] font-black uppercase text-white">
                Active Power
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-Synth') {
        return (
          <div className="flex-1 bg-[#02040a] relative overflow-hidden flex flex-col w-full h-full text-white">
            <div className="absolute inset-0 opacity-30" style={{ 
              backgroundImage: 'linear-gradient(#ff0080 1px, transparent 1px), linear-gradient(90deg, #ff0080 1px, transparent 1px)', 
              backgroundSize: '25px 25px', 
              transform: 'perspective(300px) rotateX(60deg) translateY(-30px) scale(1.3)' 
            }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent z-10" />
            <div className="relative z-20 flex-1 flex flex-col items-center justify-center">
              <span className="text-[48px] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ff0080] via-[#7c3aed] to-[#06b6d4] italic uppercase tracking-tighter leading-none">NOVA</span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-cyan-400 mt-1">Cyber Interface</span>
            </div>
            <div className="absolute top-5 right-6 flex flex-col items-end">
              <span className="text-[18px] font-black text-white italic tracking-tighter tabular-nums">{timeStr}</span>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-M2-Retro') {
        return (
          <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col w-full h-full text-white">
            <div className="absolute inset-0 opacity-40" style={{ 
              backgroundImage: 'linear-gradient(#ff0080 1px, transparent 1px), linear-gradient(90deg, #ff0080 1px, transparent 1px)', 
              backgroundSize: '30px 30px', 
              transform: 'perspective(300px) rotateX(65deg) translateY(-35px)' 
            }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
            <div className="relative z-20 flex-1 flex items-center justify-center">
              <span className="text-[48px] font-black text-transparent bg-clip-text bg-gradient-to-b from-pink-500 to-purple-800 italic uppercase tracking-tighter leading-none">Synth</span>
            </div>
            <div className="absolute top-5 right-6 flex flex-col items-end">
              <span className="text-[18px] font-black italic tabular-nums">{timeStr}</span>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-02-Retro') {
        return (
          <div className="flex-1 flex items-center justify-around px-8 bg-zinc-950 relative overflow-hidden w-full h-full text-white">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center">
              <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[8px] font-black uppercase tracking-widest text-cyan-500">Core Sync</span>
              <span className="text-[20px] font-black leading-none">ACTIVE</span>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-1-Pop') {
        return (
          <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-zinc-950 w-full h-full text-white">
            <div className="absolute w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500 opacity-20 blur-[40px]" />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[38px] font-black leading-none tabular-nums">{timeStr}</span>
              <div className="mt-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[8.5px] font-black uppercase tracking-wider text-purple-400">
                Spectrum Mode
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'Moderno') {
        return (
          <div className="flex-1 flex bg-white/5 w-full h-full p-4 gap-4 text-white">
            <div className="flex items-center gap-3 w-[150px] text-left">
              <div className="w-[44px] h-[44px] rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-900 flex items-center justify-center">
                <Music className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black truncate leading-tight">Blinding Lights</span>
                <span className="text-[8px] font-bold text-blue-400 truncate mt-0.5">The Weeknd</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center pl-3 border-l border-white/5 text-left">
              <span className="text-[12px] font-black">{time.toLocaleString([], { month: 'short', day: 'numeric' })}</span>
              <span className="text-[7.5px] font-black uppercase text-blue-500 tracking-wider mt-0.5">Agenda</span>
              <div className="mt-1 flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/5 text-[7px] font-black truncate text-white/80">
                <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                <span>10:00 AM - Mock Meeting</span>
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'Mínimo') {
        return (
          <div className="flex-1 flex items-center px-8 gap-8 bg-white/5 w-full h-full text-white">
            <div className="flex items-center gap-3 min-w-0 max-w-[50%] text-left">
              <div className="w-[40px] h-[40px] rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-900 flex items-center justify-center">
                <Music className="w-4 h-4 text-white/20 animate-pulse" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black truncate">Blinding Lights</span>
                <span className="text-[7.5px] font-bold opacity-30 truncate mt-0.5">The Weeknd</span>
              </div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <span className="text-[28px] font-black leading-none text-blue-400 tabular-nums">
              {timeStr}
            </span>
          </div>
        );
      }
      if (templateId === 'ID-Runner') {
        return (
          <div className="flex-1 flex items-center justify-center bg-[#050810] w-full h-full text-white">
            <div className="flex items-center gap-6 relative z-10">
              <span className="text-[38px] font-black italic tracking-tighter leading-none tabular-nums">{timeStr}</span>
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/5 relative">
                <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Notchly Pro</span>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-Glass-Pro') {
        return (
          <div className="flex-1 p-3 flex items-stretch w-full h-full text-white">
            <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-[16px] border border-white/10 shadow-2xl p-4 flex items-center justify-between">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[7.5px] font-black uppercase tracking-widest text-white/40">Premium Surface</span>
                <span className="text-[28px] font-black tracking-tighter tabular-nums">{timeStr}</span>
              </div>
              <Cloud className="w-7 h-7 text-white/80" />
            </div>
          </div>
        );
      }
      if (templateId === 'ID-Horizon') {
        return (
          <div className="flex-1 bg-black flex flex-col items-center justify-center w-full h-full text-white relative overflow-hidden">
            <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_right,#ff008033_1px,transparent_1px),linear-gradient(to_bottom,#ff008033_1px,transparent_1px)] bg-[size:20px_20px] [perspective:300px] [transform:rotateX(60deg)]" />
            <div className="w-32 h-16 bg-gradient-to-t from-pink-500 to-yellow-300 rounded-t-full relative flex flex-col items-center justify-end pb-1" />
            <div className="absolute top-3 flex flex-col items-center">
              <span className="text-[32px] font-black text-white tracking-widest leading-none tabular-nums">{timeStr}</span>
              <span className="text-[7px] font-black uppercase tracking-widest text-pink-500 mt-0.5">Horizon v2</span>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-Neon-Media') {
        return (
          <div className="flex-1 flex bg-[#030008] border border-pink-500/30 rounded-[20px] p-4 gap-4 text-white w-full h-full relative overflow-hidden">
            <div className="absolute -inset-10 bg-gradient-to-tr from-pink-500/10 to-cyan-500/10 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 shrink-0 w-[160px]">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-12 h-12 rounded-full border-2 border-pink-500 flex items-center justify-center relative shadow-lg bg-black/40">
                <Music className="w-6 h-6 text-pink-500" />
                <div className="absolute w-3 h-3 bg-cyan-400 rounded-full border border-black -top-0.5" />
              </motion.div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[13px] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 truncate leading-tight">Blinding Lights</span>
                <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mt-0.5 truncate">The Weeknd</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-1 border-l border-white/5 pl-4">
              <div className="flex justify-between items-center text-[7.5px] font-black opacity-30 tracking-wider">
                <span>Audio Wave</span>
                <span>STEREO</span>
              </div>
              <div className="flex gap-[2px] h-8 items-end">
                {[40, 90, 60, 100, 30, 80, 50, 90, 70, 40].map((h, i) => (
                  <motion.div key={i} animate={{ height: [`20%`, `${h}%`, `20%`] }} transition={{ duration: 0.8 + i*0.08, repeat: Infinity }} className="flex-1 bg-gradient-to-t from-pink-500 to-cyan-400 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-Glass-Weather') {
        return (
          <div className="flex-1 flex bg-white/5 border border-white/10 rounded-[20px] p-4 gap-4 text-white w-full h-full relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-3 shrink-0">
              <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <Cloud className="w-10 h-10 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
              </motion.div>
              <div className="flex flex-col text-left">
                <span className="text-[22px] font-black leading-none">24°C</span>
                <span className="text-[8px] font-black uppercase text-blue-300 tracking-wider mt-0.5">Atmosphere</span>
              </div>
            </div>
            <div className="flex-1 flex justify-around items-center border-l border-white/10 pl-4">
              <div className="flex flex-col items-center">
                <span className="text-[7.5px] font-black opacity-40">Wind</span>
                <span className="text-[11px] font-black text-cyan-400">12 km/h</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[7.5px] font-black opacity-40">Humidity</span>
                <span className="text-[11px] font-black text-blue-400">65%</span>
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-Device-Manager') {
        return (
          <div className="flex-1 flex bg-zinc-950 border border-white/5 rounded-[20px] p-4 gap-4 text-white w-full h-full justify-between items-center">
            <div className="flex flex-col items-start gap-0.5 shrink-0 w-[110px] text-left">
              <span className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">Device Hub</span>
              <h3 className="text-[14px] font-black">4 Connected</h3>
              <Bluetooth className="w-3.5 h-3.5 text-indigo-400 animate-pulse mt-1" />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2 h-full">
              {[
                { name: 'Sony XM5', battery: 90 },
                { name: 'MX Master', battery: 80 },
                { name: 'MX Keys', battery: 100 },
                { name: 'Galaxy Phone', battery: 74 }
              ].map((dev, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-1.5 flex items-center justify-between text-left">
                  <span className="text-[8px] font-black text-white/90 truncate max-w-[50px]">{dev.name}</span>
                  <span className="text-[8px] font-black text-indigo-400 leading-none">{dev.battery}%</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      if (templateId === 'ID-Orbit-Music') {
        return (
          <div className="flex-1 flex bg-[#03010b] border border-purple-500/20 rounded-[20px] p-4 gap-4 text-white w-full h-full relative overflow-hidden">
            <div className="flex items-center justify-center shrink-0 w-[120px] relative">
              <div className="absolute inset-0 border border-dashed border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="w-11 h-11 rounded-full border border-purple-500/40 flex items-center justify-center relative bg-black/80">
                <Music className="w-5 h-5 text-purple-400" />
                <div className="absolute w-2 h-2 bg-cyan-400 rounded-full border border-black -top-1" />
              </motion.div>
            </div>
            <div className="flex-1 flex flex-col justify-between text-left py-1 border-l border-white/5 pl-4">
              <div className="flex flex-col">
                <span className="text-[7px] font-black uppercase text-purple-400 tracking-[0.2em]">Cosmic Orbit</span>
                <h2 className="text-[13px] font-black text-white truncate max-w-[140px] mt-0.5">Blinding Lights</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-0.5 bg-purple-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 w-1/3" />
                </div>
                <span className="text-[6.5px] font-black text-purple-400">1:12 / 3:45</span>
              </div>
            </div>
          </div>
        );
      }
      if (templateId === 'ID-iPhone-Pro') {
        return (
          <div className="flex-1 flex flex-col bg-black border border-white/5 rounded-[20px] p-4 gap-3 text-white w-full h-full relative overflow-hidden select-none">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[10px] overflow-hidden shrink-0 border border-white/10 bg-zinc-900 relative shadow-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[13px] font-black text-white truncate max-w-[130px] leading-tight">Blinding Lights</span>
                  <span className="text-[9px] font-bold text-zinc-400 truncate max-w-[130px] mt-0.5">The Weeknd</span>
                </div>
              </div>
              <div className="flex gap-[2.5px] h-6 items-end px-2">
                {[30, 80, 50, 90, 40].map((h, i) => (
                  <motion.div key={i} animate={{ height: [`20%`, `${h}%`, `20%`] }} transition={{ duration: 0.5 + i*0.08, repeat: Infinity }} className="w-[2px] bg-emerald-400 rounded-full" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full mt-0.5">
              <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden w-full relative">
                <div className="h-full bg-white rounded-full w-1/3" />
              </div>
              <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 font-mono">
                <span>0:45</span>
                <span>-2:50</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-0.5 w-full">
              <button className="text-white opacity-60"><SkipBack className="w-4 h-4" /></button>
              <button className="w-7 h-7 bg-white text-black rounded-full flex items-center justify-center"><Play className="w-4 h-4 fill-current ml-0.5" /></button>
              <button className="text-white opacity-60"><SkipForward className="w-4 h-4" /></button>
            </div>
          </div>
        );
      }
      // Fallback
      return (
        <div className="flex-1 flex items-center justify-center bg-zinc-900 w-full h-full text-white">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg mb-2">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{templateId.replace('ID-', '')} Mode</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // ── Generador del trazado físico y el marco del previsualizador de la Isla ──
  const renderMockupIsland = () => {
    let w = 440;
    let h = 66;
    let r = 33;
    let superPill = false;

    if (previewState === 'superPill') {
      w = 72;
      h = 42;
      superPill = true;
    } else if (previewState === 'expanded') {
      w = 680;
      h = previewT.startsWith('ID-') ? 300 : 180;
      r = 50;
    } else {
      const isCompact = previewT.startsWith('ID-');
      w = isCompact ? 112 : 440;
      h = isCompact ? 52 : 66;
      r = isCompact ? 26 : 33;
    }

    const totalW = w + 68;
    const neck = 42;

    // Generar path
    let islandD = '';
    if (dockMode === 'floating') {
      const rad = (previewState === 'superPill') ? h / 2 : (previewState === 'expanded' ? 32 : h / 2);
      islandD = `M ${rad} 0 H ${totalW - rad} A ${rad} ${rad} 0 0 1 ${totalW} ${rad} V ${h - rad} A ${rad} ${rad} 0 0 1 ${totalW - rad} ${h} H ${rad} A ${rad} ${rad} 0 0 1 0 ${h - rad} V ${rad} A ${rad} ${rad} 0 0 1 ${rad} 0 Z`;
    } else if (superPill) {
      islandD = `M 0 0 C ${neck} 0, ${neck} ${h}, ${totalW/2} ${h} S ${totalW-neck} 0, ${totalW} 0 Z`;
    } else {
      islandD = `M 0 0 A ${r} ${r} 0 0 1 ${r} ${r} V ${h-r} A ${r} ${r} 0 0 0 ${r*2} ${h} H ${totalW-(r*2)} A ${r} ${r} 0 0 0 ${totalW-r} ${h-r} V ${r} A ${r} ${r} 0 0 1 ${totalW} 0 Z`;
    }

    // Escalar para que quepa en el panel del simulador de ancho ~300px
    let scale = 0.52;
    if (previewState === 'superPill') scale = 0.95;
    else if (previewState === 'expanded') scale = 0.38; // Escala más compacta para evitar solapamiento con la barra de tareas
    else if (previewT.startsWith('ID-')) scale = 0.9; // Escala más legible para carátula compacta en modo colapsado

    const scaledW = totalW * scale;
    const scaledH = h * scale;

    return (
      <div 
        className="relative flex items-center justify-center overflow-visible select-none pointer-events-none transition-all duration-300"
        style={{ width: scaledW, height: scaledH }}
      >
        {/* Contenedor interno unificado a escala 1:1, escalado completo por CSS transform */}
        <div 
          className="absolute"
          style={{
            width: totalW,
            height: h,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* SVG de fondo */}
          <svg 
            width={totalW} 
            height={h} 
            viewBox={`0 0 ${totalW} ${h}`} 
            className="absolute inset-0 overflow-visible pointer-events-none"
          >
            {/* Brillo de Aura en el Simulador */}
            {previewA && (
              <path
                d={islandD}
                fill="none"
                stroke={previewA}
                strokeWidth="4.5"
                style={{ filter: 'blur(8px)', opacity: 0.65 }}
              />
            )}
            
            {/* Fondo de la Isla */}
            <path
              d={islandD}
              fill="rgba(10, 10, 10, 0.95)"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.5"
            />
          </svg>

          {/* Contenido alineado exactamente como en la isla física real */}
          <div 
            className="absolute overflow-hidden"
            style={{
              left: superPill ? 10 : 34,
              right: superPill ? 10 : 34,
              top: 0,
              bottom: 0,
            }}
          >
            {renderMockupContent(previewT, previewState, simTime)}
          </div>
        </div>
      </div>
    );
  };

  // Buscar nombre y categoría del template de previsualización
  const selectedTmplInfo = templates.find((t: any) => t.id === previewT) || { name: 'Original Pro', category: 'Básicos' };

  return (
    <div className="flex-1 flex flex-col overflow-hidden no-drag h-full" onPointerDown={(e) => e.stopPropagation()}>
      
      {/* DISEÑO EN PANTALLA COMPLETA O DIVIDIDA SEGÚN MODO DE DOCK */}
      <div className={clsx(
        "flex-1 flex overflow-hidden gap-6 min-h-0",
        isSideDock ? "flex-col overflow-y-auto pr-1" : "flex-row"
      )}>
        
        {/* PANEL IZQUIERDO: SIMULADOR DE ISLA / GOTA */}
        <div className={clsx(
          "flex flex-col gap-4 bg-zinc-950/60 p-5 rounded-[32px] border border-white/5 shrink-0 shadow-2xl backdrop-blur-md justify-between",
          isSideDock ? "w-full" : "w-[300px]"
        )}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400">Live Preview</span>
              <span className="text-[7.5px] font-bold text-white/30 uppercase tracking-widest">Simulator v2.1</span>
            </div>
            
            {/* Escritorio Simulador */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-tr from-slate-950 via-[#100620] to-[#0a0c28] shadow-inner flex flex-col justify-between p-2">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12)_0%,transparent_60%)] pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

              {/* Posición de la Isla en el escritorio */}
              <div className="w-full flex justify-center pt-2">
                {renderMockupIsland()}
              </div>
              
              {/* Barra de tareas simulada */}
              <div className="w-[85%] mx-auto h-6 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 flex items-center justify-between px-3 shadow-lg pointer-events-none select-none mb-1">
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 rounded bg-blue-500/80" />
                  <div className="w-2.5 h-[1px] bg-white/30 rounded-full" />
                  <div className="w-1.5 h-[1px] bg-white/20 rounded-full" />
                </div>
                <div className="flex gap-1.5 items-center">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  <div className="w-4 h-1.5 bg-white/20 rounded-sm" />
                  <span className="text-[6px] text-white/40 font-black tabular-nums">
                    {simTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Info de carátula seleccionada */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-left">
              <span className="text-[7.5px] font-black uppercase text-indigo-400 tracking-wider">Diseño a Probar</span>
              <h3 className="text-[12px] font-black text-white leading-tight mt-0.5 truncate">{selectedTmplInfo.name}</h3>
              <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest mt-1">Colección: {selectedTmplInfo.category}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Selector de modo para el simulador */}
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40 px-1">Ver en Estado:</span>
              <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                {[
                  { id: 'collapsed', label: 'Normal' },
                  { id: 'superPill', label: 'Gota' },
                  { id: 'expanded', label: 'Expandido' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setPreviewState(st.id as any)}
                    className={clsx(
                      "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all",
                      previewState === st.id ? "bg-white text-black shadow-md" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    )}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Botón de acción global para aplicar en la isla real */}
            <button
              onClick={() => onApplyT(previewT)}
              disabled={currentT === previewT}
              className={clsx(
                "w-full py-2.5 rounded-xl text-[9px] font-black uppercase transition-all shadow-lg pointer-events-auto",
                currentT === previewT 
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 cursor-default" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 active:scale-95"
              )}
            >
              {currentT === previewT ? 'Diseño Activo' : 'Aplicar a la Isla Real'}
            </button>
          </div>
        </div>

        {/* PANEL DERECHO: CATÁLOGO DE DISEÑOS Y AURAS */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-6 pb-10 no-drag scroll-smooth">
          
          {/* Banner de Bienvenida a la Tienda */}
          <div className="relative h-20 shrink-0 rounded-[24px] overflow-hidden group shadow-2xl border border-white/5">
            <img 
              src="file:///C:/Users/chiva/.gemini/antigravity/brain/eb88c411-c6cd-4f1f-8f46-6a5391ef8bf5/store_banner_1776452850851.png" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-5">
              <h2 className="text-[16px] font-black uppercase tracking-tighter text-white drop-shadow-md">{t.tienda}</h2>
              <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">{t.tiendaDesc}</p>
            </div>
          </div>

          {/* Grouped Templates by Category */}
          {['Básicos', 'Batería', 'Pro', 'Arte', 'Retro', 'Pop-Culture'].map((cat: any) => {
            const catTemplates = templates.filter((t: any) => t.category === cat);
            if (catTemplates.length === 0) return null;
            
            return (
              <div key={cat} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className={clsx("w-1 h-3 rounded-full", 
                    cat === 'Batería' ? "bg-emerald-500" : 
                    cat === 'Arte' ? "bg-blue-500" : 
                    cat === 'Retro' ? "bg-purple-500" : 
                    cat === 'Pop-Culture' ? "bg-pink-500" : "bg-zinc-500"
                  )} />
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Colección {cat}</span>
                </div>
                <div className={clsx(
                  "grid gap-3",
                  isSideDock ? "grid-cols-1" : "grid-cols-3"
                )}>
                  {catTemplates.map((tmpl: any) => {
                    const isPreviewing = previewT === tmpl.id;
                    const isActive = currentT === tmpl.id;
                    
                    return (
                      <div 
                        key={tmpl.id}
                        onClick={() => setPreviewT(tmpl.id)}
                        className={clsx(
                          "p-3 rounded-[24px] border transition-all pointer-events-auto cursor-pointer group/card flex flex-col justify-between text-left", 
                          isPreviewing 
                            ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]" 
                            : isActive
                              ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
                              : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.08]"
                        )}
                      >
                        <div>
                          {/* Mini visualizador de la tarjeta */}
                          <div className="aspect-[16/10] rounded-xl bg-zinc-950/80 mb-2.5 flex items-center justify-center overflow-hidden border border-white/10 group-hover/card:border-white/20 transition-colors">
                            <div className="scale-90 group-hover/card:scale-95 transition-transform duration-500">
                              {tmpl.preview}
                            </div>
                          </div>
                          <div className="flex justify-between items-start px-0.5">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] font-black uppercase tracking-tight text-white/90 truncate">{tmpl.name}</span>
                              <span className="text-[6.5px] font-bold text-white/40 uppercase tracking-widest">{cat} Collection</span>
                            </div>
                            <div className={clsx(
                              "px-1.5 py-0.5 rounded-full text-[6px] font-black uppercase",
                              isActive 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : isPreviewing
                                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            )}>
                              {isActive ? 'Activo' : isPreviewing ? 'Probando' : 'Pro'}
                            </div>
                          </div>
                        </div>

                        {/* Botón de previsualización / acción rápida */}
                        <div className="mt-3 flex gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewT(tmpl.id);
                            }}
                            className={clsx(
                              "flex-1 py-1.5 rounded-lg text-[7.5px] font-black uppercase tracking-tight transition-all",
                              isPreviewing 
                                ? "bg-indigo-600 text-white" 
                                : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                            )}
                          >
                            Previsualizar
                          </button>
                          
                          {!isActive && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onApplyT(tmpl.id);
                              }}
                              className="px-2 py-1.5 rounded-lg bg-blue-600 text-white text-[7.5px] font-black uppercase hover:bg-blue-500 transition-all active:scale-90"
                            >
                              Aplicar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Auras Section */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500">Auras de Contorno</span>
            </div>
            <div className={clsx(
              "grid gap-3",
              isSideDock ? "grid-cols-2" : "grid-cols-4"
            )}>
              {auras.map((aura: any) => {
                const isPreviewing = previewA === aura.color;
                
                return (
                  <button 
                    key={aura.id} 
                    onClick={() => {
                      setPreviewA(aura.color);
                      onApplyA(aura.color); // Aplica de inmediato en la isla física y en el simulador
                    }}
                    className={clsx(
                      "p-3 rounded-[20px] border transition-all flex flex-col items-center gap-2 pointer-events-auto group/aura text-left",
                      isPreviewing 
                        ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                        : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.08]"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full shadow-lg relative flex items-center justify-center" style={{ border: `2px solid ${aura.color === 'url(#rainbowGradient)' ? '#ff00ff' : aura.color}` }}>
                      {/* Fondo círculo aura */}
                      <div className="w-6 h-6 rounded-full opacity-60" style={{ background: aura.color === 'url(#rainbowGradient)' ? 'linear-gradient(45deg, red, yellow, green, blue, purple)' : `linear-gradient(45deg, ${aura.color}, transparent)` }} />
                      {isPreviewing && (
                        <div className="absolute inset-[-4px] rounded-full animate-ping opacity-15" style={{ backgroundColor: aura.color === 'url(#rainbowGradient)' ? '#ff00ff' : aura.color }} />
                      )}
                    </div>
                    <span className="text-[7.5px] font-black uppercase opacity-60 text-center tracking-wider truncate w-full">{aura.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export const DynamicIsland = () => {
  const [isHovered, setIsHovered]     = useState(false);
  const [isPinned, setIsPinned]       = useState(() => {
    const saved = localStorage.getItem('isPinned');
    // Force true if never set or user is having trouble
    if (saved === null) return true;
    return JSON.parse(saved);
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeView, setActiveView]   = useState<'Resumen' | 'Sistema' | 'Multimedia' | 'Notificación' | 'Herramientas' | 'Llamada' | 'Actualización' | 'WhatsApp' | 'YouTube' | 'Tienda'>('Resumen');
  const [lang, setLang]               = useState<'es' | 'en' | 'zh'>('es');
  const [isLightMode, setIsLightMode] = useState(false);
  const [summaryTemplate, setSummaryTemplate] = useState<string>(() => (localStorage.getItem('summaryTemplate') as any) || 'Moderno');
  const [visibleTabs, setVisibleTabs] = useState<string[]>(['Resumen', 'Sistema', 'Multimedia', 'Llamada', 'Notificación', 'Herramientas', 'WhatsApp', 'YouTube', 'Actualización', 'Tienda']);
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
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    let battObj: any = null;
    const onLvlChange = () => { if (battObj) setBatteryLevel(Math.round(battObj.level * 100)); };
    const onChgChange = () => { if (battObj) setIsCharging(battObj.charging); };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        battObj = batt;
        setBatteryLevel(Math.round(batt.level * 100));
        setIsCharging(batt.charging);
        batt.addEventListener('levelchange', onLvlChange);
        batt.addEventListener('chargingchange', onChgChange);
      });
    }
    return () => {
      if (battObj) {
        battObj.removeEventListener('levelchange', onLvlChange);
        battObj.removeEventListener('chargingchange', onChgChange);
      }
    };
  }, []);

  const [timerTime, setTimerTime]      = useState(0);
  const [currentVersion, setCurrentVersion] = useState('0.0.0');
  const [updateInfo, setUpdateInfo]    = useState<{version: string, status: 'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error' | 'no-update', error?: string} | null>(null);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [timerTotal, setTimerTotal]    = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [notifStatus, setNotifStatus] = useState<string>('Pending...');
  const [timerActive, setTimerActive]  = useState(false);
  const [timerHours, setTimerHours]    = useState(0);
  const [timerMins, setTimerMins]      = useState(25);
  const [timerSecs, setTimerSecs]      = useState(0);
  const timerRef = useRef<any>(null);
  const lastCommandTimeRef = useRef(0);
  const volDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [superPill, setSuperPill] = useState(() => JSON.parse(localStorage.getItem('superPill') || 'false'));
  const [superPillMode, setSuperPillMode] = useState<'Auto' | 'Multimedia' | 'Clima'>('Auto');
  const [dockMode, setDockMode] = useState<'top' | 'floating' | 'left' | 'right'>(() => (localStorage.getItem('dockMode') as any) || 'top');
  const [floatingOffset] = useState<number>(6);
  const [auraColor, setAuraColor] = useState(() => localStorage.getItem('auraColor') || '#3b82f6');
  const stopColorVal = (auraColor && auraColor.startsWith('url(')) ? '#a855f7' : (auraColor || '#3b82f6');
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
  const isSideDock = dockMode === 'left' || dockMode === 'right';
  const superPillW = (dockMode === 'floating') ? 56 : 72;
  const superPillH = (dockMode === 'floating') ? 32 : 42;
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
    let order = saved ? JSON.parse(saved) : ['Resumen', 'Multimedia', 'Herramientas', 'Notificación', 'Actualización', 'WhatsApp', 'YouTube', 'Sistema', 'Llamada', 'Tienda'];
    if (saved && !order.includes('Tienda')) {
      order.push('Tienda');
      localStorage.setItem('tabOrder', JSON.stringify(order));
    }
    return order;
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
          if (!sourceId) {
            throw new Error('No system audio ID available');
          }
          if (!active) return;

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
    es: { resumen:'Resumen', sistema:'Sistema', multimedia:'Multimedia', llamada:'Llamada', notificacion:'Notificación', herramientas:'Herramientas', empty:'Limpio', now:'AHORA', settings:'AJUSTES', template:'Diseño', moderno:'Moderno', minimo:'Mínimo', clasico:'Clásico', lang:'Idioma', visibility:'Pestañas', clear:'Borrar todo', theme:'Apariencia', light:'Claro', dark:'Oscuro', timer:'Temporizador', start:'Iniciar', pause:'Pausar', reset:'Reiniciar', weatherLoc:'Ubicación Clima', whatsapp:'WhatsApp', youtube:'YouTube', autoLaunch:'Auto-inicio', update:'Actualización', rhythmGlow: 'Contorno Dinámico', updVers: 'Versión Actual:', updChan: 'Canal: Estable', updStatus: 'Estado del Sistema', updIdle: 'Haz clic para buscar la versión más reciente.', updWait: 'Verificando...', updErr: 'Error de Red', updRetry: 'Reintentar', updNew: 'Nueva Versión', updDesc: 'Mejoras de rendimiento y correcciones.', updBtn: 'Descargar Ahora', updSkip: 'Omitir', updLoad: 'Recibiendo Paquete...', updReady: 'Lista para Instalar', updReadyDesc: 'La descarga ha finalizado. Reinicia Notchly.', updInstall: 'Reiniciar e Instalar', updNone: 'Estás en la última versión', notifPerm: 'Acceso Notificaciones', notifStatusLabel: 'Estado:', notifReq: 'Solicitar Acceso', calSync: 'Sincronizar Calendario', closeApp: 'Cerrar Aplicación' },
    en: { resumen:'Summary', sistema:'System', multimedia:'Media', llamada:'Call', notificacion:'Alerts', herramientas:'Tools', empty:'Clean', now:'NOW', settings:'SETTINGS', template:'Design', moderno:'Modern', minimo:'Minimal', clasico:'Classic', lang:'Language', visibility:'Tabs', clear:'Clear all', theme:'Theme', light:'Light', dark:'Dark', timer:'Timer', start:'Start', pause:'Pause', reset:'Reset', weatherLoc:'Weather Location', whatsapp:'WhatsApp', youtube:'YouTube', autoLaunch:'Auto-Launch', update:'Update', rhythmGlow: 'Rhythm Glow', updVers: 'Current Version:', updChan: 'Channel: Stable', updStatus: 'System Status', updIdle: 'Click below to check for the latest version.', updWait: 'Checking...', updErr: 'Network Error', updRetry: 'Retry', updNew: 'New Version', updDesc: 'Performance improvements and bug fixes.', updBtn: 'Download Now', updSkip: 'Skip', updLoad: 'Receiving Package...', updReady: 'Ready to Install', updReadyDesc: 'Download finished. Restart Notchly to apply.', updInstall: 'Restart and Install', updNone: 'You are up to date', notifPerm: 'Notification Access', notifStatusLabel: 'Status:', notifReq: 'Request Access', calSync: 'Sync Calendar', closeApp: 'Close Application' },
    zh: { resumen:'摘要', sistema:'系统', multimedia:'多媒体', llamada:'通话', notificacion:'通知', herramientas:'工具', empty:'无内容', now:'现在', settings:'设置', template:'设计', moderno:'现代', minimo:'极简', clasico:'经典', lang:'语言', visibility:'标签页', clear:'全部清除', theme:'主题', light:'浅色', dark:'深色', timer:'计时器', start:'开始', pause:'暂停', reset:'重置', weatherLoc:'天气位置', whatsapp:'WhatsApp', youtube:'YouTube', autoLaunch:'自动启动', update:'更新', rhythmGlow: '节奏光晕', updVers: '当前版本:', updChan: '频道: 稳定版', updStatus: '系统状态', updIdle: '点击下方以检查最新版本。', updWait: '正在检查...', updErr: '网络错误', updRetry: '重试', updNew: '新版本', updDesc: '性能改进和错误修复。', updBtn: '立即下载', updSkip: '跳过', updLoad: '正在接收更新包...', updReady: '准备安装', updReadyDesc: '下载完成。重新启动 Notchly 以应用。', updInstall: '立即重启并安装', updNone: '已是最新版本', notifPerm: '通知访问', notifStatusLabel: '状态:', notifReq: '请求访问', calSync: '同步日历', closeApp: '关闭应用程序' },
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
        setUpdateInfo({ version: '', status: 'no-update' });
        setTimeout(() => setUpdateInfo(null), 4000);
      });
      ipc.on('calendar-update', (_: any, data: any[]) => {
        setEvents(data);
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

    (window as any).ipcRenderer?.invoke('get-notif-permission-status').then((s: string) => setNotifStatus(s));

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
        ipc.removeAllListeners('calendar-update');
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
        g.gain.linearRampToValueAtTime(0.9, ctx.currentTime + s + 0.05);
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

  // Window and State synchronization
  useEffect(() => {
    const ipc = (window as any).ipcRenderer;
    const isLarge = isHovered || isPinned || showSettings;
    
    const isCompact = summaryTemplate.startsWith('ID-');
    let totalW = (isCompact ? 112 : 440) + 68;
    let h_target = isCompact ? 52 : 66;

    if (dockMode === 'left' || dockMode === 'right') {
      if (isLarge) {
        totalW = showSettings ? 560 : 360;
        h_target = 400;
      } else {
        totalW = 44;
        h_target = 120;
      }
    } else if (dockMode === 'floating') {
      if (isLarge) {
        totalW = (showSettings ? 720 : (activeView === 'Multimedia' && showPreview ? 840 : (['WhatsApp', 'YouTube'].includes(activeView) ? 800 : 680))) + 68;
        h_target = showSettings ? 480 : (['Herramientas', 'Llamada', 'WhatsApp', 'YouTube', 'Tienda'].includes(activeView) ? 600 : (activeView === 'Actualización' ? 450 : (activeView === 'Sistema' ? 300 : (activeView === 'Resumen' && summaryTemplate.startsWith('ID-') ? 300 : 180))));
      } else {
        totalW = (superPill ? superPillW : (isCompact ? 112 : 440)) + 68;
        h_target = superPill ? superPillH : (isCompact ? 52 : 66);
      }
    } else {
      // top dock
      totalW = (showSettings ? 720 : isLarge ? (activeView === 'Multimedia' && showPreview ? 840 : (['WhatsApp', 'YouTube'].includes(activeView) ? 800 : 680)) : (superPill ? superPillW : (isCompact ? 112 : 440))) + 68;
      
      if (showSettings) h_target = 480;
      else if (isLarge) {
        if (['Herramientas', 'Llamada', 'WhatsApp', 'YouTube', 'Tienda'].includes(activeView)) h_target = 600;
        else if (activeView === 'Actualización') h_target = 450;
        else if (activeView === 'Sistema') h_target = 300;
        else if (activeView === 'Resumen') h_target = summaryTemplate.startsWith('ID-') ? 300 : 180;
        else h_target = 180;
      } else {
        h_target = superPill ? superPillH : (isCompact ? 52 : 66);
      }
    }
    
    ipc?.send('set-window-dimensions', { w: totalW, h: h_target });
    ipc?.send('set-is-expanded', isExpanded);
    ipc?.send('set-is-super-pill', superPill && !isExpanded);
    ipc?.send('set-bubbles-state', { 
      call: meeting.isActive && !isLarge, 
      controls: showControlsBubble && !isLarge 
    });
    
    const isInteractive = isExpanded || isHovered || isPinned || showSettings;
    ipc?.send('set-ignore-mouse-events', !isInteractive);
  }, [isExpanded, superPill, activeView, isHovered, isPinned, showSettings, showPreview, meeting.isActive, showControlsBubble, dockMode, floatingOffset]);

  // Sync dockMode and floatingOffset with Electron main process
  useEffect(() => {
    const ipc = (window as any).ipcRenderer;
    ipc?.send('set-dock-mode', dockMode);
    localStorage.setItem('dockMode', dockMode);
  }, [dockMode]);

  useEffect(() => {
    const ipc = (window as any).ipcRenderer;
    ipc?.send('set-floating-offset', floatingOffset);
    localStorage.setItem('floatingOffset', String(floatingOffset));
  }, [floatingOffset]);


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

  // Sync isPinned with main process and localStorage
  useEffect(() => {
    localStorage.setItem('isPinned', JSON.stringify(isPinned));
    (window as any).ipcRenderer?.send('set-always-on-top', true);
  }, [isPinned]);

  // Handle hover synchronization from OS-level mouse-proximity detector
  useEffect(() => {
    const ipc = (window as any).ipcRenderer;
    const handleHoverChanged = (_e: any, hover: boolean) => {
      if (!hover) {
        setIsHovered(false);
        if (showSettingsRef.current) {
          setShowSettings(false);
          setActiveView('Resumen');
        }
        setIsPinned(false);
      } else {
        if (!isPinnedRef.current && !showSettingsRef.current) {
          setIsHovered(true);
        }
      }
    };
    ipc?.on('hover-changed', handleHoverChanged);
    return () => {
      ipc?.removeAllListeners('hover-changed');
    };
  }, []);

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

  const storeTemplates = [
    { id: 'Moderno', name: 'Original Pro', category: 'Básicos', preview: <MiniIslandPreview><div className="flex items-center gap-12"><div className="w-24 h-24 bg-blue-500 rounded-[32px] shadow-2xl" /><div className="flex flex-col"><div className="w-40 h-4 bg-white/20 rounded-full" /><div className="w-24 h-2 bg-white/10 rounded-full mt-2" /></div></div></MiniIslandPreview> },
    { id: 'ID-Google', name: 'Material You 2.0', category: 'Básicos', preview: <MiniIslandPreview bg="bg-indigo-50"><div className="flex gap-4"><div className="w-16 h-16 rounded-3xl bg-indigo-200 shadow-xl" /><div className="w-32 h-8 rounded-2xl bg-indigo-100" /></div></MiniIslandPreview> },
    { id: 'ID-iOS', name: 'iOS Glass Max', category: 'Básicos', preview: <MiniIslandPreview bg="bg-zinc-800"><div className="w-48 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl" /></MiniIslandPreview> },
    { id: 'ID-Dashboard', name: 'Obsidian Deck', category: 'Básicos', preview: <MiniIslandPreview bg="bg-black"><div className="grid grid-cols-2 gap-2 w-48"><div className="h-6 bg-blue-500/40 rounded-xl" /><div className="h-6 bg-emerald-500/40 rounded-xl" /></div></MiniIslandPreview> },
    
    { id: 'ID-C1', name: 'Quantum Cells', category: 'Batería', preview: <MiniIslandPreview w={72} h={42}><div className="flex flex-col gap-1 w-8"><div className="h-1 w-full bg-emerald-500 rounded-full" /><div className="h-1 w-full bg-blue-500 rounded-full" /></div></MiniIslandPreview> },
    { id: 'ID-C2', name: 'Molten Copper', category: 'Batería', preview: <MiniIslandPreview w={72} h={42} bg="bg-[#1a0f0a]"><Zap className="w-6 h-6 text-amber-500" /></MiniIslandPreview> },
    { id: 'ID-C3', name: 'Crystal Stats', category: 'Batería', preview: <MiniIslandPreview w={72} h={42} bg="bg-zinc-900"><Activity className="w-5 h-5 text-blue-400" /></MiniIslandPreview> },
    { id: 'ID-C4', name: 'Aura Halo', category: 'Batería', preview: <MiniIslandPreview w={72} h={42}><div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></MiniIslandPreview> },
    
    { id: 'ID-Runner', name: 'Cyber Runner', category: 'Pro', preview: <MiniIslandPreview w={72} h={42} bg="bg-zinc-950"><div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><Activity className="w-4 h-4 text-blue-400 animate-pulse" /></div></MiniIslandPreview> },
    { id: 'ID-Glass-Pro', name: 'Glass Morphic Pro', category: 'Pro', preview: <MiniIslandPreview bg="bg-white/5"><div className="w-40 h-20 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20" /></MiniIslandPreview> },
    { id: 'ID-Horizon', name: 'Neon Horizon', category: 'Pro', preview: <MiniIslandPreview bg="bg-black"><div className="w-32 h-16 bg-gradient-to-t from-pink-500 to-transparent opacity-30 rounded-t-full" /></MiniIslandPreview> },
    { id: 'ID-Neon-Media', name: 'Neon Beats', category: 'Pro', preview: <MiniIslandPreview bg="bg-zinc-950"><div className="flex gap-4 items-center"><div className="w-8 h-8 rounded-full border-2 border-pink-500 flex items-center justify-center bg-black/40"><Music className="w-4 h-4 text-pink-500 animate-pulse" /></div><div className="flex flex-col gap-1 text-left"><div className="w-16 h-2 bg-pink-500 rounded" /><div className="w-10 h-1 bg-cyan-400 rounded" /></div></div></MiniIslandPreview> },
    { id: 'ID-Glass-Weather', name: 'Atmosphere Glass', category: 'Pro', preview: <MiniIslandPreview bg="bg-white/5"><div className="flex gap-3 items-center"><Cloud className="w-6 h-6 text-blue-400 animate-bounce" /><span className="text-[10px] font-black text-white">24°</span></div></MiniIslandPreview> },

    { id: 'ID-01-Art', name: 'Zen Wave', category: 'Arte', preview: <MiniIslandPreview bg="bg-[#0f172a]"><div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-purple-900/60" /><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/640px-Great_Wave_off_Kanagawa2.jpg" className="w-full h-full object-cover opacity-40 mix-blend-overlay" /></MiniIslandPreview> },
    { id: 'ID-M2-Art', name: 'Cyber Poly', category: 'Arte', preview: <MiniIslandPreview bg="bg-black"><div className="w-48 h-48 border-[1px] border-blue-500/40 rotate-45 flex items-center justify-center"><div className="w-32 h-32 border-[1px] border-blue-500/60 flex items-center justify-center"><div className="w-16 h-16 bg-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.3)]" /></div></div></MiniIslandPreview> },
    { id: 'ID-Orbit-Music', name: 'Cosmic Disk', category: 'Arte', preview: <MiniIslandPreview bg="bg-[#050014]"><div className="w-10 h-10 rounded-full border border-purple-500 flex items-center justify-center relative"><div className="absolute w-2 h-2 rounded-full bg-cyan-400 -top-1" /><Music className="w-3.5 h-3.5 text-purple-400" /></div></MiniIslandPreview> },
    
    { id: 'ID-M2-Retro', name: 'Synth Grid', category: 'Retro', preview: <MiniIslandPreview bg="bg-[#050505]"><div className="w-full h-full bg-[linear-gradient(to_right,#ff008033_1px,transparent_1px),linear-gradient(to_bottom,#ff008033_1px,transparent_1px)] bg-[size:30px_30px] [perspective:500px] [transform:rotateX(60deg)]" /></MiniIslandPreview> },
    { id: 'ID-01-Retro', name: 'Neon 1984', category: 'Retro', preview: <MiniIslandPreview bg="bg-purple-950"><span className="text-[100px] font-black text-transparent bg-clip-text bg-gradient-to-b from-pink-500 to-purple-800" style={{ filter: 'drop-shadow(0 0 15px #ff0080)' }}>84</span></MiniIslandPreview> },
    
    { id: 'ID-14-Pop', name: 'Action! Comic', category: 'Pop-Culture', preview: <MiniIslandPreview bg="bg-yellow-400"><div className="px-16 py-8 bg-red-600 border-[6px] border-black -rotate-6 shadow-[15px_15px_0_black]"><span className="text-6xl font-black text-white italic tracking-tighter">POW!</span></div></MiniIslandPreview> },
    { id: 'ID-Device-Manager', name: 'Device Hub', category: 'Básicos', preview: <MiniIslandPreview bg="bg-zinc-900"><div className="flex gap-2 items-center"><Wifi className="w-4 h-4 text-blue-400" /><Bluetooth className="w-4 h-4 text-indigo-400" /><Cpu className="w-4 h-4 text-emerald-400" /></div></MiniIslandPreview> },
    { id: 'ID-iPhone-Pro', name: 'iOS Music Pro', category: 'Pro', preview: <MiniIslandPreview bg="bg-black"><div className="flex justify-between items-center w-48 px-3"><div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center"><Music className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /></div><div className="flex gap-1 h-3 items-end"><div className="w-[2px] h-3 bg-emerald-400 rounded-full animate-bounce" /><div className="w-[2px] h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} /></div></div></MiniIslandPreview> },
  ];

  const storeAuras = [
    { id: 'blue', name: 'Electric Blue', color: '#3b82f6' },
    { id: 'red', name: 'Blood Red', color: '#ef4444' },
    { id: 'green', name: 'Toxic Green', color: '#22c55e' },
    { id: 'purple', name: 'Violet Fusion', color: '#a855f7' },
    { id: 'gold', name: 'Golden Sun', color: '#fbbf24' },
    { id: 'prismatic', name: 'Prismatic', color: 'url(#rainbowGradient)' },
    { id: 'fire', name: 'Inferno', color: '#f97316' },
    { id: 'ghost', name: 'Ghost', color: '#f8fafc' },
  ];

  return (
    <div 
      className={clsx(
        "fixed pointer-events-none select-none z-[999]",
        (dockMode === 'top' || dockMode === 'floating') && "top-0 left-1/2 -translate-x-1/2 px-[50px] pb-[50px]",
        dockMode === 'left' && "top-0 left-0 bottom-0 h-screen flex items-start pt-24",
        dockMode === 'right' && "top-0 right-0 bottom-0 h-screen flex items-start pt-24"
      )}
      style={{
        paddingTop: dockMode === 'floating' ? `${floatingOffset}px` : undefined
      }}
    >
      <div className={clsx("relative flex justify-center", 
        (dockMode === 'left' || dockMode === 'right') ? "flex-col items-center" : "items-start"
      )}>
        {/* Call / Control Bubbles — Left side (Outside Body to prevent hover triggers) */}
        <motion.div 
          style={{ x: islandX }}
          className="absolute right-full mr-4 top-1 flex flex-row-reverse items-center gap-3 pointer-events-auto z-[1001]"
        >
          <AnimatePresence>
            {meeting.isActive && !isExpanded && (
              <div className="pointer-events-auto">
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

              {(showControlsBubble && !isExpanded) && (
                <div className="pointer-events-auto">
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

          className="relative pointer-events-auto cursor-default group"
          style={{
            x: islandX,
            overflow: 'visible',
            color: isLightMode ? '#0f172a' : '#f8fafc',
            willChange: 'width, height, transform',
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            width: (dockMode === 'left' || dockMode === 'right')
              ? (isExpanded ? (showSettings ? 560 : 360) : 44)
              : (showSettings ? 720 : (isHovered || isPinned) ? (showPreview && activeView === 'Multimedia' ? 840 : (['WhatsApp', 'YouTube', 'Tienda'].includes(activeView) ? 800 : 680)) : (superPill ? superPillW : (summaryTemplate.startsWith('ID-') ? 112 : 440))) + 68,
            height: (dockMode === 'left' || dockMode === 'right')
              ? (isExpanded ? 400 : 120)
              : showSettings ? 480 : (isHovered || isPinned) ? (['Herramientas', 'Llamada', 'WhatsApp', 'YouTube', 'Tienda'].includes(activeView) ? 600 : (activeView === 'Actualización' ? 450 : (activeView === 'Sistema' ? 300 : (activeView === 'Resumen' && summaryTemplate.startsWith('ID-') ? 300 : 180)))) : (superPill ? superPillH : (summaryTemplate.startsWith('ID-') ? 52 : 66)),
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 32, mass: 0.8 }}
        >
        {/* UNIFIED BACKGROUND SVG LAYER — Production Fix & Subtle Drop */}
        <div className="absolute -inset-[30px] pointer-events-none z-[-1] overflow-visible">
          <svg width="100%" height="100%" shapeRendering="geometricPrecision" style={{ display: 'block', overflow: 'visible' }}>

             {(() => {
                const isLarge = showSettings || isExpanded;
                const isPreview = showPreview && activeView === 'Multimedia';

                
                // Shape morphing based on template
                
                const w = (showSettings ? 720 : isExpanded ? (isPreview ? 840 : (['WhatsApp', 'YouTube', 'Tienda'].includes(activeView) ? 800 : 680)) : (superPill ? superPillW : (summaryTemplate.startsWith('ID-') ? 112 : 440)));
                let h_base = showSettings ? 480 : isExpanded ? (['Herramientas', 'Llamada', 'WhatsApp', 'YouTube', 'Tienda'].includes(activeView) ? 600 : (activeView === 'Actualización' ? 450 : (activeView === 'Sistema' ? 300 : (activeView === 'Resumen' && summaryTemplate.startsWith('ID-') ? 300 : 180)))) : (superPill ? superPillH : (summaryTemplate.startsWith('ID-') ? 52 : 66));
                
                // h_base is not overridden by templates to keep original size
                // if (isRunner) h_base = 80;
                // if (isSynth) h_base = 120;

                const h = (superPill && !isLarge) ? (h_base + (musicIntensity || 0) * 4) : h_base;
                const totalW = w + 68;
                const neck = 42;

                const W = (dockMode === 'left' || dockMode === 'right') ? (isExpanded ? (showSettings ? 560 : 360) : 44) : totalW;
                const H = (dockMode === 'left' || dockMode === 'right') ? (isExpanded ? 400 : 120) : h;

                // Shared Geometry Logic
                const islandD = (dockMode === 'left')
                  ? (() => {
                      const r = isExpanded ? 40 : 25;
                      return `M 0 0 H ${W - r} A ${r} ${r} 0 0 1 ${W} ${r} V ${H - r} A ${r} ${r} 0 0 1 ${W - r} ${H} H 0 Z`;
                    })()
                  : (dockMode === 'right')
                  ? (() => {
                      const r = isExpanded ? 40 : 25;
                      return `M ${W} 0 H ${r} A ${r} ${r} 0 0 0 0 ${r} V ${H - r} A ${r} ${r} 0 0 0 ${r} ${H} H ${W} Z`;
                    })()
                  : (dockMode === 'floating')
                  ? (() => {
                      const r = (superPill && !isLarge) ? h / 2 : (isExpanded ? 32 : h / 2);
                      return `M ${r} 0 H ${totalW - r} A ${r} ${r} 0 0 1 ${totalW} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${totalW - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
                    })()
                  : (superPill && !isLarge) 
                  ? `M 0 0 C ${neck} 0, ${neck} ${h}, ${totalW/2} ${h} S ${totalW-neck} 0, ${totalW} 0 Z`
                  : (() => {
                      const r = isExpanded ? 50 : 33;
                      return `M 0 0 A ${r} ${r} 0 0 1 ${r} ${r} V ${h-r} A ${r} ${r} 0 0 0 ${r*2} ${h} H ${totalW-(r*2)} A ${r} ${r} 0 0 0 ${totalW-r} ${h-r} V ${r} A ${r} ${r} 0 0 1 ${totalW} 0 Z`;
                    })();

                return (
                  <g transform="translate(30, 30)">
                    {showAura && auraColor && (
                      <motion.path
                        key={`aura-${dockMode}`}
                        initial={false}
                        animate={{ d: islandD }}
                        fill="none"
                        stroke={auraColor}
                        strokeWidth="3.5"
                        transition={{ type: 'spring', stiffness: 450, damping: 32, mass: 0.8 }}
                        style={{ filter: 'blur(8px)', opacity: 0.45, mixBlendMode: 'screen' }}
                      />
                    )}
                    <motion.path
                      key={`bg-${dockMode}`}
                      initial={false}
                      animate={{ d: islandD }}
                      fill={isLightMode ? 'rgba(253,253,253,0.75)' : 'rgba(10,10,10,0.85)'}
                      stroke={isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'}
                      strokeWidth="1.5"
                      style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.35))' }}
                      transition={{ type: 'spring', stiffness: 450, damping: 32, mass: 0.8 }}
                    />

                    {/* ── QUANTUM PULSE AURA (Innovative Rhythm System) ── */}
                    <AnimatePresence>
                      {(superPill || dockMode === 'left' || dockMode === 'right') && !isLarge && media.isPlaying && showAura && (() => {
                        const mi = musicIntensity || 0;
                        const bp = beatPulse || 0;
                        const defH = h + bp * 24; // React relative to body height
                        const yCenter = h / 2;

                        let spineD = '';
                        let auraD = '';

                        if (dockMode === 'floating') {
                          const r_spine = defH / 2;
                          const yTopSpine = yCenter - defH / 2;
                          const yBottomSpine = yCenter + defH / 2;
                          spineD = `M ${r_spine} ${yTopSpine} H ${totalW - r_spine} A ${r_spine} ${r_spine} 0 0 1 ${totalW} ${yTopSpine + r_spine} V ${yBottomSpine - r_spine} A ${r_spine} ${r_spine} 0 0 1 ${totalW - r_spine} ${yBottomSpine} H ${r_spine} A ${r_spine} ${r_spine} 0 0 1 0 ${yBottomSpine - r_spine} V ${yTopSpine + r_spine} A ${r_spine} ${r_spine} 0 0 1 ${r_spine} ${yTopSpine} Z`;

                          const r_aura = r_spine + 4;
                          const yTopAura = yTopSpine - 4;
                          const yBottomAura = yBottomSpine + 4;
                          const auraW = totalW + 4;
                          auraD = `M ${r_aura} ${yTopAura} H ${auraW - r_aura} A ${r_aura} ${r_aura} 0 0 1 ${totalW + 4} ${yTopAura + r_aura} V ${yBottomAura - r_aura} A ${r_aura} ${r_aura} 0 0 1 ${auraW - r_aura} ${yBottomAura} H ${r_aura} A ${r_aura} ${r_aura} 0 0 1 -4 ${yBottomAura - r_aura} V ${yTopAura + r_aura} A ${r_aura} ${r_aura} 0 0 1 ${r_aura} ${yTopAura} Z`;
                        } else if (dockMode === 'left') {
                          const pulseW = W + bp * 16;
                          const pulseH = H;
                          const r_spine = 25; // Adjusted to match the actual non-expanded island radius of 25
                          spineD = `M 0 0 H ${pulseW - r_spine} A ${r_spine} ${r_spine} 0 0 1 ${pulseW} ${r_spine} V ${pulseH - r_spine} A ${r_spine} ${r_spine} 0 0 1 ${pulseW - r_spine} ${pulseH} H 0 Z`;

                          const r_aura = r_spine + 4; // 29px radius for concentric 4px padding
                          const auraW = pulseW + 4; // Symmetrical 4px padding on right edge
                          auraD = `M -4 -4 H ${auraW - r_aura} A ${r_aura} ${r_aura} 0 0 1 ${auraW} ${-4 + r_aura} V ${pulseH + 4 - r_aura} A ${r_aura} ${r_aura} 0 0 1 ${auraW - r_aura} ${pulseH + 4} H -4 Z`;
                        } else if (dockMode === 'right') {
                          const x_left = -bp * 16;
                          const r_spine = 25; // Adjusted to match the actual non-expanded island radius of 25
                          spineD = `M ${W} 0 H ${x_left + r_spine} A ${r_spine} ${r_spine} 0 0 0 ${x_left} ${r_spine} V ${H - r_spine} A ${r_spine} ${r_spine} 0 0 0 ${x_left + r_spine} ${H} H ${W} Z`;

                          const r_aura = r_spine + 4; // 29px radius for concentric 4px padding
                          const x_left_aura = x_left - 4; // Symmetrical 4px padding on left edge
                          const auraRightEdge = W + 4; // Symmetrical 4px padding on right edge
                          auraD = `M ${auraRightEdge} -4 H ${x_left_aura + r_aura} A ${r_aura} ${r_aura} 0 0 0 ${x_left_aura} ${-4 + r_aura} V ${H + 4 - r_aura} A ${r_aura} ${r_aura} 0 0 0 ${x_left_aura + r_aura} ${H + 4} H ${auraRightEdge} Z`;
                        } else {
                          spineD = `M 0 0 C ${neck} 0, ${neck} ${defH}, ${totalW/2} ${defH + bp*6} S ${totalW-neck} 0, ${totalW} 0`;
                          auraD  = `M 0 0 C ${neck-2} -2, ${neck-2} ${defH+8}, ${totalW/2} ${defH+14} S ${totalW-neck+2} -2, ${totalW} 0`;
                        }

                        const getTransformOrigin = () => {
                          if (dockMode === 'left') return `0px ${H / 2}px`;
                          if (dockMode === 'right') return `${W}px ${H / 2}px`;
                          if (dockMode === 'floating') return `${totalW / 2}px ${h / 2}px`;
                          return `${totalW / 2}px 0px`;
                        };

                        return (
                          <g key={`quantum-pulse-system-${dockMode}`}>
                            <motion.path
                              key={`quantum-aura-path-${dockMode}`}
                              d={auraD}
                              fill="none"
                              stroke="url(#rgQuantum)"
                              strokeLinecap="round"
                              animate={{
                                strokeWidth: 1.5 + mi * 1.8 + bp * 2.5,
                                opacity: 0.1 + mi * 0.05 + bp * 0.1,
                              }}
                              transition={{ type: 'spring', stiffness: 800, damping: 35 }}
                              style={{ filter: `blur(${1.5 + mi * 1.5 + bp * 2.5}px)`, mixBlendMode: 'screen', pointerEvents: 'none' }}
                            />
                            {[1, 1.04, 1.08].map((scale, i) => (
                              <motion.path
                                key={`quantum-pulse-path-${i}-${dockMode}`}
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
                                style={{ transformOrigin: getTransformOrigin(), filter: i === 0 ? 'none' : 'blur(2px)', pointerEvents: 'none' }}
                              />
                            ))}
                            {[0.2, 0.5, 0.8].map((offset, i) => (
                              <motion.circle
                                key={`quantum-particle-${i}-${dockMode}`}
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
                  </g>
                );
              })()}


              <defs>
                <linearGradient id="rgQuantum" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={stopColorVal} />
                  <stop offset="30%" stopColor={stopColorVal} stopOpacity="0.8" />
                  <stop offset="70%" stopColor={stopColorVal} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={stopColorVal} />
                  <animate attributeName="x1" values="0%;-100%;0%" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="x2" values="100%;200%;100%" dur="3s" repeatCount="indefinite" />
                </linearGradient>
                <linearGradient id="rgPulse" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={stopColorVal} />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor={stopColorVal} />
                  <animate attributeName="x1" values="-50%;150%;-50%" dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="x2" values="0%;200%;0%" dur="1.2s" repeatCount="indefinite" />
                </linearGradient>
                <radialGradient id="rgSpark">
                  <stop offset="10%" stopColor="white" />
                  <stop offset="90%" stopColor={stopColorVal} stopOpacity="0" />
                </radialGradient>
                <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff0000" />
                  <stop offset="20%" stopColor="#ffff00" />
                  <stop offset="40%" stopColor="#00ff00" />
                  <stop offset="60%" stopColor="#00ffff" />
                  <stop offset="80%" stopColor="#0000ff" />
                  <stop offset="100%" stopColor="#ff00ff" />
                  <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="x2" values="100%;200%;100%" dur="3s" repeatCount="indefinite" />
                </linearGradient>
              </defs>
           </svg>
        </div>

        {/* Content wrapper — centered relative to the whole silhouette */}
        <div 
          className="absolute overflow-hidden"
          style={{ 
            left: (dockMode === 'left' || dockMode === 'right') 
              ? 0 
              : (superPill && !isExpanded) ? 10 : 34, 
            right: (dockMode === 'left' || dockMode === 'right') 
              ? 0 
              : (superPill && !isExpanded) ? 10 : 34,
            top: 0,
            bottom: 0,
          }}
        >
        {/* ── COLLAPSED PILL ── */}
        <motion.div
          animate={{ opacity: isExpanded ? 0 : 1 }}
          className={clsx(
            'absolute inset-0 flex',
            (dockMode === 'left' || dockMode === 'right') ? 'flex-col items-center justify-between py-3' : 'items-center',
            isExpanded && 'pointer-events-none'
          )}
          onPointerDown={(e) => !isExpanded && dragControls.start(e)}
        >
          {(dockMode === 'left' || dockMode === 'right') ? (
            <div className="flex-1 flex flex-col items-center justify-between h-full w-full pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
              {/* Top: Vertical Clock Time Stack */}
              <div className="flex flex-col items-center font-black leading-none tracking-tight">
                <span className="text-[11px] text-white/95">{String(currentTime.getHours()).padStart(2, '0')}</span>
                <span className="text-[11px] text-blue-400/90 mt-0.5">{String(currentTime.getMinutes()).padStart(2, '0')}</span>
              </div>

              {/* Middle: Music Album Thumbnail or glowing system dot */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                {media.isPlaying ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 rounded-full overflow-hidden border border-white/20 shadow-lg cursor-pointer"
                    onClick={() => openApp('Spotify')}
                  >
                    {media.thumbnail ? (
                      <img src={media.thumbnail} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                        <Music className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                  />
                )}
              </div>

              {/* Bottom: Temperature Readout */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[8px] font-black text-white/60 tracking-tighter">{weather.temp}°</span>
              </div>
            </div>
          ) : superPill && !isCollapsing ? (
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
                      
                      // 3D Tilt Container Wrapper
                      const Content3D = ({ children, className }: any) => (
                        <motion.div
                          animate={{ 
                            rotateX: media.isPlaying ? [0, 15, -15, 0] : 0,
                            rotateY: media.isPlaying ? [0, -15, 15, 0] : 0,
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                          className={className}
                        >
                          {children}
                        </motion.div>
                      );

                      if (summaryTemplate === 'ID-Runner') {
                         return (
                           <div className="relative flex items-center justify-center w-full h-full">
                             <motion.div 
                               animate={{ 
                                 x: [-20, 20],
                                 scaleX: [1, 1],
                                 y: [0, -2, 0]
                               }}
                               transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                               className="relative"
                             >
                               {/* Runner Stick Figure Drawing */}
                               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                  {/* Head */}
                                  <circle cx="12" cy="5" r="2" />
                                  {/* Body */}
                                  <path d="M12 7v7" />
                                  {/* Arms */}
                                  <motion.path 
                                    animate={{ 
                                      d: ["M12 9l-4 4 M12 9l4-2", "M12 9l-4-2 M12 9l4 4"] 
                                    }}
                                    transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
                                  />
                                  {/* Legs */}
                                  <motion.path 
                                    animate={{ 
                                      d: ["M12 14l-4 6 M12 14l4 2", "M12 14l-4 2 M12 14l4 6"] 
                                    }}
                                    transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
                                  />
                               </svg>
                             </motion.div>
                             <div className="absolute bottom-1 w-8 h-[1px] bg-white/20 blur-[1px]" />
                           </div>
                         );
                      }

                      if (mode === 'Multimedia') {
                        return (
                          <Content3D className="relative">
                            <motion.div 
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: media.isPlaying ? 360 : 0
                              }}
                              transition={{ 
                                scale: { duration: 0.4, repeat: Infinity },
                                rotate: { duration: 10, repeat: Infinity, ease: "linear" }
                              }}
                              className={clsx("rounded-full overflow-hidden border-2 border-white/20 bg-zinc-900 relative shadow-[0_0_20px_rgba(0,0,0,0.5)]", dockMode === 'floating' ? 'w-7 h-7' : 'w-9 h-9')}
                              style={{ transform: "translateZ(20px)" }}
                            >
                              {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-4 h-4 m-auto opacity-10" />}
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
                            </motion.div>
                            <div className={clsx("absolute rounded-full border border-white/10 opacity-20", dockMode === 'floating' ? '-inset-0.5' : '-inset-1')} style={{ transform: "translateZ(10px)" }} />
                          </Content3D>
                        );
                      } else {
                        return (
                          <Content3D className={clsx("relative flex items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 shadow-lg", dockMode === 'floating' ? 'w-6 h-6' : 'w-8 h-8')}>
                            <motion.div
                              animate={{ 
                                y: [-2, 2, -2],
                                rotateZ: [-5, 5, -5]
                              }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              style={{ transform: "translateZ(15px)" }}
                            >
                              <Cloud className={clsx("text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]", dockMode === 'floating' ? 'w-3.5 h-3.5' : 'w-5 h-5')} />
                            </motion.div>
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className={clsx("absolute blur-xl rounded-full", dockMode === 'floating' ? 'w-3 h-3 bg-yellow-400/10' : 'w-4 h-4 bg-yellow-400/20')}
                              style={{ transform: "translateZ(5px)" }}
                            />
                          </Content3D>
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

              {/* --- COLLAPSED: BATTERY DESIGNS (C1-C4, A8, 10) --- */}
              {(summaryTemplate.startsWith('ID-C') || summaryTemplate === 'ID-A8' || summaryTemplate === 'ID-10') && (
                <div className="flex-1 flex items-center justify-between px-2">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                         <Zap className="w-4 h-4 text-emerald-400 fill-current animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[14px] font-black tracking-tighter">85%</span>
                         <span className="text-[7px] font-black uppercase opacity-30 tracking-widest leading-none">Power Level</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      {media.isPlaying && <SoundVisualizer isPlaying={media.isPlaying} bars={visualizerBars} />}
                      <div className="flex items-baseline gap-1 font-black text-[14px] tracking-tight text-blue-400">
                         <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                      </div>
                   </div>
                </div>
              )}

              {/* --- COLLAPSED: ART DESIGNS (01-Art, M2-Art) --- */}
              {summaryTemplate.includes('-Art') && (
                <div className="flex-1 flex items-center justify-between px-2">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 opacity-40" />
                         <Activity className="w-5 h-5 m-auto text-white opacity-40 mt-2.5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Fine Art</span>
                   </div>
                   <span className="text-[18px] font-black tracking-tighter opacity-80">{currentTime.getHours()}:{String(currentTime.getMinutes()).padStart(2, '0')}</span>
                </div>
              )}

              {/* --- COLLAPSED: RETRO DESIGNS --- */}
              {summaryTemplate.includes('-Retro') && (
                <div className="flex-1 flex items-center justify-between px-4">
                   <div className="flex items-baseline gap-2">
                      <span className="text-[20px] font-black tracking-tighter text-purple-400 italic">2026</span>
                      <span className="text-[8px] font-black uppercase opacity-20 tracking-[0.4em]">Retro-Bit</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ff0080]" />
                      <span className="text-[14px] font-black font-mono opacity-50">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                </div>
              )}

              {/* --- COLLAPSED: POP DESIGNS --- */}
              {summaryTemplate.includes('-Pop') && (
                <div className="flex-1 flex items-center justify-between px-4 overflow-hidden">
                   <div className="relative">
                      <div className="absolute inset-0 bg-yellow-400 -rotate-3 scale-110" />
                      <span className="relative text-[16px] font-black italic uppercase text-black px-2">POP!</span>
                   </div>
                   <div className="flex items-center gap-4">
                      {media.isPlaying && <SoundVisualizer isPlaying={media.isPlaying} bars={visualizerBars} />}
                      <span className="text-[20px] font-black tracking-tight text-white">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                </div>
              )}

              {/* --- COLLAPSED: NEON BEATS (ID-Neon-Media) --- */}
              {summaryTemplate === 'ID-Neon-Media' && (
                <div className="flex-1 flex items-center justify-between px-4">
                  <div className="w-8 h-8 rounded-full border border-pink-500/40 flex items-center justify-center bg-black/40">
                    <Music className="w-4 h-4 text-pink-500 animate-pulse" />
                  </div>
                  <div className="flex gap-[2px] h-3 items-end">
                    {[1,2,3,4].map(i => (
                      <motion.div key={i} animate={{ height: [3, 11, 3] }} transition={{ duration: 0.4 + i*0.1, repeat: Infinity }} className="w-[2px] bg-pink-500 rounded-full" />
                    ))}
                  </div>
                </div>
              )}

              {/* --- COLLAPSED: ATMOSPHERE GLASS (ID-Glass-Weather) --- */}
              {summaryTemplate === 'ID-Glass-Weather' && (
                <div className="flex-1 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-blue-400 drop-shadow-[0_0_4px_#3b82f6]" />
                    <span className="text-[10px] font-black uppercase opacity-60">Atmosphere</span>
                  </div>
                  <span className="text-[14px] font-black text-blue-400 tabular-nums">{weather.temp}°C</span>
                </div>
              )}

              {/* --- COLLAPSED: DEVICE HUB (ID-Device-Manager) --- */}
              {summaryTemplate === 'ID-Device-Manager' && (
                <div className="flex-1 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Bluetooth className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase opacity-60">Device Hub</span>
                  </div>
                  <span className="text-[11px] font-black text-indigo-400">4 Active</span>
                </div>
              )}

              {/* --- COLLAPSED: COSMIC DISK (ID-Orbit-Music) --- */}
              {summaryTemplate === 'ID-Orbit-Music' && (
                <div className="flex-1 flex items-center justify-between px-4">
                  <div className="w-7 h-7 rounded-full border border-purple-500/30 flex items-center justify-center bg-black/60 relative">
                    <Music className="w-3.5 h-3.5 text-purple-400" />
                    <div className="absolute w-2 h-2 bg-cyan-400 rounded-full border border-black -top-0.5" />
                  </div>
                  <span className="text-[12px] font-black text-cyan-400 font-mono tabular-nums">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                </div>
              )}

              {/* --- COLLAPSED: IOS MUSIC PRO (ID-iPhone-Pro) --- */}
              {summaryTemplate === 'ID-iPhone-Pro' && (
                <div className="flex-1 flex items-center justify-between px-4">
                  <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden relative flex items-center justify-center shrink-0 bg-zinc-950">
                    {media.thumbnail ? (
                      <img src={media.thumbnail} className="w-full h-full object-cover" />
                    ) : (
                      <Music className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-[2.5px] h-3 items-end">
                      {[4, 9, 6, 8, 3].map((h, i) => (
                        <motion.div 
                          key={i} 
                          animate={{ height: media.isPlaying ? [`30%`, `${h * 10}%`, `30%`] : `30%` }} 
                          transition={{ duration: 0.5 + i*0.1, repeat: Infinity }} 
                          className="w-[2px] bg-emerald-400 rounded-full" 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- COLLAPSED: GOOGLE/IOS/DASHBOARD --- */}
              {(summaryTemplate === 'ID-Google' || summaryTemplate === 'ID-iOS' || summaryTemplate === 'ID-Dashboard') && (
                <div className="flex-1 flex items-center justify-between px-4">
                  <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center border transition-all", 
                    summaryTemplate === 'ID-Google' ? "bg-indigo-500 text-white border-indigo-400" :
                    summaryTemplate === 'ID-iOS' ? "bg-white/10 text-white border-white/20 backdrop-blur-md" : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  )}>
                     {summaryTemplate === 'ID-Google' ? <Activity className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                  </div>
                  <div className="flex items-center gap-4">
                     {media.isPlaying && <SoundVisualizer isPlaying={media.isPlaying} bars={visualizerBars} />}
                     <span className={clsx("text-[18px] font-black tracking-tighter", summaryTemplate === 'ID-Google' ? "text-indigo-600" : "text-white")}>
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                     </span>
                  </div>
                </div>
              )}

            </div>
          )}
        </motion.div>

        {/* ── EXPANDED PANEL ── */}
        <motion.div
          animate={{ opacity: isExpanded ? 1 : 0 }}
          className={clsx(
            'absolute inset-0 flex z-[4000] pointer-events-auto',
            (dockMode === 'left' || dockMode === 'right') ? 'flex-row p-0' : 'flex-col pt-2.5 px-4 pb-2',
            !isExpanded && 'pointer-events-none opacity-0'
          )}
          onPointerDown={(e) => {
             // Only start drag if clicking the background, not a button/input/webview/no-drag zone
             const target = e.target as HTMLElement;
             if (
               !target.closest('button') &&
               !target.closest('input') &&
               !target.closest('webview') &&
               !target.closest('.no-drag')
             ) {
               dragControls.start(e);
             }
          }}
        >
          {/* Side Dock Sidebar (Left Dock) */}
          {dockMode === 'left' && (
            <div 
              className={clsx(
                "w-10 flex flex-col items-center py-2 justify-between shrink-0 pointer-events-auto select-none no-drag border-r",
                isLightMode ? "border-black/5 bg-black/[0.02]" : "border-white/5 bg-white/[0.02]"
              )}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Upper part: LED CPU monitor + Tab icons */}
              <div className="flex flex-col items-center gap-1.5 w-full">
                {/* Mini LED CPU Monitor */}
                <div className="flex flex-col items-center gap-0.5 mb-1 cursor-default select-none shrink-0" title={`CPU: ${systemInfo.cpu}%`}>
                  <div className="w-1 h-5 rounded-full bg-zinc-800/85 overflow-hidden relative border border-white/5 shadow-inner">
                    <div 
                      className={clsx(
                        "absolute bottom-0 inset-x-0 transition-all duration-500",
                        systemInfo.cpu > 70 ? "bg-red-500 shadow-[0_0_6px_#ef4444]" : 
                        systemInfo.cpu > 40 ? "bg-indigo-500 shadow-[0_0_6px_#6366f1]" : 
                        "bg-emerald-500 shadow-[0_0_6px_#10b981]"
                      )}
                      style={{ height: `${systemInfo.cpu}%` }}
                    />
                  </div>
                  <span className="text-[6px] font-black opacity-30 uppercase tracking-wide">CPU</span>
                </div>

                {/* Tab Icons Scrollable List */}
                <div className="flex flex-col items-center gap-1 w-full overflow-y-auto no-scrollbar max-h-[175px] py-1 border-t border-b" style={{ borderColor: isLightMode ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}>
                  {tabOrder.map(v =>
                    visibleTabs.includes(v) && (() => {
                      const iconMap: any = {
                        'Resumen': <Activity className="w-[13px] h-[13px]" />,
                        'Sistema': <Cpu className="w-[13px] h-[13px]" />,
                        'Multimedia': <Volume2 className="w-[13px] h-[13px]" />,
                        'Notificación': <Bell className="w-[13px] h-[13px]" />,
                        'Herramientas': <Timer className="w-[13px] h-[13px]" />,
                        'Llamada': <Video className="w-[13px] h-[13px]" />,
                        'WhatsApp': <MessageCircle className="w-[13px] h-[13px]" />,
                        'Actualización': <Download className="w-[13px] h-[13px]" />,
                        'Tienda': <ShoppingBag className="w-[13px] h-[13px]" />,
                        'YouTube': (
                          <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        )
                      };
                      return (
                        <button
                          key={v}
                          onClick={() => setActiveView(v as any)}
                          className={clsx(
                            "w-6 h-6 rounded-md flex items-center justify-center transition-all shrink-0",
                            activeView === v
                              ? (isLightMode ? "bg-black text-white" : "bg-white text-black shadow-md")
                              : "opacity-45 hover:opacity-100 hover:bg-white/5"
                          )}
                          title={v}
                        >
                          {iconMap[v] || <Activity className="w-[13px] h-[13px]" />}
                        </button>
                      );
                    })()
                  )}
                </div>
              </div>

              {/* Lower part: Settings / Pin buttons + Battery Indicator */}
              <div className="flex flex-col items-center gap-1 w-full shrink-0">
                <div className="flex flex-col items-center gap-1 w-full border-t pt-1.5" style={{ borderColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                  <button 
                    onClick={() => setIsPinned(!isPinned)}
                    className={clsx(
                      "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                      isPinned ? "text-blue-400" : "opacity-45 hover:opacity-100 hover:bg-white/5"
                    )}
                  >
                    <Pin className="w-[13px] h-[13px]" />
                  </button>
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={clsx(
                      "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                      showSettings ? "text-blue-400" : "opacity-45 hover:opacity-100 hover:bg-white/5"
                    )}
                  >
                    <Settings className="w-[13px] h-[13px]" />
                  </button>
                </div>

                {/* Glowing Battery Capsule */}
                <div className="flex flex-col items-center gap-0.5 mt-0.5 pt-1 border-t w-full" style={{ borderColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                  <div className={clsx(
                    "w-6 h-2.5 rounded flex items-center px-0.5 border relative overflow-hidden",
                    isCharging ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/20 bg-white/5"
                  )} title={`Batería: ${batteryLevel}% ${isCharging ? '(Cargando)' : ''}`}>
                    {/* Battery level fill */}
                    <div 
                      className={clsx(
                        "h-1 rounded-sm transition-all duration-300",
                        isCharging ? "bg-emerald-400" : 
                        batteryLevel < 20 ? "bg-red-500 shadow-[0_0_4px_#ef4444]" : "bg-white"
                      )}
                      style={{ width: `${Math.max(10, Math.min(100, batteryLevel))}%` }}
                    />
                    {/* Battery tip */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-1 rounded-l-sm bg-current opacity-30" />
                    {/* Tiny lightning bolt */}
                    {isCharging && (
                      <span className="absolute inset-0 flex items-center justify-center text-[6px] font-black text-emerald-300 drop-shadow">⚡</span>
                    )}
                  </div>
                  <span className="text-[6px] font-black opacity-35 tracking-tighter leading-none">{batteryLevel}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Core Content Area */}
          <div className={clsx(
            'flex-1 relative flex overflow-hidden min-w-0 min-h-0',
            (dockMode === 'left' || dockMode === 'right') ? 'flex-col p-5' : 'flex-col'
          )}>
            {/* Top Tab Bar (only for Top / Floating modes) */}
            {!(dockMode === 'left' || dockMode === 'right') && (
              <div className={clsx('relative flex items-center justify-between mb-4 pb-2 border-b shrink-0 z-[5000]', isLightMode ? 'border-black/10' : 'border-white/10')} onPointerDown={e => e.stopPropagation()}>
                <div 
                  className="flex-1 flex gap-1 items-center overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap pr-20" 
                  style={{ 
                    maskImage: 'linear-gradient(to right, black 85%, transparent 100%)', 
                    WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)' 
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
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => setActiveView(v as any)}
                        className={clsx(
                          'px-3 py-1 rounded-full text-[9.5px] font-black flex items-center gap-1 transition-all uppercase whitespace-nowrap shrink-0 pointer-events-auto',
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
                        {v === 'Tienda'        && <ShoppingBag className="w-2.5 h-2.5" />}
                        {v === 'YouTube'      && (
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        )}
                        {(() => {
                          const keyMap: any = { 'Notificación': 'notificacion', 'WhatsApp': 'whatsapp', 'YouTube': 'youtube', 'Herramientas': 'timer', 'Actualización': 'update', 'Tienda': 'tienda' };
                          const key = keyMap[v] || v.toLowerCase();
                          return t[key] || v;
                        })()}
                      </button>
                    )
                  )}
                </div>
                <div className="absolute right-0 top-0 flex items-center gap-2 px-1 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent pl-8 pointer-events-auto z-[6000]">
                  <button 
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPinned((p: boolean) => !p);
                    }} 
                    className={clsx('p-1.5 rounded-xl transition-all border pointer-events-auto', isPinned ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20' : 'opacity-40 hover:opacity-100 border-transparent hover:bg-white/10')}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button 
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSettings((s: boolean) => !s);
                    }} 
                    className="p-1.5 rounded-xl opacity-40 hover:opacity-100 hover:bg-white/10 transition-all pointer-events-auto"
                  >
                    <Settings className="w-4 h-4 hover:rotate-90 transition-transform duration-500" />
                  </button>
                </div>
              </div>
            )}

            <div className={clsx("flex-1 overflow-hidden relative flex flex-col transition-all duration-300 pointer-events-auto z-[2000]", showSettings && "opacity-0 pointer-events-none scale-95 blur-sm")}>
            {/* RESUMEN — supports 3 different templates (diseños) */}
            {activeView === 'Resumen' && (
              <div className="absolute inset-0 flex items-stretch pt-4">
                
                {/* --- DESIGN: MATERIAL YOU 2.0 (ID-Google) --- */}
                {summaryTemplate === 'ID-Google' && (
                  <div className={clsx(
                    "flex-1 flex bg-indigo-50/10 rounded-[32px] border border-indigo-500/20 shadow-inner",
                    (dockMode === 'left' || dockMode === 'right') ? "flex-col gap-3 p-3" : "gap-6 px-8 py-4"
                  )}>
                     <div className={clsx(
                       "bg-white/5 backdrop-blur-3xl rounded-[32px] flex flex-col justify-between border border-white/20 shadow-2xl",
                       (dockMode === 'left' || dockMode === 'right') ? "p-4 gap-3" : "flex-1 p-6"
                     )}>
                        <div className="flex justify-between items-start">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                              <Music className="w-6 h-6 text-white" />
                           </div>
                           <div className="flex flex-col items-end">
                              <span className="text-[24px] font-black text-indigo-400 leading-none">{weather.temp}°</span>
                              <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">{weather.city}</span>
                           </div>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[18px] font-black truncate max-w-[260px] text-white/90">{media.isPlaying ? media.title : 'Material You'}</span>
                           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1">{media.isPlaying ? media.artist : 'Design System'}</span>
                        </div>
                     </div>
                     <div className={clsx(
                       "flex gap-3",
                       (dockMode === 'left' || dockMode === 'right') ? "w-full h-24" : "w-[180px] flex-col"
                     )}>
                        <div className="flex-1 bg-emerald-500/20 rounded-[24px] flex flex-col items-center justify-center border border-emerald-500/30">
                           <Zap className="w-6 h-6 text-emerald-400 fill-current mb-1" />
                           <span className="text-[20px] font-black text-white leading-none">85%</span>
                           <span className="text-[8px] font-black uppercase opacity-40 tracking-widest mt-1">Efficient</span>
                        </div>
                        <div className={clsx(
                          "bg-amber-500/20 rounded-[24px] flex items-center justify-center border border-amber-500/30",
                          (dockMode === 'left' || dockMode === 'right') ? "w-28" : "h-20"
                        )}>
                           <span className="text-[20px] font-black text-white tracking-tighter">{currentTime.getHours()}:{String(currentTime.getMinutes()).padStart(2, '0')}</span>
                        </div>
                     </div>
                  </div>
                )}

                {/* --- DESIGN: IOS GLASS MAX (ID-iOS) --- */}
                {summaryTemplate === 'ID-iOS' && (
                  <div className={clsx(
                    "flex-1 relative overflow-hidden flex flex-col rounded-[32px]",
                    (dockMode === 'left' || dockMode === 'right') ? "p-3" : "p-6"
                  )}>
                     <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/30 blur-[120px] rounded-full animate-pulse" />
                     <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/30 blur-[120px] rounded-full" />
                     <div className={clsx(
                       "relative z-10 flex-1 flex",
                       (dockMode === 'left' || dockMode === 'right') ? "flex-col gap-3" : "gap-6"
                     )}>
                        <div className={clsx(
                          "bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl flex flex-col justify-between",
                          (dockMode === 'left' || dockMode === 'right') ? "p-4 gap-4" : "flex-1 p-8"
                        )}>
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl shrink-0">
                                 {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-6 h-6 text-white/20" />}
                              </div>
                              <div className="flex flex-col min-w-0">
                                 <span className="text-[18px] font-black text-white truncate">{media.isPlaying ? media.title : 'Live Island'}</span>
                                 <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-1">{media.isPlaying ? media.artist : 'Design OS'}</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                 <motion.div animate={{ width: '60%' }} className="h-full bg-white shadow-[0_0_15px_white]" />
                              </div>
                              <span className="text-[8px] font-black text-white/40 tabular-nums">2:14 / 4:32</span>
                           </div>
                        </div>
                        <div className={clsx(
                          "flex gap-3",
                          (dockMode === 'left' || dockMode === 'right') ? "w-full h-24" : "w-[160px] flex-col"
                        )}>
                           <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-[24px] border border-white/10 flex flex-col items-center justify-center">
                              <Cloud className="w-6 h-6 text-white mb-1" />
                              <span className="text-[22px] font-black text-white leading-none">22°</span>
                              <span className="text-[8px] font-black uppercase opacity-40 tracking-widest mt-1">Mostly Clear</span>
                           </div>
                           <div className={clsx(
                             "bg-white rounded-[20px] flex items-center justify-center shadow-2xl",
                             (dockMode === 'left' || dockMode === 'right') ? "w-28" : "h-16"
                           )}>
                              <span className="text-[16px] font-black text-black tracking-tighter">9:41 AM</span>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {/* --- DESIGN: OBSIDIAN DECK (ID-Dashboard) --- */}
                {summaryTemplate === 'ID-Dashboard' && (
                  <div className={clsx(
                    "flex-1 flex bg-black rounded-[32px] border border-white/5",
                    (dockMode === 'left' || dockMode === 'right') ? "flex-col gap-3 p-3" : "gap-6 px-8 py-4"
                  )}>
                     <div className={clsx(
                       "bg-zinc-900/50 rounded-[24px] border border-white/5 flex flex-col",
                       (dockMode === 'left' || dockMode === 'right') ? "p-4 gap-4" : "flex-1 p-6"
                     )}>
                        <div className="flex justify-between items-center">
                           <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">System Deck</span>
                           <div className="flex gap-1">
                              {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500" />)}
                           </div>
                        </div>
                        <div className="flex-1 flex items-end gap-1 mb-4 h-16 min-h-[60px]">
                           {[40, 70, 30, 90, 60, 45, 80, 55, 100, 75, 40, 60].map((h, i) => (
                              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                           ))}
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex flex-col">
                              <span className="text-[18px] font-black text-white leading-none">12.8%</span>
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">CPU Load</span>
                           </div>
                           <div className="flex items-center gap-1.5 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                              <Activity className="w-2.5 h-2.5 text-blue-400" />
                              <span className="text-[8px] font-black text-blue-400">Stable</span>
                           </div>
                        </div>
                     </div>
                     <div className={clsx(
                       "flex gap-3",
                       (dockMode === 'left' || dockMode === 'right') ? "w-full h-24" : "w-[200px] flex-col"
                     )}>
                        <div className="flex-1 bg-zinc-900 rounded-[20px] border border-white/5 flex flex-col items-center justify-center py-2">
                           <div className="w-10 h-10 rounded-full border-[4px] border-emerald-500/20 flex items-center justify-center relative">
                              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="282" strokeDashoffset={282*0.15} /></svg>
                              <Zap className="w-4 h-4 text-emerald-500 fill-current" />
                           </div>
                           <span className="text-[12px] font-black text-white mt-1.5">85% Power</span>
                        </div>
                        <div className={clsx(
                          "bg-blue-600 rounded-[18px] flex items-center justify-center shadow-[0_10px_25px_rgba(59,130,246,0.3)]",
                          (dockMode === 'left' || dockMode === 'right') ? "w-28" : "h-16"
                        )}>
                           <span className="text-[14px] font-black text-white tracking-widest uppercase">Stealth</span>
                        </div>
                     </div>
                  </div>
                )}
                {/* --- DESIGN: QUANTUM CELLS (ID-C1) --- */}
                {summaryTemplate === 'ID-C1' && (
                  <div className="flex-1 flex flex-col justify-center px-12 gap-10 bg-zinc-950 rounded-[32px]">
                     <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-baseline mb-1">
                           <span className="text-[14px] font-black uppercase tracking-[0.4em] text-emerald-500">Core Battery</span>
                           <span className="text-[32px] font-black text-white tabular-nums">85%</span>
                        </div>
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                           <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-400 to-green-500 shadow-[0_0_30px_rgba(16,185,129,0.5)]" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-baseline mb-1">
                           <span className="text-[14px] font-black uppercase tracking-[0.4em] text-blue-500">System Link</span>
                           <span className="text-[32px] font-black text-white tabular-nums">Connected</span>
                        </div>
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                           <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
                        </div>
                     </div>
                  </div>
                )}

                {/* --- DESIGN: ZEN WAVE (ID-01-Art) --- */}
                {summaryTemplate === 'ID-01-Art' && (
                  <div className="flex-1 relative overflow-hidden group rounded-[32px]">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1280px-Great_Wave_off_Kanagawa2.jpg" className="absolute inset-0 w-full h-full object-cover opacity-80 scale-125 group-hover:scale-110 transition-transform duration-[40s] linear infinite" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/40" />
                     <div className="absolute inset-0 bg-blue-900/10 mix-blend-color" />
                     
                     <div className="absolute bottom-10 left-12 flex flex-col gap-2 z-20">
                        <span className="text-[48px] font-black text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] tracking-tighter">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <div className="flex items-center gap-3">
                           <div className="w-1 h-4 bg-blue-400 rounded-full shadow-[0_0_10px_#3b82f6]" />
                           <span className="text-[14px] font-black uppercase tracking-[0.4em] text-white/60">Zen Master Edition</span>
                        </div>
                     </div>
                     <div className="absolute top-10 right-12 z-20">
                        <div className="px-6 py-3 bg-white/5 backdrop-blur-3xl rounded-[24px] border border-white/20 flex flex-col items-center">
                           <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Forecast</span>
                           <span className="text-[20px] font-black text-white">{weather.temp}° Clear</span>
                        </div>
                     </div>
                  </div>
                )}

                {/* --- DESIGN: ACTION! COMIC (ID-14-Pop) --- */}
                {summaryTemplate === 'ID-14-Pop' && (
                  <div className="flex-1 flex items-center justify-around bg-[#ffeb3b] px-10 relative overflow-hidden rounded-[32px]">
                     <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(black 2px, transparent 0)', backgroundSize: '20px 20px' }} />
                     <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }} className="relative z-10">
                        <div className="absolute inset-0 bg-white rotate-6 scale-110 -skew-x-12 border-[6px] border-black" />
                        <div className="relative px-12 py-6 bg-[#f44336] border-[6px] border-black -rotate-3 shadow-[15px_15px_0_black]">
                           <span className="text-[64px] font-black text-white italic tracking-tighter uppercase leading-none" style={{ WebkitTextStroke: '3px black' }}>Kaboom!</span>
                        </div>
                     </motion.div>
                     <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center gap-3">
                           <div className="w-20 h-10 bg-white border-[4px] border-black relative">
                              <motion.div animate={{ width: ['30%', '90%', '30%'] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-y-0 left-0 bg-[#4caf50] border-r-[4px] border-black" />
                           </div>
                           <span className="text-[32px] font-black italic text-black" style={{ textShadow: '3px 3px 0 #fff' }}>9:41</span>
                        </div>
                        <div className="px-6 py-2 bg-blue-500 border-[4px] border-black shadow-[6px_6px_0_#000] -rotate-2">
                           <span className="text-[12px] font-black uppercase text-white tracking-widest">Active Power</span>
                        </div>
                     </div>
                  </div>
                )}

                {/* --- DESIGN: SYNTHWAVE PRO (ID-Synth) --- */}
                {summaryTemplate === 'ID-Synth' && (
                  <div className="flex-1 bg-[#02040a] relative overflow-hidden flex flex-col rounded-[32px] border-b-[6px] border-[#ff0080]">
                    <div className="absolute inset-0 opacity-30" style={{ 
                      backgroundImage: 'linear-gradient(#ff0080 1px, transparent 1px), linear-gradient(90deg, #ff0080 1px, transparent 1px)', 
                      backgroundSize: '40px 40px', 
                      transform: 'perspective(600px) rotateX(60deg) translateY(-60px) scale(1.5)' 
                    }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent z-10" />
                    
                    <div className="relative z-20 flex-1 flex flex-col items-center justify-center">
                       <motion.div 
                         animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                         transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                         className="flex flex-col items-center"
                       >
                          <span className="text-[100px] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ff0080] via-[#7c3aed] to-[#06b6d4] italic uppercase tracking-tighter leading-none" style={{ filter: 'drop-shadow(0 0 30px rgba(255,0,128,0.5))' }}>NOVA</span>
                          <div className="flex items-center gap-4 mt-[-10px]">
                             <div className="h-[1px] w-20 bg-cyan-400/50" />
                             <span className="text-[11px] font-black uppercase tracking-[0.6em] text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]">Cyber Interface</span>
                             <div className="h-[1px] w-20 bg-cyan-400/50" />
                          </div>
                       </motion.div>
                    </div>
                    <div className="absolute top-8 right-10 flex flex-col items-end">
                       <span className="text-[36px] font-black text-white tabular-nums italic tracking-tighter">{currentTime.getHours()}:{String(currentTime.getMinutes()).padStart(2, '0')}</span>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-500/80">Pro active</span>
                       </div>
                    </div>
                  </div>
                )}

                {/* --- DESIGN: SYNTH GRID (ID-M2-Retro) --- */}
                {summaryTemplate === 'ID-M2-Retro' && (
                  <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col rounded-[32px] border-b-4 border-pink-500">
                     <div className="absolute inset-0 opacity-40" style={{ 
                       backgroundImage: 'linear-gradient(#ff0080 1.5px, transparent 1.5px), linear-gradient(90deg, #ff0080 1.5px, transparent 1.5px)', 
                       backgroundSize: '50px 50px', 
                       transform: 'perspective(500px) rotateX(65deg) translateY(-80px)' 
                     }} />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                     
                     <div className="relative z-20 flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                           <span className="text-[90px] font-black text-transparent bg-clip-text bg-gradient-to-b from-pink-500 to-purple-800 italic uppercase tracking-tighter leading-none" style={{ filter: 'drop-shadow(0 0 20px #ff0080)' }}>Synth</span>
                           <div className="flex items-center gap-6">
                              <div className="h-[2px] w-24 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                              <span className="text-[14px] font-black uppercase tracking-[0.8em] text-cyan-400">Future Grid</span>
                              <div className="h-[2px] w-24 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                           </div>
                        </div>
                     </div>
                     <div className="absolute top-6 right-8 flex flex-col items-end">
                        <span className="text-[32px] font-black text-white/80 tabular-nums italic">{currentTime.getHours()}:{String(currentTime.getMinutes()).padStart(2, '0')}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-pink-500 opacity-60">System Online</span>
                     </div>
                  </div>
                )}

                {/* --- NEW TEMPLATE: CIRCUITRY (ID-02-Retro) --- */}
                {summaryTemplate === 'ID-02-Retro' && (
                  <div className="flex-1 flex items-center justify-around px-12 bg-zinc-950 relative overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path d="M 0 50 H 20 V 20 H 40 V 80 H 60 V 50 H 100" fill="none" stroke="cyan" strokeWidth="0.5" />
                       <path d="M 0 20 H 10 V 80 H 30 V 40 H 100" fill="none" stroke="cyan" strokeWidth="0.5" />
                    </svg>
                    <div className="w-32 h-32 rounded-3xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center relative">
                       <div className="absolute inset-0 animate-pulse bg-cyan-500/10 rounded-3xl" />
                       <Cpu className="w-16 h-16 text-cyan-400" />
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500">Core Sync</span>
                       <span className="text-[32px] font-black text-white leading-none">ACTIVE</span>
                       <div className="flex gap-1.5 mt-2">
                          {[1, 2, 3, 4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-cyan-500" />)}
                       </div>
                    </div>
                  </div>
                )}

                {/* --- NEW TEMPLATE: NEON AURA (ID-1-Pop) --- */}
                {summaryTemplate === 'ID-1-Pop' && (
                  <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-zinc-950">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                      transition={{ duration: 10, repeat: Infinity }}
                      className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500 opacity-20 blur-[100px]" 
                    />
                    <div className="relative z-10 flex flex-col items-center">
                       <div className="flex items-baseline gap-2">
                          <span className="text-[84px] font-black text-white tracking-tighter leading-none">{currentTime.getHours()}:</span>
                          <span className="text-[84px] font-black text-white/20 tracking-tighter leading-none">{String(currentTime.getMinutes()).padStart(2, '0')}</span>
                       </div>
                       <div className="mt-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                          <span className="text-[12px] font-black uppercase tracking-widest text-purple-400">Spectrum Mode</span>
                       </div>
                    </div>
                  </div>
                )}

                {/* --- DESIGN: ORIGINAL PRO (Moderno) --- */}
                {summaryTemplate === 'Moderno' && (
                  <div className={clsx(
                    "flex-1 flex bg-white/5 rounded-[32px] border border-white/5",
                    (dockMode === 'left' || dockMode === 'right') ? "flex-col p-3 gap-3" : "gap-6 px-8 py-4"
                  )}>
                    <div 
                      className={clsx(
                        "flex items-center gap-4 shrink-0",
                        (dockMode === 'left' || dockMode === 'right') ? "w-full" : "w-[340px]"
                      )}
                    >
                      <div className="w-[80px] h-[80px] rounded-[24px] overflow-hidden shrink-0 border border-white/10 bg-zinc-900 relative shadow-2xl group cursor-pointer" onClick={() => openApp('Spotify')}>
                        {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <Music className="w-8 h-8 m-auto opacity-10" />}
                        <div className="absolute -bottom-1 -right-1 bg-[#fc3c44] w-7 h-7 rounded-full flex items-center justify-center border-4 border-black shadow-2xl"><Music className="w-3 h-3 text-white" /></div>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 text-left gap-0.5">
                        <span className="text-[15px] font-black truncate tracking-tight leading-tight text-white/90">{media.isPlaying ? media.title : 'Ready to Play'}</span>
                        <span className="text-[10px] font-black truncate uppercase text-blue-400/80 tracking-widest">{media.isPlaying ? media.artist : 'Select a Source'}</span>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'prev')} className="opacity-40 hover:opacity-100 hover:scale-125 transition-all"><SkipBack className="w-4 h-4" /></button>
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'playPause')} className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl">
                            {media.isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                          </button>
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'next')} className="opacity-40 hover:opacity-100 hover:scale-125 transition-all"><SkipForward className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                    <div className={clsx(
                      "flex-1 flex flex-col justify-center",
                      (dockMode === 'left' || dockMode === 'right') ? "border-t border-white/5 pt-3 px-1" : "px-6 border-l border-white/5"
                    )}>
                       <div className="flex justify-between items-baseline mb-2">
                          <span className="text-[16px] font-black tracking-tighter text-white/90">{currentTime.toLocaleString(lang, { month: 'short', day: 'numeric' })}</span>
                          <span className="text-[9px] font-black uppercase text-blue-500 tracking-[0.2em]">Agenda</span>
                       </div>
                       <div className="space-y-1.5">
                          {events.slice(0, 2).map((ev, i) => (
                             <div key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                                <div className={clsx("w-1.5 h-1.5 rounded-full shrink-0", ev.type === 'video' ? 'bg-blue-400' : 'bg-emerald-400')} />
                                <span className="text-[9px] font-black truncate flex-1 text-white/80">{ev.title}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {/* --- TEMPLATE: MÍNIMO (Sleek, minimalist with big clock) --- */}
                {summaryTemplate === 'Mínimo' && (
                   <div className="flex-1 flex items-center px-12 gap-12 bg-white/5 rounded-[32px]">
                     <div className="flex items-center gap-4 min-w-0 max-w-[40%]">
                       <div className="w-16 h-16 rounded-[20px] overflow-hidden shrink-0 border border-white/10 bg-zinc-900 relative shadow-xl">
                         {media.thumbnail ? <img src={media.thumbnail} className="w-full h-full object-cover" /> : <Music className="w-6 h-6 m-auto opacity-10" />}
                       </div>
                       <div className="flex flex-col min-w-0 text-left">
                         <span className="text-[15px] font-black truncate tracking-tight text-white/90">{media.title}</span>
                         <span className="text-[10px] font-bold opacity-30 truncate uppercase tracking-widest">{media.artist}</span>
                       </div>
                     </div>
                     <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                     <div className="flex-1 flex flex-col items-start">
                        <div className="flex items-baseline gap-3">
                          <span className="text-[42px] font-black tracking-[-0.05em] leading-none text-blue-400">
                             {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </span>
                          <span className="text-[12px] font-black opacity-30 uppercase tracking-[0.3em]">
                             {currentTime.getHours() >= 12 ? 'PM' : 'AM'}
                          </span>
                        </div>
                     </div>
                   </div>
                )}

                {/* --- DESIGN: CYBER RUNNER (ID-Runner) --- */}
                {summaryTemplate === 'ID-Runner' && (
                  <div className="flex-1 flex flex-col items-center justify-center bg-[#050810] relative overflow-hidden rounded-[32px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]" />
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />
                    <div className="flex items-center gap-16 relative z-10">
                      <div className="flex flex-col items-end">
                        <span className="text-[72px] font-black text-white italic tracking-tighter leading-none">{currentTime.getHours()}:</span>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                           <span className="text-[12px] font-black uppercase tracking-[0.4em] text-blue-500/80">Active</span>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute -inset-8 bg-blue-500/20 blur-[40px] rounded-full group-hover:bg-blue-500/30 transition-all duration-700" />
                        <div className="w-40 h-40 rounded-full border border-white/10 flex items-center justify-center relative bg-white/5 backdrop-blur-md">
                          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                             <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                             <motion.circle cx="50" cy="50" r="48" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="301.4" animate={{ strokeDashoffset: [301.4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                          </svg>
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }} className="relative">
                             <Activity className="w-12 h-12 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                          </motion.div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[72px] font-black text-blue-500 italic tracking-tighter leading-none">{String(currentTime.getMinutes()).padStart(2, '0')}</span>
                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">Notchly Pro</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- DESIGN: GLASS MORPHIC PRO (ID-Glass-Pro) --- */}
                {summaryTemplate === 'ID-Glass-Pro' && (
                  <div className="flex-1 p-6 flex items-stretch rounded-[32px] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-emerald-500/20" />
                    <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/20 shadow-2xl p-10 flex items-center justify-between">
                       <div className="flex flex-col gap-2">
                          <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40">Premium Surface</span>
                          <span className="text-[48px] font-black text-white tracking-tighter">{currentTime.getHours()}:{String(currentTime.getMinutes()).padStart(2, '0')}</span>
                          <div className="flex items-center gap-3 mt-4">
                             <div className="px-4 py-2 bg-white/10 rounded-full border border-white/10 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-[11px] font-black text-white">85% Power</span>
                             </div>
                          </div>
                       </div>
                       <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-white/10 to-transparent border border-white/20 shadow-inner flex items-center justify-center">
                          <div className="w-20 h-20 bg-white/20 blur-xl rounded-full animate-pulse" />
                          <Cloud className="absolute w-12 h-12 text-white/80" />
                       </div>
                    </div>
                  </div>
                )}

                {/* --- DESIGN: NEON HORIZON (ID-Horizon) --- */}
                {summaryTemplate === 'ID-Horizon' && (
                  <div className="flex-1 bg-black flex flex-col items-center justify-center rounded-[32px] relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_right,#ff008033_1px,transparent_1px),linear-gradient(to_bottom,#ff008033_1px,transparent_1px)] bg-[size:40px_40px] [perspective:500px] [transform:rotateX(60deg)]" />
                    <div className="w-64 h-32 bg-gradient-to-t from-pink-500 via-orange-400 to-yellow-300 rounded-t-full shadow-[0_-20px_50px_rgba(255,0,128,0.5)] relative flex flex-col items-center justify-end pb-4">
                       <div className="w-full h-[2px] bg-black/20 my-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                       <div className="w-full h-[2px] bg-black/20 my-1" />
                       <div className="w-full h-[2px] bg-black/20 my-1" />
                    </div>
                    <div className="absolute top-12 flex flex-col items-center">
                       <span className="text-[72px] font-black text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">{currentTime.getHours()}:{String(currentTime.getMinutes()).padStart(2, '0')}</span>
                       <span className="text-[12px] font-black uppercase tracking-[1em] text-pink-500">Horizon v2</span>
                    </div>
                  </div>
                )}

                {/* --- EXPANDED: NEON BEATS (ID-Neon-Media) --- */}
                {summaryTemplate === 'ID-Neon-Media' && (
                  <div className="flex-1 flex bg-[#030008] border border-pink-500/30 rounded-[32px] p-6 gap-6 text-white w-full h-full relative overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.15)]">
                    <div className="absolute -inset-10 bg-gradient-to-tr from-pink-500/10 via-transparent to-cyan-500/10 blur-2xl pointer-events-none" />
                    <div className="flex items-center gap-4 shrink-0 w-[240px]">
                      <motion.div 
                        animate={{ rotate: media.isPlaying ? 360 : 0 }} 
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }} 
                        className="w-16 h-16 rounded-full border-2 border-pink-500 flex items-center justify-center relative shadow-[0_0_20px_rgba(236,72,153,0.4)] bg-black/80"
                      >
                        {media.thumbnail ? (
                          <img src={media.thumbnail} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Music className="w-7 h-7 text-pink-500" />
                        )}
                        <div className="absolute w-4 h-4 bg-cyan-400 rounded-full border-2 border-black -top-0.5 right-0 shadow-[0_0_8px_#22d3ee]" />
                      </motion.div>
                      <div className="flex flex-col text-left min-w-0 flex-1">
                        <span className="text-[16px] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 truncate leading-tight">
                          {media.isPlaying ? media.title : 'Neon Beats'}
                        </span>
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mt-1 truncate">
                          {media.isPlaying ? media.artist : 'Active Wave'}
                        </span>
                        <div className="flex items-center gap-3 mt-3">
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'prev')} className="opacity-40 hover:opacity-100 hover:scale-125 transition-all"><SkipBack className="w-4 h-4 text-pink-400" /></button>
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'playPause')} className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                            {media.isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                          </button>
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'next')} className="opacity-40 hover:opacity-100 hover:scale-125 transition-all"><SkipForward className="w-4 h-4 text-pink-400" /></button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-2 border-l border-white/10 pl-6">
                      <div className="flex justify-between items-center text-[9px] font-black opacity-40 tracking-wider">
                        <span>Audio Spectrum</span>
                        <span className="text-cyan-400 animate-pulse">STEREO SYNC</span>
                      </div>
                      <div className="flex gap-[3px] h-16 items-end">
                        {[40, 90, 60, 100, 30, 80, 50, 90, 70, 40, 85, 60, 95, 35, 75].map((h, i) => (
                          <motion.div 
                            key={i} 
                            animate={{ height: media.isPlaying ? [`20%`, `${h}%`, `20%`] : `20%` }} 
                            transition={{ duration: 0.6 + i*0.06, repeat: Infinity }} 
                            className="flex-1 bg-gradient-to-t from-pink-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.3)]" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- EXPANDED: ATMOSPHERE GLASS (ID-Glass-Weather) --- */}
                {summaryTemplate === 'ID-Glass-Weather' && (
                  <div className="flex-1 flex bg-white/5 border border-white/10 rounded-[32px] p-6 gap-6 text-white w-full h-full relative overflow-hidden backdrop-blur-md shadow-2xl">
                    <div className="absolute top-[-30%] left-[-20%] w-[50%] h-[80%] bg-blue-500/20 blur-[80px] rounded-full" />
                    <div className="flex items-center gap-4 shrink-0">
                      <motion.div 
                        animate={{ y: [-4, 4, -4] }} 
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-lg"
                      >
                        <Cloud className="w-14 h-14 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]" />
                      </motion.div>
                      <div className="flex flex-col text-left">
                        <span className="text-[36px] font-black leading-none tracking-tighter">{weather.temp}°C</span>
                        <span className="text-[10px] font-black uppercase text-blue-300 tracking-[0.2em] mt-1">Atmosphere Pro</span>
                        <span className="text-[9px] font-bold text-white/40 mt-0.5">{weather.city}</span>
                      </div>
                    </div>
                    <div className="flex-1 flex justify-around items-center border-l border-white/10 pl-6">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black opacity-40 uppercase tracking-wider">Wind Speed</span>
                        <span className="text-[16px] font-black text-cyan-400 tracking-tight">12 km/h</span>
                        <div className="w-12 h-1 bg-cyan-500/20 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-cyan-400 w-1/3" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black opacity-40 uppercase tracking-wider">Humidity</span>
                        <span className="text-[16px] font-black text-blue-400 tracking-tight">65%</span>
                        <div className="w-12 h-1 bg-blue-500/20 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-blue-400 w-[65%]" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black opacity-40 uppercase tracking-wider">UV Index</span>
                        <span className="text-[16px] font-black text-amber-400 tracking-tight">Low (2)</span>
                        <div className="w-12 h-1 bg-amber-500/20 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-amber-400 w-1/5" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- EXPANDED: DEVICE HUB (ID-Device-Manager) --- */}
                {summaryTemplate === 'ID-Device-Manager' && (
                  <div className="flex-1 flex bg-zinc-950 border border-white/5 rounded-[32px] p-6 gap-6 text-white w-full h-full justify-between items-center shadow-inner">
                    <div className="flex flex-col items-start gap-1 shrink-0 w-[180px] text-left">
                      <span className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.25em]">Device Hub</span>
                      <h3 className="text-[22px] font-black tracking-tight">4 Connected</h3>
                      <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-indigo-50/10 border border-indigo-500/20 rounded-full">
                        <Bluetooth className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        <span className="text-[9.5px] font-black text-indigo-400">Bluetooth Active</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3 h-full">
                      {[
                        { name: 'Sony WH-1000XM5', battery: 90, type: 'audio' },
                        { name: 'MX Master 3S', battery: 80, type: 'mouse' },
                        { name: 'MX Keys Mini', battery: 100, type: 'keyboard' },
                        { name: 'Galaxy S24 Ultra', battery: 74, type: 'phone' }
                      ].map((dev, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center justify-between text-left hover:bg-white/10 transition-all duration-300">
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-black text-white/90 truncate max-w-[120px]">{dev.name}</span>
                            <span className="text-[8px] font-bold opacity-30 uppercase mt-0.5">{dev.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-indigo-400">{dev.battery}%</span>
                            <div className="w-5 h-2.5 rounded-sm border border-white/20 p-[1px] flex items-center">
                              <div className="h-full bg-indigo-400 rounded-[1px]" style={{ width: `${dev.battery}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- EXPANDED: COSMIC DISK (ID-Orbit-Music) --- */}
                {summaryTemplate === 'ID-Orbit-Music' && (
                  <div className="flex-1 flex bg-[#03010b] border border-purple-500/20 rounded-[32px] p-6 gap-6 text-white w-full h-full relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                    <div className="absolute -inset-10 bg-gradient-to-r from-purple-900/20 to-cyan-900/25 blur-3xl pointer-events-none" />
                    <div className="flex items-center justify-center shrink-0 w-[160px] relative">
                      <div className="absolute inset-0 border border-dashed border-purple-500/25 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
                      <motion.div 
                        animate={{ rotate: media.isPlaying ? 360 : 0 }} 
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }} 
                        className="w-20 h-20 rounded-full border border-purple-500/40 flex items-center justify-center relative bg-black/90 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                      >
                        {media.thumbnail ? (
                          <img src={media.thumbnail} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Music className="w-8 h-8 text-purple-400 animate-pulse" />
                        )}
                        <div className="absolute w-3 h-3 bg-cyan-400 rounded-full border border-black -top-1" />
                      </motion.div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-left py-2 border-l border-white/10 pl-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black uppercase text-purple-400 tracking-[0.3em]">Cosmic Orbit</span>
                        <h2 className="text-[18px] font-black text-white truncate max-w-[280px] mt-1">{media.isPlaying ? media.title : 'Cosmic Disk'}</h2>
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{media.isPlaying ? media.artist : 'Active'}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'prev')} className="opacity-40 hover:opacity-100 hover:scale-125 transition-all"><SkipBack className="w-4 h-4 text-purple-400" /></button>
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'playPause')} className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            {media.isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                          </button>
                          <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'next')} className="opacity-40 hover:opacity-100 hover:scale-125 transition-all"><SkipForward className="w-4 h-4 text-purple-400" /></button>
                        </div>
                        <div className="flex-1 flex items-center gap-3">
                          <div className="flex-1 h-1 bg-purple-950 rounded-full overflow-hidden">
                            <motion.div 
                              animate={{ width: media.isPlaying ? '40%' : '0%' }}
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_10px_#a855f7]" 
                            />
                          </div>
                          <span className="text-[8px] font-black text-purple-400 font-mono">1:42 / 3:55</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- EXPANDED: IOS MUSIC PRO (ID-iPhone-Pro) --- */}
                {summaryTemplate === 'ID-iPhone-Pro' && (
                  <div className="flex-1 flex flex-col bg-black rounded-[32px] p-5 gap-3 text-white w-full h-full relative overflow-hidden select-none border border-white/5 shadow-2xl">
                    {/* Top Row: Cover, Titles, and Sound Wave */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <div className="w-[56px] h-[56px] rounded-[14px] overflow-hidden shrink-0 border border-white/10 bg-zinc-900 relative shadow-2xl">
                          {media.thumbnail ? (
                            <img src={media.thumbnail} className="w-full h-full object-cover" />
                          ) : (
                            <Music className="w-6 h-6 m-auto text-emerald-400" />
                          )}
                        </div>
                        <div className="flex flex-col text-left min-w-0">
                          <span className="text-[16px] font-black text-white truncate max-w-[200px] leading-tight tracking-tight">
                            {media.isPlaying ? media.title : 'No Playing'}
                          </span>
                          <span className="text-[11px] font-bold text-zinc-400 truncate max-w-[200px] mt-0.5">
                            {media.isPlaying ? media.artist : 'Select music'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-[3px] h-8 items-end px-3">
                        {[30, 80, 50, 90, 40].map((h, i) => (
                          <motion.div 
                            key={i} 
                            animate={{ height: media.isPlaying ? [`20%`, `${h}%`, `20%`] : `20%` }} 
                            transition={{ duration: 0.5 + i*0.08, repeat: Infinity }} 
                            className="w-[3px] bg-emerald-400 rounded-full" 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar Row */}
                    <div className="flex flex-col gap-1 w-full mt-1">
                      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden w-full relative">
                        <motion.div 
                          animate={{ width: media.isPlaying ? '35%' : '0%' }}
                          className="h-full bg-white rounded-full shadow-[0_0_8px_white]" 
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500 font-mono">
                        <span>0:45</span>
                        <span>-2:50</span>
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-center gap-6 mt-1 w-full">
                      <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'prev')} className="text-white opacity-60 hover:opacity-100 hover:scale-110 active:scale-95 transition-all"><SkipBack className="w-5 h-5 fill-current" /></button>
                      <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'playPause')} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl">
                        {media.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                      <button onClick={() => (window as any).ipcRenderer?.send('media-command', 'next')} className="text-white opacity-60 hover:opacity-100 hover:scale-110 active:scale-95 transition-all"><SkipForward className="w-5 h-5 fill-current" /></button>
                    </div>
                  </div>
                )}

                {/* FALLBACK FOR OTHER THEMES */}
                {!['ID-Google', 'ID-iOS', 'ID-Dashboard', 'ID-C1', 'ID-01-Art', 'ID-14-Pop', 'ID-Synth', 'ID-M2-Retro', 'ID-02-Retro', 'ID-1-Pop', 'Moderno', 'Mínimo', 'ID-Runner', 'ID-Glass-Pro', 'ID-Horizon', 'ID-Neon-Media', 'ID-Glass-Weather', 'ID-Device-Manager', 'ID-Orbit-Music', 'ID-iPhone-Pro'].includes(summaryTemplate) && (
                  <div className="flex-1 flex items-center justify-center bg-zinc-900 rounded-[32px] border border-white/5 m-4">
                     <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl mb-4">
                           <Activity className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-[20px] font-black uppercase tracking-[0.5em] text-white/40">{summaryTemplate.replace('ID-', '')} Mode</span>
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

                {/* DOCK POSITION CONFIG (Sistema Tab Sync) */}
                <div className="flex flex-col gap-1.5 mt-1.5 no-drag pointer-events-auto">
                  <span className="text-[8px] font-black opacity-35 tracking-widest uppercase">Alineación de la Isla</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['top', 'floating', 'left', 'right'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={(e) => { e.stopPropagation(); setDockMode(mode); }}
                        className="py-2 rounded-xl border font-black text-[8px] uppercase tracking-tighter transition-all"
                        style={{
                          background: dockMode === mode ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                          borderColor: dockMode === mode ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.06)',
                          color: dockMode === mode ? '#60a5fa' : 'inherit',
                          opacity: dockMode === mode ? 1 : 0.6,
                        }}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MULTIMEDIA — album art left + controls right */}
            {activeView === 'Multimedia' && (
              <div className={clsx(
                "absolute inset-0 flex",
                isSideDock ? "flex-col p-4 justify-between" : "items-stretch"
              )}>
                {isSideDock ? (
                  // RESPONSIVE SIDE DOCK MULTIMEDIA LAYOUT
                  <div className="flex-1 flex flex-col justify-between h-full no-drag" onPointerDown={(e) => e.stopPropagation()}>
                    {/* Top: Album Art / Video Preview */}
                    <div className="flex flex-col items-center justify-center gap-2">
                      <motion.div 
                        layout
                        className={clsx(
                          "rounded-[22px] overflow-hidden border border-white/10 bg-zinc-950 relative shadow-2xl cursor-pointer group",
                          showPreview ? "w-full aspect-video max-h-[140px]" : "w-28 h-28"
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

                    {/* Middle: Track info & media controls */}
                    <div className="flex flex-col items-center justify-center gap-2 text-center my-2">
                      <div className="flex flex-col w-full text-center px-2">
                        <span className="text-[14px] font-black truncate w-full tracking-tighter leading-none">{media.title || 'Ningún medio'}</span>
                        <span className="text-[10px] font-bold truncate w-full mt-1 opacity-40">{media.artist || 'Desconocido'}</span>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-1">
                        <button 
                          onClick={() => (window as any).ipcRenderer?.send('media-command', 'prev')}      
                          className="hover:scale-125 transition-all opacity-40 hover:opacity-100"
                        >
                          <SkipBack className="w-4.5 h-4.5" />
                        </button>
                        <button      
                          onClick={() => (window as any).ipcRenderer?.send('media-command', 'playPause')} 
                          className="w-10 h-10 rounded-full flex items-center justify-center border outline-none hover:scale-105 active:scale-95 transition-all shadow-xl bg-white/5 border-white/10"
                        >
                          {media.isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>
                        <button 
                          onClick={() => (window as any).ipcRenderer?.send('media-command', 'next')}      
                          className="hover:scale-125 transition-all opacity-40 hover:opacity-100"
                        >
                          <SkipForward className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom: Horizontal volume slider */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl w-full">
                      <Volume2 className="w-4 h-4 opacity-50 shrink-0" />
                      <input type="range" min={0} max={100} value={volume}
                        onChange={e => setVol(Number(e.target.value))}
                        className="flex-1 h-1 rounded-full outline-none cursor-pointer"
                        style={{ accentColor: '#3b82f6' }}
                      />
                      <span className="text-[9px] font-black tabular-nums opacity-50 shrink-0">{volume}%</span>
                    </div>
                  </div>
                ) : (
                  // ORIGINAL FLOATING/TOP DOCK LAYOUT
                  <>
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
                  </>
                )}
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
                <div className={clsx(
                  "relative flex items-center justify-center transition-all duration-300",
                  (dockMode === 'left' || dockMode === 'right') ? "w-[280px] h-[280px] scale-[0.68]" : "w-[450px] h-[450px]"
                )}>
                  
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
              <div className={clsx("flex-1 rounded-[34px] overflow-hidden border border-white/5 bg-black relative flex flex-col transition-opacity", isTransitioning && "opacity-60")}>
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
              <div className={clsx("flex-1 rounded-[20px] overflow-hidden border border-red-500/10 bg-black relative flex flex-col shadow-2xl transition-opacity", isTransitioning && "opacity-60")}>
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

            {activeView === 'Tienda' && (
              <div className="absolute inset-0 flex flex-col p-4 pointer-events-auto" onMouseEnter={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', false)}>
                <TiendaView 
                  t={t}
                  templates={storeTemplates}
                  auras={storeAuras}
                  currentT={summaryTemplate}
                  currentA={auraColor}
                  dockMode={dockMode}
                  onApplyT={(id: any) => {
                    setSummaryTemplate(id);
                    localStorage.setItem('summaryTemplate', id);
                  }}
                  onApplyA={(color: string) => {
                    setAuraColor(color);
                    localStorage.setItem('auraColor', color);
                  }}
                />
              </div>
            )}

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

                      {updateInfo.status === 'no-update' && (
                        <div className="flex flex-col items-center gap-4 text-center">
                          <div className="w-20 h-20 rounded-[38px] bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <CheckCircle2 className="w-12 h-12 text-green-400" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[16px] font-black uppercase text-green-400 tracking-widest">{t.updNone}</span>
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">Todo está en orden</p>
                          </div>
                        </div>
                      )}

                      {updateInfo.status === 'error' && (
                        <div className="flex flex-col items-center gap-4 text-center">
                          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/10">
                             <Trash2 className="w-10 h-10 text-red-500" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[14px] font-black text-red-400 uppercase tracking-widest">{t.updErr}</span>
                            <p className="text-[9px] uppercase font-bold max-w-[300px]" style={{ color: isLightMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}>{updateInfo.error || t.updErr}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setUpdateInfo({ version: '...', status: 'checking' });
                              (window as any).ipcRenderer?.send('check-for-updates');
                            }}
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
          </div>

          {/* Side Dock Sidebar (Right Dock) */}
          {dockMode === 'right' && (
            <div 
              className={clsx(
                "w-10 flex flex-col items-center py-2 justify-between shrink-0 pointer-events-auto select-none no-drag border-l",
                isLightMode ? "border-black/5 bg-black/[0.02]" : "border-white/5 bg-white/[0.02]"
              )}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Upper part: LED CPU monitor + Tab icons */}
              <div className="flex flex-col items-center gap-1.5 w-full">
                {/* Mini LED CPU Monitor */}
                <div className="flex flex-col items-center gap-0.5 mb-1 cursor-default select-none shrink-0" title={`CPU: ${systemInfo.cpu}%`}>
                  <div className="w-1 h-5 rounded-full bg-zinc-800/85 overflow-hidden relative border border-white/5 shadow-inner">
                    <div 
                      className={clsx(
                        "absolute bottom-0 inset-x-0 transition-all duration-500",
                        systemInfo.cpu > 70 ? "bg-red-500 shadow-[0_0_6px_#ef4444]" : 
                        systemInfo.cpu > 40 ? "bg-indigo-500 shadow-[0_0_6px_#6366f1]" : 
                        "bg-emerald-500 shadow-[0_0_6px_#10b981]"
                      )}
                      style={{ height: `${systemInfo.cpu}%` }}
                    />
                  </div>
                  <span className="text-[6px] font-black opacity-30 uppercase tracking-wide">CPU</span>
                </div>

                {/* Tab Icons Scrollable List */}
                <div className="flex flex-col items-center gap-1 w-full overflow-y-auto no-scrollbar max-h-[175px] py-1 border-t border-b" style={{ borderColor: isLightMode ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}>
                  {tabOrder.map(v =>
                    visibleTabs.includes(v) && (() => {
                      const iconMap: any = {
                        'Resumen': <Activity className="w-[13px] h-[13px]" />,
                        'Sistema': <Cpu className="w-[13px] h-[13px]" />,
                        'Multimedia': <Volume2 className="w-[13px] h-[13px]" />,
                        'Notificación': <Bell className="w-[13px] h-[13px]" />,
                        'Herramientas': <Timer className="w-[13px] h-[13px]" />,
                        'Llamada': <Video className="w-[13px] h-[13px]" />,
                        'WhatsApp': <MessageCircle className="w-[13px] h-[13px]" />,
                        'Actualización': <Download className="w-[13px] h-[13px]" />,
                        'Tienda': <ShoppingBag className="w-[13px] h-[13px]" />,
                        'YouTube': (
                          <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        )
                      };
                      return (
                        <button
                          key={v}
                          onClick={() => setActiveView(v as any)}
                          className={clsx(
                            "w-6 h-6 rounded-md flex items-center justify-center transition-all shrink-0",
                            activeView === v
                              ? (isLightMode ? "bg-black text-white" : "bg-white text-black shadow-md")
                              : "opacity-45 hover:opacity-100 hover:bg-white/5"
                          )}
                          title={v}
                        >
                          {iconMap[v] || <Activity className="w-[13px] h-[13px]" />}
                        </button>
                      );
                    })()
                  )}
                </div>
              </div>

              {/* Lower part: Settings / Pin buttons + Battery Indicator */}
              <div className="flex flex-col items-center gap-1 w-full shrink-0">
                <div className="flex flex-col items-center gap-1 w-full border-t pt-1.5" style={{ borderColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                  <button 
                    onClick={() => setIsPinned(!isPinned)}
                    className={clsx(
                      "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                      isPinned ? "text-blue-400" : "opacity-45 hover:opacity-100 hover:bg-white/5"
                    )}
                  >
                    <Pin className="w-[13px] h-[13px]" />
                  </button>
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={clsx(
                      "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                      showSettings ? "text-blue-400" : "opacity-45 hover:opacity-100 hover:bg-white/5"
                    )}
                  >
                    <Settings className="w-[13px] h-[13px]" />
                  </button>
                </div>

                {/* Glowing Battery Capsule */}
                <div className="flex flex-col items-center gap-0.5 mt-0.5 pt-1 border-t w-full" style={{ borderColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                  <div className={clsx(
                    "w-6 h-2.5 rounded flex items-center px-0.5 border relative overflow-hidden",
                    isCharging ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/20 bg-white/5"
                  )} title={`Batería: ${batteryLevel}% ${isCharging ? '(Cargando)' : ''}`}>
                    {/* Battery level fill */}
                    <div 
                      className={clsx(
                        "h-1 rounded-sm transition-all duration-300",
                        isCharging ? "bg-emerald-400" : 
                        batteryLevel < 20 ? "bg-red-500 shadow-[0_0_4px_#ef4444]" : "bg-white"
                      )}
                      style={{ width: `${Math.max(10, Math.min(100, batteryLevel))}%` }}
                    />
                    {/* Battery tip */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-1 rounded-l-sm bg-current opacity-30" />
                    {/* Tiny lightning bolt */}
                    {isCharging && (
                      <span className="absolute inset-0 flex items-center justify-center text-[6px] font-black text-emerald-300 drop-shadow">⚡</span>
                    )}
                  </div>
                  <span className="text-[6px] font-black opacity-35 tracking-tighter leading-none">{batteryLevel}%</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>


        {/* ── SETTINGS OVERLAY (larger, detached-style) ── */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1,  scale: 1,    y: 0   }}
              exit={{   opacity: 0,  scale: 0.97,  y: -8  }}
              className="absolute inset-0 flex flex-col overflow-hidden pointer-events-auto z-[6000]"
              onMouseEnter={() => (window as any).ipcRenderer?.send('set-ignore-mouse-events', false)}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                background: isLightMode ? 'rgba(252,252,252,0.97)' : 'rgba(8,8,8,0.97)',
                backdropFilter: 'blur(40px)',
                borderRadius: dockMode === 'left'
                  ? `0 ${isExpanded ? 40 : 25}px ${isExpanded ? 40 : 25}px 0`
                  : dockMode === 'right'
                  ? `${isExpanded ? 40 : 25}px 0 0 ${isExpanded ? 40 : 25}px`
                  : `0 0 ${WING_R}px ${WING_R}px`,
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
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => toggleTab(v)}
                            className="flex-1 flex items-center justify-between px-4 py-3 rounded-2xl border transition-all font-black text-[11px] uppercase pointer-events-auto"
                            style={{
                              background: visibleTabs.includes(v) ? (isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)') : 'transparent',
                              borderColor: visibleTabs.includes(v) ? (isLightMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)') : (isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'),
                              opacity: visibleTabs.includes(v) ? 1 : 0.4,
                            }}
                          >
                            <span>{(() => {
                              const keyMap: any = { 'Notificación': 'notificacion', 'WhatsApp': 'whatsapp', 'YouTube': 'youtube', 'Herramientas': 'timer', 'Actualización': 'update', 'Tienda': 'tienda' };
                              const key = keyMap[v] || v.toLowerCase();
                              return t[key] || v;
                            })()}</span>
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
                        {t[k.toLowerCase()] || k}
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

                    {/* DOCK POSITION CONFIG */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Alineación</span>
                      <div className="grid grid-cols-4 gap-1.5 pointer-events-auto">
                        {(['top', 'floating', 'left', 'right'] as const).map(mode => (
                          <button
                            key={mode}
                            onClick={() => setDockMode(mode)}
                            className="py-2.5 rounded-xl border font-black text-[9px] uppercase tracking-tighter transition-all"
                            style={{
                              background: dockMode === mode ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                              borderColor: dockMode === mode ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.06)',
                              color: dockMode === mode ? '#60a5fa' : 'inherit',
                              opacity: dockMode === mode ? 1 : 0.6,
                            }}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Minimalismo</span>
                    <button
                      onClick={() => {
                        const next = !superPill;
                        setSuperPill(next);
                        localStorage.setItem('superPill', JSON.stringify(next));
                      }}
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

                  {/* DIAGNÓSTICO Y PERMISOS */}
                  <div className="flex flex-col gap-3 mt-4 pb-12">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Diagnóstico</span>
                    <div className="flex flex-col gap-3 p-5 rounded-[28px] border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                       <div className="flex justify-between items-center px-1">
                          <span className="text-[9px] font-black uppercase opacity-40">{t.notifPerm}</span>
                          <span className={clsx("text-[9px] font-black uppercase", notifStatus.includes('Allowed') ? "text-emerald-400" : "text-amber-400")}>{notifStatus}</span>
                       </div>
                       <div className="flex gap-2">
                        <button 
                          onClick={() => (window as any).ipcRenderer?.send('request-notification-access')}
                          className="flex-1 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase rounded-xl border border-blue-500/10 transition-all no-drag"
                        >
                          {t.notifReq}
                        </button>
                        <button 
                          onClick={() => (window as any).ipcRenderer?.send('start-calendar-monitor')}
                          className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[9px] font-black uppercase rounded-xl border border-white/5 transition-all no-drag"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                       </div>
                       <button
                         onClick={() => (window as any).ipcRenderer?.send('app-quit')}
                         className="w-full py-3 mt-2 bg-red-500/15 hover:bg-red-500/30 text-red-400 hover:text-red-200 text-[10px] font-black uppercase rounded-xl border border-red-500/25 transition-all no-drag flex items-center justify-center gap-1.5"
                       >
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                         </svg>
                         {t.closeApp}
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div 
          className="absolute left-full ml-2 top-1 pointer-events-auto flex flex-row items-center gap-2 translate-y-[-2px]"
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
