import { useState, useEffect } from "react";
import { Loader2, Camera, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function EditProfileDialog({ isOpen, profile, onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", age: "", bio: "", city: "" });
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setForm({
        name: profile.name || "",
        age: profile.age?.toString() || "",
        bio: profile.bio || "",
        city: profile.city || "",
      });
      setPhotos(profile.photos || []);
    } else if (isOpen && !profile) {
      setForm({ name: "", age: "", bio: "", city: "" });
      setPhotos([]);
    }
  }, [isOpen, profile]);

  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = "";
    if (photos.length + files.length > 6) {
      toast.error("Maximum 6 photos");
      return;
    }

    setUploading(true);
    toast.info(`Uploading ${files.length} photo${files.length > 1 ? "s" : ""}...`);
    try {
      const uploaded = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error("Only image files are supported", { description: file.name });
          continue;
        }
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
        uploaded.push(file_url);
      }
      if (uploaded.length) {
        setPhotos((prev) => [...prev, ...uploaded]);
        toast.success(`${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} added`);
      }
    } catch (error) {
      toast.error("Failed to upload photo", { description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        name: form.name.trim() || "User",
        age: parseInt(form.age) || 18,
        bio: form.bio.trim(),
        city: form.city.trim(),
        photos,
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
      <DialogContent className="max-w-sm rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {/* Photo Management */}
          <div>
            <label className="text-sm font-body text-muted-foreground mb-2 block">Photos ({photos.length}/6)</label>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-gold text-black text-xs font-heading font-bold">
                      Avatar
                    </span>
                  )}
                </div>
              ))}
              {photos.length < 6 && (
                <label
                  className={`aspect-square rounded-xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-1 hover:bg-secondary/30 transition-colors ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                >
                  {uploading ? <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" /> : (
                    <>
                      <Camera className="w-5 h-5 text-muted-foreground/60" />
                      <span className="text-xs text-muted-foreground font-body">Add</span>
                    </>
                  )}
                  {/* Nested inside <label> so the native click forwards to the input
                      without JavaScript .click() — Android WebView treats label clicks
                      as trusted user gestures and reliably fires onShowFileChooser. */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelect}
                    disabled={uploading}
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                </label>
              )}
            </div>
          </div>

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