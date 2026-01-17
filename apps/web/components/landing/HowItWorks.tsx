"use client";

import { useScrollReveal } from '@/hooks/useScrollReveal';
import {
  FileText,
  Fingerprint,
  Clock
} from 'lucide-react';

const steps = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Write or upload",
    desc: "Add your idea, document, or creation. Your content stays private and never leaves your device."
  },
  {
    icon: <Fingerprint className="w-5 h-5" />,
    title: "Create fingerprint",
    desc: "We generate a unique identifier based solely on your content. Think of it as a digital signature."
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Lock in time",
    desc: "Your fingerprint is permanently timestamped. The proof exists independently and is verifiable by anyone."
  }
];

export default function HowItWorks() {
  const { domRef, isVisible } = useScrollReveal({
    delay: 100,
  });

  return (
    <section ref={domRef} className="px-6 py-32 max-w-6xl mx-auto relative z-10">
      <div className={`${isVisible ? 'animate-in fade-in duration-500' : ''} text-center mb-20`}>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">How ProofNest works</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Three simple steps. One permanent record.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/20 transition-all">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
