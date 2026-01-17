"use client";

import { useState, useEffect } from "react";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import {
  ShieldCheck,
  Code,
  Briefcase,
  Palette,
  Lightbulb,
  Zap,
  Target,
  Lock,
  Users,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const useCases = [
  {
    id: "solo-developers",
    icon: <Code className="w-6 h-6" />,
    title: "Solo Developers",
    subtitle: "Protect your code and technical innovations",
    description:
      "Your code represents countless hours of problem-solving. Prove when you wrote it and what it contained — before sharing, open-sourcing, or collaborating.",
    scenarios: [
      "Before open-sourcing a library, timestamp the final version",
      "Prove what your codebase looked like when seeking funding",
      "Document algorithms before technical discussions",
      "Establish priority for patents or IP claims",
    ],
    benefits: [
      "Mathematical proof of code existence",
      "Timestamp for prior art documentation",
      "Protection during collaborations",
      "Evidence for IP disputes",
    ],
  },
  {
    id: "freelancers",
    icon: <Briefcase className="w-6 h-6" />,
    title: "Freelancers",
    subtitle: "Prove scope, delivery, and ownership",
    description:
      "Avoid disputes over what was promised, delivered, and when. Create immutable records of your work at key milestones.",
    scenarios: [
      "Timestamp proposals before sending to clients",
      "Record deliverables at project completion",
      "Document scope changes and approvals",
      "Prove ownership of work after payment disputes",
    ],
    benefits: [
      "Dispute resolution evidence",
      "Clear project timeline records",
      "Professional credibility",
      "Protection from scope creep claims",
    ],
  },
  {
    id: "creators",
    icon: <Palette className="w-6 h-6" />,
    title: "Creators & Designers",
    subtitle: "Secure your creative work",
    description:
      "Your designs, scripts, and creative content deserve protection. Prove what you created and when — before sharing or publishing.",
    scenarios: [
      "Timestamp designs before client presentations",
      "Document scripts before production",
      "Record creative concepts for portfolios",
      "Prove originality for copyright claims",
    ],
    benefits: [
      "Copyright evidence",
      "Portfolio verification",
      "Client trust through transparency",
      "Protection against idea theft",
    ],
  },
  {
    id: "founders",
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Founders",
    subtitle: "Establish priority for your innovations",
    description:
      "Early-stage ventures move fast. Document your product ideas, roadmaps, and core IP before pitching to investors or competitors.",
    scenarios: [
      "Timestamp pitch deck versions before investor meetings",
      "Document product roadmap evolution",
      "Record core IP and technical architecture",
      "Prove idea priority in fast-moving markets",
    ],
    benefits: [
      "Investor credibility through transparency",
      "IP priority documentation",
      "Clear innovation timeline",
      "Reduced IP risk in partnerships",
    ],
  },
];

const industries = [
  {
    icon: <Target className="w-5 h-5" />,
    name: "Software & Tech",
    description: "Code, algorithms, architecture decisions",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    name: "Content & Media",
    description: "Scripts, designs, creative works",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    name: "Legal & Compliance",
    description: "Contracts, disclosures, due diligence",
  },
  {
    icon: <Users className="w-5 h-5" />,
    name: "Consulting",
    description: "Proposals, deliverables, methodologies",
  },
];

export default function UseCasesPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleMouseMove = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 overflow-x-hidden">
      <AnimatedBackground mousePos={mousePos} scrolled={scrolled} />

      {/* NAVIGATION */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 border-b ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-white/10 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center transition-all group-hover:scale-105">
              <ShieldCheck className="text-black w-5 h-5" />
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">
              ProofNest
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <span className="text-sm font-medium text-white">Use Cases</span>
          </div>
          <Link href="/dashboard">
            <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-200 transition-all cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 pt-40 pb-24 max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 text-[11px] font-medium uppercase tracking-widest text-slate-400">
          Use cases
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
          Who uses ProofNest?
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Anyone who creates value and needs to prove it. From developers
          protecting code to founders establishing priority.
        </p>
      </section>

      {/* USE CASES DETAILED */}
      <section className="px-6 py-16 max-w-5xl mx-auto relative z-10">
        <div className="space-y-24">
          {useCases.map((useCase, index) => (
            <div key={useCase.id} id={useCase.id} className="scroll-mt-32">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-white/10">
                      <div className="text-white">{useCase.icon}</div>
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        {useCase.title}
                      </h2>
                      <p className="text-slate-400 font-medium">
                        {useCase.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-400 leading-relaxed text-lg">
                    {useCase.description}
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                        Common scenarios
                      </h3>
                      <ul className="space-y-3">
                        {useCase.scenarios.map((scenario, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                            <span className="text-slate-400 text-sm">
                              {scenario}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                        Key benefits
                      </h3>
                      <ul className="space-y-3">
                        {useCase.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                            <span className="text-slate-400 text-sm">
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="relative lg:sticky lg:top-32">
                  <div className="absolute -inset-1 bg-white/5 rounded-3xl blur-xl"></div>
                  <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <ShieldCheck className="text-black w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          ProofNest
                        </p>
                        <p className="text-xs text-slate-500">
                          {useCase.title} Plan
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                          Status
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <p className="text-sm text-emerald-400 font-medium">
                            Protected
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                          Use Case
                        </p>
                        <p className="text-sm text-white font-medium">
                          {useCase.title}
                        </p>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                          Fingerprint
                        </p>
                        <p className="text-xs font-mono text-slate-300 break-all">
                          {Buffer.from(useCase.title)
                            .toString("hex")
                            .substring(0, 24)}
                          ...
                        </p>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                          Timestamp
                        </p>
                        <p className="text-xs font-mono text-slate-300">
                          January 17, 2026 at 3:42 PM UTC
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <button className="w-full py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all cursor-pointer">
                        Create Proof
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="px-6 py-32 border-y border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Used across industries
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              ProofNest helps professionals in any field where proving work
              matters.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-white/10 bg-white/2 hover:bg-white/4 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mx-auto mb-4">
                  <div className="text-white">{industry.icon}</div>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  {industry.name}
                </h3>
                <p className="text-slate-500 text-sm">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NOW */}
      <section className="px-6 py-32 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Why proof matters now more than ever
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/2">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              AI-generated content
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              With AI creating content at scale, proving human authorship and
              creation date is becoming essential for authenticity.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-white/2">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Remote collaboration
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Teams work across time zones and platforms. Immutable records help
              establish who created what and when.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-white/2">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              IP disputes
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Legal disputes over ownership are increasing. Having timestamped
              proof can be the difference between winning and losing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-white/5 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Ready to protect your work?
          </h2>
          <p className="text-slate-400 text-lg">
            Create your first proof in less than a minute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all cursor-pointer">
                Start Proving Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            3 permanent proofs per month. No credit card. No account required.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-16 border-t border-white/5 bg-black/50 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-black w-4 h-4" />
            </div>
            <span className="text-white font-semibold text-lg">ProofNest</span>
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              How It Works
            </Link>
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Terms
            </a>
          </div>

          <p className="text-xs text-slate-600">
            © 2026 ProofNest. Independent timestamp verification.
          </p>
        </div>
      </footer>
    </div>
  );
}
