import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useHealthCheck } from "@workspace/api-client-react";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: health } = useHealthCheck();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/browse", label: "Profiles Dekhein" },
    { href: "/stories", label: "Safal Jodiyaan" },
    { href: "/interests", label: "Meri Pasand" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="fixed top-0 inset-x-0 z-50 glass-panel border-b border-primary/10 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-primary">Anurup Sathi</span>
          </Link>

          {/* Desktop Nav */}
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

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="hidden sm:block bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              Profile Banayein
            </Link>
            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-primary/10"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`py-3 px-4 rounded-xl font-medium text-base transition-colors ${location === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 bg-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-medium text-center shadow-md"
                >
                  Profile Banayein
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 w-full relative">
        {children}
      </main>

      <footer className="bg-foreground text-background py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Heart className="w-4 h-4 text-secondary-foreground fill-current" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-secondary">Anurup Sathi</h2>
              </div>
              <p className="text-muted/60 font-light leading-relaxed text-sm">
                Bharat ke shreshthatam parivaaron ke liye vishesh rishte-naate ka manch. Jahaan pyaar aur parampara milte hain.
              </p>
            </div>
            <div>
              <h3 className="text-secondary font-serif text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted/60">
                <li><Link href="/browse" className="hover:text-secondary transition-colors">Profiles Dekhein</Link></li>
                <li><Link href="/stories" className="hover:text-secondary transition-colors">Safal Jodiyaan</Link></li>
                <li><Link href="/register" className="hover:text-secondary transition-colors">Profile Banayein</Link></li>
                <li><Link href="/interests" className="hover:text-secondary transition-colors">Meri Pasand</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-secondary font-serif text-lg mb-4">Hamse Sampark</h3>
              <ul className="space-y-2 text-sm text-muted/60">
                <li>support@anurupsathi.com</li>
                <li>+91 98765 43210</li>
                <li>Mon–Sat, 9am–7pm IST</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 text-xs text-muted/40 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p>&copy; {new Date().getFullYear()} Anurup Sathi Matrimony. All rights reserved.</p>
            <p className="flex items-center gap-2">
              System:&nbsp;
              {health
                ? <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                : <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>}
              &nbsp;{health?.status || "Checking..."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
