import { useListInterests, getListInterestsQueryKey, useListProfiles, getListProfilesQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Loader2, Heart, Check, Clock } from "lucide-react";
import { ProfileCard } from "@/components/profile-card";
import { Link } from "wouter";

export function Interests() {
  const { data: interests, isLoading: interestsLoading } = useListInterests({
    query: {
      queryKey: getListInterestsQueryKey()
    }
  });

  const { data: profiles, isLoading: profilesLoading } = useListProfiles({}, {
    query: {
      queryKey: getListProfilesQueryKey({})
    }
  });

  const isLoading = interestsLoading || profilesLoading;

  return (
    <div className="pt-24 pb-32 min-h-screen bg-background relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Your Interests</h1>
          <p className="text-muted-foreground max-w-2xl">Manage the connections you've initiated and the interest you've received.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : !interests || interests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 glass-panel rounded-2xl border border-white/10 mt-8">
            <Heart className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-2xl font-serif text-primary mb-2">No Interests Yet</h3>
            <p className="text-muted-foreground mb-6">You haven't sent or received any interests.</p>
            <Link href="/browse" className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium">
              Browse Profiles
            </Link>
          </div>
        ) : (
          <div className="space-y-12 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {interests.map((interest, i) => {
                // Determine the other profile (assuming logged in user is 1)
                const otherProfileId = interest.fromProfileId === 1 ? interest.toProfileId : interest.fromProfileId;
                const profile = profiles?.find(p => p.id === otherProfileId);
                
                if (!profile) return null;

                const isSent = interest.fromProfileId === 1;

                return (
                  <motion.div
                    key={interest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative group"
                  >
                    <ProfileCard profile={profile} />
                    <div className="absolute top-4 left-4 z-20">
                      {isSent ? (
                        <div className="px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                          <Check className="w-3 h-3" /> Sent
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-secondary/90 backdrop-blur-md text-secondary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                          <Heart className="w-3 h-3" /> Received
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 z-20">
                      <div className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1 border border-white/20">
                        {interest.status === 'pending' ? <Clock className="w-3 h-3" /> : null}
                        {interest.status}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
