"use client";

import { useState, useEffect } from "react";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import {
  ShieldCheck,
  FileText,
  Fingerprint,
  Clock,
  Lock,
  Eye,
  Globe,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Link2,
  Database,
  Key,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Is my content stored on ProofNest?",
    answer:
      "No. Your content stays on your device. ProofNest only processes a cryptographic fingerprint — a unique identifier derived from your content. The original content never leaves your browser and is never transmitted to our servers.",
  },
  {
    question: "What makes the proof immutable?",
    answer:
      "Once a fingerprint is timestamped, it exists independently of ProofNest. The timestamp is recorded in a way that cannot be altered, deleted, or replaced by any single party — including us. This provides mathematical certainty that the proof existed at that specific moment.",
  },
  {
    question: "Can anyone else access my content?",
    answer:
      "No. Only the fingerprint is made public (if you choose to share it). Your actual content remains private. Think of it like a wax seal on an envelope — it proves the envelope exists without revealing what's inside.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No account is required to create proofs. You can create, verify, and share proofs without signing up. Accounts are optional and only needed for managing your proof history across devices.",
  },
  {
    question: "How long are proofs valid?",
    answer:
      "Forever. Once a proof is created, it exists indefinitely. There is no subscription required to maintain access to your proofs. The verification system does not expire.",
  },
  {
    question: "Can I prove ownership of existing work?",
    answer:
      "Yes. You can create a proof for any content you have. The timestamp reflects when you created the proof — not when the content was originally written. This is useful for establishing the earliest known timestamp for a piece of work.",
  },
];

const securityFeatures = [
  {
    icon: <Key className="w-5 h-5" />,
    title: "Client-side hashing",
    description:
      "All fingerprinting happens in your browser. Your content never travels to our servers.",
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "Distributed records",
    description:
      "Proof records exist beyond any single database or service provider.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Transparent verification",
    description:
      "Anyone can verify a proof without needing permission or an account.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "No lock-in",
    description:
      "Proofs are self-contained. You're never dependent on ProofNest to access them.",
  },
];

export default function HowItWorksPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
            <span className="text-sm font-medium text-white">How It Works</span>
            <Link
              href="/#use-cases"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Use Cases
            </Link>
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
          How ProofNest works
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
          Three steps.
          <br />
          One permanent record.
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Create a verifiable timestamp for your work in minutes. No accounts.
          No crypto jargon. No complexity.
        </p>
      </section>

      {/* PROCESS STEPS */}
      <section className="px-6 py-16 max-w-5xl mx-auto relative z-10">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/10 to-transparent hidden md:block"></div>

          <div className="space-y-24">
            {/* Step 1 */}
            <div className="relative md:pl-24">
              <div className="absolute left-0 md:left-6 top-0 w-12 h-12 rounded-full bg-white text-black font-bold text-lg flex items-center justify-center border-4 border-[#050505] z-10 hidden md:flex">
                1
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center md:hidden">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Write or upload
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    Add your idea, document, or creation. Paste text, upload a
                    file, or start typing. Your content stays entirely on your
                    device — it never leaves your browser.
                  </p>
                  <ul className="space-y-3 text-slate-500 text-sm">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      <span>Plain text, markdown, or code</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      <span>Files up to 10MB</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      <span>No account required</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-white/5 rounded-2xl blur-xl"></div>
                  <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                        Workspace
                      </span>
                    </div>
                    <div className="h-32 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                      <p className="text-slate-600 text-sm">
                        Your content here...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative md:pl-24">
              <div className="absolute left-0 md:left-6 top-0 w-12 h-12 rounded-full bg-white text-black font-bold text-lg flex items-center justify-center border-4 border-[#050505] z-10 hidden md:flex">
                2
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center md:hidden">
                    <Fingerprint className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Create fingerprint
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    We generate a unique cryptographic fingerprint — a short
                    string of characters that uniquely represents your content.
                    Think of it like a digital wax seal.
                  </p>
                  <ul className="space-y-3 text-slate-500 text-sm">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      <span>SHA-256 industry standard</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      <span>One-way function (irreversible)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      <span>Content never revealed</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-white/5 rounded-2xl blur-xl"></div>
                  <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 font-mono">
                    <p className="text-[10px] text-slate-500 font-medium mb-3 uppercase tracking-wider">
                      Fingerprint
                    </p>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-sm text-slate-300 break-all">
                        a1b2c3d4e5f67890...
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-4">
                      Generated locally in your browser
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative md:pl-24">
              <div className="absolute left-0 md:left-6 top-0 w-12 h-12 rounded-full bg-white text-black font-bold text-lg flex items-center justify-center border-4 border-[#050505] z-10 hidden md:flex">
                3
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center md:hidden">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Lock in time
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    The fingerprint is permanently timestamped and recorded. The
                    proof exists independently — beyond any single server,
                    company, or authority.
                  </p>
                  <ul className="space-y-3 text-slate-500 text-sm">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      <span>Permanent timestamp record</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      <span>Verifiable by anyone</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      <span>Cannot be edited or deleted</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-white/5 rounded-2xl blur-xl"></div>
                  <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <ShieldCheck className="text-black w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Proof Created
                        </p>
                        <p className="text-xs text-slate-500">
                          Permanent timestamp
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">
                          Fingerprint
                        </p>
                        <p className="text-xs font-mono text-slate-300">
                          a1b2c3d4e5f67890...9z8y7x6
                        </p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">
                          Timestamp
                        </p>
                        <p className="text-xs font-mono text-slate-300">
                          January 17, 2026 at 3:42 PM UTC
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY FEATURES */}
      <section className="px-6 py-32 border-y border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Security you can understand
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              No black boxes. No mystery technology. Here's exactly how it
              works.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-white/10 bg-white/2 hover:bg-white/4 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS PROOF */}
      <section className="px-6 py-32 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            What exactly is a proof?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/2">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              A seal, not a lock
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              A proof doesn't hide your work — it proves it existed. Like a
              notarial seal on a document.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-white/2">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              A timestamp, not a claim
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              It proves something existed at a moment — not who created it or
              when it was originally written.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-white/2">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              A record, not ownership
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Creating a proof doesn't transfer rights. It simply establishes
              evidence of existence.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-32 border-t border-white/5 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-white/10 rounded-2xl overflow-hidden bg-white/2"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/2 transition-colors"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-white/5 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Ready to prove your work?
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
              className="text-sm text-white hover:text-slate-300 transition-colors"
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
