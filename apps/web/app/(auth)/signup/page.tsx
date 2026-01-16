"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserPlus, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      setIsSubmitted(true);
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-blue-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">We've sent a verification link to <span className="text-white font-medium">{email}</span>. Please click the link to activate your workspace.</p>
          <Link href="/login" className="text-sm font-mono text-blue-500 uppercase tracking-widest hover:text-white transition-colors">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <Link href="/login" className="inline-flex items-center gap-2 text-slate-600 hover:text-white mb-8 transition-colors text-xs font-mono uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>

          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Create Identity</h1>
          <p className="text-slate-500 text-sm mb-10">Start securing your intellectual property today.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase ml-2 tracking-widest">Email Address</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/3 border border-white/10 rounded-2xl py-3 px-5 text-white outline-none focus:border-blue-500/50 transition-all"
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase ml-2 tracking-widest">Password</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/3 border border-white/10 rounded-2xl py-3 px-5 text-white outline-none focus:border-blue-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initialize Account <UserPlus className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">
            By signing up, you agree to the <span className="text-slate-400">Proof Protocols</span>
          </p>
        </div>
      </div>
    </div>
  );
}