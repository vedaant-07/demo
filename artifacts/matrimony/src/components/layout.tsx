import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Heart, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth";
import { AuthModal } from "@/pages/login";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const { user, isAuthenticated, logout } = useAuth();

  const openLogin = () => { setAuthTab("login"); setShowAuth(true); setMenuOpen(false); };
  const openRegister = () => { setAuthTab("register"); setShowAuth(true); setMenuOpen(false); };

  const navLinks = [
    { href: "/browse", label: "Browse Profiles" },
    { href: "/stories", label: "Success Stories" },
    { href: "/interests", label: "My Interests" },
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
                className={`text-sm font-semibold tracking-wide transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <User className="w-4 h-4 text-primary" /> {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
                <button
                  onClick={openRegister}
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                >
                  Register Free
                </button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-background/97 backdrop-blur-xl border-t border-primary/10"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`py-3 px-4 rounded-xl font-semibold text-base transition-colors ${location === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4 text-primary" /> Signed in as <strong>{user?.name}</strong>
                      </div>
                      <button onClick={logout} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={openLogin} className="py-3 px-4 rounded-xl font-semibold text-base text-center border border-primary text-primary">
                        Sign In
                      </button>
                      <button onClick={openRegister} className="bg-primary text-primary-foreground py-3 px-4 rounded-full text-sm font-bold text-center shadow-md">
                        Register Free
                      </button>
                    </>
                  )}
                </div>
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
                India's premium matrimonial platform where tradition meets modernity. Trusted by thousands of families.
              </p>
            </div>
            <div>
              <h3 className="text-secondary font-serif text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted/60">
                <li><Link href="/browse" className="hover:text-secondary transition-colors">Browse Profiles</Link></li>
                <li><Link href="/stories" className="hover:text-secondary transition-colors">Success Stories</Link></li>
                <li><Link href="/register" className="hover:text-secondary transition-colors">Create Profile</Link></li>
                <li><Link href="/interests" className="hover:text-secondary transition-colors">My Interests</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-secondary font-serif text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-muted/60">
                <li>support@anurupsathi.com</li>
                <li>+91 98765 43210</li>
                <li>Mon–Sat, 9am–7pm IST</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 text-xs text-muted/40 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p>&copy; {new Date().getFullYear()} Anurup Sathi Matrimony. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultTab={authTab} />}
      </AnimatePresence>
    </div>
  );
}
