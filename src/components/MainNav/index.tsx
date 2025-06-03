
import { SearchBar } from "./SearchBar";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const MainNav = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  useEffect(() => {
    // For demo purposes, use a random number for unread notifications
    setUnreadNotifications(Math.floor(Math.random() * 3));
    // In a real app, you'd query the backend for this user's notification count
  }, [session]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-dark/95 backdrop-blur-xl border-b border-luxury-primary/10">
      <div className="flex items-center justify-end h-16 px-4 md:px-6">
        {/* Platform-wide notification bell */}
        {session && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={() => navigate("/notifications")}
            className="relative mr-4"
          >
            <Bell className="h-5 w-5 text-luxury-primary" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-primary text-black text-xs rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Button>
        )}
        <div className="flex items-center gap-4">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
};
