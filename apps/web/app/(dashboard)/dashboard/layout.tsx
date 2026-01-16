import { ShieldCheck, LayoutDashboard, FileUp, History, Settings, LogOut } from "lucide-react";

const dashboardMenu = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: FileUp, label: "Protect Idea", active: false },
  { icon: History, label: "History", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#050505] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar thông minh: Hover để mở rộng */}
      <aside className="group fixed inset-y-0 left-0 z-50 flex w-20 flex-col border-r border-white/5 bg-[#050505] transition-all duration-300 ease-in-out hover:w-64 lg:static lg:flex">
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
            <ShieldCheck className="h-5 w-5 text-black" />
          </div>
          <span className="whitespace-nowrap font-bold tracking-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            ProofNest
          </span>
        </div>

        <nav className="flex-1 space-y-2 px-3">
          {dashboardMenu.map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 transition-all ${
                item.active ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-3">
          <button className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-red-400 transition-all hover:bg-red-400/10">
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-white/5 px-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">/ Workspace / Overview</h2>
          <div className="h-8 w-8 rounded-full border border-white/20 bg-linear-to-tr from-blue-500 to-purple-500" />
        </header>
        
        <main className="flex-1 overflow-y-auto bg-[#050505]">
          {children}
        </main>
      </div>
    </div>
  );
}