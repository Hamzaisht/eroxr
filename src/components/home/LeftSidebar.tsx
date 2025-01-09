import { useSession } from "@supabase/auth-helpers-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { 
  Users, 
  User,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    icon: Users,
    label: "Dating Ads",
    path: "/categories",
    description: "Browse dating profiles"
  },
  {
    icon: User,
    label: "Profile",
    path: "/profile",
    description: "View your profile"
  },
  {
    icon: MessageSquare,
    label: "Messages",
    path: "/messages",
    description: "Check your messages"
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    description: "Manage your account"
  }
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
  const location = useLocation();
  const { toast } = useToast();

  if (!session) return null;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later",
      });
    }
  };

  return (
    <div className="w-72 h-full bg-luxury-dark/95 backdrop-blur-lg border-r border-luxury-neutral/5">
      <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div className="flex items-center justify-center h-16 border-b border-luxury-neutral/10">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
            Eroxr
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-1"
          >
            {menuItems.map((item) => (
              <motion.div key={item.path} variants={itemVariant}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group hover:bg-luxury-primary/10 ${
                    location.pathname === item.path 
                      ? "bg-luxury-primary/15 text-luxury-primary" 
                      : "text-luxury-neutral"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    location.pathname === item.path
                      ? "text-luxury-primary"
                      : "text-luxury-neutral/70 group-hover:text-luxury-primary"
                  }`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-luxury-neutral/60">{item.description}</span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Logout Button */}
            <motion.div variants={itemVariant}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group hover:bg-red-500/10 text-red-500"
              >
                <LogOut className="w-5 h-5 text-red-500/70 group-hover:text-red-500" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">Logout</span>
                  <span className="text-xs text-red-500/60">Sign out of your account</span>
                </div>
              </button>
            </motion.div>
          </motion.div>
        </ScrollArea>

        {/* User Profile Section */}
        <div className="mt-auto p-4 border-t border-luxury-neutral/10">
          <Link 
            to={`/profile/${session.user.id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-luxury-primary/10 transition-all"
          >
            <Avatar className="h-10 w-10 ring-2 ring-luxury-primary/20">
              <AvatarImage src={session.user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-luxury-primary/20">
                {session.user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-luxury-neutral">
                {session.user.user_metadata?.username || "Guest"}
              </span>
              <span className="text-xs text-luxury-neutral/60">
                View Profile
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};