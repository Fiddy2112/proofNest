"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Loader2, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [web3Loading, setWeb3Loading] = useState(false);
  const [web3Error, setWeb3Error] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleWeb3Login = async () => {
    if (typeof window === "undefined") return;

    setWeb3Loading(true);
    setWeb3Error("");

    try {
      if (!(window as unknown as { ethereum?: { isMetaMask?: boolean; request?: (request: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum) {
        throw new Error("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.");
      }

      const ethereum = (window as unknown as { ethereum: { isMetaMask: boolean; request: (request: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;

      const accounts = await ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const address = accounts[0];

      if (!address) {
        throw new Error("No accounts found.");
      }

      const message = `Sign this message to authenticate with ProofNest.\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;

      const signature = await ethereum.request({
        method: "personal_sign",
        params: [message, address],
      }) as string;

      const { error } = await supabase.auth.signInWithPassword({
        email: `${address}@web3.proofnest`,
        password: signature,
      });

      if (error) {
        if (error.message.includes("Invalid credentials") || error.message.includes("Email")) {
          setWeb3Error("Web3 login requires prior account setup. Please contact support or use email login.");
        } else {
          throw error;
        }
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Web3 login failed. Please try again.";
      setWeb3Error(errorMessage);
    } finally {
      setWeb3Loading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <ShieldCheck className="text-black w-7 h-7" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2 tracking-tight">Welcome to ProofNest</h1>
          <p className="text-slate-500 text-center text-sm mb-10">Sign in to your decentralized workspace</p>

          <button
            onClick={handleWeb3Login}
            disabled={web3Loading}
            className="w-full bg-white/5 border border-white/10 font-bold py-4 rounded-2xl mb-4 flex items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {web3Loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </>
            )}
          </button>

          {web3Error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-xs text-red-400">{web3Error}</p>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-4 text-slate-600 font-mono">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase ml-2">Email Address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/3 border border-white/10 rounded-2xl py-3 px-5 text-white outline-none focus:border-white/30 transition-all placeholder:text-slate-800"
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase ml-2">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/3 border border-white/10 rounded-2xl py-3 px-5 text-white outline-none focus:border-white/30 transition-all placeholder:text-slate-800"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Enter Workspace <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button className="text-[10px] font-mono text-slate-600 hover:text-white transition-colors uppercase tracking-widest">
              Create a new identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}