"use client";

import {
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="px-6 pb-20 pt-32 text-center relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-8 animate-fade-in">
        Secure timestamps for your work
      </div>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 max-w-4xl mx-auto leading-[1.1] animate-slide-up">
        Prove you created it first.
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto mb-12 leading-relaxed opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        Secure timestamps for your ideas, notes, and documents. No accounts. No crypto. No complexity.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
        <Link href='/signup' className='cursor-pointer'>
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all group shadow-xl shadow-white/5 cursor-pointer">
            Start Proving Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
       <Link href='/how-it-works' className='cursor-pointer'>
             <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur-md cursor-pointer">
          See How It Works
          </button>
       </Link>
      </div>
    </section>
  );
}
