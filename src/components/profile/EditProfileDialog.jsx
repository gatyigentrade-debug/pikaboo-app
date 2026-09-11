import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function EditProfileDialog({ isOpen, profile, onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", age: "", bio: "", city: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setForm({
        name: profile.name || "",
        age: profile.age?.toString() || "",
        bio: profile.bio || "",
        city: profile.city || "",
      });
    } else if (isOpen && !profile) {
      setForm({ name: "", age: "", bio: "", city: "" });
    }
  }, [isOpen, profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        name: form.name.trim() || "User",
        age: parseInt(form.age) || 18,
        bio: form.bio.trim(),
        city: form.city.trim(),
      };
      if (profile?.id) {
        await base44.entities.DatingProfile.update(profile.id, data);
      } else {
        await base44.entities.DatingProfile.create(data);
      }
      toast.success("Profile updated!");
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error("Failed to save", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-body text-muted-foreground mb-1 block">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm font-body text-muted-foreground mb-1 block">Age</label>
            <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Your age" />
          </div>
          <div>
            <label className="text-sm font-body text-muted-foreground mb-1 block">City</label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city" />
          </div>
          <div>
            <label className="text-sm font-body text-muted-foreground mb-1 block">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full bg-secondary border border-border/40 rounded-xl px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
        </div>
        <DialogFooter className="flex-row gap-2 sm:justify-center">
          <DialogClose asChild>
            <button className="flex-1 h-11 rounded-full border border-border text-foreground font-heading font-bold text-sm hover:bg-secondary transition-colors" disabled={saving}>
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-11 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}