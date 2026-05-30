import { MapPin, Users } from "lucide-react";

const hotspots = [
  { name: "Maboneng Market", type: "market", x: 35, y: 30 },
  { name: "Table Mountain Trail", type: "hike", x: 60, y: 55 },
  { name: "Shisanyama Soweto", type: "shebeen", x: 25, y: 60 },
  { name: "V&A Waterfront", type: "mall", x: 70, y: 40 },
  { name: "Kruger Gate", type: "hike", x: 80, y: 25 },
];

export default function NearbyMap() {
  return (
    <div className="relative w-full h-56 rounded-2xl bg-secondary overflow-hidden border border-border/50">
      {/* Dark map texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary opacity-80" />
      
      {/* Grid lines for map feel */}
      <div className="absolute inset-0 opacity-10">
        {[20, 40, 60, 80].map((p) => (
          <div key={`h-${p}`}>
            <div className="absolute left-0 right-0 border-t border-muted-foreground" style={{ top: `${p}%` }} />
            <div className="absolute top-0 bottom-0 border-l border-muted-foreground" style={{ left: `${p}%` }} />
          </div>
        ))}
      </div>

      {/* Hotspot pins */}
      {hotspots.map((spot, i) => (
        <div
          key={i}
          className="absolute group cursor-pointer"
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
        >
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <div className="absolute -inset-2 rounded-full bg-primary/20 animate-ping" />
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-body text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-border/50">
            {spot.name}
          </div>
        </div>
      ))}

      {/* Center marker (you) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 rounded-full bg-violet border-2 border-white glow-violet" />
        <div className="absolute -inset-3 rounded-full border-2 border-violet/30 animate-ping" />
      </div>

      {/* Label */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-body text-foreground">Nearby Hotspots</span>
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
        <Users className="w-3.5 h-3.5 text-violet" />
        <span className="text-xs font-body text-muted-foreground">12 people near you</span>
      </div>
    </div>
  );
}