"use client";

import { useState, useEffect } from "react";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import {
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  Clock,
  Lock,
  Globe,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "For casual use and trying things out",
    price: "$0",
    period: "forever",
    cta: "Get Started",
    ctaLink: "/dashboard",
    popular: false,
    features: [
      { name: "3 permanent proofs per month", included: true },
      { name: "Proof verification", included: true },
      { name: "Shareable proof links", included: true },
      { name: "Basic support", included: true },
      { name: "No account required", included: true },
      { name: "Advanced analytics", included: false },
      { name: "Priority support", included: false },
      { name: "API access", included: false },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    name: "Pro",
    description: "For professionals who create regularly",
    price: "$19",
    period: "per month",
    cta: "Start Pro Trial",
    ctaLink: "/dashboard",
    popular: true,
    features: [
      { name: "100 permanent proofs per month", included: true },
      { name: "Proof verification", included: true },
      { name: "Shareable proof links", included: true },
      { name: "Priority support", included: true },
      { name: "Account required", included: true },
      { name: "Advanced analytics", included: true },
      { name: "API access", included: true },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    name: "Team",
    description: "For teams collaborating on intellectual property",
    price: "$49",
    period: "per month",
    cta: "Contact Sales",
    ctaLink: "/dashboard",
    popular: false,
    features: [
      { name: "Unlimited proofs", included: true },
      { name: "Proof verification", included: true },
      { name: "Shareable proof links", included: true },
      { name: "Dedicated support", included: true },
      { name: "Team management", included: true },
      { name: "Advanced analytics", included: true },
      { name: "API access", included: true },
      { name: "Priority support", included: true },
      { name: "Custom integrations", included: true },
    ],
  },
];

const faqs = [
  {
    question: "What counts as a 'proof'?",
    answer:
      "A proof is a single timestamped record of content. Each piece of content you timestamp counts as one proof. Whether it's a text document, a code file, or a creative work — one content item equals one proof.",
  },
  {
    question: "Do proofs expire?",
    answer:
      "No. Once a proof is created, it exists forever. The timestamp is permanent and immutable. Even if you cancel your subscription, all your existing proofs remain valid and verifiable.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes. You can change your plan at any time. Upgrades take effect immediately, while downgrades apply at the start of your next billing cycle. Your existing proofs are never affected.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Yes, Pro includes a 14-day free trial. No credit card required to start. You can explore all Pro features during the trial period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. For Team plans, we also support invoice-based payments for annual commitments.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact support for a full refund — no questions asked.",
  },
];

const features = [
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Permanent timestamps",
    description:
      "Once proven, it exists forever. No subscription required to maintain access.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Client-side hashing",
    description:
      "Your content never leaves your browser. Only fingerprints are timestamped.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Universal verification",
    description:
      "Anyone can verify a proof without an account or special software.",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "No lock-in",
    description: "Export all your proofs. You're never dependent on ProofNest.",
  },
];

export default function PricingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

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
            <Link
              href="/use-cases"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Use Cases
            </Link>
            <span className="text-sm font-medium text-white">Pricing</span>
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
          Pricing
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Pay for what you need. All plans include permanent proofs that never
          expire.
        </p>
      </section>

      {/* BILLING TOGGLE */}
      <section className="px-6 pb-16 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-center gap-4">
          <span
            className={`text-sm font-medium transition-colors ${
              billingPeriod === "monthly" ? "text-white" : "text-slate-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingPeriod(
                billingPeriod === "monthly" ? "annual" : "monthly"
              )
            }
            className="relative w-14 h-7 bg-white/10 rounded-full border border-white/10 cursor-pointer transition-colors hover:bg-white/20"
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                billingPeriod === "annual" ? "left-8" : "left-1"
              }`}
            ></div>
          </button>
          <span
            className={`text-sm font-medium transition-colors ${
              billingPeriod === "annual" ? "text-white" : "text-slate-500"
            }`}
          >
            Annual{" "}
            <span className="text-emerald-400 text-xs ml-1">Save 20%</span>
          </span>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="px-6 pb-32 max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-white/5 border-white/20 ring-1 ring-white/10"
                  : "bg-white/2 border-white/10 hover:bg-white/4"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-500 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">
                    {billingPeriod === "annual" && plan.price !== "$0"
                      ? "$" +
                        (parseInt(plan.price.replace("$", "")) * 0.8).toFixed(0)
                      : plan.price.replace("$", "")}
                  </span>
                  <span className="text-slate-500 text-sm">/month</span>
                </div>
                {billingPeriod === "annual" && plan.price !== "$0" && (
                  <p className="text-slate-600 text-xs mt-2">
                    Billed{" "}
                    {billingPeriod === "annual"
                      ? "$" +
                        parseInt(plan.price.replace("$", "")) * 0.8 * 12 +
                        "/year"
                      : ""}
                  </p>
                )}
              </div>

              <Link href={plan.ctaLink}>
                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer mb-8 ${
                    plan.popular
                      ? "bg-white text-black hover:bg-slate-200"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>

              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-slate-700 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-32 border-y border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              All plans include
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every proof gets the same high-quality treatment, regardless of
              plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-white/10 bg-white/2 hover:bg-white/4 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mb-4">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENTERPRISE CTA */}
      <section className="px-6 py-24 max-w-4xl mx-auto relative z-10">
        <div className="relative overflow-hidden rounded-3xl bg-white/2 border border-white/10 p-12 text-center">
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="text-black w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              Need a custom solution?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              For large organizations with specific requirements, we offer
              custom Enterprise plans with dedicated support, custom
              integrations, and flexible billing.
            </p>
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-slate-200 transition-all cursor-pointer">
                Contact Sales
              </button>
            </Link>
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
                <details className="group">
                  <summary className="px-6 py-5 flex items-center justify-between cursor-pointer list-none hover:bg-white/2 transition-colors">
                    <span className="text-white font-medium">
                      {faq.question}
                    </span>
                    <ArrowRight className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-white/5 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Ready to start proving?
          </h2>
          <p className="text-slate-400 text-lg">
            Create your first proof in less than a minute. No credit card
            required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all cursor-pointer">
                Start Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            3 permanent proofs per month free. Forever.
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
            <Link
              href="/use-cases"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Use Cases
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
