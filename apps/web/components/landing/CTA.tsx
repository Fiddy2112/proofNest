"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";

export default function CTA() {
  const { domRef, isVisible } = useScrollReveal({
    delay: 100,
  });

  return (
    <section
      ref={domRef}
      className={`px-6 py-40 relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="max-w-3xl mx-auto text-center space-y-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
          Your work is valuable.<br />Prove it.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/dashboard">
            <button className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Start Proving Free
            </button>
          </Link>
        </div>
        <p className="text-sm text-slate-500">
          3 permanent proofs per month. No credit card. No account required.
        </p>
      </div>
    </section>
  );
}
