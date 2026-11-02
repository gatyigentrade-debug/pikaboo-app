import { Link, useLocation } from "react-router-dom";
import { Compass, Flame, Heart, HeartHandshake, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Flame, label: "Discover" },
  { path: "/likes", icon: Heart, label: "Likes" },
  { path: "/matches", icon: HeartHandshake, label: "Matches" },
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/explore", icon: Compass, label: "Explore" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav({ unreadMatches = 0, lastTabRoutes = {}, hidden = false }) {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none px-3"
      style={{
        paddingBottom: "calc(0.6rem + env(safe-area-inset-bottom))",
        transform: hidden ? "translateY(140%)" : "translateY(0)",
        transition: "transform 220ms ease",
      }}
    >
      <div
        className="mx-auto max-w-md flex items-center justify-between gap-1 rounded-full border border-gold/20 bg-background/75 backdrop-blur-2xl px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
        style={{ pointerEvents: hidden ? "none" : "auto" }}
      >
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
              title={item.label}
              aria-current={isActive ? "page" : undefined}
              onClick={(e) => {
                if (isActive) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="relative flex flex-1 items-center justify-center min-w-[44px] min-h-[44px] rounded-full"
            >
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 rounded-full bg-gold/15 border border-gold/40"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">
                <span className="relative inline-flex">
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors duration-200 ${
                      isActive ? "text-gold" : "text-muted-foreground"
                    }`}
                  />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center border border-background">
                      {unreadMatches > 9 ? "9+" : unreadMatches}
                    </span>
                  )}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}