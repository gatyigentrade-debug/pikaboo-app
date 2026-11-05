import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings as SettingsIcon, UserCog, Bell, SlidersHorizontal, LifeBuoy,
  ShieldCheck, Trash2, ChevronRight, Mail, Crown, Pencil, Ban, LogOut,
  Info, MapPin, Eye, MessageSquare,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import ScreenHeader from "@/components/pika/ScreenHeader";
import PikaCard from "@/components/pika/PikaCard";
import PikaBadge from "@/components/pika/PikaBadge";

function Group({ title, children }) {
  return (
    <div>
      <h2 className="px-1 mb-2 text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-[0.14em]">
        {title}
      </h2>
      <PikaCard className="p-3">{children}</PikaCard>
    </div>
  );
}

function Row({ icon: Icon, title, subtitle, to, onClick, danger, accent = "gold", right }) {
  const inner = (
    <>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${danger ? "bg-destructive/12" : accent === "gold" ? "bg-gold/12" : "bg-white/5"}`}>
        <Icon className={`w-[18px] h-[18px] ${danger ? "text-destructive" : accent === "gold" ? "text-gold" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className={`text-sm font-heading font-bold ${danger ? "text-destructive" : "text-foreground"}`}>{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground font-body truncate">{subtitle}</p>}
      </div>
      {right ?? <ChevronRight className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />}
    </>
  );
  const cls = `w-full flex items-center gap-3 p-3 rounded-2xl transition-colors ${danger ? "hover:bg-destructive/10" : "hover:bg-white/5"}`;
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <button onClick={onClick} className={cls}>{inner}</button>;
}

export default function Settings() {
  const { user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await base44.auth.logout("/login");
    } catch (e) {
      toast.error("Failed to log out", { description: e.message });
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <ScreenHeader title="Settings" subtitle="Manage your PikaBoo experience" icon={SettingsIcon} />

      <div className="px-4 space-y-5">
        {/* Account */}
        <Group title="Account">
          <div className="space-y-1">
            <Row icon={Pencil} title="Edit profile" subtitle="Photos, name, bio & details" to="/profile?edit=open" />
            <Row icon={Crown} title="Subscription" subtitle="VIP & billing" to="/subscriptions" />
            <Row icon={Mail} title="Email" subtitle={user?.email || "—"} accent="muted" right={<PikaBadge variant="muted">Registered</PikaBadge>} />
            <Row icon={LogOut} title="Log out" subtitle="Sign out of this device" onClick={handleLogout} danger />
          </div>
        </Group>

        {/* Notifications */}
        <Group title="Notifications">
          <div className="space-y-1">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-10 h-10 rounded-2xl bg-gold/12 flex items-center justify-center flex-shrink-0">
                <Info className="w-[18px] h-[18px] text-gold" />
              </div>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                PikaBoo sends push notifications for new matches and messages. You can switch individual
                categories on or off in your device's notification settings for the PikaBoo app.
              </p>
            </div>
            <div className="flex items-center gap-3 p-3">
              <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center"><Bell className="w-4 h-4 text-gold" /></div>
              <div className="flex-1">
                <p className="text-sm font-heading font-bold text-foreground">Matches</p>
                <p className="text-xs text-muted-foreground font-body">When you get a new match</p>
              </div>
              <PikaBadge variant="gold">On</PikaBadge>
            </div>
            <div className="flex items-center gap-3 p-3">
              <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center"><MessageSquare className="w-4 h-4 text-gold" /></div>
              <div className="flex-1">
                <p className="text-sm font-heading font-bold text-foreground">Messages</p>
                <p className="text-xs text-muted-foreground font-body">New chat messages</p>
              </div>
              <PikaBadge variant="gold">On</PikaBadge>
            </div>
          </div>
        </Group>

        {/* Preferences */}
        <Group title="Preferences">
          <div className="space-y-1">
            <Row icon={SlidersHorizontal} title="Discovery filters" subtitle="Age, distance & interests" to="/explore?filters=open" />
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <Eye className="w-[18px] h-[18px] text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-heading font-bold text-foreground">Profile visibility</p>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  Your profile is shown in Discover once it's complete (photo, name, age, gender and city).
                  Incomplete profiles stay hidden until you finish them.
                </p>
              </div>
            </div>
          </div>
        </Group>

        {/* Help & Support */}
        <Group title="Help & Support">
          <div className="space-y-1">
            <Row icon={ShieldCheck} title="Privacy & Safety" subtitle="Controls, reporting & block list" to="/safety" />
            <Row icon={LifeBuoy} title="Privacy Policy" subtitle="How we handle your data" to="/privacy" />
            <Row icon={Mail} title="Contact support" subtitle="help@pikaboo.app" to="mailto:help@pikaboo.app" />
          </div>
        </Group>

        {/* Account Management */}
        <Group title="Account Management">
          <div className="space-y-1">
            <Row icon={Ban} title="Block & report" subtitle="Report or block a match" to="/safety" accent="muted" />
            <Row icon={Trash2} title="Delete account" subtitle="Permanently remove your data" to="/profile?delete_confirm=open" danger />
          </div>
        </Group>

        <p className="text-center text-[11px] text-muted-foreground/60 font-body pt-2">
          PikaBoo v1.0 · Made with 💛 in Mzansi
        </p>
      </div>
    </div>
  );
}