import { Link } from "wouter";
import { Profile } from "@workspace/api-client-react";
import { MapPin, GraduationCap, Briefcase, Heart, Star } from "lucide-react";

const DEFAULT_PROFILE = "/default-profile.png";

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Link href={`/profile/${profile.id}`}>
      <div className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer bg-card card-3d-hover shadow-md border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-500">
        {/* Photo */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={profile.photo || DEFAULT_PROFILE}
            alt={profile.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {profile.featured && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow">
                <Star className="w-2.5 h-2.5 fill-current" /> Featured
              </span>
            )}
            <span className={`ml-auto px-2.5 py-1 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider rounded-full ${profile.gender === "Female" ? "bg-pink-500/70" : "bg-blue-500/70"}`}>
              {profile.gender}
            </span>
          </div>

          {/* Name overlay on photo */}
          <div className="absolute bottom-0 left-0 w-full px-4 py-3 text-white">
            <h3 className="text-xl md:text-2xl font-serif leading-tight">{profile.name}</h3>
            <p className="text-sm text-white/80 font-light">{profile.age} yrs &bull; {profile.religion}{profile.caste ? ` · ${profile.caste}` : ""}</p>
          </div>
        </div>

        {/* Details panel */}
        <div className="flex-1 p-4 bg-card space-y-3">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{profile.city}{profile.state ? `, ${profile.state}` : ""}</span>
          </div>

          {/* Education */}
          {profile.education && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{profile.education}</span>
            </div>
          )}

          {/* Profession */}
          {profile.profession && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{profile.profession}</span>
            </div>
          )}

          {/* Bio snippet */}
          {profile.bio && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 pt-1 border-t border-border">
              {profile.bio}
            </p>
          )}

          {/* CTA */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs text-primary font-semibold uppercase tracking-wider group-hover:underline underline-offset-4 transition-all">
              Profile Dekhein
            </span>
            <span className="w-7 h-7 rounded-full bg-primary/10 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-primary group-hover:text-primary-foreground fill-transparent group-hover:fill-primary-foreground transition-all duration-300" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
