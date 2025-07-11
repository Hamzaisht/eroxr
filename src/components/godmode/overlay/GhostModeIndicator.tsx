import React, { useState, useEffect } from 'react';
import { Eye, Clock, Users, Activity, Shield } from 'lucide-react';
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
    <div className="fixed top-4 right-4 z-50">
      <Card className="glass-panel neon-pulse border-cyan-500/50 shadow-2xl backdrop-blur-sm p-4 bg-gradient-to-br from-black/90 to-cyan-900/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Eye className="h-6 w-6 text-purple-300 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="text-sm font-bold holographic-text tracking-wide">
              👁 GHOST MODE ACTIVE
            </h3>
            <p className="text-xs text-cyan-400">Invisible Surveillance</p>
          </div>
          <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white animate-pulse ml-auto neon-glow">
            LIVE
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          {/* Session timer */}
          <div className="flex items-center gap-2 text-purple-300">
            <Clock className="h-3 w-3" />
            <span>Session: {formatTimeRemaining(sessionTimeRemaining)}</span>
          </div>

          {/* Active surveillance count */}
          <div className="flex items-center gap-2 text-green-300">
            <Users className="h-3 w-3" />
            <span>Monitoring: {activeSurveillance.length} targets</span>
          </div>

          {/* Current time */}
          <div className="flex items-center gap-2 text-blue-300">
            <Activity className="h-3 w-3" />
            <span>Time: {currentTime.toLocaleTimeString()}</span>
          </div>

          {/* Security status */}
          <div className="flex items-center gap-2 text-yellow-300">
            <Shield className="h-3 w-3" />
            <span>Invisible to users</span>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mt-3 pt-3 border-t border-purple-500/30">
          <div className="grid grid-cols-2 gap-1 text-xs">
            <span className="text-green-400">✓ PPV Access</span>
            <span className="text-green-400">✓ Deleted Content</span>
            <span className="text-green-400">✓ Private Messages</span>
            <span className="text-green-400">✓ Stream Join</span>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-xs text-red-200">
          ⚠️ All actions logged for audit
        </div>
      </Card>
    </div>
  );
};