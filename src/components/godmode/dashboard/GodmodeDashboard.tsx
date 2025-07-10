import React from 'react';
import { DashboardStats } from './DashboardStats';
import { RecentActivity } from './RecentActivity';
import { LiveStreams } from './LiveStreams';
import { SystemHealth } from './SystemHealth';

export const GodmodeDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Godmode Dashboard</h1>
        <p className="text-gray-400">Complete platform oversight and control</p>
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
    </div>
  );
};