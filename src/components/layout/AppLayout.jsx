import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background font-body relative">
      {/* Campfire ambient glow at bottom */}
      <div className="fixed inset-0 pointer-events-none campfire-glow z-0" />
      
      {/* Main content */}
      <main className="relative z-10 pb-20 max-w-lg mx-auto">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
}