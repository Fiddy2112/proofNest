"use client";

import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { ShieldCheck, Fingerprint, Clock, Link2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function HowItWorksPage() {
  const { domRef: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { domRef: stepsRef, isVisible: stepsVisible } = useScrollReveal({ delay: 100 });

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 overflow-x-hidden">
      <AnimatedBackground mousePos={{ x: 0, y: 0 }} scrolled={true} />

      {/* HERO */}
      <section
        ref={heroRef}
        className={`px-6 pt-40 pb-32 max-w-5xl mx-auto text-center relative z-10
        transition-all duration-700 ${
          heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 text-[11px] uppercase tracking-widest text-slate-400">
          How it works
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-tight">
          Simple steps.
          <br />
          Permanent results.
        </h1>

        <p className="mt-8 text-lg text-slate-400 max-w-2xl mx-auto">
          ProofNest removes friction between creating something
          and proving it existed — without changing how you work.
        </p>
      </section>

      {/* STEPS */}
      <section
        ref={stepsRef}
        className={`px-6 pb-40 max-w-6xl mx-auto relative z-10
        transition-all duration-700 ${
          stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="grid md:grid-cols-2 gap-16">
          {/* STEP 1 */}
          <Step
            icon={<Fingerprint />}
            title="Create your content"
            desc="Write an idea, draft, note, or document like you normally would.
                  No special format. No preparation. No workflow changes."
          />

          {/* STEP 2 */}
          <Step
            icon={<ShieldCheck />}
            title="Generate a fingerprint"
            desc="ProofNest creates a unique cryptographic fingerprint that represents
                  your content — without exposing or modifying it."
          />

          {/* STEP 3 */}
          <Step
            icon={<Clock />}
            title="Lock it in time"
            desc="That fingerprint is sealed to an immutable timestamp that does not
                  depend on ProofNest’s servers and cannot be altered."
          />

          {/* STEP 4 */}
          <Step
            icon={<Link2 />}
            title="Verify or share anytime"
            desc="You receive a proof link that anyone can verify.
                  No account. No permission. No trust required."
          />
        </div>

        {/* FOOTNOTE */}
        <div className="mt-24 text-center max-w-2xl mx-auto">
          <p className="text-slate-500 text-sm leading-relaxed">
            ProofNest does not claim ownership of your work.
            It does not modify your content.
            It simply proves that something existed — at a specific moment in time.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------- */

function Step({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10
        flex items-center justify-center text-white">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-white tracking-tight">
        {title}
      </h3>

      <p className="text-slate-400 leading-relaxed text-base">
        {desc}
      </p>
    </div>
  );
}
