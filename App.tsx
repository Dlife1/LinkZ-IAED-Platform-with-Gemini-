
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, SendHorizontal, Loader2, Image as ImageIcon, Music, Shield, Radio, X, Link, Check, ExternalLink, User, Terminal, ShieldCheck, Key, AlertCircle, RefreshCw, FileSignature, Fingerprint, ChevronRight, BarChart3, Code, History, AlertTriangle, Zap, Flame, Globe, Upload, Camera, Play, Pause, Volume2, Headset
} from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

import { StatusRadar } from './components/StatusRadar';
import { MandateModal } from './components/MandateModal';
import { AuthModal } from './components/AuthModal';
import { PayoutModal } from './components/PayoutModal';
import { AuraLicenseModal } from './components/AuraLicenseModal';
import { StrategicAnalysisModal } from './components/StrategicAnalysisModal';

import { sendMessageToGemini, generateAudioBriefing } from './services/geminiService';
import { signIn, subscribeToSession, saveSession, getUserProfile, updateUserProfile } from './services/firebaseService';
import { INITIAL_CONTEXT } from './constants';
import { ChatMessage, ContextData, UploadedFile, MandateDetails, SystemLog, UserProfile, PayoutTransaction, ComplianceReportData, ComplianceCheck, StrategicBriefing } from './types';

// Utility for file reading
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
};

const generateDLTHash = () => {
  return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

const BriefingPlayer = ({ briefing }: { briefing: StrategicBriefing }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) {
            const audio = new Audio(`data:audio/pcm;base64,${briefing.audioBase64}`);
            audioRef.current = audio;
            audio.onended = () => setIsPlaying(false);
        }
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="mt-4 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-500/50 transition-all shadow-lg shadow-indigo-900/10">
            <div className="flex items-center gap-4">
                <button 
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 hover:scale-110 transition-transform"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-1" />}
                </button>
                <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{briefing.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">Autonomous Strategic Briefing</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-400">
                <Headset className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                <span className="text-[10px] font-bold font-mono">HI-FI AUDIO</span>
            </div>
        </div>
    );
};

const NegotiationCard = ({ neg }: { neg: any }) => (
    <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileSignature className="w-12 h-12 text-cyan-400" />
        </div>
        <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Active Negotiation</div>
            <div className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                neg.status === 'Negotiating' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500 animate-pulse' : 'bg-green-500/10 border-green-500 text-green-500'
            }`}>
                {neg.status.toUpperCase()}
            </div>
        </div>
        <div className="space-y-1">
            <div className="text-sm font-bold text-white">{neg.counterparty} • {neg.dealType}</div>
            <div className="text-xs text-slate-400">Current Offer: <span className="text-white font-bold">{neg.currentOffer}</span></div>
        </div>
        <div className="pt-2 flex gap-2">
            <button className="flex-1 py-1.5 rounded-lg bg-cyan-600 text-white text-[10px] font-bold hover:bg-cyan-500 transition-colors uppercase tracking-widest">Approve Terms</button>
            <button className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-bold hover:bg-slate-700 transition-colors uppercase tracking-widest">Counter Offer</button>
        </div>
    </div>
);

const App = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    id: 'init-1', 
    role: 'system', 
    text: "AURA Tech ASDP Alpha v3.5 Online. Predictive Opportunity Scanning initialized.", 
    timestamp: Date.now() 
  }]);
  const [contextData, setContextData] = useState<ContextData>(INITIAL_CONTEXT);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMandateSuccess, setShowMandateSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showStrategicModal, setShowStrategicModal] = useState(false);
  const [imageFile, setImageFile] = useState<UploadedFile | null>(null);
  const [audioFile, setAudioFile] = useState<UploadedFile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addSystemLog = (text: string, type: SystemLog['type'] = 'info') => {
    setContextData(prev => ({ ...prev, systemLogs: [ ...prev.systemLogs, { id: crypto.randomUUID(), text, type, timestamp: Date.now() } ].slice(-20) }));
  };

  useEffect(() => {
    const initAuth = async () => {
      const user = await signIn();
      if (user) {
        setUserId(user.uid);
        const profile = await getUserProfile(user.uid);
        if (profile) setUserProfile(profile);
        else setTimeout(() => setShowAuthModal(true), 2000);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;
    return subscribeToSession(userId, (data) => {
      if (data.messages) setMessages(data.messages);
      if (data.contextData) setContextData(data.contextData);
    });
  }, [userId]);

  useEffect(() => {
    const metrics = contextData;
    let derivedState: 'LOCKED' | 'ARMED' | 'DEPLOYED' = 'LOCKED';
    if (metrics.distributionStatus.includes('Live')) derivedState = 'DEPLOYED';
    else if (metrics.synergyScore >= 0.9 && metrics.ddexCompliance === 'Verified') derivedState = 'ARMED';
    if (derivedState !== metrics.lockState) setContextData(prev => ({ ...prev, lockState: derivedState }));
  }, [contextData.synergyScore, contextData.ddexCompliance, contextData.distributionStatus]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleAuthSave = async (profileData: Partial<UserProfile>) => {
    if (!userId) return;
    await updateUserProfile(userId, profileData);
    const updatedProfile = await getUserProfile(userId);
    if (updatedProfile) setUserProfile(updatedProfile);
    setShowAuthModal(false);
    addSystemLog("Artist ID linked to Alpha Core.", "success");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      const uploaded: UploadedFile = { file, base64, mimeType: file.type, type };
      if (type === 'image') {
        setImageFile(uploaded);
        addSystemLog(`Visual buffer ingestion: ${file.name}`, 'info');
      } else {
        setAudioFile(uploaded);
        addSystemLog(`Audio source ingestion: ${file.name}`, 'success');
        setContextData(prev => ({ ...prev, assetName: file.name, ddexCompliance: 'Pending', srmStatus: 'Pending' }));
      }
    } catch (err) { addSystemLog("Asset ingestion stalled.", 'error'); }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !imageFile && !audioFile) || isLoading) return;

    const userMsg: ChatMessage = { 
      id: crypto.randomUUID(), 
      role: 'user', 
      text: input, 
      timestamp: Date.now(), 
      attachments: { 
        imageName: imageFile?.file.name, 
        audioName: audioFile?.file.name,
        image: imageFile?.base64,
        audio: audioFile?.base64
      } 
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    const attachmentsPayload = { image: imageFile || undefined, audio: audioFile || undefined };
    setImageFile(null); setAudioFile(null);

    try {
      const result: GenerateContentResponse = await sendMessageToGemini(newHistory, userMsg.text, contextData, attachmentsPayload);
      const toolCalls = result.functionCalls;
      let newContextData = { ...contextData };
      let contextUpdated = false;
      let newLogs: SystemLog[] = [];
      let mandate: MandateDetails | undefined;
      let complianceReport: ComplianceReportData | undefined;
      let briefing: StrategicBriefing | undefined;

      if (toolCalls && toolCalls.length > 0) {
        for (const fc of toolCalls) {
          if (fc.name === 'generateStrategicBriefing') {
            const args = fc.args as any;
            const audioBase64 = await generateAudioBriefing(args.voicePrompt);
            briefing = {
                id: crypto.randomUUID(),
                title: args.title,
                summary: args.summary,
                audioBase64,
                timestamp: Date.now()
            };
            newContextData.briefings = [briefing, ...(newContextData.briefings || [])].slice(0, 5);
            newLogs.push({ id: crypto.randomUUID(), text: `Alpha Briefing Ready: ${args.title}`, type: 'alpha', timestamp: Date.now() });
            contextUpdated = true;
          } else if (fc.name === 'initiateNegotiation') {
            const args = fc.args as any;
            newContextData.activeNegotiation = {
                counterparty: args.counterparty,
                dealType: args.dealType,
                currentOffer: args.initialOffer,
                status: 'Negotiating'
            };
            newLogs.push({ id: crypto.randomUUID(), text: `Autonomous Negotiation Started: ${args.counterparty}`, type: 'info', timestamp: Date.now() });
            contextUpdated = true;
          } else if (fc.name === 'issueMandate') {
            const args = fc.args as any;
            mandate = { id: crypto.randomUUID(), actionName: args.actionName || 'EXECUTE', urgency: args.urgency || 'MEDIUM', executed: false };
            newLogs.push({ id: crypto.randomUUID(), text: `Alpha Mandate Proposal: ${args.actionName}`, type: 'warning', timestamp: Date.now() });
          } else if (fc.name === 'updateComplianceStatus') {
            const args = fc.args as any;
            newContextData.ddexCompliance = args.status;
            contextUpdated = true;
          } else if (fc.name === 'runViralOpportunityScan') {
              const args = fc.args as any;
              newContextData.viralStatus = args.status;
              newContextData.activeMission = args.recommendedMission || 'Surveillance';
              newContextData.viralSignal = { shazamVelocity: args.shazamVelocity, tikTokMomentum: args.tikTokMomentum, location: args.location, hotspots: args.hotspots };
              contextUpdated = true;
          }
        }
      }

      const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'model', text: result.text || "", timestamp: Date.now(), mandate, complianceReport, briefing, dltHash: contextUpdated ? generateDLTHash() : undefined };
      if (contextUpdated) setContextData({ ...newContextData, systemLogs: [...newContextData.systemLogs, ...newLogs].slice(-20) });
      const finalHistory = [...newHistory, aiMsg];
      setMessages(finalHistory);
      if (userId) saveSession(userId, finalHistory, newContextData);
    } catch (err) { addSystemLog("Alpha-link instability detected.", 'error'); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05)_0%,transparent_50%)] pointer-events-none"></div>
      
      <aside className="hidden md:flex flex-col w-[22rem] border-r border-slate-800/60 bg-slate-950/40 backdrop-blur-2xl z-10 p-6 shadow-2xl overflow-y-auto custom-scrollbar">
        <StatusRadar data={contextData} onOpenPayout={() => setShowPayoutModal(true)} onOpenProfile={() => setShowAuthModal(true)} userDisplayName={userProfile?.artistName} />
      </aside>

      <main className="flex-1 flex flex-col relative z-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar scroll-smooth">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                    <div className={`max-w-[85%] rounded-3xl p-5 shadow-2xl transition-all duration-300 ${
                        msg.role === 'user' 
                        ? 'bg-slate-800/80 border border-slate-700/50 rounded-tr-none' 
                        : msg.role === 'system'
                          ? 'bg-transparent border border-indigo-500/30 text-indigo-300 font-mono text-[10px] uppercase tracking-widest p-2 text-center w-full'
                          : 'bg-[#0f172a]/90 border border-slate-800 rounded-tl-none'
                    }`}>
                        {msg.attachments && (msg.attachments.image || msg.attachments.audio) && (
                          <div className="flex flex-wrap gap-3 mb-4">
                            {msg.attachments.image && (
                              <img src={`data:image/png;base64,${msg.attachments.image}`} className="h-28 w-28 object-cover rounded-2xl border border-slate-700 shadow-xl" />
                            )}
                            {msg.attachments.audio && (
                              <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-2xl border border-cyan-900/30">
                                <Music className="w-5 h-5 text-cyan-400" />
                                <span className="text-[11px] font-mono text-cyan-400 font-bold">{msg.attachments.audioName}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="whitespace-pre-wrap text-[14px] leading-relaxed tracking-tight text-slate-200">{msg.text}</div>
                        
                        {msg.briefing && <BriefingPlayer briefing={msg.briefing} />}
                        
                        {msg.role === 'model' && contextData.activeNegotiation && (
                            <NegotiationCard neg={contextData.activeNegotiation} />
                        )}

                        {msg.mandate && !msg.mandate.executed && (
                            <button onClick={() => setShowMandateSuccess(true)} className="mt-5 w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-[1.02] active:scale-95 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-cyan-900/40">Initiate Alpha Mandate</button>
                        )}
                        
                        {msg.dltHash && (
                            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Fingerprint className="w-3 h-3" /> Ledger Verified</span>
                                <span className="text-[8px] font-mono text-cyan-500/60 break-all truncate max-w-[100px]">{msg.dltHash}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 flex items-center gap-4">
                  <div className="relative">
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                    <div className="absolute inset-0 w-5 h-5 bg-cyan-400 blur-md opacity-20 animate-pulse"></div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono tracking-widest uppercase">Synthesizing Alpha Stream...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-xl">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4 items-end">
                <div className="flex gap-2">
                    <input type="file" accept="image/*" className="hidden" id="img-upload" onChange={(e) => handleFileSelect(e, 'image')} />
                    <label htmlFor="img-upload" className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all border ${imageFile ? 'bg-pink-900/30 border-pink-500 text-pink-400 shadow-lg shadow-pink-900/20' : 'bg-slate-800/80 border-slate-700 text-slate-500 hover:text-pink-400 hover:border-pink-500/30'}`}>
                        <Camera className="w-5 h-5" />
                    </label>

                    <input type="file" accept="audio/*" className="hidden" id="audio-upload" onChange={(e) => handleFileSelect(e, 'audio')} />
                    <label htmlFor="audio-upload" className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all border ${audioFile ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-900/20' : 'bg-slate-800/80 border-slate-700 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30'}`}>
                        <Radio className="w-5 h-5" />
                    </label>
                </div>

                <div className="flex-1 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Command Alpha Agent..." 
                    className="relative w-full bg-[#0f172a] rounded-2xl py-4 px-6 text-[14px] font-mono border border-slate-700/80 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || (!input.trim() && !imageFile && !audioFile)} 
                  className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 hover:scale-[1.05] active:scale-95 disabled:opacity-20 disabled:scale-100 rounded-2xl flex items-center justify-center transition-all shadow-2xl shadow-cyan-500/30"
                >
                  <SendHorizontal className="w-6 h-6 text-white" />
                </button>
            </form>
        </div>
      </main>

      {showMandateSuccess && <MandateModal onClose={() => setShowMandateSuccess(false)} />}
      {showAuthModal && <AuthModal onSave={handleAuthSave} onClose={() => setShowAuthModal(false)} initialData={userProfile || undefined} />}
      {showPayoutModal && userProfile && (
        <PayoutModal 
          balance={contextData.projectedEquity} 
          userProfile={userProfile} 
          onPayout={(amt) => {
            setContextData(prev => ({ ...prev, projectedEquity: prev.projectedEquity - amt }));
            addSystemLog(`AP2 Settlement Dispatched: $${amt}.`, 'success');
          }} 
          onClose={() => setShowPayoutModal(false)} 
        />
      )}
      {showLicenseModal && <AuraLicenseModal onClose={() => setShowLicenseModal(false)} />}
      {showStrategicModal && <StrategicAnalysisModal onClose={() => setShowStrategicModal(false)} />}
    </div>
  );
};

export default App;
