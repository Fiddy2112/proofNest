import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CTA() {
    const { domRef, isVisible } = useScrollReveal({
  delay: 100,
});
  return (
    <section 
      ref={domRef}
      className={`px-6 py-40 relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none">Your work is valuable. <br />Prove it.</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className={`${isVisible ? 'animate-in zoom-in-95 duration-500' : ''} w-full sm:w-auto px-12 py-5 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform`}>
            Get Started Free
          </button>
          <div className="text-slate-500 font-mono text-sm tracking-widest">3 FREE PROOFS / MONTH</div>
        </div>
      </div>
    </section>
  );
}
