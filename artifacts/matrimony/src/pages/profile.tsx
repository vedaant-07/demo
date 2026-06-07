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
          title: "Rishta Bheja Gaya!",
          description: `${profile.name} ko aapka rishta bheja ja chuka hai.`,
        });
      },
      onError: () => {
        toast({
          title: "Kuch Galat Hua",
          description: "Rishta nahi bheja ja saka. Dobara koshish karein.",
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
        <h1 className="text-4xl font-serif text-primary mb-4">Profile Nahi Mila</h1>
        <p className="text-muted-foreground">Yeh profile maujood nahi hai ya hata di gayi hai.</p>
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
            <div className="w-full md:w-2/5 relative h-72 sm:h-96 md:h-auto min-h-[350px]">
              <img
                src={profile.photo || bride2}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">{profile.name}</h1>
                <p className="text-base sm:text-lg text-white/80 mt-1 font-light">
                  {profile.age} saal &bull; {profile.city}
                  {profile.state ? `, ${profile.state}` : ""}
                </p>
                {profile.featured && (
                  <span className="inline-block mt-2 px-3 py-0.5 bg-secondary/90 text-secondary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col">
              <div className="flex-1 space-y-7">
                {/* Quick Tags */}
                <div className="flex flex-wrap gap-2">
                  {[
                    profile.religion,
                    profile.caste,
                    profile.gender,
                    `${profile.age} saal`,
                  ].filter(Boolean).map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <section>
                  <h2 className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" /> Parichay
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-light">
                    {profile.bio || "Ek vishisht vyakti jo samaan vichar aur moolyaon ke aadhar par sachcha rishta dhundh rahe hain."}
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-5">
                  <section className="bg-muted/30 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Shiksha
                    </h3>
                    <p className="text-foreground font-medium text-sm">{profile.education || "Nahi bataya"}</p>
                  </section>

                  <section className="bg-muted/30 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Peshaa
                    </h3>
                    <p className="text-foreground font-medium text-sm">{profile.profession || "Nahi bataya"}</p>
                  </section>

                  <section className="bg-muted/30 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Dharm / Jati</h3>
                    <p className="text-foreground font-medium text-sm">
                      {profile.religion}{profile.caste ? ` · ${profile.caste}` : ""}
                    </p>
                  </section>

                  <section className="bg-muted/30 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Niwas
                    </h3>
                    <p className="text-foreground font-medium text-sm">
                      {profile.city}{profile.state ? `, ${profile.state}` : ""}
                    </p>
                  </section>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border space-y-3">
                <Button
                  onClick={handleSendInterest}
                  disabled={sendInterest.isPending}
                  className="w-full py-6 text-base sm:text-lg font-serif tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl rounded-xl transition-all hover:-translate-y-1 group"
                >
                  {sendInterest.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Rishta Bhejein
                      <Heart className="ml-3 w-5 h-5 group-hover:fill-primary-foreground transition-all" />
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground uppercase tracking-widest">
                  Surakshit aur Gupt — Aapki Privacy Hamari Zimmedari
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
