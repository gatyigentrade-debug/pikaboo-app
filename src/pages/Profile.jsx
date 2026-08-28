import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin, Camera, Pencil, ShoppingBag, ChevronRight, Trash2, ShieldAlert, Loader2, BadgeCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import PikaBooShop from "@/components/shop/PikaBooShop";
import VerificationSection from "@/components/profile/VerificationSection";

const myProfile = {
  name: "Nemza",
  age: 25,
  city: "Johannesburg",
  vibe: "Chill Vibe",
  bio: "Testing the waters",
  interests: ["Amapiano", "Soccer", "Road Trips", "Braai"],
  photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"],
};

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleting, setDeleting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const showShop = searchParams.get("shop") === "open";
  const showDeleteDialog = searchParams.get("delete_confirm") === "open";

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

      // Remove the user's dating profile
      await base44.entities.DatingProfile.deleteMany({ created_by_id: myId });

      // Remove all data the user created across the app
      await Promise.all([
        base44.entities.SwipeLike.deleteMany({ created_by_id: myId }),
        base44.entities.SwipeAction.deleteMany({ created_by_id: myId }),
        base44.entities.Match.deleteMany({ created_by_id: myId }),
        base44.entities.ProfileView.deleteMany({ created_by_id: myId }),
        base44.entities.BraaiMeetup.deleteMany({ created_by_id: myId }),
      ]);

      toast.success("Account deleted", {
        description: "Your PikaBoo profile and data have been removed.",
      });
      closeSheet("delete_confirm");
      await base44.auth.logout("/login");
    } catch (error) {
      toast.error("Failed to delete account", { description: error.message });
      setDeleting(false);
    }
  };

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[calc(1.25rem+env(safe-area-inset-top))]">
        <h1 className="text-xl font-heading font-bold text-foreground">My Profile</h1>
        <button className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-full border border-gold/40 text-gold text-xs font-heading font-bold">
          <Pencil className="w-3 h-3" />
          Edit
        </button>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center pt-6 pb-5">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-4 border-gold overflow-hidden glow-gold">
            <img src={myProfile.photos[0]} alt={myProfile.name} className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 w-11 h-11 rounded-full bg-gold flex items-center justify-center border-2 border-background">
            <Camera className="w-4 h-4 text-black" />
          </button>
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground mt-3 flex items-center gap-1.5">
          {myProfile.name}, {myProfile.age}
          {isVerified && <BadgeCheck className="w-5 h-5 text-primary" />}
        </h2>
        <div className="flex items-center gap-1 text-muted-foreground text-sm font-body mt-0.5">
          <MapPin className="w-3.5 h-3.5" />
          {myProfile.city}
        </div>
        <span className="mt-2 px-3 py-1 rounded-full border border-gold/40 text-gold text-xs font-body font-semibold">
          {myProfile.vibe}
        </span>
      </div>

      {/* Cards */}
      <div className="px-4 space-y-3">
        {/* Photos */}
        <div className="rounded-2xl bg-secondary/30 border border-border/40 p-4">
          <h3 className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Photos (1/6)
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-xl overflow-hidden">
              <img src={myProfile.photos[0]} alt="" className="w-full h-full object-cover" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-border/40 flex items-center justify-center">
                <Camera className="w-5 h-5 text-muted-foreground/40" />
              </div>
            ))}
          </div>
        </div>

        {/* About Me */}
        <div className="rounded-2xl bg-secondary/30 border border-border/40 p-4">
          <h3 className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-2">
            About Me
          </h3>
          <p className="text-sm text-foreground/80 font-body">{myProfile.bio}</p>
        </div>

        {/* Interests */}
        <div className="rounded-2xl bg-secondary/30 border border-border/40 p-4">
          <h3 className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {myProfile.interests.map((interest) => (
              <span key={interest} className="px-3 py-1.5 rounded-full border border-gold/30 text-gold text-xs font-body">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Safety & Settings */}
        <div className="rounded-2xl bg-secondary/30 border border-border/40 p-4">
          <h3 className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Safety & Settings
          </h3>
          <button
            onClick={() => openSheet("delete_confirm")}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-destructive/15 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-4 h-4 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-heading font-bold text-destructive">Delete Account</p>
              <p className="text-xs text-muted-foreground font-body">Permanently remove your account and data</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Verification */}
        <VerificationSection onVerified={setIsVerified} />

        {/* PikaBoo Shop */}
        <button
          onClick={() => openSheet("shop")}
          className="w-full rounded-2xl border border-gold/30 bg-secondary/30 p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-heading font-bold text-foreground">PikaBoo Shop 🛍️</p>
            <p className="text-xs text-muted-foreground font-body">Plus · Gold · Boosts · Drink Tokens</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

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
              <button
                className="flex-1 h-11 rounded-full border border-border text-foreground font-heading font-bold text-sm hover:bg-secondary transition-colors"
                disabled={deleting}
              >
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