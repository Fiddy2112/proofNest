"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const cases = [
    {
        id:1,
        title: "Solo Developers protecting proprietary logic",
        desc: ""
    },
    {
        id:2,
        title: "Freelancers proving delivery and scope",
        desc: ""
    },
    {
        id:3,
        title: "Creators securing scripts before pitching",
        desc: ""
    },
    {
        id:4,
        title: "Founders documenting core IP roadmaps",
        desc: ""
    }
]

export default function UseCases() {
    const { domRef, isVisible } = useScrollReveal({
  delay: 100,
});
  return (
    <section ref={domRef} className="px-6 py-32 max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">Securing every stage of creation.</h2>

                <ul className="space-y-6">
                    {cases.map((caseItem) => (
                    <li key={caseItem.id} className={`${isVisible ? 'animate-in zoom-in-95 duration-500' : ''} flex items-center gap-4 text-slate-300`}>
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div></div>
                        {caseItem.title}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div className={`${isVisible ? 'animate-in zoom-in-95 duration-500' : ''} h-48 rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col justify-end hover:bg-white/10 transition-colors`}><div className="text-white font-bold text-sm">Designers</div></div>
                    <div className={`${isVisible ? 'animate-in zoom-in-95 duration-500' : ''} h-64 rounded-3xl bg-white/10 border border-white/10 p-6 flex flex-col justify-end hover:bg-white/20 transition-colors`}><div className="text-white font-bold text-sm">Engineers</div></div>
                </div>
                <div className="space-y-4 pt-8">
                    <div className={`${isVisible ? 'animate-in zoom-in-95 duration-500' : ''} h-64 rounded-3xl bg-blue-600/20 border border-blue-500/20 p-6 flex flex-col justify-end relative overflow-hidden`}><div className="text-white font-bold text-sm">Writers</div></div>
                    <div className={`${isVisible ? 'animate-in zoom-in-95 duration-500' : ''} h-48 rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col justify-end hover:bg-white/10 transition-colors`}><div className="text-white font-bold text-sm">Founders</div></div>
                </div>
            </div>
        </div>
    </section>
  );
}
