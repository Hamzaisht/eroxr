import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileImage, 
  MessageSquare, 
  Video, 
  DollarSign, 
  Shield, 
  Flag,
  Eye,
  Settings,
  Activity,
  Search,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GhostModeToggle } from './GhostModeToggle';
import { useAdminSession } from '@/contexts/AdminSessionContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/godmode' },
  { icon: Users, label: 'Users', path: '/godmode/users' },
  { icon: FileImage, label: 'Content', path: '/godmode/content' },
  { icon: MessageSquare, label: 'Messages', path: '/godmode/messages' },
  { icon: Video, label: 'Streams', path: '/godmode/streams' },
  { icon: Shield, label: 'Verification', path: '/godmode/verification' },
  { icon: DollarSign, label: 'Payouts', path: '/godmode/payouts' },
  { icon: Flag, label: 'Flagged', path: '/godmode/flagged' },
  { icon: Search, label: 'Search', path: '/godmode/search' },
  { icon: Activity, label: 'Logs', path: '/godmode/logs' },
  { icon: Settings, label: 'Settings', path: '/godmode/settings' },
];

export const GodmodeSidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { adminUser, isGhostMode } = useAdminSession();

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-black/30 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50",
      isOpen ? "w-72" : "w-16"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Crown className="h-8 w-8 text-purple-400" />
            {isGhostMode && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
            )}
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-white">Godmode</h1>
              <p className="text-xs text-purple-300">{adminUser?.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Ghost Mode Toggle */}
      {isOpen && (
        <div className="p-4 border-b border-white/10">
          <GhostModeToggle />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                "hover:bg-white/10 hover:text-white",
                isActive 
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
                  : "text-gray-300"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status */}
      {isOpen && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>System Online</span>
          </div>
          {isGhostMode && (
            <div className="flex items-center gap-2 text-xs text-purple-400 mt-2">
              <Eye className="h-3 w-3" />
              <span>Ghost Mode Active</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};