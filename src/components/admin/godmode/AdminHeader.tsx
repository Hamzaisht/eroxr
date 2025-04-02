
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Eye, 
  Flag, 
  AlertTriangle, 
  Users, 
  BadgeCheck, 
  DollarSign, 
  Settings, 
  FileText
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-mobile";

interface AdminHeaderProps {
  title: string;
  section?: string;
  actionButton?: React.ReactNode;
}

export const AdminHeader = ({ title, section = "Admin", actionButton }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const navItems = [
    { icon: Eye, label: "Surveillance", path: "/admin/platform/surveillance" },
    { icon: Flag, label: "Content Feed", path: "/admin/platform/content-feed" },
    { icon: AlertTriangle, label: "Moderation", path: "/admin/platform/moderation" },
    { icon: BadgeCheck, label: "Verification", path: "/admin/platform/verification" },
    { icon: DollarSign, label: "Payouts", path: "/admin/platform/payouts" },
    { icon: Settings, label: "Platform Control", path: "/admin/platform/control" },
    { icon: FileText, label: "Admin Logs", path: "/admin/platform/logs" },
  ];
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/platform">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>{section}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        {actionButton}
      </div>
      
      <h1 className="text-2xl font-bold">{title}</h1>
      
      {/* Quick Navigation Bar */}
      <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        <div className="flex space-x-2">
          {navItems.map((item) => (
            <TooltipProvider key={item.path}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size={isMobile ? "icon" : "default"}
                    className={`border-white/10 ${isMobile ? 'h-10 w-10 rounded-full' : ''}`}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4 mr-2'}`} />
                    {!isMobile && item.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};
