"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  Fingerprint,
  Database,
  Shield
} from 'lucide-react';
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Demo() {
  const [demoInput, setDemoInput] = useState('');
  const [demoState, setDemoState] = useState('idle');
  const { domRef, isVisible } = useScrollReveal({
  delay: 100,
});

  const handleCreateProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput || demoState !== 'idle') return;
    setDemoState('hashing');
    setTimeout(() => {
      setDemoState('anchoring');
      setTimeout(() => setDemoState('proved'), 1500);
    }, 1500);
  };

  return (
     <section ref={domRef} className="px-6 py-24 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className={`${isVisible ? 'animate-in zoom-in-95 duration-500' : ''} relative group`}>
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row min-h-[500px]">
              <div className="flex-1 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/20"></div><div className="w-3 h-3 rounded-full bg-yellow-500/20"></div><div className="w-3 h-3 rounded-full bg-green-500/20"></div></div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Workspace // New_Draft.txt</span>
                </div>
                <textarea 
                  placeholder="Paste your concept, draft or snippet here to witness it..."
                  className="w-full h-64 bg-transparent border-none focus:ring-0 text-xl md:text-2xl text-white placeholder:text-slate-800 resize-none leading-relaxed transition-all outline-none focus:outline-none"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  disabled={demoState !== 'idle'}
                />
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-mono">{demoInput.length} characters</div>
                  <button onClick={handleCreateProof} disabled={demoInput.length <= 0||!demoInput || demoState !== 'idle'} className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${demoInput.length <= 0 || demoState !== 'idle' ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white text-black hover:scale-105 active:scale-95 cursor-pointer'}`}>
                    Create Proof <Fingerprint className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-[400px] bg-black/50 p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
                {demoState === 'hashing' && <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-500/10 to-transparent h-20 w-full animate-scan"></div>}
                <div className="relative z-10 w-full">
                  {demoState === 'idle' && (
                    <div className="text-center space-y-6 py-20">
                      <div className="w-20 h-20 rounded-full border border-dashed border-white/20 mx-auto flex items-center justify-center animate-spin-slow"><Database className="text-slate-600 w-8 h-8" /></div>
                      <p className="text-sm text-slate-500 font-medium">Ready to secure content</p>
                    </div>
                  )}
                  {(demoState === 'hashing' || demoState === 'anchoring') && (
                    <div className="space-y-8 py-10 text-center">
                      <div className="w-16 h-16 relative mx-auto">
                        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <Shield className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
                      </div>
                      <span className="text-sm font-bold text-blue-500 uppercase tracking-widest animate-pulse">{demoState === 'hashing' ? 'Hashing Content...' : 'Anchoring to Ledger...'}</span>
                    </div>
                  )}
                  {demoState === 'proved' && (
                    <div className="space-y-6 py-6 animate-in zoom-in-95 duration-500 text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)] rotate-3"><CheckCircle2 className="text-black w-10 h-10" /></div>
                      <div><h4 className="text-xl font-bold text-white mb-1">Proof Registered</h4><p className="text-xs text-green-500/70 font-mono">Immutable & Verified</p></div>
                      <div className="text-left space-y-2">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10"><p className="text-[10px] text-slate-500 font-bold mb-1">DATA FINGERPRINT</p><p className="text-[10px] font-mono text-slate-300 break-all leading-relaxed">8f4e2c...b1a9d0</p></div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10"><p className="text-[10px] text-slate-500 font-bold mb-1">TIMESTAMP</p><p className="text-[10px] font-mono text-slate-300">{new Date().toLocaleString()}</p></div>
                      </div>
                      <button onClick={() => {setDemoState('idle'); setDemoInput('');}} className="text-[11px] font-bold text-slate-500 hover:text-white uppercase tracking-widest cursor-pointer">New Proof</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
