import { Camera, Settings, Shield } from "lucide-react";

export default function ProfileHeader({ profile }) {
  return (
    <div className="relative">
      {/* Cover gradient */}
      <div className="h-40 bg-gradient-to-br from-primary/30 via-violet/20 to-background rounded-b-3xl" />

      {/* Avatar */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-4 border-background overflow-hidden glow-orange">
            <img
              src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"}
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Camera className="w-4 h-4 text-primary-foreground" />
          </button>
          {profile?.is_verified && (
            <div className="absolute top-0 right-0 w-7 h-7 rounded-full bg-green-500/20 border-2 border-background flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-green-400" />
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-card/50 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground">
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
}