import React from 'react';
import { DashboardStats } from './DashboardStats';
import { RecentActivity } from './RecentActivity';
import { LiveStreams } from './LiveStreams';
import { SystemHealth } from './SystemHealth';
import { GhostModePanel } from '../surveillance/GhostModePanel';

export const GodmodeDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-8 border border-cyan-500/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <span className="text-2xl">👁</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Godmode Dashboard
            </h1>
            <p className="text-cyan-300/70 text-lg">Complete platform oversight and control</p>
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">System Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400 text-sm font-medium">Neural Network Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-purple-400 text-sm font-medium">Surveillance Ready</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* System Health */}
        <div>
          <SystemHealth />
        </div>
      </div>

      {/* Live Streams */}
      <LiveStreams />

      {/* Ghost Mode Panel */}
      <GhostModePanel />
    </div>
  );
};