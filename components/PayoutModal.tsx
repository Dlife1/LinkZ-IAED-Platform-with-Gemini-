
import React, { useState } from 'react';
import { CreditCard, ArrowRight, CheckCircle, Smartphone, Lock, Activity } from 'lucide-react';
import { UserProfile, PayoutTransaction } from '../types';

interface Props {
  balance: number;
  userProfile: UserProfile;
  onPayout: (amount: number) => void;
  onClose: () => void;
}

export const PayoutModal: React.FC<Props> = ({ balance, userProfile, onPayout, onClose }) => {
  const [amount, setAmount] = useState<string>(balance.toString());
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [txHash, setTxHash] = useState('');

  const handlePayout = () => {
    setStep('processing');
    
    // Mock processing time
    setTimeout(() => {
        const hash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setTxHash(hash);
        onPayout(parseFloat(amount));
        setStep('success');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
        <div className="bg-slate-900 border border-green-500/20 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(34,197,94,0.1)] relative overflow-hidden">
             
             {step === 'input' && (
                 <div className="p-8">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                AP2 Bridge
                            </h2>
                            <p className="text-xs text-slate-500 font-mono mt-1">LINKZ TO CASH APP GATEWAY</p>
                        </div>
                        <div className="bg-slate-800 px-3 py-1 rounded text-xs font-mono text-slate-400">
                            Available: ${balance.toFixed(2)}
                        </div>
                     </div>

                     <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Destination</label>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">${userProfile.cashtag}</div>
                                <div className="text-[10px] text-slate-500">Cash App Verified</div>
                            </div>
                        </div>
                     </div>

                     <div className="mb-6">
                        <label className="text-[10px] font-mono text-slate-500 uppercase mb-2 block">Withdrawal Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-light text-slate-500">$</span>
                            <input 
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                max={balance}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-8 pr-4 text-3xl font-bold text-white focus:outline-none focus:border-green-500/50 transition-colors"
                            />
                        </div>
                     </div>

                     <button 
                        onClick={handlePayout}
                        disabled={parseFloat(amount) <= 0 || parseFloat(amount) > balance}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                    >
                        INITIATE TRANSFER <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={onClose} className="w-full mt-3 text-xs text-slate-600 hover:text-slate-400">CANCEL</button>
                 </div>
             )}

             {step === 'processing' && (
                 <div className="p-12 text-center">
                     <div className="w-20 h-20 mx-auto mb-6 relative">
                         <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                         <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
                         <Activity className="absolute inset-0 m-auto text-green-500 w-8 h-8 animate-pulse" />
                     </div>
                     <h3 className="text-lg font-bold text-white mb-2">Processing AP2 Settlement</h3>
                     <p className="text-sm text-slate-400 font-mono">Bridging LinkZ Equity to Fiat...</p>
                 </div>
             )}

             {step === 'success' && (
                 <div className="p-8 text-center bg-gradient-to-b from-slate-900 to-slate-950">
                     <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                         <CheckCircle className="w-8 h-8 text-green-500" />
                     </div>
                     <h2 className="text-2xl font-bold text-white mb-1">${parseFloat(amount).toFixed(2)} SENT</h2>
                     <p className="text-sm text-slate-400 mb-6">Successfully transferred to ${userProfile.cashtag}</p>

                     <div className="bg-black/40 rounded-lg p-3 text-left mb-6 border border-slate-800">
                         <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Transaction Hash</div>
                         <div className="text-[10px] font-mono text-green-400/80 break-all">{txHash}</div>
                     </div>

                     <button 
                        onClick={onClose}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-slate-700 transition-all"
                     >
                        CLOSE RECEIPT
                     </button>
                 </div>
             )}

        </div>
    </div>
  );
};
