import { Outlet, useOutletContext } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function AppLayout() {
  const [unreadMatches, setUnreadMatches] = useState(0);

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

    // Subscribe to match changes
    const unsubscribe = base44.entities.Match.subscribe(() => {
      fetchUnreadCount();
    });

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-background font-body relative">
      {/* Campfire ambient glow at bottom */}
      <div className="fixed inset-0 pointer-events-none campfire-glow z-0" />
      
      {/* Main content */}
      <main className="relative z-10 pb-20 max-w-lg mx-auto">
        <Outlet context={{ unreadMatches }} />
      </main>
      
      <BottomNav unreadMatches={unreadMatches} />
    </div>
  );
}