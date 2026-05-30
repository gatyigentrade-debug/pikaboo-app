import { Badge } from "@/components/ui/badge";
import { Flame, MapPin, Globe, Trophy } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePrompts from "@/components/profile/ProfilePrompts";
import PremiumSection from "@/components/profile/PremiumSection";
import SafetySection from "@/components/profile/SafetySection";

const myProfile = {
  name: "You",
  age: 25,
  photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"],
  bio: "Explorer, foodie & proud Jozi soul ✨",
  braai_starter: "My chakalaka brings all the vibes to the yard 🔥",
  home_language: "English",
  city: "Johannesburg",
  braai_role: "Grill Master",
  dream_date_location: "Table Mountain sunset",
  cant_live_without: "Bunny chow",
  spirit_animal: "Springbok",
  sports_team: "Springboks",
  is_verified: true,
};

export default function Profile() {
  return (
    <div className="pb-28">
      <ProfileHeader profile={myProfile} />

      {/* Profile Info */}
      <div className="px-4 pt-16 space-y-6">
        {/* Name & Stats */}
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {myProfile.name}, {myProfile.age}
          </h1>
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-body">{myProfile.city}</span>
          </div>
          <p className="text-sm text-foreground/80 font-body mt-2">{myProfile.bio}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge className="bg-primary/15 text-primary border-primary/25 border font-body text-xs gap-1">
            <Globe className="w-3 h-3" /> {myProfile.home_language}
          </Badge>
          <Badge className="bg-amber/15 text-amber border-amber/25 border font-body text-xs gap-1">
            <Flame className="w-3 h-3" /> {myProfile.braai_role}
          </Badge>
          <Badge className="bg-violet/15 text-violet border-violet/25 border font-body text-xs gap-1">
            🦌 {myProfile.spirit_animal}
          </Badge>
          <Badge className="bg-gold/15 text-gold border-gold/25 border font-body text-xs gap-1">
            <Trophy className="w-3 h-3" /> {myProfile.sports_team}
          </Badge>
        </div>

        {/* Braai starter */}
        <div className="bg-secondary/50 rounded-2xl p-4 border border-border/30">
          <div className="flex items-start gap-2">
            <Flame className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-body mb-1">Braai Starter</p>
              <p className="text-sm font-heading font-semibold text-foreground italic">
                "{myProfile.braai_starter}"
              </p>
            </div>
          </div>
        </div>

        {/* SA Prompts */}
        <ProfilePrompts profile={myProfile} />

        {/* Premium */}
        <PremiumSection />

        {/* Safety */}
        <SafetySection />

        {/* Logout */}
        <div className="text-center pt-2 pb-4">
          <button className="text-sm text-muted-foreground font-body hover:text-destructive transition-colors">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}