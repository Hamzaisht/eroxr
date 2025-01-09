import { useSession } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Compass, 
  ShoppingBag, 
  Users, 
  Heart, 
  MessageCircle, 
  Settings,
  PlayCircle,
  Bookmark,
  Clock,
  Star,
  Music
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: Home, label: "Feed", path: "/home" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
  { icon: Users, label: "Groups", path: "/groups" },
  { icon: PlayCircle, label: "Live", path: "/live" },
];

const libraryItems = [
  { icon: Heart, label: "My Favorites", path: "/favorites" },
  { icon: Bookmark, label: "Saved", path: "/saved" },
  { icon: Clock, label: "Recent", path: "/recent" },
  { icon: Star, label: "Featured", path: "/featured" },
  { icon: Music, label: "Playlists", path: "/playlists" },
];

export const LeftSidebar = () => {
  const session = useSession();

  if (!session) return null;

  return (
    <div className="sticky top-4 h-[calc(100vh-2rem)]">
      <div className="rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-6 shadow-lg backdrop-blur-lg h-full">
        <ScrollArea className="h-full pr-4">
          {/* User Profile Section */}
          <Link to={`/profile/${session.user.id}`} className="flex items-center gap-3 mb-8 group">
            <Avatar className="h-12 w-12 ring-2 ring-luxury-primary/20 transition-all group-hover:ring-luxury-primary/40">
              <AvatarImage src={session.user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-luxury-primary/20">
                {session.user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-luxury-neutral group-hover:text-luxury-primary transition-colors">
                {session.user.user_metadata?.username || "Anonymous"}
              </h3>
              <p className="text-sm text-luxury-neutral/60">View Profile</p>
            </div>
          </Link>

          {/* Main Menu */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-luxury-neutral/40 mb-3 px-3">MENU</h4>
              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start hover:bg-luxury-primary/10 hover:text-luxury-primary"
                    >
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Library Section */}
            <div>
              <h4 className="text-sm font-medium text-luxury-neutral/40 mb-3 px-3">LIBRARY</h4>
              <nav className="space-y-1">
                {libraryItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + menuItems.length) * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start hover:bg-luxury-primary/10 hover:text-luxury-primary"
                    >
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Settings */}
            <div className="pt-4 border-t border-luxury-neutral/10">
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start hover:bg-luxury-primary/10 hover:text-luxury-primary"
              >
                <Link to="/settings" className="flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};