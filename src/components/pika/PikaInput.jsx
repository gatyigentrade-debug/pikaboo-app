import { cn } from "@/lib/utils";

export default function PikaInput({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-[15px] text-foreground placeholder:text-muted-foreground/70 backdrop-blur-sm transition-colors focus:border-gold/60 focus:bg-white/[0.07] focus:outline-none",
        className
      )}
      {...props}
    />
  );
}