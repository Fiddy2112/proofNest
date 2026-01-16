"use client";
import { useEffect, useState } from "react";
import { formatAddress, generateContentHash } from "@proofnest/core"; 
import { CheckCircle2, Fingerprint, Database, Shield, FileText, Plus, Search, ChevronRight } from 'lucide-react';
import { toastError, toastSuccess } from "@/utils/notifi";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/lib/supabase/auth-service";
import { dbService } from "@/lib/supabase/db-service";
import CreateFolderModal from "@/components/modals/CreateFolderModal";

export default function DashboardPage() {
  const [demoInput, setDemoInput] = useState('');
  const [demoState, setDemoState] = useState('idle');
  const [activeHash, setActiveHash] = useState('');

  const [folders, setFolders] = useState<{id: string, name: string}[]>([]);
  const [recentProofs, setRecentProofs] = useState<any[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(()=>{
    const loadFolders=async()=>{
      const user = await authService.getCurrentUser();
      if(user){
        const {data} = await dbService.getFolders(user.id);
        if (data) setFolders(data);
      }
    }
    loadFolders();
  },[])

  const fetchHistory = async ()=>{
    const user = await authService.getCurrentUser();
    if(user){
      const data = await dbService.getRecentProofs(user.id);
      setRecentProofs(data || []);
    }
  }

  const handleAddFolder = async (name: string)=>{
    const user = await authService.getCurrentUser()
    if (user) {
    const { data, error } = await dbService.createFolder(user.id, name);
    if (data) {
      setFolders([...folders, data]);
      toastSuccess(3000, "Folder created successfully");
    }
    if (error) toastError(3000, "Failed to create folder");
  }
  }

  const handleCreateProof =async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput || demoState !== 'idle') return;
    setDemoState('hashing');
    const hash = generateContentHash(demoInput);
    setActiveHash(hash);

    try{
      const user = await authService.getCurrentUser()

      if (!user) {
        toastError(3000, "Please login first!");
        setDemoState('idle');
        return;
      }
      

      await dbService.createProofEntry(user.id, demoInput, hash);

      setTimeout(() => {
        setDemoState('anchoring');
        setTimeout(() => setDemoState('proved'), 1500);
      }, 1500);
    }catch(err){
      setDemoState('idle');
      toastError(5000, "Something went wrong");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#050505]">
      <div className="flex flex-1 min-h-0">
        <div className="hidden xl:flex w-64 border-r border-white/5 flex-col p-6 gap-6 shrink-0 bg-[#080808]">
          <div className="flex items-center justify-between text-slate-500 uppercase font-mono text-[10px] tracking-[0.2em]">
            <span>Collections</span>
            <Plus onClick={() => setIsModalOpen(true)} className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            <input placeholder="Search..." className="w-full bg-white/3 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-blue-500/50 transition-all" />
          </div>

          <nav className="space-y-1.5 flex-1">
            {folders.map((f) => (
              <div key={f.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-slate-500 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium">{f.name}</span>
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-4 pt-6 border-t border-white/5 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between text-slate-500 uppercase font-mono text-[10px] tracking-[0.2em] mb-4">
              <span>Recent Activity</span>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {recentProofs.map((proof) => (
                <div 
                  key={proof.id} 
                  className="group p-3 rounded-2xl bg-white/2 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-mono text-blue-400">
                      {formatAddress(proof.content_hash)}...
                    </p>
                    <div className={`w-1.5 h-1.5 rounded-full ${proof.status === 'confirmed' ? 'bg-emerald-500' : 'bg-yellow-500'} shadow-[0_0_5px_rgba(16,185,129,0.5)]`} />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate font-medium group-hover:text-white transition-colors">
                    {proof.notes?.content || "Untitled Proof"}
                  </p>
                  <p className="text-[9px] text-slate-600 mt-1 font-mono">
                    {new Date(proof.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              
              {recentProofs.length === 0 && (
                <p className="text-[10px] text-slate-600 font-mono text-center py-8 border border-dashed border-white/5 rounded-2xl">
                  No data indexed_
                </p>
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Node Active</span>
            </div>
            <p className="text-[9px] text-slate-600 font-mono leading-tight">Sepolia Testnet // v.2.0.1</p>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
            
            <div className="relative flex-1 min-h-[500px] group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/5 to-purple-500/5 rounded-4xl blur-xl" />
              
              <div className="relative h-full bg-[#0a0a0a] border border-white/5 rounded-4xl overflow-hidden flex flex-col lg:flex-row">
                
                <div className="flex-1 p-8 md:p-10 flex flex-col min-w-0">
                  <div className="flex items-center gap-3 mb-8 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">/ workspace / drafts / new_proof.md</span>
                  </div>

                  <textarea 
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    placeholder="Enter the content you want to prove..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xl md:text-2xl text-slate-200 placeholder:text-white/3 resize-none outline-none leading-relaxed font-light"
                  />

                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/3">
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-tight">{demoInput.length} characters</span>
                    <button 
                      onClick={handleCreateProof} 
                      disabled={demoInput.length <= 0 || demoState !== 'idle'} 
                      className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-10 shadow-2xl shadow-white/10"
                    >
                      Create Proof <Fingerprint className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-72 bg-white/2 p-8 md:p-10 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col items-center justify-center text-center">
                  {demoState === 'idle' && (
                    <div className="space-y-4 animate-in fade-in duration-700">
                      <div className="w-16 h-16 rounded-3xl bg-white/3 border border-white/5 flex items-center justify-center mx-auto">
                        <Database className="w-6 h-6 text-slate-700" />
                      </div>
                      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Awaiting<br/>Input</p>
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
      <CreateFolderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleAddFolder} 
      />
    </div>
  );
}