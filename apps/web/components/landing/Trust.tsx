"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FileText, History, Lock } from "lucide-react";

const stats = [
  { id:1,icon: <FileText className="w-5 h-5" />, label: "Proofs Created", val: "2.4M+" },
  { id:2,icon: <History className="w-5 h-5" />, label: "Verification Speed", val: "< 2s" },
  { id:3,icon: <Lock className="w-5 h-5" />, label: "Network Uptime", val: "100%" },
  { id:4,icon: <Lock className="w-5 h-5" />, label: "Zero Knowledge", val: "Private" },
];

export default function Trust() {
  const { domRef, isVisible } = useScrollReveal({
  delay: 100,
});
  return (
    <section 
      ref={domRef}
      className={`px-6 py-24 border-y border-white/5 relative z-10 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Built on math, not trust.</h2>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-3xl font-bold text-white mb-1 tracking-tighter">{stat.val}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
              {stat.icon}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
