import React from 'react';
import { Eye, EyeOff, Clock, Shield, Zap, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { cn } from '@/lib/utils';

export const GhostModeToggle: React.FC = () => {
  const { isGhostMode, toggleGhostMode, isLoading } = useAdminSession();

  // Mock session time for demo - in real implementation, get from useGhostMode
  const sessionTimeRemaining = isGhostMode ? 3.5 * 60 * 60 * 1000 : null; // 3.5 hours remaining

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={cn(
      "relative p-6 rounded-xl border transition-all duration-500 glass-panel-hover",
      isGhostMode 
        ? "glass-panel subtle-pulse premium-border" 
        : "bg-slate-900/20 border-white/5"
    )}>
      {/* Elegant glow effect when active */}
      {isGhostMode && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      )}
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {isGhostMode ? (
              <EyeOff className="h-6 w-6 text-blue-400" />
            ) : (
              <Eye className="h-6 w-6 text-slate-400" />
            )}
            {isGhostMode && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full status-indicator" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <p className={cn(
                "text-lg font-bold tracking-wide",
                isGhostMode ? "premium-text" : "text-slate-300"
              )}>
                Ghost Mode
              </p>
              {isGhostMode && (
                <Badge className="text-xs px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/30">
                  ACTIVE
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-slate-400">
              {isGhostMode ? "Invisible surveillance active" : "Normal admin mode"}
            </p>
            
            {/* Session timer */}
            {isGhostMode && sessionTimeRemaining && (
              <div className="flex items-center gap-2 text-xs text-blue-400 mt-2">
                <Clock className="h-3 w-3" />
                <span>Session: {formatTimeRemaining(sessionTimeRemaining)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Ghost Mode capabilities indicators */}
          {isGhostMode && (
            <div className="flex items-center gap-1">
              <div title="Invisible to users">
                <Shield className="h-4 w-4 text-green-400" />
              </div>
              <div title="Full access enabled">
                <Zap className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          )}
          
          <Switch
            checked={isGhostMode}
            onCheckedChange={toggleGhostMode}
            disabled={isLoading}
            className={cn(
              "transition-all duration-300",
              isGhostMode 
                ? "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-red-600" 
                : "data-[state=unchecked]:bg-gray-600"
            )}
          />
        </div>
      </div>

      {/* Warning message for Ghost Mode */}
      {isGhostMode && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3 w-3" />
            <span><strong>STEALTH MODE:</strong> All actions are logged. Users cannot see your activity.</span>
          </div>
        </div>
      )}
    </div>
  );
};