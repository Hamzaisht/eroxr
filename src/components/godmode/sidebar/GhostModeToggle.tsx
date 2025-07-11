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
      "relative p-4 rounded-lg border transition-all duration-300 glass-panel-hover",
      isGhostMode 
        ? "glass-panel neon-pulse border-cyan-500/50" 
        : "bg-black/20 border-cyan-500/20"
    )}>
      {/* Pulsing glow effect when active */}
      {isGhostMode && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
      )}
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {isGhostMode ? (
              <EyeOff className="h-6 w-6 text-cyan-400 animate-pulse" />
            ) : (
              <Eye className="h-6 w-6 text-cyan-400/50" />
            )}
            {isGhostMode && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className={cn(
                "text-sm font-bold tracking-wide",
                isGhostMode ? "holographic-text" : "text-cyan-400/70"
              )}>
                👁 GHOST MODE
              </p>
              {isGhostMode && (
                <Badge className="text-xs px-2 py-0 bg-gradient-to-r from-cyan-500 to-purple-500 text-white animate-pulse neon-glow">
                  ACTIVE
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-cyan-400/70">
              {isGhostMode ? "🔒 Invisible surveillance active" : "Normal admin mode"}
            </p>
            
            {/* Session timer */}
            {isGhostMode && sessionTimeRemaining && (
              <div className="flex items-center gap-1 text-xs text-cyan-400">
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
        <div className="mt-3 p-2 bg-cyan-900/20 border border-cyan-500/30 rounded text-xs text-cyan-300">
          ⚠️ <strong>STEALTH MODE:</strong> All actions are logged. Users cannot see your activity.
        </div>
      )}
    </div>
  );
};