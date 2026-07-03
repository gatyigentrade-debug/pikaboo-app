import { Link, useLocation } from "react-router-dom";
import { Home, Compass, MessageCircle, User, Flame } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/discover", icon: Compass, label: "Discover" },
  { path: "/meetups", icon: Flame, label: "Braais" },
  { path: "/matches", icon: MessageCircle, label: "Matches" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav({ unreadMatches = 0 }) {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const showBadge = item.path === "/matches" && unreadMatches > 0;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1.5"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary glow-orange"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {showBadge && (
                  <div className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center glow-orange">
                    {unreadMatches > 9 ? "9+" : unreadMatches}
                  </div>
                )}
              </div>
              <span
                className={`text-[11px] font-body transition-colors ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iPhone */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}