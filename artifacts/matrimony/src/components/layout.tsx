import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Heart, Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth";
import { AuthModal } from "@/pages/login";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [showUserMenu, setShowUserMenu] = useState(false);
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
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-b border-primary/15 shadow-sm">
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
                className={`text-sm font-bold tracking-wide transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/15 transition-colors border border-primary/20"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-bold text-foreground">{user?.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-border overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Signed in as</p>
                        <p className="font-bold text-sm text-foreground truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/my-profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <button
                        onClick={() => { setShowUserMenu(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/5 transition-colors border-t border-border"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={openRegister}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary shadow-md transition-all hover:scale-105 bg-muted"
                  title="Create Account"
                >
                  <img src="/default-profile.png" alt="Profile" className="w-full h-full object-cover" />
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
              className="md:hidden overflow-hidden bg-white border-t border-primary/10"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`py-3 px-4 rounded-xl font-bold text-base transition-colors ${location === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/my-profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-foreground hover:bg-muted"
                      >
                        <User className="w-4 h-4 text-primary" /> My Profile
                      </Link>
                      <button onClick={() => { setMenuOpen(false); logout(); }} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={openLogin} className="py-3 px-4 rounded-xl font-bold text-base text-center border border-primary text-primary">
                        Sign In
                      </button>
                      <button onClick={openRegister} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-base text-foreground hover:bg-muted">
                        <img src="/default-profile.png" alt="Profile" className="w-8 h-8 rounded-full object-cover border border-primary/30" />
                        Create Account
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

      {/* Close user menu on outside click */}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </div>
  );
}
