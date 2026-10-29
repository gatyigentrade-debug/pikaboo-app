import { BadgeCheck } from "lucide-react";
import { ISSUE_LABELS } from "@/utils/profile";

export default function CompleteProfileGate({ issues, onComplete }) {
  return (
    <div className="px-4 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-28">
      <div className="flex flex-col items-center text-center pt-8">
        <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mb-4">
          <BadgeCheck className="w-8 h-8 text-gold" />
        </div>
        <h1 className="text-xl font-heading font-bold text-foreground">Complete your profile</h1>
        <p className="text-sm text-muted-foreground font-body mt-2 max-w-[280px]">
          Discover only shows complete profiles, so yours stays hidden until these are done.
        </p>
      </div>

      <ul className="mt-6 space-y-2">
        {issues.map((issue) => (
          <li key={issue} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/40 border border-border/40">
            <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
            <span className="text-sm font-body text-foreground">Add {ISSUE_LABELS[issue] || issue}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onComplete}
        className="w-full mt-6 min-h-[48px] rounded-full bg-gold text-black font-heading font-bold text-sm active:scale-95 transition-transform"
      >
        Complete my profile
      </button>
    </div>
  );
}