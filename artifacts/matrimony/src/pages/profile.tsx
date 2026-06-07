import { useParams } from "wouter";
import { motion } from "framer-motion";
import { useGetProfile, useSendInterest, getGetProfileQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, MapPin, GraduationCap, Briefcase, Info } from "lucide-react";
import bride2 from "@/assets/bride_2.jpg"; // Fallback image

export function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const profileId = parseInt(id || "0");
  const { toast } = useToast();

  const { data: profile, isLoading } = useGetProfile(profileId, {
    query: {
      enabled: !!profileId,
      queryKey: getGetProfileQueryKey(profileId)
    }
  });

  const sendInterest = useSendInterest();

  const handleSendInterest = () => {
    if (!profile) return;
    // Assuming logged in user is ID 1 for demo
    sendInterest.mutate({ data: { fromProfileId: 1, toProfileId: profile.id } }, {
      onSuccess: () => {
        toast({
          title: "Interest Sent Successfully",
          description: `Your interest has been sent to ${profile.name}.`,
        });
      },
      onError: () => {
        toast({
          title: "Action Failed",
          description: "Could not send interest. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-serif text-primary mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground">The profile you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 bg-background relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-[60vh] bg-gradient-to-bl from-secondary/10 to-transparent rounded-bl-full pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto glass-panel rounded-3xl overflow-hidden shadow-2xl border border-primary/10">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="w-full md:w-2/5 relative h-[500px] md:h-auto">
              <img 
                src={profile.photo || bride2} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="text-4xl md:text-5xl font-serif leading-tight">{profile.name}</h1>
                <p className="text-lg text-white/80 mt-2 font-light">{profile.age} yrs • {profile.city}</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col">
              <div className="flex-1 space-y-10">
                <section>
                  <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" /> About
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg font-light">
                    {profile.bio || "A distinguished individual looking for a meaningful connection based on shared values and mutual respect."}
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-8">
                  <section>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> Education
                    </h3>
                    <p className="text-foreground font-medium">{profile.education || "Not specified"}</p>
                  </section>
                  
                  <section>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Profession
                    </h3>
                    <p className="text-foreground font-medium">{profile.profession || "Not specified"}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Religion & Caste</h3>
                    <p className="text-foreground font-medium">{profile.religion}{profile.caste ? `, ${profile.caste}` : ""}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Location
                    </h3>
                    <p className="text-foreground font-medium">{profile.city}{profile.state ? `, ${profile.state}` : ""}</p>
                  </section>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <Button 
                  onClick={handleSendInterest}
                  disabled={sendInterest.isPending}
                  className="w-full py-8 text-lg font-serif tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl rounded-xl transition-all hover:-translate-y-1 group"
                >
                  {sendInterest.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Send Interest
                      <Heart className="ml-3 w-5 h-5 group-hover:fill-current transition-all" />
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4 uppercase tracking-widest">
                  Secure & Confidential Express of Interest
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
