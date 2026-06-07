import { useParams } from "wouter";
import { motion } from "framer-motion";
import { useGetProfile, useSendInterest, getGetProfileQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, MapPin, GraduationCap, Briefcase, Info, Star, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
const DEFAULT_MALE = "/default-male.png";
const DEFAULT_FEMALE = "/default-female.png";

export function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const profileId = parseInt(id || "0");
  const { toast } = useToast();

  const { data: profile, isLoading } = useGetProfile(profileId, {
    query: { enabled: !!profileId, queryKey: getGetProfileQueryKey(profileId) },
  });

  const sendInterest = useSendInterest();

  const handleSendInterest = () => {
    if (!profile) return;
    sendInterest.mutate({ data: { fromProfileId: 1, toProfileId: profile.id } }, {
      onSuccess: () => {
        toast({ title: "Interest Sent!", description: `Your interest has been sent to ${profile.name}.` });
      },
      onError: () => {
        toast({ title: "Failed to Send", description: "Could not send interest. Please try again.", variant: "destructive" });
      },
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
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground font-semibold mb-6">This profile doesn't exist or has been removed.</p>
        <Link href="/browse" className="text-primary font-bold hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 bg-background">
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-[50vh] bg-gradient-to-bl from-secondary/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8">
        {/* Back link */}
        <Link href="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-bold text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Profiles
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border bg-card"
        >
          <div className="flex flex-col md:flex-row">
            {/* Photo */}
            <div className="w-full md:w-2/5 relative h-80 sm:h-96 md:h-auto min-h-[380px]">
              <img
                src={profile.photo || (profile.gender === "Female" ? DEFAULT_FEMALE : DEFAULT_MALE)}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight"
                  style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
                >
                  {profile.name}
                </h1>
                <p className="text-base sm:text-lg text-white/90 mt-1 font-semibold" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
                  {profile.age} yrs &bull; {profile.city}{profile.state ? `, ${profile.state}` : ""}
                </p>
                {profile.featured && (
                  <span className="inline-flex items-center gap-1 mt-2 px-3 py-0.5 bg-secondary/90 text-secondary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full">
                    <Star className="w-2.5 h-2.5 fill-current" /> Featured
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col">
              <div className="flex-1 space-y-7">
                {/* Quick tags */}
                <div className="flex flex-wrap gap-2">
                  {[profile.religion, profile.caste, profile.gender, `${profile.age} yrs`].filter(Boolean).map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* About */}
                <section>
                  <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" /> About
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-medium">
                    {profile.bio || "A distinguished individual seeking a meaningful connection based on shared values and mutual respect."}
                  </p>
                </section>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4">
                  <section className="bg-muted/40 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Education
                    </h3>
                    <p className="text-foreground font-bold text-sm">{profile.education || "Not specified"}</p>
                  </section>
                  <section className="bg-muted/40 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Profession
                    </h3>
                    <p className="text-foreground font-bold text-sm">{profile.profession || "Not specified"}</p>
                  </section>
                  <section className="bg-muted/40 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Religion / Caste</h3>
                    <p className="text-foreground font-bold text-sm">{profile.religion}{profile.caste ? ` · ${profile.caste}` : ""}</p>
                  </section>
                  <section className="bg-muted/40 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Location
                    </h3>
                    <p className="text-foreground font-bold text-sm">{profile.city}{profile.state ? `, ${profile.state}` : ""}</p>
                  </section>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border space-y-3">
                <Button
                  onClick={handleSendInterest}
                  disabled={sendInterest.isPending}
                  className="w-full py-6 text-base sm:text-lg font-bold tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl rounded-xl transition-all hover:-translate-y-1 group"
                >
                  {sendInterest.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Send Interest <Heart className="ml-2 w-5 h-5 group-hover:fill-primary-foreground transition-all" /></>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                  Secure &amp; Confidential — Your privacy is protected
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
