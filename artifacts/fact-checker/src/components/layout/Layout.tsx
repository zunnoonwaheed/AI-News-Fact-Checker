import { Link, useLocation } from "wouter";
import { ShieldCheck, History, BarChart3, Search, Newspaper, TrendingUp, Clock } from "lucide-react";

function LiveDateTime() {
  const now = new Date();
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-sidebar-foreground/80 font-medium">
        {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </span>
      <span className="text-sidebar-foreground/60">|</span>
      <span className="text-sidebar-foreground/70 font-mono">
        {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Newspaper },
    { href: "/history", label: "Archive", icon: History },
    { href: "/stats", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-background">

      {/* Top bar with date and breaking news */}
      <div className="network-bg border-b border-violet-500/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between relative z-10">
          <LiveDateTime />
          <div className="hidden md:flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-md animate-pulse">Live</span>
            <span className="text-sidebar-foreground/90 text-xs font-medium">Multi-source news verification</span>
          </div>
        </div>
      </div>

      {/* Main header - professional violet gradient */}
      <header className="network-bg border-b-4 border-violet-500/40 shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Masthead */}
          <div className="flex items-center justify-between py-6 border-b border-violet-500/20">
            <Link href="/">
              <div className="cursor-pointer group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white p-2.5 rounded-xl shadow-lg group-hover:shadow-2xl transition-all group-hover:scale-105">
                    <ShieldCheck size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-white font-serif text-4xl font-black tracking-tight leading-none drop-shadow-lg">
                      FactCheck.ai
                    </h1>
                    <p className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent text-xs font-bold uppercase tracking-[0.25em] mt-1">
                      AI-Powered Verification
                    </p>
                  </div>
                </div>
                <div className="border-t border-violet-400/30 pt-1.5 ml-14">
                  <p className="text-violet-200/80 text-[11px] italic">
                    "Fighting fake news with trusted sources" — Verify. Trust. Share.
                  </p>
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 bg-violet-500/20 backdrop-blur-sm border border-violet-400/40 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-lg shadow-violet-400/50" />
                <span className="text-violet-200 text-xs font-semibold uppercase tracking-wide">System Active</span>
              </div>
              <span className="text-violet-200/70 text-[10px]">Powered by Claude AI & NewsAPI</span>
            </div>
          </div>

          {/* Navigation - modern style */}
          <nav className="flex items-center gap-0 border-b border-violet-500/20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <span className={`
                    flex items-center gap-2 px-5 py-3 text-sm font-semibold cursor-pointer transition-all relative uppercase tracking-wide
                    ${active
                      ? "text-violet-300 bg-violet-500/20 after:absolute after:bottom-0 after:inset-x-0 after:h-1 after:bg-gradient-to-r after:from-violet-500 after:to-purple-500"
                      : "text-violet-200/80 hover:text-violet-300 hover:bg-white/5"
                    }
                  `}>
                    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
            <div className="ml-auto flex items-center gap-2 px-5 py-3">
              <Search size={16} className="text-violet-200/60" />
              <span className="text-violet-200/50 text-xs">Search verified news</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 w-full bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer - modern violet gradient */}
      <footer className="network-bg border-t-2 border-violet-500/30 mt-auto relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 pb-6 border-b border-violet-500/20">
            <div>
              <h3 className="text-white font-serif font-bold text-lg mb-3">About</h3>
              <p className="text-violet-200/80 text-sm leading-relaxed">
                FactCheck.ai provides independent, AI-powered fact-checking of news claims and articles using advanced language models and verified news sources from trusted channels.
              </p>
            </div>
            <div>
              <h3 className="text-white font-serif font-bold text-lg mb-3">Sections</h3>
              <ul className="space-y-2 text-violet-200/80 text-sm">
                <li><Link href="/"><span className="hover:text-violet-300 cursor-pointer transition-colors">Home</span></Link></li>
                <li><Link href="/history"><span className="hover:text-violet-300 cursor-pointer transition-colors">Archive</span></Link></li>
                <li><Link href="/stats"><span className="hover:text-violet-300 cursor-pointer transition-colors">Analytics</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-serif font-bold text-lg mb-3">Disclaimer</h3>
              <p className="text-violet-200/80 text-sm leading-relaxed">
                All analysis is AI-assisted and cross-referenced with multiple news sources. Results should be independently verified for critical decisions. This is an educational tool, not professional news verification.
              </p>
            </div>
          </div>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-violet-200/70 text-xs">
              <ShieldCheck size={16} />
              <span>© 2026 FactCheck.ai. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1.5 text-violet-200/60 text-xs">
              <Clock size={12} />
              <span>Updated continuously</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
