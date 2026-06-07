import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useHealthCheck } from "@workspace/api-client-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: health } = useHealthCheck();

  const navLinks = [
    { href: "/browse", label: "Browse Profiles" },
    { href: "/stories", label: "Success Stories" },
    { href: "/interests", label: "My Interests" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="fixed top-0 inset-x-0 z-50 glass-panel border-b-0 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-primary">
            SoulMate
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/register" 
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 md:px-8 text-center space-y-6">
          <h2 className="text-3xl font-serif font-bold text-secondary">SoulMate</h2>
          <p className="text-muted/60 max-w-md mx-auto font-light leading-relaxed">
            Where love meets legacy. Creating eternal bonds for India's most discerning families.
          </p>
          <div className="pt-8 border-t border-white/10 text-xs text-muted/40 flex justify-between items-center">
            <p>&copy; {new Date().getFullYear()} SoulMate Matrimony. All rights reserved.</p>
            <p className="flex items-center gap-2">
              System: {health ? <span className="w-2 h-2 rounded-full bg-green-500"></span> : <span className="w-2 h-2 rounded-full bg-red-500"></span>}
              {health?.status || "Checking..."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
