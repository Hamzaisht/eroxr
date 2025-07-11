import React from 'react';
import { Eye, EyeOff, Clock, Shield, Zap, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { cn } from '@/lib/utils';

export const GhostModeToggle: React.FC = () => {
  const { isGhostMode, toggleGhostMode, isLoading, sessionTimeRemaining } = useAdminSession();

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={cn(
      "relative p-6 rounded-xl border transition-all duration-500",
      isGhostMode 
        ? "bg-card/50 border-primary/20 shadow-lg shadow-primary/10" 
        : "bg-card/30 border-border hover:border-primary/30"
    )}>
      {/* Subtle glow effect when active */}
      {isGhostMode && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 animate-pulse" />
      )}
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {isGhostMode ? (
              <EyeOff className="h-6 w-6 text-primary" />
            ) : (
              <Eye className="h-6 w-6 text-muted-foreground" />
            )}
            {isGhostMode && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <p className={cn(
                "text-lg font-semibold",
                isGhostMode ? "text-primary" : "text-foreground"
              )}>
                Ghost Mode
              </p>
              {isGhostMode && (
                <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                  ACTIVE
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {isGhostMode ? "Invisible surveillance active" : "Normal admin mode"}
            </p>
            
            {/* Session timer */}
            {isGhostMode && sessionTimeRemaining && (
              <div className="flex items-center gap-2 text-xs text-primary mt-2">
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
                <Shield className="h-4 w-4 text-green-500" />
              </div>
              <div title="Full access enabled">
                <Zap className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          
          <Switch
            checked={isGhostMode}
            onCheckedChange={toggleGhostMode}
            disabled={isLoading}
            className={cn(
              "transition-all duration-300",
              isGhostMode && "data-[state=checked]:bg-primary"
            )}
          />
        </div>
      </div>

      {/* Warning message for Ghost Mode */}
      {isGhostMode && (
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs text-orange-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3 w-3" />
            <span><strong>STEALTH MODE:</strong> All actions are logged. Users cannot see your activity.</span>
          </div>
        </div>
      )}
    </div>
  );
};