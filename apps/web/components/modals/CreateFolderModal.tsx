"use client";
import { useState } from "react";
import { X, FolderPlus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => Promise<void>;
}

export default function CreateFolderModal({ isOpen, onClose, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    await onConfirm(name);
    setLoading(false);
    setName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[450px] bg-[#0a0a0a] border border-white/10 rounded-2 p-8 shadow-2xl shadow-blue-500/5 overflow-hidden"
          >
            {/* Decor Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />

            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <FolderPlus className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">New Collection</h3>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] ml-1">Collection Name</label>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Project X Proofs"
                    className="w-full bg-white/3 border border-white/10 rounded-2xl py-3 px-5 mt-2 text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-800"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading || !name.trim()}
                    className={`${name.length <= 0 ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'} flex-2 bg-white text-black px-6 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all`}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Collection"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}