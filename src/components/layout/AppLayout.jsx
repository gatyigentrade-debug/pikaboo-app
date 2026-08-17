import { useLocation, useNavigate, useParams } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useAppNotifications } from "@/hooks/useAppNotifications";
import ChatView from "@/components/matches/ChatView";
import Explore from "@/pages/Explore";
import Matches from "@/pages/Matches";
import Chat from "@/pages/Chat";
import Likes from "@/pages/Likes";
import Profile from "@/pages/Profile";

// Tabs that get keep-alive (visibility toggle instead of unmount)
const TABS = [
  { path: "/",         Component: Explore },
  { path: "/matches",  Component: Matches },
  { path: "/chat",     Component: Chat },
  { path: "/likes",    Component: Likes },
  { path: "/profile",  Component: Profile },
];

export default function AppLayout() {
  useAppNotifications();
  const [unreadMatches, setUnreadMatches] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const chatId = params.id;
  const chatMatch = chatId ? location.state?.match : null;
  // Track which tabs have been visited so we only mount them on first visit
  const [mounted, setMounted] = useState({ [location.pathname]: true });

  useEffect(() => {
    setMounted((prev) => ({ ...prev, [location.pathname]: true }));
    // For deep chat routes, ensure the chat tab is mounted underneath
    if (location.pathname.startsWith("/chat/")) {
      setMounted((prev) => ({ ...prev, "/chat": true }));
    }
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
    let unsubscribe = () => {};
    try {
      const unsub = base44.entities.Match.subscribe(() => { fetchUnreadCount(); });
      if (typeof unsub === "function") unsubscribe = unsub;
    } catch (e) {
      console.error("Realtime subscribe failed:", e);
    }
    return () => unsubscribe();
  }, []);

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-background font-body relative">
      {/* Campfire ambient glow */}
      <div className="fixed inset-0 pointer-events-none campfire-glow z-0" />

      {/* Keep-alive tab panels */}
      <main className="relative z-10 pb-20 max-w-lg mx-auto">
        {TABS.map(({ path, Component }) => {
          const isActive = currentPath === path || (path === "/chat" && currentPath.startsWith("/chat/"));
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

      {/* Deep-link ChatView overlay */}
      <AnimatePresence>
        {chatMatch && (
          <ChatView match={chatMatch} onBack={() => navigate(-1)} />
        )}
      </AnimatePresence>
    </div>
  );
}