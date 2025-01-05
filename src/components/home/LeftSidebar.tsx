import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { HomeIcon, Bell, MessageSquare, Bookmark, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const LeftSidebar = () => {
  const session = useSession();

  return (
    <aside className="w-64 border-r border-white/10 fixed left-0 top-16 bottom-0">
      <ScrollArea className="h-full py-6">
        <div className="px-6 space-y-6">
          <nav className="space-y-1">
            {[
              { icon: <HomeIcon className="w-5 h-5" />, label: "Home", path: "/home" },
              { icon: <Bell className="w-5 h-5" />, label: "Notifications", path: "/notifications" },
              { icon: <MessageSquare className="w-5 h-5" />, label: "Messages", path: "/messages" },
              { icon: <Bookmark className="w-5 h-5" />, label: "Saved", path: "/saved" },
              { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <Separator className="bg-white/10" />

          <div className="space-y-4">
            <h3 className="font-medium text-sm text-white/60">Trending Topics</h3>
            <div className="space-y-2">
              {["#Photography", "#DigitalArt", "#Music", "#Writing"].map((topic) => (
                <Button
                  key={topic}
                  variant="ghost"
                  className="w-full justify-start text-white/80 hover:bg-white/5"
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>

          {session && (
            <div className="pt-4">
              <Link 
                to={`/profile/${session.user.id}`} 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="flex flex-col">
                  <span className="font-medium text-white">Your Profile</span>
                  <span className="text-sm text-white/60">View profile</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};