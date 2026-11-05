import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Camera, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import PikaButton from "@/components/pika/PikaButton";
import { ageFromDob, MIN_AGE } from "@/utils/profile";

const inputCls =
  "w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-[15px] text-foreground placeholder:text-muted-foreground/70 backdrop-blur-sm transition-colors focus:border-gold/60 focus:bg-white/[0.07] focus:outline-none";
const labelCls = "text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-[0.14em] mb-1.5 block";

const maxDateOfBirth = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - MIN_AGE);
  return d.toISOString().slice(0, 10);
};

export default function EditProfileDialog({ isOpen, profile, onClose, onSaved }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", date_of_birth: "", gender: "", bio: "", city: "", looking_for: "" });
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setForm({
        name: profile.name || "",
        date_of_birth: profile.date_of_birth || "",
        gender: profile.gender || "",
        bio: profile.bio || "",
        city: profile.city || "",
        looking_for: profile.looking_for || "",
      });
      setPhotos(profile.photos || []);
    } else if (isOpen && !profile) {
      setForm({ name: "", date_of_birth: "", gender: "", bio: "", city: "", looking_for: "" });
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
    const name = form.name.trim();
    if (!name) {
      toast.error("Add your name to save your profile");
      return;
    }
    if (!form.date_of_birth) {
      toast.error("Add your date of birth");
      return;
    }
    const age = ageFromDob(form.date_of_birth);
    if (age === null || age < MIN_AGE) {
      toast.error("You must be 18 or older to use PikaBoo");
      return;
    }

    setSaving(true);
    try {
      const data = {
        name,
        date_of_birth: form.date_of_birth,
        age,
        bio: form.bio.trim(),
        city: form.city.trim(),
        photos,
      };
      if (form.gender) data.gender = form.gender;
      if (form.looking_for) data.looking_for = form.looking_for;
      if (profile?.id) {
        await base44.entities.DatingProfile.update(profile.id, data);
      } else {
        await base44.entities.DatingProfile.create(data);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["myProfile"] }),
        queryClient.invalidateQueries({ queryKey: ["allProfiles"] }),
      ]);
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
        <div className="space-y-4 py-2">
          {/* Photo Management */}
          <div>
            <label className={labelCls}>Photos ({photos.length}/6)</label>
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
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-gold text-black text-[10px] font-heading font-bold">
                      Avatar
                    </span>
                  )}
                </div>
              ))}
              {photos.length < 6 && (
                <label
                  className={`aspect-square rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                >
                  {uploading ? <Loader2 className="w-5 h-5 text-gold animate-spin" /> : (
                    <>
                      <Camera className="w-5 h-5 text-gold/70" />
                      <span className="text-xs text-muted-foreground font-body">Add</span>
                    </>
                  )}
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
            <p className="text-[10px] text-muted-foreground/70 font-body mt-1.5">Photos are stored publicly so they load fast for everyone.</p>
          </div>

          <div>
            <label className={labelCls}>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Date of birth</label>
            <input
              type="date"
              value={form.date_of_birth}
              max={maxDateOfBirth()}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
              className={inputCls}
            />
            {form.date_of_birth && (
              <p className="text-xs text-muted-foreground font-body mt-1.5">Age: {ageFromDob(form.date_of_birth) ?? "—"}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className={inputCls}
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Looking for</label>
              <select
                value={form.looking_for}
                onChange={(e) => setForm({ ...form, looking_for: e.target.value })}
                className={inputCls}
              >
                <option value="">Select</option>
                <option value="relationship">A relationship</option>
                <option value="friendship">Friendship</option>
                <option value="casual">Something casual</option>
                <option value="not_sure">Seeing what's out there</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 backdrop-blur-sm transition-colors focus:border-gold/60 focus:bg-white/[0.07] focus:outline-none resize-none font-body"
            />
          </div>
        </div>
        <DialogFooter className="flex-row gap-2 sm:justify-center">
          <DialogClose asChild>
            <PikaButton variant="outline" className="flex-1" disabled={saving}>Cancel</PikaButton>
          </DialogClose>
          <PikaButton className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? "Saving..." : "Save"}
          </PikaButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}