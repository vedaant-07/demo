import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useGetStats, useListFeaturedProfiles, useListStories } from "@workspace/api-client-react";
import heroImg from "@/assets/hero.jpg";
import heroCouple1 from "@/assets/couple_1.jpg";
import { ProfileCard } from "@/components/profile-card";
import { useRef } from "react";
import { ArrowRight, Heart, Sparkles, Star, Users, CheckCircle } from "lucide-react";

function StatCard({ value, label, delay }: { value: number; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay }}
      className="text-center group py-4"
    >
      <h3 className="text-5xl sm:text-6xl md:text-7xl font-serif text-primary mb-2 group-hover:scale-110 transition-transform duration-500 tabular-nums">
        {value.toLocaleString("en-IN")}+
      </h3>
      <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs sm:text-sm">{label}</p>
    </motion.div>
  );
}

const HOW_STEPS = [
  { icon: Users, title: "Profile Banayein", desc: "Apni jankari aur pasand share karein. Hamari team aapka profile verify karti hai." },
  { icon: Star, title: "Match Dhundhein", desc: "Hamare advanced filters se apni pasand ka partner dhundein — dharm, shahar, umar ke hisaab se." },
  { icon: Heart, title: "Rishta Pakka Karein", desc: "Seedha connect karein, milein, aur apni zindagi ka sabse khoobsurat safar shuru karein." },
];

export function Home() {
  const { data: stats } = useGetStats();
  const { data: featuredProfiles } = useListFeaturedProfiles();
  const { data: stories } = useListStories();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <div className="w-full">
      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-black">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <img src={heroImg} alt="Indian Wedding" className="w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />
        </motion.div>

        {/* Floating petals */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full blur-sm ${i % 3 === 0 ? "bg-secondary/40 w-4 h-4" : i % 3 === 1 ? "bg-primary/20 w-2 h-2" : "bg-white/20 w-3 h-3"} animate-float${i % 2 === 0 ? "" : "-delayed"}`}
              style={{
                left: `${5 + (i * 5.5) % 90}%`,
                top: `${10 + (i * 7.3) % 80}%`,
                animationDuration: `${6 + (i % 5)}s`,
                animationDelay: `${(i % 4) * 0.7}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative z-20 mx-auto px-4 md:px-8 text-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-block mb-6 px-5 py-2 rounded-full border border-secondary/40 bg-background/10 backdrop-blur-md text-secondary text-xs sm:text-sm font-medium tracking-widest uppercase"
          >
            Vishwas ka Naata — Jeewan ka Saathi
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-white leading-[1.05] tracking-tight"
          >
            Anurup
            <br />
            <span className="text-secondary italic">Sathi</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Bharat ke shreshtha parivaaron ke liye ek vishesh rishtenaate ka manch — jahaan parampara aur aadhunikta milte hain, aur sachcha pyaar apna rasta dhundh leta hai.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link href="/register" className="group relative w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:scale-105 shadow-2xl shadow-primary/40 text-base">
              <span className="flex items-center justify-center gap-2">
                Apna Safar Shuru Karein <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/browse" className="group w-full sm:w-auto px-8 py-4 text-white border border-white/30 hover:border-secondary hover:text-secondary transition-colors rounded-full font-medium text-base text-center backdrop-blur-sm">
              Profiles Dekhein
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs tracking-widest uppercase"
        >
          <span>Neeche Dekhein</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-px h-8 bg-white/30" />
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 md:py-24 bg-background relative z-20 -mt-8 rounded-t-[32px] md:rounded-t-[48px] border-t border-border shadow-2xl">
        <div className="container mx-auto px-4 md:px-8">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-10">
            Hamari Uplabdhiyan
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 divide-x-0 md:divide-x divide-border">
            <StatCard value={stats?.totalMembers || 0} label="Sadsya" delay={0} />
            <StatCard value={stats?.totalMatches || 0} label="Rishte Hue" delay={0.1} />
            <StatCard value={stats?.successStories || 0} label="Safal Jodiyaan" delay={0.2} />
            <StatCard value={stats?.citiesCovered || 0} label="Shahar" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-5xl md:text-6xl font-serif text-foreground mb-4">
              Kaise Kaam Karta Hai?
            </motion.h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">Teen aasaan kadam mein shuru karein apna khubsurat safar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {HOW_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="relative p-6 md:p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <step.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="absolute top-6 right-6 text-5xl font-serif text-border font-bold">0{i + 1}</div>
                <h3 className="text-xl md:text-2xl font-serif text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROFILES ─── */}
      <section className="py-16 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 md:mb-16">
            <div className="max-w-xl">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-5xl md:text-6xl font-serif text-foreground mb-3">
                Vishesh Profiles
              </motion.h2>
              <p className="text-muted-foreground text-sm sm:text-base">Hamare chuninde aur premium sadsyon se miliye, jo sachche rishte ki talash mein hain.</p>
            </div>
            <Link href="/browse" className="shrink-0 flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors text-sm">
              Sab Dekhein <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {featuredProfiles?.slice(0, 6).map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <ProfileCard profile={profile} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/browse" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Aur Profiles Dekhein <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SUCCESS STORIES ─── */}
      <section className="py-16 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-5xl md:text-6xl font-serif text-secondary mb-4">
              Pyaar ki Kahaniyaan
            </motion.h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-sm sm:text-base">Unki kahaniyan jo Anurup Sathi se apna jeewan saathi paaya</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
            >
              <img src={heroCouple1} alt="Khush Jodi" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-secondary fill-secondary" />)}
                </div>
                <p className="text-white font-serif text-lg mt-2">Sach mein sapno ka rishta</p>
              </div>
            </motion.div>

            <div className="space-y-6 md:space-y-8">
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
                      <h3 className="text-lg md:text-2xl font-serif text-secondary">{story.coupleName}</h3>
                      <p className="text-xs text-primary-foreground/60 uppercase tracking-wider mt-0.5">
                        {story.city} &bull; {story.marriageYear} mein shaadi
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-secondary/70 shrink-0 mt-1" />
                  </div>
                  <p className="text-primary-foreground/85 font-light leading-relaxed text-sm md:text-base italic line-clamp-3">
                    "{story.story}"
                  </p>
                </motion.div>
              ))}
              <Link href="/stories" className="inline-flex items-center gap-2 text-secondary font-medium hover:opacity-80 transition-opacity">
                Aur Kahaniyaan Padhein <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-foreground mb-6">
              Aapka Anurup Sathi<br /><span className="text-primary italic">aapki Raah Dekh Raha Hai</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Aaj hi apna profile banayein aur Bharat ke lakhs parivaaron ke saath judein jo apne jeewan saathi ki talash kar rahe hain.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-full font-medium text-base hover:bg-primary/90 hover:-translate-y-1 transition-all shadow-xl shadow-primary/30">
              Abhi Shuru Karein <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
