import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Video,
  Heart,
  FileText,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Crown,
  Eye
} from "lucide-react";

interface AnalyticsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    description: "Dashboard overview"
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: DollarSign,
    description: "Revenue & monetization"
  },
  {
    id: "content",
    label: "Content",
    icon: Video,
    description: "Performance analytics"
  },
  {
    id: "audience",
    label: "Audience",
    icon: Users,
    description: "Fans & engagement"
  },
  {
    id: "growth",
    label: "Growth",
    icon: TrendingUp,
    description: "Followers & reach"
  },
  {
    id: "streaming",
    label: "Streaming",
    icon: Eye,
    description: "Live performance"
  },
  {
    id: "insights",
    label: "AI Insights",
    icon: Zap,
    description: "Smart recommendations"
  },
  {
    id: "exports",
    label: "Reports",
    icon: Download,
    description: "Data exports"
  }
];

export const AnalyticsSidebar = ({ activeTab, onTabChange }: AnalyticsSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-gradient-to-b from-luxury-darker to-luxury-dark border-r border-luxury-neutral/10 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-luxury-neutral/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Crown className="h-6 w-6 text-luxury-primary" />
                EroBoard
              </h2>
              <p className="text-sm text-gray-400">Creator Analytics</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3 transition-all duration-200",
                  collapsed && "justify-center px-3",
                  isActive 
                    ? "bg-luxury-primary/20 text-luxury-primary border border-luxury-primary/30 shadow-lg shadow-luxury-primary/10" 
                    : "text-gray-300 hover:text-white hover:bg-luxury-neutral/10"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-luxury-primary")} />
                {!collapsed && (
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-luxury-primary/20 to-purple-500/20 p-4 rounded-lg border border-luxury-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-luxury-primary" />
              <span className="text-sm font-medium text-white">Pro Tip</span>
            </div>
            <p className="text-xs text-gray-300">
              Post between 8-10 PM for 30% higher engagement
            </p>
          </div>
        </div>
      )}
    </div>
  );
};