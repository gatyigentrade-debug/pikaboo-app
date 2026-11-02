import { cn } from "@/lib/utils";

export default function PageHeader({ title, subtitle, icon: Icon, right, className = "" }) {
  return (
    <header className={cn("flex items-center justify-between gap-3 px-4 pt-4 pb-3", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {Icon && <Icon className="w-5 h-5 text-gold shrink-0" />}
        <div className="min-w-0">
          <h1 className="font-heading text-lg font-bold text-foreground truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
      </div>
      {right}
    </header>
  );
}