import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { ensureMyProfile } from "@/hooks/useMyProfile";
import PikaButton from "@/components/pika/PikaButton";

const INTEREST_OPTIONS = [
  "Amapiano", "Soccer", "Braai", "Road Trips", "Foodie",
  "Nightlife", "Outdoors", "Gaming", "Music", "Fitness",
  "Travel", "Movies", "Art", "Coffee", "Hiking",
  "Kota", "Shebeen Vibes", "Gospel", "Dancing", "Pets",
  "Reading", "Fashion", "Sneakers", "Photography", "Sunday Chillas",
];

const MAX_INTERESTS = 8;

export default function InterestsEditorDialog({ isOpen, profile, onClose, onSaved }) {
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setSelected(profile?.interests || []);
  }, [isOpen, profile]);

  const toggleInterest = (interest) => {
    setSelected((prev) => {
      if (prev.includes(interest)) return prev.filter((i) => i !== interest);
      if (prev.length >= MAX_INTERESTS) {
        toast.error(`Pick up to ${MAX_INTERESTS} interests`);
        return prev;
      }
      return [...prev, interest];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const target = profile?.id ? profile : await ensureMyProfile();
      if (!target?.id) {
        toast.error("Add your name and date of birth first");
        return;
      }
      await base44.entities.DatingProfile.update(target.id, { interests: selected });
      toast.success("Interests updated!");
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error("Failed to save interests", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">Your Interests</DialogTitle>
          <DialogDescription className="text-center">
            Tap to pick up to {MAX_INTERESTS}. They show on your profile.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 py-2">
          {INTEREST_OPTIONS.map((interest) => {
            const active = selected.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                aria-pressed={active}
                className={`min-h-[44px] px-3.5 py-2 rounded-full border text-sm font-body transition-colors flex items-center gap-1.5 ${
                  active
                    ? "border-gold/60 bg-gold/15 text-gold font-heading font-bold"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {active && <Check className="w-3.5 h-3.5" />}
                {interest}
              </button>
            );
          })}
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-center">
          <DialogClose asChild>
            <PikaButton variant="outline" className="flex-1" disabled={saving}>Cancel</PikaButton>
          </DialogClose>
          <PikaButton className="flex-1" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : "Save"}
          </PikaButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}