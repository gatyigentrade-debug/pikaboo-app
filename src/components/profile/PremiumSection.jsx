import { Zap, Star, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

const premiumFeatures = [
  {
    icon: Zap,
    name: "Braai Boost",
    desc: "Front of the queue for 30 min",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: Star,
    name: "Sunset SuperLike",
    desc: "Send a sunset-themed super like",
    color: "text-violet",
    bg: "bg-violet/10 border-violet/20",
  },
  {
    icon: Coins,
    name: "PikaBoo Coins",
    desc: "Buy extra swipes",
    color: "text-gold",
    bg: "bg-gold/10 border-gold/20",
  },
];

export default function PremiumSection() {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider">
        Go Premium
      </h3>
      <div className="bg-gradient-to-br from-primary/10 via-violet/5 to-gold/10 rounded-2xl p-4 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🐝</span>
          <h4 className="font-heading font-bold text-foreground">PikaBoo Premium</h4>
        </div>
        <div className="space-y-2 mb-4">
          {premiumFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.name} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${feature.bg} border flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold text-foreground">{feature.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Button className="w-full bg-gradient-to-r from-primary to-amber hover:opacity-90 text-primary-foreground font-heading font-semibold rounded-full">
          Unlock Premium
        </Button>
      </div>
    </div>
  );
}