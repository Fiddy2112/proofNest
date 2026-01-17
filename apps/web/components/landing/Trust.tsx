"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Lock, EyeOff, Globe } from "lucide-react";

const trustItems = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Cryptographic verification",
    description: "Every proof uses industry-standard math. No trust required — only verification."
  },
  {
    icon: <EyeOff className="w-5 h-5" />,
    title: "Private content, public proof",
    description: "Your work stays on your device. Only the fingerprint is timestamped and visible."
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Independent existence",
    description: "The timestamp exists beyond any single company, server, or authority."
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Immutable record",
    description: "Once proven, it cannot be edited, replaced, or erased. Ever."
  }
];

export default function Trust() {
  const { domRef, isVisible } = useScrollReveal({
    delay: 100,
  });

  return (
    <section
      ref={domRef}
      className={`px-6 py-32 border-y border-white/5 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-4xl mx-auto text-center space-y-16">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Built on math, not promises.</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every proof uses cryptographic verification. Your content never leaves your device.
            The timestamp exists independently — no single company, server, or authority controls it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
