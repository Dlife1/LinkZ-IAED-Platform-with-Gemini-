
import React, { useEffect, useRef } from 'react';
import { 
  Activity, Globe, Lock, Music, Target, Zap, AlertTriangle, FileText, Tag, User, Hash, Sparkles, Mic2, TrendingUp, ShieldCheck, Accessibility, Wifi, CreditCard, Unlock, ShieldAlert
} from 'lucide-react';
import { ContextData, SystemLog } from '../types';

interface Props {
  data: ContextData;
  onOpenPayout?: () => void;
  onOpenProfile?: () => void;
  userDisplayName?: string;
}

// --- Visual Components ---

const StatusPill = ({ 
  icon: Icon, 
  label, 
  value, 
  colorClass, 
  active = false 
}: { 
  icon: any, 
  label: string, 
  value: string | number, 
  colorClass: string, 
  active?: boolean 
}) => (
  <div className={`
      flex items-center justify-between p-2 rounded-lg border backdrop-blur-sm transition-all duration-500
      ${active 
        ? `bg-slate-900/80 border-${colorClass.split('-')[1]}-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]` 
        : 'bg-slate-900/40 border-slate-800 opacity-80'}
  `}>
    <div className="flex items-center gap-2">
      <div className={`p-1 rounded-md bg-slate-950 border border-slate-800 ${colorClass}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <span className={`font-mono font-bold text-xs ${colorClass}`}>
      {value}
    </span>
  </div>
);

const MetadataRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | undefined }) => (
    <div className="flex items-center gap-2 text-xs py-1 border-b border-slate-800/50 last:border-0 hover:bg-white/5 transition-colors px-1">
        <Icon className="w-3 h-3 text-slate-500" />
        <span className="text-slate-500 font-mono w-20 uppercase flex-shrink-0">{label}</span>
        <span className="text-slate-300 font-medium truncate flex-1">{value || '-'}</span>
    </div>
);

// --- Local LinkZ Logo for Card ---
const CardLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M35 35 L65 35 L35 65 L65 65" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
  </svg>
);

// --- Ignition Card Component ---
const IgnitionCard = ({ balance, name, onClick, disabled }: { balance: number, name: string, onClick?: () => void, disabled: boolean }) => (
  <div 
    onClick={!disabled ? onClick : undefined}
    className={`relative w-full aspect-[1.586/1] rounded-xl overflow-hidden shadow-2xl group select-none transition-all duration-500 perspective-1000 ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-cyan-900/20 cursor-pointer'}`}
  >
    {/* Background Layers */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0c1220] to-slate-950 border border-slate-700/50 z-0"></div>
    
    {/* Animated Mesh Grid */}
    <div className="absolute inset-0 opacity-20 z-0" 
         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(6,182,212,0.5) 1px, transparent 0)', backgroundSize: '20px 20px' }}>
    </div>
    
    {/* Holographic Sweep */}
    {!disabled && <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10 pointer-events-none"></div>}

    {/* Content */}
    <div className="absolute inset-0 p-4 flex flex-col justify-between z-20">
        
        {/* Top Row: Logo & Protocol Label */}
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
                <CardLogo className="w-6 h-6 text-cyan-400" />
                <span className="font-bold text-slate-100 tracking-tighter italic">LinkZ</span>
            </div>
            <div className="text-right">
                <div className="text-[9px] font-mono text-cyan-400 font-bold tracking-widest uppercase">Ignition Card</div>
                <div className="text-[7px] text-slate-500 font-mono tracking-widest">AP2 PROTOCOL</div>
            </div>
        </div>

        {/* Middle Row: Chip & Contactless */}
        <div className="flex items-center gap-4 pl-1">
            <div className="w-10 h-8 rounded bg-gradient-to-br from-[#e2c56f] to-[#b38e2d] shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)] flex items-center justify-center border border-[#96741c] relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 border border-black/20 rounded-[3px] m-[3px] flex">
                     <div className="w-1/2 h-full border-r border-black/20"></div>
                     <div className="absolute top-1/2 w-full h-px bg-black/20"></div>
                </div>
            </div>
            <Wifi className="w-6 h-6 text-slate-500/50 rotate-90" />
            <div className={`ml-auto bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md opacity-0 ${!disabled && 'group-hover:opacity-100'} transition-opacity flex items-center gap-1`}>
                TAP TO WALLET <CreditCard className="w-3 h-3" />
            </div>
        </div>

        {/* Card Number (Masked) */}
        <div className="font-mono text-lg text-slate-300/90 tracking-[0.15em] drop-shadow-md mt-2 flex gap-4">
            <span>5444</span>
            <span>5434</span>
            <span>••••</span>
            <span>8888</span>
        </div>

        {/* Bottom Row: Holder & Balance */}
        <div className="flex justify-between items-end mt-1">
            <div>
                 <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-0.5">Orchestrator</div>
                 <div className="font-mono text-xs text-slate-300 uppercase tracking-wider max-w-[120px] truncate">{name}</div>
            </div>
            <div className="text-right">
                 <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-0.5">Projected Equity</div>
                 <div className="font-mono text-sm font-bold text-cyan-400 tracking-tight drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                    $LINKZ {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                 </div>
            </div>
        </div>
    </div>
  </div>
);

// --- Autonomous Lock Monitor ---
const LockMonitor = ({ state }: { state: 'LOCKED' | 'ARMED' | 'DEPLOYED' }) => {
    const isLocked = state === 'LOCKED';
    const isArmed = state === 'ARMED';
    const isDeployed = state === 'DEPLOYED';

    return (
        <div className={`
            relative overflow-hidden rounded-xl border p-3 flex items-center justify-between transition-all duration-500
            ${isLocked ? 'bg-red-950/20 border-red-900/50' : isArmed ? 'bg-yellow-950/20 border-yellow-600/50' : 'bg-green-950/20 border-green-500/50'}
        `}>
            {/* Scanline BG */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>
            
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${
                    isLocked ? 'bg-red-900/20 border-red-500/30' : isArmed ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-green-500/20 border-green-500/50'
                }`}>
                    {isLocked && <Lock className="w-5 h-5 text-red-500" />}
                    {isArmed && <ShieldAlert className="w-5 h-5 text-yellow-500 animate-pulse" />}
                    {isDeployed && <Unlock className="w-5 h-5 text-green-500" />}
                </div>
                <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Autonomous Lock Framework</div>
                    <div className={`text-sm font-bold tracking-tight ${
                        isLocked ? 'text-red-500' : isArmed ? 'text-yellow-500' : 'text-green-400'
                    }`}>
                        {state}
                    </div>
                </div>
            </div>
            
            {/* Status Indicators */}
            <div className="flex gap-1">
                <div className={`w-1.5 h-6 rounded-full ${isLocked ? 'bg-red-500 animate-pulse' : 'bg-red-900/30'}`}></div>
                <div className={`w-1.5 h-6 rounded-full ${isArmed ? 'bg-yellow-500 animate-pulse' : 'bg-yellow-900/30'}`}></div>
                <div className={`w-1.5 h-6 rounded-full ${isDeployed ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-green-900/30'}`}></div>
            </div>
        </div>
    );
};

// --- Vector Radar Chart ---
const VectorRadar = ({ data }: { data: ContextData }) => {
    // Normalize values to 0-1 range
    const metrics = [
        { name: 'SYNERGY', value: data.synergyScore },
        { name: 'COMPLIANCE', value: data.ddexCompliance === 'Verified' ? 1 : data.ddexCompliance === 'Pending' ? 0.5 : 0.2 },
        { name: 'SRM', value: data.srmStatus === 'Secure' ? 1 : data.srmStatus === 'Pending' ? 0.5 : 0.1 },
        { name: 'DISTRO', value: data.distributionStatus.includes('Live') ? 1 : data.distributionStatus === 'Pending' ? 0.5 : 0.1 },
        { name: 'PITCH', value: data.pitchingStatus.includes('Active') ? 1 : data.pitchingStatus === 'Review' ? 0.6 : 0.2 },
    ];

    const size = 200;
    const center = size / 2;
    const radius = 70;
    const angleStep = (Math.PI * 2) / metrics.length;

    const getCoordinates = (value: number, index: number) => {
        const angle = index * angleStep - Math.PI / 2; // Start at top
        const x = center + Math.cos(angle) * (radius * value);
        const y = center + Math.sin(angle) * (radius * value);
        return `${x},${y}`;
    };

    const polyPoints = metrics.map((m, i) => getCoordinates(m.value, i)).join(" ");
    const fullPolyPoints = metrics.map((m, i) => getCoordinates(1, i)).join(" ");
    const lockColor = data.lockState === 'LOCKED' ? '#ef4444' : data.lockState === 'ARMED' ? '#eab308' : '#22d3ee';

    return (
        <div className="relative w-full aspect-square flex items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800/50 overflow-hidden group">
            <svg width={size} height={size} className="animate-[spin_60s_linear_infinite] group-hover:pause">
                {/* Background Grid */}
                <polygon points={fullPolyPoints} fill="none" stroke="#1e293b" strokeWidth="1" />
                {metrics.map((_, i) => (
                    <line 
                        key={i} 
                        x1={center} 
                        y1={center} 
                        x2={getCoordinates(1, i).split(',')[0]} 
                        y2={getCoordinates(1, i).split(',')[1]} 
                        stroke="#1e293b" 
                        strokeWidth="1" 
                    />
                ))}
                
                {/* Data Polygon */}
                <polygon 
                    points={polyPoints} 
                    fill={`${lockColor}33`} 
                    stroke={lockColor} 
                    strokeWidth="2" 
                    className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out"
                />
                
                {/* Points */}
                {metrics.map((m, i) => {
                    const [x, y] = getCoordinates(m.value, i).split(',');
                    return (
                        <circle 
                            key={i} 
                            cx={x} 
                            cy={y} 
                            r="2" 
                            fill="#fff" 
                            className="transition-all duration-1000"
                        />
                    );
                })}
            </svg>
            
            {/* Labels */}
            {metrics.map((m, i) => {
                const angle = i * angleStep - Math.PI / 2;
                // Push labels out slightly further than radius
                const x = center + Math.cos(angle) * (radius + 20);
                const y = center + Math.sin(angle) * (radius + 15);
                return (
                    <div 
                        key={i}
                        className="absolute text-[8px] font-mono font-bold text-cyan-500/80"
                        style={{ 
                            left: x, 
                            top: y, 
                            transform: 'translate(-50%, -50%)',
                            textShadow: '0 0 5px rgba(0,0,0,0.8)'
                        }}
                    >
                        {m.name}
                    </div>
                );
            })}

            {/* Scanning Radar Effect */}
             <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.1)_60deg,transparent_60deg)] animate-[spin_4s_linear_infinite] rounded-full opacity-50 pointer-events-none"></div>
        </div>
    );
};

// --- Audio Visualizer ---
const AudioVisualizer = () => {
    return (
        <div className="flex items-end justify-between h-8 gap-0.5 mt-2 opacity-80">
            {[...Array(20)].map((_, i) => (
                <div 
                    key={i}
                    className="w-1 bg-cyan-500/50 rounded-t-sm animate-pulse"
                    style={{ 
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.05}s`,
                        animationDuration: '0.8s' 
                    }}
                />
            ))}
        </div>
    );
};

// --- System Log Terminal ---
const SystemTerminal = ({ logs }: { logs: SystemLog[] }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="mt-6 bg-black/80 rounded-lg border border-slate-800 p-3 font-mono text-[10px] h-32 overflow-hidden flex flex-col relative">
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10"></div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 p-1">
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-2 animate-fade-in-up">
                        <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                        <span className={`
                            ${log.type === 'error' ? 'text-red-400' : 
                              log.type === 'success' ? 'text-green-400' : 
                              log.type === 'warning' ? 'text-yellow-400' : 'text-cyan-400/80'}
                        `}>
                            {log.type === 'info' ? '>' : log.type === 'success' ? '✓' : log.type === 'error' ? '⨯' : '!'} {log.text}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            {/* Blinking Cursor */}
            <div className="h-4 flex items-center gap-1 border-t border-slate-800/50 pt-1 mt-1">
                <span className="text-green-500 animate-pulse">_</span>
                <span className="text-slate-600">DAEMON ACTIVE</span>
            </div>
        </div>
    );
};

const getDDEXColor = (status: string) => {
  if (status === 'Verified') return 'text-cyan-400';
  if (status === 'Failed') return 'text-red-500';
  return 'text-yellow-500'; // Pending or others
};

const getSRMColor = (status: string) => {
    if (status === 'Secure') return 'text-green-400';
    if (status === 'Flagged') return 'text-red-400';
    return 'text-yellow-500';
};

const getA11YColor = (status: string) => {
    if (status === 'Active') return 'text-indigo-400';
    return 'text-slate-500';
};

export const StatusRadar: React.FC<Props> = ({ data, onOpenPayout, onOpenProfile, userDisplayName }) => {
  const isRolloutActive = data.rolloutState.status !== 'Idle' && data.rolloutState.status !== 'Completed';
  const isHalted = data.rolloutState.status === 'Halted';

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="text-sm font-bold text-cyan-100 uppercase tracking-widest">ASDP V3.1</h3>
        </div>
        <div 
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 cursor-pointer transition-colors"
        >
             <User className="w-3 h-3" />
             {userDisplayName ? userDisplayName.toUpperCase() : 'PROFILE'}
        </div>
      </div>

      {/* Lock Monitor */}
      <LockMonitor state={data.lockState} />

      {/* Primary Visualization: Vector Radar */}
      <VectorRadar data={data} />

      {/* Metrics Pills */}
      <div className="grid grid-cols-2 gap-2">
        <StatusPill 
            icon={Target} 
            label="Synergy" 
            value={data.synergyScore.toFixed(2)} 
            colorClass={data.synergyScore > 0.9 ? "text-green-400" : "text-yellow-400"}
            active={data.synergyScore > 0.9}
        />
        <StatusPill 
            icon={Music} 
            label="DDEX" 
            value={data.ddexCompliance === 'Verified' ? 'OK' : 'WAIT'} 
            colorClass={getDDEXColor(data.ddexCompliance)}
            active={data.ddexCompliance === 'Verified'}
        />
        <StatusPill
            icon={ShieldCheck}
            label="SRM"
            value={data.srmStatus === 'Secure' ? 'SECURE' : data.srmStatus === 'Flagged' ? 'FLAG' : 'SCAN'}
            colorClass={getSRMColor(data.srmStatus)}
            active={data.srmStatus === 'Secure'}
        />
        <StatusPill 
            icon={Globe} 
            label="Distro" 
            value={data.distributionStatus.includes('Live') ? 'ON' : 'OFF'} 
            colorClass={data.distributionStatus.includes('Live') ? "text-purple-400" : "text-slate-500"}
            active={data.distributionStatus.includes('Live')}
        />
        <StatusPill 
            icon={Accessibility} 
            label="A11Y API" 
            value={data.accessibilityState.screenReaderApi === 'Active' ? 'ACTIVE' : 'OFF'} 
            colorClass={getA11YColor(data.accessibilityState.screenReaderApi)}
            active={data.accessibilityState.screenReaderApi === 'Active'}
        />
        <StatusPill 
            icon={Zap} 
            label="Pitch" 
            value={data.pitchingStatus === 'Active (Editorial)' ? 'EDIT' : 'IDLE'} 
            colorClass={data.pitchingStatus === 'Active (Editorial)' ? "text-pink-400" : "text-slate-500"}
        />
      </div>

      {/* AP2 Ignition Card */}
      <IgnitionCard 
         balance={data.projectedEquity} 
         name={userDisplayName || (data.metadata.artist !== 'Unknown Artist' ? data.metadata.artist : 'LINKZ CREATOR')} 
         onClick={onOpenPayout}
         disabled={data.lockState === 'LOCKED'}
      />

      {/* Rollout Module */}
      {(isRolloutActive || isHalted) && (
        <div className={`p-3 rounded-lg border ${isHalted ? 'bg-red-950/20 border-red-500/50' : 'bg-blue-950/20 border-blue-500/50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isHalted ? 'text-red-400' : 'text-blue-400'}`}>
              {isHalted ? 'ROLLOUT HALTED' : 'PHASED ROLLOUT ACTIVE'}
            </span>
            {isHalted && <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />}
          </div>
          
          <div className="flex items-end justify-between mb-1">
             <span className="text-xs text-slate-400 font-mono">Global Propagation</span>
             <span className={`text-sm font-mono font-bold ${isHalted ? 'text-red-400' : 'text-blue-400'}`}>
                {data.rolloutState.percentage}%
             </span>
          </div>
          
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${isHalted ? 'bg-red-500' : 'bg-blue-500 relative'}`}
              style={{ width: `${data.rolloutState.percentage}%` }}
            >
               {!isHalted && (
                 <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 animate-[scanline_1s_infinite_linear]"></div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Asset Metadata Manifest & Visualizer */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] text-slate-500 font-mono uppercase">Asset Manifest</span>
             </div>
             <div className="text-[10px] text-slate-600 font-mono">{data.currentAssetId}</div>
        </div>
        
        <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1 relative">
            <MetadataRow icon={FileText} label="Title" value={data.metadata.title} />
            <MetadataRow icon={User} label="Artist" value={data.metadata.artist} />
            <MetadataRow icon={Hash} label="ISRC" value={data.metadata.isrc} />
            <MetadataRow icon={Tag} label="Label" value={data.metadata.label} />
            <MetadataRow icon={Music} label="Genre" value={data.metadata.genre} />
            <MetadataRow icon={Sparkles} label="Mood" value={data.metadata.mood} />
            <MetadataRow icon={Mic2} label="Quality" value={data.metadata.productionQuality} />
            
            {/* Visualizer triggers if genre/mood is populated (implying audio analysis happened) */}
            {(data.metadata.genre !== 'Unclassified') && (
                <div className="mt-2 pt-2 border-t border-slate-900">
                    <AudioVisualizer />
                </div>
            )}
        </div>
      </div>

      {/* Live System Log */}
      <SystemTerminal logs={data.systemLogs} />
    </div>
  );
};
