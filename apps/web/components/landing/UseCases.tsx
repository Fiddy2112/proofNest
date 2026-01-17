"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Code, Briefcase, Palette, Lightbulb } from "lucide-react";

const useCases = [
  {
    id: 1,
    icon: <Code className="w-5 h-5" />,
    title: "Solo Developers",
    description: "Protect proprietary code, algorithms, and technical decisions before sharing or collaborating."
  },
  {
    id: 2,
    icon: <Briefcase className="w-5 h-5" />,
    title: "Freelancers",
    description: "Timestamp deliverables and proposals to prove scope, delivery, and ownership."
  },
  {
    id: 3,
    icon: <Palette className="w-5 h-5" />,
    title: "Creators & Designers",
    description: "Secure concepts, scripts, and designs before pitching to clients or collaborators."
  },
  {
    id: 4,
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Founders",
    description: "Document early product ideas, roadmaps, and core IP to establish priority."
  }
];

export default function UseCases() {
  const { domRef, isVisible } = useScrollReveal({
    delay: 100,
  });

  return (
    <section ref={domRef} className="px-6 py-32 max-w-6xl mx-auto relative z-10">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">Who uses ProofNest?</h2>
        <p className="text-lg text-slate-400 max-w-2xl">
          Anyone who creates value and needs to prove it.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {useCases.map((useCase) => (
          <div
            key={useCase.id}
            className={`${isVisible ? 'animate-in fade-in duration-500' : ''} p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                {useCase.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">{useCase.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{useCase.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
