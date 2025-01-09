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
  { icon: Home, label: "Feed", path: "/home", color: "text-luxury-primary" },
  { icon: Compass, label: "Explore", path: "/explore", color: "text-luxury-accent" },
  { icon: Video, label: "Shorts", path: "/shorts", color: "text-pink-500" },
  { icon: Users, label: "Groups", path: "/groups", color: "text-purple-500" },
  { icon: PlayCircle, label: "Live", path: "/live", color: "text-red-500" },
];

const libraryItems = [
  { icon: Heart, label: "My Favorites", path: "/favorites", color: "text-rose-500" },
  { icon: Bookmark, label: "Saved", path: "/saved", color: "text-blue-500" },
  { icon: Clock, label: "Recent", path: "/recent", color: "text-green-500" },
  { icon: Star, label: "Featured", path: "/featured", color: "text-yellow-500" },
  { icon: TrendingUp, label: "Trending", path: "/trending", color: "text-orange-500" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export const LeftSidebar = () => {
  const session = useSession();

  if (!session) return null;

  return (
    <div className="w-full h-full bg-luxury-dark/50 backdrop-blur-sm border-r border-luxury-neutral/10">
      <ScrollArea className="h-[calc(100vh-5rem)] px-4">
        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link 
            to={`/profile/${session.user.id}`} 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-luxury-primary/10 transition-all group"
          >
            <Avatar className="h-10 w-10 ring-2 ring-luxury-primary/20">
              <AvatarImage src={session.user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-luxury-primary/20">
                {session.user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-luxury-neutral group-hover:text-luxury-primary">
                {session.user.user_metadata?.username || "Anonymous"}
              </span>
              <span className="text-xs text-luxury-neutral/60">
                View Profile
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Main Menu */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {menuItems.map((menuItem) => (
            <motion.div key={menuItem.path} variants={itemVariant}>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-sm hover:bg-luxury-primary/10 hover:text-luxury-primary rounded-xl h-12"
              >
                <Link to={menuItem.path} className="flex items-center gap-3">
                  <menuItem.icon className={`h-5 w-5 ${menuItem.color}`} />
                  <span className="font-medium">{menuItem.label}</span>
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Library Section */}
        <div className="mt-8">
          <h4 className="text-xs font-medium text-luxury-neutral/40 px-2 mb-4 uppercase tracking-wider">
            Library
          </h4>
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {libraryItems.map((libraryItem) => (
              <motion.div key={libraryItem.path} variants={itemVariant}>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start text-sm hover:bg-luxury-primary/10 hover:text-luxury-primary rounded-xl h-12"
                >
                  <Link to={libraryItem.path} className="flex items-center gap-3">
                    <libraryItem.icon className={`h-5 w-5 ${libraryItem.color}`} />
                    <span className="font-medium">{libraryItem.label}</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
};