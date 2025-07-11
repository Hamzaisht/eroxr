import React from 'react';
import { Eye, EyeOff, Clock, Shield, Zap, AlertTriangle, Sparkles } from 'lucide-react';
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
      "relative p-6 rounded-xl border transition-all duration-700 hover-scale",
      isGhostMode 
        ? "bg-gradient-to-br from-purple-900/40 via-slate-800/30 to-purple-950/40 border-purple-500/30 shadow-2xl shadow-purple-500/20" 
        : "bg-gradient-to-br from-slate-800/20 to-slate-900/30 border-slate-600/30 hover:border-purple-500/40"
    )}>
      {/* Animated background effects */}
      {isGhostMode && (
        <>
          {/* Primary glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-purple-500/10 animate-pulse" />
          {/* Sparkle effect */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute top-2 right-4 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
            <div className="absolute top-4 left-8 w-0.5 h-0.5 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-3 right-8 w-0.5 h-0.5 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          </div>
        </>
      )}
      
      <div className={cn(
        "relative transition-all duration-500",
        isGhostMode ? "animate-fade-in" : ""
      )}>
        {/* Header section with icon and status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Animated icon container */}
            <div className={cn(
              "relative p-3 rounded-full transition-all duration-500",
              isGhostMode 
                ? "bg-purple-500/20 shadow-lg shadow-purple-500/30" 
                : "bg-slate-700/30"
            )}>
              {isGhostMode ? (
                <EyeOff className={cn(
                  "h-6 w-6 text-purple-400 transition-all duration-300",
                  "animate-pulse"
                )} />
              ) : (
                <Eye className="h-6 w-6 text-slate-400 transition-all duration-300" />
              )}
              
              {/* Animated status indicator */}
              {isGhostMode && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
                  <div className="absolute top-0 w-3 h-3 bg-green-500 rounded-full" />
                </div>
              )}
            </div>
            
            {/* Title and status */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className={cn(
                  "text-lg font-bold transition-all duration-300",
                  isGhostMode 
                    ? "text-purple-300 animate-fade-in" 
                    : "text-slate-300"
                )}>
                  Ghost Mode
                </h3>
                {isGhostMode && (
                  <Badge className="animate-scale-in bg-purple-500/30 text-purple-200 border-purple-400/40 text-xs px-2 py-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    ACTIVE
                  </Badge>
                )}
              </div>
              
              <p className={cn(
                "text-sm transition-all duration-300",
                isGhostMode 
                  ? "text-purple-200/80" 
                  : "text-slate-400"
              )}>
                {isGhostMode ? "👻 Invisible surveillance mode" : "🔍 Standard admin access"}
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          <div className="flex items-center gap-3">
            {isLoading && (
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            )}
            
            <Switch
              checked={isGhostMode}
              onCheckedChange={toggleGhostMode}
              disabled={isLoading}
              className={cn(
                "transition-all duration-500 hover-scale",
                isGhostMode && "data-[state=checked]:bg-purple-500 shadow-lg shadow-purple-500/30"
              )}
            />
          </div>
        </div>

        {/* Session info and capabilities */}
        {isGhostMode && (
          <div className="space-y-3 animate-fade-in">
            {/* Session timer */}
            {sessionTimeRemaining && (
              <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300">
                  Session: {formatTimeRemaining(sessionTimeRemaining)}
                </span>
              </div>
            )}

            {/* Capabilities indicators */}
            <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-400 animate-pulse" />
                <span className="text-xs text-green-300">Invisible</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
                <span className="text-xs text-yellow-300">Full Access</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-blue-400 animate-pulse" />
                <span className="text-xs text-blue-300">Surveillance</span>
              </div>
            </div>

            {/* Warning message */}
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg animate-fade-in">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 animate-pulse" />
                <div className="text-xs text-orange-300">
                  <span className="font-bold">⚡ STEALTH MODE ACTIVE</span>
                  <br />
                  All actions are logged. You are invisible to users.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};