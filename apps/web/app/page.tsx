
"use client";
import { useEffect, useState } from "react";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import Hero from "@/components/landing/Hero";
import Demo from "@/components/landing/Demo";
import HowItWorks from "@/components/landing/HowItWorks";
import Trust from "@/components/landing/Trust";
import UseCases from "@/components/landing/UseCases";
import CTA from "@/components/landing/CTA";
import { ShieldCheck } from "lucide-react";

const pages = [
  {
    link:"how-it-works",
    title:"How it works"
  },
  {
    link:"#",
    title:"Trust"
  },
  {
    link:"#",
    title:"Use Cases"
  },
  {
    link:"#",
    title:"Pricing"
  }
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-white selection:text-black font-sans antialiased overflow-x-hidden">
      <AnimatedBackground mousePos={mousePos} scrolled={scrolled} />
      {/* navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-black/80 backdrop-blur-xl border-white/10 py-3' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-white/10">
              <ShieldCheck className="text-black w-5 h-5" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">ProofNest</span>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            {pages.map((item) => (
              <a key={item.title} href={item.link} className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
                {item.title}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>
          <button className="hidden md:block bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-all">
            Get Started
          </button>
        </div>
      </nav>
    <main>
      <Hero />
      <Demo />
      <HowItWorks />
      <Trust />
      <UseCases />
      <CTA />
    </main>
    <footer className="px-6 py-20 border-t border-white/5 bg-black/50 backdrop-blur-sm relative z-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center"><ShieldCheck className="text-black w-4 h-4" /></div>
          <span className="text-white font-bold text-lg">ProofNest</span>
        </div>
        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">© 2026 PROOFNEST INC. // REGISTERED IMMUTABILITY SERVICE</p>
      </footer>

      <style>{`
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(500%); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.2; } }
        .animate-scan { animation: scan 2.5s linear infinite; }
        .animate-slide-up { animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .bg-grid-pattern { background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px; }
      `}</style>
    </div>
  );
}
