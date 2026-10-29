import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders a real uploaded photo, or a neutral silhouette when there is none.
 * Never substitutes a stock or default picture that could pass as the user.
 */
export default function ProfilePhoto({ src, alt = "", className = "", iconClassName = "w-1/3 h-1/3" }) {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }
  return (
    <div
      role="img"
      aria-label={alt ? `${alt} — no photo` : "No photo"}
      className={cn("flex items-center justify-center bg-secondary overflow-hidden", className)}
    >
      <UserRound className={cn("text-muted-foreground/50", iconClassName)} />
    </div>
  );
}