import React, { useState, useEffect } from 'react';
import { Eye, Clock, Users, Activity, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAdminSession } from '@/contexts/AdminSessionContext';

export const GhostModeIndicator: React.FC = () => {
  const { isGhostMode, activeSurveillance = [], sessionTimeRemaining } = useAdminSession();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isGhostMode) return null;

  const formatTimeRemaining = (ms: number | null) => {
    if (!ms) return '0h 0m';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="fixed top-20 right-4 z-40 max-w-xs">
      <Card className="glass-panel subtle-pulse border border-white/10 shadow-2xl backdrop-blur-sm p-4 bg-gradient-to-br from-slate-900/95 to-slate-800/95 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Eye className="h-5 w-5 text-blue-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full status-indicator" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Ghost Mode Active
            </h3>
            <p className="text-xs text-slate-400">Invisible Surveillance</p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/30 ml-auto">
            LIVE
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          {/* Session timer */}
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="h-3 w-3" />
            <span>Session: {formatTimeRemaining(sessionTimeRemaining)}</span>
          </div>

          {/* Active surveillance count */}
          <div className="flex items-center gap-2 text-emerald-400">
            <Users className="h-3 w-3" />
            <span>Monitoring: {activeSurveillance.length} targets</span>
          </div>

          {/* Current time */}
          <div className="flex items-center gap-2 text-blue-400">
            <Activity className="h-3 w-3" />
            <span>Time: {currentTime.toLocaleTimeString()}</span>
          </div>

          {/* Security status */}
          <div className="flex items-center gap-2 text-purple-400">
            <Shield className="h-3 w-3" />
            <span>Invisible to users</span>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="grid grid-cols-2 gap-1 text-xs">
            <span className="text-emerald-400 flex items-center gap-1">
              <div className="w-1 h-1 bg-emerald-400 rounded-full" />
              PPV Access
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <div className="w-1 h-1 bg-emerald-400 rounded-full" />
              Deleted Content
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <div className="w-1 h-1 bg-emerald-400 rounded-full" />
              Private Messages
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <div className="w-1 h-1 bg-emerald-400 rounded-full" />
              Stream Join
            </span>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-400">
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            All actions logged for audit
          </span>
        </div>
      </Card>
    </div>
  );
};