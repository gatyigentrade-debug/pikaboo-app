import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gradient-to-br from-[#E8C56A] to-[#D4A54A] text-[#171717] shadow-[0_8px_24px_-8px_rgba(212,165,74,0.5)]",
  coral:
    "bg-coral text-white shadow-[0_8px_24px_-8px_rgba(232,121,121,0.45)]",
  royal:
    "bg-royal text-white",
  outline:
    "border border-gold/40 text-foreground bg-transparent hover:bg-gold/10",
  ghost:
    "text-muted-foreground hover:text-foreground hover:bg-white/5",
  surface:
    "bg-secondary text-foreground border border-white/5",
};

const sizes = {
  md: "h-12 rounded-[14px] text-[15px] font-semibold px-5",
  sm: "h-10 rounded-xl text-sm font-semibold px-4",
  lg: "h-14 rounded-2xl text-base font-bold px-6",
  icon: "h-12 w-12 rounded-[14px]",
};

export default function PikaButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}