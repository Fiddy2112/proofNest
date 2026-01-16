"use client";

import { 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
   <section className="px-6 pb-20 pt-24 text-center relative z-10">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-8 animate-fade-in shadow-inner">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
      Next-gen proof system
    </div>
    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-8 max-w-6xl mx-auto leading-[0.85] animate-slide-up">
      Truth, <br /> 
      <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-200 to-slate-600 italic">unfiltered.</span>
    </h1>
    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      ProofNest gives a safe place for your ideas and documents.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
      <Link href = '/dashboard' className='cursor-pointer'>
        <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all group shadow-xl shadow-white/5 cursor-pointer">
        Protect Your First Idea <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
      </Link>
      <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all backdrop-blur-md cursor-pointer">
        Explore Trust Model
      </button>
    </div>
  </section>
  );
}
