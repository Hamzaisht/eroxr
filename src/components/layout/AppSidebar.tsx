import { MessageSquare, Settings, User, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/components/MainNav/Logo";
import { SidebarMenuItem } from "@/components/ui/sidebar/SidebarMenuItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@supabase/auth-helpers-react";

const menuItems = [
  {
    title: "Dating Ads",
    url: "/categories",
    icon: Users,
    description: "Browse dating profiles",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    description: "View your profile",
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    description: "Check your messages",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Manage your account",
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 z-50 h-screen w-64 bg-gradient-to-b from-luxury-dark via-luxury-dark/95 to-luxury-dark border-r border-luxury-neutral/10"
    >
      <div className="flex h-full flex-col">
        {/* Logo Area */}
        <div className="flex items-center justify-center h-16 border-b border-luxury-neutral/10 bg-luxury-dark/50 backdrop-blur-sm">
          <Logo />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6">
          <div className="mb-4 px-3 text-sm font-medium text-luxury-neutral/50 uppercase tracking-wider">
            Menu
          </div>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <motion.li
                key={item.title}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <SidebarMenuItem
                  variant={location.pathname === item.url ? "active" : "default"}
                  onClick={() => navigate(item.url)}
                  className={`w-full ${
                    location.pathname === item.url
                      ? "bg-luxury-primary/10 text-luxury-primary"
                      : "hover:bg-luxury-neutral/5"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-luxury-neutral/70">
                      {item.description}
                    </span>
                  </div>
                </SidebarMenuItem>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto border-t border-luxury-neutral/10 p-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 rounded-lg bg-luxury-primary/5 p-3 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <Avatar className="h-10 w-10 border-2 border-luxury-primary/20">
              <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-luxury-primary/20">
                {session?.user?.email?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-luxury-neutral">
                {session?.user?.user_metadata?.username || "Guest"}
              </span>
              <span className="text-xs text-luxury-neutral/70">View Profile</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}