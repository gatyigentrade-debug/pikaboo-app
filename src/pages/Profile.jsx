import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MapPin, Camera, Pencil, ShoppingBag, ChevronRight, Trash2, ShieldAlert,
  Loader2, BadgeCheck, Shield, UserRound, Settings as SettingsIcon, Sparkles,
  HeartHandshake, Globe, UtensilsCrossed, Trophy, Compass, Heart,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { useMyProfile } from "@/hooks/useMyProfile";
import { toast } from "sonner";
import PikaBooShop from "@/components/shop/PikaBooShop";
import VerificationSection from "@/components/profile/VerificationSection";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import InterestsEditorDialog from "@/components/profile/InterestsEditorDialog";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import PikaCard from "@/components/pika/PikaCard";
import PikaButton from "@/components/pika/PikaButton";
import PikaBadge from "@/components/pika/PikaBadge";
import { useAuth } from "@/lib/AuthContext";
import { ageFromDob, firstName, isVerifiedProfile } from "@/utils/profile";

const INTENTION_LABELS = {
  relationship: "A relationship",
  friendship: "Friendship",
  casual: "Something casual",
  not_sure: "Seeing what's out there",
};

const LIFESTYLE_FIELDS = [
  { key: "home_language", label: "Home language", icon: Globe },
  { key: "sports_team", label: "Sports team", icon: Trophy },
  { key: "favorite_kota_spot", label: "Favourite Kota spot", icon: UtensilsCrossed },
  { key: "braai_role", label: "Braai role", icon: Sparkles },
  { key: "dream_date_location", label: "Dream date spot", icon: Heart },
  { key: "cant_live_without", label: "Can't live without", icon: HeartHandshake },
  { key: "spirit_animal", label: "Spirit animal", icon: Compass },
  { key: "braai_starter", label: "Braai starter", icon: Sparkles },
];

function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-[0.14em]">
        {children}
      </h3>
      {action}
    </div>
  );
}

function SettingsRow({ icon: Icon, title, subtitle, onClick, to, danger, accent = "gold" }) {
  const content = (
    <div className="flex items-center gap-3 w-full">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${danger ? "bg-destructive/12" : accent === "gold" ? "bg-gold/12" : "bg-white/5"}`}>
        <Icon className={`w-[18px] h-[18px] ${danger ? "text-destructive" : "text-gold"}`} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className={`text-sm font-heading font-bold ${danger ? "text-destructive" : "text-foreground"}`}>{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground font-body truncate">{subtitle}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
    </div>
  );
  const cls = `w-full flex items-center p-3 rounded-2xl transition-colors ${danger ? "hover:bg-destructive/10" : "hover:bg-white/5"}`;
  if (to) return <Link to={to} className={cls}>{content}</Link>;
  return <button onClick={onClick} className={cls}>{content}</button>;
}

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();

  const { profile, isLoading, refetch } = useMyProfile();
  const age = ageFromDob(profile?.date_of_birth);
  const showVerified = isVerifiedProfile(profile);
  const photos = profile?.photos || [];

  const showShop = searchParams.get("shop") === "open";
  const showDeleteDialog = searchParams.get("delete_confirm") === "open";
  const showEdit = searchParams.get("edit") === "open";
  const showInterests = searchParams.get("interests") === "open";

  const openSheet = (key) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, "open");
    setSearchParams(next);
  };
  const closeSheet = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const me = await base44.auth.me();
      const myId = me?.id;
      await base44.entities.DatingProfile.deleteMany({ created_by_id: myId });
      await Promise.all([
        base44.entities.SwipeLike.deleteMany({ created_by_id: myId }),
        base44.entities.SwipeAction.deleteMany({ created_by_id: myId }),
        base44.entities.Match.deleteMany({ created_by_id: myId }),
        base44.entities.ProfileView.deleteMany({ created_by_id: myId }),
        base44.entities.BraaiMeetup.deleteMany({ created_by_id: myId }),
      ]);
      toast.success("Account deleted", { description: "Your PikaBoo profile and data have been removed." });
      closeSheet("delete_confirm");
      await base44.auth.logout("/login");
    } catch (error) {
      toast.error("Failed to delete account", { description: error.message });
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32">
        <Loader2 className="w-7 h-7 text-gold animate-spin" />
        <p className="text-sm text-muted-foreground font-body">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pb-28">
        <div className="px-4 pt-[calc(1.25rem+env(safe-area-inset-top))]">
          <h1 className="text-xl font-heading font-bold text-foreground">My Profile</h1>
        </div>
        <div className="px-4 mt-6">
          <PikaCard className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-3">
              <UserRound className="w-6 h-6 text-gold" />
            </div>
            <p className="text-base font-heading font-bold text-foreground">Your profile isn't set up yet</p>
            <p className="text-sm text-muted-foreground font-body mt-1 mb-5">
              Add your name, a photo and a few details so other Boos can find you.
            </p>
            <PikaButton className="w-full" onClick={() => openSheet("edit")}>
              Create my profile
            </PikaButton>
          </PikaCard>
        </div>
        <EditProfileDialog isOpen={showEdit} profile={profile} onClose={() => closeSheet("edit")} onSaved={() => refetch()} />
      </div>
    );
  }

  const lifestyleValues = LIFESTYLE_FIELDS.filter((f) => {
    const v = profile?.[f.key];
    return v !== undefined && v !== null && String(v).trim() !== "";
  });

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">My Profile</h1>
        <PikaButton variant="outline" size="sm" onClick={() => openSheet("edit")}>
          <Pencil className="w-3.5 h-3.5" /> Edit
        </PikaButton>
      </div>

      {/* Photo gallery at top */}
      <div className="px-4 mt-3">
        <PikaCard className="p-3">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-[0.14em]">
              Photos ({photos.length}/6)
            </h3>
            <button onClick={() => openSheet("edit")} className="text-[11px] font-heading font-bold text-gold">Manage</button>
          </div>
          {photos.length > 0 ? (
            <>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-2">
                <img src={photos[0]} alt={profile?.name || "Your photo"} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {photos.slice(1).map((photo, i) => (
                  <div key={i + 1} className="aspect-square rounded-xl overflow-hidden">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 5 - (photos.length - 1)) }).map((_, i) => (
                  <button key={`empty-${i}`} onClick={() => openSheet("edit")} className="aspect-square rounded-xl border border-dashed border-white/12 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-muted-foreground/40" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <button onClick={() => openSheet("edit")} className="w-full aspect-[4/3] rounded-2xl border border-dashed border-white/12 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gold/12 flex items-center justify-center">
                <Camera className="w-5 h-5 text-gold" />
              </div>
              <span className="text-sm text-muted-foreground font-body">Add your first photo</span>
            </button>
          )}
        </PikaCard>
      </div>

      {/* Identity */}
      <div className="px-4 mt-4 text-center">
        <h2 className="text-2xl font-heading font-bold flex items-center justify-center gap-2">
          <span className="text-gradient-gold">{firstName(profile?.name) || "Your name"}</span>
          {age ? <span className="text-foreground/80 text-xl font-body font-normal">, {age}</span> : null}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
          {showVerified ? (
            <PikaBadge variant="gold"><BadgeCheck className="w-3.5 h-3.5" /> Verified</PikaBadge>
          ) : (
            <PikaBadge variant="muted"><Shield className="w-3.5 h-3.5" /> Unverified</PikaBadge>
          )}
          {profile?.city && (
            <PikaBadge variant="muted"><MapPin className="w-3.5 h-3.5" /> {profile.city}</PikaBadge>
          )}
          {profile?.looking_for && (
            <PikaBadge variant="coral"><Heart className="w-3.5 h-3.5" /> {INTENTION_LABELS[profile.looking_for] || profile.looking_for}</PikaBadge>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 mt-4 space-y-3">
        {/* About */}
        <PikaCard className="p-4">
          <SectionTitle>About Me</SectionTitle>
          <p className="text-sm text-foreground/85 font-body leading-relaxed">
            {profile?.bio || <span className="text-muted-foreground">Add a bio to let people know about you...</span>}
          </p>
        </PikaCard>

        {/* Interests */}
        <PikaCard className="p-4">
          <SectionTitle
            action={
              <PikaButton variant="outline" size="sm" className="!h-8 !px-3" onClick={() => openSheet("interests")}>
                <Pencil className="w-3 h-3" /> Edit
              </PikaButton>
            }
          >
            Interests
          </SectionTitle>
          {profile?.interests?.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <PikaBadge key={interest} variant="gold">{interest}</PikaBadge>
              ))}
            </div>
          ) : (
            <button onClick={() => openSheet("interests")} className="w-full py-3 rounded-xl border border-dashed border-white/12 text-sm font-body text-muted-foreground">
              Tap to add your interests
            </button>
          )}
        </PikaCard>

        {/* Lifestyle details */}
        {lifestyleValues.length > 0 && (
          <PikaCard className="p-4">
            <SectionTitle>Lifestyle & Vibes</SectionTitle>
            <div className="space-y-2.5">
              {lifestyleValues.map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground font-body uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-body text-foreground/90 truncate">{profile[key]}</p>
                  </div>
                </div>
              ))}
            </div>
          </PikaCard>
        )}

        {/* Verification */}
        <VerificationSection />

        {/* Shop */}
        <PikaCard className="p-0 overflow-hidden">
          <button onClick={() => openSheet("shop")} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-gold/12 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-[18px] h-[18px] text-gold" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-heading font-bold text-foreground">PikaBoo Shop</p>
              <p className="text-xs text-muted-foreground font-body">Plus · Gold · Boosts · Drink Tokens</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
          </button>
        </PikaCard>

        {/* Safety & Settings */}
        <PikaCard className="p-4">
          <SectionTitle>Safety & Settings</SectionTitle>
          <div className="space-y-1">
            <SettingsRow icon={SettingsIcon} title="Settings" subtitle="Account, notifications & preferences" to="/settings" />
            <SettingsRow icon={Shield} title="Privacy & Safety" subtitle="Controls, reporting & block list" to="/safety" />
            <SettingsRow icon={Globe} title="Privacy Policy" subtitle="How we handle your data" to="/privacy" />
            {user?.role === "admin" && (
              <SettingsRow icon={ShieldAlert} title="Data quality review" subtitle="Profiles missing details, admins only" to="/admin/data-quality" />
            )}
            <SettingsRow icon={Trash2} title="Delete Account" subtitle="Permanently remove your account and data" onClick={() => openSheet("delete_confirm")} danger />
          </div>
        </PikaCard>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog isOpen={showEdit} profile={profile} onClose={() => closeSheet("edit")} onSaved={() => refetch()} />

      {/* Interests Editor */}
      <InterestsEditorDialog isOpen={showInterests} profile={profile} onClose={() => closeSheet("interests")} onSaved={() => refetch()} />

      {/* Shop Modal */}
      <PikaBooShop isOpen={showShop} onClose={() => closeSheet("shop")} />

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={(open) => (open ? openSheet("delete_confirm") : closeSheet("delete_confirm"))}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-center text-foreground">Delete Account?</DialogTitle>
            <DialogDescription className="text-center">
              This will permanently delete your PikaBoo account, matches, messages, and profile data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:justify-center">
            <DialogClose asChild>
              <button className="flex-1 h-11 rounded-full border border-border text-foreground font-heading font-bold text-sm hover:bg-secondary transition-colors" disabled={deleting}>
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex-1 h-11 rounded-full bg-destructive text-destructive-foreground font-heading font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}