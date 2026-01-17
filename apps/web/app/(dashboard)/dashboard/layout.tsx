"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, LayoutDashboard, FileUp, History, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/lib/supabase/auth-service";

const dashboardMenu = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: FileUp, label: "Protect Idea", active: false },
  { icon: History, label: "History", active: false },
  { icon: Settings, label: "Settings", active: false },
];

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
  };
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-slate-200 overflow-hidden font-sans">
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
                item.active
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
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
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-slate-500 transition-all hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Logout
            </span>
          </button>
        </div>
      </aside>

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-white/5 px-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            / Workspace / Overview
          </h2>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-500">
              {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User"}
            </span>
            <div className="h-8 w-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{getUserInitials()}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#050505]">{children}</main>
      </div>
    </div>
  );
}
