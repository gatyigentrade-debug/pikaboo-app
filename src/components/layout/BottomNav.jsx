import { Link, useLocation } from "react-router-dom";
import { Compass, Flame, Heart, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Flame, label: "Swipe" },
  { path: "/explore", icon: Compass, label: "Explore" },
  { path: "/matches", icon: Heart, label: "Matches" },
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav({ unreadMatches = 0, lastTabRoutes = {} }) {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none px-4"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="pointer-events-auto mx-auto max-w-lg flex items-center gap-1 rounded-full border border-gold/20 bg-background/80 backdrop-blur-2xl px-1.5 py-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.55)]">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path + "/"));
          const Icon = item.icon;
          const showBadge = item.path === "/chat" && unreadMatches > 0;
          const target = lastTabRoutes[item.path] || item.path;
          return (
            <Link
              key={item.path}
              to={target}
              aria-label={item.label}
              onClick={(e) => {
                if (isActive) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 min-w-[44px] min-h-[44px]"
            >
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 rounded-full bg-gold/15 border border-gold/40"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center gap-0.5">
                <span className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "text-gold scale-110" : "text-muted-foreground"
                    }`}
                  />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-gold text-black text-xs font-bold flex items-center justify-center">
                      {unreadMatches > 9 ? "9+" : unreadMatches}
                    </span>
                  )}
                </span>
                <span
                  className={`text-xs font-body transition-colors ${
                    isActive ? "text-gold font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}