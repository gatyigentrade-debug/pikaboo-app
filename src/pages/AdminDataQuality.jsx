import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Trash2, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import { fetchAllProfiles } from "@/hooks/useDiscoverableProfiles";
import { ISSUE_LABELS, profileIssues } from "@/utils/profile";

/**
 * Admin-only review list: every profile that is hidden from feeds because it
 * is missing a photo, date of birth, gender or location — with delete.
 */
export default function AdminDataQuality() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: profiles = [], isLoading, refetch } = useQuery({
    queryKey: ["allProfiles"],
    queryFn: fetchAllProfiles,
    enabled: isAdmin,
  });

  const flagged = profiles
    .map((profile) => ({ profile, issues: profileIssues(profile) }))
    .filter((row) => row.issues.length > 0);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await base44.entities.DatingProfile.delete(pendingDelete.id);
      toast.success("Profile deleted");
      setPendingDelete(null);
      await refetch();
    } catch (error) {
      toast.error("Couldn't delete profile", { description: error.message });
    } finally {
      setDeleting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen px-4 pt-[calc(1.25rem+env(safe-area-inset-top))]">
        <Link to="/profile" className="inline-flex items-center gap-2 min-h-[44px] text-sm font-body text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="mt-10 text-center">
          <ShieldAlert className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-heading font-bold text-foreground">Admins only</p>
          <p className="text-sm text-muted-foreground font-body mt-1">You don't have access to this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-10 pt-[calc(1.25rem+env(safe-area-inset-top))]">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/profile" aria-label="Back" className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Data quality review</h1>
          <p className="text-xs text-muted-foreground font-body">Hidden profiles, admins only</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-body mb-4">
        {isLoading ? "Checking profiles..." : `${flagged.length} profile${flagged.length === 1 ? "" : "s"} missing details and hidden from feeds.`}
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
        </div>
      ) : flagged.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-border/40 bg-secondary/30">
          <p className="text-sm font-heading font-bold text-foreground">All profiles are complete</p>
          <p className="text-xs text-muted-foreground font-body mt-1">Nothing to clean up right now.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {flagged.map(({ profile, issues }) => (
            <div key={profile.id} className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/40 border border-border/40">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <ProfilePhoto
                  src={profile.photos?.[0]}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  iconClassName="w-5 h-5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-heading font-bold text-foreground truncate">
                  {profile.name || "No name"}
                </p>
                <p className="text-xs text-muted-foreground font-body truncate">
                  {profile.city || "No city"} · joined{" "}
                  {profile.created_date ? new Date(profile.created_date).toLocaleDateString("en-ZA") : "—"}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {issues.map((issue) => (
                    <span key={issue} className="px-2 py-0.5 rounded-full bg-destructive/15 text-destructive text-xs font-body">
                      Missing {ISSUE_LABELS[issue] || issue}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setPendingDelete(profile)}
                aria-label={`Delete ${profile.name || "profile"}`}
                className="w-11 h-11 rounded-full bg-destructive/15 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-foreground">Delete this profile?</DialogTitle>
            <DialogDescription className="text-center">
              {pendingDelete?.name || "This profile"} will be permanently removed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:justify-center">
            <DialogClose asChild>
              <button className="flex-1 h-11 rounded-full border border-border text-foreground font-heading font-bold text-sm" disabled={deleting}>
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={handleDelete}
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