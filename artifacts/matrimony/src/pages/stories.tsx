import { motion } from "framer-motion";
import { Link } from "wouter";
import { useListStories, getListStoriesQueryKey } from "@workspace/api-client-react";
import coupleImg from "@/assets/couple_2.jpg";
import { Loader2, Heart, Plus, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Stories() {
  const { data: stories, isLoading } = useListStories({
    query: { queryKey: getListStoriesQueryKey() },
  });

  return (
    <div className="pt-20 md:pt-24 pb-20 min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary/5 border-b border-border py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Heart className="w-10 h-10 text-secondary mx-auto mb-5 fill-secondary" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-primary mb-5 leading-tight">
              Love Stories
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-semibold leading-relaxed mb-8 max-w-2xl mx-auto">
              Real couples who found their forever partner on Anurup Sathi. Each story is a testament to the power of perfect matchmaking.
            </p>
            <Link href="/submit-story">
              <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/5 font-bold">
                <Plus className="w-4 h-4 mr-2" /> Share Your Story
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-12 md:mt-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {stories?.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-xl">
                  <img
                    src={story.photo || coupleImg}
                    alt={story.coupleName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-secondary fill-secondary" />)}
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold tracking-widest uppercase border border-white/20">
                      Married {story.marriageYear}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {story.coupleName}
                </h3>
                {story.city && (
                  <div className="flex items-center gap-1.5 text-sm text-secondary font-bold mb-4">
                    <MapPin className="w-3.5 h-3.5" /> {story.city}
                  </div>
                )}
                <p className="text-muted-foreground font-medium leading-relaxed line-clamp-4 italic">
                  "{story.story}"
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
