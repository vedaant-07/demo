import { Link } from "wouter";
import { Profile } from "@workspace/api-client-react";
import bride3 from "@/assets/bride_3.jpg";
import { MapPin } from "lucide-react";

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Link href={`/profile/${profile.id}`}>
      <div className="group relative block rounded-2xl overflow-hidden cursor-pointer bg-card card-3d-hover shadow-lg border border-border">
        <div className="aspect-[3/4] relative overflow-hidden">
          <img 
            src={profile.photo || bride3} 
            alt={profile.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-2xl font-serif leading-tight mb-1">{profile.name}</h3>
            <div className="flex items-center gap-2 text-sm text-white/80 font-light mb-3">
              <span>{profile.age} yrs</span>
              <span>&bull;</span>
              <span>{profile.religion}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs font-medium text-secondary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <MapPin className="w-3 h-3" />
              {profile.city}
            </div>
          </div>
          
          {profile.featured && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
              Featured
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
