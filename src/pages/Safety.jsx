import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Shield, MapPin, Eye, MessageSquare, Flag, Ban,
  ChevronRight, LifeBuoy, Loader2, Search, AlertTriangle,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import ScreenHeader from "@/components/pika/ScreenHeader";
import PikaCard from "@/components/pika/PikaCard";
import PikaBadge from "@/components/pika/PikaBadge";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import ReportBlockSheet from "@/components/matches/ReportBlockSheet";

function PrivacyCard({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
      <div className="w-10 h-10 rounded-2xl bg-gold/12 flex items-center justify-center flex-shrink-0">
        <Icon className="w-[18px] h-[18px] text-gold" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-heading font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mt-0.5">{children}</p>
      </div>
    </div>
  );
}

export default function Safety() {
  const [matches, setMatches] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);

  useEffect(() => {
    let cancelled = false;
    base44.entities.Match.list({ sort: "-created_date", limit: 50 })
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.items || [];
        if (!cancelled) setMatches(items);
      })
      .catch(() => { if (!cancelled) setMatches([]); });
    return () => { cancelled = true; };
  }, []);

  const matchList = matches || [];

  return (
    <div className="min-h-screen pb-16">
      <ScreenHeader title="Privacy & Safety" subtitle="You're in control" icon={ShieldCheck} />

      <div className="px-4 space-y-5">
        {/* Privacy controls info */}
        <div>
          <h2 className="px-1 mb-2 text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-[0.14em]">
            Your privacy
          </h2>
          <PikaCard className="p-3 space-y-2.5">
            <PrivacyCard icon={Eye} title="Profile visibility">
              Only complete profiles appear in Discover. Your first name and age are shown — never your full name or date of birth.
            </PrivacyCard>
            <PrivacyCard icon={MapPin} title="Location">
              Distance to other profiles is approximate. Your exact location is never shared with other users.
            </PrivacyCard>
            <PrivacyCard icon={Shield} title="Verification">
              The verified badge is earned only through photo verification. PikaBoo never adds fake badges.
            </PrivacyCard>
            <PrivacyCard icon={MessageSquare} title="Your messages">
              Chats are private between you and your match. Report any message that makes you feel unsafe.
            </PrivacyCard>
          </PikaCard>
        </div>

        {/* Block & report */}
        <div>
          <h2 className="px-1 mb-2 text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-[0.14em]">
            Block & report
          </h2>
          <PikaCard className="p-3">
            {matches === null ? (
              <div className="flex items-center justify-center py-8 gap-2">
                <Loader2 className="w-5 h-5 text-gold animate-spin" />
                <span className="text-sm text-muted-foreground font-body">Loading your matches...</span>
              </div>
            ) : matchList.length === 0 ? (
              <div className="flex flex-col items-center text-center py-8 gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/12 flex items-center justify-center">
                  <Search className="w-5 h-5 text-gold" />
                </div>
                <p className="text-sm font-heading font-bold text-foreground">No matches yet</p>
                <p className="text-xs text-muted-foreground font-body max-w-[240px]">
                  When you have matches, you can report or block anyone here or directly from a chat.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {matchList.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                      <ProfilePhoto src={m.matched_photo} alt={m.matched_name || "Match"} className="w-full h-full object-cover" iconClassName="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-heading font-bold text-foreground truncate">{m.matched_name || "Match"}</p>
                      <p className="text-xs text-muted-foreground font-body">Tap to report or block</p>
                    </div>
                    <button
                      onClick={() => setReportTarget(m.matched_name || "this match")}
                      className="flex items-center gap-1.5 px-3 h-9 rounded-full bg-destructive/12 text-destructive text-xs font-heading font-bold hover:bg-destructive/20 transition-colors flex-shrink-0"
                    >
                      <Flag className="w-3.5 h-3.5" /> Report
                    </button>
                  </div>
                ))}
              </div>
            )}
          </PikaCard>
        </div>

        {/* Safety tips */}
        <div>
          <h2 className="px-1 mb-2 text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-[0.14em]">
            Safety tips
          </h2>
          <PikaCard className="p-3.5">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                Meet in public, tell a friend where you're going, and trust your instincts. Never send money or share financial details.
              </p>
            </div>
            <ul className="space-y-2">
              {[
                "Video call before meeting to confirm they're real.",
                "Meet in a busy, public place for first dates.",
                "Report anything that feels off — it's anonymous.",
              ].map((tip) => (
                <li key={tip} className="flex items-center gap-2 text-sm text-foreground/85 font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </PikaCard>
        </div>

        {/* More help */}
        <div>
          <h2 className="px-1 mb-2 text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-[0.14em]">
            More help
          </h2>
          <PikaCard className="p-3">
            <Link to="/privacy" className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-gold/12 flex items-center justify-center flex-shrink-0">
                <LifeBuoy className="w-[18px] h-[18px] text-gold" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-heading font-bold text-foreground">Privacy Policy</p>
                <p className="text-xs text-muted-foreground font-body">Read the full policy</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
            </Link>
            <a href="mailto:help@pikaboo.app" className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-gold/12 flex items-center justify-center flex-shrink-0">
                <Ban className="w-[18px] h-[18px] text-gold" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-heading font-bold text-foreground">Report a safety concern</p>
                <p className="text-xs text-muted-foreground font-body">Email our safety team</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
            </a>
          </PikaCard>
        </div>
      </div>

      {reportTarget && (
        <ReportBlockSheet matchName={reportTarget} onClose={() => setReportTarget(null)} />
      )}
    </div>
  );
}