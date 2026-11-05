import { useState, useEffect, useRef } from "react";
import { ShieldCheck, BadgeCheck, Loader2, Camera, Upload, ChevronRight, Clock, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { ensureMyProfile } from "@/hooks/useMyProfile";
import PikaButton from "@/components/pika/PikaButton";
import PikaCard from "@/components/pika/PikaCard";

export default function VerificationSection({ onVerified }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await base44.auth.me();
      const profiles = await base44.entities.DatingProfile.filter({ created_by_id: user.id });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        if (profiles[0].verification_status === "verified" && onVerified) {
          onVerified(true);
        }
      }
    } catch (error) {
      // User not logged in or no profile yet
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    const previousProfile = profile;
    setProfile(prev => prev ? { ...prev, verification_status: "pending" } : prev);
    handleClose();
    setSubmitting(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file: selectedFile });

      if (previousProfile) {
        await base44.entities.DatingProfile.update(previousProfile.id, {
          verification_status: "pending",
          verification_photo: file_url,
        });
      } else {
        const created = await ensureMyProfile();
        if (created?.id) {
          await base44.entities.DatingProfile.update(created.id, {
            verification_status: "pending",
            verification_photo: file_url,
          });
        }
      }

      toast.success("Verification photo submitted!", {
        description: "We'll review your photo and update your status soon.",
      });
      loadProfile();
    } catch (error) {
      setProfile(previousProfile);
      toast.error("Failed to submit", { description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const status = profile?.verification_status || "not_submitted";

  return (
    <>
      <PikaCard className="p-4">
        <h3 className="text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-[0.14em] mb-3">
          Verification
        </h3>

        {status === "verified" ? (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-green-500/10 border border-green-500/20">
            <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <BadgeCheck className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-heading font-bold text-green-500">Verified</p>
              <p className="text-xs text-muted-foreground font-body">Your profile is verified</p>
            </div>
          </div>
        ) : status === "pending" ? (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-heading font-bold text-amber-500">Pending Review</p>
              <p className="text-xs text-muted-foreground font-body">We're reviewing your photo</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDialog(true)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-2xl bg-gold/12 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-heading font-bold text-foreground">Get Verified</p>
              <p className="text-xs text-muted-foreground font-body">Submit a photo to earn a verified badge</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
          </button>
        )}
      </PikaCard>

      <Dialog open={showDialog} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-gold/12 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <DialogTitle className="text-center text-foreground">Get Verified</DialogTitle>
            <DialogDescription className="text-center">
              Upload a clear photo of yourself to get a verified badge. This helps build trust in our community.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileSelect}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Preview" className="w-full h-48 rounded-xl object-cover" />
                <button
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gold/12 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gold" />
                </div>
                <span className="text-sm text-muted-foreground font-body">Tap to take or upload a photo</span>
              </button>
            )}
          </div>

          <DialogFooter className="flex-row gap-2 sm:justify-center">
            <DialogClose asChild>
              <PikaButton variant="outline" className="flex-1" disabled={submitting}>Cancel</PikaButton>
            </DialogClose>
            <PikaButton className="flex-1" onClick={handleSubmit} disabled={!selectedFile || submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {submitting ? "Submitting..." : "Submit"}
            </PikaButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}