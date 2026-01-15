"use client";

import { useScrollReveal } from '@/hooks/useScrollReveal';
import { 
  Lock, 
  History, 
  FileText
} from 'lucide-react';

const steps = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Instant Fingerprint",
    desc: "Every document gets a unique cryptographic hash, ensuring absolute original integrity."
  },
  {
    icon: <History className="w-5 h-5" />,
    title: "Global Witness",
    desc: "Your hash is anchored to a global network, existing permanently and beyond anyone's control."
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Verifiable Assets",
    desc: "Export ownership certificates with international validity to prove your rights at any time."
  }
];

export default function HowItWorks() {
  const { domRef, isVisible } = useScrollReveal({
  delay: 100,
});
  return (
   <section ref={domRef} className="px-6 py-32 max-w-7xl mx-auto relative z-10">
    <div className={`${isVisible ? 'animate-in zoom-in-95 duration-500' : ''} text-center mb-20`}>
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple process, eternal results.</h2>
      <p className="text-slate-500 max-w-2xl mx-auto text-lg">ProofNest removes all technical friction between your idea and its protection.</p>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
      {steps.map((step, i) => (
        <div key={i} className="group relative p-8 rounded-4xl border border-white/5 bg-white/1 hover:bg-white/4 transition-all">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/30 transition-all">{step.icon}</div>
          <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
          <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
        </div>
      ))}
    </div>
  </section>
  );
}
