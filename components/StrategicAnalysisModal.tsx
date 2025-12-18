
import React from 'react';
import { X, TrendingUp, Shield, Zap, Globe, BarChart3, ChevronRight } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const StrategicAnalysisModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-lg text-white tracking-tight uppercase">Strategic Market Intelligence</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Executive Summary */}
          <div className="space-y-4">
            <h3 className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">Executive Roadmap</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Clean-Up Entry', icon: Zap, desc: 'Targeting mid-tier labels to sanitize metadata rejections by 70%.', color: 'text-yellow-400' },
                { title: 'Blockchain Moat', icon: Shield, desc: 'Establishing --blockchain-tag as the "Gold Seal" for royalty fast-tracking.', color: 'text-cyan-400' },
                { title: 'Legacy Migration', icon: Globe, desc: 'Headless API/CLI middleware for Major Labels (UMG, Sony, Warner).', color: 'text-purple-400' }
              ].map((phase, i) => (
                <div key={i} className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl hover:border-slate-700 transition-colors">
                  <phase.icon className={`w-6 h-6 ${phase.color} mb-3`} />
                  <h4 className="text-sm font-bold text-white mb-2">Phase {i+1}: {phase.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Comparison Table */}
          <div className="space-y-4">
            <h3 className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">Competitive Positioning: AURA vs. ROC NATION</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50">
                    <th className="p-3 text-[10px] font-mono text-slate-500 uppercase">Feature</th>
                    <th className="p-3 text-[10px] font-mono text-slate-500 uppercase">Roc Nation (2025)</th>
                    <th className="p-3 text-[10px] font-mono text-cyan-400 uppercase">AURA-DDEX-CLI</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr className="border-b border-slate-800/50">
                    <td className="p-3 text-slate-400 font-bold">Model</td>
                    <td className="p-3 text-slate-300">85/15 Revenue Split</td>
                    <td className="p-3 text-white">SaaS / License-based</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="p-3 text-slate-400 font-bold">Interface</td>
                    <td className="p-3 text-slate-300">Visual Dashboard</td>
                    <td className="p-3 text-white">Headless CLI / API First</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="p-3 text-slate-400 font-bold">Tech Moat</td>
                    <td className="p-3 text-slate-300">Social Sentiment</td>
                    <td className="p-3 text-white">Blockchain Provenance</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="p-3 text-slate-400 font-bold">Target</td>
                    <td className="p-3 text-slate-300">Individual Artists</td>
                    <td className="p-3 text-white">Labels & CMOs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Narrative */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Infrastructure Displacement Strategy
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              AURA's opportunity lies in replacing the commission-based aggregator model. While competitors provide a "sampler-style" UI, they often take up to 15% of revenue. AURA wins by providing the <span className="text-white font-bold">infrastructure</span> that high-volume labels use to avoid commission-leakage entirely.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['AI Metadata Indemnity', 'E&O Insurance', 'Immutability Clause'].map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-cyan-900/20 border border-cyan-500/20 text-cyan-400 text-[9px] font-mono uppercase rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">AURA Tech Systems • Strategic Intelligence Unit • Internal Use Only</p>
        </div>
      </div>
    </div>
  );
};
