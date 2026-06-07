import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useListFeaturedProfiles, useListStories } from "@workspace/api-client-react";
import weddingImg from "@/assets/wedding_main.png";
import { ProfileCard } from "@/components/profile-card";
import { useRef } from "react";
import { ArrowRight, Heart, Users, CheckCircle, Star } from "lucide-react";

const HOW_STEPS = [
  { icon: Users, title: "Create Your Profile", desc: "Share your details, preferences, and family background. Our team verifies every profile for authenticity." },
  { icon: Star, title: "Discover Matches", desc: "Browse thousands of verified profiles. Filter by religion, city, age, profession, and more." },
  { icon: Heart, title: "Connect & Celebrate", desc: "Send interest, connect directly, and begin the most beautiful journey of your life together." },
];

export function Home() {
  const { data: featuredProfiles } = useListFeaturedProfiles();
  const { data: stories } = useListStories();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="w-full">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <img src={weddingImg} alt="Indian Wedding Celebration" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </motion.div>

        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full blur-sm ${i % 2 === 0 ? "bg-secondary/50 w-3 h-3" : "bg-white/20 w-2 h-2"} animate-float${i % 2 === 0 ? "" : "-delayed"}`}
              style={{
                left: `${5 + (i * 6.5) % 90}%`,
                top: `${10 + (i * 6) % 80}%`,
                animationDuration: `${6 + (i % 5)}s`,
                animationDelay: `${(i % 4) * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative z-20 mx-auto px-4 md:px-8 text-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-6 px-5 py-2 rounded-full border border-secondary/60 bg-black/30 backdrop-blur-md text-secondary text-xs sm:text-sm font-bold tracking-widest uppercase"
          >
            India's Premium Matrimony Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold text-white leading-[1.05] tracking-tight drop-shadow-2xl"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.9)" }}
          >
            Anurup Sathi
            <br />
            <span className="text-secondary italic text-3xl sm:text-4xl md:text-5xl font-medium" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}>
              आपका जीवन साथी
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="mt-6 text-base sm:text-xl md:text-2xl text-white font-semibold max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
          >
            Where love meets legacy. India's most trusted platform for finding your life partner.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="group w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-base transition-all hover:scale-105 shadow-2xl shadow-primary/50 text-center">
              <span className="flex items-center justify-center gap-2">
                Begin Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/browse" className="group w-full sm:w-auto px-8 py-4 text-white border-2 border-white/60 hover:border-secondary hover:text-secondary transition-all rounded-full font-bold text-base text-center backdrop-blur-sm">
              Browse Profiles
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs tracking-widest uppercase"
        >
          <span>Scroll Down</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-px h-8 bg-white/30" />
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 md:py-28 bg-muted/30 rounded-[2rem] md:rounded-[3rem] mx-2 md:mx-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">
              How It Works
            </motion.h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-semibold">Three simple steps to find your perfect life partner</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {HOW_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="relative p-6 md:p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-all duration-300 group-hover:scale-110">
                  <step.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="absolute top-6 right-6 text-6xl font-serif text-border font-bold leading-none">0{i + 1}</div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROFILES ── */}
      <section className="py-16 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 md:mb-14">
            <div className="max-w-xl">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground mb-3">
                Featured Profiles
              </motion.h2>
              <p className="text-muted-foreground font-semibold">Our most distinguished members seeking meaningful connections</p>
            </div>
            <Link href="/browse" className="shrink-0 flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {featuredProfiles?.slice(0, 6).map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
              >
                <ProfileCard profile={profile} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/browse" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              View All Profiles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section className="py-16 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-secondary mb-4">
              Love Stories
            </motion.h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto font-semibold">Real couples who found their perfect match on Anurup Sathi</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
            >
              <img src={weddingImg} alt="Indian Wedding Celebration" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-secondary fill-secondary" />)}
                </div>
                <p className="text-white font-serif font-bold text-lg">A dream come true</p>
              </div>
            </motion.div>
            <div className="space-y-6">
              {stories?.slice(0, 3).map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  className="glass-panel p-5 md:p-7 rounded-2xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg md:text-xl font-serif font-bold text-secondary">{story.coupleName}</h3>
                      <p className="text-xs text-primary-foreground/60 uppercase tracking-wider font-bold mt-0.5">
                        {story.city} &bull; Married {story.marriageYear}
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-secondary/70 shrink-0 mt-1" />
                  </div>
                  <p className="text-primary-foreground/85 font-light leading-relaxed text-sm italic line-clamp-3">"{story.story}"</p>
                </motion.div>
              ))}
              <Link href="/stories" className="inline-flex items-center gap-2 text-secondary font-bold hover:opacity-80 transition-opacity">
                Read All Stories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Your Perfect Match<br /><span className="text-primary italic">Is Waiting For You</span>
            </h2>
            <p className="text-muted-foreground font-semibold mb-8 max-w-xl mx-auto">
              Join lakhs of families who trust Anurup Sathi to find their life partner. Register free today.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold text-base hover:bg-primary/90 hover:-translate-y-1 transition-all shadow-xl shadow-primary/30">
              Register Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
