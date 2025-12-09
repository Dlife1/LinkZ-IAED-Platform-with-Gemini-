
import React, { useState } from 'react';
import { User, Mail, DollarSign, ArrowRight, Shield } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  onSave: (profileData: Partial<UserProfile>) => void;
  initialData?: Partial<UserProfile>;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ onSave, initialData, onClose }) => {
  const [artistName, setArtistName] = useState(initialData?.artistName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [cashtag, setCashtag] = useState(initialData?.cashtag || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay for effect
    setTimeout(() => {
        onSave({ artistName, email, cashtag });
        setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl shadow-cyan-900/20 relative overflow-hidden">
             {/* Decorative Top Line */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600"></div>

             <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Artist Identity</h2>
                        <p className="text-xs text-slate-500 font-mono">LINKZ DAO SECURE PROFILE</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400 ml-1">ARTIST NAME</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-600" />
                            <input 
                                type="text"
                                value={artistName}
                                onChange={(e) => setArtistName(e.target.value)}
                                placeholder="Enter stage name"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400 ml-1">SECURE EMAIL</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-600" />
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.com"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-cyan-400 ml-1 font-bold">CASH APP TAG (AP2 PAYOUT)</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-3 w-5 h-5 flex items-center justify-center">
                                <span className="text-green-500 font-bold text-lg">$</span>
                            </div>
                            <input 
                                type="text"
                                value={cashtag}
                                onChange={(e) => setCashtag(e.target.value.replace('$',''))}
                                placeholder="cashtag"
                                className="w-full bg-slate-950 border border-green-900/30 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all placeholder:text-slate-700"
                                required
                            />
                            <DollarSign className="absolute right-3 top-3 w-5 h-5 text-green-500/30 group-focus-within:text-green-500 transition-colors" />
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1">Required for automated AP2 Protocol settlements.</p>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? 'SECURING IDENTITY...' : 'ESTABLISH LINK'} 
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                    
                     <button 
                        type="button"
                        onClick={onClose}
                        className="w-full text-xs text-slate-500 hover:text-slate-400 py-2"
                    >
                        CANCEL
                    </button>
                </form>
             </div>
        </div>
    </div>
  );
};
