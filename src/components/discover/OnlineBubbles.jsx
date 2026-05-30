import { motion } from "framer-motion";

export default function OnlineBubbles({ profiles }) {
  const onlineProfiles = profiles.filter((p) => p.is_online);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
      {onlineProfiles.map((profile, i) => (
        <motion.div
          key={profile.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center gap-1 flex-shrink-0"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-primary/50 p-0.5">
              <img
                src={profile.photos?.[0]}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <span className="text-xs font-body text-muted-foreground truncate w-16 text-center">
            {profile.name}
          </span>
        </motion.div>
      ))}
      {onlineProfiles.length === 0 && (
        <p className="text-sm text-muted-foreground font-body py-4 px-2">
          No one streaming right now. Check back soon!
        </p>
      )}
    </div>
  );
}