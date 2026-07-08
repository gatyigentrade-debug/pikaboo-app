import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAppNotifications } from "@/hooks/useAppNotifications";
import Home from "@/pages/Home";
import Discover from "@/pages/Discover";
import Meetups from "@/pages/Meetups";
import Matches from "@/pages/Matches";
import Profile from "@/pages/Profile";

// Tabs that get keep-alive (visibility toggle instead of unmount)
const TABS = [
  { path: "/",         Component: Home },
  { path: "/discover", Component: Discover },
  { path: "/meetups",  Component: Meetups },
  { path: "/matches",  Component: Matches },
  { path: "/profile",  Component: Profile },
];

export default function AppLayout() {
  useAppNotifications();
  const [unreadMatches, setUnreadMatches] = useState(0);
  const location = useLocation();
  // Track which tabs have been visited so we only mount them on first visit
  const [mounted, setMounted] = useState({ [location.pathname]: true });

  useEffect(() => {
    setMounted((prev) => ({ ...prev, [location.pathname]: true }));
  }, [location.pathname]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const matches = await base44.entities.Match.filter({ unread_count: { $gt: 0 } });
        const totalUnread = matches.reduce((sum, match) => sum + match.unread_count, 0);
        setUnreadMatches(totalUnread);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
    const unsubscribe = base44.entities.Match.subscribe(() => { fetchUnreadCount(); });
    return unsubscribe;
  }, []);

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-background font-body relative">
      {/* Campfire ambient glow */}
      <div className="fixed inset-0 pointer-events-none campfire-glow z-0" />

      {/* Keep-alive tab panels */}
      <main className="relative z-10 pb-20 max-w-lg mx-auto">
        {TABS.map(({ path, Component }) => {
          const isActive = currentPath === path;
          if (!mounted[path]) return null;
          return (
            <div
              key={path}
              style={{ display: isActive ? "block" : "none" }}
              aria-hidden={!isActive}
            >
              <Component unreadMatches={unreadMatches} />
            </div>
          );
        })}
      </main>

      <BottomNav unreadMatches={unreadMatches} />
    </div>
  );
}