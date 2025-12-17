
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Loader2, Image as ImageIcon, Music, Shield, Radio, X, Link, Check, ExternalLink, User, Terminal, ShieldCheck
} from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

import { StatusRadar } from './components/StatusRadar';
import { MandateModal } from './components/MandateModal';
import { AuthModal } from './components/AuthModal';
import { PayoutModal } from './components/PayoutModal';

import { sendMessageToGemini } from './services/geminiService';
import { signIn, subscribeToSession, saveSession, getUserProfile, updateUserProfile } from './services/firebaseService';
import { INITIAL_CONTEXT } from './constants';
import { ChatMessage, ContextData, UploadedFile, MandateDetails, SystemLog, UserProfile, PayoutTransaction } from './types';

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

// Utility for DLT Hash Generation
const generateDLTHash = () => {
  return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

// Custom Logo Component
const LinkZLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" /> {/* cyan-400 */}
        <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Outer Orbital Rings */}
    <circle cx="50" cy="50" r="45" stroke="url(#logoGradient)" strokeWidth="1" strokeOpacity="0.3" />
    <path d="M50 5 A 45 45 0 0 1 95 50" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" className="animate-[spin_10s_linear_infinite]" style={{transformOrigin: '50px 50px'}} />
    <path d="M50 95 A 45 45 0 0 1 5 50" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" className="animate-[spin_10s_linear_infinite_reverse]" style={{transformOrigin: '50px 50px'}} />

    {/* Inner Hexagon Frame */}
    <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" stroke="url(#logoGradient)" strokeWidth="1.5" fill="rgba(34, 211, 238, 0.1)" />

    {/* The 'Z' Monogram */}
    <path d="M35 35 L65 35 L35 65 L65 65" stroke="white" strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter" filter="url(#glow)" />
    
    {/* Core Node */}
    <circle cx="50" cy="50" r="4" fill="#fff" className="animate-pulse" />
  </svg>
);

const App = () => {
  // State
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'init-1',
    role: 'system',
    text: "LinkZ IAED Agent v3.1 Online. \n\nSecure channel established. Upload audio assets for deep-scan analysis and AP2 protocol initialization.",
    timestamp: Date.now()
  }]);
  const [contextData, setContextData] = useState<ContextData>(INITIAL_CONTEXT);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Modals
  const [showMandateSuccess, setShowMandateSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // File Upload State
  const [imageFile, setImageFile] = useState<UploadedFile | null>(null);
  const [audioFile, setAudioFile] = useState<UploadedFile | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper to add logs
  const addSystemLog = (text: string, type: SystemLog['type'] = 'info') => {
    setContextData(prev => ({
        ...prev,
        systemLogs: [
            ...prev.systemLogs, 
            { id: crypto.randomUUID(), text, type, timestamp: Date.now() }
        ].slice(-20) // Keep last 20 logs
    }));
  };

  // --- Auth & Data Subscription ---
  useEffect(() => {
    const initAuth = async () => {
      const user = await signIn();
      if (user) {
        setUserId(user.uid);
        // Check for existing profile
        const profile = await getUserProfile(user.uid);
        if (profile) {
            setUserProfile(profile);
            addSystemLog(`Welcome back, ${profile.artistName}`, 'success');
        } else {
            // Prompt creation if no profile exists
            setTimeout(() => setShowAuthModal(true), 2000);
        }
      } else {
        setUserId("demo-user-" + Math.random().toString(36).substr(2, 9));
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;
    // Subscribe to Firestore updates
    const unsubscribe = subscribeToSession(userId, (data) => {
      if (data.messages) setMessages(data.messages);
      if (data.contextData) setContextData(data.contextData);
    });
    return () => unsubscribe();
  }, [userId]);

  // --- Autonomous Lock Framework Logic ---
  useEffect(() => {
    // Calculate Lock State based on Metrics
    const metrics = contextData;
    const isSynergy = metrics.synergyScore >= 0.9;
    const isCompliance = metrics.ddexCompliance === 'Verified';
    const isSRM = metrics.srmStatus === 'Secure';
    const isA11y = metrics.accessibilityState.screenReaderApi === 'Active';
    
    let derivedState: 'LOCKED' | 'ARMED' | 'DEPLOYED' = 'LOCKED';
    
    if (metrics.distributionStatus.includes('Live')) {
        derivedState = 'DEPLOYED';
    } else if (isSynergy && isCompliance && isSRM && isA11y) {
        derivedState = 'ARMED';
    }
    
    // Only update if changed to avoid infinite loop with log updates
    if (derivedState !== metrics.lockState) {
        // Use functional update to ensure we don't overwrite concurrent changes
        setContextData(prev => ({ ...prev, lockState: derivedState }));
    }
  }, [
      contextData.synergyScore, 
      contextData.ddexCompliance, 
      contextData.srmStatus, 
      contextData.accessibilityState.screenReaderApi, 
      contextData.distributionStatus,
      // Do NOT include contextData.lockState
  ]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Handlers ---

  const handleSaveProfile = async (data: Partial<UserProfile>) => {
      if (!userId) return;
      const newProfile: UserProfile = {
          uid: userId,
          artistName: data.artistName || 'Unknown',
          email: data.email || '',
          cashtag: data.cashtag || '',
          totalEarnings: userProfile?.totalEarnings || 0,
          createdAt: userProfile?.createdAt || Date.now(),
          transactions: userProfile?.transactions || []
      };
      
      await updateUserProfile(userId, newProfile);
      setUserProfile(newProfile);
      setShowAuthModal(false);
      addSystemLog(`Identity Secured: ${newProfile.artistName}`, 'success');
      
      // Update metadata artist name if not set
      if (contextData.metadata.artist === 'Unknown Artist') {
          setContextData(prev => ({
              ...prev,
              metadata: { ...prev.metadata, artist: newProfile.artistName }
          }));
      }
  };

  const handlePayout = async (amount: number) => {
    if (!userId || !userProfile) return;

    // Deduct from context equity
    const newEquity = Math.max(0, contextData.projectedEquity - amount);
    
    // Create transaction record
    const tx: PayoutTransaction = {
        id: crypto.randomUUID(),
        amount: amount,
        currency: 'USD',
        destination: userProfile.cashtag,
        status: 'Completed',
        timestamp: Date.now(),
        hash: generateDLTHash()
    };

    const updatedProfile = {
        ...userProfile,
        transactions: [...userProfile.transactions, tx]
    };

    // Update State
    setContextData(prev => ({ ...prev, projectedEquity: newEquity }));
    setUserProfile(updatedProfile);
    
    // Persist
    await updateUserProfile(userId, updatedProfile);
    saveSession(userId, messages, { ...contextData, projectedEquity: newEquity });

    addSystemLog(`AP2 Withdrawal: $${amount} to $${userProfile.cashtag}`, 'success');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      const uploaded: UploadedFile = {
        file,
        base64,
        mimeType: file.type,
        type
      };

      if (type === 'image') {
        setImageFile(uploaded);
        addSystemLog(`Visual asset buffered: ${file.name}`, 'info');
      } else {
        setAudioFile(uploaded);
        // Simulate immediate analysis update for demo feel
        setContextData(prev => ({
          ...prev,
          assetName: file.name,
          synergyScore: Math.min(prev.synergyScore + 0.1, 0.95),
          ddexCompliance: "Pending", // Reset to pending when new audio is added
          srmStatus: "Pending", // Reset SRM too
          systemLogs: [
              ...prev.systemLogs,
              { id: crypto.randomUUID(), text: `Audio Asset Ingested: ${file.name}`, type: 'success', timestamp: Date.now() },
              { id: crypto.randomUUID(), text: `Triggering Deep-Scan Analysis...`, type: 'info', timestamp: Date.now() + 50 }
          ]
        }));
      }
    } catch (err) {
      console.error("File processing failed", err);
      addSystemLog("File ingestion failed.", 'error');
    }
  };

  const executeMandateAction = (mandate: MandateDetails) => {
    setShowMandateSuccess(true);
    
    // Update State to reflect execution
    const newContext: ContextData = {
      ...contextData,
      synergyScore: 1.0,
      distributionStatus: "Live (Global)" as const,
      pitchingStatus: "Active (Editorial)" as const,
      projectedEquity: contextData.projectedEquity + 2500, // Boost equity on mandate execution
      systemLogs: [
          ...contextData.systemLogs,
          { id: crypto.randomUUID(), text: `MANDATE EXECUTED: ${mandate.actionName}`, type: 'success', timestamp: Date.now() },
          { id: crypto.randomUUID(), text: `Smart Contracts Deployed to Mainnet`, type: 'info', timestamp: Date.now() + 100 }
      ]
    };
    setContextData(newContext);

    // Add confirmation message with DLT Hash
    const confirmMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'system',
      text: `PROTOCOL EXECUTED: ${mandate.actionName}. Smart Contracts deployed on-chain.`,
      timestamp: Date.now(),
      dltHash: generateDLTHash()
    };
    
    const updatedMessages = [...messages, confirmMsg];
    setMessages(updatedMessages);

    if (userId) saveSession(userId, updatedMessages, newContext);
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
      }
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    // Capture attachments for API call before clearing
    const attachmentsPayload = { image: imageFile || undefined, audio: audioFile || undefined };
    
    // Clear inputs
    setImageFile(null);
    setAudioFile(null);

    try {
      const result: GenerateContentResponse = await sendMessageToGemini(
        newHistory, 
        userMsg.text, 
        contextData, 
        attachmentsPayload
      );

      // Use SDK getters for robust response handling
      const textResponse = result.text || "Protocol stalled. Please retry.";
      const toolCalls = result.functionCalls;
      
      let mandate: MandateDetails | undefined;
      let newContextData = { ...contextData };
      let contextUpdated = false;
      let transactionExecuted = false;
      let newLogs: SystemLog[] = [];

      if (toolCalls && toolCalls.length > 0) {
        for (const fc of toolCalls) {
          if (fc.name === 'issueMandate') {
            const args = fc.args as any;
            mandate = {
              id: crypto.randomUUID(),
              actionName: args.actionName || 'EXECUTE_PROTOCOL',
              urgency: args.urgency || 'MEDIUM',
              executed: false
            };
            newLogs.push({ id: crypto.randomUUID(), text: `Mandate Proposal: ${args.actionName}`, type: 'warning', timestamp: Date.now() });
          } else if (fc.name === 'updateComplianceStatus') {
            const args = fc.args as any;
            newContextData = {
              ...newContextData,
              ddexCompliance: args.status,
              ...(args.srmStatus && { srmStatus: args.srmStatus }) // Update SRM if provided
            };
            const srmMsg = args.srmStatus ? ` | SRM: ${args.srmStatus}` : '';
            newLogs.push({ id: crypto.randomUUID(), text: `Compliance Update: ${args.status}${srmMsg}`, type: args.status === 'Verified' ? 'success' : 'error', timestamp: Date.now() });
            contextUpdated = true;
            transactionExecuted = true;
          } else if (fc.name === 'manageRollout') {
             const args = fc.args as any;
             const action = args.action;
             
             if (action === 'START' || action === 'UPDATE') {
                 const pct = args.percentage || 1;
                 newContextData = {
                     ...newContextData,
                     rolloutState: {
                         status: 'Active',
                         percentage: pct
                     },
                     distributionStatus: pct >= 100 ? 'Live (Global)' : 'Live (Phased)',
                     projectedEquity: newContextData.projectedEquity + (pct * 5) // Equity grows with distro
                 };
                 newLogs.push({ id: crypto.randomUUID(), text: `Rollout Velocity: ${pct}%`, type: 'info', timestamp: Date.now() });
             } else if (action === 'HALT') {
                 newContextData = {
                     ...newContextData,
                     rolloutState: {
                         status: 'Halted',
                         percentage: newContextData.rolloutState.percentage // keep current
                     }
                 };
                 newLogs.push({ id: crypto.randomUUID(), text: `ROLLOUT HALTED: SAFETY TRIPWIRE`, type: 'error', timestamp: Date.now() });
             }
             contextUpdated = true;
             transactionExecuted = true;
          } else if (fc.name === 'updateAssetMetadata') {
              const args = fc.args as any;
              newContextData = {
                  ...newContextData,
                  metadata: {
                      ...newContextData.metadata,
                      ...(args.title && { title: args.title }),
                      ...(args.artist && { artist: args.artist }),
                      ...(args.isrc && { isrc: args.isrc }),
                      ...(args.label && { label: args.label }),
                      ...(args.genre && { genre: args.genre }),
                      ...(args.mood && { mood: args.mood }),
                      ...(args.productionQuality && { productionQuality: args.productionQuality }),
                  },
                  projectedEquity: newContextData.projectedEquity + 150 // Metadata verification value add
              };
              newLogs.push({ id: crypto.randomUUID(), text: `Metadata Patched & Optimized`, type: 'success', timestamp: Date.now() });
              contextUpdated = true;
              transactionExecuted = true;
          } else if (fc.name === 'regenerateAssetId') {
              const newId = `LINKZ-${Math.floor(Math.random() * 90000) + 10000}`;
              newContextData = {
                  ...newContextData,
                  currentAssetId: newId
              };
              newLogs.push({ id: crypto.randomUUID(), text: `New Asset ID Generated: ${newId}`, type: 'info', timestamp: Date.now() });
              contextUpdated = true;
              transactionExecuted = true;
          } else if (fc.name === 'manageAccessibility') {
              const args = fc.args as any;
              if (args.action === 'ACTIVATE_API') {
                newContextData = {
                  ...newContextData,
                  accessibilityState: {
                    status: 'Compliant',
                    screenReaderApi: 'Active',
                    wcagScore: 100
                  },
                  projectedEquity: newContextData.projectedEquity + 500
                };
                newLogs.push({ id: crypto.randomUUID(), text: `Screen Reader API: ACTIVE`, type: 'success', timestamp: Date.now() });
                newLogs.push({ id: crypto.randomUUID(), text: `WCAG 3.0 Compliance: 100%`, type: 'success', timestamp: Date.now() + 50 });
              } else if (args.action === 'RUN_AUDIT') {
                newContextData = {
                  ...newContextData,
                  accessibilityState: {
                    status: 'Non-Compliant', // Mock failure to prompt remediation
                    screenReaderApi: 'Inactive',
                    wcagScore: 65
                  }
                };
                newLogs.push({ id: crypto.randomUUID(), text: `Accessibility Audit Failed (Score: 65)`, type: 'error', timestamp: Date.now() });
              }
              contextUpdated = true;
              transactionExecuted = true;
          } else if (fc.name === 'executeAuraDistribution') {
              const args = fc.args as any;
              newContextData = {
                  ...newContextData,
                  currentAssetId: args.releaseId || newContextData.currentAssetId,
                  distributionStatus: 'Live (Global)',
                  synergyScore: 1.0, // Force max synergy for manual override
                  srmStatus: 'Secure',
                  ddexCompliance: 'Verified',
                  pitchingStatus: 'Active (Editorial)',
                  auraProfile: {
                      active: true,
                      releaseId: args.releaseId,
                      ddexProfile: args.ddexProfile,
                      e2eScope: args.e2eScope,
                      blockchainTag: args.blockchainTag
                  }
              };
              
              // Simulate CLI logs
              newLogs.push({ id: crypto.randomUUID(), text: `AURA-DDEX-CLI: Initializing E2E Workflow...`, type: 'info', timestamp: Date.now() });
              newLogs.push({ id: crypto.randomUUID(), text: `Connecting SFTP: ${args.assetSource?.substring(0,25)}...`, type: 'info', timestamp: Date.now() + 100 });
              newLogs.push({ id: crypto.randomUUID(), text: `DDEX Profile Loaded: ${args.ddexProfile}`, type: 'info', timestamp: Date.now() + 200 });
              newLogs.push({ id: crypto.randomUUID(), text: `Audit: ${args.metadataAudit} [PASSED]`, type: 'success', timestamp: Date.now() + 300 });
              newLogs.push({ id: crypto.randomUUID(), text: `Provenance: ${args.blockchainTag} [MINTED]`, type: 'success', timestamp: Date.now() + 400 });
              newLogs.push({ id: crypto.randomUUID(), text: `DISTRIBUTION DEPLOYED: ${args.e2eScope}`, type: 'success', timestamp: Date.now() + 500 });
              
              contextUpdated = true;
              transactionExecuted = true;
          }
        }
      }

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: textResponse,
        timestamp: Date.now(),
        mandate,
        // Generate DLT hash if a transaction-altering tool was run (excluding simple mandates that require confirmation)
        dltHash: transactionExecuted ? generateDLTHash() : undefined
      };

      // Only update local context immediately if tool ran, otherwise rely on normal flow
      if (contextUpdated || newLogs.length > 0) {
        setContextData({
            ...newContextData,
            systemLogs: [...newContextData.systemLogs, ...newLogs].slice(-20)
        });
      }

      const finalHistory = [...newHistory, aiMsg];
      setMessages(finalHistory);
      if (userId) saveSession(userId, finalHistory, newContextData);

    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'system',
        text: "Error: Neural link unstable. API request failed.",
        timestamp: Date.now()
      };
      setMessages([...newHistory, errorMsg]);
      addSystemLog("API Connection Failed", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const insertAuraTemplate = () => {
      setInput('AURA-DDEX-CLI distribute --release-id "R_2025_ZDW_NGR" --asset-source "sftp://secure.aura-supply.com/releases/next_rapgod_v4" --ddex-profile ERN_4.3:AMAZON_PREMIUM:CUSTOM_V1 --e2e-scope GLOBAL_TIER1 --schedule-strategy SMART_WATERFALL:T8W --metadata-audit ENABLE:AI_SEMANTIC_CHECK --rdr-srm-commit TRUE --reporting-frequency DAILY_SYNCHRONOUS --blockchain-tag ENABLE:PROVENANCE_V2 --preflight-check FULL_DSP_COMPLIANCE');
  };

  const insertComplianceTemplate = () => {
    setInput('Perform a DDEX compliance check on the uploaded asset. Report the compliance status (e.g., Verified, Non-Compliant, Pending Review) and provide specific details on any identified issues. If the asset is non-compliant, explain the nature of the violation and suggest immediate remediation steps.');
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden relative selection:bg-cyan-500/30">
      {/* Background Overlay with Local Data URI Noise */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E')] opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 pointer-events-none"></div>

      {/* LEFT PANEL: RADAR */}
      <aside className="hidden md:flex flex-col w-80 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl relative z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-center overflow-hidden">
             <LinkZLogo className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 tracking-tight text-lg">LINKZ <span className="text-cyan-400">IAED</span></h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase">Secure Protocol V3.1</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <StatusRadar 
            data={contextData} 
            onOpenPayout={() => {
                if (userProfile && userProfile.cashtag) {
                    setShowPayoutModal(true);
                } else {
                    setShowAuthModal(true);
                }
            }}
            onOpenProfile={() => setShowAuthModal(true)}
            userDisplayName={userProfile?.artistName}
          />
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col relative z-0 h-full">
        {/* Header (Mobile Only) */}
        <div className="md:hidden h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/80 backdrop-blur">
          <div className="flex items-center">
             <LinkZLogo className="w-8 h-8 text-cyan-400 mr-3" />
             <span className="font-bold text-slate-100">LINKZ PROTOCOL</span>
          </div>
          <button 
            onClick={() => setShowAuthModal(true)}
            className="p-2 text-slate-400 hover:text-cyan-400"
          >
             <User className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar scroll-smooth">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                        max-w-[85%] md:max-w-[70%] rounded-2xl p-4 md:p-6 relative group
                        ${msg.role === 'user' 
                            ? 'bg-slate-800 text-slate-100 rounded-tr-none' 
                            : msg.role === 'system'
                                ? 'bg-transparent border border-cyan-900/50 text-cyan-400 font-mono text-xs w-full max-w-full text-center'
                                : 'bg-slate-900/80 border border-slate-800 text-slate-300 rounded-tl-none shadow-xl shadow-black/20'
                        }
                    `}>
                        {/* Attachments Display */}
                        {msg.attachments && (msg.attachments.imageName || msg.attachments.audioName) && (
                           <div className="flex gap-2 mb-3">
                              {msg.attachments.imageName && (
                                <div className="flex items-center gap-1 text-xs bg-black/20 px-2 py-1 rounded text-pink-400 border border-pink-500/20">
                                  <ImageIcon className="w-3 h-3" /> {msg.attachments.imageName}
                                </div>
                              )}
                               {msg.attachments.audioName && (
                                <div className="flex items-center gap-1 text-xs bg-black/20 px-2 py-1 rounded text-cyan-400 border border-cyan-500/20">
                                  <Music className="w-3 h-3" /> {msg.attachments.audioName}
                                </div>
                              )}
                           </div>
                        )}

                        <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                        
                        {/* Enhanced DLT Hash Display */}
                        {msg.dltHash && (
                            <div className="mt-4 pt-3 border-t border-slate-700/50 flex flex-col gap-2 bg-slate-900/30 -mx-4 -mb-4 p-4 rounded-b-2xl backdrop-blur-sm">
                                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                    <span className="flex items-center gap-1.5 text-cyan-600/80">
                                        <Link className="w-3 h-3" /> 
                                        <span>Immutable Ledger Receipt</span>
                                    </span>
                                    <span className="text-green-400/90 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                                        <Check className="w-3 h-3" /> 
                                        Verified
                                    </span>
                                </div>
                                
                                <div className="font-mono text-[10px] bg-black/40 p-3 rounded-lg text-cyan-500/90 break-all border border-cyan-900/30 flex items-start gap-3 shadow-inner group cursor-pointer hover:bg-black/60 transition-colors relative overflow-hidden">
                                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    <span className="flex-1 leading-relaxed selection:bg-cyan-900">{msg.dltHash}</span>
                                    <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity mt-0.5 text-cyan-400" />
                                </div>

                                <div className="flex items-center justify-between text-[9px] font-mono mt-1 pt-1 border-t border-slate-800/50">
                                    <span className="text-slate-600">Storage Root:</span>
                                    <a 
                                        href={`https://console.firebase.google.com/u/0/project/linkz-dao/firestore/data/artifacts/linkz-v3/users/${userId}/sessions/active`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-slate-500 hover:text-cyan-400 transition-colors border-b border-transparent hover:border-cyan-500/30 pb-0.5 truncate max-w-[200px]"
                                    >
                                        artifacts/linkz-v3/users/{userId?.substring(0,8)}.../sessions/active
                                        <ExternalLink className="w-2 h-2" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Mandate Action Block */}
                        {msg.mandate && !msg.mandate.executed && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50">
                                <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-cyan-400 font-mono uppercase mb-1">Mandate Triggered</div>
                                        <div className="font-bold text-white">{msg.mandate.actionName}</div>
                                        <div className="text-[10px] text-slate-400 mt-1">Urgency: {msg.mandate.urgency}</div>
                                    </div>
                                    <button 
                                        onClick={() => executeMandateAction(msg.mandate!)}
                                        disabled={contextData.lockState === 'LOCKED'}
                                        className={`px-4 py-2 rounded-lg text-xs tracking-wider transition-all font-bold ${
                                            contextData.lockState === 'LOCKED' 
                                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                                            : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                        }`}
                                    >
                                        {contextData.lockState === 'LOCKED' ? 'LOCKED' : 'EXECUTE'}
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Timestamp */}
                        {msg.role !== 'system' && (
                          <div className={`text-[10px] mt-2 opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        )}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                        <span className="text-xs text-slate-500 animate-pulse">Computing strategic vectors...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-slate-950/80 backdrop-blur border-t border-slate-800">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-3">
                {/* Tools */}
                <div className="flex gap-2 pb-1">
                    {/* AURA CLI Quick Action */}
                    <button
                        type="button"
                        onClick={insertAuraTemplate}
                        disabled={isLoading}
                        title="Open Unified Distribution Command Prompt"
                        className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-orange-400 hover:border-orange-500/50"
                    >
                        <Terminal className="w-4 h-4" />
                    </button>

                    {/* Compliance Audit Quick Action */}
                    <button
                        type="button"
                        onClick={insertComplianceTemplate}
                        disabled={isLoading}
                        title="Run Compliance Audit"
                        className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-green-400 hover:border-green-500/50"
                    >
                        <ShieldCheck className="w-5 h-5" />
                    </button>

                    {/* Audio Upload */}
                    <div className="relative group">
                         <input 
                            type="file" 
                            accept="audio/*" 
                            className="hidden" 
                            id="audio-upload"
                            onChange={(e) => handleFileSelect(e, 'audio')}
                            disabled={isLoading}
                        />
                        <label 
                            htmlFor="audio-upload"
                            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border ${
                                audioFile 
                                ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-cyan-400'
                            }`}
                        >
                            <Radio className="w-5 h-5" />
                        </label>
                        {audioFile && (
                            <div className="absolute -top-2 -right-2">
                                <button type="button" onClick={() => setAudioFile(null)} className="bg-slate-900 text-slate-400 hover:text-red-400 rounded-full p-0.5 border border-slate-700"><X className="w-3 h-3" /></button>
                            </div>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="relative group">
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            id="image-upload"
                            onChange={(e) => handleFileSelect(e, 'image')}
                            disabled={isLoading}
                        />
                         <label 
                            htmlFor="image-upload"
                            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border ${
                                imageFile 
                                ? 'bg-pink-900/50 border-pink-500 text-pink-400' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-pink-400'
                            }`}
                        >
                            <ImageIcon className="w-5 h-5" />
                        </label>
                         {imageFile && (
                            <div className="absolute -top-2 -right-2">
                                <button type="button" onClick={() => setImageFile(null)} className="bg-slate-900 text-slate-400 hover:text-red-400 rounded-full p-0.5 border border-slate-700"><X className="w-3 h-3" /></button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Text Field */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={audioFile || imageFile ? "Add strategic context..." : "Enter command..."}
                        disabled={isLoading}
                        className="w-full h-12 bg-slate-800/50 border border-slate-700 rounded-xl pl-4 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || (!input.trim() && !audioFile && !imageFile)}
                        className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center text-slate-400 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
            <div className="max-w-4xl mx-auto mt-2 text-center">
                <p className="text-[9px] text-slate-600 font-mono">LINKZ DAO • SECURE CHANNEL • POWERED BY GEMINI 2.5 FLASH</p>
            </div>
        </div>
      </main>

      {/* Modals */}
      {showMandateSuccess && <MandateModal onClose={() => setShowMandateSuccess(false)} />}
      {showAuthModal && (
        <AuthModal 
            onSave={handleSaveProfile} 
            initialData={userProfile || {}} 
            onClose={() => {
                // Only allow close if profile exists
                if (userProfile) setShowAuthModal(false);
            }} 
        />
      )}
      {showPayoutModal && userProfile && (
        <PayoutModal 
            balance={contextData.projectedEquity} 
            userProfile={userProfile} 
            onPayout={handlePayout}
            onClose={() => setShowPayoutModal(false)}
        />
      )}
    </div>
  );
};

export default App;
