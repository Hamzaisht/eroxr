import { useSession } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Compass, 
  Users, 
  Heart, 
  MessageCircle, 
  Settings,
  PlayCircle,
  Bookmark,
  Clock,
  Star,
  Music,
  Menu,
  Video,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: Home, label: "Feed", path: "/home" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: Video, label: "Shorts", path: "/shorts" },
  { icon: Users, label: "Groups", path: "/groups" },
  { icon: PlayCircle, label: "Live", path: "/live" },
];

const libraryItems = [
  { icon: Heart, label: "My Favorites", path: "/favorites" },
  { icon: Bookmark, label: "Saved", path: "/saved" },
  { icon: Clock, label: "Recent", path: "/recent" },
  { icon: Star, label: "Featured", path: "/featured" },
  { icon: TrendingUp, label: "Trending", path: "/trending" },
];

export const LeftSidebar = () => {
  const session = useSession();

  if (!session) return null;

  return (
    <div className="w-full">
      <ScrollArea className="h-[calc(100vh-5rem)] pr-4">
        {/* User Profile Section */}
        <Link to={`/profile/${session.user.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-luxury-primary/10 transition-all group">
          <Avatar className="h-8 w-8 ring-2 ring-luxury-primary/20">
            <AvatarImage src={session.user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-luxury-primary/20">
              {session.user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-luxury-neutral group-hover:text-luxury-primary">
            {session.user.user_metadata?.username || "Anonymous"}
          </span>
        </Link>

        {/* Main Menu */}
        <nav className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              asChild
              className="w-full justify-start text-sm hover:bg-luxury-primary/10 hover:text-luxury-primary"
            >
              <Link to={item.path} className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>

        {/* Library Section */}
        <div className="mt-6">
          <h4 className="text-xs font-medium text-luxury-neutral/40 px-2 mb-2">LIBRARY</h4>
          <nav className="space-y-1">
            {libraryItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                asChild
                className="w-full justify-start text-sm hover:bg-luxury-primary/10 hover:text-luxury-primary"
              >
                <Link to={item.path} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
};