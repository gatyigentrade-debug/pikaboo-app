import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Flame } from "lucide-react";
import { format } from "date-fns";

const VIBE_LABELS = {
  chill: { label: "Chill Vibes", color: "text-blue-400 bg-blue-400/10" },
  social: { label: "Social", color: "text-primary bg-primary/10" },
  singles_only: { label: "Singles Only 🔥", color: "text-pink-400 bg-pink-400/10" },
  family_friendly: { label: "Family Friendly", color: "text-green-400 bg-green-400/10" },
};

export default function MeetupCard({ meetup, onJoin, onView, hasJoined }) {
  const attendees = meetup.attendee_ids?.length || 0;
  const isFull = attendees >= (meetup.max_attendees || 20);
  const vibe = VIBE_LABELS[meetup.vibe] || VIBE_LABELS.social;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl overflow-hidden border border-border/40"
    >
      {/* Banner */}
      <div className="relative h-28 bg-gradient-to-br from-primary/30 via-amber/20 to-violet/20 flex items-center justify-center">
        <span className="text-5xl">🔥</span>
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold ${vibe.color}`}>
          {vibe.label}
        </div>
        {isFull && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold bg-destructive/20 text-destructive">
            Full
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading font-bold text-foreground text-base leading-tight">{meetup.title}</h3>
          {meetup.description && (
            <p className="text-xs text-muted-foreground font-body mt-1 line-clamp-2">{meetup.description}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span>{meetup.location_name}{meetup.city ? `, ${meetup.city}` : ""}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
            <Calendar className="w-3.5 h-3.5 text-amber flex-shrink-0" />
            <span>{format(new Date(meetup.date), "EEE, dd MMM • h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-body">
            <Users className="w-3.5 h-3.5 text-violet flex-shrink-0" />
            <span className="text-muted-foreground">{attendees} / {meetup.max_attendees || 20} attending</span>
            {/* Attendee photo stack */}
            {meetup.attendee_photos?.length > 0 && (
              <div className="flex -space-x-2 ml-1">
                {meetup.attendee_photos.slice(0, 4).map((photo, i) => (
                  <img key={i} src={photo} alt="" className="w-5 h-5 rounded-full border-2 border-card object-cover" />
                ))}
                {attendees > 4 && (
                  <div className="w-5 h-5 rounded-full border-2 border-card bg-secondary text-[8px] font-bold text-muted-foreground flex items-center justify-center">
                    +{attendees - 4}
                  </div>
                )}
              </div>
            )}
          </div>
          {meetup.bring && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
              <Flame className="w-3.5 h-3.5 text-sunset flex-shrink-0" />
              <span>Bring: {meetup.bring}</span>
            </div>
          )}
        </div>

        {/* Host */}
        {meetup.host_name && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/30">
            {meetup.host_photo ? (
              <img src={meetup.host_photo} alt={meetup.host_name} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs">🧑</div>
            )}
            <span className="text-xs text-muted-foreground font-body">Hosted by <span className="text-foreground font-semibold">{meetup.host_name}</span></span>
          </div>
        )}

        <button
          onClick={hasJoined ? onView : onJoin}
          disabled={isFull && !hasJoined}
          className={`w-full py-2.5 rounded-full text-sm font-heading font-bold transition-all ${
            hasJoined
              ? "bg-secondary text-foreground border border-primary/40"
              : isFull
              ? "bg-secondary text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground glow-orange hover:opacity-90"
          }`}
        >
          {hasJoined ? "✓ You're going!" : isFull ? "Full — Join Waitlist" : "🔥 Join Braai"}
        </button>
      </div>
    </motion.div>
  );
}