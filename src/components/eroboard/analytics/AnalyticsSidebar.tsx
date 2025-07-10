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
      "bg-card/95 backdrop-blur-xl border-r border-border/50 transition-all duration-500 ease-out-expo relative overflow-hidden",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 opacity-50" />
      
      {/* Header */}
      <div className="relative p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="relative">
                  <Crown className="h-7 w-7 text-primary" />
                  <div className="absolute inset-0 animate-ping">
                    <Crown className="h-7 w-7 text-primary/50" />
                  </div>
                </div>
                EroBoard
              </h2>
              <p className="text-sm text-muted-foreground font-medium">Creator Analytics Hub</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-primary/10 rounded-xl"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative p-4">
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full group relative overflow-hidden transition-all duration-300 ease-out-expo",
                  collapsed ? "justify-center px-3 h-14" : "justify-start gap-4 h-16 p-4",
                  isActive 
                    ? "bg-gradient-to-r from-primary/15 to-accent/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" 
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
                onClick={() => onTabChange(item.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
                )}
                
                {/* Icon Container */}
                <div className={cn(
                  "relative transition-all duration-300",
                  isActive && "animate-breathe"
                )}>
                  <Icon className={cn(
                    "h-6 w-6 flex-shrink-0 transition-all duration-300",
                    isActive ? "text-primary" : "group-hover:text-primary"
                  )} />
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm animate-pulse" />
                  )}
                </div>
                
                {!collapsed && (
                  <div className="text-left flex-1 min-w-0">
                    <div className={cn(
                      "font-semibold text-sm transition-colors duration-300",
                      isActive ? "text-primary" : "group-hover:text-foreground"
                    )}>
                      {item.label}
                    </div>
                    <div className={cn(
                      "text-xs transition-colors duration-300 truncate",
                      isActive ? "text-primary/70" : "text-muted-foreground group-hover:text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                )}
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Enhancement */}
      {!collapsed && (
        <div className="absolute bottom-6 left-4 right-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <span className="text-sm font-semibold text-foreground">AI Insight</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your content performs <span className="text-primary font-medium">30% better</span> when posted between 8-10 PM
              </p>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full animate-shimmer" />
                </div>
                <span className="text-xs text-primary font-medium">75%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};