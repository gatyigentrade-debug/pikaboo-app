import { cn } from "@/lib/utils";

const variants = {
  gold: "bg-gold/15 text-gold border-gold/30",
  coral: "bg-coral/15 text-coral border-coral/30",
  royal: "bg-royal/40 text-foreground border-royal/40",
  muted: "bg-white/5 text-muted-foreground border-white/10",
};

export default function PikaBadge({ variant = "gold", className = "", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}