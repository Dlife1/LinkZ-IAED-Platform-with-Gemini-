
import React from 'react';
import { X, Shield, FileText, Download, Printer, ShieldCheck } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const AuraLicenseModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white text-slate-900 rounded-lg max-w-3xl w-full h-[85vh] flex flex-col shadow-[0_0_100px_rgba(255,255,255,0.1)] overflow-hidden">
        {/* Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-700" />
            <h2 className="font-bold text-lg tracking-tight uppercase">Master Licensing Agreement</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors" title="Print Agreement">
              <Printer className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors" title="Download PDF">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto p-10 font-serif leading-relaxed text-sm selection:bg-cyan-100">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-2 uppercase tracking-tighter">Master Software Licensing & Distribution Agreement</h1>
              <p className="text-slate-500 italic">Effective Date: {new Date().toLocaleDateString()}</p>
            </div>

            <section className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <h3 className="font-bold uppercase text-xs text-slate-400 mb-1">Licensor</h3>
                  <p className="font-bold text-base">AURA Tech Systems ("AURA")</p>
                </div>
                <div className="w-1/2">
                  <h3 className="font-bold uppercase text-xs text-slate-400 mb-1">Licensee</h3>
                  <p className="font-bold text-base">LinkZ DAO Authorized Orchestrator / [Major Label / DSP / Distributor]</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">1. Scope of License</h3>
              <p>
                AURA hereby grants Licensee a non-exclusive, non-transferable, global license to utilize the AURA-DDEX-CLI Unified Distribution Protocol (the "Software") for the purposes of automating E2E distribution, DDEX ERN 4.3 compliance, and AI-driven metadata auditing.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">2. Intellectual Property & Provenance</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Ownership:</strong> AURA retains all rights, title, and interest in the Software, including the AI semantic models and the Blockchain Provenance V2 tagging logic.</li>
                <li><strong>Data Rights:</strong> Licensee retains ownership of the musical assets (WAV/FLAC) and raw metadata, but grants AURA a limited, anonymized right to use distribution telemetry to improve the AI Audit models.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">3. Deployment & Integration</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>E2E Scope:</strong> The Software shall be the primary gateway for GLOBAL_TIER1 distribution.</li>
                <li><strong>SRM/RDR Integration:</strong> Licensee agrees to utilize the DAILY_SYNCHRONOUS reporting frequency to ensure parity between DSP ingestion and the SRM (Sales & Royalties Management) system.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">4. Financial Terms</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Platform Fee:</strong> A monthly SaaS licensing fee as per the current IAED cohort agreement.</li>
                <li><strong>Processing Royalty:</strong> A volume-based fee of per successful distribution event or per ISRC delivered.</li>
                <li><strong>Audit Credits:</strong> Usage of --metadata-audit is billed per semantic check at the protocol baseline.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">5. Security & Compliance</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>SFTP Protocol:</strong> Licensee must adhere to the secure asset source standards outlined in the aura-ddex-cli.md documentation.</li>
                <li><strong>Preflight Guarantee:</strong> All deliveries must pass the FULL_DSP_COMPLIANCE preflight check. AURA is not liable for DSP rejections if the --preflight-check was bypassed.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">6. AI Metadata Indemnity & Provenance</h3>
              <p>
                AURA incorporates a <strong>Safe Harbor</strong> report for every successful audit. The <strong>Blockchain Immutability Clause</strong> ensures all release logs are cryptographically hashed to establish provable ownership history. AURA provides E&O insurance integration covering up to $1M in potential royalty misallocation.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">7. Term & Termination</h3>
              <p>
                This agreement shall remain in effect for a period of [X] years, with automatic [X]-year renewals unless terminated with 90 days' notice.
              </p>
            </section>

            <div className="pt-12 mt-12 border-t border-slate-200">
              <div className="flex justify-between gap-10">
                <div className="flex-1">
                  <div className="h-10 border-b border-slate-900 font-mono italic text-xs flex items-end pb-1">/S/ AURA_SYSTEMS_DAEMON</div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mt-2">AURA Tech Representative</p>
                </div>
                <div className="flex-1">
                  <div className="h-10 border-b border-slate-900"></div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mt-2">Licensee Representative</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center flex items-center justify-center gap-4">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">AURA Tech Systems • Secure Document Protocol V2.1 • Blockchain Verified</p>
        </div>
      </div>
    </div>
  );
};
