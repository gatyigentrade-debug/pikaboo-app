import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Flame, MapPin, Globe, Trophy, Trash2, AlertTriangle } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePrompts from "@/components/profile/ProfilePrompts";
import PremiumSection from "@/components/profile/PremiumSection";
import SafetySection from "@/components/profile/SafetySection";
import VideoIntro from "@/components/profile/VideoIntro";
import { base44 } from "@/api/base44Client";

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

function DeleteAccountDialog({ onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await base44.auth.logout("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm bg-card border border-destructive/30 rounded-3xl p-6 space-y-5 shadow-2xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-destructive/15 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <h2 className="text-xl font-heading font-black text-foreground">Delete Account?</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            This will <strong className="text-foreground">permanently delete</strong> your profile, photos, matches, and all messages. This action <strong className="text-destructive">cannot be undone</strong>.
          </p>
        </div>

        {/* Consequences list */}
        <ul className="space-y-2 text-sm font-body text-muted-foreground">
          {["Your profile disappears from Discover immediately", "All your matches and conversations are lost forever", "Your Gold subscription is not automatically refunded", "You cannot recover your account after deletion"].map((c) => (
            <li key={c} className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">✕</span>
              {c}
            </li>
          ))}
        </ul>

        {/* Confirm checkbox */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-4 h-4 accent-destructive rounded"
          />
          <span className="text-sm font-body text-foreground">I understand this is permanent</span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-border text-sm font-heading font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!confirmed || deleting}
            className="flex-1 py-3 rounded-full bg-destructive text-white text-sm font-heading font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {deleting ? "Deleting…" : "Delete Forever"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

        {/* Intro Video */}
        <VideoIntro />

        {/* SA Prompts */}
        <ProfilePrompts profile={myProfile} />

        {/* Premium */}
        <PremiumSection />

        {/* Safety */}
        <SafetySection />

        {/* Logout */}
        <div className="text-center pt-2 pb-2">
          <button className="text-sm text-muted-foreground font-body hover:text-destructive transition-colors">
            Log out
          </button>
        </div>

        {/* Delete Account */}
        <div className="text-center pb-6">
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center justify-center gap-1.5 mx-auto text-sm text-destructive/60 font-body hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Account
          </button>
        </div>
      </div>

      {showDeleteDialog && <DeleteAccountDialog onClose={() => setShowDeleteDialog(false)} />}
    </div>
  );
}