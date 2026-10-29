import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import { firstName } from "@/utils/profile";

export default function MatchCard({ match, onClick }) {
  const name = firstName(match.matched_name);

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30">
          <ProfilePhoto
            src={match.matched_photo}
            alt={name}
            className="w-full h-full object-cover"
            iconClassName="w-6 h-6"
          />
        </div>
        {match.unread_count > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
            {match.unread_count}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-semibold text-foreground text-sm truncate">
            {name}
          </h3>
          {match.status === "pending" && (
            <div className="flex items-center gap-1 text-amber text-sm">
              <Clock className="w-3 h-3" />
              <span>24h</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground font-body truncate mt-0.5">
          {match.last_message || "Start the vibe! Say howzit 👋"}
        </p>
      </div>

      {/* Time */}
      <span className="text-sm text-muted-foreground flex-shrink-0">
        {match.last_message_time
          ? new Date(match.last_message_time).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })
          : "New"}
      </span>
    </motion.button>
  );
}