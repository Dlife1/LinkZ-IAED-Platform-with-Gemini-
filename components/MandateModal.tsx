import React from 'react';
import { CheckCircle, Globe } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const MandateModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(8,145,178,0.2)] overflow-hidden relative">
            {/* Scanning Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-[scan_2s_infinite_linear]"></div>
            
            <div className="p-8 text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center border border-cyan-500/50 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                    <CheckCircle className="w-10 h-10 text-cyan-400" />
                </div>
                
                <div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">PROTOCOL EXECUTED</h2>
                    <p className="text-cyan-400 text-sm font-mono mt-1">BLOCK: {Math.floor(Math.random() * 9000000) + 1000000}</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 text-left space-y-3 text-sm border border-slate-700">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className="text-green-400 font-bold flex items-center"><Globe className="w-3 h-3 mr-1"/> GLOBAL LIVE</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Synergy Lock</span>
                        <span className="text-cyan-300 font-bold">100.0%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">AP2 Token</span>
                        <span className="text-indigo-300 font-bold">MINTED</span>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                >
                    ACKNOWLEDGE
                </button>
            </div>
        </div>
        <style>{`
          @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
    </div>
  );
};
