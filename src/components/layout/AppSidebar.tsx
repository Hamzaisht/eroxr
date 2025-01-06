import { MessageSquare, Settings, User, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/components/MainNav/Logo";
import { SidebarMenuItem } from "@/components/ui/sidebar/SidebarMenuItem";

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

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 z-50 h-screen w-64 bg-gradient-to-b from-luxury-dark to-luxury-dark/95 px-3 py-6 shadow-xl backdrop-blur-md"
    >
      <div className="flex h-full flex-col gap-8">
        {/* Logo Area */}
        <div className="flex items-center justify-center">
          <Logo />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <div className="mb-4 px-3 text-sm font-medium text-luxury-neutral/50">
            Menu
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <SidebarMenuItem
                key={item.title}
                variant={location.pathname === item.url ? "active" : "default"}
                onClick={() => navigate(item.url)}
              >
                <item.icon className="shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-luxury-neutral/70">
                    {item.description}
                  </span>
                </div>
              </SidebarMenuItem>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto border-t border-luxury-neutral/10 pt-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 rounded-lg bg-luxury-primary/5 p-3"
          >
            <div className="h-10 w-10 rounded-full bg-luxury-primary/20" />
            <div className="flex flex-col">
              <span className="font-medium text-luxury-neutral">User Name</span>
              <span className="text-xs text-luxury-neutral/70">View Profile</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}