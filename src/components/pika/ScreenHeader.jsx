import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScreenHeader({ title, subtitle, icon: Icon, fallback = "/profile" }) {
  const navigate = useNavigate();
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex items-center gap-3 px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3",
        "bg-gradient-to-b from-background via-background/95 to-transparent"
      )}
    >
      <button
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(fallback))}
        className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:bg-white/10 transition-colors flex-shrink-0"
        aria-label="Back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2 min-w-0">
        {Icon && <Icon className="w-5 h-5 text-gold shrink-0" />}
        <div className="min-w-0">
          <h1 className="font-heading text-lg font-bold text-foreground truncate leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}