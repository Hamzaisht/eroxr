import { MessageSquare, Settings, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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

  return (
    <Sidebar className="border-r border-luxury-neutral/10 bg-luxury-dark/95 backdrop-blur supports-[backdrop-filter]:bg-luxury-dark/80">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-luxury-neutral/50">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className="group flex w-full items-center gap-3 rounded-lg p-3 text-luxury-neutral hover:bg-luxury-primary/10 hover:text-luxury-primary"
                  >
                    <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-luxury-neutral/70">
                        {item.description}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}