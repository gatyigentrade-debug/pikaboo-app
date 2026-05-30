import { ShieldAlert, Camera, Ban } from "lucide-react";

const safetyItems = [
  {
    icon: ShieldAlert,
    name: "Panic Button",
    desc: "Share location with emergency contact",
    color: "text-destructive",
  },
  {
    icon: Camera,
    name: "Photo Verification",
    desc: "Verify with a shaka sign selfie 🤙",
    color: "text-green-400",
  },
  {
    icon: Ban,
    name: "Block & Report",
    desc: "Report hate speech, ghosting, etc.",
    color: "text-muted-foreground",
  },
];

export default function SafetySection() {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider">
        Safety
      </h3>
      <div className="space-y-2">
        {safetyItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className="flex items-center gap-3 w-full p-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center border border-border/50">
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-heading font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}