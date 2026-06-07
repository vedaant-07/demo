import { motion } from "framer-motion";
import { Link } from "wouter";
import { useListStories, getListStoriesQueryKey } from "@workspace/api-client-react";
import heroCouple2 from "@/assets/couple_2.jpg";
import { Loader2, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Stories() {
  const { data: stories, isLoading } = useListStories({
    query: {
      queryKey: getListStoriesQueryKey()
    }
  });

  return (
    <div className="pt-24 pb-32 min-h-screen bg-background relative">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-primary/5 pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-8 h-8 text-secondary mx-auto mb-6 fill-secondary" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-primary mb-5 leading-tight">Pyaar ki<br />Kahaniyaan</h1>
            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed mb-8 max-w-2xl mx-auto">
              Unke dil ki awaaz suniye jinhe Anurup Sathi pe apna jeewan saathi mila. Har kahani ek sachche rishte ki gawah hai.
            </p>
            <Link href="/submit-story">
              <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/5">
                <Plus className="w-4 h-4 mr-2" /> Apni Kahani Batayein
              </Button>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {stories?.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-xl">
                  <img 
                    src={story.photo || heroCouple2} 
                    alt={story.coupleName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-6 left-6 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium tracking-widest uppercase border border-white/20">
                    {story.marriageYear} mein shaadi
                  </div>
                </div>
                
                <h3 className="text-3xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">
                  {story.coupleName}
                </h3>
                {story.city && (
                  <p className="text-sm text-secondary font-medium uppercase tracking-wider mb-4">
                    {story.city}
                  </p>
                )}
                <p className="text-muted-foreground font-light leading-relaxed line-clamp-4">
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
