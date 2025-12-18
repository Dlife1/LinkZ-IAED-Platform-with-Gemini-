
import React, { useEffect, useRef } from 'react';
import { 
  Activity, Globe, Lock, Music, Target, Zap, AlertTriangle, FileText, Tag, User, Hash, Sparkles, Mic2, TrendingUp, ShieldCheck, Accessibility, Wifi, CreditCard, Unlock, ShieldAlert, Terminal, Key, Rocket, Flame, MapPin, BarChart2
} from 'lucide-react';
import { ContextData, SystemLog, MarketHotspot } from '../types';

interface Props {
  data: ContextData;
  onOpenPayout?: () => void;
  onOpenProfile?: () => void;
  userDisplayName?: string;
}

const getDDEXColor = (status: string) => {
  switch (status) {
    case 'Verified': return 'text-green-400';
    case 'Pending': return 'text-yellow-400';
    case 'Failed': return 'text-red-400';
    default: return 'text-slate-400';
  }
};

const getSRMColor = (status: string) => {
    if (status === 'Secure') return 'text-green-400';
    if (status === 'Flagged') return 'text-red-400';
    return 'text-yellow-500';
};

const GlobalMap = ({ hotspots }: { hotspots: MarketHotspot[] }) => (
    <div className="relative w-full aspect-[2.2/1] bg-slate-900/40 rounded-xl border border-slate-800/60 overflow-hidden group shadow-inner">
        <svg viewBox="0 0 100 50" className="w-full h-full opacity-10 fill-slate-500 stroke-slate-700 stroke-[0.2]">
            <path d="M10,15 L15,10 L25,12 L30,18 L25,25 L15,22 Z M45,10 L55,5 L65,12 L60,25 L45,20 Z M70,25 L85,20 L95,25 L90,40 L70,35 Z M20,35 L30,30 L40,35 L35,45 L20,40 Z" />
        </svg>
        {hotspots.map((spot) => (
            <div key={spot.id} className="absolute" style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="relative flex items-center justify-center">
                    <div className={`absolute w-10 h-10 rounded-full animate-ping opacity-10 ${spot.intensity === 'HIGH' ? 'bg-red-500' : spot.intensity === 'MEDIUM' ? 'bg-orange-500' : 'bg-cyan-500'}`}></div>
                    <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_12px_currentColor] border border-white/20 ${spot.intensity === 'HIGH' ? 'text-red-500 bg-red-500' : spot.intensity === 'MEDIUM' ? 'text-orange-500 bg-orange-500' : 'text-cyan-500 bg-cyan-500'}`}></div>
                </div>
            </div>
        ))}
        <div className="absolute bottom-2 left-3 flex gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 border border-slate-800 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Active Scan</span>
            </div>
        </div>
    </div>
);

const SynergyPulse = ({ score }: { score: number }) => (
    <div className="relative h-12 w-full bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center px-4 gap-4 group">
        <div className="flex-1 flex items-end gap-[1px] h-6">
            {Array.from({length: 30}).map((_, i) => {
                const height = Math.random() * score * 100;
                return (
                    <div 
                        key={i} 
                        className={`w-[2px] rounded-t-sm transition-all duration-500 ${score > 0.9 ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}`}
                        style={{ height: `${Math.max(10, height)}%` }}
                    ></div>
                );
            })}
        </div>
        <div className="text-right flex flex-col items-end">
            <span className="text-[8px] font-mono text-slate-500 uppercase">Synergy Pulse</span>
            <span className={`text-xs font-bold font-mono ${score > 0.9 ? 'text-cyan-400' : 'text-slate-400'}`}>{(score * 100).toFixed(1)}%</span>
        </div>
    </div>
);

const PredictiveHorizon = ({ eq }: { eq: number }) => (
    <div className="p-3 bg-slate-900/30 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] font-mono text-slate-400 uppercase">Equity Horizon</span>
            </div>
            <span className="text-[10px] font-bold text-purple-400">PROACTIVE MODE</span>
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">${(eq * 2.4).toLocaleString()}</span>
            <span className="text-[9px] text-green-400 font-mono">+140% PROJ</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[65%] shadow-[0_0_10px_rgba(168,85,247,0.3)]"></div>
        </div>
    </div>
);

const StatusPill = ({ icon: Icon, label, value, colorClass, active = false }: { icon: any, label: string, value: string | number, colorClass: string, active?: boolean }) => (
  <div className={`flex items-center justify-between p-2 rounded-lg border backdrop-blur-sm transition-all duration-500 ${active ? `bg-slate-900/80 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]` : 'bg-slate-900/40 border-slate-800 opacity-80'}`}>
    <div className="flex items-center gap-2">
      <div className={`p-1 rounded-md bg-slate-950 border border-slate-800 ${colorClass}`}><Icon className="w-3.5 h-3.5" /></div>
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <span className={`font-mono font-bold text-xs ${colorClass}`}>{value}</span>
  </div>
);

const MetadataRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | undefined }) => (
    <div className="flex items-center gap-2 text-xs py-1.5 border-b border-slate-800/40 last:border-0 hover:bg-white/5 transition-colors px-1">
        <Icon className="w-3 h-3 text-slate-500" /><span className="text-slate-500 font-mono w-20 uppercase flex-shrink-0 tracking-tighter">{label}</span><span className="text-slate-300 font-medium truncate flex-1">{value || '-'}</span>
    </div>
);

const IgnitionCard = ({ balance, name, onClick, disabled }: { balance: number, name: string, onClick?: () => void, disabled: boolean }) => (
  <div onClick={!disabled ? onClick : undefined} className={`relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl group select-none transition-all duration-700 perspective-1000 ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-cyan-900/20 cursor-pointer'}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0c1220] to-slate-950 border border-slate-700/40 z-0"></div>
    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.2) 0%, transparent 70%)'}}></div>
    {!disabled && <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10 pointer-events-none"></div>}
    <div className="absolute inset-0 p-5 flex flex-col justify-between z-20">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-slate-950 border border-cyan-400/30 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                    <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                </div>
                <span className="font-bold text-slate-100 tracking-tighter italic text-sm">LinkZ IAED</span>
            </div>
            <div className="text-right">
                <div className="text-[8px] font-mono text-cyan-400 font-bold tracking-widest uppercase">Ignition Card</div>
                <div className="text-[7px] text-slate-500 font-mono tracking-widest opacity-60">AP2.SETTLEMENT.PROTOCOL</div>
            </div>
        </div>
        <div className="flex items-center gap-4">
             <div className="w-10 h-7 rounded bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]"></div>
             </div>
             <Wifi className="w-5 h-5 text-slate-600 rotate-90" />
        </div>
        <div className="flex justify-between items-end">
            <div>
                <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-0.5 opacity-60">Strategic Partner</div>
                <div className="font-mono text-xs text-slate-300 uppercase tracking-wider max-w-[140px] truncate">{name}</div>
            </div>
            <div className="text-right">
                 <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-0.5 opacity-60">Cumulative Equity</div>
                 <div className="font-mono text-base font-bold text-cyan-400 tracking-tight drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">$LINKZ {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
        </div>
    </div>
  </div>
);

const SystemTerminal = ({ logs, activeCLI }: { logs: SystemLog[], activeCLI?: boolean }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);
    return (
        <div className="mt-4 bg-black/80 rounded-xl border border-slate-800/80 p-3 font-mono text-[9px] h-32 overflow-hidden flex flex-col relative shadow-inner">
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 p-1">
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-2 animate-fade-in-up">
                        <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit'})}]</span>
                        <span className={`
                            ${log.type === 'error' ? 'text-red-400' : 
                              log.type === 'success' ? 'text-green-400' : 
                              log.type === 'alpha' ? 'text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 
                              log.type === 'warning' ? 'text-yellow-400' : 'text-cyan-400/80'}
                        `}>
                            {log.type === 'info' ? '>' : 
                             log.type === 'success' ? '✓' : 
                             log.type === 'alpha' ? '◈' : 
                             log.type === 'error' ? '⨯' : '!'} {log.text}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="h-4 flex items-center gap-2 border-t border-slate-800/50 pt-1 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${activeCLI ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-slate-600 uppercase tracking-widest text-[8px] font-bold">{activeCLI ? 'AURA-DDEX BRIDGE CONNECTED' : 'ALPHA CORE STANDBY'}</span>
            </div>
        </div>
    );
};

export const StatusRadar: React.FC<Props> = ({ data, onOpenPayout, onOpenProfile, userDisplayName }) => {
  const isSpiking = data.viralStatus === 'Spiking';
  const hotspots = data.viralSignal?.hotspots || [];

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
                <h3 className="text-xs font-black text-white uppercase tracking-tighter">ASDP v3.5 ALPHA</h3>
                <p className="text-[7px] text-slate-500 font-mono tracking-widest -mt-0.5">PREDICTIVE STRATEGIC AGENT</p>
            </div>
        </div>
        <div onClick={onOpenProfile} className="flex items-center gap-1.5 bg-slate-900/50 border border-slate-800/60 px-2.5 py-1.5 rounded-lg text-[9px] font-mono text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm">
             <User className="w-3 h-3" /> {userDisplayName ? userDisplayName.toUpperCase() : 'PROFILE'}
        </div>
      </div>
      
      <SynergyPulse score={data.synergyScore} />

      <div className="space-y-2">
         <div className="flex items-center justify-between px-1">
            <div className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-2 tracking-widest"><Globe className="w-3 h-3" /> Tactical Alpha Map</div>
            {isSpiking && <span className="text-[7px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold animate-pulse tracking-tighter">HOTSPOT TRIGGER</span>}
         </div>
         <GlobalMap hotspots={hotspots} />
      </div>
      
      <PredictiveHorizon eq={data.projectedEquity} />

      <div className={`p-4 rounded-2xl border transition-all duration-700 relative overflow-hidden ${isSpiking ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'bg-slate-900/40 border-slate-800/80'}`}>
         {isSpiking && <div className="absolute top-0 right-0 p-1.5 bg-red-500 text-white text-[7px] font-black px-2.5 rounded-bl-lg uppercase animate-[pulse_1.5s_infinite]">Alpha Event</div>}
         <div className="flex items-center gap-2 mb-2"><Rocket className={`w-4 h-4 ${isSpiking ? 'text-red-500' : 'text-slate-600'}`} /><span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Strategic Mission</span></div>
         <div className="font-bold text-white text-sm mb-1.5 tracking-tight">{data.activeMission}</div>
         <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50">
            <div className="flex items-center gap-2"><Flame className={`w-3.5 h-3.5 ${isSpiking ? 'text-red-400 animate-bounce' : 'text-slate-700'}`} /><span className={`text-[9px] font-black tracking-widest ${isSpiking ? 'text-red-400' : 'text-slate-600'}`}>{data.viralStatus.toUpperCase()}</span></div>
            {data.viralSignal && <div className="flex gap-4"><div className="text-[9px] font-mono text-slate-500 font-bold">SHZ <span className="text-cyan-400 ml-1">x{data.viralSignal.shazamVelocity.toFixed(2)}</span></div><div className="text-[9px] font-mono text-slate-500 font-bold">TKT <span className="text-pink-400 ml-1">+{data.viralSignal.tikTokMomentum}</span></div></div>}
         </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <StatusPill icon={Target} label="Lock" value={data.lockState} colorClass={data.lockState === 'DEPLOYED' ? "text-green-400" : data.lockState === 'ARMED' ? "text-yellow-400" : "text-red-500"} active={data.lockState !== 'LOCKED'} />
        <StatusPill icon={Music} label="DDEX" value={data.ddexCompliance === 'Verified' ? 'PASS' : 'AUDIT'} colorClass={getDDEXColor(data.ddexCompliance)} active={data.ddexCompliance === 'Verified'} />
        <StatusPill icon={ShieldCheck} label="SRM" value={data.srmStatus === 'Secure' ? 'READY' : 'SCAN'} colorClass={getSRMColor(data.srmStatus)} active={data.srmStatus === 'Secure'} />
        <StatusPill icon={Accessibility} label="A11Y" value={data.accessibilityState.status === 'Compliant' ? 'OK' : 'WARN'} colorClass={data.accessibilityState.status === 'Compliant' ? "text-purple-400" : "text-slate-500"} active={data.accessibilityState.status === 'Compliant'} />
      </div>
      
      <IgnitionCard balance={data.projectedEquity} name={userDisplayName || 'UNIDENTIFIED ARTIST'} onClick={onOpenPayout} disabled={data.lockState === 'LOCKED'} />

      <div className="pt-4 border-t border-slate-800/60">
        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 space-y-0.5 relative shadow-inner">
            <MetadataRow icon={FileText} label="Asset" value={data.metadata.title} />
            <MetadataRow icon={User} label="Orchestrator" value={data.metadata.artist} />
            <MetadataRow icon={Hash} label="ISRC-V3" value={data.metadata.isrc} />
            <MetadataRow icon={Tag} label="Collective" value={data.metadata.label} />
        </div>
      </div>
      {/* Fix: Replaced auraActive with data.auraProfile.active to resolve "Cannot find name 'auraActive'" error */}
      <SystemTerminal logs={data.systemLogs} activeCLI={data.auraProfile.active} />
    </div>
  );
};
