import { cn } from "@/lib/utils";
import ProfilePhoto from "@/components/common/ProfilePhoto";

export default function PikaAvatar({ src, alt = "", size = 48, ring = false, className = "" }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-secondary shrink-0",
        ring && "ring-2 ring-gold/50",
        className
      )}
      style={{ width: size, height: size }}
    >
      <ProfilePhoto
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        iconClassName="w-1/2 h-1/2"
      />
    </div>
  );
}