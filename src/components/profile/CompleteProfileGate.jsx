import { BadgeCheck } from "lucide-react";
import PikaCard from "@/components/pika/PikaCard";
import PikaButton from "@/components/pika/PikaButton";
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

      <PikaCard className="p-4 mt-6">
        <ul className="space-y-2.5">
          {issues.map((issue) => (
            <li key={issue} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
              <span className="text-sm font-body text-foreground">Add {ISSUE_LABELS[issue] || issue}</span>
            </li>
          ))}
        </ul>
      </PikaCard>

      <PikaButton size="lg" className="w-full mt-6" onClick={onComplete}>
        Complete my profile
      </PikaButton>
    </div>
  );
}