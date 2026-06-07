import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useGetStats, useListFeaturedProfiles, useListStories } from "@workspace/api-client-react";
import heroImg from "@/assets/hero.jpg";
import heroCouple1 from "@/assets/couple_1.jpg";
import { ProfileCard } from "@/components/profile-card";
import { useRef } from "react";
import { ArrowRight, Heart, Sparkles, Star } from "lucide-react";

export function Home() {
  const { data: stats } = useGetStats();
  const { data: featuredProfiles } = useListFeaturedProfiles();
  const { data: stories } = useListStories();
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-black">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Opulent Indian Wedding" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </motion.div>
        
        {/* Floating Petals/Particles Effect */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i}
              className={`absolute w-3 h-3 rounded-full bg-secondary/30 blur-[1px] animate-float${i % 2 === 0 ? '-delayed' : ''}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 5}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container relative z-20 mx-auto px-4 md:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-secondary/30 bg-background/10 backdrop-blur-md text-secondary text-sm font-medium tracking-widest uppercase"
          >
            A Matchmaking Masterpiece
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white max-w-4xl mx-auto leading-[1.1] tracking-tight text-shadow-xl"
          >
            Where Love Meets <span className="text-secondary italic">Legacy.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-8 text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light"
          >
            An exclusive enclave for India's most discerning families to discover life partners of equal stature, shared values, and profound connection.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/register" className="group relative px-8 py-4 bg-primary text-primary-foreground overflow-hidden rounded-full font-medium transition-all hover:scale-105 shadow-2xl shadow-primary/40">
              <span className="relative z-10 flex items-center gap-2">
                Begin Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/browse" className="group px-8 py-4 text-white hover:text-secondary transition-colors font-medium flex items-center gap-2">
              Browse Profiles
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 bg-background relative z-20 -mt-10 rounded-t-[40px] border-t border-white/10 shadow-2xl">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Elite Members", value: stats?.totalMembers || 0, icon: Star },
              { label: "Matches Made", value: stats?.totalMatches || 0, icon: Heart },
              { label: "Success Stories", value: stats?.successStories || 0, icon: Sparkles },
              { label: "Cities Covered", value: stats?.citiesCovered || 0, icon: null }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center group"
              >
                <h3 className="text-4xl md:text-5xl font-serif text-primary mb-2 group-hover:scale-110 transition-transform duration-500">{stat.value}+</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROFILES */}
      <section className="py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl font-serif text-foreground mb-4">Eminent Profiles</h2>
              <p className="text-muted-foreground">A curated selection of our most distinguished members seeking meaningful connections.</p>
            </div>
            <Link href="/browse" className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 preserve-3d">
            {featuredProfiles?.slice(0, 3).map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              >
                <ProfileCard profile={profile} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-4">Tales of Eternity</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">Discover the beautiful unions forged through SoulMate's bespoke matchmaking.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
            >
              <img src={heroCouple1} alt="Happy Couple" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
            
            <div className="space-y-12">
              {stories?.slice(0, 2).map((story, i) => (
                <motion.div 
                  key={story.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.3 }}
                  className="glass-panel p-8 rounded-2xl border-white/10"
                >
                  <h3 className="text-2xl font-serif text-secondary mb-2">{story.coupleName}</h3>
                  <p className="text-sm text-primary-foreground/60 mb-6 uppercase tracking-wider">{story.city} &bull; Married {story.marriageYear}</p>
                  <p className="text-primary-foreground/90 font-light leading-relaxed italic">"{story.story}"</p>
                </motion.div>
              ))}
              <Link href="/stories" className="inline-flex items-center gap-2 text-secondary font-medium hover:opacity-80 transition-opacity">
                Read More Stories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
