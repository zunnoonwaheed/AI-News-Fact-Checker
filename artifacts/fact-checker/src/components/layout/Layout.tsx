import { Link, useLocation } from "wouter";
import { ShieldCheck, History, BarChart3, Search, Globe, ChevronRight } from "lucide-react";

function LiveDate() {
  const now = new Date();
  return (
    <span className="text-xs text-blue-200 font-mono tracking-wide">
      {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
    </span>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Fact Checker", icon: Search },
    { href: "/history", label: "Archive", icon: History },
    { href: "/stats", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-background">

      {/* Top announcement strip */}
      <div className="ticker-bg px-4 py-1.5 flex items-center gap-3">
        <span className="text-white text-[11px] font-bold uppercase tracking-widest shrink-0">Live</span>
        <div className="w-px h-3 bg-blue-300/50" />
        <span className="text-blue-100 text-[11px] truncate">
          AI-Powered News Verification — Cross-referencing multiple credible sources in real time
        </span>
        <span className="ml-auto shrink-0"><LiveDate /></span>
      </div>

      {/* Main header — deep navy */}
      <header className="bg-sidebar border-b border-sidebar-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Brand row */}
          <div className="flex items-center justify-between py-4 border-b border-sidebar-border/60">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="bg-primary text-primary-foreground p-2.5 rounded-md shadow-md group-hover:shadow-lg transition-shadow">
                  <ShieldCheck size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-sidebar-foreground font-serif text-2xl font-bold tracking-tight leading-none">
                    FactCheck <span className="text-sidebar-primary font-black">AI</span>
                  </h1>
                  <p className="text-blue-300/70 text-[10px] uppercase tracking-[0.2em] font-medium mt-0.5">
                    Independent News Verification
                  </p>
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-[11px] font-semibold uppercase tracking-wider">System Online</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-200/60 text-xs">
                <Globe size={13} />
                <span>Powered by Claude AI + NewsAPI</span>
              </div>
            </div>
          </div>

          {/* Navigation row */}
          <nav className="flex items-center gap-0.5 py-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <span className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium cursor-pointer transition-all relative
                    ${active
                      ? "text-white after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-primary after:rounded-t-full"
                      : "text-blue-200/70 hover:text-blue-100 hover:bg-white/5"
                    }
                  `}>
                    <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-sidebar border-t border-sidebar-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-blue-200/60 text-xs">
            <ShieldCheck size={14} />
            <span>FactCheck AI — Independent News Verification Platform</span>
          </div>
          <p className="text-blue-300/40 text-xs">
            Analysis is AI-assisted and should be independently verified for critical decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
