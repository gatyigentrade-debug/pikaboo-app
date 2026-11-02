import { cn } from "@/lib/utils";

export default function PikaCard({ className = "", children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/5 bg-secondary/60 backdrop-blur-sm shadow-[0_12px_32px_-16px_rgba(0,0,0,0.7)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}