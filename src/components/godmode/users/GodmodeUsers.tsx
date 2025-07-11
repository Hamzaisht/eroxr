import React from 'react';

export const GodmodeUsers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Manage users, permissions, and accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">User Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Users</span>
              <span className="text-white font-semibold">1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Active Users</span>
              <span className="text-green-400 font-semibold">956</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Suspended</span>
              <span className="text-red-400 font-semibold">12</span>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Signups</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-300">Last 24h: 23 users</div>
            <div className="text-sm text-gray-300">Last 7d: 156 users</div>
            <div className="text-sm text-gray-300">Last 30d: 678 users</div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded">
              View All Users
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded">
              Bulk Actions
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};