import React from 'react';
import { Eye, EyeOff, Clock, Shield, Zap } from 'lucide-react';
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
      "relative p-4 rounded-lg border transition-all duration-300",
      isGhostMode 
        ? "bg-gradient-to-r from-purple-900/30 to-red-900/30 border-purple-500/50 shadow-lg shadow-purple-500/20" 
        : "bg-black/20 border-white/10"
    )}>
      {/* Pulsing glow effect when active */}
      {isGhostMode && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-red-600/20 animate-pulse" />
      )}
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {isGhostMode ? (
              <EyeOff className="h-6 w-6 text-purple-400 animate-pulse" />
            ) : (
              <Eye className="h-6 w-6 text-gray-400" />
            )}
            {isGhostMode && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className={cn(
                "text-sm font-bold tracking-wide",
                isGhostMode ? "text-purple-300" : "text-gray-300"
              )}>
                👁 GHOST MODE
              </p>
              {isGhostMode && (
                <Badge variant="destructive" className="text-xs px-2 py-0 bg-red-600/80 animate-pulse">
                  ACTIVE
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-gray-500">
              {isGhostMode ? "🔒 Invisible surveillance active" : "Normal admin mode"}
            </p>
            
            {/* Session timer */}
            {isGhostMode && sessionTimeRemaining && (
              <div className="flex items-center gap-1 text-xs text-purple-400">
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
        <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-300">
          ⚠️ <strong>STEALTH MODE:</strong> All actions are logged. Users cannot see your activity.
        </div>
      )}
    </div>
  );
};